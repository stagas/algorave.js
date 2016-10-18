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

PadKey.prototype.turnOn = function() {
  this.el.classList.add('active');
  this.active = true;
};

PadKey.prototype.turnOff = function() {
  this.el.classList.remove('active');
  this.active = false;
};

PadKey.prototype.toggle = function() {
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

SoundKey.prototype.setBank = function(bank) {
  if (this.bank) this.el.classList.remove('bank-' + this.bank.name);
  this.prevBank = this.bank;
  this.bank = bank;
  this.el.classList.add('bank-' + this.bank.name);
};

var keyboard = [
  '1234567890'.split(''),
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split(''),
];

var sounds = {};
var banks = [];

var allKeys = keyboard.reduce((p, n) => p.concat(n));

var containerElement = document.createElement('div');
containerElement.className = 'container';
document.body.appendChild(containerElement);

var columnLeft = document.createElement('div');
columnLeft.className = 'column-left';

var columnRight = document.createElement('div');
columnRight.className = 'column-right';

document.body.appendChild(columnLeft);
document.body.appendChild(columnRight);

var editorElement = document.createElement('div');
editorElement.className = 'editor';

var jazzElement = document.createElement('div');
jazzElement.className = 'jazz';

var jazzOptions = {
  theme: 'redbliss',
  font_size: '9pt',
};
var jazz = new Jazz(jazzOptions);

jazz.set(localStorage.text || `\
let { sin, Sin, Saw, Tri, Sqr, Chord, Chords, softClip:clip, note, envelope, Korg35LPF, DiodeFilter, MoogLadder } = studio;
let { Bassline } = extended;

// patches: a d k l m o p q s x

export let bpm = 120;
let progr = ['Fmaj7','Bmaj9','D9','G#min7'].map(Chords);
let progr_2 = ['Cmin','D#min','Fmin','Amin'].map(Chords);

export let k = [4, function kick(t) {
  var vol = .6;
  return {
    0: arp(t, 1/4, 50, 30, 8) * vol,
    1: arp(t, 1/4, 56, 32, 8) * vol,
    2: arp(t, 1/4, 59, 28, 4) * vol,
    3: arp(t, 1/4, 62, 34, 4) * vol,
  };
}];

export let l = [4, function hihat(t) {
  var vol = .1;
  return {
    0: arp(t+1/2, 1/4, Math.random() * 5550, 1600, 350) * vol,
    1: arp(t+1/2, 1/4, Math.random() * 5550, 2600, 350) * vol,
    2: arp(t+1/2, 1/4, Math.random() * 5550, 3600, 350) * vol,
    3: arp(t+1/2, 1/4, Math.random() * 5550, 4000, 350) * vol,
  };
}];

export let r = [4, function(t) {
   return {
     0: (sin(t, note(progr[1][0])*.9)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),
     1: (sin(t, note(progr[1][0])*.8)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),
     2: (sin(t, note(progr[1][0])*1.2)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),
     3: (sin(t, note(progr[1][0])*1.5)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),
   };
}];

var bass_a0 = new Bassline();
var bass_a1 = new Bassline();
var bass_a2 = new Bassline();
var bass_a3 = new Bassline();
bass_a0.seq(progr[0].map(note).map(n=>n*4)).cut(.15).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);
bass_a1.seq(progr[1].map(note).map(n=>n*4)).cut(.18).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);
bass_a2.seq(progr[2].map(note).map(n=>n*4)).cut(.25).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);
bass_a3.seq(progr[3].map(note).map(n=>n*4)).cut(.25).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);

export let a = [4, function bass_a(t) {
  var vol = .4;
  return {
    0: bass_a0.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,
    1: bass_a1.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,
    2: bass_a2.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,
    3: bass_a3.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,
  };
}];

var bass_d0 = new Bassline();
var bass_d1 = new Bassline();
var bass_d2 = new Bassline();
var bass_d3 = new Bassline();
bass_d0.seq(progr_2[0].map(note).map(n=>n*4)).cut(.15).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);
bass_d1.seq(progr_2[1].map(note).map(n=>n*4)).cut(.18).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);
bass_d2.seq(progr_2[2].map(note).map(n=>n*4)).cut(.25).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);
bass_d3.seq(progr_2[3].map(note).map(n=>n*4)).cut(.25).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);

export let d = [4, function bass_d(t) {
  var vol = .7;
  return {
    0: bass_d0.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,
    1: bass_d1.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,
    2: bass_d2.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,
    3: bass_d3.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,
  };
}];

var synth_osc_0 = Tri(32, true);
var synth_osc_1 = Tri(32, true);
var synth_osc_2 = Tri(32, true);
var synth_osc_3 = Tri(32, true);
export let o = [4, function synth(t) {
  var vol = .3;
  return {
    0: synth_osc_0(note(progr[(t%4)|0][(t*4%3)|0])) * envelope(t+1/2, 1/4, 5, 4) * vol,
    1: synth_osc_1(note(progr[(t%4)|0][(t*4%3)|0])*2) * envelope(t+1/2, 1/4, 5, 4) * vol,
    2: synth_osc_2(note(progr[(t%4)|0][(t*4%3)|0])*4) * envelope(t+1/2, 1/4, 5, 4) * vol,
    3: synth_osc_3(note(progr[(t%4)|0][(t*4%3)|0])*8) * envelope(t+1/2, 1/4, 5, 4) * vol,
  };
}];

var pad_osc_0 = Chord(Saw, 128, true);
var pad_osc_1 = Chord(Saw, 128, true);
var pad_osc_2 = Chord(Saw, 128, true);
var pad_osc_3 = Chord(Saw, 128, true);

var filter_pad_0 = Korg35LPF();
var filter_pad_1 = Korg35LPF();
var filter_pad_2 = Korg35LPF();
var filter_pad_3 = Korg35LPF();
filter_pad_0.cut(500).res(2.1).sat(2.1);
filter_pad_1.cut(500).res(2.1).sat(2.1);
filter_pad_2.cut(500).res(2.1).sat(2.1);
filter_pad_3.cut(500).res(2.1).sat(2.1);

export let p = [4, function pad(t) {
  var vol = .3;
  var c = progr[t%4|0];
  var out_0 = pad_osc_0(c.map(note).map(n=>n*2)) * envelope(t, 1/4, 5, 4) * vol;
  var out_1 = pad_osc_1(c.map(note).map(n=>n*4)) * envelope(t, 1/4, 5, 4) * vol;
  var out_2 = pad_osc_2(c.map(note).map(n=>n*8)) * envelope(t, 1/4, 5, 4) * vol;
  var out_3 = pad_osc_2(c.map(note).map(n=>n*8)) * envelope(t, 1/4, 5, 4) * vol;
  return {
    0: filter_pad_0.run(out_0),
    1: filter_pad_1.run(out_1),
    2: filter_pad_2.run(out_2),
    3: filter_pad_3.run(out_3),
  };
}];

var pad_osc_m0 = Chord(Sqr, 128, true);
var pad_osc_m1 = Chord(Sqr, 128, true);
var pad_osc_m2 = Chord(Sqr, 128, true);
var pad_osc_m3 = Chord(Sqr, 128, true);

var filter_pad_m0 = Korg35LPF();
var filter_pad_m1 = Korg35LPF();
var filter_pad_m2 = Korg35LPF();
var filter_pad_m3 = Korg35LPF();
filter_pad_m0.cut(200).res(2.1).sat(2.1);
filter_pad_m1.cut(200).res(2.1).sat(2.1);
filter_pad_m2.cut(200).res(2.1).sat(2.1);
filter_pad_m3.cut(200).res(2.1).sat(2.1);

var lfo_m = Sin();

export let m = [4, function pad(t) {
  var vol = .5;
  var c = progr_2[(t*3)%3|0];
  var out_0 = pad_osc_m0(c.map(note).map(n=>n*4)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);
  var out_1 = pad_osc_m1(c.map(note).map(n=>n*6)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);
  var out_2 = pad_osc_m2(c.map(note).map(n=>n*8)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);
  var out_3 = pad_osc_m3(c.map(note).map(n=>n*8)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);
  return {
    0: filter_pad_m0.run(out_0),
    1: filter_pad_m1.run(out_1),
    2: filter_pad_m2.run(out_2),
    3: filter_pad_m3.run(out_3),
  };
}];

var chip_osc_0 = Tri(10, false);
var chip_osc_1 = Tri(10, false);
var chip_osc_2 = Tri(10, false);
var chip_osc_3 = Tri(10, false);

export let s = [8, function chip(t) {
  var c = note(progr[0][t%progr[0].length|0])*8;
  return {
    0: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),
    1: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),
    2: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),
    3: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_3(c*8)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),
  }
}];

var chip_osc_x0 = Tri(10, true);
var chip_osc_x1 = Tri(10, true);
var chip_osc_x2 = Tri(10, true);
var chip_osc_x3 = Tri(10, true);

export let x = [8, function chip(t) {
  var c = note(progr_2[0][t%progr_2[0].length|0])*8;
  var vol = .5;
  return {
    0: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),
    1: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),
    2: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),
    3: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x2(c*8)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),
  }
}];

var moog_lpf_q0 = MoogLadder('half');
var moog_lpf_q1 = MoogLadder('half');
var moog_lpf_q2 = MoogLadder('half');
var moog_lpf_q3 = MoogLadder('half');

var moog_osc_q0 = Saw();
var moog_osc_q1 = Saw();
var moog_osc_q2 = Saw();
var moog_osc_q3 = Saw();

var moog_lfo_q0 = Sin();
var moog_lfo_q1 = Sin();
var moog_lfo_q2 = Sin();
var moog_lfo_q3 = Sin();

export let q = [8, function moog(t){
  t/=2

  var c = progr[(t%progr.length|0)];
  var out_0 = moog_osc_q0(note(c[t*4%3|0])*2);
  var out_1 = moog_osc_q1(note(c[t*4%3|0])*4);
  var out_2 = moog_osc_q2(note(c[t*4%3|0])*8);
  var out_3 = moog_osc_q3(note(c[t*4%3|0])*8);

  moog_lpf_q0
    .cut(700 + (650 * moog_lfo_q0(0.5)))
    .res(0.87)
    .sat(2.15)
    .update();

  moog_lpf_q1
    .cut(1000 + (950 * moog_lfo_q1(1)))
    .res(0.87)
    .sat(2.15)
    .update();

  moog_lpf_q2
    .cut(1300 + (1250 * moog_lfo_q2(0.25)))
    .res(0.87)
    .sat(2.15)
    .update();

  moog_lpf_q3
    .cut(1300 + (1250 * moog_lfo_q2(0.25)))
    .res(0.87)
    .sat(2.15)
    .update();

  out_0 = moog_lpf_q0.run(out_0);
  out_1 = moog_lpf_q1.run(out_1);
  out_2 = moog_lpf_q2.run(out_2);
  out_3 = moog_lpf_q3.run(out_3);

  var vol = .3;

  return {
    0: out_0 * vol,
    1: out_1 * vol,
    2: out_2 * vol,
    3: out_3 * vol,
  };
}];
`, 'dsp.js');

editorElement.appendChild(jazzElement);

columnLeft.appendChild(editorElement);

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
    key.el.onmousedown =
    key.label.onmousedown =
    key.label.ontouchstart = debounce((function(key) {
      return e => {
        nextBank(key);
        e.preventDefault();
        return false
      }
    }(key)), 200);
  }
  keyboardElement.appendChild(rowElement);
}

