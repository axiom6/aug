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
    var group, valFun;
    group = new THREE.Group();
    valFun = function(hue, sat) {
      return 100;
    };
    this.toGeom(valFun, group);
    this.main.addToScene(group);
    this.main.log('Surface.drawHsv()', {});
  }

  toGeom(valFun, group) {
    var colors, geom, hue, indices, k, l, mats, mesh, nHue, nSat, normals, rgb, sat, sc, val, vertices;
    colors = [];
    vertices = [];
    normals = [];
    // indices  = []
    sc = 1.0 / 255.0;
    nHue = 24;
    nSat = 11;
    for (hue = k = 0; k < 360; hue = k += 15) {
      for (sat = l = 0; l <= 100; sat = l += 10) {
        val = valFun(hue, sat);
        rgb = vis.rgb([hue, sat, val, "HMIR"]);
        colors.push(rgb.r * sc, rgb.g * sc, rgb.b * sc);
        vertices.push(sat * vis.cos(-hue - 90) * 2.5, 0, sat * vis.sin(-hue - 90) * 2.5);
        normals.push(0, 1, 0); // Good only for a flat surface
      }
    }
    console.log("Surface vertices", vertices);
    indices = this.createIndices(nHue, nSat, valFun, colors, vertices, normals);
    geom = new THREE.BufferGeometry();
    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    mats = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: true
    });
    mesh = new THREE.Mesh(geom, mats);
    group.add(mesh);
  }

  createIndices(nHue, nSat, valFun, colors, vertices, normals) {
    var ce, hue, i, ii, indices, j, k, l, ne, nw, ref, ref1, rgb, sat, sc, se, sw, val, vidx;
    sc = 1.0 / 255.0;
    indices = [];
    vidx = vertices.length / 3;
    vertices.push(1, 1, 1); // White
    vertices.push(0, 0, 0);
    normals.push(0, 1, 0);
    for (ii = k = 0, ref = nHue; (0 <= ref ? k < ref : k > ref); ii = 0 <= ref ? ++k : --k) {
      i = ii < nHue - 1 ? ii : 0;
      indices.push(vidx, i * nSat, i * (nSat + 1));
      for (j = l = 1, ref1 = nSat - 1; (1 <= ref1 ? l < ref1 : l > ref1); j = 1 <= ref1 ? ++l : --l) {
        ce = vidx;
        sw = i * nSat + j;
        se = i * nSat + j + 1;
        nw = i * (nSat + 1) + j;
        ne = i * (nSat + 1) + j + 1;
        indices.push(ce, sw, nw);
        indices.push(ce, nw, ne);
        indices.push(ce, ne, se);
        indices.push(ce, se, sw);
        val = valFun(hue, sat);
        hue = 7.5 * (i + (i + 1));
        sat = 5.0 * (j + (j + 1));
        val = valFun(sat);
        rgb = vis.rgb([hue, sat, val, "HMIR"]);
        colors.push(rgb.r * sc, rgb.g * sc, rgb.b * sc);
        vertices = this.ave(sw, nw, ne, se, vertices);
        normals.push(0, 1, 0);
        vidx++;
        console.log("Surface.addIndices One()", {
          i: i,
          j: j,
          ce: ce,
          sw: sw,
          nw: nw,
          ne: ne,
          se: se,
          vidx: vidx,
          Hue: hue,
          sat: sat,
          val: val
        });
      }
    }
    console.log("Surface.addIndices() Teo", indices);
    return indices;
  }

  ave(sw, nw, ne, se, vertices) {
    var cc;
    cc = function(i) {
      return 0.25 * (vertices[3 * sw + i] + vertices[3 * nw + i] + vertices[3 * ne + i] + vertices[3 * se + i]);
    };
    vertices.push(cc(0), cc(1), cc(2));
    return vertices;
  }

  createIndices1(nHue) {
    var a, b, hueIdx, indices, k, ref;
    indices = [];
    for (hueIdx = k = 0, ref = nHue; (0 <= ref ? k < ref : k > ref); hueIdx = 0 <= ref ? ++k : --k) {
      a = hueIdx;
      b = hueIdx < nHue - 1 ? hueIdx + 1 : 0;
      indices.push(0, a + 1, b + 1);
    }
    console.log("Surface.addIndices()", indices);
    return indices;
  }

  addIndices1(i, j, n, indices) {
    var a, b, c, d;
    a = i * (n + 1) + (j + 1);
    b = i * (n + 1) + j;
    c = (i + 1) * (n + 1) + j;
    d = (i + 1) * (n + 1) + (j + 1);
    // generate two faces (triangles) per iteration
    indices.push(a, b, d);
    indices.push(b, c, d);
  }

  toFace(indice, color, group) {
    var face, mat, mesh, rgb, sc;
    console.log("Surface.toFace()", indice);
    sc = 1.0 / 255.0;
    rgb = vis.rgb([0, 100, 100, "HMIR"]);
    color.setRGB(rgb.r * sc, rgb.g * sc, rgb.b * sc);
    face = new THREE.BufferGeometry().setFromPoints(indice);
    mat = new THREE.MeshBasicMaterial({
      color: color,
      transparent: false,
      side: THREE.FrontSide
    });
    mesh = new THREE.Mesh(face, mat);
    group.add(mesh);
  }

  /*
  console.log( "Surface.toGeom()", vertices )
  toFace:( v1, v2, v3, color, group ) ->
    console.log( "Surface.toFace()", { v1:v1, v2:v2, v3:v3 } )
    sc   = 1.0 / 255.0
    rgb  = vis.rgb( [0,100,100,"HMIR"] )
    color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
    face = new THREE.BufferGeometry().setFromPoints( [v1,v2,v3] )
    mat  = new THREE.MeshBasicMaterial( { color:color, transparent:false, side:THREE.FrontSide } )
    mesh = new THREE.Mesh( face, mat )
    group.add( mesh )
    return

    positions = geometry.getAttribute("position")
    vertices  = []
    for i in [0...positions.count]
      vertex = new THREE.Vector3()
      vertex.fromBufferAttribute( positions, i );
      vertices.push( vertex )
    pointg = new THREE.BufferGeometry().setFromPoints( vertices )
    pointm = new THREE.PointsMaterial( { color:0x0000FF, size:10 } )
    points = new THREE.Points( pointg, pointm )

      for   hue in [0...360] by hueInc
      for sat in [0..100]  by satInc
        rgb = vis.rgb( [hue,sat,100,"HMIR"] )
        color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
        hsv.setColor( color )
  hueInc   = 30
  satInc   = 10
  valFunc  = ( hue, sat ) ->
  vis.noop(  hue )
  sat
  hsvs     = @genHsvs( hueInc, satInc, valFunc )
  color    = new THREE.Color()
  color.setRGB( 0.5, 0.5, 0.5 )
  geometry.setColor( color )
  sc       = 1.0 / 255.0
   * faces    = geometry['convexHull'].faces
  for hsv in hsvs
    rgb = vis.rgb( [hsv[0],hsv[1],hsv[2],"HMIR"] )
    color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
    hsv.setColor( color )
   */
  drawHsv2() {
    var geometry, group, hueInc, hunNum, inMesh, indices, material, matrix, satInc, satNum;
    hueInc = 30;
    hunNum = 360 / hueInc;
    satInc = 10;
    satNum = 100 / satInc + 1;
    geometry = new THREE.ParametricGeometry(this.hmiWave, hunNum, satNum);
    material = new THREE.MeshBasicMaterial({
      color: 0x808080,
      transparent: false,
      side: THREE.DoubleSide
    });
    inMesh = new THREE.InstancedMesh(geometry, material, count);
    matrix = new THREE.Matrix4();
    group = new THREE.Group();
    matrix.setPosition(0, 0, 0);
    inMesh.setMatrixAt(0, matrix);
    indices = geometry.getIndex();
    console.log("Surface.drawHsv()", indices);
    // for i in [0...indices.length]
    //  @toFace( indices[i], color, group )
    group.add(inMesh);
    this.main.addToScene(group);
    this.main.log('Surface.drawHsv()', {
      i: i,
      count: count
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

  applyColor(geometry) {
    var color, colors, hsv, i, k, ref, rgb, sc, vertObj, vertices;
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
    for (i = k = 0, ref = vertices.length; (0 <= ref ? k < ref : k > ref); i = 0 <= ref ? ++k : --k) {
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

};

export default Surface;

//# sourceMappingURL=Surface.js.map
