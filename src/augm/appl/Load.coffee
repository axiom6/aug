
class Load

  constructor:() ->

  load:( name ) ->
    return switch( name )
      when 'GeomND' then @lazy('../../../vue/augm/geom/GeomND.vue')
      when 'MathND' then @lazy('../../../vue/augm/math/MathND.vue')
      when 'Draw'   then @lazy('../../../vue/augm/draw/Draw.vue')
      when 'Hues'   then @lazy('../../../vue/augm/mbox/Hues.vue')
      when 'Tools'  then @lazy('../../../vue/augm/tool/Tools.vue')
      when 'Cube'   then @lazy('../../../vue/augm/cube/Cube.vue')
      when 'Wood'   then @lazy('../../../vue/augm/wood/Wood.vue')
      else               @lazy('../../../vue/augm/appl/Appl.vue')

  lazy:( path ) -> () ->
    return `import( /* @vite-ignore */ path )`

export default Load