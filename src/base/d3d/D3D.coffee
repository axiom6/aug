
import SvgMgr   from '../../base/d3d/SvgMgr.js'
import Wheel    from './Wheel.js'
import Axes     from './Axes.js'
import Chord    from './Chord.js'
import Link     from './Link.js'
import Radar    from './Radar.js'
import Tree     from './Tree.js'
import Hue      from './Hue.js'

class D3D

  constructor:( @stream ) ->

  create:( name, elem ) ->
    svgMgr = new SvgMgr( name, elem, 'Comp', @stream )
    switch name
      when 'Wheel'   then new Wheel( svgMgr )
      when 'Axes'    then new Axes(  svgMgr )
      when 'Chord'   then new Chord( svgMgr )
      when 'Link'    then new Link(  svgMgr )
      when 'Radar'   then new Radar( svgMgr, 'Radar' )
      when 'Tree'    then new Tree(  svgMgr )
      when 'Hue'     then new Hue(   svgMgr, 'Hue' )
      else
        console.error( 'Draw.create(name) unknown name', name )
        new Axes( svgMgr )

export default D3D