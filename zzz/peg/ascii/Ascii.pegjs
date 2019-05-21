
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
  = u:Sus "^" v:Pow { return `Pow(${u},${v})` } // $("^" ![^])
  /   Sus

Sus  // Subscript
  = u:Neg "_" v:Sus { return `Sus(${u},${v})` }
  /   Neg

Neg
  = "-" u:Neg { return `Neg(${u})` }
  / Itg

Itg
  = "int" "~" u:Itg { return `Itg(${u})` }
  / Itl

Itl
  = "int" "_" a:Itg "^" b:Itl "~" u:Exp { return `Itl(${a},${b},${u})` }
  / Sum

Sum
  = "sum" "_" a:Itl "^" b:Sum "~" u:Exp { return `Sum(${a},${b},${u})` }
  / Fun

Fun    // Functions touch left paren with no whitespace
  = f:str "(" u:Exp ")" ws { return func(f,u) }
  / Par

Par
 = Dbl
 / "(" u:Exp ")"  ws { return `Par(${u})`; }

Dbl
  = float:([0-9]* "." [0-9]+)  ws { let d = parseFloat(float.join("")); return `Dbl(${d})`; }
  / Num

Num
  = digits:[0-9]+  ws { let n = parseInt(digits.join(""), 10); return `Num(${n})`; }
  / Var

Var
  = string:str ws { return `Var(${string})`; }

// Tokens
 
str
  = string:[a-zA-Z]+  { return string.join("") }

sp
  = [ ]*  // Space  [ \t\r\n\f]+

ws
  = sp?    // Optional whitespace














