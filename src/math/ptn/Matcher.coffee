
import {match,_,REST} from '../../bas/util/Match.js'

class Matcher

  @doMatches:() ->
    try
      Matcher.doMatch(3 )
      Matcher.doMatch(3.14 )
      Matcher.doMatch(['str',3.14] )
      Matcher.doMatch([1, 2, 3] )
      Matcher.doMatch( { x:'x' } )
      Matcher.doMatch( {} )
      Matcher.doLisp()
      Matcher.doExp()
    catch e
      console.error( 'Marcher.doMatches()', e )

  @doMatch:(x) ->
    msg = match(x,
      3,                "this matches the number 3",
      Number,           "matches any JavaScript number",
      [String, Number], (a, b) => "a typed Array [a, b] that you can use in a function",
      [1, 2, _],        "any Array of 3 elements that begins with [1, 2]",
      {x: _},           "any Object with a key 'x' and any value associated",
      _,                "anything else"
    )
    console.log( 'Matcher.doMatch()', msg )
    return


  @doLisp:() ->

    lisp = (exp) ->
      match(exp,
        Function,           (x) => x,
        [Function, REST],   (f, rest) => f.apply(null, rest.map(lisp)),
        Array,              (l) => l.map(lisp),
        _,                  (x) => x
      )

    plus   = (a, b) => a + b
    minus  = (a, b) => a - b
    reduce = (f, l) => l.reduce(f)

    console.log( 'lisp 3', lisp([plus, 1, 2]) )
    console.log( 'lisp 3', lisp([plus, 1, [minus, 4, 2]]) )
    console.log( 'lisp 6', lisp([reduce, plus, [1, 2, 3]]))
    return

  @doExp:() ->

    Add = (u,v) =>  u + v
    Sub = (u,v) =>  u - v
    Mul = (u,v) =>  u * v
    Div = (u,v) =>  u / v
    Neg = (u)   => -u
      

    f1 = (f) => [f.name,_]
    f2 = (f) => [f.name,_,_]
    fa = (f) =>
      a = [f.name]
      a.push(_) for i in [0...f.length]
      a

    console.log( 'f2 Add', f2(Add) )
    console.log( 'fa Add', fa(Add) )
    console.log( 'fa Neg', fa(Neg) )



    toPtns = ( adts ) =>
      console.log( 'adts', adts )
      ptns = new Array(adts.length)
      for i in [0...adts.length]
        ptns[i] = if i%2 is 1 then f2(adts[i]) else adts[i]

      ptns

    calc1 = ( exp ) ->
      ptns = toPtns([ exp,
        Add, (u,v) => Add(u,v),
        Sub, (u,v) => Sub(u,v),
        Mul, (u,v) => Mul(u,v),
        Div, (u,v) => Div(u,v)  ] )
      console.log( 'ptns', ptns )
      match( ...ptns )

    calc1(['Add',1,2] )



    calc2 = ( exp) ->
      match( exp,
        f2(Add), (u,v) => Add(u,v),
        f2(Sub), (u,v) => Sub(u,v),
        f2(Mul), (u,v) => Mul(u,v),
        f2(Div), (u,v) => Div(u,v),
        _,            'Calc2 Error'
      )

    calc3 = ( exp) ->
      match( exp,
        ['Add',_,_], (u,v) => Add(u,v),
        ['Sub',_,_], (u,v) => Sub(u,v),
        ['Mul',_,_], (u,v) => Mul(u,v),
        ['Div',_,_], (u,v) => Div(u,v),
        _,            'Calc3 Error'
      )

    console.log( 'doExp Add', calc2(['Add',1,2] ) )
    console.log( 'doExp Sub', calc3(['Sub',3,2] ) )
    console.log( 'doExp Mul', calc2(['Mul',3,4] ) )
    console.log( 'doExp Div', calc1(['Div',6,2] ) )

    if calc1 is false and calc2 is false  and calc3 is false and f1 is false and fn is false then {}

export default Matcher
  
  