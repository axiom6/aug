var YZGrid;

import {
  Group
} from 'three';

import Plane from './Plane.js';

YZGrid = class YZGrid {
  constructor(main, content) {
    var cc, plane;
    this.main = main;
    this.content = content;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    this.group = new Group();
    this.drawYLines(cc, 0xAAAAAA, 0x666666, this.group);
    this.drawZLines(cc, 0xAAAAAA, 0x666666, this.group);
    plane = new Plane(this.main, this.group, 'YZ');
    plane.mesh.receiveShadow = true;
    this.group.receiveShadow = true;
    this.main.addToScene(this.group);
    this.main.log(this.klass + '()', this);
  }

  drawYLines(cc, color1, color2, group) {
    var results, z;
    z = cc.zmin;
    while (z <= cc.zmax) {
      this.content.drawLine(cc.xmin, cc.ymin, z, cc.xmin, cc.ymax, z, color2, group);
      z += cc.ztick2;
    }
    z = cc.zmin;
    results = [];
    while (z <= cc.zmax) {
      this.content.drawLine(cc.xmin, cc.ymin, z, cc.xmin, cc.ymax, z, color1, group);
      results.push(z += cc.ztick1);
    }
    return results;
  }

  drawZLines(cc, color1, color2, group) {
    var results, y;
    y = cc.ymin;
    while (y <= cc.ymax) {
      this.content.drawLine(cc.xmin, y, cc.zmin, cc.xmin, y, cc.zmax, color2, group);
      y += cc.ytick2;
    }
    y = cc.xmin;
    results = [];
    while (y <= cc.ymax) {
      this.content.drawLine(cc.xmin, y, cc.zmin, cc.xmin, y, cc.zmax, color1, group);
      results.push(y += cc.ytick1);
    }
    return results;
  }

};

export default YZGrid;

//# sourceMappingURL=YZGrid.js.map
