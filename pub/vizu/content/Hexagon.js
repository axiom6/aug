var Hexagon,
  hasProp = {}.hasOwnProperty;

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
    var hexOrigin;
    obj.colors = [];
    obj.vertices = [];
    obj.normals = [];
    obj.uvs = [];
    obj.indices = [];
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
    obj.satScale = 4.0; // Scaling factor for convert coords to sat
    obj.originIdx = 0;
    obj.x0 = 0;
    obj.y0 = 0;
    obj.z0 = 0;
    this.initSpheres(obj);
    this.addVertex(obj, 0, 0, obj.valFun(0, 0), obj.x0, obj.z0, obj.z0); // Origin
    hexOrigin = this.initHex(obj.originIdx);
    this.hexVertices(obj, hexOrigin);
    this.sixHexes(obj, 60, obj.secRadius * 2.0);
    this.sixHexes(obj, 30, obj.priRadius * 3.0);
    this.sixHexes(obj, 60, obj.secRadius * 4.0);
    console.log("Hexagon vertices", obj.vertices);
    this.createBufferGeometry(obj);
    console.log("Surface.toGeom Two()", {
      lenVertices: obj.vertices.length,
      lenIndices: obj.indices.length
    });
  }

  sixHexes(obj, orient, radius) {
    var ang, angs, hue, i, len, sat, vcen, x, y, z;
    angs = orient === 60 ? [0, 60, 120, 180, 240, 300] : [330, 30, 90, 150, 210, 270];
    for (i = 0, len = angs.length; i < len; i++) {
      ang = angs[i];
      x = obj.x0 + radius * vis.cos(ang);
      y = obj.y0;
      z = obj.z0 + radius * vis.sin(ang);
      hue = vis.hueZX(z, x);
      sat = vis.round(vis.hypoth(x, z)) * obj.satScale;
      vcen = this.vertexIndex(obj);
      this.addVertex(obj, hue, sat, obj.valFun(hue, sat), x, y, z);
      this.hexVertices(obj, this.initHex(vcen));
    }
  }

  vertexIndex(obj) {
    return obj.vertices.length / 3;
  }

  // Vertex indices set the @hexIndices
  initHex(vcen) {
    return {
      vcen: vcen,
      v330: -1,
      v030: -1,
      v090: -1,
      v150: -1,
      v210: -1,
      v270: -1
    };
  }

  hexVertices(obj, hex) {
    var deg, hue, idx, key, sat, val, x, y, z;
    for (key in hex) {
      if (!hasProp.call(hex, key)) continue;
      idx = hex[key];
      if (!(key !== "vcen" && idx === -1)) {
        continue;
      }
      deg = this.degKey(key);
      x = obj.vertices[hex.vcen * 3] + obj.priRadius * vis.cos(deg);
      y = obj.vertices[hex.vcen * 3 + 1];
      z = obj.vertices[hex.vcen * 3 + 2] + obj.priRadius * vis.sin(deg);
      hex[key] = this.vertexIndex(obj);
      hue = vis.hueZX(z, x);
      sat = vis.round(vis.hypoth(x, z)) * obj.satScale;
      val = obj.valFun(hue, sat);
      this.addVertex(obj, hue, sat, val, x, y, z);
      console.log("Hexagon.hexVerticea", {
        key: key,
        idx: hex[key],
        hue: hue,
        sat: sat,
        val: val,
        x: x,
        y: y,
        z: z
      });
    }
    this.hexIndices(obj, hex);
  }

  hexIndices(obj, hex) {
    this.addIndice(obj, hex.vcen, hex.v330, hex.v030);
    this.addIndice(obj, hex.vcen, hex.v030, hex.v090);
    this.addIndice(obj, hex.vcen, hex.v090, hex.v150);
    this.addIndice(obj, hex.vcen, hex.v150, hex.v210);
    this.addIndice(obj, hex.vcen, hex.v210, hex.v270);
    this.addIndice(obj, hex.vcen, hex.v270, hex.v330);
  }

  degKey(key) {
    switch (key) {
      case "v330":
        return 330;
      case "v030":
        return 30;
      case "v090":
        return 90;
      case "v150":
        return 150;
      case "v210":
        return 210;
      case "v270":
        return 270;
      default:
        return 0;
    }
  }

  addIndice(obj, i1, i2, i3) {
    obj.indices.push(i1, i2, i3);
  }

};

export default Hexagon;

//# sourceMappingURL=Hexagon.js.map
