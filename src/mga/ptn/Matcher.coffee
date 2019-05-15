
import {match,_,REST} from '../../bas/util/Match.js'

class Matcher

  @doMatches:() ->
    Matcher.doMatch(3 )
    Matcher.doMatch(3.14 )
    Matcher.doMatch(['str',3.14] )
    Matcher.doMatch([1, 2, 3] )
    Matcher.doMatch( { x:'x' } )
    Matcher.doMatch( {} )
    Matcher.doLisp()

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
    
export default Matcher
  
  