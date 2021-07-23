var Plane;

import {
  PlaneGeometry,
  MeshPhongMaterial,
  DoubleSide,
  Mesh
} from 'three';

Plane = class Plane {
  constructor(main, group, orient) {
    var cc, planeGeo, planeMat;
    this.main = main;
    this.group = group;
    this.klass = this.constructor.name;
    cc = this.main.cartesian;
    planeGeo = new PlaneGeometry(cc.xd, cc.yd);
    planeMat = new MeshPhongMaterial({
      side: DoubleSide,
      color: cc.hex(orient)
    });
    this.mesh = new Mesh(planeGeo, planeMat);
    if (orient === 'XZ') {
      this.mesh.rotation.set(cc.rad(90), 0, 0);
    }
    if (orient === 'YZ') {
      this.mesh.rotation.set(0, cc.rad(90), 0);
    }
    if (orient === 'XY') {
      this.mesh.position.set(cc.xc, cc.yc, cc.zmin);
    }
    if (orient === 'XZ') {
      this.mesh.position.set(cc.xc, cc.ymin, cc.zc);
    }
    if (orient === 'YZ') {
      this.mesh.position.set(cc.xmin, cc.yc, cc.zc);
    }
    this.group.add(this.mesh);
    this.main.log(this.klass + '()', this);
  }

};

export default Plane;

//# sourceMappingURL=Plane.js.map
