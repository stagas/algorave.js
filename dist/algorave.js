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
  font_size: '9pt'
};
var jazz = new Jazz(jazzOptions);

jazz.set(localStorage.text || 'let { sin, Sin, Saw, Tri, Sqr, Chord, Chords, softClip:clip, note, envelope, Korg35LPF, DiodeFilter, MoogLadder } = studio;\nlet { Bassline } = extended;\n\n// patches: a d k l m o p q s x\n\nexport let bpm = 120;\nlet progr = [\'Fmaj7\',\'Bmaj9\',\'D9\',\'G#min7\'].map(Chords);\nlet progr_2 = [\'Cmin\',\'D#min\',\'Fmin\',\'Amin\'].map(Chords);\n\nexport let k = [4, function kick(t) {\n  var vol = .6;\n  return {\n    0: arp(t, 1/4, 50, 30, 8) * vol,\n    1: arp(t, 1/4, 56, 32, 8) * vol,\n    2: arp(t, 1/4, 59, 28, 4) * vol,\n    3: arp(t, 1/4, 62, 34, 4) * vol,\n  };\n}];\n\nexport let l = [4, function hihat(t) {\n  var vol = .1;\n  return {\n    0: arp(t+1/2, 1/4, Math.random() * 5550, 1600, 350) * vol,\n    1: arp(t+1/2, 1/4, Math.random() * 5550, 2600, 350) * vol,\n    2: arp(t+1/2, 1/4, Math.random() * 5550, 3600, 350) * vol,\n    3: arp(t+1/2, 1/4, Math.random() * 5550, 4000, 350) * vol,\n  };\n}];\n\nexport let r = [4, function(t) {\n   return {\n     0: (sin(t, note(progr[1][0])*.9)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n     1: (sin(t, note(progr[1][0])*.8)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n     2: (sin(t, note(progr[1][0])*1.2)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n     3: (sin(t, note(progr[1][0])*1.5)>.4*(t*2%4)) * sin(t,.25) * sin(t,.2),\n   };\n}];\n\nvar bass_a0 = new Bassline();\nvar bass_a1 = new Bassline();\nvar bass_a2 = new Bassline();\nvar bass_a3 = new Bassline();\nbass_a0.seq(progr[0].map(note).map(n=>n*4)).cut(.15).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a1.seq(progr[1].map(note).map(n=>n*4)).cut(.18).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a2.seq(progr[2].map(note).map(n=>n*4)).cut(.25).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\nbass_a3.seq(progr[3].map(note).map(n=>n*4)).cut(.25).pre(1).hpf(.0022).clip(10).res(.7).lfo(.5);\n\nexport let a = [4, function bass_a(t) {\n  var vol = .4;\n  return {\n    0: bass_a0.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    1: bass_a1.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    2: bass_a2.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n    3: bass_a3.play(t) * envelope(t+1/2, 1/8, 10, 5) * vol,\n  };\n}];\n\nvar bass_d0 = new Bassline();\nvar bass_d1 = new Bassline();\nvar bass_d2 = new Bassline();\nvar bass_d3 = new Bassline();\nbass_d0.seq(progr_2[0].map(note).map(n=>n*4)).cut(.15).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d1.seq(progr_2[1].map(note).map(n=>n*4)).cut(.18).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d2.seq(progr_2[2].map(note).map(n=>n*4)).cut(.25).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\nbass_d3.seq(progr_2[3].map(note).map(n=>n*4)).cut(.25).pre(.5).hpf(.0072).clip(5).res(.7).lfo(1).lfo2(.25);\n\nexport let d = [4, function bass_d(t) {\n  var vol = .7;\n  return {\n    0: bass_d0.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    1: bass_d1.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    2: bass_d2.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n    3: bass_d3.play(t) * envelope(t+1/2, 1/8, 3, 5) * vol,\n  };\n}];\n\nvar synth_osc_0 = Tri(32, true);\nvar synth_osc_1 = Tri(32, true);\nvar synth_osc_2 = Tri(32, true);\nvar synth_osc_3 = Tri(32, true);\nexport let o = [4, function synth(t) {\n  var vol = .3;\n  return {\n    0: synth_osc_0(note(progr[(t%4)|0][(t*4%3)|0])) * envelope(t+1/2, 1/4, 5, 4) * vol,\n    1: synth_osc_1(note(progr[(t%4)|0][(t*4%3)|0])*2) * envelope(t+1/2, 1/4, 5, 4) * vol,\n    2: synth_osc_2(note(progr[(t%4)|0][(t*4%3)|0])*4) * envelope(t+1/2, 1/4, 5, 4) * vol,\n    3: synth_osc_3(note(progr[(t%4)|0][(t*4%3)|0])*8) * envelope(t+1/2, 1/4, 5, 4) * vol,\n  };\n}];\n\nvar pad_osc_0 = Chord(Saw, 128, true);\nvar pad_osc_1 = Chord(Saw, 128, true);\nvar pad_osc_2 = Chord(Saw, 128, true);\nvar pad_osc_3 = Chord(Saw, 128, true);\n\nvar filter_pad_0 = Korg35LPF();\nvar filter_pad_1 = Korg35LPF();\nvar filter_pad_2 = Korg35LPF();\nvar filter_pad_3 = Korg35LPF();\nfilter_pad_0.cut(500).res(2.1).sat(2.1);\nfilter_pad_1.cut(500).res(2.1).sat(2.1);\nfilter_pad_2.cut(500).res(2.1).sat(2.1);\nfilter_pad_3.cut(500).res(2.1).sat(2.1);\n\nexport let p = [4, function pad(t) {\n  var vol = .3;\n  var c = progr[t%4|0];\n  var out_0 = pad_osc_0(c.map(note).map(n=>n*2)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_1 = pad_osc_1(c.map(note).map(n=>n*4)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_2 = pad_osc_2(c.map(note).map(n=>n*8)) * envelope(t, 1/4, 5, 4) * vol;\n  var out_3 = pad_osc_2(c.map(note).map(n=>n*8)) * envelope(t, 1/4, 5, 4) * vol;\n  return {\n    0: filter_pad_0.run(out_0),\n    1: filter_pad_1.run(out_1),\n    2: filter_pad_2.run(out_2),\n    3: filter_pad_3.run(out_3),\n  };\n}];\n\nvar pad_osc_m0 = Chord(Sqr, 128, true);\nvar pad_osc_m1 = Chord(Sqr, 128, true);\nvar pad_osc_m2 = Chord(Sqr, 128, true);\nvar pad_osc_m3 = Chord(Sqr, 128, true);\n\nvar filter_pad_m0 = Korg35LPF();\nvar filter_pad_m1 = Korg35LPF();\nvar filter_pad_m2 = Korg35LPF();\nvar filter_pad_m3 = Korg35LPF();\nfilter_pad_m0.cut(200).res(2.1).sat(2.1);\nfilter_pad_m1.cut(200).res(2.1).sat(2.1);\nfilter_pad_m2.cut(200).res(2.1).sat(2.1);\nfilter_pad_m3.cut(200).res(2.1).sat(2.1);\n\nvar lfo_m = Sin();\n\nexport let m = [4, function pad(t) {\n  var vol = .5;\n  var c = progr_2[(t*3)%3|0];\n  var out_0 = pad_osc_m0(c.map(note).map(n=>n*4)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_1 = pad_osc_m1(c.map(note).map(n=>n*6)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_2 = pad_osc_m2(c.map(note).map(n=>n*8)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  var out_3 = pad_osc_m3(c.map(note).map(n=>n*8)) * envelope(t+1/4, 1/2, 5, -2) * vol * lfo_m(.2);\n  return {\n    0: filter_pad_m0.run(out_0),\n    1: filter_pad_m1.run(out_1),\n    2: filter_pad_m2.run(out_2),\n    3: filter_pad_m3.run(out_3),\n  };\n}];\n\nvar chip_osc_0 = Tri(10, false);\nvar chip_osc_1 = Tri(10, false);\nvar chip_osc_2 = Tri(10, false);\nvar chip_osc_3 = Tri(10, false);\n\nexport let s = [8, function chip(t) {\n  var c = note(progr[0][t%progr[0].length|0])*8;\n  return {\n    0: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    1: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    2: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n    3: .7 * arp(t+2/8, 1/28, arp(t, 1/16, chip_osc_3(c*8)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 100, 20) * envelope(t+2/4, 1/4, 5, 10),\n  }\n}];\n\nvar chip_osc_x0 = Tri(10, true);\nvar chip_osc_x1 = Tri(10, true);\nvar chip_osc_x2 = Tri(10, true);\nvar chip_osc_x3 = Tri(10, true);\n\nexport let x = [8, function chip(t) {\n  var c = note(progr_2[0][t%progr_2[0].length|0])*8;\n  var vol = .5;\n  return {\n    0: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x0(c)*(t*4%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    1: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x1(c*2)*(t*8%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    2: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x2(c*4)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n    3: vol * arp(t+2/8, 1/16, arp(t, 1/16, chip_osc_x2(c*8)*(t*16%((t/2%2|0)+2)|0), 50, 10) * .8, 10, 20) * envelope(t+2/4, 1/4, 5, 10),\n  }\n}];\n\nvar moog_lpf_q0 = MoogLadder(\'half\');\nvar moog_lpf_q1 = MoogLadder(\'half\');\nvar moog_lpf_q2 = MoogLadder(\'half\');\nvar moog_lpf_q3 = MoogLadder(\'half\');\n\nvar moog_osc_q0 = Saw();\nvar moog_osc_q1 = Saw();\nvar moog_osc_q2 = Saw();\nvar moog_osc_q3 = Saw();\n\nvar moog_lfo_q0 = Sin();\nvar moog_lfo_q1 = Sin();\nvar moog_lfo_q2 = Sin();\nvar moog_lfo_q3 = Sin();\n\nexport let q = [8, function moog(t){\n  t/=2\n\n  var c = progr[(t%progr.length|0)];\n  var out_0 = moog_osc_q0(note(c[t*4%3|0])*2);\n  var out_1 = moog_osc_q1(note(c[t*4%3|0])*4);\n  var out_2 = moog_osc_q2(note(c[t*4%3|0])*8);\n  var out_3 = moog_osc_q3(note(c[t*4%3|0])*8);\n\n  moog_lpf_q0\n    .cut(700 + (650 * moog_lfo_q0(0.5)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  moog_lpf_q1\n    .cut(1000 + (950 * moog_lfo_q1(1)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  moog_lpf_q2\n    .cut(1300 + (1250 * moog_lfo_q2(0.25)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  moog_lpf_q3\n    .cut(1300 + (1250 * moog_lfo_q2(0.25)))\n    .res(0.87)\n    .sat(2.15)\n    .update();\n\n  out_0 = moog_lpf_q0.run(out_0);\n  out_1 = moog_lpf_q1.run(out_1);\n  out_2 = moog_lpf_q2.run(out_2);\n  out_3 = moog_lpf_q3.run(out_3);\n\n  var vol = .3;\n\n  return {\n    0: out_0 * vol,\n    1: out_1 * vol,\n    2: out_2 * vol,\n    3: out_3 * vol,\n  };\n}];\n', 'dsp.js');

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

