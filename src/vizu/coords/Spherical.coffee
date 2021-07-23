
class Spherical
  
  # radius, long = longitude, lat = latitude

  constructor:( @main ) ->
    @klass     = @constructor.name
    @opts      = @main.opts
    @cartesian = @main.cartesian
    @radius    = if @opts.radius? then @opts.radius? else @cartesian.xmax
    @long1     = if @opts.long1?  then @opts.long1?  else  90 # Degrees
    @long2     = if @opts.long2?  then @opts.long2?  else  30 # Degrees
    @lat1      = if @opts.lat1?   then @opts.lat1?   else  90 # Degrees
    @lat2      = if @opts.lat2?   then @opts.lat2?   else  30 # Degrees
    @main.log( @klass+'()', @ )

export default Spherical