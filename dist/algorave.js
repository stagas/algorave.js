(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.algorave = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

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

jazz.set(localStorage.text || 'let { sin, Sin, Saw, Tri, Sqr, Chord, Chords, softClip:clip, note, envelope, Korg35LPF, DiodeFilter, MoogLadder } = studio;\nlet { Bassline } = extended;\n\n// patches: a d k l m o p q s x\n\nexport let bpm = 120;\nlet progr = [\'Fmaj7\',\'Bmaj9\',\'D9\',\'G#min7\'].map(Chords);\nlet progr_2 = [\'Cmin\',\'D#min\',\'Fmin\',\'Amin\'].map(Chords);\n\nexport let r = [4, function(t) {\n   return {\n     0: (sin(t, note(progr[1][0])*.9)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n     1: (sin(t, note(progr[1][0])*.8)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n     2: (sin(t, note(progr[1][0])*1.2)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n     3: (sin(t, note(progr[1][0])*1.5)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n   };\n}];\n\nvar bass_a0 = new Bassline();\nvar bass_a1 = new Bassline();\nvar bass_a2 = new Bassline();\nvar bass_a3 = new Bassline();\nbass_a0.seq(progr[0].map(note).map(n=>n*4)).cut(.15).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a1.seq(progr[1].map(note).map(n=>n*4)).cut(.18).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a2.seq(progr[2].map(note).map(n=>n*4)).cut(.25).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a3.seq(progr[3].map(note).map(n=>n*4)).cut(.25).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\n\nexport let a = [4, function bass_a(t) {\n  var vol = .4;\n  return {\n    0: bass_a0.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    1: bass_a1.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    2: bass_a2.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    3: bass_a3.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n  };\n}];\n\nvar bass_d0 = new Bassline();\nvar bass_d1 = new Bassline();\nvar bass_d2 = new Bassline();\nvar bass_d3 = new Bassline();\nbass_d0.seq(progr_2[0].map(note).map(n=>n*4)).cut(.15).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d1.seq(progr_2[1].map(note).map(n=>n*4)).cut(.18).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d2.seq(progr_2[2].map(note).map(n=>n*4)).cut(.25).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d3.seq(progr_2[3].map(note).map(n=>n*4)).cut(.25).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\n\nexport let d = [4, function bass_d(t) {\n  var vol = .7;\n  return {\n    0: bass_d0.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    1: bass_d1.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    2: bass_d2.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    3: bass_d3.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n  };\n}];\n\n\nexport let k = [4, function kick(t) {\n  var vol = .6;\n  return {\n    0: arp(t, 1/4, 50, 30, 8) * vol,\n    1: arp(t, 1/4, 60, 30, 8) * vol,\n    2: arp(t, 1/4, 40, 30, 8) * vol,\n    3: arp(t, 1/4, 44, 30, 8) * vol,\n  };\n}];\n\nexport let l = [4, function hihat(t) {\n  var vol = .1;\n  return {\n    0: arp(t+1/2, 1/4, Math.random() * 5550, 1600, 350) * vol,\n    1: arp(t+1/2, 1/4, Math.random() * 5550, 2600, 350) * vol,\n    2: arp(t+1/2, 1/4, Math.random() * 5550, 3600, 350) * vol,\n    3: arp(t+1/2, 1/4, Math.random() * 5550, 4000, 350) * vol,\n  };\n}];\n\nvar synth_osc_0 = Tri(32, true);\nvar synth_osc_1 = Tri(32, true);\nvar synth_osc_2 = Tri(32, true);\nvar synth_osc_3 = Tri(32, true);\nexport let o = [4, function synth(t) {\n  var vol = .3;\n  return {\n    0: synth_osc_0(note(progr[(t%4)|0][(t*4%3)|0])) * envelope(t+1/2, 1/4, 5, 4) * vol,\n    1: synth_osc_1(note(progr[(t%4)|0][(t*4%3)|0])*2) * envelope(t+1/2, 1/4, 5, 4) * vol,\n    2: synth_osc_2(note(progr[(t%4)|0][(t*4%3)|0])*4) * envelope(t+1/2, 1/4, 5, 4) * vol,\n    3: synth_osc_3(note(progr[(t%4)|0][(t*4%3)|0])*8) * envelope(t+1/2, 1/4, 5, 4) * vol,\n  };\n}];\n\nvar pad_osc_0 = Chord(Saw, 128, true);\nvar pad_osc_1 = Chord(Saw, 128, true);\nvar pad_osc_2 = Chord(Saw, 128, true);\nvar pad_osc_3 = Chord(Saw, 128, true);\n\nvar filter_pad_0 = Korg35LPF();\nvar filter_pad_1 = Korg35LPF();\nvar filter_pad_2 = Korg35LPF();\nvar filter_pad_3 = Korg35LPF();\nfilter_pad_0.cut(500).res(2.1).sat(2.1);\nfilter_pad_1.cut(500).res(2.1).sat(2.1);\nfilter_pad_2.cut(500).res(2.1).sat(2.1);\nfilter_pad_3.cut(500).res(2.1).sat(2.1);\n\nexport let p = [4, function pad(t) {\n  var vol = .3;\n  var c = progr[t%4|0];\n  var out_0 = pad_osc_0(c.map(note).map(n=>n*2)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_1 = pad_osc_1(c.map(note).map(n=>n*4)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_2 = pad_osc_2(c.map(note).map(n=>n*8)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_3 = pad_osc_2(c.map(note).map(n=>n*8)) * envelope(t, 1/4, 5, 4) * vol;\n  return {\n    0: filter_pad_0.run(out_0),\n    1: filter_pad_1.run(out_1),\n    2: filter_pad_2.run(out_2),\n    3: filter_pad_3.run(out_3),\n  };\n}];\n\nvar pad_osc_m0 = Chord(Sqr, 128, true);\nvar pad_osc_m1 = Chord(Sqr, 128, true);\nvar pad_osc_m2 = Chord(Sqr, 128, true);\nvar pad_osc_m3 = Chord(Sqr, 128, true);\n\nvar filter_pad_m0 = Korg35LPF();\nvar filter_pad_m1 = Korg35LPF();\nvar filter_pad_m2 = Korg35LPF();\nvar filter_pad_m3 = Korg35LPF();\nfilter_pad_m0.cut(200).res(2.1).sat(2.1);\nfilter_pad_m1.cut(200).res(2.1).sat(2.1);\nfilter_pad_m2.cut(200).res(2.1).sat(2.1);\nfilter_pad_m3.cut(200).res(2.1).sat(2.1);\n\nvar lfo_m = Sin();\n\nexport let m = [4, function pad(t) {\n  var vol = .5;\n  var c = progr_2[(t*3)%3|0];\n  var out_0 = pad_osc_m0(c.map(note).map(n=>n*4)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_1 = pad_osc_m1(c.map(note).map(n=>n*6)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_2 = pad_osc_m2(c.map(note).map(n=>n*8)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_3 = pad_osc_m3(c.map(note).map(n=>n*8)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  return {\n    0: filter_pad_m0.run(out_0),\n    1: filter_pad_m1.run(out_1),\n    2: filter_pad_m2.run(out_2),\n    3: filter_pad_m3.run(out_3),\n  };\n}];\n\nvar chip_osc_0 = Tri(10, false);\nvar chip_osc_1 = Tri(10, false);\nvar chip_osc_2 = Tri(10, false);\nvar chip_osc_3 = Tri(10, false);\n\nexport let s = [8, function chip(t) {\n  var c = note(progr[0][t%progr[0].length|0])*8;\n  return {\n    0: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    1: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    2: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    3: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_3(c*8)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n  }\n}];\n\nvar chip_osc_x0 = Tri(10, true);\nvar chip_osc_x1 = Tri(10, true);\nvar chip_osc_x2 = Tri(10, true);\nvar chip_osc_x3 = Tri(10, true);\n\nexport let x = [8, function chip(t) {\n  var c = note(progr_2[0][t%progr_2[0].length|0])*8;\n  var vol = .5;\n  return {\n    0: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    1: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    2: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    3: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x2(c*8)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n  }\n}];\n\nvar moog_lpf_q0 = MoogLadder(\'half\');\nvar moog_lpf_q1 = MoogLadder(\'half\');\nvar moog_lpf_q2 = MoogLadder(\'half\');\nvar moog_lpf_q3 = MoogLadder(\'half\');\n\nvar moog_osc_q0 = Saw();\nvar moog_osc_q1 = Saw();\nvar moog_osc_q2 = Saw();\nvar moog_osc_q3 = Saw();\n\nvar moog_lfo_q0 = Sin();\nvar moog_lfo_q1 = Sin();\nvar moog_lfo_q2 = Sin();\nvar moog_lfo_q3 = Sin();\n\nexport let q = [8, function moog(t){\n  t/=2\n\n  var c = progr[(t%progr.length|0)];\n  var out_0 = moog_osc_q0(note(c[t*4%3|0])*2);\n  var out_1 = moog_osc_q1(note(c[t*4%3|0])*4);\n  var out_2 = moog_osc_q2(note(c[t*4%3|0])*8);\n  var out_3 = moog_osc_q3(note(c[t*4%3|0])*8);\n\n  moog_lpf_q0\n    .cut(700 + (650 * moog_lfo_q0(0.5)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  moog_lpf_q1\n    .cut(1000 + (950 * moog_lfo_q1(1)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  moog_lpf_q2\n    .cut(1300 + (1250 * moog_lfo_q2(0.25)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  moog_lpf_q3\n    .cut(1300 + (1250 * moog_lfo_q2(0.25)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  out_0 = moog_lpf_q0.run(out_0);\n  out_1 = moog_lpf_q1.run(out_1);\n  out_2 = moog_lpf_q2.run(out_2);\n  out_3 = moog_lpf_q3.run(out_3);\n\n  var vol = .3;\n\n  return {\n    0: out_0 * vol,\n    1: out_1 * vol,\n    2: out_2 * vol,\n    3: out_3 * vol,\n  };\n}];\n', 'dsp.js');

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
    key.el.onmousedown = key.label.onmousedown = key.label.ontouchstart = debounce(function (key) {
      return function (e) {
        nextBank(key);
        e.preventDefault();
        return false;
      };
    }(key), 200);
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

for (var i = 0; i < 4; i++) {
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
    console.log('key', key, sources[key]);
    var soundKey = sounds[key.charCodeAt(0)];
    console.log('sound key', soundKey);
    if (soundKey.active) {
      source[soundKey.bank.name].start(soundKey.syncTime);
    }
    // alterState(key);
  }
  restartSounds.forEach(function (soundKey) {
    var source = sources[soundKey.name][soundKey.bank.name];
    console.log('start:', soundKey.name);
    try {
      source.start(soundKey.syncTime); //, calcOffsetTime(source.buffer));
    } catch (e) {}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhbGdvcmF2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQ3BCLE9BQUssRUFBTCxHQUFVLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0EsT0FBSyxFQUFMLENBQVEsU0FBUixHQUFvQixhQUFhLElBQWpDO0FBQ0EsT0FBSyxLQUFMLEdBQWEsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLElBQXpCO0FBQ0EsT0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixXQUF2QjtBQUNBLE9BQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsS0FBSyxLQUF6QjtBQUNBLE9BQUssUUFBTCxHQUFnQixLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBaEI7QUFDQSxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsT0FBSyxPQUFMO0FBQ0Q7O0FBRUQsT0FBTyxTQUFQLENBQWlCLE1BQWpCLEdBQTBCLFlBQVc7QUFDbkMsT0FBSyxFQUFMLENBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixRQUF0QjtBQUNBLE9BQUssTUFBTCxHQUFjLElBQWQ7QUFDRCxDQUhEOztBQUtBLE9BQU8sU0FBUCxDQUFpQixPQUFqQixHQUEyQixZQUFXO0FBQ3BDLE9BQUssRUFBTCxDQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsUUFBekI7QUFDQSxPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLFNBQVAsQ0FBaUIsTUFBakIsR0FBMEIsWUFBVztBQUNuQyxNQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLFNBQUssT0FBTDtBQUNELEdBRkQsTUFFTztBQUNMLFNBQUssTUFBTDtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CO0FBQ2xC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QUN0QixTQUFLLEtBQUw7QUFDRCxHQUZELE1BRU87QUFDTCxTQUFLLElBQUw7QUFDRDtBQUNGIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIFBhZEtleShjaGFyKSB7XG4gIHRoaXMuZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5lbC5jbGFzc05hbWUgPSAna2V5IGtleS0nICsgY2hhcjtcbiAgdGhpcy5sYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmxhYmVsLnRleHRDb250ZW50ID0gY2hhcjtcbiAgdGhpcy5sYWJlbC5jbGFzc05hbWUgPSAna2V5LWxhYmVsJztcbiAgdGhpcy5lbC5hcHBlbmRDaGlsZCh0aGlzLmxhYmVsKTtcbiAgdGhpcy5jaGFyQ29kZSA9IGNoYXIuY2hhckNvZGVBdCgwKTtcbiAgdGhpcy5uYW1lID0gY2hhcjtcbiAgdGhpcy50dXJuT2ZmKCk7XG59XG5cblBhZEtleS5wcm90b3R5cGUudHVybk9uID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gIHRoaXMuYWN0aXZlID0gdHJ1ZTtcbn07XG5cblBhZEtleS5wcm90b3R5cGUudHVybk9mZiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICB0aGlzLmFjdGl2ZSA9IGZhbHNlO1xufTtcblxuUGFkS2V5LnByb3RvdHlwZS50b2dnbGUgPSBmdW5jdGlvbigpIHtcbiAgaWYgKHRoaXMuYWN0aXZlKSB7XG4gICAgdGhpcy50dXJuT2ZmKCk7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy50dXJuT24oKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gQmFuayhuYW1lKSB7XG4gIHRoaXMubmFtZSA9IG5hbWU7XG4gIHRoaXMuYmFuayA9IG51bGw7XG4gIHRoaXMucHJldkJhbmsgPSBudWxsO1xufVxuXG5mdW5jdGlvbiBTb3VuZEtleShjaGFyKSB7XG4gIFBhZEtleS5jYWxsKHRoaXMsIGNoYXIpO1xufVxuXG5Tb3VuZEtleS5wcm90b3R5cGUuX19wcm90b19fID0gUGFkS2V5LnByb3RvdHlwZTtcblxuU291bmRLZXkucHJvdG90eXBlLnNldEJhbmsgPSBmdW5jdGlvbihiYW5rKSB7XG4gIGlmICh0aGlzLmJhbmspIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYmFuay0nICsgdGhpcy5iYW5rLm5hbWUpO1xuICB0aGlzLnByZXZCYW5rID0gdGhpcy5iYW5rO1xuICB0aGlzLmJhbmsgPSBiYW5rO1xuICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2JhbmstJyArIHRoaXMuYmFuay5uYW1lKTtcbn07XG5cbnZhciBrZXlib2FyZCA9IFtcbiAgJzEyMzQ1Njc4OTAnLnNwbGl0KCcnKSxcbiAgJ3F3ZXJ0eXVpb3AnLnNwbGl0KCcnKSxcbiAgJ2FzZGZnaGprbCcuc3BsaXQoJycpLFxuICAnenhjdmJubScuc3BsaXQoJycpLFxuXTtcblxudmFyIHNvdW5kcyA9IHt9O1xudmFyIGJhbmtzID0gW107XG5cbnZhciBhbGxLZXlzID0ga2V5Ym9hcmQucmVkdWNlKChwLCBuKSA9PiBwLmNvbmNhdChuKSk7XG5cbnZhciBjb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5jb250YWluZXJFbGVtZW50LmNsYXNzTmFtZSA9ICdjb250YWluZXInO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb250YWluZXJFbGVtZW50KTtcblxudmFyIGVkaXRvckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmVkaXRvckVsZW1lbnQuY2xhc3NOYW1lID0gJ2VkaXRvcic7XG5cbnZhciBqYXp6RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuamF6ekVsZW1lbnQuY2xhc3NOYW1lID0gJ2phenonO1xuXG52YXIgamF6ek9wdGlvbnMgPSB7XG4gIHRoZW1lOiAncmVkYmxpc3MnLFxuICBmb250X3NpemU6ICc5cHQnLFxufTtcbnZhciBqYXp6ID0gbmV3IEphenooamF6ek9wdGlvbnMpO1xuXG5qYXp6LnNldChsb2NhbFN0b3JhZ2UudGV4dCB8fCBgXFxcbmxldCB7IHNpbiwgU2luLCBTYXcsIFRyaSwgU3FyLCBDaG9yZCwgQ2hvcmRzLCBzb2Z0Q2xpcDpjbGlwLCBub3RlLCBlbnZlbG9wZSwgS29yZzM1TFBGLCBEaW9kZUZpbHRlciwgTW9vZ0xhZGRlciB9ID0gc3R1ZGlvO1xubGV0IHsgQmFzc2xpbmUgfSA9IGV4dGVuZGVkO1xuXG4vLyBwYXRjaGVzOiBhIGQgayBsIG0gbyBwIHEgcyB4XG5cbmV4cG9ydCBsZXQgYnBtID0gMTIwO1xubGV0IHByb2dyID0gWydGbWFqNycsJ0JtYWo5JywnRDknLCdHI21pbjcnXS5tYXAoQ2hvcmRzKTtcbmxldCBwcm9ncl8yID0gWydDbWluJywnRCNtaW4nLCdGbWluJywnQW1pbiddLm1hcChDaG9yZHMpO1xuXG5leHBvcnQgbGV0IHIgPSBbNCwgZnVuY3Rpb24odCkge1xuICAgcmV0dXJuIHtcbiAgICAgMDogKHNpbih0LCBub3RlKHByb2dyWzFdWzBdKSouOSk+LjQqKHQqMiU0KSkgKiBzaW4odCwuMjUpICogc2luKHQsLjIpLFxuICAgICAxOiAoc2luKHQsIG5vdGUocHJvZ3JbMV1bMF0pKi44KT4uNCoodCoyJTQpKSAqIHNpbih0LC4yNSkgKiBzaW4odCwuMiksXG4gICAgIDI6IChzaW4odCwgbm90ZShwcm9nclsxXVswXSkqMS4yKT4uNCoodCoyJTQpKSAqIHNpbih0LC4yNSkgKiBzaW4odCwuMiksXG4gICAgIDM6IChzaW4odCwgbm90ZShwcm9nclsxXVswXSkqMS41KT4uNCoodCoyJTQpKSAqIHNpbih0LC4yNSkgKiBzaW4odCwuMiksXG4gICB9O1xufV07XG5cbnZhciBiYXNzX2EwID0gbmV3IEJhc3NsaW5lKCk7XG52YXIgYmFzc19hMSA9IG5ldyBCYXNzbGluZSgpO1xudmFyIGJhc3NfYTIgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2EzID0gbmV3IEJhc3NsaW5lKCk7XG5iYXNzX2EwLnNlcShwcm9nclswXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMTUpLnByZSgxKS5ocGYoLjAwMjIpLmNsaXAoMTApLnJlcyguNykubGZvKC41KTtcbmJhc3NfYTEuc2VxKHByb2dyWzFdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4xOCkucHJlKDEpLmhwZiguMDAyMikuY2xpcCgxMCkucmVzKC43KS5sZm8oLjUpO1xuYmFzc19hMi5zZXEocHJvZ3JbMl0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjI1KS5wcmUoMSkuaHBmKC4wMDIyKS5jbGlwKDEwKS5yZXMoLjcpLmxmbyguNSk7XG5iYXNzX2EzLnNlcShwcm9nclszXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMjUpLnByZSgxKS5ocGYoLjAwMjIpLmNsaXAoMTApLnJlcyguNykubGZvKC41KTtcblxuZXhwb3J0IGxldCBhID0gWzQsIGZ1bmN0aW9uIGJhc3NfYSh0KSB7XG4gIHZhciB2b2wgPSAuNDtcbiAgcmV0dXJuIHtcbiAgICAwOiBiYXNzX2EwLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAxMCwgNSkgKiB2b2wsXG4gICAgMTogYmFzc19hMS5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMTAsIDUpICogdm9sLFxuICAgIDI6IGJhc3NfYTIucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDEwLCA1KSAqIHZvbCxcbiAgICAzOiBiYXNzX2EzLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAxMCwgNSkgKiB2b2wsXG4gIH07XG59XTtcblxudmFyIGJhc3NfZDAgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2QxID0gbmV3IEJhc3NsaW5lKCk7XG52YXIgYmFzc19kMiA9IG5ldyBCYXNzbGluZSgpO1xudmFyIGJhc3NfZDMgPSBuZXcgQmFzc2xpbmUoKTtcbmJhc3NfZDAuc2VxKHByb2dyXzJbMF0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjE1KS5wcmUoLjUpLmhwZiguMDA3MikuY2xpcCg1KS5yZXMoLjcpLmxmbygxKS5sZm8yKC4yNSk7XG5iYXNzX2QxLnNlcShwcm9ncl8yWzFdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4xOCkucHJlKC41KS5ocGYoLjAwNzIpLmNsaXAoNSkucmVzKC43KS5sZm8oMSkubGZvMiguMjUpO1xuYmFzc19kMi5zZXEocHJvZ3JfMlsyXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMjUpLnByZSguNSkuaHBmKC4wMDcyKS5jbGlwKDUpLnJlcyguNykubGZvKDEpLmxmbzIoLjI1KTtcbmJhc3NfZDMuc2VxKHByb2dyXzJbM10ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjI1KS5wcmUoLjUpLmhwZiguMDA3MikuY2xpcCg1KS5yZXMoLjcpLmxmbygxKS5sZm8yKC4yNSk7XG5cbmV4cG9ydCBsZXQgZCA9IFs0LCBmdW5jdGlvbiBiYXNzX2QodCkge1xuICB2YXIgdm9sID0gLjc7XG4gIHJldHVybiB7XG4gICAgMDogYmFzc19kMC5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMywgNSkgKiB2b2wsXG4gICAgMTogYmFzc19kMS5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMywgNSkgKiB2b2wsXG4gICAgMjogYmFzc19kMi5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMywgNSkgKiB2b2wsXG4gICAgMzogYmFzc19kMy5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMywgNSkgKiB2b2wsXG4gIH07XG59XTtcblxuXG5leHBvcnQgbGV0IGsgPSBbNCwgZnVuY3Rpb24ga2ljayh0KSB7XG4gIHZhciB2b2wgPSAuNjtcbiAgcmV0dXJuIHtcbiAgICAwOiBhcnAodCwgMS80LCA1MCwgMzAsIDgpICogdm9sLFxuICAgIDE6IGFycCh0LCAxLzQsIDYwLCAzMCwgOCkgKiB2b2wsXG4gICAgMjogYXJwKHQsIDEvNCwgNDAsIDMwLCA4KSAqIHZvbCxcbiAgICAzOiBhcnAodCwgMS80LCA0NCwgMzAsIDgpICogdm9sLFxuICB9O1xufV07XG5cbmV4cG9ydCBsZXQgbCA9IFs0LCBmdW5jdGlvbiBoaWhhdCh0KSB7XG4gIHZhciB2b2wgPSAuMTtcbiAgcmV0dXJuIHtcbiAgICAwOiBhcnAodCsxLzIsIDEvNCwgTWF0aC5yYW5kb20oKSAqIDU1NTAsIDE2MDAsIDM1MCkgKiB2b2wsXG4gICAgMTogYXJwKHQrMS8yLCAxLzQsIE1hdGgucmFuZG9tKCkgKiA1NTUwLCAyNjAwLCAzNTApICogdm9sLFxuICAgIDI6IGFycCh0KzEvMiwgMS80LCBNYXRoLnJhbmRvbSgpICogNTU1MCwgMzYwMCwgMzUwKSAqIHZvbCxcbiAgICAzOiBhcnAodCsxLzIsIDEvNCwgTWF0aC5yYW5kb20oKSAqIDU1NTAsIDQwMDAsIDM1MCkgKiB2b2wsXG4gIH07XG59XTtcblxudmFyIHN5bnRoX29zY18wID0gVHJpKDMyLCB0cnVlKTtcbnZhciBzeW50aF9vc2NfMSA9IFRyaSgzMiwgdHJ1ZSk7XG52YXIgc3ludGhfb3NjXzIgPSBUcmkoMzIsIHRydWUpO1xudmFyIHN5bnRoX29zY18zID0gVHJpKDMyLCB0cnVlKTtcbmV4cG9ydCBsZXQgbyA9IFs0LCBmdW5jdGlvbiBzeW50aCh0KSB7XG4gIHZhciB2b2wgPSAuMztcbiAgcmV0dXJuIHtcbiAgICAwOiBzeW50aF9vc2NfMChub3RlKHByb2dyWyh0JTQpfDBdWyh0KjQlMyl8MF0pKSAqIGVudmVsb3BlKHQrMS8yLCAxLzQsIDUsIDQpICogdm9sLFxuICAgIDE6IHN5bnRoX29zY18xKG5vdGUocHJvZ3JbKHQlNCl8MF1bKHQqNCUzKXwwXSkqMikgKiBlbnZlbG9wZSh0KzEvMiwgMS80LCA1LCA0KSAqIHZvbCxcbiAgICAyOiBzeW50aF9vc2NfMihub3RlKHByb2dyWyh0JTQpfDBdWyh0KjQlMyl8MF0pKjQpICogZW52ZWxvcGUodCsxLzIsIDEvNCwgNSwgNCkgKiB2b2wsXG4gICAgMzogc3ludGhfb3NjXzMobm90ZShwcm9nclsodCU0KXwwXVsodCo0JTMpfDBdKSo4KSAqIGVudmVsb3BlKHQrMS8yLCAxLzQsIDUsIDQpICogdm9sLFxuICB9O1xufV07XG5cbnZhciBwYWRfb3NjXzAgPSBDaG9yZChTYXcsIDEyOCwgdHJ1ZSk7XG52YXIgcGFkX29zY18xID0gQ2hvcmQoU2F3LCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfMiA9IENob3JkKFNhdywgMTI4LCB0cnVlKTtcbnZhciBwYWRfb3NjXzMgPSBDaG9yZChTYXcsIDEyOCwgdHJ1ZSk7XG5cbnZhciBmaWx0ZXJfcGFkXzAgPSBLb3JnMzVMUEYoKTtcbnZhciBmaWx0ZXJfcGFkXzEgPSBLb3JnMzVMUEYoKTtcbnZhciBmaWx0ZXJfcGFkXzIgPSBLb3JnMzVMUEYoKTtcbnZhciBmaWx0ZXJfcGFkXzMgPSBLb3JnMzVMUEYoKTtcbmZpbHRlcl9wYWRfMC5jdXQoNTAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcbmZpbHRlcl9wYWRfMS5jdXQoNTAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcbmZpbHRlcl9wYWRfMi5jdXQoNTAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcbmZpbHRlcl9wYWRfMy5jdXQoNTAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcblxuZXhwb3J0IGxldCBwID0gWzQsIGZ1bmN0aW9uIHBhZCh0KSB7XG4gIHZhciB2b2wgPSAuMztcbiAgdmFyIGMgPSBwcm9nclt0JTR8MF07XG4gIHZhciBvdXRfMCA9IHBhZF9vc2NfMChjLm1hcChub3RlKS5tYXAobj0+bioyKSkgKiBlbnZlbG9wZSh0LCAxLzQsIDUsIDQpICogdm9sO1xuICB2YXIgb3V0XzEgPSBwYWRfb3NjXzEoYy5tYXAobm90ZSkubWFwKG49Pm4qNCkpICogZW52ZWxvcGUodCwgMS80LCA1LCA0KSAqIHZvbDtcbiAgdmFyIG91dF8yID0gcGFkX29zY18yKGMubWFwKG5vdGUpLm1hcChuPT5uKjgpKSAqIGVudmVsb3BlKHQsIDEvNCwgNSwgNCkgKiB2b2w7XG4gIHZhciBvdXRfMyA9IHBhZF9vc2NfMihjLm1hcChub3RlKS5tYXAobj0+bio4KSkgKiBlbnZlbG9wZSh0LCAxLzQsIDUsIDQpICogdm9sO1xuICByZXR1cm4ge1xuICAgIDA6IGZpbHRlcl9wYWRfMC5ydW4ob3V0XzApLFxuICAgIDE6IGZpbHRlcl9wYWRfMS5ydW4ob3V0XzEpLFxuICAgIDI6IGZpbHRlcl9wYWRfMi5ydW4ob3V0XzIpLFxuICAgIDM6IGZpbHRlcl9wYWRfMy5ydW4ob3V0XzMpLFxuICB9O1xufV07XG5cbnZhciBwYWRfb3NjX20wID0gQ2hvcmQoU3FyLCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfbTEgPSBDaG9yZChTcXIsIDEyOCwgdHJ1ZSk7XG52YXIgcGFkX29zY19tMiA9IENob3JkKFNxciwgMTI4LCB0cnVlKTtcbnZhciBwYWRfb3NjX20zID0gQ2hvcmQoU3FyLCAxMjgsIHRydWUpO1xuXG52YXIgZmlsdGVyX3BhZF9tMCA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfbTEgPSBLb3JnMzVMUEYoKTtcbnZhciBmaWx0ZXJfcGFkX20yID0gS29yZzM1TFBGKCk7XG52YXIgZmlsdGVyX3BhZF9tMyA9IEtvcmczNUxQRigpO1xuZmlsdGVyX3BhZF9tMC5jdXQoMjAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcbmZpbHRlcl9wYWRfbTEuY3V0KDIwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5maWx0ZXJfcGFkX20yLmN1dCgyMDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF9tMy5jdXQoMjAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcblxudmFyIGxmb19tID0gU2luKCk7XG5cbmV4cG9ydCBsZXQgbSA9IFs0LCBmdW5jdGlvbiBwYWQodCkge1xuICB2YXIgdm9sID0gLjU7XG4gIHZhciBjID0gcHJvZ3JfMlsodCozKSUzfDBdO1xuICB2YXIgb3V0XzAgPSBwYWRfb3NjX20wKGMubWFwKG5vdGUpLm1hcChuPT5uKjQpKSAqIGVudmVsb3BlKHQrMS80LCAxLzIsIDUsIC0yKSAqIHZvbCAqIGxmb19tKC4yKTtcbiAgdmFyIG91dF8xID0gcGFkX29zY19tMShjLm1hcChub3RlKS5tYXAobj0+bio2KSkgKiBlbnZlbG9wZSh0KzEvNCwgMS8yLCA1LCAtMikgKiB2b2wgKiBsZm9fbSguMik7XG4gIHZhciBvdXRfMiA9IHBhZF9vc2NfbTIoYy5tYXAobm90ZSkubWFwKG49Pm4qOCkpICogZW52ZWxvcGUodCsxLzQsIDEvMiwgNSwgLTIpICogdm9sICogbGZvX20oLjIpO1xuICB2YXIgb3V0XzMgPSBwYWRfb3NjX20zKGMubWFwKG5vdGUpLm1hcChuPT5uKjgpKSAqIGVudmVsb3BlKHQrMS80LCAxLzIsIDUsIC0yKSAqIHZvbCAqIGxmb19tKC4yKTtcbiAgcmV0dXJuIHtcbiAgICAwOiBmaWx0ZXJfcGFkX20wLnJ1bihvdXRfMCksXG4gICAgMTogZmlsdGVyX3BhZF9tMS5ydW4ob3V0XzEpLFxuICAgIDI6IGZpbHRlcl9wYWRfbTIucnVuKG91dF8yKSxcbiAgICAzOiBmaWx0ZXJfcGFkX20zLnJ1bihvdXRfMyksXG4gIH07XG59XTtcblxudmFyIGNoaXBfb3NjXzAgPSBUcmkoMTAsIGZhbHNlKTtcbnZhciBjaGlwX29zY18xID0gVHJpKDEwLCBmYWxzZSk7XG52YXIgY2hpcF9vc2NfMiA9IFRyaSgxMCwgZmFsc2UpO1xudmFyIGNoaXBfb3NjXzMgPSBUcmkoMTAsIGZhbHNlKTtcblxuZXhwb3J0IGxldCBzID0gWzgsIGZ1bmN0aW9uIGNoaXAodCkge1xuICB2YXIgYyA9IG5vdGUocHJvZ3JbMF1bdCVwcm9nclswXS5sZW5ndGh8MF0pKjg7XG4gIHJldHVybiB7XG4gICAgMDogLjcgKiBhcnAodCsyLzgsIDEvMjgsIGFycCh0LCAxLzE2LCBjaGlwX29zY18wKGMpKih0KjQlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMDAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAxOiAuNyAqIGFycCh0KzIvOCwgMS8yOCwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjXzEoYyoyKSoodCo4JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMjogLjcgKiBhcnAodCsyLzgsIDEvMjgsIGFycCh0LCAxLzE2LCBjaGlwX29zY18yKGMqNCkqKHQqMTYlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMDAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAzOiAuNyAqIGFycCh0KzIvOCwgMS8yOCwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjXzMoYyo4KSoodCoxNiUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICB9XG59XTtcblxudmFyIGNoaXBfb3NjX3gwID0gVHJpKDEwLCB0cnVlKTtcbnZhciBjaGlwX29zY194MSA9IFRyaSgxMCwgdHJ1ZSk7XG52YXIgY2hpcF9vc2NfeDIgPSBUcmkoMTAsIHRydWUpO1xudmFyIGNoaXBfb3NjX3gzID0gVHJpKDEwLCB0cnVlKTtcblxuZXhwb3J0IGxldCB4ID0gWzgsIGZ1bmN0aW9uIGNoaXAodCkge1xuICB2YXIgYyA9IG5vdGUocHJvZ3JfMlswXVt0JXByb2dyXzJbMF0ubGVuZ3RofDBdKSo4O1xuICB2YXIgdm9sID0gLjU7XG4gIHJldHVybiB7XG4gICAgMDogdm9sICogYXJwKHQrMi84LCAxLzE2LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfeDAoYykqKHQqNCUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMTogdm9sICogYXJwKHQrMi84LCAxLzE2LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfeDEoYyoyKSoodCo4JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAyOiB2b2wgKiBhcnAodCsyLzgsIDEvMTYsIGFycCh0LCAxLzE2LCBjaGlwX29zY194MihjKjQpKih0KjE2JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAzOiB2b2wgKiBhcnAodCsyLzgsIDEvMTYsIGFycCh0LCAxLzE2LCBjaGlwX29zY194MihjKjgpKih0KjE2JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgfVxufV07XG5cbnZhciBtb29nX2xwZl9xMCA9IE1vb2dMYWRkZXIoJ2hhbGYnKTtcbnZhciBtb29nX2xwZl9xMSA9IE1vb2dMYWRkZXIoJ2hhbGYnKTtcbnZhciBtb29nX2xwZl9xMiA9IE1vb2dMYWRkZXIoJ2hhbGYnKTtcbnZhciBtb29nX2xwZl9xMyA9IE1vb2dMYWRkZXIoJ2hhbGYnKTtcblxudmFyIG1vb2dfb3NjX3EwID0gU2F3KCk7XG52YXIgbW9vZ19vc2NfcTEgPSBTYXcoKTtcbnZhciBtb29nX29zY19xMiA9IFNhdygpO1xudmFyIG1vb2dfb3NjX3EzID0gU2F3KCk7XG5cbnZhciBtb29nX2xmb19xMCA9IFNpbigpO1xudmFyIG1vb2dfbGZvX3ExID0gU2luKCk7XG52YXIgbW9vZ19sZm9fcTIgPSBTaW4oKTtcbnZhciBtb29nX2xmb19xMyA9IFNpbigpO1xuXG5leHBvcnQgbGV0IHEgPSBbOCwgZnVuY3Rpb24gbW9vZyh0KXtcbiAgdC89MlxuXG4gIHZhciBjID0gcHJvZ3JbKHQlcHJvZ3IubGVuZ3RofDApXTtcbiAgdmFyIG91dF8wID0gbW9vZ19vc2NfcTAobm90ZShjW3QqNCUzfDBdKSoyKTtcbiAgdmFyIG91dF8xID0gbW9vZ19vc2NfcTEobm90ZShjW3QqNCUzfDBdKSo0KTtcbiAgdmFyIG91dF8yID0gbW9vZ19vc2NfcTIobm90ZShjW3QqNCUzfDBdKSo4KTtcbiAgdmFyIG91dF8zID0gbW9vZ19vc2NfcTMobm90ZShjW3QqNCUzfDBdKSo4KTtcblxuICBtb29nX2xwZl9xMFxuICAgIC5jdXQoNzAwICsgKDY1MCAqIG1vb2dfbGZvX3EwKDAuNSkpKVxuICAgIC5yZXMoMC44NylcbiAgICAuc2F0KDIuMTUpXG4gICAgLnVwZGF0ZSgpO1xuXG4gIG1vb2dfbHBmX3ExXG4gICAgLmN1dCgxMDAwICsgKDk1MCAqIG1vb2dfbGZvX3ExKDEpKSlcbiAgICAucmVzKDAuODcpXG4gICAgLnNhdCgyLjE1KVxuICAgIC51cGRhdGUoKTtcblxuICBtb29nX2xwZl9xMlxuICAgIC5jdXQoMTMwMCArICgxMjUwICogbW9vZ19sZm9fcTIoMC4yNSkpKVxuICAgIC5yZXMoMC44NylcbiAgICAuc2F0KDIuMTUpXG4gICAgLnVwZGF0ZSgpO1xuXG4gIG1vb2dfbHBmX3EzXG4gICAgLmN1dCgxMzAwICsgKDEyNTAgKiBtb29nX2xmb19xMigwLjI1KSkpXG4gICAgLnJlcygwLjg3KVxuICAgIC5zYXQoMi4xNSlcbiAgICAudXBkYXRlKCk7XG5cbiAgb3V0XzAgPSBtb29nX2xwZl9xMC5ydW4ob3V0XzApO1xuICBvdXRfMSA9IG1vb2dfbHBmX3ExLnJ1bihvdXRfMSk7XG4gIG91dF8yID0gbW9vZ19scGZfcTIucnVuKG91dF8yKTtcbiAgb3V0XzMgPSBtb29nX2xwZl9xMy5ydW4ob3V0XzMpO1xuXG4gIHZhciB2b2wgPSAuMztcblxuICByZXR1cm4ge1xuICAgIDA6IG91dF8wICogdm9sLFxuICAgIDE6IG91dF8xICogdm9sLFxuICAgIDI6IG91dF8yICogdm9sLFxuICAgIDM6IG91dF8zICogdm9sLFxuICB9O1xufV07XG5gLCAnZHNwLmpzJyk7XG5cbmVkaXRvckVsZW1lbnQuYXBwZW5kQ2hpbGQoamF6ekVsZW1lbnQpO1xuY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChlZGl0b3JFbGVtZW50KTtcbmphenoudXNlKGphenpFbGVtZW50KTtcblxudmFyIGtleWJvYXJkQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xua2V5Ym9hcmRDb250YWluZXJFbGVtZW50LmNsYXNzTmFtZSA9ICdrZXlib2FyZC1jb250YWluZXInO1xuXG52YXIga2V5Ym9hcmRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5rZXlib2FyZEVsZW1lbnQuY2xhc3NOYW1lID0gJ2tleWJvYXJkJztcblxudmFyIGZpbGVuYW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZmlsZW5hbWVFbGVtZW50LmNsYXNzTmFtZSA9ICdmaWxlbmFtZSc7XG5cbmVkaXRvckVsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsZW5hbWVFbGVtZW50KTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlib2FyZC5sZW5ndGg7IGkrKykge1xuICB2YXIgcm93ID0ga2V5Ym9hcmRbaV07XG4gIHZhciByb3dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHJvd0VsZW1lbnQuY2xhc3NOYW1lID0gJ3JvdyByb3ctJyArIGk7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgcm93Lmxlbmd0aDsgaysrKSB7XG4gICAgdmFyIGNoYXIgPSByb3dba107XG4gICAgdmFyIGtleTtcbiAgICBrZXkgPSBuZXcgU291bmRLZXkoY2hhcik7XG4gICAgc291bmRzW2tleS5jaGFyQ29kZV0gPSBrZXk7XG4gICAgcm93RWxlbWVudC5hcHBlbmRDaGlsZChrZXkuZWwpO1xuICAgIGtleS5lbC5vbm1vdXNlZG93biA9XG4gICAga2V5LmxhYmVsLm9ubW91c2Vkb3duID1cbiAgICBrZXkubGFiZWwub250b3VjaHN0YXJ0ID0gZGVib3VuY2UoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGUgPT4ge1xuICAgICAgICBuZXh0QmFuayhrZXkpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0oa2V5KSksIDIwMCk7XG4gIH1cbiAga2V5Ym9hcmRFbGVtZW50LmFwcGVuZENoaWxkKHJvd0VsZW1lbnQpO1xufVxuXG52YXIgbGFzdFRvdWNoS2V5ID0gbnVsbDtcbnZhciBkZWJvdW5jZUxhc3RUb3VjaEtleTtcblxua2V5Ym9hcmRFbGVtZW50Lm9udG91Y2hzdGFydCA9XG5rZXlib2FyZEVsZW1lbnQub250b3VjaG1vdmUgPVxua2V5Ym9hcmRFbGVtZW50Lm9udG91Y2hlbnRlciA9IGZ1bmN0aW9uIGhhbmRsZXIoZSkge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGlmICghZS50b3VjaGVzKSB7XG4gICAgZS50b3VjaGVzID0gWyB7dG91Y2g6IFtlXX0gXTtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG4gICAgZm9yICh2YXIgY2hhciBpbiBzb3VuZHMpIHtcbiAgICAgIHZhciBrZXkgPSBzb3VuZHNbY2hhcl07XG4gICAgICBpZiAoIHRvdWNoLmNsaWVudFggPiBrZXkucG9zLmxlZnQgJiYgdG91Y2guY2xpZW50WCA8PSBrZXkucG9zLmxlZnQgKyBrZXkucG9zLndpZHRoXG4gICAgICAgICYmIHRvdWNoLmNsaWVudFkgPiBrZXkucG9zLnRvcCAmJiB0b3VjaC5jbGllbnRZIDw9IGtleS5wb3MudG9wICsga2V5LnBvcy5oZWlnaHRcbiAgICAgICAgJiYgbGFzdFRvdWNoS2V5ICE9PSBrZXlcbiAgICAgICkge1xuICAgICAgICBuZXh0QmFuayhrZXkpO1xuICAgICAgICBsYXN0VG91Y2hLZXkgPSBrZXk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5rZXlib2FyZEVsZW1lbnQub250b3VjaHN0YXJ0ID0gZnVuY3Rpb24gaGFuZGxlcihlKSB7XG4gIGlmICghZS50b3VjaGVzKSB7XG4gICAgZS50b3VjaGVzID0gWyB7dG91Y2g6IFtlXX0gXVxuICAgIHJldHVybjtcbiAgfVxuICBsYXN0VG91Y2hLZXkgPSBudWxsO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcbiAgICBmb3IgKHZhciBjaGFyIGluIHNvdW5kcykge1xuICAgICAgdmFyIGtleSA9IHNvdW5kc1tjaGFyXTtcbiAgICAgIGlmICggdG91Y2guY2xpZW50WCA+IGtleS5wb3MubGVmdCAmJiB0b3VjaC5jbGllbnRYIDw9IGtleS5wb3MubGVmdCArIGtleS5wb3Mud2lkdGhcbiAgICAgICAgJiYgdG91Y2guY2xpZW50WSA+IGtleS5wb3MudG9wICYmIHRvdWNoLmNsaWVudFkgPD0ga2V5LnBvcy50b3AgKyBrZXkucG9zLmhlaWdodFxuICAgICAgICAmJiBsYXN0VG91Y2hLZXkgIT09IGtleVxuICAgICAgKSB7XG4gICAgICAgIG5leHRCYW5rKGtleSk7XG4gICAgICAgIGxhc3RUb3VjaEtleSA9IGtleTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmtleWJvYXJkQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChrZXlib2FyZEVsZW1lbnQpO1xuY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChrZXlib2FyZENvbnRhaW5lckVsZW1lbnQpO1xuXG52YXIgZWxlbWVudHMgPSB7XG4gICdlZGl0b3InOiBlZGl0b3JFbGVtZW50LFxuICAna2V5Ym9hcmQnOiBrZXlib2FyZEVsZW1lbnRcbn07XG52YXIgZm9jdXMgPSAna2V5Ym9hcmQnO1xudmFyIG90aGVyID0ge1xuICAnZWRpdG9yJzogJ2tleWJvYXJkJyxcbiAgJ2tleWJvYXJkJzogJ2VkaXRvcicsXG59O1xuXG5lbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LmFkZCgnZm9jdXMnKTtcblxuamF6ei5ibHVyKCk7XG5cbmphenouaW5wdXQudGV4dC5lbC5zdHlsZS5oZWlnaHQgPSAnNTAlJztcblxuamF6ei5vbignZm9jdXMnLCAoKSA9PiB7XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1cycpO1xuICBmb2N1cyA9ICdlZGl0b3InO1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LmFkZCgnZm9jdXMnKTtcbn0pO1xuXG5qYXp6Lm9uKCdibHVyJywgKCkgPT4ge1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXMnKTtcbiAgZm9jdXMgPSAna2V5Ym9hcmQnO1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LmFkZCgnZm9jdXMnKTtcbn0pO1xuXG4vLyB9KTtcblxuZG9jdW1lbnQuYm9keS5vbmtleXVwID0gZSA9PiB7XG4gIGlmIChlLmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgIHN0YXRlLnRyaWdnZXJCYW5rID0gZmFsc2U7XG4gIH1cbn1cblxuZG9jdW1lbnQuYm9keS5vbmtleWRvd24gPSBlID0+IHtcbiAgaWYgKGUua2V5Lmxlbmd0aCA+IDEpIHtcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB0b2dnbGVQYW5lbCgpO1xuICAgIGlmIChlLmtleSA9PT0gJ1RhYicpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB0b2dnbGVQYW5lbCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGZvY3VzID09PSAnZWRpdG9yJykgcmV0dXJuO1xuICB2YXIgY2hhciA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XG4gIGlmIChjaGFyID09PSBjaGFyLnRvVXBwZXJDYXNlKCkpIHtcbiAgICBpZiAoY2hhciA9PT0gJyEnKSBjaGFyID0gJzEnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICdAJykgY2hhciA9ICcyJztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnIycpIGNoYXIgPSAnMyc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyQnKSBjaGFyID0gJzQnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICclJykgY2hhciA9ICc1JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnXicpIGNoYXIgPSAnNic7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyYnKSBjaGFyID0gJzcnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICcqJykgY2hhciA9ICc4JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnKCcpIGNoYXIgPSAnOSc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyknKSBjaGFyID0gJzAnO1xuICB9XG4gIHZhciBjaGFyQ29kZSA9IGNoYXIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xuICB2YXIga2V5ID0gc291bmRzW2NoYXJDb2RlXTtcbiAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICBrZXkudHVybk9mZigpO1xuICB9IGVsc2Uge1xuICAgIG5leHRCYW5rKGtleSk7XG4gIH1cbn07XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gIGJhbmtzLnB1c2gobmV3IEJhbmsoaSkpO1xufVxuXG5mdW5jdGlvbiBnZXRLZXlzUG9zaXRpb25zKCkge1xuICBmb3IgKHZhciBjaGFyIGluIHNvdW5kcykge1xuICAgIHZhciBrZXkgPSBzb3VuZHNbY2hhcl07XG4gICAga2V5LnBvcyA9IGtleS5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxufVxuXG52YXIgcHJldkhlaWdodCA9IDA7XG5cbmdldEtleXNQb3NpdGlvbnMoKTtcblxud2luZG93Lm9uc2Nyb2xsID0gZSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxud2luZG93Lm9ucmVzaXplID0gZSA9PiB7XG4gIGdldEtleXNQb3NpdGlvbnMoKTtcbiAgaWYgKHByZXZIZWlnaHQgJiYgcHJldkhlaWdodCA8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KSB7XG4gICAgamF6ei5ibHVyKCk7XG4gIH1cbiAgcHJldkhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xufTtcblxudmFyIHN0YXRlID0ge1xuICBhY3RpdmVCYW5rOiBiYW5rc1swXSxcbiAgdHJpZ2dlckJhbms6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBrZXkgaW4gc291bmRzKSB7XG4gIHNvdW5kc1trZXldLnNldEJhbmsoc3RhdGUuYWN0aXZlQmFuayk7XG59XG5cbmZ1bmN0aW9uIG5leHRCYW5rKGtleSkge1xuICB2YXIgYmFuaztcblxuICBpZiAoIWtleS5hY3RpdmUpIHtcbiAgICBiYW5rID0gYmFua3NbMF07XG4gIH0gZWxzZSB7XG4gICAgdmFyIG5leHRCYW5rSW5kZXggPSAra2V5LmJhbmsubmFtZSArIDE7XG4gICAgYmFuayA9IGJhbmtzW25leHRCYW5rSW5kZXggJSAoYmFua3MubGVuZ3RoICsgMSldO1xuICB9XG5cbiAgaWYgKGJhbmspIHtcbiAgICBzdGF0ZS5hY3RpdmVCYW5rID0gYmFuaztcbiAgICBrZXkuc2V0QmFuayhzdGF0ZS5hY3RpdmVCYW5rKTtcbiAgICBrZXkudHVybk9uKCk7XG4gIH0gZWxzZSB7XG4gICAga2V5LnR1cm5PZmYoKTtcbiAgfVxuXG4gIGFsdGVyU3RhdGUoa2V5KTtcbn1cblxudmFyIHBsYXlpbmcgPSB7fTtcblxudmFyIEFDID0gd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCB8fCB3aW5kb3cuQXVkaW9Db250ZXh0O1xudmFyIGF1ZGlvID0gbmV3IEFDO1xud2luZG93LnNhbXBsZVJhdGUgPSBhdWRpby5zYW1wbGVSYXRlO1xuXG52YXIgYnBtID0gNjA7XG52YXIgc291cmNlcyA9IHt9O1xudmFyIGJlYXRUaW1lO1xuXG5jbG9jaygpO1xuXG5mdW5jdGlvbiBjbG9jaygpIHtcbiAgYmVhdFRpbWUgPSAxIC8gKGJwbSAvIDYwKTtcbn1cblxuamF6ei5vbignaW5wdXQnLCBkZWJvdW5jZSgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZWFkIGlucHV0Jyk7XG4gIHZhciB0ZXh0ID0gamF6ei5idWZmZXIudGV4dC50b1N0cmluZygpO1xuICBsb2NhbFN0b3JhZ2UudGV4dCA9IHRleHQ7XG4gIGJ1aWxkKG51bGwsIHRleHQpO1xufSwgNzAwKSk7XG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZuLCBtcykge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlV3JhcChhLCBiLCBjKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZuLCBtcywgYSwgYiwgYyk7XG4gIH07XG59XG5cbnZhciBjYWxsYmFja3MgPSBbXTtcbnZhciBjYWxsYmFja0lkID0gMDtcblxudmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoJ3dvcmtlci5qcycpO1xuXG53b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gb25tZXNzYWdlKGUpIHtcbiAgdmFyIHBhcmFtcyA9IGUuZGF0YTtcbiAgY29uc29sZS5sb2coJ3JlY2VpdmVkIHBhcmFtcycsIHBhcmFtcylcbiAgaWYgKHBhcmFtcyA9PT0gdHJ1ZSkgcmV0dXJuO1xuICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBwYXJhbXMpIHtcbiAgICBicG0gPSBwYXJhbXM7XG4gICAgY2xvY2soKTtcbiAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgYnBtJywgYnBtKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2cocGFyYW1zLCBjYWxsYmFja3MpXG4gIHZhciB0aW1lID0gRGF0ZS5ub3coKSAtIHBhcmFtcy50aW1lc3RhbXA7XG4gIHZhciBjYiA9IGNhbGxiYWNrc1twYXJhbXMuaWRdO1xuICBkZWxldGUgY2FsbGJhY2tzW3BhcmFtcy5pZF07XG4gIGNiKHBhcmFtcy5lcnJvciwgcGFyYW1zKTtcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkKGVyciwganMpIHtcbiAgY29uc29sZS5sb2coJ2J1aWxkaW5nJyk7XG5cbiAgaWYgKGVycikgdGhyb3cgZXJyO1xuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgaWYgKGVycikgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICBlbHNlIGNvbXBpbGUocmVzdWx0KTtcbiAgfTtcblxuICBjYWxsYmFja3NbKytjYWxsYmFja0lkXSA9IGNiO1xuICB3b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgIHByb2NlZHVyZU5hbWU6ICdjb21waWxlJyxcbiAgICBpZDogY2FsbGJhY2tJZCxcbiAgICBhcmdzOiBbanNdLFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICB9KTtcbn1cblxudmFyIGNiID0gZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgYnVpbGQobnVsbCwgamF6ei5idWZmZXIudGV4dC50b1N0cmluZygpKTtcbn07XG5cbmNhbGxiYWNrc1srK2NhbGxiYWNrSWRdID0gY2I7XG5cbndvcmtlci5wb3N0TWVzc2FnZSh7XG4gIHByb2NlZHVyZU5hbWU6ICdzZXR1cCcsXG4gIGlkOiBjYWxsYmFja0lkLFxuICBhcmdzOiBbeyBzYW1wbGVSYXRlOiBhdWRpby5zYW1wbGVSYXRlIH1dLFxuICB0aW1lc3RhbXA6IERhdGUubm93KClcbn0pO1xuXG5mdW5jdGlvbiBjYWxjT2Zmc2V0VGltZShidWZmZXIpIHtcbiAgcmV0dXJuIGF1ZGlvLmN1cnJlbnRUaW1lICUgKGJ1ZmZlci5sZW5ndGggLyBhdWRpby5zYW1wbGVSYXRlIHwgMCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGUoYnVmZmVycykge1xuICBjb25zb2xlLmxvZygnbG9jYWwgY29tcGlsZScsIGJ1ZmZlcnMpO1xuICB2YXIgcmVzdGFydFNvdW5kcyA9IFtdO1xuICBmb3IgKHZhciBrZXkgaW4gc291bmRzKSB7XG4gICAgdmFyIHNvdW5kS2V5ID0gc291bmRzW2tleV07XG4gICAgaWYgKHNvdW5kS2V5LmFjdGl2ZSkge1xuICAgICAgdmFyIHNvdXJjZSA9IHNvdXJjZXNbc291bmRLZXkubmFtZV1bc291bmRLZXkuYmFuay5uYW1lXTtcbiAgICAgIGlmIChzb3VyY2UuYnVmZmVyKSB7XG4gICAgICAgIHJlc3RhcnRTb3VuZHMucHVzaChzb3VuZEtleSk7XG4gICAgICAgIHNvdW5kS2V5LnN5bmNUaW1lID0gY2FsY1N5bmNUaW1lKHNvdXJjZS5tdWx0aXBsaWVyKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3N0b3A6Jywgc291bmRLZXkubmFtZSk7XG4gICAgICAgIHNvdXJjZS5zdG9wKHNvdW5kS2V5LnN5bmNUaW1lKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgZm9yICh2YXIga2V5IGluIGJ1ZmZlcnMpIHtcbiAgICBpZiAoJ2lkJyA9PT0ga2V5IHx8ICd0aW1lc3RhbXAnID09PSBrZXkpIGNvbnRpbnVlO1xuICAgIC8vIHNvdXJjZXNba2V5XSA9IGNyZWF0ZUJhbmtTb3VyY2VzKGtleSwgYnVmZmVyc1trZXldKTtcbiAgICB2YXIgc291cmNlID0gc291cmNlc1trZXldO1xuICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5XSA9IGNyZWF0ZUJhbmtTb3VyY2VzKGtleSwgYnVmZmVyc1trZXldKTtcbiAgICAvLyBmb3IgKHZhciBiID0gMDsgYiA8IDM7IGIrKykge1xuICAgIC8vICAgc291cmNlW2JdLmJ1ZmZlciA9IGF1ZGlvLmNyZWF0ZUJ1ZmZlcigyLCBidWZmZXJzW2tleV1bYl1bMF0ubGVuZ3RoLCBhdWRpby5zYW1wbGVSYXRlKTtcbiAgICAvLyAgIHNvdXJjZVtiXS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCkuc2V0KGJ1ZmZlcnNba2V5XVtiXVswXSk7XG4gICAgLy8gICBzb3VyY2VbYl0uYnVmZmVyLmdldENoYW5uZWxEYXRhKDEpLnNldChidWZmZXJzW2tleV1bYl1bMV0pO1xuICAgIC8vIH1cbiAgICBzb3VyY2UubXVsdGlwbGllciA9IGJ1ZmZlcnNba2V5XS5tdWx0aXBsaWVyIHx8IDQ7XG4gICAgY29uc29sZS5sb2coJ2tleScsIGtleSwgc291cmNlc1trZXldKVxuICAgIHZhciBzb3VuZEtleSA9IHNvdW5kc1trZXkuY2hhckNvZGVBdCgwKV07XG4gICAgY29uc29sZS5sb2coJ3NvdW5kIGtleScsIHNvdW5kS2V5KTtcbiAgICBpZiAoc291bmRLZXkuYWN0aXZlKSB7XG4gICAgICBzb3VyY2Vbc291bmRLZXkuYmFuay5uYW1lXS5zdGFydChzb3VuZEtleS5zeW5jVGltZSk7XG4gICAgfVxuICAgIC8vIGFsdGVyU3RhdGUoa2V5KTtcbiAgfVxuICByZXN0YXJ0U291bmRzLmZvckVhY2goc291bmRLZXkgPT4ge1xuICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW3NvdW5kS2V5Lm5hbWVdW3NvdW5kS2V5LmJhbmsubmFtZV07XG4gICAgY29uc29sZS5sb2coJ3N0YXJ0OicsIHNvdW5kS2V5Lm5hbWUpO1xuICAgIHRyeSB7XG4gICAgICBzb3VyY2Uuc3RhcnQoc291bmRLZXkuc3luY1RpbWUpOyAvLywgY2FsY09mZnNldFRpbWUoc291cmNlLmJ1ZmZlcikpO1xuICAgIH0gY2F0Y2goZSkge31cbiAgfSk7XG59XG5cbmFsbEtleXMuZm9yRWFjaChrZXkgPT4ge1xuICBzb3VyY2VzW2tleV0gPSBjcmVhdGVCYW5rU291cmNlcyhrZXkpO1xuICBzb3VyY2VzW2tleV0ubXVsdGlwbGllciA9IDQ7XG59KTtcblxuYnVpbGQobnVsbCwgbG9jYWxTdG9yYWdlLnRleHQgfHwgamF6ei5idWZmZXIudGV4dC50b1N0cmluZygpKTtcblxuZnVuY3Rpb24gY3JlYXRlQmFua1NvdXJjZXMoa2V5LCBidWZmZXJzKSB7XG4gIGNvbnNvbGUubG9nKCdjcmVhdGUgYmFuayBzb3VyY2VzJywga2V5KTtcbiAgdmFyIHNvdXJjZXMgPSBbXTtcbiAgZm9yICh2YXIgYiA9IDA7IGIgPCA0OyBiKyspIHtcbiAgICB2YXIgc291cmNlID0gYXVkaW8uY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgc291cmNlLmxvb3AgPSB0cnVlO1xuICAgIHNvdXJjZS5vbmVuZGVkID0gZGlzY29ubmVjdDtcbiAgICBpZiAoYnVmZmVycykge1xuICAgICAgc291cmNlLmJ1ZmZlciA9IGF1ZGlvLmNyZWF0ZUJ1ZmZlcigyLCBidWZmZXJzW2JdWzBdLmxlbmd0aCwgYXVkaW8uc2FtcGxlUmF0ZSk7XG4gICAgICBzb3VyY2UuYnVmZmVyLmdldENoYW5uZWxEYXRhKDApLnNldChidWZmZXJzW2JdWzBdKTtcbiAgICAgIHNvdXJjZS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMSkuc2V0KGJ1ZmZlcnNbYl1bMV0pO1xuICAgIH1cbiAgICBzb3VyY2UuY29ubmVjdChhdWRpby5kZXN0aW5hdGlvbik7XG4gICAgc291cmNlcy5wdXNoKHNvdXJjZSk7XG4gIH1cbiAgcmV0dXJuIHNvdXJjZXM7XG59XG5cbmZ1bmN0aW9uIGNhbGNTeW5jVGltZShtdWx0aXBsaWVyKSB7XG4gIHJldHVybiBub3JtYWxpemUoXG4gICAgYXVkaW8uY3VycmVudFRpbWUgK1xuICAgIChtdWx0aXBsaWVyICogYmVhdFRpbWUgLVxuICAgIChhdWRpby5jdXJyZW50VGltZSAlIChtdWx0aXBsaWVyICogYmVhdFRpbWUpKSlcbiAgKTtcbn1cblxuZnVuY3Rpb24gZGlzY29ubmVjdCgpIHtcbiAgdGhpcy5kaXNjb25uZWN0KCk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShudW1iZXIpIHtcbiAgcmV0dXJuIG51bWJlciA9PT0gSW5maW5pdHkgfHwgbnVtYmVyID09PSAtSW5maW5pdHkgfHwgaXNOYU4obnVtYmVyKSA/IDAgOiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIGFsdGVyU3RhdGUoa2V5KSB7XG4gIGlmIChrZXkuYWN0aXZlKSBwbGF5KGtleSk7XG4gIGVsc2Ugc3RvcChrZXkpO1xufVxuXG5mdW5jdGlvbiBwbGF5KGtleSkge1xuICBpZiAoa2V5Lm5hbWUgaW4gc291cmNlcykge1xuICAgIHZhciBzeW5jVGltZSA9IGNhbGNTeW5jVGltZShzb3VyY2VzW2tleS5uYW1lXS5tdWx0aXBsaWVyKTtcbiAgICB2YXIgc291cmNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAoa2V5LnByZXZCYW5rKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5Lm5hbWVdW2tleS5wcmV2QmFuay5uYW1lXTtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IHNvdXJjZS5idWZmZXI7XG4gICAgICAgIHNvdXJjZS5zdG9wKHN5bmNUaW1lKTtcbiAgICAgICAgc291cmNlID0gc291cmNlc1trZXkubmFtZV1ba2V5LnByZXZCYW5rLm5hbWVdID0gYXVkaW8uY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNvdXJjZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgc291cmNlLm9uZW5kZWQgPSBkaXNjb25uZWN0O1xuICAgICAgICBzb3VyY2UuY29ubmVjdChhdWRpby5kZXN0aW5hdGlvbik7XG4gICAgICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7fVxuICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5Lm5hbWVdW2tleS5iYW5rLm5hbWVdO1xuICAgIGNvbnNvbGUubG9nKCdzdGFydDonLCBzb3VyY2UpO1xuICAgIHNvdXJjZS5zdGFydChzeW5jVGltZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RvcChrZXkpIHtcbiAgaWYgKGtleS5uYW1lIGluIHNvdXJjZXMpIHtcbiAgICB2YXIgc291cmNlID0gc291cmNlc1trZXkubmFtZV07XG4gICAgdmFyIHN5bmNUaW1lID0gY2FsY1N5bmNUaW1lKHNvdXJjZS5tdWx0aXBsaWVyKTtcbiAgICBzb3VyY2Vba2V5LmJhbmsubmFtZV0uc3RvcChzeW5jVGltZSk7XG4gIH1cbiAgY29uc29sZS5sb2coJ3N0b3AnLCBrZXkubmFtZSk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVBhbmVsKCkge1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXMnKTtcbiAgZm9jdXMgPSBvdGhlcltmb2N1c107XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QuYWRkKCdmb2N1cycpO1xuICBpZiAoZm9jdXMgPT09ICdlZGl0b3InKSB7XG4gICAgamF6ei5mb2N1cygpO1xuICB9IGVsc2Uge1xuICAgIGphenouYmx1cigpO1xuICB9XG59XG4iXX0=
