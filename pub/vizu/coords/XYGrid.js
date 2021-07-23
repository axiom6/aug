var XYGrid;

import {
  Group
} from 'three';

import Plane from './Plane.js';

XYGrid = class XYGrid {
  constructor(main, content) {
    var cc, plane;
    this.main = main;
    this.content = content;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    this.group = new Group();
    this.drawXLines(cc, 0x666666, 0x333333, this.group); // @drawXLines( cc, 0xAAAAAA, 0x666666, @group )
    this.drawYLines(cc, 0x666666, 0x333333, this.group); // @drawYLines( cc, 0xAAAAAA, 0x666666, @group )
    plane = new Plane(this.main, this.group, 'XY');
    plane.mesh.receiveShadow = true;
    this.group.receiveShadow = true;
    this.main.addToScene(this.group);
    this.main.log(this.klass + '()', this);
  }

  drawXLines(cc, color1, color2, group) {
    var results, y;
    y = cc.ymin;
    while (y <= cc.ymax) {
      this.content.drawLine(cc.xmin, y, cc.zmin, cc.xmax, y, cc.zmin, color2, group);
      y += cc.ytick2;
    }
    y = cc.ymin;
    results = [];
    while (y <= cc.ymax) {
      this.content.drawLine(cc.xmin, y, cc.zmin, cc.xmax, y, cc.zmin, color1, group);
      results.push(y += cc.ytick1);
    }
    return results;
  }

  drawYLines(cc, color1, color2, group) {
    var results, x;
    x = cc.xmin;
    while (x <= cc.xmax) {
      this.content.drawLine(x, cc.ymin, 0, x, cc.ymax, 0, color2, group);
      x += cc.xtick2;
    }
    x = cc.xmin;
    results = [];
    while (x <= cc.xmax) {
      this.content.drawLine(x, cc.ymin, 0, x, cc.ymax, 0, color1, group);
      results.push(x += cc.xtick1);
    }
    return results;
  }

};

export default XYGrid;

//# sourceMappingURL=XYGrid.js.map
