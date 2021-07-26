
import Choice   from '../../../lib/pub/nave/Choice.js'
import SvgMgr   from '../../../lib/pub/draw/SvgMgr.js'
import Wheel    from './Wheel.js'
import Axes     from './Axes.js'
import Chord    from './Chord.js'
import Link     from './Link.js'
import Radar    from './Radar.js'
import Tree     from './Tree.js'
import Hue      from './Hue.js'

class D3D

  D3D.create = ( name, elem, nav ) ->
    choice = new Choice( nav )
    svgMgr = new SvgMgr( name, elem, 'Comp' )
    switch name
      when 'Flavor'  then new Wheel(  svgMgr, choice, false )
      when 'Axes'    then new Axes(   svgMgr )
      when 'Chord'   then new Chord(  svgMgr )
      when 'Link'    then new Link(   svgMgr )
      when 'Radar'   then new Radar(  svgMgr, 'Radar', nav )
      when 'Tree'    then new Tree(   svgMgr, nav )
      when 'Hue'     then new Hue(    svgMgr, 'Hue' )
      else
        console.error( 'Draw.create(name) unknown name', name )
        new Axes( svgMgr )

export default D3D