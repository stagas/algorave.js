
var fns = {};
var bpm = 60;
var beatTime;

clock();

function clock() {
  beatTime = 1 / (bpm / 60);
}

self.onmessage = function onmessage(e) {
  var params = e.data;
  var procedure = procs[params.procedureName]
  var error, result;
  try {
    result = procedure.apply(null, params.args);
  } catch(e) {
    error = e;
    console.error(e.stack);
  }
  if (result) {
    console.log('result of', params.procedureName, result);
    var tx = Object.keys(result)
      .map(function(key) { return result[key] })
      .filter(function(b) { return typeof b === 'object' })
      .reduce(function(p,n) { return p.concat(n[0], n[1]) }, []);
    result.id = params.id;
    result.timestamp = params.timestamp;
    self.postMessage(result, tx.map(function(b) { return b.buffer }));
  }
};

var procs = {};

procs.setup = function(opts) {
  console.log('setup', opts);
  self.sampleRate = opts.sampleRate;
  console.log('sample rate', sampleRate);
  importScripts('babel.js', 'studio.js');
  return true;
}

procs.compile = function(js) {
  var code = Babel.transform(js, { presets: ['es2015'] }).code;
  console.log('compiling');
  var buffers = {};

  var mod = { exports: {} };
  var fn = new Function('module', 'exports', 'require', code);
  fn(mod, mod.exports);
  console.log('module load ok');

  if ('bpm' in mod.exports) {
    console.log('set bpm:', mod.exports.bpm);
    bpm = mod.exports.bpm;
    self.postMessage(bpm);
    clock();
  }

  for (var key in mod.exports) {
    if ('function' === typeof mod.exports[key]) {
      if (mod.exports[key].toString() === fns[key]) continue;
      console.log('compile:', key);
      fns[key] = mod.exports[key].toString();
      buffers[key] = createBankBuffers(mod.exports[key]);
    } else if (Array.isArray(mod.exports[key])) {
      if (mod.exports[key][1].toString() === fns[key]) continue;
      console.log('compile:', key);
      fns[key] = mod.exports[key][1].toString();
      buffers[key] = createBankBuffers(mod.exports[key][1], mod.exports[key][0])
    }
  }

  return buffers;
};

function createBankBuffers(fn, multiplier) {
  multiplier = multiplier || 4;

  var beatFrames = Math.floor(sampleRate * beatTime);
  var blockFrames = Math.floor(beatFrames * multiplier);

  var bankBuffers = [
    [new Float32Array(blockFrames), new Float32Array(blockFrames)],
    [new Float32Array(blockFrames), new Float32Array(blockFrames)],
    [new Float32Array(blockFrames), new Float32Array(blockFrames)],
    [new Float32Array(blockFrames), new Float32Array(blockFrames)],
  ];

  var sample = {};

  for (var i = 0; i < blockFrames; i++) {
    sample = fn(1 + i / beatFrames, i);
    for (var b = 0; b < bankBuffers.length; b++) {
      var buffer = bankBuffers[b];
      var L = buffer[0];
      var R = buffer[1];
      L[i] = R[i] = normalize(sample[b]);
    }
  }

  bankBuffers.multiplier = multiplier;

  return bankBuffers;
}

function normalize(number) {
  return number === Infinity || number === -Infinity || isNaN(number) ? 0 : number;
}
