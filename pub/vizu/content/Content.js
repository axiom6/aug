var Content;

import {
  BoxGeometry,
  Mesh,
  BufferGeometry,
  SphereGeometry,
  Material,
  AxesHelper,
  Vector3,
  Line,
  LineBasicMaterial,
  Points,
  Color,
  Float32BufferAttribute,
  PointsMaterial,
  MeshStandardMaterial,
  Group,
  DoubleSide,
  InstancedMesh,
  MeshLambertMaterial,
  Matrix4
} from 'three';

import {
  vis
} from '../../../lib/pub/draw/Vis.js';

import XAxis from '../coords/XAxis.js';

import YAxis from '../coords/YAxis.js';

import ZAxis from '../coords/ZAxis.js';

import Plane from '../coords/Plane.js';

import XYGrid from '../coords/XYGrid.js';

import XZGrid from '../coords/XZGrid.js';

import YZGrid from '../coords/YZGrid.js';

Content = class Content {
  constructor(main) {
    this.main = main;
    this.klass = this.constructor.name;
    if (this.main.opts.content != null) {
      this.opts = this.main.opts.content;
      if ((this.opts.plane != null) && this.opts.plane) {
        this.plane = this.drawPlane();
      }
      if ((this.opts.grids != null) && this.opts.grids) {
        this.grids = this.drawGrids();
      }
      if ((this.opts.axes != null) && this.opts.axes) {
        this.axes = this.drawAxes();
      }
      if ((this.opts['axeshelper'] != null) && this.opts['axeshelper']) {
        this.axesHelper = this.drawHelper();
      }
      if (this.opts.cube != null) {
        this.cube = this.drawCube(this.opts.cube);
      }
      if ((this.opts['rgb'] != null) && this.opts['rgb']) {
        this.drawRgb();
      }
      if ((this.opts['ysv'] != null) && this.opts['ysv']) {
        this.drawHsv(true);
      }
      if ((this.opts['hsv'] != null) && this.opts['hsv']) {
        this.drawHsv(false);
      }
    } else {
      this.grids = this.drawGrids();
      this.axes = this.drawAxes();
    }
    this.main.log(this.klass + '()', this);
  }

  drawHelper() {
    var axesHelper;
    axesHelper = new AxesHelper(20);
    this.main.addToScene(axesHelper);
    return axesHelper;
  }

  drawAxes() {
    var axes;
    axes = {};
    axes.xAxis = new XAxis(this.main, this);
    axes.yAxis = new YAxis(this.main, this);
    axes.zAxis = new ZAxis(this.main, this);
    return axes;
  }

  drawGrids() {
    var grids;
    grids = {};
    grids.xyGrid = new XYGrid(this.main, this);
    grids.xzGrid = new XZGrid(this.main, this);
    grids.yzGrid = new YZGrid(this.main, this);
    return grids;
  }

  // Need to work out
  drawPlane() {
    var group, plane;
    group = new Group();
    plane = new Plane(this.main, group, 'None');
    this.main.addToScene(group);
    return plane;
  }

  drawCube(opts) {
    var boxCube, boxGeometry, boxMaterial;
    boxGeometry = new BoxGeometry(opts.s, opts.s, opts.s);
    boxMaterial = new MeshStandardMaterial({
      color: 0x0000FF,
      emissive: 0x0a0a0a,
      side: DoubleSide // 0xaffe00
    });
    boxCube = new Mesh(boxGeometry, boxMaterial);
    boxCube.position.set(opts.x, opts.y, opts.y);
    boxCube.castShadow = true;
    boxCube.receiveShadow = false;
    this.main.addToScene(boxCube);
    return boxCube;
  }

  drawRgb() {
    var b, color, count, g, geometry, group, i, inMesh, inc, j, k, l, material, matrix, max, r, radius, ref, ref1, ref2, ref3, ref4, ref5, sc;
    radius = 8;
    i = 0;
    max = 256;
    inc = 32;
    sc = 1.0 / 255.0;
    count = Math.pow(max / inc + 1, 3);
    geometry = new SphereGeometry(radius, 16, 16);
    material = new MeshStandardMaterial();
    inMesh = new InstancedMesh(geometry, material, count);
    matrix = new Matrix4();
    color = new Color();
    group = new Group();
    for (r = j = 0, ref = max, ref1 = inc; ref1 !== 0 && (ref1 > 0 ? j <= ref : j >= ref); r = j += ref1) {
      for (g = k = 0, ref2 = max, ref3 = inc; ref3 !== 0 && (ref3 > 0 ? k <= ref2 : k >= ref2); g = k += ref3) {
        for (b = l = 0, ref4 = max, ref5 = inc; ref5 !== 0 && (ref5 > 0 ? l <= ref4 : l >= ref4); b = l += ref5) {
          matrix.setPosition(r, g, b);
          color.setRGB(r * sc, g * sc, b * sc);
          inMesh.setMatrixAt(i, matrix);
          inMesh.setColorAt(i, color);
          // console.log( 'Content.drawYsv()', { r:r, g:g, b:b, rgb:color.getStyle() } )
          i++;
        }
      }
    }
    group.add(inMesh);
    this.main.addToScene(group);
    this.main.log('Content.drawRgbs()', {
      i: i,
      count: count
    });
  }

  // alphaMap:0xFFFFFF } material.alphaMap = 0xFFFFFF Opaque
  drawHsv(ysv = true) {
    var color, count, geometry, group, h, hsv, hueInc, i, inMesh, j, k, l, material, matrix, radius, ref, rgb, s, sc, v, x, y, z;
    radius = 8;
    i = 0;
    sc = 1.0 / 255.0;
    hueInc = ysv ? 45 : 60;
    count = (360 / hueInc) * (100 / 10 + 1) * (100 / 10 + 1);
    geometry = new SphereGeometry(radius, 16, 16);
    material = new MeshLambertMaterial({
      transparent: false // {
    });
    inMesh = new InstancedMesh(geometry, material, count);
    matrix = new Matrix4();
    color = new Color();
    group = new Group();
    for (h = j = 0, ref = hueInc; ref !== 0 && (ref > 0 ? j < 360 : j > 360); h = j += ref) {
      for (s = k = 0; k <= 100; s = k += 10) {
        for (v = l = 0; l <= 100; v = l += 10) {
          x = vis.cos(h) * s * 2.0;
          y = vis.sin(h) * s * 2.0;
          z = v * 2.0;
          matrix.setPosition(x, y, z);
          hsv = ysv ? [h, s, v] : [h, s, v, 1];
          rgb = vis.rgb(hsv);
          color.setRGB(rgb.r * sc, rgb.g * sc, rgb.b * sc);
          inMesh.setMatrixAt(i, matrix);
          inMesh.setColorAt(i, color);
          // console.log( 'Content.drawYsv()', { h:h, s:s, v:v, rgb:rgb } )
          i++;
        }
      }
    }
    group.add(inMesh);
    this.main.addToScene(group);
    this.main.log('Content.drawYsv()', {
      i: i,
      count: count
    });
  }

  drawPoints(positions, colors, radius, group) {
    var geometry, material, points;
    geometry = new BufferGeometry();
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    material = new PointsMaterial({
      size: radius,
      vertexColors: true
    });
    points = new Points(geometry, material);
    group.add(points);
  }

  createPoint(position, color, radius) {
    var colors, geometry, material, point, positions;
    geometry = new BufferGeometry();
    positions = new Float32Array(position);
    colors = new Float32Array(color);
    geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new Float32BufferAttribute(colors, 3));
    geometry.computeBoundingSphere();
    material = new PointsMaterial({
      size: radius,
      vertexColors: true
    });
    point = new Points(geometry, material);
    this.main.addToScene(point);
    return point;
  }

  drawLine(x1, y1, z1, x2, y2, z2, color, group) {
    var geometry, line, material, points;
    points = [];
    points.push(new Vector3(x1, y1, z1));
    points.push(new Vector3(x2, y2, z2));
    geometry = new BufferGeometry().setFromPoints(points);
    material = new LineBasicMaterial({
      color: color
    });
    //aterial = new MeshStandardMaterial( { color:color, emissive:0x0a0a0a, side:DoubleSide } )
    line = new Line(geometry, material);
    line.receiveShadow = true;
    group.add(line);
  }

  dispose() {
    BufferGeometry.dispose();
    return Material.dispose();
  }

};

export default Content;

//# sourceMappingURL=Content.js.map
