var Hexagon;

import * as THREE from "three";

import {
  vis
} from "../../../lib/pub/draw/Vis.js";

Hexagon = class Hexagon {
  constructor(main) {
    this.animate = this.animate.bind(this);
    this.main = main;
    this.main.hexagon = this;
  }

  drawHsv(orient) {
    var obj;
    obj = {};
    obj.hexOrient = orient;
    obj.group = new THREE.Group();
    this.toGeom(obj);
    this.main.addToScene(obj.group);
    this.main.addToScene(obj.sphereGroup);
    this.main.log('Heagon.drawHsv()', obj);
  }

  toGeom(obj) {
    var angle, radius, x, y;
    this.obj = obj;
    vis.smooth = true;
    obj.valFun = function(hue, sat) {
      return 100 * vis.sin(90 * (1.0 - sat * 0.01));
    };
    obj.valBase = 100;
    obj.val = obj.valBase;
    obj.animateOn = true;
    obj.animateDebug = false;
    obj.animateCount = 0;
    obj.colors = [];
    obj.vertices = [];
    obj.normals = [];
    obj.uvs = [];
    obj.indices = [];
    obj.vertexCount = 0;
    obj.indiceCount = 0;
    obj.vertexGeom = null;
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
    this.applyValues(obj);
    console.log("Hexagon.toGeom()", {
      vertexLength: obj.vertices.length,
      vertexCount: obj.vertexCount,
      indiceKength: obj.indices.length,
      indiceCount: obj.indiceCount,
      sphereCountCalc: obj.sphereCountCalc,
      vertices: obj.vertices
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

  // valRadius from @pallettePoints()
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
      hue = vis.hueZX(y, x);
      hyp = vis.hypoth(y, x);
      sat = this.adjSat(obj, hue, hyp);
      val = obj.valBase;
      z = vs[3 * idxCen + 2];
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
    obj.indiceCount++;
  }

  addVertex(obj, hue, sat, val, x, y, z) {
    var index, rgb;
    index = this.vertexIndexXYZ(obj, x, y, z);
    if (index === -1) {
      index = this.vertexIndex(obj);
      rgb = vis.rgb([hue, sat, val, "HMIR"]);
      obj.colors.push(rgb.r * obj.sc, rgb.g * obj.sc, rgb.b * obj.sc);
      obj.vertex.x = x;
      obj.vertex.y = y;
      obj.vertex.z = z;
      obj.vertices.push(obj.vertex.x, obj.vertex.y, obj.vertex.z);
      obj.normal.copy(obj.vertex).normalize();
      obj.normals.push(obj.normal.x, obj.normal.y, obj.normal.z);
      obj.uv.x = hue / obj.hueInc / obj.hueNum;
      obj.uv.y = sat / obj.satInc / obj.satNum;
      obj.uvs.push(obj.uv.x, obj.uv.y);
      this.addSphere(obj, rgb, x, y, z);
      obj.vertexCount++;
    }
    this.main.log("Surface.addVertex()", {
      index: index,
      hue: hue,
      sat: sat,
      val: val,
      x: x,
      y: y,
      z: z
    });
    return index;
  }

  vertexIndex(obj) {
    return obj.vertices.length / 3;
  }

  vertexIndexXYZ(obj, x, y, z) {
    var i, j, ref, vs;
    vs = obj.vertices;
    for (i = j = 0, ref = vs.length; j < ref; i = j += 3) {
      if (vis.isCoord(x, vs[i], y, vs[i + 1], z, vs[i + 2])) {
        return i / 3;
      }
    }
    return -1;
  }

  addSphere(obj, rgb, x, y, z) {
    obj.sphereMatrix.setPosition(x, y, z);
    obj.sphereColor.setRGB(rgb.r * obj.sc, rgb.g * obj.sc, rgb.b * obj.sc);
    obj.sphereMesh.setMatrixAt(this.vertexIndex(obj), obj.sphereMatrix);
    obj.sphereMesh.setColorAt(this.vertexIndex(obj), obj.sphereColor);
  }

  createBufferGeometry(obj) {
    var geomMesh, vertMat, wireMat, wireMesh;
    obj.vertexGeometry = new THREE.BufferGeometry();
    obj.vertexGeometry.setIndex(obj.indices);
    this.updateVertexGeometry(obj);
    vertMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors
    });
    geomMesh = new THREE.Mesh(obj.vertexGeometry, vertMat);
    wireMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x000000
    });
    wireMesh = new THREE.Mesh(obj.vertexGeometry, wireMat);
    geomMesh.add(wireMesh);
    obj.group.add(geomMesh);
  }

  updateVertexGeometry(obj) {
    obj.vertexGeometry.setAttribute('position', new THREE.Float32BufferAttribute(obj.vertices, 3));
    obj.vertexGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(obj.normals, 3));
    obj.vertexGeometry.setAttribute('uv', new THREE.Float32BufferAttribute(obj.uvs, 2));
    obj.vertexGeometry.setAttribute('color', new THREE.Float32BufferAttribute(obj.colors, 3));
  }

  initSpheres(obj) {
    var radius;
    radius = 2;
    obj.sphereCountCalc = obj.hueNum * (obj.satNum + 1) + 1; // Look into
    obj.sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
    obj.sphereMaterial = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.FrontSide
    });
    obj.sphereMesh = new THREE.InstancedMesh(obj.sphereGeometry, obj.sphereMaterial, obj.sphereCountCalc);
    obj.sphereMatrix = new THREE.Matrix4();
    obj.sphereColor = new THREE.Color();
    obj.sphereGroup = new THREE.Group();
    obj.sphereGroup.add(obj.sphereMesh);
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

  applyValues(obj, val) {
    var fac, i, j, ref, valPercent, vs, z;
    vs = obj.vertices;
    fac = obj.hexOrient === 30 ? obj.secRadius * 0.03 : obj.priRadius * 0.025;
    for (i = j = 0, ref = obj.vertexCount; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      valPercent = (100.0 - val) * 0.01;
      z = val * fac;
      vs[3 * i + 2] = z;
      this.applySphere(obj, i, z, valPercent);
    }
  }

  applySphere(obj, i, z, valPercent) {
    var position, rgb;
    obj.sphereMesh.getMatrixAt(i, obj.sphereMatrix);
    obj.sphereMesh.getColorAt(i, obj.sphereColor);
    position = new THREE.Vector3();
    position.setFromMatrixPosition(obj.sphereMatrix);
    rgb = obj.sphereColor.toArray();
    obj.sphereMatrix.setPosition(position.x, position.y, z);
    obj.sphereColor.setRGB(rgb[0] * valPercent, rgb[1] * valPercent, rgb[2] * valPercent);
    return;
    return {
      needsUpdate: (obj) => {
        obj.vertexGeometry.attributes.position.needsUpdate = true;
        obj.sphereGeometry.attributes.position.needsUpdate = true;
        obj.vertexGeometry.attributes.color.needsUpdate = true;
        //bj.sphereGeometry.attributes.color.needsUpdate = true
        obj.vertexGeometry.computeVertexNormals();
        return obj.sphereGeometry.computeVertexNormals();
      }
    };
  }

  animateLog(obj) {
    var valPercent;
    if (obj.animateDebug && obj.animateCount % 100 === 0) {
      valPercent = obj.val * 0.01;
      console.log("Hexagon.animate()", {
        val: obj.val,
        valPercent: valPercent
      });
      obj.animateCount++;
    }
  }

  animate(timer) {
    var obj;
    vis.noop(timer);
    obj = this.obj;
    obj.val -= 10;
    obj.val = obj.val < 0 ? obj.valBase : obj.val;
    this.applyValues(obj, obj.val);
    this.updateVertexGeometry(obj);
    this.animateLog(obj);
    return;
  }

};

export default Hexagon;

//# sourceMappingURL=Hexagon.js.map
