var YAxis;

import {
  Text
} from 'troika-three-text';

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
    var dy, rot, size, y;
    y = cc.ymin;
    dy = (cc.ymax - cc.ymin) * 0.05;
    size = dy * 0.7;
    rot = Math.PI / 6;
    while (y <= cc.xmax) {
      this.content.drawLine(cc.xmin, y, cc.zmax, cc.xmin, y, cc.zmax + dy, 0xFFFFFF, group);
      this.drawText(y.toString(), size, [cc.xmin, y + dy * 0.5, cc.zmax + dy * 2.2], [rot, rot, rot], 0xFFFFFF, group);
      y += cc.ytick1;
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

export default YAxis;

//# sourceMappingURL=YAxis.js.map
