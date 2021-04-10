
import {_,REST} from '../../../base/util/Match.js'
import Ascii    from '../par/Ascii.esm.js'

class Ptn

  @toPtn:(f) ->
    a = undefined
    if f is 'String'
      a = String
    else if f is 'Number'
      a = Number
    else if f is '_'
      a = _
    else if typeof(f) is 'function'
      a = []
      if f.name is 'Vec' or f.name is 'Mat'
        a.push( f.name, REST )
        # console.log( 'Ptn.toPtn() Vec', f.name, REST )
      else
        a.push(f.name)
        a.push(_) for i in [0...f.length]
    else
      console.error( 'Ptn.toPtn() unknown pattern', f )
    #console.log( 'Ptn.toPtn()', { f:f, ft:typeof(f), fa:Array.isArray(f), a:a, at:typeof(a), aa:Array.isArray(a) } )
    return a

  @type:(ptn) ->
    if Array.isArray(ptn) then 'array' else typeof(ptn)

  @toPtns:( adts ) =>
    # console.log( 'Ptn.toPtns() adts', adts )
    ptns = new Array(adts.length)
    for i in [0...adts.length]
      ptns[i] = if i%2 is 0 then @toPtn(adts[i]) else adts[i]
    # for i in [0...ptns.length] by 2
    #   console.log( 'Ptn.toPtns()', { ptn:ptns[i], type:Ptn.type(ptns[i]) } )
    ptns

  @parse:( ascii ) ->
    sst = "X"
    ast = []
    err = {}
    try
      sst = Ascii.parse( ascii )
      try
        ast = eval( sst )
      catch e
        console.error( 'Ptn.parse() eval  error', key, e )
    catch e
      err.found = e.found; err.msg = e.message; err.loc = e.location
      console.error( 'Ptn.doParse() parse error', { key:key, ascii:ascii, error:err } )
    ast

  @toSst:( ast ) ->
    sst = "["
    for i in [0...ast.length] when ast[i]?
      sst += if Array.isArray(ast[i]) then Ptn.toSst(ast[i]) else ast[i].toString()
      sst += ',' if i < ast.length-1
    sst += "]"
    sst

export default Ptn