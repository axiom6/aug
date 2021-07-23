var Rect3D;

import Util from '../../../lib/pub/util/Util.js';

import {
  vis
} from '../../../lib/pub/draw/Vis.js';

import {
  PlaneGeometry,
  Color,
  MeshBasicMaterial,
  Mesh,
  TextBufferGeometry,
  Matrix4,
  DoubleSide
} from 'three';

Rect3D = class Rect3D {
  constructor(plane, row, col1, title, xyz, wh, hsv, opacity, font, fontColor) {
    var col, dx, dy, face, hex, mat, mats, obj, offsetY, rec, side, text;
    this.plane = plane;
    this.row = row;
    this.col = col1;
    this.title = title;
    this.xyz = xyz;
    this.wh = wh;
    this.hsv = hsv;
    this.opacity = opacity;
    this.font = font;
    this.fontColor = fontColor;
    rec = new PlaneGeometry(this.wh[0], this.wh[1]);
    rec.translate(this.xyz[0], this.xyz[1], this.xyz[2]);
    hex = vis.hex(this.hsv, 'ysv');
    col = new Color(hex);
    mat = new MeshBasicMaterial({
      color: col,
      opacity: this.opacity,
      transparent: true,
      side: DoubleSide
    });
    this.mesh = new Mesh(rec, mat);
    this.mesh.name = this.title;
    this.mesh.geom = "Rect";
    this.mesh.plane = this.plane;
    this.mesh.row = this.row;
    this.mesh.col = this.col;
    obj = {
      font: this.font,
      size: 10,
      height: 5,
      curveSegments: 2
    };
    text = new TextBufferGeometry(this.title, obj);
    text.computeBoundingBox();
    face = new MeshBasicMaterial({
      color: this.fontColor
    });
    side = new MeshBasicMaterial({
      color: this.fontColor
    });
    mats = [face, side];
    offsetY = !Util.inString(this.title, '\n');
    dx = 0.5 * (text.boundingBox.max.x - text.boundingBox.min.x);
    dy = offsetY ? 0.5 * (text.boundingBox.max.y - text.boundingBox.min.y) : 0;
    Rect3D.matrix.makeTranslation(this.xyz[0] - dx, this.xyz[1] - dy, this.xyz[2]);
    text.applyMatrix4(Rect3D.matrix);
    this.tmesh = new Mesh(text, mats);
    this.tmesh.name = this.title;
    this.tmesh.geom = "Text";
    this.tmesh.plane = this.plane;
    this.tmesh.row = this.row;
    this.tmesh.col = this.col;
    this.mesh.add(this.tmesh);
  }

};

Rect3D.matrix = new Matrix4();

export default Rect3D;

//# sourceMappingURL=Rect3D.js.map
