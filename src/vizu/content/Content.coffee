
import { BoxGeometry, Mesh, BufferGeometry, SphereGeometry, Material, AxesHelper,
         Vector3, Line, LineBasicMaterial, Points, Color, Float32BufferAttribute,
         PointsMaterial, MeshStandardMaterial, Group, DoubleSide, InstancedMesh,
         MeshPhongMaterial, Matrix4 } from 'three'

#mport {vis}  from '../../../lib/pub/draw/Vis.js'
import XAxis  from '../coords/XAxis.js'
import YAxis  from '../coords/YAxis.js'
import ZAxis  from '../coords/ZAxis.js'
import Plane  from '../coords/Plane.js'
import XYGrid from '../coords/XYGrid.js'
import XZGrid from '../coords/XZGrid.js'
import YZGrid from '../coords/YZGrid.js'

class Content

  constructor:( @main ) ->
    @klass        = @constructor.name
    if @main.opts.content?
      @opts       = @main.opts.content
      @plane      = @drawPlane()            if @opts.plane?         and @opts.plane
      @grids      = @drawGrids()            if @opts.grids?         and @opts.grids
      @axes       = @drawAxes()             if @opts.axes?          and @opts.axes
      @axesHelper = @drawHelper()           if @opts['axeshelper']? and @opts['axeshelper']
      @cube       = @drawCube( @opts.cube ) if @opts.cube?
      @drawRgbs()                           if @opts['rgbs']?       and @opts['rgbs']
    else
      @grids      = @drawGrids()
      @axes       = @drawAxes()
    @main.log( @klass+'()', @ )

  drawHelper:() ->
    axesHelper = new AxesHelper( 20 );
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

  # Need to work out
  drawPlane:() ->
    group = new Group()
    plane = new Plane( @main, group, 'None' )
    @main.addToScene( group )
    plane

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
    radius   = 8
    i        = 0
    max      = 256
    inc      =  32
    s        = 1.0 / 255.0
    count    = Math.pow((max/inc+1),3)
    geometry = new SphereGeometry( radius, 16, 16 )
    material = new MeshPhongMaterial()
    inMesh   = new InstancedMesh( geometry, material, count )
    matrix   = new Matrix4()
    color    = new Color()
    group    = new Group()
    for     r in [0..max] by inc
      for   g in [0..max] by inc
        for b in [0..max] by inc
          matrix.setPosition( r, g, b );
          color.setRGB( r*s, g*s, b*s )
          #olor.setStyle( vis.css({r:r,g:g,b:b}))
          inMesh.setMatrixAt( i, matrix )
          inMesh.setColorAt(  i, color  )
          i++
    group.add( inMesh )
    @main.addToScene( group )
    @main.log( 'Content.drawRgbs()', { i:i, count:count } )
    return

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

export default Content
