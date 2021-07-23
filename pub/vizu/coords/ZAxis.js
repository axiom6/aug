var ZAxis;

import {
  Group
} from 'three';

import Text from './Text.js';

ZAxis = class ZAxis {
  constructor(main, content) {
    var cc;
    this.main = main;
    this.content = content;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    this.group = new Group();
    this.content.drawLine(cc.xmin, cc.ymin, cc.zmin, cc.xmin, cc.ymin, cc.zmax, 'blue', this.group);
    this.annotate(cc, this.group);
    this.main.addToScene(this.group);
    this.main.log(this.klass + '()', this);
  }

  annotate(cc, group) {
    var dy, results, rot, size, text, z;
    text = new Text(this.main);
    z = cc.zmin + cc.ztick1;
    dy = (cc.ymax - cc.ymin) * 0.05;
    size = dy * 0.5;
    rot = Math.PI / 6;
    results = [];
    while (z <= cc.zmax) {
      this.content.drawLine(cc.xmin, cc.ymax, z, cc.xmin, cc.ymax + dy, z, 0xAAAAAA, group);
      text.drawText(z.toString(), size, [cc.xmin, cc.ymax + dy, z], [rot, rot, rot], 0xAAAAAA, group);
      results.push(z += cc.ztick1);
    }
    return results;
  }

};

export default ZAxis;

//# sourceMappingURL=ZAxis.js.map
