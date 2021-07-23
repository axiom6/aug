

class Data

  constructor:( @main ) ->
    @klass = @constructor.name
    @main.log( @klass+'()', @ )

export default Data