
start
  = Add

Add
  = left:Mul "+" right:Add { return left + right; }
  / Mul

Mul
  = left:Pri "*" right:Mul { return left * right; }
  / Pri

Pri
  = Int
  / "(" Add:Add ")" { return Add; }

Int "integer"
  = digits:[0-9]+ { return parseInt(digits.join(""), 10); }