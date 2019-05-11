

class Op {

  constructor() {
    this.length      = 0;
    this.grade_start = [];
    this.basis_bits  = [];
    this.bits_basis  = [];
    this.low         = 0;
  }

  map( fn ) {}

  static bc(v) { v=v-((v>>1)& 0x55555555);
    v=(v&0x33333333)+((v>>2)&0x33333333);
    c=((v+(v>>4)&0xF0F0F0F)*0x1010101)>>24;
    return c
  }

  static simplify_bits(A, B, p2) {
    { let n=p2||(p+q+r),t=0,ab=A&B,res=A^B;
      if (ab&((1<<r)-1)) return [0,0];
      while (n--) t^=(A=A>>1); t&=B; t^=ab>>(p+r); t^=t>>16; t^=t>>8; t^=t>>4;
      return [1-2*(27030>>(t&15)&1),res]; }
  }

  def() {

   this.basisg = this.grade_start.slice(0,this.grade_start.length-1).map((x,i)=>basis.slice(x,this.grade_start[i+1]));
   this.counts = this.grade_start.map((x,i,a)=>i===a.length-1?0:a[i+1]-x).slice(0,tot+1);
   this.basis_bits = basis.map(x=>x==='1'?0:x.slice(1).match(tot>9?/\d\d/g:/\d/g).reduce((a,b)=>a+(1<<(b-this.low)),0));
// this.basis_bits_for_each = this.basis_bits.forEach((b,i)=>this.bits_basis[b]=i);
   this.metric = this.basisg.map((x,xi)=>x.map((y,yi)=>
     Op.simplify_bits(this.basis_bits[this.grade_start[xi]+yi],this.basis_bits[this.grade_start[xi]+yi])[0]));
  this.drms   = this.basisg.map((x,xi)=>x.map((y,yi)=>
    Op.simplify_bits(this.basis_bits[this.grade_start[xi]+yi],(~this.basis_bits[this.grade_start[xi]+yi])&((1<<tot)-1))[0]));
  }

  /// multivector addition, subtraction and scalar multiplication.
  Add(b, r) {
    r = r || new this.constructor();
    for (let i = 0, l = Math.max(this.length, b.length); i < l; i++)
      if (!this[i] || !b[i]) r[i] = (!this[i]) ? b[i] : this[i];
      else {
        if (r[i] === undefined) r[i] = [];
        for (let j = 0, m = Math.max(this[i].length, b[i].length); j < m; j++) r[i][j] = (this[i][j] || 0) + (b[i][j] || 0);
      }
    return r;
  }

  Sub(b, r) {
    r = r || new this.constructor();
    for (let i = 0, l = Math.max(this.length, b.length); i < l; i++)
      if (!this[i] || !b[i]) r[i] = (!this[i]) ? (b[i] ? b[i].map(x => -x) : undefined) : this[i];
      else {
        if (r[i] === undefined) r[i] = [];
        for (let j = 0, m = Math.max(this[i].length, b[i].length); j < m; j++)
          r[i][j] = (this[i][j] || 0) - (b[i][j] || 0); }
    return r;
  }

  Scale(s) {
    return this.map(x => x && x.map(y => y * s));
  }

  // geometric product.
  Mul(b, r) {
    r = r || new this.constructor();
    for (let i = 0, x, gsx; gsx = this.grade_start[i], x = this[i], i < this.length; i++)
      if (x) for (let j = 0, y, gsy; gsy = this.grade_start[j], y = b[j], j < b.length; j++)
        if (y) for (let a = 0; a < x.length; a++) if (x[a]) for (let bb = 0; bb < y.length; bb++)
          if (y[bb]) {
      if (i === j && a === bb) {
        r[0] = r[0] || [0];
        r[0][0] += x[a] * y[bb] * metric[i][a]; }
      else {
        let rn = Op.simplify_bits(this.basis_bits[gsx + a], this.basis_bits[gsy + bb]), g = Op.bc(rn[1]),
          e = this.bits_basis[rn[1]] - this.grade_start[g];
        if (!r[g]) r[g] = [];
        r[g][e] = (r[g][e] || 0) + rn[0] * x[a] * y[bb];
      }
    }
    return r;
  }

  // outer product.
  Wedge(b, r) {
    r = r || new this.constructor();
    for (let i = 0, x, gsx; gsx = this.grade_start[i], x = this[i], i < this.length; i++)
      if (x) for (let j = 0, y, gsy; gsy = this.grade_start[j], y = b[j], j < b.length; j++)
        if (y) for (let a = 0; a < x.length; a++) if (x[a]) for (let bb = 0; bb < y.length; bb++)
          if (y[bb]) {
            if (i !== j || a !== bb) {
              let n1 = this.basis_bits[gsx + a], n2 = this.basis_bits[gsy + bb], rn = Op.simplify_bits(n1, n2, tot), g = Op.bc(rn[1]),
                e = this.bits_basis[rn[1]] - this.grade_start[g];
              if (g === i + j) {
                if (!r[g]) r[g] = [];
                r[g][e] = (r[g][e] || 0) + rn[0] * x[a] * y[bb]; } } }
    return r;
  }

}

export default Op;