var lastTouchKey = null;
var debounceLastTouchKey;

keyboardElement.ontouchstart =
keyboardElement.ontouchmove =
keyboardElement.ontouchenter = function handler(e) {
  e.stopPropagation();
  e.preventDefault();
  if (!e.touches) {
    e.touches = [ {touch: [e]} ];
    return;
  }
  for (var i = 0; i < e.touches.length; i++) {
    var touch = e.touches[i];
    for (var char in sounds) {
      var key = sounds[char];
      if ( touch.clientX > key.pos.left && touch.clientX <= key.pos.left + key.pos.width
        && touch.clientY > key.pos.top && touch.clientY <= key.pos.top + key.pos.height
        && lastTouchKey !== key
      ) {
        nextBank(key);
        lastTouchKey = key;
      }
    }
  }
};

keyboardElement.ontouchstart = function handler(e) {
  if (!e.touches) {
    e.touches = [ {touch: [e]} ]
    return;
  }
  lastTouchKey = null;
  for (var i = 0; i < e.touches.length; i++) {
    var touch = e.touches[i];
    for (var char in sounds) {
      var key = sounds[char];
      if ( touch.clientX > key.pos.left && touch.clientX <= key.pos.left + key.pos.width
        && touch.clientY > key.pos.top && touch.clientY <= key.pos.top + key.pos.height
        && lastTouchKey !== key
      ) {
        nextBank(key);
        lastTouchKey = key;
      }
    }
  }
};

