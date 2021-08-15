var Hexagon,
  boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

import * as THREE from "three";

import Surface from "./Surface.js";

import {
  vis
} from "../../../lib/pub/draw/Vis.js";

Hexagon = class Hexagon extends Surface {
  constructor(main) {
    super(main);
    this.animateSpheres = this.animateSpheres.bind(this);
    this.main.hexagon = this;
  }

  toGeom(obj) {
    var angle, radius, x, y;
    this.obj = obj;
    vis.smooth = true;
    obj.valFun = function(hue, sat) {
      return 100;
    };
    obj.colors = [];
    obj.vertices = [];
    obj.normals = [];
    obj.uvs = [];
    obj.indices = [];
    obj.hexIndices = new Array(7);
    obj.vertex = new THREE.Vector3();
    obj.normal = new THREE.Vector3();
    obj.uv = new THREE.Vector2();
    obj.sc = 1.0 / 255.0;
    obj.hueNum = 12;
    obj.satNum = 10;
    obj.hueInc = 360 / obj.hueNum;
    obj.huePri = obj.hueInc * 2;
    obj.satInc = 100 / obj.satNum;
    obj.priRadius = 10;
    obj.secRadius = obj.priRadius * vis.cos(30);
    obj.idxOrigin = 0;
    obj.x0 = 0;
    obj.y0 = 0;
    obj.z0 = 0;
    this.initSpheres(obj);
    obj.idxOrigin = this.addVertex(obj, 0, 0, obj.valFun(0, 0), obj.x0, obj.z0, obj.z0); // Origin
    x = obj.priRadius * 4.5;
    y = obj.secRadius;
    angle = vis.atan2(y, x);
    radius = vis.hypoth(y, x);
    if (obj.hexOrient === 30) {
      this.hexVertices(obj, 30, obj.idxOrigin);
      this.sixHexes(obj, 60, obj.secRadius * 2.0, 0);
      this.sixHexes(obj, 30, obj.priRadius * 3.0, 0);
      this.sixHexes(obj, 60, obj.secRadius * 4.0, 0);
      this.sixHexes(obj, 30, radius, -angle);
      this.sixHexes(obj, 30, radius, angle);
      this.sixHexes(obj, 60, obj.secRadius * 6.0, 0);
    } else if (obj.hexOrient === 60) {
      this.hexVertices(obj, 60, obj.idxOrigin);
      this.sixHexes(obj, 30, obj.secRadius * 2.0, 0);
      this.sixHexes(obj, 60, obj.priRadius * 3.0, 0);
      this.sixHexes(obj, 30, obj.secRadius * 4.0, 0);
      this.sixHexes(obj, 60, radius, -angle);
      this.sixHexes(obj, 60, radius, angle);
      this.sixHexes(obj, 30, obj.secRadius * 6.0, 0);
    }
    this.createBufferGeometry(obj);
    this.drawCircle(obj.priRadius * 5.0);
    this.pallettes(obj, false);
    this.main.log("Hexagon.toGeom()", {
      lenVertices: obj.vertices.length,
      lenIndices: obj.indices.length,
      vertices: obj.vertices,
      indices: obj.indices
    });
  }

  hexAngles(orient) {
    if (orient === 60) {
      return [0, 60, 120, 180, 240, 300];
    } else {
      return [330, 30, 90, 150, 210, 270];
    }
  }

  sixHexes(obj, orient, radius, angOffset) {
    this.calcVertices(obj, orient, 0, radius, angOffset, true);
  }

  hexVertices(obj, orient, idxCen) {
    this.calcVertices(obj, orient, idxCen, obj.priRadius, 0, false);
    this.hexIndices(obj);
  }

  calcVertices(obj, orient, idxCen, radius, angOffset, callHexVertices) {
    var ang, ang1, hue, hyp, i, j, len, ref, results, sat, val, vs, x, y, z;
    i = 1;
    vs = obj.vertices;
    obj.hexIndices[0] = idxCen;
    ref = this.hexAngles(orient);
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      ang1 = ref[j];
      ang = ang1 + angOffset;
      x = vs[3 * idxCen] + radius * vis.cos(ang);
      y = vs[3 * idxCen + 1] + radius * vis.sin(ang);
      z = vs[3 * idxCen + 2];
      hue = vis.hueZX(y, x);
      hyp = vis.hypoth(y, x);
      sat = this.adjSat(obj, hue, hyp);
      val = obj.valFun(hue, sat);
      obj.hexIndices[i] = this.addVertex(obj, hue, sat, val, x, y, z);
      if (callHexVertices) {
        this.hexVertices(obj, obj.hexOrient, obj.hexIndices[i]);
      }
      this.main.log("Hexagon.calcVertices", {
        idx: obj.hexIndices[i],
        ang1: ang1,
        ang: ang,
        angOffset: angOffset,
        radius: radius,
        hyp: hyp,
        hue: hue,
        sat: sat,
        val: val,
        x: x,
        y: y,
        z: z
      });
      results.push(i++);
    }
    return results;
  }

  adjSat(obj, hue, hyp) {
    return vis.round(hyp * 2.0);
  }

  hexIndices(obj) {
    var a;
    a = obj.hexIndices;
    this.addIndice(obj, a[0], a[1], a[2]);
    this.addIndice(obj, a[0], a[2], a[3]);
    this.addIndice(obj, a[0], a[3], a[4]);
    this.addIndice(obj, a[0], a[4], a[5]);
    this.addIndice(obj, a[0], a[5], a[6]);
    this.addIndice(obj, a[0], a[6], a[1]);
  }

  addIndice(obj, i1, i2, i3) {
    obj.indices.push(i1, i2, i3);
  }

  drawCircle(radius) {
    var circle, geometry, material;
    geometry = new THREE.CircleGeometry(radius, 24);
    //eometry.rotateX( Math.PI / 2 )
    geometry.translate(0, 0, 0);
    material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 1.0,
      wireframe: true
    });
    circle = new THREE.Mesh(geometry, material);
    this.main.addToScene(circle);
  }

  pallettes(obj, ysv = false) {
    var p;
    p = {};
    p.ysv = ysv;
    p.i = 0;
    p.sc = 1.0 / 255.0;
    p.hueInc = p.ysv ? 45 : 60;
    p.satInc = obj.hexOrient === 30 ? 100 / 6 : 20;
    p.satNum = obj.hexOrient === 30 ? 7 : 6;
    p.radius = obj.hexOrient === 30 ? obj.secRadius * 0.06 : obj.priRadius * 0.05;
    p.count = (360 / p.hueInc) * p.satNum * (100 / 10 + 1);
    this.main.log("Hexagon.pallettes()", {
      orient: obj.hexOrient,
      satInc: p.satInc,
      satNum: p.satNum,
      radius: p.radius,
      count: p.count
    });
    p.geometry = new THREE.SphereGeometry(2, 16, 16);
    p.material = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.FrontSide
    });
    p.inMesh = new THREE.InstancedMesh(p.geometry, p.material, p.count);
    p.matrix = new THREE.Matrix4();
    p.color = new THREE.Color();
    p.group = new THREE.Group();
    this.pallettePoints(p);
    p.group.add(p.inMesh);
    this.main.addToScene(p.group);
    this.main.log('Hexagon.pallettes()', {
      i: p.i,
      count: p.count
    });
  }

  pallettePoints(p) {
    var h, hsv, j, ref, results, rgb, s, v, x, y, z;
    results = [];
    for (h = j = 0, ref = p.hueInc; ref !== 0 && (ref > 0 ? j < 360 : j > 360); h = j += ref) {
      results.push((function() {
        var k, ref1, results1;
        results1 = [];
        for (s = k = 0, ref1 = p.satInc; ref1 !== 0 && (ref1 > 0 ? k <= 101 : k >= 101); s = k += ref1) {
          results1.push((function() {
            var l, results2;
            results2 = [];
            for (v = l = 0; l < 100; v = l += 10) {
              x = vis.cos(h) * s * p.radius;
              y = vis.sin(h) * s * p.radius;
              z = v * p.radius;
              p.matrix.setPosition(x, y, z);
              hsv = p.ysv ? [h, s, 100 - v, "HMI"] : [h, s, 100 - v, "HMIR"];
              rgb = vis.rgb(hsv);
              p.color.setRGB(rgb.r * p.sc, rgb.g * p.sc, rgb.b * p.sc);
              p.inMesh.setMatrixAt(p.i, p.matrix);
              p.inMesh.setColorAt(p.i, p.color);
              this.main.log('Hexagon.pallettes()', {
                h: h,
                s: s,
                v: v,
                rgb: rgb
              });
              results2.push(p.i++);
            }
            return results2;
          }).call(this));
        }
        return results1;
      }).call(this));
    }
    return results;
  }

  animateSpheres(timer) {
    var count, i, j, obj, pc, position, ref, rgb, rrgb;
    boundMethodCheck(this, Hexagon);
    obj = this.obj;
    count = 0;
    for (i = j = 0, ref = obj.sphereIndex; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      obj.sphereMesh.getMatrixAt(i, obj.sphereMatrix);
      obj.sphereMesh.getColorAt(i, obj.sphereColor);
      position = new THREE.Vector3();
      position.setFromMatrixPosition(obj.sphereMatrix);
      rgb = obj.sphereColor.toArray();
      pc = 0.5 - 0.5 * vis.sin(12 * (position.x + position.y + timer));
      obj.sphereMatrix.setPosition(position.x, position.y, position.z * pc);
      obj.sphereColor.setRGB(rgb[0] * pc, rgb[1] * pc, rgb[2] * pc);
      count++;
      if (count % 100 === 0) {
        rrgb = vis.roundRGB(rgb, 255);
        console.log("Hexagon.animateSpheres()", {
          pc: pc,
          position: position,
          rgb: rrgb
        });
      }
    }
  }

};

// console.log( "Hexagon.animateSpheres()" )
export default Hexagon;

//# sourceMappingURL=Hexagon.js.map
