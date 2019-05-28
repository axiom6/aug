
/*

Mec  // Called by Mat
  =       vals:( head:Arg tail:( comma v:Arg { return v; } )*
      {  return [head].concat(tail); } )? endVec
    { return vals !== null ? `['Vec',${vals}]` : `['Vec',${[]}]`; }

FunArgs  // Left out for now
  = f:str begArgs args:( head:Arg tail:( comma v:Arg { return v; } )*
    { return [head].concat(tail); } )? endArgs
    { return funcn(f,args) }
  / Vec
*/

// ------ Primary - These choices reference Exp and do not have to / forward ------
// Lim / Fun / Par / Brc / Vec / Mat /