keyboardContainerElement.appendChild(keyboardElement);

var XYs = ['a','b'].map(createXYController);
var XYContainer = document.createElement('div');
XYContainer.className = 'xy-container';

XYContainer.ontouchstart =
XYContainer.ontouchenter =
XYContainer.ontouchmove =
XYContainer.onmousemove = e => {
  e.stopPropagation();
  e.preventDefault();

  if (!e.touches) {
    e.touches = [e];
  }

  for (var i = 0; i < e.touches.length; i++) {
    var touch = e.touches[i];
    for (var j = 0; j < XYs.length; j++) {
      var xy = XYs[j];
      // if (xy.active === false) continue;
      if ( touch.clientX > xy.pos.left && touch.clientX < xy.pos.left + xy.pos.width
        && touch.clientY > xy.pos.top && touch.clientY < xy.pos.top + xy.pos.height
        ) {      
        Object.assign(xy.spot.style, {
          left: touch.clientX - xy.pos.left + 'px',
          top: touch.clientY - xy.pos.top + 'px'
        });
      }
    }
  }
};

function createXYController(n) {
  var xy = {};

  var el = document.createElement('div');
  el.className = 'xy-controller xy-' + n;

  var spot = document.createElement('div');
  spot.className = 'xy-spot';

  el.appendChild(spot);
  var center = document.createElement('span');
  el.appendChild(center);

  el.ontouchleave = e => {
    xy.active = false;
  };

  document.body.addEventListener('mouseup', el.ontouchleave);

  el.onmousedown = e => {
    xy.active = true;
  };

  xy.el = el;
  xy.spot = spot;

  return xy;
}

