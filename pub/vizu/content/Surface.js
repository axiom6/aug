var Surface;

import * as THREE from "three";

import {
  vis
} from "../../../lib/pub/draw/Vis.js";

Surface = class Surface {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    this.main.log(this.klass + '()', this);
  }

  parametric() {
    var count, geometry, group, i, inMesh, material, matrix, ndeginc, nsatinc;
    i = 0;
    ndeginc = 12;
    nsatinc = 10;
    count = ndeginc * nsatinc;
    geometry = new THREE.ParametricGeometry(this.hmiWave, ndeginc, nsatinc);
    material = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.FrontSide
    });
    inMesh = new THREE.InstancedMesh(geometry, material, 1);
    matrix = new THREE.Matrix4();
    // color  = new THREE.Color()
    group = new THREE.Group();
    matrix.setPosition(0, 0, 0);
    //color.setRGB( 128, 128, 128 )
    inMesh.setMatrixAt(0, matrix);
    // inMesh.setColorAt(  0, color  )
    this.applyColor(geometry);
    group.add(inMesh);
    this.main.addToScene(group);
    this.main.log('Surface.parametric()', {
      i: i,
      count: count
    });
  }

  drawHsv() {
    var color, count, geometry, group, hue, hueInc, i, inMesh, j, k, material, matrix, radius, ref, ref1, rgb, sat, satInc, sc, val, x, y, z;
    radius = 8;
    i = 0;
    sc = 1.0 / 255.0;
    hueInc = 30;
    satInc = 10;
    count = (360 / hueInc) * (1 + 100 / satInc);
    geometry = new THREE.SphereGeometry(radius, 16, 16);
    material = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.DoubleSide
    });
    inMesh = new THREE.InstancedMesh(geometry, material, count);
    matrix = new THREE.Matrix4();
    color = new THREE.Color();
    group = new THREE.Group();
    val = 100;
    sc = 1.0 / 255.0;
    for (hue = j = 0, ref = hueInc; ref !== 0 && (ref > 0 ? j < 360 : j > 360); hue = j += ref) {
      for (sat = k = 0, ref1 = satInc; ref1 !== 0 && (ref1 > 0 ? k <= 100 : k >= 100); sat = k += ref1) {
        x = 2.5 * vis.cos(hue) * sat;
        z = 2.5 * vis.sin(-hue) * sat;
        y = 125 + 125 * vis.sin(4 * hue);
        matrix.setPosition(x, y, z);
        rgb = vis.rgb([hue, sat, val, "HMIR"]);
        color.setRGB(rgb.r * sc, rgb.g * sc, rgb.b * sc);
        inMesh.setMatrixAt(i, matrix);
        inMesh.setColorAt(i, color);
        // console.log( 'Content.drawYsv()', { h:h, s:s, v:v, rgb:rgb } )
        i++;
      }
    }
    group.add(inMesh);
    this.main.addToScene(group);
    this.main.log('Surface.drawHsv()', {
      i: i,
      count: count
    });
  }

  genHsvsDisc(hueInc, satInc) {
    var hsvs, hue, j, k, ref, ref1, sat, xyzs;
    hsvs = [];
    xyzs = [];
    for (hue = j = 0, ref = hueInc; ref !== 0 && (ref > 0 ? j < 360 : j > 360); hue = j += ref) {
      for (sat = k = 0, ref1 = satInc; ref1 !== 0 && (ref1 > 0 ? k <= 100 : k >= 100); sat = k += ref1) {
        hsvs.push([hue, sat, 0, "HMIR"]);
        xyzs.push(vis.cos(hue) * sat, vis.sin(hue) * sat, 0);
      }
    }
    return hsvs;
  }

  applyColor(geometry) {
    var color, colors, hsv, i, j, ref, rgb, sc, vertObj, vertices;
    geometry.computeBoundingBox();
    vertObj = geometry.getAttribute("position");
    // faceObj  = geometry.getAttribute("normal")
    vertices = vertObj.array;
    // faces  = faceObj.array
    // colorObj = geometry.getAttribute("color")
    // colors   = colorObj.array
    colors = [];
    console.log("Surface.applyColor()", {
      vlen: vertObj.count,
      vertices: vertices
    });
    // faceIndices = ['a','b','c','d']                   # faces are indexed using characters
    sc = 1.0 / 255.0;
// first, assign colors to vertices as desired
    for (i = j = 0, ref = vertices.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      hsv = vertices[i].slice();
      hsv.push("HMIR");
      rgb = vis.rgb(hsv);
      color.setRGB(rgb.r * sc, rgb.g * sc, rgb.b * sc);
      color = new THREE.Color(rgb.r, rgb.g, rgb.b);
      colors.push(color);
    }
  }

  // copy the colors as necessary to the face's vertexColors array.
  /*
  for i in [0...faces.length]
    face = faces[i]
    numberOfSides = 3                  # ( face instanceof THREE.Face ) ? 3 : 4
    for j in [0...numberOfSides]
      vertexIndex = face[ faceIndices[j] ]
      face.vertexColors[j] = colors[vertexIndex]  # Not right yet
  */
  rgbs(inMesh, nx, ny, inc) {
    var color, i, j, k, matrix, ref, ref1, ref2, ref3, x, y, z;
    i = 0;
    matrix = new THREE.Matrix4();
    color = new THREE.Color();
    for (x = j = 0, ref = nx, ref1 = inc; ref1 !== 0 && (ref1 > 0 ? j <= ref : j >= ref); x = j += ref1) {
      for (y = k = 0, ref2 = ny, ref3 = inc; ref3 !== 0 && (ref3 > 0 ? k <= ref2 : k >= ref2); y = k += ref3) {
        z = (x + y) * 0.5;
        matrix.setPosition(x, y, z);
        color.setRGB(x, y, z); // Just a place holder
        inMesh.setMatrixAt(i, matrix);
        inMesh.setColorAt(i, color);
        i++;
      }
    }
    return i;
  }

  funcXY(x, y, pt) {
    return pt.set(x, y, (x + y) * 0.5);
  }

  klein(u, v, pt) {
    var x, y, z;
    u *= Math.PI;
    v *= 2 * Math.PI;
    u = u * 2;
    x = 0;
    y = 0;
    z = 0;
    if (u < Math.PI) {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(u) * Math.cos(v);
      z = -8 * Math.sin(u) - 2 * (1 - Math.cos(u) / 2) * Math.sin(u) * Math.cos(v);
    } else {
      x = 3 * Math.cos(u) * (1 + Math.sin(u)) + (2 * (1 - Math.cos(u) / 2)) * Math.cos(v + Math.PI);
      z = -8 * Math.sin(u);
    }
    y = -2 * (1 - Math.cos(u) / 2) * Math.sin(v);
    return pt.set(x, y, z);
  }

  radialWave(u, v, pt) {
    var r, x, y, z;
    r = 100;
    x = Math.sin(u) * r;
    z = Math.sin(v / 2) * 2 * r;
    y = (Math.sin(u * 4 * Math.PI) + Math.cos(v * 2 * Math.PI)) * 2.8;
    return pt.set(x, y, z);
  }

  // val 0.25*Math.sin( 12*x + vis.time*0.3 ) + 0.25*Math.sin( 12*y + vis.time*0.3 )
  hmiWave(u, v, pt) {
    var hue, sat, x, y, z;
    hue = u * 30;
    sat = v * 10;
    x = vis.cos(hue) * sat;
    y = vis.sin(hue) * sat;
    z = 50 * 25 * vis.sin(12 * x) * 25 * vis.sin(12 * y);
    return pt.set(x, y, z);
  }

};

export default Surface;

//# sourceMappingURL=Surface.js.map
