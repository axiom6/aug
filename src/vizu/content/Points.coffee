
class Points

  constructor:( @main ) ->
    @klass = @constructor.name
    @main.log( @klass+'()', @ )

export default Points