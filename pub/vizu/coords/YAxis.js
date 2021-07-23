var YAxis;

import Text from './Text.js';

import {
  Group
} from 'three';

YAxis = class YAxis {
  constructor(main, content) {
    var cc;
    this.main = main;
    this.content = content;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    this.group = new Group();
    this.content.drawLine(cc.xmin, cc.ymin, cc.zmin, cc.xmin, cc.ymax, cc.zmin, 'blue', this.group);
    this.annotate(cc, this.group);
    this.main.addToScene(this.group);
    this.main.log(this.klass + '()', this);
  }

  annotate(cc, group) {
    var dy, rot, size, text, y;
    text = new Text(this.main);
    y = cc.ymin;
    dy = (cc.ymax - cc.ymin) * 0.05;
    size = dy * 0.5;
    rot = Math.PI / 6;
    while (y <= cc.xmax) {
      this.content.drawLine(cc.xmin, y, cc.zmax, cc.xmin, y, cc.zmax + dy, 0xAAAAAA, group);
      text.drawText(y.toString(), size, [cc.xmin, y, cc.zmax + dy], [rot, rot, rot], 0xAAAAAA, group);
      y += cc.ytick1;
    }
  }

};

export default YAxis;

//# sourceMappingURL=YAxis.js.map
