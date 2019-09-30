var Encourage;

import Vis from "../../base/util/Vis.js";

Encourage = class Encourage {
  constructor(spec, shapes, build, level) {
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.level = level;
    this.studies = this.shapes.arrange(this.spec);
    this.innovs = this.build.adjacentStudies(this.spec, 'west');
  }

  drawSvg(g, size, defs) {
    var a, a1, fill, h, i, key, lay, r0, ref, ref1, ref2, ref3, study, w, wedgeId, x, xr, xt, y, yi, yl, yr, yt;
    lay = this.shapes.layout(size, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.innovs));
    fill = this.shapes.toFill(this.spec, true);
    this.shapes.keyHole(g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke);
    yl = lay.yl;
    a1 = lay.a1;
    xr = lay.xr + lay.wr;
    yr = lay.yr;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      wedgeId = this.shapes.htmlId(study.name, 'Wedge');
      this.shapes.wedge(g, lay.ro, lay.rs, a1, a1 - lay.da, lay.xc, lay.yc, fill, study.name, wedgeId, size.dispSize);
      for (a = i = ref1 = a1 - lay.li, ref2 = a1 - lay.da, ref3 = -lay.ds; ref3 !== 0 && (ref3 > 0 ? i < ref2 : i > ref2); a = i += ref3) {
        this.shapes.link(g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick);
        yl += lay.dl;
      }
      a1 -= lay.da;
      yr += lay.hr;
    }
    //@innovateStudies( g, lay )
    x = 0; // lay.xr+lay.wr
    r0 = lay.ri; // size.x0/2 - 36
    y = size.yc - r0 / 2; // lay.yr
    w = lay.xr + lay.wr;
    h = r0; // lay.ri
    xt = x + w * 0.5;
    yt = size.yc * 0.5 - (this.level === 'Comp' ? 6 : 0);
    yi = size.yc - size.iconDy;
    this.shapes.conveySankey("Encourage", defs, g, this.studies, this.innovs, x, y, w, h);
    this.shapes.icon(g, size.xc, yi, this.spec.name, this.shapes.htmlId(this.spec.name, 'IconSvg'), Vis.unicode(this.spec.icon), size.iconSize);
    this.shapes.text(g, xt, yt, this.spec.name, this.shapes.htmlId(this.spec.name, 'TextSvg'), 'black', size.fontSize);
    this.shapes.practiceFlow(g, size, this.spec);
  }

  // Not called but matches Sankey
  innovateStudies(g, lay) {
    var fill, innov, key, ref, yi;
    yi = lay.yi;
    ref = this.innovs;
    for (key in ref) {
      innov = ref[key];
      fill = this.shapes.toFill(innov);
      this.shapes.rect(g, lay.xi, yi, lay.wi, lay.hi, fill, lay.stroke);
      yi += lay.hi;
    }
  }

};

export default Encourage;
