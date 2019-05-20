
start
  = Equ

Equ
  = u:Add "=" v:Equ { return `Equ(${u},${v})`; }
  /   Add

Add
  = u:Sub "+" v:Add { return `Add(${u},${v})`; }
  /   Sub

Sub
  = u:Mul "-" v:Sub { return `Sub(${u},${v})`; }
  /   Mul

Mul
  = u:Div "*" v:Mul { return `Mul(${u},${v})` }
  /   Div

Div
  = u:Pow "/" v:Div { return `Div(${u},${v})` }
  /   Pow

Pow
  = u:Sus "/" v:Pow { return `Pow(${u},${v})` }
  /   Sus

Sus
  = u:Neg "_" v:Sus { return `Sus(${u},${v})` }
  /   Neg

Neg
  = "-" u:Sus       { return `Neg(${u})` }
  / Par

Par
 = Dbl
 / "(" Equ:Equ ")" { return Equ; }

Dbl
  = floats:([0-9]* "." [0-9]+) { let d = parseFloat(floats.join("")); return `Dbl(${d})`; }
  / Num

Num
  = digits:[0-9]+ { let n = parseInt(digits.join(""), 10); return `Num(${n})`; }
  / Var

Var
  = string:[a-zA-Z]+ { return `Var(${string})`; }














