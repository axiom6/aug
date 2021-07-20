
Log =
  logPrefix: "(App)"

  log: (args...) ->
    args.unshift(@logPrefix) if @logPrefix
    console?.log(args...)

# Execute function immediately
type = do ->
  classToType = {}
  for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
    classToType["[object " + name + "]"] = name.toLowerCase()

  # Return a function
  (obj) ->
    strType = Object::toString.call(obj)
    classToType[strType] or "object"

type = do ->
  classToType = {}
  for name in "Boolean Number String Function Array Date RegExp Undefined Null".split(" ")
    classToType["[object " + name + "]"] = name.toLowerCase()

  (obj) ->
    strType = Object::toString.call(obj)
    classToType[strType] or "object"

# Returns the sort of types we'd expect:
type("")         # "string"
type(new String) # "string"
type([])         # "array"
type(/\d/)       # "regexp"
type(new Date)   # "date"
type(true)       # "boolean"
type(null)       # "null"
type({})         # "object"

aVar = ""
if typeof aVar isnt "undefined"
  objectType = type(aVar)

# Or more succinctly with the existential operator:

objectType = type(aVar?)

# Returns 8, not 10!
parseInt('010') is 8

# Always pass a base to the function to make it work correctly:

# Use base 10 for the correct result
parseInt('010', 10) is 10

"use strict"

do ->
  "use strict"
  console.log(arguments.callee)

# ------ Testing ------

assert = require 'assert'
{addWord, removeWord} = require './word_utils'

do removeWordShouldRemoveOneWord = ->
  input = "product special"
  expectedOutput = "product"
  actualOutput = removeWord input, "special"
  assert.equal expectedOutput, actualOutput

# coffee word_utils.spec.coffee
#AssertionError: "product ial" == "product special"

addClass = (selector, newClass) ->
  element = document.querySelector selector
  if element.className?
    element.className = "#{element.className} #{newClass}"
  else
    element.className = newClass

do ->
  name = 'Ren'
  if name then false
do () ->
  name = 'Stimpy'
  if name then false

makeIncrement = () ->
  n = 0
  () ->
    n = n + 1
    n

incrementer = makeIncrementer()
incrementer()
# 1

incrementer()
# 2

import fs from 'path'

makeMostRecent = (file1, file2) ->
  mostRecent = 'Nothing read yet.'

  sourceFileWatcher = (fileName) ->
    sourceFileReader = () ->
      fs.readFile fileName, 'utf-8', (error, data) ->
        mostRecent = data
    fs.watch fileName, sourceFileReader

  sourceFileWatcher file1
  sourceFileWatcher file2

  getMostRecent = () ->
    mostRecent

  getMostRecent() # not part of example. Used to silence code inspector

mostRecentTweedle = makeMostRecent 'tweedle.dee', 'tweedle.dum'

closedOverArgument = (x) ->
  () -> x

# five = closedOverArgument 5

# nine = closedOverArgument 9


#Literate: W B Yeats The Wild Swans at Coole

#Literate: The trees are in their autumn beauty,

trees = [{}, {}]
for tree in trees
  tree.inAutumnBeauty = yes

#Literate: The woodland paths are dry,

paths = [{}, {}, {}]
for path in paths
  path.dry = yes

#Literate: Under the October twilight the water Mirrors a still sky;

octoberTwilight = {}
stillSky = {}
water =
  placeUnder: ->

water.placeUnder octoberTwilight
water.mirrors = stillSky

#Literate: Upon the brimming water among the stones Are nine-and-fifty swans.

water.brimming = true
water.stones = [{}, {}, {}, {}]

class Swan
  x: 3

for n in [1..59]
  water.stones.push new Swan

assert 'fundamental'.indexOf('fun') >= 0

import http from 'http'
send = (next) ->
  http.send next()

email = () ->

# Object DSL

session = { user:{ name:"Mark"} }

query
  SELECT: '*'
  FROM:   'users'
  WHERE:  "name LIKE '%#{session.user.name}%'"

class Person

  constructor:( options ) ->
    { @name, @age, height = 'average' } = options
    @height = height

tim = new Person( name: 'Tim', age: 4 )

if tim then false

perfectSquares = () ->
  num = 0
  loop
    num += 1
    yield num * num
  return

window.ps or= perfectSquares()

fibonacci = () ->
  current  = 0
  previous = 0
  [previous, current] = [1, 1]
  loop
    [previous, current] = [current, previous + current]
    yield current
  return

getFibonacciNumbers = (length) ->
  results = [1]
  for n from fibonacci()
    results.push(n)
    break if results.length is length
  results

# ----- Sleep ------

sleep = (ms) ->
  new Promise (resolve) ->
    window.setTimeout resolve, ms

say = (text) ->
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak new SpeechSynthesisUtterance( text )

countdown = (seconds) ->
  for i in [seconds..1]
    say( i )
    await sleep( 1000 ) # wait one second
  say( "Blastoff!"  )

countdown( 3 )

score = 76
grade = switch
  when score < 60 then 'F'
  when score < 70 then 'D'
  when score < 80 then 'C'
  when score < 90 then 'B'
  else                 'A'

popular  = ['pepperoni', 'sausage', 'cheese']
unwanted = ['anchovies', 'olives']

all = [popular..., unwanted..., 'mushrooms']

user =
  name: 'Werner Heisenberg'
  occupation: 'theoretical physicist'

currentUser = { user..., status: 'Uncertain' }

numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9]

start   = numbers[0..2]

middle  = numbers[3...-2]

end     = numbers[-2..]

copy    = numbers[..]

mind  = null
world = null
yeti  = null

