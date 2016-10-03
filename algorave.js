
var keyboard = [
  '1234567890'.split(''),
  'qwertyuiop'.split(''),
  'asdfghjkl'.split(''),
  'zxcvbnm'.split(''),
];

var keys = {};

var keyboardElement = document.createElement('div');
keyboardElement.className = 'keyboard';

for (var i = 0; i < keyboard.length; i++) {
  var row = keyboard[i];
  var rowElement = document.createElement('div');
  rowElement.className = 'row row-' + i;
  for (var k = 0; k < row.length; k++) {
    var key = row[k];
    var keyElement = document.createElement('div');
    keyElement.className = 'key';
    keyElement.textContent = key;
    keys[key.charCodeAt(0)] = keyElement;
    rowElement.appendChild(keyElement);
  }
  keyboardElement.appendChild(rowElement);
}

document.body.appendChild(keyboardElement);

document.body.onkeydown = e => {
  var key = keys[e.key.charCodeAt(0)];
  if (key == null) return;
  if (key.classList.contains('active')) {
    key.classList.remove('active');
  } else {
    key.classList.add('active');
  }
};
