
import GeomND  from '../../vue/geom/GeomND.vue'
import MathND  from '../../vue/math/MathND.vue'
import Draw    from '../../vue/draw/Draw.vue'
import Hues    from '../../vue/draw/Hues.vue'
import Cube    from '../../vue/cube/Cube.vue'
import Wood    from '../../vue/wood/Wood.vue'
import Home    from '../../vue/appl/Home.vue'

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

  addScript:( src ) ->       # "/lib/mbox/mathbox-bundle.js"
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