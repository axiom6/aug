var XZGrid;

import {
  Group
} from 'three';

import Plane from './Plane.js';

XZGrid = class XZGrid {
  constructor(main, content) {
    var cc, plane;
    this.main = main;
    this.content = content;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    this.group = new Group();
    this.drawXLines(cc, 0xAAAAAA, 0x666666, this.group);
    this.drawZLines(cc, 0xAAAAAA, 0x666666, this.group);
    plane = new Plane(this.main, this.group, 'XZ');
    plane.mesh.receiveShadow = true;
    this.group.receiveShadow = true;
    this.main.addToScene(this.group);
    this.main.log(this.klass + '()', this);
  }

  drawXLines(cc, color1, color2, group) {
    var results, z;
    z = cc.zmin;
    while (z <= cc.zmax) {
      this.content.drawLine(cc.xmin, cc.ymin, z, cc.xmax, cc.ymin, z, color2, group);
      z += cc.ztick2;
    }
    z = cc.zmin;
    results = [];
    while (z <= cc.zmax) {
      this.content.drawLine(cc.xmin, cc.ymin, z, cc.xmax, cc.ymin, z, color1, group);
      results.push(z += cc.ztick1);
    }
    return results;
  }

  drawZLines(cc, color1, color2, group) {
    var results, x;
    x = cc.xmin;
    while (x <= cc.xmax) {
      this.content.drawLine(x, cc.ymin, cc.zmin, x, cc.ymin, cc.zmax, color2, group);
      x += cc.xtick2;
    }
    x = cc.xmin;
    results = [];
    while (x <= cc.xmax) {
      this.content.drawLine(x, cc.ymin, cc.zmin, x, cc.ymin, cc.zmax, color1, group);
      results.push(x += cc.xtick1);
    }
    return results;
  }

};

export default XZGrid;

//# sourceMappingURL=XZGrid.js.map
