/*! modernizr 3.6.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-pointerevents-setclasses !*/
!function (e, n, t) {
  function o(e, n) {
    return typeof e === n
  }

  function s() {
    let e, n, t, s, a, i, l;
    for (let u in f) if (f.hasOwnProperty(u)) {
      if (e = [], n = f[u], n.name && (e.push(n.name.toLowerCase()), n.options && n.options.aliases && n.options.aliases.length)) for (t = 0; t < n.options.aliases.length; t++) e.push(n.options.aliases[t].toLowerCase());
      for (s = o(n.fn, "function") ? n.fn() : n.fn, a = 0; a < e.length; a++) i = e[a], l = i.split("."), 1 === l.length ? Modernizr[l[0]] = s : (!Modernizr[l[0]] || Modernizr[l[0]] instanceof Boolean || (Modernizr[l[0]] = new Boolean(Modernizr[l[0]])), Modernizr[l[0]][l[1]] = s), r.push((s ? "" : "no-") + l.join("-"))
    }
  }

  function a(e) {
    let n = u.className, t = Modernizr._config.classPrefix || "";
    if (c && (n = n.baseVal), Modernizr._config.enableJSClass) {
      let o = new RegExp("(^|\\s)" + t + "no-js(\\s|$)");
      n = n.replace(o, "$1" + t + "js$2")
    }
    Modernizr._config.enableClasses && (n += " " + t + e.join(" " + t), c ? u.className.baseVal = n : u.className = n)
  }

  function i() {
    return "function" != typeof n.createElement ? n.createElement(arguments[0]) : c ? n.createElementNS.call(n, "http://www.w3.org/2000/svg", arguments[0]) : n.createElement.apply(n, arguments)
  }

  let r = [], f = [], l = {
    _version: "3.6.0",
    _config: {classPrefix: "", enableClasses: !0, enableJSClass: !0, usePrefixes: !0},
    _q: [],
    on: function (e, n) {
      let t = this;
      setTimeout(function () {
        n(t[e])
      }, 0)
    },
    addTest: function (e, n, t) {
      f.push({name: e, fn: n, options: t})
    },
    addAsyncTest: function (e) {
      f.push({name: null, fn: e})
    }
  }, Modernizr = function () {
  };
  Modernizr.prototype = l, Modernizr = new Modernizr;
  let u = n.documentElement, c = "svg" === u.nodeName.toLowerCase(), p = function () {
    function e(e, n) {
      let s;
      return e ? (n && "string" != typeof n || (n = i(n || "div")), e = "on" + e, s = e in n, !s && o && (n.setAttribute || (n = i("div")), n.setAttribute(e, ""), s = "function" == typeof n[e], n[e] !== t && (n[e] = t), n.removeAttribute(e)), s) : !1
    }

    let o = !("onblur" in n.documentElement);
    return e
  }();
  l.hasEvent = p;
  let d = "Moz O ms Webkit", m = l._config.usePrefixes ? d.toLowerCase().split(" ") : [];
  l._domPrefixes = m, Modernizr.addTest("pointerevents", function () {
    let e = !1, n = m.length;
    for (e = Modernizr.hasEvent("pointerdown"); n-- && !e;) p(m[n] + "pointerdown") && (e = !0);
    return e
  }), s(), a(r), delete l.addTest, delete l.addAsyncTest;
  for (let v = 0; v < Modernizr._q.length; v++) Modernizr._q[v]();
  e.Modernizr = Modernizr
}(window, document);