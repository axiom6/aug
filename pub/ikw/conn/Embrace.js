var Embrace,
  hasProp = {}.hasOwnProperty;

import Vis from "../../base/util/Vis.js";

Embrace = class Embrace {
  constructor(spec, shapes, build) {
    this.drawSvg = this.drawSvg.bind(this);
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.innovs = this.build.adjacentStudies(this.spec, 'east');
  }

  drawSvg(g, size, defs) {
    var a, a1, fill, h, i, key, lay, ref, ref1, ref2, ref3, study, w, wedgeId, x, xr, xt, y, yi, yl, yr, yt;
    lay = this.shapes.layout(size, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.innovs));
    fill = this.shapes.toFill(this.spec, true);
    this.shapes.keyHole(g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke);
    yl = lay.yl;
    a1 = lay.a1;
    xr = lay.xr + lay.wr;
    yr = lay.yr;
    ref = this.studies;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      study = ref[key];
      fill = this.shapes.toFill(study);
      wedgeId = this.shapes.htmlId(study.name, 'Wedge');
      this.shapes.wedge(g, lay.ro, lay.rs, a1, a1 - lay.da, lay.xc, lay.yc, fill, study.name, wedgeId, size.dispSize, size.level);
      for (a = i = ref1 = a1 - lay.li, ref2 = a1 - lay.da, ref3 = -lay.ds; ref3 !== 0 && (ref3 > 0 ? i < ref2 : i > ref2); a = i += ref3) {
        this.shapes.link(g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick);
        yl += lay.dl;
      }
      a1 -= lay.da;
      yr += lay.hr;
    }
    x = lay.xr + lay.wr;
    y = lay.yr;
    w = lay.w - x;
    h = lay.ri;
    xt = x + w * 0.5;
    yt = size.yc * 0.5 - size.bannDy;
    yi = size.yc + size.iconDy;
    // console.log( 'Embrace.drawSvg()', @level, yt, yi )
    this.shapes.conveySankey("Embrace", defs, g, this.studies, this.innovs, x, y, w, h);
    this.shapes.icon(g, size.xc, yi, this.spec.name, this.shapes.htmlId(this.spec.name, 'IconSvg'), 'black', size.iconSize, Vis.unicode(this.spec.icon));
    this.shapes.text(g, xt, yt, this.spec.name, this.shapes.htmlId(this.spec.name, 'TextSvg'), 'black', size.bannSize);
    this.shapes.practiceFlow(g, size, this.spec);
  }

  // Not called but matches innovation
  innovateStudies(g, size) {
    var fill, h, innov, key, r0, ref, w, x0, y0;
    r0 = size.xc / 2 - 36;
    w = 24;
    h = r0 / this.shapes.size(this.innovs);
    x0 = size.w - w;
    y0 = size.yc - r0 / 2;
    ref = this.innovs;
    for (key in ref) {
      if (!hasProp.call(ref, key)) continue;
      innov = ref[key];
      fill = this.shapes.toFill(innov);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

};

export default Embrace;
