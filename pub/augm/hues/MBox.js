var MBox;

import Vis from '../../../lib/pub/draw/Vis.js';

MBox = class MBox {
  constructor(elem) {
    var THREE, mathBox;
    this.debug = true;
    if (this.debug) {
      console.log('MBox()', window);
    }
    THREE = window['THREE'];
    mathBox = window['mathBox'];
    this.mathbox = mathBox({
      element: elem,
      plugins: ['core', 'controls', 'cursor', 'stats'],
      controls: {
        klass: THREE.OrbitControls // TrackballControls  OrbitControls
      }
    });
    if (this.mathbox.fallback) {
      console.error('mathbox WebGL not supported');
    }
    this.three = this.mathbox.three;
    this.three.renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    //@mathbox.set( { focus:3, scale: 720 } )
    Vis.time = 0;
    this.setupTime();
  }

  setupTime() {
    this.three.on('update', function() {
      return Vis.time = this.three.Time.clock;
    });
    Vis.noop();
  }

  pv1v2(p, v1, v2) {
    var i, j, p1, p2, v3;
    p1 = p * 0.01;
    p2 = 1.0 - p1;
    v3 = [0, 0, 0];
    for (i = j = 0; j < 3; i = ++j) {
      v3[i] = v1[i] * p1 + v2[i] * p2;
    }
    return v3;
  }

  toRad(i, n) {
    var hue;
    hue = (i * 360 / n) % 360;
    return Vis.rad(hue);
  }

  toHue(i, n) {
    var h;
    h = (i * 360 / n) % 360;
    return Vis.toInt(h);
  }

  sin9(x, y) {
    return 0.5 + 0.25 * Math.sin(12 * x + Vis.time * 0.3) + 0.25 * Math.sin(12 * y + Vis.time * 0.3);
  }

  sin12(x, y) {
    return 0.5 + 0.50 * Math.sin(12 * x + Vis.time * 0.3) + 0.50 * Math.sin(12 * y + Vis.time * 0.3);
  }

  sinNorm(x, y) {
    return Math.sin(12 * x + Vis.time * 0.3) + Math.sin(12 * y + Vis.time * 0.3);
  }

  sin9Pq(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * (r + a) + Vis.time * 1.2 + π / 12) + 0.25 * Math.cos(12 * a);
  }

  sin9P(a, r) {
    return 0.5 * Math.sin(12 * (a + r) + Vis.time * 1.2 + π / 12) + 0.5 * Math.cos(12 * a);
  }

  sin9R(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r * a + Vis.time * 1.2) + 0.25 * Math.sin(6 * a);
  }

  sin9P(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r + Vis.time * 0.3 + π / 12) + 0.25 * Math.sin(12 * a + π / 12);
  }

  sin9PJan(a, r) {
    return 0.5 * Math.sin(12 * (a + r) + Vis.time * 1.2 + π / 12) + 0.50 * Math.cos(12 * a);
  }

  sin9QJan(a, r) {
    return 0.5 + 0.25 * Math.sin(12 * r + Vis.time * 0.3 + π / 12) + 0.25 * Math.sin(12 * a + π / 12);
  }

  sin12P(a, r) {
    return 0.5 * Math.sin(12 * (r + a) + Vis.time * 1.2) + 0.5 * Math.cos(12 * a);
  }

  sin12R(a, r) {
    return .5 + 0.25 * Math.sin(r + a) + 0.25 * Math.cos(r + a * Vis.time * 0.5);
  }

  sin12PMar(a, r) {
    return .5 + .5 * Math.sin(12 * (r + a) + Vis.time) * Math.sin(9 * a + Vis.time);
  }

  sin12CMar(a, r) {
    return .5 + .5 * Math.sin(12 * (r + a) + Vis.time) * Math.sin(9 * a + Vis.time) * Math.cos(r);
  }

  sin09PMar(a, r) {
    return .5 + .5 * Math.sin(9 * (r + a) + Vis.time) * Math.sin(9 * a + Vis.time);
  }

  sin01Oct(a, r) {
    return .5 + .5 * Math.sin(a + Vis.time) * Math.sin(r + Vis.time);
  }

  sin09Oct(a, r) {
    return .5 + .5 * Math.sin(9 * a + Vis.time) * Math.sin(9 * r + Vis.time);
  }

  sin12Oct(a, r) {
    return .5 + .5 * Math.sin(12 * a + Vis.time) * Math.sin(12 * r + Vis.time);
  }

  cos01Oct(a, r) {
    return .5 + .5 * Math.cos(a + Vis.time) * Math.cos(r + Vis.time);
  }

  sin12AMay(a) {
    return .5 + .50 * Math.cos(12 * a + Vis.time);
  }

  sin12RMay(a, r) {
    return .5 + .50 * Math.cos(12 * r + Vis.time);
  }

  sin12MMay(a, r) {
    return .5 + .50 * Math.cos(12 * a + Vis.time) * Math.cos(12 * r + Vis.time);
  }

  sin12PMay(a, r) {
    return .5 + .25 * Math.cos(12 * a + Vis.time) + .25 * Math.cos(12 * r + Vis.time);
  }

  sin12QMay(a, r) {
    return .5 + .25 * Math.cos(12 * a + Vis.time) + .25 * Math.cos(12 * r + Vis.time);
  }

  sin12QJan(a, r) {
    return .50 + .50 * Math.sin(12 * (r + a) + Vis.time * 1.2);
  }

  sin12AJan(a) {
    return .50 + .50 * Math.sin(12 * a + Vis.time * 1.2);
  }

  sin06AJan(a) {
    return .50 + .50 * Math.sin(3 * a + Vis.time * 1.2); // Keep
  }

  sin06B(a) {
    return .55 + .45 * Math.sin(3 * a + Vis.time);
  }

  sin06C(a) {
    return .60 + .40 * Math.sin(3 * a + Vis.time);
  }

  sin03D(a, r) {
    return .60 + .40 * Math.sin(3 * a + Vis.time) * Math.sin(r * 0.11 + Vis.time);
  }

  sin06D(a, r) {
    return .60 + .40 * Math.sin(6 * a + Vis.time) * Math.sin(r * 0.11 + Vis.time);
  }

  sin06E(a, r) {
    return .60 + .40 * Math.sin(6 * a + Vis.time) * Math.sin(r / 12 + Vis.time);
  }

  sin06F(a, r) {
    return .60 + .40 * Math.sin(6 * a + Vis.time) * Math.sin(r / 8 + Vis.time);
  }

  sigmoidal(x, k, x0 = 0.5) {
    return 1 / (1 + Math.exp(-k * (x - x0)));
  }

  depth() {
    return Math.abs(Math.cos(Vis.time * 0.5));
  }

  toDep(a, r) {
    return Math.abs(Math.cos(6 * (r + a) + Vis.time * 0.5));
  }

};

export default MBox;

//# sourceMappingURL=MBox.js.map
