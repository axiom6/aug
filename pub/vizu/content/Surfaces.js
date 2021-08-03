var Surfaces;

import * as THREE from "three";

Surfaces = class Surfaces {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.main.log(this.klass + '()', this);
  }

  drawRgbs() {
    var b, color, count, func, g, geometry, group, i, inMesh, inc, j, k, material, matrix, num, r, ref, ref1;
    i = 0;
    inc = 32;
    num = 256 / inc;
    count = Math.pow(num, 2);
    func = function(x, y, pt) {
      pt.x = x;
      pt.y = y;
      return pt.z = (x + y) * 0.5;
    };
    geometry = new THREE.ParametricGeometry(func, num, num);
    material = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.FrontSide
    });
    inMesh = new THREE.InstancedMesh(geometry, material, count);
    matrix = new THREE.Matrix4();
    color = new THREE.Color();
    group = new THREE.Group();
    inc = 32;
    for (r = j = 0, ref = inc; ref !== 0 && (ref > 0 ? j <= 256 : j >= 256); r = j += ref) {
      for (g = k = 0, ref1 = inc; ref1 !== 0 && (ref1 > 0 ? k <= 256 : k >= 256); g = k += ref1) {
        b = (r + b) * 0.5;
        matrix.setPosition(r, g, b);
        color.setRGB(r, g, b);
        inMesh.setMatrixAt(i, matrix);
        inMesh.setColorAt(i, color);
        // console.log( 'Content.drawYsv()', { hue:hue, s:s, v:v, rgb:rgb } )
        i++;
      }
    }
    group.add(inMesh);
    this.main.addToScene(group);
    this.main.log('Surface.drawRgbs()', {
      i: i,
      count: count
    });
  }

};

export default Surfaces;

//# sourceMappingURL=Surfaces.js.map
