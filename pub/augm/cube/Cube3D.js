var Cube3D;

import Vis from '../../../lib/pub/draw/Vis.js';

import * as THREE from 'three';

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
    box = new THREE.BoxBufferGeometry();
    box.name = this.title;
    Cube3D.matrix.makeScale(this.whd[0], this.whd[1], this.whd[2]);
    box.applyMatrix(Cube3D.matrix);
    Cube3D.matrix.makeTranslation(this.xyz[0], this.xyz[1], this.xyz[2]);
    box.applyMatrix(Cube3D.matrix);
    hex = Vis.hex(this.hsv);
    col = new THREE.Color(hex); // blemding:THREE
    mat = new THREE.MeshPhongMaterial({
      color: col,
      opacity: this.opacity,
      transparent: true,
      side: THREE.BackSide
    });
    this.mesh = new THREE.Mesh(box, mat);
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
    text = new THREE.TextBufferGeometry(name, obj);
    text.computeBoundingBox();
    face = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    side = new THREE.MeshBasicMaterial({
      color: 0xffffff
    });
    mats = [face, side];
    dx = 0.5 * (text.boundingBox.max.x - text.boundingBox.min.x);
    dy = 0.5 * (text.boundingBox.max.y - text.boundingBox.min.y);
    Cube3D.matrix.makeTranslation(this.xyz[0] - dx, this.xyz[1] - dy, this.xyz[2]);
    text.applyMatrix(Cube3D.matrix);
    this.tmesh = new THREE.Mesh(text, mats);
    this.tmesh.name = this.title;
    this.tmesh.geom = "Text";
    this.tmesh.plane = this.plane;
    this.tmesh.row = this.row;
    this.tmesh.col = this.col;
    this.mesh.add(this.tmesh);
  }

  colorRgb(rgb) {
    return `rgb(${Math.round(rgb[0] * 255)}, ${Math.round(rgb[1] * 255)}, ${Math.round(rgb[2] * 255)})`;
  }

};

//mat = new THREE.MeshPhongMaterial( { color:col, opacity:@opacity, transparent:true, side:THREE.BackSide, blemding:THREE.AdditiveBlending } )
//mat = new THREE.MeshBasicMaterial( { color:col, opacity:@opacity, transparent:true } ) # blemding:THREE.AdditiveBlending
Cube3D.matrix = new THREE.Matrix4();

export default Cube3D;

//# sourceMappingURL=Cube3D.js.map
