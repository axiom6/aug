
start
  = Add

Add
  = u:Mul "+" v:Add { return `Add(${u},${v})`; }
  / Mul

Mul
  = u:Pri "*" v:Mul { return `Mul(${u},${v})` }
  / Pri

Pri
  = Num
  / "(" Add:Add ")" { return Add; }

Num
  = digits:[0-9]+ { let n = parseInt(digits.join(""), 10); return `Num(${n})`}