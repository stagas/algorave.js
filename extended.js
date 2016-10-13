
var { sin, Saw, DiodeFilter, softClip:clip } = studio;
var { cfg } = util;

exports = self.extended = {};

var Bassline = exports.Bassline = function Bassline(){
  if (!(this instanceof Bassline)) return new Bassline();

  this.osc = Saw(512);
  this.filter = DiodeFilter();

  cfg(this, {
    seq: [110, 220],
    hpf: .0087,
    cut: .5,
    res: .7,
    lfo: .66,
    lfo2: .12,
    pre: 0.32,
    clip: 30.3
  });
};

Bassline.prototype.play = function(t, speed){
  speed = speed || 1/16;

  var lfo = sin(t, this._lfo);
  var lfo2 = sin(t, this._lfo2);

  var n = slide(t, speed, this._seq, 14);
  var synth_osc = this.osc(n);
  var synth = arp(t, speed, synth_osc, 24, .99);

  synth = this.filter
    .cut(
      (0.001 +
      ((lfo * 0.28 + 1) / 2) *
      (0.538 + lfo2 * 0.35)) * this._cut
    )
    .hpf(this._hpf)
    .res(this._res)
    .run(synth * this._pre)
    ;

  synth = clip(synth * this._clip);

  return synth;
};

var slide = exports.slide = function slide(t, measure, seq, speed){
  var pos = (t / measure / 2) % seq.length;
  var now = pos | 0;
  var next = now + 1;
  var alpha = pos - now;
  if (next == seq.length) next = 1;
  return seq[now] + ((seq[next] - seq[now]) * Math.pow(alpha, speed));
};

var arp = exports.arp = function arp(t, measure, x, y, z) {
  var ts = t / 4 % measure;
  return Math.sin(x * (Math.exp(-ts * y))) * Math.exp(-ts * z);
};
