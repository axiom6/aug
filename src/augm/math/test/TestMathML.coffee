
# cd   pub/augm/math/test
# Imported and called by Run.js
# node --experimental-modules -r esm Run.js

# package.js script for compiling grammars
# "gcom": "pegjs -o pub/augm/math/par/Ascii.com.js  src/augm/math/par/Ascii.pegjs",
# "gnon": "sed -n -e :a -e '1,5!{P;N;D;};N;ba' pub/augm/math/par/Ascii.com.js > pub/augm/math/par/Ascii.non.js",
# "gesm": "cat      pub/augm/math/par/Ascii.non.js  src/augm/math/par/Ascii.esm.ex > pub/augm/math/par/Ascii.esm.js",

import MathML from '../ptn/MathML.js'

class TestMathML

  constructor:() ->
    @mathML = new MathML()

  trg1ML  = "<math><mrow><mrow>cot<mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo>"
  trg1ML += "<mrow>sin<mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></augm/math>"
  par1ML  = "<math><mrow><mo>(</mo><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mo>)</mo>"
  par1ML += "<mo>*</mo><mo>(</mo><msup><mi>c</mi><mn>2</mn></msup><mo>)</mo></mrow></augm/math>"
  trg1ML  = "<math><mrow><mrow>cot<mo>(</mo><mi>x</mi><mo>)</mo></mrow><mo>+</mo>"
  trg1ML += "<mrow>sin<mo>(</mo><mi>x</mi><mo>)</mo></mrow></mrow></augm/math>"
  sus1ML  = "<math><mrow><msub><mi>x</mi><mn>1</mn></msub><mo>+</mo><msub><mi>x</mi><mn>2</mn></msub></mrow></augm/math>"
  sin1ML  = "<math><mrow>sin<mo>(</mo><mn>0.5235987755982988</mn><mo>)</mo></mrow></augm/math>"
  add1ML  = "<math><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow></augm/math>"
  add2ML  = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>+</mo>"
  add2ML += "<mrow><mn>4</mn><mo>*</mo><mn>3</mn></mrow></mrow></augm/math>"
  equ1ML  = "<math><mrow><mi>E</mi><mo>=</mo><mrow><mi>m</mi><mo>*</mo><msup>"
  equ1ML += "<mi>C</mi><mn>2</mn></msup></mrow></mrow></augm/math>"
  sum1ML  = "<math><munderover><mo>∑</mo><mrow><mi>i</mi><mo>=</mo><mn>1</mn></mrow>"
  sum1ML += "<mi>n</mi></munderover><mrow><mi>x</mi><mo>-</mo><mi>i</mi></mrow></augm/math>"
  mul1ML  = "<math><mrow><mo>(</mo><mrow><mn>2.2</mn><mo>+</mo><mn>3</mn></mrow><mo>)</mo>"
  mul1ML += "<mo>*</mo><mo>(</mo><mrow><mn>1</mn><mo>+</mo><mn>2</mn></mrow><mo>)</mo></mrow></augm/math>"
  mul2ML  = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>+</mo>"
  mul2ML += "<mrow><mn>4</mn><mo>*</mo><mn>3</mn></mrow></mrow></augm/math>"
  tan1ML  = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>+</mo>"
  tan1ML += "<mrow><mi>x</mi><mo>*</mo><mrow><mi>arctan</mi><mo>(</mo><mi>y</mi><mo>)</mo></mrow></mrow></mrow></augm/math>"
  sub1ML  = "<math><mrow><mrow><mn>2.2</mn><mo>*</mo><mn>3</mn></mrow><mo>-</mo><msup>"
  sub1ML += "<mi>x</mi><mi>y</mi></msup></mrow></augm/math>"
  equ2ML  = "<math><mrow><msup><mn>2.2</mn><mn>3</mn></msup><mo>=</mo>"
  equ2ML += "<mfrac><mi>x</mi><mi>y</mi></mfrac></mrow></augm/math>"
  sub2ML  = "<math><mrow><mrow><mrow><mo>-</mo><mn>2.2</mn></mrow><mo>*</mo><mn>3</mn></mrow>"
  sub2ML += "<mo>-</mo><mfrac><mi>x</mi><mrow><mo>-</mo><mi>y</mi></mrow></mfrac></mrow></augm/math>"
  mul3ML  = "<math><mrow><mi>x</mi><mo>*</mo><mrow><mi>x</mi><mo>*</mo><mo>(</mo><mrow><mi>a</mi>"
  mul3ML += "<mo>+</mo><msub><mi>b</mi><mn>1</mn></msub></mrow><mo>)</mo></mrow></mrow></augm/math>"
  sin2ML  = "<math><mrow><mi>a</mi><mo>+</mo><mrow><mi>b</mi><mo>*</mo><mrow><mi>sin</mi>"
  sin2ML += "<mo>(</mo><mo>\u03B8</mo><mo>)</mo></mrow></mrow></mrow></augm/math>"
  fun1ML  = "<math><mrow><mrow><mi>fn</mi><mo>(</mo><mrow><mi>a</mi><mo>+</mo><mi>b</mi></mrow><mo>)</mo></mrow>"
  fun1ML += "<mo>*</mo><mrow><mi>g</mi><mo>(</mo><mi>theta</mi><mo>)</mo></mrow></mrow></augm/math>"
  int1ML  = "<math><mrow><mo>∫</mo><mrow><mi>x</mi><mo>*</mo><mn>2</mn></mrow></mrow></augm/math>"
  vec1ML  = "<math><mo>[</mo><mn>1</mn><mn>2</mn><mn>3</mn><mo>]</mo></augm/math>"
  mat1ML  = "<math><mo>[</mo>"
  mat1ML += "<mo>[</mo><mn>1</mn><mn>2</mn><mn>3</mn><mo>]</mo>"
  mat1ML += "<mo>[</mo><mn>4</mn><mn>5</mn><mn>6</mn><mo>]</mo><mo>]</mo></augm/math>"
  lim1ML  = "<math><msubsup><mi>lim</mi><mi>i</mi><mi>n</mi></msubsup></augm/math>"
  sum2ML  = "<math><munderover><mo>∑</mo><mi>i</mi><mi>n</mi></munderover><mi>j</mi></augm/math>"
  sum3ML  = "<math><munderover><mo>∑</mo><mi>i</mi><mi>n</mi></munderover><mrow><mi>j</mi>"
  sum3ML += "<mo>+</mo><mn>1</mn></mrow></augm/math>"

  testMarkup:() ->

    asts =
      Sin1:{ ast:['Sin',Math.PI/6],                         math:sin1ML }
      Add1:{ ast:['Add','a','b'],                           math:add1ML }
      Equ1:{ ast:['Equ','E',['Mul','m',['Pow','C',2]]],     math:equ1ML }
      Sum1:{ ast:['Sum',['Equ','i',1],'n',['Sub','x','i']], math:sum1ML }
      Mul1:{ ast:['Mul',['Paren',['Add',2.2,3]],['Paren',['Add',1,2]]], math:mul1ML }
      Mul2:{ ast:['Add',['Mul',2.2,3],['Mul',4,3]], math:mul2ML }
      Tan1:{ ast:['Add',['Mul',2.2,3],['Mul','x',['Arctan','y']]], math:tan1ML }
      Sub1:{ ast:['Sub',['Mul',2.2,3],['Pow','x','y']], math:sub1ML }
      Equ2:{ ast:['Equ',['Pow',2.2,3],['Div','x','y']], math:equ2ML }
      Sub2:{ ast:['Sub',['Mul',['Neg',2.2],3],['Div','x',['Neg','y']]], math:sub2ML }
      Mul3:{ ast:['Mul','x',['Mul','x',['Paren',['Add','a',['Sus','b',1]]]]], math:mul3ML }
      Sin2:{ ast:['Add','a',['Mul','b',['Sin',['Latex','theta']]]], math:sin2ML }
      Fun1:{ ast:['Mul',['Fun','fn',['Add','a','b']],['Fun','g','theta']], math:fun1ML }
      Int1:{ ast:['Int',['Mul','x',2]], math:int1ML }
      Vec1:{ ast:['Vec',1,2,3], math:vec1ML }
      Mat1:{ ast:['Mat',['Vec',1,2,3],['Vec',4,5,6]], math:mat1ML }
      Lim1:{ ast:['Lim','i','n'], math:lim1ML }
      Sum2:{ ast:['Sum','i','n','j'], math:sum2ML }
      Sum3:{ ast:['Sum','i','n',['Add','j',1]], math:sum3ML }


    console.log( "-------------------- testMarkup ----------------------------" )

    for key, obj of asts
      @mathML.markup( obj.ast, key )
      status = if @mathML.math[key] is obj.math then 'Pass' else 'Fail'
      console.log( status, key, obj.exp, '\n  ', @mathML.math[key] )
    return

  testParse:( key ) ->

    asciis =
      Par1:{ ascii:"(a+b)*(c^2)",        math:par1ML }
      Trg1:{ ascii:"cos(x)+sin(x)",      math:trg1ML }
      Sus1:{ ascii:"x_1 + x_2",          math:sus1ML }
      Mul1:{ ascii:"(2.2+3)*(1+2)",      math:mul1ML }
      Add2:{ ascii:"2.2*3+4*3",          math:add2ML }
      Tan1:{ ascii:"2.2*3+x*arctan(y)",  math:tan1ML }
      Sub1:{ ascii:"2.2*3-x^y",          math:sub1ML }
      Equ2:{ ascii:"2.2^3 = x/y",        math:equ2ML }
      Sub2:{ ascii:"-2.2 * 3-x / -y",    math:sub2ML }
      Mul3:{ ascii:"x*x*(a+b_1)",        math:mul3ML }
      Sin2:{ ascii:"a+b*sin(\\theta)",   math:sin2ML }
      Fun1:{ ascii:"fn(a+b)*g(theta)",   math:fun1ML }
      Int1:{ ascii:"int(x*2)",           math:int1ML }
      Vec1:{ ascii:"[1,2,3]",            math:vec1ML }
      Mat1:{ ascii:"[[1,2,3],[4,5,6]]",  math:mat1ML }
      Lim1:{ ascii:"lim_i^n",            math:lim1ML }
      Sum2:{ ascii:"sum_i^n~j",          math:sum2ML }
      Sum3:{ ascii:"sum_i^n~j+1",        math:sum3ML }

    console.log( "---------------------- testParse --------------------------" )

    for key, obj of asciis
      @mathML.parse( obj.ascii, key )
      status = if @mathML.math[key] is obj.math then 'Pass' else 'Fail'
      console.log( status, key, obj.ascii, '\n  ', @mathML.math[key] )

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

    @mathML.markup( Sina, 'Sina' )
    @mathML.markup( Sins, 'Sins' )
    @mathML.markup( Adda, 'Adda' )
    #mathML.markup( Adds, 'Adds' )
    #mathML.markup( Suma, 'Suma' )
    #mathML.markup( Sums, 'Sums' )

    return

export default TestMathML