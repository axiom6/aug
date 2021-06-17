
import SvgMgr   from '../../../lib/pub/base/draw/SvgMgr.js'
import Wheel    from './Wheel.js'
import Axes     from './Axes.js'
import Chord    from './Chord.js'
import Link     from './Link.js'
import Radar    from './Radar.js'
import Tree     from './Tree.js'
import Hue      from './Hue.js'

class D3D

  D3D.onChoice = ( choice, checked ) ->
    console.log( 'D3D.onChoice()', { choice:choice, checked:checked } )
    return
    
  D3D.create = ( name, elem, mix ) ->
    svgMgr = new SvgMgr( name, elem, 'Comp' )
    switch name
      when 'Flavor'  then new Wheel(  svgMgr, D3D.onChoice, mix, false )
      when 'Axes'    then new Axes(   svgMgr )
      when 'Chord'   then new Chord(  svgMgr )
      when 'Link'    then new Link(   svgMgr )
      when 'Radar'   then new Radar(  svgMgr, 'Radar', mix )
      when 'Tree'    then new Tree(   svgMgr, mix )
      when 'Hue'     then new Hue(    svgMgr, 'Hue' )
      else
        console.error( 'Draw.create(name) unknown name', name )
        new Axes( svgMgr )

export default D3D