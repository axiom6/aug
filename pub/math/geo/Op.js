var Op;

Op = (function() {
  class Op {
    
    // Precedence	Inline JS	AsciiMath	Object Oriented	Functional
    // 5	x.Involute	tilde(x)	x.Involute	A.Involute(x)
    // 5	x.Reverse	ddot(x)	x.Reverse	A.Reverse(x)
    // 5	~x	hat(x)	x.Conjugate	A.Conjugate(x)
    // 5	!x	bar(x)	x.Dual	A.Dual(x)
    // 4 rtl	x**-1	x^-1	x.Inverse	A.Inverse(x)
    // 4 rtl	x**y	x^y	x.Pow(y)	A.Pow(x,y)
    // 3	x^y	x^^y	x.Wedge(y)	A.Wedge(x,y)
    // 3	x<<y	x*y	x.Dot(y)	A.Dot(x,y)
    // 3	x&y	bar(bar(x)^^bar(y))	x.Vee(y)	A.Vee(x,y)
    // 3	x>>>y	x ** y ** hat(x)	x.Mul(y).Mul(x.Conjugate)	A.sw(x,y)
    // 2	x*y	x**y	x.Mul(y)	A.Mul(x,y)
    // 2	x/y	x/y	x.Div(y)	A.Div(x,y)
    // 1	x-y	x-y	x.Sub(y)	A.Sub(x,y)
    // 1	x+y	x+y	x.Add(y)	A.Add(x,y)
    // 1e1	1e_1	new A([0,1])	A.Vector(1)
    // 2e2	2e_2	new A([0,0,2,0])	A.Vector(0,2)
    // 2e12	2e_12	new A([0,0,0,2])	A.Bivector(2)
    constructor(arg) {}

    add(u, v) {
      return u + v;
    }

    sub(u, v) {
      return u - v;
    }

    mul(u, v) {
      return u * v; // Scalar and geometric product
    }

    div(u, v) {
      return u / v;
    }

    pow(u, v) {
      return u ** v;
    }

    dot(u, v) {
      return u(~v);
    }

    wedge(u, v) {
      return u ^ v;
    }

    vee(u, v) {
      return u & v;
    }

    dual(u) {
      return u;
    }

    inverse(u) {
      return u;
    }

    conjugate(u) {
      return u;
    }

    reverse(u) {
      return u;
    }

    involute(u) {
      return u;
    }

    reflect(u, v) {
      return u * v * this.conjugate(u);
    }

    rotate(u, v) {
      return u * v * this.conjugate(u);
    }

    magnitude(u) {
      return u;
    }

    grade(u) {
      return u;
    }

  };

  rotor;

  (function(u) {
    return u;
  });

  return Op;

}).call(this);

export default Op;
