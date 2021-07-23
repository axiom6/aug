var XAxis;

import {
  Group
} from 'three';

import Text from './Text.js';

XAxis = class XAxis {
  constructor(main, content) {
    var cc;
    this.main = main;
    this.content = content;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    this.group = new Group();
    this.content.drawLine(cc.xmin, cc.ymin, cc.zmin, cc.xmax, cc.ymin, cc.zmin, 'blue', this.group);
    this.annotate(cc, this.group);
    this.main.addToScene(this.group);
    this.main.log(this.klass + '()', this);
  }

  annotate(cc, group) {
    var dy, rot, size, text, x;
    text = new Text(this.main);
    x = cc.xmin;
    dy = (cc.xmax - cc.xmin) * 0.05;
    size = dy * 0.5;
    rot = Math.PI / 6;
    while (x <= cc.xmax) {
      this.content.drawLine(x, cc.ymax, cc.zmin, x, cc.ymax + dy, cc.zmin, 0xAAAAAA, group);
      text.drawText(x.toString(), size, [x, cc.ymax + dy, cc.zmin], [rot, rot, 0], 0xAAAAAA, group);
      x += cc.xtick1;
    }
  }

};

export default XAxis;

//# sourceMappingURL=XAxis.js.map
