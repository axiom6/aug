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

  drawHsv(orient) {
    var obj;
    obj = {};
    obj.orient = orient;
    obj.group = new THREE.Group();
    obj.valFun = function(hue, sat) {
      return 50;
    };
    this.toGeom(obj);
    this.main.addToScene(obj.group);
    this.main.addToScene(obj.sphereGroup);
    this.main.log('Surface.drawHsv()', obj);
  }

  toGeom(obj) {
    var fac, hue, k, l, numIndices, rad, ref, ref1, sat, val;
    obj.colors = [];
    obj.vertices = [];
    obj.normals = [];
    obj.uvs = [];
    obj.indices = [];
    obj.vertex = new THREE.Vector3();
    obj.normal = new THREE.Vector3();
    obj.uv = new THREE.Vector2();
    obj.sc = 1.0 / 255.0;
    obj.hueNum = 24;
    obj.satNum = 10;
    obj.hueInc = 360 / obj.hueNum;
    obj.huePri = obj.hueInc * 2;
    obj.satInc = 100 / obj.satNum;
    this.initSpheres(obj);
    for (hue = k = 0, ref = obj.hueInc; ref !== 0 && (ref > 0 ? k < 360 : k > 360); hue = k += ref) {
      for (rad = l = 0, ref1 = obj.satInc; ref1 !== 0 && (ref1 > 0 ? l <= 100 : l >= 100); rad = l += ref1) {
        sat = hue % obj.huePri === 0 ? rad : rad + obj.satInc / 2;
        fac = hue % obj.huePri === 0 ? 1.0 : 1.0 - rad / 2000; // 2000 has been determined empiriaclly
        this.main.log("Surface.toGeom", {
          hue: hue,
          rad: rad,
          sat: sat
        });
        val = obj.valFun(hue, sat);
        this.addVertex(obj, hue, sat, val, sat * fac * vis.cos(-hue - 90), 0, sat * fac * vis.sin(hue - 90)); // -90 needs adjust
      }
    }
    this.main.log("Surface vertices", obj.vertices);
    this.createIndices(obj);
    this.createBufferGeometry(obj);
    numIndices = 3 * obj.hueNum / 2 + 4 * obj.satNum * obj.hueNum / 2;
    console.log("Surface.toGeom Two()", {
      numVertex: obj.vertices.length / 3,
      numIndices: obj.indices.length / 3,
      calcIndices: numIndices
    });
  }

  initSpheres(obj) {
    var count, radius;
    radius = 2;
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

  vertexIndexXYZ(obj, x, y, z) {
    var i, k, ref, vs;
    vs = obj.vertices;
    for (i = k = 0, ref = vs.length; k < ref; i = k += 3) {
      if (vis.isCoord(x, vs[i], y, vs[i + 1], z, vs[i + 2])) {
        return i / 3;
      }
    }
    return -1;
  }

  vertexIndex(obj) {
    return obj.vertices.length / 3;
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
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(obj.uvs, 2));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(obj.colors, 3));
    vertMat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.FaceColors
    });
    geomMesh = new THREE.Mesh(geom, vertMat);
    wireMat = new THREE.MeshBasicMaterial({
      wireframe: true,
      color: 0x000000
    });
    wireMesh = new THREE.Mesh(geom, wireMat);
    geomMesh.add(wireMesh);
    obj.group.add(geomMesh);
  }

  // Assign vertex indexes to create all the triangular face indices
  createIndices(obj) {
    var i0, i1, i2, j, k, l, n, ref, ref1;
    n = obj.satNum + 1;
    for (i0 = k = 0, ref = obj.hueNum; k < ref; i0 = k += 2) {
      i1 = i0 + 1;
      i2 = i0 < obj.hueNum - 2 ? i0 + 2 : 0;
      this.add3Indices(obj, n, i0, i1, i2);
      for (j = l = 0, ref1 = obj.satNum; (0 <= ref1 ? l < ref1 : l > ref1); j = 0 <= ref1 ? ++l : --l) {
        this.add4Indices(obj, n, i0, i1, i2, j);
      }
    }
  }

  addIndice(obj, i1, i2, i3) {
    obj.indices.push(i1, i2, i3);
  }

  // @addLine(  obj, i1, i2, i3 )
  add3Indices(obj, n, i0, i1, i2) {
    var ce, ne, oo, se;
    oo = i0 * n;
    se = i0 * n + 1;
    ce = i1 * n;
    ne = i2 * n + 1;
    this.addIndice(obj, oo, ce, se); // We only create 3 face indices
    this.addIndice(obj, oo, ce, ne);
    this.addIndice(obj, ce, se, ne);
    this.main.log("Surface.add3Indices()", {
      i0: i0,
      oo: oo,
      ce: ce,
      se: se,
      ne: ne
    });
  }

  add4Indices(obj, n, i0, i1, i2, j) {
    var ce, ne, nw, se, sw;
    sw = i0 * n + j;
    se = i0 * n + j + 1;
    ce = i1 * n + j;
    nw = i2 * n + j;
    ne = i2 * n + j + 1;
    this.addIndice(obj, ce, sw, se);
    this.addIndice(obj, ce, se, ne);
    this.addIndice(obj, ce, ne, nw);
    this.addIndice(obj, ce, nw, sw);
    this.main.log("Surface.add4Indices()", {
      i0: i0,
      j: j,
      ce: ce,
      sw: sw,
      nw: nw,
      ne: ne,
      se: se
    });
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

  // Not called. Kept as a reference
  addLine(obj, i1, i2, i3) {
    var geom, line, mat, points, v1, v2, v3, vc;
    vc = function(i, j) {
      return obj.vertices[i * 3 + j];
    };
    points = [];
    v1 = new THREE.Vector3(vc(i1, 0), vc(i1, 1), vc(i1, 2));
    v2 = new THREE.Vector3(vc(i2, 0), vc(i2, 1), vc(i2, 2));
    v3 = new THREE.Vector3(vc(i3, 0), vc(i3, 1), vc(i3, 2));
    points.push(v1, v2, v3);
    geom = new THREE.BufferGeometry().setFromPoints(points);
    mat = new THREE.LineBasicMaterial({
      color: 0x000000
    });
    line = new THREE.LineLoop(geom, mat);
    vis.noop(line);
  }

};

// obj.lineGroup.add( line )
export default Surface;

//# sourceMappingURL=Surface.js.map
