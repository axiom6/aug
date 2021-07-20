var Vis;

import Util from '../util/Util.js';

import {
  tester
} from '../test/tester.js';

import FontAwe from './FontAwe.js';

Vis = (function() {
  class Vis {
    
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
    static rgb(arg) {
      var isRYGB, rgb;
      rgb = {
        r: 255,
        g: 255,
        b: 255,
        a: 1.0 // default is white with alpha = 1.0 opaque
      };
      if (tester.isObject(arg)) {
        rgb = arg;
        rgb.a = arg.a != null ? arg.a : 1.0;
      } else if (tester.isArray(arg)) {
        isRYGB = arg.length === 3; // 3 implies RYGB hue while 4 implies RGB hue
        rgb = Vis.rgbHsv(arg[0], arg[1], arg[2], isRYGB);
        rgb.a = arg.length === 4 ? arg[3] : 1.0;
        if (this.debug) {
          console.log('Vis.rgb()', {
            arg: arg,
            rgb: rgb,
            isRYGB: isRYGB
          });
        }
      } else if (tester.isNumber(arg)) {
        rgb = {
          r: (arg & 0xFF0000) >> 16,
          g: (arg & 0x00FF00) >> 8,
          b: arg & 0x0000FF
        };
        rgb.a = 1.0;
      }
      return Vis.round(rgb);
    }

    // Returns an rgb array with an alpha or full opacity of 1
    static rgba(arg) {
      var rgb;
      rgb = Vis.rgb(arg);
      return [
        rgb.r,
        rgb.g,
        rgb.b,
        rgb.a // Vis.rgb( arg ) always returns an a: or alpha
      ];
    }

    
      // Returns a number that is interpreted as hex like 0xFFFFFF
    //   Recommended for most libraries like Three.js
    static hex(arg) {
      var rgb;
      rgb = Vis.rgb(arg);
      return rgb.r * 65536 + rgb.g * 256 + rgb.b; // 65536 is 16 to the fourth power and 256 is 16 squared
    }

    
      // Returns a number in hex format like '0xFFFFFF'. Go for debugging
    static str(arg) {
      var rgb, str;
      rgb = Vis.rgb(arg);
      str = '0x';
      str += rgb.r === 0 ? '00' : Vis.strHex(rgb.r);
      str += rgb.g === 0 ? '00' : Vis.strHex(rgb.g);
      str += rgb.b === 0 ? '00' : Vis.strHex(rgb.b);
      return str;
    }

    // returns a css string in rgb format
    static css(arg) {
      var rgb;
      rgb = Vis.rgb(arg);
      return `rgba(${rgb.r},${rgb.g},${rgb.b},${rgb.a})`;
    }

    // Returns hsv when toRYGB=false or ysv when toRYGB=true
    static cyl(arg, toRYGB = false) {
      var B, G, H, R, a, b, g, h, r, rgb, s, sum, v;
      rgb = Vis.rgb(arg);
      R = rgb.r;
      G = rgb.g;
      B = rgb.b;
      sum = R + G + B;
      r = R / sum;
      g = G / sum;
      b = B / sum;
      v = sum / 3;
      s = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
      a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
      h = b <= g ? a : 360 - a;
      if (s === 0) {
        h = 0;
      }
      H = toRYGB ? Vis.rygbHue(h) : h;
      return [H, s * 100, v / 2.55];
    }

    static hsv(arg) {
      return Vis.cyl(arg, false);
    }

    // Returns an  array with hue in rygb coords
    // RYGB red=0deg, yellow=90deg green=180deg and blue=270deg
    static ysv(arg) {
      return Vis.cyl(arg, true);
    }

    /*
    @hcl:( arg ) ->
      rgb  = Vis.rgb( arg )
      R = rgb.r
      G = rgb.g
      B = rgb.b
      a   = 3 * ( Math.min(R,G,B) / Math.max(R,G,B) ) / 100
      q    = Math.exp( a )
      h180   = Vis.deg( Math.atan2( G - B, R - G ) )
      H   = if h180 < 0 then 360 + h180 else h180
      C   = q * ( Math.abs(R−G) + Math.abs(G−B) + Math.abs(B−R) ) / 3
      L   = q *Math.max(R,G,B) + (1-q) * Math.min(R, G,B)  / 2
      [ H. C, L ]
    */
    // Need to chech output format
    static sphere(hue, phi, rad) {
      return Vis.rgba([Vis.rot(hue, 90), 100 * Vis.sin(phi), 100 * rad]);
    }

    static strHex(num) {
      return num.toString(16).toUpperCase(); // Uses ` ` to fake out CoffeeScript code inspector
    }

    
      // Rounds and scales rgb value to ints between 0 to 255
    static round(rgb, scale = 1) {
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
    static rgbHue(rygbHue) {
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
    static rygbHue(rgbHue) {
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
    static rgbHsv(H, S, V, isRYGB) {
      var c, d, f, h, i, rgb, x, y, z;
      h = isRYGB ? Vis.rgbHue(H) : H;
      d = S * 0.01;
      c = d; // 1.0 # Vis.sigmoidal( d, 2, 0.25 )
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
      return Vis.round(rgb, 255 * V / 100);
    }

    // Standalone since HSV is not detected by Vis.rgb( arg )
    static rgbHsl(H, s, l, isRYGB) {
      var f, h, i, p, q, rgb, t, v;
      h = isRYGB ? Vis.rgbHue(H) : H;
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
      return Vis.round(rgb, 255);
    }

    static sigmoidal(x, k, x0 = 0.5, L = 1) {
      return L / (1 + Math.exp(-k * (x - x0)));
    }

    static interpolateRgb(rgb1, r1, rgb2, r2) {
      return {
        r: rgb1.r * r1 + rgb2.r * r2,
        g: rgb1.g * r1 + rgb2.g * r2,
        b: rgb1.b * r1 + rgb2.b * r2
      };
    }

    // --- Degrees and Radians ---
    //  The svg functions deal with the svg convention where the y 90 degree axis points down
    static rad(deg) {
      return deg * Math.PI / 180;
    }

    static deg(rad) {
      return rad * 180 / Math.PI;
    }

    static sin(deg) {
      return Math.sin(Vis.rad(deg));
    }

    static cos(deg) {
      return Math.cos(Vis.rad(deg));
    }

    static rot(deg, ang) {
      var a;
      a = deg + ang;
      if (a < 0) {
        a = a + 360;
      }
      return a;
    }

    static svgDeg(deg) {
      return 360 - deg;
    }

    static svgRad(rad) {
      return 2 * Math.PI - rad;
    }

    static radSvg(deg) {
      return Vis.rad(360 - deg);
    }

    static degSvg(rad) {
      return Vis.deg(2 * Math.PI - rad);
    }

    static sinSvg(deg) {
      return Math.sin(Vis.radSvg(deg));
    }

    static cosSvg(deg) {
      return Math.cos(Vis.radSvg(deg));
    }

    // --- Math Utilities ---
    static floor(x, dx) {
      var dr;
      dr = Math.round(dx);
      return Math.floor(x / dr) * dr;
    }

    static ceil(x, dx) {
      var dr;
      dr = Math.round(dx);
      return Math.ceil(x / dr) * dr;
    }

    static within(beg, deg, end) {
      return beg <= deg && deg <= end; // Closed interval with <=
    }

    static isZero(v) {
      return -0.01 < v && v < 0.01;
    }

    static inStr(s, e) {
      return tester.inStr(s, e);
    }

    static isChild(key) {
      return tester.isChild(key);
    }

    static isFunction(f) {
      return tester.isFunction(f);
    }

    static toInt(arg) {
      return tester.toInt(arg);
    }

    static toFixed(arg, dec) {
      return tester.toInt(arg, dec);
    }

    static toArray(arg) {
      return tester.toArray(arg);
    }

    static noop(...args) {
      return tester.noop(args);
    }

    static hasGlobal(global, issue = true) {
      var has;
      has = window[global] != null;
      if (!has && issue) {
        console.error(`Vis.hasGlobal() ${global} not present`);
      }
      return has;
    }

    static getGlobal(global, issue = true) {
      if (Vis.hasGlobal(global, issue)) {
        return window[global];
      } else {
        return null;
      }
    }

    static ready(fn) {
      switch (fn) {
        case !this.isFunction(fn): // Sanity check
          return;
        case Vis.skipReady:
          fn();
          break;
        case document.readyState === 'complete':
          fn(); // If document is already loaded, run method
          break;
        default:
          document.addEventListener('DOMContentLoaded', fn, false);
      }
    }

    static getHtmlId(name, type = '', ext = '') {
      var id;
      id = name + type + ext + Vis['uniqueIdExt'];
      return id.replace(/[ \.]/g, "");
    }

    static cssNameType(name, type = '') {
      return name + type;
    }

    // --- Css Transforms ---  
    static translate(x0, y0) {
      Util.checkTypes('number', {
        x0: x0,
        y0: y0
      });
      return ` translate( ${x0}, ${y0} )`;
    }

    static scale(sx, sy) {
      Util.checkTypes('number', {
        sx: sx,
        sy: sy
      });
      return ` s( ${sx}, ${sy} )`;
    }

    static rotate(a, x, y) {
      Util.checkTypes('number', {
        a: a,
        x: x,
        y: y
      });
      return ` rotate(${a} ${x} ${y} )`;
    }

    static translateScale(x0, y0, sx, sy) {
      Util.checkTypes('number', {
        x0: x0,
        y0: y0
      });
      Util.checkTypes('number', {
        sx: sx,
        sy: sy
      });
      return ` translate( ${x0}, ${y0} ) s( ${sx}, ${sy} )`;
    }

    // Font Awesome Unicode lookup
    static unicode(icon) {
      var uc;
      uc = FontAwe.icons[icon];
      if (uc == null) {
        console.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
        uc = "\uf111"; // Circle
      }
      return uc;
    }

  };

  Vis.debug = false;

  return Vis;

}).call(this);

Vis.skipReady = false;

Vis.time = 0;

Util.uniqueIdExt = '';

export default Vis;

/*  HCL
  a   = 3 * ( Min(R,G,B) / Max(R,G,B) ) / 100
  q    = Math.exp( a )
  h180   = Vis.deg( Math.atan2( G − B, R - G ) )
  H   = if h180 < 0 then 360 + h180 else h180
  C   = q * ( Math.abs(R−G) + Math.abs(G−B) + Math.abs(B−R) ) / 3
  L   = q*Math.max(R,G,B) + (1 − q)*Math.mim(R, G,B)  / 2

*/

//# sourceMappingURL=Vis.js.map
