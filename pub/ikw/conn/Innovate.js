var Innovate;

import * as d3 from '../../../pub/lib/d3/d3.5.9.0.esm.js';

import Util from '../../bas/util/Util.js';

import Vis from '../../bas/util/Vis.js';

Innovate = class Innovate {
  constructor(spec, shapes, build) {
    this.hexStudy = this.hexStudy.bind(this);
    this.line = this.line.bind(this);
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.cos30 = this.shapes.cos30;
    this.t = 24;
    this.xh = 0;
    this.yh = 0;
    this.r = 0;
    this.thick = 1;
    this.stroke = 'black';
  }

  drawSvg(g, geom, defs) {
    var key, ref, study;
    Util.noop(defs);
    this.lay = this.shapes.layout(geom, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.studies));
    this.rings(g, geom, this.t);
    switch (this.spec.row) {
      case 'Learn':
        this.concept(g, geom);
        break;
      case 'Do':
        this.technology(g, geom);
        break;
      case 'Share':
        this.facilitate(g, geom);
        break;
      default:
        this.technology(g, geom); // Default for group spec
    }
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      this.hexStudy(g, geom, study);
    }
  }

  rings(g, geom, t) {
    var colorBack, colorRing;
    colorRing = Vis.toRgbHsvStr([70, 55, 70]);
    colorBack = 'rgba(97, 56, 77, 1.0 )';
    this.shapes.round(g, t, t, geom.w - t * 2, geom.h - t * 2, t, t, colorRing, 'none');
    this.shapes.round(g, t * 2.5, t * 2.5, geom.w - t * 5.0, geom.h - t * 5.0, t, t, colorBack, 'none');
    return this.shapes.text(g, t * 4, t * 2 + 2, this.spec.name, this.spec.name + 'Text', 'black', '1.8em');
  }

  concept(g, geom) {
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
  }

  // "ArchitectEngineerConstruct":{"dir":"pradd","icon":"fa-university","hsv":[ 30,60,90]}
  technology(g, geom) {
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.northInovate(g, geom, function(study) {
      return study.dir !== 'south';
    });
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
  }

  facilitate(g, geom) {
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.northInovate(g, geom);
  }

  westInovate(g, geom) {
    var fill, h, key, r0, ref, study, w, x0, y0;
    r0 = this.lay.ri; // geom.x0/2 - 36
    w = 24;
    h = r0 / this.shapes.size(this.studies);
    x0 = geom.w - w;
    y0 = geom.y0 - r0 / 2;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  eastInovate(g, geom) {
    var fill, h, key, r0, ref, study, w, x0, y0;
    r0 = this.lay.ri; // geom.x0/2 - 36
    w = 24;
    h = r0 / this.shapes.size(this.studies);
    x0 = 0;
    y0 = geom.y0 - r0 / 2;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  northInovate(g, geom) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = 18;
    h = 24;
    dx = geom.r * 1.5;
    x0 = geom.x0 - dx - w / 2;
    y0 = 0;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  southInovate(g, geom) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = 18;
    h = 24;
    dx = geom.r * 1.5;
    x0 = geom.x0 - dx - w / 2;
    y0 = geom.h - h;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  hexStudy(g, geom, study) {
    var dx, dy, fill, i, j, uc, x, x0, y, y0, yh;
    this.r = geom.r;
    dx = this.r * 1.5;
    dy = this.r * 2.0 * this.cos30;
    x0 = geom.x0;
    y0 = geom.y0; // - 26
    j = 0;
    i = 0;
    [j, i] = this.hexPosTier(study.dir);
    yh = j % 2 === 0 ? 0 : this.r * this.cos30;
    x = j * dx + x0;
    y = -i * dy + y0 + yh;
    fill = this.shapes.toFill(study);
    uc = Vis.unicode(study.icon);
    // console.log( 'Innovate.hexStudy()', study.icon, uc )
    this.hexPath(fill, g, x, y, this.shapes.htmlId(study.name, 'HexPath'));
    this.hexText(study.name, g, x, y, this.shapes.htmlId(study.name, 'HexText'));
    this.hexIcon(uc, g, x, y, this.shapes.htmlId(study.name, 'HexIcon'));
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

  hexText(text, g, x0, y0, textId) {
    var path;
    path = g.append("svg:text").text(text).attr("id", textId).attr("x", x0).attr("y", y0 + 16).attr("text-anchor", "middle").attr("font-size", "0.9em").attr("font-family", this.shapes.fontText);
    //.attr("font-weight","bold")
    this.shapes.click(path, text);
  }

  hexIcon(icon, g, x0, y0, iconId) {
    g.append("svg:text").text(icon).attr("x", x0).attr("y", y0 - 2).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", "1.5em").attr("font-family", "FontAwesome").attr("font-weight", "normal");
  }

};

export default Innovate;
