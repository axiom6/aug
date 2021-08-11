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
    var calcIndices, hexOrigin;
    obj.colors = [];
    obj.vertices = [];
    obj.normals = [];
    obj.uvs = [];
    obj.indices = [];
    obj.originIdx = 0;
    obj.vertex = new THREE.Vector3();
    obj.normal = new THREE.Vector3();
    obj.uv = new THREE.Vector2();
    obj.sc = 1.0 / 255.0;
    obj.hueNum = 12;
    obj.satNum = 10;
    obj.hueInc = 360 / obj.hueNum;
    obj.huePri = obj.hueInc * 2;
    obj.satInc = 100 / obj.satNum;
    obj.hexRad = 10;
    this.initSpheres(obj);
    this.addVertex(obj, 0, 0, 0, 0, 0, 0); // Origin
    hexOrigin = this.initHex(obj.originIdx);
    this.hexVerticea(obj, hexOrigin);
    console.log("Hexagon vertices", obj.vertices);
    this.createIndices(obj);
    this.createBufferGeometry(obj);
    calcIndices = 6;
    console.log("Surface.toGeom Two()", {
      numVertex: obj.vertices.length / 3,
      numIndices: obj.indices.length / 3,
      calcIndices: calcIndices
    });
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

  hexVerticea(obj, hex) {
    var deg, hue, idx, key, sat, val, x, y, z;
    for (key in hex) {
      if (!hasProp.call(hex, key)) continue;
      idx = hex[key];
      if (!(key !== "vcen" && idx === -1)) {
        continue;
      }
      deg = this.degKey(key);
      x = obj.vertices[hex.vcen] + obj.hexRad * vis.cos(deg);
      y = obj.vertices[hex.vcen + 1];
      z = obj.vertices[hex.vcen + 2] + obj.hexRad * vis.sin(deg);
      hex[key] = obj.vertices.length;
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
      hue = this.vis.atan2(z, x);
      sat = this.vis.hypoth(x, x);
      val = this.vis.valFun(hue, sat);
      this.addVertex(obj, hue, sat, val, x, y, z);
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

  // Assign vertex indexes to create all the triangular face indices
  createIndices(obj) {
    var n;
    n = 0;
    this.add6Indices(obj, n, 0, 0);
    console.log("Hexagon Indices", obj.indices);
  }

  addIndice(obj, i1, i2, i3) {
    obj.indices.push(i1, i2, i3);
  }

  add6Indices(obj, n, i, j) {
    var p030, p090, p150, p210, p270, p330, pcen;
    vis.noop(n, i, j);
    pcen = obj.originIdx;
    p330 = 0;
    p030 = 1;
    p090 = 2;
    p150 = 3;
    p210 = 4;
    p270 = 5;
    this.addIndice(obj, pcen, p330, p030);
    this.addIndice(obj, pcen, p030, p090);
    this.addIndice(obj, pcen, p090, p150);
    this.addIndice(obj, pcen, p150, p210);
    this.addIndice(obj, pcen, p210, p270);
    this.addIndice(obj, pcen, p270, p330);
  }

  add60Indices(obj, n, i, j) {
    var p030, p090, p150, p210, p270, p330, pcen;
    pcen = n * i + j;
    p330 = n * (i + 11) + j + 1;
    p030 = n * (i + 1) + j + 1;
    p090 = n * (i + 2) + j + 1;
    p150 = n * (i + 3) + j + 1;
    p210 = n * (i + 4) + j + 1;
    p270 = n * (i + 5) + j + 1;
    this.addIndice(obj, pcen, p330, p030);
    this.addIndice(obj, pcen, p030, p090);
    this.addIndice(obj, pcen, p090, p150);
    this.addIndice(obj, pcen, p150, p210);
    this.addIndice(obj, pcen, p210, p270);
    this.addIndice(obj, pcen, p270, p330);
  }

};

export default Hexagon;

//# sourceMappingURL=Hexagon.js.map
