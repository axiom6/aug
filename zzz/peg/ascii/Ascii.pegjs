
{
  let tranf = ["sin","cos","tan","sec","csc","cot","arcsin","arccos","arctan","exp","log","ln",
               "d","int","sum","lim"]                                              // "d" is for Dif
  let hyper = ["sinh","cosh","tanh","sech","csch","coth"];
  let miscf = ["det","dim","mod","gcd","lcm","lub","glb","min","max","f","g"];
  let funcs = tranf;

  function toCap( f ) {
    return f.charAt(0).toUpperCase() + f.substring(1); }

  function toDif( f ) {
    return f==="d" ? "Dif" : toCap(f); }

  function toAdt( f ) {
    return f.startsWith('arc') ? 'A'+toCap(f.substring(3)) : toDif(f); }

  function func( f, u ) {
    return funcs.includes(f) ? `${toAdt(f)}(${u})` : `Fun(${f},${u})`; }

  function lim( f, a, b ) {
    return funcs.includes(f) ? `${toAdt(f)}(${a},${b})` : `Lim(${f},${a},${b})`; }

  function sum( f, a, b, u ) {
    return funcs.includes(f) ? `${toAdt(f)}(${a},${b},${u})` : `Sum(${f},${a},${b},${u})`; }
}

start
  = Exp

Exp
  = Tilde

// ------ Binary ops from low to high precedence ------

Tilde
  = tilde u:Tilde  { return `${u}` } // Tilde for Sum Int and Prod expressions
  / Equ

Equ
  = u:Add "=" ws v:Equ { return `Equ(${u},${v})`; }
  /   Add

Add
  = u:Sub "+" ws v:Add { return `Add(${u},${v})`; }
  /   Sub

Sub
  = u:Mul "-" ws v:Sub { return `Sub(${u},${v})`; }
  /   Mul

Mul
  = u:Div "*" ws v:Mul { return `Mul(${u},${v})` }
  /   Div

Div
  = u:Pow "/" ws v:Div { return `Div(${u},${v})` }
  /   Pow

Pow
  = u:Sus power v:Pow { return `Pow(${u},${v})` }
  /   Sus

Sus
  = u:Neg under v:Sus { return `Sus(${u},${v})` }  // Subscript
  /   Neg

// ------ Unary Ops ------

Neg
  = "-" u:Neg { return `Neg(${u})` }
  / Lower

Lower
  = lower u:Lower { return `${u}` }  // Lower bounds for Sum and Int has no Adt Name
  / Upper

Upper
  = upper u:Upper  { return `${u}` } // Upper bounds for Sum and Int has no Adt Name
  / Sum

Sum
  = k:Key a:Lower b:Upper u:Tilde { return sum(k,a,b,u) }
  / Pri


// ------ Primary - These choices reference Exp and do not have to / forward ------

Pri
  = Lim / Fun / Par / Brc / Vec / Mat / Dbl / Num / Key / Var

Lim
  = k:Key a:Lower b:Upper { return lim(k,a,b) }

//Sum
//  = k:Key a:Lower b:Upper u:Tilde { return sum(k,a,b,u) }

Fun
  = f:str "(" u:Exp ")" ws { return func(f,u) } // Fun touches left paren with no whitespace

Par
  = "(" u:Exp ")"  ws { return `Par(${u})`; }

Brc
  = "{" u:Exp "}"  ws { return `Brc(${u})`; }

Vec
  = begVec vals:( head:Exp tail:( comma v:Exp { return v; } )*
      { return [head].concat(tail); } )? endVec
    { return vals !== null ? `Vec(${vals})` : `Vec(${[]})`; }

Mec
  =       vals:( head:Exp tail:( comma v:Exp { return v; } )*
      {  return [head].concat(tail); } )? endVec
    { return vals !== null ? `Vec(${vals})` : `Vec(${[]})`; }

Mat
  = begMat vecs:( head:Mec tail:( comma v:Vec { return v; } )*
      { return [head].concat(tail); } )? endVec // Only one ]
    { return vecs !== null ? `Mat(${vecs})` : `Mat(${[[]]})`; }

// ------ Terminal Rules: Dbl Num Key Var ------

Dbl
  = float:([0-9]* "." [0-9]+)  ws { let d = parseFloat(float.join("")); return `Dbl(${d})`; }

Num
  = digits:[0-9]+  ws { let n = parseInt(digits.join(""), 10); return `Num(${n})`; }

Key
  = 'lim' / 'sum' / 'int' / 'prod'

Var
  = string:str ws { return `Var(${string})`; }

// ------ Tokens ------

under
  = "_" ![_~]

power
  = "^" ![\^~]

lower
  = "_"

upper
  = "^"

tilde
  = "~" // ![_\^] "~"

begVec
  = ws "[" ws !"["

endVec
  = ws "]" ws

begMat
  = ws "[["

comma
  = ws "," ws
 
str
  = string:[a-zA-Z]+  { return string.join("") }

sp
  = [ ]+  // Space  [ \t\r\n\f]+

ws
  = sp?    // Optional whitespace
















