
function PadKey(char) {
  this.el = document.createElement('div');
  this.el.className = 'key key-' + char;
  this.el.textContent = char;
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

function BankKey(char) {
  PadKey.call(this, char);
}

BankKey.prototype.__proto__ = PadKey.prototype;

function SoundKey(char) {
  PadKey.call(this, char);
  this.setBank('1');
}

SoundKey.prototype.__proto__ = PadKey.prototype;

SoundKey.prototype.setBank = function(bank) {
  this.el.classList.remove('bank-' + this.bank);
  this.bank = bank;
  this.el.classList.add('bank-' + this.bank);
};

var keyboard = [
  '1234567890'.split(''),
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split(''),
];

var sounds = {};
var banks = {};

var containerElement = document.createElement('div');
containerElement.className = 'container';
document.body.appendChild(containerElement);

var editorElement = document.createElement('div');
var textarea = document.createElement('textarea');
editorElement.appendChild(textarea);
editorElement.className = 'editor';
textarea.textContent = `\
export default function(t) {
  return Math.sin(t * Math.PI * 2 * 440) * .2;
}
`
containerElement.appendChild(editorElement);

var keyboardElement = document.createElement('div');
keyboardElement.className = 'keyboard';

for (var i = 0; i < keyboard.length; i++) {
  var row = keyboard[i];
  var rowElement = document.createElement('div');
  rowElement.className = 'row row-' + i;
  for (var k = 0; k < row.length; k++) {
    var char = row[k];
    var key;
    if (i === 0) {
      key = new BankKey(char);
      banks[key.charCode] = key;
      rowElement.appendChild(key.el);
    } else {
      key = new SoundKey(char);
      sounds[key.charCode] = key;
      rowElement.appendChild(key.el);
    }
  }
  keyboardElement.appendChild(rowElement);
}

containerElement.appendChild(keyboardElement);

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

textarea.blur();

document.body.onkeyup = e => {
  if (e.key === 'Shift') {
    state.activeBank.turnOff();
    state.triggerBank = false;
  }
}

document.body.onkeydown = e => {
  if (e.key.length > 1) {
    if (e.key === 'Tab') {
      elements[focus].classList.remove('focus');
      focus = other[focus];
      elements[focus].classList.add('focus');
      if (focus === 'editor') {
        textarea.focus();
      } else {
        textarea.blur();
      }
      return false;
    }
    return;
  }
  if (focus === 'editor') return;
  var charCode = e.key.toLowerCase().charCodeAt(0);
  var key = sounds[charCode];
  if (key == null) {
    key = banks[charCode];
    if (key == null) return;
    else {
      state.activeBank.turnOff();
      state.activeBank = key;
      state.triggerBank = true;
      key.turnOn();
    }
  } else {
    if (state.triggerBank) {
      key.setBank(state.activeBank.name);
      if (!e.shiftKey) {
        state.activeBank.turnOff();
        state.triggerBank = false;
      }
      key.turnOn();
    } else {
      key.toggle();
    }
  }
};

var state = {
  activeBank: banks[49],
  triggerBank: false
};
