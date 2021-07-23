
class Lines

  constructor:( @main ) ->
    @klass = @constructor.name
    @main.log( @klass+'()', @ )

export default Lines