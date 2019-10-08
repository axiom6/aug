var Innovate;

import * as d3 from '../../../pub/lib/d3/d3.5.9.0.esm.js';

import Util from '../../base/util/Util.js';

import Vis from '../base/Vis.js';

Innovate = class Innovate {
  constructor(spec, shapes, build) {
    this.hexStudy = this.hexStudy.bind(this);
    this.line = this.line.bind(this);
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.cos30 = this.shapes.cos30;
    this.xh = 0;
    this.yh = 0;
    this.r = 0;
    this.thick = 1;
    this.stroke = 'black';
  }

  drawSvg(g, size, defs) {
    var key, ref, study;
    Util.noop(defs);
    this.lay = this.shapes.layout(size, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.studies));
    this.rings(g, size);
    switch (this.spec.row) {
      case 'Dim':
        this.principle(g, size);
        break;
      case 'Learn':
        this.concept(g, size);
        break;
      case 'Do':
        this.technology(g, size);
        break;
      case 'Share':
        this.facilitate(g, size);
        break;
      default:
        this.technology(g, size); // Default for group spec
    }
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      this.hexStudy(g, size, study);
    }
  }

  // getComputedTextLength()
  rings(g, size) {
    var colorBack, colorRing, hr, t, uc, wr, xi, xt, y;
    t = size.ringSize;
    wr = size.level === 'Comp' ? t : 75 * size.scaleFont;
    hr = size.level === 'Comp' ? t : 18 * size.scaleFont;
    xi = size.level === 'Comp' ? t * 1.70 : t * 2.5;
    xt = xi + size.ringIcon * 0.8;
    y = size.level === 'Comp' ? t * 2.1 : 18 * size.scaleFont;
    uc = Vis.unicode(this.spec.icon);
    // console.log( 'Innovate.rings()', { t:t, wr:wr, hr:hr, xt:xt, yt:yt } )
    colorRing = Vis.toRgbHsvStr([70, 55, 70]);
    colorBack = 'rgba(97, 56, 77, 1.0 )';
    this.shapes.round(g, t, t, size.w - t * 2, size.h - t * 2, t, t, colorRing, 'none');
    this.shapes.round(g, t * 2.5, t * 2.5, size.w - t * 5.0, size.h - t * 5.0, t, t, colorBack, 'none');
    this.shapes.rect(g, t, t, wr, hr, colorRing, 'none');
    this.shapes.icon(g, xi, y, this.spec.name, this.spec.name + 'Icon', 'black', size.bannSize, uc);
    return this.shapes.text(g, xt, y, this.spec.name, this.spec.name + 'Text', 'black', size.bannSize, "start");
  }

  principle(g, size) {
    this.eastInovate(g, size);
    this.westInovate(g, size);
  }

  concept(g, size) {
    this.eastInovate(g, size);
    this.westInovate(g, size);
    this.southInovate(g, size, function(study) {
      return study.dir !== 'north';
    });
  }

  // "ArchitectEngineerConstruct":{"dir":"pradd","icon":"fa-university","hsv":[ 30,60,90]}
  technology(g, size) {
    this.eastInovate(g, size);
    this.westInovate(g, size);
    this.northInovate(g, size, function(study) {
      return study.dir !== 'south';
    });
    this.southInovate(g, size, function(study) {
      return study.dir !== 'north';
    });
  }

  facilitate(g, size) {
    this.eastInovate(g, size);
    this.westInovate(g, size);
    this.northInovate(g, size);
  }

  westInovate(g, size) {
    var fill, h, key, ref, study, w, x0, y0;
    w = size.ringSize;
    h = size.level === 'Comp' ? size.ringSize * 0.5 : size.ringSize;
    x0 = size.w - w;
    y0 = size.yc - h * 2; // 4 studies
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  eastInovate(g, size) {
    var fill, h, key, ref, study, w, x0, y0;
    w = size.ringSize;
    h = size.level === 'Comp' ? size.ringSize * 0.5 : size.ringSize;
    x0 = 0;
    y0 = size.yc - h * 2; // 4 studies
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  northInovate(g, size) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = size.level === 'Comp' ? size.ringSize * 0.75 : size.ringSize * 1.25;
    h = size.ringSize;
    dx = size.r * 1.5;
    x0 = size.xc - dx - w / 2;
    y0 = 0;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  southInovate(g, size) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = size.level === 'Comp' ? size.ringSize * 0.75 : size.ringSize * 1.25;
    h = size.ringSize;
    dx = size.r * 1.5;
    x0 = size.xc - dx - w / 2;
    y0 = size.h - h;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  hexStudy(g, size, study) {
    var dx, dy, fill, i, j, uc, x, x0, y, y0, yh, yi, yt;
    this.r = size.r;
    dx = this.r * 1.5;
    dy = this.r * 2.0 * this.cos30;
    x0 = size.xc;
    y0 = size.yc; // - 26
    j = 0;
    i = 0;
    [j, i] = this.hexPosTier(study.dir);
    yh = j % 2 === 0 ? 0 : this.r * this.cos30;
    x = j * dx + x0;
    y = -i * dy + y0 + yh;
    yt = size.level === 'Comp' ? y + 10 : y + 4.5 * size.scaleFont;
    yi = size.level === 'Comp' ? y - 2 : y - 2.0 * size.scaleFont;
    fill = this.shapes.toFill(study);
    uc = Vis.unicode(study.icon);
    // console.log( 'Innovate.hexStudy()', study.icon, uc )
    this.hexPath(fill, g, x, y, this.shapes.htmlId(study.name, 'HexPath'));
    this.hexText(study.name, g, x, yt, this.shapes.htmlId(study.name, 'HexText'), size.dispSize);
    this.hexIcon(uc, g, x, yi, this.shapes.htmlId(study.name, 'HexIcon'), size.dispSize);
  }

  hexPosTier(dir) {
    switch (dir) {
      case 'west':
      case 'westd':
        return [-1, 0.5];
      case 'north':
      case 'northd':
        return [0, 0.5];
      case 'east':
      case 'eastd':
        return [1, 0.5];
      case 'south':
      case 'southd':
        return [0, -0.5];
      case 'nw':
      case 'nwd':
        return [-1, 1.5];
      case 'ne':
      case 'ned':
        return [1, 1.5];
      case 'sw':
      case 'swd':
        return [-1, -0.5];
      case 'se':
      case 'sed':
        return [1, -0.5];
      default:
        console.error('Innovate.hexPos() unknown dir', dir, 'returning [0, 0.5] for Service');
        return [0, 0.5];
    }
  }

  line() {
    return d3.line().x((ang) => {
      return this.r * Vis.cosSvg(ang) + this.xh;
    }).y((ang) => {
      return this.r * Vis.sinSvg(ang) + this.yh;
    });
  }

  hexPath(fill, g, x0, y0, pathId) {
    var ang, k, len, path, ref, xp, yp;
    xp = (ang) => {
      return this.r * Vis.cosSvg(ang) + x0;
    };
    yp = (ang) => {
      return this.r * Vis.sinSvg(ang) + y0;
    };
    path = d3.path();
    path.moveTo(xp(0), yp(0));
    ref = [60, 120, 180, 240, 300, 360];
    for (k = 0, len = ref.length; k < len; k++) {
      ang = ref[k];
      path.lineTo(xp(ang), yp(ang));
    }
    path.closePath();
    // console.log( 'hexPathV4 path', path )
    g.append("svg:path").attr("d", path).attr("id", pathId).attr("stroke-width", this.thick).attr("stroke", this.stroke).attr("fill", fill);
  }

  hexText(text, g, x0, y0, textId, size) {
    var path;
    path = g.append("svg:text").text(text).attr("id", textId).attr("x", x0).attr("y", y0).attr("text-anchor", "middle").attr("font-size", size).attr("font-family", this.shapes.fontText);
    //.attr("font-weight","bold")
    this.shapes.click(path, text);
  }

  hexIcon(icon, g, x0, y0, iconId, size) {
    g.append("svg:text").text(icon).attr("x", x0).attr("y", y0).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", size).attr("font-family", "FontAwesome").attr("font-weight", "normal");
  }

};

export default Innovate;
