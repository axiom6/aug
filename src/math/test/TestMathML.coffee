
# cd   pub/math/test
# Imported and called by Run.js
# node --experimental-modules -r esm Run.js

import MathML from '../ptn/MathML.js'

class TestMathML extends MathML

  constructor:() ->
    super()

  testMarkup:( key ) ->

    Sin = ['Sin',Math.PI/6]
    Add = ['Add','a','b']
    Equ = ['Equ','E',['Mul','m',['Pow','C',2]]]
    Sum = ['Sum',['Equ','i',1],'n',['Sub','x','i']]

    Exps = { Sin:Sin, Add:Add, Equ:Equ, Sum:Sum }

    switch key
      when 'Sin' then @markup( Sin, key )
      when 'Add' then @markup( Add, key )
      when 'Equ' then @markup( Equ, key )
      when 'Sum' then @markup( Sum, key )
      else            @markup( Add, key )

    console.log( "-------------------- testMarkup ----------------------------" )
    console.log( 'MathML.markup', { key:key, exp:Exps[key], mathML:@math[key] } )
    return

  testParse:( key ) ->
    ascs = {
      add:"(a+b)*(c^2)"
      trg:"cos(x)+sin(x)"
      sus:"x_1 + x_2" }

    switch( key )
      when 'add' then @doParse( ascs.add,'add' )
      when 'trg' then @doParse( ascs.trg,'trg' )
      else            @doParse( ascs.sus,'sus' )

    console.log( 'MathML.parse', { key:key, asc:ascs[key], mathML:@math[key] } )
    console.log( "---------------------- testParse --------------------------" )
    return

  testExp:() ->
    Sina = ['Sin',Math.PI/6]
    Adda = ['Add','a','b'] # ['Add','a',['Mul',['x','y']]]
    Suma = ['Sum','i','n','j']
    Sins = eval("['Sin',Math.PI/6]" )
    Adds = eval("['Add','a','b']" )
    Sums = eval("['Sum','i','n','j']" )
    console.log( 'Sin', Sina, Sins )
    console.log( 'Add', Adda, Adds )
    console.log( 'Sin', Suma, Sums )

    @markup( Sina, 'Sina' )
    @markup( Sins, 'Sins' )
    @markup( Adda, 'Adda' )
    #markup( Adds, 'Adds' )
    #markup( Suma, 'Suma' )
    #markup( Sums, 'Sums' )

    return

export default TestMathML