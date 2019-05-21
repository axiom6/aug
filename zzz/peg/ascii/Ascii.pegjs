
{                                                                                // "d" is for Dif
  let tranf = ["sin","cos","tan","sec","csc","cot","arcsin","arccos","arctan","exp","log","ln","d"]
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
}

start
  = Exp

Exp
  = Equ

// Binary ops from low to high precedence

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
  = u:Itg "/" ws v:Div { return `Div(${u},${v})` }
  /   Itg

Itg
  = "int" "~" u:Itg { return `Itg(${u})` }
  / Sum

Sum
  = key:Key "_" a:Pow "^" b:Sum "(" u:Sum ")" { return `toCap(key)(${a},${b},${u})` }
  / Pow

Pow
  = u:Sus "^" v:Pow { return `Pow(${u},${v})` } // $("^" ![^])
  /   Sus

Sus  // Subscript
  = u:Neg "_" v:Sus { return `Sus(${u},${v})` }
  /   Neg

// Unary Ops

Neg
  = "-" u:Neg { return `Neg(${u})` }
  / Pri

// Primary - These choices reference Exp and do not have to forward

Pri
 = Fun / Par / Brc / Vec / Mat / Dbl / Num / Key / Var

Fun
  = f:str "(" u:Exp ")" ws { return func(f,u) } // Fun touches left paren with no whitespace

Par
 = "(" u:Exp ")"  ws { return `Par(${u})`; }

Brc
 = "{" u:Exp "}"  ws { return `Brc(${u})`; }

Vec
  = lsb vals:( head:Exp tail:( com v:Exp { return v; } )*
      { return [head].concat(tail); } )? rsb
    { return vals !== null ? `Vec(${vals})` : `Vec(${[]})`; }

Mat
  = lsb vecs:( head:Vec tail:( com v:Vec { return v; } )*
      { return [head].concat(tail); } )? rsb
    { return vecs !== null ? `Mat(${vecs})` : `Mat(${[[]]})`; }

// Terminal Dbl Num Var

Dbl
  = float:([0-9]* "." [0-9]+)  ws { let d = parseFloat(float.join("")); return `Dbl(${d})`; }

Num
  = digits:[0-9]+  ws { let n = parseInt(digits.join(""), 10); return `Num(${n})`; }

Key
  = 'sum' / 'int'

Var
  = string:str ws { return `Var(${string})`; }


// Tokens

lsb
  = ws "[" ws

rsb
  = ws "]" ws

com
  = ws "," ws
 
str
  = string:[a-zA-Z]+  { return string.join("") }

sp
  = [ ]*  // Space  [ \t\r\n\f]+

ws
  = sp?    // Optional whitespace

/*
Itl
  = "int" "_" a:Sum "^" b:Itl "~" u:Itl { return `Itl(${a},${b},${u})` }
  / Sum
*/














