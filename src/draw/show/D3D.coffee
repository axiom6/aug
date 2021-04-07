
import SvgMgr   from '../base/SvgMgr.js'
import Flavor   from './Flavor.js'
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
      when 'Flavor'  then new Flavor( svgMgr, D3D.onChoice, mix )
      when 'Axes'    then new Axes(   svgMgr )
      when 'Chord'   then new Chord(  svgMgr )
      when 'Link'    then new Link(   svgMgr )
      when 'Radar'   then new Radar(  svgMgr, 'Radar' )
      when 'Tree'    then new Tree(   svgMgr )
      when 'Hue'     then new Hue(    svgMgr, 'Hue' )
      else
        console.error( 'Draw.create(name) unknown name', name )
        new Axes( svgMgr )

export default D3D