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

  applyColor(geometry) {
    var color, face, faceIndices, faces, hue, i, j, k, l, m, numberOfSides, point, ref, ref1, ref2, vertexIndex, vertices, zMax, zMin, zRange;
    geometry.computeBoundingBox();
    zMin = geometry.boundingBox.min.z;
    zMax = geometry.boundingBox.max.z;
    vertices = geometry.getAttribute("position");
    faces = geometry.getAttribute("normal");
    console.log("Surface.applyColor()", {
      vlen: vertices.count,
      flen: faces.count,
      vertices: vertices
    });
    zRange = zMax - zMin;
    faceIndices = [
      'a',
      'b',
      'c',
      'd' // faces are indexed using characters
    ];
// first, assign colors to vertices as desired
    for (i = k = 0, ref = vertices.length; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      point = vertices[i];
      color = new THREE.Color(0x0000ff);
      hue = 0.7 * (zMax - point.z) / zRange;
      color.setHSL(hue, 1, 0.5);
      geometry.colors[i] = color; // use this array for convenience
    }

    // copy the colors as necessary to the face's vertexColors array.
    for (i = l = 0, ref1 = faces.length; (0 <= ref1 ? l < ref1 : l > ref1); i = 0 <= ref1 ? ++l : --l) {
      face = faces[i];
      numberOfSides = 3; // ( face instanceof THREE.Face ) ? 3 : 4
      for (j = m = 0, ref2 = numberOfSides; (0 <= ref2 ? m < ref2 : m > ref2); j = 0 <= ref2 ? ++m : --m) {
        vertexIndex = face[faceIndices[j]];
        face.vertexColors[j] = geometry.colors[vertexIndex];
      }
    }
  }

  rgbs(inMesh, nx, ny, inc) {
    var color, i, k, l, matrix, ref, ref1, ref2, ref3, x, y, z;
    i = 0;
    matrix = new THREE.Matrix4();
    color = new THREE.Color();
    for (x = k = 0, ref = nx, ref1 = inc; ref1 !== 0 && (ref1 > 0 ? k <= ref : k >= ref); x = k += ref1) {
      for (y = l = 0, ref2 = ny, ref3 = inc; ref3 !== 0 && (ref3 > 0 ? l <= ref2 : l >= ref2); y = l += ref3) {
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
