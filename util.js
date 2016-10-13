
exports = typeof exports !== 'undefined' && exports || self.util || (self.util = {});

var cfg = exports.cfg = function cfg(target, obj) {
  if (!obj) obj = target;
  for (var k in obj) {
    var val = obj[k];
    var _k = '_' + k;
    target[_k] = val;
    target[k] = CfgSetter(_k);
  }
  return target;
};

function CfgSetter(_k){
  return function(val){
    this[_k] = val;
    return this;
  };
}
