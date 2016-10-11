(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.algorave = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

/**
 * Provides a default map for event.key in keyboard events
 */
(function (global) {
  "use strict";

  var defMap = {
    13: 'Enter',
    27: 'Escape',

    33: 'PageUp',
    34: 'PageDown',

    37: 'ArrowLeft',
    38: 'ArrowUp',
    39: 'ArrowRight',
    40: 'ArrowDown'
  },


  // Other printable characters
  fcc = [32],
      keyManager = global.keyManager = Object.create(Object, {
    map: {
      get: function get() {
        return map;
      },
      set: function set(o) {
        map = o;
      }
    }
  }),
      prop = { get: function get() {
      var code = this.which;

      return map[code] || 'Unidentified';
    } },
      map = Object.create(defMap);

  // Numpad
  for (var i = 0; i <= 9; i++) {
    defMap[i + 96] = String(i);
  } // F keys
  for (var i = 1; i < 25; i++) {
    defMap[i + 111] = 'F' + i;
  } // Printable characters
  for (var i = 48; i < 91; i++) {
    defMap[i] = String.fromCharCode(i);
  }if (global.KeyboardEvent) Object.defineProperty(global.KeyboardEvent.prototype, 'key', prop);

  if (global.KeyEvent) Object.defineProperty(global.KeyEvent.prototype, 'key', prop);
})(window);

function PadKey(char) {
  this.el = document.createElement('div');
  this.el.className = 'key key-' + char;
  this.label = document.createElement('div');
  this.label.textContent = char;
  this.label.className = 'key-label';
  this.el.appendChild(this.label);
  this.charCode = char.charCodeAt(0);
  this.name = char;
  this.turnOff();
}

PadKey.prototype.turnOn = function () {
  this.el.classList.add('active');
  this.active = true;
};

PadKey.prototype.turnOff = function () {
  this.el.classList.remove('active');
  this.active = false;
};

PadKey.prototype.toggle = function () {
  if (this.active) {
    this.turnOff();
  } else {
    this.turnOn();
  }
};

function Bank(name) {
  this.name = name;
  this.bank = null;
  this.prevBank = null;
}

function SoundKey(char) {
  PadKey.call(this, char);
}

SoundKey.prototype.__proto__ = PadKey.prototype;

SoundKey.prototype.setBank = function (bank) {
  if (this.bank) this.el.classList.remove('bank-' + this.bank.name);
  this.prevBank = this.bank;
  this.bank = bank;
  this.el.classList.add('bank-' + this.bank.name);
};

var keyboard = ['1234567890'.split(''), 'qwertyuiop'.split(''), 'asdfghjkl'.split(''), 'zxcvbnm'.split('')];

var sounds = {};
var banks = [];

var allKeys = keyboard.reduce(function (p, n) {
  return p.concat(n);
});

var containerElement = document.createElement('div');
containerElement.className = 'container';
document.body.appendChild(containerElement);

var editorElement = document.createElement('div');
editorElement.className = 'editor';

var jazzElement = document.createElement('div');
jazzElement.className = 'jazz';

var jazzOptions = {
  theme: 'redbliss',
  font_size: '9pt'
};
var jazz = new Jazz(jazzOptions);

jazz.set(localStorage.text || 'let { sin, Sin, Saw, Tri, Sqr, Chord, Chords, softClip:clip, note, envelope, Korg35LPF, DiodeFilter } = studio;\n\n// patches: k l m o p a s d x\n\nexport let bpm = 100;\nlet progr = [\'Fmaj7\',\'Bmaj9\',\'D9\',\'G#min7\'].map(Chords);\nlet progr_2 = [\'Cmin\',\'D#min\',\'Fmin\',\'Amin\'].map(Chords);\n\nfunction cfg(target, obj) {\n  if (!obj) obj = target;\n  for (var k in obj) {\n    var val = obj[k];\n    var _k = \'_\' + k;\n    target[_k] = val;\n    target[k] = Setter(_k);\n  }\n  return target;\n};\n\nfunction Setter(_k){\n  return function(val){\n    this[_k] = val;\n    return this;\n  };\n}\n\nfunction Bassline(){\n  if (!(this instanceof Bassline)) return new Bassline();\n\n  this.osc = Saw(512);\n  this.filter = DiodeFilter();\n\n  cfg(this, {\n    seq: [110, 220],\n    hpf: .0087,\n    cut: .5,\n    res: .7,\n    lfo: .66,\n    lfo2: .12,\n    pre: 0.32,\n    clip: 30.3\n  });\n}\n\nBassline.prototype.play = function(t, speed){\n  speed = speed || 1/16;\n\n  var lfo = sin(t, this._lfo);\n  var lfo2 = sin(t, this._lfo2);\n\n  var n = slide(t, speed, this._seq, 14);\n  var synth_osc = this.osc(n);\n  var synth = arp(t, speed, synth_osc, 24, .99);\n\n  synth = this.filter\n    .cut(\n      (0.001 +\n      ((lfo * 0.28 + 1) / 2) *\n      (0.538 + lfo2 * 0.35)) * this._cut\n    )\n    .hpf(this._hpf)\n    .res(this._res)\n    .run(synth * this._pre)\n    ;\n\n  synth = clip(synth * this._clip);\n\n  return synth;\n};\n\nfunction slide(t, measure, seq, speed){\n  var pos = (t / measure / 2) % seq.length;\n  var now = pos | 0;\n  var next = now + 1;\n  var alpha = pos - now;\n  if (next == seq.length) next = 1;\n  return seq[now] + ((seq[next] - seq[now]) * Math.pow(alpha, speed));\n}\n\nfunction arp(t, measure, x, y, z) {\n  var ts = t / 4 % measure;\n  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z);\n}\n\n\nvar bass_a0 = new Bassline();\nvar bass_a1 = new Bassline();\nvar bass_a2 = new Bassline();\nbass_a0.seq(progr[0].map(note).map(n=>n*4)).cut(.15).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a1.seq(progr[1].map(note).map(n=>n*4)).cut(.18).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a2.seq(progr[2].map(note).map(n=>n*4)).cut(.25).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\n\nexport let a = [4, function bass_a(t) {\n  var vol = .4;\n  return {\n    0: bass_a0.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    1: bass_a1.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    2: bass_a2.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n  };\n}];\n\n\n\nvar bass_d0 = new Bassline();\nvar bass_d1 = new Bassline();\nvar bass_d2 = new Bassline();\nbass_d0.seq(progr_2[0].map(note).map(n=>n*4)).cut(.15).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d1.seq(progr_2[1].map(note).map(n=>n*4)).cut(.18).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d2.seq(progr_2[2].map(note).map(n=>n*4)).cut(.25).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\n\nexport let d = [4, function bass_d(t) {\n  var vol = .7;\n  return {\n    0: bass_d0.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    1: bass_d1.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    2: bass_d2.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n  };\n}];\n\n\nexport let k = [4, function kick(t) {\n  var vol = .6;\n  return {\n    0: arp(t, 1/4, 50, 30, 8) * vol,\n    1: arp(t, 1/4, 60, 30, 8) * vol,\n    2: arp(t, 1/4, 40, 30, 8) * vol,\n  };\n}];\n\nexport let l = [4, function hihat(t) {\n  var vol = .1;\n  return {\n    0: arp(t+1/2, 1/4, Math.random() * 5550, 1600, 350) * vol,\n    1: arp(t+1/2, 1/4, Math.random() * 5550, 2600, 350) * vol,\n    2: arp(t+1/2, 1/4, Math.random() * 5550, 3600, 350) * vol,\n  };\n}];\n\nvar synth_osc_0 = Tri(128, true);\nvar synth_osc_1 = Tri(128, true);\nvar synth_osc_2 = Tri(128, true);\nexport let o = [4, function synth(t) {\n  var vol = .3;\n  var out_0 = synth_osc_0(note([\'d\',\'f\'][(t%2)|0])) * envelope(t+1/3, 1/4, 50, 4) * vol;\n  var out_1 = synth_osc_1(note([\'b\',\'g#\',\'f\'][(t%3)|0])) * envelope(t+1/3, 1/4, 50, 4) * vol;\n  var out_2 = synth_osc_2(note([\'f\',\'f5\',\'d\',\'g#\'][(t%4)|0])) * envelope(t+1/3, 1/4, 50, 4) * vol;\n  return {\n    0: out_0,\n    1: out_1,\n    2: out_2,\n  };\n}];\n\nvar pad_osc_0 = Chord(Saw, 128, true);\nvar pad_osc_1 = Chord(Saw, 128, true);\nvar pad_osc_2 = Chord(Saw, 128, true);\n\nvar filter_pad_0 = Korg35LPF();\nvar filter_pad_1 = Korg35LPF();\nvar filter_pad_2 = Korg35LPF();\nfilter_pad_0.cut(500).res(2.1).sat(2.1);\nfilter_pad_1.cut(500).res(2.1).sat(2.1);\nfilter_pad_2.cut(500).res(2.1).sat(2.1);\n\nexport let p = [4, function pad(t) {\n  var vol = .3;\n  var c = progr[t%4|0];\n  var out_0 = pad_osc_0(c.map(note).map(n=>n*2)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_1 = pad_osc_1(c.map(note).map(n=>n*4)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_2 = pad_osc_2(c.map(note).map(n=>n*8)) * envelope(t, 1/4, 5, 4) * vol;\n  return {\n    0: filter_pad_0.run(out_0),\n    1: filter_pad_1.run(out_1),\n    2: filter_pad_2.run(out_2),\n  };\n}];\n\nvar pad_osc_m0 = Chord(Sqr, 128, true);\nvar pad_osc_m1 = Chord(Sqr, 128, true);\nvar pad_osc_m2 = Chord(Sqr, 128, true);\n\nvar filter_pad_m0 = Korg35LPF();\nvar filter_pad_m1 = Korg35LPF();\nvar filter_pad_m2 = Korg35LPF();\nfilter_pad_m0.cut(500).res(1.1).sat(2.1);\nfilter_pad_m1.cut(500).res(1.1).sat(2.1);\nfilter_pad_m2.cut(500).res(1.1).sat(2.1);\n\nvar lfo_m = Sin();\n\nexport let m = [4, function pad(t) {\n  var vol = .5;\n  var c = progr_2[(t*4)%3|0];\n  var out_0 = pad_osc_m0(c.map(note).map(n=>n*4)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_1 = pad_osc_m1(c.map(note).map(n=>n*6)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_2 = pad_osc_m2(c.map(note).map(n=>n*8)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  return {\n    0: filter_pad_m0.run(out_0),\n    1: filter_pad_m1.run(out_1),\n    2: filter_pad_m2.run(out_2),\n  };\n}];\n\nvar chip_osc_0 = Tri(10, false);\nvar chip_osc_1 = Tri(10, false);\nvar chip_osc_2 = Tri(10, false);\n\nexport let s = [8, function chip(t) {\n  var c = note(progr[0][t%progr[0].length|0])*8;\n  return {\n    0: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    1: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    2: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n  }\n}];\n\nvar chip_osc_x0 = Tri(10, true);\nvar chip_osc_x1 = Tri(10, true);\nvar chip_osc_x2 = Tri(10, true);\n\nexport let x = [8, function chip(t) {\n  var c = note(progr_2[0][t%progr_2[0].length|0])*8;\n  var vol = .5;\n  return {\n    0: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    1: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    2: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n  }\n}];\n\n', 'dsp.js');

editorElement.appendChild(jazzElement);
containerElement.appendChild(editorElement);
jazz.use(jazzElement);

var keyboardContainerElement = document.createElement('div');
keyboardContainerElement.className = 'keyboard-container';

var keyboardElement = document.createElement('div');
keyboardElement.className = 'keyboard';

var filenameElement = document.createElement('div');
filenameElement.className = 'filename';

editorElement.appendChild(filenameElement);

for (var i = 0; i < keyboard.length; i++) {
  var row = keyboard[i];
  var rowElement = document.createElement('div');
  rowElement.className = 'row row-' + i;
  for (var k = 0; k < row.length; k++) {
    var char = row[k];
    var key;
    key = new SoundKey(char);
    sounds[key.charCode] = key;
    rowElement.appendChild(key.el);
    key.el.onclick = key.el.onmouseup = key.el.onmousedown = key.label.onmousedown = key.label.ontouchstart = function (e) {
      e.preventDefault();
      return false;
    };
  }
  keyboardElement.appendChild(rowElement);
}

var lastTouchKey = null;
var debounceLastTouchKey;

keyboardElement.ontouchstart = keyboardElement.ontouchmove = keyboardElement.ontouchenter = function handler(e) {
  e.stopPropagation();
  e.preventDefault();
  if (!e.touches) {
    e.touches = [{ touch: [e] }];
    return;
  }
  for (var i = 0; i < e.touches.length; i++) {
    var touch = e.touches[i];
    for (var char in sounds) {
      var key = sounds[char];
      if (touch.clientX > key.pos.left && touch.clientX <= key.pos.left + key.pos.width && touch.clientY > key.pos.top && touch.clientY <= key.pos.top + key.pos.height && lastTouchKey !== key) {
        nextBank(key);
        lastTouchKey = key;
      }
    }
  }
};

keyboardElement.ontouchstart = function handler(e) {
  if (!e.touches) {
    e.touches = [{ touch: [e] }];
    return;
  }
  lastTouchKey = null;
  for (var i = 0; i < e.touches.length; i++) {
    var touch = e.touches[i];
    for (var char in sounds) {
      var key = sounds[char];
      if (touch.clientX > key.pos.left && touch.clientX <= key.pos.left + key.pos.width && touch.clientY > key.pos.top && touch.clientY <= key.pos.top + key.pos.height && lastTouchKey !== key) {
        nextBank(key);
        lastTouchKey = key;
      }
    }
  }
};

keyboardContainerElement.appendChild(keyboardElement);
containerElement.appendChild(keyboardContainerElement);

var elements = {
  'editor': editorElement,
  'keyboard': keyboardElement
};
var focus = 'keyboard';
var other = {
  'editor': 'keyboard',
  'keyboard': 'editor'
};

elements[focus].classList.add('focus');

jazz.blur();

jazz.input.text.el.style.height = '50%';

jazz.on('focus', function () {
  elements[focus].classList.remove('focus');
  focus = 'editor';
  elements[focus].classList.add('focus');
});

jazz.on('blur', function () {
  elements[focus].classList.remove('focus');
  focus = 'keyboard';
  elements[focus].classList.add('focus');
});

// });

document.body.onkeyup = function (e) {
  if (e.key === 'Shift') {
    state.triggerBank = false;
  }
};

document.body.onkeydown = function (e) {
  if (e.key.length > 1) {
    if (e.key === 'Escape') togglePanel();
    if (e.key === 'Tab') {
      if (e.shiftKey) togglePanel();
      return;
    }
    return;
  }
  if (focus === 'editor') return;
  var char = e.key.toLowerCase();
  if (char === char.toUpperCase()) {
    if (char === '!') char = '1';else if (char === '@') char = '2';else if (char === '#') char = '3';else if (char === '$') char = '4';else if (char === '%') char = '5';else if (char === '^') char = '6';else if (char === '&') char = '7';else if (char === '*') char = '8';else if (char === '(') char = '9';else if (char === ')') char = '0';
  }
  var charCode = char.toLowerCase().charCodeAt(0);
  var key = sounds[charCode];
  if (e.shiftKey) {
    key.turnOff();
  } else {
    nextBank(key);
  }
};

for (var i = 0; i < 3; i++) {
  banks.push(new Bank(i));
}

function getKeysPositions() {
  for (var char in sounds) {
    var key = sounds[char];
    key.pos = key.el.getBoundingClientRect();
  }
}

var prevHeight = 0;

getKeysPositions();

window.onscroll = function (e) {
  e.preventDefault();
  return false;
};

window.onresize = function (e) {
  getKeysPositions();
  if (prevHeight && prevHeight < document.body.clientHeight) {
    jazz.blur();
  }
  prevHeight = document.body.clientHeight;
};

var state = {
  activeBank: banks[0],
  triggerBank: false
};

for (var key in sounds) {
  sounds[key].setBank(state.activeBank);
}

function nextBank(key) {
  var bank;

  if (!key.active) {
    bank = banks[0];
  } else {
    var nextBankIndex = +key.bank.name + 1;
    bank = banks[nextBankIndex % (banks.length + 1)];
  }

  if (bank) {
    state.activeBank = bank;
    key.setBank(state.activeBank);
    key.turnOn();
  } else {
    key.turnOff();
  }

  alterState(key);
}

var playing = {};

var AC = window.webkitAudioContext || window.AudioContext;
var audio = new AC();
window.sampleRate = audio.sampleRate;

var bpm = 60;
var sources = {};
var beatTime;

clock();

function clock() {
  beatTime = 1 / (bpm / 60);
}

jazz.on('input', debounce(function () {
  console.log('read input');
  var text = jazz.buffer.text.toString();
  localStorage.text = text;
  build(null, text);
}, 700));

function debounce(fn, ms) {
  var timeout;
  return function debounceWrap() {
    clearTimeout(timeout);
    timeout = setTimeout(fn, ms);
  };
}

var callbacks = [];
var callbackId = 0;

var worker = new Worker('worker.js');

worker.onmessage = function onmessage(e) {
  var params = e.data;
  console.log('received params', params);
  if (params === true) return;
  if ('number' === typeof params) {
    bpm = params;
    clock();
    console.log('received bpm', bpm);
    return;
  }
  console.log(params, callbacks);
  var time = Date.now() - params.timestamp;
  var cb = callbacks[params.id];
  delete callbacks[params.id];
  cb(params.error, params);
};

function build(err, js) {
  console.log('building');

  if (err) throw err;

  var cb = function cb(err, result) {
    if (err) console.log(err.stack);else compile(result);
  };

  callbacks[++callbackId] = cb;
  worker.postMessage({
    procedureName: 'compile',
    id: callbackId,
    args: [js],
    timestamp: Date.now()
  });
}

var cb = function cb(err, result) {
  build(null, jazz.buffer.text.toString());
};

callbacks[++callbackId] = cb;

worker.postMessage({
  procedureName: 'setup',
  id: callbackId,
  args: [{ sampleRate: audio.sampleRate }],
  timestamp: Date.now()
});

function calcOffsetTime(buffer) {
  return audio.currentTime % (buffer.length / audio.sampleRate | 0);
}

function compile(buffers) {
  console.log('local compile', buffers);
  var restartSounds = [];
  for (var key in sounds) {
    var soundKey = sounds[key];
    if (soundKey.active) {
      var source = sources[soundKey.name][soundKey.bank.name];
      if (source.buffer) {
        restartSounds.push(soundKey);
        soundKey.syncTime = calcSyncTime(source.multiplier);
        console.log('stop:', soundKey.name);
        source.stop(soundKey.syncTime);
      }
    }
  }
  for (var key in buffers) {
    if ('id' === key || 'timestamp' === key) continue;
    // sources[key] = createBankSources(key, buffers[key]);
    var source = sources[key];
    source = sources[key] = createBankSources(key, buffers[key]);
    // for (var b = 0; b < 3; b++) {
    //   source[b].buffer = audio.createBuffer(2, buffers[key][b][0].length, audio.sampleRate);
    //   source[b].buffer.getChannelData(0).set(buffers[key][b][0]);
    //   source[b].buffer.getChannelData(1).set(buffers[key][b][1]);
    // }
    source.multiplier = buffers[key].multiplier || 4;
  }
  restartSounds.forEach(function (soundKey) {
    var source = sources[soundKey.name][soundKey.bank.name];
    console.log('start:', soundKey.name);
    source.start(soundKey.syncTime); //, calcOffsetTime(source.buffer));
  });
}

allKeys.forEach(function (key) {
  sources[key] = createBankSources(key);
  sources[key].multiplier = 4;
});

build(null, localStorage.text || jazz.buffer.text.toString());

function createBankSources(key, buffers) {
  console.log('create bank sources', key);
  var sources = [];
  for (var b = 0; b < 3; b++) {
    var source = audio.createBufferSource();
    source.loop = true;
    source.onended = disconnect;
    if (buffers) {
      source.buffer = audio.createBuffer(2, buffers[b][0].length, audio.sampleRate);
      source.buffer.getChannelData(0).set(buffers[b][0]);
      source.buffer.getChannelData(1).set(buffers[b][1]);
    }
    source.connect(audio.destination);
    sources.push(source);
  }
  return sources;
}

function calcSyncTime(multiplier) {
  return normalize(audio.currentTime + (multiplier * beatTime - audio.currentTime % (multiplier * beatTime)));
}

function disconnect() {
  this.disconnect();
}

function normalize(number) {
  return number === Infinity || number === -Infinity || isNaN(number) ? 0 : number;
}

function alterState(key) {
  if (key.active) play(key);else stop(key);
}

function play(key) {
  if (key.name in sources) {
    var syncTime = calcSyncTime(sources[key.name].multiplier);
    var source;
    try {
      if (key.prevBank) {
        source = sources[key.name][key.prevBank.name];
        var buffer = source.buffer;
        source.stop(syncTime);
        source = sources[key.name][key.prevBank.name] = audio.createBufferSource();
        source.loop = true;
        source.onended = disconnect;
        source.connect(audio.destination);
        source.buffer = buffer;
      }
    } catch (e) {}
    source = sources[key.name][key.bank.name];
    console.log('start:', source);
    source.start(syncTime);
  }
}

function stop(key) {
  if (key.name in sources) {
    var source = sources[key.name];
    var syncTime = calcSyncTime(source.multiplier);
    source[key.bank.name].stop(syncTime);
  }
  console.log('stop', key.name);
}

function togglePanel() {
  elements[focus].classList.remove('focus');
  focus = other[focus];
  elements[focus].classList.add('focus');
  if (focus === 'editor') {
    jazz.focus();
  } else {
    jazz.blur();
  }
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhbGdvcmF2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUE7OztBQUdBLENBQUMsVUFBVSxNQUFWLEVBQWtCO0FBQ2Y7O0FBQ0EsTUFBSSxTQUFTO0FBQ0wsUUFBSSxPQURDO0FBRUwsUUFBSSxRQUZDOztBQUlMLFFBQUksUUFKQztBQUtMLFFBQUksVUFMQzs7QUFPTCxRQUFJLFdBUEM7QUFRTCxRQUFJLFNBUkM7QUFTTCxRQUFJLFlBVEM7QUFVTCxRQUFJO0FBVkMsR0FBYjs7O0FBYUk7QUFDQSxRQUFNLENBQUUsRUFBRixDQWRWO0FBQUEsTUFnQkksYUFBYSxPQUFPLFVBQVAsR0FBb0IsT0FBTyxNQUFQLENBQWMsTUFBZCxFQUFzQjtBQUNuRCxTQUFLO0FBQ0QsV0FBSyxlQUFZO0FBQUUsZUFBTyxHQUFQO0FBQWEsT0FEL0I7QUFFRCxXQUFLLGFBQVUsQ0FBVixFQUFhO0FBQUUsY0FBTSxDQUFOO0FBQVU7QUFGN0I7QUFEOEMsR0FBdEIsQ0FoQnJDO0FBQUEsTUF1QkksT0FBTyxFQUFFLEtBQUssZUFBWTtBQUNkLFVBQUksT0FBTyxLQUFLLEtBQWhCOztBQUVBLGFBQU8sSUFBSSxJQUFKLEtBQWEsY0FBcEI7QUFDSixLQUpELEVBdkJYO0FBQUEsTUE2QkksTUFBTSxPQUFPLE1BQVAsQ0FBYyxNQUFkLENBN0JWOztBQStCQTtBQUNBLE9BQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsS0FBSyxDQUFyQixFQUF3QixHQUF4QjtBQUNJLFdBQU8sSUFBSSxFQUFYLElBQWlCLE9BQU8sQ0FBUCxDQUFqQjtBQURKLEdBbENlLENBcUNmO0FBQ0EsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEVBQXBCLEVBQXdCLEdBQXhCO0FBQ0ksV0FBTyxJQUFJLEdBQVgsSUFBa0IsTUFBTSxDQUF4QjtBQURKLEdBdENlLENBeUNmO0FBQ0EsT0FBSyxJQUFJLElBQUksRUFB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TyxPQUFQLEdBQWlCLFVBQWpCO0FBQ0EsZUFBTyxPQUFQLENBQWUsTUFBTSxXQUFyQjtBQUNBLGVBQU8sTUFBUCxHQUFnQixNQUFoQjtBQUNEO0FBQ0YsS0FYRCxDQVdFLE9BQU0sQ0FBTixFQUFTLENBQUU7QUFDYixhQUFTLFFBQVEsSUFBSSxJQUFaLEVBQWtCLElBQUksSUFBSixDQUFTLElBQTNCLENBQVQ7QUFDQSxZQUFRLEdBQVIsQ0FBWSxRQUFaLEVBQXNCLE1BQXRCO0FBQ0EsV0FBTyxLQUFQLENBQWEsUUFBYjtBQUNEO0FBQ0Y7O0FBRUQsU0FBUyxJQUFULENBQWMsR0FBZCxFQUFtQjtBQUNqQixNQUFJLElBQUksSUFBSixJQUFZLE9BQWhCLEVBQXlCO0FBQ3ZCLFFBQUksU0FBUyxRQUFRLElBQUksSUFBWixDQUFiO0FBQ0EsUUFBSSxXQUFXLGFBQWEsT0FBTyxVQUFwQixDQUFmO0FBQ0EsV0FBTyxJQUFJLElBQUosQ0FBUyxJQUFoQixFQUFzQixJQUF0QixDQUEyQixRQUEzQjtBQUNEO0FBQ0QsVUFBUSxHQUFSLENBQVksTUFBWixFQUFvQixJQUFJLElBQXhCO0FBQ0Q7O0FBRUQsU0FBUyxXQUFULEdBQXVCO0FBQ3JCLFdBQVMsS0FBVCxFQUFnQixTQUFoQixDQUEwQixNQUExQixDQUFpQyxPQUFqQztBQUNBLFVBQVEsTUFBTSxLQUFOLENBQVI7QUFDQSxXQUFTLEtBQVQsRUFBZ0IsU0FBaEIsQ0FBMEIsR0FBMUIsQ0FBOEIsT0FBOUI7QUFDQSxNQUFJLFVBQVUsUUFBZCxFQUF3QjtBQUN0QixTQUFLLEtBQUw7QUFDRCxHQUZELE1BRU87QUFDTCxTQUFLLElBQUw7QUFDRDtBQUNGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxuICogUHJvdmlkZXMgYSBkZWZhdWx0IG1hcCBmb3IgZXZlbnQua2V5IGluIGtleWJvYXJkIGV2ZW50c1xuICovXG4oZnVuY3Rpb24gKGdsb2JhbCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciBkZWZNYXAgPSB7XG4gICAgICAgICAgICAxMzogJ0VudGVyJyxcbiAgICAgICAgICAgIDI3OiAnRXNjYXBlJyxcblxuICAgICAgICAgICAgMzM6ICdQYWdlVXAnLFxuICAgICAgICAgICAgMzQ6ICdQYWdlRG93bicsXG5cbiAgICAgICAgICAgIDM3OiAnQXJyb3dMZWZ0JyxcbiAgICAgICAgICAgIDM4OiAnQXJyb3dVcCcsXG4gICAgICAgICAgICAzOTogJ0Fycm93UmlnaHQnLFxuICAgICAgICAgICAgNDA6ICdBcnJvd0Rvd24nLFxuICAgICAgICB9LFxuXG4gICAgICAgIC8vIE90aGVyIHByaW50YWJsZSBjaGFyYWN0ZXJzXG4gICAgICAgIGZjYyA9IFsgMzIgXSxcblxuICAgICAgICBrZXlNYW5hZ2VyID0gZ2xvYmFsLmtleU1hbmFnZXIgPSBPYmplY3QuY3JlYXRlKE9iamVjdCwge1xuICAgICAgICAgICAgbWFwOiB7XG4gICAgICAgICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7IHJldHVybiBtYXA7IH0sXG4gICAgICAgICAgICAgICAgc2V0OiBmdW5jdGlvbiAobykgeyBtYXAgPSBvOyB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLFxuXG4gICAgICAgIHByb3AgPSB7IGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgY29kZSA9IHRoaXMud2hpY2g7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG1hcFtjb2RlXSB8fCAnVW5pZGVudGlmaWVkJztcbiAgICAgICAgICAgICAgIH19LFxuXG4gICAgICAgIG1hcCA9IE9iamVjdC5jcmVhdGUoZGVmTWFwKTtcblxuICAgIC8vIE51bXBhZFxuICAgIGZvciAodmFyIGkgPSAwOyBpIDw9IDk7IGkrKylcbiAgICAgICAgZGVmTWFwW2kgKyA5Nl0gPSBTdHJpbmcoaSk7XG5cbiAgICAvLyBGIGtleXNcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IDI1OyBpKyspXG4gICAgICAgIGRlZk1hcFtpICsgMTExXSA9ICdGJyArIGk7XG5cbiAgICAvLyBQcmludGFibGUgY2hhcmFjdGVyc1xuICAgIGZvciAodmFyIGkgPSA0ODsgaSA8IDkxOyBpKyspXG4gICAgICAgIGRlZk1hcFtpXSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoaSk7XG5cbiAgICBpZiAoZ2xvYmFsLktleWJvYXJkRXZlbnQpXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwuS2V5Ym9hcmRFdmVudC5wcm90b3R5cGUsICdrZXknLCBwcm9wKTtcblxuICAgIGlmIChnbG9iYWwuS2V5RXZlbnQpXG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShnbG9iYWwuS2V5RXZlbnQucHJvdG90eXBlLCAna2V5JywgcHJvcCk7XG5cbn0pKHdpbmRvdyk7XG5cbmZ1bmN0aW9uIFBhZEtleShjaGFyKSB7XG4gIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5lbC5jbGFzc05hbWUgPSAna2V5IGtleS0nICsgY2hhcjtcbiAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmxhYmVsLnRleHRDb250ZW50ID0gY2hhcjtcbiAgdGhpcy5sYWJlbC5jbGFzc05hbWUgPSAna2V5LWxhYmVsJztcbiAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgdGhpcy5jaGFyQ29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcbiAgdGhpcy5uYW1lID0gY2hhcjtcbiAgdGhpcy50dXJuT2ZmKCk7XG59XG5cblBhZEtleS5wcm90b3R5cGUudHVybk9uID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbn07XG5cblBhZEtleS5wcm90b3R5cGUudHVybk9mZiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xufTtcblxuUGFkS2V5LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgdGhpcy50dXJuT2ZmKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50dXJuT24oKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gQmFuayhuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYmFuayA9IG51bGw7XG4gIHRoaXMucHJldkJhbmsgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBTb3VuZEtleShjaGFyKSB7XG4gIFBhZEtleS5jYWxsKHRoaXMsIGNoYXIpO1xufVxuXG5Tb3VuZEtleS5wcm90b3R5cGUuX19wcm90b19fID0gUGFkS2V5LnByb3RvdHlwZTtcblxuU291bmRLZXkucHJvdG90eXBlLnNldEJhbmsgPSBmdW5jdGlvbihiYW5rKSB7XG4gIGlmICh0aGlzLmJhbmspIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYmFuay0nICsgdGhpcy5iYW5rLm5hbWUpO1xuICB0aGlzLnByZXZCYW5rID0gdGhpcy5iYW5rO1xuICB0aGlzLmJhbmsgPSBiYW5rO1xuICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2JhbmstJyArIHRoaXMuYmFuay5uYW1lKTtcbn07XG5cbnZhciBrZXlib2FyZCA9IFtcbiAgJzEyMzQ1Njc4OTAnLnNwbGl0KCcnKSxcbiAgJ3F3ZXJ0eXVpb3AnLnNwbGl0KCcnKSxcbiAgJ2FzZGZnaGprbCcuc3BsaXQoJycpLFxuICAnenhjdmJubScuc3BsaXQoJycpLFxuXTtcblxudmFyIHNvdW5kcyA9IHt9O1xudmFyIGJhbmtzID0gW107XG5cbnZhciBhbGxLZXlzID0ga2V5Ym9hcmQucmVkdWNlKChwLCBuKSA9PiBwLmNvbmNhdChuKSk7XG5cbnZhciBjb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5jb250YWluZXJFbGVtZW50LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXJFbGVtZW50KTtcblxudmFyIGVkaXRvckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmVkaXRvckVsZW1lbnQuY2xhc3NOYW1lID0gJ2VkaXRvcic7XG5cbnZhciBqYXp6RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuamF6ekVsZW1lbnQuY2xhc3NOYW1lID0gJ2phenonO1xuXG52YXIgamF6ek9wdGlvbnMgPSB7XG4gIHRoZW1lOiAncmVkYmxpc3MnLFxuICBmb250X3NpemU6ICc5cHQnLFxufTtcbnZhciBqYXp6ID0gbmV3IEphenooamF6ek9wdGlvbnMpO1xuXG5qYXp6LnNldChsb2NhbFN0b3JhZ2UudGV4dCB8fCBgXFxcbmxldCB7IHNpbiwgU2luLCBTYXcsIFRyaSwgU3FyLCBDaG9yZCwgQ2hvcmRzLCBzb2Z0Q2xpcDpjbGlwLCBub3RlLCBlbnZlbG9wZSwgS29yZzM1TFBGLCBEaW9kZUZpbHRlciB9ID0gc3R1ZGlvO1xuXG4vLyBwYXRjaGVzOiBrIGwgbSBvIHAgYSBzIGQgeFxuXG5leHBvcnQgbGV0IGJwbSA9IDEwMDtcbmxldCBwcm9nciA9IFsnRm1hajcnLCdCbWFqOScsJ0Q5JywnRyNtaW43J10ubWFwKENob3Jkcyk7XG5sZXQgcHJvZ3JfMiA9IFsnQ21pbicsJ0QjbWluJywnRm1pbicsJ0FtaW4nXS5tYXAoQ2hvcmRzKTtcblxuZnVuY3Rpb24gY2ZnKHRhcmdldCwgb2JqKSB7XG4gIGlmICghb2JqKSBvYmogPSB0YXJnZXQ7XG4gIGZvciAodmFyIGsgaW4gb2JqKSB7XG4gICAgdmFyIHZhbCA9IG9ialtrXTtcbiAgICB2YXIgX2sgPSAnXycgKyBrO1xuICAgIHRhcmdldFtfa10gPSB2YWw7XG4gICAgdGFyZ2V0W2tdID0gU2V0dGVyKF9rKTtcbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuZnVuY3Rpb24gU2V0dGVyKF9rKXtcbiAgcmV0dXJuIGZ1bmN0aW9uKHZhbCl7XG4gICAgdGhpc1tfa10gPSB2YWw7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59XG5cbmZ1bmN0aW9uIEJhc3NsaW5lKCl7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCYXNzbGluZSkpIHJldHVybiBuZXcgQmFzc2xpbmUoKTtcblxuICB0aGlzLm9zYyA9IFNhdyg1MTIpO1xuICB0aGlzLmZpbHRlciA9IERpb2RlRmlsdGVyKCk7XG5cbiAgY2ZnKHRoaXMsIHtcbiAgICBzZXE6IFsxMTAsIDIyMF0sXG4gICAgaHBmOiAuMDA4NyxcbiAgICBjdXQ6IC41LFxuICAgIHJlczogLjcsXG4gICAgbGZvOiAuNjYsXG4gICAgbGZvMjogLjEyLFxuICAgIHByZTogMC4zMixcbiAgICBjbGlwOiAzMC4zXG4gIH0pO1xufVxuXG5CYXNzbGluZS5wcm90b3R5cGUucGxheSA9IGZ1bmN0aW9uKHQsIHNwZWVkKXtcbiAgc3BlZWQgPSBzcGVlZCB8fCAxLzE2O1xuXG4gIHZhciBsZm8gPSBzaW4odCwgdGhpcy5fbGZvKTtcbiAgdmFyIGxmbzIgPSBzaW4odCwgdGhpcy5fbGZvMik7XG5cbiAgdmFyIG4gPSBzbGlkZSh0LCBzcGVlZCwgdGhpcy5fc2VxLCAxNCk7XG4gIHZhciBzeW50aF9vc2MgPSB0aGlzLm9zYyhuKTtcbiAgdmFyIHN5bnRoID0gYXJwKHQsIHNwZWVkLCBzeW50aF9vc2MsIDI0LCAuOTkpO1xuXG4gIHN5bnRoID0gdGhpcy5maWx0ZXJcbiAgICAuY3V0KFxuICAgICAgKDAuMDAxICtcbiAgICAgICgobGZvICogMC4yOCArIDEpIC8gMikgKlxuICAgICAgKDAuNTM4ICsgbGZvMiAqIDAuMzUpKSAqIHRoaXMuX2N1dFxuICAgIClcbiAgICAuaHBmKHRoaXMuX2hwZilcbiAgICAucmVzKHRoaXMuX3JlcylcbiAgICAucnVuKHN5bnRoICogdGhpcy5fcHJlKVxuICAgIDtcblxuICBzeW50aCA9IGNsaXAoc3ludGggKiB0aGlzLl9jbGlwKTtcblxuICByZXR1cm4gc3ludGg7XG59O1xuXG5mdW5jdGlvbiBzbGlkZSh0LCBtZWFzdXJlLCBzZXEsIHNwZWVkKXtcbiAgdmFyIHBvcyA9ICh0IC8gbWVhc3VyZSAvIDIpICUgc2VxLmxlbmd0aDtcbiAgdmFyIG5vdyA9IHBvcyB8IDA7XG4gIHZhciBuZXh0ID0gbm93ICsgMTtcbiAgdmFyIGFscGhhID0gcG9zIC0gbm93O1xuICBpZiAobmV4dCA9PSBzZXEubGVuZ3RoKSBuZXh0ID0gMTtcbiAgcmV0dXJuIHNlcVtub3ddICsgKChzZXFbbmV4dF0gLSBzZXFbbm93XSkgKiBNYXRoLnBvdyhhbHBoYSwgc3BlZWQpKTtcbn1cblxuZnVuY3Rpb24gYXJwKHQsIG1lYXN1cmUsIHgsIHksIHopIHtcbiAgdmFyIHRzID0gdCAvIDQgJSBtZWFzdXJlO1xuICByZXR1cm4gTWF0aC5zaW4oeCAqIChNYXRoLmV4cCgtdHMgKiB5KSkpICogTWF0aC5leHAoLXRzICogeik7XG59XG5cblxudmFyIGJhc3NfYTAgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2ExID0gbmV3IEJhc3NsaW5lKCk7XG52YXIgYmFzc19hMiA9IG5ldyBCYXNzbGluZSgpO1xuYmFzc19hMC5zZXEocHJvZ3JbMF0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjE1KS5wcmUoMSkuaHBmKC4wMDIyKS5jbGlwKDEwKS5yZXMoLjcpLmxmbyguNSk7XG5iYXNzX2ExLnNlcShwcm9nclsxXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMTgpLnByZSgxKS5ocGYoLjAwMjIpLmNsaXAoMTApLnJlcyguNykubGZvKC41KTtcbmJhc3NfYTIuc2VxKHByb2dyWzJdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4yNSkucHJlKDEpLmhwZiguMDAyMikuY2xpcCgxMCkucmVzKC43KS5sZm8oLjUpO1xuXG5leHBvcnQgbGV0IGEgPSBbNCwgZnVuY3Rpb24gYmFzc19hKHQpIHtcbiAgdmFyIHZvbCA9IC40O1xuICByZXR1cm4ge1xuICAgIDA6IGJhc3NfYTAucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDEwLCA1KSAqIHZvbCxcbiAgICAxOiBiYXNzX2ExLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAxMCwgNSkgKiB2b2wsXG4gICAgMjogYmFzc19hMi5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMTAsIDUpICogdm9sLFxuICB9O1xufV07XG5cblxuXG52YXIgYmFzc19kMCA9IG5ldyBCYXNzbGluZSgpO1xudmFyIGJhc3NfZDEgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2QyID0gbmV3IEJhc3NsaW5lKCk7XG5iYXNzX2QwLnNlcShwcm9ncl8yWzBdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4xNSkucHJlKC41KS5ocGYoLjAwNzIpLmNsaXAoNSkucmVzKC43KS5sZm8oMSkubGZvMiguMjUpO1xuYmFzc19kMS5zZXEocHJvZ3JfMlsxXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMTgpLnByZSguNSkuaHBmKC4wMDcyKS5jbGlwKDUpLnJlcyguNykubGZvKDEpLmxmbzIoLjI1KTtcbmJhc3NfZDIuc2VxKHByb2dyXzJbMl0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjI1KS5wcmUoLjUpLmhwZiguMDA3MikuY2xpcCg1KS5yZXMoLjcpLmxmbygxKS5sZm8yKC4yNSk7XG5cbmV4cG9ydCBsZXQgZCA9IFs0LCBmdW5jdGlvbiBiYXNzX2QodCkge1xuICB2YXIgdm9sID0gLjc7XG4gIHJldHVybiB7XG4gICAgMDogYmFzc19kMC5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMywgNSkgKiB2b2wsXG4gICAgMTogYmFzc19kMS5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMywgNSkgKiB2b2wsXG4gICAgMjogYmFzc19kMi5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMywgNSkgKiB2b2wsXG4gIH07XG59XTtcblxuXG5leHBvcnQgbGV0IGsgPSBbNCwgZnVuY3Rpb24ga2ljayh0KSB7XG4gIHZhciB2b2wgPSAuNjtcbiAgcmV0dXJuIHtcbiAgICAwOiBhcnAodCwgMS80LCA1MCwgMzAsIDgpICogdm9sLFxuICAgIDE6IGFycCh0LCAxLzQsIDYwLCAzMCwgOCkgKiB2b2wsXG4gICAgMjogYXJwKHQsIDEvNCwgNDAsIDMwLCA4KSAqIHZvbCxcbiAgfTtcbn1dO1xuXG5leHBvcnQgbGV0IGwgPSBbNCwgZnVuY3Rpb24gaGloYXQodCkge1xuICB2YXIgdm9sID0gLjE7XG4gIHJldHVybiB7XG4gICAgMDogYXJwKHQrMS8yLCAxLzQsIE1hdGgucmFuZG9tKCkgKiA1NTUwLCAxNjAwLCAzNTApICogdm9sLFxuICAgIDE6IGFycCh0KzEvMiwgMS80LCBNYXRoLnJhbmRvbSgpICogNTU1MCwgMjYwMCwgMzUwKSAqIHZvbCxcbiAgICAyOiBhcnAodCsxLzIsIDEvNCwgTWF0aC5yYW5kb20oKSAqIDU1NTAsIDM2MDAsIDM1MCkgKiB2b2wsXG4gIH07XG59XTtcblxudmFyIHN5bnRoX29zY18wID0gVHJpKDEyOCwgdHJ1ZSk7XG52YXIgc3ludGhfb3NjXzEgPSBUcmkoMTI4LCB0cnVlKTtcbnZhciBzeW50aF9vc2NfMiA9IFRyaSgxMjgsIHRydWUpO1xuZXhwb3J0IGxldCBvID0gWzQsIGZ1bmN0aW9uIHN5bnRoKHQpIHtcbiAgdmFyIHZvbCA9IC4zO1xuICB2YXIgb3V0XzAgPSBzeW50aF9vc2NfMChub3RlKFsnZCcsJ2YnXVsodCUyKXwwXSkpICogZW52ZWxvcGUodCsxLzMsIDEvNCwgNTAsIDQpICogdm9sO1xuICB2YXIgb3V0XzEgPSBzeW50aF9vc2NfMShub3RlKFsnYicsJ2cjJywnZiddWyh0JTMpfDBdKSkgKiBlbnZlbG9wZSh0KzEvMywgMS80LCA1MCwgNCkgKiB2b2w7XG4gIHZhciBvdXRfMiA9IHN5bnRoX29zY18yKG5vdGUoWydmJywnZjUnLCdkJywnZyMnXVsodCU0KXwwXSkpICogZW52ZWxvcGUodCsxLzMsIDEvNCwgNTAsIDQpICogdm9sO1xuICByZXR1cm4ge1xuICAgIDA6IG91dF8wLFxuICAgIDE6IG91dF8xLFxuICAgIDI6IG91dF8yLFxuICB9O1xufV07XG5cbnZhciBwYWRfb3NjXzAgPSBDaG9yZChTYXcsIDEyOCwgdHJ1ZSk7XG52YXIgcGFkX29zY18xID0gQ2hvcmQoU2F3LCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfMiA9IENob3JkKFNhdywgMTI4LCB0cnVlKTtcblxudmFyIGZpbHRlcl9wYWRfMCA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfMSA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfMiA9IEtvcmczNUxQRigpO1xuZmlsdGVyX3BhZF8wLmN1dCg1MDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF8xLmN1dCg1MDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF8yLmN1dCg1MDApLnJlcygyLjEpLnNhdCgyLjEpO1xuXG5leHBvcnQgbGV0IHAgPSBbNCwgZnVuY3Rpb24gcGFkKHQpIHtcbiAgdmFyIHZvbCA9IC4zO1xuICB2YXIgYyA9IHByb2dyW3QlNHwwXTtcbiAgdmFyIG91dF8wID0gcGFkX29zY18wKGMubWFwKG5vdGUpLm1hcChuPT5uKjIpKSAqIGVudmVsb3BlKHQsIDEvNCwgNSwgNCkgKiB2b2w7XG4gIHZhciBvdXRfMSA9IHBhZF9vc2NfMShjLm1hcChub3RlKS5tYXAobj0+bio0KSkgKiBlbnZlbG9wZSh0LCAxLzQsIDUsIDQpICogdm9sO1xuICB2YXIgb3V0XzIgPSBwYWRfb3NjXzIoYy5tYXAobm90ZSkubWFwKG49Pm4qOCkpICogZW52ZWxvcGUodCwgMS80LCA1LCA0KSAqIHZvbDtcbiAgcmV0dXJuIHtcbiAgICAwOiBmaWx0ZXJfcGFkXzAucnVuKG91dF8wKSxcbiAgICAxOiBmaWx0ZXJfcGFkXzEucnVuKG91dF8xKSxcbiAgICAyOiBmaWx0ZXJfcGFkXzIucnVuKG91dF8yKSxcbiAgfTtcbn1dO1xuXG52YXIgcGFkX29zY19tMCA9IENob3JkKFNxciwgMTI4LCB0cnVlKTtcbnZhciBwYWRfb3NjX20xID0gQ2hvcmQoU3FyLCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfbTIgPSBDaG9yZChTcXIsIDEyOCwgdHJ1ZSk7XG5cbnZhciBmaWx0ZXJfcGFkX20wID0gS29yZzM1TFBGKCk7XG52YXIgZmlsdGVyX3BhZF9tMSA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfbTIgPSBLb3JnMzVMUEYoKTtcbmZpbHRlcl9wYWRfbTAuY3V0KDUwMCkucmVzKDEuMSkuc2F0KDIuMSk7XG5maWx0ZXJfcGFkX20xLmN1dCg1MDApLnJlcygxLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF9tMi5jdXQoNTAwKS5yZXMoMS4xKS5zYXQoMi4xKTtcblxudmFyIGxmb19tID0gU2luKCk7XG5cbmV4cG9ydCBsZXQgbSA9IFs0LCBmdW5jdGlvbiBwYWQodCkge1xuICB2YXIgdm9sID0gLjU7XG4gIHZhciBjID0gcHJvZ3JfMlsodCo0KSUzfDBdO1xuICB2YXIgb3V0XzAgPSBwYWRfb3NjX20wKGMubWFwKG5vdGUpLm1hcChuPT5uKjQpKSAqIGVudmVsb3BlKHQrMS80LCAxLzIsIDUsIC0yKSAqIHZvbCAqIGxmb19tKC4yKTtcbiAgdmFyIG91dF8xID0gcGFkX29zY19tMShjLm1hcChub3RlKS5tYXAobj0+bio2KSkgKiBlbnZlbG9wZSh0KzEvNCwgMS8yLCA1LCAtMikgKiB2b2wgKiBsZm9fbSguMik7XG4gIHZhciBvdXRfMiA9IHBhZF9vc2NfbTIoYy5tYXAobm90ZSkubWFwKG49Pm4qOCkpICogZW52ZWxvcGUodCsxLzQsIDEvMiwgNSwgLTIpICogdm9sICogbGZvX20oLjIpO1xuICByZXR1cm4ge1xuICAgIDA6IGZpbHRlcl9wYWRfbTAucnVuKG91dF8wKSxcbiAgICAxOiBmaWx0ZXJfcGFkX20xLnJ1bihvdXRfMSksXG4gICAgMjogZmlsdGVyX3BhZF9tMi5ydW4ob3V0XzIpLFxuICB9O1xufV07XG5cbnZhciBjaGlwX29zY18wID0gVHJpKDEwLCBmYWxzZSk7XG52YXIgY2hpcF9vc2NfMSA9IFRyaSgxMCwgZmFsc2UpO1xudmFyIGNoaXBfb3NjXzIgPSBUcmkoMTAsIGZhbHNlKTtcblxuZXhwb3J0IGxldCBzID0gWzgsIGZ1bmN0aW9uIGNoaXAodCkge1xuICB2YXIgYyA9IG5vdGUocHJvZ3JbMF1bdCVwcm9nclswXS5sZW5ndGh8MF0pKjg7XG4gIHJldHVybiB7XG4gICAgMDogLjcgKiBhcnAodCsyLzgsIDEvMjgsIGFycCh0LCAxLzE2LCBjaGlwX29zY18wKGMpKih0KjQlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMDAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAxOiAuNyAqIGFycCh0KzIvOCwgMS8yOCwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjXzEoYyoyKSoodCo4JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMjogLjcgKiBhcnAodCsyLzgsIDEvMjgsIGFycCh0LCAxLzE2LCBjaGlwX29zY18yKGMqNCkqKHQqMTYlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMDAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgfVxufV07XG5cbnZhciBjaGlwX29zY194MCA9IFRyaSgxMCwgdHJ1ZSk7XG52YXIgY2hpcF9vc2NfeDEgPSBUcmkoMTAsIHRydWUpO1xudmFyIGNoaXBfb3NjX3gyID0gVHJpKDEwLCB0cnVlKTtcblxuZXhwb3J0IGxldCB4ID0gWzgsIGZ1bmN0aW9uIGNoaXAodCkge1xuICB2YXIgYyA9IG5vdGUocHJvZ3JfMlswXVt0JXByb2dyXzJbMF0ubGVuZ3RofDBdKSo4O1xuICB2YXIgdm9sID0gLjU7XG4gIHJldHVybiB7XG4gICAgMDogdm9sICogYXJwKHQrMi84LCAxLzE2LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfeDAoYykqKHQqNCUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMTogdm9sICogYXJwKHQrMi84LCAxLzE2LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfeDEoYyoyKSoodCo4JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAyOiB2b2wgKiBhcnAodCsyLzgsIDEvMTYsIGFycCh0LCAxLzE2LCBjaGlwX29zY194MihjKjQpKih0KjE2JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgfVxufV07XG5cbmAsICdkc3AuanMnKTtcblxuZWRpdG9yRWxlbWVudC5hcHBlbmRDaGlsZChqYXp6RWxlbWVudCk7XG5jb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGVkaXRvckVsZW1lbnQpO1xuamF6ei51c2UoamF6ekVsZW1lbnQpO1xuXG52YXIga2V5Ym9hcmRDb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5rZXlib2FyZENvbnRhaW5lckVsZW1lbnQuY2xhc3NOYW1lID0gJ2tleWJvYXJkLWNvbnRhaW5lcic7XG5cbnZhciBrZXlib2FyZEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmtleWJvYXJkRWxlbWVudC5jbGFzc05hbWUgPSAna2V5Ym9hcmQnO1xuXG52YXIgZmlsZW5hbWVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5maWxlbmFtZUVsZW1lbnQuY2xhc3NOYW1lID0gJ2ZpbGVuYW1lJztcblxuZWRpdG9yRWxlbWVudC5hcHBlbmRDaGlsZChmaWxlbmFtZUVsZW1lbnQpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IGtleWJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gIHZhciByb3cgPSBrZXlib2FyZFtpXTtcbiAgdmFyIHJvd0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcm93RWxlbWVudC5jbGFzc05hbWUgPSAncm93IHJvdy0nICsgaTtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCByb3cubGVuZ3RoOyBrKyspIHtcbiAgICB2YXIgY2hhciA9IHJvd1trXTtcbiAgICB2YXIga2V5O1xuICAgIGtleSA9IG5ldyBTb3VuZEtleShjaGFyKTtcbiAgICBzb3VuZHNba2V5LmNoYXJDb2RlXSA9IGtleTtcbiAgICByb3dFbGVtZW50LmFwcGVuZENoaWxkKGtleS5lbCk7XG4gICAga2V5LmVsLm9uY2xpY2sgPVxuICAgIGtleS5lbC5vbm1vdXNldXAgPVxuICAgIGtleS5lbC5vbm1vdXNlZG93biA9XG4gICAga2V5LmxhYmVsLm9ubW91c2Vkb3duID1cbiAgICBrZXkubGFiZWwub250b3VjaHN0YXJ0ID0gZSA9PiB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9O1xuICB9XG4gIGtleWJvYXJkRWxlbWVudC5hcHBlbmRDaGlsZChyb3dFbGVtZW50KTtcbn1cblxudmFyIGxhc3RUb3VjaEtleSA9IG51bGw7XG52YXIgZGVib3VuY2VMYXN0VG91Y2hLZXk7XG5cbmtleWJvYXJkRWxlbWVudC5vbnRvdWNoc3RhcnQgPVxua2V5Ym9hcmRFbGVtZW50Lm9udG91Y2htb3ZlID1cbmtleWJvYXJkRWxlbWVudC5vbnRvdWNoZW50ZXIgPSBmdW5jdGlvbiBoYW5kbGVyKGUpIHtcbiAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICBpZiAoIWUudG91Y2hlcykge1xuICAgIGUudG91Y2hlcyA9IFsge3RvdWNoOiBbZV19IF07XG4gICAgcmV0dXJuO1xuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZS50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuICAgIGZvciAodmFyIGNoYXIgaW4gc291bmRzKSB7XG4gICAgICB2YXIga2V5ID0gc291bmRzW2NoYXJdO1xuICAgICAgaWYgKCB0b3VjaC5jbGllbnRYID4ga2V5LnBvcy5sZWZ0ICYmIHRvdWNoLmNsaWVudFggPD0ga2V5LnBvcy5sZWZ0ICsga2V5LnBvcy53aWR0aFxuICAgICAgICAmJiB0b3VjaC5jbGllbnRZID4ga2V5LnBvcy50b3AgJiYgdG91Y2guY2xpZW50WSA8PSBrZXkucG9zLnRvcCArIGtleS5wb3MuaGVpZ2h0XG4gICAgICAgICYmIGxhc3RUb3VjaEtleSAhPT0ga2V5XG4gICAgICApIHtcbiAgICAgICAgbmV4dEJhbmsoa2V5KTtcbiAgICAgICAgbGFzdFRvdWNoS2V5ID0ga2V5O1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxua2V5Ym9hcmRFbGVtZW50Lm9udG91Y2hzdGFydCA9IGZ1bmN0aW9uIGhhbmRsZXIoZSkge1xuICBpZiAoIWUudG91Y2hlcykge1xuICAgIGUudG91Y2hlcyA9IFsge3RvdWNoOiBbZV19IF1cbiAgICByZXR1cm47XG4gIH1cbiAgbGFzdFRvdWNoS2V5ID0gbnVsbDtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG4gICAgZm9yICh2YXIgY2hhciBpbiBzb3VuZHMpIHtcbiAgICAgIHZhciBrZXkgPSBzb3VuZHNbY2hhcl07XG4gICAgICBpZiAoIHRvdWNoLmNsaWVudFggPiBrZXkucG9zLmxlZnQgJiYgdG91Y2guY2xpZW50WCA8PSBrZXkucG9zLmxlZnQgKyBrZXkucG9zLndpZHRoXG4gICAgICAgICYmIHRvdWNoLmNsaWVudFkgPiBrZXkucG9zLnRvcCAmJiB0b3VjaC5jbGllbnRZIDw9IGtleS5wb3MudG9wICsga2V5LnBvcy5oZWlnaHRcbiAgICAgICAgJiYgbGFzdFRvdWNoS2V5ICE9PSBrZXlcbiAgICAgICkge1xuICAgICAgICBuZXh0QmFuayhrZXkpO1xuICAgICAgICBsYXN0VG91Y2hLZXkgPSBrZXk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5rZXlib2FyZENvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoa2V5Ym9hcmRFbGVtZW50KTtcbmNvbnRhaW5lckVsZW1lbnQuYXBwZW5kQ2hpbGQoa2V5Ym9hcmRDb250YWluZXJFbGVtZW50KTtcblxudmFyIGVsZW1lbnRzID0ge1xuICAnZWRpdG9yJzogZWRpdG9yRWxlbWVudCxcbiAgJ2tleWJvYXJkJzoga2V5Ym9hcmRFbGVtZW50XG59O1xudmFyIGZvY3VzID0gJ2tleWJvYXJkJztcbnZhciBvdGhlciA9IHtcbiAgJ2VkaXRvcic6ICdrZXlib2FyZCcsXG4gICdrZXlib2FyZCc6ICdlZGl0b3InLFxufTtcblxuZWxlbWVudHNbZm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzJyk7XG5cbmphenouYmx1cigpO1xuXG5qYXp6LmlucHV0LnRleHQuZWwuc3R5bGUuaGVpZ2h0ID0gJzUwJSc7XG5cbmphenoub24oJ2ZvY3VzJywgKCkgPT4ge1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXMnKTtcbiAgZm9jdXMgPSAnZWRpdG9yJztcbiAgZWxlbWVudHNbZm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzJyk7XG59KTtcblxuamF6ei5vbignYmx1cicsICgpID0+IHtcbiAgZWxlbWVudHNbZm9jdXNdLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzJyk7XG4gIGZvY3VzID0gJ2tleWJvYXJkJztcbiAgZWxlbWVudHNbZm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzJyk7XG59KTtcblxuLy8gfSk7XG5cbmRvY3VtZW50LmJvZHkub25rZXl1cCA9IGUgPT4ge1xuICBpZiAoZS5rZXkgPT09ICdTaGlmdCcpIHtcbiAgICBzdGF0ZS50cmlnZ2VyQmFuayA9IGZhbHNlO1xuICB9XG59XG5cbmRvY3VtZW50LmJvZHkub25rZXlkb3duID0gZSA9PiB7XG4gIGlmIChlLmtleS5sZW5ndGggPiAxKSB7XG4gICAgaWYgKGUua2V5ID09PSAnRXNjYXBlJykgdG9nZ2xlUGFuZWwoKTtcbiAgICBpZiAoZS5rZXkgPT09ICdUYWInKSB7XG4gICAgICBpZiAoZS5zaGlmdEtleSkgdG9nZ2xlUGFuZWwoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChmb2N1cyA9PT0gJ2VkaXRvcicpIHJldHVybjtcbiAgdmFyIGNoYXIgPSBlLmtleS50b0xvd2VyQ2FzZSgpO1xuICBpZiAoY2hhciA9PT0gY2hhci50b1VwcGVyQ2FzZSgpKSB7XG4gICAgaWYgKGNoYXIgPT09ICchJykgY2hhciA9ICcxJztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnQCcpIGNoYXIgPSAnMic7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyMnKSBjaGFyID0gJzMnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICckJykgY2hhciA9ICc0JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnJScpIGNoYXIgPSAnNSc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJ14nKSBjaGFyID0gJzYnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICcmJykgY2hhciA9ICc3JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnKicpIGNoYXIgPSAnOCc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJygnKSBjaGFyID0gJzknO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICcpJykgY2hhciA9ICcwJztcbiAgfVxuICB2YXIgY2hhckNvZGUgPSBjaGFyLnRvTG93ZXJDYXNlKCkuY2hhckNvZGVBdCgwKTtcbiAgdmFyIGtleSA9IHNvdW5kc1tjaGFyQ29kZV07XG4gIGlmIChlLnNoaWZ0S2V5KSB7XG4gICAga2V5LnR1cm5PZmYoKTtcbiAgfSBlbHNlIHtcbiAgICBuZXh0QmFuayhrZXkpO1xuICB9XG59O1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IDM7IGkrKykge1xuICBiYW5rcy5wdXNoKG5ldyBCYW5rKGkpKTtcbn1cblxuZnVuY3Rpb24gZ2V0S2V5c1Bvc2l0aW9ucygpIHtcbiAgZm9yICh2YXIgY2hhciBpbiBzb3VuZHMpIHtcbiAgICB2YXIga2V5ID0gc291bmRzW2NoYXJdO1xuICAgIGtleS5wb3MgPSBrZXkuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gIH1cbn1cblxudmFyIHByZXZIZWlnaHQgPSAwO1xuXG5nZXRLZXlzUG9zaXRpb25zKCk7XG5cbndpbmRvdy5vbnNjcm9sbCA9IGUgPT4ge1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIHJldHVybiBmYWxzZTtcbn07XG5cbndpbmRvdy5vbnJlc2l6ZSA9IGUgPT4ge1xuICBnZXRLZXlzUG9zaXRpb25zKCk7XG4gIGlmIChwcmV2SGVpZ2h0ICYmIHByZXZIZWlnaHQgPCBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodCkge1xuICAgIGphenouYmx1cigpO1xuICB9XG4gIHByZXZIZWlnaHQgPSBkb2N1bWVudC5ib2R5LmNsaWVudEhlaWdodDtcbn07XG5cbnZhciBzdGF0ZSA9IHtcbiAgYWN0aXZlQmFuazogYmFua3NbMF0sXG4gIHRyaWdnZXJCYW5rOiBmYWxzZVxufTtcblxuZm9yICh2YXIga2V5IGluIHNvdW5kcykge1xuICBzb3VuZHNba2V5XS5zZXRCYW5rKHN0YXRlLmFjdGl2ZUJhbmspO1xufVxuXG5mdW5jdGlvbiBuZXh0QmFuayhrZXkpIHtcbiAgdmFyIGJhbms7XG5cbiAgaWYgKCFrZXkuYWN0aXZlKSB7XG4gICAgYmFuayA9IGJhbmtzWzBdO1xuICB9IGVsc2Uge1xuICAgIHZhciBuZXh0QmFua0luZGV4ID0gK2tleS5iYW5rLm5hbWUgKyAxO1xuICAgIGJhbmsgPSBiYW5rc1tuZXh0QmFua0luZGV4ICUgKGJhbmtzLmxlbmd0aCArIDEpXTtcbiAgfVxuXG4gIGlmIChiYW5rKSB7XG4gICAgc3RhdGUuYWN0aXZlQmFuayA9IGJhbms7XG4gICAga2V5LnNldEJhbmsoc3RhdGUuYWN0aXZlQmFuayk7XG4gICAga2V5LnR1cm5PbigpO1xuICB9IGVsc2Uge1xuICAgIGtleS50dXJuT2ZmKCk7XG4gIH1cblxuICBhbHRlclN0YXRlKGtleSk7XG59XG5cbnZhciBwbGF5aW5nID0ge307XG5cbnZhciBBQyA9IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQgfHwgd2luZG93LkF1ZGlvQ29udGV4dDtcbnZhciBhdWRpbyA9IG5ldyBBQztcbndpbmRvdy5zYW1wbGVSYXRlID0gYXVkaW8uc2FtcGxlUmF0ZTtcblxudmFyIGJwbSA9IDYwO1xudmFyIHNvdXJjZXMgPSB7fTtcbnZhciBiZWF0VGltZTtcblxuY2xvY2soKTtcblxuZnVuY3Rpb24gY2xvY2soKSB7XG4gIGJlYXRUaW1lID0gMSAvIChicG0gLyA2MCk7XG59XG5cbmphenoub24oJ2lucHV0JywgZGVib3VuY2UoKCkgPT4ge1xuICBjb25zb2xlLmxvZygncmVhZCBpbnB1dCcpO1xuICB2YXIgdGV4dCA9IGphenouYnVmZmVyLnRleHQudG9TdHJpbmcoKTtcbiAgbG9jYWxTdG9yYWdlLnRleHQgPSB0ZXh0O1xuICBidWlsZChudWxsLCB0ZXh0KTtcbn0sIDcwMCkpO1xuXG5mdW5jdGlvbiBkZWJvdW5jZShmbiwgbXMpIHtcbiAgdmFyIHRpbWVvdXQ7XG4gIHJldHVybiBmdW5jdGlvbiBkZWJvdW5jZVdyYXAoKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZuLCBtcyk7XG4gIH07XG59XG5cbnZhciBjYWxsYmFja3MgPSBbXTtcbnZhciBjYWxsYmFja0lkID0gMDtcblxudmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoJ3dvcmtlci5qcycpO1xuXG53b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gb25tZXNzYWdlKGUpIHtcbiAgdmFyIHBhcmFtcyA9IGUuZGF0YTtcbiAgY29uc29sZS5sb2coJ3JlY2VpdmVkIHBhcmFtcycsIHBhcmFtcylcbiAgaWYgKHBhcmFtcyA9PT0gdHJ1ZSkgcmV0dXJuO1xuICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBwYXJhbXMpIHtcbiAgICBicG0gPSBwYXJhbXM7XG4gICAgY2xvY2soKTtcbiAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgYnBtJywgYnBtKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2cocGFyYW1zLCBjYWxsYmFja3MpXG4gIHZhciB0aW1lID0gRGF0ZS5ub3coKSAtIHBhcmFtcy50aW1lc3RhbXA7XG4gIHZhciBjYiA9IGNhbGxiYWNrc1twYXJhbXMuaWRdO1xuICBkZWxldGUgY2FsbGJhY2tzW3BhcmFtcy5pZF07XG4gIGNiKHBhcmFtcy5lcnJvciwgcGFyYW1zKTtcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkKGVyciwganMpIHtcbiAgY29uc29sZS5sb2coJ2J1aWxkaW5nJyk7XG5cbiAgaWYgKGVycikgdGhyb3cgZXJyO1xuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgaWYgKGVycikgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICBlbHNlIGNvbXBpbGUocmVzdWx0KTtcbiAgfTtcblxuICBjYWxsYmFja3NbKytjYWxsYmFja0lkXSA9IGNiO1xuICB3b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgIHByb2NlZHVyZU5hbWU6ICdjb21waWxlJyxcbiAgICBpZDogY2FsbGJhY2tJZCxcbiAgICBhcmdzOiBbanNdLFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICB9KTtcbn1cblxudmFyIGNiID0gZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgYnVpbGQobnVsbCwgamF6ei5idWZmZXIudGV4dC50b1N0cmluZygpKTtcbn07XG5cbmNhbGxiYWNrc1srK2NhbGxiYWNrSWRdID0gY2I7XG5cbndvcmtlci5wb3N0TWVzc2FnZSh7XG4gIHByb2NlZHVyZU5hbWU6ICdzZXR1cCcsXG4gIGlkOiBjYWxsYmFja0lkLFxuICBhcmdzOiBbeyBzYW1wbGVSYXRlOiBhdWRpby5zYW1wbGVSYXRlIH1dLFxuICB0aW1lc3RhbXA6IERhdGUubm93KClcbn0pO1xuXG5mdW5jdGlvbiBjYWxjT2Zmc2V0VGltZShidWZmZXIpIHtcbiAgcmV0dXJuIGF1ZGlvLmN1cnJlbnRUaW1lICUgKGJ1ZmZlci5sZW5ndGggLyBhdWRpby5zYW1wbGVSYXRlIHwgMCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGUoYnVmZmVycykge1xuICBjb25zb2xlLmxvZygnbG9jYWwgY29tcGlsZScsIGJ1ZmZlcnMpO1xuICB2YXIgcmVzdGFydFNvdW5kcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gc291bmRzKSB7XG4gICAgdmFyIHNvdW5kS2V5ID0gc291bmRzW2tleV07XG4gICAgaWYgKHNvdW5kS2V5LmFjdGl2ZSkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbc291bmRLZXkubmFtZV1bc291bmRLZXkuYmFuay5uYW1lXTtcbiAgICAgIGlmIChzb3VyY2UuYnVmZmVyKSB7XG4gICAgICAgIHJlc3RhcnRTb3VuZHMucHVzaChzb3VuZEtleSk7XG4gICAgICAgIHNvdW5kS2V5LnN5bmNUaW1lID0gY2FsY1N5bmNUaW1lKHNvdXJjZS5tdWx0aXBsaWVyKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3A6Jywgc291bmRLZXkubmFtZSk7XG4gICAgICAgIHNvdXJjZS5zdG9wKHNvdW5kS2V5LnN5bmNUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGJ1ZmZlcnMpIHtcbiAgICBpZiAoJ2lkJyA9PT0ga2V5IHx8ICd0aW1lc3RhbXAnID09PSBrZXkpIGNvbnRpbnVlO1xuICAgIC8vIHNvdXJjZXNba2V5XSA9IGNyZWF0ZUJhbmtTb3VyY2VzKGtleSwgYnVmZmVyc1trZXldKTtcbiAgICB2YXIgc291cmNlID0gc291cmNlc1trZXldO1xuICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5XSA9IGNyZWF0ZUJhbmtTb3VyY2VzKGtleSwgYnVmZmVyc1trZXldKTtcbiAgICAvLyBmb3IgKHZhciBiID0gMDsgYiA8IDM7IGIrKykge1xuICAgIC8vICAgc291cmNlW2JdLmJ1ZmZlciA9IGF1ZGlvLmNyZWF0ZUJ1ZmZlcigyLCBidWZmZXJzW2tleV1bYl1bMF0ubGVuZ3RoLCBhdWRpby5zYW1wbGVSYXRlKTtcbiAgICAvLyAgIHNvdXJjZVtiXS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCkuc2V0KGJ1ZmZlcnNba2V5XVtiXVswXSk7XG4gICAgLy8gICBzb3VyY2VbYl0uYnVmZmVyLmdldENoYW5uZWxEYXRhKDEpLnNldChidWZmZXJzW2tleV1bYl1bMV0pO1xuICAgIC8vIH1cbiAgICBzb3VyY2UubXVsdGlwbGllciA9IGJ1ZmZlcnNba2V5XS5tdWx0aXBsaWVyIHx8IDQ7XG4gIH1cbiAgcmVzdGFydFNvdW5kcy5mb3JFYWNoKHNvdW5kS2V5ID0+IHtcbiAgICB2YXIgc291cmNlID0gc291cmNlc1tzb3VuZEtleS5uYW1lXVtzb3VuZEtleS5iYW5rLm5hbWVdO1xuICAgIGNvbnNvbGUubG9nKCdzdGFydDonLCBzb3VuZEtleS5uYW1lKTtcbiAgICBzb3VyY2Uuc3RhcnQoc291bmRLZXkuc3luY1RpbWUpOyAvLywgY2FsY09mZnNldFRpbWUoc291cmNlLmJ1ZmZlcikpO1xuICB9KTtcbn1cblxuYWxsS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gIHNvdXJjZXNba2V5XSA9IGNyZWF0ZUJhbmtTb3VyY2VzKGtleSk7XG4gIHNvdXJjZXNba2V5XS5tdWx0aXBsaWVyID0gNDtcbn0pO1xuXG5idWlsZChudWxsLCBsb2NhbFN0b3JhZ2UudGV4dCB8fCBqYXp6LmJ1ZmZlci50ZXh0LnRvU3RyaW5nKCkpO1xuXG5mdW5jdGlvbiBjcmVhdGVCYW5rU291cmNlcyhrZXksIGJ1ZmZlcnMpIHtcbiAgY29uc29sZS5sb2coJ2NyZWF0ZSBiYW5rIHNvdXJjZXMnLCBrZXkpO1xuICB2YXIgc291cmNlcyA9IFtdO1xuICBmb3IgKHZhciBiID0gMDsgYiA8IDM7IGIrKykge1xuICAgIHZhciBzb3VyY2UgPSBhdWRpby5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICBzb3VyY2UubG9vcCA9IHRydWU7XG4gICAgc291cmNlLm9uZW5kZWQgPSBkaXNjb25uZWN0O1xuICAgIGlmIChidWZmZXJzKSB7XG4gICAgICBzb3VyY2UuYnVmZmVyID0gYXVkaW8uY3JlYXRlQnVmZmVyKDIsIGJ1ZmZlcnNbYl1bMF0ubGVuZ3RoLCBhdWRpby5zYW1wbGVSYXRlKTtcbiAgICAgIHNvdXJjZS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCkuc2V0KGJ1ZmZlcnNbYl1bMF0pO1xuICAgICAgc291cmNlLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSgxKS5zZXQoYnVmZmVyc1tiXVsxXSk7XG4gICAgfVxuICAgIHNvdXJjZS5jb25uZWN0KGF1ZGlvLmRlc3RpbmF0aW9uKTtcbiAgICBzb3VyY2VzLnB1c2goc291cmNlKTtcbiAgfVxuICByZXR1cm4gc291cmNlcztcbn1cblxuZnVuY3Rpb24gY2FsY1N5bmNUaW1lKG11bHRpcGxpZXIpIHtcbiAgcmV0dXJuIG5vcm1hbGl6ZShcbiAgICBhdWRpby5jdXJyZW50VGltZSArXG4gICAgKG11bHRpcGxpZXIgKiBiZWF0VGltZSAtXG4gICAgKGF1ZGlvLmN1cnJlbnRUaW1lICUgKG11bHRpcGxpZXIgKiBiZWF0VGltZSkpKVxuICApO1xufVxuXG5mdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICB0aGlzLmRpc2Nvbm5lY3QoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKG51bWJlcikge1xuICByZXR1cm4gbnVtYmVyID09PSBJbmZpbml0eSB8fCBudW1iZXIgPT09IC1JbmZpbml0eSB8fCBpc05hTihudW1iZXIpID8gMCA6IG51bWJlcjtcbn1cblxuXG5mdW5jdGlvbiBhbHRlclN0YXRlKGtleSkge1xuICBpZiAoa2V5LmFjdGl2ZSkgcGxheShrZXkpO1xuICBlbHNlIHN0b3Aoa2V5KTtcbn1cblxuZnVuY3Rpb24gcGxheShrZXkpIHtcbiAgaWYgKGtleS5uYW1lIGluIHNvdXJjZXMpIHtcbiAgICB2YXIgc3luY1RpbWUgPSBjYWxjU3luY1RpbWUoc291cmNlc1trZXkubmFtZV0ubXVsdGlwbGllcik7XG4gICAgdmFyIHNvdXJjZTtcbiAgICB0cnkge1xuICAgICAgaWYgKGtleS5wcmV2QmFuaykge1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2VzW2tleS5uYW1lXVtrZXkucHJldkJhbmsubmFtZV07XG4gICAgICAgIHZhciBidWZmZXIgPSBzb3VyY2UuYnVmZmVyO1xuICAgICAgICBzb3VyY2Uuc3RvcChzeW5jVGltZSk7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5Lm5hbWVdW2tleS5wcmV2QmFuay5uYW1lXSA9IGF1ZGlvLmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgICAgICBzb3VyY2UubG9vcCA9IHRydWU7XG4gICAgICAgIHNvdXJjZS5vbmVuZGVkID0gZGlzY29ubmVjdDtcbiAgICAgICAgc291cmNlLmNvbm5lY3QoYXVkaW8uZGVzdGluYXRpb24pO1xuICAgICAgICBzb3VyY2UuYnVmZmVyID0gYnVmZmVyO1xuICAgICAgfVxuICAgIH0gY2F0Y2goZSkge31cbiAgICBzb3VyY2UgPSBzb3VyY2VzW2tleS5uYW1lXVtrZXkuYmFuay5uYW1lXTtcbiAgICBjb25zb2xlLmxvZygnc3RhcnQ6Jywgc291cmNlKTtcbiAgICBzb3VyY2Uuc3RhcnQoc3luY1RpbWUpO1xuICB9XG59XG5cbmZ1bmN0aW9uIHN0b3Aoa2V5KSB7XG4gIGlmIChrZXkubmFtZSBpbiBzb3VyY2VzKSB7XG4gICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNba2V5Lm5hbWVdO1xuICAgIHZhciBzeW5jVGltZSA9IGNhbGNTeW5jVGltZShzb3VyY2UubXVsdGlwbGllcik7XG4gICAgc291cmNlW2tleS5iYW5rLm5hbWVdLnN0b3Aoc3luY1RpbWUpO1xuICB9XG4gIGNvbnNvbGUubG9nKCdzdG9wJywga2V5Lm5hbWUpO1xufVxuXG5mdW5jdGlvbiB0b2dnbGVQYW5lbCgpIHtcbiAgZWxlbWVudHNbZm9jdXNdLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzJyk7XG4gIGZvY3VzID0gb3RoZXJbZm9jdXNdO1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LmFkZCgnZm9jdXMnKTtcbiAgaWYgKGZvY3VzID09PSAnZWRpdG9yJykge1xuICAgIGphenouZm9jdXMoKTtcbiAgfSBlbHNlIHtcbiAgICBqYXp6LmJsdXIoKTtcbiAgfVxufVxuIl19
