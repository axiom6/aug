var XAxis;

import {
  Group
} from 'three';

import {
  Text
} from 'troika-three-text';

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
    var dy, rot, size, x;
    x = cc.xmin;
    dy = (cc.xmax - cc.xmin) * 0.03;
    size = dy * 0.75;
    rot = Math.PI / 6;
    while (x <= cc.xmax) {
      this.content.drawLine(x, cc.ymax, cc.zmin, x, cc.ymax + dy, cc.zmin, 0xFFFFFF, group);
      this.drawText(x.toString(), size, [x - dy * 0.5, cc.ymax + dy * 1.75, cc.zmin], [0, rot, 0], 0xFFFFFF, group);
      x += cc.xtick1;
    }
  }

  drawText(str, size, [x, y, z], [rx, ry, rz], color, group) {
    var text;
    text = new Text();
    text.text = str;
    text.fontSize = size;
    text.align = "center";
    text.position.x = x;
    text.position.y = y;
    text.position.z = z;
    text.rotateX(rx);
    text.rotateY(ry);
    text.rotateZ(rz);
    text.color = color;
    text.sync();
    group.add(text);
  }

};

export default XAxis;

//# sourceMappingURL=XAxis.js.map
