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
      return 100;
    };
    this.toGeom(obj);
    this.main.addToScene(obj.group);
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
    obj.satInc = 100 / obj.satNum; // scount is actually obj.satInc + 1
    for (hue = k = 0, ref = obj.hueInc; ref !== 0 && (ref > 0 ? k < 360 : k > 360); hue = k += ref) {
      for (rad = l = 0, ref1 = obj.satInc; ref1 !== 0 && (ref1 > 0 ? l <= 100 : l >= 100); rad = l += ref1) {
        sat = hue % obj.hueInc * 2 === 0 ? rad : rad - obj.satInc / 2;
        this.addVertex(obj, hue, sat, obj.valFun(hue, sat), sat * vis.cos(-hue - 90) * 2.5, 0, sat * vis.sin(-hue - 90) * 2.5);
      }
    }
    this.main.log("Surface vertices", obj.vertices);
    this.createIndices(obj);
    this.createBufferGeometry(obj);
  }

  addVertex(obj, hue, sat, val, x, y, z) {
    var rgb;
    rgb = vis.rgb([hue, sat, val, "HMIR"]);
    obj.colors.push(rgb.r * obj.sc, rgb.g * obj.sc, rgb.b * obj.sc);
    obj.vertices.push(x, y, z);
    obj.normals.push(0, 1, 0); // Good only for a flat surface
  }

  createBufferGeometry(obj) {
    var geom, mats, mesh;
    geom = new THREE.BufferGeometry();
    geom.setIndex(obj.indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(obj.vertices, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(obj.normals, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(obj.colors, 3));
    mats = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: true
    });
    mesh = new THREE.Mesh(geom, mats);
    obj.group.add(mesh);
  }

  // Assign vertex indexes to create all the triangular face indices
  createIndices(obj) {
    var ce, hi, i, j, k, l, n0, n1, n2, ne, nw, oo, ref, ref1, se, sw;
    n0 = obj.satNum;
    n1 = n0 + 1;
    n2 = n1 + 1;
    for (hi = k = 0, ref = obj.hueNum; (0 <= ref ? k < ref : k > ref); hi = 0 <= ref ? ++k : --k) {
      i = hi < obj.hueNum - 1 ? hi : 0;
      oo = i * n0; // Case where sat is zero
      se = i * n0 + 1;
      ce = i + n1 + 1;
      ne = i * n2 + 1;
      obj.indices.push(oo, ce, se); // We only create 3 face indices
      obj.indices.push(oo, ce, ne);
      obj.indices.push(ce, se, ne);
      for (j = l = 1, ref1 = obj.satNum; (1 <= ref1 ? l < ref1 : l > ref1); j = 1 <= ref1 ? ++l : --l) {
        sw = i * n0 + j;
        se = i * n0 + j + 1;
        ce = i + n1;
        nw = i * n2 + j;
        ne = i * n2 + j + 1;
        obj.indices.push(ce, sw, nw);
        obj.indices.push(ce, nw, ne);
        obj.indices.push(ce, ne, se);
        obj.indices.push(ce, se, sw);
        console.log("Surface.addIndices One()", {
          i: i,
          j: j,
          ce: ce,
          sw: sw,
          nw: nw,
          ne: ne,
          se: se
        });
      }
    }
    console.log("Surface.addIndices() Teo", obj.indices);
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
