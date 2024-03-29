
import { BoxGeometry, Mesh, BufferGeometry, Material, AxesHelper, # MeshBasicMaterial,
         Vector3, Line, LineBasicMaterial, Points, Color, Float32BufferAttribute,
         PointsMaterial, Group, MeshStandardMaterial, DoubleSide } from 'three'

import XAxis  from './XAxis.js'
import YAxis  from './YAxis.js'
import ZAxis  from './ZAxis.js'
import Plane  from './Plane.js'
import XYGrid from './XYGrid.js'
import XZGrid from './XZGrid.js'
import YZGrid from './YZGrid.js'
import MuseTh from '../muse/MuseTh.js'

class Coords

  constructor:( @main ) ->
    @klass      = @constructor.name
    if @main.opts.content?
      @opts       = @main.opts.content
      @plane      = @drawPlane()            if @opts.plane?         and @opts.plane
      @grids      = @drawGrids()            if @opts.grids?         and @opts.grids
      @axes       = @drawAxes()             if @opts.axes?          and @opts.axes
      @axesHelper = @drawHelper()           if @opts['axeshelper']? and @opts['axeshelper']
      @cube       = @drawCube( @opts.cube ) if @opts.cube?
      @museTh     = @drawMuse()             if @opts.muse?          and @opts.muse
      @drawRgbs()                           if @opts['rgbs']?       and @opts['rgbs']
    else
      @grids      = @drawGrids()
      @axes       = @drawAxes()
    console.log( @klass+'()', @ )

  drawHelper:() ->
    axesHelper = new AxesHelper( 250 );
    @main.addToScene( axesHelper )
    axesHelper

  drawAxes:() ->
    axes = {}
    axes.xAxis = new XAxis( @main, @ )
    axes.yAxis = new YAxis( @main, @ )
    axes.zAxis = new ZAxis( @main, @ )
    axes

  drawGrids:() ->
    grids = {}
    grids.xyGrid = new XYGrid( @main, @ )
    grids.xzGrid = new XZGrid( @main, @ )
    grids.yzGrid = new YZGrid( @main, @ )
    grids

  drawPlane:() ->
    new Plane( @main )

  drawCube:( opts ) ->
    boxGeometry = new BoxGeometry( opts.s, opts.s, opts.s )
    boxMaterial = new MeshStandardMaterial( { color:0x0000FF, emissive:0x0a0a0a, side:DoubleSide } )  # 0xaffe00
    boxCube     = new Mesh( boxGeometry, boxMaterial )
    boxCube.position.set( opts.x, opts.y, opts.y )
    boxCube.castShadow    = true
    boxCube.receiveShadow = false
    @main.addToScene( boxCube )
    boxCube

  drawRgbs:() ->
    group     = new Group()
    positions = []
    colors    = []
    color     = new Color()
    radius    =   8
    count     =   0
    max       = 256
    inc       =  16
    for     r in [0..max] by inc
      for   g in [0..max] by inc
        for b in [0..max] by inc
          #ositions.push( max-b, max-g, max-r )     # Axis switched
          positions.push( b,     g,     r )     # Axis switched
          color.setRGB(   r/255, g/255, b/255 )
          colors.push( color.r, color.g, color.b )
          @drawPoints( positions, colors, radius, group )
          count++
    @main.addToScene( group )
    @main.log( 'Content.drawRgbs()', { count:count, positions:positions.length, colors:colors.length } )
    return

  drawMuse:() ->
    museTh = new MuseTh( @main )
    museTh

  drawPoints:( positions, colors, radius, group ) ->
    geometry = new BufferGeometry()
    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
    geometry.setAttribute( 'color',    new Float32BufferAttribute( colors,    3 ) )
    geometry.computeBoundingSphere()
    material = new PointsMaterial( { size:radius, vertexColors:true } )
    points   = new Points( geometry, material )
    group.add( points )
    return

  createPoint:( position, color, radius ) ->
    geometry  = new BufferGeometry()
    positions = new Float32Array( position )
    colors    = new Float32Array( color    )
    geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
    geometry.setAttribute( 'color',    new Float32BufferAttribute( colors,    3 ) )
    geometry.computeBoundingSphere()
    material = new PointsMaterial( { size:radius, vertexColors:true } )
    point    = new Points( geometry, material )
    @main.addToScene( point )
    point

  drawLine:( x1, y1, z1, x2, y2, z2, color, group ) ->
    points = [];
    points.push( new Vector3( x1, y1, z1 ) )
    points.push( new Vector3( x2, y2, z2 ) )
    geometry = new BufferGeometry().setFromPoints( points )
    material = new LineBasicMaterial(    { color:color } )
    #aterial = new MeshStandardMaterial( { color:color, emissive:0x0a0a0a, side:DoubleSide } )
    line     = new Line( geometry, material )
    line.receiveShadow = true
    group.add( line )
    return

  dispose:() ->
    BufferGeometry.dispose()
    Material.dispose()

export default Coords
