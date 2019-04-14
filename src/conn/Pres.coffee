
import Shapes    from '../pres/Shapes.js'
import Embrace   from '../pres/Embrace.js'
import Innovate  from '../pres/Innovate.js'
import Encourage from '../pres/Encourage.js'

class Pres

  constructor:( @ui, @stream, @pane, @build ) ->
    @shapes = new Shapes( @stream, @ )

  createDraw:( pane ) ->
    spec = pane.spec
    if @ui.planeName isnt 'Data'
      switch spec.column
        when 'Embrace'   then new Embrace(   @ui, spec, @ )
        when 'Innovate'  then new Innovate(  @ui, spec, @ )
        when 'Encourage' then new Encourage( @ui, spec, @ )
        else                  new Embrace(   @ui, spec, @ )
    else
      new Innovate(  @ui, spec, @ )

`export default Pres`