XYs.forEach(xy => XYContainer.appendChild(xy.el));

columnRight.appendChild(XYContainer);

columnLeft.appendChild(keyboardContainerElement);

var elements = {
  'editor': editorElement,
  'keyboard': keyboardElement
};
var focus = 'keyboard';
var other = {
  'editor': 'keyboard',
  'keyboard': 'editor',
};

elements[focus].classList.add('focus');

jazz.blur();

jazz.input.text.el.style.height = '50%';

jazz.on('focus', () => {
  elements[focus].classList.remove('focus');
  focus = 'editor';
  elements[focus].classList.add('focus');
});

jazz.on('blur', () => {
  elements[focus].classList.remove('focus');
  focus = 'keyboard';
  elements[focus].classList.add('focus');
});

// });

document.body.onkeyup = e => {
  if (e.key === 'Shift') {
    state.triggerBank = false;
  }
}

document.body.onkeydown = e => {
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
    if (char === '!') char = '1';
    else if (char === '@') char = '2';
    else if (char === '#') char = '3';
    else if (char === '$') char = '4';
    else if (char === '%') char = '5';
    else if (char === '^') char = '6';
    else if (char === '&') char = '7';
    else if (char === '*') char = '8';
    else if (char === '(') char = '9';
    else if (char === ')') char = '0';
  }
  var charCode = char.toLowerCase().charCodeAt(0);
  var key = sounds[charCode];
  if (e.shiftKey) {
    key.turnOff();
  } else {
    nextBank(key);
  }
};