var XYs = ['a', 'b'].map(createXYController);
var XYContainer = document.createElement('div');
XYContainer.className = 'xy-container';

XYContainer.ontouchstart = XYContainer.ontouchenter = XYContainer.ontouchmove = XYContainer.onmousemove = function (e) {
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
      if (touch.clientX > xy.pos.left && touch.clientX < xy.pos.left + xy.pos.width && touch.clientY > xy.pos.top && touch.clientY < xy.pos.top + xy.pos.height) {
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

  el.ontouchleave = function (e) {
    xy.active = false;
  };

  document.body.addEventListener('mouseup', el.ontouchleave);

  el.onmousedown = function (e) {
    xy.active = true;
  };

  xy.el = el;
  xy.spot = spot;

  return xy;
}

XYs.forEach(function (xy) {
  return XYContainer.appendChild(xy.el);
});

columnRight.appendChild(XYContainer);

columnLeft.appendChild(keyboardContainerElement);

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

function getXYPositions() {
  XYs.forEach(function (xy) {
    return xy.pos = xy.el.getBoundingClientRect();
  });
}

var prevHeight = 0;

getKeysPositions();
getXYPositions();

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
  var oldSources = Object.assign({}, sources);
  for (var key in buffers) {
    if ('id' === key || 'timestamp' === key) continue;
    var source = sources[key];
    source = sources[key] = createBankSources(key, buffers[key]);
    source.multiplier = buffers[key].multiplier || 4;
    console.log('key', key, sources[key]);
    var soundKey = sounds[key.charCodeAt(0)];
    console.log('sound key', soundKey);
    if (soundKey.active) {
      soundKey.syncTime = calcSyncTime(source.multiplier);
      oldSources[key][soundKey.bank.name].stop(soundKey.syncTime);
      source[soundKey.bank.name].start(soundKey.syncTime);
    }
  }
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
    } catch (e) {
      console.log('cannot create source', key, e);
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

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhbGdvcmF2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQ3BCLE9BQUssRUFBTCxHQUFVLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0EsT0FBSyxFQUFMLENBQVEsU0FBUixHQUFvQixhQUFhLElBQWpDO0FBQ0EsT0FBSyxLQUFMLEdBQWEsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLElBQXpCO0FBQ0EsT0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixXQUF2QjtBQUNBLE9BQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsS0FBSyxLQUF6QjtBQUNBLE9BQUssUUFBTCxHQUFnQixLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBaEI7QUFDQSxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsT0FBSyxPQUFMO0FBQ0Q7O0FBRUQsT0FBTyxTQUFQLENBQWlCLE1BQWpCLEdBQTBCLFlBQVc7QUFDbkMsT0FBSyxFQUFMLENBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixRQUF0QjtBQUNBLE9BQUssTUFBTCxHQUFjLElBQWQ7QUFDRCxDQUhEOztBQUtBLE9BQU8sU0FBUCxDQUFpQixPQUFqQixHQUEyQixZQUFXO0FBQ3BDLE9BQUssRUFBTCxDQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsUUFBekI7QUFDQSxPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLFNBQVAsQ0FBaUIsTUFBakIsR0FBMEIsWUFBVztBQUNuQyxNQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLFNBQUssT0FBTDtBQUNELEdBRkQsTUFFTztBQUNMLFNBQUssTUFBTDtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CO0FBQ2xC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LGVBQU8sTUFBUCxHQUFnQixNQUFoQjtBQUNEO0FBQ0YsS0FYRCxDQVdFLE9BQU0sQ0FBTixFQUFTO0FBQ1QsY0FBUSxHQUFSLENBQVksc0JBQVosRUFBb0MsR0FBcEMsRUFBeUMsQ0FBekM7QUFDRDtBQUNELGFBQVMsUUFBUSxJQUFJLElBQVosRUFBa0IsSUFBSSxJQUFKLENBQVMsSUFBM0IsQ0FBVDtBQUNBLFlBQVEsR0FBUixDQUFZLFFBQVosRUFBc0IsTUFBdEI7QUFDQSxXQUFPLEtBQVAsQ0FBYSxRQUFiO0FBQ0Q7QUFDRjs7QUFFRCxTQUFTLElBQVQsQ0FBYyxHQUFkLEVBQW1CO0FBQ2pCLE1BQUksSUFBSSxJQUFKLElBQVksT0FBaEIsRUFBeUI7QUFDdkIsUUFBSSxTQUFTLFFBQVEsSUFBSSxJQUFaLENBQWI7QUFDQSxRQUFJLFdBQVcsYUFBYSxPQUFPLFVBQXBCLENBQWY7QUFDQSxXQUFPLElBQUksSUFBSixDQUFTLElBQWhCLEVBQXNCLElBQXRCLENBQTJCLFFBQTNCO0FBQ0Q7QUFDRCxVQUFRLEdBQVIsQ0FBWSxNQUFaLEVBQW9CLElBQUksSUFBeEI7QUFDRDs7QUFFRCxTQUFTLFdBQVQsR0FBdUI7QUFDckIsV0FBUyxLQUFULEVBQWdCLFNBQWhCLENBQTBCLE1BQTFCLENBQWlDLE9BQWpDO0FBQ0EsVUFBUSxNQUFNLEtBQU4sQ0FBUjtBQUNBLFdBQVMsS0FBVCxFQUFnQixTQUFoQixDQUEwQixHQUExQixDQUE4QixPQUE5QjtBQUNBLE1BQUksVUFBVSxRQUFkLEVBQXdCO0FBQ3RCLFNBQUssS0FBTDtBQUNELEdBRkQsTUFFTztBQUNMLFNBQUssSUFBTDtBQUNEO0FBQ0YiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gUGFkS2V5KGNoYXIpIHtcbiAgdGhpcy5lbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLmVsLmNsYXNzTmFtZSA9ICdrZXkga2V5LScgKyBjaGFyO1xuICB0aGlzLmxhYmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMubGFiZWwudGV4dENvbnRlbnQgPSBjaGFyO1xuICB0aGlzLmxhYmVsLmNsYXNzTmFtZSA9ICdrZXktbGFiZWwnO1xuICB0aGlzLmVsLmFwcGVuZENoaWxkKHRoaXMubGFiZWwpO1xuICB0aGlzLmNoYXJDb2RlID0gY2hhci5jaGFyQ29kZUF0KDApO1xuICB0aGlzLm5hbWUgPSBjaGFyO1xuICB0aGlzLnR1cm5PZmYoKTtcbn1cblxuUGFkS2V5LnByb3RvdHlwZS50dXJuT24gPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgdGhpcy5hY3RpdmUgPSB0cnVlO1xufTtcblxuUGFkS2V5LnByb3RvdHlwZS50dXJuT2ZmID0gZnVuY3Rpb24oKSB7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gIHRoaXMuYWN0aXZlID0gZmFsc2U7XG59O1xuXG5QYWRLZXkucHJvdG90eXBlLnRvZ2dsZSA9IGZ1bmN0aW9uKCkge1xuICBpZiAodGhpcy5hY3RpdmUpIHtcbiAgICB0aGlzLnR1cm5PZmYoKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnR1cm5PbigpO1xuICB9XG59O1xuXG5mdW5jdGlvbiBCYW5rKG5hbWUpIHtcbiAgdGhpcy5uYW1lID0gbmFtZTtcbiAgdGhpcy5iYW5rID0gbnVsbDtcbiAgdGhpcy5wcmV2QmFuayA9IG51bGw7XG59XG5cbmZ1bmN0aW9uIFNvdW5kS2V5KGNoYXIpIHtcbiAgUGFkS2V5LmNhbGwodGhpcywgY2hhcik7XG59XG5cblNvdW5kS2V5LnByb3RvdHlwZS5fX3Byb3RvX18gPSBQYWRLZXkucHJvdG90eXBlO1xuXG5Tb3VuZEtleS5wcm90b3R5cGUuc2V0QmFuayA9IGZ1bmN0aW9uKGJhbmspIHtcbiAgaWYgKHRoaXMuYmFuaykgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdiYW5rLScgKyB0aGlzLmJhbmsubmFtZSk7XG4gIHRoaXMucHJldkJhbmsgPSB0aGlzLmJhbms7XG4gIHRoaXMuYmFuayA9IGJhbms7XG4gIHRoaXMuZWwuY2xhc3NMaXN0LmFkZCgnYmFuay0nICsgdGhpcy5iYW5rLm5hbWUpO1xufTtcblxudmFyIGtleWJvYXJkID0gW1xuICAnMTIzNDU2Nzg5MCcuc3BsaXQoJycpLFxuICAncXdlcnR5dWlvcCcuc3BsaXQoJycpLFxuICAnYXNkZmdoamtsJy5zcGxpdCgnJyksXG4gICd6eGN2Ym5tJy5zcGxpdCgnJyksXG5dO1xuXG52YXIgc291bmRzID0ge307XG52YXIgYmFua3MgPSBbXTtcblxudmFyIGFsbEtleXMgPSBrZXlib2FyZC5yZWR1Y2UoKHAsIG4pID0+IHAuY29uY2F0KG4pKTtcblxudmFyIGNvbnRhaW5lckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmNvbnRhaW5lckVsZW1lbnQuY2xhc3NOYW1lID0gJ2NvbnRhaW5lcic7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRhaW5lckVsZW1lbnQpO1xuXG52YXIgY29sdW1uTGVmdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuY29sdW1uTGVmdC5jbGFzc05hbWUgPSAnY29sdW1uLWxlZnQnO1xuXG52YXIgY29sdW1uUmlnaHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmNvbHVtblJpZ2h0LmNsYXNzTmFtZSA9ICdjb2x1bW4tcmlnaHQnO1xuXG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbHVtbkxlZnQpO1xuZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChjb2x1bW5SaWdodCk7XG5cbnZhciBlZGl0b3JFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5lZGl0b3JFbGVtZW50LmNsYXNzTmFtZSA9ICdlZGl0b3InO1xuXG52YXIgamF6ekVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmphenpFbGVtZW50LmNsYXNzTmFtZSA9ICdqYXp6JztcblxudmFyIGphenpPcHRpb25zID0ge1xuICB0aGVtZTogJ3JlZGJsaXNzJyxcbiAgZm9udF9zaXplOiAnOXB0Jyxcbn07XG52YXIgamF6eiA9IG5ldyBKYXp6KGphenpPcHRpb25zKTtcblxuamF6ei5zZXQobG9jYWxTdG9yYWdlLnRleHQgfHwgYFxcXG5sZXQgeyBzaW4sIFNpbiwgU2F3LCBUcmksIFNxciwgQ2hvcmQsIENob3Jkcywgc29mdENsaXA6Y2xpcCwgbm90ZSwgZW52ZWxvcGUsIEtvcmczNUxQRiwgRGlvZGVGaWx0ZXIsIE1vb2dMYWRkZXIgfSA9IHN0dWRpbztcbmxldCB7IEJhc3NsaW5lIH0gPSBleHRlbmRlZDtcblxuLy8gcGF0Y2hlczogYSBkIGsgbCBtIG8gcCBxIHMgeFxuXG5leHBvcnQgbGV0IGJwbSA9IDEyMDtcbmxldCBwcm9nciA9IFsnRm1hajcnLCdCbWFqOScsJ0Q5JywnRyNtaW43J10ubWFwKENob3Jkcyk7XG5sZXQgcHJvZ3JfMiA9IFsnQ21pbicsJ0QjbWluJywnRm1pbicsJ0FtaW4nXS5tYXAoQ2hvcmRzKTtcblxuZXhwb3J0IGxldCBrID0gWzQsIGZ1bmN0aW9uIGtpY2sodCkge1xuICB2YXIgdm9sID0gLjY7XG4gIHJldHVybiB7XG4gICAgMDogYXJwKHQsIDEvNCwgNTAsIDMwLCA4KSAqIHZvbCxcbiAgICAxOiBhcnAodCwgMS80LCA1NiwgMzIsIDgpICogdm9sLFxuICAgIDI6IGFycCh0LCAxLzQsIDU5LCAyOCwgNCkgKiB2b2wsXG4gICAgMzogYXJwKHQsIDEvNCwgNjIsIDM0LCA0KSAqIHZvbCxcbiAgfTtcbn1dO1xuXG5leHBvcnQgbGV0IGwgPSBbNCwgZnVuY3Rpb24gaGloYXQodCkge1xuICB2YXIgdm9sID0gLjE7XG4gIHJldHVybiB7XG4gICAgMDogYXJwKHQrMS8yLCAxLzQsIE1hdGgucmFuZG9tKCkgKiA1NTUwLCAxNjAwLCAzNTApICogdm9sLFxuICAgIDE6IGFycCh0KzEvMiwgMS80LCBNYXRoLnJhbmRvbSgpICogNTU1MCwgMjYwMCwgMzUwKSAqIHZvbCxcbiAgICAyOiBhcnAodCsxLzIsIDEvNCwgTWF0aC5yYW5kb20oKSAqIDU1NTAsIDM2MDAsIDM1MCkgKiB2b2wsXG4gICAgMzogYXJwKHQrMS8yLCAxLzQsIE1hdGgucmFuZG9tKCkgKiA1NTUwLCA0MDAwLCAzNTApICogdm9sLFxuICB9O1xufV07XG5cbmV4cG9ydCBsZXQgciA9IFs0LCBmdW5jdGlvbih0KSB7XG4gICByZXR1cm4ge1xuICAgICAwOiAoc2luKHQsIG5vdGUocHJvZ3JbMV1bMF0pKi45KT4uNCoodCoyJTQpKSAqIHNpbih0LC4yNSkgKiBzaW4odCwuMiksXG4gICAgIDE6IChzaW4odCwgbm90ZShwcm9nclsxXVswXSkqLjgpPi40Kih0KjIlNCkpICogc2luKHQsLjI1KSAqIHNpbih0LC4yKSxcbiAgICAgMjogKHNpbih0LCBub3RlKHByb2dyWzFdWzBdKSoxLjIpPi40Kih0KjIlNCkpICogc2luKHQsLjI1KSAqIHNpbih0LC4yKSxcbiAgICAgMzogKHNpbih0LCBub3RlKHByb2dyWzFdWzBdKSoxLjUpPi40Kih0KjIlNCkpICogc2luKHQsLjI1KSAqIHNpbih0LC4yKSxcbiAgIH07XG59XTtcblxudmFyIGJhc3NfYTAgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2ExID0gbmV3IEJhc3NsaW5lKCk7XG52YXIgYmFzc19hMiA9IG5ldyBCYXNzbGluZSgpO1xudmFyIGJhc3NfYTMgPSBuZXcgQmFzc2xpbmUoKTtcbmJhc3NfYTAuc2VxKHByb2dyWzBdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4xNSkucHJlKDEpLmhwZiguMDAyMikuY2xpcCgxMCkucmVzKC43KS5sZm8oLjUpO1xuYmFzc19hMS5zZXEocHJvZ3JbMV0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjE4KS5wcmUoMSkuaHBmKC4wMDIyKS5jbGlwKDEwKS5yZXMoLjcpLmxmbyguNSk7XG5iYXNzX2EyLnNlcShwcm9nclsyXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMjUpLnByZSgxKS5ocGYoLjAwMjIpLmNsaXAoMTApLnJlcyguNykubGZvKC41KTtcbmJhc3NfYTMuc2VxKHByb2dyWzNdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4yNSkucHJlKDEpLmhwZiguMDAyMikuY2xpcCgxMCkucmVzKC43KS5sZm8oLjUpO1xuXG5leHBvcnQgbGV0IGEgPSBbNCwgZnVuY3Rpb24gYmFzc19hKHQpIHtcbiAgdmFyIHZvbCA9IC40O1xuICByZXR1cm4ge1xuICAgIDA6IGJhc3NfYTAucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDEwLCA1KSAqIHZvbCxcbiAgICAxOiBiYXNzX2ExLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAxMCwgNSkgKiB2b2wsXG4gICAgMjogYmFzc19hMi5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMTAsIDUpICogdm9sLFxuICAgIDM6IGJhc3NfYTMucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDEwLCA1KSAqIHZvbCxcbiAgfTtcbn1dO1xuXG52YXIgYmFzc19kMCA9IG5ldyBCYXNzbGluZSgpO1xudmFyIGJhc3NfZDEgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2QyID0gbmV3IEJhc3NsaW5lKCk7XG52YXIgYmFzc19kMyA9IG5ldyBCYXNzbGluZSgpO1xuYmFzc19kMC5zZXEocHJvZ3JfMlswXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMTUpLnByZSguNSkuaHBmKC4wMDcyKS5jbGlwKDUpLnJlcyguNykubGZvKDEpLmxmbzIoLjI1KTtcbmJhc3NfZDEuc2VxKHByb2dyXzJbMV0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjE4KS5wcmUoLjUpLmhwZiguMDA3MikuY2xpcCg1KS5yZXMoLjcpLmxmbygxKS5sZm8yKC4yNSk7XG5iYXNzX2QyLnNlcShwcm9ncl8yWzJdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4yNSkucHJlKC41KS5ocGYoLjAwNzIpLmNsaXAoNSkucmVzKC43KS5sZm8oMSkubGZvMiguMjUpO1xuYmFzc19kMy5zZXEocHJvZ3JfMlszXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMjUpLnByZSguNSkuaHBmKC4wMDcyKS5jbGlwKDUpLnJlcyguNykubGZvKDEpLmxmbzIoLjI1KTtcblxuZXhwb3J0IGxldCBkID0gWzQsIGZ1bmN0aW9uIGJhc3NfZCh0KSB7XG4gIHZhciB2b2wgPSAuNztcbiAgcmV0dXJuIHtcbiAgICAwOiBiYXNzX2QwLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAzLCA1KSAqIHZvbCxcbiAgICAxOiBiYXNzX2QxLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAzLCA1KSAqIHZvbCxcbiAgICAyOiBiYXNzX2QyLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAzLCA1KSAqIHZvbCxcbiAgICAzOiBiYXNzX2QzLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAzLCA1KSAqIHZvbCxcbiAgfTtcbn1dO1xuXG52YXIgc3ludGhfb3NjXzAgPSBUcmkoMzIsIHRydWUpO1xudmFyIHN5bnRoX29zY18xID0gVHJpKDMyLCB0cnVlKTtcbnZhciBzeW50aF9vc2NfMiA9IFRyaSgzMiwgdHJ1ZSk7XG52YXIgc3ludGhfb3NjXzMgPSBUcmkoMzIsIHRydWUpO1xuZXhwb3J0IGxldCBvID0gWzQsIGZ1bmN0aW9uIHN5bnRoKHQpIHtcbiAgdmFyIHZvbCA9IC4zO1xuICByZXR1cm4ge1xuICAgIDA6IHN5bnRoX29zY18wKG5vdGUocHJvZ3JbKHQlNCl8MF1bKHQqNCUzKXwwXSkpICogZW52ZWxvcGUodCsxLzIsIDEvNCwgNSwgNCkgKiB2b2wsXG4gICAgMTogc3ludGhfb3NjXzEobm90ZShwcm9nclsodCU0KXwwXVsodCo0JTMpfDBdKSoyKSAqIGVudmVsb3BlKHQrMS8yLCAxLzQsIDUsIDQpICogdm9sLFxuICAgIDI6IHN5bnRoX29zY18yKG5vdGUocHJvZ3JbKHQlNCl8MF1bKHQqNCUzKXwwXSkqNCkgKiBlbnZlbG9wZSh0KzEvMiwgMS80LCA1LCA0KSAqIHZvbCxcbiAgICAzOiBzeW50aF9vc2NfMyhub3RlKHByb2dyWyh0JTQpfDBdWyh0KjQlMyl8MF0pKjgpICogZW52ZWxvcGUodCsxLzIsIDEvNCwgNSwgNCkgKiB2b2wsXG4gIH07XG59XTtcblxudmFyIHBhZF9vc2NfMCA9IENob3JkKFNhdywgMTI4LCB0cnVlKTtcbnZhciBwYWRfb3NjXzEgPSBDaG9yZChTYXcsIDEyOCwgdHJ1ZSk7XG52YXIgcGFkX29zY18yID0gQ2hvcmQoU2F3LCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfMyA9IENob3JkKFNhdywgMTI4LCB0cnVlKTtcblxudmFyIGZpbHRlcl9wYWRfMCA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfMSA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfMiA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfMyA9IEtvcmczNUxQRigpO1xuZmlsdGVyX3BhZF8wLmN1dCg1MDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF8xLmN1dCg1MDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF8yLmN1dCg1MDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF8zLmN1dCg1MDApLnJlcygyLjEpLnNhdCgyLjEpO1xuXG5leHBvcnQgbGV0IHAgPSBbNCwgZnVuY3Rpb24gcGFkKHQpIHtcbiAgdmFyIHZvbCA9IC4zO1xuICB2YXIgYyA9IHByb2dyW3QlNHwwXTtcbiAgdmFyIG91dF8wID0gcGFkX29zY18wKGMubWFwKG5vdGUpLm1hcChuPT5uKjIpKSAqIGVudmVsb3BlKHQsIDEvNCwgNSwgNCkgKiB2b2w7XG4gIHZhciBvdXRfMSA9IHBhZF9vc2NfMShjLm1hcChub3RlKS5tYXAobj0+bio0KSkgKiBlbnZlbG9wZSh0LCAxLzQsIDUsIDQpICogdm9sO1xuICB2YXIgb3V0XzIgPSBwYWRfb3NjXzIoYy5tYXAobm90ZSkubWFwKG49Pm4qOCkpICogZW52ZWxvcGUodCwgMS80LCA1LCA0KSAqIHZvbDtcbiAgdmFyIG91dF8zID0gcGFkX29zY18yKGMubWFwKG5vdGUpLm1hcChuPT5uKjgpKSAqIGVudmVsb3BlKHQsIDEvNCwgNSwgNCkgKiB2b2w7XG4gIHJldHVybiB7XG4gICAgMDogZmlsdGVyX3BhZF8wLnJ1bihvdXRfMCksXG4gICAgMTogZmlsdGVyX3BhZF8xLnJ1bihvdXRfMSksXG4gICAgMjogZmlsdGVyX3BhZF8yLnJ1bihvdXRfMiksXG4gICAgMzogZmlsdGVyX3BhZF8zLnJ1bihvdXRfMyksXG4gIH07XG59XTtcblxudmFyIHBhZF9vc2NfbTAgPSBDaG9yZChTcXIsIDEyOCwgdHJ1ZSk7XG52YXIgcGFkX29zY19tMSA9IENob3JkKFNxciwgMTI4LCB0cnVlKTtcbnZhciBwYWRfb3NjX20yID0gQ2hvcmQoU3FyLCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfbTMgPSBDaG9yZChTcXIsIDEyOCwgdHJ1ZSk7XG5cbnZhciBmaWx0ZXJfcGFkX20wID0gS29yZzM1TFBGKCk7XG52YXIgZmlsdGVyX3BhZF9tMSA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfbTIgPSBLb3JnMzVMUEYoKTtcbnZhciBmaWx0ZXJfcGFkX20zID0gS29yZzM1TFBGKCk7XG5maWx0ZXJfcGFkX20wLmN1dCgyMDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF9tMS5jdXQoMjAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcbmZpbHRlcl9wYWRfbTIuY3V0KDIwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5maWx0ZXJfcGFkX20zLmN1dCgyMDApLnJlcygyLjEpLnNhdCgyLjEpO1xuXG52YXIgbGZvX20gPSBTaW4oKTtcblxuZXhwb3J0IGxldCBtID0gWzQsIGZ1bmN0aW9uIHBhZCh0KSB7XG4gIHZhciB2b2wgPSAuNTtcbiAgdmFyIGMgPSBwcm9ncl8yWyh0KjMpJTN8MF07XG4gIHZhciBvdXRfMCA9IHBhZF9vc2NfbTAoYy5tYXAobm90ZSkubWFwKG49Pm4qNCkpICogZW52ZWxvcGUodCsxLzQsIDEvMiwgNSwgLTIpICogdm9sICogbGZvX20oLjIpO1xuICB2YXIgb3V0XzEgPSBwYWRfb3NjX20xKGMubWFwKG5vdGUpLm1hcChuPT5uKjYpKSAqIGVudmVsb3BlKHQrMS80LCAxLzIsIDUsIC0yKSAqIHZvbCAqIGxmb19tKC4yKTtcbiAgdmFyIG91dF8yID0gcGFkX29zY19tMihjLm1hcChub3RlKS5tYXAobj0+bio4KSkgKiBlbnZlbG9wZSh0KzEvNCwgMS8yLCA1LCAtMikgKiB2b2wgKiBsZm9fbSguMik7XG4gIHZhciBvdXRfMyA9IHBhZF9vc2NfbTMoYy5tYXAobm90ZSkubWFwKG49Pm4qOCkpICogZW52ZWxvcGUodCsxLzQsIDEvMiwgNSwgLTIpICogdm9sICogbGZvX20oLjIpO1xuICByZXR1cm4ge1xuICAgIDA6IGZpbHRlcl9wYWRfbTAucnVuKG91dF8wKSxcbiAgICAxOiBmaWx0ZXJfcGFkX20xLnJ1bihvdXRfMSksXG4gICAgMjogZmlsdGVyX3BhZF9tMi5ydW4ob3V0XzIpLFxuICAgIDM6IGZpbHRlcl9wYWRfbTMucnVuKG91dF8zKSxcbiAgfTtcbn1dO1xuXG52YXIgY2hpcF9vc2NfMCA9IFRyaSgxMCwgZmFsc2UpO1xudmFyIGNoaXBfb3NjXzEgPSBUcmkoMTAsIGZhbHNlKTtcbnZhciBjaGlwX29zY18yID0gVHJpKDEwLCBmYWxzZSk7XG52YXIgY2hpcF9vc2NfMyA9IFRyaSgxMCwgZmFsc2UpO1xuXG5leHBvcnQgbGV0IHMgPSBbOCwgZnVuY3Rpb24gY2hpcCh0KSB7XG4gIHZhciBjID0gbm90ZShwcm9nclswXVt0JXByb2dyWzBdLmxlbmd0aHwwXSkqODtcbiAgcmV0dXJuIHtcbiAgICAwOiAuNyAqIGFycCh0KzIvOCwgMS8yOCwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjXzAoYykqKHQqNCUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICAgIDE6IC43ICogYXJwKHQrMi84LCAxLzI4LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfMShjKjIpKih0KjglKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMDAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAyOiAuNyAqIGFycCh0KzIvOCwgMS8yOCwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjXzIoYyo0KSoodCoxNiUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICAgIDM6IC43ICogYXJwKHQrMi84LCAxLzI4LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfMyhjKjgpKih0KjE2JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gIH1cbn1dO1xuXG52YXIgY2hpcF9vc2NfeDAgPSBUcmkoMTAsIHRydWUpO1xudmFyIGNoaXBfb3NjX3gxID0gVHJpKDEwLCB0cnVlKTtcbnZhciBjaGlwX29zY194MiA9IFRyaSgxMCwgdHJ1ZSk7XG52YXIgY2hpcF9vc2NfeDMgPSBUcmkoMTAsIHRydWUpO1xuXG5leHBvcnQgbGV0IHggPSBbOCwgZnVuY3Rpb24gY2hpcCh0KSB7XG4gIHZhciBjID0gbm90ZShwcm9ncl8yWzBdW3QlcHJvZ3JfMlswXS5sZW5ndGh8MF0pKjg7XG4gIHZhciB2b2wgPSAuNTtcbiAgcmV0dXJuIHtcbiAgICAwOiB2b2wgKiBhcnAodCsyLzgsIDEvMTYsIGFycCh0LCAxLzE2LCBjaGlwX29zY194MChjKSoodCo0JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgICAxOiB2b2wgKiBhcnAodCsyLzgsIDEvMTYsIGFycCh0LCAxLzE2LCBjaGlwX29zY194MShjKjIpKih0KjglKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICAgIDI6IHZvbCAqIGFycCh0KzIvOCwgMS8xNiwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjX3gyKGMqNCkqKHQqMTYlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICAgIDM6IHZvbCAqIGFycCh0KzIvOCwgMS8xNiwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjX3gyKGMqOCkqKHQqMTYlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICB9XG59XTtcblxudmFyIG1vb2dfbHBmX3EwID0gTW9vZ0xhZGRlcignaGFsZicpO1xudmFyIG1vb2dfbHBmX3ExID0gTW9vZ0xhZGRlcignaGFsZicpO1xudmFyIG1vb2dfbHBmX3EyID0gTW9vZ0xhZGRlcignaGFsZicpO1xudmFyIG1vb2dfbHBmX3EzID0gTW9vZ0xhZGRlcignaGFsZicpO1xuXG52YXIgbW9vZ19vc2NfcTAgPSBTYXcoKTtcbnZhciBtb29nX29zY19xMSA9IFNhdygpO1xudmFyIG1vb2dfb3NjX3EyID0gU2F3KCk7XG52YXIgbW9vZ19vc2NfcTMgPSBTYXcoKTtcblxudmFyIG1vb2dfbGZvX3EwID0gU2luKCk7XG52YXIgbW9vZ19sZm9fcTEgPSBTaW4oKTtcbnZhciBtb29nX2xmb19xMiA9IFNpbigpO1xudmFyIG1vb2dfbGZvX3EzID0gU2luKCk7XG5cbmV4cG9ydCBsZXQgcSA9IFs4LCBmdW5jdGlvbiBtb29nKHQpe1xuICB0Lz0yXG5cbiAgdmFyIGMgPSBwcm9nclsodCVwcm9nci5sZW5ndGh8MCldO1xuICB2YXIgb3V0XzAgPSBtb29nX29zY19xMChub3RlKGNbdCo0JTN8MF0pKjIpO1xuICB2YXIgb3V0XzEgPSBtb29nX29zY19xMShub3RlKGNbdCo0JTN8MF0pKjQpO1xuICB2YXIgb3V0XzIgPSBtb29nX29zY19xMihub3RlKGNbdCo0JTN8MF0pKjgpO1xuICB2YXIgb3V0XzMgPSBtb29nX29zY19xMyhub3RlKGNbdCo0JTN8MF0pKjgpO1xuXG4gIG1vb2dfbHBmX3EwXG4gICAgLmN1dCg3MDAgKyAoNjUwICogbW9vZ19sZm9fcTAoMC41KSkpXG4gICAgLnJlcygwLjg3KVxuICAgIC5zYXQoMi4xNSlcbiAgICAudXBkYXRlKCk7XG5cbiAgbW9vZ19scGZfcTFcbiAgICAuY3V0KDEwMDAgKyAoOTUwICogbW9vZ19sZm9fcTEoMSkpKVxuICAgIC5yZXMoMC44NylcbiAgICAuc2F0KDIuMTUpXG4gICAgLnVwZGF0ZSgpO1xuXG4gIG1vb2dfbHBmX3EyXG4gICAgLmN1dCgxMzAwICsgKDEyNTAgKiBtb29nX2xmb19xMigwLjI1KSkpXG4gICAgLnJlcygwLjg3KVxuICAgIC5zYXQoMi4xNSlcbiAgICAudXBkYXRlKCk7XG5cbiAgbW9vZ19scGZfcTNcbiAgICAuY3V0KDEzMDAgKyAoMTI1MCAqIG1vb2dfbGZvX3EyKDAuMjUpKSlcbiAgICAucmVzKDAuODcpXG4gICAgLnNhdCgyLjE1KVxuICAgIC51cGRhdGUoKTtcblxuICBvdXRfMCA9IG1vb2dfbHBmX3EwLnJ1bihvdXRfMCk7XG4gIG91dF8xID0gbW9vZ19scGZfcTEucnVuKG91dF8xKTtcbiAgb3V0XzIgPSBtb29nX2xwZl9xMi5ydW4ob3V0XzIpO1xuICBvdXRfMyA9IG1vb2dfbHBmX3EzLnJ1bihvdXRfMyk7XG5cbiAgdmFyIHZvbCA9IC4zO1xuXG4gIHJldHVybiB7XG4gICAgMDogb3V0XzAgKiB2b2wsXG4gICAgMTogb3V0XzEgKiB2b2wsXG4gICAgMjogb3V0XzIgKiB2b2wsXG4gICAgMzogb3V0XzMgKiB2b2wsXG4gIH07XG59XTtcbmAsICdkc3AuanMnKTtcblxuZWRpdG9yRWxlbWVudC5hcHBlbmRDaGlsZChqYXp6RWxlbWVudCk7XG5cbmNvbHVtbkxlZnQuYXBwZW5kQ2hpbGQoZWRpdG9yRWxlbWVudCk7XG5cbmphenoudXNlKGphenpFbGVtZW50KTtcblxudmFyIGtleWJvYXJkQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xua2V5Ym9hcmRDb250YWluZXJFbGVtZW50LmNsYXNzTmFtZSA9ICdrZXlib2FyZC1jb250YWluZXInO1xuXG52YXIga2V5Ym9hcmRFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5rZXlib2FyZEVsZW1lbnQuY2xhc3NOYW1lID0gJ2tleWJvYXJkJztcblxudmFyIGZpbGVuYW1lRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuZmlsZW5hbWVFbGVtZW50LmNsYXNzTmFtZSA9ICdmaWxlbmFtZSc7XG5cbmVkaXRvckVsZW1lbnQuYXBwZW5kQ2hpbGQoZmlsZW5hbWVFbGVtZW50KTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCBrZXlib2FyZC5sZW5ndGg7IGkrKykge1xuICB2YXIgcm93ID0ga2V5Ym9hcmRbaV07XG4gIHZhciByb3dFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHJvd0VsZW1lbnQuY2xhc3NOYW1lID0gJ3JvdyByb3ctJyArIGk7XG4gIGZvciAodmFyIGsgPSAwOyBrIDwgcm93Lmxlbmd0aDsgaysrKSB7XG4gICAgdmFyIGNoYXIgPSByb3dba107XG4gICAgdmFyIGtleTtcbiAgICBrZXkgPSBuZXcgU291bmRLZXkoY2hhcik7XG4gICAgc291bmRzW2tleS5jaGFyQ29kZV0gPSBrZXk7XG4gICAgcm93RWxlbWVudC5hcHBlbmRDaGlsZChrZXkuZWwpO1xuICAgIGtleS5lbC5vbm1vdXNlZG93biA9XG4gICAga2V5LmxhYmVsLm9ubW91c2Vkb3duID1cbiAgICBrZXkubGFiZWwub250b3VjaHN0YXJ0ID0gZGVib3VuY2UoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgcmV0dXJuIGUgPT4ge1xuICAgICAgICBuZXh0QmFuayhrZXkpO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0oa2V5KSksIDIwMCk7XG4gIH1cbiAga2V5Ym9hcmRFbGVtZW50LmFwcGVuZENoaWxkKHJvd0VsZW1lbnQpO1xufVxuXG52YXIgbGFzdFRvdWNoS2V5ID0gbnVsbDtcbnZhciBkZWJvdW5jZUxhc3RUb3VjaEtleTtcblxua2V5Ym9hcmRFbGVtZW50Lm9udG91Y2hzdGFydCA9XG5rZXlib2FyZEVsZW1lbnQub250b3VjaG1vdmUgPVxua2V5Ym9hcmRFbGVtZW50Lm9udG91Y2hlbnRlciA9IGZ1bmN0aW9uIGhhbmRsZXIoZSkge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG4gIGlmICghZS50b3VjaGVzKSB7XG4gICAgZS50b3VjaGVzID0gWyB7dG91Y2g6IFtlXX0gXTtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBlLnRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgdG91Y2ggPSBlLnRvdWNoZXNbaV07XG4gICAgZm9yICh2YXIgY2hhciBpbiBzb3VuZHMpIHtcbiAgICAgIHZhciBrZXkgPSBzb3VuZHNbY2hhcl07XG4gICAgICBpZiAoIHRvdWNoLmNsaWVudFggPiBrZXkucG9zLmxlZnQgJiYgdG91Y2guY2xpZW50WCA8PSBrZXkucG9zLmxlZnQgKyBrZXkucG9zLndpZHRoXG4gICAgICAgICYmIHRvdWNoLmNsaWVudFkgPiBrZXkucG9zLnRvcCAmJiB0b3VjaC5jbGllbnRZIDw9IGtleS5wb3MudG9wICsga2V5LnBvcy5oZWlnaHRcbiAgICAgICAgJiYgbGFzdFRvdWNoS2V5ICE9PSBrZXlcbiAgICAgICkge1xuICAgICAgICBuZXh0QmFuayhrZXkpO1xuICAgICAgICBsYXN0VG91Y2hLZXkgPSBrZXk7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5rZXlib2FyZEVsZW1lbnQub250b3VjaHN0YXJ0ID0gZnVuY3Rpb24gaGFuZGxlcihlKSB7XG4gIGlmICghZS50b3VjaGVzKSB7XG4gICAgZS50b3VjaGVzID0gWyB7dG91Y2g6IFtlXX0gXVxuICAgIHJldHVybjtcbiAgfVxuICBsYXN0VG91Y2hLZXkgPSBudWxsO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcbiAgICBmb3IgKHZhciBjaGFyIGluIHNvdW5kcykge1xuICAgICAgdmFyIGtleSA9IHNvdW5kc1tjaGFyXTtcbiAgICAgIGlmICggdG91Y2guY2xpZW50WCA+IGtleS5wb3MubGVmdCAmJiB0b3VjaC5jbGllbnRYIDw9IGtleS5wb3MubGVmdCArIGtleS5wb3Mud2lkdGhcbiAgICAgICAgJiYgdG91Y2guY2xpZW50WSA+IGtleS5wb3MudG9wICYmIHRvdWNoLmNsaWVudFkgPD0ga2V5LnBvcy50b3AgKyBrZXkucG9zLmhlaWdodFxuICAgICAgICAmJiBsYXN0VG91Y2hLZXkgIT09IGtleVxuICAgICAgKSB7XG4gICAgICAgIG5leHRCYW5rKGtleSk7XG4gICAgICAgIGxhc3RUb3VjaEtleSA9IGtleTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmtleWJvYXJkQ29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChrZXlib2FyZEVsZW1lbnQpO1xuXG52YXIgWFlzID0gWydhJywnYiddLm1hcChjcmVhdGVYWUNvbnRyb2xsZXIpO1xudmFyIFhZQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5YWUNvbnRhaW5lci5jbGFzc05hbWUgPSAneHktY29udGFpbmVyJztcblxuWFlDb250YWluZXIub250b3VjaHN0YXJ0ID1cblhZQ29udGFpbmVyLm9udG91Y2hlbnRlciA9XG5YWUNvbnRhaW5lci5vbnRvdWNobW92ZSA9XG5YWUNvbnRhaW5lci5vbm1vdXNlbW92ZSA9IGUgPT4ge1xuICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICBlLnRvdWNoZXMgPSBbZV07XG4gIH1cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IFhZcy5sZW5ndGg7IGorKykge1xuICAgICAgdmFyIHh5ID0gWFlzW2pdO1xuICAgICAgLy8gaWYgKHh5LmFjdGl2ZSA9PT0gZmFsc2UpIGNvbnRpbnVlO1xuICAgICAgaWYgKCB0b3VjaC5jbGllbnRYID4geHkucG9zLmxlZnQgJiYgdG91Y2guY2xpZW50WCA8IHh5LnBvcy5sZWZ0ICsgeHkucG9zLndpZHRoXG4gICAgICAgICYmIHRvdWNoLmNsaWVudFkgPiB4eS5wb3MudG9wICYmIHRvdWNoLmNsaWVudFkgPCB4eS5wb3MudG9wICsgeHkucG9zLmhlaWdodFxuICAgICAgICApIHsgICAgICBcbiAgICAgICAgT2JqZWN0LmFzc2lnbih4eS5zcG90LnN0eWxlLCB7XG4gICAgICAgICAgbGVmdDogdG91Y2guY2xpZW50WCAtIHh5LnBvcy5sZWZ0ICsgJ3B4JyxcbiAgICAgICAgICB0b3A6IHRvdWNoLmNsaWVudFkgLSB4eS5wb3MudG9wICsgJ3B4J1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGNyZWF0ZVhZQ29udHJvbGxlcihuKSB7XG4gIHZhciB4eSA9IHt9O1xuXG4gIHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBlbC5jbGFzc05hbWUgPSAneHktY29udHJvbGxlciB4eS0nICsgbjtcblxuICB2YXIgc3BvdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBzcG90LmNsYXNzTmFtZSA9ICd4eS1zcG90JztcblxuICBlbC5hcHBlbmRDaGlsZChzcG90KTtcbiAgdmFyIGNlbnRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZWwuYXBwZW5kQ2hpbGQoY2VudGVyKTtcblxuICBlbC5vbnRvdWNobGVhdmUgPSBlID0+IHtcbiAgICB4eS5hY3RpdmUgPSBmYWxzZTtcbiAgfTtcblxuICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBlbC5vbnRvdWNobGVhdmUpO1xuXG4gIGVsLm9ubW91c2Vkb3duID0gZSA9PiB7XG4gICAgeHkuYWN0aXZlID0gdHJ1ZTtcbiAgfTtcblxuICB4eS5lbCA9IGVsO1xuICB4eS5zcG90ID0gc3BvdDtcblxuICByZXR1cm4geHk7XG59XG5cblhZcy5mb3JFYWNoKHh5ID0+IFhZQ29udGFpbmVyLmFwcGVuZENoaWxkKHh5LmVsKSk7XG5cbmNvbHVtblJpZ2h0LmFwcGVuZENoaWxkKFhZQ29udGFpbmVyKTtcblxuY29sdW1uTGVmdC5hcHBlbmRDaGlsZChrZXlib2FyZENvbnRhaW5lckVsZW1lbnQpO1xuXG52YXIgZWxlbWVudHMgPSB7XG4gICdlZGl0b3InOiBlZGl0b3JFbGVtZW50LFxuICAna2V5Ym9hcmQnOiBrZXlib2FyZEVsZW1lbnRcbn07XG52YXIgZm9jdXMgPSAna2V5Ym9hcmQnO1xudmFyIG90aGVyID0ge1xuICAnZWRpdG9yJzogJ2tleWJvYXJkJyxcbiAgJ2tleWJvYXJkJzogJ2VkaXRvcicsXG59O1xuXG5lbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LmFkZCgnZm9jdXMnKTtcblxuamF6ei5ibHVyKCk7XG5cbmphenouaW5wdXQudGV4dC5lbC5zdHlsZS5oZWlnaHQgPSAnNTAlJztcblxuamF6ei5vbignZm9jdXMnLCAoKSA9PiB7XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1cycpO1xuICBmb2N1cyA9ICdlZGl0b3InO1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LmFkZCgnZm9jdXMnKTtcbn0pO1xuXG5qYXp6Lm9uKCdibHVyJywgKCkgPT4ge1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXMnKTtcbiAgZm9jdXMgPSAna2V5Ym9hcmQnO1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LmFkZCgnZm9jdXMnKTtcbn0pO1xuXG4vLyB9KTtcblxuZG9jdW1lbnQuYm9keS5vbmtleXVwID0gZSA9PiB7XG4gIGlmIChlLmtleSA9PT0gJ1NoaWZ0Jykge1xuICAgIHN0YXRlLnRyaWdnZXJCYW5rID0gZmFsc2U7XG4gIH1cbn1cblxuZG9jdW1lbnQuYm9keS5vbmtleWRvd24gPSBlID0+IHtcbiAgaWYgKGUua2V5Lmxlbmd0aCA+IDEpIHtcbiAgICBpZiAoZS5rZXkgPT09ICdFc2NhcGUnKSB0b2dnbGVQYW5lbCgpO1xuICAgIGlmIChlLmtleSA9PT0gJ1RhYicpIHtcbiAgICAgIGlmIChlLnNoaWZ0S2V5KSB0b2dnbGVQYW5lbCgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKGZvY3VzID09PSAnZWRpdG9yJykgcmV0dXJuO1xuICB2YXIgY2hhciA9IGUua2V5LnRvTG93ZXJDYXNlKCk7XG4gIGlmIChjaGFyID09PSBjaGFyLnRvVXBwZXJDYXNlKCkpIHtcbiAgICBpZiAoY2hhciA9PT0gJyEnKSBjaGFyID0gJzEnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICdAJykgY2hhciA9ICcyJztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnIycpIGNoYXIgPSAnMyc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyQnKSBjaGFyID0gJzQnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICclJykgY2hhciA9ICc1JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnXicpIGNoYXIgPSAnNic7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyYnKSBjaGFyID0gJzcnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICcqJykgY2hhciA9ICc4JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnKCcpIGNoYXIgPSAnOSc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyknKSBjaGFyID0gJzAnO1xuICB9XG4gIHZhciBjaGFyQ29kZSA9IGNoYXIudG9Mb3dlckNhc2UoKS5jaGFyQ29kZUF0KDApO1xuICB2YXIga2V5ID0gc291bmRzW2NoYXJDb2RlXTtcbiAgaWYgKGUuc2hpZnRLZXkpIHtcbiAgICBrZXkudHVybk9mZigpO1xuICB9IGVsc2Uge1xuICAgIG5leHRCYW5rKGtleSk7XG4gIH1cbn07XG5cbmZvciAodmFyIGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gIGJhbmtzLnB1c2gobmV3IEJhbmsoaSkpO1xufVxuXG5mdW5jdGlvbiBnZXRLZXlzUG9zaXRpb25zKCkge1xuICBmb3IgKHZhciBjaGFyIGluIHNvdW5kcykge1xuICAgIHZhciBrZXkgPSBzb3VuZHNbY2hhcl07XG4gICAga2V5LnBvcyA9IGtleS5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRYWVBvc2l0aW9ucygpIHtcbiAgWFlzLmZvckVhY2goeHkgPT4geHkucG9zID0geHkuZWwuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkpOyAgXG59XG5cbnZhciBwcmV2SGVpZ2h0ID0gMDtcblxuZ2V0S2V5c1Bvc2l0aW9ucygpO1xuZ2V0WFlQb3NpdGlvbnMoKTtcblxud2luZG93Lm9uc2Nyb2xsID0gZSA9PiB7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgcmV0dXJuIGZhbHNlO1xufTtcblxud2luZG93Lm9ucmVzaXplID0gZSA9PiB7XG4gIGdldEtleXNQb3NpdGlvbnMoKTtcbiAgaWYgKHByZXZIZWlnaHQgJiYgcHJldkhlaWdodCA8IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0KSB7XG4gICAgamF6ei5ibHVyKCk7XG4gIH1cbiAgcHJldkhlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xufTtcblxudmFyIHN0YXRlID0ge1xuICBhY3RpdmVCYW5rOiBiYW5rc1swXSxcbiAgdHJpZ2dlckJhbms6IGZhbHNlXG59O1xuXG5mb3IgKHZhciBrZXkgaW4gc291bmRzKSB7XG4gIHNvdW5kc1trZXldLnNldEJhbmsoc3RhdGUuYWN0aXZlQmFuayk7XG59XG5cbmZ1bmN0aW9uIG5leHRCYW5rKGtleSkge1xuICB2YXIgYmFuaztcblxuICBpZiAoIWtleS5hY3RpdmUpIHtcbiAgICBiYW5rID0gYmFua3NbMF07XG4gIH0gZWxzZSB7XG4gICAgdmFyIG5leHRCYW5rSW5kZXggPSAra2V5LmJhbmsubmFtZSArIDE7XG4gICAgYmFuayA9IGJhbmtzW25leHRCYW5rSW5kZXggJSAoYmFua3MubGVuZ3RoICsgMSldO1xuICB9XG5cbiAgaWYgKGJhbmspIHtcbiAgICBzdGF0ZS5hY3RpdmVCYW5rID0gYmFuaztcbiAgICBrZXkuc2V0QmFuayhzdGF0ZS5hY3RpdmVCYW5rKTtcbiAgICBrZXkudHVybk9uKCk7XG4gIH0gZWxzZSB7XG4gICAga2V5LnR1cm5PZmYoKTtcbiAgfVxuXG4gIGFsdGVyU3RhdGUoa2V5KTtcbn1cblxudmFyIHBsYXlpbmcgPSB7fTtcblxudmFyIEFDID0gd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCB8fCB3aW5kb3cuQXVkaW9Db250ZXh0O1xudmFyIGF1ZGlvID0gbmV3IEFDO1xud2luZG93LnNhbXBsZVJhdGUgPSBhdWRpby5zYW1wbGVSYXRlO1xuXG52YXIgYnBtID0gNjA7XG52YXIgc291cmNlcyA9IHt9O1xudmFyIGJlYXRUaW1lO1xuXG5jbG9jaygpO1xuXG5mdW5jdGlvbiBjbG9jaygpIHtcbiAgYmVhdFRpbWUgPSAxIC8gKGJwbSAvIDYwKTtcbn1cblxuamF6ei5vbignaW5wdXQnLCBkZWJvdW5jZSgoKSA9PiB7XG4gIGNvbnNvbGUubG9nKCdyZWFkIGlucHV0Jyk7XG4gIHZhciB0ZXh0ID0gamF6ei5idWZmZXIudGV4dC50b1N0cmluZygpO1xuICBsb2NhbFN0b3JhZ2UudGV4dCA9IHRleHQ7XG4gIGJ1aWxkKG51bGwsIHRleHQpO1xufSwgNzAwKSk7XG5cbmZ1bmN0aW9uIGRlYm91bmNlKGZuLCBtcykge1xuICB2YXIgdGltZW91dDtcbiAgcmV0dXJuIGZ1bmN0aW9uIGRlYm91bmNlV3JhcChhLCBiLCBjKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGZuLCBtcywgYSwgYiwgYyk7XG4gIH07XG59XG5cbnZhciBjYWxsYmFja3MgPSBbXTtcbnZhciBjYWxsYmFja0lkID0gMDtcblxudmFyIHdvcmtlciA9IG5ldyBXb3JrZXIoJ3dvcmtlci5qcycpO1xuXG53b3JrZXIub25tZXNzYWdlID0gZnVuY3Rpb24gb25tZXNzYWdlKGUpIHtcbiAgdmFyIHBhcmFtcyA9IGUuZGF0YTtcbiAgY29uc29sZS5sb2coJ3JlY2VpdmVkIHBhcmFtcycsIHBhcmFtcylcbiAgaWYgKHBhcmFtcyA9PT0gdHJ1ZSkgcmV0dXJuO1xuICBpZiAoJ251bWJlcicgPT09IHR5cGVvZiBwYXJhbXMpIHtcbiAgICBicG0gPSBwYXJhbXM7XG4gICAgY2xvY2soKTtcbiAgICBjb25zb2xlLmxvZygncmVjZWl2ZWQgYnBtJywgYnBtKTtcbiAgICByZXR1cm47XG4gIH1cbiAgY29uc29sZS5sb2cocGFyYW1zLCBjYWxsYmFja3MpXG4gIHZhciB0aW1lID0gRGF0ZS5ub3coKSAtIHBhcmFtcy50aW1lc3RhbXA7XG4gIHZhciBjYiA9IGNhbGxiYWNrc1twYXJhbXMuaWRdO1xuICBkZWxldGUgY2FsbGJhY2tzW3BhcmFtcy5pZF07XG4gIGNiKHBhcmFtcy5lcnJvciwgcGFyYW1zKTtcbn07XG5cbmZ1bmN0aW9uIGJ1aWxkKGVyciwganMpIHtcbiAgY29uc29sZS5sb2coJ2J1aWxkaW5nJyk7XG5cbiAgaWYgKGVycikgdGhyb3cgZXJyO1xuXG4gIHZhciBjYiA9IGZ1bmN0aW9uKGVyciwgcmVzdWx0KSB7XG4gICAgaWYgKGVycikgY29uc29sZS5sb2coZXJyLnN0YWNrKTtcbiAgICBlbHNlIGNvbXBpbGUocmVzdWx0KTtcbiAgfTtcblxuICBjYWxsYmFja3NbKytjYWxsYmFja0lkXSA9IGNiO1xuICB3b3JrZXIucG9zdE1lc3NhZ2Uoe1xuICAgIHByb2NlZHVyZU5hbWU6ICdjb21waWxlJyxcbiAgICBpZDogY2FsbGJhY2tJZCxcbiAgICBhcmdzOiBbanNdLFxuICAgIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxuICB9KTtcbn1cblxudmFyIGNiID0gZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgYnVpbGQobnVsbCwgamF6ei5idWZmZXIudGV4dC50b1N0cmluZygpKTtcbn07XG5cbmNhbGxiYWNrc1srK2NhbGxiYWNrSWRdID0gY2I7XG5cbndvcmtlci5wb3N0TWVzc2FnZSh7XG4gIHByb2NlZHVyZU5hbWU6ICdzZXR1cCcsXG4gIGlkOiBjYWxsYmFja0lkLFxuICBhcmdzOiBbeyBzYW1wbGVSYXRlOiBhdWRpby5zYW1wbGVSYXRlIH1dLFxuICB0aW1lc3RhbXA6IERhdGUubm93KClcbn0pO1xuXG5mdW5jdGlvbiBjYWxjT2Zmc2V0VGltZShidWZmZXIpIHtcbiAgcmV0dXJuIGF1ZGlvLmN1cnJlbnRUaW1lICUgKGJ1ZmZlci5sZW5ndGggLyBhdWRpby5zYW1wbGVSYXRlIHwgMCk7XG59XG5cbmZ1bmN0aW9uIGNvbXBpbGUoYnVmZmVycykge1xuICBjb25zb2xlLmxvZygnbG9jYWwgY29tcGlsZScsIGJ1ZmZlcnMpO1xuICB2YXIgb2xkU291cmNlcyA9IE9iamVjdC5hc3NpZ24oe30sIHNvdXJjZXMpXG4gIGZvciAodmFyIGtleSBpbiBidWZmZXJzKSB7XG4gICAgaWYgKCdpZCcgPT09IGtleSB8fCAndGltZXN0YW1wJyA9PT0ga2V5KSBjb250aW51ZTtcbiAgICB2YXIgc291cmNlID0gc291cmNlc1trZXldO1xuICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5XSA9IGNyZWF0ZUJhbmtTb3VyY2VzKGtleSwgYnVmZmVyc1trZXldKTtcbiAgICBzb3VyY2UubXVsdGlwbGllciA9IGJ1ZmZlcnNba2V5XS5tdWx0aXBsaWVyIHx8IDQ7XG4gICAgY29uc29sZS5sb2coJ2tleScsIGtleSwgc291cmNlc1trZXldKVxuICAgIHZhciBzb3VuZEtleSA9IHNvdW5kc1trZXkuY2hhckNvZGVBdCgwKV07XG4gICAgY29uc29sZS5sb2coJ3NvdW5kIGtleScsIHNvdW5kS2V5KTtcbiAgICBpZiAoc291bmRLZXkuYWN0aXZlKSB7XG4gICAgICBzb3VuZEtleS5zeW5jVGltZSA9IGNhbGNTeW5jVGltZShzb3VyY2UubXVsdGlwbGllcik7XG4gICAgICBvbGRTb3VyY2VzW2tleV1bc291bmRLZXkuYmFuay5uYW1lXS5zdG9wKHNvdW5kS2V5LnN5bmNUaW1lKTtcbiAgICAgIHNvdXJjZVtzb3VuZEtleS5iYW5rLm5hbWVdLnN0YXJ0KHNvdW5kS2V5LnN5bmNUaW1lKTtcbiAgICB9XG4gIH1cbn1cblxuYWxsS2V5cy5mb3JFYWNoKGtleSA9PiB7XG4gIHNvdXJjZXNba2V5XSA9IGNyZWF0ZUJhbmtTb3VyY2VzKGtleSk7XG4gIHNvdXJjZXNba2V5XS5tdWx0aXBsaWVyID0gNDtcbn0pO1xuXG5idWlsZChudWxsLCBsb2NhbFN0b3JhZ2UudGV4dCB8fCBqYXp6LmJ1ZmZlci50ZXh0LnRvU3RyaW5nKCkpO1xuXG5mdW5jdGlvbiBjcmVhdGVCYW5rU291cmNlcyhrZXksIGJ1ZmZlcnMpIHtcbiAgY29uc29sZS5sb2coJ2NyZWF0ZSBiYW5rIHNvdXJjZXMnLCBrZXkpO1xuICB2YXIgc291cmNlcyA9IFtdO1xuICBmb3IgKHZhciBiID0gMDsgYiA8IDQ7IGIrKykge1xuICAgIHZhciBzb3VyY2UgPSBhdWRpby5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICBzb3VyY2UubG9vcCA9IHRydWU7XG4gICAgc291cmNlLm9uZW5kZWQgPSBkaXNjb25uZWN0O1xuICAgIGlmIChidWZmZXJzKSB7XG4gICAgICBzb3VyY2UuYnVmZmVyID0gYXVkaW8uY3JlYXRlQnVmZmVyKDIsIGJ1ZmZlcnNbYl1bMF0ubGVuZ3RoLCBhdWRpby5zYW1wbGVSYXRlKTtcbiAgICAgIHNvdXJjZS5idWZmZXIuZ2V0Q2hhbm5lbERhdGEoMCkuc2V0KGJ1ZmZlcnNbYl1bMF0pO1xuICAgICAgc291cmNlLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSgxKS5zZXQoYnVmZmVyc1tiXVsxXSk7XG4gICAgfVxuICAgIHNvdXJjZS5jb25uZWN0KGF1ZGlvLmRlc3RpbmF0aW9uKTtcbiAgICBzb3VyY2VzLnB1c2goc291cmNlKTtcbiAgfVxuICByZXR1cm4gc291cmNlcztcbn1cblxuZnVuY3Rpb24gY2FsY1N5bmNUaW1lKG11bHRpcGxpZXIpIHtcbiAgcmV0dXJuIG5vcm1hbGl6ZShcbiAgICBhdWRpby5jdXJyZW50VGltZSArXG4gICAgKG11bHRpcGxpZXIgKiBiZWF0VGltZSAtXG4gICAgKGF1ZGlvLmN1cnJlbnRUaW1lICUgKG11bHRpcGxpZXIgKiBiZWF0VGltZSkpKVxuICApO1xufVxuXG5mdW5jdGlvbiBjYWxjU3luY09mZnNldChtdWx0aXBsaWVyKSB7XG4gIHJldHVybiBub3JtYWxpemUoKTtcbn1cblxuZnVuY3Rpb24gZGlzY29ubmVjdCgpIHtcbiAgdGhpcy5kaXNjb25uZWN0KCk7XG59XG5cbmZ1bmN0aW9uIG5vcm1hbGl6ZShudW1iZXIpIHtcbiAgcmV0dXJuIG51bWJlciA9PT0gSW5maW5pdHkgfHwgbnVtYmVyID09PSAtSW5maW5pdHkgfHwgaXNOYU4obnVtYmVyKSA/IDAgOiBudW1iZXI7XG59XG5cbmZ1bmN0aW9uIGFsdGVyU3RhdGUoa2V5KSB7XG4gIGlmIChrZXkuYWN0aXZlKSBwbGF5KGtleSk7XG4gIGVsc2Ugc3RvcChrZXkpO1xufVxuXG5mdW5jdGlvbiBwbGF5KGtleSkge1xuICBpZiAoa2V5Lm5hbWUgaW4gc291cmNlcykge1xuICAgIHZhciBzeW5jVGltZSA9IGNhbGNTeW5jVGltZShzb3VyY2VzW2tleS5uYW1lXS5tdWx0aXBsaWVyKTtcbiAgICB2YXIgc291cmNlO1xuICAgIHRyeSB7XG4gICAgICBpZiAoa2V5LnByZXZCYW5rKSB7XG4gICAgICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5Lm5hbWVdW2tleS5wcmV2QmFuay5uYW1lXTtcbiAgICAgICAgdmFyIGJ1ZmZlciA9IHNvdXJjZS5idWZmZXI7XG4gICAgICAgIHNvdXJjZS5zdG9wKHN5bmNUaW1lKTtcbiAgICAgICAgc291cmNlID0gc291cmNlc1trZXkubmFtZV1ba2V5LnByZXZCYW5rLm5hbWVdID0gYXVkaW8uY3JlYXRlQnVmZmVyU291cmNlKCk7XG4gICAgICAgIHNvdXJjZS5sb29wID0gdHJ1ZTtcbiAgICAgICAgc291cmNlLm9uZW5kZWQgPSBkaXNjb25uZWN0O1xuICAgICAgICBzb3VyY2UuY29ubmVjdChhdWRpby5kZXN0aW5hdGlvbik7XG4gICAgICAgIHNvdXJjZS5idWZmZXIgPSBidWZmZXI7XG4gICAgICB9XG4gICAgfSBjYXRjaChlKSB7XG4gICAgICBjb25zb2xlLmxvZygnY2Fubm90IGNyZWF0ZSBzb3VyY2UnLCBrZXksIGUpXG4gICAgfVxuICAgIHNvdXJjZSA9IHNvdXJjZXNba2V5Lm5hbWVdW2tleS5iYW5rLm5hbWVdO1xuICAgIGNvbnNvbGUubG9nKCdzdGFydDonLCBzb3VyY2UpO1xuICAgIHNvdXJjZS5zdGFydChzeW5jVGltZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gc3RvcChrZXkpIHtcbiAgaWYgKGtleS5uYW1lIGluIHNvdXJjZXMpIHtcbiAgICB2YXIgc291cmNlID0gc291cmNlc1trZXkubmFtZV07XG4gICAgdmFyIHN5bmNUaW1lID0gY2FsY1N5bmNUaW1lKHNvdXJjZS5tdWx0aXBsaWVyKTtcbiAgICBzb3VyY2Vba2V5LmJhbmsubmFtZV0uc3RvcChzeW5jVGltZSk7XG4gIH1cbiAgY29uc29sZS5sb2coJ3N0b3AnLCBrZXkubmFtZSk7XG59XG5cbmZ1bmN0aW9uIHRvZ2dsZVBhbmVsKCkge1xuICBlbGVtZW50c1tmb2N1c10uY2xhc3NMaXN0LnJlbW92ZSgnZm9jdXMnKTtcbiAgZm9jdXMgPSBvdGhlcltmb2N1c107XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QuYWRkKCdmb2N1cycpO1xuICBpZiAoZm9jdXMgPT09ICdlZGl0b3InKSB7XG4gICAgamF6ei5mb2N1cygpO1xuICB9IGVsc2Uge1xuICAgIGphenouYmx1cigpO1xuICB9XG59XG4iXX0=
