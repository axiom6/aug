var Hexagon;

import * as THREE from "three";

import Surface from "./Surface.js";

import {
  vis
} from "../../../lib/pub/draw/Vis.js";

Hexagon = class Hexagon extends Surface {
  constructor(main) {
    super(main);
  }

  toGeom(obj) {
    vis.smooth = true;
    obj.colors = [];
    obj.vertices = [];
    obj.normals = [];
    obj.uvs = [];
    obj.indices = [];
    obj.hexIndices = new Array(7);
    obj.hexOrient = 60;
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
    if (obj.hexOrient === 30) {
      this.hexVertices(obj, 30, obj.idxOrigin);
      this.sixHexes(obj, 60, obj.secRadius * 2.0);
      this.sixHexes(obj, 30, obj.priRadius * 3.0);
      this.sixHexes(obj, 60, obj.secRadius * 4.0);
    } else if (obj.hexOrient === 60) {
      this.hexVertices(obj, 60, obj.idxOrigin);
      this.sixHexes(obj, 30, obj.secRadius * 2.0);
      this.sixHexes(obj, 60, obj.priRadius * 3.0);
      this.sixHexes(obj, 30, obj.secRadius * 4.0);
    }
    this.createBufferGeometry(obj);
    this.drawCircle(obj.priRadius * 4.0);
    console.log("Hexagon.toGeom()", {
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

  sixHexes(obj, orient, radius) {
    var ang, hue, hyp, i, idx, j, len, ref, sat, x, y, z;
    i = 1;
    ref = this.hexAngles(orient);
    for (j = 0, len = ref.length; j < len; j++) {
      ang = ref[j];
      x = obj.x0 + radius * vis.cos(ang);
      y = obj.y0;
      z = obj.z0 + radius * vis.sin(ang);
      hue = vis.hueZX(z, x);
      hyp = vis.hypoth(z, x);
      sat = this.adjSat(obj, hue, hyp);
      idx = this.addVertex(obj, hue, sat, obj.valFun(hue, sat), x, y, z);
      this.hexVertices(obj, obj.hexOrient, idx);
      i++;
    }
  }

  hexVertices(obj, orient, idxCen) {
    this.calcVertices(obj, orient, idxCen, obj.priRadius);
    this.hexIndices(obj);
  }

  calcVertices(obj, orient, idxCen, radius) {
    var ang, hue, hyp, i, j, len, ref, results, sat, val, vs, x, y, z;
    i = 1;
    vs = obj.vertices;
    obj.hexIndices[0] = idxCen;
    ref = this.hexAngles(orient);
    results = [];
    for (j = 0, len = ref.length; j < len; j++) {
      ang = ref[j];
      x = vs[3 * idxCen] + radius * vis.cos(ang);
      y = vs[3 * idxCen + 1];
      z = vs[3 * idxCen + 2] + radius * vis.sin(ang);
      hue = vis.hueZX(z, x);
      hyp = vis.hypoth(z, x);
      sat = this.adjSat(obj, hue, hyp);
      val = obj.valFun(hue, sat);
      obj.hexIndices[i] = this.addVertex(obj, hue, sat, val, x, y, z);
      console.log("Hexagon.calcVertices", {
        idx: obj.hexIndices[i],
        ang: ang,
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
    return vis.round(hyp * 2.5);
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
    geometry.rotateX(Math.PI / 2);
    geometry.translate(0, 5, 0);
    material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      transparent: true,
      opacity: 1.0,
      wireframe: true
    });
    circle = new THREE.Mesh(geometry, material);
    this.main.addToScene(circle);
  }

};

export default Hexagon;

//# sourceMappingURL=Hexagon.js.map
