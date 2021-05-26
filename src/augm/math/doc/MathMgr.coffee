
import Differ   from './Differ.js';
import Solves   from './Solves.js';
import Basics   from './Basics.js';

class MathMgr

  constructor:() ->
    @debug = true


  createExps:( page ) ->
    page.obj = @buildExps(page)
    expsa    = page['obj'].math()
    i = 0
    for own key, exp of expsa
      exp.klass = @klass(i)
      i++
    console.log( 'MathND.createExp()', { obj:page.obj, exps:expsa } ) if @debug
    expsa

  buildExps:( page ) ->
    return page.obj if page.obj?
    switch page.key
      when 'Basics'  then new Basics()
      when 'Differ'  then new Differ()
      when 'Solves'  then new Solves()
      else
        console.log( 'MathMgr.createExps() bad page.key', { pageKey:page.key, page:page } )
        Basics

    # Generate a row column layout class
    klass: ( i ) ->
      ncol = 3
      mod  = i       % ncol
      row  = (i-mod) / ncol + 1
      col  = mod + 1
      "r#{row}c#{col}"

export default MathMgr