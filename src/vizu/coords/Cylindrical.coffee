

class Cylindrical

  constructor:( @main ) ->
    @klass = @constructor.name
    @opts      = @main.opts
    @cartesian = @main.cartesian
    @radius = if @opts.radius? then @opts.radius? else @cartesian.xmax
    @height = if @opts.height? then @opts.height? else @cartesian.ymax
    @dtick1 = if @opts.dtick1? then @opts.dtick1? else  90              # Degrees
    @dtick2 = if @opts.dtick2? then @opts.dtick2? else  30              # Degrees
    @rtick1 = if @opts.rtick1? then @opts.rtick1? else @radius * 0.10
    @rtick2 = if @opts.rtick2? then @opts.rtick2? else @radius * 0.01
    @htick1 = if @opts.htick1? then @opts.htick1? else @height * 0.10
    @htick2 = if @opts.htick2? then @opts.htick2? else @height * 0.01
    @main.log( @klass+'()', @ )

export default Cylindrical