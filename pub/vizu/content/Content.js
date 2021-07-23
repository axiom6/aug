var Content;

import {
  BoxGeometry,
  Mesh,
  BufferGeometry,
  Material,
  AxesHelper, // MeshBasicMaterial,
  Vector3,
  Line,
  LineBasicMaterial,
  Points,
  Color,
  Float32BufferAttribute,
  PointsMaterial,
  Group,
  MeshStandardMaterial,
  DoubleSide
} from 'three';

import XAxis from '../coords/XAxis.js';

import YAxis from '../coords/YAxis.js';

import ZAxis from '../coords/ZAxis.js';

import Plane from '../coords/Plane.js';

import XYGrid from '../coords/XYGrid.js';

import XZGrid from '../coords/XZGrid.js';

import YZGrid from '../coords/YZGrid.js';

import MuseTh from '../muse/MuseTh.js';

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
      if ((this.opts.muse != null) && this.opts.muse) {
        this.museTh = this.drawMuse();
      }
      if ((this.opts['rgbs'] != null) && this.opts['rgbs']) {
        this.drawRgbs();
      }
    } else {
      this.grids = this.drawGrids();
      this.axes = this.drawAxes();
    }
    console.log(this.klass + '()', this);
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

  drawRgbs() {
    var b, color, colors, count, g, group, i, inc, j, k, max, positions, r, radius, ref, ref1, ref2, ref3, ref4, ref5;
    group = new Group();
    positions = [];
    colors = [];
    color = new Color();
    radius = 8;
    count = 0;
    max = 256;
    inc = 16;
    for (r = i = 0, ref = max, ref1 = inc; ref1 !== 0 && (ref1 > 0 ? i <= ref : i >= ref); r = i += ref1) {
      for (g = j = 0, ref2 = max, ref3 = inc; ref3 !== 0 && (ref3 > 0 ? j <= ref2 : j >= ref2); g = j += ref3) {
        for (b = k = 0, ref4 = max, ref5 = inc; ref5 !== 0 && (ref5 > 0 ? k <= ref4 : k >= ref4); b = k += ref5) {
          //ositions.push( max-b, max-g, max-r )     # Axis switched
          positions.push(b, g, r); // Axis switched
          color.setRGB(r / 255, g / 255, b / 255);
          colors.push(color.r, color.g, color.b);
          this.drawPoints(positions, colors, radius, group);
          count++;
        }
      }
    }
    this.main.addToScene(group);
    this.main.log('Content.drawRgbs()', {
      count: count,
      positions: positions.length,
      colors: colors.length
    });
  }

  drawMuse() {
    var museTh;
    museTh = new MuseTh(this.main);
    return museTh;
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
