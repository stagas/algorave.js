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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhbGdvcmF2ZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDQUEsU0FBUyxNQUFULENBQWdCLElBQWhCLEVBQXNCO0FBQ3BCLE9BQUssRUFBTCxHQUFVLFNBQVMsYUFBVCxDQUF1QixLQUF2QixDQUFWO0FBQ0EsT0FBSyxFQUFMLENBQVEsU0FBUixHQUFvQixhQUFhLElBQWpDO0FBQ0EsT0FBSyxLQUFMLEdBQWEsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWI7QUFDQSxPQUFLLEtBQUwsQ0FBVyxXQUFYLEdBQXlCLElBQXpCO0FBQ0EsT0FBSyxLQUFMLENBQVcsU0FBWCxHQUF1QixXQUF2QjtBQUNBLE9BQUssRUFBTCxDQUFRLFdBQVIsQ0FBb0IsS0FBSyxLQUF6QjtBQUNBLE9BQUssUUFBTCxHQUFnQixLQUFLLFVBQUwsQ0FBZ0IsQ0FBaEIsQ0FBaEI7QUFDQSxPQUFLLElBQUwsR0FBWSxJQUFaO0FBQ0EsT0FBSyxPQUFMO0FBQ0Q7O0FBRUQsT0FBTyxTQUFQLENBQWlCLE1BQWpCLEdBQTBCLFlBQVc7QUFDbkMsT0FBSyxFQUFMLENBQVEsU0FBUixDQUFrQixHQUFsQixDQUFzQixRQUF0QjtBQUNBLE9BQUssTUFBTCxHQUFjLElBQWQ7QUFDRCxDQUhEOztBQUtBLE9BQU8sU0FBUCxDQUFpQixPQUFqQixHQUEyQixZQUFXO0FBQ3BDLE9BQUssRUFBTCxDQUFRLFNBQVIsQ0FBa0IsTUFBbEIsQ0FBeUIsUUFBekI7QUFDQSxPQUFLLE1BQUwsR0FBYyxLQUFkO0FBQ0QsQ0FIRDs7QUFLQSxPQUFPLFNBQVAsQ0FBaUIsTUFBakIsR0FBMEIsWUFBVztBQUNuQyxNQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNmLFNBQUssT0FBTDtBQUNELEdBRkQsTUFFTztBQUNMLFNBQUssTUFBTDtBQUNEO0FBQ0YsQ0FORDs7QUFRQSxTQUFTLElBQVQsQ0FBYyxJQUFkLEVBQW9CO0FBQ2xC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O0FBQ0EsZUFBTyxNQUFQLEdBQWdCLE1BQWhCO0FBQ0Q7QUFDRixLQVhELENBV0UsT0FBTSxDQUFOLEVBQVM7QUFDVCxjQUFRLEdBQVIsQ0FBWSxzQkFBWixFQUFvQyxHQUFwQyxFQUF5QyxDQUF6QztBQUNEO0FBQ0QsYUFBUyxRQUFRLElBQUksSUFBWixFQUFrQixJQUFJLElBQUosQ0FBUyxJQUEzQixDQUFUO0FBQ0EsWUFBUSxHQUFSLENBQVksUUFBWixFQUFzQixNQUF0QjtBQUNBLFdBQU8sS0FBUCxDQUFhLFFBQWI7QUFDRDtBQUNGOztBQUVELFNBQVMsSUFBVCxDQUFjLEdBQWQsRUFBbUI7QUFDakIsTUFBSSxJQUFJLElBQUosSUFBWSxPQUFoQixFQUF5QjtBQUN2QixRQUFJLFNBQVMsUUFBUSxJQUFJLElBQVosQ0FBYjtBQUNBLFFBQUksV0FBVyxhQUFhLE9BQU8sVUFBcEIsQ0FBZjtBQUNBLFdBQU8sSUFBSSxJQUFKLENBQVMsSUFBaEIsRUFBc0IsSUFBdEIsQ0FBMkIsUUFBM0I7QUFDRDtBQUNELFVBQVEsR0FBUixDQUFZLE1BQVosRUFBb0IsSUFBSSxJQUF4QjtBQUNEOztBQUVELFNBQVMsV0FBVCxHQUF1QjtBQUNyQixXQUFTLEtBQVQsRUFBZ0IsU0FBaEIsQ0FBMEIsTUFBMUIsQ0FBaUMsT0FBakM7QUFDQSxVQUFRLE1BQU0sS0FBTixDQUFSO0FBQ0EsV0FBUyxLQUFULEVBQWdCLFNBQWhCLENBQTBCLEdBQTFCLENBQThCLE9BQTlCO0FBQ0EsTUFBSSxVQUFVLFFBQWQsRUFBd0I7QUFDdEIsU0FBSyxLQUFMO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsU0FBSyxJQUFMO0FBQ0Q7QUFDRiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBQYWRLZXkoY2hhcikge1xuICB0aGlzLmVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHRoaXMuZWwuY2xhc3NOYW1lID0gJ2tleSBrZXktJyArIGNoYXI7XG4gIHRoaXMubGFiZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5sYWJlbC50ZXh0Q29udGVudCA9IGNoYXI7XG4gIHRoaXMubGFiZWwuY2xhc3NOYW1lID0gJ2tleS1sYWJlbCc7XG4gIHRoaXMuZWwuYXBwZW5kQ2hpbGQodGhpcy5sYWJlbCk7XG4gIHRoaXMuY2hhckNvZGUgPSBjaGFyLmNoYXJDb2RlQXQoMCk7XG4gIHRoaXMubmFtZSA9IGNoYXI7XG4gIHRoaXMudHVybk9mZigpO1xufVxuXG5QYWRLZXkucHJvdG90eXBlLnR1cm5PbiA9IGZ1bmN0aW9uKCkge1xuICB0aGlzLmVsLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICB0aGlzLmFjdGl2ZSA9IHRydWU7XG59O1xuXG5QYWRLZXkucHJvdG90eXBlLnR1cm5PZmYgPSBmdW5jdGlvbigpIHtcbiAgdGhpcy5lbC5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgdGhpcy5hY3RpdmUgPSBmYWxzZTtcbn07XG5cblBhZEtleS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKSB7XG4gIGlmICh0aGlzLmFjdGl2ZSkge1xuICAgIHRoaXMudHVybk9mZigpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudHVybk9uKCk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIEJhbmsobmFtZSkge1xuICB0aGlzLm5hbWUgPSBuYW1lO1xuICB0aGlzLmJhbmsgPSBudWxsO1xuICB0aGlzLnByZXZCYW5rID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gU291bmRLZXkoY2hhcikge1xuICBQYWRLZXkuY2FsbCh0aGlzLCBjaGFyKTtcbn1cblxuU291bmRLZXkucHJvdG90eXBlLl9fcHJvdG9fXyA9IFBhZEtleS5wcm90b3R5cGU7XG5cblNvdW5kS2V5LnByb3RvdHlwZS5zZXRCYW5rID0gZnVuY3Rpb24oYmFuaykge1xuICBpZiAodGhpcy5iYW5rKSB0aGlzLmVsLmNsYXNzTGlzdC5yZW1vdmUoJ2JhbmstJyArIHRoaXMuYmFuay5uYW1lKTtcbiAgdGhpcy5wcmV2QmFuayA9IHRoaXMuYmFuaztcbiAgdGhpcy5iYW5rID0gYmFuaztcbiAgdGhpcy5lbC5jbGFzc0xpc3QuYWRkKCdiYW5rLScgKyB0aGlzLmJhbmsubmFtZSk7XG59O1xuXG52YXIga2V5Ym9hcmQgPSBbXG4gICcxMjM0NTY3ODkwJy5zcGxpdCgnJyksXG4gICdxd2VydHl1aW9wJy5zcGxpdCgnJyksXG4gICdhc2RmZ2hqa2wnLnNwbGl0KCcnKSxcbiAgJ3p4Y3Zibm0nLnNwbGl0KCcnKSxcbl07XG5cbnZhciBzb3VuZHMgPSB7fTtcbnZhciBiYW5rcyA9IFtdO1xuXG52YXIgYWxsS2V5cyA9IGtleWJvYXJkLnJlZHVjZSgocCwgbikgPT4gcC5jb25jYXQobikpO1xuXG52YXIgY29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuY29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgPSAnY29udGFpbmVyJztcbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29udGFpbmVyRWxlbWVudCk7XG5cbnZhciBjb2x1bW5MZWZ0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5jb2x1bW5MZWZ0LmNsYXNzTmFtZSA9ICdjb2x1bW4tbGVmdCc7XG5cbnZhciBjb2x1bW5SaWdodCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuY29sdW1uUmlnaHQuY2xhc3NOYW1lID0gJ2NvbHVtbi1yaWdodCc7XG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29sdW1uTGVmdCk7XG5kb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbHVtblJpZ2h0KTtcblxudmFyIGVkaXRvckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmVkaXRvckVsZW1lbnQuY2xhc3NOYW1lID0gJ2VkaXRvcic7XG5cbnZhciBqYXp6RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuamF6ekVsZW1lbnQuY2xhc3NOYW1lID0gJ2phenonO1xuXG52YXIgamF6ek9wdGlvbnMgPSB7XG4gIHRoZW1lOiAncmVkYmxpc3MnLFxuICBmb250X3NpemU6ICc5cHQnLFxufTtcbnZhciBqYXp6ID0gbmV3IEphenooamF6ek9wdGlvbnMpO1xuXG5qYXp6LnNldChsb2NhbFN0b3JhZ2UudGV4dCB8fCBgXFxcbmxldCB7IHNpbiwgU2luLCBTYXcsIFRyaSwgU3FyLCBDaG9yZCwgQ2hvcmRzLCBzb2Z0Q2xpcDpjbGlwLCBub3RlLCBlbnZlbG9wZSwgS29yZzM1TFBGLCBEaW9kZUZpbHRlciwgTW9vZ0xhZGRlciB9ID0gc3R1ZGlvO1xubGV0IHsgQmFzc2xpbmUgfSA9IGV4dGVuZGVkO1xuXG4vLyBwYXRjaGVzOiBhIGQgayBsIG0gbyBwIHEgcyB4XG5cbmV4cG9ydCBsZXQgYnBtID0gMTIwO1xubGV0IHByb2dyID0gWydGbWFqNycsJ0JtYWo5JywnRDknLCdHI21pbjcnXS5tYXAoQ2hvcmRzKTtcbmxldCBwcm9ncl8yID0gWydDbWluJywnRCNtaW4nLCdGbWluJywnQW1pbiddLm1hcChDaG9yZHMpO1xuXG5leHBvcnQgbGV0IGsgPSBbNCwgZnVuY3Rpb24ga2ljayh0KSB7XG4gIHZhciB2b2wgPSAuNjtcbiAgcmV0dXJuIHtcbiAgICAwOiBhcnAodCwgMS80LCA1MCwgMzAsIDgpICogdm9sLFxuICAgIDE6IGFycCh0LCAxLzQsIDU2LCAzMiwgOCkgKiB2b2wsXG4gICAgMjogYXJwKHQsIDEvNCwgNTksIDI4LCA0KSAqIHZvbCxcbiAgICAzOiBhcnAodCwgMS80LCA2MiwgMzQsIDQpICogdm9sLFxuICB9O1xufV07XG5cbmV4cG9ydCBsZXQgbCA9IFs0LCBmdW5jdGlvbiBoaWhhdCh0KSB7XG4gIHZhciB2b2wgPSAuMTtcbiAgcmV0dXJuIHtcbiAgICAwOiBhcnAodCsxLzIsIDEvNCwgTWF0aC5yYW5kb20oKSAqIDU1NTAsIDE2MDAsIDM1MCkgKiB2b2wsXG4gICAgMTogYXJwKHQrMS8yLCAxLzQsIE1hdGgucmFuZG9tKCkgKiA1NTUwLCAyNjAwLCAzNTApICogdm9sLFxuICAgIDI6IGFycCh0KzEvMiwgMS80LCBNYXRoLnJhbmRvbSgpICogNTU1MCwgMzYwMCwgMzUwKSAqIHZvbCxcbiAgICAzOiBhcnAodCsxLzIsIDEvNCwgTWF0aC5yYW5kb20oKSAqIDU1NTAsIDQwMDAsIDM1MCkgKiB2b2wsXG4gIH07XG59XTtcblxuZXhwb3J0IGxldCByID0gWzQsIGZ1bmN0aW9uKHQpIHtcbiAgIHJldHVybiB7XG4gICAgIDA6IChzaW4odCwgbm90ZShwcm9nclsxXVswXSkqLjkpPi40Kih0KjIlNCkpICogc2luKHQsLjI1KSAqIHNpbih0LC4yKSxcbiAgICAgMTogKHNpbih0LCBub3RlKHByb2dyWzFdWzBdKSouOCk+LjQqKHQqMiU0KSkgKiBzaW4odCwuMjUpICogc2luKHQsLjIpLFxuICAgICAyOiAoc2luKHQsIG5vdGUocHJvZ3JbMV1bMF0pKjEuMik+LjQqKHQqMiU0KSkgKiBzaW4odCwuMjUpICogc2luKHQsLjIpLFxuICAgICAzOiAoc2luKHQsIG5vdGUocHJvZ3JbMV1bMF0pKjEuNSk+LjQqKHQqMiU0KSkgKiBzaW4odCwuMjUpICogc2luKHQsLjIpLFxuICAgfTtcbn1dO1xuXG52YXIgYmFzc19hMCA9IG5ldyBCYXNzbGluZSgpO1xudmFyIGJhc3NfYTEgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2EyID0gbmV3IEJhc3NsaW5lKCk7XG52YXIgYmFzc19hMyA9IG5ldyBCYXNzbGluZSgpO1xuYmFzc19hMC5zZXEocHJvZ3JbMF0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjE1KS5wcmUoMSkuaHBmKC4wMDIyKS5jbGlwKDEwKS5yZXMoLjcpLmxmbyguNSk7XG5iYXNzX2ExLnNlcShwcm9nclsxXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMTgpLnByZSgxKS5ocGYoLjAwMjIpLmNsaXAoMTApLnJlcyguNykubGZvKC41KTtcbmJhc3NfYTIuc2VxKHByb2dyWzJdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4yNSkucHJlKDEpLmhwZiguMDAyMikuY2xpcCgxMCkucmVzKC43KS5sZm8oLjUpO1xuYmFzc19hMy5zZXEocHJvZ3JbM10ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjI1KS5wcmUoMSkuaHBmKC4wMDIyKS5jbGlwKDEwKS5yZXMoLjcpLmxmbyguNSk7XG5cbmV4cG9ydCBsZXQgYSA9IFs0LCBmdW5jdGlvbiBiYXNzX2EodCkge1xuICB2YXIgdm9sID0gLjQ7XG4gIHJldHVybiB7XG4gICAgMDogYmFzc19hMC5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMTAsIDUpICogdm9sLFxuICAgIDE6IGJhc3NfYTEucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDEwLCA1KSAqIHZvbCxcbiAgICAyOiBiYXNzX2EyLnBsYXkodCkgKiBlbnZlbG9wZSh0KzEvMiwgMS84LCAxMCwgNSkgKiB2b2wsXG4gICAgMzogYmFzc19hMy5wbGF5KHQpICogZW52ZWxvcGUodCsxLzIsIDEvOCwgMTAsIDUpICogdm9sLFxuICB9O1xufV07XG5cbnZhciBiYXNzX2QwID0gbmV3IEJhc3NsaW5lKCk7XG52YXIgYmFzc19kMSA9IG5ldyBCYXNzbGluZSgpO1xudmFyIGJhc3NfZDIgPSBuZXcgQmFzc2xpbmUoKTtcbnZhciBiYXNzX2QzID0gbmV3IEJhc3NsaW5lKCk7XG5iYXNzX2QwLnNlcShwcm9ncl8yWzBdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4xNSkucHJlKC41KS5ocGYoLjAwNzIpLmNsaXAoNSkucmVzKC43KS5sZm8oMSkubGZvMiguMjUpO1xuYmFzc19kMS5zZXEocHJvZ3JfMlsxXS5tYXAobm90ZSkubWFwKG49Pm4qNCkpLmN1dCguMTgpLnByZSguNSkuaHBmKC4wMDcyKS5jbGlwKDUpLnJlcyguNykubGZvKDEpLmxmbzIoLjI1KTtcbmJhc3NfZDIuc2VxKHByb2dyXzJbMl0ubWFwKG5vdGUpLm1hcChuPT5uKjQpKS5jdXQoLjI1KS5wcmUoLjUpLmhwZiguMDA3MikuY2xpcCg1KS5yZXMoLjcpLmxmbygxKS5sZm8yKC4yNSk7XG5iYXNzX2QzLnNlcShwcm9ncl8yWzNdLm1hcChub3RlKS5tYXAobj0+bio0KSkuY3V0KC4yNSkucHJlKC41KS5ocGYoLjAwNzIpLmNsaXAoNSkucmVzKC43KS5sZm8oMSkubGZvMiguMjUpO1xuXG5leHBvcnQgbGV0IGQgPSBbNCwgZnVuY3Rpb24gYmFzc19kKHQpIHtcbiAgdmFyIHZvbCA9IC43O1xuICByZXR1cm4ge1xuICAgIDA6IGJhc3NfZDAucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDMsIDUpICogdm9sLFxuICAgIDE6IGJhc3NfZDEucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDMsIDUpICogdm9sLFxuICAgIDI6IGJhc3NfZDIucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDMsIDUpICogdm9sLFxuICAgIDM6IGJhc3NfZDMucGxheSh0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzgsIDMsIDUpICogdm9sLFxuICB9O1xufV07XG5cbnZhciBzeW50aF9vc2NfMCA9IFRyaSgzMiwgdHJ1ZSk7XG52YXIgc3ludGhfb3NjXzEgPSBUcmkoMzIsIHRydWUpO1xudmFyIHN5bnRoX29zY18yID0gVHJpKDMyLCB0cnVlKTtcbnZhciBzeW50aF9vc2NfMyA9IFRyaSgzMiwgdHJ1ZSk7XG5leHBvcnQgbGV0IG8gPSBbNCwgZnVuY3Rpb24gc3ludGgodCkge1xuICB2YXIgdm9sID0gLjM7XG4gIHJldHVybiB7XG4gICAgMDogc3ludGhfb3NjXzAobm90ZShwcm9nclsodCU0KXwwXVsodCo0JTMpfDBdKSkgKiBlbnZlbG9wZSh0KzEvMiwgMS80LCA1LCA0KSAqIHZvbCxcbiAgICAxOiBzeW50aF9vc2NfMShub3RlKHByb2dyWyh0JTQpfDBdWyh0KjQlMyl8MF0pKjIpICogZW52ZWxvcGUodCsxLzIsIDEvNCwgNSwgNCkgKiB2b2wsXG4gICAgMjogc3ludGhfb3NjXzIobm90ZShwcm9nclsodCU0KXwwXVsodCo0JTMpfDBdKSo0KSAqIGVudmVsb3BlKHQrMS8yLCAxLzQsIDUsIDQpICogdm9sLFxuICAgIDM6IHN5bnRoX29zY18zKG5vdGUocHJvZ3JbKHQlNCl8MF1bKHQqNCUzKXwwXSkqOCkgKiBlbnZlbG9wZSh0KzEvMiwgMS80LCA1LCA0KSAqIHZvbCxcbiAgfTtcbn1dO1xuXG52YXIgcGFkX29zY18wID0gQ2hvcmQoU2F3LCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfMSA9IENob3JkKFNhdywgMTI4LCB0cnVlKTtcbnZhciBwYWRfb3NjXzIgPSBDaG9yZChTYXcsIDEyOCwgdHJ1ZSk7XG52YXIgcGFkX29zY18zID0gQ2hvcmQoU2F3LCAxMjgsIHRydWUpO1xuXG52YXIgZmlsdGVyX3BhZF8wID0gS29yZzM1TFBGKCk7XG52YXIgZmlsdGVyX3BhZF8xID0gS29yZzM1TFBGKCk7XG52YXIgZmlsdGVyX3BhZF8yID0gS29yZzM1TFBGKCk7XG52YXIgZmlsdGVyX3BhZF8zID0gS29yZzM1TFBGKCk7XG5maWx0ZXJfcGFkXzAuY3V0KDUwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5maWx0ZXJfcGFkXzEuY3V0KDUwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5maWx0ZXJfcGFkXzIuY3V0KDUwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5maWx0ZXJfcGFkXzMuY3V0KDUwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5cbmV4cG9ydCBsZXQgcCA9IFs0LCBmdW5jdGlvbiBwYWQodCkge1xuICB2YXIgdm9sID0gLjM7XG4gIHZhciBjID0gcHJvZ3JbdCU0fDBdO1xuICB2YXIgb3V0XzAgPSBwYWRfb3NjXzAoYy5tYXAobm90ZSkubWFwKG49Pm4qMikpICogZW52ZWxvcGUodCwgMS80LCA1LCA0KSAqIHZvbDtcbiAgdmFyIG91dF8xID0gcGFkX29zY18xKGMubWFwKG5vdGUpLm1hcChuPT5uKjQpKSAqIGVudmVsb3BlKHQsIDEvNCwgNSwgNCkgKiB2b2w7XG4gIHZhciBvdXRfMiA9IHBhZF9vc2NfMihjLm1hcChub3RlKS5tYXAobj0+bio4KSkgKiBlbnZlbG9wZSh0LCAxLzQsIDUsIDQpICogdm9sO1xuICB2YXIgb3V0XzMgPSBwYWRfb3NjXzIoYy5tYXAobm90ZSkubWFwKG49Pm4qOCkpICogZW52ZWxvcGUodCwgMS80LCA1LCA0KSAqIHZvbDtcbiAgcmV0dXJuIHtcbiAgICAwOiBmaWx0ZXJfcGFkXzAucnVuKG91dF8wKSxcbiAgICAxOiBmaWx0ZXJfcGFkXzEucnVuKG91dF8xKSxcbiAgICAyOiBmaWx0ZXJfcGFkXzIucnVuKG91dF8yKSxcbiAgICAzOiBmaWx0ZXJfcGFkXzMucnVuKG91dF8zKSxcbiAgfTtcbn1dO1xuXG52YXIgcGFkX29zY19tMCA9IENob3JkKFNxciwgMTI4LCB0cnVlKTtcbnZhciBwYWRfb3NjX20xID0gQ2hvcmQoU3FyLCAxMjgsIHRydWUpO1xudmFyIHBhZF9vc2NfbTIgPSBDaG9yZChTcXIsIDEyOCwgdHJ1ZSk7XG52YXIgcGFkX29zY19tMyA9IENob3JkKFNxciwgMTI4LCB0cnVlKTtcblxudmFyIGZpbHRlcl9wYWRfbTAgPSBLb3JnMzVMUEYoKTtcbnZhciBmaWx0ZXJfcGFkX20xID0gS29yZzM1TFBGKCk7XG52YXIgZmlsdGVyX3BhZF9tMiA9IEtvcmczNUxQRigpO1xudmFyIGZpbHRlcl9wYWRfbTMgPSBLb3JnMzVMUEYoKTtcbmZpbHRlcl9wYWRfbTAuY3V0KDIwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5maWx0ZXJfcGFkX20xLmN1dCgyMDApLnJlcygyLjEpLnNhdCgyLjEpO1xuZmlsdGVyX3BhZF9tMi5jdXQoMjAwKS5yZXMoMi4xKS5zYXQoMi4xKTtcbmZpbHRlcl9wYWRfbTMuY3V0KDIwMCkucmVzKDIuMSkuc2F0KDIuMSk7XG5cbnZhciBsZm9fbSA9IFNpbigpO1xuXG5leHBvcnQgbGV0IG0gPSBbNCwgZnVuY3Rpb24gcGFkKHQpIHtcbiAgdmFyIHZvbCA9IC41O1xuICB2YXIgYyA9IHByb2dyXzJbKHQqMyklM3wwXTtcbiAgdmFyIG91dF8wID0gcGFkX29zY19tMChjLm1hcChub3RlKS5tYXAobj0+bio0KSkgKiBlbnZlbG9wZSh0KzEvNCwgMS8yLCA1LCAtMikgKiB2b2wgKiBsZm9fbSguMik7XG4gIHZhciBvdXRfMSA9IHBhZF9vc2NfbTEoYy5tYXAobm90ZSkubWFwKG49Pm4qNikpICogZW52ZWxvcGUodCsxLzQsIDEvMiwgNSwgLTIpICogdm9sICogbGZvX20oLjIpO1xuICB2YXIgb3V0XzIgPSBwYWRfb3NjX20yKGMubWFwKG5vdGUpLm1hcChuPT5uKjgpKSAqIGVudmVsb3BlKHQrMS80LCAxLzIsIDUsIC0yKSAqIHZvbCAqIGxmb19tKC4yKTtcbiAgdmFyIG91dF8zID0gcGFkX29zY19tMyhjLm1hcChub3RlKS5tYXAobj0+bio4KSkgKiBlbnZlbG9wZSh0KzEvNCwgMS8yLCA1LCAtMikgKiB2b2wgKiBsZm9fbSguMik7XG4gIHJldHVybiB7XG4gICAgMDogZmlsdGVyX3BhZF9tMC5ydW4ob3V0XzApLFxuICAgIDE6IGZpbHRlcl9wYWRfbTEucnVuKG91dF8xKSxcbiAgICAyOiBmaWx0ZXJfcGFkX20yLnJ1bihvdXRfMiksXG4gICAgMzogZmlsdGVyX3BhZF9tMy5ydW4ob3V0XzMpLFxuICB9O1xufV07XG5cbnZhciBjaGlwX29zY18wID0gVHJpKDEwLCBmYWxzZSk7XG52YXIgY2hpcF9vc2NfMSA9IFRyaSgxMCwgZmFsc2UpO1xudmFyIGNoaXBfb3NjXzIgPSBUcmkoMTAsIGZhbHNlKTtcbnZhciBjaGlwX29zY18zID0gVHJpKDEwLCBmYWxzZSk7XG5cbmV4cG9ydCBsZXQgcyA9IFs4LCBmdW5jdGlvbiBjaGlwKHQpIHtcbiAgdmFyIGMgPSBub3RlKHByb2dyWzBdW3QlcHJvZ3JbMF0ubGVuZ3RofDBdKSo4O1xuICByZXR1cm4ge1xuICAgIDA6IC43ICogYXJwKHQrMi84LCAxLzI4LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfMChjKSoodCo0JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMTogLjcgKiBhcnAodCsyLzgsIDEvMjgsIGFycCh0LCAxLzE2LCBjaGlwX29zY18xKGMqMikqKHQqOCUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICAgIDI6IC43ICogYXJwKHQrMi84LCAxLzI4LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfMihjKjQpKih0KjE2JSgodC8yJTJ8MCkrMil8MCksIDUwLCAxMCkgKiAuOCwgMTAwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMzogLjcgKiBhcnAodCsyLzgsIDEvMjgsIGFycCh0LCAxLzE2LCBjaGlwX29zY18zKGMqOCkqKHQqMTYlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMDAsIDIwKSAqIGVudmVsb3BlKHQrMi80LCAxLzQsIDUsIDEwKSxcbiAgfVxufV07XG5cbnZhciBjaGlwX29zY194MCA9IFRyaSgxMCwgdHJ1ZSk7XG52YXIgY2hpcF9vc2NfeDEgPSBUcmkoMTAsIHRydWUpO1xudmFyIGNoaXBfb3NjX3gyID0gVHJpKDEwLCB0cnVlKTtcbnZhciBjaGlwX29zY194MyA9IFRyaSgxMCwgdHJ1ZSk7XG5cbmV4cG9ydCBsZXQgeCA9IFs4LCBmdW5jdGlvbiBjaGlwKHQpIHtcbiAgdmFyIGMgPSBub3RlKHByb2dyXzJbMF1bdCVwcm9ncl8yWzBdLmxlbmd0aHwwXSkqODtcbiAgdmFyIHZvbCA9IC41O1xuICByZXR1cm4ge1xuICAgIDA6IHZvbCAqIGFycCh0KzIvOCwgMS8xNiwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjX3gwKGMpKih0KjQlKCh0LzIlMnwwKSsyKXwwKSwgNTAsIDEwKSAqIC44LCAxMCwgMjApICogZW52ZWxvcGUodCsyLzQsIDEvNCwgNSwgMTApLFxuICAgIDE6IHZvbCAqIGFycCh0KzIvOCwgMS8xNiwgYXJwKHQsIDEvMTYsIGNoaXBfb3NjX3gxKGMqMikqKHQqOCUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMjogdm9sICogYXJwKHQrMi84LCAxLzE2LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfeDIoYyo0KSoodCoxNiUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gICAgMzogdm9sICogYXJwKHQrMi84LCAxLzE2LCBhcnAodCwgMS8xNiwgY2hpcF9vc2NfeDIoYyo4KSoodCoxNiUoKHQvMiUyfDApKzIpfDApLCA1MCwgMTApICogLjgsIDEwLCAyMCkgKiBlbnZlbG9wZSh0KzIvNCwgMS80LCA1LCAxMCksXG4gIH1cbn1dO1xuXG52YXIgbW9vZ19scGZfcTAgPSBNb29nTGFkZGVyKCdoYWxmJyk7XG52YXIgbW9vZ19scGZfcTEgPSBNb29nTGFkZGVyKCdoYWxmJyk7XG52YXIgbW9vZ19scGZfcTIgPSBNb29nTGFkZGVyKCdoYWxmJyk7XG52YXIgbW9vZ19scGZfcTMgPSBNb29nTGFkZGVyKCdoYWxmJyk7XG5cbnZhciBtb29nX29zY19xMCA9IFNhdygpO1xudmFyIG1vb2dfb3NjX3ExID0gU2F3KCk7XG52YXIgbW9vZ19vc2NfcTIgPSBTYXcoKTtcbnZhciBtb29nX29zY19xMyA9IFNhdygpO1xuXG52YXIgbW9vZ19sZm9fcTAgPSBTaW4oKTtcbnZhciBtb29nX2xmb19xMSA9IFNpbigpO1xudmFyIG1vb2dfbGZvX3EyID0gU2luKCk7XG52YXIgbW9vZ19sZm9fcTMgPSBTaW4oKTtcblxuZXhwb3J0IGxldCBxID0gWzgsIGZ1bmN0aW9uIG1vb2codCl7XG4gIHQvPTJcblxuICB2YXIgYyA9IHByb2dyWyh0JXByb2dyLmxlbmd0aHwwKV07XG4gIHZhciBvdXRfMCA9IG1vb2dfb3NjX3EwKG5vdGUoY1t0KjQlM3wwXSkqMik7XG4gIHZhciBvdXRfMSA9IG1vb2dfb3NjX3ExKG5vdGUoY1t0KjQlM3wwXSkqNCk7XG4gIHZhciBvdXRfMiA9IG1vb2dfb3NjX3EyKG5vdGUoY1t0KjQlM3wwXSkqOCk7XG4gIHZhciBvdXRfMyA9IG1vb2dfb3NjX3EzKG5vdGUoY1t0KjQlM3wwXSkqOCk7XG5cbiAgbW9vZ19scGZfcTBcbiAgICAuY3V0KDcwMCArICg2NTAgKiBtb29nX2xmb19xMCgwLjUpKSlcbiAgICAucmVzKDAuODcpXG4gICAgLnNhdCgyLjE1KVxuICAgIC51cGRhdGUoKTtcblxuICBtb29nX2xwZl9xMVxuICAgIC5jdXQoMTAwMCArICg5NTAgKiBtb29nX2xmb19xMSgxKSkpXG4gICAgLnJlcygwLjg3KVxuICAgIC5zYXQoMi4xNSlcbiAgICAudXBkYXRlKCk7XG5cbiAgbW9vZ19scGZfcTJcbiAgICAuY3V0KDEzMDAgKyAoMTI1MCAqIG1vb2dfbGZvX3EyKDAuMjUpKSlcbiAgICAucmVzKDAuODcpXG4gICAgLnNhdCgyLjE1KVxuICAgIC51cGRhdGUoKTtcblxuICBtb29nX2xwZl9xM1xuICAgIC5jdXQoMTMwMCArICgxMjUwICogbW9vZ19sZm9fcTIoMC4yNSkpKVxuICAgIC5yZXMoMC44NylcbiAgICAuc2F0KDIuMTUpXG4gICAgLnVwZGF0ZSgpO1xuXG4gIG91dF8wID0gbW9vZ19scGZfcTAucnVuKG91dF8wKTtcbiAgb3V0XzEgPSBtb29nX2xwZl9xMS5ydW4ob3V0XzEpO1xuICBvdXRfMiA9IG1vb2dfbHBmX3EyLnJ1bihvdXRfMik7XG4gIG91dF8zID0gbW9vZ19scGZfcTMucnVuKG91dF8zKTtcblxuICB2YXIgdm9sID0gLjM7XG5cbiAgcmV0dXJuIHtcbiAgICAwOiBvdXRfMCAqIHZvbCxcbiAgICAxOiBvdXRfMSAqIHZvbCxcbiAgICAyOiBvdXRfMiAqIHZvbCxcbiAgICAzOiBvdXRfMyAqIHZvbCxcbiAgfTtcbn1dO1xuYCwgJ2RzcC5qcycpO1xuXG5lZGl0b3JFbGVtZW50LmFwcGVuZENoaWxkKGphenpFbGVtZW50KTtcblxuY29sdW1uTGVmdC5hcHBlbmRDaGlsZChlZGl0b3JFbGVtZW50KTtcblxuamF6ei51c2UoamF6ekVsZW1lbnQpO1xuXG52YXIga2V5Ym9hcmRDb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5rZXlib2FyZENvbnRhaW5lckVsZW1lbnQuY2xhc3NOYW1lID0gJ2tleWJvYXJkLWNvbnRhaW5lcic7XG5cbnZhciBrZXlib2FyZEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbmtleWJvYXJkRWxlbWVudC5jbGFzc05hbWUgPSAna2V5Ym9hcmQnO1xuXG52YXIgZmlsZW5hbWVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5maWxlbmFtZUVsZW1lbnQuY2xhc3NOYW1lID0gJ2ZpbGVuYW1lJztcblxuZWRpdG9yRWxlbWVudC5hcHBlbmRDaGlsZChmaWxlbmFtZUVsZW1lbnQpO1xuXG5mb3IgKHZhciBpID0gMDsgaSA8IGtleWJvYXJkLmxlbmd0aDsgaSsrKSB7XG4gIHZhciByb3cgPSBrZXlib2FyZFtpXTtcbiAgdmFyIHJvd0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgcm93RWxlbWVudC5jbGFzc05hbWUgPSAncm93IHJvdy0nICsgaTtcbiAgZm9yICh2YXIgayA9IDA7IGsgPCByb3cubGVuZ3RoOyBrKyspIHtcbiAgICB2YXIgY2hhciA9IHJvd1trXTtcbiAgICB2YXIga2V5O1xuICAgIGtleSA9IG5ldyBTb3VuZEtleShjaGFyKTtcbiAgICBzb3VuZHNba2V5LmNoYXJDb2RlXSA9IGtleTtcbiAgICByb3dFbGVtZW50LmFwcGVuZENoaWxkKGtleS5lbCk7XG4gICAga2V5LmVsLm9ubW91c2Vkb3duID1cbiAgICBrZXkubGFiZWwub25tb3VzZWRvd24gPVxuICAgIGtleS5sYWJlbC5vbnRvdWNoc3RhcnQgPSBkZWJvdW5jZSgoZnVuY3Rpb24oa2V5KSB7XG4gICAgICByZXR1cm4gZSA9PiB7XG4gICAgICAgIG5leHRCYW5rKGtleSk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlXG4gICAgICB9XG4gICAgfShrZXkpKSwgMjAwKTtcbiAgfVxuICBrZXlib2FyZEVsZW1lbnQuYXBwZW5kQ2hpbGQocm93RWxlbWVudCk7XG59XG5cbnZhciBsYXN0VG91Y2hLZXkgPSBudWxsO1xudmFyIGRlYm91bmNlTGFzdFRvdWNoS2V5O1xuXG5rZXlib2FyZEVsZW1lbnQub250b3VjaHN0YXJ0ID1cbmtleWJvYXJkRWxlbWVudC5vbnRvdWNobW92ZSA9XG5rZXlib2FyZEVsZW1lbnQub250b3VjaGVudGVyID0gZnVuY3Rpb24gaGFuZGxlcihlKSB7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcbiAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICBlLnRvdWNoZXMgPSBbIHt0b3VjaDogW2VdfSBdO1xuICAgIHJldHVybjtcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGUudG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciB0b3VjaCA9IGUudG91Y2hlc1tpXTtcbiAgICBmb3IgKHZhciBjaGFyIGluIHNvdW5kcykge1xuICAgICAgdmFyIGtleSA9IHNvdW5kc1tjaGFyXTtcbiAgICAgIGlmICggdG91Y2guY2xpZW50WCA+IGtleS5wb3MubGVmdCAmJiB0b3VjaC5jbGllbnRYIDw9IGtleS5wb3MubGVmdCArIGtleS5wb3Mud2lkdGhcbiAgICAgICAgJiYgdG91Y2guY2xpZW50WSA+IGtleS5wb3MudG9wICYmIHRvdWNoLmNsaWVudFkgPD0ga2V5LnBvcy50b3AgKyBrZXkucG9zLmhlaWdodFxuICAgICAgICAmJiBsYXN0VG91Y2hLZXkgIT09IGtleVxuICAgICAgKSB7XG4gICAgICAgIG5leHRCYW5rKGtleSk7XG4gICAgICAgIGxhc3RUb3VjaEtleSA9IGtleTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cbmtleWJvYXJkRWxlbWVudC5vbnRvdWNoc3RhcnQgPSBmdW5jdGlvbiBoYW5kbGVyKGUpIHtcbiAgaWYgKCFlLnRvdWNoZXMpIHtcbiAgICBlLnRvdWNoZXMgPSBbIHt0b3VjaDogW2VdfSBdXG4gICAgcmV0dXJuO1xuICB9XG4gIGxhc3RUb3VjaEtleSA9IG51bGw7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZS50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuICAgIGZvciAodmFyIGNoYXIgaW4gc291bmRzKSB7XG4gICAgICB2YXIga2V5ID0gc291bmRzW2NoYXJdO1xuICAgICAgaWYgKCB0b3VjaC5jbGllbnRYID4ga2V5LnBvcy5sZWZ0ICYmIHRvdWNoLmNsaWVudFggPD0ga2V5LnBvcy5sZWZ0ICsga2V5LnBvcy53aWR0aFxuICAgICAgICAmJiB0b3VjaC5jbGllbnRZID4ga2V5LnBvcy50b3AgJiYgdG91Y2guY2xpZW50WSA8PSBrZXkucG9zLnRvcCArIGtleS5wb3MuaGVpZ2h0XG4gICAgICAgICYmIGxhc3RUb3VjaEtleSAhPT0ga2V5XG4gICAgICApIHtcbiAgICAgICAgbmV4dEJhbmsoa2V5KTtcbiAgICAgICAgbGFzdFRvdWNoS2V5ID0ga2V5O1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxua2V5Ym9hcmRDb250YWluZXJFbGVtZW50LmFwcGVuZENoaWxkKGtleWJvYXJkRWxlbWVudCk7XG5cbnZhciBYWXMgPSBbJ2EnLCdiJ10ubWFwKGNyZWF0ZVhZQ29udHJvbGxlcik7XG52YXIgWFlDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblhZQ29udGFpbmVyLmNsYXNzTmFtZSA9ICd4eS1jb250YWluZXInO1xuXG5YWUNvbnRhaW5lci5vbnRvdWNoc3RhcnQgPVxuWFlDb250YWluZXIub250b3VjaGVudGVyID1cblhZQ29udGFpbmVyLm9udG91Y2htb3ZlID1cblhZQ29udGFpbmVyLm9ubW91c2Vtb3ZlID0gZSA9PiB7XG4gIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIGUucHJldmVudERlZmF1bHQoKTtcblxuICBpZiAoIWUudG91Y2hlcykge1xuICAgIGUudG91Y2hlcyA9IFtlXTtcbiAgfVxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZS50b3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIHRvdWNoID0gZS50b3VjaGVzW2ldO1xuICAgIGZvciAodmFyIGogPSAwOyBqIDwgWFlzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgeHkgPSBYWXNbal07XG4gICAgICAvLyBpZiAoeHkuYWN0aXZlID09PSBmYWxzZSkgY29udGludWU7XG4gICAgICBpZiAoIHRvdWNoLmNsaWVudFggPiB4eS5wb3MubGVmdCAmJiB0b3VjaC5jbGllbnRYIDwgeHkucG9zLmxlZnQgKyB4eS5wb3Mud2lkdGhcbiAgICAgICAgJiYgdG91Y2guY2xpZW50WSA+IHh5LnBvcy50b3AgJiYgdG91Y2guY2xpZW50WSA8IHh5LnBvcy50b3AgKyB4eS5wb3MuaGVpZ2h0XG4gICAgICAgICkgeyAgICAgIFxuICAgICAgICBPYmplY3QuYXNzaWduKHh5LnNwb3Quc3R5bGUsIHtcbiAgICAgICAgICBsZWZ0OiB0b3VjaC5jbGllbnRYIC0geHkucG9zLmxlZnQgKyAncHgnLFxuICAgICAgICAgIHRvcDogdG91Y2guY2xpZW50WSAtIHh5LnBvcy50b3AgKyAncHgnXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuZnVuY3Rpb24gY3JlYXRlWFlDb250cm9sbGVyKG4pIHtcbiAgdmFyIHh5ID0ge307XG5cbiAgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGVsLmNsYXNzTmFtZSA9ICd4eS1jb250cm9sbGVyIHh5LScgKyBuO1xuXG4gIHZhciBzcG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIHNwb3QuY2xhc3NOYW1lID0gJ3h5LXNwb3QnO1xuXG4gIGVsLmFwcGVuZENoaWxkKHNwb3QpO1xuICB2YXIgY2VudGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBlbC5hcHBlbmRDaGlsZChjZW50ZXIpO1xuXG4gIGVsLm9udG91Y2hsZWF2ZSA9IGUgPT4ge1xuICAgIHh5LmFjdGl2ZSA9IGZhbHNlO1xuICB9O1xuXG4gIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIGVsLm9udG91Y2hsZWF2ZSk7XG5cbiAgZWwub25tb3VzZWRvd24gPSBlID0+IHtcbiAgICB4eS5hY3RpdmUgPSB0cnVlO1xuICB9O1xuXG4gIHh5LmVsID0gZWw7XG4gIHh5LnNwb3QgPSBzcG90O1xuXG4gIHJldHVybiB4eTtcbn1cblxuWFlzLmZvckVhY2goeHkgPT4gWFlDb250YWluZXIuYXBwZW5kQ2hpbGQoeHkuZWwpKTtcblxuY29sdW1uUmlnaHQuYXBwZW5kQ2hpbGQoWFlDb250YWluZXIpO1xuXG5jb2x1bW5MZWZ0LmFwcGVuZENoaWxkKGtleWJvYXJkQ29udGFpbmVyRWxlbWVudCk7XG5cbnZhciBlbGVtZW50cyA9IHtcbiAgJ2VkaXRvcic6IGVkaXRvckVsZW1lbnQsXG4gICdrZXlib2FyZCc6IGtleWJvYXJkRWxlbWVudFxufTtcbnZhciBmb2N1cyA9ICdrZXlib2FyZCc7XG52YXIgb3RoZXIgPSB7XG4gICdlZGl0b3InOiAna2V5Ym9hcmQnLFxuICAna2V5Ym9hcmQnOiAnZWRpdG9yJyxcbn07XG5cbmVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QuYWRkKCdmb2N1cycpO1xuXG5qYXp6LmJsdXIoKTtcblxuamF6ei5pbnB1dC50ZXh0LmVsLnN0eWxlLmhlaWdodCA9ICc1MCUnO1xuXG5qYXp6Lm9uKCdmb2N1cycsICgpID0+IHtcbiAgZWxlbWVudHNbZm9jdXNdLmNsYXNzTGlzdC5yZW1vdmUoJ2ZvY3VzJyk7XG4gIGZvY3VzID0gJ2VkaXRvcic7XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QuYWRkKCdmb2N1cycpO1xufSk7XG5cbmphenoub24oJ2JsdXInLCAoKSA9PiB7XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1cycpO1xuICBmb2N1cyA9ICdrZXlib2FyZCc7XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QuYWRkKCdmb2N1cycpO1xufSk7XG5cbi8vIH0pO1xuXG5kb2N1bWVudC5ib2R5Lm9ua2V5dXAgPSBlID0+IHtcbiAgaWYgKGUua2V5ID09PSAnU2hpZnQnKSB7XG4gICAgc3RhdGUudHJpZ2dlckJhbmsgPSBmYWxzZTtcbiAgfVxufVxuXG5kb2N1bWVudC5ib2R5Lm9ua2V5ZG93biA9IGUgPT4ge1xuICBpZiAoZS5rZXkubGVuZ3RoID4gMSkge1xuICAgIGlmIChlLmtleSA9PT0gJ0VzY2FwZScpIHRvZ2dsZVBhbmVsKCk7XG4gICAgaWYgKGUua2V5ID09PSAnVGFiJykge1xuICAgICAgaWYgKGUuc2hpZnRLZXkpIHRvZ2dsZVBhbmVsKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHJldHVybjtcbiAgfVxuICBpZiAoZm9jdXMgPT09ICdlZGl0b3InKSByZXR1cm47XG4gIHZhciBjaGFyID0gZS5rZXkudG9Mb3dlckNhc2UoKTtcbiAgaWYgKGNoYXIgPT09IGNoYXIudG9VcHBlckNhc2UoKSkge1xuICAgIGlmIChjaGFyID09PSAnIScpIGNoYXIgPSAnMSc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJ0AnKSBjaGFyID0gJzInO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICcjJykgY2hhciA9ICczJztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnJCcpIGNoYXIgPSAnNCc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyUnKSBjaGFyID0gJzUnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICdeJykgY2hhciA9ICc2JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnJicpIGNoYXIgPSAnNyc7XG4gICAgZWxzZSBpZiAoY2hhciA9PT0gJyonKSBjaGFyID0gJzgnO1xuICAgIGVsc2UgaWYgKGNoYXIgPT09ICcoJykgY2hhciA9ICc5JztcbiAgICBlbHNlIGlmIChjaGFyID09PSAnKScpIGNoYXIgPSAnMCc7XG4gIH1cbiAgdmFyIGNoYXJDb2RlID0gY2hhci50b0xvd2VyQ2FzZSgpLmNoYXJDb2RlQXQoMCk7XG4gIHZhciBrZXkgPSBzb3VuZHNbY2hhckNvZGVdO1xuICBpZiAoZS5zaGlmdEtleSkge1xuICAgIGtleS50dXJuT2ZmKCk7XG4gIH0gZWxzZSB7XG4gICAgbmV4dEJhbmsoa2V5KTtcbiAgfVxufTtcblxuZm9yICh2YXIgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgYmFua3MucHVzaChuZXcgQmFuayhpKSk7XG59XG5cbmZ1bmN0aW9uIGdldEtleXNQb3NpdGlvbnMoKSB7XG4gIGZvciAodmFyIGNoYXIgaW4gc291bmRzKSB7XG4gICAgdmFyIGtleSA9IHNvdW5kc1tjaGFyXTtcbiAgICBrZXkucG9zID0ga2V5LmVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFhZUG9zaXRpb25zKCkge1xuICBYWXMuZm9yRWFjaCh4eSA9PiB4eS5wb3MgPSB4eS5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKSk7ICBcbn1cblxudmFyIHByZXZIZWlnaHQgPSAwO1xuXG5nZXRLZXlzUG9zaXRpb25zKCk7XG5nZXRYWVBvc2l0aW9ucygpO1xuXG53aW5kb3cub25zY3JvbGwgPSBlID0+IHtcbiAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICByZXR1cm4gZmFsc2U7XG59O1xuXG53aW5kb3cub25yZXNpemUgPSBlID0+IHtcbiAgZ2V0S2V5c1Bvc2l0aW9ucygpO1xuICBnZXRYWVBvc2l0aW9ucygpO1xuICBpZiAocHJldkhlaWdodCAmJiBwcmV2SGVpZ2h0IDwgZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQpIHtcbiAgICBqYXp6LmJsdXIoKTtcbiAgfVxuICBwcmV2SGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XG59O1xuXG52YXIgc3RhdGUgPSB7XG4gIGFjdGl2ZUJhbms6IGJhbmtzWzBdLFxuICB0cmlnZ2VyQmFuazogZmFsc2Vcbn07XG5cbmZvciAodmFyIGtleSBpbiBzb3VuZHMpIHtcbiAgc291bmRzW2tleV0uc2V0QmFuayhzdGF0ZS5hY3RpdmVCYW5rKTtcbn1cblxuZnVuY3Rpb24gbmV4dEJhbmsoa2V5KSB7XG4gIHZhciBiYW5rO1xuXG4gIGlmICgha2V5LmFjdGl2ZSkge1xuICAgIGJhbmsgPSBiYW5rc1swXTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbmV4dEJhbmtJbmRleCA9ICtrZXkuYmFuay5uYW1lICsgMTtcbiAgICBiYW5rID0gYmFua3NbbmV4dEJhbmtJbmRleCAlIChiYW5rcy5sZW5ndGggKyAxKV07XG4gIH1cblxuICBpZiAoYmFuaykge1xuICAgIHN0YXRlLmFjdGl2ZUJhbmsgPSBiYW5rO1xuICAgIGtleS5zZXRCYW5rKHN0YXRlLmFjdGl2ZUJhbmspO1xuICAgIGtleS50dXJuT24oKTtcbiAgfSBlbHNlIHtcbiAgICBrZXkudHVybk9mZigpO1xuICB9XG5cbiAgYWx0ZXJTdGF0ZShrZXkpO1xufVxuXG52YXIgcGxheWluZyA9IHt9O1xuXG52YXIgQUMgPSB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0IHx8IHdpbmRvdy5BdWRpb0NvbnRleHQ7XG52YXIgYXVkaW8gPSBuZXcgQUM7XG53aW5kb3cuc2FtcGxlUmF0ZSA9IGF1ZGlvLnNhbXBsZVJhdGU7XG5cbnZhciBicG0gPSA2MDtcbnZhciBzb3VyY2VzID0ge307XG52YXIgYmVhdFRpbWU7XG5cbmNsb2NrKCk7XG5cbmZ1bmN0aW9uIGNsb2NrKCkge1xuICBiZWF0VGltZSA9IDEgLyAoYnBtIC8gNjApO1xufVxuXG5qYXp6Lm9uKCdpbnB1dCcsIGRlYm91bmNlKCgpID0+IHtcbiAgY29uc29sZS5sb2coJ3JlYWQgaW5wdXQnKTtcbiAgdmFyIHRleHQgPSBqYXp6LmJ1ZmZlci50ZXh0LnRvU3RyaW5nKCk7XG4gIGxvY2FsU3RvcmFnZS50ZXh0ID0gdGV4dDtcbiAgYnVpbGQobnVsbCwgdGV4dCk7XG59LCA3MDApKTtcblxuZnVuY3Rpb24gZGVib3VuY2UoZm4sIG1zKSB7XG4gIHZhciB0aW1lb3V0O1xuICByZXR1cm4gZnVuY3Rpb24gZGVib3VuY2VXcmFwKGEsIGIsIGMpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgdGltZW91dCA9IHNldFRpbWVvdXQoZm4sIG1zLCBhLCBiLCBjKTtcbiAgfTtcbn1cblxudmFyIGNhbGxiYWNrcyA9IFtdO1xudmFyIGNhbGxiYWNrSWQgPSAwO1xuXG52YXIgd29ya2VyID0gbmV3IFdvcmtlcignd29ya2VyLmpzJyk7XG5cbndvcmtlci5vbm1lc3NhZ2UgPSBmdW5jdGlvbiBvbm1lc3NhZ2UoZSkge1xuICB2YXIgcGFyYW1zID0gZS5kYXRhO1xuICBjb25zb2xlLmxvZygncmVjZWl2ZWQgcGFyYW1zJywgcGFyYW1zKVxuICBpZiAocGFyYW1zID09PSB0cnVlKSByZXR1cm47XG4gIGlmICgnbnVtYmVyJyA9PT0gdHlwZW9mIHBhcmFtcykge1xuICAgIGJwbSA9IHBhcmFtcztcbiAgICBjbG9jaygpO1xuICAgIGNvbnNvbGUubG9nKCdyZWNlaXZlZCBicG0nLCBicG0pO1xuICAgIHJldHVybjtcbiAgfVxuICBjb25zb2xlLmxvZyhwYXJhbXMsIGNhbGxiYWNrcylcbiAgdmFyIHRpbWUgPSBEYXRlLm5vdygpIC0gcGFyYW1zLnRpbWVzdGFtcDtcbiAgdmFyIGNiID0gY2FsbGJhY2tzW3BhcmFtcy5pZF07XG4gIGRlbGV0ZSBjYWxsYmFja3NbcGFyYW1zLmlkXTtcbiAgY2IocGFyYW1zLmVycm9yLCBwYXJhbXMpO1xufTtcblxuZnVuY3Rpb24gYnVpbGQoZXJyLCBqcykge1xuICBjb25zb2xlLmxvZygnYnVpbGRpbmcnKTtcblxuICBpZiAoZXJyKSB0aHJvdyBlcnI7XG5cbiAgdmFyIGNiID0gZnVuY3Rpb24oZXJyLCByZXN1bHQpIHtcbiAgICBpZiAoZXJyKSBjb25zb2xlLmxvZyhlcnIuc3RhY2spO1xuICAgIGVsc2UgY29tcGlsZShyZXN1bHQpO1xuICB9O1xuXG4gIGNhbGxiYWNrc1srK2NhbGxiYWNrSWRdID0gY2I7XG4gIHdvcmtlci5wb3N0TWVzc2FnZSh7XG4gICAgcHJvY2VkdXJlTmFtZTogJ2NvbXBpbGUnLFxuICAgIGlkOiBjYWxsYmFja0lkLFxuICAgIGFyZ3M6IFtqc10sXG4gICAgdGltZXN0YW1wOiBEYXRlLm5vdygpXG4gIH0pO1xufVxuXG52YXIgY2IgPSBmdW5jdGlvbihlcnIsIHJlc3VsdCkge1xuICBidWlsZChudWxsLCBqYXp6LmJ1ZmZlci50ZXh0LnRvU3RyaW5nKCkpO1xufTtcblxuY2FsbGJhY2tzWysrY2FsbGJhY2tJZF0gPSBjYjtcblxud29ya2VyLnBvc3RNZXNzYWdlKHtcbiAgcHJvY2VkdXJlTmFtZTogJ3NldHVwJyxcbiAgaWQ6IGNhbGxiYWNrSWQsXG4gIGFyZ3M6IFt7IHNhbXBsZVJhdGU6IGF1ZGlvLnNhbXBsZVJhdGUgfV0sXG4gIHRpbWVzdGFtcDogRGF0ZS5ub3coKVxufSk7XG5cbmZ1bmN0aW9uIGNhbGNPZmZzZXRUaW1lKGJ1ZmZlcikge1xuICByZXR1cm4gYXVkaW8uY3VycmVudFRpbWUgJSAoYnVmZmVyLmxlbmd0aCAvIGF1ZGlvLnNhbXBsZVJhdGUgfCAwKTtcbn1cblxuZnVuY3Rpb24gY29tcGlsZShidWZmZXJzKSB7XG4gIGNvbnNvbGUubG9nKCdsb2NhbCBjb21waWxlJywgYnVmZmVycyk7XG4gIHZhciBvbGRTb3VyY2VzID0gT2JqZWN0LmFzc2lnbih7fSwgc291cmNlcylcbiAgZm9yICh2YXIga2V5IGluIGJ1ZmZlcnMpIHtcbiAgICBpZiAoJ2lkJyA9PT0ga2V5IHx8ICd0aW1lc3RhbXAnID09PSBrZXkpIGNvbnRpbnVlO1xuICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2tleV07XG4gICAgc291cmNlID0gc291cmNlc1trZXldID0gY3JlYXRlQmFua1NvdXJjZXMoa2V5LCBidWZmZXJzW2tleV0pO1xuICAgIHNvdXJjZS5tdWx0aXBsaWVyID0gYnVmZmVyc1trZXldLm11bHRpcGxpZXIgfHwgNDtcbiAgICBjb25zb2xlLmxvZygna2V5Jywga2V5LCBzb3VyY2VzW2tleV0pXG4gICAgdmFyIHNvdW5kS2V5ID0gc291bmRzW2tleS5jaGFyQ29kZUF0KDApXTtcbiAgICBjb25zb2xlLmxvZygnc291bmQga2V5Jywgc291bmRLZXkpO1xuICAgIGlmIChzb3VuZEtleS5hY3RpdmUpIHtcbiAgICAgIHNvdW5kS2V5LnN5bmNUaW1lID0gY2FsY1N5bmNUaW1lKHNvdXJjZS5tdWx0aXBsaWVyKTtcbiAgICAgIG9sZFNvdXJjZXNba2V5XVtzb3VuZEtleS5iYW5rLm5hbWVdLnN0b3Aoc291bmRLZXkuc3luY1RpbWUpO1xuICAgICAgc291cmNlW3NvdW5kS2V5LmJhbmsubmFtZV0uc3RhcnQoc291bmRLZXkuc3luY1RpbWUpO1xuICAgIH1cbiAgfVxufVxuXG5hbGxLZXlzLmZvckVhY2goa2V5ID0+IHtcbiAgc291cmNlc1trZXldID0gY3JlYXRlQmFua1NvdXJjZXMoa2V5KTtcbiAgc291cmNlc1trZXldLm11bHRpcGxpZXIgPSA0O1xufSk7XG5cbmJ1aWxkKG51bGwsIGxvY2FsU3RvcmFnZS50ZXh0IHx8IGphenouYnVmZmVyLnRleHQudG9TdHJpbmcoKSk7XG5cbmZ1bmN0aW9uIGNyZWF0ZUJhbmtTb3VyY2VzKGtleSwgYnVmZmVycykge1xuICBjb25zb2xlLmxvZygnY3JlYXRlIGJhbmsgc291cmNlcycsIGtleSk7XG4gIHZhciBzb3VyY2VzID0gW107XG4gIGZvciAodmFyIGIgPSAwOyBiIDwgNDsgYisrKSB7XG4gICAgdmFyIHNvdXJjZSA9IGF1ZGlvLmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuICAgIHNvdXJjZS5sb29wID0gdHJ1ZTtcbiAgICBzb3VyY2Uub25lbmRlZCA9IGRpc2Nvbm5lY3Q7XG4gICAgaWYgKGJ1ZmZlcnMpIHtcbiAgICAgIHNvdXJjZS5idWZmZXIgPSBhdWRpby5jcmVhdGVCdWZmZXIoMiwgYnVmZmVyc1tiXVswXS5sZW5ndGgsIGF1ZGlvLnNhbXBsZVJhdGUpO1xuICAgICAgc291cmNlLmJ1ZmZlci5nZXRDaGFubmVsRGF0YSgwKS5zZXQoYnVmZmVyc1tiXVswXSk7XG4gICAgICBzb3VyY2UuYnVmZmVyLmdldENoYW5uZWxEYXRhKDEpLnNldChidWZmZXJzW2JdWzFdKTtcbiAgICB9XG4gICAgc291cmNlLmNvbm5lY3QoYXVkaW8uZGVzdGluYXRpb24pO1xuICAgIHNvdXJjZXMucHVzaChzb3VyY2UpO1xuICB9XG4gIHJldHVybiBzb3VyY2VzO1xufVxuXG5mdW5jdGlvbiBjYWxjU3luY1RpbWUobXVsdGlwbGllcikge1xuICByZXR1cm4gbm9ybWFsaXplKFxuICAgIGF1ZGlvLmN1cnJlbnRUaW1lICtcbiAgICAobXVsdGlwbGllciAqIGJlYXRUaW1lIC1cbiAgICAoYXVkaW8uY3VycmVudFRpbWUgJSAobXVsdGlwbGllciAqIGJlYXRUaW1lKSkpXG4gICk7XG59XG5cbmZ1bmN0aW9uIGNhbGNTeW5jT2Zmc2V0KG11bHRpcGxpZXIpIHtcbiAgcmV0dXJuIG5vcm1hbGl6ZSgpO1xufVxuXG5mdW5jdGlvbiBkaXNjb25uZWN0KCkge1xuICB0aGlzLmRpc2Nvbm5lY3QoKTtcbn1cblxuZnVuY3Rpb24gbm9ybWFsaXplKG51bWJlcikge1xuICByZXR1cm4gbnVtYmVyID09PSBJbmZpbml0eSB8fCBudW1iZXIgPT09IC1JbmZpbml0eSB8fCBpc05hTihudW1iZXIpID8gMCA6IG51bWJlcjtcbn1cblxuZnVuY3Rpb24gYWx0ZXJTdGF0ZShrZXkpIHtcbiAgaWYgKGtleS5hY3RpdmUpIHBsYXkoa2V5KTtcbiAgZWxzZSBzdG9wKGtleSk7XG59XG5cbmZ1bmN0aW9uIHBsYXkoa2V5KSB7XG4gIGlmIChrZXkubmFtZSBpbiBzb3VyY2VzKSB7XG4gICAgdmFyIHN5bmNUaW1lID0gY2FsY1N5bmNUaW1lKHNvdXJjZXNba2V5Lm5hbWVdLm11bHRpcGxpZXIpO1xuICAgIHZhciBzb3VyY2U7XG4gICAgdHJ5IHtcbiAgICAgIGlmIChrZXkucHJldkJhbmspIHtcbiAgICAgICAgc291cmNlID0gc291cmNlc1trZXkubmFtZV1ba2V5LnByZXZCYW5rLm5hbWVdO1xuICAgICAgICB2YXIgYnVmZmVyID0gc291cmNlLmJ1ZmZlcjtcbiAgICAgICAgc291cmNlLnN0b3Aoc3luY1RpbWUpO1xuICAgICAgICBzb3VyY2UgPSBzb3VyY2VzW2tleS5uYW1lXVtrZXkucHJldkJhbmsubmFtZV0gPSBhdWRpby5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcbiAgICAgICAgc291cmNlLmxvb3AgPSB0cnVlO1xuICAgICAgICBzb3VyY2Uub25lbmRlZCA9IGRpc2Nvbm5lY3Q7XG4gICAgICAgIHNvdXJjZS5jb25uZWN0KGF1ZGlvLmRlc3RpbmF0aW9uKTtcbiAgICAgICAgc291cmNlLmJ1ZmZlciA9IGJ1ZmZlcjtcbiAgICAgIH1cbiAgICB9IGNhdGNoKGUpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjYW5ub3QgY3JlYXRlIHNvdXJjZScsIGtleSwgZSlcbiAgICB9XG4gICAgc291cmNlID0gc291cmNlc1trZXkubmFtZV1ba2V5LmJhbmsubmFtZV07XG4gICAgY29uc29sZS5sb2coJ3N0YXJ0OicsIHNvdXJjZSk7XG4gICAgc291cmNlLnN0YXJ0KHN5bmNUaW1lKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBzdG9wKGtleSkge1xuICBpZiAoa2V5Lm5hbWUgaW4gc291cmNlcykge1xuICAgIHZhciBzb3VyY2UgPSBzb3VyY2VzW2tleS5uYW1lXTtcbiAgICB2YXIgc3luY1RpbWUgPSBjYWxjU3luY1RpbWUoc291cmNlLm11bHRpcGxpZXIpO1xuICAgIHNvdXJjZVtrZXkuYmFuay5uYW1lXS5zdG9wKHN5bmNUaW1lKTtcbiAgfVxuICBjb25zb2xlLmxvZygnc3RvcCcsIGtleS5uYW1lKTtcbn1cblxuZnVuY3Rpb24gdG9nZ2xlUGFuZWwoKSB7XG4gIGVsZW1lbnRzW2ZvY3VzXS5jbGFzc0xpc3QucmVtb3ZlKCdmb2N1cycpO1xuICBmb2N1cyA9IG90aGVyW2ZvY3VzXTtcbiAgZWxlbWVudHNbZm9jdXNdLmNsYXNzTGlzdC5hZGQoJ2ZvY3VzJyk7XG4gIGlmIChmb2N1cyA9PT0gJ2VkaXRvcicpIHtcbiAgICBqYXp6LmZvY3VzKCk7XG4gIH0gZWxzZSB7XG4gICAgamF6ei5ibHVyKCk7XG4gIH1cbn1cbiJdfQ==
