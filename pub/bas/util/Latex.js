var Latex;

Latex = {
  
  //Greek letters
  alpha: {
    tag: "mi",
    uc: "\u03B1",
    ttype: "const"
  },
  beta: {
    tag: "mi",
    uc: "\u03B2",
    ttype: "const"
  },
  gamma: {
    tag: "mi",
    uc: "\u03B3",
    ttype: "const"
  },
  delta: {
    tag: "mi",
    uc: "\u03B4",
    ttype: "const"
  },
  epsilon: {
    tag: "mi",
    uc: "\u03B5",
    ttype: "const"
  },
  varepsilon: {
    tag: "mi",
    uc: "\u025B",
    ttype: "const"
  },
  zeta: {
    tag: "mi",
    uc: "\u03B6",
    ttype: "const"
  },
  eta: {
    tag: "mi",
    uc: "\u03B7",
    ttype: "const"
  },
  theta: {
    tag: "mi",
    uc: "\u03B8",
    ttype: "const"
  },
  vartheta: {
    tag: "mi",
    uc: "\u03D1",
    ttype: "const"
  },
  iota: {
    tag: "mi",
    uc: "\u03B9",
    ttype: "const"
  },
  kappa: {
    tag: "mi",
    uc: "\u03BA",
    ttype: "const"
  },
  lambda: {
    tag: "mi",
    uc: "\u03BB",
    ttype: "const"
  },
  mu: {
    tag: "mi",
    uc: "\u03BC",
    ttype: "const"
  },
  nu: {
    tag: "mi",
    uc: "\u03BD",
    ttype: "const"
  },
  xi: {
    tag: "mi",
    uc: "\u03BE",
    ttype: "const"
  },
  pi: {
    tag: "mi",
    uc: "\u03C0",
    ttype: "const"
  },
  varpi: {
    tag: "mi",
    uc: "\u03D6",
    ttype: "const"
  },
  rho: {
    tag: "mi",
    uc: "\u03C1",
    ttype: "const"
  },
  varrho: {
    tag: "mi",
    uc: "\u03F1",
    ttype: "const"
  },
  varsigma: {
    tag: "mi",
    uc: "\u03C2",
    ttype: "const"
  },
  sigma: {
    tag: "mi",
    uc: "\u03C3",
    ttype: "const"
  },
  tau: {
    tag: "mi",
    uc: "\u03C4",
    ttype: "const"
  },
  upsilon: {
    tag: "mi",
    uc: "\u03C5",
    ttype: "const"
  },
  phi: {
    tag: "mi",
    uc: "\u03C6",
    ttype: "const"
  },
  varphi: {
    tag: "mi",
    uc: "\u03D5",
    ttype: "const"
  },
  chi: {
    tag: "mi",
    uc: "\u03C7",
    ttype: "const"
  },
  psi: {
    tag: "mi",
    uc: "\u03C8",
    ttype: "const"
  },
  omega: {
    tag: "mi",
    uc: "\u03C9",
    ttype: "const"
  },
  Gamma: {
    tag: "mo",
    uc: "\u0393",
    ttype: "const"
  },
  Delta: {
    tag: "mo",
    uc: "\u0394",
    ttype: "const"
  },
  Theta: {
    tag: "mo",
    uc: "\u0398",
    ttype: "const"
  },
  Lambda: {
    tag: "mo",
    uc: "\u039B",
    ttype: "const"
  },
  Xi: {
    tag: "mo",
    uc: "\u039E",
    ttype: "const"
  },
  Pi: {
    tag: "mo",
    uc: "\u03A0",
    ttype: "const"
  },
  Sigma: {
    tag: "mo",
    uc: "\u03A3",
    ttype: "const"
  },
  Upsilon: {
    tag: "mo",
    uc: "\u03A5",
    ttype: "const"
  },
  Phi: {
    tag: "mo",
    uc: "\u03A6",
    ttype: "const"
  },
  Psi: {
    tag: "mo",
    uc: "\u03A8",
    ttype: "const"
  },
  Omega: {
    tag: "mo",
    uc: "\u03A9",
    ttype: "const"
  },
  
  //fractions
  frac12: {
    tag: "mo",
    uc: "\u00BD",
    ttype: "const"
  },
  frac14: {
    tag: "mo",
    uc: "\u00BC",
    ttype: "const"
  },
  frac34: {
    tag: "mo",
    uc: "\u00BE",
    ttype: "const"
  },
  frac13: {
    tag: "mo",
    uc: "\u2153",
    ttype: "const"
  },
  frac23: {
    tag: "mo",
    uc: "\u2154",
    ttype: "const"
  },
  frac15: {
    tag: "mo",
    uc: "\u2155",
    ttype: "const"
  },
  frac25: {
    tag: "mo",
    uc: "\u2156",
    ttype: "const"
  },
  frac35: {
    tag: "mo",
    uc: "\u2157",
    ttype: "const"
  },
  frac45: {
    tag: "mo",
    uc: "\u2158",
    ttype: "const"
  },
  frac16: {
    tag: "mo",
    uc: "\u2159",
    ttype: "const"
  },
  frac56: {
    tag: "mo",
    uc: "\u215A",
    ttype: "const"
  },
  frac18: {
    tag: "mo",
    uc: "\u215B",
    ttype: "const"
  },
  frac38: {
    tag: "mo",
    uc: "\u215C",
    ttype: "const"
  },
  frac58: {
    tag: "mo",
    uc: "\u215D",
    ttype: "const"
  },
  frac78: {
    tag: "mo",
    uc: "\u215E",
    ttype: "const"
  },
  
  //binary operation symbols
  triangleleft: {
    tag: "mo",
    uc: "\u22B2",
    ttype: "const"
  },
  triangleright: {
    tag: "mo",
    uc: "\u22B3",
    ttype: "const"
  },
  bigtriangleup: {
    tag: "mo",
    uc: "\u25B3",
    ttype: "const"
  },
  bigtriangledown: {
    tag: "mo",
    uc: "\u25BD",
    ttype: "const"
  },
  pm: {
    tag: "mo",
    uc: "\u00B1",
    ttype: "const"
  },
  mp: {
    tag: "mo",
    uc: "\u2213",
    ttype: "const"
  },
  cdot: {
    tag: "mo",
    uc: "\u22C5",
    ttype: "const"
  },
  star: {
    tag: "mo",
    uc: "\u22C6",
    ttype: "const"
  },
  ast: {
    tag: "mo",
    uc: "\u002A",
    ttype: "const"
  },
  times: {
    tag: "mo",
    uc: "\u00D7",
    ttype: "const"
  },
  div: {
    tag: "mo",
    uc: "\u00F7",
    ttype: "const"
  },
  circ: {
    tag: "mo",
    uc: "\u2218",
    ttype: "const"
  },
  bullet: {
    tag: "mo",
    uc: "\u2022",
    ttype: "const"
  },
  oplus: {
    tag: "mo",
    uc: "\u2295",
    ttype: "const"
  },
  ominus: {
    tag: "mo",
    uc: "\u2296",
    ttype: "const"
  },
  otimes: {
    tag: "mo",
    uc: "\u2297",
    ttype: "const"
  },
  bigcirc: {
    tag: "mo",
    uc: "\u25CB",
    ttype: "const"
  },
  oslash: {
    tag: "mo",
    uc: "\u2298",
    ttype: "const"
  },
  odot: {
    tag: "mo",
    uc: "\u2299",
    ttype: "const"
  },
  land: {
    tag: "mo",
    uc: "\u2227",
    ttype: "const"
  },
  wedge: {
    tag: "mo",
    uc: "\u2227",
    ttype: "const"
  },
  lor: {
    tag: "mo",
    uc: "\u2228",
    ttype: "const"
  },
  vee: {
    tag: "mo",
    uc: "\u2228",
    ttype: "const"
  },
  cap: {
    tag: "mo",
    uc: "\u2229",
    ttype: "const"
  },
  cup: {
    tag: "mo",
    uc: "\u222A",
    ttype: "const"
  },
  sqcap: {
    tag: "mo",
    uc: "\u2293",
    ttype: "const"
  },
  sqcup: {
    tag: "mo",
    uc: "\u2294",
    ttype: "const"
  },
  uplus: {
    tag: "mo",
    uc: "\u228E",
    ttype: "const"
  },
  amalg: {
    tag: "mo",
    uc: "\u2210",
    ttype: "const"
  },
  dag: {
    tag: "mo",
    uc: "\u2020",
    ttype: "const"
  },
  dagger: {
    tag: "mo",
    uc: "\u2020",
    ttype: "const"
  },
  ddag: {
    tag: "mo",
    uc: "\u2021",
    ttype: "const"
  },
  ddagger: {
    tag: "mo",
    uc: "\u2021",
    ttype: "const"
  },
  lhd: {
    tag: "mo",
    uc: "\u22B2",
    ttype: "const"
  },
  rhd: {
    tag: "mo",
    uc: "\u22B3",
    ttype: "const"
  },
  unlhd: {
    tag: "mo",
    uc: "\u22B4",
    ttype: "const"
  },
  unrhd: {
    tag: "mo",
    uc: "\u22B5",
    ttype: "const"
  },
  
  //"big" Operators
  sum: {
    tag: "mo",
    uc: "\u2211",
    ttype: "underover"
  },
  prod: {
    tag: "mo",
    uc: "\u220F",
    ttype: "underover"
  },
  bigcap: {
    tag: "mo",
    uc: "\u22C2",
    ttype: "underover"
  },
  bigcup: {
    tag: "mo",
    uc: "\u22C3",
    ttype: "underover"
  },
  bigwedge: {
    tag: "mo",
    uc: "\u22C0",
    ttype: "underover"
  },
  bigvee: {
    tag: "mo",
    uc: "\u22C1",
    ttype: "underover"
  },
  bigsqcap: {
    tag: "mo",
    uc: "\u2A05",
    ttype: "underover"
  },
  bigsqcup: {
    tag: "mo",
    uc: "\u2A06",
    ttype: "underover"
  },
  coprod: {
    tag: "mo",
    uc: "\u2210",
    ttype: "underover"
  },
  bigoplus: {
    tag: "mo",
    uc: "\u2A01",
    ttype: "underover"
  },
  bigotimes: {
    tag: "mo",
    uc: "\u2A02",
    ttype: "underover"
  },
  bigodot: {
    tag: "mo",
    uc: "\u2A00",
    ttype: "underover"
  },
  biguplus: {
    tag: "mo",
    uc: "\u2A04",
    ttype: "underover"
  },
  int: {
    tag: "mo",
    uc: "\u222B",
    ttype: "const"
  },
  oint: {
    tag: "mo",
    uc: "\u222E",
    ttype: "const"
  },
  
  //binary relation symbols
  lt: {
    tag: "mo",
    uc: "<",
    ttype: "const"
  },
  gt: {
    tag: "mo",
    uc: ">",
    ttype: "const"
  },
  ne: {
    tag: "mo",
    uc: "\u2260",
    ttype: "const"
  },
  neq: {
    tag: "mo",
    uc: "\u2260",
    ttype: "const"
  },
  le: {
    tag: "mo",
    uc: "\u2264",
    ttype: "const"
  },
  leq: {
    tag: "mo",
    uc: "\u2264",
    ttype: "const"
  },
  leqslant: {
    tag: "mo",
    uc: "\u2264",
    ttype: "const"
  },
  ge: {
    tag: "mo",
    uc: "\u2265",
    ttype: "const"
  },
  geq: {
    tag: "mo",
    uc: "\u2265",
    ttype: "const"
  },
  geqslant: {
    tag: "mo",
    uc: "\u2265",
    ttype: "const"
  },
  equiv: {
    tag: "mo",
    uc: "\u2261",
    ttype: "const"
  },
  ll: {
    tag: "mo",
    uc: "\u226A",
    ttype: "const"
  },
  gg: {
    tag: "mo",
    uc: "\u226B",
    ttype: "const"
  },
  doteq: {
    tag: "mo",
    uc: "\u2250",
    ttype: "const"
  },
  prec: {
    tag: "mo",
    uc: "\u227A",
    ttype: "const"
  },
  succ: {
    tag: "mo",
    uc: "\u227B",
    ttype: "const"
  },
  preceq: {
    tag: "mo",
    uc: "\u227C",
    ttype: "const"
  },
  succeq: {
    tag: "mo",
    uc: "\u227D",
    ttype: "const"
  },
  subset: {
    tag: "mo",
    uc: "\u2282",
    ttype: "const"
  },
  supset: {
    tag: "mo",
    uc: "\u2283",
    ttype: "const"
  },
  subseteq: {
    tag: "mo",
    uc: "\u2286",
    ttype: "const"
  },
  supseteq: {
    tag: "mo",
    uc: "\u2287",
    ttype: "const"
  },
  sqsubset: {
    tag: "mo",
    uc: "\u228F",
    ttype: "const"
  },
  sqsupset: {
    tag: "mo",
    uc: "\u2290",
    ttype: "const"
  },
  sqsubseteq: {
    tag: "mo",
    uc: "\u2291",
    ttype: "const"
  },
  sqsupseteq: {
    tag: "mo",
    uc: "\u2292",
    ttype: "const"
  },
  sim: {
    tag: "mo",
    uc: "\u223C",
    ttype: "const"
  },
  simeq: {
    tag: "mo",
    uc: "\u2243",
    ttype: "const"
  },
  approx: {
    tag: "mo",
    uc: "\u2248",
    ttype: "const"
  },
  cong: {
    tag: "mo",
    uc: "\u2245",
    ttype: "const"
  },
  Join: {
    tag: "mo",
    uc: "\u22C8",
    ttype: "const"
  },
  bowtie: {
    tag: "mo",
    uc: "\u22C8",
    ttype: "const"
  },
  in: {
    tag: "mo",
    uc: "\u2208",
    ttype: "const"
  },
  ni: {
    tag: "mo",
    uc: "\u220B",
    ttype: "const"
  },
  owns: {
    tag: "mo",
    uc: "\u220B",
    ttype: "const"
  },
  propto: {
    tag: "mo",
    uc: "\u221D",
    ttype: "const"
  },
  vdash: {
    tag: "mo",
    uc: "\u22A2",
    ttype: "const"
  },
  dashv: {
    tag: "mo",
    uc: "\u22A3",
    ttype: "const"
  },
  models: {
    tag: "mo",
    uc: "\u22A8",
    ttype: "const"
  },
  perp: {
    tag: "mo",
    uc: "\u22A5",
    ttype: "const"
  },
  smile: {
    tag: "mo",
    uc: "\u2323",
    ttype: "const"
  },
  frown: {
    tag: "mo",
    uc: "\u2322",
    ttype: "const"
  },
  asymp: {
    tag: "mo",
    uc: "\u224D",
    ttype: "const"
  },
  notin: {
    tag: "mo",
    uc: "\u2209",
    ttype: "const"
  },
  
  //matrices
  begineq: {
    input: "\\begin{eqnarray}",
    uc: "X",
    ttype: "matrix",
    invisible: true
  },
  begin: {
    input: "\\begin{array}",
    uc: "X",
    ttype: "matrix",
    invisible: true
  },
  endeq: {
    input: "\\end{eqnarray}",
    uc: " }}",
    ttype: "definition"
  },
  end: {
    input: "\\end{array}",
    uc: " }}",
    ttype: "definition"
  },
  
  //grouping and literal brackets -- ieval is for IE
  big: {
    tag: "mo",
    uc: "X",
    atval: "1.2",
    ieval: "2.2",
    ttype: "big"
  },
  Big: {
    tag: "mo",
    uc: "X",
    atval: "1.6",
    ieval: "2.6",
    ttype: "big"
  },
  bigg: {
    tag: "mo",
    uc: "X",
    atval: "2.2",
    ieval: "3.2",
    ttype: "big"
  },
  Bigg: {
    tag: "mo",
    uc: "X",
    atval: "2.9",
    ieval: "3.9",
    ttype: "big"
  },
  left: {
    tag: "mo",
    uc: "X",
    ttype: "leftbracket"
  },
  right: {
    tag: "mo",
    uc: "X",
    ttype: "rightbracket"
  },
  leftbracket: {
    uc: "{",
    ttype: "leftbracket",
    invisible: true
  },
  rightbracket: {
    uc: " }",
    ttype: "rightbracket",
    invisible: true
  },
  lbrack: {
    tag: "mo",
    uc: "[",
    atval: "1",
    ttype: "stretchy"
  },
  lbrace: {
    tag: "mo",
    uc: "{",
    atval: "1",
    ttype: "stretchy"
  },
  langle: {
    tag: "mo",
    uc: "\u2329",
    atval: "1",
    ttype: "stretchy"
  },
  lfloor: {
    tag: "mo",
    uc: "\u230A",
    atval: "1",
    ttype: "stretchy"
  },
  lceil: {
    tag: "mo",
    uc: "\u2308",
    atval: "1",
    ttype: "stretchy"
  },
  
  // rtag:"mi" causes space to be inserted before a following sin, cos, etc.
  // (see function LMparseExpr() )
  rbrack: {
    tag: "mo",
    uc: "]",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rbrace: {
    tag: "mo",
    uc: " }",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rangle: {
    tag: "mo",
    uc: "\u232A",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rfloor: {
    tag: "mo",
    uc: "\u230B",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  rceil: {
    tag: "mo",
    uc: "\u2309",
    rtag: "mi",
    atval: "1",
    ttype: "stretchy"
  },
  
  // "|", "\\|", "\\vert" and "\\Vert" modified later: lspace = rspace = 0em
  vert: {
    tag: "mo",
    uc: "\u2223",
    atval: "1",
    ttype: "stretchy"
  },
  Vert: {
    tag: "mo",
    uc: "\u2225",
    atval: "1",
    ttype: "stretchy"
  },
  mid: {
    tag: "mo",
    uc: "\u2223",
    atval: "1",
    ttype: "stretchy"
  },
  parallel: {
    tag: "mo",
    uc: "\u2225",
    atval: "1",
    ttype: "stretchy"
  },
  backslash: {
    tag: "mo",
    uc: "\u2216",
    atval: "1",
    ttype: "stretchy"
  },
  setminus: {
    tag: "mo",
    uc: "\\",
    ttype: "const"
  },
  
  //miscellaneous symbols
  quad: {
    tag: "mspace",
    atname: "width",
    atval: "1em",
    ttype: "space"
  },
  qquad: {
    tag: "mspace",
    atname: "width",
    atval: "2em",
    ttype: "space"
  },
  prime: {
    tag: "mo",
    uc: "\u2032",
    ttype: "const"
  },
  ldots: {
    tag: "mo",
    uc: "\u2026",
    ttype: "const"
  },
  cdots: {
    tag: "mo",
    uc: "\u22EF",
    ttype: "const"
  },
  vdots: {
    tag: "mo",
    uc: "\u22EE",
    ttype: "const"
  },
  ddots: {
    tag: "mo",
    uc: "\u22F1",
    ttype: "const"
  },
  forall: {
    tag: "mo",
    uc: "\u2200",
    ttype: "const"
  },
  exists: {
    tag: "mo",
    uc: "\u2203",
    ttype: "const"
  },
  Re: {
    tag: "mo",
    uc: "\u211C",
    ttype: "const"
  },
  Im: {
    tag: "mo",
    uc: "\u2111",
    ttype: "const"
  },
  aleph: {
    tag: "mo",
    uc: "\u2135",
    ttype: "const"
  },
  hbar: {
    tag: "mo",
    uc: "\u210F",
    ttype: "const"
  },
  ell: {
    tag: "mo",
    uc: "\u2113",
    ttype: "const"
  },
  wp: {
    tag: "mo",
    uc: "\u2118",
    ttype: "const"
  },
  emptyset: {
    tag: "mo",
    uc: "\u2205",
    ttype: "const"
  },
  oo: {
    tag: "mo",
    uc: "\u221E",
    ttype: "const"
  },
  infty: {
    tag: "mo",
    uc: "\u221E",
    ttype: "const"
  },
  surd: {
    tag: "mo",
    uc: "\u221A",
    ttype: "definition"
  },
  partial: {
    tag: "mo",
    uc: "\u2202",
    ttype: "const"
  },
  nabla: {
    tag: "mo",
    uc: "\u2207",
    ttype: "const"
  },
  triangle: {
    tag: "mo",
    uc: "\u25B3",
    ttype: "const"
  },
  therefore: {
    tag: "mo",
    uc: "\u2234",
    ttype: "const"
  },
  angle: {
    tag: "mo",
    uc: "\u2220",
    ttype: "const"
  },
  diamond: {
    tag: "mo",
    uc: "\u22C4",
    ttype: "const"
  },
  Diamond: {
    tag: "mo",
    uc: "\u25C7",
    ttype: "const"
  },
  neg: {
    tag: "mo",
    uc: "\u00AC",
    ttype: "const"
  },
  lnot: {
    tag: "mo",
    uc: "\u00AC",
    ttype: "const"
  },
  bot: {
    tag: "mo",
    uc: "\u22A5",
    ttype: "const"
  },
  top: {
    tag: "mo",
    uc: "\u22A4",
    ttype: "const"
  },
  square: {
    tag: "mo",
    uc: "\u25AB",
    ttype: "const"
  },
  Box: {
    tag: "mo",
    uc: "\u25A1",
    ttype: "const"
  },
  wr: {
    tag: "mo",
    uc: "\u2240",
    ttype: "const"
  },
  
  // standard functions
  // Note "underover" *must* have tag:"mo" to work properly
  arccos: {
    tag: "mi",
    uc: "arccos",
    ttype: "unary",
    func: true
  },
  arcsin: {
    tag: "mi",
    uc: "arcsin",
    ttype: "unary",
    func: true
  },
  arctan: {
    tag: "mi",
    uc: "arctan",
    ttype: "unary",
    func: true
  },
  arg: {
    tag: "mi",
    uc: "arg",
    ttype: "unary",
    func: true
  },
  cos: {
    tag: "mi",
    uc: "cos",
    ttype: "unary",
    func: true
  },
  cosh: {
    tag: "mi",
    uc: "cosh",
    ttype: "unary",
    func: true
  },
  cot: {
    tag: "mi",
    uc: "cot",
    ttype: "unary",
    func: true
  },
  coth: {
    tag: "mi",
    uc: "coth",
    ttype: "unary",
    func: true
  },
  csc: {
    tag: "mi",
    uc: "csc",
    ttype: "unary",
    func: true
  },
  deg: {
    tag: "mi",
    uc: "deg",
    ttype: "unary",
    func: true
  },
  det: {
    tag: "mi",
    uc: "det",
    ttype: "unary",
    func: true
  },
  dim: {
    tag: "mi",
    uc: "dim",
    ttype: "unary",
    func: true // "const"?
  },
  exp: {
    tag: "mi",
    uc: "exp",
    ttype: "unary",
    func: true
  },
  gcd: {
    tag: "mi",
    uc: "gcd",
    ttype: "unary",
    func: true // "const"?
  },
  hom: {
    tag: "mi",
    uc: "hom",
    ttype: "unary",
    func: true
  },
  inf: {
    tag: "mo",
    uc: "inf",
    ttype: "underover"
  },
  ker: {
    tag: "mi",
    uc: "ker",
    ttype: "unary",
    func: true
  },
  lg: {
    tag: "mi",
    uc: "lg",
    ttype: "unary",
    func: true
  },
  lim: {
    tag: "mo",
    uc: "lim",
    ttype: "underover"
  },
  liminf: {
    tag: "mo",
    uc: "liminf",
    ttype: "underover"
  },
  limsup: {
    tag: "mo",
    uc: "limsup",
    ttype: "underover"
  },
  ln: {
    tag: "mi",
    uc: "ln",
    ttype: "unary",
    func: true
  },
  log: {
    tag: "mi",
    uc: "log",
    ttype: "unary",
    func: true
  },
  max: {
    tag: "mo",
    uc: "max",
    ttype: "underover"
  },
  min: {
    tag: "mo",
    uc: "min",
    ttype: "underover"
  },
  Pr: {
    tag: "mi",
    uc: "Pr",
    ttype: "unary",
    func: true
  },
  sec: {
    tag: "mi",
    uc: "sec",
    ttype: "unary",
    func: true
  },
  sin: {
    tag: "mi",
    uc: "sin",
    ttype: "unary",
    func: true
  },
  sinh: {
    tag: "mi",
    uc: "sinh",
    ttype: "unary",
    func: true
  },
  sup: {
    tag: "mo",
    uc: "sup",
    ttype: "underover"
  },
  tan: {
    tag: "mi",
    uc: "tan",
    ttype: "unary",
    func: true
  },
  tanh: {
    tag: "mi",
    uc: "tanh",
    ttype: "unary",
    func: true
  },
  
  // arrows
  gets: {
    tag: "mo",
    uc: "\u2190",
    ttype: "const"
  },
  leftarrow: {
    tag: "mo",
    uc: "\u2190",
    ttype: "const"
  },
  to: {
    tag: "mo",
    uc: "\u2192",
    ttype: "const"
  },
  rightarrow: {
    tag: "mo",
    uc: "\u2192",
    ttype: "const"
  },
  leftrightarrow: {
    tag: "mo",
    uc: "\u2194",
    ttype: "const"
  },
  uparrow: {
    tag: "mo",
    uc: "\u2191",
    ttype: "const"
  },
  downarrow: {
    tag: "mo",
    uc: "\u2193",
    ttype: "const"
  },
  updownarrow: {
    tag: "mo",
    uc: "\u2195",
    ttype: "const"
  },
  Leftarrow: {
    tag: "mo",
    uc: "\u21D0",
    ttype: "const"
  },
  Rightarrow: {
    tag: "mo",
    uc: "\u21D2",
    ttype: "const"
  },
  Leftrightarrow: {
    tag: "mo",
    uc: "\u21D4",
    ttype: "const"
  },
  Uparrow: {
    tag: "mo",
    uc: "\u21D1",
    ttype: "const"
  },
  Downarrow: {
    tag: "mo",
    uc: "\u21D3",
    ttype: "const"
  },
  Updownarrow: {
    tag: "mo",
    uc: "\u21D5",
    ttype: "const"
  },
  mapsto: {
    tag: "mo",
    uc: "\u21A6",
    ttype: "const"
  },
  longleftarrow: {
    tag: "mo",
    uc: "\u2190",
    ttype: "long"
  },
  longrightarrow: {
    tag: "mo",
    uc: "\u2192",
    ttype: "long"
  },
  longleftrightarrow: {
    tag: "mo",
    uc: "\u2194",
    ttype: "long"
  },
  Longleftarrow: {
    tag: "mo",
    uc: "\u21D0",
    ttype: "long"
  },
  Longrightarrow: {
    tag: "mo",
    uc: "\u21D2",
    ttype: "long"
  },
  Longleftrightarrow: {
    tag: "mo",
    uc: "\u21D4",
    ttype: "long"
  },
  longmapsto: {
    tag: "mo",
    uc: "\u21A6",
    ttype: "const"
  },
  iff: {
    tag: "mo",
    uc: "~\\Longleftrightarrow~",
    ttype: "definition"
  },
  //  disaster if "long"

  // commands with argument
  // LMsqrt, LMroot, LMfrac, LMover, LMsub, LMsup, LMtext, LMmbox, LMatop, LMchoose,
  // LMdiv, LMquote,

  // diacritical marks
  acute: {
    tag: "mover",
    uc: "\u00B4",
    ttype: "unary",
    acc: true
  },
  grave: {
    tag: "mover",
    uc: "\u0060",
    ttype: "unary",
    acc: true
  },
  breve: {
    tag: "mover",
    uc: "\u02D8",
    ttype: "unary",
    acc: true
  },
  check: {
    tag: "mover",
    uc: "\u02C7",
    ttype: "unary",
    acc: true
  },
  dot: {
    tag: "mover",
    uc: ".",
    ttype: "unary",
    acc: true
  },
  ddot: {
    tag: "mover",
    uc: "..",
    ttype: "unary",
    acc: true
  },
  mathring: {
    tag: "mover",
    uc: "\u00B0",
    ttype: "unary",
    acc: true
  },
  vec: {
    tag: "mover",
    uc: "\u20D7",
    ttype: "unary",
    acc: true
  },
  overrightarrow: {
    tag: "mover",
    uc: "\u20D7",
    ttype: "unary",
    acc: true
  },
  overleftarrow: {
    tag: "mover",
    uc: "\u20D6",
    ttype: "unary",
    acc: true
  },
  hat: {
    tag: "mover",
    uc: "\u005E",
    ttype: "unary",
    acc: true
  },
  widehat: {
    tag: "mover",
    uc: "\u0302",
    ttype: "unary",
    acc: true
  },
  tilde: {
    tag: "mover",
    uc: "~",
    ttype: "unary",
    acc: true
  },
  widetilde: {
    tag: "mover",
    uc: "\u02DC",
    ttype: "unary",
    acc: true
  },
  bar: {
    tag: "mover",
    uc: "\u203E",
    ttype: "unary",
    acc: true
  },
  overbrace: {
    tag: "mover",
    uc: "\u23B4",
    ttype: "unary",
    acc: true
  },
  overline: {
    tag: "mover",
    uc: "\u00AF",
    ttype: "unary",
    acc: true
  },
  underbrace: {
    tag: "munder",
    uc: "\u23B5",
    ttype: "unary",
    acc: true
  },
  underline: {
    tag: "munder",
    uc: "\u00AF",
    ttype: "unary",
    acc: true
  },
  
  // typestyles and fonts
  displaystyle: {
    tag: "mstyle",
    atname: "displaystyle",
    atval: "true",
    ttype: "unary"
  },
  textstyle: {
    tag: "mstyle",
    atname: "displaystyle",
    atval: "false",
    ttype: "unary"
  },
  scriptstyle: {
    tag: "mstyle",
    atname: "scriptlevel",
    atval: "1",
    ttype: "unary"
  },
  scriptscriptstyle: {
    tag: "mstyle",
    atname: "scriptlevel",
    atval: "2",
    ttype: "unary"
  },
  textrm: {
    tag: "mstyle",
    uc: "\\mathrm",
    ttype: "definition"
  },
  mathbf: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "bold",
    ttype: "unary"
  },
  textbf: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "bold",
    ttype: "unary"
  },
  mathit: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "italic",
    ttype: "unary"
  },
  textit: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "italic",
    ttype: "unary"
  },
  mathtt: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "monospace",
    ttype: "unary"
  },
  texttt: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "monospace",
    ttype: "unary"
  },
  mathsf: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "sans-serif",
    ttype: "unary"
  },
  mathbb: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "double-struck",
    ttype: "unary",
    codes: "LMbbb"
  },
  mathcal: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "script",
    ttype: "unary",
    codes: "LMcal"
  },
  mathfrak: {
    tag: "mstyle",
    atname: "mathvariant",
    atval: "fraktur",
    ttype: "unary",
    codes: "LMfrk"
  }
};

export default Latex;
