var Cartesian;

import {
  Color
} from 'three';

import {
  vis
} from '../../../lib/pub/draw/Vis.js';

Cartesian = class Cartesian {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.opts = this.main.opts;
    this.aspect = this.main.aspectRatio;
    this.xmin = this.opts.xmin != null ? this.opts.xmin != null : 0;
    this.xmax = this.opts.xmax != null ? this.opts.xmax != null : 100;
    this.ymin = this.opts.ymin != null ? this.opts.ymin != null : 0;
    this.ymax = this.opts.ymax != null ? this.opts.ymax != null : 100;
    this.zmin = this.opts.zmin != null ? this.opts.zmin != null : 0;
    this.zmax = this.opts.zmax != null ? this.opts.zmax != null : 100;
    this.dist = this.opts.dist != null ? this.opts.dist != null : 100;
    this.xd = this.xmax - this.xmin;
    this.yd = this.ymax - this.ymin;
    this.zd = this.zmax - this.zmin;
    this.xc = this.xd * 0.5;
    this.yc = this.yd * 0.5;
    this.zc = this.zd * 0.5;
    this.xtick1 = this.opts.xtick1 != null ? this.opts.xtick1 != null : this.xd * 0.10;
    this.xtick2 = this.opts.xtick2 != null ? this.opts.xtick2 != null : this.xd * 0.01;
    this.ytick1 = this.opts.ytick1 != null ? this.opts.ytick1 != null : this.yd * 0.10;
    this.ytick2 = this.opts.ytick2 != null ? this.opts.ytick2 != null : this.yd * 0.01;
    this.ztick1 = this.opts.ztick1 != null ? this.opts.ztick1 != null : this.zd * 0.10;
    this.ztick2 = this.opts.ztick2 != null ? this.opts.ztick2 != null : this.zd * 0.01;
    this.main.log(this.klass + '()', this);
  }

  hex(orient) {
    switch (orient) {
      case 'XY':
        return new Color(0x880F0F);
      case 'XZ':
        return new Color(0x0F880F);
      case 'YZ':
        return new Color(0x0F0F88);
      default:
        return new Color(0x888888);
    }
  }

  hex2(orient) {
    switch (orient) {
      case 'XY':
        return vis.hex([60, 30, 40]);
      case 'XZ':
        return vis.hex([150, 90, 90]);
      case 'YZ':
        return vis.hex([270, 90, 90]);
      default:
        return vis.hex([330, 90, 90]);
    }
  }

  rad(deg) {
    return vis.rad(deg);
  }

};

export default Cartesian;

// str = "rgb(#{Math.round(rgb[0]*255)}, #{Math.round(rgb[1]*255)}, #{Math.round(rgb[2]*255)})"

//# sourceMappingURL=Cartesian.js.map
