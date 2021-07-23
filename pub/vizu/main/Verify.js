var Verify;

Verify = class Verify {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.opts = this.main.opts;
  }

  verify(object3D) {
    var i, klass, len, n, names, obj, prop, props, v;
    klass = object3D.constructor.name;
    props = [
      "rotation",
      "scale",
      "matrix" // "matrixWorld","modelViewMatrix","normalMatrix","quaternion"]
    ];
    names = ["elements", "x", "_x", "y", "_y", "z", "_z", "w", "_w"];
    this.verifyPosition(klass, object3D.position);
    this.verifyMatrix(klass, object3D.matrix);
// p = object3D.position
// console.log( 'Main.verify()', { class:klass, position:p, matrix:object3D.matrix, x:p.x, y:p.y, z:p.z } )
    for (i = 0, len = props.length; i < len; i++) {
      prop = props[i];
      obj = object3D[prop];
      for (n in obj) {
        v = obj[n];
        if (this.mix.inArray(n, names)) {
          if ((!this.mix.isArray(v) && isNaN(v)) || (n === 'elements' && this.arrayHasNaN(v))) {
            console.log('Main.verify() NaN ', {
              class: klass,
              prop: prop,
              type: obj,
              n: n,
              v: v
            });
          }
        }
      }
    }
  }

  verifyPosition(klass, p) {
    if (isNaN(p.x) || isNaN(p.y) || isNaN(p.z)) {
      console.log('Main.verifyPosition() NaN ', {
        class: klass,
        position: p
      });
    }
  }

  // p.set( p.x, p.y, p.z )
  verifyMatrix(klass, m) {
    if (m.elements.includes(0/0)) {
      console.log('Main.verifyMatrix() NaN ', {
        class: klass,
        matrix: m
      });
    }
  }

  // midentity()
  arrayHasNaN(array) {
    var e, i, len;
    if (!this.mix.isArray(array)) {
      return;
    }
    for (i = 0, len = array.length; i < len; i++) {
      e = array[i];
      if (isNaN(e)) {
        return true;
      }
    }
    return false;
  }

};

export default Verify;

//# sourceMappingURL=Verify.js.map
