var ZAxis;

import {
  Group
} from 'three';

import {
  Text
} from 'troika-three-text';

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
    var dy, results, rot, size, z;
    z = cc.zmin + cc.ztick1;
    dy = (cc.ymax - cc.ymin) * 0.05;
    size = dy * 0.75;
    rot = Math.PI / 6;
    results = [];
    while (z <= cc.zmax) {
      this.content.drawLine(cc.xmin, cc.ymax, z, cc.xmin, cc.ymax + dy, z, 0xFFFFFF, group);
      this.drawText(z.toString(), size, [cc.xmin, cc.ymax + dy * 2, z + dy], [rot, rot, rot], 0xFFFFFF, group);
      results.push(z += cc.ztick1);
    }
    return results;
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
    text.sync();
  }

};

export default ZAxis;

//# sourceMappingURL=ZAxis.js.map
