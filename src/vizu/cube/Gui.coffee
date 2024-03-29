
import {vis} from '../draw/Vis.js'

class Gui

  constructor:( @act, @elem, @fun ) ->
    @dat = vis.getGlobal('dat')
    @gui = new @dat.GUI( { autoPlace: false })
    @elem.appendChild( @gui.domElement )
    @gui.remember(@act)
    @fun.slide  = () -> vis.noop()
    @fun.select = () -> vis.noop()
    @fun.num    = () -> vis.noop()
    @fun.str    = () -> vis.noop()
    @fun.color0 = () -> vis.noop()
    @fun.color1 = () -> vis.noop()
    @fun.color2 = () -> vis.noop()
    @fun.color3 = () -> vis.noop()
    @planes()
    @rows()
    @prin()
    @misc()
    @colors()

  check:( folder, obj, prop, onChange ) ->
    controller = folder.add( obj, prop )
    controller.onChange( onChange )
    return

  slider:( folder, obj, prop, onChange, min, max, step ) ->
    controller = folder.add( obj, prop ).min(min).max(max).step(step)
    controller.onFinishChange( onChange ) if onChange?
    return

  select:( folder, obj, prop, onChange, items ) ->
    controller = folder.add( obj, prop, items  )
    controller.onChange( onChange ) if onChange?
    return

  input:( folder, obj, prop, onChange ) ->
    controller = folder.add( obj, prop )
    controller.onFinishChange( onChange ) if onChange?
    return
    
  color:( folder, obj, prop, onChange ) ->
    controller = folder.addColor( obj, prop )
    controller.onChange( onChange ) if onChange?
    return

  planes:() ->
    folder = @gui.addFolder('Planes')
    @check(  folder, @act, 'Info', @fun.info )
    @check(  folder, @act, 'Know', @fun.know )
    @check(  folder, @act, 'Wise', @fun.wise )
    folder.open()
    return

  rows:() ->
    folder = @gui.addFolder('Rows')
    @check( folder, @act, 'Learn', @fun.learn )
    @check( folder, @act, 'Do',    @fun.do    )
    @check( folder, @act, 'Share', @fun.share )
    folder.open()
    return

  prin:() ->
    folder = @gui.addFolder('Prin')
    @check( folder, @act, 'Embrace',   @fun.embrace   )
    @check( folder, @act, 'Innovate',  @fun.innovate  )
    @check( folder, @act, 'Encourage', @fun.encourage )
    folder.open()
    return

  misc:() ->
    folder = @gui.addFolder('Misc')
    @slider( folder, @act, 'Slide',  @fun.slide,  0, 100, 10 )
    @select( folder, @act, 'Select', @fun.select, [ 'Life', 'Liberty', 'Happiness' ] )
    @input(  folder, @act, 'Num',    @fun.num )
    @input(  folder, @act, 'Str',    @fun.str )
    folder.open()
    return

  colors:() ->
    folder = @gui.addFolder('Colors')
    @color( folder, @act, 'Color0', @fun.color0 )
    @color( folder, @act, 'Color1', @fun.color1 )
    @color( folder, @act, 'Color2', @fun.color2 )
    @color( folder, @act, 'Color3', @fun.color3 )
    folder.open()
    return

`export default Gui`