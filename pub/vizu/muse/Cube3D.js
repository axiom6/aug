var Cube3D;

import {
  vis
} from '../../lib/pub/base/draw/Vis.js';

import {
  BoxBufferGeometry,
  Color,
  MeshPhongMaterial,
  Mesh,
  TextBufferGeometry,
  MeshBasicMaterial,
  Matrix4,
  BackSide
} from 'three';

Cube3D = class Cube3D {
  constructor(plane, row, col1, title, xyz, whd, hsv, opacity, font) {
    var box, col, dx, dy, face, hex, mat, mats, name, obj, side, text;
    this.plane = plane;
    this.row = row;
    this.col = col1;
    this.title = title;
    this.xyz = xyz;
    this.whd = whd;
    this.hsv = hsv;
    this.opacity = opacity;
    this.font = font;
    box = new BoxBufferGeometry();
    box.name = this.title;
    Cube3D.matrix.makeScale(this.whd[0], this.whd[1], this.whd[2]);
    box.applyMatrix4(Cube3D.matrix);
    Cube3D.matrix.makeTranslation(this.xyz[0], this.xyz[1], this.xyz[2]);
    box.applyMatrix4(Cube3D.matrix);
    hex = vis.hex(this.hsv, 'ysv');
    col = new Color(hex); // blemding:THREE
    mat = new MeshPhongMaterial({
      color: col,
      opacity: this.opacity,
      transparent: true,
      side: BackSide
    });
    this.mesh = new Mesh(box, mat);
    this.mesh.name = this.title;
    this.mesh.geom = "Cube";
    this.mesh.plane = this.plane;
    this.mesh.row = this.row;
    this.mesh.col = this.col;
    obj = {
      font: this.font,
      size: 12,
      height: 6,
      curveSegments: 2
    };
    name = this.plane === 'Cols' ? "" : this.title;
    text = new TextBufferGeometry(name, obj);
    text.computeBoundingBox();
    face = new MeshBasicMaterial({
      color: 0xffffff
    });
    side = new MeshBasicMaterial({
      color: 0xffffff
    });
    mats = [face, side];
    dx = 0.5 * (text.boundingBox.max.x - text.boundingBox.min.x);
    dy = 0.5 * (text.boundingBox.max.y - text.boundingBox.min.y);
    Cube3D.matrix.makeTranslation(this.xyz[0] - dx, this.xyz[1] - dy, this.xyz[2]);
    text.applyMatrix4(Cube3D.matrix);
    this.tmesh = new Mesh(text, mats);
    this.tmesh.name = this.title;
    this.tmesh.geom = "Text";
    this.tmesh.plane = this.plane;
    this.tmesh.row = this.row;
    this.tmesh.col = this.col;
    this.mesh.add(this.tmesh);
  }

};

//mat = new MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:BackSide, blemding:AdditiveBlending } )
//mat = new MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true } ) # blemding:AdditiveBlending
Cube3D.matrix = new Matrix4();

export default Cube3D;

//# sourceMappingURL=Cube3D.js.map
