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

  drawHsv() {
    var obj;
    obj = {};
    obj.group = new THREE.Group();
    obj.valFun = function(hue, sat) {
      return 50;
    };
    this.toGeom(obj);
    this.main.addToScene(obj.group);
    this.main.addToScene(obj.sphereGroup);
    //main.addToScene( obj.faceGroup   )
    this.main.log('Surface.drawHsv()', {});
  }

  toGeom(obj) {
    var hue, k, l, rad, ref, ref1, sat;
    obj.colors = [];
    obj.vertices = [];
    obj.normals = [];
    obj.indices = [];
    obj.sc = 1.0 / 255.0;
    obj.hueNum = 24;
    obj.satNum = 10;
    obj.hueInc = 360 / obj.hueNum;
    obj.huePri = obj.hueInc * 2;
    obj.satInc = 100 / obj.satNum; // scount is actually obj.satInc + 1
    this.initSpheres(obj);
// @initFaces( obj )
    for (hue = k = 0, ref = obj.hueInc; ref !== 0 && (ref > 0 ? k < 360 : k > 360); hue = k += ref) {
      for (rad = l = 0, ref1 = obj.satInc; ref1 !== 0 && (ref1 > 0 ? l <= 100 : l >= 100); rad = l += ref1) {
        sat = hue % obj.huePri === 0 ? rad : rad - obj.satInc / 2;
        this.addVertex(obj, hue, sat, obj.valFun(hue, sat), sat * vis.cos(-hue - 90) * 2.5, 0, sat * vis.sin(-hue - 90) * 2.5);
      }
    }
    this.main.log("Surface vertices", obj.vertices);
    this.createIndices(obj);
    this.createBufferGeometry(obj);
  }

  initSpheres(obj) {
    var count, radius;
    radius = 8;
    count = 3 * obj.hueNum + 4 * obj.hueNum * obj.satNum;
    obj.sphereIndex = 0;
    obj.sphereGeometry = new THREE.SphereGeometry(radius, 16, 16);
    obj.sphereMaterial = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.FrontSide
    });
    obj.sphereMesh = new THREE.InstancedMesh(obj.sphereGeometry, obj.sphereMaterial, count);
    obj.sphereMatrix = new THREE.Matrix4();
    obj.sphereColor = new THREE.Color();
    obj.sphereGroup = new THREE.Group();
    obj.sphereGroup.add(obj.sphereMesh);
  }

  initFaces(obj) {
    var count, radius;
    radius = 8;
    count = obj.hueNum * (obj.satNum + 1);
    obj.faceIndex = 0;
    obj.faceGeometry = new THREE.SphereGeometry(radius, 16, 16);
    obj.faceMaterial = new THREE.MeshBasicMaterial({
      transparent: false,
      side: THREE.FrontSide
    });
    obj.faceMesh = new THREE.InstancedMesh(obj.faceGeometry, obj.faceMaterial, count);
    obj.faceGroup = new THREE.Group();
    obj.faceGroup.add(obj.faceMesh);
  }

  addVertex(obj, hue, sat, val, x, y, z) {
    var rgb;
    rgb = vis.rgb([hue, sat, val, "HMIR"]);
    obj.colors.push(rgb.r * obj.sc, rgb.g * obj.sc, rgb.b * obj.sc);
    obj.vertices.push(x, y, z);
    obj.normals.push(0, 1, 0); // Good only for a flat surface
    this.addSphere(obj, rgb, x, y, z);
    this.main.log("Surface.addVertex()", {
      hue: hue,
      sat: sat,
      val: val,
      x: x,
      y: y,
      z: z
    });
  }

  addSphere(obj, rgb, x, y, z) {
    obj.sphereMatrix.setPosition(x, y, z);
    obj.sphereColor.setRGB(rgb.r * obj.sc, rgb.g * obj.sc, rgb.b * obj.sc);
    obj.sphereMesh.setMatrixAt(obj.sphereIndex, obj.sphereMatrix);
    obj.sphereMesh.setColorAt(obj.sphereIndex, obj.sphereColor);
    obj.sphereIndex++;
  }

  createBufferGeometry(obj) {
    var geom, geomMesh, vertMat, wireMat, wireMesh;
    geom = new THREE.BufferGeometry();
    geom.setIndex(obj.indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(obj.vertices, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(obj.normals, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(obj.colors, 3));
    vertMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: true
    });
    wireMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0xFFFFFF
    });
    geomMesh = new THREE.Mesh(geom, vertMat);
    wireMesh = new THREE.Mesh(geom, wireMat);
    geomMesh.add(wireMesh);
    obj.group.add(geomMesh);
  }

  // Assign vertex indexes to create all the triangular face indices
  createIndices(obj) {
    var ce, i0, i1, i2, j, k, l, n, ne, nw, oo, ref, ref1, se, sw;
    n = obj.satNum + 1;
    for (i0 = k = 0, ref = obj.hueNum; k < ref; i0 = k += 2) {
      i1 = i0 + 1;
      i2 = i0 < obj.hueNum - 2 ? i0 + 2 : 0;
      oo = i0 * n; // Case where sat is zero
      se = i0 * n + 1;
      ce = i1 * n + 1;
      ne = i2 * n + 1;
      this.addIndice(obj, oo, ce, se); // We only create 3 face indices
      this.addIndice(obj, oo, ce, ne);
      this.addIndice(obj, ce, se, ne);
      this.main.log("Surface.addIndices One()", {
        i0: i0,
        j: 1,
        oo: oo,
        se: se,
        ce: ce,
        ne: ne
      });
      for (j = l = 1, ref1 = obj.satNum; (1 <= ref1 ? l <= ref1 : l >= ref1); j = 1 <= ref1 ? ++l : --l) {
        sw = i0 * n + j;
        se = i0 * n + j + 1;
        ce = i1 * n;
        nw = i2 * n + j;
        ne = i2 * n + j + 1;
        this.addIndice(obj, ce, sw, nw);
        this.addIndice(obj, ce, nw, ne);
        this.addIndice(obj, ce, ne, se);
        this.addIndice(obj, ce, se, sw);
        this.main.log("Surface.addIndices One()", {
          i0: i0,
          j: j,
          ce: ce,
          sw: sw,
          nw: nw,
          ne: ne,
          se: se
        });
      }
    }
    console.log("Surface.addIndices() Two", {
      numIndices: obj.indices.length
    });
  }

  addIndice(obj, i1, i2, i3) {
    obj.indices.push(i1, i2, i3);
  }

  // @addFace(  obj, i1, i2, i3 )
  addFace(obj, i1, i2, i3) {
    var v1, v2, v3, vc;
    vc = function(i, j) {
      return obj.vertices[i * 3] + j;
    };
    v1 = new THREE.Vector3(vc(i1, 0), vc(i1, 1), vc(i1, 2));
    v2 = new THREE.Vector3(vc(i2, 0), vc(i2, 1), vc(i2, 2));
    v3 = new THREE.Vector3(vc(i3, 0), vc(i3, 1), vc(i3, 2));
    obj.faceTriangle = THREE.Triangle(v1, v2, v3);
    return obj.faceIndex++;
  }

  // xyzs.push(vis.cos(hue)*sat,vis.sin(hue)*sat,0)
  genHsvs(hueInc, satInc, valFunc) {
    var hsvs, hue, k, l, ref, ref1, sat;
    hsvs = [];
    for (hue = k = 0, ref = hueInc; ref !== 0 && (ref > 0 ? k < 360 : k > 360); hue = k += ref) {
      for (sat = l = 0, ref1 = satInc; ref1 !== 0 && (ref1 > 0 ? l <= 100 : l >= 100); sat = l += ref1) {
        hsvs.push(new THREE.Vector3(hue, sat, valFunc(hue, sat)));
      }
    }
    return hsvs;
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

  // val 0.25*Math.sin( 12*x + vis.time*0.3 ) + 0.25*Math.sin( 12*y + vis.time*0.3 )
  hmiWave(u, v, pt) {
    var hue, sat, val, x, y, z;
    hue = u * 360;
    sat = v * 100;
    val = 50;
    x = vis.cos(hue) * sat;
    z = vis.sin(hue) * sat;
    y = val; // * ( 1.0 + vis.sin(16*hue) )
    // console.log( "Surface.hmiWave()", { uv:[u,v], hsv:[hue,sat,val], xyz:[x,y,z] } )
    return pt.set(x, y, z);
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
    var color, colors, hsv, i, k, ref, results, rgb, sc, vertObj, vertices;
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
    results = [];
    for (i = k = 0, ref = vertices.length; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
      hsv = vertices[i].slice();
      hsv.push("HMIR");
      rgb = vis.rgb(hsv);
      color.setRGB(rgb.r * sc, rgb.g * sc, rgb.b * sc);
      color = new THREE.Color(rgb.r, rgb.g, rgb.b);
      results.push(colors.push(color));
    }
    return results;
  }

};

export default Surface;

//# sourceMappingURL=Surface.js.map
