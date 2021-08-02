var Vis,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import Type from '../test/Type.js';

import FontAwe from './FontAwe.js';

import chroma from 'chroma-js';

Vis = class Vis extends Type {
  constructor() {
    super();
    this.lookUpSat = this.lookUpSat.bind(this);
    this.even = this.even.bind(this);
    // Create a distributed array of values
    //  by default it returns [0,10,20,30,40,50,60,70,80,90,100] a closed range of 11 values
    this.distribution = this.distribution.bind(this);
    this.skipReady = false;
    this.time = 0;
    this.uniqueIdExt = '';
    this.chroma = chroma;
    this.debug = this.distribution10s = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    this.distributionPri = [0, 30, 45, 60, 70, 75, 80, 85, 90, 95, 100];
    this.distributionSec = [0, 30, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  }

  
    // --- Color Spaces  ---
  // RGB - that also works a RGBa with a:1.0 as a default or can be provided in objects or arrays
  // HSV - recogized as input by Vis.rga(arg) with either rgb or rygb hues
  // HSL - standalone
  // LCH - not implemented yet
  // LAB - not implemented yet

    // @rgb is the conversion work horse that is used by the other functions
  // Always returns an rgb object like { r:255, b:255, b:255, a:1.0 } rounded to from 0 to 255
  //   When arg is an object then just return rgb object with a or alpha defaulted or added
  //   When arg is an array with length === 3 then it is assumed values are hsv with hue in RYGB
  //     hue 360, saturation 100, v for intensity 100
  //     with hue as RYGB red=0deg, yellow=90deg green=180deg and blue=270deg
  //   When arg is an array with length === 4 then it is assumed values  are hsv
  //     with hue as RGB red=0deg, green=120deg and blue=240deg
  //   When arg is a number the range expressed hex is 0x000000 to 0xFFFFFF
  // console.log( 'Vis.rgb()', { arg:arg, rgb:rgb, isRYGB:isRYGB } ) if @debug
  rgb(arg) {
    var rgb, type;
    rgb = {
      r: 255,
      g: 255,
      b: 255,
      a: 1.0 // default is white with alpha = 1.0 opaque
    };
    if (this.isObject(arg)) {
      rgb = arg;
      rgb.a = arg.a != null ? arg.a : 1.0;
    } else if (this.isArray(arg)) {
      type = arg.length === 4 ? arg[3] : "HSV";
      rgb = this.rgbCyl(arg, type);
      rgb.a = 1;
    } else if (this.isNumber(arg)) {
      rgb = {
        r: (arg & 0xFF0000) >> 16,
        g: (arg & 0x00FF00) >> 8,
        b: arg & 0x0000FF
      };
      rgb.a = 1.0;
    }
    return this.round(rgb);
  }

  // Returns an rgb array with an alpha or full opacity of 1
  rgba(arg) {
    var rgb;
    rgb = this.rgb(arg);
    if (rgb.a == null) {
      rgb.a = 1.0;
    }
    return [rgb.r, rgb.g, rgb.b, rgb.a];
  }

  // Returns a number that is interpreted as hex like 0xFFFFFF
  //   Recommended for most libraries like Three.js
  // 65536 is 16 to the fourth power and 256 is 16 squared
  // Need to figure out how to generate an actual value not string in hex
  hex(arg) {
    var rgb;
    rgb = this.rgb(arg);
    return rgb.r * 65536 + rgb.g * 256 + rgb.b;
  }

  // Returns a number in hex format like '0xFFFFFF'
  // Good for debugging
  // Only use for hex strings.
  // Do not use for hex values in style
  str(arg) {
    var rgb, str;
    rgb = this.rgb(arg);
    str = '0x';
    str += this.strHex(rgb.r);
    str += this.strHex(rgb.g);
    str += this.strHex(rgb.b);
    return str;
  }

  // returns a css string in rgb format
  // Recommended for all style in Vue and Svg
  css(arg) {
    var rgb;
    rgb = this.rgb(arg);
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }

  // Returns hsv when toRYGB=false or ysv when toRYGB=true
  cyl(arg, toRYGB = false) {
    var B, G, H, R, a, b, g, h, r, rgb, s, sum, v;
    rgb = this.rgb(arg);
    R = rgb.r;
    G = rgb.g;
    B = rgb.b;
    sum = R + G + B;
    r = R / sum;
    g = G / sum;
    b = B / sum;
    v = sum / 3;
    s = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
    a = this.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
    h = b <= g ? a : 360 - a;
    if (s === 0) {
      h = 0;
    }
    H = toRYGB ? this.rygbHue(h) : h;
    return [H, s * 100, v / 2.55];
  }

  hsv(arg) {
    return this.cyl(arg, false);
  }

  // Returns an  array with hue in rygb coords
  // RYGB red=0deg, yellow=90deg green=180deg and blue=270deg
  ysv(arg) {
    return this.cyl(arg, true);
  }

  // Need to chech output format
  sphere(hue, phi, rad) {
    return this.rgba([this.rot(hue, 90), 100 * this.sin(phi), 100 * rad]);
  }

  // Uses ` ` to fake out CoffeeScript code inspector
  strHex(num) {
    var str;
    str = num.toString(16).toUpperCase();
    switch (false) {
      case num !== 0:
        return '00';
      case !(num < 16):
        return '0' + str;
      default:
        return str;
    }
  }

  // Adjust rgb values to stay in range
  adj(v) {
    var a;
    a = Math.round(v);
    a = a < 0 ? 0 : a;
    a = a > 255 ? 255 : a;
    return a;
  }

  // Rounds and scales rgb value amd limits ints between 0 to 255
  round(rgb, scale = 1, add = 0) {
    rgb.a = rgb.a != null ? rgb.a : 1.0;
    return {
      r: this.adj((rgb.r + add) * scale),
      g: this.adj((rgb.g + add) * scale),
      b: this.adj((rgb.b + add) * scale),
      a: rgb.a
    };
  }

  // Converts hues in 'ysv' RYGB range to 'hsv' and 'hsl' rgb hue
  //   'rygb' has red=0deg, yellow=90deg green=180deg and blue=270deg
  //   'rgb'  has red=0deg,              green=120deg and blue=240deg
  rgbHue(rygbHue) {
    var rgbHue;
    rgbHue = 0;
    if (0 <= rygbHue && rygbHue < 90) {
      rgbHue = rygbHue * 60 / 90;
    } else if (90 <= rygbHue && rygbHue < 180) {
      rgbHue = 60 + (rygbHue - 90) * 60 / 90;
    } else if (180 <= rygbHue && rygbHue < 270) {
      rgbHue = 120 + (rygbHue - 180) * 120 / 90;
    } else if (270 <= rygbHue && rygbHue < 360) {
      rgbHue = 240 + (rygbHue - 270) * 120 / 90;
    }
    return rgbHue;
  }

  // Converts hues in 'hsv' or 'hsl' RGB hue to 'tsv' RYGB range
  //   'rgb'  has red=0deg,              green=120deg and blue=240deg
  //   'rygb' has red=0deg, yellow=90deg green=180deg and blue=270deg
  rygbHue(rgbHue) {
    var rygbHue;
    rygbHue = 0;
    if (0 <= rgbHue && rgbHue < 120) {
      rygbHue = rgbHue * 90 / 60;
    } else if (120 <= rgbHue && rgbHue < 240) {
      rygbHue = 180 + (rgbHue - 120) * 90 / 120;
    } else if (240 <= rgbHue && rgbHue < 360) {
      rygbHue = 270 + (rgbHue - 240) * 90 / 120;
    }
    return rygbHue;
  }

  /*
  black:      { in: [0,0,0],     out: [0,0,0,1]},
  white:      { in: [0,0,1],     out: [255,255,255,1]},
  gray:       { in: [0,0,0.5],   out: [127.5,127.5,127.5,1]},
  red:        { in: [0,1,0.5],   out: [255,0,0,1]},
  yellow:     { in: [60,1,0.5],  out: [255,255,0,1]},
  green:      { in: [120,1,0.5], out: [0,255,0,1]},
  cyan:       { in: [180,1,0.5], out: [0,255,255,1]},
  blue:       { in: [240,1,0.5], out: [0,0,255,1]},
  magenta:    { in: [300,1,0.5], out: [255,0,255,1]},
  chorma.hsv()
  */
  rgbCyl(a, type) {
    var h, isRYGB, s, v;
    isRYGB = !(type.length === 4 && type.charAt(3) === 'R');
    h = isRYGB ? this.rgbHue(a[0]) : a[0];
    s = a[1];
    v = a[2];
    switch (type) {
      case 'HSV':
      case 'HSVR':
        return this.rgbHsv(h, s, v);
      case 'HMI':
      case 'HMIR':
        return this.rgbHmi(h, s, v);
      case 'HWV':
      case 'HWVR':
        return this.rgbHwv(h, s, v);
      case 'HSC':
      case 'HSCR':
        return this.rgbHsc(h, s, v); // HSC means use chroma for HSV
      case 'HSI':
      case 'HSIR':
        return this.rgbHsi(h, s, v);
      case 'HCI':
      case 'HCIR':
        return this.rgbHci(h, s, v); // HCI is a more saturated HSI
      case 'HSL':
      case 'HSLR':
        return this.rgbHsl(h, s, v);
      default:
        console.log(`Vis.rgbCyl() ${type} unknown`);
        return this.rbgHsv(h, s, v);
    }
  }

  rgbHsc(H, S, V) {
    var a, c, h, rgb;
    h = H;
    c = chroma.hsv(h, S * 0.01, V * 0.01);
    a = c._rgb;
    rgb = {
      r: a[0],
      g: a[1],
      b: a[2],
      a: 1
    };
    rgb = this.round(rgb, 1.0);
    if (this.debug) {
      console.log("Vis.rgbHsc()", rgb, h, S, V);
    }
    return rgb;
  }

  // toRygb=true is 'ysc' while
  /*
    var i = floor$1(h);
    var f = h - i;
    var p = v * (1 - s);
    var q = v * (1 - s * f);
    var t = v * (1 - s * (1 - f));
  */
  rgbHsv(H, S, V) {
    var c, d, f, h, i, rgb, x, y, z;
    h = H;
    d = S * 0.01;
    c = d; // @sigmoidal( d, 2, 0.25 )
    i = Math.floor(h / 60);
    f = h / 60 - i;
    x = 1 - c;
    y = 1 - f * c;
    z = 1 - (1 - f) * c;
    rgb = (function() {
      switch (i % 6) {
        case 0:
          return {
            r: 1,
            g: z,
            b: x
          };
        case 1:
          return {
            r: y,
            g: 1,
            b: x
          };
        case 2:
          return {
            r: x,
            g: 1,
            b: z
          };
        case 3:
          return {
            r: x,
            g: y,
            b: 1
          };
        case 4:
          return {
            r: z,
            g: x,
            b: 1
          };
        case 5:
          return {
            r: 1,
            g: x,
            b: y
          };
      }
    })();
    return this.round(rgb, 255 * V / 100);
  }

  rgbHwv(h, S, V) {
    var f, rgb, s, v;
    s = S * 0.01;
    v = V * 0.01;
    f = (n) => {
      var k;
      k = (n + h / 60) % 6;
      return v = v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
    };
    rgb = {
      r: f(5),
      g: f(3),
      b: f(1)
    };
    rgb = this.round(rgb, 255);
    console.log("Vis.rgbHwv()", rgb, h, S, V); // if @debug
    return rgb;
  }

  rgbHmi(h, S, I) {
    var b, bak, boost, bright, desat, fwd, g, look, pri, r, rem, rgb, sat, sec;
    look = this.lookUpSat(S);
    sat = look * 0.01;
    desat = 1 - sat;
    bright = I * 0.01;
    r = 0;
    g = 0;
    b = 0;
    boost = true;
    pri = function(val, max) {
      if (boost) {
        return val / max;
      } else {
        return val;
      }
    };
    sec = function(val, max) {
      if (boost) {
        return desat + (sat * val / max);
      } else {
        return desat + sat * val;
      }
    };
    rem = (q, n) => {
      return q / n - Math.floor(q / n);
    };
    fwd = rem(h, 120);
    bak = 1 - fwd;
    if (0 <= h && h < 60) { // red   pri green sec
      r = pri(bak, bak);
      g = sec(fwd, bak);
      b = desat;
    } else if (60 <= h && h < 120) { // green pri red   sec
      g = pri(fwd, fwd);
      r = sec(bak, fwd);
      b = desat;
    } else if (120 <= h && h < 180) { // green pri blue  sec
      g = pri(bak, bak);
      b = sec(fwd, bak);
      r = desat;
    } else if (180 <= h && h < 240) { // blue   pri green sec
      b = pri(fwd, fwd);
      g = sec(bak, fwd);
      r = desat;
    } else if (240 <= h && h < 300) { // blue  pri red   sec
      b = pri(bak, bak);
      r = sec(fwd, bak);
      g = desat;
    } else if (300 <= h && h < 360) { // red   pri blue  sec
      r = pri(fwd, fwd);
      b = sec(bak, fwd);
      g = desat;
    }
    rgb = this.round({
      r: r,
      g: g,
      b: b
    }, 255 * bright);
    if (this.debug) {
      console.log("Vis.rgbHmi()", {
        rgb: rgb,
        h: h,
        S: look,
        I: I
      });
    }
    return rgb;
  }

  // From chroma.js
  rgbHsi(Hue, Rad, Val) {
    var b, g, h, hue, i, r, s;
    hue = Hue;
    h = hue / 360;
    s = Rad * 0.01;
    i = Val * 0.01;
    if (h < 1 / 3) {
      b = (1 - s) / 3;
      r = (1 + s * this.cos(hue) / this.cos(120 - hue)) / 3;
      g = 1 - (b + r);
    } else if (h < 2 / 3) {
      h -= 1 / 3;
      r = (1 - s) / 3;
      g = (1 + s * this.cos(hue) / this.cos(120 - hue)) / 3;
      b = 1 - (r + g);
    } else {
      h -= 2 / 3;
      g = (1 - s) / 3;
      b = (1 + s * this.cos(hue) / this.cos(120 - hue)) / 3;
      r = 1 - (g + b);
    }
    return this.round({
      r: r,
      g: g,
      b: b
    }, 255 * i * 3); // * 3
  }

  
    // toRygb=true is 'ysc'
  // hue is converted to red=0deg, green=120deg and blue=240deg
  rgbHci(Hue, Rad, Val) {
    var add, c, hq, hue, rad, rgb, val, x, z;
    hue = Hue;
    rad = 0.01 * Rad;
    val = 0.01 * Val;
    hq = Math.floor(hue - 1 / 60);
    z = 1 - Math.abs(hq % 2);
    c = (3 * val * rad) / (1 + z);
    x = c * z;
    add = val * (1 - rad);
    rgb = (function() {
      switch (hq % 6) {
        case 0:
          return {
            r: c,
            g: x,
            b: 0 //   0 -  60  red
          };
        case 1:
          return {
            r: x,
            g: c,
            b: 0 //  60 - 120  green
          };
        case 2:
          return {
            r: 0,
            g: c,
            b: x // 120 - 180  green
          };
        case 3:
          return {
            r: 0,
            g: x,
            b: c // 180 - 240  blue
          };
        case 4:
          return {
            r: x,
            g: 0,
            b: c // 240 - 300  blue
          };
        case 5:
          return {
            r: c,
            g: 0,
            b: x // 300 - 360  red
          };
      }
    })();
    return this.round(rgb, 100, add);
  }

  // Standalone since HSV is not detected by @rgb( arg )
  rgbHsl(H, s, l) {
    var f, h, i, p, q, rgb, t, v;
    h = H;
    i = Math.floor(h / 60);
    f = h / 60 - i;
    p = l * (1 - s);
    q = l * (1 - f * s);
    t = l * (1 - (1 - f) * s);
    v = l;
    rgb = (function() {
      switch (i % 6) {
        case 0:
          return {
            r: v,
            g: t,
            b: p
          };
        case 1:
          return {
            r: q,
            g: v,
            b: p
          };
        case 2:
          return {
            r: p,
            g: v,
            b: t
          };
        case 3:
          return {
            r: p,
            g: q,
            b: v
          };
        case 4:
          return {
            r: t,
            g: p,
            b: v
          };
        case 5:
          return {
            r: v,
            g: p,
            b: q
          };
      }
    })();
    return this.round(rgb, 255);
  }

  sigmoidal(x, k, x0 = 0.5, L = 1) {
    return L / (1 + Math.exp(-k * (x - x0)));
  }

  interpolateRgb(rgb1, r1, rgb2, r2) {
    return {
      r: rgb1.r * r1 + rgb2.r * r2,
      g: rgb1.g * r1 + rgb2.g * r2,
      b: rgb1.b * r1 + rgb2.b * r2
    };
  }

  hue(pageKey, isRYGB) {
    var toRYGB;
    toRYGB = function(rygb, rgb) {
      if (isRYGB) {
        return rygb;
      } else {
        return rgb;
      }
    };
    switch (pageKey) {
      case 'Red':
        return 0;
      case 'Orange':
        return toRYGB(45, 30);
      case 'Yellow':
        return toRYGB(90, 60);
      case 'Lime':
        return toRYGB(135, 90);
      case 'Green':
        return toRYGB(180, 120);
      case 'Teal':
        return toRYGB(203, 150);
      case 'Cyan':
        return toRYGB(225, 180);
      case 'Blue':
        return toRYGB(270, 240);
      case 'Magenta':
        return toRYGB(315, 300);
      default:
        console.log('Vis.hue() unknown pageKey', pageKey);
        return 0;
    }
  }

  lookUpSat(sat) {
    var idx, len, val;
    boundMethodCheck(this, Vis);
    len = this.distribution10s.length;
    idx = this.distribution10s.indexOf(sat);
    val = 0 <= idx && idx < len ? this.distributionPri[idx] : 100;
    if (this.debug) {
      console.log("Vis.lookUpSat(sat)", {
        sat: sat,
        idx: idx,
        val: val
      });
    }
    return val;
  }

  even(val) {
    boundMethodCheck(this, Vis);
    return val;
  }

  distribution(func = this.even, interval = 10, min = 0, max = 100) {
    var array, j, ref, ref1, ref2, val;
    boundMethodCheck(this, Vis);
    array = [];
    for (val = j = ref = min, ref1 = max, ref2 = interval; ref2 !== 0 && (ref2 > 0 ? j <= ref1 : j >= ref1); val = j += ref2) {
      array.push(func(val));
    }
    return array;
  }

  // --- Degrees and Radians ---
  //  The svg functions deal with the svg convention where the y 90 degree axis points down
  rad(deg) {
    return deg * Math.PI / 180;
  }

  deg(rad) {
    return rad * 180 / Math.PI;
  }

  sin(deg) {
    return Math.sin(this.rad(deg));
  }

  cos(deg) {
    return Math.cos(this.rad(deg));
  }

  abs(val) {
    return Math.abs(val);
  }

  max(...args) {
    return Math.max(args);
  }

  min(...args) {
    return Math.min(args);
  }

  rot(deg, ang) {
    var a;
    a = deg + ang;
    if (a < 0) {
      a = a + 360;
    }
    return a;
  }

  svgDeg(deg) {
    return 360 - deg;
  }

  svgRad(rad) {
    return 2 * Math.PI - rad;
  }

  radSvg(deg) {
    return this.rad(360 - deg);
  }

  degSvg(rad) {
    return this.deg(2 * Math.PI - rad);
  }

  sinSvg(deg) {
    return Math.sin(this.radSvg(deg));
  }

  cosSvg(deg) {
    return Math.cos(this.radSvg(deg));
  }

  // --- Math Utilities ---
  floor(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.floor(x / dr) * dr;
  }

  ceil(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.ceil(x / dr) * dr;
  }

  isZero(v) {
    return -0.01 < v && v < 0.01;
  }

  within(min, val, max) {
    return min <= val && val <= max; // Closed interval with <=
  }

  hasGlobal(global, issue = true) {
    var has;
    has = window[global] != null;
    if (!has && issue) {
      console.error(`Vis.hasGlobal() ${global} not present`);
    }
    return has;
  }

  getGlobal(global, issue = true) {
    if (this.hasGlobal(global, issue)) {
      return window[global];
    } else {
      return null;
    }
  }

  ready(fn) {
    switch (fn) {
      case !this.isFunction(fn): // Sanity check
        return;
      case this.skipReady:
        fn();
        break;
      case document.readyState === 'complete':
        fn(); // If document is already loaded, run method
        break;
      default:
        document.addEventListener('DOMContentLoaded', fn, false);
    }
  }

  getHtmlId(name, type = '', ext = '') {
    var id;
    id = name + type + ext + this.uniqueIdExt;
    return id.replace(/[ \.]/g, "");
  }

  cssNameType(name, type = '') {
    return name + type;
  }

  // --- Css Transforms ---  
  translate(x0, y0) {
    if (this.isInTypeKeyArgs('number', x0, y0)) {
      return ` translate( ${x0}, ${y0} )`;
    } else {
      // toWarn(...)
      return ` translate( ${0}, ${0} )`;
    }
  }

  scale(sx, sy) {
    if (this.isInTypeKeyArgs('number', sx, sy)) {
      return ` s( ${sx}, ${sy} )`;
    } else {
      // toWarn(...)
      return ` s( ${1}, ${1} )`;
    }
  }

  rotate(a, x, y) {
    if (this.isInTypeKeyArgs('number', a, x, y)) {
      return ` rotate(${a} ${x} ${y} )`;
    } else {
      // toWarn(...)
      return ` rotate(${0} ${0} ${0} )`;
    }
  }

  translateScale(x0, y0, sx, sy) {
    if (this.isInTypeKeyArgs('number', x0, y0, sx, sy)) {
      return ` translate( ${x0}, ${y0} ) s( ${sx}, ${sy} )`;
    } else {
      // toWarn(...)
      return ` translate( ${0}, ${0} ) s( ${1}, ${1} )`;
    }
  }

  // Font Awesome Unicode lookup
  unicode(icon) {
    var uc;
    uc = FontAwe.icons[icon];
    if (uc == null) {
      console.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
      uc = "\uf111"; // Circle
    }
    return uc;
  }

};

export var vis = new Vis();

/*
  hcl:( arg ) ->
    rgb  = @rgb( arg )
    R = rgb.r
    G = rgb.g
    B = rgb.b
    a   = 3 * ( Math.min(R,G,B) / Math.max(R,G,B) ) / 100
    q    = Math.exp( a )
    h180   = @deg( Math.atan2( G - B, R - G ) )
    H   = if h180 < 0 then 360 + h180 else h180
    C   = q * ( Math.abs(R−G) + Math.abs(G−B) + Math.abs(B−R) ) / 3
    L   = q *Math.max(R,G,B) + (1-q) * Math.min(R, G,B)  / 2
    [ H. C, L ]

HCL
  a   = 3 * ( Min(R,G,B) / Max(R,G,B) ) / 100
  q    = Math.exp( a )
  h180   = @deg( Math.atan2( G − B, R - G ) )
  H   = if h180 < 0 then 360 + h180 else h180
  C   = q * ( Math.abs(R−G) + Math.abs(G−B) + Math.abs(B−R) ) / 3
  L   = q*Math.max(R,G,B) + (1 − q)*Math.mim(R, G,B)  / 2

*/

//# sourceMappingURL=Vis.js.map
