var Innovate;

import * as d3 from '../../lib/d3/d3.5.9.0.esm.js';

import Util from '../util/Util.js';

import Vis from '../util/Vis.js';

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
    this.colorRing = Vis.toRgbHsvStr([90, 55, 90]);
    this.colorBack = 'rgba(97, 56, 77, 1.0 )';
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
    this.shapes.rect(g, 20, 24, 120, 44, this.colorBack, 'none', 1.0, this.spec.name, '2em');
  }

  concept(g, geom) {
    var t, t1, t2, t3, t4;
    t = 0;
    t1 = 0;
    t2 = 0;
    t3 = 0;
    t4 = 0;
    [t, t1, t2, t3, t4] = [this.t, this.t, this.t * 2, this.t * 4, this.t * 2];
    this.shapes.round(g, t, t1, geom.w - t * 2, geom.h - t4, t, t, this.colorRing, 'none');
    this.shapes.round(g, t * 2, t2, geom.w - t * 4, geom.h - t3, t, t, this.colorBack, 'none');
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
  }

  // "ArchitectEngineerConstruct":{"dir":"pradd","icon":"fa-university","hsv":[ 30,60,90]}
  technology(g, geom) {
    var t, t1, t2, t3, t4, xt, yt;
    t = 0;
    t1 = 0;
    t2 = 0;
    t3 = 0;
    t4 = 0;
    [t, t1, t2, t3, t4] = [this.t, this.t, this.t * 2, this.t * 4, this.t * 2];
    this.shapes.round(g, t, t1, geom.w - t * 2, geom.h - t4, t, t, this.colorRing, 'none');
    this.shapes.round(g, t * 2, t2, geom.w - t * 4, geom.h - t3, t, t, this.colorBack, 'none');
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.northInovate(g, geom, function(study) {
      return study.dir !== 'south';
    });
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
    if (this.spec.name === 'OpenSource') {
      xt = geom.x0 - 65;
      yt = geom.y0 - geom.h * 0.455;
      this.shapes.rect(g, xt, yt, 150, this.t, 'none', 'none', "Architect Engineer Construct", 0.75);
    }
  }

  facilitate(g, geom) {
    var t, t1, t2, t3, t4;
    t = 0;
    t1 = 0;
    t2 = 0;
    t3 = 0;
    t4 = 0;
    [t, t1, t2, t3, t4] = [this.t, this.t, this.t * 2, this.t * 4, this.t * 2];
    this.shapes.round(g, t, t1, geom.w - t * 2, geom.h - t4, t, t, this.colorRing, 'none');
    this.shapes.round(g, t * 2, t2, geom.w - t * 4, geom.h - t3, t, t, this.colorBack, 'none');
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
    path = g.append("svg:text").text(text).attr("id", textId).attr("x", x0).attr("y", y0 + 16).attr("text-anchor", "middle").attr("font-size", "2.0vh").attr("font-family", this.shapes.fontText).attr("font-weight", "bold");
    this.shapes.click(path, text);
  }

  hexIcon(icon, g, x0, y0, iconId) {
    g.append("svg:text").text(icon).attr("x", x0).attr("y", y0 - 2).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", "3.0vh").attr("font-family", "FontAwesome");
  }

};

/*

x0y0:( j, i, r, x0, y0 ) ->
dx = @r * 1.5
dy = @r * 2.0 * @cos30
yh = if j % 2 is 0 then 0 else  @r*@cos30
x  =  j*dx + x0
y  = -i*dy + y0 + yh
[x,y]

 * Not used but good example
hexLoc:( g, id, j,i, r, fill, text="", icon="" ) ->
[x0,y0] = @x0y0( j, i, @r, @x0, @y0 )
@hexPath( fill, g, x0, y0, id )
@hexText( text, g, x0, y0, id ) if Util.isStr(text)
@hexIcon( icon, g, x0, y0, id ) if Util.isStr(icon)
{ x0, y0, r }

hexPos:( dir ) ->
@hexPosTier(dir) # if @spec.svg? and @spec.svg is 'Data' then @hexPosData(dir) else @hexPosTier(dir)
return

hexPosData:( dir ) ->
switch dir
when 'west'           then [-1,   0.0]
when 'westd'          then [-2,   0.0]
when 'north','northd' then [ 0,   0.0]
when 'east'           then [ 1,   0.0]
when 'eastd'          then [ 2,   0.0]
when 'south','southd' then [ 0,   0.0]
when 'nw',   'nwd'    then [-1,   1.0]
when 'ne',   'ned'    then [ 1,   1.0]
when 'sw'             then [-1,   0.0]
when 'swd'            then [-1,   0.0]
when 'se'             then [ 1,   0.0]
when 'sed'            then [ 1,   0.0]
else
  console.error( 'Innovate.hexPos() unknown dir', dir, 'returning [0, 0.5] for Service' )
  [0, 0.5]

 * Not working in v4
hexPathV3:( fill, g, x0, y0, pathId ) ->
@xh = x0
@yh = y0
g.append("svg:path").data(@angs).attr("id", pathId ).attr( "d", @line(@angs) )
.attr("stroke-width", @thick ).attr("stroke", @stroke ).attr("fill", fill )
return
 */
export default Innovate;
