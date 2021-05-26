
import Differ   from './Differ.js';
import Solves   from './Solves.js';
import Basics   from './Basics.js';

class MathMgr

  constructor:() ->
    @debug = false

  createExps:( page ) ->
    # page.obj = if not page.obj? then @buildExps(page.key) else page.obj # flaky but not sure why
    page.obj = @buildExps(page.key)
    expsa    = page.obj.math()
    i = 0
    for own key, exp of expsa
      exp.klass = @klass(i)
      i++
    console.log( 'MathND.createExp()', { obj:page.obj, exps:expsa } ) if @debug
    expsa

  buildExps:( key ) ->
    switch key
      when 'Basics'  then new Basics()
      when 'Differ'  then new Differ()
      when 'Solves'  then new Solves()
      else
        console.log( 'MathMgr.createExps() bad page.key', { key:key } )
        new Basics()

 # Generate a row column layout class
  klass: ( i ) ->
    ncol = 3
    mod  = i       % ncol
    row  = (i-mod) / ncol + 1
    col  = mod + 1
    "r#{row}c#{col}"

export default MathMgr