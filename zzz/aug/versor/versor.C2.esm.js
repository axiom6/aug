
import versor from './versor.esm.js';

let C2 = versor.create({
	metric:[1, 1, 1, -1],
	types: [
		{ name:"Vec2", bases:["e1", "e2"] },
		{ name:"Biv2", bases:["e12"] },
		{ name:"Pss", bases:["e1234"] },
		{ name:"Rot", bases:["s", "e12"] },
		{ name:"Pnt", bases:["e1", "e2", "e3", "e4"], dual:true },
		{ name:"Par", bases:["e12", "e13", "e14", "e23", "e24", "e34"] },
		{ name:"Dll", bases:["e1", "e2", "e4"], dual:true },
		{ name:"Lin", bases:["e134", "e234", "e124"] },
		{ name:"Cir", bases:["e123", "e234", "e124", "e134"] },
		{ name:"Flp", bases:["e14", "e24", "e34"] },
		{ name:"Drv", bases:["e14", "e24"] },
		{ name:"Tnv", bases:["e13", "e23"] },
		{ name:"Dil", bases:["s", "e34"] },
		{ name:"Trs", bases:["s", "e14", "e24"] },
		{ name:"Mot", bases:["s", "e12", "e14", "e24"] },
		{ name:"Bst", bases:["s", "e12", "e13", "e14", "e23", "e24", "e34"] },
	],
	conformal:true
});

C2.Ori = C2.e3(1);
C2.Inf = C2.e4(1);

C2.Ro = {
	point: function(x, y) {
		return C2['Pnt'](x, y, 1, (x*x+y*y)*0.5);
	},
	ipoint: function(x, y) {
		return C2['Pnt'](x, y, -1, (x*x+y*y)*0.5);
	},
	circle: function(x, y, r) {
		let s = C2.Ro.point(x, y);
		let r2 = r*r;
		if(r > 0) s[3] -= 0.5*r2;
		else s[3] += 0.5*r2;
		return s;
	},
	size: function(a) {
		let v1 = C2.Inf.ip(a);
		let v2 = a.gp(a.involute()).gp(v1.gp(v1).inverse());
		return a.isdual() ? -v2[0] : v2[0];
	},
	radius: function(a) {
		let size = C2.Ro.size(a);
		if(size < 0) return -Math.sqrt(-size);
		else return Math.sqrt(size);
	},
	cen: function(a) {
		let v = C2.Inf.ip(a);
		return C2['Pnt'](a.gp(C2.Inf).gp(a).div(v.gp(v).gp(-2)));
	},
	// squared distance
	sqd: function(a, b) {
		return -a.ip(b)[0]*2;
	},
	// distance
	dst: function(a, b) {
		return Math.sqrt(Math.abs(C2.Ro.sqd(a, b)));
	},
	car: function(a) {
		return a.op(C2.Inf);
	},
	// split a point pair into its 2 points, returns an array
	split: function(pp) {
		let r = Math.sqrt( Math.abs( pp.ip(pp)[0]  ))
		let dlp = C2.e4(-1).ip(pp);
		let bstA = C2['Bst'](pp);
		let bstB = C2['Bst'](pp);
		bstA[0] -= r;
		bstB[0] += r;
		let pA = C2['Pnt'](bstA.div(dlp));
		let pB = C2['Pnt'](bstB.div(dlp));
		return [pA, pB];
	},
};

// normalize a point to have weight 1
C2.Ro.point.normalize = function(p) {
	return p.gp(1/p[2]);
}
	
C2.Fl = {
	line: function(p1, p2) {
		return p1.op(p2).op(C2.Inf);
	},
	dir: function(a) {
		return a.isdual() ?
			C2.e4(-1).op(a) :
			C2.e4(-1).ip(a);
	},
	loc: function(a, p) {
		if(a.isdual()) return C2['Pnt'](p.op(a).div(a));
		else return C2['Pnt'](p.ip(a).div(a));
	}
};

let cosh = function(v) {
	return (Math.exp(v) + Math.exp(-v))*0.5;
}
	
let sinh = function(v) {
	return (Math.exp(v) - Math.exp(-v))*0.5;
}

C2.Op = {

	trs: function(x, y) {
		return C2['Trs'](1, 0.5*x, 0.5*y);
	},
	bst: function(pp) {
		let sz = pp.ip(pp)[0];
		
		// Boost is hyperbolic, so use sinh and cosh instead of sin and cos 
		// to determine the component magnitudes
		let cn, sn;
		if(sz < 0) {
			let norm = Math.sqrt(-sz);
			cn = cosh(norm);
			sn = -sinh(norm);
		}
		else if(sz > 0) {
			let norm = Math.sqrt(sz);
			cn = cosh(norm);
			sn = -sinh(norm);
		}
		else {
			cn = 1;
			sn = -1;
		}
		let res = C2['Bst'](pp.gp(sn));
		res[0] = cn;
		return res;
	},
	rj: function(a, b) {
		return a.op(b).div(b);
	},
	pj: function(a, b) {
		return a.ip(b).div(b);
	}
};

C2.Ta = {
	dir: function(el) {
		return C2.Inf.ip(el).op(C2.Inf);
	},
	loc: function(el) {
		return C2.Vec(el.div(C2.e4(-1).ip(el)));
	}
}

C2.Dr = {
	direction: function(x, y) {
		return C2.Drv(x, y);
	},
	elem: function(d) {
		return C2.Ori.ip(d.involute());
	}
}

C2.dot = function(el) {
	return el.ip(el);
}

C2.rdot = function(el) {
	return el.ip(el.reverse());
}

C2.wt = function(el) {
	return C2.dot(el, el)[0];
}

C2.rwt = function(el) {
	return C2.rdot(el, el)[0];
}

C2.norm = function(el) {
	let a = C2.rwt(el);
	if(a < 0) return 0;
	return Math.sqrt(a);
}

C2.rnorm = function(el) {
	let a = C2.rwt(el);
	if(a < 0) return -Math.sqrt(-a);
	return Math.sqrt(a);
}

C2.mag = function(el) {
	return Math.sqrt(Math.abs(C2.wt(el)));
}

C2.unit = function(el) {
	let mag = C2.mag(el);
	return el.gp(1/mag);
}

C2.runit = function(el) {
	let mag = C2.rnorm(el);
	return el.gp(1/mag);
}

C2.dual = function (el) {
	return el.gp(C2['Pss'](-1));
}
C2.undual = function (el) {
	return el.gp(C2['Pss'](1));
}

// Euclidean duals
C2.duale = function(el) {
	return el.gp(C2['Biv2'](-1));
}
C2.uduale = function(el) {
	return el.gp(C2['Biv2'](1));
}

export default C2;