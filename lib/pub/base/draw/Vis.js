var Vis;

import Util from '../../base/util/Util.js';

import FontAwe from './FontAwe.js';

Vis = (function() {
  class Vis {
    
      // --- Color ---

      // @rgb is the conversion work horse that is used by the other functions
    // Always returns an rgb object like { r:255, b:255, b:255 } scaled to from 0 to 255
    //   For type equal to 'rgb' their is conditional scaling
    //      scale = 255  implies multiply by 255  for nomalized range 0.0 to   1.0
    //      scale = 2.55 implies multiply by 2,55 for percent   range 0%  to 100%
    //      scale = 1    implies standard  0 to 255 range
    //   For type equal to 'ysv' the ranges are always
    //      hue 360, saturation 100, v for intensity 100
    //      'ysv' uses rygb color system with red=0deg, yellow=90deg green=180deg and blue=270deg
    //      'ysv' is the default type because it provides the best color balance 
    //   For type equal to 'hsv' the ranges are always
    //      hue 360, saturation 100, v for intensity 100
    //      'hsv' has red=0deg, green=120deg and blue=240deg
    //   For type equal to 'hsl' the ranges are always
    //      hue 360, saturation 100, lightness 100
    //      'hsl' has red=0deg, green=120deg and blue=240deg
    static rgb(arg, type = "ysv", scale = 1) {
      var rgb;
      rgb = {
        r: 255,
        g: 255,
        b: 255 // default is white
      };
      if (Util.isArray(arg)) {
        rgb = (function() {
          switch (type) {
            case 'rgb':
              return {
                r: arg[0] * scale,
                g: arg[1] * scale,
                b: arg[2] * scale
              };
            case 'ysv':
              return Vis.rgbHsv(arg[0], arg[1], arg[2], 'ysv');
            case 'hsv':
              return Vis.rgbHsv(arg[0], arg[1], arg[2], 'hsv');
            case 'hsl':
              return Vis.rgbHsl(arg[0], arg[1], arg[2]);
          }
        })();
      } else if (Util.isObj(arg)) {
        rgb = (function() {
          switch (type) {
            case 'rgb':
              return {
                r: arg.r * scale,
                g: arg.g * scale,
                b: arg.b * scale
              };
            case 'ysv':
              return Vis.rgbHsv(arg.h, arg.s, arg.v, 'ysv');
            case 'hsv':
              return Vis.rgbHsv(arg.h, arg.s, arg.v, 'hsv');
            case 'hsl':
              return Vis.rgbHsl(arg.h, arg.s, arg.l);
          }
        })();
      } else if (Util.isNum(arg)) {
        rgb = {
          r: (arg & 0xFF0000) >> 16,
          g: (arg & 0x00FF00) >> 8,
          b: arg & 0x0000FF
        };
      }
      return Vis.round(rgb);
    }

    // Returns an rgb array with an alpha 1
    static rgba(arg, type = "ysv", scale = 1) {
      var rgb;
      rgb = Vis.rgb(arg, type, scale);
      return [rgb.r, rgb.g, rgb.b, 1];
    }

    // Returns a number that is interpreted as hex like 0xFFFFFF
    //   Recommended for most libraries like Three.js
    static hex(arg, type = "rgb", scale = 1) {
      var rgb;
      rgb = Vis.rgb(arg, type, scale);
      return rgb.r * 65536 + rgb.g * 256 + rgb.b; // 65536 is 16 to the fourth power and 256 is 16 squared
    }

    
      // Returns a number in hex format like '0xFFFFFF'. Go for debugging
    static str(arg, type = "ysv", scale = 1) {
      var rgb, str;
      rgb = Vis.rgb(arg, type, scale);
      str = '0x';
      str += rgb.r === 0 ? '00' : Vis.strHex(rgb.r).toUpperCase();
      str += rgb.g === 0 ? '00' : Vis.strHex(rgb.g).toUpperCase();
      str += rgb.b === 0 ? '00' : Vis.strHex(rgb.b).toUpperCase();
      return str;
    }

    // Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100 a special color system
    static hsv(arg, type = "ysv", scale = 1) {
      var B, G, H, R, a, b, c, g, h, r, rgb, s, sum;
      rgb = Vis.rgb(arg, type, scale);
      R = rgb.r;
      G = rgb.g;
      B = rgb.b;
      sum = R + G + B;
      r = R / sum;
      g = G / sum;
      b = B / sum;
      s = sum / 3;
      c = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
      a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
      h = b <= g ? a : 360 - a;
      if (c === 0) {
        h = 0;
      }
      H = type === 'ysc' ? Vis.ysvHue(h) : h;
      return [H, c * 100, s / 2.55];
    }

    // returns a css string in rgb format
    static css(arg, type = "ysv", scale = 1) {
      var rgb;
      rgb = Vis.rgb(arg, type, scale);
      return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
    }

    // Need to chech output format
    static sphere(hue, phi, rad) {
      return Vis.rgba([Vis.rot(hue, 90), 100 * Vis.sin(phi), 100 * rad]);
    }

    static strHex(num) {
      return num.toString(16); // Uses ` ` to fake out CoffeeScript code inspector
    }

    
      // Rounds and scales rgb value to ints between 0 to 255
    static round(rgb, scale = 1) {
      return {
        r: Math.round(rgb.r * scale),
        g: Math.round(rgb.g * scale),
        b: Math.round(rgb.b * scale)
      };
    }

    // Converts hues in 'ysv' RYGB range to 'hsv' and 'hsl' rgb hue
    //   'ysv'       has red=0deg, yellow=90deg green=180deg and blue=270deg
    //   'hsv' 'hsl' has red=0deg,              green=120deg and blue=240deg
    static hsvHue(ysvHue) {
      var hsvHue;
      hsvHue = 0;
      if (0 <= ysvHue && ysvHue < 90) {
        hsvHue = ysvHue * 60 / 90;
      } else if (90 <= ysvHue && ysvHue < 180) {
        hsvHue = 60 + (ysvHue - 90) * 60 / 90;
      } else if (180 <= ysvHue && ysvHue < 270) {
        hsvHue = 120 + (ysvHue - 180) * 120 / 90;
      } else if (270 <= ysvHue && ysvHue < 360) {
        hsvHue = 240 + (ysvHue - 270) * 120 / 90;
      }
      return hsvHue;
    }

    // Converts hues in 'hsv' or 'hsl' RGB hue to 'tsv' RYGB range
    //   'hsv' 'hsl' has red=0deg,              green=120deg and blue=240deg
    //   'ysv'       has red=0deg, yellow=90deg green=180deg and blue=270deg
    static ysvHue(hueHsv) {
      var ysvHue;
      ysvHue = 0;
      if (0 <= hueHsv && hueHsv < 120) {
        ysvHue = hueHsv * 180 / 120;
      } else if (120 <= hueHsv && hueHsv < 240) {
        ysvHue = 180 + (hueHsv - 120) * 180 / 120;
      } else if (240 <= hueHsv && hueHsv < 360) {
        ysvHue = 270 + (hueHsv - 240) * 180 / 120;
      }
      return ysvHue;
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

    // --- Color Utilities ---

      // toRygb=true is 'ysc' while 
    static rgbHsv(H, C, V, hueSys = 'ysv') {
      var c, d, f, h, i, rgb, x, y, z;
      h = hueSys === 'ysv' ? Vis.hsvHue(H) : H;
      d = C * 0.01;
      c = Vis.sigmoidal(d, 2, 0.25);
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
      if (Vis.debug) {
        console.log('Vis.rgbHsv()', {
          rgb: rgb,
          hcv: [H, C, V],
          sys: hueSys
        });
      }
      return Vis.round(rgb, 255 * V / 100);
    }

    static rgbHsl(H, s, l, hueSys = 'ysc') {
      var f, h, i, p, q, rgb, t, v;
      h = hueSys === 'ysv' ? Vis.hsvHue(H) : H;
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

export default Vis;

//# sourceMappingURL=Vis.js.map
