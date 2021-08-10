
import { BoxGeometry, Mesh, BufferGeometry, SphereGeometry, Material, AxesHelper,
         Vector3, Line, LineBasicMaterial, Points, Color, Float32BufferAttribute,
         PointsMaterial, MeshStandardMaterial, Group, DoubleSide, FrontSide, InstancedMesh,
         MeshBasicMaterial,  Matrix4 } from 'three'  # MeshLambertMaterial,

import {vis}   from '../../../lib/pub/draw/Vis.js'
import XAxis   from '../coords/XAxis.js'
import YAxis   from '../coords/YAxis.js'
import ZAxis   from '../coords/ZAxis.js'
import Plane   from '../coords/Plane.js'
import XYGrid  from '../coords/XYGrid.js'
import XZGrid  from '../coords/XZGrid.js'
import YZGrid  from '../coords/YZGrid.js'
import Surface from './Surface.js'
import Hexagon from './Hexagon.js'


class Content

  constructor:( @main ) ->
    @klass        = @constructor.name
    @surface      = new Surface( @main )
    @hexagon      = new Hexagon( @main )
    if @main.opts.content?
      @opts       = @main.opts.content
      @plane      = @drawPlane()            if @opts.plane?         and @opts.plane
      @grids      = @drawGrids()            if @opts.grids?         and @opts.grids
      @axes       = @drawAxes()             if @opts.axes?          and @opts.axes
      @axesHelper = @drawHelper()           if @opts['axeshelper']? and @opts['axeshelper']
      @cube       = @drawCube( @opts.cube ) if @opts.cube?
      @drawRgb()                            if @opts['rgb']?        and @opts['rgb']
      @drawRbgFaces()                       if @opts['face']?       and @opts['face']
      @drawHsv( true  )                     if @opts['ysv']?        and @opts['ysv']
      @drawHsv( false )                     if @opts['hsv']?        and @opts['hsv']
      @drawHues( @main.pageKey, true  )     if @opts['hues']?       and @opts['hues']
      @surface.drawHsv()                    if @opts['surface']?    and @opts['surface']
      @hexagon.drawHsv()                    if @opts['hexagon']?    and @opts['hexagon']
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

  drawRgb:() ->
    radius   = 8
    i        = 0
    max      = 256
    inc      =  32
    count    = Math.pow((max/inc+1),3)
    geometry = new SphereGeometry( radius, 16, 16 )
    material = new MeshBasicMaterial( { transparent:false, side:FrontSide } )
    inMesh   = new InstancedMesh( geometry, material, count )
    matrix   = new Matrix4()
    color    = new Color()
    group    = new Group()
    for     r in [0..max] by inc
      for   g in [0..max] by inc
        for b in [0..max] by inc
          i = @rgbSet( r, g, b, matrix, color, inMesh, i )
    group.add( inMesh )
    @main.addToScene( group )
    console.log( 'Content.drawRgbs()', { i:i, count:count } )
    return

  rgbSet:( r,g,b, matrix, color, inMesh, i ) ->
    sc = 1.0 / 255.0
    matrix.setPosition( r, g, b );
    color.setRGB( r*sc, g*sc, b*sc )
    inMesh.setMatrixAt( i, matrix )
    inMesh.setColorAt(  i, color  )
    # console.log( 'Content.drawYsv()', { r:r, g:g, b:b, rgb:color.getStyle() } )
    i++
    i

  drawRbgFaces:() ->
    radius   = 8
    i        = 0
    max      = 256
    inc      =  32
    count    = Math.pow((max/inc+1),2)*6
    geometry = new SphereGeometry( radius, 16, 16 )
    material = new MeshBasicMaterial( { transparent:false, side:FrontSide } )
    inMesh   = new InstancedMesh( geometry, material, count )
    matrix   = new Matrix4()
    color    = new Color()
    group    = new Group()
    i = @rgbRG( matrix, color, inMesh, i, max, inc )
    i = @rgbRB( matrix, color, inMesh, i, max, inc )
    i = @rgbGB( matrix, color, inMesh, i, max, inc )
    group.add( inMesh )
    @main.addToScene( group )
    console.log( 'Content.drawRbgFaces()', { i:i, count:count } )
    return

  rgbRG:( matrix, color, inMesh, i, max, inc ) ->
    for     r in [0..max] by inc
      for   g in [0..max] by inc
        for b in [0, max]
          i = @rgbSet( r, g, b, matrix, color, inMesh, i )
    i

  rgbRB:( matrix, color, inMesh, i, max, inc ) ->
    for     r in [0..max] by inc
      for   g in [0, max]
        for b in [0..max] by inc
          i = @rgbSet( r, g, b, matrix, color, inMesh, i )
    i

  rgbGB:( matrix, color, inMesh, i, max, inc ) ->
    for     r in [0, max]
      for   g in [0..max] by inc
        for b in [0..max] by inc
          i = @rgbSet( r, g, b, matrix, color, inMesh, i )
    i

  # alphaMap:0xFFFFFF } material.alphaMap = 0xFFFFFF Opaque
  drawHsv:( ysv=true ) ->
    radius   = 8
    i        = 0
    sc       = 1.0 / 255.0
    hueInc   = if ysv then 45 else 60
    count    = (360/hueInc)*(100/10+1)*(100/10+1)
    geometry = new SphereGeometry( radius, 16, 16 )
    material = new MeshBasicMaterial( { transparent:false, side:FrontSide } )
    inMesh   = new InstancedMesh( geometry, material, count )
    matrix   = new Matrix4()
    color    = new Color()
    group    = new Group()
    for     h in [0...360] by hueInc
      for   s in [0..100]  by 10
        for v in [0..100]  by 10
          x = vis.cos(h) * s * 2.0
          y = vis.sin(h) * s * 2.0
          z = v              * 2.0
          matrix.setPosition( x, y, z )
          hsv = if ysv then [h,s,v,"HMI"] else [h,s,v,"HMIR"]
          rgb = vis.rgb( hsv )
          color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
          inMesh.setMatrixAt( i, matrix )
          inMesh.setColorAt(  i, color  )
          # console.log( 'Content.drawYsv()', { h:h, s:s, v:v, rgb:rgb } )
          i++
    group.add( inMesh )
    @main.addToScene( group )
    @main.log( 'Content.drawYsv()', { i:i, count:count } )
    return

  drawHues:( pageKey, ysv=true ) ->
    hue      = vis.hue( pageKey, ysv )
    radius   = 8
    i        = 0
    sc       = 1.0 / 255.0
    count    = (100/10+1)*(100/10+1)
    geometry = new SphereGeometry( radius, 16, 16 )
    material = new MeshBasicMaterial( { transparent:false, side:FrontSide } )
    inMesh   = new InstancedMesh( geometry, material, count )
    matrix   = new Matrix4()
    color    = new Color()
    group    = new Group()
    for   s in [0..100]  by 10
      for v in [0..100]  by 10
        x = s * 2.0
        y = v * 2.0
        z = 0
        matrix.setPosition( x, y, z )
        hsv = if ysv then [hue,s,v,"HMI"] else [hue,s,v,"HMIR"]
        rgb = vis.rgb( hsv )
        color.setRGB( rgb.r*sc, rgb.g*sc, rgb.b*sc )
        inMesh.setMatrixAt( i, matrix )
        inMesh.setColorAt(  i, color  )
        # console.log( 'Content.drawYsv()', { hue:hue, s:s, v:v, rgb:rgb } )
        i++
    group.add( inMesh )
    @main.addToScene( group )
    @main.log( 'Content.drawHues()', { i:i, count:count } )
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
