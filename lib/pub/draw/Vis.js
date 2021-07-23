var Vis;

import Type from '../test/Type.js';

import FontAwe from './FontAwe.js';

Vis = class Vis extends Type {
  constructor() {
    super();
    this.skipReady = false;
    this.time = 0;
    this.uniqueIdExt = '';
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
  rgb(arg) {
    var isRYGB, rgb;
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
      isRYGB = arg.length === 3; // 3 implies RYGB hue while 4 implies RGB hue
      rgb = this.rgbHsv(arg[0], arg[1], arg[2], isRYGB);
      if (arg.length === 4) {
        rgb.a = arg[3];
      }
      if (this.debug) {
        console.log('Vis.rgb()', {
          arg: arg,
          rgb: rgb,
          isRYGB: isRYGB
        });
      }
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
  */
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

  // Rounds and scales rgb value to ints between 0 to 255
  round(rgb, scale = 1) {
    rgb.a = rgb.a != null ? rgb.a : 1.0;
    return {
      r: Math.round(rgb.r * scale),
      g: Math.round(rgb.g * scale),
      b: Math.round(rgb.b * scale),
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

  // toRygb=true is 'ysc' while
  rgbHsv(H, S, V, isRYGB) {
    var c, d, f, h, i, rgb, x, y, z;
    h = isRYGB ? this.rgbHue(H) : H;
    d = S * 0.01;
    c = d; // 1.0 # @sigmoidal( d, 2, 0.25 )
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

  // Standalone since HSV is not detected by @rgb( arg )
  rgbHsl(H, s, l, isRYGB) {
    var f, h, i, p, q, rgb, t, v;
    h = isRYGB ? this.rgbHue(H) : H;
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

/*  HCL
  a   = 3 * ( Min(R,G,B) / Max(R,G,B) ) / 100
  q    = Math.exp( a )
  h180   = @deg( Math.atan2( G − B, R - G ) )
  H   = if h180 < 0 then 360 + h180 else h180
  C   = q * ( Math.abs(R−G) + Math.abs(G−B) + Math.abs(B−R) ) / 3
  L   = q*Math.max(R,G,B) + (1 − q)*Math.mim(R, G,B)  / 2

*/

//# sourceMappingURL=Vis.js.map