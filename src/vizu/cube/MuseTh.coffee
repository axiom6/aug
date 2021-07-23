
import Util   from '../../lib/pub/base/util/Util.js'
import Build  from '../../lib/pub/base/util/Build.js'
import Cube3D from './Cube3D.js'
import Rect3D from './Rect3D.js'
import {  AxesHelper, Font, Group, MeshLambertMaterial, DoubleSide, BoxGeometry, Mesh } from 'three'

class MuseTh

  constructor:( @main ) ->
    @debug = @main.debug
    @build = new Build( @main.mix.batch() )
    @axes  = new AxesHelper( 2 )
    @main.addToScene( @axes )
    console.log( 'MuseTh() batch', @main.mix.batch()  ) if @debug
    @fontPrac = new Font( @main.mix.batch().Font.data )
    @aspectRatio = @main.aspectRatio
    @group = @ikw()

  deg2rad:( degree ) ->
   degree*(Math.PI/180)

  space:() ->
    sp = {}
    sp.modelRatio    =  @aspectRatio / 2
    sp.cubeSize      =  144
    sp.cubeWidth     =  sp.cubeSize * 2.0
    sp.cubeHeight    =  sp.cubeSize * sp.modelRatio * 0.8
    sp.colsHeight    =  sp.cubeSize * sp.modelRatio * 0.5

    sp.cubeDepth     =  sp.cubeSize
    sp.cubeHalf      =  sp.cubeSize   / 2
    sp.horzSpace     =  sp.cubeSize   * 2 / 3
    sp.vertSpace     =  sp.horzSpace  * sp.modelRatio
    sp.zzzzSpace     =  sp.horzSpace
    sp.colsDepth     =  sp.cubeSize * 3 + sp.zzzzSpace * 2
    sp.x1            =  sp.cubeWidth  + sp.horzSpace
    sp.x2            =  0
    sp.x3            = -sp.cubeWidth  - sp.horzSpace
    sp.yc            =  sp.cubeHeight + sp.vertSpace * 2.2
    sp.y1            =  sp.cubeHeight + sp.vertSpace
    sp.y2            =     0
    sp.y3            = -sp.cubeHeight - sp.vertSpace
    sp.z1            =  sp.cubeDepth  + sp.zzzzSpace
    sp.z2            =  0
    sp.z3            = -sp.cubeDepth  - sp.zzzzSpace
    sp.zc            =  0
    sp.studyWidth    =  sp.cubeWidth  / 3
    sp.studyHeight   =  sp.cubeHeight / 3
    sp.sw            =  sp.studyWidth
    sp.sh            =  sp.studyHeight
    sp.cw            =  sp.studyWidth
    sp.ch            =  sp.studyHeight * 0.5
    sp.sx            = { center:0, west:-sp.sw, north:0,         east:sp.sw, south:0          }
    sp.sy            = { center:0, west:0,      north:sp.sh,     east:0,     south:-sp.sh     }
    sp.cx            = { center:0, west:-sp.sw, north:0,         east:sp.sw, south:0          }
    sp.cy            = { center:0, west:0,      north:sp.sh*0.5, east:0,     south:-sp.sh*0.5 }
    console.log( 'MuseTh.space()', sp ) if @debug
    sp

  ikw: () ->
    sp    = @space()
    group = new Group()
    for plane   in [ { name:'Info',    z:sp.z1 }, { name:'Know',     z:sp.z2 }, { name:'Wise',      z:sp.z3 } ]
      for row   in [ { name:'Learn',   y:sp.y1 }, { name:'Do',       y:sp.y2 }, { name:'Share',     y:sp.y3 } ]
        for col in [ { name:'Embrace', x:sp.x3 }, { name:'Innovate', x:sp.x2 }, { name:'Encourage', x:sp.x1 } ]
          practice  = @build.getPractice( row.name, col.name, plane.name )
          console.log( 'MuseTh.ikw()',
            { practice:practice, name:practice.name, row:row.name, col:col.name, plane:plane.name } )  if false
          pracCube  = new Cube3D( plane.name, row.name, col.name, practice.name, [col.x,row.y,plane.z],
            [sp.cubeWidth,sp.cubeHeight,sp.cubeDepth],practice['hsv'], 0.6, @fontPrac )
          pracGroup = new Group()
          pracGroup.add( pracCube.mesh  )
          for key, study of practice when Util.isChild(key)
            x = col.x + sp.sx[study.dir]
            y = row.y + sp.sy[study.dir]
            z = plane.z
            studyCube = new Rect3D( plane.name, row.name, col.name, study.name, [x,y,z], [sp.sw,sp.sh],study['hsv'], 1.0, @fontPrac, 0x000000 )
            pracGroup.add( studyCube.mesh  )
          group.add( pracGroup )
    group.add( @prin() )
    @convey(  sp, group )
    @flow(    sp, group )
    @conduit( sp, group )
    group.material = new MeshLambertMaterial( { color:0x888888, transparent:true, opacity:0.5, side:DoubleSide } )
    group.rotation.set( 0, 0, 0 )
    group.position.set( 0, 0, 0 )
    group.scale.set(    1, 1, 1 )
    @main.addToScene( group )
    group

  prin: () ->
    sp    = @space()
    group = new Group()
    for col in [ { name:'Embrace', x:sp.x3 }, { name:'Innovate', x:sp.x2 }, { name:'Encourage', x:sp.x1 } ]
      practice  = @build.getCol( col.name )
      pracCube  = new Cube3D( 'Prin', 'Dim', col.name, col.name, [col.x,sp.yc,sp.zc],
        [sp.cubeWidth,sp.colsHeight,sp.colsDepth],practice['hsv'], 0.6, @fontPrac )
      pracGroup = new Group()
      pracGroup.add( pracCube.mesh  )
      for plane in [ { name:'Info', z:sp.z1 }, { name:'Know', z:sp.z2 }, { name:'Wise', z:sp.z3 } ]
        x = col.x
        y = sp.yc
        z = plane.z
        studyCube = new Rect3D( plane, 'Dim', col.name, col.name, [x,y,z], [sp.cw,sp.ch], [0,0,0], 0.0, @fontPrac, 0xFFFFFF )
        pracGroup.add( studyCube.mesh  )
        for key, study of practice when Util.isChild(key)
          x = col.x + sp.cx[study.dir]
          y = sp.yc + sp.cy[study.dir]
          z = plane.z
          studyCube = new Rect3D( 'Prin', 'Dim', col.name, key, [x,y,z], [sp.cw,sp.ch],study['hsv'], 1.0, @fontPrac, 0x000000 )
          pracGroup.add( studyCube.mesh  )
      group.add( pracGroup )
    group.material = new MeshLambertMaterial( { color:0x888888, transparent:true, opacity:0.5, side:DoubleSide } )
    group.rotation.set( 0, 0, 0 )
    group.position.set( 0, 0, 0 )
    group.scale.set(    1, 1, 1 )
    @main.addToScene( group )
    group

  convey:( sp, group ) ->
    hsv = [0,50,50]
    w =   sp.horzSpace
    h =   sp.studyHeight
    x = ( sp.cubeWidth + w ) / 2
    for plane   in [ { name:'Info',    z:sp.z1 },   { name:'Know',     z:sp.z2 }, { name:'Wise',     z:sp.z3 } ]
      for row   in [ { name:'Learn',   y:sp.y1 },   { name:'Do',       y:sp.y2 }, { name:'Share',    y:sp.y3 } ]
        for col in [ { name:'Embrace', x:sp.x3+x }, { name:'Innovate', x:sp.x2+x } ]
          practice  = @build.getPractice( row.name, col.name, plane.name )
          name = @build.connectName( practice, 'east', false )
          rect = new Rect3D( plane.name, row.name, col.name, name, [col.x,row.y,plane.z], [w,h],hsv, 0.7, @fontPrac, 0xFFFFFF  )
          group.add( rect.mesh )
    return

  flow:( sp, group ) ->
    hsv = [0,50,50]
    w =   sp.studyWidth
    h =   sp.vertSpace
    y = ( sp.cubeHeight + h ) / 2
    for plane   in [ { name:'Info',    z:sp.z1 },  { name:'Know',     z:sp.z2   }, { name:'Wise',      z:sp.z3 } ]
      for row   in [ { name:'Learn',   y:sp.y1-y}, { name:'Do',       y:sp.y2-y } ]
        for col in [ { name:'Embrace', x:sp.x3},   { name:'Innovate', x:sp.x2   }, { name:'Encourage', x:sp.x1 } ]
          practice  = @build.getPractice( row.name, col.name, plane.name )
          name = @build.connectName( practice, 'south', false )
          rect = new Rect3D( plane.name, row.name, col.name, name, [col.x,row.y,plane.z], [w,h],hsv, 0.7, @fontPrac, 0xFFFFFF  )
          group.add( rect.mesh )
    return

  conduit:( sp, group ) ->
    hsv = [0,50,50]
    w =   sp.studyWidth
    h =   sp.zzzzSpace
    z = ( sp.cubeDepth + h ) / 2
    for plane   in [ { name:'Info', z:sp.z1-z }, { name:'Know', z:sp.z2-z } ]
      for row   in [ { name:'Learn',       y:sp.y1 },   { name:'Do',        y:sp.y2   }, { name:'Share',    y:sp.y3 } ]
        for col in [ { name:'Embrace',     x:sp.x3 },   { name:'Innovate',  x:sp.x2   }, { name:'Encourage',x:sp.x1 } ]
          practice  = @build.getPractice( row.name, col.name, plane.name )
          name = @build.connectName( practice, 'next', true )
          rect = new Rect3D( plane.name, row.name, col.name, name, [0,0,0], [w,h],hsv, 0.7, @fontPrac, 0xFFFFFF )
          rect.mesh.rotation.x = -Math.PI / 2
          rect.mesh.position.x = col.x
          rect.mesh.position.y = row.y
          rect.mesh.position.z = plane.z
          group.add( rect.mesh )
    return


  traverse:( prop, name, act ) =>
    act[name] = not act[name] if @stream?
    console.log( 'MuseTh.traverse()', { prop:prop, name:name, visible:act[name] } )  if @debug
    reveal = (child) =>
      console.log( 'MuseTh.traverse.beg', { name:child.name, tprop:prop, cprop:child[prop], value:value, visible:child.visible } ) if @debug
        if child[prop]? and child[prop] is name
           child.visible = act[name]
        console.log( 'MuseTh.traverse.end', { name:child.name, geom:child.geom, prop:prop, value:value, visible:child.visible } ) if @debug
      @group.traverse( reveal ) if @group?
    return

  createAct:( group ) ->
    {
      Info    : true, Know      : true, Wise      : true,
      Learn   : true, Do        : true, Share     : true,
      Embrace : true, Innovate  : true, Encourage : true,
      Opacity:group.material.opacity, Color:group.material.color,
      RotationX:group.rotation.x, RotationY:group.rotation.y, RotationZ:group.rotation.z,
      PositionX:0, PositionY:0,  PositionZ:0,
      ScaleX:1,    ScaleY:1,     ScaleZ:1
    }

  createTraversals:( act ) ->
    {
      info:      () => @traverse( 'plane', 'Info',      act )
      know:      () => @traverse( 'plane', 'Know',      act )
      wise:      () => @traverse( 'plane', 'Wise',      act )
      learn:     () => @traverse( 'row',   'Learn',     act )
      doDo:      () => @traverse( 'row',   'Do',        act )
      share:     () => @traverse( 'row',   'Share',     act )
      embrace:   () => @traverse( 'col',   'Embrace',   act )
      innovate:  () => @traverse( 'col',   'Innovate',  act )
      encourage: () => @traverse( 'col',   'Encourage', act )
    }

  ui:( group, guiElem ) ->

    act       = @createAct( group )
    traverals = @createTraversals( act )

    dat = Util.getGlobal('dat')
    gui = dat.GUI( { autoPlace: false } )
    guiElem.appendChild( gui.domElement )

    f1 = gui.addFolder('Planes')
    f1.add( act, 'Info' ).onChange( traverals.info )
    f1.add( act, 'Know' ).onChange( traverals.know )
    f1.add( act, 'Wise' ).onChange( traverals.wise )

    f2 = gui.addFolder('Rows')
    f2.add( act, 'Learn' ).onChange( traverals.learn )
    f2.add( act, 'Do'    ).onChange( traverals.doDo  )
    f2.add( act, 'Share' ).onChange( traverals.share )

    f3 = gui.addFolder('Prin')
    f3.add( act, 'Embrace'   ).onChange( traverals.embrace   )
    f3.add( act, 'Innovate'  ).onChange( traverals.innovate  )
    f3.add( act, 'Encourage' ).onChange( traverals.encourage )

    f4 = gui.addFolder('Rotation')
    f4.add( act, 'RotationX', -180, 180 ).onChange( () => group.rotation.x = @deg2rad(act.RotationX) )
    f4.add( act, 'RotationY', -180, 180 ).onChange( () => group.rotation.y = @deg2rad(act.RotationY) )
    f4.add( act, 'RotationZ', -180, 180 ).onChange( () => group.rotation.z = @deg2rad(act.RotationZ) )

    f5 = gui.addFolder('Position');
    f5.add( act, 'PositionX', -500, 500 ).onChange( () -> group.position.x = act.PositionX )
    f5.add( act, 'PositionY', -500, 500 ).onChange( () -> group.position.y = act.PositionY )
    f5.add( act, 'PositionZ', -500, 500 ).onChange( () -> group.position.z = act.PositionZ )

    f6 = gui.addFolder('Scale')
    f6.add( act, 'ScaleX', 0.1, 5 ).onChange( () -> group.scale.x = act.ScaleX )
    f6.add( act, 'ScaleY', 0.1, 5 ).onChange( () -> group.scale.y = act.ScaleY )
    f6.add( act, 'ScaleZ', 0.1, 5 ).onChange( () -> group.scale.z = act.ScaleZ )

    [gui,act]

  geom:() ->

    color    = 0x888888 # Guess
    geometry = new BoxGeometry( 2, 2, 2 )
    material = new MeshLambertMaterial({ color:color, transparent:true } )
    mesh     = new Mesh(geometry, material)
    mesh.position.set(0, 0, 0)
    mesh.rotation.set(0, 0, 0)
    mesh.rotation.y = @deg2rad(-90)
    mesh.scale.set(1, 1, 1)
    mesh.doubleSided = true
    mesh.castShadow = true
    @main.addToScene(mesh)

    geometry2 = new BoxGeometry( 1, 1, 1 )
    material2 = new MeshLambertMaterial({ color:color, transparent:true } )
    mesh2     = new Mesh(geometry2, material2)
    @main.addToScene(mesh2)
    return

export default MuseTh