for (var i = 0; i < 4; i++) {
  banks.push(new Bank(i));
}

function getKeysPositions() {
  for (var char in sounds) {
    var key = sounds[char];
    key.pos = key.el.getBoundingClientRect();
  }
}

function getXYPositions() {
  XYs.forEach(xy => xy.pos = xy.el.getBoundingClientRect());  
}

var prevHeight = 0;

getKeysPositions();
getXYPositions();

window.onscroll = e => {
  e.preventDefault();
  return false;
};

window.onresize = e => {
  getKeysPositions();
  getXYPositions();
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
var audio = new AC;
window.sampleRate = audio.sampleRate;

var bpm = 60;
var sources = {};
var beatTime;

clock();

function clock() {
  beatTime = 1 / (bpm / 60);
}

jazz.on('input', debounce(() => {
  console.log('read input');
  var text = jazz.buffer.text.toString();
  localStorage.text = text;
  build(null, text);
}, 700));

function debounce(fn, ms) {
  var timeout;
  return function debounceWrap(a, b, c) {
    clearTimeout(timeout);
    timeout = setTimeout(fn, ms, a, b, c);
  };
}

var callbacks = [];
var callbackId = 0;

var worker = new Worker('worker.js');

worker.onmessage = function onmessage(e) {
  var params = e.data;
  console.log('received params', params)
  if (params === true) return;
  if ('number' === typeof params) {
    bpm = params;
    clock();
    console.log('received bpm', bpm);
    return;
  }
  console.log(params, callbacks)
  var time = Date.now() - params.timestamp;
  var cb = callbacks[params.id];
  delete callbacks[params.id];
  cb(params.error, params);
};

function build(err, js) {
  console.log('building');

  if (err) throw err;

  var cb = function(err, result) {
    if (err) console.log(err.stack);
    else compile(result);
  };

  callbacks[++callbackId] = cb;
  worker.postMessage({
    procedureName: 'compile',
    id: callbackId,
    args: [js],
    timestamp: Date.now()
  });
}

var cb = function(err, result) {
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
  var oldSources = Object.assign({}, sources)
  for (var key in buffers) {
    if ('id' === key || 'timestamp' === key) continue;
    var source = sources[key];
    source = sources[key] = createBankSources(key, buffers[key]);
    source.multiplier = buffers[key].multiplier || 4;
    console.log('key', key, sources[key])
    var soundKey = sounds[key.charCodeAt(0)];
    console.log('sound key', soundKey);
    if (soundKey.active) {
      soundKey.syncTime = calcSyncTime(source.multiplier);
      oldSources[key][soundKey.bank.name].stop(soundKey.syncTime);
      source[soundKey.bank.name].start(soundKey.syncTime);
    }
  }
}

allKeys.forEach(key => {
  sources[key] = createBankSources(key);
  sources[key].multiplier = 4;
});

build(null, localStorage.text || jazz.buffer.text.toString());

function createBankSources(key, buffers) {
  console.log('create bank sources', key);
  var sources = [];
  for (var b = 0; b < 4; b++) {
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
  return normalize(
    audio.currentTime +
    (multiplier * beatTime -
    (audio.currentTime % (multiplier * beatTime)))
  );
}

function calcSyncOffset(multiplier) {
  return normalize();
}

function disconnect() {
  this.disconnect();
}

function normalize(number) {
  return number === Infinity || number === -Infinity || isNaN(number) ? 0 : number;
}

function alterState(key) {
  if (key.active) play(key);
  else stop(key);
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
    } catch(e) {
      console.log('cannot create source', key, e)
    }
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
