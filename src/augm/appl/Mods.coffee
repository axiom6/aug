
import GeomND  from '../../../vue/augm/geom/GeomND.vue'
import MathND  from '../../../vue/augm/math/MathND.vue'
import Draw    from '../../../vue/augm/draw/Draw.vue'
import Hues    from '../../../vue/augm/mbox/Hues.vue'
import Cube    from '../../../vue/augm/cube/Cube.vue'
import Wood    from '../../../vue/augm/wood/Wood.vue'
import Home    from '../../../vue/augm/appl/Augm.vue'

class Load

  constructor:() ->
    @addScript("/assets/mathbox-bundle.js")

  load:( name ) ->
    return switch( name )
      when 'GeomND' then GeomND
      when 'MathND' then MathND
      when 'Draw'   then Draw
      when 'Hues'   then Hues
      when 'Cube'   then Cube
      when 'Wood'   then Wood
      else               Home

  addScript:( src ) ->   
    scripts    = document.getElementsByTagName('script');
    for scriptx in scripts
      # console.log( 'Mods.addScript() scriptx src', scriptx.src )
      return if scriptx.src.includes(src)
    # console.log( 'Mods.addScript() adding', src )
    script     = document.createElement('script')
    script.src = src
    document.getElementsByTagName("head")[0].appendChild(script)
    return

export default Load