solipsism = true if mind? and not world?

speed = 0
speed ?= 15

footprints = yeti ? "bear"

print = (arg) ->

try
  allHellBreaksLoose()
  catsAndDogsLivingTogether()
catch error
  print( error )
finally
  cleanUp()

cholesterol = 127

healthy = 200 > cholesterol > 60

import './local-file.coffee'
import 'coffeescript'

import _ from 'underscore'
import * as underscore from 'underscore'



import { now } from 'underscore'
import { now as currentTimestamp } from 'underscore'
import { first, last } from 'underscore'
import utilityBelt, { each } from 'underscore'

if _ and underscore and now and currentTimestamp and first and last and utilityBelt and each then false

export default Math
export square = (x) -> x * x
export class Mathematics
  least: (x, y) -> if x < y then x else y

sqrt = Math.sqrt
Mathematics = Math

export { sqrt }
export { sqrt as squareRoot }
export { Mathematics as default, sqrt as squareRoot }

min = Math.min
max = Math.max
export * from 'underscore'
export { max, min } from 'underscore'

# Your browser must support dynamic import to run this example.

do ->
  { run } = await import('./browser-compiler-modern/coffeescript.js')
  run(
    if 5 < new Date().getHours() < 9
      alert 'Time to make the coffee!'
    else
      alert 'Time to get some work done.' )

NUMBER     = ///
  ^ 0b[01]+    |              # binary
  ^ 0o[0-7]+   |              # octal
  ^ 0x[\da-f]+ |              # hex
  ^ \d*\.?\d+ (?:e[+-]?\d+)?  # decimal
///i

draw = (ctx) -> # Try changing colors below
  ctx.beginPath(); ctx.strokeStyle = 'gold'
  drawMove ctx, (ix for ix in [0...90] by 10)
  ctx.beginPath(); ctx.strokeStyle = 'salmon'
  drawPath ctx, (ix for ix in [0...90] by 10)

movement = (ctx, ax, ay, cp1x, cp1y, cp2x, cp2y, x, y) ->
  ctx.moveTo ax, ay
  ctx.bezierCurveTo cp1x, cp1y, cp2x, cp2y, x, y

drawMove = (ctx, args) ->
  args.forEach (ix) -> movement ctx,
    0, 0, 30, 30, 150+ix, 50, 110+ix, 90
  ctx.stroke()


u = undefined
partialFree = (func, a...) -> (b...) ->
  func (for arg in a then arg ?= b.shift())...

swirl = partialFree movement, u, u, 0, 30, 30, u, 50, u, 90

drawPath = (ctx, args) ->
  args.forEach (ix) -> swirl( ctx, 200, 150+ix, 110+ix )
  ctx.stroke()

t = {}
t.assert = ( result, expect ) ->
   result is expect

test1 = ( func, args..., expect ) ->
  result = func(args)
  t.assert( result, expect )

test2 = ( func, args..., expect ) ->
  (t) ->
    result = func(args)
    t.assert( result, expect )

partial15lines = () ->
  args = []      # Dumb useless declaration
  func = () ->   # Dumb useless declaration
  [func, args...] = arguments
  wrapper = () ->
    i = 0
    j = 0
    res_args = []
    while i < args.length
      if args[i] == _
        res_args.push arguments[j]
        j++
      else
        res_args.push args[i]
      i++
    return func.apply null, res_args, wrapper

# Most succinct partiol functio
partial3lines = (func, a...) -> (b...) ->
  func (for arg in a then arg ?= b.shift())...

assert = ( result, expect ) ->
  result is expect

# Most succinct partiol functio
partial3lines = (func, args..., expect ) ->
  result = func( args )
  assert( result, expect )

test = () ->
  f = (x, y, z) -> x + 2*y + 5*z
  g = partialFree( f, _, 1, _ )
  show( "g 3, 5 => #{g 3, 5} Expected: 30" )

  # Modified from an alexkg example
  fold = (f, z, xs) ->
    z = f(z, x) for x in xs
    z
  max = partialFree fold, Math.max, -Infinity, _
  show "max [-10..10] => #{max [-10..10]} Expected: 10"

  # Without free vars
  partial = (f, a...) -> (b...) -> f a..., b...
  min = partial fold, Math.min, Infinity
  show "min [-10..10] => #{min [-10..10]} Expected: -10"

partialFree = partial3lines
test()

"g 3, 5 => 30 Expected: 30"
"max [-10..10] => 10 Expected: 10"
"min [-10..10] => -10 Expected: -10 "

test = (func) ->
  for points in [-3..3]
    func points

test (points) ->
  show "0: You got #{points} point#{if points > 1 then 's' else ''}"

do (Pi = 3.14159265, diameter = (radius) -> radius * 2) ->
  (radius) ->
    diameter(radius) * Pi

do (I = ((x) -> x),
    K = ((x) -> (y) -> x),
    V = ((x) -> (y) -> (z) -> z(x(y))) ) ->
  do (t = K, f = K(I)) ->
    if V and f then false
    # ...
    # implement logical operators here
    # ...

###
show = if exports? then console.log else alert
(require 'fs')['writeFileSync'] "./bezier.html",
  webpage = (require 'coffeekup').render ->
    doctype 5
    html -> meta charset: 'utf-8',
      head -> title 'Bezier path'
      body ->
        canvas id: 'drawCanvas', width: 300, height: 200
        coffeescript ->
          window.onload = ->
            canvas = document.getElementById 'drawCanvas'
            ctx = canvas.getContext '2d'
            alert 'No canvas in this browser.' unless ctx?
            draw ctx if draw? 
###
