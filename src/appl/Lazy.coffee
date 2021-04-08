
class Load

  constructor:() ->

  load:( name ) ->
    return switch( name )
      when 'GeomND' then @lazy('../../vue/geom/GeomND.vue')
      when 'MathND' then @lazy('../../vue/math/MathND.vue')
      when 'Draw'   then @lazy('../../vue/draw/Draw.vue')
      when 'Hues'   then @lazy('../../vue/draw/Hues.vue')
      when 'Cube'   then @lazy('../../vue/cube/Cube.vue')
      when 'Wood'   then @lazy('../../vue/wood/Wood.vue')
      else               @lazy('../../vue/appl/Home.vue')

  lazy:( path ) -> () ->
    return `import( /* @vite-ignore */ path )`

export default Load