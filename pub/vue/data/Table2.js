var firebase = null;

!function (e, t) { firebase=t(); }(undefined, function () {
  var i = function (e, t) {
    return (i = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (e, t) {
      e.__proto__ = t;
    } || function (e, t) {
      for (var r in t) t.hasOwnProperty(r) && (e[r] = t[r]);
    })(e, t)
  };
  var r = function () {
    return (r = Object.assign || function (e) {
      for (var t, r = 1, n = arguments.length; r < n; r++) for (var o in t = arguments[r]) Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e
    }).apply(this, arguments)
  };

  function d(e, t) {
    if (!(t instanceof Object)) return t;
    switch (t.constructor) {
      case Date:
        return new Date(t.getTime());
      case Object:
        void 0 === e && (e = {});
        break;
      case Array:
        e = [];
        break;
      default:
        return t
    }
    for (var r in t) t.hasOwnProperty(r) && (e[r] = d(e[r], t[r]));
    return e
  }

  function n(e, t, r) {
    e[t] = r;
  }

  var h = function (n) {
    function o(e, t) {
      var r = n.call(this, t) || this;
      return r.code = e, r.name = "FirebaseError", Object.setPrototypeOf(r, o.prototype), Error.captureStackTrace && Error.captureStackTrace(r, a.prototype.create), r
    }

    return function (e, t) {
      function r() {
        this.constructor = e;
      }

      i(e, t), e.prototype = null === t ? Object.create(t) : (r.prototype = t.prototype, new r);
    }(o, n), o
  }(Error), a = function () {
    function e(e, t, r) {
      this.service = e, this.serviceName = t, this.errors = r;
    }

    return e.prototype.create = function (e) {
      for (var t = [], r = 1; r < arguments.length; r++) t[r - 1] = arguments[r];
      for (var n, o = t[0] || {}, i = this.service + "/" + e, a = this.errors[e], s = a ? (n = o, a.replace(v, function (e, t) {
        var r = n[t];
        return null != r ? r.toString() : "<" + t + "?>"
      })) : "Error", c = this.serviceName + ": " + s + " (" + i + ").", u = new h(i, c), l = 0, p = Object.keys(o); l < p.length; l++) {
        var f = p[l];
        "_" !== f.slice(-1) && (f in u && console.warn('Overwriting FirebaseError base field "' + f + '" can cause unexpected behavior.'), u[f] = o[f]);
      }
      return u
    }, e
  }();
  var v = /\{\$([^}]+)}/g;

  function o(e, t) {
    var r = new c(e, t);
    return r.subscribe.bind(r)
  }

  var s, e, c = function () {
    function e(e, t) {
      var r = this;
      this.observers = [], this.unsubscribes = [], this.observerCount = 0, this.task = Promise.resolve(), this.finalized = !1, this.onNoObservers = t, this.task.then(function () {
        e(r);
      }).catch(function (e) {
        r.error(e);
      });
    }

    return e.prototype.next = function (t) {
      this.forEachObserver(function (e) {
        e.next(t);
      });
    }, e.prototype.error = function (t) {
      this.forEachObserver(function (e) {
        e.error(t);
      }), this.close(t);
    }, e.prototype.complete = function () {
      this.forEachObserver(function (e) {
        e.complete();
      }), this.close();
    }, e.prototype.subscribe = function (e, t, r) {
      var n, o = this;
      if (void 0 === e && void 0 === t && void 0 === r) throw new Error("Missing Observer.");
      void 0 === (n = function (e, t) {
        if ("object" != typeof e || null === e) return !1;
        for (var r = 0, n = t; r < n.length; r++) {
          var o = n[r];
          if (o in e && "function" == typeof e[o]) return !0
        }
        return !1
      }(e, ["next", "error", "complete"]) ? e : {
        next: e,
        error: t,
        complete: r
      }).next && (n.next = u), void 0 === n.error && (n.error = u), void 0 === n.complete && (n.complete = u);
      var i = this.unsubscribeOne.bind(this, this.observers.length);
      return this.finalized && this.task.then(function () {
        try {
          o.finalError ? n.error(o.finalError) : n.complete();
        } catch (e) {
        }
      }), this.observers.push(n), i
    }, e.prototype.unsubscribeOne = function (e) {
      void 0 !== this.observers && void 0 !== this.observers[e] && (delete this.observers[e], this.observerCount -= 1, 0 === this.observerCount && void 0 !== this.onNoObservers && this.onNoObservers(this));
    }, e.prototype.forEachObserver = function (e) {
      if (!this.finalized) for (var t = 0; t < this.observers.length; t++) this.sendOne(t, e);
    }, e.prototype.sendOne = function (e, t) {
      var r = this;
      this.task.then(function () {
        if (void 0 !== r.observers && void 0 !== r.observers[e]) try {
          t(r.observers[e]);
        } catch (e) {
          "undefined" != typeof console && console.error && console.error(e);
        }
      });
    }, e.prototype.close = function (e) {
      var t = this;
      this.finalized || (this.finalized = !0, void 0 !== e && (this.finalError = e), this.task.then(function () {
        t.observers = void 0, t.onNoObservers = void 0;
      }));
    }, e
  }();

  function u() {
  }

  (e = s || (s = {}))[e.DEBUG = 0] = "DEBUG", e[e.VERBOSE = 1] = "VERBOSE", e[e.INFO = 2] = "INFO", e[e.WARN = 3] = "WARN", e[e.ERROR = 4] = "ERROR", e[e.SILENT = 5] = "SILENT";
  var t, l = s.INFO, p = function (e, t) {
      for (var r = [], n = 2; n < arguments.length; n++) r[n - 2] = arguments[n];
      if (!(t < e.logLevel)) {
        var o = (new Date).toISOString();
        switch (t) {
          case s.DEBUG:
          case s.VERBOSE:
            console.log.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
            break;
          case s.INFO:
            console.info.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
            break;
          case s.WARN:
            console.warn.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
            break;
          case s.ERROR:
            console.error.apply(console, ["[" + o + "]  " + e.name + ":"].concat(r));
            break;
          default:
            throw new Error("Attempted to log a message with an invalid logType (value: " + t + ")")
        }
      }
    }, f = function () {
      function e(e) {
        this.name = e, this._logLevel = l, this._logHandler = p;
      }

      return Object.defineProperty(e.prototype, "logLevel", {
        get: function () {
          return this._logLevel
        }, set: function (e) {
          if (!(e in s)) throw new TypeError("Invalid value assigned to `logLevel`");
          this._logLevel = e;
        }, enumerable: !0, configurable: !0
      }), Object.defineProperty(e.prototype, "logHandler", {
        get: function () {
          return this._logHandler
        }, set: function (e) {
          if ("function" != typeof e) throw new TypeError("Value assigned to `logHandler` must be a function");
          this._logHandler = e;
        }, enumerable: !0, configurable: !0
      }), e.prototype.debug = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        this._logHandler.apply(this, [this, s.DEBUG].concat(e));
      }, e.prototype.log = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        this._logHandler.apply(this, [this, s.VERBOSE].concat(e));
      }, e.prototype.info = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        this._logHandler.apply(this, [this, s.INFO].concat(e));
      }, e.prototype.warn = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        this._logHandler.apply(this, [this, s.WARN].concat(e));
      }, e.prototype.error = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        this._logHandler.apply(this, [this, s.ERROR].concat(e));
      }, e
    }(),
    b = ((t = {})["no-app"] = "No Firebase App '{$name}' has been created - call Firebase App.initializeApp()", t["bad-app-name"] = "Illegal App name: '{$name}", t["duplicate-app"] = "Firebase App named '{$name}' already exists", t["app-deleted"] = "Firebase App named '{$name}' already deleted", t["duplicate-service"] = "Firebase service named '{$name}' already registered", t["invalid-app-argument"] = "firebase.{$name}() takes either no argument or a Firebase App instance.", t),
    y = new a("app", "Firebase", b), g = "[DEFAULT]", m = [], E = function () {
      function e(e, t, r) {
        this.firebase_ = r, this.isDeleted_ = !1, this.services_ = {}, this.name_ = t.name, this.automaticDataCollectionEnabled_ = t.automaticDataCollectionEnabled || !1, this.options_ = d(void 0, e), this.INTERNAL = {
          getUid: function () {
            return null
          }, getToken: function () {
            return Promise.resolve(null)
          }, addAuthTokenListener: function (e) {
            m.push(e), setTimeout(function () {
              return e(null)
            }, 0);
          }, removeAuthTokenListener: function (t) {
            m = m.filter(function (e) {
              return e !== t
            });
          }
        };
      }

      return Object.defineProperty(e.prototype, "automaticDataCollectionEnabled", {
        get: function () {
          return this.checkDestroyed_(), this.automaticDataCollectionEnabled_
        }, set: function (e) {
          this.checkDestroyed_(), this.automaticDataCollectionEnabled_ = e;
        }, enumerable: !0, configurable: !0
      }), Object.defineProperty(e.prototype, "name", {
        get: function () {
          return this.checkDestroyed_(), this.name_
        }, enumerable: !0, configurable: !0
      }), Object.defineProperty(e.prototype, "options", {
        get: function () {
          return this.checkDestroyed_(), this.options_
        }, enumerable: !0, configurable: !0
      }), e.prototype.delete = function () {
        var s = this;
        return new Promise(function (e) {
          s.checkDestroyed_(), e();
        }).then(function () {
          s.firebase_.INTERNAL.removeApp(s.name_);
          for (var e = [], t = 0, r = Object.keys(s.services_); t < r.length; t++) for (var n = r[t], o = 0, i = Object.keys(s.services_[n]); o < i.length; o++) {
            var a = i[o];
            e.push(s.services_[n][a]);
          }
          return Promise.all(e.filter(function (e) {
            return "INTERNAL" in e
          }).map(function (e) {
            return e.INTERNAL.delete()
          }))
        }).then(function () {
          s.isDeleted_ = !0, s.services_ = {};
        })
      }, e.prototype._getService = function (e, t) {
        if (void 0 === t && (t = g), this.checkDestroyed_(), this.services_[e] || (this.services_[e] = {}), !this.services_[e][t]) {
          var r = t !== g ? t : void 0, n = this.firebase_.INTERNAL.factories[e](this, this.extendApp.bind(this), r);
          this.services_[e][t] = n;
        }
        return this.services_[e][t]
      }, e.prototype.extendApp = function (e) {
        var t = this;
        d(this, e), e.INTERNAL && e.INTERNAL.addAuthTokenListener && (m.forEach(function (e) {
          t.INTERNAL.addAuthTokenListener(e);
        }), m = []);
      }, e.prototype.checkDestroyed_ = function () {
        if (this.isDeleted_) throw y.create("app-deleted", {name: this.name_})
      }, e
    }();
  E.prototype.name && E.prototype.options || E.prototype.delete || console.log("dc");
  var _ = "6.1.1";

  function O(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t)
  }

  var N = new f("@firebase/app");
  if ("object" == typeof self && self.self === self && "firebase" in self) {
    N.warn("\n    Warning: Firebase is already defined in the global scope. Please make sure\n    Firebase library is only loaded once.\n  ");
    var w = self.firebase.SDK_VERSION;
    w && 0 <= w.indexOf("LITE") && N.warn("\n    Warning: You are trying to load Firebase while using Firebase Performance standalone script.\n    You should load Firebase Performance with this instance of Firebase to avoid loading duplicate code.\n    ");
  }
  var A = function e() {
    var t = function (a) {
      var s = {}, c = {}, u = {}, l = {
        __esModule: !0, initializeApp: function (e, t) {
          if (void 0 === t && (t = {}), "object" != typeof t || null === t) {
            var r = t;
            t = {name: r};
          }
          var n = t;
          void 0 === n.name && (n.name = g);
          var o = n.name;
          if ("string" != typeof o || !o) throw y.create("bad-app-name", {name: String(o)});
          if (O(s, o)) throw y.create("duplicate-app", {name: o});
          var i = new a(e, n, l);
          return h(s[o] = i, "create"), i
        }, app: p, apps: null, SDK_VERSION: _, INTERNAL: {
          registerService: function (r, e, t, n, o) {
            if (void 0 === o && (o = !1), c[r]) throw y.create("duplicate-service", {name: r});

            function i(e) {
              if (void 0 === e && (e = p()), "function" != typeof e[r]) throw y.create("invalid-app-argument", {name: r});
              return e[r]()
            }

            return c[r] = e, n && (u[r] = n, f().forEach(function (e) {
              n("create", e);
            })), void 0 !== t && d(i, t), l[r] = i, a.prototype[r] = function () {
              for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
              return this._getService.bind(this, r).apply(this, o ? e : [])
            }, i
          }, removeApp: function (e) {
            h(s[e], "delete"), delete s[e];
          }, factories: c, useAsService: i
        }
      };

      function p(e) {
        if (!O(s, e = e || g)) throw y.create("no-app", {name: e});
        return s[e]
      }

      function f() {
        return Object.keys(s).map(function (e) {
          return s[e]
        })
      }

      function h(e, t) {
        for (var r = 0, n = Object.keys(c); r < n.length; r++) {
          var o = i(0, n[r]);
          if (null === o) return;
          u[o] && u[o](t, e);
        }
      }

      function i(e, t) {
        return "serverAuth" === t ? null : t
      }

      return n(l, "default", l), Object.defineProperty(l, "apps", {get: f}), n(p, "App", a), l
    }(E);
    return t.INTERNAL = r({}, t.INTERNAL, {
      createFirebaseNamespace: e, extendNamespace: function (e) {
        d(t, e);
      }, createSubscribe: o, ErrorFactory: a, deepExtend: d
    }), t
  }(), k = A.initializeApp;
  return A.initializeApp = function () {
    return function () {
      try {
        return "[object process]" === Object.prototype.toString.call(global.process)
      } catch (e) {
        return !1
      }
    }() && N.warn('\n      Warning: This is a browser-targeted Firebase bundle but it appears it is being\n      run in a Node environment.  If running in a Node environment, make sure you\n      are using the bundle specified by the "main" field in package.json.\n      \n      If you are using Webpack, you can specify "main" as the first item in\n      "resolve.mainFields":\n      https://webpack.js.org/configuration/resolve/#resolvemainfields\n      \n      If using Rollup, use the rollup-plugin-node-resolve plugin and set "module"\n      to false and "main" to true:\n      https://github.com/rollup/rollup-plugin-node-resolve\n      '), k.apply(void 0, arguments)
  }, A
});

var firebase$1 = firebase;

!function (t, e) { e(firebase$1); }(undefined, function (Xn) {
  try {
    (function () {
      Xn = Xn && Xn.hasOwnProperty("default") ? Xn.default : Xn;
      var r = function (t, e) {
        return (r = Object.setPrototypeOf || {__proto__: []} instanceof Array && function (t, e) {
          t.__proto__ = e;
        } || function (t, e) {
          for (var n in e) e.hasOwnProperty(n) && (t[n] = e[n]);
        })(t, e)
      };

      function s(t, e) {
        function n() {
          this.constructor = t;
        }

        r(t, e), t.prototype = null === e ? Object.create(e) : (n.prototype = e.prototype, new n);
      }

      function e(n, r) {
        var i, o, s, t, a = {
          label: 0, sent: function () {
            if (1 & s[0]) throw s[1];
            return s[1]
          }, trys: [], ops: []
        };
        return t = {
          next: e(0),
          throw: e(1),
          return: e(2)
        }, "function" == typeof Symbol && (t[Symbol.iterator] = function () {
          return this
        }), t;

        function e(e) {
          return function (t) {
            return function (e) {
              if (i) throw new TypeError("Generator is already executing.");
              for (; a;) try {
                if (i = 1, o && (s = 2 & e[0] ? o.return : e[0] ? o.throw || ((s = o.return) && s.call(o), 0) : o.next) && !(s = s.call(o, e[1])).done) return s;
                switch (o = 0, s && (e = [2 & e[0], s.value]), e[0]) {
                  case 0:
                  case 1:
                    s = e;
                    break;
                  case 4:
                    return a.label++, {value: e[1], done: !1};
                  case 5:
                    a.label++, o = e[1], e = [0];
                    continue;
                  case 7:
                    e = a.ops.pop(), a.trys.pop();
                    continue;
                  default:
                    if (!(s = 0 < (s = a.trys).length && s[s.length - 1]) && (6 === e[0] || 2 === e[0])) {
                      a = 0;
                      continue
                    }
                    if (3 === e[0] && (!s || e[1] > s[0] && e[1] < s[3])) {
                      a.label = e[1];
                      break
                    }
                    if (6 === e[0] && a.label < s[1]) {
                      a.label = s[1], s = e;
                      break
                    }
                    if (s && a.label < s[2]) {
                      a.label = s[2], a.ops.push(e);
                      break
                    }
                    s[2] && a.ops.pop(), a.trys.pop();
                    continue
                }
                e = r.call(n, a);
              } catch (t) {
                e = [6, t], o = 0;
              } finally {
                i = s = 0;
              }
              if (5 & e[0]) throw e[1];
              return {value: e[0] ? e[1] : void 0, done: !0}
            }([e, t])
          }
        }
      }

      var n = {NODE_CLIENT: !1, NODE_ADMIN: !1, SDK_VERSION: "${JSCORE_VERSION}"}, C = function (t, e) {
        if (!t) throw p(e)
      }, p = function (t) {
        return new Error("Firebase Database (" + n.SDK_VERSION + ") INTERNAL ASSERT FAILED: " + t)
      }, a = function (t) {
        for (var e = [], n = 0, r = 0; r < t.length; r++) {
          var i = t.charCodeAt(r);
          e[n++] = i < 128 ? i : (e[n++] = i < 2048 ? i >> 6 | 192 : (55296 == (64512 & i) && r + 1 < t.length && 56320 == (64512 & t.charCodeAt(r + 1)) ? (i = 65536 + ((1023 & i) << 10) + (1023 & t.charCodeAt(++r)), e[n++] = i >> 18 | 240, e[n++] = i >> 12 & 63 | 128) : e[n++] = i >> 12 | 224, i >> 6 & 63 | 128), 63 & i | 128);
        }
        return e
      }, h = {
        byteToCharMap_: null,
        charToByteMap_: null,
        byteToCharMapWebSafe_: null,
        charToByteMapWebSafe_: null,
        ENCODED_VALS_BASE: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",
        get ENCODED_VALS() {
          return this.ENCODED_VALS_BASE + "+/="
        },
        get ENCODED_VALS_WEBSAFE() {
          return this.ENCODED_VALS_BASE + "-_."
        },
        HAS_NATIVE_SUPPORT: "function" == typeof atob,
        encodeByteArray: function (t, e) {
          if (!Array.isArray(t)) throw Error("encodeByteArray takes an array as a parameter");
          this.init_();
          for (var n = e ? this.byteToCharMapWebSafe_ : this.byteToCharMap_, r = [], i = 0; i < t.length; i += 3) {
            var o = t[i], s = i + 1 < t.length, a = s ? t[i + 1] : 0, h = i + 2 < t.length, u = h ? t[i + 2] : 0,
              l = o >> 2, c = (3 & o) << 4 | a >> 4, p = (15 & a) << 2 | u >> 6, d = 63 & u;
            h || (d = 64, s || (p = 64)), r.push(n[l], n[c], n[p], n[d]);
          }
          return r.join("")
        },
        encodeString: function (t, e) {
          return this.HAS_NATIVE_SUPPORT && !e ? btoa(t) : this.encodeByteArray(a(t), e)
        },
        decodeString: function (t, e) {
          return this.HAS_NATIVE_SUPPORT && !e ? atob(t) : function (t) {
            for (var e = [], n = 0, r = 0; n < t.length;) {
              var i = t[n++];
              if (i < 128) e[r++] = String.fromCharCode(i); else if (191 < i && i < 224) {
                var o = t[n++];
                e[r++] = String.fromCharCode((31 & i) << 6 | 63 & o);
              } else if (239 < i && i < 365) {
                var s = ((7 & i) << 18 | (63 & (o = t[n++])) << 12 | (63 & (a = t[n++])) << 6 | 63 & t[n++]) - 65536;
                e[r++] = String.fromCharCode(55296 + (s >> 10)), e[r++] = String.fromCharCode(56320 + (1023 & s));
              } else {
                o = t[n++];
                var a = t[n++];
                e[r++] = String.fromCharCode((15 & i) << 12 | (63 & o) << 6 | 63 & a);
              }
            }
            return e.join("")
          }(this.decodeStringToByteArray(t, e))
        },
        decodeStringToByteArray: function (t, e) {
          this.init_();
          for (var n = e ? this.charToByteMapWebSafe_ : this.charToByteMap_, r = [], i = 0; i < t.length;) {
            var o = n[t.charAt(i++)], s = i < t.length ? n[t.charAt(i)] : 0, a = ++i < t.length ? n[t.charAt(i)] : 64,
              h = ++i < t.length ? n[t.charAt(i)] : 64;
            if (++i, null == o || null == s || null == a || null == h) throw Error();
            var u = o << 2 | s >> 4;
            if (r.push(u), 64 != a) {
              var l = s << 4 & 240 | a >> 2;
              if (r.push(l), 64 != h) {
                var c = a << 6 & 192 | h;
                r.push(c);
              }
            }
          }
          return r
        },
        init_: function () {
          if (!this.byteToCharMap_) {
            this.byteToCharMap_ = {}, this.charToByteMap_ = {}, this.byteToCharMapWebSafe_ = {}, this.charToByteMapWebSafe_ = {};
            for (var t = 0; t < this.ENCODED_VALS.length; t++) this.byteToCharMap_[t] = this.ENCODED_VALS.charAt(t), this.charToByteMap_[this.byteToCharMap_[t]] = t, this.byteToCharMapWebSafe_[t] = this.ENCODED_VALS_WEBSAFE.charAt(t), (this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[t]] = t) >= this.ENCODED_VALS_BASE.length && (this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(t)] = t, this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(t)] = t);
          }
        }
      }, u = function (t) {
        try {
          return h.decodeString(t, !0)
        } catch (t) {
          console.error("base64Decode failed: ", t);
        }
        return null
      };

      function i(t) {
        return function t(e, n) {
          if (!(n instanceof Object)) return n;
          switch (n.constructor) {
            case Date:
              var r = n;
              return new Date(r.getTime());
            case Object:
              void 0 === e && (e = {});
              break;
            case Array:
              e = [];
              break;
            default:
              return n
          }
          for (var i in n) n.hasOwnProperty(i) && (e[i] = t(e[i], n[i]));
          return e
        }(void 0, t)
      }

      var l = function () {
        function t() {
          var n = this;
          this.promise = new Promise(function (t, e) {
            n.resolve = t, n.reject = e;
          });
        }

        return t.prototype.wrapCallback = function (n) {
          var r = this;
          return function (t, e) {
            t ? r.reject(t) : r.resolve(e), "function" == typeof n && (r.promise.catch(function () {
            }), 1 === n.length ? n(t) : n(t, e));
          }
        }, t
      }();

      function o() {
        return "undefined" != typeof window && !!(window.cordova || window.phonegap || window.PhoneGap) && /ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test("undefined" != typeof navigator && "string" == typeof navigator.userAgent ? navigator.userAgent : "")
      }

      function c() {
        return !0 === n.NODE_ADMIN
      }

      var d = function (r) {
        function i(t, e) {
          var n = r.call(this, e) || this;
          return n.code = t, n.name = "FirebaseError", Object.setPrototypeOf(n, i.prototype), Error.captureStackTrace && Error.captureStackTrace(n, f.prototype.create), n
        }

        return s(i, r), i
      }(Error), f = function () {
        function t(t, e, n) {
          this.service = t, this.serviceName = e, this.errors = n;
        }

        return t.prototype.create = function (t) {
          for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
          for (var r, i = e[0] || {}, o = this.service + "/" + t, s = this.errors[t], a = s ? (r = i, s.replace(_, function (t, e) {
            var n = r[e];
            return null != n ? n.toString() : "<" + e + "?>"
          })) : "Error", h = this.serviceName + ": " + a + " (" + o + ").", u = new d(o, h), l = 0, c = Object.keys(i); l < c.length; l++) {
            var p = c[l];
            "_" !== p.slice(-1) && (p in u && console.warn('Overwriting FirebaseError base field "' + p + '" can cause unexpected behavior.'), u[p] = i[p]);
          }
          return u
        }, t
      }();
      var _ = /\{\$([^}]+)}/g;

      function y(t) {
        return JSON.parse(t)
      }

      function v(t) {
        return JSON.stringify(t)
      }

      var g = function (t) {
        var e = {}, n = {}, r = {}, i = "";
        try {
          var o = t.split(".");
          e = y(u(o[0]) || ""), n = y(u(o[1]) || ""), i = o[2], r = n.d || {}, delete n.d;
        } catch (t) {
        }
        return {header: e, claims: n, data: r, signature: i}
      }, E = function (t, e) {
        return Object.prototype.hasOwnProperty.call(t, e)
      }, m = function (t, e) {
        if (Object.prototype.hasOwnProperty.call(t, e)) return t[e]
      }, w = function (t, e) {
        for (var n in t) Object.prototype.hasOwnProperty.call(t, n) && e(n, t[n]);
      }, b = function (t) {
        return n = {}, w(t, function (t, e) {
          n[t] = e;
        }), n;
        var n;
      }, S = function (t) {
        for (var e in t) return !1;
        return !0
      }, T = function (t) {
        var e = 0;
        for (var n in t) e++;
        return e
      }, I = function (t, e, n) {
        var r = {};
        for (var i in t) r[i] = e.call(n, t[i], i, t);
        return r
      }, N = function (t, e, n) {
        for (var r in t) if (e.call(n, t[r], r, t)) return r
      }, R = function (t) {
        for (var e in t) return e
      }, P = function () {
        function t() {
          this.chain_ = [], this.buf_ = [], this.W_ = [], this.pad_ = [], this.inbuf_ = 0, this.total_ = 0, this.blockSize = 64, this.pad_[0] = 128;
          for (var t = 1; t < this.blockSize; ++t) this.pad_[t] = 0;
          this.reset();
        }

        return t.prototype.reset = function () {
          this.chain_[0] = 1732584193, this.chain_[1] = 4023233417, this.chain_[2] = 2562383102, this.chain_[3] = 271733878, this.chain_[4] = 3285377520, this.inbuf_ = 0, this.total_ = 0;
        }, t.prototype.compress_ = function (t, e) {
          e || (e = 0);
          var n = this.W_;
          if ("string" == typeof t) for (var r = 0; r < 16; r++) n[r] = t.charCodeAt(e) << 24 | t.charCodeAt(e + 1) << 16 | t.charCodeAt(e + 2) << 8 | t.charCodeAt(e + 3), e += 4; else for (r = 0; r < 16; r++) n[r] = t[e] << 24 | t[e + 1] << 16 | t[e + 2] << 8 | t[e + 3], e += 4;
          for (r = 16; r < 80; r++) {
            var i = n[r - 3] ^ n[r - 8] ^ n[r - 14] ^ n[r - 16];
            n[r] = 4294967295 & (i << 1 | i >>> 31);
          }
          var o, s, a = this.chain_[0], h = this.chain_[1], u = this.chain_[2], l = this.chain_[3], c = this.chain_[4];
          for (r = 0; r < 80; r++) {
            s = r < 40 ? r < 20 ? (o = l ^ h & (u ^ l), 1518500249) : (o = h ^ u ^ l, 1859775393) : r < 60 ? (o = h & u | l & (h | u), 2400959708) : (o = h ^ u ^ l, 3395469782);
            i = (a << 5 | a >>> 27) + o + c + s + n[r] & 4294967295;
            c = l, l = u, u = 4294967295 & (h << 30 | h >>> 2), h = a, a = i;
          }
          this.chain_[0] = this.chain_[0] + a & 4294967295, this.chain_[1] = this.chain_[1] + h & 4294967295, this.chain_[2] = this.chain_[2] + u & 4294967295, this.chain_[3] = this.chain_[3] + l & 4294967295, this.chain_[4] = this.chain_[4] + c & 4294967295;
        }, t.prototype.update = function (t, e) {
          if (null != t) {
            void 0 === e && (e = t.length);
            for (var n = e - this.blockSize, r = 0, i = this.buf_, o = this.inbuf_; r < e;) {
              if (0 == o) for (; r <= n;) this.compress_(t, r), r += this.blockSize;
              if ("string" == typeof t) {
                for (; r < e;) if (i[o] = t.charCodeAt(r), ++r, ++o == this.blockSize) {
                  this.compress_(i), o = 0;
                  break
                }
              } else for (; r < e;) if (i[o] = t[r], ++r, ++o == this.blockSize) {
                this.compress_(i), o = 0;
                break
              }
            }
            this.inbuf_ = o, this.total_ += e;
          }
        }, t.prototype.digest = function () {
          var t = [], e = 8 * this.total_;
          this.inbuf_ < 56 ? this.update(this.pad_, 56 - this.inbuf_) : this.update(this.pad_, this.blockSize - (this.inbuf_ - 56));
          for (var n = this.blockSize - 1; 56 <= n; n--) this.buf_[n] = 255 & e, e /= 256;
          this.compress_(this.buf_);
          var r = 0;
          for (n = 0; n < 5; n++) for (var i = 24; 0 <= i; i -= 8) t[r] = this.chain_[n] >> i & 255, ++r;
          return t
        }, t
      }(), D = function (t, e, n, r) {
        var i;
        if (r < e ? i = "at least " + e : n < r && (i = 0 === n ? "none" : "no more than " + n), i) throw new Error(t + " failed: Was called with " + r + (1 === r ? " argument." : " arguments.") + " Expects " + i + ".")
      };

      function O(t, e, n) {
        var r = "";
        switch (e) {
          case 1:
            r = n ? "first" : "First";
            break;
          case 2:
            r = n ? "second" : "Second";
            break;
          case 3:
            r = n ? "third" : "Third";
            break;
          case 4:
            r = n ? "fourth" : "Fourth";
            break;
          default:
            throw new Error("errorPrefix called with argumentNumber > 4.  Need to update it?")
        }
        var i = t + " failed: ";
        return i += r + " argument "
      }

      function k(t, e, n, r) {
        if ((!r || n) && "function" != typeof n) throw new Error(O(t, e, r) + "must be a valid function.")
      }

      function x(t, e, n, r) {
        if ((!r || n) && ("object" != typeof n || null === n)) throw new Error(O(t, e, r) + "must be a valid context object.")
      }

      var F, t, A = function (t) {
        for (var e = 0, n = 0; n < t.length; n++) {
          var r = t.charCodeAt(n);
          r < 128 ? e++ : r < 2048 ? e += 2 : 55296 <= r && r <= 56319 ? (e += 4, n++) : e += 3;
        }
        return e
      };
      (t = F || (F = {}))[t.DEBUG = 0] = "DEBUG", t[t.VERBOSE = 1] = "VERBOSE", t[t.INFO = 2] = "INFO", t[t.WARN = 3] = "WARN", t[t.ERROR = 4] = "ERROR", t[t.SILENT = 5] = "SILENT";
      var L, M = F.INFO, W = function (t, e) {
        for (var n = [], r = 2; r < arguments.length; r++) n[r - 2] = arguments[r];
        if (!(e < t.logLevel)) {
          var i = (new Date).toISOString();
          switch (e) {
            case F.DEBUG:
            case F.VERBOSE:
              console.log.apply(console, ["[" + i + "]  " + t.name + ":"].concat(n));
              break;
            case F.INFO:
              console.info.apply(console, ["[" + i + "]  " + t.name + ":"].concat(n));
              break;
            case F.WARN:
              console.warn.apply(console, ["[" + i + "]  " + t.name + ":"].concat(n));
              break;
            case F.ERROR:
              console.error.apply(console, ["[" + i + "]  " + t.name + ":"].concat(n));
              break;
            default:
              throw new Error("Attempted to log a message with an invalid logType (value: " + e + ")")
          }
        }
      }, q = function () {
        function t(t) {
          this.name = t, this._logLevel = M, this._logHandler = W;
        }

        return Object.defineProperty(t.prototype, "logLevel", {
          get: function () {
            return this._logLevel
          }, set: function (t) {
            if (!(t in F)) throw new TypeError("Invalid value assigned to `logLevel`");
            this._logLevel = t;
          }, enumerable: !0, configurable: !0
        }), Object.defineProperty(t.prototype, "logHandler", {
          get: function () {
            return this._logHandler
          }, set: function (t) {
            if ("function" != typeof t) throw new TypeError("Value assigned to `logHandler` must be a function");
            this._logHandler = t;
          }, enumerable: !0, configurable: !0
        }), t.prototype.debug = function () {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          this._logHandler.apply(this, [this, F.DEBUG].concat(t));
        }, t.prototype.log = function () {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          this._logHandler.apply(this, [this, F.VERBOSE].concat(t));
        }, t.prototype.info = function () {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          this._logHandler.apply(this, [this, F.INFO].concat(t));
        }, t.prototype.warn = function () {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          this._logHandler.apply(this, [this, F.WARN].concat(t));
        }, t.prototype.error = function () {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          this._logHandler.apply(this, [this, F.ERROR].concat(t));
        }, t
      }(), Q = function () {
        function t(t) {
          this.domStorage_ = t, this.prefix_ = "firebase:";
        }

        return t.prototype.set = function (t, e) {
          null == e ? this.domStorage_.removeItem(this.prefixedName_(t)) : this.domStorage_.setItem(this.prefixedName_(t), v(e));
        }, t.prototype.get = function (t) {
          var e = this.domStorage_.getItem(this.prefixedName_(t));
          return null == e ? null : y(e)
        }, t.prototype.remove = function (t) {
          this.domStorage_.removeItem(this.prefixedName_(t));
        }, t.prototype.prefixedName_ = function (t) {
          return this.prefix_ + t
        }, t.prototype.toString = function () {
          return this.domStorage_.toString()
        }, t
      }(), U = function () {
        function t() {
          this.cache_ = {}, this.isInMemoryStorage = !0;
        }

        return t.prototype.set = function (t, e) {
          null == e ? delete this.cache_[t] : this.cache_[t] = e;
        }, t.prototype.get = function (t) {
          return E(this.cache_, t) ? this.cache_[t] : null
        }, t.prototype.remove = function (t) {
          delete this.cache_[t];
        }, t
      }(), V = function (t) {
        try {
          if ("undefined" != typeof window && void 0 !== window[t]) {
            var e = window[t];
            return e.setItem("firebase:sentinel", "cache"), e.removeItem("firebase:sentinel"), new Q(e)
          }
        } catch (t) {
        }
        return new U
      }, H = V("localStorage"), B = V("sessionStorage"), j = new q("@firebase/database"), K = (L = 1, function () {
        return L++
      }), Y = function (t) {
        var e = function (t) {
          for (var e = [], n = 0, r = 0; r < t.length; r++) {
            var i = t.charCodeAt(r);
            if (55296 <= i && i <= 56319) {
              var o = i - 55296;
              C(++r < t.length, "Surrogate pair missing trail surrogate."), i = 65536 + (o << 10) + (t.charCodeAt(r) - 56320);
            }
            e[n++] = i < 128 ? i : (e[n++] = i < 2048 ? i >> 6 | 192 : (e[n++] = i < 65536 ? i >> 12 | 224 : (e[n++] = i >> 18 | 240, i >> 12 & 63 | 128), i >> 6 & 63 | 128), 63 & i | 128);
          }
          return e
        }(t), n = new P;
        n.update(e);
        var r = n.digest();
        return h.encodeByteArray(r)
      }, z = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        for (var n = "", r = 0; r < t.length; r++) Array.isArray(t[r]) || t[r] && "object" == typeof t[r] && "number" == typeof t[r].length ? n += z.apply(null, t[r]) : "object" == typeof t[r] ? n += v(t[r]) : n += t[r], n += " ";
        return n
      }, G = null, X = !0, $ = function (t, e) {
        C(!e || !0 === t || !1 === t, "Can't turn on custom loggers persistently."), !0 === t ? (j.logLevel = F.VERBOSE, G = j.log.bind(j), e && B.set("logging_enabled", !0)) : "function" == typeof t ? G = t : (G = null, B.remove("logging_enabled"));
      }, J = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        if (!0 === X && (X = !1, null === G && !0 === B.get("logging_enabled") && $(!0)), G) {
          var n = z.apply(null, t);
          G(n);
        }
      }, Z = function (n) {
        return function () {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          J.apply(void 0, [n].concat(t));
        }
      }, tt = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        var n = "FIREBASE INTERNAL ERROR: " + z.apply(void 0, t);
        j.error(n);
      }, et = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        var n = "FIREBASE FATAL ERROR: " + z.apply(void 0, t);
        throw (j.error(n), new Error(n))
      }, nt = function () {
        for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
        var n = "FIREBASE WARNING: " + z.apply(void 0, t);
        j.warn(n);
      }, rt = function (t) {
        return "number" == typeof t && (t != t || t == Number.POSITIVE_INFINITY || t == Number.NEGATIVE_INFINITY)
      }, it = "[MIN_NAME]", ot = "[MAX_NAME]", st = function (t, e) {
        if (t === e) return 0;
        if (t === it || e === ot) return -1;
        if (e === it || t === ot) return 1;
        var n = ft(t), r = ft(e);
        return null !== n ? null !== r ? n - r == 0 ? t.length - e.length : n - r : -1 : null !== r ? 1 : t < e ? -1 : 1
      }, at = function (t, e) {
        return t === e ? 0 : t < e ? -1 : 1
      }, ht = function (t, e) {
        if (e && t in e) return e[t];
        throw new Error("Missing required key (" + t + ") in object: " + v(e))
      }, ut = function (t) {
        if ("object" != typeof t || null === t) return v(t);
        var e = [];
        for (var n in t) e.push(n);
        e.sort();
        for (var r = "{", i = 0; i < e.length; i++) 0 !== i && (r += ","), r += v(e[i]), r += ":", r += ut(t[e[i]]);
        return r += "}"
      }, lt = function (t, e) {
        var n = t.length;
        if (n <= e) return [t];
        for (var r = [], i = 0; i < n; i += e) n < i + e ? r.push(t.substring(i, n)) : r.push(t.substring(i, i + e));
        return r
      }, ct = function (t, n) {
        if (Array.isArray(t)) for (var e = 0; e < t.length; ++e) n(e, t[e]); else w(t, function (t, e) {
          return n(e, t)
        });
      }, pt = function (t) {
        C(!rt(t), "Invalid JSON number");
        var e, n, r, i, o, s, a;
        for (0 === t ? e = 1 / t == -1 / (r = n = 0) ? 1 : 0 : (e = t < 0, r = (t = Math.abs(t)) >= Math.pow(2, -1022) ? (n = (i = Math.min(Math.floor(Math.log(t) / Math.LN2), 1023)) + 1023, Math.round(t * Math.pow(2, 52 - i) - Math.pow(2, 52))) : (n = 0, Math.round(t / Math.pow(2, -1074)))), s = [], o = 52; o; o -= 1) s.push(r % 2 ? 1 : 0), r = Math.floor(r / 2);
        for (o = 11; o; o -= 1) s.push(n % 2 ? 1 : 0), n = Math.floor(n / 2);
        s.push(e ? 1 : 0), s.reverse(), a = s.join("");
        var h = "";
        for (o = 0; o < 64; o += 8) {
          var u = parseInt(a.substr(o, 8), 2).toString(16);
          1 === u.length && (u = "0" + u), h += u;
        }
        return h.toLowerCase()
      }, dt = new RegExp("^-?\\d{1,10}$"), ft = function (t) {
        if (dt.test(t)) {
          var e = Number(t);
          if (-2147483648 <= e && e <= 2147483647) return e
        }
        return null
      }, _t = function (t) {
        try {
          t();
        } catch (e) {
          setTimeout(function () {
            var t = e.stack || "";
            throw (nt("Exception was thrown by user callback.", t), e)
          }, Math.floor(0));
        }
      }, yt = function (t, e) {
        var n = setTimeout(t, e);
        return "object" == typeof n && n.unref && n.unref(), n
      }, vt = function () {
        function i(t, e) {
          if (void 0 === e) {
            this.pieces_ = t.split("/");
            for (var n = 0, r = 0; r < this.pieces_.length; r++) 0 < this.pieces_[r].length && (this.pieces_[n] = this.pieces_[r], n++);
            this.pieces_.length = n, this.pieceNum_ = 0;
          } else this.pieces_ = t, this.pieceNum_ = e;
        }

        return Object.defineProperty(i, "Empty", {
          get: function () {
            return new i("")
          }, enumerable: !0, configurable: !0
        }), i.prototype.getFront = function () {
          return this.pieceNum_ >= this.pieces_.length ? null : this.pieces_[this.pieceNum_]
        }, i.prototype.getLength = function () {
          return this.pieces_.length - this.pieceNum_
        }, i.prototype.popFront = function () {
          var t = this.pieceNum_;
          return t < this.pieces_.length && t++, new i(this.pieces_, t)
        }, i.prototype.getBack = function () {
          return this.pieceNum_ < this.pieces_.length ? this.pieces_[this.pieces_.length - 1] : null
        }, i.prototype.toString = function () {
          for (var t = "", e = this.pieceNum_; e < this.pieces_.length; e++) "" !== this.pieces_[e] && (t += "/" + this.pieces_[e]);
          return t || "/"
        }, i.prototype.toUrlEncodedString = function () {
          for (var t = "", e = this.pieceNum_; e < this.pieces_.length; e++) "" !== this.pieces_[e] && (t += "/" + encodeURIComponent(String(this.pieces_[e])));
          return t || "/"
        }, i.prototype.slice = function (t) {
          return void 0 === t && (t = 0), this.pieces_.slice(this.pieceNum_ + t)
        }, i.prototype.parent = function () {
          if (this.pieceNum_ >= this.pieces_.length) return null;
          for (var t = [], e = this.pieceNum_; e < this.pieces_.length - 1; e++) t.push(this.pieces_[e]);
          return new i(t, 0)
        }, i.prototype.child = function (t) {
          for (var e = [], n = this.pieceNum_; n < this.pieces_.length; n++) e.push(this.pieces_[n]);
          if (t instanceof i) for (n = t.pieceNum_; n < t.pieces_.length; n++) e.push(t.pieces_[n]); else {
            var r = t.split("/");
            for (n = 0; n < r.length; n++) 0 < r[n].length && e.push(r[n]);
          }
          return new i(e, 0)
        }, i.prototype.isEmpty = function () {
          return this.pieceNum_ >= this.pieces_.length
        }, i.relativePath = function (t, e) {
          var n = t.getFront(), r = e.getFront();
          if (null === n) return e;
          if (n === r) return i.relativePath(t.popFront(), e.popFront());
          throw new Error("INTERNAL ERROR: innerPath (" + e + ") is not within outerPath (" + t + ")")
        }, i.comparePaths = function (t, e) {
          for (var n = t.slice(), r = e.slice(), i = 0; i < n.length && i < r.length; i++) {
            var o = st(n[i], r[i]);
            if (0 !== o) return o
          }
          return n.length === r.length ? 0 : n.length < r.length ? -1 : 1
        }, i.prototype.equals = function (t) {
          if (this.getLength() !== t.getLength()) return !1;
          for (var e = this.pieceNum_, n = t.pieceNum_; e <= this.pieces_.length; e++, n++) if (this.pieces_[e] !== t.pieces_[n]) return !1;
          return !0
        }, i.prototype.contains = function (t) {
          var e = this.pieceNum_, n = t.pieceNum_;
          if (this.getLength() > t.getLength()) return !1;
          for (; e < this.pieces_.length;) {
            if (this.pieces_[e] !== t.pieces_[n]) return !1;
            ++e, ++n;
          }
          return !0
        }, i
      }(), gt = function () {
        function t(t, e) {
          this.errorPrefix_ = e, this.parts_ = t.slice(), this.byteLength_ = Math.max(1, this.parts_.length);
          for (var n = 0; n < this.parts_.length; n++) this.byteLength_ += A(this.parts_[n]);
          this.checkValid_();
        }

        return Object.defineProperty(t, "MAX_PATH_DEPTH", {
          get: function () {
            return 32
          }, enumerable: !0, configurable: !0
        }), Object.defineProperty(t, "MAX_PATH_LENGTH_BYTES", {
          get: function () {
            return 768
          }, enumerable: !0, configurable: !0
        }), t.prototype.push = function (t) {
          0 < this.parts_.length && (this.byteLength_ += 1), this.parts_.push(t), this.byteLength_ += A(t), this.checkValid_();
        }, t.prototype.pop = function () {
          var t = this.parts_.pop();
          this.byteLength_ -= A(t), 0 < this.parts_.length && (this.byteLength_ -= 1);
        }, t.prototype.checkValid_ = function () {
          if (this.byteLength_ > t.MAX_PATH_LENGTH_BYTES) throw new Error(this.errorPrefix_ + "has a key path longer than " + t.MAX_PATH_LENGTH_BYTES + " bytes (" + this.byteLength_ + ").");
          if (this.parts_.length > t.MAX_PATH_DEPTH) throw new Error(this.errorPrefix_ + "path specified exceeds the maximum depth that can be written (" + t.MAX_PATH_DEPTH + ") or object contains a cycle " + this.toErrorString())
        }, t.prototype.toErrorString = function () {
          return 0 == this.parts_.length ? "" : "in property '" + this.parts_.join(".") + "'"
        }, t
      }(), mt = "firebaseio.com", Ct = "websocket", Et = "long_polling", wt = function () {
        function t(t, e, n, r, i) {
          void 0 === i && (i = ""), this.secure = e, this.namespace = n, this.webSocketOnly = r, this.persistenceKey = i, this.host = t.toLowerCase(), this.domain = this.host.substr(this.host.indexOf(".") + 1), this.internalHost = H.get("host:" + t) || this.host;
        }

        return t.prototype.needsQueryParam = function () {
          return this.host !== this.internalHost || this.isCustomHost()
        }, t.prototype.isCacheableHost = function () {
          return "s-" === this.internalHost.substr(0, 2)
        }, t.prototype.isDemoHost = function () {
          return "firebaseio-demo.com" === this.domain
        }, t.prototype.isCustomHost = function () {
          return "firebaseio.com" !== this.domain && "firebaseio-demo.com" !== this.domain
        }, t.prototype.updateHost = function (t) {
          t !== this.internalHost && (this.internalHost = t, this.isCacheableHost() && H.set("host:" + this.host, this.internalHost));
        }, t.prototype.connectionURL = function (t, e) {
          var n;
          if (C("string" == typeof t, "typeof type must == string"), C("object" == typeof e, "typeof params must == object"), t === Ct) n = (this.secure ? "wss://" : "ws://") + this.internalHost + "/.ws?"; else {
            if (t !== Et) throw new Error("Unknown connection type: " + t);
            n = (this.secure ? "https://" : "http://") + this.internalHost + "/.lp?";
          }
          this.needsQueryParam() && (e.ns = this.namespace);
          var r = [];
          return w(e, function (t, e) {
            r.push(t + "=" + e);
          }), n + r.join("&")
        }, t.prototype.toString = function () {
          var t = this.toURLString();
          return this.persistenceKey && (t += "<" + this.persistenceKey + ">"), t
        }, t.prototype.toURLString = function () {
          return (this.secure ? "https://" : "http://") + this.host
        }, t
      }();
      var bt, St, Tt, It, Nt, Rt = function (t) {
          var e = Pt(t), n = e.subdomain;
          "firebase" === e.domain && et(e.host + " is no longer supported. Please use <YOUR FIREBASE>.firebaseio.com instead"), n && "undefined" != n || "localhost" === e.domain || et("Cannot parse Firebase url. Please use https://<YOUR FIREBASE>.firebaseio.com"), e.secure || "undefined" != typeof window && window.location && window.location.protocol && -1 !== window.location.protocol.indexOf("https:") && nt("Insecure Firebase access from a secure page. Please use https in calls to new Firebase().");
          var r = "ws" === e.scheme || "wss" === e.scheme;
          return {repoInfo: new wt(e.host, e.secure, n, r), path: new vt(e.pathString)}
        }, Pt = function (t) {
          var e = "", n = "", r = "", i = "", o = !0, s = "https", a = 443;
          if ("string" == typeof t) {
            var h = t.indexOf("//");
            0 <= h && (s = t.substring(0, h - 1), t = t.substring(h + 2));
            var u = t.indexOf("/");
            -1 === u && (u = t.length);
            var l = t.indexOf("?");
            -1 === l && (l = t.length), e = t.substring(0, Math.min(u, l)), u < l && (i = function (t) {
              for (var e = "", n = t.split("/"), r = 0; r < n.length; r++) if (0 < n[r].length) {
                var i = n[r];
                try {
                  i = decodeURIComponent(i.replace(/\+/g, " "));
                } catch (t) {
                }
                e += "/" + i;
              }
              return e
            }(t.substring(u, l)));
            var c = function (t) {
              var e = {};
              "?" === t.charAt(0) && (t = t.substring(1));
              for (var n = 0, r = t.split("&"); n < r.length; n++) {
                var i = r[n];
                if (0 !== i.length) {
                  var o = i.split("=");
                  2 === o.length ? e[decodeURIComponent(o[0])] = decodeURIComponent(o[1]) : nt("Invalid query segment '" + i + "' in query '" + t + "'");
                }
              }
              return e
            }(t.substring(Math.min(t.length, l)));
            0 <= (h = e.indexOf(":")) ? (o = "https" === s || "wss" === s, a = parseInt(e.substring(h + 1), 10)) : h = t.length;
            var p = e.split(".");
            3 === p.length ? (n = p[1], r = p[0].toLowerCase()) : 2 === p.length ? n = p[0] : "localhost" === p[0].slice(0, h).toLowerCase() && (n = "localhost"), "" === r && "ns" in c && (r = c.ns);
          }
          return {host: e, port: a, domain: n, subdomain: r, secure: o, scheme: s, pathString: i}
        }, Dt = /[\[\].#$\/\u0000-\u001F\u007F]/, Ot = /[\[\].#$\u0000-\u001F\u007F]/, kt = 10485760, xt = function (t) {
          return "string" == typeof t && 0 !== t.length && !Dt.test(t)
        }, Ft = function (t) {
          return "string" == typeof t && 0 !== t.length && !Ot.test(t)
        }, At = function (t) {
          return null === t || "string" == typeof t || "number" == typeof t && !rt(t) || t && "object" == typeof t && E(t, ".sv")
        }, Lt = function (t, e, n, r, i) {
          i && void 0 === n || Mt(O(t, e, i), n, r);
        }, Mt = function (n, t, e) {
          var r = e instanceof vt ? new gt(e, n) : e;
          if (void 0 === t) throw new Error(n + "contains undefined " + r.toErrorString());
          if ("function" == typeof t) throw new Error(n + "contains a function " + r.toErrorString() + " with contents = " + t.toString());
          if (rt(t)) throw new Error(n + "contains " + t.toString() + " " + r.toErrorString());
          if ("string" == typeof t && t.length > kt / 3 && A(t) > kt) throw new Error(n + "contains a string greater than " + kt + " utf8 bytes " + r.toErrorString() + " ('" + t.substring(0, 50) + "...')");
          if (t && "object" == typeof t) {
            var i = !1, o = !1;
            if (w(t, function (t, e) {
              if (".value" === t) i = !0; else if (".priority" !== t && ".sv" !== t && (o = !0, !xt(t))) throw new Error(n + " contains an invalid key (" + t + ") " + r.toErrorString() + '.  Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');
              r.push(t), Mt(n, e, r), r.pop();
            }), i && o) throw new Error(n + ' contains ".value" child ' + r.toErrorString() + " in addition to actual children.")
          }
        }, Wt = function (t, e, n, r, i) {
          if (!i || void 0 !== n) {
            var o = O(t, e, i);
            if (!n || "object" != typeof n || Array.isArray(n)) throw new Error(o + " must be an object containing the children to replace.");
            var s = [];
            w(n, function (t, e) {
              var n = new vt(t);
              if (Mt(o, e, r.child(n)), ".priority" === n.getBack() && !At(e)) throw new Error(o + "contains an invalid value for '" + n.toString() + "', which must be a valid Firebase priority (a string, finite number, server value, or null).");
              s.push(n);
            }), function (t, e) {
              var n, r;
              for (n = 0; n < e.length; n++) for (var i = (r = e[n]).slice(), o = 0; o < i.length; o++) if (".priority" === i[o] && o === i.length - 1) ; else if (!xt(i[o])) throw new Error(t + "contains an invalid key (" + i[o] + ") in path " + r.toString() + '. Keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]"');
              e.sort(vt.comparePaths);
              var s = null;
              for (n = 0; n < e.length; n++) {
                if (r = e[n], null !== s && s.contains(r)) throw new Error(t + "contains a path " + s.toString() + " that is ancestor of another path " + r.toString());
                s = r;
              }
            }(o, s);
          }
        }, qt = function (t, e, n, r) {
          if (!r || void 0 !== n) {
            if (rt(n)) throw new Error(O(t, e, r) + "is " + n.toString() + ", but must be a valid Firebase priority (a string, finite number, server value, or null).");
            if (!At(n)) throw new Error(O(t, e, r) + "must be a valid Firebase priority (a string, finite number, server value, or null).")
          }
        }, Qt = function (t, e, n, r) {
          if (!r || void 0 !== n) switch (n) {
            case"value":
            case"child_added":
            case"child_removed":
            case"child_changed":
            case"child_moved":
              break;
            default:
              throw new Error(O(t, e, r) + 'must be a valid event type = "value", "child_added", "child_removed", "child_changed", or "child_moved".')
          }
        }, Ut = function (t, e, n, r) {
          if (!(r && void 0 === n || xt(n))) throw new Error(O(t, e, r) + 'was an invalid key = "' + n + '".  Firebase keys must be non-empty strings and can\'t contain ".", "#", "$", "/", "[", or "]").')
        }, Vt = function (t, e, n, r) {
          if (!(r && void 0 === n || Ft(n))) throw new Error(O(t, e, r) + 'was an invalid path = "' + n + '". Paths must be non-empty strings and can\'t contain ".", "#", "$", "[", or "]"')
        }, Ht = function (t, e) {
          if (".info" === e.getFront()) throw new Error(t + " failed = Can't modify data under /.info/")
        }, Bt = function (t, e, n) {
          var r, i = n.path.toString();
          if ("string" != typeof n.repoInfo.host || 0 === n.repoInfo.host.length || !xt(n.repoInfo.namespace) && "localhost" !== n.repoInfo.host.split(":")[0] || 0 !== i.length && ((r = i) && (r = r.replace(/^\/*\.info(\/|$)/, "/")), !Ft(r))) throw new Error(O(t, e, !1) + 'must be a valid firebase URL and the path can\'t contain ".", "#", "$", "[", or "]".')
        }, jt = function () {
          function t(t, e) {
            this.repo_ = t, this.path_ = e;
          }

          return t.prototype.cancel = function (t) {
            D("OnDisconnect.cancel", 0, 1, arguments.length), k("OnDisconnect.cancel", 1, t, !0);
            var e = new l;
            return this.repo_.onDisconnectCancel(this.path_, e.wrapCallback(t)), e.promise
          }, t.prototype.remove = function (t) {
            D("OnDisconnect.remove", 0, 1, arguments.length), Ht("OnDisconnect.remove", this.path_), k("OnDisconnect.remove", 1, t, !0);
            var e = new l;
            return this.repo_.onDisconnectSet(this.path_, null, e.wrapCallback(t)), e.promise
          }, t.prototype.set = function (t, e) {
            D("OnDisconnect.set", 1, 2, arguments.length), Ht("OnDisconnect.set", this.path_), Lt("OnDisconnect.set", 1, t, this.path_, !1), k("OnDisconnect.set", 2, e, !0);
            var n = new l;
            return this.repo_.onDisconnectSet(this.path_, t, n.wrapCallback(e)), n.promise
          }, t.prototype.setWithPriority = function (t, e, n) {
            D("OnDisconnect.setWithPriority", 2, 3, arguments.length), Ht("OnDisconnect.setWithPriority", this.path_), Lt("OnDisconnect.setWithPriority", 1, t, this.path_, !1), qt("OnDisconnect.setWithPriority", 2, e, !1), k("OnDisconnect.setWithPriority", 3, n, !0);
            var r = new l;
            return this.repo_.onDisconnectSetWithPriority(this.path_, t, e, r.wrapCallback(n)), r.promise
          }, t.prototype.update = function (t, e) {
            if (D("OnDisconnect.update", 1, 2, arguments.length), Ht("OnDisconnect.update", this.path_), Array.isArray(t)) {
              for (var n = {}, r = 0; r < t.length; ++r) n["" + r] = t[r];
              t = n, nt("Passing an Array to firebase.database.onDisconnect().update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.");
            }
            Wt("OnDisconnect.update", 1, t, this.path_, !1), k("OnDisconnect.update", 2, e, !0);
            var i = new l;
            return this.repo_.onDisconnectUpdate(this.path_, t, i.wrapCallback(e)), i.promise
          }, t
        }(), Kt = function () {
          function t(t, e) {
            this.committed = t, this.snapshot = e;
          }

          return t.prototype.toJSON = function () {
            return D("TransactionResult.toJSON", 0, 1, arguments.length), {
              committed: this.committed,
              snapshot: this.snapshot.toJSON()
            }
          }, t
        }(),
        Yt = (bt = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz", St = 0, Tt = [], function (t) {
          var e, n = t === St;
          St = t;
          var r = new Array(8);
          for (e = 7; 0 <= e; e--) r[e] = bt.charAt(t % 64), t = Math.floor(t / 64);
          C(0 === t, "Cannot push at time == 0");
          var i = r.join("");
          if (n) {
            for (e = 11; 0 <= e && 63 === Tt[e]; e--) Tt[e] = 0;
            Tt[e]++;
          } else for (e = 0; e < 12; e++) Tt[e] = Math.floor(64 * Math.random());
          for (e = 0; e < 12; e++) i += bt.charAt(Tt[e]);
          return C(20 === i.length, "nextPushId: Length should be 20."), i
        }), zt = function () {
          function n(t, e) {
            this.name = t, this.node = e;
          }

          return n.Wrap = function (t, e) {
            return new n(t, e)
          }, n
        }(), Gt = function () {
          function t() {
          }

          return t.prototype.getCompare = function () {
            return this.compare.bind(this)
          }, t.prototype.indexedValueChanged = function (t, e) {
            var n = new zt(it, t), r = new zt(it, e);
            return 0 !== this.compare(n, r)
          }, t.prototype.minPost = function () {
            return zt.MIN
          }, t
        }(), Xt = function (t) {
          function e() {
            return null !== t && t.apply(this, arguments) || this
          }

          return s(e, t), Object.defineProperty(e, "__EMPTY_NODE", {
            get: function () {
              return It
            }, set: function (t) {
              It = t;
            }, enumerable: !0, configurable: !0
          }), e.prototype.compare = function (t, e) {
            return st(t.name, e.name)
          }, e.prototype.isDefinedOn = function (t) {
            throw p("KeyIndex.isDefinedOn not expected to be called.")
          }, e.prototype.indexedValueChanged = function (t, e) {
            return !1
          }, e.prototype.minPost = function () {
            return zt.MIN
          }, e.prototype.maxPost = function () {
            return new zt(ot, It)
          }, e.prototype.makePost = function (t, e) {
            return C("string" == typeof t, "KeyIndex indexValue must always be a string."), new zt(t, It)
          }, e.prototype.toString = function () {
            return ".key"
          }, e
        }(Gt), $t = new Xt;
      var Jt, Zt, te, ee = function (t) {
        return "number" == typeof t ? "number:" + pt(t) : "string:" + t
      }, ne = function (t) {
        if (t.isLeafNode()) {
          var e = t.val();
          C("string" == typeof e || "number" == typeof e || "object" == typeof e && E(e, ".sv"), "Priority must be a string or number.");
        } else C(t === Nt || t.isEmpty(), "priority of unexpected type.");
        C(t === Nt || t.getPriority().isEmpty(), "Priority nodes can't have a priority of their own.");
      }, re = function () {
        function o(t, e) {
          void 0 === e && (e = o.__childrenNodeConstructor.EMPTY_NODE), this.value_ = t, this.priorityNode_ = e, this.lazyHash_ = null, C(void 0 !== this.value_ && null !== this.value_, "LeafNode shouldn't be created with null/undefined value."), ne(this.priorityNode_);
        }

        return Object.defineProperty(o, "__childrenNodeConstructor", {
          get: function () {
            return Jt
          }, set: function (t) {
            Jt = t;
          }, enumerable: !0, configurable: !0
        }), o.prototype.isLeafNode = function () {
          return !0
        }, o.prototype.getPriority = function () {
          return this.priorityNode_
        }, o.prototype.updatePriority = function (t) {
          return new o(this.value_, t)
        }, o.prototype.getImmediateChild = function (t) {
          return ".priority" === t ? this.priorityNode_ : o.__childrenNodeConstructor.EMPTY_NODE
        }, o.prototype.getChild = function (t) {
          return t.isEmpty() ? this : ".priority" === t.getFront() ? this.priorityNode_ : o.__childrenNodeConstructor.EMPTY_NODE
        }, o.prototype.hasChild = function () {
          return !1
        }, o.prototype.getPredecessorChildName = function (t, e) {
          return null
        }, o.prototype.updateImmediateChild = function (t, e) {
          return ".priority" === t ? this.updatePriority(e) : e.isEmpty() && ".priority" !== t ? this : o.__childrenNodeConstructor.EMPTY_NODE.updateImmediateChild(t, e).updatePriority(this.priorityNode_)
        }, o.prototype.updateChild = function (t, e) {
          var n = t.getFront();
          return null === n ? e : e.isEmpty() && ".priority" !== n ? this : (C(".priority" !== n || 1 === t.getLength(), ".priority must be the last token in a path"), this.updateImmediateChild(n, o.__childrenNodeConstructor.EMPTY_NODE.updateChild(t.popFront(), e)))
        }, o.prototype.isEmpty = function () {
          return !1
        }, o.prototype.numChildren = function () {
          return 0
        }, o.prototype.forEachChild = function (t, e) {
          return !1
        }, o.prototype.val = function (t) {
          return t && !this.getPriority().isEmpty() ? {
            ".value": this.getValue(),
            ".priority": this.getPriority().val()
          } : this.getValue()
        }, o.prototype.hash = function () {
          if (null === this.lazyHash_) {
            var t = "";
            this.priorityNode_.isEmpty() || (t += "priority:" + ee(this.priorityNode_.val()) + ":");
            var e = typeof this.value_;
            t += e + ":", t += "number" === e ? pt(this.value_) : this.value_, this.lazyHash_ = Y(t);
          }
          return this.lazyHash_
        }, o.prototype.getValue = function () {
          return this.value_
        }, o.prototype.compareTo = function (t) {
          return t === o.__childrenNodeConstructor.EMPTY_NODE ? 1 : t instanceof o.__childrenNodeConstructor ? -1 : (C(t.isLeafNode(), "Unknown node type"), this.compareToLeafNode_(t))
        }, o.prototype.compareToLeafNode_ = function (t) {
          var e = typeof t.value_, n = typeof this.value_, r = o.VALUE_TYPE_ORDER.indexOf(e),
            i = o.VALUE_TYPE_ORDER.indexOf(n);
          return C(0 <= r, "Unknown leaf type: " + e), C(0 <= i, "Unknown leaf type: " + n), r === i ? "object" === n ? 0 : this.value_ < t.value_ ? -1 : this.value_ === t.value_ ? 0 : 1 : i - r
        }, o.prototype.withIndex = function () {
          return this
        }, o.prototype.isIndexed = function () {
          return !0
        }, o.prototype.equals = function (t) {
          if (t === this) return !0;
          if (t.isLeafNode()) {
            var e = t;
            return this.value_ === e.value_ && this.priorityNode_.equals(e.priorityNode_)
          }
          return !1
        }, o.VALUE_TYPE_ORDER = ["object", "boolean", "number", "string"], o
      }();
      var ie, oe, se = new (function (t) {
        function e() {
          return null !== t && t.apply(this, arguments) || this
        }

        return s(e, t), e.prototype.compare = function (t, e) {
          var n = t.node.getPriority(), r = e.node.getPriority(), i = n.compareTo(r);
          return 0 === i ? st(t.name, e.name) : i
        }, e.prototype.isDefinedOn = function (t) {
          return !t.getPriority().isEmpty()
        }, e.prototype.indexedValueChanged = function (t, e) {
          return !t.getPriority().equals(e.getPriority())
        }, e.prototype.minPost = function () {
          return zt.MIN
        }, e.prototype.maxPost = function () {
          return new zt(ot, new re("[PRIORITY-POST]", te))
        }, e.prototype.makePost = function (t, e) {
          var n = Zt(t);
          return new zt(e, new re("[PRIORITY-POST]", n))
        }, e.prototype.toString = function () {
          return ".priority"
        }, e
      }(Gt)), ae = function () {
        function t(t, e, n, r, i) {
          void 0 === i && (i = null), this.isReverse_ = r, this.resultGenerator_ = i, this.nodeStack_ = [];
          for (var o = 1; !t.isEmpty();) if (t = t, o = e ? n(t.key, e) : 1, r && (o *= -1), o < 0) t = this.isReverse_ ? t.left : t.right; else {
            if (0 === o) {
              this.nodeStack_.push(t);
              break
            }
            this.nodeStack_.push(t), t = this.isReverse_ ? t.right : t.left;
          }
        }

        return t.prototype.getNext = function () {
          if (0 === this.nodeStack_.length) return null;
          var t, e = this.nodeStack_.pop();
          if (t = this.resultGenerator_ ? this.resultGenerator_(e.key, e.value) : {
            key: e.key,
            value: e.value
          }, this.isReverse_) for (e = e.left; !e.isEmpty();) this.nodeStack_.push(e), e = e.right; else for (e = e.right; !e.isEmpty();) this.nodeStack_.push(e), e = e.left;
          return t
        }, t.prototype.hasNext = function () {
          return 0 < this.nodeStack_.length
        }, t.prototype.peek = function () {
          if (0 === this.nodeStack_.length) return null;
          var t = this.nodeStack_[this.nodeStack_.length - 1];
          return this.resultGenerator_ ? this.resultGenerator_(t.key, t.value) : {key: t.key, value: t.value}
        }, t
      }(), he = function () {
        function o(t, e, n, r, i) {
          this.key = t, this.value = e, this.color = null != n ? n : o.RED, this.left = null != r ? r : le.EMPTY_NODE, this.right = null != i ? i : le.EMPTY_NODE;
        }

        return o.prototype.copy = function (t, e, n, r, i) {
          return new o(null != t ? t : this.key, null != e ? e : this.value, null != n ? n : this.color, null != r ? r : this.left, null != i ? i : this.right)
        }, o.prototype.count = function () {
          return this.left.count() + 1 + this.right.count()
        }, o.prototype.isEmpty = function () {
          return !1
        }, o.prototype.inorderTraversal = function (t) {
          return this.left.inorderTraversal(t) || t(this.key, this.value) || this.right.inorderTraversal(t)
        }, o.prototype.reverseTraversal = function (t) {
          return this.right.reverseTraversal(t) || t(this.key, this.value) || this.left.reverseTraversal(t)
        }, o.prototype.min_ = function () {
          return this.left.isEmpty() ? this : this.left.min_()
        }, o.prototype.minKey = function () {
          return this.min_().key
        }, o.prototype.maxKey = function () {
          return this.right.isEmpty() ? this.key : this.right.maxKey()
        }, o.prototype.insert = function (t, e, n) {
          var r, i;
          return (i = (r = n(t, (i = this).key)) < 0 ? i.copy(null, null, null, i.left.insert(t, e, n), null) : 0 === r ? i.copy(null, e, null, null, null) : i.copy(null, null, null, null, i.right.insert(t, e, n))).fixUp_()
        }, o.prototype.removeMin_ = function () {
          if (this.left.isEmpty()) return le.EMPTY_NODE;
          var t = this;
          return t.left.isRed_() || t.left.left.isRed_() || (t = t.moveRedLeft_()), (t = t.copy(null, null, null, t.left.removeMin_(), null)).fixUp_()
        }, o.prototype.remove = function (t, e) {
          var n, r;
          if (e(t, (n = this).key) < 0) n.left.isEmpty() || n.left.isRed_() || n.left.left.isRed_() || (n = n.moveRedLeft_()), n = n.copy(null, null, null, n.left.remove(t, e), null); else {
            if (n.left.isRed_() && (n = n.rotateRight_()), n.right.isEmpty() || n.right.isRed_() || n.right.left.isRed_() || (n = n.moveRedRight_()), 0 === e(t, n.key)) {
              if (n.right.isEmpty()) return le.EMPTY_NODE;
              r = n.right.min_(), n = n.copy(r.key, r.value, null, null, n.right.removeMin_());
            }
            n = n.copy(null, null, null, null, n.right.remove(t, e));
          }
          return n.fixUp_()
        }, o.prototype.isRed_ = function () {
          return this.color
        }, o.prototype.fixUp_ = function () {
          var t = this;
          return t.right.isRed_() && !t.left.isRed_() && (t = t.rotateLeft_()), t.left.isRed_() && t.left.left.isRed_() && (t = t.rotateRight_()), t.left.isRed_() && t.right.isRed_() && (t = t.colorFlip_()), t
        }, o.prototype.moveRedLeft_ = function () {
          var t = this.colorFlip_();
          return t.right.left.isRed_() && (t = (t = (t = t.copy(null, null, null, null, t.right.rotateRight_())).rotateLeft_()).colorFlip_()), t
        }, o.prototype.moveRedRight_ = function () {
          var t = this.colorFlip_();
          return t.left.left.isRed_() && (t = (t = t.rotateRight_()).colorFlip_()), t
        }, o.prototype.rotateLeft_ = function () {
          var t = this.copy(null, null, o.RED, null, this.right.left);
          return this.right.copy(null, null, this.color, t, null)
        }, o.prototype.rotateRight_ = function () {
          var t = this.copy(null, null, o.RED, this.left.right, null);
          return this.left.copy(null, null, this.color, null, t)
        }, o.prototype.colorFlip_ = function () {
          var t = this.left.copy(null, null, !this.left.color, null, null),
            e = this.right.copy(null, null, !this.right.color, null, null);
          return this.copy(null, null, !this.color, t, e)
        }, o.prototype.checkMaxDepth_ = function () {
          var t = this.check_();
          return Math.pow(2, t) <= this.count() + 1
        }, o.prototype.check_ = function () {
          var t;
          if (this.isRed_() && this.left.isRed_()) throw new Error("Red node has red child(" + this.key + "," + this.value + ")");
          if (this.right.isRed_()) throw new Error("Right child of (" + this.key + "," + this.value + ") is red");
          if ((t = this.left.check_()) !== this.right.check_()) throw new Error("Black depths differ");
          return t + (this.isRed_() ? 0 : 1)
        }, o.RED = !0, o.BLACK = !1, o
      }(), ue = function () {
        function t() {
        }

        return t.prototype.copy = function (t, e, n, r, i) {
          return this
        }, t.prototype.insert = function (t, e, n) {
          return new he(t, e, null)
        }, t.prototype.remove = function (t, e) {
          return this
        }, t.prototype.count = function () {
          return 0
        }, t.prototype.isEmpty = function () {
          return !0
        }, t.prototype.inorderTraversal = function (t) {
          return !1
        }, t.prototype.reverseTraversal = function (t) {
          return !1
        }, t.prototype.minKey = function () {
          return null
        }, t.prototype.maxKey = function () {
          return null
        }, t.prototype.check_ = function () {
          return 0
        }, t.prototype.isRed_ = function () {
          return !1
        }, t
      }(), le = function () {
        function n(t, e) {
          void 0 === e && (e = n.EMPTY_NODE), this.comparator_ = t, this.root_ = e;
        }

        return n.prototype.insert = function (t, e) {
          return new n(this.comparator_, this.root_.insert(t, e, this.comparator_).copy(null, null, he.BLACK, null, null))
        }, n.prototype.remove = function (t) {
          return new n(this.comparator_, this.root_.remove(t, this.comparator_).copy(null, null, he.BLACK, null, null))
        }, n.prototype.get = function (t) {
          for (var e, n = this.root_; !n.isEmpty();) {
            if (0 === (e = this.comparator_(t, n.key))) return n.value;
            e < 0 ? n = n.left : 0 < e && (n = n.right);
          }
          return null
        }, n.prototype.getPredecessorKey = function (t) {
          for (var e, n = this.root_, r = null; !n.isEmpty();) {
            if (0 === (e = this.comparator_(t, n.key))) {
              if (n.left.isEmpty()) return r ? r.key : null;
              for (n = n.left; !n.right.isEmpty();) n = n.right;
              return n.key
            }
            e < 0 ? n = n.left : 0 < e && (n = (r = n).right);
          }
          throw new Error("Attempted to find predecessor key for a nonexistent key.  What gives?")
        }, n.prototype.isEmpty = function () {
          return this.root_.isEmpty()
        }, n.prototype.count = function () {
          return this.root_.count()
        }, n.prototype.minKey = function () {
          return this.root_.minKey()
        }, n.prototype.maxKey = function () {
          return this.root_.maxKey()
        }, n.prototype.inorderTraversal = function (t) {
          return this.root_.inorderTraversal(t)
        }, n.prototype.reverseTraversal = function (t) {
          return this.root_.reverseTraversal(t)
        }, n.prototype.getIterator = function (t) {
          return new ae(this.root_, null, this.comparator_, !1, t)
        }, n.prototype.getIteratorFrom = function (t, e) {
          return new ae(this.root_, t, this.comparator_, !1, e)
        }, n.prototype.getReverseIteratorFrom = function (t, e) {
          return new ae(this.root_, t, this.comparator_, !0, e)
        }, n.prototype.getReverseIterator = function (t) {
          return new ae(this.root_, null, this.comparator_, !0, t)
        }, n.EMPTY_NODE = new ue, n
      }(), ce = Math.log(2), pe = function () {
        function t(t) {
          var e;
          this.count = (e = t + 1, parseInt(Math.log(e) / ce, 10)), this.current_ = this.count - 1;
          var n, r = (n = this.count, parseInt(Array(n + 1).join("1"), 2));
          this.bits_ = t + 1 & r;
        }

        return t.prototype.nextBitIsOne = function () {
          var t = !(this.bits_ & 1 << this.current_);
          return this.current_--, t
        }, t
      }(), de = function (u, t, l, e) {
        u.sort(t);
        var c = function (t, e) {
          var n, r, i = e - t;
          if (0 == i) return null;
          if (1 == i) return n = u[t], r = l ? l(n) : n, new he(r, n.node, he.BLACK, null, null);
          var o = parseInt(i / 2, 10) + t, s = c(t, o), a = c(o + 1, e);
          return n = u[o], r = l ? l(n) : n, new he(r, n.node, he.BLACK, s, a)
        }, n = function (t) {
          for (var e = null, n = null, a = u.length, r = function (t, e) {
            var n = a - t, r = a;
            a -= t;
            var i = c(n + 1, r), o = u[n], s = l ? l(o) : o;
            h(new he(s, o.node, e, null, i));
          }, h = function (t) {
            e = e ? e.left = t : n = t;
          }, i = 0; i < t.count; ++i) {
            var o = t.nextBitIsOne(), s = Math.pow(2, t.count - (i + 1));
            o ? r(s, he.BLACK) : (r(s, he.BLACK), r(s, he.RED));
          }
          return n
        }(new pe(u.length));
        return new le(e || t, n)
      }, fe = {}, _e = function () {
        function c(t, e) {
          this.indexes_ = t, this.indexSet_ = e;
        }

        return Object.defineProperty(c, "Default", {
          get: function () {
            return C(se, "ChildrenNode.ts has not been loaded"), ie = ie || new c({".priority": fe}, {".priority": se})
          }, enumerable: !0, configurable: !0
        }), c.prototype.get = function (t) {
          var e = m(this.indexes_, t);
          if (!e) throw new Error("No index defined for " + t);
          return e === fe ? null : e
        }, c.prototype.hasIndex = function (t) {
          return E(this.indexSet_, t.toString())
        }, c.prototype.addIndex = function (t, e) {
          C(t !== $t, "KeyIndex always exists and isn't meant to be added to the IndexMap.");
          for (var n, r = [], i = !1, o = e.getIterator(zt.Wrap), s = o.getNext(); s;) i = i || t.isDefinedOn(s.node), r.push(s), s = o.getNext();
          n = i ? de(r, t.getCompare()) : fe;
          var a = t.toString(), h = b(this.indexSet_);
          h[a] = t;
          var u = b(this.indexes_);
          return u[a] = n, new c(u, h)
        }, c.prototype.addToIndexes = function (h, u) {
          var l = this;
          return new c(I(this.indexes_, function (t, e) {
            var n = m(l.indexSet_, e);
            if (C(n, "Missing index implementation for " + e), t === fe) {
              if (n.isDefinedOn(h.node)) {
                for (var r = [], i = u.getIterator(zt.Wrap), o = i.getNext(); o;) o.name != h.name && r.push(o), o = i.getNext();
                return r.push(h), de(r, n.getCompare())
              }
              return fe
            }
            var s = u.get(h.name), a = t;
            return s && (a = a.remove(new zt(h.name, s))), a.insert(h, h.node)
          }), this.indexSet_)
        }, c.prototype.removeFromIndexes = function (n, r) {
          return new c(I(this.indexes_, function (t) {
            if (t === fe) return t;
            var e = r.get(n.name);
            return e ? t.remove(new zt(n.name, e)) : t
          }), this.indexSet_)
        }, c
      }();

      function ye(t, e) {
        return st(t.name, e.name)
      }

      function ve(t, e) {
        return st(t, e)
      }

      var ge = function () {
        function a(t, e, n) {
          this.children_ = t, this.priorityNode_ = e, this.indexMap_ = n, this.lazyHash_ = null, this.priorityNode_ && ne(this.priorityNode_), this.children_.isEmpty() && C(!this.priorityNode_ || this.priorityNode_.isEmpty(), "An empty node cannot have a priority");
        }

        return Object.defineProperty(a, "EMPTY_NODE", {
          get: function () {
            return oe || (oe = new a(new le(ve), null, _e.Default))
          }, enumerable: !0, configurable: !0
        }), a.prototype.isLeafNode = function () {
          return !1
        }, a.prototype.getPriority = function () {
          return this.priorityNode_ || oe
        }, a.prototype.updatePriority = function (t) {
          return this.children_.isEmpty() ? this : new a(this.children_, t, this.indexMap_)
        }, a.prototype.getImmediateChild = function (t) {
          if (".priority" === t) return this.getPriority();
          var e = this.children_.get(t);
          return null === e ? oe : e
        }, a.prototype.getChild = function (t) {
          var e = t.getFront();
          return null === e ? this : this.getImmediateChild(e).getChild(t.popFront())
        }, a.prototype.hasChild = function (t) {
          return null !== this.children_.get(t)
        }, a.prototype.updateImmediateChild = function (t, e) {
          if (C(e, "We should always be passing snapshot nodes"), ".priority" === t) return this.updatePriority(e);
          var n = new zt(t, e), r = void 0, i = void 0;
          return i = e.isEmpty() ? (r = this.children_.remove(t), this.indexMap_.removeFromIndexes(n, this.children_)) : (r = this.children_.insert(t, e), this.indexMap_.addToIndexes(n, this.children_)), new a(r, r.isEmpty() ? oe : this.priorityNode_, i)
        }, a.prototype.updateChild = function (t, e) {
          var n = t.getFront();
          if (null === n) return e;
          C(".priority" !== t.getFront() || 1 === t.getLength(), ".priority must be the last token in a path");
          var r = this.getImmediateChild(n).updateChild(t.popFront(), e);
          return this.updateImmediateChild(n, r)
        }, a.prototype.isEmpty = function () {
          return this.children_.isEmpty()
        }, a.prototype.numChildren = function () {
          return this.children_.count()
        }, a.prototype.val = function (n) {
          if (this.isEmpty()) return null;
          var r = {}, i = 0, o = 0, s = !0;
          if (this.forEachChild(se, function (t, e) {
            r[t] = e.val(n), i++, s && a.INTEGER_REGEXP_.test(t) ? o = Math.max(o, Number(t)) : s = !1;
          }), !n && s && o < 2 * i) {
            var t = [];
            for (var e in r) t[e] = r[e];
            return t
          }
          return n && !this.getPriority().isEmpty() && (r[".priority"] = this.getPriority().val()), r
        }, a.prototype.hash = function () {
          if (null === this.lazyHash_) {
            var r = "";
            this.getPriority().isEmpty() || (r += "priority:" + ee(this.getPriority().val()) + ":"), this.forEachChild(se, function (t, e) {
              var n = e.hash();
              "" !== n && (r += ":" + t + ":" + n);
            }), this.lazyHash_ = "" === r ? "" : Y(r);
          }
          return this.lazyHash_
        }, a.prototype.getPredecessorChildName = function (t, e, n) {
          var r = this.resolveIndex_(n);
          if (r) {
            var i = r.getPredecessorKey(new zt(t, e));
            return i ? i.name : null
          }
          return this.children_.getPredecessorKey(t)
        }, a.prototype.getFirstChildName = function (t) {
          var e = this.resolveIndex_(t);
          if (e) {
            var n = e.minKey();
            return n && n.name
          }
          return this.children_.minKey()
        }, a.prototype.getFirstChild = function (t) {
          var e = this.getFirstChildName(t);
          return e ? new zt(e, this.children_.get(e)) : null
        }, a.prototype.getLastChildName = function (t) {
          var e = this.resolveIndex_(t);
          if (e) {
            var n = e.maxKey();
            return n && n.name
          }
          return this.children_.maxKey()
        }, a.prototype.getLastChild = function (t) {
          var e = this.getLastChildName(t);
          return e ? new zt(e, this.children_.get(e)) : null
        }, a.prototype.forEachChild = function (t, e) {
          var n = this.resolveIndex_(t);
          return n ? n.inorderTraversal(function (t) {
            return e(t.name, t.node)
          }) : this.children_.inorderTraversal(e)
        }, a.prototype.getIterator = function (t) {
          return this.getIteratorFrom(t.minPost(), t)
        }, a.prototype.getIteratorFrom = function (t, e) {
          var n = this.resolveIndex_(e);
          if (n) return n.getIteratorFrom(t, function (t) {
            return t
          });
          for (var r = this.children_.getIteratorFrom(t.name, zt.Wrap), i = r.peek(); null != i && e.compare(i, t) < 0;) r.getNext(), i = r.peek();
          return r
        }, a.prototype.getReverseIterator = function (t) {
          return this.getReverseIteratorFrom(t.maxPost(), t)
        }, a.prototype.getReverseIteratorFrom = function (t, e) {
          var n = this.resolveIndex_(e);
          if (n) return n.getReverseIteratorFrom(t, function (t) {
            return t
          });
          for (var r = this.children_.getReverseIteratorFrom(t.name, zt.Wrap), i = r.peek(); null != i && 0 < e.compare(i, t);) r.getNext(), i = r.peek();
          return r
        }, a.prototype.compareTo = function (t) {
          return this.isEmpty() ? t.isEmpty() ? 0 : -1 : t.isLeafNode() || t.isEmpty() ? 1 : t === me ? -1 : 0
        }, a.prototype.withIndex = function (t) {
          if (t === $t || this.indexMap_.hasIndex(t)) return this;
          var e = this.indexMap_.addIndex(t, this.children_);
          return new a(this.children_, this.priorityNode_, e)
        }, a.prototype.isIndexed = function (t) {
          return t === $t || this.indexMap_.hasIndex(t)
        }, a.prototype.equals = function (t) {
          if (t === this) return !0;
          if (t.isLeafNode()) return !1;
          var e = t;
          if (this.getPriority().equals(e.getPriority())) {
            if (this.children_.count() !== e.children_.count()) return !1;
            for (var n = this.getIterator(se), r = e.getIterator(se), i = n.getNext(), o = r.getNext(); i && o;) {
              if (i.name !== o.name || !i.node.equals(o.node)) return !1;
              i = n.getNext(), o = r.getNext();
            }
            return null === i && null === o
          }
          return !1
        }, a.prototype.resolveIndex_ = function (t) {
          return t === $t ? null : this.indexMap_.get(t.toString())
        }, a.INTEGER_REGEXP_ = /^(0|[1-9]\d*)$/, a
      }(), me = new (function (t) {
        function e() {
          return t.call(this, new le(ve), ge.EMPTY_NODE, _e.Default) || this
        }

        return s(e, t), e.prototype.compareTo = function (t) {
          return t === this ? 0 : 1
        }, e.prototype.equals = function (t) {
          return t === this
        }, e.prototype.getPriority = function () {
          return this
        }, e.prototype.getImmediateChild = function (t) {
          return ge.EMPTY_NODE
        }, e.prototype.isEmpty = function () {
          return !1
        }, e
      }(ge));
      Object.defineProperties(zt, {
        MIN: {value: new zt(it, ge.EMPTY_NODE)},
        MAX: {value: new zt(ot, me)}
      }), Xt.__EMPTY_NODE = ge.EMPTY_NODE, re.__childrenNodeConstructor = ge, Nt = me, te = me;
      var Ce = !0;

      function Ee(t, e) {
        if (void 0 === e && (e = null), null === t) return ge.EMPTY_NODE;
        if ("object" == typeof t && ".priority" in t && (e = t[".priority"]), C(null === e || "string" == typeof e || "number" == typeof e || "object" == typeof e && ".sv" in e, "Invalid priority type found: " + typeof e), "object" == typeof t && ".value" in t && null !== t[".value"] && (t = t[".value"]), "object" != typeof t || ".sv" in t) return new re(t, Ee(e));
        if (t instanceof Array || !Ce) {
          var r = ge.EMPTY_NODE, i = t;
          return w(i, function (t, e) {
            if (E(i, t) && "." !== t.substring(0, 1)) {
              var n = Ee(e);
              !n.isLeafNode() && n.isEmpty() || (r = r.updateImmediateChild(t, n));
            }
          }), r.updatePriority(Ee(e))
        }
        var o = [], s = !1, a = t;
        if (w(a, function (t, e) {
          if ("string" != typeof t || "." !== t.substring(0, 1)) {
            var n = Ee(a[t]);
            n.isEmpty() || (s = s || !n.getPriority().isEmpty(), o.push(new zt(t, n)));
          }
        }), 0 == o.length) return ge.EMPTY_NODE;
        var n = de(o, ye, function (t) {
          return t.name
        }, ve);
        if (s) {
          var h = de(o, se.getCompare());
          return new ge(n, Ee(e), new _e({".priority": h}, {".priority": se}))
        }
        return new ge(n, Ee(e), _e.Default)
      }

      Zt = Ee;
      var we, be, Se, Te = new (function (t) {
        function e() {
          return null !== t && t.apply(this, arguments) || this
        }

        return s(e, t), e.prototype.compare = function (t, e) {
          var n = t.node.compareTo(e.node);
          return 0 === n ? st(t.name, e.name) : n
        }, e.prototype.isDefinedOn = function (t) {
          return !0
        }, e.prototype.indexedValueChanged = function (t, e) {
          return !t.equals(e)
        }, e.prototype.minPost = function () {
          return zt.MIN
        }, e.prototype.maxPost = function () {
          return zt.MAX
        }, e.prototype.makePost = function (t, e) {
          var n = Ee(t);
          return new zt(e, n)
        }, e.prototype.toString = function () {
          return ".value"
        }, e
      }(Gt)), Ie = function (n) {
        function t(t) {
          var e = n.call(this) || this;
          return e.indexPath_ = t, C(!t.isEmpty() && ".priority" !== t.getFront(), "Can't create PathIndex with empty path or .priority key"), e
        }

        return s(t, n), t.prototype.extractChild = function (t) {
          return t.getChild(this.indexPath_)
        }, t.prototype.isDefinedOn = function (t) {
          return !t.getChild(this.indexPath_).isEmpty()
        }, t.prototype.compare = function (t, e) {
          var n = this.extractChild(t.node), r = this.extractChild(e.node), i = n.compareTo(r);
          return 0 === i ? st(t.name, e.name) : i
        }, t.prototype.makePost = function (t, e) {
          var n = Ee(t), r = ge.EMPTY_NODE.updateChild(this.indexPath_, n);
          return new zt(e, r)
        }, t.prototype.maxPost = function () {
          var t = ge.EMPTY_NODE.updateChild(this.indexPath_, me);
          return new zt(ot, t)
        }, t.prototype.toString = function () {
          return this.indexPath_.slice().join("/")
        }, t
      }(Gt), Ne = function () {
        function i(t, e, n) {
          this.node_ = t, this.ref_ = e, this.index_ = n;
        }

        return i.prototype.val = function () {
          return D("DataSnapshot.val", 0, 0, arguments.length), this.node_.val()
        }, i.prototype.exportVal = function () {
          return D("DataSnapshot.exportVal", 0, 0, arguments.length), this.node_.val(!0)
        }, i.prototype.toJSON = function () {
          return D("DataSnapshot.toJSON", 0, 1, arguments.length), this.exportVal()
        }, i.prototype.exists = function () {
          return D("DataSnapshot.exists", 0, 0, arguments.length), !this.node_.isEmpty()
        }, i.prototype.child = function (t) {
          D("DataSnapshot.child", 0, 1, arguments.length), t = String(t), Vt("DataSnapshot.child", 1, t, !1);
          var e = new vt(t), n = this.ref_.child(e);
          return new i(this.node_.getChild(e), n, se)
        }, i.prototype.hasChild = function (t) {
          D("DataSnapshot.hasChild", 1, 1, arguments.length), Vt("DataSnapshot.hasChild", 1, t, !1);
          var e = new vt(t);
          return !this.node_.getChild(e).isEmpty()
        }, i.prototype.getPriority = function () {
          return D("DataSnapshot.getPriority", 0, 0, arguments.length), this.node_.getPriority().val()
        }, i.prototype.forEach = function (n) {
          var r = this;
          return D("DataSnapshot.forEach", 1, 1, arguments.length), k("DataSnapshot.forEach", 1, n, !1), !this.node_.isLeafNode() && !!this.node_.forEachChild(this.index_, function (t, e) {
            return n(new i(e, r.ref_.child(t), se))
          })
        }, i.prototype.hasChildren = function () {
          return D("DataSnapshot.hasChildren", 0, 0, arguments.length), !this.node_.isLeafNode() && !this.node_.isEmpty()
        }, Object.defineProperty(i.prototype, "key", {
          get: function () {
            return this.ref_.getKey()
          }, enumerable: !0, configurable: !0
        }), i.prototype.numChildren = function () {
          return D("DataSnapshot.numChildren", 0, 0, arguments.length), this.node_.numChildren()
        }, i.prototype.getRef = function () {
          return D("DataSnapshot.ref", 0, 0, arguments.length), this.ref_
        }, Object.defineProperty(i.prototype, "ref", {
          get: function () {
            return this.getRef()
          }, enumerable: !0, configurable: !0
        }), i
      }(), Re = function () {
        function t(t, e, n, r) {
          this.eventType = t, this.eventRegistration = e, this.snapshot = n, this.prevName = r;
        }

        return t.prototype.getPath = function () {
          var t = this.snapshot.getRef();
          return "value" === this.eventType ? t.path : t.getParent().path
        }, t.prototype.getEventType = function () {
          return this.eventType
        }, t.prototype.getEventRunner = function () {
          return this.eventRegistration.getEventRunner(this)
        }, t.prototype.toString = function () {
          return this.getPath().toString() + ":" + this.eventType + ":" + v(this.snapshot.exportVal())
        }, t
      }(), Pe = function () {
        function t(t, e, n) {
          this.eventRegistration = t, this.error = e, this.path = n;
        }

        return t.prototype.getPath = function () {
          return this.path
        }, t.prototype.getEventType = function () {
          return "cancel"
        }, t.prototype.getEventRunner = function () {
          return this.eventRegistration.getEventRunner(this)
        }, t.prototype.toString = function () {
          return this.path.toString() + ":cancel"
        }, t
      }(), De = function () {
        function e(t, e, n) {
          this.callback_ = t, this.cancelCallback_ = e, this.context_ = n;
        }

        return e.prototype.respondsTo = function (t) {
          return "value" === t
        }, e.prototype.createEvent = function (t, e) {
          var n = e.getQueryParams().getIndex();
          return new Re("value", this, new Ne(t.snapshotNode, e.getRef(), n))
        }, e.prototype.getEventRunner = function (t) {
          var e = this.context_;
          if ("cancel" === t.getEventType()) {
            C(this.cancelCallback_, "Raising a cancel event on a listener with no cancel callback");
            var n = this.cancelCallback_;
            return function () {
              n.call(e, t.error);
            }
          }
          var r = this.callback_;
          return function () {
            r.call(e, t.snapshot);
          }
        }, e.prototype.createCancelEvent = function (t, e) {
          return this.cancelCallback_ ? new Pe(this, t, e) : null
        }, e.prototype.matches = function (t) {
          return t instanceof e && (!t.callback_ || !this.callback_ || t.callback_ === this.callback_ && t.context_ === this.context_)
        }, e.prototype.hasAnyCallback = function () {
          return null !== this.callback_
        }, e
      }(), Oe = function () {
        function i(t, e, n) {
          this.callbacks_ = t, this.cancelCallback_ = e, this.context_ = n;
        }

        return i.prototype.respondsTo = function (t) {
          var e = "children_added" === t ? "child_added" : t;
          return e = "children_removed" === e ? "child_removed" : e, E(this.callbacks_, e)
        }, i.prototype.createCancelEvent = function (t, e) {
          return this.cancelCallback_ ? new Pe(this, t, e) : null
        }, i.prototype.createEvent = function (t, e) {
          C(null != t.childName, "Child events should have a childName.");
          var n = e.getRef().child(t.childName), r = e.getQueryParams().getIndex();
          return new Re(t.type, this, new Ne(t.snapshotNode, n, r), t.prevName)
        }, i.prototype.getEventRunner = function (t) {
          var e = this.context_;
          if ("cancel" === t.getEventType()) {
            C(this.cancelCallback_, "Raising a cancel event on a listener with no cancel callback");
            var n = this.cancelCallback_;
            return function () {
              n.call(e, t.error);
            }
          }
          var r = this.callbacks_[t.eventType];
          return function () {
            r.call(e, t.snapshot, t.prevName);
          }
        }, i.prototype.matches = function (n) {
          if (n instanceof i) {
            if (!this.callbacks_ || !n.callbacks_) return !0;
            if (this.context_ === n.context_) {
              var t = T(n.callbacks_);
              if (t === T(this.callbacks_)) {
                if (1 !== t) return function (t, e) {
                  for (var n in t) if (Object.prototype.hasOwnProperty.call(t, n) && !e(n, t[n])) return !1;
                  return !0
                }(this.callbacks_, function (t, e) {
                  return n.callbacks_[t] === e
                });
                var e = R(n.callbacks_), r = R(this.callbacks_);
                return !(r !== e || n.callbacks_[e] && this.callbacks_[r] && n.callbacks_[e] !== this.callbacks_[r])
              }
            }
          }
          return !1
        }, i.prototype.hasAnyCallback = function () {
          return null !== this.callbacks_
        }, i
      }(), ke = function () {
        function u(t, e, n, r) {
          this.repo = t, this.path = e, this.queryParams_ = n, this.orderByCalled_ = r;
        }

        return Object.defineProperty(u, "__referenceConstructor", {
          get: function () {
            return C(we, "Reference.ts has not been loaded"), we
          }, set: function (t) {
            we = t;
          }, enumerable: !0, configurable: !0
        }), u.validateQueryEndpoints_ = function (t) {
          var e = null, n = null;
          if (t.hasStart() && (e = t.getIndexStartValue()), t.hasEnd() && (n = t.getIndexEndValue()), t.getIndex() === $t) {
            var r = "Query: When ordering by key, you may only pass one argument to startAt(), endAt(), or equalTo().",
              i = "Query: When ordering by key, the argument passed to startAt(), endAt(),or equalTo() must be a string.";
            if (t.hasStart()) {
              if (t.getIndexStartName() != it) throw new Error(r);
              if ("string" != typeof e) throw new Error(i)
            }
            if (t.hasEnd()) {
              if (t.getIndexEndName() != ot) throw new Error(r);
              if ("string" != typeof n) throw new Error(i)
            }
          } else if (t.getIndex() === se) {
            if (null != e && !At(e) || null != n && !At(n)) throw new Error("Query: When ordering by priority, the first argument passed to startAt(), endAt(), or equalTo() must be a valid priority value (null, a number, or a string).")
          } else if (C(t.getIndex() instanceof Ie || t.getIndex() === Te, "unknown index type."), null != e && "object" == typeof e || null != n && "object" == typeof n) throw new Error("Query: First argument passed to startAt(), endAt(), or equalTo() cannot be an object.")
        }, u.validateLimit_ = function (t) {
          if (t.hasStart() && t.hasEnd() && t.hasLimit() && !t.hasAnchoredLimit()) throw new Error("Query: Can't combine startAt(), endAt(), and limit(). Use limitToFirst() or limitToLast() instead.")
        }, u.prototype.validateNoPreviousOrderByCall_ = function (t) {
          if (!0 === this.orderByCalled_) throw new Error(t + ": You can't combine multiple orderBy calls.")
        }, u.prototype.getQueryParams = function () {
          return this.queryParams_
        }, u.prototype.getRef = function () {
          return D("Query.ref", 0, 0, arguments.length), new u.__referenceConstructor(this.repo, this.path)
        }, u.prototype.on = function (t, e, n, r) {
          D("Query.on", 2, 4, arguments.length), Qt("Query.on", 1, t, !1), k("Query.on", 2, e, !1);
          var i = u.getCancelAndContextArgs_("Query.on", n, r);
          if ("value" === t) this.onValueEvent(e, i.cancel, i.context); else {
            var o = {};
            o[t] = e, this.onChildEvent(o, i.cancel, i.context);
          }
          return e
        }, u.prototype.onValueEvent = function (t, e, n) {
          var r = new De(t, e || null, n || null);
          this.repo.addEventCallbackForQuery(this, r);
        }, u.prototype.onChildEvent = function (t, e, n) {
          var r = new Oe(t, e, n);
          this.repo.addEventCallbackForQuery(this, r);
        }, u.prototype.off = function (t, e, n) {
          D("Query.off", 0, 3, arguments.length), Qt("Query.off", 1, t, !0), k("Query.off", 2, e, !0), x("Query.off", 3, n, !0);
          var r = null, i = null;
          "value" === t ? r = new De(e || null, null, n || null) : t && (e && ((i = {})[t] = e), r = new Oe(i, null, n || null));
          this.repo.removeEventCallbackForQuery(this, r);
        }, u.prototype.once = function (e, n, t, r) {
          var i = this;
          D("Query.once", 1, 4, arguments.length), Qt("Query.once", 1, e, !1), k("Query.once", 2, n, !0);
          var o = u.getCancelAndContextArgs_("Query.once", t, r), s = !0, a = new l;
          a.promise.catch(function () {
          });
          var h = function (t) {
            s && (s = !1, i.off(e, h), n && n.bind(o.context)(t), a.resolve(t));
          };
          return this.on(e, h, function (t) {
            i.off(e, h), o.cancel && o.cancel.bind(o.context)(t), a.reject(t);
          }), a.promise
        }, u.prototype.limitToFirst = function (t) {
          if (D("Query.limitToFirst", 1, 1, arguments.length), "number" != typeof t || Math.floor(t) !== t || t <= 0) throw new Error("Query.limitToFirst: First argument must be a positive integer.");
          if (this.queryParams_.hasLimit()) throw new Error("Query.limitToFirst: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");
          return new u(this.repo, this.path, this.queryParams_.limitToFirst(t), this.orderByCalled_)
        }, u.prototype.limitToLast = function (t) {
          if (D("Query.limitToLast", 1, 1, arguments.length), "number" != typeof t || Math.floor(t) !== t || t <= 0) throw new Error("Query.limitToLast: First argument must be a positive integer.");
          if (this.queryParams_.hasLimit()) throw new Error("Query.limitToLast: Limit was already set (by another call to limit, limitToFirst, or limitToLast).");
          return new u(this.repo, this.path, this.queryParams_.limitToLast(t), this.orderByCalled_)
        }, u.prototype.orderByChild = function (t) {
          if (D("Query.orderByChild", 1, 1, arguments.length), "$key" === t) throw new Error('Query.orderByChild: "$key" is invalid.  Use Query.orderByKey() instead.');
          if ("$priority" === t) throw new Error('Query.orderByChild: "$priority" is invalid.  Use Query.orderByPriority() instead.');
          if ("$value" === t) throw new Error('Query.orderByChild: "$value" is invalid.  Use Query.orderByValue() instead.');
          Vt("Query.orderByChild", 1, t, !1), this.validateNoPreviousOrderByCall_("Query.orderByChild");
          var e = new vt(t);
          if (e.isEmpty()) throw new Error("Query.orderByChild: cannot pass in empty path.  Use Query.orderByValue() instead.");
          var n = new Ie(e), r = this.queryParams_.orderBy(n);
          return u.validateQueryEndpoints_(r), new u(this.repo, this.path, r, !0)
        }, u.prototype.orderByKey = function () {
          D("Query.orderByKey", 0, 0, arguments.length), this.validateNoPreviousOrderByCall_("Query.orderByKey");
          var t = this.queryParams_.orderBy($t);
          return u.validateQueryEndpoints_(t), new u(this.repo, this.path, t, !0)
        }, u.prototype.orderByPriority = function () {
          D("Query.orderByPriority", 0, 0, arguments.length), this.validateNoPreviousOrderByCall_("Query.orderByPriority");
          var t = this.queryParams_.orderBy(se);
          return u.validateQueryEndpoints_(t), new u(this.repo, this.path, t, !0)
        }, u.prototype.orderByValue = function () {
          D("Query.orderByValue", 0, 0, arguments.length), this.validateNoPreviousOrderByCall_("Query.orderByValue");
          var t = this.queryParams_.orderBy(Te);
          return u.validateQueryEndpoints_(t), new u(this.repo, this.path, t, !0)
        }, u.prototype.startAt = function (t, e) {
          void 0 === t && (t = null), D("Query.startAt", 0, 2, arguments.length), Lt("Query.startAt", 1, t, this.path, !0), Ut("Query.startAt", 2, e, !0);
          var n = this.queryParams_.startAt(t, e);
          if (u.validateLimit_(n), u.validateQueryEndpoints_(n), this.queryParams_.hasStart()) throw new Error("Query.startAt: Starting point was already set (by another call to startAt or equalTo).");
          return void 0 === t && (e = t = null), new u(this.repo, this.path, n, this.orderByCalled_)
        }, u.prototype.endAt = function (t, e) {
          void 0 === t && (t = null), D("Query.endAt", 0, 2, arguments.length), Lt("Query.endAt", 1, t, this.path, !0), Ut("Query.endAt", 2, e, !0);
          var n = this.queryParams_.endAt(t, e);
          if (u.validateLimit_(n), u.validateQueryEndpoints_(n), this.queryParams_.hasEnd()) throw new Error("Query.endAt: Ending point was already set (by another call to endAt or equalTo).");
          return new u(this.repo, this.path, n, this.orderByCalled_)
        }, u.prototype.equalTo = function (t, e) {
          if (D("Query.equalTo", 1, 2, arguments.length), Lt("Query.equalTo", 1, t, this.path, !1), Ut("Query.equalTo", 2, e, !0), this.queryParams_.hasStart()) throw new Error("Query.equalTo: Starting point was already set (by another call to startAt or equalTo).");
          if (this.queryParams_.hasEnd()) throw new Error("Query.equalTo: Ending point was already set (by another call to endAt or equalTo).");
          return this.startAt(t, e).endAt(t, e)
        }, u.prototype.toString = function () {
          return D("Query.toString", 0, 0, arguments.length), this.repo.toString() + this.path.toUrlEncodedString()
        }, u.prototype.toJSON = function () {
          return D("Query.toJSON", 0, 1, arguments.length), this.toString()
        }, u.prototype.queryObject = function () {
          return this.queryParams_.getQueryObject()
        }, u.prototype.queryIdentifier = function () {
          var t = this.queryObject(), e = ut(t);
          return "{}" === e ? "default" : e
        }, u.prototype.isEqual = function (t) {
          if (D("Query.isEqual", 1, 1, arguments.length), !(t instanceof u)) {
            throw new Error("Query.isEqual failed: First argument must be an instance of firebase.database.Query.")
          }
          var e = this.repo === t.repo, n = this.path.equals(t.path),
            r = this.queryIdentifier() === t.queryIdentifier();
          return e && n && r
        }, u.getCancelAndContextArgs_ = function (t, e, n) {
          var r = {cancel: null, context: null};
          if (e && n) r.cancel = e, k(t, 3, r.cancel, !0), r.context = n, x(t, 4, r.context, !0); else if (e) if ("object" == typeof e && null !== e) r.context = e; else {
            if ("function" != typeof e) throw new Error(O(t, 3, !0) + " must either be a cancel callback or a context object.");
            r.cancel = e;
          }
          return r
        }, Object.defineProperty(u.prototype, "ref", {
          get: function () {
            return this.getRef()
          }, enumerable: !0, configurable: !0
        }), u
      }(), xe = function () {
        function t() {
          this.set = {};
        }

        return t.prototype.add = function (t, e) {
          this.set[t] = null === e || e;
        }, t.prototype.contains = function (t) {
          return E(this.set, t)
        }, t.prototype.get = function (t) {
          return this.contains(t) ? this.set[t] : void 0
        }, t.prototype.remove = function (t) {
          delete this.set[t];
        }, t.prototype.clear = function () {
          this.set = {};
        }, t.prototype.isEmpty = function () {
          return S(this.set)
        }, t.prototype.count = function () {
          return T(this.set)
        }, t.prototype.each = function (n) {
          w(this.set, function (t, e) {
            return n(t, e)
          });
        }, t.prototype.keys = function () {
          var e = [];
          return w(this.set, function (t) {
            e.push(t);
          }), e
        }, t
      }(), Fe = function () {
        function i() {
          this.value_ = null, this.children_ = null;
        }

        return i.prototype.find = function (t) {
          if (null != this.value_) return this.value_.getChild(t);
          if (t.isEmpty() || null == this.children_) return null;
          var e = t.getFront();
          return t = t.popFront(), this.children_.contains(e) ? this.children_.get(e).find(t) : null
        }, i.prototype.remember = function (t, e) {
          if (t.isEmpty()) this.value_ = e, this.children_ = null; else if (null !== this.value_) this.value_ = this.value_.updateChild(t, e); else {
            null == this.children_ && (this.children_ = new xe);
            var n = t.getFront();
            this.children_.contains(n) || this.children_.add(n, new i);
            var r = this.children_.get(n);
            t = t.popFront(), r.remember(t, e);
          }
        }, i.prototype.forget = function (t) {
          if (t.isEmpty()) return this.value_ = null, !(this.children_ = null);
          if (null !== this.value_) {
            if (this.value_.isLeafNode()) return !1;
            var e = this.value_;
            this.value_ = null;
            var n = this;
            return e.forEachChild(se, function (t, e) {
              n.remember(new vt(t), e);
            }), this.forget(t)
          }
          if (null === this.children_) return !0;
          var r = t.getFront();
          return t = t.popFront(), this.children_.contains(r) && this.children_.get(r).forget(t) && this.children_.remove(r), !!this.children_.isEmpty() && !(this.children_ = null)
        }, i.prototype.forEachTree = function (r, i) {
          null !== this.value_ ? i(r, this.value_) : this.forEachChild(function (t, e) {
            var n = new vt(r.toString() + "/" + t);
            e.forEachTree(n, i);
          });
        }, i.prototype.forEachChild = function (n) {
          null !== this.children_ && this.children_.each(function (t, e) {
            n(t, e);
          });
        }, i
      }(), Ae = function (t, e) {
        return t && "object" == typeof t ? (C(".sv" in t, "Unexpected leaf node or priority contents"), e[t[".sv"]]) : t
      }, Le = function (t, r) {
        var i, e = t.getPriority().val(), n = Ae(e, r);
        if (t.isLeafNode()) {
          var o = t, s = Ae(o.getValue(), r);
          return s !== o.getValue() || n !== o.getPriority().val() ? new re(s, Ee(n)) : t
        }
        var a = t;
        return n !== (i = a).getPriority().val() && (i = i.updatePriority(new re(n))), a.forEachChild(se, function (t, e) {
          var n = Le(e, r);
          n !== e && (i = i.updateImmediateChild(t, n));
        }), i
      };
      (Se = be || (be = {}))[Se.OVERWRITE = 0] = "OVERWRITE", Se[Se.MERGE = 1] = "MERGE", Se[Se.ACK_USER_WRITE = 2] = "ACK_USER_WRITE", Se[Se.LISTEN_COMPLETE = 3] = "LISTEN_COMPLETE";
      var Me, We, qe = function () {
        function e(t, e, n, r) {
          this.fromUser = t, this.fromServer = e, this.queryId = n, this.tagged = r, C(!r || e, "Tagged queries must be from server.");
        }

        return e.User = new e(!0, !1, null, !1), e.Server = new e(!1, !0, null, !1), e.forServerTaggedQuery = function (t) {
          return new e(!1, !0, t, !0)
        }, e
      }(), Qe = function () {
        function n(t, e, n) {
          this.path = t, this.affectedTree = e, this.revert = n, this.type = be.ACK_USER_WRITE, this.source = qe.User;
        }

        return n.prototype.operationForChild = function (t) {
          if (this.path.isEmpty()) {
            if (null != this.affectedTree.value) return C(this.affectedTree.children.isEmpty(), "affectedTree should not have overlapping affected paths."), this;
            var e = this.affectedTree.subtree(new vt(t));
            return new n(vt.Empty, e, this.revert)
          }
          return C(this.path.getFront() === t, "operationForChild called for unrelated child."), new n(this.path.popFront(), this.affectedTree, this.revert)
        }, n
      }(), Ue = function () {
        function o(t, e) {
          void 0 === e && (Me || (Me = new le(at)), e = Me), this.value = t, this.children = e;
        }

        return o.fromObject = function (t) {
          var n = o.Empty;
          return w(t, function (t, e) {
            n = n.set(new vt(t), e);
          }), n
        }, o.prototype.isEmpty = function () {
          return null === this.value && this.children.isEmpty()
        }, o.prototype.findRootMostMatchingPathAndValue = function (t, e) {
          if (null != this.value && e(this.value)) return {path: vt.Empty, value: this.value};
          if (t.isEmpty()) return null;
          var n = t.getFront(), r = this.children.get(n);
          if (null === r) return null;
          var i = r.findRootMostMatchingPathAndValue(t.popFront(), e);
          return null == i ? null : {path: new vt(n).child(i.path), value: i.value}
        }, o.prototype.findRootMostValueAndPath = function (t) {
          return this.findRootMostMatchingPathAndValue(t, function () {
            return !0
          })
        }, o.prototype.subtree = function (t) {
          if (t.isEmpty()) return this;
          var e = t.getFront(), n = this.children.get(e);
          return null !== n ? n.subtree(t.popFront()) : o.Empty
        }, o.prototype.set = function (t, e) {
          if (t.isEmpty()) return new o(e, this.children);
          var n = t.getFront(), r = (this.children.get(n) || o.Empty).set(t.popFront(), e),
            i = this.children.insert(n, r);
          return new o(this.value, i)
        }, o.prototype.remove = function (t) {
          if (t.isEmpty()) return this.children.isEmpty() ? o.Empty : new o(null, this.children);
          var e = t.getFront(), n = this.children.get(e);
          if (n) {
            var r = n.remove(t.popFront()), i = void 0;
            return i = r.isEmpty() ? this.children.remove(e) : this.children.insert(e, r), null === this.value && i.isEmpty() ? o.Empty : new o(this.value, i)
          }
          return this
        }, o.prototype.get = function (t) {
          if (t.isEmpty()) return this.value;
          var e = t.getFront(), n = this.children.get(e);
          return n ? n.get(t.popFront()) : null
        }, o.prototype.setTree = function (t, e) {
          if (t.isEmpty()) return e;
          var n = t.getFront(), r = (this.children.get(n) || o.Empty).setTree(t.popFront(), e), i = void 0;
          return i = r.isEmpty() ? this.children.remove(n) : this.children.insert(n, r), new o(this.value, i)
        }, o.prototype.fold = function (t) {
          return this.fold_(vt.Empty, t)
        }, o.prototype.fold_ = function (n, r) {
          var i = {};
          return this.children.inorderTraversal(function (t, e) {
            i[t] = e.fold_(n.child(t), r);
          }), r(n, this.value, i)
        }, o.prototype.findOnPath = function (t, e) {
          return this.findOnPath_(t, vt.Empty, e)
        }, o.prototype.findOnPath_ = function (t, e, n) {
          var r = !!this.value && n(e, this.value);
          if (r) return r;
          if (t.isEmpty()) return null;
          var i = t.getFront(), o = this.children.get(i);
          return o ? o.findOnPath_(t.popFront(), e.child(i), n) : null
        }, o.prototype.foreachOnPath = function (t, e) {
          return this.foreachOnPath_(t, vt.Empty, e)
        }, o.prototype.foreachOnPath_ = function (t, e, n) {
          if (t.isEmpty()) return this;
          this.value && n(e, this.value);
          var r = t.getFront(), i = this.children.get(r);
          return i ? i.foreachOnPath_(t.popFront(), e.child(r), n) : o.Empty
        }, o.prototype.foreach = function (t) {
          this.foreach_(vt.Empty, t);
        }, o.prototype.foreach_ = function (n, r) {
          this.children.inorderTraversal(function (t, e) {
            e.foreach_(n.child(t), r);
          }), this.value && r(n, this.value);
        }, o.prototype.foreachChild = function (n) {
          this.children.inorderTraversal(function (t, e) {
            e.value && n(t, e.value);
          });
        }, o.Empty = new o(null), o
      }(), Ve = function () {
        function e(t, e) {
          this.source = t, this.path = e, this.type = be.LISTEN_COMPLETE;
        }

        return e.prototype.operationForChild = function (t) {
          return this.path.isEmpty() ? new e(this.source, vt.Empty) : new e(this.source, this.path.popFront())
        }, e
      }(), He = function () {
        function e(t, e, n) {
          this.source = t, this.path = e, this.snap = n, this.type = be.OVERWRITE;
        }

        return e.prototype.operationForChild = function (t) {
          return this.path.isEmpty() ? new e(this.source, vt.Empty, this.snap.getImmediateChild(t)) : new e(this.source, this.path.popFront(), this.snap)
        }, e
      }(), Be = function () {
        function n(t, e, n) {
          this.source = t, this.path = e, this.children = n, this.type = be.MERGE;
        }

        return n.prototype.operationForChild = function (t) {
          if (this.path.isEmpty()) {
            var e = this.children.subtree(new vt(t));
            return e.isEmpty() ? null : e.value ? new He(this.source, vt.Empty, e.value) : new n(this.source, vt.Empty, e)
          }
          return C(this.path.getFront() === t, "Can't get a merge for a child not on the path of the operation"), new n(this.source, this.path.popFront(), this.children)
        }, n.prototype.toString = function () {
          return "Operation(" + this.path + ": " + this.source.toString() + " merge: " + this.children.toString() + ")"
        }, n
      }(), je = function () {
        function t(t, e, n) {
          this.node_ = t, this.fullyInitialized_ = e, this.filtered_ = n;
        }

        return t.prototype.isFullyInitialized = function () {
          return this.fullyInitialized_
        }, t.prototype.isFiltered = function () {
          return this.filtered_
        }, t.prototype.isCompleteForPath = function (t) {
          if (t.isEmpty()) return this.isFullyInitialized() && !this.filtered_;
          var e = t.getFront();
          return this.isCompleteForChild(e)
        }, t.prototype.isCompleteForChild = function (t) {
          return this.isFullyInitialized() && !this.filtered_ || this.node_.hasChild(t)
        }, t.prototype.getNode = function () {
          return this.node_
        }, t
      }(), Ke = function () {
        function r(t, e) {
          this.eventCache_ = t, this.serverCache_ = e;
        }

        return r.prototype.updateEventSnap = function (t, e, n) {
          return new r(new je(t, e, n), this.serverCache_)
        }, r.prototype.updateServerSnap = function (t, e, n) {
          return new r(this.eventCache_, new je(t, e, n))
        }, r.prototype.getEventCache = function () {
          return this.eventCache_
        }, r.prototype.getCompleteEventSnap = function () {
          return this.eventCache_.isFullyInitialized() ? this.eventCache_.getNode() : null
        }, r.prototype.getServerCache = function () {
          return this.serverCache_
        }, r.prototype.getCompleteServerSnap = function () {
          return this.serverCache_.isFullyInitialized() ? this.serverCache_.getNode() : null
        }, r.Empty = new r(new je(ge.EMPTY_NODE, !1, !1), new je(ge.EMPTY_NODE, !1, !1)), r
      }(), Ye = function () {
        function r(t, e, n, r, i) {
          this.type = t, this.snapshotNode = e, this.childName = n, this.oldSnap = r, this.prevName = i;
        }

        return r.valueChange = function (t) {
          return new r(r.VALUE, t)
        }, r.childAddedChange = function (t, e) {
          return new r(r.CHILD_ADDED, e, t)
        }, r.childRemovedChange = function (t, e) {
          return new r(r.CHILD_REMOVED, e, t)
        }, r.childChangedChange = function (t, e, n) {
          return new r(r.CHILD_CHANGED, e, t, n)
        }, r.childMovedChange = function (t, e) {
          return new r(r.CHILD_MOVED, e, t)
        }, r.CHILD_ADDED = "child_added", r.CHILD_REMOVED = "child_removed", r.CHILD_CHANGED = "child_changed", r.CHILD_MOVED = "child_moved", r.VALUE = "value", r
      }(), ze = function () {
        function t(t) {
          this.index_ = t;
        }

        return t.prototype.updateChild = function (t, e, n, r, i, o) {
          C(t.isIndexed(this.index_), "A node must be indexed if only a child is updated");
          var s = t.getImmediateChild(e);
          return s.getChild(r).equals(n.getChild(r)) && s.isEmpty() == n.isEmpty() ? t : (null != o && (n.isEmpty() ? t.hasChild(e) ? o.trackChildChange(Ye.childRemovedChange(e, s)) : C(t.isLeafNode(), "A child remove without an old child only makes sense on a leaf node") : s.isEmpty() ? o.trackChildChange(Ye.childAddedChange(e, n)) : o.trackChildChange(Ye.childChangedChange(e, n, s))), t.isLeafNode() && n.isEmpty() ? t : t.updateImmediateChild(e, n).withIndex(this.index_))
        }, t.prototype.updateFullNode = function (r, n, i) {
          return null != i && (r.isLeafNode() || r.forEachChild(se, function (t, e) {
            n.hasChild(t) || i.trackChildChange(Ye.childRemovedChange(t, e));
          }), n.isLeafNode() || n.forEachChild(se, function (t, e) {
            if (r.hasChild(t)) {
              var n = r.getImmediateChild(t);
              n.equals(e) || i.trackChildChange(Ye.childChangedChange(t, e, n));
            } else i.trackChildChange(Ye.childAddedChange(t, e));
          })), n.withIndex(this.index_)
        }, t.prototype.updatePriority = function (t, e) {
          return t.isEmpty() ? ge.EMPTY_NODE : t.updatePriority(e)
        }, t.prototype.filtersNodes = function () {
          return !1
        }, t.prototype.getIndexedFilter = function () {
          return this
        }, t.prototype.getIndex = function () {
          return this.index_
        }, t
      }(), Ge = function () {
        function t() {
          this.changeMap_ = {};
        }

        return t.prototype.trackChildChange = function (t) {
          var e = t.type, n = t.childName;
          C(e == Ye.CHILD_ADDED || e == Ye.CHILD_CHANGED || e == Ye.CHILD_REMOVED, "Only child changes supported for tracking"), C(".priority" !== n, "Only non-priority child changes can be tracked.");
          var r = m(this.changeMap_, n);
          if (r) {
            var i = r.type;
            if (e == Ye.CHILD_ADDED && i == Ye.CHILD_REMOVED) this.changeMap_[n] = Ye.childChangedChange(n, t.snapshotNode, r.snapshotNode); else if (e == Ye.CHILD_REMOVED && i == Ye.CHILD_ADDED) delete this.changeMap_[n]; else if (e == Ye.CHILD_REMOVED && i == Ye.CHILD_CHANGED) this.changeMap_[n] = Ye.childRemovedChange(n, r.oldSnap); else if (e == Ye.CHILD_CHANGED && i == Ye.CHILD_ADDED) this.changeMap_[n] = Ye.childAddedChange(n, t.snapshotNode); else {
              if (e != Ye.CHILD_CHANGED || i != Ye.CHILD_CHANGED) throw p("Illegal combination of changes: " + t + " occurred after " + r);
              this.changeMap_[n] = Ye.childChangedChange(n, t.snapshotNode, r.oldSnap);
            }
          } else this.changeMap_[n] = t;
        }, t.prototype.getChanges = function () {
          return function (t) {
            var e = [], n = 0;
            for (var r in t) e[n++] = t[r];
            return e
          }(this.changeMap_)
        }, t
      }(), Xe = new (function () {
        function t() {
        }

        return t.prototype.getCompleteChild = function (t) {
          return null
        }, t.prototype.getChildAfterChild = function (t, e, n) {
          return null
        }, t
      }()), $e = function () {
        function t(t, e, n) {
          void 0 === n && (n = null), this.writes_ = t, this.viewCache_ = e, this.optCompleteServerCache_ = n;
        }

        return t.prototype.getCompleteChild = function (t) {
          var e = this.viewCache_.getEventCache();
          if (e.isCompleteForChild(t)) return e.getNode().getImmediateChild(t);
          var n = null != this.optCompleteServerCache_ ? new je(this.optCompleteServerCache_, !0, !1) : this.viewCache_.getServerCache();
          return this.writes_.calcCompleteChild(t, n)
        }, t.prototype.getChildAfterChild = function (t, e, n) {
          var r = null != this.optCompleteServerCache_ ? this.optCompleteServerCache_ : this.viewCache_.getCompleteServerSnap(),
            i = this.writes_.calcIndexedSlice(r, e, 1, n, t);
          return 0 === i.length ? null : i[0]
        }, t
      }(), Je = function (t, e) {
        this.viewCache = t, this.changes = e;
      }, Ze = function () {
        function c(t) {
          this.filter_ = t;
        }

        return c.prototype.assertIndexed = function (t) {
          C(t.getEventCache().getNode().isIndexed(this.filter_.getIndex()), "Event snap not indexed"), C(t.getServerCache().getNode().isIndexed(this.filter_.getIndex()), "Server snap not indexed");
        }, c.prototype.applyOperation = function (t, e, n, r) {
          var i, o, s = new Ge;
          if (e.type === be.OVERWRITE) {
            var a = e;
            i = a.source.fromUser ? this.applyUserOverwrite_(t, a.path, a.snap, n, r, s) : (C(a.source.fromServer, "Unknown source."), o = a.source.tagged || t.getServerCache().isFiltered() && !a.path.isEmpty(), this.applyServerOverwrite_(t, a.path, a.snap, n, r, o, s));
          } else if (e.type === be.MERGE) {
            var h = e;
            i = h.source.fromUser ? this.applyUserMerge_(t, h.path, h.children, n, r, s) : (C(h.source.fromServer, "Unknown source."), o = h.source.tagged || t.getServerCache().isFiltered(), this.applyServerMerge_(t, h.path, h.children, n, r, o, s));
          } else if (e.type === be.ACK_USER_WRITE) {
            var u = e;
            i = u.revert ? this.revertUserWrite_(t, u.path, n, r, s) : this.ackUserWrite_(t, u.path, u.affectedTree, n, r, s);
          } else {
            if (e.type !== be.LISTEN_COMPLETE) throw p("Unknown operation type: " + e.type);
            i = this.listenComplete_(t, e.path, n, s);
          }
          var l = s.getChanges();
          return c.maybeAddValueEvent_(t, i, l), new Je(i, l)
        }, c.maybeAddValueEvent_ = function (t, e, n) {
          var r = e.getEventCache();
          if (r.isFullyInitialized()) {
            var i = r.getNode().isLeafNode() || r.getNode().isEmpty(), o = t.getCompleteEventSnap();
            (0 < n.length || !t.getEventCache().isFullyInitialized() || i && !r.getNode().equals(o) || !r.getNode().getPriority().equals(o.getPriority())) && n.push(Ye.valueChange(e.getCompleteEventSnap()));
          }
        }, c.prototype.generateEventCacheAfterServerEvent_ = function (t, e, n, r, i) {
          var o = t.getEventCache();
          if (null != n.shadowingWrite(e)) return t;
          var s = void 0, a = void 0;
          if (e.isEmpty()) if (C(t.getServerCache().isFullyInitialized(), "If change path is empty, we must have complete server data"), t.getServerCache().isFiltered()) {
            var h = t.getCompleteServerSnap(), u = h instanceof ge ? h : ge.EMPTY_NODE,
              l = n.calcCompleteEventChildren(u);
            s = this.filter_.updateFullNode(t.getEventCache().getNode(), l, i);
          } else {
            var c = n.calcCompleteEventCache(t.getCompleteServerSnap());
            s = this.filter_.updateFullNode(t.getEventCache().getNode(), c, i);
          } else {
            var p = e.getFront();
            if (".priority" == p) {
              C(1 == e.getLength(), "Can't have a priority with additional path components");
              var d = o.getNode();
              a = t.getServerCache().getNode();
              var f = n.calcEventCacheAfterServerOverwrite(e, d, a);
              s = null != f ? this.filter_.updatePriority(d, f) : o.getNode();
            } else {
              var _ = e.popFront(), y = void 0;
              if (o.isCompleteForChild(p)) {
                a = t.getServerCache().getNode();
                var v = n.calcEventCacheAfterServerOverwrite(e, o.getNode(), a);
                y = null != v ? o.getNode().getImmediateChild(p).updateChild(_, v) : o.getNode().getImmediateChild(p);
              } else y = n.calcCompleteChild(p, t.getServerCache());
              s = null != y ? this.filter_.updateChild(o.getNode(), p, y, _, r, i) : o.getNode();
            }
          }
          return t.updateEventSnap(s, o.isFullyInitialized() || e.isEmpty(), this.filter_.filtersNodes())
        }, c.prototype.applyServerOverwrite_ = function (t, e, n, r, i, o, s) {
          var a, h = t.getServerCache(), u = o ? this.filter_ : this.filter_.getIndexedFilter();
          if (e.isEmpty()) a = u.updateFullNode(h.getNode(), n, null); else if (u.filtersNodes() && !h.isFiltered()) {
            var l = h.getNode().updateChild(e, n);
            a = u.updateFullNode(h.getNode(), l, null);
          } else {
            var c = e.getFront();
            if (!h.isCompleteForPath(e) && 1 < e.getLength()) return t;
            var p = e.popFront(), d = h.getNode().getImmediateChild(c).updateChild(p, n);
            a = ".priority" == c ? u.updatePriority(h.getNode(), d) : u.updateChild(h.getNode(), c, d, p, Xe, null);
          }
          var f = t.updateServerSnap(a, h.isFullyInitialized() || e.isEmpty(), u.filtersNodes()), _ = new $e(r, f, i);
          return this.generateEventCacheAfterServerEvent_(f, e, r, _, s)
        }, c.prototype.applyUserOverwrite_ = function (t, e, n, r, i, o) {
          var s, a, h = t.getEventCache(), u = new $e(r, t, i);
          if (e.isEmpty()) a = this.filter_.updateFullNode(t.getEventCache().getNode(), n, o), s = t.updateEventSnap(a, !0, this.filter_.filtersNodes()); else {
            var l = e.getFront();
            if (".priority" === l) a = this.filter_.updatePriority(t.getEventCache().getNode(), n), s = t.updateEventSnap(a, h.isFullyInitialized(), h.isFiltered()); else {
              var c = e.popFront(), p = h.getNode().getImmediateChild(l), d = void 0;
              if (c.isEmpty()) d = n; else {
                var f = u.getCompleteChild(l);
                d = null != f ? ".priority" === c.getBack() && f.getChild(c.parent()).isEmpty() ? f : f.updateChild(c, n) : ge.EMPTY_NODE;
              }
              if (p.equals(d)) s = t; else {
                var _ = this.filter_.updateChild(h.getNode(), l, d, c, u, o);
                s = t.updateEventSnap(_, h.isFullyInitialized(), this.filter_.filtersNodes());
              }
            }
          }
          return s
        }, c.cacheHasChild_ = function (t, e) {
          return t.getEventCache().isCompleteForChild(e)
        }, c.prototype.applyUserMerge_ = function (r, i, t, o, s, a) {
          var h = this, u = r;
          return t.foreach(function (t, e) {
            var n = i.child(t);
            c.cacheHasChild_(r, n.getFront()) && (u = h.applyUserOverwrite_(u, n, e, o, s, a));
          }), t.foreach(function (t, e) {
            var n = i.child(t);
            c.cacheHasChild_(r, n.getFront()) || (u = h.applyUserOverwrite_(u, n, e, o, s, a));
          }), u
        }, c.prototype.applyMerge_ = function (n, t) {
          return t.foreach(function (t, e) {
            n = n.updateChild(t, e);
          }), n
        }, c.prototype.applyServerMerge_ = function (o, t, e, s, a, h, u) {
          var l = this;
          if (o.getServerCache().getNode().isEmpty() && !o.getServerCache().isFullyInitialized()) return o;
          var n, c = o;
          n = t.isEmpty() ? e : Ue.Empty.setTree(t, e);
          var p = o.getServerCache().getNode();
          return n.children.inorderTraversal(function (t, e) {
            if (p.hasChild(t)) {
              var n = o.getServerCache().getNode().getImmediateChild(t), r = l.applyMerge_(n, e);
              c = l.applyServerOverwrite_(c, new vt(t), r, s, a, h, u);
            }
          }), n.children.inorderTraversal(function (t, e) {
            var n = !o.getServerCache().isCompleteForChild(t) && null == e.value;
            if (!p.hasChild(t) && !n) {
              var r = o.getServerCache().getNode().getImmediateChild(t), i = l.applyMerge_(r, e);
              c = l.applyServerOverwrite_(c, new vt(t), i, s, a, h, u);
            }
          }), c
        }, c.prototype.ackUserWrite_ = function (t, r, e, n, i, o) {
          if (null != n.shadowingWrite(r)) return t;
          var s = t.getServerCache().isFiltered(), a = t.getServerCache();
          if (null != e.value) {
            if (r.isEmpty() && a.isFullyInitialized() || a.isCompleteForPath(r)) return this.applyServerOverwrite_(t, r, a.getNode().getChild(r), n, i, s, o);
            if (r.isEmpty()) {
              var h = Ue.Empty;
              return a.getNode().forEachChild($t, function (t, e) {
                h = h.set(new vt(t), e);
              }), this.applyServerMerge_(t, r, h, n, i, s, o)
            }
            return t
          }
          var u = Ue.Empty;
          return e.foreach(function (t, e) {
            var n = r.child(t);
            a.isCompleteForPath(n) && (u = u.set(t, a.getNode().getChild(n)));
          }), this.applyServerMerge_(t, r, u, n, i, s, o)
        }, c.prototype.listenComplete_ = function (t, e, n, r) {
          var i = t.getServerCache(),
            o = t.updateServerSnap(i.getNode(), i.isFullyInitialized() || e.isEmpty(), i.isFiltered());
          return this.generateEventCacheAfterServerEvent_(o, e, n, Xe, r)
        }, c.prototype.revertUserWrite_ = function (t, e, n, r, i) {
          var o;
          if (null != n.shadowingWrite(e)) return t;
          var s = new $e(n, t, r), a = t.getEventCache().getNode(), h = void 0;
          if (e.isEmpty() || ".priority" === e.getFront()) {
            var u = void 0;
            if (t.getServerCache().isFullyInitialized()) u = n.calcCompleteEventCache(t.getCompleteServerSnap()); else {
              var l = t.getServerCache().getNode();
              C(l instanceof ge, "serverChildren would be complete if leaf node"), u = n.calcCompleteEventChildren(l);
            }
            u = u, h = this.filter_.updateFullNode(a, u, i);
          } else {
            var c = e.getFront(), p = n.calcCompleteChild(c, t.getServerCache());
            null == p && t.getServerCache().isCompleteForChild(c) && (p = a.getImmediateChild(c)), (h = null != p ? this.filter_.updateChild(a, c, p, e.popFront(), s, i) : t.getEventCache().getNode().hasChild(c) ? this.filter_.updateChild(a, c, ge.EMPTY_NODE, e.popFront(), s, i) : a).isEmpty() && t.getServerCache().isFullyInitialized() && (o = n.calcCompleteEventCache(t.getCompleteServerSnap())).isLeafNode() && (h = this.filter_.updateFullNode(h, o, i));
          }
          return o = t.getServerCache().isFullyInitialized() || null != n.shadowingWrite(vt.Empty), t.updateEventSnap(h, o, this.filter_.filtersNodes())
        }, c
      }(), tn = function () {
        function t(t) {
          this.query_ = t, this.index_ = this.query_.getQueryParams().getIndex();
        }

        return t.prototype.generateEventsForChanges = function (t, e, n) {
          var r = this, i = [], o = [];
          return t.forEach(function (t) {
            t.type === Ye.CHILD_CHANGED && r.index_.indexedValueChanged(t.oldSnap, t.snapshotNode) && o.push(Ye.childMovedChange(t.childName, t.snapshotNode));
          }), this.generateEventsForType_(i, Ye.CHILD_REMOVED, t, n, e), this.generateEventsForType_(i, Ye.CHILD_ADDED, t, n, e), this.generateEventsForType_(i, Ye.CHILD_MOVED, o, n, e), this.generateEventsForType_(i, Ye.CHILD_CHANGED, t, n, e), this.generateEventsForType_(i, Ye.VALUE, t, n, e), i
        }, t.prototype.generateEventsForType_ = function (r, e, t, i, o) {
          var s = this, n = t.filter(function (t) {
            return t.type === e
          });
          n.sort(this.compareChanges_.bind(this)), n.forEach(function (e) {
            var n = s.materializeSingleChange_(e, o);
            i.forEach(function (t) {
              t.respondsTo(e.type) && r.push(t.createEvent(n, s.query_));
            });
          });
        }, t.prototype.materializeSingleChange_ = function (t, e) {
          return "value" === t.type || "child_removed" === t.type || (t.prevName = e.getPredecessorChildName(t.childName, t.snapshotNode, this.index_)), t
        }, t.prototype.compareChanges_ = function (t, e) {
          if (null == t.childName || null == e.childName) throw p("Should only compare child_ events.");
          var n = new zt(t.childName, t.snapshotNode), r = new zt(e.childName, e.snapshotNode);
          return this.index_.compare(n, r)
        }, t
      }(), en = function () {
        function t(t, e) {
          this.query_ = t, this.eventRegistrations_ = [];
          var n = this.query_.getQueryParams(), r = new ze(n.getIndex()), i = n.getNodeFilter();
          this.processor_ = new Ze(i);
          var o = e.getServerCache(), s = e.getEventCache(), a = r.updateFullNode(ge.EMPTY_NODE, o.getNode(), null),
            h = i.updateFullNode(ge.EMPTY_NODE, s.getNode(), null),
            u = new je(a, o.isFullyInitialized(), r.filtersNodes()),
            l = new je(h, s.isFullyInitialized(), i.filtersNodes());
          this.viewCache_ = new Ke(l, u), this.eventGenerator_ = new tn(this.query_);
        }

        return t.prototype.getQuery = function () {
          return this.query_
        }, t.prototype.getServerCache = function () {
          return this.viewCache_.getServerCache().getNode()
        }, t.prototype.getCompleteServerCache = function (t) {
          var e = this.viewCache_.getCompleteServerSnap();
          return e && (this.query_.getQueryParams().loadsAllData() || !t.isEmpty() && !e.getImmediateChild(t.getFront()).isEmpty()) ? e.getChild(t) : null
        }, t.prototype.isEmpty = function () {
          return 0 === this.eventRegistrations_.length
        }, t.prototype.addEventRegistration = function (t) {
          this.eventRegistrations_.push(t);
        }, t.prototype.removeEventRegistration = function (t, n) {
          var r = [];
          if (n) {
            C(null == t, "A cancel should cancel all event registrations.");
            var i = this.query_.path;
            this.eventRegistrations_.forEach(function (t) {
              n = n;
              var e = t.createCancelEvent(n, i);
              e && r.push(e);
            });
          }
          if (t) {
            for (var e = [], o = 0; o < this.eventRegistrations_.length; ++o) {
              var s = this.eventRegistrations_[o];
              if (s.matches(t)) {
                if (t.hasAnyCallback()) {
                  e = e.concat(this.eventRegistrations_.slice(o + 1));
                  break
                }
              } else e.push(s);
            }
            this.eventRegistrations_ = e;
          } else this.eventRegistrations_ = [];
          return r
        }, t.prototype.applyOperation = function (t, e, n) {
          t.type === be.MERGE && null !== t.source.queryId && (C(this.viewCache_.getCompleteServerSnap(), "We should always have a full cache before handling merges"), C(this.viewCache_.getCompleteEventSnap(), "Missing event cache, even though we have a server cache"));
          var r = this.viewCache_, i = this.processor_.applyOperation(r, t, e, n);
          return this.processor_.assertIndexed(i.viewCache), C(i.viewCache.getServerCache().isFullyInitialized() || !r.getServerCache().isFullyInitialized(), "Once a server snap is complete, it should never go back"), this.viewCache_ = i.viewCache, this.generateEventsForChanges_(i.changes, i.viewCache.getEventCache().getNode(), null)
        }, t.prototype.getInitialEvents = function (t) {
          var e = this.viewCache_.getEventCache(), n = [];
          e.getNode().isLeafNode() || e.getNode().forEachChild(se, function (t, e) {
            n.push(Ye.childAddedChange(t, e));
          });
          return e.isFullyInitialized() && n.push(Ye.valueChange(e.getNode())), this.generateEventsForChanges_(n, e.getNode(), t)
        }, t.prototype.generateEventsForChanges_ = function (t, e, n) {
          var r = n ? [n] : this.eventRegistrations_;
          return this.eventGenerator_.generateEventsForChanges(t, e, r)
        }, t
      }(), nn = function () {
        function u() {
          this.views_ = {};
        }

        return Object.defineProperty(u, "__referenceConstructor", {
          get: function () {
            return C(We, "Reference.ts has not been loaded"), We
          }, set: function (t) {
            C(!We, "__referenceConstructor has already been defined"), We = t;
          }, enumerable: !0, configurable: !0
        }), u.prototype.isEmpty = function () {
          return S(this.views_)
        }, u.prototype.applyOperation = function (n, r, i) {
          var t = n.source.queryId;
          if (null !== t) {
            var e = m(this.views_, t);
            return C(null != e, "SyncTree gave us an op for an invalid query."), e.applyOperation(n, r, i)
          }
          var o = [];
          return w(this.views_, function (t, e) {
            o = o.concat(e.applyOperation(n, r, i));
          }), o
        }, u.prototype.addEventRegistration = function (t, e, n, r, i) {
          var o = t.queryIdentifier(), s = m(this.views_, o);
          if (!s) {
            var a = n.calcCompleteEventCache(i ? r : null), h = !1;
            h = !!a || (a = r instanceof ge ? n.calcCompleteEventChildren(r) : ge.EMPTY_NODE, !1);
            var u = new Ke(new je(a, h, !1), new je(r, i, !1));
            s = new en(t, u), this.views_[o] = s;
          }
          return s.addEventRegistration(e), s.getInitialEvents(e)
        }, u.prototype.removeEventRegistration = function (t, n, r) {
          var e = t.queryIdentifier(), i = [], o = [], s = this.hasCompleteView();
          if ("default" === e) {
            var a = this;
            w(this.views_, function (t, e) {
              o = o.concat(e.removeEventRegistration(n, r)), e.isEmpty() && (delete a.views_[t], e.getQuery().getQueryParams().loadsAllData() || i.push(e.getQuery()));
            });
          } else {
            var h = m(this.views_, e);
            h && (o = o.concat(h.removeEventRegistration(n, r)), h.isEmpty() && (delete this.views_[e], h.getQuery().getQueryParams().loadsAllData() || i.push(h.getQuery())));
          }
          return s && !this.hasCompleteView() && i.push(new u.__referenceConstructor(t.repo, t.path)), {
            removed: i,
            events: o
          }
        }, u.prototype.getQueryViews = function () {
          var e = this;
          return Object.keys(this.views_).map(function (t) {
            return e.views_[t]
          }).filter(function (t) {
            return !t.getQuery().getQueryParams().loadsAllData()
          })
        }, u.prototype.getCompleteServerCache = function (n) {
          var r = null;
          return w(this.views_, function (t, e) {
            r = r || e.getCompleteServerCache(n);
          }), r
        }, u.prototype.viewForQuery = function (t) {
          if (t.getQueryParams().loadsAllData()) return this.getCompleteView();
          var e = t.queryIdentifier();
          return m(this.views_, e)
        }, u.prototype.viewExistsForQuery = function (t) {
          return null != this.viewForQuery(t)
        }, u.prototype.hasCompleteView = function () {
          return null != this.getCompleteView()
        }, u.prototype.getCompleteView = function () {
          var t, e, n;
          return (t = this.views_, (n = N(t, function (t) {
            return t.getQuery().getQueryParams().loadsAllData()
          }, e)) && t[n]) || null
        }, u
      }(), rn = function () {
        function a(t) {
          this.writeTree_ = t;
        }

        return a.prototype.addWrite = function (t, e) {
          if (t.isEmpty()) return new a(new Ue(e));
          var n = this.writeTree_.findRootMostValueAndPath(t);
          if (null != n) {
            var r = n.path, i = n.value, o = vt.relativePath(r, t);
            return i = i.updateChild(o, e), new a(this.writeTree_.set(r, i))
          }
          var s = new Ue(e);
          return new a(this.writeTree_.setTree(t, s))
        }, a.prototype.addWrites = function (n, t) {
          var r = this;
          return w(t, function (t, e) {
            r = r.addWrite(n.child(t), e);
          }), r
        }, a.prototype.removeWrite = function (t) {
          return t.isEmpty() ? a.Empty : new a(this.writeTree_.setTree(t, Ue.Empty))
        }, a.prototype.hasCompleteWrite = function (t) {
          return null != this.getCompleteNode(t)
        }, a.prototype.getCompleteNode = function (t) {
          var e = this.writeTree_.findRootMostValueAndPath(t);
          return null != e ? this.writeTree_.get(e.path).getChild(vt.relativePath(e.path, t)) : null
        }, a.prototype.getCompleteChildren = function () {
          var n = [], t = this.writeTree_.value;
          return null != t ? t.isLeafNode() || t.forEachChild(se, function (t, e) {
            n.push(new zt(t, e));
          }) : this.writeTree_.children.inorderTraversal(function (t, e) {
            null != e.value && n.push(new zt(t, e.value));
          }), n
        }, a.prototype.childCompoundWrite = function (t) {
          if (t.isEmpty()) return this;
          var e = this.getCompleteNode(t);
          return new a(null != e ? new Ue(e) : this.writeTree_.subtree(t))
        }, a.prototype.isEmpty = function () {
          return this.writeTree_.isEmpty()
        }, a.prototype.apply = function (t) {
          return a.applySubtreeWrite_(vt.Empty, this.writeTree_, t)
        }, a.Empty = new a(new Ue(null)), a.applySubtreeWrite_ = function (n, t, r) {
          if (null != t.value) return r.updateChild(n, t.value);
          var i = null;
          return t.children.inorderTraversal(function (t, e) {
            ".priority" === t ? (C(null !== e.value, "Priority writes must always be leaf nodes"), i = e.value) : r = a.applySubtreeWrite_(n.child(t), e, r);
          }), r.getChild(n).isEmpty() || null === i || (r = r.updateChild(n.child(".priority"), i)), r
        }, a
      }(), on = function () {
        function u() {
          this.visibleWrites_ = rn.Empty, this.allWrites_ = [], this.lastWriteId_ = -1;
        }

        return u.prototype.childWrites = function (t) {
          return new sn(t, this)
        }, u.prototype.addOverwrite = function (t, e, n, r) {
          C(n > this.lastWriteId_, "Stacking an older write on top of newer ones"), void 0 === r && (r = !0), this.allWrites_.push({
            path: t,
            snap: e,
            writeId: n,
            visible: r
          }), r && (this.visibleWrites_ = this.visibleWrites_.addWrite(t, e)), this.lastWriteId_ = n;
        }, u.prototype.addMerge = function (t, e, n) {
          C(n > this.lastWriteId_, "Stacking an older merge on top of newer ones"), this.allWrites_.push({
            path: t,
            children: e,
            writeId: n,
            visible: !0
          }), this.visibleWrites_ = this.visibleWrites_.addWrites(t, e), this.lastWriteId_ = n;
        }, u.prototype.getWrite = function (t) {
          for (var e = 0; e < this.allWrites_.length; e++) {
            var n = this.allWrites_[e];
            if (n.writeId === t) return n
          }
          return null
        }, u.prototype.removeWrite = function (e) {
          var n = this, t = this.allWrites_.findIndex(function (t) {
            return t.writeId === e
          });
          C(0 <= t, "removeWrite called with nonexistent writeId.");
          var r = this.allWrites_[t];
          this.allWrites_.splice(t, 1);
          for (var i = r.visible, o = !1, s = this.allWrites_.length - 1; i && 0 <= s;) {
            var a = this.allWrites_[s];
            a.visible && (t <= s && this.recordContainsPath_(a, r.path) ? i = !1 : r.path.contains(a.path) && (o = !0)), s--;
          }
          if (i) {
            if (o) return this.resetTree_(), !0;
            if (r.snap) this.visibleWrites_ = this.visibleWrites_.removeWrite(r.path); else {
              var h = r.children;
              w(h, function (t) {
                n.visibleWrites_ = n.visibleWrites_.removeWrite(r.path.child(t));
              });
            }
            return !0
          }
          return !1
        }, u.prototype.getCompleteWriteData = function (t) {
          return this.visibleWrites_.getCompleteNode(t)
        }, u.prototype.calcCompleteEventCache = function (e, t, n, r) {
          if (n || r) {
            var i = this.visibleWrites_.childCompoundWrite(e);
            if (!r && i.isEmpty()) return t;
            if (r || null != t || i.hasCompleteWrite(vt.Empty)) {
              var o = u.layerTree_(this.allWrites_, function (t) {
                return (t.visible || r) && (!n || !~n.indexOf(t.writeId)) && (t.path.contains(e) || e.contains(t.path))
              }, e);
              h = t || ge.EMPTY_NODE;
              return o.apply(h)
            }
            return null
          }
          var s = this.visibleWrites_.getCompleteNode(e);
          if (null != s) return s;
          var a = this.visibleWrites_.childCompoundWrite(e);
          if (a.isEmpty()) return t;
          if (null != t || a.hasCompleteWrite(vt.Empty)) {
            var h = t || ge.EMPTY_NODE;
            return a.apply(h)
          }
          return null
        }, u.prototype.calcCompleteEventChildren = function (t, e) {
          var r = ge.EMPTY_NODE, n = this.visibleWrites_.getCompleteNode(t);
          if (n) return n.isLeafNode() || n.forEachChild(se, function (t, e) {
            r = r.updateImmediateChild(t, e);
          }), r;
          if (e) {
            var i = this.visibleWrites_.childCompoundWrite(t);
            return e.forEachChild(se, function (t, e) {
              var n = i.childCompoundWrite(new vt(t)).apply(e);
              r = r.updateImmediateChild(t, n);
            }), i.getCompleteChildren().forEach(function (t) {
              r = r.updateImmediateChild(t.name, t.node);
            }), r
          }
          return this.visibleWrites_.childCompoundWrite(t).getCompleteChildren().forEach(function (t) {
            r = r.updateImmediateChild(t.name, t.node);
          }), r
        }, u.prototype.calcEventCacheAfterServerOverwrite = function (t, e, n, r) {
          C(n || r, "Either existingEventSnap or existingServerSnap must exist");
          var i = t.child(e);
          if (this.visibleWrites_.hasCompleteWrite(i)) return null;
          var o = this.visibleWrites_.childCompoundWrite(i);
          return o.isEmpty() ? r.getChild(e) : o.apply(r.getChild(e))
        }, u.prototype.calcCompleteChild = function (t, e, n) {
          var r = t.child(e), i = this.visibleWrites_.getCompleteNode(r);
          return null != i ? i : n.isCompleteForChild(e) ? this.visibleWrites_.childCompoundWrite(r).apply(n.getNode().getImmediateChild(e)) : null
        }, u.prototype.shadowingWrite = function (t) {
          return this.visibleWrites_.getCompleteNode(t)
        }, u.prototype.calcIndexedSlice = function (t, e, n, r, i, o) {
          var s, a = this.visibleWrites_.childCompoundWrite(t), h = a.getCompleteNode(vt.Empty);
          if (null != h) s = h; else {
            if (null == e) return [];
            s = a.apply(e);
          }
          if ((s = s.withIndex(o)).isEmpty() || s.isLeafNode()) return [];
          for (var u = [], l = o.getCompare(), c = i ? s.getReverseIteratorFrom(n, o) : s.getIteratorFrom(n, o), p = c.getNext(); p && u.length < r;) 0 !== l(p, n) && u.push(p), p = c.getNext();
          return u
        }, u.prototype.recordContainsPath_ = function (n, r) {
          return n.snap ? n.path.contains(r) : !!N(n.children, function (t, e) {
            return n.path.child(e).contains(r)
          })
        }, u.prototype.resetTree_ = function () {
          this.visibleWrites_ = u.layerTree_(this.allWrites_, u.DefaultFilter_, vt.Empty), 0 < this.allWrites_.length ? this.lastWriteId_ = this.allWrites_[this.allWrites_.length - 1].writeId : this.lastWriteId_ = -1;
        }, u.DefaultFilter_ = function (t) {
          return t.visible
        }, u.layerTree_ = function (t, e, n) {
          for (var r = rn.Empty, i = 0; i < t.length; ++i) {
            var o = t[i];
            if (e(o)) {
              var s = o.path, a = void 0;
              if (o.snap) n.contains(s) ? (a = vt.relativePath(n, s), r = r.addWrite(a, o.snap)) : s.contains(n) && (a = vt.relativePath(s, n), r = r.addWrite(vt.Empty, o.snap.getChild(a))); else {
                if (!o.children) throw p("WriteRecord should have .snap or .children");
                if (n.contains(s)) a = vt.relativePath(n, s), r = r.addWrites(a, o.children); else if (s.contains(n)) if ((a = vt.relativePath(s, n)).isEmpty()) r = r.addWrites(vt.Empty, o.children); else {
                  var h = m(o.children, a.getFront());
                  if (h) {
                    var u = h.getChild(a.popFront());
                    r = r.addWrite(vt.Empty, u);
                  }
                }
              }
            }
          }
          return r
        }, u
      }(), sn = function () {
        function e(t, e) {
          this.treePath_ = t, this.writeTree_ = e;
        }

        return e.prototype.calcCompleteEventCache = function (t, e, n) {
          return this.writeTree_.calcCompleteEventCache(this.treePath_, t, e, n)
        }, e.prototype.calcCompleteEventChildren = function (t) {
          return this.writeTree_.calcCompleteEventChildren(this.treePath_, t)
        }, e.prototype.calcEventCacheAfterServerOverwrite = function (t, e, n) {
          return this.writeTree_.calcEventCacheAfterServerOverwrite(this.treePath_, t, e, n)
        }, e.prototype.shadowingWrite = function (t) {
          return this.writeTree_.shadowingWrite(this.treePath_.child(t))
        }, e.prototype.calcIndexedSlice = function (t, e, n, r, i) {
          return this.writeTree_.calcIndexedSlice(this.treePath_, t, e, n, r, i)
        }, e.prototype.calcCompleteChild = function (t, e) {
          return this.writeTree_.calcCompleteChild(this.treePath_, t, e)
        }, e.prototype.child = function (t) {
          return new e(this.treePath_.child(t), this.writeTree_)
        }, e
      }(), an = function () {
        function v(t) {
          this.listenProvider_ = t, this.syncPointTree_ = Ue.Empty, this.pendingWriteTree_ = new on, this.tagToQueryMap_ = {}, this.queryToTagMap_ = {};
        }

        return v.prototype.applyUserOverwrite = function (t, e, n, r) {
          return this.pendingWriteTree_.addOverwrite(t, e, n, r), r ? this.applyOperationToSyncPoints_(new He(qe.User, t, e)) : []
        }, v.prototype.applyUserMerge = function (t, e, n) {
          this.pendingWriteTree_.addMerge(t, e, n);
          var r = Ue.fromObject(e);
          return this.applyOperationToSyncPoints_(new Be(qe.User, t, r))
        }, v.prototype.ackUserWrite = function (t, e) {
          void 0 === e && (e = !1);
          var n = this.pendingWriteTree_.getWrite(t);
          if (this.pendingWriteTree_.removeWrite(t)) {
            var r = Ue.Empty;
            return null != n.snap ? r = r.set(vt.Empty, !0) : w(n.children, function (t, e) {
              r = r.set(new vt(t), e);
            }), this.applyOperationToSyncPoints_(new Qe(n.path, r, e))
          }
          return []
        }, v.prototype.applyServerOverwrite = function (t, e) {
          return this.applyOperationToSyncPoints_(new He(qe.Server, t, e))
        }, v.prototype.applyServerMerge = function (t, e) {
          var n = Ue.fromObject(e);
          return this.applyOperationToSyncPoints_(new Be(qe.Server, t, n))
        }, v.prototype.applyListenComplete = function (t) {
          return this.applyOperationToSyncPoints_(new Ve(qe.Server, t))
        }, v.prototype.applyTaggedQueryOverwrite = function (t, e, n) {
          var r = this.queryKeyForTag_(n);
          if (null == r) return [];
          var i = v.parseQueryKey_(r), o = i.path, s = i.queryId, a = vt.relativePath(o, t),
            h = new He(qe.forServerTaggedQuery(s), a, e);
          return this.applyTaggedOperation_(o, h)
        }, v.prototype.applyTaggedQueryMerge = function (t, e, n) {
          var r = this.queryKeyForTag_(n);
          if (r) {
            var i = v.parseQueryKey_(r), o = i.path, s = i.queryId, a = vt.relativePath(o, t), h = Ue.fromObject(e),
              u = new Be(qe.forServerTaggedQuery(s), a, h);
            return this.applyTaggedOperation_(o, u)
          }
          return []
        }, v.prototype.applyTaggedListenComplete = function (t, e) {
          var n = this.queryKeyForTag_(e);
          if (n) {
            var r = v.parseQueryKey_(n), i = r.path, o = r.queryId, s = vt.relativePath(i, t),
              a = new Ve(qe.forServerTaggedQuery(o), s);
            return this.applyTaggedOperation_(i, a)
          }
          return []
        }, v.prototype.addEventRegistration = function (t, e) {
          var r = t.path, i = null, o = !1;
          this.syncPointTree_.foreachOnPath(r, function (t, e) {
            var n = vt.relativePath(t, r);
            i = i || e.getCompleteServerCache(n), o = o || e.hasCompleteView();
          });
          var n, s = this.syncPointTree_.get(r);
          (s ? (o = o || s.hasCompleteView(), i = i || s.getCompleteServerCache(vt.Empty)) : (s = new nn, this.syncPointTree_ = this.syncPointTree_.set(r, s)), null != i) ? n = !0 : (n = !1, i = ge.EMPTY_NODE, this.syncPointTree_.subtree(r).foreachChild(function (t, e) {
            var n = e.getCompleteServerCache(vt.Empty);
            n && (i = i.updateImmediateChild(t, n));
          }));
          var a = s.viewExistsForQuery(t);
          if (!a && !t.getQueryParams().loadsAllData()) {
            var h = v.makeQueryKey_(t);
            C(!(h in this.queryToTagMap_), "View does not exist, but we have a tag");
            var u = v.getNextQueryTag_();
            this.queryToTagMap_[h] = u, this.tagToQueryMap_["_" + u] = h;
          }
          var l = this.pendingWriteTree_.childWrites(r), c = s.addEventRegistration(t, e, l, i, n);
          if (!a && !o) {
            var p = s.viewForQuery(t);
            c = c.concat(this.setupListener_(t, p));
          }
          return c
        }, v.prototype.removeEventRegistration = function (t, e, n) {
          var r = this, i = t.path, o = this.syncPointTree_.get(i), s = [];
          if (o && ("default" === t.queryIdentifier() || o.viewExistsForQuery(t))) {
            var a = o.removeEventRegistration(t, e, n);
            o.isEmpty() && (this.syncPointTree_ = this.syncPointTree_.remove(i));
            var h = a.removed;
            s = a.events;
            var u = -1 !== h.findIndex(function (t) {
              return t.getQueryParams().loadsAllData()
            }), l = this.syncPointTree_.findOnPath(i, function (t, e) {
              return e.hasCompleteView()
            });
            if (u && !l) {
              var c = this.syncPointTree_.subtree(i);
              if (!c.isEmpty()) for (var p = this.collectDistinctViewsForSubTree_(c), d = 0; d < p.length; ++d) {
                var f = p[d], _ = f.getQuery(), y = this.createListenerForView_(f);
                this.listenProvider_.startListening(v.queryForListening_(_), this.tagForQuery_(_), y.hashFn, y.onComplete);
              }
            }
            if (!l && 0 < h.length && !n) if (u) {
              this.listenProvider_.stopListening(v.queryForListening_(t), null);
            } else h.forEach(function (t) {
              var e = r.queryToTagMap_[v.makeQueryKey_(t)];
              r.listenProvider_.stopListening(v.queryForListening_(t), e);
            });
            this.removeTags_(h);
          }
          return s
        }, v.prototype.calcCompleteEventCache = function (i, t) {
          var e = this.pendingWriteTree_, n = this.syncPointTree_.findOnPath(i, function (t, e) {
            var n = vt.relativePath(t, i), r = e.getCompleteServerCache(n);
            if (r) return r
          });
          return e.calcCompleteEventCache(i, n, t, !0)
        }, v.prototype.collectDistinctViewsForSubTree_ = function (t) {
          return t.fold(function (t, e, n) {
            if (e && e.hasCompleteView()) return [e.getCompleteView()];
            var r = [];
            return e && (r = e.getQueryViews()), w(n, function (t, e) {
              r = r.concat(e);
            }), r
          })
        }, v.prototype.removeTags_ = function (t) {
          for (var e = 0; e < t.length; ++e) {
            var n = t[e];
            if (!n.getQueryParams().loadsAllData()) {
              var r = v.makeQueryKey_(n), i = this.queryToTagMap_[r];
              delete this.queryToTagMap_[r], delete this.tagToQueryMap_["_" + i];
            }
          }
        }, v.queryForListening_ = function (t) {
          return t.getQueryParams().loadsAllData() && !t.getQueryParams().isDefault() ? t.getRef() : t
        }, v.prototype.setupListener_ = function (t, e) {
          var n = t.path, r = this.tagForQuery_(t), i = this.createListenerForView_(e),
            o = this.listenProvider_.startListening(v.queryForListening_(t), r, i.hashFn, i.onComplete),
            s = this.syncPointTree_.subtree(n);
          if (r) C(!s.value.hasCompleteView(), "If we're adding a query, it shouldn't be shadowed"); else for (var a = s.fold(function (t, e, n) {
            if (!t.isEmpty() && e && e.hasCompleteView()) return [e.getCompleteView().getQuery()];
            var r = [];
            return e && (r = r.concat(e.getQueryViews().map(function (t) {
              return t.getQuery()
            }))), w(n, function (t, e) {
              r = r.concat(e);
            }), r
          }), h = 0; h < a.length; ++h) {
            var u = a[h];
            this.listenProvider_.stopListening(v.queryForListening_(u), this.tagForQuery_(u));
          }
          return o
        }, v.prototype.createListenerForView_ = function (t) {
          var n = this, r = t.getQuery(), i = this.tagForQuery_(r);
          return {
            hashFn: function () {
              return (t.getServerCache() || ge.EMPTY_NODE).hash()
            }, onComplete: function (t) {
              if ("ok" === t) return i ? n.applyTaggedListenComplete(r.path, i) : n.applyListenComplete(r.path);
              var e = function (t, e) {
                var n = "Unknown Error";
                "too_big" === t ? n = "The data requested exceeds the maximum size that can be accessed with a single request." : "permission_denied" == t ? n = "Client doesn't have permission to access the desired data." : "unavailable" == t && (n = "The service is unavailable");
                var r = new Error(t + " at " + e.path.toString() + ": " + n);
                return r.code = t.toUpperCase(), r
              }(t, r);
              return n.removeEventRegistration(r, null, e)
            }
          }
        }, v.makeQueryKey_ = function (t) {
          return t.path.toString() + "$" + t.queryIdentifier()
        }, v.parseQueryKey_ = function (t) {
          var e = t.indexOf("$");
          return C(-1 !== e && e < t.length - 1, "Bad queryKey."), {
            queryId: t.substr(e + 1),
            path: new vt(t.substr(0, e))
          }
        }, v.prototype.queryKeyForTag_ = function (t) {
          return this.tagToQueryMap_["_" + t]
        }, v.prototype.tagForQuery_ = function (t) {
          var e = v.makeQueryKey_(t);
          return m(this.queryToTagMap_, e)
        }, v.getNextQueryTag_ = function () {
          return v.nextQueryTag_++
        }, v.prototype.applyTaggedOperation_ = function (t, e) {
          var n = this.syncPointTree_.get(t);
          C(n, "Missing sync point for query tag that we're tracking");
          var r = this.pendingWriteTree_.childWrites(t);
          return n.applyOperation(e, r, null)
        }, v.prototype.applyOperationToSyncPoints_ = function (t) {
          return this.applyOperationHelper_(t, this.syncPointTree_, null, this.pendingWriteTree_.childWrites(vt.Empty))
        }, v.prototype.applyOperationHelper_ = function (t, e, n, r) {
          if (t.path.isEmpty()) return this.applyOperationDescendantsHelper_(t, e, n, r);
          var i = e.get(vt.Empty);
          null == n && null != i && (n = i.getCompleteServerCache(vt.Empty));
          var o = [], s = t.path.getFront(), a = t.operationForChild(s), h = e.children.get(s);
          if (h && a) {
            var u = n ? n.getImmediateChild(s) : null, l = r.child(s);
            o = o.concat(this.applyOperationHelper_(a, h, u, l));
          }
          return i && (o = o.concat(i.applyOperation(t, r, n))), o
        }, v.prototype.applyOperationDescendantsHelper_ = function (o, t, s, a) {
          var h = this, e = t.get(vt.Empty);
          null == s && null != e && (s = e.getCompleteServerCache(vt.Empty));
          var u = [];
          return t.children.inorderTraversal(function (t, e) {
            var n = s ? s.getImmediateChild(t) : null, r = a.child(t), i = o.operationForChild(t);
            i && (u = u.concat(h.applyOperationDescendantsHelper_(i, e, n, r)));
          }), e && (u = u.concat(e.applyOperation(o, a, s))), u
        }, v.nextQueryTag_ = 1, v
      }(), hn = function () {
        function t() {
          this.rootNode_ = ge.EMPTY_NODE;
        }

        return t.prototype.getNode = function (t) {
          return this.rootNode_.getChild(t)
        }, t.prototype.updateSnapshot = function (t, e) {
          this.rootNode_ = this.rootNode_.updateChild(t, e);
        }, t
      }(), un = function () {
        function t(t) {
          this.app_ = t;
        }

        return t.prototype.getToken = function (t) {
          return this.app_.INTERNAL.getToken(t).then(null, function (t) {
            return t && "auth/token-not-initialized" === t.code ? (J("Got auth/token-not-initialized error.  Treating as null token."), null) : Promise.reject(t)
          })
        }, t.prototype.addTokenChangeListener = function (t) {
          this.app_.INTERNAL.addAuthTokenListener(t);
        }, t.prototype.removeTokenChangeListener = function (t) {
          this.app_.INTERNAL.removeAuthTokenListener(t);
        }, t.prototype.notifyForInvalidToken = function () {
          var t = 'Provided authentication credentials for the app named "' + this.app_.name + '" are invalid. This usually indicates your app was not initialized correctly. ';
          "credential" in this.app_.options ? t += 'Make sure the "credential" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.' : "serviceAccount" in this.app_.options ? t += 'Make sure the "serviceAccount" property provided to initializeApp() is authorized to access the specified "databaseURL" and is from the correct project.' : t += 'Make sure the "apiKey" and "databaseURL" properties provided to initializeApp() match the values provided for your app at https://console.firebase.google.com/.', nt(t);
        }, t
      }(), ln = function () {
        function t() {
          this.counters_ = {};
        }

        return t.prototype.incrementCounter = function (t, e) {
          void 0 === e && (e = 1), E(this.counters_, t) || (this.counters_[t] = 0), this.counters_[t] += e;
        }, t.prototype.get = function () {
          return i(this.counters_)
        }, t
      }(), cn = function () {
        function t() {
        }

        return t.getCollection = function (t) {
          var e = t.toString();
          return this.collections_[e] || (this.collections_[e] = new ln), this.collections_[e]
        }, t.getOrCreateReporter = function (t, e) {
          var n = t.toString();
          return this.reporters_[n] || (this.reporters_[n] = e()), this.reporters_[n]
        }, t.collections_ = {}, t.reporters_ = {}, t
      }(), pn = function () {
        function t(t) {
          this.collection_ = t, this.last_ = null;
        }

        return t.prototype.get = function () {
          var t = this.collection_.get(), n = b(t);
          return this.last_ && w(this.last_, function (t, e) {
            n[t] = n[t] - e;
          }), this.last_ = t, n
        }, t
      }(), dn = function () {
        function t(t, e) {
          this.server_ = e, this.statsToReport_ = {}, this.statsListener_ = new pn(t);
          var n = 1e4 + 2e4 * Math.random();
          yt(this.reportStats_.bind(this), Math.floor(n));
        }

        return t.prototype.includeStat = function (t) {
          this.statsToReport_[t] = !0;
        }, t.prototype.reportStats_ = function () {
          var n = this, t = this.statsListener_.get(), r = {}, i = !1;
          w(t, function (t, e) {
            0 < e && E(n.statsToReport_, t) && (r[t] = e, i = !0);
          }), i && this.server_.reportStats(r), yt(this.reportStats_.bind(this), Math.floor(2 * Math.random() * 3e5));
        }, t
      }(), fn = function () {
        function t() {
          this.eventLists_ = [], this.recursionDepth_ = 0;
        }

        return t.prototype.queueEvents = function (t) {
          for (var e = null, n = 0; n < t.length; n++) {
            var r = t[n], i = r.getPath();
            null === e || i.equals(e.getPath()) || (this.eventLists_.push(e), e = null), null === e && (e = new _n(i)), e.add(r);
          }
          e && this.eventLists_.push(e);
        }, t.prototype.raiseEventsAtPath = function (e, t) {
          this.queueEvents(t), this.raiseQueuedEventsMatchingPredicate_(function (t) {
            return t.equals(e)
          });
        }, t.prototype.raiseEventsForChangedPath = function (e, t) {
          this.queueEvents(t), this.raiseQueuedEventsMatchingPredicate_(function (t) {
            return t.contains(e) || e.contains(t)
          });
        }, t.prototype.raiseQueuedEventsMatchingPredicate_ = function (t) {
          this.recursionDepth_++;
          for (var e = !0, n = 0; n < this.eventLists_.length; n++) {
            var r = this.eventLists_[n];
            if (r) t(r.getPath()) ? (this.eventLists_[n].raise(), this.eventLists_[n] = null) : e = !1;
          }
          e && (this.eventLists_ = []), this.recursionDepth_--;
        }, t
      }(), _n = function () {
        function t(t) {
          this.path_ = t, this.events_ = [];
        }

        return t.prototype.add = function (t) {
          this.events_.push(t);
        }, t.prototype.raise = function () {
          for (var t = 0; t < this.events_.length; t++) {
            var e = this.events_[t];
            if (null !== e) {
              this.events_[t] = null;
              var n = e.getEventRunner();
              G && J("event: " + e.toString()), _t(n);
            }
          }
        }, t.prototype.getPath = function () {
          return this.path_
        }, t
      }(), yn = function () {
        function t(t) {
          this.allowedEvents_ = t, this.listeners_ = {}, C(Array.isArray(t) && 0 < t.length, "Requires a non-empty array");
        }

        return t.prototype.trigger = function (t) {
          for (var e = [], n = 1; n < arguments.length; n++) e[n - 1] = arguments[n];
          if (Array.isArray(this.listeners_[t])) for (var r = this.listeners_[t].slice(), i = 0; i < r.length; i++) r[i].callback.apply(r[i].context, e);
        }, t.prototype.on = function (t, e, n) {
          this.validateEventType_(t), this.listeners_[t] = this.listeners_[t] || [], this.listeners_[t].push({
            callback: e,
            context: n
          });
          var r = this.getInitialEvent(t);
          r && e.apply(n, r);
        }, t.prototype.off = function (t, e, n) {
          this.validateEventType_(t);
          for (var r = this.listeners_[t] || [], i = 0; i < r.length; i++) if (r[i].callback === e && (!n || n === r[i].context)) return void r.splice(i, 1)
        }, t.prototype.validateEventType_ = function (e) {
          C(this.allowedEvents_.find(function (t) {
            return t === e
          }), "Unknown event: " + e);
        }, t
      }(), vn = function (r) {
        function t() {
          var e, t, n = r.call(this, ["visible"]) || this;
          return "undefined" != typeof document && void 0 !== document.addEventListener && (void 0 !== document.hidden ? (t = "visibilitychange", e = "hidden") : void 0 !== document.mozHidden ? (t = "mozvisibilitychange", e = "mozHidden") : void 0 !== document.msHidden ? (t = "msvisibilitychange", e = "msHidden") : void 0 !== document.webkitHidden && (t = "webkitvisibilitychange", e = "webkitHidden")), n.visible_ = !0, t && document.addEventListener(t, function () {
            var t = !document[e];
            t !== n.visible_ && (n.visible_ = t, n.trigger("visible", t));
          }, !1), n
        }

        return s(t, r), t.getInstance = function () {
          return new t
        }, t.prototype.getInitialEvent = function (t) {
          return C("visible" === t, "Unknown event type: " + t), [this.visible_]
        }, t
      }(yn), gn = function (e) {
        function t() {
          var t = e.call(this, ["online"]) || this;
          return t.online_ = !0, "undefined" == typeof window || void 0 === window.addEventListener || o() || (window.addEventListener("online", function () {
            t.online_ || (t.online_ = !0, t.trigger("online", !0));
          }, !1), window.addEventListener("offline", function () {
            t.online_ && (t.online_ = !1, t.trigger("online", !1));
          }, !1)), t
        }

        return s(t, e), t.getInstance = function () {
          return new t
        }, t.prototype.getInitialEvent = function (t) {
          return C("online" === t, "Unknown event type: " + t), [this.online_]
        }, t.prototype.currentlyOnline = function () {
          return this.online_
        }, t
      }(yn), mn = function () {
        function t(t) {
          this.onMessage_ = t, this.pendingResponses = [], this.currentResponseNum = 0, this.closeAfterResponse = -1, this.onClose = null;
        }

        return t.prototype.closeAfter = function (t, e) {
          this.closeAfterResponse = t, this.onClose = e, this.closeAfterResponse < this.currentResponseNum && (this.onClose(), this.onClose = null);
        }, t.prototype.handleResponse = function (t, e) {
          var r = this;
          this.pendingResponses[t] = e;
          for (var n = function () {
            var e = i.pendingResponses[i.currentResponseNum];
            delete i.pendingResponses[i.currentResponseNum];
            for (var t = function (t) {
              e[t] && _t(function () {
                r.onMessage_(e[t]);
              });
            }, n = 0; n < e.length; ++n) t(n);
            if (i.currentResponseNum === i.closeAfterResponse) return i.onClose && (i.onClose(), i.onClose = null), "break";
            i.currentResponseNum++;
          }, i = this; this.pendingResponses[this.currentResponseNum];) {
            if ("break" === n()) break
          }
        }, t
      }(), Cn = function () {
        function t(t, e, n, r) {
          this.connId = t, this.repoInfo = e, this.transportSessionId = n, this.lastSessionId = r, this.bytesSent = 0, this.bytesReceived = 0, this.everConnected_ = !1, this.log_ = Z(t), this.stats_ = cn.getCollection(e), this.urlFn = function (t) {
            return e.connectionURL(Et, t)
          };
        }

        return t.prototype.open = function (t, e) {
          var o = this;
          this.curSegmentNum = 0, this.onDisconnect_ = e, this.myPacketOrderer = new mn(t), this.isClosed_ = !1, this.connectTimeoutTimer_ = setTimeout(function () {
            o.log_("Timed out trying to connect."), o.onClosed_(), o.connectTimeoutTimer_ = null;
          }, Math.floor(3e4)), function (t) {
            if ("complete" === document.readyState) t(); else {
              var e = !1, n = function () {
                document.body ? e || (e = !0, t()) : setTimeout(n, Math.floor(10));
              };
              document.addEventListener ? (document.addEventListener("DOMContentLoaded", n, !1), window.addEventListener("load", n, !1)) : document.attachEvent && (document.attachEvent("onreadystatechange", function () {
                "complete" === document.readyState && n();
              }), window.attachEvent("onload", n));
            }
          }(function () {
            if (!o.isClosed_) {
              o.scriptTagHolder = new En(function () {
                for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                var n = t[0], r = t[1], i = t[2];
                if (o.incrementIncomingBytes_(t), o.scriptTagHolder) if (o.connectTimeoutTimer_ && (clearTimeout(o.connectTimeoutTimer_), o.connectTimeoutTimer_ = null), o.everConnected_ = !0, "start" == n) o.id = r, o.password = i; else {
                  if ("close" !== n) throw new Error("Unrecognized command received: " + n);
                  r ? (o.scriptTagHolder.sendNewPolls = !1, o.myPacketOrderer.closeAfter(r, function () {
                    o.onClosed_();
                  })) : o.onClosed_();
                }
              }, function () {
                for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
                var n = t[0], r = t[1];
                o.incrementIncomingBytes_(t), o.myPacketOrderer.handleResponse(n, r);
              }, function () {
                o.onClosed_();
              }, o.urlFn);
              var t = {start: "t"};
              t.ser = Math.floor(1e8 * Math.random()), o.scriptTagHolder.uniqueCallbackIdentifier && (t.cb = o.scriptTagHolder.uniqueCallbackIdentifier), t.v = "5", o.transportSessionId && (t.s = o.transportSessionId), o.lastSessionId && (t.ls = o.lastSessionId), "undefined" != typeof location && location.href && -1 !== location.href.indexOf(mt) && (t.r = "f");
              var e = o.urlFn(t);
              o.log_("Connecting via long-poll to " + e), o.scriptTagHolder.addTag(e, function () {
              });
            }
          });
        }, t.prototype.start = function () {
          this.scriptTagHolder.startLongPoll(this.id, this.password), this.addDisconnectPingFrame(this.id, this.password);
        }, t.forceAllow = function () {
          t.forceAllow_ = !0;
        }, t.forceDisallow = function () {
          t.forceDisallow_ = !0;
        }, t.isAvailable = function () {
          return t.forceAllow_ || !t.forceDisallow_ && "undefined" != typeof document && null != document.createElement && !("object" == typeof window && window.chrome && window.chrome.extension && !/^chrome/.test(window.location.href)) && !("object" == typeof Windows && "object" == typeof Windows.UI) && !c()
        }, t.prototype.markConnectionHealthy = function () {
        }, t.prototype.shutdown_ = function () {
          this.isClosed_ = !0, this.scriptTagHolder && (this.scriptTagHolder.close(), this.scriptTagHolder = null), this.myDisconnFrame && (document.body.removeChild(this.myDisconnFrame), this.myDisconnFrame = null), this.connectTimeoutTimer_ && (clearTimeout(this.connectTimeoutTimer_), this.connectTimeoutTimer_ = null);
        }, t.prototype.onClosed_ = function () {
          this.isClosed_ || (this.log_("Longpoll is closing itself"), this.shutdown_(), this.onDisconnect_ && (this.onDisconnect_(this.everConnected_), this.onDisconnect_ = null));
        }, t.prototype.close = function () {
          this.isClosed_ || (this.log_("Longpoll is being closed."), this.shutdown_());
        }, t.prototype.send = function (t) {
          var e = v(t);
          this.bytesSent += e.length, this.stats_.incrementCounter("bytes_sent", e.length);
          for (var n, r = (n = a(e), h.encodeByteArray(n, !0)), i = lt(r, 1840), o = 0; o < i.length; o++) this.scriptTagHolder.enqueueSegment(this.curSegmentNum, i.length, i[o]), this.curSegmentNum++;
        }, t.prototype.addDisconnectPingFrame = function (t, e) {
          this.myDisconnFrame = document.createElement("iframe");
          var n = {dframe: "t"};
          n.id = t, n.pw = e, this.myDisconnFrame.src = this.urlFn(n), this.myDisconnFrame.style.display = "none", document.body.appendChild(this.myDisconnFrame);
        }, t.prototype.incrementIncomingBytes_ = function (t) {
          var e = v(t).length;
          this.bytesReceived += e, this.stats_.incrementCounter("bytes_received", e);
        }, t
      }(), En = function () {
        function s(t, e, n, r) {
          this.onDisconnect = n, this.urlFn = r, this.outstandingRequests = new xe, this.pendingSegs = [], this.currentSerial = Math.floor(1e8 * Math.random()), this.sendNewPolls = !0, this.uniqueCallbackIdentifier = K(), window["pLPCommand" + this.uniqueCallbackIdentifier] = t, window["pRTLPCB" + this.uniqueCallbackIdentifier] = e, this.myIFrame = s.createIFrame_();
          var i = "";
          this.myIFrame.src && "javascript:" === this.myIFrame.src.substr(0, "javascript:".length) && (i = '<script>document.domain="' + document.domain + '";<\/script>');
          var o = "<html><body>" + i + "</body></html>";
          try {
            this.myIFrame.doc.open(), this.myIFrame.doc.write(o), this.myIFrame.doc.close();
          } catch (t) {
            J("frame writing exception"), t.stack && J(t.stack), J(t);
          }
        }

        return s.createIFrame_ = function () {
          var e = document.createElement("iframe");
          if (e.style.display = "none", !document.body) throw"Document body has not initialized. Wait to initialize Firebase until after the document is ready.";
          document.body.appendChild(e);
          try {
            e.contentWindow.document || J("No IE domain setting required");
          } catch (t) {
            var n = document.domain;
            e.src = "javascript:void((function(){document.open();document.domain='" + n + "';document.close();})())";
          }
          return e.contentDocument ? e.doc = e.contentDocument : e.contentWindow ? e.doc = e.contentWindow.document : e.document && (e.doc = e.document), e
        }, s.prototype.close = function () {
          var t = this;
          this.alive = !1, this.myIFrame && (this.myIFrame.doc.body.innerHTML = "", setTimeout(function () {
            null !== t.myIFrame && (document.body.removeChild(t.myIFrame), t.myIFrame = null);
          }, Math.floor(0)));
          var e = this.onDisconnect;
          e && (this.onDisconnect = null, e());
        }, s.prototype.startLongPoll = function (t, e) {
          for (this.myID = t, this.myPW = e, this.alive = !0; this.newRequest_();) ;
        }, s.prototype.newRequest_ = function () {
          if (this.alive && this.sendNewPolls && this.outstandingRequests.count() < (0 < this.pendingSegs.length ? 2 : 1)) {
            this.currentSerial++;
            var t = {};
            t.id = this.myID, t.pw = this.myPW, t.ser = this.currentSerial;
            for (var e = this.urlFn(t), n = "", r = 0; 0 < this.pendingSegs.length;) {
              if (!(this.pendingSegs[0].d.length + 30 + n.length <= 1870)) break;
              var i = this.pendingSegs.shift();
              n = n + "&seg" + r + "=" + i.seg + "&ts" + r + "=" + i.ts + "&d" + r + "=" + i.d, r++;
            }
            return e += n, this.addLongPollTag_(e, this.currentSerial), !0
          }
          return !1
        }, s.prototype.enqueueSegment = function (t, e, n) {
          this.pendingSegs.push({seg: t, ts: e, d: n}), this.alive && this.newRequest_();
        }, s.prototype.addLongPollTag_ = function (t, e) {
          var n = this;
          this.outstandingRequests.add(e, 1);
          var r = function () {
            n.outstandingRequests.remove(e), n.newRequest_();
          }, i = setTimeout(r, Math.floor(25e3));
          this.addTag(t, function () {
            clearTimeout(i), r();
          });
        }, s.prototype.addTag = function (t, n) {
          var r = this;
          setTimeout(function () {
            try {
              if (!r.sendNewPolls) return;
              var e = r.myIFrame.doc.createElement("script");
              e.type = "text/javascript", e.async = !0, e.src = t, e.onload = e.onreadystatechange = function () {
                var t = e.readyState;
                t && "loaded" !== t && "complete" !== t || (e.onload = e.onreadystatechange = null, e.parentNode && e.parentNode.removeChild(e), n());
              }, e.onerror = function () {
                J("Long-poll script failed to load: " + t), r.sendNewPolls = !1, r.close();
              }, r.myIFrame.doc.body.appendChild(e);
            } catch (t) {
            }
          }, Math.floor(1));
        }, s
      }(), wn = null;
      "undefined" != typeof MozWebSocket ? wn = MozWebSocket : "undefined" != typeof WebSocket && (wn = WebSocket);
      var bn = function () {
        function i(t, e, n, r) {
          this.connId = t, this.keepaliveTimer = null, this.frames = null, this.totalFrames = 0, this.bytesSent = 0, this.bytesReceived = 0, this.log_ = Z(this.connId), this.stats_ = cn.getCollection(e), this.connURL = i.connectionURL_(e, n, r);
        }

        return i.connectionURL_ = function (t, e, n) {
          var r = {v: "5"};
          return "undefined" != typeof location && location.href && -1 !== location.href.indexOf(mt) && (r.r = "f"), e && (r.s = e), n && (r.ls = n), t.connectionURL(Ct, r)
        }, i.prototype.open = function (t, e) {
          var n = this;
          this.onDisconnect = e, this.onMessage = t, this.log_("Websocket connecting to " + this.connURL), this.everConnected_ = !1, H.set("previous_websocket_failure", !0);
          try {
            this.mySock = new wn(this.connURL);
          } catch (t) {
            this.log_("Error instantiating WebSocket.");
            var r = t.message || t.data;
            return r && this.log_(r), void this.onClosed_()
          }
          this.mySock.onopen = function () {
            n.log_("Websocket connected."), n.everConnected_ = !0;
          }, this.mySock.onclose = function () {
            n.log_("Websocket connection was disconnected."), n.mySock = null, n.onClosed_();
          }, this.mySock.onmessage = function (t) {
            n.handleIncomingFrame(t);
          }, this.mySock.onerror = function (t) {
            n.log_("WebSocket error.  Closing connection.");
            var e = t.message || t.data;
            e && n.log_(e), n.onClosed_();
          };
        }, i.prototype.start = function () {
        }, i.forceDisallow = function () {
          i.forceDisallow_ = !0;
        }, i.isAvailable = function () {
          var t = !1;
          if ("undefined" != typeof navigator && navigator.userAgent) {
            var e = navigator.userAgent.match(/Android ([0-9]{0,}\.[0-9]{0,})/);
            e && 1 < e.length && parseFloat(e[1]) < 4.4 && (t = !0);
          }
          return !t && null !== wn && !i.forceDisallow_
        }, i.previouslyFailed = function () {
          return H.isInMemoryStorage || !0 === H.get("previous_websocket_failure")
        }, i.prototype.markConnectionHealthy = function () {
          H.remove("previous_websocket_failure");
        }, i.prototype.appendFrame_ = function (t) {
          if (this.frames.push(t), this.frames.length == this.totalFrames) {
            var e = this.frames.join("");
            this.frames = null;
            var n = y(e);
            this.onMessage(n);
          }
        }, i.prototype.handleNewFrameCount_ = function (t) {
          this.totalFrames = t, this.frames = [];
        }, i.prototype.extractFrameCount_ = function (t) {
          if (C(null === this.frames, "We already have a frame buffer"), t.length <= 6) {
            var e = Number(t);
            if (!isNaN(e)) return this.handleNewFrameCount_(e), null
          }
          return this.handleNewFrameCount_(1), t
        }, i.prototype.handleIncomingFrame = function (t) {
          if (null !== this.mySock) {
            var e = t.data;
            if (this.bytesReceived += e.length, this.stats_.incrementCounter("bytes_received", e.length), this.resetKeepAlive(), null !== this.frames) this.appendFrame_(e); else {
              var n = this.extractFrameCount_(e);
              null !== n && this.appendFrame_(n);
            }
          }
        }, i.prototype.send = function (t) {
          this.resetKeepAlive();
          var e = v(t);
          this.bytesSent += e.length, this.stats_.incrementCounter("bytes_sent", e.length);
          var n = lt(e, 16384);
          1 < n.length && this.sendString_(String(n.length));
          for (var r = 0; r < n.length; r++) this.sendString_(n[r]);
        }, i.prototype.shutdown_ = function () {
          this.isClosed_ = !0, this.keepaliveTimer && (clearInterval(this.keepaliveTimer), this.keepaliveTimer = null), this.mySock && (this.mySock.close(), this.mySock = null);
        }, i.prototype.onClosed_ = function () {
          this.isClosed_ || (this.log_("WebSocket is closing itself"), this.shutdown_(), this.onDisconnect && (this.onDisconnect(this.everConnected_), this.onDisconnect = null));
        }, i.prototype.close = function () {
          this.isClosed_ || (this.log_("WebSocket is being closed"), this.shutdown_());
        }, i.prototype.resetKeepAlive = function () {
          var t = this;
          clearInterval(this.keepaliveTimer), this.keepaliveTimer = setInterval(function () {
            t.mySock && t.sendString_("0"), t.resetKeepAlive();
          }, Math.floor(45e3));
        }, i.prototype.sendString_ = function (t) {
          try {
            this.mySock.send(t);
          } catch (t) {
            this.log_("Exception thrown from WebSocket.send():", t.message || t.data, "Closing connection."), setTimeout(this.onClosed_.bind(this), 0);
          }
        }, i.responsesRequiredToBeHealthy = 2, i.healthyTimeout = 3e4, i
      }(), Sn = function () {
        function i(t) {
          this.initTransports_(t);
        }

        return Object.defineProperty(i, "ALL_TRANSPORTS", {
          get: function () {
            return [Cn, bn]
          }, enumerable: !0, configurable: !0
        }), i.prototype.initTransports_ = function (t) {
          var e = bn && bn.isAvailable(), n = e && !bn.previouslyFailed();
          if (t.webSocketOnly && (e || nt("wss:// URL used, but browser isn't known to support websockets.  Trying anyway."), n = !0), n) this.transports_ = [bn]; else {
            var r = this.transports_ = [];
            ct(i.ALL_TRANSPORTS, function (t, e) {
              e && e.isAvailable() && r.push(e);
            });
          }
        }, i.prototype.initialTransport = function () {
          if (0 < this.transports_.length) return this.transports_[0];
          throw new Error("No transports available")
        }, i.prototype.upgradeTransport = function () {
          return 1 < this.transports_.length ? this.transports_[1] : null
        }, i
      }(), Tn = function () {
        function t(t, e, n, r, i, o, s) {
          this.id = t, this.repoInfo_ = e, this.onMessage_ = n, this.onReady_ = r, this.onDisconnect_ = i, this.onKill_ = o, this.lastSessionId = s, this.connectionCount = 0, this.pendingDataMessages = [], this.state_ = 0, this.log_ = Z("c:" + this.id + ":"), this.transportManager_ = new Sn(e), this.log_("Connection created"), this.start_();
        }

        return t.prototype.start_ = function () {
          var t = this, e = this.transportManager_.initialTransport();
          this.conn_ = new e(this.nextTransportId_(), this.repoInfo_, void 0, this.lastSessionId), this.primaryResponsesRequired_ = e.responsesRequiredToBeHealthy || 0;
          var n = this.connReceiver_(this.conn_), r = this.disconnReceiver_(this.conn_);
          this.tx_ = this.conn_, this.rx_ = this.conn_, this.secondaryConn_ = null, this.isHealthy_ = !1, setTimeout(function () {
            t.conn_ && t.conn_.open(n, r);
          }, Math.floor(0));
          var i = e.healthyTimeout || 0;
          0 < i && (this.healthyTimeout_ = yt(function () {
            t.healthyTimeout_ = null, t.isHealthy_ || (t.conn_ && 102400 < t.conn_.bytesReceived ? (t.log_("Connection exceeded healthy timeout but has received " + t.conn_.bytesReceived + " bytes.  Marking connection healthy."), t.isHealthy_ = !0, t.conn_.markConnectionHealthy()) : t.conn_ && 10240 < t.conn_.bytesSent ? t.log_("Connection exceeded healthy timeout but has sent " + t.conn_.bytesSent + " bytes.  Leaving connection alive.") : (t.log_("Closing unhealthy connection after timeout."), t.close()));
          }, Math.floor(i)));
        }, t.prototype.nextTransportId_ = function () {
          return "c:" + this.id + ":" + this.connectionCount++
        }, t.prototype.disconnReceiver_ = function (e) {
          var n = this;
          return function (t) {
            e === n.conn_ ? n.onConnectionLost_(t) : e === n.secondaryConn_ ? (n.log_("Secondary connection lost."), n.onSecondaryConnectionLost_()) : n.log_("closing an old connection");
          }
        }, t.prototype.connReceiver_ = function (e) {
          var n = this;
          return function (t) {
            2 != n.state_ && (e === n.rx_ ? n.onPrimaryMessageReceived_(t) : e === n.secondaryConn_ ? n.onSecondaryMessageReceived_(t) : n.log_("message on old connection"));
          }
        }, t.prototype.sendRequest = function (t) {
          var e = {t: "d", d: t};
          this.sendData_(e);
        }, t.prototype.tryCleanupConnection = function () {
          this.tx_ === this.secondaryConn_ && this.rx_ === this.secondaryConn_ && (this.log_("cleaning up and promoting a connection: " + this.secondaryConn_.connId), this.conn_ = this.secondaryConn_, this.secondaryConn_ = null);
        }, t.prototype.onSecondaryControl_ = function (t) {
          if ("t" in t) {
            var e = t.t;
            "a" === e ? this.upgradeIfSecondaryHealthy_() : "r" === e ? (this.log_("Got a reset on secondary, closing it"), this.secondaryConn_.close(), this.tx_ !== this.secondaryConn_ && this.rx_ !== this.secondaryConn_ || this.close()) : "o" === e && (this.log_("got pong on secondary."), this.secondaryResponsesRequired_--, this.upgradeIfSecondaryHealthy_());
          }
        }, t.prototype.onSecondaryMessageReceived_ = function (t) {
          var e = ht("t", t), n = ht("d", t);
          if ("c" == e) this.onSecondaryControl_(n); else {
            if ("d" != e) throw new Error("Unknown protocol layer: " + e);
            this.pendingDataMessages.push(n);
          }
        }, t.prototype.upgradeIfSecondaryHealthy_ = function () {
          this.secondaryResponsesRequired_ <= 0 ? (this.log_("Secondary connection is healthy."), this.isHealthy_ = !0, this.secondaryConn_.markConnectionHealthy(), this.proceedWithUpgrade_()) : (this.log_("sending ping on secondary."), this.secondaryConn_.send({
            t: "c",
            d: {t: "p", d: {}}
          }));
        }, t.prototype.proceedWithUpgrade_ = function () {
          this.secondaryConn_.start(), this.log_("sending client ack on secondary"), this.secondaryConn_.send({
            t: "c",
            d: {t: "a", d: {}}
          }), this.log_("Ending transmission on primary"), this.conn_.send({
            t: "c",
            d: {t: "n", d: {}}
          }), this.tx_ = this.secondaryConn_, this.tryCleanupConnection();
        }, t.prototype.onPrimaryMessageReceived_ = function (t) {
          var e = ht("t", t), n = ht("d", t);
          "c" == e ? this.onControl_(n) : "d" == e && this.onDataMessage_(n);
        }, t.prototype.onDataMessage_ = function (t) {
          this.onPrimaryResponse_(), this.onMessage_(t);
        }, t.prototype.onPrimaryResponse_ = function () {
          this.isHealthy_ || (this.primaryResponsesRequired_--, this.primaryResponsesRequired_ <= 0 && (this.log_("Primary connection is healthy."), this.isHealthy_ = !0, this.conn_.markConnectionHealthy()));
        }, t.prototype.onControl_ = function (t) {
          var e = ht("t", t);
          if ("d" in t) {
            var n = t.d;
            if ("h" === e) this.onHandshake_(n); else if ("n" === e) {
              this.log_("recvd end transmission on primary"), this.rx_ = this.secondaryConn_;
              for (var r = 0; r < this.pendingDataMessages.length; ++r) this.onDataMessage_(this.pendingDataMessages[r]);
              this.pendingDataMessages = [], this.tryCleanupConnection();
            } else "s" === e ? this.onConnectionShutdown_(n) : "r" === e ? this.onReset_(n) : "e" === e ? tt("Server Error: " + n) : "o" === e ? (this.log_("got pong on primary."), this.onPrimaryResponse_(), this.sendPingOnPrimaryIfNecessary_()) : tt("Unknown control packet command: " + e);
          }
        }, t.prototype.onHandshake_ = function (t) {
          var e = t.ts, n = t.v, r = t.h;
          this.sessionId = t.s, this.repoInfo_.updateHost(r), 0 == this.state_ && (this.conn_.start(), this.onConnectionEstablished_(this.conn_, e), "5" !== n && nt("Protocol version mismatch detected"), this.tryStartUpgrade_());
        }, t.prototype.tryStartUpgrade_ = function () {
          var t = this.transportManager_.upgradeTransport();
          t && this.startUpgrade_(t);
        }, t.prototype.startUpgrade_ = function (t) {
          var e = this;
          this.secondaryConn_ = new t(this.nextTransportId_(), this.repoInfo_, this.sessionId), this.secondaryResponsesRequired_ = t.responsesRequiredToBeHealthy || 0;
          var n = this.connReceiver_(this.secondaryConn_), r = this.disconnReceiver_(this.secondaryConn_);
          this.secondaryConn_.open(n, r), yt(function () {
            e.secondaryConn_ && (e.log_("Timed out trying to upgrade."), e.secondaryConn_.close());
          }, Math.floor(6e4));
        }, t.prototype.onReset_ = function (t) {
          this.log_("Reset packet received.  New host: " + t), this.repoInfo_.updateHost(t), 1 === this.state_ ? this.close() : (this.closeConnections_(), this.start_());
        }, t.prototype.onConnectionEstablished_ = function (t, e) {
          var n = this;
          this.log_("Realtime connection established."), this.conn_ = t, this.state_ = 1, this.onReady_ && (this.onReady_(e, this.sessionId), this.onReady_ = null), 0 === this.primaryResponsesRequired_ ? (this.log_("Primary connection is healthy."), this.isHealthy_ = !0) : yt(function () {
            n.sendPingOnPrimaryIfNecessary_();
          }, Math.floor(5e3));
        }, t.prototype.sendPingOnPrimaryIfNecessary_ = function () {
          this.isHealthy_ || 1 !== this.state_ || (this.log_("sending ping on primary."), this.sendData_({
            t: "c",
            d: {t: "p", d: {}}
          }));
        }, t.prototype.onSecondaryConnectionLost_ = function () {
          var t = this.secondaryConn_;
          this.secondaryConn_ = null, this.tx_ !== t && this.rx_ !== t || this.close();
        }, t.prototype.onConnectionLost_ = function (t) {
          this.conn_ = null, t || 0 !== this.state_ ? 1 === this.state_ && this.log_("Realtime connection lost.") : (this.log_("Realtime connection failed."), this.repoInfo_.isCacheableHost() && (H.remove("host:" + this.repoInfo_.host), this.repoInfo_.internalHost = this.repoInfo_.host)), this.close();
        }, t.prototype.onConnectionShutdown_ = function (t) {
          this.log_("Connection shutdown command received. Shutting down..."), this.onKill_ && (this.onKill_(t), this.onKill_ = null), this.onDisconnect_ = null, this.close();
        }, t.prototype.sendData_ = function (t) {
          if (1 !== this.state_) throw"Connection is not connected";
          this.tx_.send(t);
        }, t.prototype.close = function () {
          2 !== this.state_ && (this.log_("Closing realtime connection."), this.state_ = 2, this.closeConnections_(), this.onDisconnect_ && (this.onDisconnect_(), this.onDisconnect_ = null));
        }, t.prototype.closeConnections_ = function () {
          this.log_("Shutting down all connections"), this.conn_ && (this.conn_.close(), this.conn_ = null), this.secondaryConn_ && (this.secondaryConn_.close(), this.secondaryConn_ = null), this.healthyTimeout_ && (clearTimeout(this.healthyTimeout_), this.healthyTimeout_ = null);
        }, t
      }(), In = function () {
        function t() {
        }

        return t.prototype.put = function (t, e, n, r) {
        }, t.prototype.merge = function (t, e, n, r) {
        }, t.prototype.refreshAuthToken = function (t) {
        }, t.prototype.onDisconnectPut = function (t, e, n) {
        }, t.prototype.onDisconnectMerge = function (t, e, n) {
        }, t.prototype.onDisconnectCancel = function (t, e) {
        }, t.prototype.reportStats = function (t) {
        }, t
      }(), Nn = function (a) {
        function l(t, e, n, r, i, o) {
          var s = a.call(this) || this;
          if (s.repoInfo_ = t, s.onDataUpdate_ = e, s.onConnectStatus_ = n, s.onServerInfoUpdate_ = r, s.authTokenProvider_ = i, s.authOverride_ = o, s.id = l.nextPersistentConnectionId_++, s.log_ = Z("p:" + s.id + ":"), s.interruptReasons_ = {}, s.listens_ = {}, s.outstandingPuts_ = [], s.outstandingPutCount_ = 0, s.onDisconnectRequestQueue_ = [], s.connected_ = !1, s.reconnectDelay_ = 1e3, s.maxReconnectDelay_ = 3e5, s.securityDebugCallback_ = null, s.lastSessionId = null, s.establishConnectionTimer_ = null, s.visible_ = !1, s.requestCBHash_ = {}, s.requestNumber_ = 0, s.realtime_ = null, s.authToken_ = null, s.forceTokenRefresh_ = !1, s.invalidAuthTokenCount_ = 0, s.firstConnection_ = !0, s.lastConnectionAttemptTime_ = null, s.lastConnectionEstablishedTime_ = null, o && !c()) throw new Error("Auth override specified in options, but not supported on non Node.js platforms");
          return s.scheduleConnect_(0), vn.getInstance().on("visible", s.onVisible_, s), -1 === t.host.indexOf("fblocal") && gn.getInstance().on("online", s.onOnline_, s), s
        }

        return s(l, a), l.prototype.sendRequest = function (t, e, n) {
          var r = ++this.requestNumber_, i = {r: r, a: t, b: e};
          this.log_(v(i)), C(this.connected_, "sendRequest call when we're not connected not allowed."), this.realtime_.sendRequest(i), n && (this.requestCBHash_[r] = n);
        }, l.prototype.listen = function (t, e, n, r) {
          var i = t.queryIdentifier(), o = t.path.toString();
          this.log_("Listen called for " + o + " " + i), this.listens_[o] = this.listens_[o] || {}, C(t.getQueryParams().isDefault() || !t.getQueryParams().loadsAllData(), "listen() called for non-default but complete query"), C(!this.listens_[o][i], "listen() called twice for same path/queryId.");
          var s = {onComplete: r, hashFn: e, query: t, tag: n};
          this.listens_[o][i] = s, this.connected_ && this.sendListen_(s);
        }, l.prototype.sendListen_ = function (r) {
          var i = this, o = r.query, s = o.path.toString(), a = o.queryIdentifier();
          this.log_("Listen on " + s + " for " + a);
          var t = {p: s};
          r.tag && (t.q = o.queryObject(), t.t = r.tag), t.h = r.hashFn(), this.sendRequest("q", t, function (t) {
            var e = t.d, n = t.s;
            l.warnOnListenWarnings_(e, o), (i.listens_[s] && i.listens_[s][a]) === r && (i.log_("listen response", t), "ok" !== n && i.removeListen_(s, a), r.onComplete && r.onComplete(n, e));
          });
        }, l.warnOnListenWarnings_ = function (t, e) {
          if (t && "object" == typeof t && E(t, "w")) {
            var n = m(t, "w");
            if (Array.isArray(n) && ~n.indexOf("no_index")) {
              var r = '".indexOn": "' + e.getQueryParams().getIndex().toString() + '"', i = e.path.toString();
              nt("Using an unspecified index. Your data will be downloaded and filtered on the client. Consider adding " + r + " at " + i + " to your security rules for better performance.");
            }
          }
        }, l.prototype.refreshAuthToken = function (t) {
          this.authToken_ = t, this.log_("Auth token refreshed"), this.authToken_ ? this.tryAuth() : this.connected_ && this.sendRequest("unauth", {}, function () {
          }), this.reduceReconnectDelayIfAdminCredential_(t);
        }, l.prototype.reduceReconnectDelayIfAdminCredential_ = function (t) {
          var e;
          (t && 40 === t.length || "object" == typeof (e = g(t).claims) && !0 === e.admin) && (this.log_("Admin auth credential detected.  Reducing max reconnect time."), this.maxReconnectDelay_ = 3e4);
        }, l.prototype.tryAuth = function () {
          var t, r = this;
          if (this.connected_ && this.authToken_) {
            var i = this.authToken_,
              e = (t = g(i).claims) && "object" == typeof t && t.hasOwnProperty("iat") ? "auth" : "gauth",
              n = {cred: i};
            null === this.authOverride_ ? n.noauth = !0 : "object" == typeof this.authOverride_ && (n.authvar = this.authOverride_), this.sendRequest(e, n, function (t) {
              var e = t.s, n = t.d || "error";
              r.authToken_ === i && ("ok" === e ? r.invalidAuthTokenCount_ = 0 : r.onAuthRevoked_(e, n));
            });
          }
        }, l.prototype.unlisten = function (t, e) {
          var n = t.path.toString(), r = t.queryIdentifier();
          this.log_("Unlisten called for " + n + " " + r), C(t.getQueryParams().isDefault() || !t.getQueryParams().loadsAllData(), "unlisten() called for non-default but complete query"), this.removeListen_(n, r) && this.connected_ && this.sendUnlisten_(n, r, t.queryObject(), e);
        }, l.prototype.sendUnlisten_ = function (t, e, n, r) {
          this.log_("Unlisten on " + t + " for " + e);
          var i = {p: t};
          r && (i.q = n, i.t = r), this.sendRequest("n", i);
        }, l.prototype.onDisconnectPut = function (t, e, n) {
          this.connected_ ? this.sendOnDisconnect_("o", t, e, n) : this.onDisconnectRequestQueue_.push({
            pathString: t,
            action: "o",
            data: e,
            onComplete: n
          });
        }, l.prototype.onDisconnectMerge = function (t, e, n) {
          this.connected_ ? this.sendOnDisconnect_("om", t, e, n) : this.onDisconnectRequestQueue_.push({
            pathString: t,
            action: "om",
            data: e,
            onComplete: n
          });
        }, l.prototype.onDisconnectCancel = function (t, e) {
          this.connected_ ? this.sendOnDisconnect_("oc", t, null, e) : this.onDisconnectRequestQueue_.push({
            pathString: t,
            action: "oc",
            data: null,
            onComplete: e
          });
        }, l.prototype.sendOnDisconnect_ = function (t, e, n, r) {
          var i = {p: e, d: n};
          this.log_("onDisconnect " + t, i), this.sendRequest(t, i, function (t) {
            r && setTimeout(function () {
              r(t.s, t.d);
            }, Math.floor(0));
          });
        }, l.prototype.put = function (t, e, n, r) {
          this.putInternal("p", t, e, n, r);
        }, l.prototype.merge = function (t, e, n, r) {
          this.putInternal("m", t, e, n, r);
        }, l.prototype.putInternal = function (t, e, n, r, i) {
          var o = {p: e, d: n};
          void 0 !== i && (o.h = i), this.outstandingPuts_.push({
            action: t,
            request: o,
            onComplete: r
          }), this.outstandingPutCount_++;
          var s = this.outstandingPuts_.length - 1;
          this.connected_ ? this.sendPut_(s) : this.log_("Buffering put: " + e);
        }, l.prototype.sendPut_ = function (e) {
          var n = this, r = this.outstandingPuts_[e].action, t = this.outstandingPuts_[e].request,
            i = this.outstandingPuts_[e].onComplete;
          this.outstandingPuts_[e].queued = this.connected_, this.sendRequest(r, t, function (t) {
            n.log_(r + " response", t), delete n.outstandingPuts_[e], n.outstandingPutCount_--, 0 === n.outstandingPutCount_ && (n.outstandingPuts_ = []), i && i(t.s, t.d);
          });
        }, l.prototype.reportStats = function (t) {
          var n = this;
          if (this.connected_) {
            var e = {c: t};
            this.log_("reportStats", e), this.sendRequest("s", e, function (t) {
              if ("ok" !== t.s) {
                var e = t.d;
                n.log_("reportStats", "Error sending stats: " + e);
              }
            });
          }
        }, l.prototype.onDataMessage_ = function (t) {
          if ("r" in t) {
            this.log_("from server: " + v(t));
            var e = t.r, n = this.requestCBHash_[e];
            n && (delete this.requestCBHash_[e], n(t.b));
          } else {
            if ("error" in t) throw"A server-side error has occurred: " + t.error;
            "a" in t && this.onDataPush_(t.a, t.b);
          }
        }, l.prototype.onDataPush_ = function (t, e) {
          this.log_("handleServerMessage", t, e), "d" === t ? this.onDataUpdate_(e.p, e.d, !1, e.t) : "m" === t ? this.onDataUpdate_(e.p, e.d, !0, e.t) : "c" === t ? this.onListenRevoked_(e.p, e.q) : "ac" === t ? this.onAuthRevoked_(e.s, e.d) : "sd" === t ? this.onSecurityDebugPacket_(e) : tt("Unrecognized action received from server: " + v(t) + "\nAre you using the latest client?");
        }, l.prototype.onReady_ = function (t, e) {
          this.log_("connection ready"), this.connected_ = !0, this.lastConnectionEstablishedTime_ = (new Date).getTime(), this.handleTimestamp_(t), this.lastSessionId = e, this.firstConnection_ && this.sendConnectStats_(), this.restoreState_(), this.firstConnection_ = !1, this.onConnectStatus_(!0);
        }, l.prototype.scheduleConnect_ = function (t) {
          var e = this;
          C(!this.realtime_, "Scheduling a connect when we're already connected/ing?"), this.establishConnectionTimer_ && clearTimeout(this.establishConnectionTimer_), this.establishConnectionTimer_ = setTimeout(function () {
            e.establishConnectionTimer_ = null, e.establishConnection_();
          }, Math.floor(t));
        }, l.prototype.onVisible_ = function (t) {
          t && !this.visible_ && this.reconnectDelay_ === this.maxReconnectDelay_ && (this.log_("Window became visible.  Reducing delay."), this.reconnectDelay_ = 1e3, this.realtime_ || this.scheduleConnect_(0)), this.visible_ = t;
        }, l.prototype.onOnline_ = function (t) {
          t ? (this.log_("Browser went online."), this.reconnectDelay_ = 1e3, this.realtime_ || this.scheduleConnect_(0)) : (this.log_("Browser went offline.  Killing connection."), this.realtime_ && this.realtime_.close());
        }, l.prototype.onRealtimeDisconnect_ = function () {
          if (this.log_("data client disconnected"), this.connected_ = !1, this.realtime_ = null, this.cancelSentTransactions_(), this.requestCBHash_ = {}, this.shouldReconnect_()) {
            if (this.visible_) {
              if (this.lastConnectionEstablishedTime_) {
                3e4 < (new Date).getTime() - this.lastConnectionEstablishedTime_ && (this.reconnectDelay_ = 1e3), this.lastConnectionEstablishedTime_ = null;
              }
            } else this.log_("Window isn't visible.  Delaying reconnect."), this.reconnectDelay_ = this.maxReconnectDelay_, this.lastConnectionAttemptTime_ = (new Date).getTime();
            var t = (new Date).getTime() - this.lastConnectionAttemptTime_, e = Math.max(0, this.reconnectDelay_ - t);
            e = Math.random() * e, this.log_("Trying to reconnect in " + e + "ms"), this.scheduleConnect_(e), this.reconnectDelay_ = Math.min(this.maxReconnectDelay_, 1.3 * this.reconnectDelay_);
          }
          this.onConnectStatus_(!1);
        }, l.prototype.establishConnection_ = function () {
          if (this.shouldReconnect_()) {
            this.log_("Making a connection attempt"), this.lastConnectionAttemptTime_ = (new Date).getTime(), this.lastConnectionEstablishedTime_ = null;
            var e = this.onDataMessage_.bind(this), n = this.onReady_.bind(this),
              r = this.onRealtimeDisconnect_.bind(this), i = this.id + ":" + l.nextConnectionId_++, o = this,
              s = this.lastSessionId, a = !1, h = null, u = function () {
                h ? h.close() : (a = !0, r());
              };
            this.realtime_ = {
              close: u, sendRequest: function (t) {
                C(h, "sendRequest call when we're not connected not allowed."), h.sendRequest(t);
              }
            };
            var t = this.forceTokenRefresh_;
            this.forceTokenRefresh_ = !1, this.authTokenProvider_.getToken(t).then(function (t) {
              a ? J("getToken() completed but was canceled") : (J("getToken() completed. Creating connection."), o.authToken_ = t && t.accessToken, h = new Tn(i, o.repoInfo_, e, n, r, function (t) {
                nt(t + " (" + o.repoInfo_.toString() + ")"), o.interrupt("server_kill");
              }, s));
            }).then(null, function (t) {
              o.log_("Failed to get token: " + t), a || u();
            });
          }
        }, l.prototype.interrupt = function (t) {
          J("Interrupting connection for reason: " + t), this.interruptReasons_[t] = !0, this.realtime_ ? this.realtime_.close() : (this.establishConnectionTimer_ && (clearTimeout(this.establishConnectionTimer_), this.establishConnectionTimer_ = null), this.connected_ && this.onRealtimeDisconnect_());
        }, l.prototype.resume = function (t) {
          J("Resuming connection for reason: " + t), delete this.interruptReasons_[t], S(this.interruptReasons_) && (this.reconnectDelay_ = 1e3, this.realtime_ || this.scheduleConnect_(0));
        }, l.prototype.handleTimestamp_ = function (t) {
          var e = t - (new Date).getTime();
          this.onServerInfoUpdate_({serverTimeOffset: e});
        }, l.prototype.cancelSentTransactions_ = function () {
          for (var t = 0; t < this.outstandingPuts_.length; t++) {
            var e = this.outstandingPuts_[t];
            e && "h" in e.request && e.queued && (e.onComplete && e.onComplete("disconnect"), delete this.outstandingPuts_[t], this.outstandingPutCount_--);
          }
          0 === this.outstandingPutCount_ && (this.outstandingPuts_ = []);
        }, l.prototype.onListenRevoked_ = function (t, e) {
          var n;
          n = e ? e.map(function (t) {
            return ut(t)
          }).join("$") : "default";
          var r = this.removeListen_(t, n);
          r && r.onComplete && r.onComplete("permission_denied");
        }, l.prototype.removeListen_ = function (t, e) {
          var n, r = new vt(t).toString();
          return void 0 !== this.listens_[r] ? (n = this.listens_[r][e], delete this.listens_[r][e], 0 === T(this.listens_[r]) && delete this.listens_[r]) : n = void 0, n
        }, l.prototype.onAuthRevoked_ = function (t, e) {
          J("Auth token revoked: " + t + "/" + e), this.authToken_ = null, this.forceTokenRefresh_ = !0, this.realtime_.close(), "invalid_token" !== t && "permission_denied" !== t || (this.invalidAuthTokenCount_++, 3 <= this.invalidAuthTokenCount_ && (this.reconnectDelay_ = 3e4, this.authTokenProvider_.notifyForInvalidToken()));
        }, l.prototype.onSecurityDebugPacket_ = function (t) {
          this.securityDebugCallback_ ? this.securityDebugCallback_(t) : "msg" in t && console.log("FIREBASE: " + t.msg.replace("\n", "\nFIREBASE: "));
        }, l.prototype.restoreState_ = function () {
          var n = this;
          this.tryAuth(), w(this.listens_, function (t, e) {
            w(e, function (t, e) {
              n.sendListen_(e);
            });
          });
          for (var t = 0; t < this.outstandingPuts_.length; t++) this.outstandingPuts_[t] && this.sendPut_(t);
          for (; this.onDisconnectRequestQueue_.length;) {
            var e = this.onDisconnectRequestQueue_.shift();
            this.sendOnDisconnect_(e.action, e.pathString, e.data, e.onComplete);
          }
        }, l.prototype.sendConnectStats_ = function () {
          var t = {};
          t["sdk.js." + Xn.SDK_VERSION.replace(/\./g, "-")] = 1, o() ? t["framework.cordova"] = 1 : "object" == typeof navigator && "ReactNative" === navigator.product && (t["framework.reactnative"] = 1), this.reportStats(t);
        }, l.prototype.shouldReconnect_ = function () {
          var t = gn.getInstance().currentlyOnline();
          return S(this.interruptReasons_) && t
        }, l.nextPersistentConnectionId_ = 0, l.nextConnectionId_ = 0, l
      }(In), Rn = function (i) {
        function u(t, e, n) {
          var r = i.call(this) || this;
          return r.repoInfo_ = t, r.onDataUpdate_ = e, r.authTokenProvider_ = n, r.log_ = Z("p:rest:"), r.listens_ = {}, r
        }

        return s(u, i), u.prototype.reportStats = function (t) {
          throw new Error("Method not implemented.")
        }, u.getListenId_ = function (t, e) {
          return void 0 !== e ? "tag$" + e : (C(t.getQueryParams().isDefault(), "should have a tag if it's not a default query."), t.path.toString())
        }, u.prototype.listen = function (t, e, r, i) {
          var o = this, s = t.path.toString();
          this.log_("Listen called for " + s + " " + t.queryIdentifier());
          var a = u.getListenId_(t, r), h = {};
          this.listens_[a] = h;
          var n = t.getQueryParams().toRestQueryStringParameters();
          this.restRequest_(s + ".json", n, function (t, e) {
            var n = e;
            (404 === t && (t = n = null), null === t && o.onDataUpdate_(s, n, !1, r), m(o.listens_, a) === h) && i(t ? 401 == t ? "permission_denied" : "rest_error:" + t : "ok", null);
          });
        }, u.prototype.unlisten = function (t, e) {
          var n = u.getListenId_(t, e);
          delete this.listens_[n];
        }, u.prototype.refreshAuthToken = function (t) {
        }, u.prototype.restRequest_ = function (o, s, a) {
          var h = this;
          void 0 === s && (s = {}), s.format = "export", this.authTokenProvider_.getToken(!1).then(function (t) {
            var e = t && t.accessToken;
            e && (s.auth = e);
            var n,
              r = (h.repoInfo_.secure ? "https://" : "http://") + h.repoInfo_.host + o + "?ns=" + h.repoInfo_.namespace + (n = [], w(s, function (e, t) {
                Array.isArray(t) ? t.forEach(function (t) {
                  n.push(encodeURIComponent(e) + "=" + encodeURIComponent(t));
                }) : n.push(encodeURIComponent(e) + "=" + encodeURIComponent(t));
              }), n.length ? "&" + n.join("&") : "");
            h.log_("Sending REST request for " + r);
            var i = new XMLHttpRequest;
            i.onreadystatechange = function () {
              if (a && 4 === i.readyState) {
                h.log_("REST Response for " + r + " received. status:", i.status, "response:", i.responseText);
                var t = null;
                if (200 <= i.status && i.status < 300) {
                  try {
                    t = y(i.responseText);
                  } catch (t) {
                    nt("Failed to parse JSON response for " + r + ": " + i.responseText);
                  }
                  a(null, t);
                } else 401 !== i.status && 404 !== i.status && nt("Got unsuccessful REST response for " + r + " Status: " + i.status), a(i.status);
                a = null;
              }
            }, i.open("GET", r, !0), i.send();
          });
        }, u
      }(In), Pn = "repo_interrupt", Dn = function () {
        function t(t, e, n) {
          var s = this;
          this.repoInfo_ = t, this.app = n, this.dataUpdateCount = 0, this.statsListener_ = null, this.eventQueue_ = new fn, this.nextWriteId_ = 1, this.interceptServerDataCallback_ = null, this.onDisconnect_ = new Fe, this.persistentConnection_ = null;
          var r = new un(n);
          if (this.stats_ = cn.getCollection(t), e || 0 <= ("object" == typeof window && window.navigator && window.navigator.userAgent || "").search(/googlebot|google webmaster tools|bingbot|yahoo! slurp|baiduspider|yandexbot|duckduckbot/i)) this.server_ = new Rn(this.repoInfo_, this.onDataUpdate_.bind(this), r), setTimeout(this.onConnectStatus_.bind(this, !0), 0); else {
            var i = n.options.databaseAuthVariableOverride;
            if (null != i) {
              if ("object" != typeof i) throw new Error("Only objects are supported for option databaseAuthVariableOverride");
              try {
                v(i);
              } catch (t) {
                throw new Error("Invalid authOverride provided: " + t)
              }
            }
            this.persistentConnection_ = new Nn(this.repoInfo_, this.onDataUpdate_.bind(this), this.onConnectStatus_.bind(this), this.onServerInfoUpdate_.bind(this), r, i), this.server_ = this.persistentConnection_;
          }
          r.addTokenChangeListener(function (t) {
            s.server_.refreshAuthToken(t);
          }), this.statsReporter_ = cn.getOrCreateReporter(t, function () {
            return new dn(s.stats_, s.server_)
          }), this.transactions_init_(), this.infoData_ = new hn, this.infoSyncTree_ = new an({
            startListening: function (t, e, n, r) {
              var i = [], o = s.infoData_.getNode(t.path);
              return o.isEmpty() || (i = s.infoSyncTree_.applyServerOverwrite(t.path, o), setTimeout(function () {
                r("ok");
              }, 0)), i
            }, stopListening: function () {
            }
          }), this.updateInfo_("connected", !1), this.serverSyncTree_ = new an({
            startListening: function (r, t, e, i) {
              return s.server_.listen(r, e, t, function (t, e) {
                var n = i(t, e);
                s.eventQueue_.raiseEventsForChangedPath(r.path, n);
              }), []
            }, stopListening: function (t, e) {
              s.server_.unlisten(t, e);
            }
          });
        }

        return t.prototype.toString = function () {
          return (this.repoInfo_.secure ? "https://" : "http://") + this.repoInfo_.host
        }, t.prototype.name = function () {
          return this.repoInfo_.namespace
        }, t.prototype.serverTime = function () {
          var t = this.infoData_.getNode(new vt(".info/serverTimeOffset")).val() || 0;
          return (new Date).getTime() + t
        }, t.prototype.generateServerValues = function () {
          return (t = (t = {timestamp: this.serverTime()}) || {}).timestamp = t.timestamp || (new Date).getTime(), t;
          var t;
        }, t.prototype.onDataUpdate_ = function (t, e, n, r) {
          this.dataUpdateCount++;
          var i = new vt(t);
          e = this.interceptServerDataCallback_ ? this.interceptServerDataCallback_(t, e) : e;
          var o = [];
          if (r) if (n) {
            var s = I(e, function (t) {
              return Ee(t)
            });
            o = this.serverSyncTree_.applyTaggedQueryMerge(i, s, r);
          } else {
            var a = Ee(e);
            o = this.serverSyncTree_.applyTaggedQueryOverwrite(i, a, r);
          } else if (n) {
            var h = I(e, function (t) {
              return Ee(t)
            });
            o = this.serverSyncTree_.applyServerMerge(i, h);
          } else {
            var u = Ee(e);
            o = this.serverSyncTree_.applyServerOverwrite(i, u);
          }
          var l = i;
          0 < o.length && (l = this.rerunTransactions_(i)), this.eventQueue_.raiseEventsForChangedPath(l, o);
        }, t.prototype.interceptServerData_ = function (t) {
          this.interceptServerDataCallback_ = t;
        }, t.prototype.onConnectStatus_ = function (t) {
          this.updateInfo_("connected", t), !1 === t && this.runOnDisconnectEvents_();
        }, t.prototype.onServerInfoUpdate_ = function (t) {
          var n = this;
          ct(t, function (t, e) {
            n.updateInfo_(e, t);
          });
        }, t.prototype.updateInfo_ = function (t, e) {
          var n = new vt("/.info/" + t), r = Ee(e);
          this.infoData_.updateSnapshot(n, r);
          var i = this.infoSyncTree_.applyServerOverwrite(n, r);
          this.eventQueue_.raiseEventsForChangedPath(n, i);
        }, t.prototype.getNextWriteId_ = function () {
          return this.nextWriteId_++
        }, t.prototype.setWithPriority = function (i, t, e, o) {
          var s = this;
          this.log_("set", {path: i.toString(), value: t, priority: e});
          var n = this.generateServerValues(), r = Ee(t, e), a = Le(r, n), h = this.getNextWriteId_(),
            u = this.serverSyncTree_.applyUserOverwrite(i, a, h, !0);
          this.eventQueue_.queueEvents(u), this.server_.put(i.toString(), r.val(!0), function (t, e) {
            var n = "ok" === t;
            n || nt("set at " + i + " failed: " + t);
            var r = s.serverSyncTree_.ackUserWrite(h, !n);
            s.eventQueue_.raiseEventsForChangedPath(i, r), s.callOnCompleteCallback(o, t, e);
          });
          var l = this.abortTransactions_(i);
          this.rerunTransactions_(l), this.eventQueue_.raiseEventsForChangedPath(l, []);
        }, t.prototype.update = function (o, t, s) {
          var a = this;
          this.log_("update", {path: o.toString(), value: t});
          var r = !0, i = this.generateServerValues(), h = {};
          if (w(t, function (t, e) {
            r = !1;
            var n = Ee(e);
            h[t] = Le(n, i);
          }), r) J("update() called with empty data.  Don't do anything."), this.callOnCompleteCallback(s, "ok"); else {
            var u = this.getNextWriteId_(), e = this.serverSyncTree_.applyUserMerge(o, h, u);
            this.eventQueue_.queueEvents(e), this.server_.merge(o.toString(), t, function (t, e) {
              var n = "ok" === t;
              n || nt("update at " + o + " failed: " + t);
              var r = a.serverSyncTree_.ackUserWrite(u, !n), i = 0 < r.length ? a.rerunTransactions_(o) : o;
              a.eventQueue_.raiseEventsForChangedPath(i, r), a.callOnCompleteCallback(s, t, e);
            }), w(t, function (t) {
              var e = a.abortTransactions_(o.child(t));
              a.rerunTransactions_(e);
            }), this.eventQueue_.raiseEventsForChangedPath(o, []);
          }
        }, t.prototype.runOnDisconnectEvents_ = function () {
          var r = this;
          this.log_("onDisconnectEvents");
          var t, n, i, e = this.generateServerValues(),
            o = (t = this.onDisconnect_, n = e, i = new Fe, t.forEachTree(new vt(""), function (t, e) {
              i.remember(t, Le(e, n));
            }), i), s = [];
          o.forEachTree(vt.Empty, function (t, e) {
            s = s.concat(r.serverSyncTree_.applyServerOverwrite(t, e));
            var n = r.abortTransactions_(t);
            r.rerunTransactions_(n);
          }), this.onDisconnect_ = new Fe, this.eventQueue_.raiseEventsForChangedPath(vt.Empty, s);
        }, t.prototype.onDisconnectCancel = function (n, r) {
          var i = this;
          this.server_.onDisconnectCancel(n.toString(), function (t, e) {
            "ok" === t && i.onDisconnect_.forget(n), i.callOnCompleteCallback(r, t, e);
          });
        }, t.prototype.onDisconnectSet = function (n, t, r) {
          var i = this, o = Ee(t);
          this.server_.onDisconnectPut(n.toString(), o.val(!0), function (t, e) {
            "ok" === t && i.onDisconnect_.remember(n, o), i.callOnCompleteCallback(r, t, e);
          });
        }, t.prototype.onDisconnectSetWithPriority = function (n, t, e, r) {
          var i = this, o = Ee(t, e);
          this.server_.onDisconnectPut(n.toString(), o.val(!0), function (t, e) {
            "ok" === t && i.onDisconnect_.remember(n, o), i.callOnCompleteCallback(r, t, e);
          });
        }, t.prototype.onDisconnectUpdate = function (r, n, i) {
          var o = this;
          if (S(n)) return J("onDisconnect().update() called with empty data.  Don't do anything."), void this.callOnCompleteCallback(i, "ok");
          this.server_.onDisconnectMerge(r.toString(), n, function (t, e) {
            "ok" === t && w(n, function (t, e) {
              var n = Ee(e);
              o.onDisconnect_.remember(r.child(t), n);
            }), o.callOnCompleteCallback(i, t, e);
          });
        }, t.prototype.addEventCallbackForQuery = function (t, e) {
          var n;
          n = ".info" === t.path.getFront() ? this.infoSyncTree_.addEventRegistration(t, e) : this.serverSyncTree_.addEventRegistration(t, e), this.eventQueue_.raiseEventsAtPath(t.path, n);
        }, t.prototype.removeEventCallbackForQuery = function (t, e) {
          var n;
          n = ".info" === t.path.getFront() ? this.infoSyncTree_.removeEventRegistration(t, e) : this.serverSyncTree_.removeEventRegistration(t, e), this.eventQueue_.raiseEventsAtPath(t.path, n);
        }, t.prototype.interrupt = function () {
          this.persistentConnection_ && this.persistentConnection_.interrupt(Pn);
        }, t.prototype.resume = function () {
          this.persistentConnection_ && this.persistentConnection_.resume(Pn);
        }, t.prototype.stats = function (t) {
          if (void 0 === t && (t = !1), "undefined" != typeof console) {
            var e;
            e = t ? (this.statsListener_ || (this.statsListener_ = new pn(this.stats_)), this.statsListener_.get()) : this.stats_.get();
            var r = Object.keys(e).reduce(function (t, e) {
              return Math.max(e.length, t)
            }, 0);
            w(e, function (t, e) {
              for (var n = t.length; n < r + 2; n++) t += " ";
              console.log(t + e);
            });
          }
        }, t.prototype.statsIncrementCounter = function (t) {
          this.stats_.incrementCounter(t), this.statsReporter_.includeStat(t);
        }, t.prototype.log_ = function () {
          for (var t = [], e = 0; e < arguments.length; e++) t[e] = arguments[e];
          var n = "";
          this.persistentConnection_ && (n = this.persistentConnection_.id + ":"), J.apply(void 0, [n].concat(t));
        }, t.prototype.callOnCompleteCallback = function (r, i, o) {
          r && _t(function () {
            if ("ok" == i) r(null); else {
              var t = (i || "error").toUpperCase(), e = t;
              o && (e += ": " + o);
              var n = new Error(e);
              n.code = t, r(n);
            }
          });
        }, Object.defineProperty(t.prototype, "database", {
          get: function () {
            return this.__database || (this.__database = new Vn(this))
          }, enumerable: !0, configurable: !0
        }), t
      }(), On = function () {
        function e(t) {
          this.indexedFilter_ = new ze(t.getIndex()), this.index_ = t.getIndex(), this.startPost_ = e.getStartPost_(t), this.endPost_ = e.getEndPost_(t);
        }

        return e.prototype.getStartPost = function () {
          return this.startPost_
        }, e.prototype.getEndPost = function () {
          return this.endPost_
        }, e.prototype.matches = function (t) {
          return this.index_.compare(this.getStartPost(), t) <= 0 && this.index_.compare(t, this.getEndPost()) <= 0
        }, e.prototype.updateChild = function (t, e, n, r, i, o) {
          return this.matches(new zt(e, n)) || (n = ge.EMPTY_NODE), this.indexedFilter_.updateChild(t, e, n, r, i, o)
        }, e.prototype.updateFullNode = function (t, e, n) {
          e.isLeafNode() && (e = ge.EMPTY_NODE);
          var r = e.withIndex(this.index_);
          r = r.updatePriority(ge.EMPTY_NODE);
          var i = this;
          return e.forEachChild(se, function (t, e) {
            i.matches(new zt(t, e)) || (r = r.updateImmediateChild(t, ge.EMPTY_NODE));
          }), this.indexedFilter_.updateFullNode(t, r, n)
        }, e.prototype.updatePriority = function (t, e) {
          return t
        }, e.prototype.filtersNodes = function () {
          return !0
        }, e.prototype.getIndexedFilter = function () {
          return this.indexedFilter_
        }, e.prototype.getIndex = function () {
          return this.index_
        }, e.getStartPost_ = function (t) {
          if (t.hasStart()) {
            var e = t.getIndexStartName();
            return t.getIndex().makePost(t.getIndexStartValue(), e)
          }
          return t.getIndex().minPost()
        }, e.getEndPost_ = function (t) {
          if (t.hasEnd()) {
            var e = t.getIndexEndName();
            return t.getIndex().makePost(t.getIndexEndValue(), e)
          }
          return t.getIndex().maxPost()
        }, e
      }(), kn = function () {
        function t(t) {
          this.rangedFilter_ = new On(t), this.index_ = t.getIndex(), this.limit_ = t.getLimit(), this.reverse_ = !t.isViewFromLeft();
        }

        return t.prototype.updateChild = function (t, e, n, r, i, o) {
          return this.rangedFilter_.matches(new zt(e, n)) || (n = ge.EMPTY_NODE), t.getImmediateChild(e).equals(n) ? t : t.numChildren() < this.limit_ ? this.rangedFilter_.getIndexedFilter().updateChild(t, e, n, r, i, o) : this.fullLimitUpdateChild_(t, e, n, i, o)
        }, t.prototype.updateFullNode = function (t, e, n) {
          var r;
          if (e.isLeafNode() || e.isEmpty()) r = ge.EMPTY_NODE.withIndex(this.index_); else if (2 * this.limit_ < e.numChildren() && e.isIndexed(this.index_)) {
            r = ge.EMPTY_NODE.withIndex(this.index_);
            var i = void 0;
            i = this.reverse_ ? e.getReverseIteratorFrom(this.rangedFilter_.getEndPost(), this.index_) : e.getIteratorFrom(this.rangedFilter_.getStartPost(), this.index_);
            for (var o = 0; i.hasNext() && o < this.limit_;) {
              var s = i.getNext();
              if (!(this.reverse_ ? this.index_.compare(this.rangedFilter_.getStartPost(), s) <= 0 : this.index_.compare(s, this.rangedFilter_.getEndPost()) <= 0)) break;
              r = r.updateImmediateChild(s.name, s.node), o++;
            }
          } else {
            r = (r = e.withIndex(this.index_)).updatePriority(ge.EMPTY_NODE);
            var a = void 0, h = void 0, u = void 0;
            i = void 0;
            if (this.reverse_) {
              i = r.getReverseIterator(this.index_), a = this.rangedFilter_.getEndPost(), h = this.rangedFilter_.getStartPost();
              var l = this.index_.getCompare();
              u = function (t, e) {
                return l(e, t)
              };
            } else i = r.getIterator(this.index_), a = this.rangedFilter_.getStartPost(), h = this.rangedFilter_.getEndPost(), u = this.index_.getCompare();
            o = 0;
            for (var c = !1; i.hasNext();) {
              s = i.getNext();
              !c && u(a, s) <= 0 && (c = !0), c && o < this.limit_ && u(s, h) <= 0 ? o++ : r = r.updateImmediateChild(s.name, ge.EMPTY_NODE);
            }
          }
          return this.rangedFilter_.getIndexedFilter().updateFullNode(t, r, n)
        }, t.prototype.updatePriority = function (t, e) {
          return t
        }, t.prototype.filtersNodes = function () {
          return !0
        }, t.prototype.getIndexedFilter = function () {
          return this.rangedFilter_.getIndexedFilter()
        }, t.prototype.getIndex = function () {
          return this.index_
        }, t.prototype.fullLimitUpdateChild_ = function (t, e, n, r, i) {
          var o;
          if (this.reverse_) {
            var s = this.index_.getCompare();
            o = function (t, e) {
              return s(e, t)
            };
          } else o = this.index_.getCompare();
          var a = t;
          C(a.numChildren() == this.limit_, "");
          var h = new zt(e, n), u = this.reverse_ ? a.getFirstChild(this.index_) : a.getLastChild(this.index_),
            l = this.rangedFilter_.matches(h);
          if (a.hasChild(e)) {
            for (var c = a.getImmediateChild(e), p = r.getChildAfterChild(this.index_, u, this.reverse_); null != p && (p.name == e || a.hasChild(p.name));) p = r.getChildAfterChild(this.index_, p, this.reverse_);
            var d = null == p ? 1 : o(p, h);
            if (l && !n.isEmpty() && 0 <= d) return null != i && i.trackChildChange(Ye.childChangedChange(e, n, c)), a.updateImmediateChild(e, n);
            null != i && i.trackChildChange(Ye.childRemovedChange(e, c));
            var f = a.updateImmediateChild(e, ge.EMPTY_NODE);
            return null != p && this.rangedFilter_.matches(p) ? (null != i && i.trackChildChange(Ye.childAddedChange(p.name, p.node)), f.updateImmediateChild(p.name, p.node)) : f
          }
          return n.isEmpty() ? t : l && 0 <= o(u, h) ? (null != i && (i.trackChildChange(Ye.childRemovedChange(u.name, u.node)), i.trackChildChange(Ye.childAddedChange(e, n))), a.updateImmediateChild(e, n).updateImmediateChild(u.name, ge.EMPTY_NODE)) : t
        }, t
      }(), xn = function () {
        function r() {
          this.limitSet_ = !1, this.startSet_ = !1, this.startNameSet_ = !1, this.endSet_ = !1, this.endNameSet_ = !1, this.limit_ = 0, this.viewFrom_ = "", this.indexStartValue_ = null, this.indexStartName_ = "", this.indexEndValue_ = null, this.indexEndName_ = "", this.index_ = se;
        }

        return r.prototype.hasStart = function () {
          return this.startSet_
        }, r.prototype.isViewFromLeft = function () {
          return "" === this.viewFrom_ ? this.startSet_ : this.viewFrom_ === r.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_LEFT
        }, r.prototype.getIndexStartValue = function () {
          return C(this.startSet_, "Only valid if start has been set"), this.indexStartValue_
        }, r.prototype.getIndexStartName = function () {
          return C(this.startSet_, "Only valid if start has been set"), this.startNameSet_ ? this.indexStartName_ : it
        }, r.prototype.hasEnd = function () {
          return this.endSet_
        }, r.prototype.getIndexEndValue = function () {
          return C(this.endSet_, "Only valid if end has been set"), this.indexEndValue_
        }, r.prototype.getIndexEndName = function () {
          return C(this.endSet_, "Only valid if end has been set"), this.endNameSet_ ? this.indexEndName_ : ot
        }, r.prototype.hasLimit = function () {
          return this.limitSet_
        }, r.prototype.hasAnchoredLimit = function () {
          return this.limitSet_ && "" !== this.viewFrom_
        }, r.prototype.getLimit = function () {
          return C(this.limitSet_, "Only valid if limit has been set"), this.limit_
        }, r.prototype.getIndex = function () {
          return this.index_
        }, r.prototype.copy_ = function () {
          var t = new r;
          return t.limitSet_ = this.limitSet_, t.limit_ = this.limit_, t.startSet_ = this.startSet_, t.indexStartValue_ = this.indexStartValue_, t.startNameSet_ = this.startNameSet_, t.indexStartName_ = this.indexStartName_, t.endSet_ = this.endSet_, t.indexEndValue_ = this.indexEndValue_, t.endNameSet_ = this.endNameSet_, t.indexEndName_ = this.indexEndName_, t.index_ = this.index_, t.viewFrom_ = this.viewFrom_, t
        }, r.prototype.limit = function (t) {
          var e = this.copy_();
          return e.limitSet_ = !0, e.limit_ = t, e.viewFrom_ = "", e
        }, r.prototype.limitToFirst = function (t) {
          var e = this.copy_();
          return e.limitSet_ = !0, e.limit_ = t, e.viewFrom_ = r.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_LEFT, e
        }, r.prototype.limitToLast = function (t) {
          var e = this.copy_();
          return e.limitSet_ = !0, e.limit_ = t, e.viewFrom_ = r.WIRE_PROTOCOL_CONSTANTS_.VIEW_FROM_RIGHT, e
        }, r.prototype.startAt = function (t, e) {
          var n = this.copy_();
          return n.startSet_ = !0, void 0 === t && (t = null), n.indexStartValue_ = t, n.indexStartName_ = null != e ? (n.startNameSet_ = !0, e) : (n.startNameSet_ = !1, ""), n
        }, r.prototype.endAt = function (t, e) {
          var n = this.copy_();
          return n.endSet_ = !0, void 0 === t && (t = null), n.indexEndValue_ = t, n.indexEndName_ = void 0 !== e ? (n.endNameSet_ = !0, e) : (n.endNameSet_ = !1, ""), n
        }, r.prototype.orderBy = function (t) {
          var e = this.copy_();
          return e.index_ = t, e
        }, r.prototype.getQueryObject = function () {
          var t = r.WIRE_PROTOCOL_CONSTANTS_, e = {};
          if (this.startSet_ && (e[t.INDEX_START_VALUE] = this.indexStartValue_, this.startNameSet_ && (e[t.INDEX_START_NAME] = this.indexStartName_)), this.endSet_ && (e[t.INDEX_END_VALUE] = this.indexEndValue_, this.endNameSet_ && (e[t.INDEX_END_NAME] = this.indexEndName_)), this.limitSet_) {
            e[t.LIMIT] = this.limit_;
            var n = this.viewFrom_;
            "" === n && (n = this.isViewFromLeft() ? t.VIEW_FROM_LEFT : t.VIEW_FROM_RIGHT), e[t.VIEW_FROM] = n;
          }
          return this.index_ !== se && (e[t.INDEX] = this.index_.toString()), e
        }, r.prototype.loadsAllData = function () {
          return !(this.startSet_ || this.endSet_ || this.limitSet_)
        }, r.prototype.isDefault = function () {
          return this.loadsAllData() && this.index_ == se
        }, r.prototype.getNodeFilter = function () {
          return this.loadsAllData() ? new ze(this.getIndex()) : this.hasLimit() ? new kn(this) : new On(this)
        }, r.prototype.toRestQueryStringParameters = function () {
          var t, e = r.REST_QUERY_CONSTANTS_, n = {};
          return this.isDefault() || (t = this.index_ === se ? e.PRIORITY_INDEX : this.index_ === Te ? e.VALUE_INDEX : this.index_ === $t ? e.KEY_INDEX : (C(this.index_ instanceof Ie, "Unrecognized index type!"), this.index_.toString()), n[e.ORDER_BY] = v(t), this.startSet_ && (n[e.START_AT] = v(this.indexStartValue_), this.startNameSet_ && (n[e.START_AT] += "," + v(this.indexStartName_))), this.endSet_ && (n[e.END_AT] = v(this.indexEndValue_), this.endNameSet_ && (n[e.END_AT] += "," + v(this.indexEndName_))), this.limitSet_ && (this.isViewFromLeft() ? n[e.LIMIT_TO_FIRST] = this.limit_ : n[e.LIMIT_TO_LAST] = this.limit_)), n
        }, r.WIRE_PROTOCOL_CONSTANTS_ = {
          INDEX_START_VALUE: "sp",
          INDEX_START_NAME: "sn",
          INDEX_END_VALUE: "ep",
          INDEX_END_NAME: "en",
          LIMIT: "l",
          VIEW_FROM: "vf",
          VIEW_FROM_LEFT: "l",
          VIEW_FROM_RIGHT: "r",
          INDEX: "i"
        }, r.REST_QUERY_CONSTANTS_ = {
          ORDER_BY: "orderBy",
          PRIORITY_INDEX: "$priority",
          VALUE_INDEX: "$value",
          KEY_INDEX: "$key",
          START_AT: "startAt",
          END_AT: "endAt",
          LIMIT_TO_FIRST: "limitToFirst",
          LIMIT_TO_LAST: "limitToLast"
        }, r.DEFAULT = new r, r
      }(), Fn = function (n) {
        function o(t, e) {
          if (!(t instanceof Dn)) throw new Error("new Reference() no longer supported - use app.database().");
          return n.call(this, t, e, xn.DEFAULT, !1) || this
        }

        return s(o, n), o.prototype.getKey = function () {
          return D("Reference.key", 0, 0, arguments.length), this.path.isEmpty() ? null : this.path.getBack()
        }, o.prototype.child = function (t) {
          var e, n, r, i;
          return D("Reference.child", 1, 1, arguments.length), "number" == typeof t ? t = String(t) : t instanceof vt || (null === this.path.getFront() ? (e = "Reference.child", i = !(n = 1), (r = t) && (r = r.replace(/^\/*\.info(\/|$)/, "/")), Vt(e, n, r, i)) : Vt("Reference.child", 1, t, !1)), new o(this.repo, this.path.child(t))
        }, o.prototype.getParent = function () {
          D("Reference.parent", 0, 0, arguments.length);
          var t = this.path.parent();
          return null === t ? null : new o(this.repo, t)
        }, o.prototype.getRoot = function () {
          D("Reference.root", 0, 0, arguments.length);
          for (var t = this; null !== t.getParent();) t = t.getParent();
          return t
        }, o.prototype.databaseProp = function () {
          return this.repo.database
        }, o.prototype.set = function (t, e) {
          D("Reference.set", 1, 2, arguments.length), Ht("Reference.set", this.path), Lt("Reference.set", 1, t, this.path, !1), k("Reference.set", 2, e, !0);
          var n = new l;
          return this.repo.setWithPriority(this.path, t, null, n.wrapCallback(e)), n.promise
        }, o.prototype.update = function (t, e) {
          if (D("Reference.update", 1, 2, arguments.length), Ht("Reference.update", this.path), Array.isArray(t)) {
            for (var n = {}, r = 0; r < t.length; ++r) n["" + r] = t[r];
            t = n, nt("Passing an Array to Firebase.update() is deprecated. Use set() if you want to overwrite the existing data, or an Object with integer keys if you really do want to only update some of the children.");
          }
          Wt("Reference.update", 1, t, this.path, !1), k("Reference.update", 2, e, !0);
          var i = new l;
          return this.repo.update(this.path, t, i.wrapCallback(e)), i.promise
        }, o.prototype.setWithPriority = function (t, e, n) {
          if (D("Reference.setWithPriority", 2, 3, arguments.length), Ht("Reference.setWithPriority", this.path), Lt("Reference.setWithPriority", 1, t, this.path, !1), qt("Reference.setWithPriority", 2, e, !1), k("Reference.setWithPriority", 3, n, !0), ".length" === this.getKey() || ".keys" === this.getKey()) throw"Reference.setWithPriority failed: " + this.getKey() + " is a read-only object.";
          var r = new l;
          return this.repo.setWithPriority(this.path, t, e, r.wrapCallback(n)), r.promise
        }, o.prototype.remove = function (t) {
          return D("Reference.remove", 0, 1, arguments.length), Ht("Reference.remove", this.path), k("Reference.remove", 1, t, !0), this.set(null, t)
        }, o.prototype.transaction = function (t, r, e) {
          if (D("Reference.transaction", 1, 3, arguments.length), Ht("Reference.transaction", this.path), k("Reference.transaction", 1, t, !1), k("Reference.transaction", 2, r, !0), function (t, e, n, r) {
            if ((!r || void 0 !== n) && "boolean" != typeof n) throw new Error(O(t, e, r) + "must be a boolean.")
          }("Reference.transaction", 3, e, !0), ".length" === this.getKey() || ".keys" === this.getKey()) throw"Reference.transaction failed: " + this.getKey() + " is a read-only object.";
          void 0 === e && (e = !0);
          var i = new l;
          "function" == typeof r && i.promise.catch(function () {
          });
          return this.repo.startTransaction(this.path, t, function (t, e, n) {
            t ? i.reject(t) : i.resolve(new Kt(e, n)), "function" == typeof r && r(t, e, n);
          }, e), i.promise
        }, o.prototype.setPriority = function (t, e) {
          D("Reference.setPriority", 1, 2, arguments.length), Ht("Reference.setPriority", this.path), qt("Reference.setPriority", 1, t, !1), k("Reference.setPriority", 2, e, !0);
          var n = new l;
          return this.repo.setWithPriority(this.path.child(".priority"), t, null, n.wrapCallback(e)), n.promise
        }, o.prototype.push = function (t, e) {
          D("Reference.push", 0, 2, arguments.length), Ht("Reference.push", this.path), Lt("Reference.push", 1, t, this.path, !0), k("Reference.push", 2, e, !0);
          var n, r = this.repo.serverTime(), i = Yt(r), o = this.child(i), s = this.child(i);
          return n = null != t ? o.set(t, e).then(function () {
            return s
          }) : Promise.resolve(s), o.then = n.then.bind(n), o.catch = n.then.bind(n, void 0), "function" == typeof e && n.catch(function () {
          }), o
        }, o.prototype.onDisconnect = function () {
          return Ht("Reference.onDisconnect", this.path), new jt(this.repo, this.path)
        }, Object.defineProperty(o.prototype, "database", {
          get: function () {
            return this.databaseProp()
          }, enumerable: !0, configurable: !0
        }), Object.defineProperty(o.prototype, "key", {
          get: function () {
            return this.getKey()
          }, enumerable: !0, configurable: !0
        }), Object.defineProperty(o.prototype, "parent", {
          get: function () {
            return this.getParent()
          }, enumerable: !0, configurable: !0
        }), Object.defineProperty(o.prototype, "root", {
          get: function () {
            return this.getRoot()
          }, enumerable: !0, configurable: !0
        }), o
      }(ke);
      ke.__referenceConstructor = Fn, nn.__referenceConstructor = Fn;
      var An, Ln, Mn = function () {
        this.children = {}, this.childCount = 0, this.value = null;
      }, Wn = function () {
        function i(t, e, n) {
          void 0 === t && (t = ""), void 0 === e && (e = null), void 0 === n && (n = new Mn), this.name_ = t, this.parent_ = e, this.node_ = n;
        }

        return i.prototype.subTree = function (t) {
          for (var e, n = t instanceof vt ? t : new vt(t), r = this; null !== (e = n.getFront());) {
            r = new i(e, r, m(r.node_.children, e) || new Mn), n = n.popFront();
          }
          return r
        }, i.prototype.getValue = function () {
          return this.node_.value
        }, i.prototype.setValue = function (t) {
          C(void 0 !== t, "Cannot set value to undefined"), this.node_.value = t, this.updateParents_();
        }, i.prototype.clear = function () {
          this.node_.value = null, this.node_.children = {}, this.node_.childCount = 0, this.updateParents_();
        }, i.prototype.hasChildren = function () {
          return 0 < this.node_.childCount
        }, i.prototype.isEmpty = function () {
          return null === this.getValue() && !this.hasChildren()
        }, i.prototype.forEachChild = function (n) {
          var r = this;
          w(this.node_.children, function (t, e) {
            n(new i(t, r, e));
          });
        }, i.prototype.forEachDescendant = function (e, t, n) {
          t && !n && e(this), this.forEachChild(function (t) {
            t.forEachDescendant(e, !0, n);
          }), t && n && e(this);
        }, i.prototype.forEachAncestor = function (t, e) {
          for (var n = e ? this : this.parent(); null !== n;) {
            if (t(n)) return !0;
            n = n.parent();
          }
          return !1
        }, i.prototype.forEachImmediateDescendantWithValue = function (e) {
          this.forEachChild(function (t) {
            null !== t.getValue() ? e(t) : t.forEachImmediateDescendantWithValue(e);
          });
        }, i.prototype.path = function () {
          return new vt(null === this.parent_ ? this.name_ : this.parent_.path() + "/" + this.name_)
        }, i.prototype.name = function () {
          return this.name_
        }, i.prototype.parent = function () {
          return this.parent_
        }, i.prototype.updateParents_ = function () {
          null !== this.parent_ && this.parent_.updateChild_(this.name_, this);
        }, i.prototype.updateChild_ = function (t, e) {
          var n = e.isEmpty(), r = E(this.node_.children, t);
          n && r ? (delete this.node_.children[t], this.node_.childCount--, this.updateParents_()) : n || r || (this.node_.children[t] = e.node_, this.node_.childCount++, this.updateParents_());
        }, i
      }();
      (Ln = An || (An = {}))[Ln.RUN = 0] = "RUN", Ln[Ln.SENT = 1] = "SENT", Ln[Ln.COMPLETED = 2] = "COMPLETED", Ln[Ln.SENT_NEEDS_ABORT = 3] = "SENT_NEEDS_ABORT", Ln[Ln.NEEDS_ABORT = 4] = "NEEDS_ABORT", Dn.MAX_TRANSACTION_RETRIES_ = 25, Dn.prototype.transactions_init_ = function () {
        this.transactionQueueTree_ = new Wn;
      }, Dn.prototype.startTransaction = function (t, e, n, r) {
        this.log_("transaction on " + t);
        var i = function () {
        }, o = new Fn(this, t);
        o.on("value", i);
        var s = {
          path: t,
          update: e,
          onComplete: n,
          status: null,
          order: K(),
          applyLocally: r,
          retryCount: 0,
          unwatcher: function () {
            o.off("value", i);
          },
          abortReason: null,
          currentWriteId: null,
          currentInputSnapshot: null,
          currentOutputSnapshotRaw: null,
          currentOutputSnapshotResolved: null
        }, a = this.getLatestState_(t);
        s.currentInputSnapshot = a;
        var h = s.update(a.val());
        if (void 0 === h) {
          if (s.unwatcher(), s.currentOutputSnapshotRaw = null, s.currentOutputSnapshotResolved = null, s.onComplete) {
            var u = new Ne(s.currentInputSnapshot, new Fn(this, s.path), se);
            s.onComplete(null, !1, u);
          }
        } else {
          Mt("transaction failed: Data returned ", h, s.path), s.status = An.RUN;
          var l = this.transactionQueueTree_.subTree(t), c = l.getValue() || [];
          c.push(s), l.setValue(c);
          var p = void 0;
          if ("object" == typeof h && null !== h && E(h, ".priority")) p = m(h, ".priority"), C(At(p), "Invalid priority returned by transaction. Priority must be a valid string, finite number, server value, or null."); else p = (this.serverSyncTree_.calcCompleteEventCache(t) || ge.EMPTY_NODE).getPriority().val();
          p = p;
          var d = this.generateServerValues(), f = Ee(h, p), _ = Le(f, d);
          s.currentOutputSnapshotRaw = f, s.currentOutputSnapshotResolved = _, s.currentWriteId = this.getNextWriteId_();
          var y = this.serverSyncTree_.applyUserOverwrite(t, _, s.currentWriteId, s.applyLocally);
          this.eventQueue_.raiseEventsForChangedPath(t, y), this.sendReadyTransactions_();
        }
      }, Dn.prototype.getLatestState_ = function (t, e) {
        return this.serverSyncTree_.calcCompleteEventCache(t, e) || ge.EMPTY_NODE
      }, Dn.prototype.sendReadyTransactions_ = function (t) {
        var e = this;
        if (void 0 === t && (t = this.transactionQueueTree_), t || this.pruneCompletedTransactionsBelowNode_(t), null !== t.getValue()) {
          var n = this.buildTransactionQueue_(t);
          C(0 < n.length, "Sending zero length transaction queue"), n.every(function (t) {
            return t.status === An.RUN
          }) && this.sendTransactionQueue_(t.path(), n);
        } else t.hasChildren() && t.forEachChild(function (t) {
          e.sendReadyTransactions_(t);
        });
      }, Dn.prototype.sendTransactionQueue_ = function (a, h) {
        for (var u = this, t = h.map(function (t) {
          return t.currentWriteId
        }), e = this.getLatestState_(a, t), n = e, r = e.hash(), i = 0; i < h.length; i++) {
          var o = h[i];
          C(o.status === An.RUN, "tryToSendTransactionQueue_: items in queue should all be run."), o.status = An.SENT, o.retryCount++;
          var s = vt.relativePath(a, o.path);
          n = n.updateChild(s, o.currentOutputSnapshotRaw);
        }
        var l = n.val(!0), c = a;
        this.server_.put(c.toString(), l, function (t) {
          u.log_("transaction put response", {path: c.toString(), status: t});
          var e = [];
          if ("ok" === t) {
            for (var n = [], r = 0; r < h.length; r++) {
              if (h[r].status = An.COMPLETED, e = e.concat(u.serverSyncTree_.ackUserWrite(h[r].currentWriteId)), h[r].onComplete) {
                var i = h[r].currentOutputSnapshotResolved, o = new Fn(u, h[r].path), s = new Ne(i, o, se);
                n.push(h[r].onComplete.bind(null, null, !0, s));
              }
              h[r].unwatcher();
            }
            u.pruneCompletedTransactionsBelowNode_(u.transactionQueueTree_.subTree(a)), u.sendReadyTransactions_(), u.eventQueue_.raiseEventsForChangedPath(a, e);
            for (r = 0; r < n.length; r++) _t(n[r]);
          } else {
            if ("datastale" === t) for (r = 0; r < h.length; r++) h[r].status === An.SENT_NEEDS_ABORT ? h[r].status = An.NEEDS_ABORT : h[r].status = An.RUN; else {
              nt("transaction at " + c.toString() + " failed: " + t);
              for (r = 0; r < h.length; r++) h[r].status = An.NEEDS_ABORT, h[r].abortReason = t;
            }
            u.rerunTransactions_(a);
          }
        }, r);
      }, Dn.prototype.rerunTransactions_ = function (t) {
        var e = this.getAncestorTransactionNode_(t), n = e.path(), r = this.buildTransactionQueue_(e);
        return this.rerunTransactionQueue_(r, n), n
      }, Dn.prototype.rerunTransactionQueue_ = function (t, e) {
        if (0 !== t.length) {
          for (var n, r = [], i = [], o = t.filter(function (t) {
            return t.status === An.RUN
          }).map(function (t) {
            return t.currentWriteId
          }), s = 0; s < t.length; s++) {
            var a = t[s], h = vt.relativePath(e, a.path), u = !1, l = void 0;
            if (C(null !== h, "rerunTransactionsUnderNode_: relativePath should not be null."), a.status === An.NEEDS_ABORT) u = !0, l = a.abortReason, i = i.concat(this.serverSyncTree_.ackUserWrite(a.currentWriteId, !0)); else if (a.status === An.RUN) if (a.retryCount >= Dn.MAX_TRANSACTION_RETRIES_) u = !0, l = "maxretry", i = i.concat(this.serverSyncTree_.ackUserWrite(a.currentWriteId, !0)); else {
              var c = this.getLatestState_(a.path, o);
              a.currentInputSnapshot = c;
              var p = t[s].update(c.val());
              if (void 0 !== p) {
                Mt("transaction failed: Data returned ", p, a.path);
                var d = Ee(p);
                "object" == typeof p && null != p && E(p, ".priority") || (d = d.updatePriority(c.getPriority()));
                var f = a.currentWriteId, _ = this.generateServerValues(), y = Le(d, _);
                a.currentOutputSnapshotRaw = d, a.currentOutputSnapshotResolved = y, a.currentWriteId = this.getNextWriteId_(), o.splice(o.indexOf(f), 1), i = (i = i.concat(this.serverSyncTree_.applyUserOverwrite(a.path, y, a.currentWriteId, a.applyLocally))).concat(this.serverSyncTree_.ackUserWrite(f, !0));
              } else u = !0, l = "nodata", i = i.concat(this.serverSyncTree_.ackUserWrite(a.currentWriteId, !0));
            }
            if (this.eventQueue_.raiseEventsForChangedPath(e, i), i = [], u && (t[s].status = An.COMPLETED, n = t[s].unwatcher, setTimeout(n, Math.floor(0)), t[s].onComplete)) if ("nodata" === l) {
              var v = new Fn(this, t[s].path), g = t[s].currentInputSnapshot, m = new Ne(g, v, se);
              r.push(t[s].onComplete.bind(null, null, !1, m));
            } else r.push(t[s].onComplete.bind(null, new Error(l), !1, null));
          }
          this.pruneCompletedTransactionsBelowNode_(this.transactionQueueTree_);
          for (s = 0; s < r.length; s++) _t(r[s]);
          this.sendReadyTransactions_();
        }
      }, Dn.prototype.getAncestorTransactionNode_ = function (t) {
        for (var e, n = this.transactionQueueTree_; null !== (e = t.getFront()) && null === n.getValue();) n = n.subTree(e), t = t.popFront();
        return n
      }, Dn.prototype.buildTransactionQueue_ = function (t) {
        var e = [];
        return this.aggregateTransactionQueuesForNode_(t, e), e.sort(function (t, e) {
          return t.order - e.order
        }), e
      }, Dn.prototype.aggregateTransactionQueuesForNode_ = function (t, e) {
        var n = this, r = t.getValue();
        if (null !== r) for (var i = 0; i < r.length; i++) e.push(r[i]);
        t.forEachChild(function (t) {
          n.aggregateTransactionQueuesForNode_(t, e);
        });
      }, Dn.prototype.pruneCompletedTransactionsBelowNode_ = function (t) {
        var e = this, n = t.getValue();
        if (n) {
          for (var r = 0, i = 0; i < n.length; i++) n[i].status !== An.COMPLETED && (n[r] = n[i], r++);
          n.length = r, t.setValue(0 < n.length ? n : null);
        }
        t.forEachChild(function (t) {
          e.pruneCompletedTransactionsBelowNode_(t);
        });
      }, Dn.prototype.abortTransactions_ = function (t) {
        var e = this, n = this.getAncestorTransactionNode_(t).path(), r = this.transactionQueueTree_.subTree(t);
        return r.forEachAncestor(function (t) {
          e.abortTransactionsOnNode_(t);
        }), this.abortTransactionsOnNode_(r), r.forEachDescendant(function (t) {
          e.abortTransactionsOnNode_(t);
        }), n
      }, Dn.prototype.abortTransactionsOnNode_ = function (t) {
        var e = t.getValue();
        if (null !== e) {
          for (var n = [], r = [], i = -1, o = 0; o < e.length; o++) if (e[o].status === An.SENT_NEEDS_ABORT) ; else if (e[o].status === An.SENT) C(i === o - 1, "All SENT items should be at beginning of queue."), e[i = o].status = An.SENT_NEEDS_ABORT, e[o].abortReason = "set"; else if (C(e[o].status === An.RUN, "Unexpected transaction status in abort"), e[o].unwatcher(), r = r.concat(this.serverSyncTree_.ackUserWrite(e[o].currentWriteId, !0)), e[o].onComplete) {
            n.push(e[o].onComplete.bind(null, new Error("set"), !1, null));
          }
          -1 === i ? t.setValue(null) : e.length = i + 1, this.eventQueue_.raiseEventsForChangedPath(t.path(), r);
          for (o = 0; o < n.length; o++) _t(n[o]);
        }
      };
      var qn, Qn = "databaseURL", Un = function () {
        function t() {
          this.repos_ = {}, this.useRestClient_ = !1;
        }

        return t.getInstance = function () {
          return qn || (qn = new t), qn
        }, t.prototype.interrupt = function () {
          for (var t in this.repos_) for (var e in this.repos_[t]) this.repos_[t][e].interrupt();
        }, t.prototype.resume = function () {
          for (var t in this.repos_) for (var e in this.repos_[t]) this.repos_[t][e].resume();
        }, t.prototype.databaseFromApp = function (t, e) {
          var n = e || t.options[Qn];
          void 0 === n && et("Can't determine Firebase Database URL.  Be sure to include " + Qn + " option when calling firebase.initializeApp().");
          var r = Rt(n), i = r.repoInfo;
          return Bt("Invalid Firebase Database URL", 1, r), r.path.isEmpty() || et("Database URL must point to the root of a Firebase Database (not including a child path)."), this.createRepo(i, t).database
        }, t.prototype.deleteRepo = function (t) {
          var e = m(this.repos_, t.app.name);
          e && m(e, t.repoInfo_.toURLString()) === t || et("Database " + t.app.name + "(" + t.repoInfo_ + ") has already been deleted."), t.interrupt(), delete e[t.repoInfo_.toURLString()];
        }, t.prototype.createRepo = function (t, e) {
          var n = m(this.repos_, e.name);
          n || (n = {}, this.repos_[e.name] = n);
          var r = m(n, t.toURLString());
          return r && et("Database initialized multiple times. Please make sure the format of the database URL matches with each database() call."), r = new Dn(t, this.useRestClient_, e), n[t.toURLString()] = r
        }, t.prototype.forceRestClient = function (t) {
          this.useRestClient_ = t;
        }, t
      }(), Vn = function () {
        function t(t) {
          (this.repo_ = t) instanceof Dn || et("Don't call new Database() directly - please use firebase.database()."), this.root_ = new Fn(t, vt.Empty), this.INTERNAL = new Hn(this);
        }

        return Object.defineProperty(t.prototype, "app", {
          get: function () {
            return this.repo_.app
          }, enumerable: !0, configurable: !0
        }), t.prototype.ref = function (t) {
          return this.checkDeleted_("ref"), D("database.ref", 0, 1, arguments.length), t instanceof Fn ? this.refFromURL(t.toString()) : void 0 !== t ? this.root_.child(t) : this.root_
        }, t.prototype.refFromURL = function (t) {
          var e = "database.refFromURL";
          this.checkDeleted_(e), D(e, 1, 1, arguments.length);
          var n = Rt(t);
          Bt(e, 1, n);
          var r = n.repoInfo;
          return r.host !== this.repo_.repoInfo_.host && et(e + ": Host name does not match the current database: (found " + r.host + " but expected " + this.repo_.repoInfo_.host + ")"), this.ref(n.path.toString())
        }, t.prototype.checkDeleted_ = function (t) {
          null === this.repo_ && et("Cannot call " + t + " on a deleted database.");
        }, t.prototype.goOffline = function () {
          D("database.goOffline", 0, 0, arguments.length), this.checkDeleted_("goOffline"), this.repo_.interrupt();
        }, t.prototype.goOnline = function () {
          D("database.goOnline", 0, 0, arguments.length), this.checkDeleted_("goOnline"), this.repo_.resume();
        }, t.ServerValue = {TIMESTAMP: {".sv": "timestamp"}}, t
      }(), Hn = function () {
        function t(t) {
          this.database     = t;
          //firebase.database = t;
        }

        return t.prototype.delete = function () {
          return o = this, h = function () {
            return e(this, function (t) {
              return this.database.checkDeleted_("delete"), Un.getInstance().deleteRepo(this.database.repo_), this.database.repo_ = null, this.database.root_ = null, this.database.INTERNAL = null, this.database = null, [2]
            })
          }, new ((a = s = void 0) || (a = Promise))(function (t, e) {
            function n(t) {
              try {
                i(h.next(t));
              } catch (t) {
                e(t);
              }
            }

            function r(t) {
              try {
                i(h.throw(t));
              } catch (t) {
                e(t);
              }
            }

            function i(e) {
              e.done ? t(e.value) : new a(function (t) {
                t(e.value);
              }).then(n, r);
            }

            i((h = h.apply(o, s || [])).next());
          });
          var o, s, a, h;
        }, t
      }(), Bn = Object.freeze({
        forceLongPolling: function () {
          bn.forceDisallow(), Cn.forceAllow();
        }, forceWebSockets: function () {
          Cn.forceDisallow();
        }, isWebSocketsAvailable: function () {
          return bn.isAvailable()
        }, setSecurityDebugCallback: function (t, e) {
          t.repo.persistentConnection_.securityDebugCallback_ = e;
        }, stats: function (t, e) {
          t.repo.stats(e);
        }, statsIncrementCounter: function (t, e) {
          t.repo.statsIncrementCounter(e);
        }, dataUpdateCount: function (t) {
          return t.repo.dataUpdateCount
        }, interceptServerData: function (t, e) {
          return t.repo.interceptServerData_(e)
        }
      }), jn = Nn;
      Nn.prototype.simpleListen = function (t, e) {
        this.sendRequest("q", {p: t}, e);
      }, Nn.prototype.echo = function (t, e) {
        this.sendRequest("echo", {d: t}, e);
      };
      var Kn = Tn, Yn = wt, zn = Object.freeze({
        DataConnection: jn, RealTimeConnection: Kn, hijackHash: function (i) {
          var o = Nn.prototype.put;
          return Nn.prototype.put = function (t, e, n, r) {
            void 0 !== r && (r = i()), o.call(this, t, e, n, r);
          }, function () {
            Nn.prototype.put = o;
          }
        }, ConnectionTarget: Yn, queryIdentifier: function (t) {
          return t.queryIdentifier()
        }, listens: function (t) {
          return t.repo.persistentConnection_.listens_
        }, forceRestClient: function (t) {
          Un.getInstance().forceRestClient(t);
        }
      }), Gn = Vn.ServerValue;
      Xn.INTERNAL.registerService("database", function (t, e, n) {
        return Un.getInstance().databaseFromApp(t, n)
      }, {
        Reference: Fn,
        Query: ke,
        Database: Vn,
        DataSnapshot: Ne,
        enableLogging: $,
        INTERNAL: Bn,
        ServerValue: Gn,
        TEST_ACCESS: zn
      }, null, !0);
    }).apply(this, arguments);
  } catch (t) {
    throw (console.error(t), new Error("Cannot instantiate firebase-database - be sure to load firebase-app.js first."))
  }
});

!function (t, e) { e(firebase$1); }(undefined, function (Wh) {
  try {
    (function () {
      Wh = Wh && Wh.hasOwnProperty("default") ? Wh.default : Wh, function () {
        var t, o = "function" == typeof Object.defineProperties ? Object.defineProperty : function (t, e, n) {
            t != Array.prototype && t != Object.prototype && (t[e] = n.value);
          },
          a = "undefined" != typeof window && window === this ? this : "undefined" != typeof global && null != global ? global : this;

        function c(t) {
          var e, n, i = "undefined" != typeof Symbol && Symbol.iterator && t[Symbol.iterator];
          return i ? i.call(t) : {
            next: (e = t, n = 0, function () {
              return n < e.length ? {done: !1, value: e[n++]} : {done: !0}
            })
          }
        }

        !function (t, e) {
          if (e) {
            var n = a;
            t = t.split(".");
            for (var i = 0; i < t.length - 1; i++) {
              var r = t[i];
              r in n || (n[r] = {}), n = n[r];
            }
            (e = e(i = n[t = t[t.length - 1]])) != i && null != e && o(n, t, {configurable: !0, writable: !0, value: e});
          }
        }("Promise", function (t) {
          function s(t) {
            this.b = 0, this.c = void 0, this.a = [];
            var e = this.f();
            try {
              t(e.resolve, e.reject);
            } catch (t) {
              e.reject(t);
            }
          }

          function e() {
            this.a = null;
          }

          function u(e) {
            return e instanceof s ? e : new s(function (t) {
              t(e);
            })
          }

          if (t) return t;
          e.prototype.b = function (t) {
            if (null == this.a) {
              this.a = [];
              var e = this;
              this.c(function () {
                e.g();
              });
            }
            this.a.push(t);
          };
          var n = a.setTimeout;
          e.prototype.c = function (t) {
            n(t, 0);
          }, e.prototype.g = function () {
            for (; this.a && this.a.length;) {
              var t = this.a;
              this.a = [];
              for (var e = 0; e < t.length; ++e) {
                var n = t[e];
                t[e] = null;
                try {
                  n();
                } catch (t) {
                  this.f(t);
                }
              }
            }
            this.a = null;
          }, e.prototype.f = function (t) {
            this.c(function () {
              throw t
            });
          }, s.prototype.f = function () {
            function t(e) {
              return function (t) {
                i || (i = !0, e.call(n, t));
              }
            }

            var n = this, i = !1;
            return {resolve: t(this.o), reject: t(this.g)}
          }, s.prototype.o = function (t) {
            if (t === this) this.g(new TypeError("A Promise cannot resolve to itself")); else if (t instanceof s) this.u(t); else {
              t:switch (typeof t) {
                case"object":
                  var e = null != t;
                  break t;
                case"function":
                  e = !0;
                  break t;
                default:
                  e = !1;
              }
              e ? this.l(t) : this.h(t);
            }
          }, s.prototype.l = function (t) {
            var e = void 0;
            try {
              e = t.then;
            } catch (t) {
              return void this.g(t)
            }
            "function" == typeof e ? this.v(e, t) : this.h(t);
          }, s.prototype.g = function (t) {
            this.i(2, t);
          }, s.prototype.h = function (t) {
            this.i(1, t);
          }, s.prototype.i = function (t, e) {
            if (0 != this.b) throw Error("Cannot settle(" + t + ", " + e + "): Promise already settled in state" + this.b);
            this.b = t, this.c = e, this.m();
          }, s.prototype.m = function () {
            if (null != this.a) {
              for (var t = 0; t < this.a.length; ++t) r.b(this.a[t]);
              this.a = null;
            }
          };
          var r = new e;
          return s.prototype.u = function (t) {
            var e = this.f();
            t.Ja(e.resolve, e.reject);
          }, s.prototype.v = function (t, e) {
            var n = this.f();
            try {
              t.call(e, n.resolve, n.reject);
            } catch (t) {
              n.reject(t);
            }
          }, s.prototype.then = function (t, e) {
            function n(e, t) {
              return "function" == typeof e ? function (t) {
                try {
                  i(e(t));
                } catch (t) {
                  r(t);
                }
              } : t
            }

            var i, r, o = new s(function (t, e) {
              i = t, r = e;
            });
            return this.Ja(n(t, i), n(e, r)), o
          }, s.prototype.catch = function (t) {
            return this.then(void 0, t)
          }, s.prototype.Ja = function (t, e) {
            function n() {
              switch (i.b) {
                case 1:
                  t(i.c);
                  break;
                case 2:
                  e(i.c);
                  break;
                default:
                  throw Error("Unexpected state: " + i.b)
              }
            }

            var i = this;
            null == this.a ? r.b(n) : this.a.push(n);
          }, s.resolve = u, s.reject = function (n) {
            return new s(function (t, e) {
              e(n);
            })
          }, s.race = function (r) {
            return new s(function (t, e) {
              for (var n = c(r), i = n.next(); !i.done; i = n.next()) u(i.value).Ja(t, e);
            })
          }, s.all = function (t) {
            var o = c(t), a = o.next();
            return a.done ? u([]) : new s(function (n, t) {
              function e(e) {
                return function (t) {
                  i[e] = t, 0 == --r && n(i);
                }
              }

              for (var i = [], r = 0; i.push(void 0), r++, u(a.value).Ja(e(i.length - 1), t), !(a = o.next()).done;) ;
            })
          }, s
        });
        var u = u || {}, l = this;

        function h(t) {
          return "string" == typeof t
        }

        function n(t) {
          return "boolean" == typeof t
        }

        var f = /^[\w+/_-]+[=]{0,2}$/, d = null;

        function s() {
        }

        function p(t) {
          var e = typeof t;
          if ("object" == e) {
            if (!t) return "null";
            if (t instanceof Array) return "array";
            if (t instanceof Object) return e;
            var n = Object.prototype.toString.call(t);
            if ("[object Window]" == n) return "object";
            if ("[object Array]" == n || "number" == typeof t.length && void 0 !== t.splice && void 0 !== t.propertyIsEnumerable && !t.propertyIsEnumerable("splice")) return "array";
            if ("[object Function]" == n || void 0 !== t.call && void 0 !== t.propertyIsEnumerable && !t.propertyIsEnumerable("call")) return "function"
          } else if ("function" == e && void 0 === t.call) return "object";
          return e
        }

        function i(t) {
          return null === t
        }

        function v(t) {
          return "array" == p(t)
        }

        function m(t) {
          var e = p(t);
          return "array" == e || "object" == e && "number" == typeof t.length
        }

        function g(t) {
          return "function" == p(t)
        }

        function b(t) {
          var e = typeof t;
          return "object" == e && null != t || "function" == e
        }

        var e = "closure_uid_" + (1e9 * Math.random() >>> 0), r = 0;

        function y(t, e, n) {
          return t.call.apply(t.bind, arguments)
        }

        function w(e, n, t) {
          if (!e) throw Error();
          if (2 < arguments.length) {
            var i = Array.prototype.slice.call(arguments, 2);
            return function () {
              var t = Array.prototype.slice.call(arguments);
              return Array.prototype.unshift.apply(t, i), e.apply(n, t)
            }
          }
          return function () {
            return e.apply(n, arguments)
          }
        }

        function I(t, e, n) {
          return (I = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? y : w).apply(null, arguments)
        }

        function T(e, t) {
          var n = Array.prototype.slice.call(arguments, 1);
          return function () {
            var t = n.slice();
            return t.push.apply(t, arguments), e.apply(this, t)
          }
        }

        var k = Date.now || function () {
          return +new Date
        };

        function E(t, o) {
          function e() {
          }

          e.prototype = o.prototype, t.qb = o.prototype, t.prototype = new e, (t.prototype.constructor = t).cd = function (t, e, n) {
            for (var i = Array(arguments.length - 2), r = 2; r < arguments.length; r++) i[r - 2] = arguments[r];
            return o.prototype[e].apply(t, i)
          };
        }

        function S(t) {
          if (!t) return !1;
          try {
            return !!t.$goog_Thenable
          } catch (t) {
            return !1
          }
        }

        function A(t) {
          if (Error.captureStackTrace) Error.captureStackTrace(this, A); else {
            var e = Error().stack;
            e && (this.stack = e);
          }
          t && (this.message = String(t));
        }

        function N(t, e) {
          for (var n = "", i = (t = t.split("%s")).length - 1, r = 0; r < i; r++) n += t[r] + (r < e.length ? e[r] : "%s");
          A.call(this, n + t[i]);
        }

        function O(t, e) {
          throw new N("Failure" + (t ? ": " + t : ""), Array.prototype.slice.call(arguments, 1))
        }

        function _(t, e) {
          this.c = t, this.f = e, this.b = 0, this.a = null;
        }

        function P(t, e) {
          t.f(e), t.b < 100 && (t.b++, e.next = t.a, t.a = e);
        }

        function C() {
          this.b = this.a = null;
        }

        E(A, Error), A.prototype.name = "CustomError", E(N, A), N.prototype.name = "AssertionError", _.prototype.get = function () {
          if (0 < this.b) {
            this.b--;
            var t = this.a;
            this.a = t.next, t.next = null;
          } else t = this.c();
          return t
        };
        var R = new _(function () {
          return new D
        }, function (t) {
          t.reset();
        });

        function D() {
          this.next = this.b = this.a = null;
        }

        C.prototype.add = function (t, e) {
          var n = R.get();
          n.set(t, e), this.b ? this.b.next = n : this.a = n, this.b = n;
        }, D.prototype.set = function (t, e) {
          this.a = t, this.b = e, this.next = null;
        }, D.prototype.reset = function () {
          this.next = this.b = this.a = null;
        };
        var L = Array.prototype.indexOf ? function (t, e) {
          return Array.prototype.indexOf.call(t, e, void 0)
        } : function (t, e) {
          if (h(t)) return h(e) && 1 == e.length ? t.indexOf(e, 0) : -1;
          for (var n = 0; n < t.length; n++) if (n in t && t[n] === e) return n;
          return -1
        }, x = Array.prototype.forEach ? function (t, e, n) {
          Array.prototype.forEach.call(t, e, n);
        } : function (t, e, n) {
          for (var i = t.length, r = h(t) ? t.split("") : t, o = 0; o < i; o++) o in r && e.call(n, r[o], o, t);
        };
        var M = Array.prototype.map ? function (t, e) {
          return Array.prototype.map.call(t, e, void 0)
        } : function (t, e) {
          for (var n = t.length, i = Array(n), r = h(t) ? t.split("") : t, o = 0; o < n; o++) o in r && (i[o] = e.call(void 0, r[o], o, t));
          return i
        }, j = Array.prototype.some ? function (t, e) {
          return Array.prototype.some.call(t, e, void 0)
        } : function (t, e) {
          for (var n = t.length, i = h(t) ? t.split("") : t, r = 0; r < n; r++) if (r in i && e.call(void 0, i[r], r, t)) return !0;
          return !1
        };

        function U(t, e) {
          return 0 <= L(t, e)
        }

        function V(t, e) {
          var n;
          return (n = 0 <= (e = L(t, e))) && Array.prototype.splice.call(t, e, 1), n
        }

        function K(n, i) {
          !function (t, e) {
            for (var n = h(t) ? t.split("") : t, i = t.length - 1; 0 <= i; --i) i in n && e.call(void 0, n[i], i, t);
          }(n, function (t, e) {
            i.call(void 0, t, e, n) && 1 == Array.prototype.splice.call(n, e, 1).length && 0;
          });
        }

        function F(t) {
          return Array.prototype.concat.apply([], arguments)
        }

        function q(t) {
          var e = t.length;
          if (0 < e) {
            for (var n = Array(e), i = 0; i < e; i++) n[i] = t[i];
            return n
          }
          return []
        }

        var H, B = String.prototype.trim ? function (t) {
          return t.trim()
        } : function (t) {
          return /^[\s\xa0]*([\s\S]*?)[\s\xa0]*$/.exec(t)[1]
        }, G = /&/g, W = /</g, X = />/g, J = /"/g, z = /'/g, Y = /\x00/g, $ = /[\x00&<>"']/;

        function Z(t, e) {
          return -1 != t.indexOf(e)
        }

        function Q(t, e) {
          return t < e ? -1 : e < t ? 1 : 0
        }

        t:{
          var tt = l.navigator;
          if (tt) {
            var et = tt.userAgent;
            if (et) {
              H = et;
              break t
            }
          }
          H = "";
        }

        function nt(t) {
          return Z(H, t)
        }

        function it(t, e) {
          for (var n in t) e.call(void 0, t[n], n, t);
        }

        function rt(t) {
          for (var e in t) return !1;
          return !0
        }

        function ot(t) {
          var e, n = {};
          for (e in t) n[e] = t[e];
          return n
        }

        var at, st,
          ut = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");

        function ct(t, e) {
          for (var n, i, r = 1; r < arguments.length; r++) {
            for (n in i = arguments[r]) t[n] = i[n];
            for (var o = 0; o < ut.length; o++) n = ut[o], Object.prototype.hasOwnProperty.call(i, n) && (t[n] = i[n]);
          }
        }

        function ht(t, e) {
          for (var n = t.split("%s"), i = "", r = Array.prototype.slice.call(arguments, 1); r.length && 1 < n.length;) i += n.shift() + r.shift();
          return i + n.join("%s")
        }

        function lt(t) {
          return $.test(t) && (-1 != t.indexOf("&") && (t = t.replace(G, "&amp;")), -1 != t.indexOf("<") && (t = t.replace(W, "&lt;")), -1 != t.indexOf(">") && (t = t.replace(X, "&gt;")), -1 != t.indexOf('"') && (t = t.replace(J, "&quot;")), -1 != t.indexOf("'") && (t = t.replace(z, "&#39;")), -1 != t.indexOf("\0") && (t = t.replace(Y, "&#0;"))), t
        }

        function ft(t) {
          l.setTimeout(function () {
            throw t
          }, 0);
        }

        function dt(t, e) {
          st || function () {
            if (l.Promise && l.Promise.resolve) {
              var t = l.Promise.resolve(void 0);
              st = function () {
                t.then(mt);
              };
            } else st = function () {
              var t = mt;
              !g(l.setImmediate) || l.Window && l.Window.prototype && !nt("Edge") && l.Window.prototype.setImmediate == l.setImmediate ? (at || (at = function () {
                var t = l.MessageChannel;
                if (void 0 === t && "undefined" != typeof window && window.postMessage && window.addEventListener && !nt("Presto") && (t = function () {
                  var t = document.createElement("IFRAME");
                  t.style.display = "none", t.src = "", document.documentElement.appendChild(t);
                  var e = t.contentWindow;
                  (t = e.document).open(), t.write(""), t.close();
                  var n = "callImmediate" + Math.random(),
                    i = "file:" == e.location.protocol ? "*" : e.location.protocol + "//" + e.location.host;
                  t = I(function (t) {
                    "*" != i && t.origin != i || t.data != n || this.port1.onmessage();
                  }, this), e.addEventListener("message", t, !1), this.port1 = {}, this.port2 = {
                    postMessage: function () {
                      e.postMessage(n, i);
                    }
                  };
                }), void 0 === t || nt("Trident") || nt("MSIE")) return "undefined" != typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function (t) {
                  var e = document.createElement("SCRIPT");
                  e.onreadystatechange = function () {
                    e.onreadystatechange = null, e.parentNode.removeChild(e), e = null, t(), t = null;
                  }, document.documentElement.appendChild(e);
                } : function (t) {
                  l.setTimeout(t, 0);
                };
                var e = new t, n = {}, i = n;
                return e.port1.onmessage = function () {
                  if (void 0 !== n.next) {
                    var t = (n = n.next).yb;
                    n.yb = null, t();
                  }
                }, function (t) {
                  i.next = {yb: t}, i = i.next, e.port2.postMessage(0);
                }
              }()), at(t)) : l.setImmediate(t);
            };
          }(), pt || (st(), pt = !0), vt.add(t, e);
        }

        var pt = !1, vt = new C;

        function mt() {
          for (var t; n = e = void 0, n = null, (e = vt).a && (n = e.a, e.a = e.a.next, e.a || (e.b = null), n.next = null), t = n;) {
            try {
              t.a.call(t.b);
            } catch (t) {
              ft(t);
            }
            P(R, t);
          }
          var e, n;
          pt = !1;
        }

        function gt(t, e) {
          if (this.a = bt, this.i = void 0, this.f = this.b = this.c = null, this.g = this.h = !1, t != s) try {
            var n = this;
            t.call(e, function (t) {
              Pt(n, yt, t);
            }, function (t) {
              if (!(t instanceof jt)) try {
                if (t instanceof Error) throw t;
                throw Error("Promise rejected.")
              } catch (t) {
              }
              Pt(n, wt, t);
            });
          } catch (t) {
            Pt(this, wt, t);
          }
        }

        var bt = 0, yt = 2, wt = 3;

        function It() {
          this.next = this.f = this.b = this.g = this.a = null, this.c = !1;
        }

        It.prototype.reset = function () {
          this.f = this.b = this.g = this.a = null, this.c = !1;
        };
        var Tt = new _(function () {
          return new It
        }, function (t) {
          t.reset();
        });

        function kt(t, e, n) {
          var i = Tt.get();
          return i.g = t, i.b = e, i.f = n, i
        }

        function Et(t) {
          if (t instanceof gt) return t;
          var e = new gt(s);
          return Pt(e, yt, t), e
        }

        function St(n) {
          return new gt(function (t, e) {
            e(n);
          })
        }

        function At(t, e, n) {
          Ct(t, e, n, null) || dt(T(e, t));
        }

        function Nt(n) {
          return new gt(function (i) {
            var r = n.length, o = [];
            if (r) for (var t = function (t, e, n) {
              r--, o[t] = e ? {Eb: !0, value: n} : {Eb: !1, reason: n}, 0 == r && i(o);
            }, e = 0; e < n.length; e++) At(n[e], T(t, e, !0), T(t, e, !1)); else i(o);
          })
        }

        function Ot(t, e) {
          t.b || t.a != yt && t.a != wt || Rt(t), t.f ? t.f.next = e : t.b = e, t.f = e;
        }

        function _t(t, r, o, a) {
          var e = kt(null, null, null);
          return e.a = new gt(function (n, i) {
            e.g = r ? function (t) {
              try {
                var e = r.call(a, t);
                n(e);
              } catch (t) {
                i(t);
              }
            } : n, e.b = o ? function (t) {
              try {
                var e = o.call(a, t);
                void 0 === e && t instanceof jt ? i(t) : n(e);
              } catch (t) {
                i(t);
              }
            } : i;
          }), Ot(e.a.c = t, e), e.a
        }

        function Pt(t, e, n) {
          var i, r;
          t.a == bt && (t === n && (e = wt, n = new TypeError("Promise cannot resolve to itself")), t.a = 1, Ct(n, t.Lc, t.Mc, t) || (t.i = n, t.a = e, t.c = null, Rt(t), e != wt || n instanceof jt || (r = n, (i = t).g = !0, dt(function () {
            i.g && Mt.call(null, r);
          }))));
        }

        function Ct(t, e, n, i) {
          if (t instanceof gt) return Ot(t, kt(e || s, n || null, i)), !0;
          if (S(t)) return t.then(e, n, i), !0;
          if (b(t)) try {
            var r = t.then;
            if (g(r)) return function (t, e, n, i, r) {
              function o(t) {
                a || (a = !0, i.call(r, t));
              }

              var a = !1;
              try {
                e.call(t, function (t) {
                  a || (a = !0, n.call(r, t));
                }, o);
              } catch (t) {
                o(t);
              }
            }(t, r, e, n, i), !0
          } catch (t) {
            return n.call(i, t), !0
          }
          return !1
        }

        function Rt(t) {
          t.h || (t.h = !0, dt(t.Xb, t));
        }

        function Dt(t) {
          var e = null;
          return t.b && (e = t.b, t.b = e.next, e.next = null), t.b || (t.f = null), e
        }

        function Lt(t, e, n, i) {
          if (n == wt && e.b && !e.c) for (; t && t.g; t = t.c) t.g = !1;
          if (e.a) e.a.c = null, xt(e, n, i); else try {
            e.c ? e.g.call(e.f) : xt(e, n, i);
          } catch (t) {
            Mt.call(null, t);
          }
          P(Tt, e);
        }

        function xt(t, e, n) {
          e == yt ? t.g.call(t.f, n) : t.b && t.b.call(t.f, n);
        }

        gt.prototype.then = function (t, e, n) {
          return _t(this, g(t) ? t : null, g(e) ? e : null, n)
        }, gt.prototype.$goog_Thenable = !0, (t = gt.prototype).ia = function (t, e) {
          return (t = kt(t, t, e)).c = !0, Ot(this, t), this
        }, t.s = function (t, e) {
          return _t(this, null, t, e)
        }, t.cancel = function (t) {
          this.a == bt && dt(function () {
            !function t(e, n) {
              if (e.a == bt) if (e.c) {
                var i = e.c;
                if (i.b) {
                  for (var r = 0, o = null, a = null, s = i.b; s && (s.c || (r++, s.a == e && (o = s), !(o && 1 < r))); s = s.next) o || (a = s);
                  o && (i.a == bt && 1 == r ? t(i, n) : (a ? ((r = a).next == i.f && (i.f = r), r.next = r.next.next) : Dt(i), Lt(i, o, wt, n)));
                }
                e.c = null;
              } else Pt(e, wt, n);
            }(this, new jt(t));
          }, this);
        }, t.Lc = function (t) {
          this.a = bt, Pt(this, yt, t);
        }, t.Mc = function (t) {
          this.a = bt, Pt(this, wt, t);
        }, t.Xb = function () {
          for (var t; t = Dt(this);) Lt(this, t, this.a, this.i);
          this.h = !1;
        };
        var Mt = ft;

        function jt(t) {
          A.call(this, t);
        }

        function Ut() {
          this.qa = this.qa, this.ja = this.ja;
        }

        E(jt, A);
        var Vt = 0;

        function Kt(t) {
          if (!t.qa && (t.qa = !0, t.va(), 0 != Vt)) t[e] || (t[e] = ++r);
        }

        function Ft(t) {
          return Ft[" "](t), t
        }

        Ut.prototype.qa = !(jt.prototype.name = "cancel"), Ut.prototype.va = function () {
          if (this.ja) for (; this.ja.length;) this.ja.shift()();
        }, Ft[" "] = s;
        var qt, Ht, Bt = nt("Opera"), Gt = nt("Trident") || nt("MSIE"), Wt = nt("Edge"), Xt = Wt || Gt,
          Jt = nt("Gecko") && !(Z(H.toLowerCase(), "webkit") && !nt("Edge")) && !(nt("Trident") || nt("MSIE")) && !nt("Edge"),
          zt = Z(H.toLowerCase(), "webkit") && !nt("Edge");

        function Yt() {
          var t = l.document;
          return t ? t.documentMode : void 0
        }

        t:{
          var $t = "",
            Zt = (Ht = H, Jt ? /rv:([^\);]+)(\)|;)/.exec(Ht) : Wt ? /Edge\/([\d\.]+)/.exec(Ht) : Gt ? /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(Ht) : zt ? /WebKit\/(\S+)/.exec(Ht) : Bt ? /(?:Version)[ \/]?(\S+)/.exec(Ht) : void 0);
          if (Zt && ($t = Zt ? Zt[1] : ""), Gt) {
            var Qt = Yt();
            if (null != Qt && Qt > parseFloat($t)) {
              qt = String(Qt);
              break t
            }
          }
          qt = $t;
        }
        var te, ee = {};

        function ne(s) {
          return t = s, e = function () {
            for (var t = 0, e = B(String(qt)).split("."), n = B(String(s)).split("."), i = Math.max(e.length, n.length), r = 0; 0 == t && r < i; r++) {
              var o = e[r] || "", a = n[r] || "";
              do {
                if (o = /(\d*)(\D*)(.*)/.exec(o) || ["", "", "", ""], a = /(\d*)(\D*)(.*)/.exec(a) || ["", "", "", ""], 0 == o[0].length && 0 == a[0].length) break;
                t = Q(0 == o[1].length ? 0 : parseInt(o[1], 10), 0 == a[1].length ? 0 : parseInt(a[1], 10)) || Q(0 == o[2].length, 0 == a[2].length) || Q(o[2], a[2]), o = o[3], a = a[3];
              } while (0 == t)
            }
            return 0 <= t
          }, n = ee, Object.prototype.hasOwnProperty.call(n, t) ? n[t] : n[t] = e(t);
          var t, e, n;
        }

        var ie = l.document;
        te = ie && Gt ? Yt() || ("CSS1Compat" == ie.compatMode ? parseInt(qt, 10) : 5) : void 0;
        var re = Object.freeze || function (t) {
          return t
        }, oe = !Gt || 9 <= Number(te), ae = Gt && !ne("9"), se = function () {
          if (!l.addEventListener || !Object.defineProperty) return !1;
          var t = !1, e = Object.defineProperty({}, "passive", {
            get: function () {
              t = !0;
            }
          });
          try {
            l.addEventListener("test", s, e), l.removeEventListener("test", s, e);
          } catch (t) {
          }
          return t
        }();

        function ue(t, e) {
          this.type = t, this.b = this.target = e, this.Kb = !0;
        }

        function ce(t, e) {
          if (ue.call(this, t ? t.type : ""), this.relatedTarget = this.b = this.target = null, this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0, this.key = "", this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1, this.pointerId = 0, this.pointerType = "", this.a = null, t) {
            var n = this.type = t.type, i = t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : null;
            if (this.target = t.target || t.srcElement, this.b = e, e = t.relatedTarget) {
              if (Jt) {
                t:{
                  try {
                    Ft(e.nodeName);
                    var r = !0;
                    break t
                  } catch (t) {
                  }
                  r = !1;
                }
                r || (e = null);
              }
            } else "mouseover" == n ? e = t.fromElement : "mouseout" == n && (e = t.toElement);
            this.relatedTarget = e, this.screenY = i ? (this.clientX = void 0 !== i.clientX ? i.clientX : i.pageX, this.clientY = void 0 !== i.clientY ? i.clientY : i.pageY, this.screenX = i.screenX || 0, i.screenY || 0) : (this.clientX = void 0 !== t.clientX ? t.clientX : t.pageX, this.clientY = void 0 !== t.clientY ? t.clientY : t.pageY, this.screenX = t.screenX || 0, t.screenY || 0), this.button = t.button, this.key = t.key || "", this.ctrlKey = t.ctrlKey, this.altKey = t.altKey, this.shiftKey = t.shiftKey, this.metaKey = t.metaKey, this.pointerId = t.pointerId || 0, this.pointerType = h(t.pointerType) ? t.pointerType : he[t.pointerType] || "", (this.a = t).defaultPrevented && this.preventDefault();
          }
        }

        ue.prototype.preventDefault = function () {
          this.Kb = !1;
        }, E(ce, ue);
        var he = re({2: "touch", 3: "pen", 4: "mouse"});
        ce.prototype.preventDefault = function () {
          ce.qb.preventDefault.call(this);
          var t = this.a;
          if (t.preventDefault) t.preventDefault(); else if (t.returnValue = !1, ae) try {
            (t.ctrlKey || 112 <= t.keyCode && t.keyCode <= 123) && (t.keyCode = -1);
          } catch (t) {
          }
        }, ce.prototype.f = function () {
          return this.a
        };
        var le = "closure_listenable_" + (1e6 * Math.random() | 0), fe = 0;

        function de(t, e, n, i, r) {
          this.listener = t, this.proxy = null, this.src = e, this.type = n, this.capture = !!i, this.Na = r, this.key = ++fe, this.oa = this.Ia = !1;
        }

        function pe(t) {
          t.oa = !0, t.listener = null, t.proxy = null, t.src = null, t.Na = null;
        }

        function ve(t) {
          this.src = t, this.a = {}, this.b = 0;
        }

        function me(t, e) {
          var n = e.type;
          n in t.a && V(t.a[n], e) && (pe(e), 0 == t.a[n].length && (delete t.a[n], t.b--));
        }

        function ge(t, e, n, i) {
          for (var r = 0; r < t.length; ++r) {
            var o = t[r];
            if (!o.oa && o.listener == e && o.capture == !!n && o.Na == i) return r
          }
          return -1
        }

        ve.prototype.add = function (t, e, n, i, r) {
          var o = t.toString();
          (t = this.a[o]) || (t = this.a[o] = [], this.b++);
          var a = ge(t, e, i, r);
          return -1 < a ? (e = t[a], n || (e.Ia = !1)) : ((e = new de(e, this.src, o, !!i, r)).Ia = n, t.push(e)), e
        };
        var be = "closure_lm_" + (1e6 * Math.random() | 0), ye = {};

        function we(t, e, n, i, r) {
          if (i && i.once) Te(t, e, n, i, r); else if (v(e)) for (var o = 0; o < e.length; o++) we(t, e[o], n, i, r); else n = Ce(n), t && t[le] ? De(t, e, n, b(i) ? !!i.capture : !!i, r) : Ie(t, e, n, !1, i, r);
        }

        function Ie(t, e, n, i, r, o) {
          if (!e) throw Error("Invalid event type");
          var a, s, u = b(r) ? !!r.capture : !!r, c = _e(t);
          if (c || (t[be] = c = new ve(t)), !(n = c.add(e, n, i, u, o)).proxy) if (a = Oe, i = s = oe ? function (t) {
            return a.call(s.src, s.listener, t)
          } : function (t) {
            if (!(t = a.call(s.src, s.listener, t))) return t
          }, (n.proxy = i).src = t, i.listener = n, t.addEventListener) se || (r = u), void 0 === r && (r = !1), t.addEventListener(e.toString(), i, r); else if (t.attachEvent) t.attachEvent(Se(e.toString()), i); else {
            if (!t.addListener || !t.removeListener) throw Error("addEventListener and attachEvent are unavailable.");
            t.addListener(i);
          }
        }

        function Te(t, e, n, i, r) {
          if (v(e)) for (var o = 0; o < e.length; o++) Te(t, e[o], n, i, r); else n = Ce(n), t && t[le] ? Le(t, e, n, b(i) ? !!i.capture : !!i, r) : Ie(t, e, n, !0, i, r);
        }

        function ke(t, e, n, i, r) {
          if (v(e)) for (var o = 0; o < e.length; o++) ke(t, e[o], n, i, r); else i = b(i) ? !!i.capture : !!i, n = Ce(n), t && t[le] ? (t = t.m, (e = String(e).toString()) in t.a && (-1 < (n = ge(o = t.a[e], n, i, r)) && (pe(o[n]), Array.prototype.splice.call(o, n, 1), 0 == o.length && (delete t.a[e], t.b--)))) : t && (t = _e(t)) && (e = t.a[e.toString()], t = -1, e && (t = ge(e, n, i, r)), (n = -1 < t ? e[t] : null) && Ee(n));
        }

        function Ee(t) {
          if ("number" != typeof t && t && !t.oa) {
            var e = t.src;
            if (e && e[le]) me(e.m, t); else {
              var n = t.type, i = t.proxy;
              e.removeEventListener ? e.removeEventListener(n, i, t.capture) : e.detachEvent ? e.detachEvent(Se(n), i) : e.addListener && e.removeListener && e.removeListener(i), (n = _e(e)) ? (me(n, t), 0 == n.b && (n.src = null, e[be] = null)) : pe(t);
            }
          }
        }

        function Se(t) {
          return t in ye ? ye[t] : ye[t] = "on" + t
        }

        function Ae(t, e, n, i) {
          var r = !0;
          if ((t = _e(t)) && (e = t.a[e.toString()])) for (e = e.concat(), t = 0; t < e.length; t++) {
            var o = e[t];
            o && o.capture == n && !o.oa && (o = Ne(o, i), r = r && !1 !== o);
          }
          return r
        }

        function Ne(t, e) {
          var n = t.listener, i = t.Na || t.src;
          return t.Ia && Ee(t), n.call(i, e)
        }

        function Oe(t, e) {
          if (t.oa) return !0;
          if (oe) return Ne(t, new ce(e, this));
          if (!e) t:{
            e = ["window", "event"];
            for (var n = l, i = 0; i < e.length; i++) if (null == (n = n[e[i]])) {
              e = null;
              break t
            }
            e = n;
          }
          if (e = new ce(i = e, this), n = !0, !(i.keyCode < 0 || null != i.returnValue)) {
            t:{
              var r = !1;
              if (0 == i.keyCode) try {
                i.keyCode = -1;
                break t
              } catch (t) {
                r = !0;
              }
              (r || null == i.returnValue) && (i.returnValue = !0);
            }
            for (i = [], r = e.b; r; r = r.parentNode) i.push(r);
            for (t = t.type, r = i.length - 1; 0 <= r; r--) {
              e.b = i[r];
              var o = Ae(i[r], t, !0, e);
              n = n && o;
            }
            for (r = 0; r < i.length; r++) e.b = i[r], o = Ae(i[r], t, !1, e), n = n && o;
          }
          return n
        }

        function _e(t) {
          return (t = t[be]) instanceof ve ? t : null
        }

        var Pe = "__closure_events_fn_" + (1e9 * Math.random() >>> 0);

        function Ce(e) {
          return g(e) ? e : (e[Pe] || (e[Pe] = function (t) {
            return e.handleEvent(t)
          }), e[Pe])
        }

        function Re() {
          Ut.call(this), this.m = new ve(this), (this.Qb = this).Va = null;
        }

        function De(t, e, n, i, r) {
          t.m.add(String(e), n, !1, i, r);
        }

        function Le(t, e, n, i, r) {
          t.m.add(String(e), n, !0, i, r);
        }

        function xe(t, e, n, i) {
          if (!(e = t.m.a[String(e)])) return !0;
          e = e.concat();
          for (var r = !0, o = 0; o < e.length; ++o) {
            var a = e[o];
            if (a && !a.oa && a.capture == n) {
              var s = a.listener, u = a.Na || a.src;
              a.Ia && me(t.m, a), r = !1 !== s.call(u, i) && r;
            }
          }
          return r && 0 != i.Kb
        }

        function Me(t, e, n) {
          if (g(t)) n && (t = I(t, n)); else {
            if (!t || "function" != typeof t.handleEvent) throw Error("Invalid listener argument");
            t = I(t.handleEvent, t);
          }
          return 2147483647 < Number(e) ? -1 : l.setTimeout(t, e || 0)
        }

        function je(n) {
          var i = null;
          return new gt(function (t, e) {
            -1 == (i = Me(function () {
              t(void 0);
            }, n)) && e(Error("Failed to schedule timer."));
          }).s(function (t) {
            throw (l.clearTimeout(i), t)
          });
        }

        function Ue(t) {
          if (t.S && "function" == typeof t.S) return t.S();
          if (h(t)) return t.split("");
          if (m(t)) {
            for (var e = [], n = t.length, i = 0; i < n; i++) e.push(t[i]);
            return e
          }
          for (i in (e = [], n = 0, t)) e[n++] = t[i];
          return e
        }

        function Ve(t) {
          if (t.U && "function" == typeof t.U) return t.U();
          if (!t.S || "function" != typeof t.S) {
            if (m(t) || h(t)) {
              var e = [];
              t = t.length;
              for (var n = 0; n < t; n++) e.push(n);
              return e
            }
            for (var i in (e = [], n = 0, t)) e[n++] = i;
            return e
          }
        }

        function Ke(t, e) {
          this.b = {}, this.a = [], this.c = 0;
          var n = arguments.length;
          if (1 < n) {
            if (n % 2) throw Error("Uneven number of arguments");
            for (var i = 0; i < n; i += 2) this.set(arguments[i], arguments[i + 1]);
          } else if (t) if (t instanceof Ke) for (n = t.U(), i = 0; i < n.length; i++) this.set(n[i], t.get(n[i])); else for (i in t) this.set(i, t[i]);
        }

        function Fe(t) {
          if (t.c != t.a.length) {
            for (var e = 0, n = 0; e < t.a.length;) {
              var i = t.a[e];
              qe(t.b, i) && (t.a[n++] = i), e++;
            }
            t.a.length = n;
          }
          if (t.c != t.a.length) {
            var r = {};
            for (n = e = 0; e < t.a.length;) qe(r, i = t.a[e]) || (r[t.a[n++] = i] = 1), e++;
            t.a.length = n;
          }
        }

        function qe(t, e) {
          return Object.prototype.hasOwnProperty.call(t, e)
        }

        E(Re, Ut), Re.prototype[le] = !0, Re.prototype.addEventListener = function (t, e, n, i) {
          we(this, t, e, n, i);
        }, Re.prototype.removeEventListener = function (t, e, n, i) {
          ke(this, t, e, n, i);
        }, Re.prototype.dispatchEvent = function (t) {
          var e, n = this.Va;
          if (n) for (e = []; n; n = n.Va) e.push(n);
          n = this.Qb;
          var i = t.type || t;
          if (h(t)) t = new ue(t, n); else if (t instanceof ue) t.target = t.target || n; else {
            var r = t;
            ct(t = new ue(i, n), r);
          }
          if (r = !0, e) for (var o = e.length - 1; 0 <= o; o--) {
            var a = t.b = e[o];
            r = xe(a, i, !0, t) && r;
          }
          if (r = xe(a = t.b = n, i, !0, t) && r, r = xe(a, i, !1, t) && r, e) for (o = 0; o < e.length; o++) r = xe(a = t.b = e[o], i, !1, t) && r;
          return r
        }, Re.prototype.va = function () {
          if (Re.qb.va.call(this), this.m) {
            var t, e = this.m;
            for (t in e.a) {
              for (var n = e.a[t], i = 0; i < n.length; i++) pe(n[i]);
              delete e.a[t], e.b--;
            }
          }
          this.Va = null;
        }, (t = Ke.prototype).S = function () {
          Fe(this);
          for (var t = [], e = 0; e < this.a.length; e++) t.push(this.b[this.a[e]]);
          return t
        }, t.U = function () {
          return Fe(this), this.a.concat()
        }, t.clear = function () {
          this.b = {}, this.c = this.a.length = 0;
        }, t.get = function (t, e) {
          return qe(this.b, t) ? this.b[t] : e
        }, t.set = function (t, e) {
          qe(this.b, t) || (this.c++, this.a.push(t)), this.b[t] = e;
        }, t.forEach = function (t, e) {
          for (var n = this.U(), i = 0; i < n.length; i++) {
            var r = n[i], o = this.get(r);
            t.call(e, o, r, this);
          }
        };
        var He = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#([\s\S]*))?$/;

        function Be(t, e) {
          var n;
          this.b = this.i = this.f = "", this.m = null, this.g = this.c = "", this.h = !1, t instanceof Be ? (this.h = void 0 !== e ? e : t.h, Ge(this, t.f), this.i = t.i, this.b = t.b, We(this, t.m), this.c = t.c, Xe(this, dn(t.a)), this.g = t.g) : t && (n = String(t).match(He)) ? (this.h = !!e, Ge(this, n[1] || "", !0), this.i = Ze(n[2] || ""), this.b = Ze(n[3] || "", !0), We(this, n[4]), this.c = Ze(n[5] || "", !0), Xe(this, n[6] || "", !0), this.g = Ze(n[7] || "")) : (this.h = !!e, this.a = new sn(null, this.h));
        }

        function Ge(t, e, n) {
          t.f = n ? Ze(e, !0) : e, t.f && (t.f = t.f.replace(/:$/, ""));
        }

        function We(t, e) {
          if (e) {
            if (e = Number(e), isNaN(e) || e < 0) throw Error("Bad port number " + e);
            t.m = e;
          } else t.m = null;
        }

        function Xe(t, e, n) {
          var i, r;
          e instanceof sn ? (t.a = e, i = t.a, (r = t.h) && !i.f && (un(i), i.c = null, i.a.forEach(function (t, e) {
            var n = e.toLowerCase();
            e != n && (hn(this, e), fn(this, n, t));
          }, i)), i.f = r) : (n || (e = Qe(e, on)), t.a = new sn(e, t.h));
        }

        function Je(t, e, n) {
          t.a.set(e, n);
        }

        function ze(t, e) {
          return t.a.get(e)
        }

        function Ye(t) {
          return t instanceof Be ? new Be(t) : new Be(t, void 0)
        }

        function $e(t, e) {
          var n = new Be(null, void 0);
          return Ge(n, "https"), t && (n.b = t), e && (n.c = e), n
        }

        function Ze(t, e) {
          return t ? e ? decodeURI(t.replace(/%25/g, "%2525")) : decodeURIComponent(t) : ""
        }

        function Qe(t, e, n) {
          return h(t) ? (t = encodeURI(t).replace(e, tn), n && (t = t.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), t) : null
        }

        function tn(t) {
          return "%" + ((t = t.charCodeAt(0)) >> 4 & 15).toString(16) + (15 & t).toString(16)
        }

        Be.prototype.toString = function () {
          var t = [], e = this.f;
          e && t.push(Qe(e, en, !0), ":");
          var n = this.b;
          return (n || "file" == e) && (t.push("//"), (e = this.i) && t.push(Qe(e, en, !0), "@"), t.push(encodeURIComponent(String(n)).replace(/%25([0-9a-fA-F]{2})/g, "%$1")), null != (n = this.m) && t.push(":", String(n))), (n = this.c) && (this.b && "/" != n.charAt(0) && t.push("/"), t.push(Qe(n, "/" == n.charAt(0) ? rn : nn, !0))), (n = this.a.toString()) && t.push("?", n), (n = this.g) && t.push("#", Qe(n, an)), t.join("")
        }, Be.prototype.resolve = function (t) {
          var e = new Be(this), n = !!t.f;
          n ? Ge(e, t.f) : n = !!t.i, n ? e.i = t.i : n = !!t.b, n ? e.b = t.b : n = null != t.m;
          var i = t.c;
          if (n) We(e, t.m); else if (n = !!t.c) {
            if ("/" != i.charAt(0)) if (this.b && !this.c) i = "/" + i; else {
              var r = e.c.lastIndexOf("/");
              -1 != r && (i = e.c.substr(0, r + 1) + i);
            }
            if (".." == (r = i) || "." == r) i = ""; else if (Z(r, "./") || Z(r, "/.")) {
              i = 0 == r.lastIndexOf("/", 0), r = r.split("/");
              for (var o = [], a = 0; a < r.length;) {
                var s = r[a++];
                "." == s ? i && a == r.length && o.push("") : ".." == s ? ((1 < o.length || 1 == o.length && "" != o[0]) && o.pop(), i && a == r.length && o.push("")) : (o.push(s), i = !0);
              }
              i = o.join("/");
            } else i = r;
          }
          return n ? e.c = i : n = "" !== t.a.toString(), n ? Xe(e, dn(t.a)) : n = !!t.g, n && (e.g = t.g), e
        };
        var en = /[#\/\?@]/g, nn = /[#\?:]/g, rn = /[#\?]/g, on = /[#\?@]/g, an = /#/g;

        function sn(t, e) {
          this.b = this.a = null, this.c = t || null, this.f = !!e;
        }

        function un(n) {
          n.a || (n.a = new Ke, n.b = 0, n.c && function (t, e) {
            if (t) {
              t = t.split("&");
              for (var n = 0; n < t.length; n++) {
                var i = t[n].indexOf("="), r = null;
                if (0 <= i) {
                  var o = t[n].substring(0, i);
                  r = t[n].substring(i + 1);
                } else o = t[n];
                e(o, r ? decodeURIComponent(r.replace(/\+/g, " ")) : "");
              }
            }
          }(n.c, function (t, e) {
            n.add(decodeURIComponent(t.replace(/\+/g, " ")), e);
          }));
        }

        function cn(t) {
          var e = Ve(t);
          if (void 0 === e) throw Error("Keys are undefined");
          var n = new sn(null, void 0);
          t = Ue(t);
          for (var i = 0; i < e.length; i++) {
            var r = e[i], o = t[i];
            v(o) ? fn(n, r, o) : n.add(r, o);
          }
          return n
        }

        function hn(t, e) {
          un(t), e = pn(t, e), qe(t.a.b, e) && (t.c = null, t.b -= t.a.get(e).length, qe((t = t.a).b, e) && (delete t.b[e], t.c--, t.a.length > 2 * t.c && Fe(t)));
        }

        function ln(t, e) {
          return un(t), e = pn(t, e), qe(t.a.b, e)
        }

        function fn(t, e, n) {
          hn(t, e), 0 < n.length && (t.c = null, t.a.set(pn(t, e), q(n)), t.b += n.length);
        }

        function dn(t) {
          var e = new sn;
          return e.c = t.c, t.a && (e.a = new Ke(t.a), e.b = t.b), e
        }

        function pn(t, e) {
          return e = String(e), t.f && (e = e.toLowerCase()), e
        }

        (t = sn.prototype).add = function (t, e) {
          un(this), this.c = null, t = pn(this, t);
          var n = this.a.get(t);
          return n || this.a.set(t, n = []), n.push(e), this.b += 1, this
        }, t.clear = function () {
          this.a = this.c = null, this.b = 0;
        }, t.forEach = function (n, i) {
          un(this), this.a.forEach(function (t, e) {
            x(t, function (t) {
              n.call(i, t, e, this);
            }, this);
          }, this);
        }, t.U = function () {
          un(this);
          for (var t = this.a.S(), e = this.a.U(), n = [], i = 0; i < e.length; i++) for (var r = t[i], o = 0; o < r.length; o++) n.push(e[i]);
          return n
        }, t.S = function (t) {
          un(this);
          var e = [];
          if (h(t)) ln(this, t) && (e = F(e, this.a.get(pn(this, t)))); else {
            t = this.a.S();
            for (var n = 0; n < t.length; n++) e = F(e, t[n]);
          }
          return e
        }, t.set = function (t, e) {
          return un(this), this.c = null, ln(this, t = pn(this, t)) && (this.b -= this.a.get(t).length), this.a.set(t, [e]), this.b += 1, this
        }, t.get = function (t, e) {
          return t && 0 < (t = this.S(t)).length ? String(t[0]) : e
        }, t.toString = function () {
          if (this.c) return this.c;
          if (!this.a) return "";
          for (var t = [], e = this.a.U(), n = 0; n < e.length; n++) {
            var i = e[n], r = encodeURIComponent(String(i));
            i = this.S(i);
            for (var o = 0; o < i.length; o++) {
              var a = r;
              "" !== i[o] && (a += "=" + encodeURIComponent(String(i[o]))), t.push(a);
            }
          }
          return this.c = t.join("&")
        };
        var vn = !Gt || 9 <= Number(te);

        function mn(t, e) {
          this.a = t === yn && e || "", this.b = bn;
        }

        function gn(t) {
          return t instanceof mn && t.constructor === mn && t.b === bn ? t.a : (O("expected object of type Const, got '" + t + "'"), "type_error:Const")
        }

        mn.prototype.na = !0, mn.prototype.ma = function () {
          return this.a
        }, mn.prototype.toString = function () {
          return "Const{" + this.a + "}"
        };
        var bn = {}, yn = {};

        function wn() {
          this.a = "", this.b = Sn;
        }

        function In(t) {
          return t instanceof wn && t.constructor === wn && t.b === Sn ? t.a : (O("expected object of type TrustedResourceUrl, got '" + t + "' of type " + p(t)), "type_error:TrustedResourceUrl")
        }

        function Tn(t, n) {
          var e, i, r = gn(t);
          if (!En.test(r)) throw Error("Invalid TrustedResourceUrl format: " + r);
          return t = r.replace(kn, function (t, e) {
            if (!Object.prototype.hasOwnProperty.call(n, e)) throw Error('Found marker, "' + e + '", in format string, "' + r + '", but no valid label mapping found in args: ' + JSON.stringify(n));
            return (t = n[e]) instanceof mn ? gn(t) : encodeURIComponent(String(t))
          }), e = t, (i = new wn).a = e, i
        }

        wn.prototype.na = !0, wn.prototype.ma = function () {
          return this.a.toString()
        }, wn.prototype.toString = function () {
          return "TrustedResourceUrl{" + this.a + "}"
        };
        var kn = /%{(\w+)}/g, En = /^((https:)?\/\/[0-9a-z.:[\]-]+\/|\/[^/\\]|[^:/\\%]+\/|[^:/\\%]*[?#]|about:blank#)/i,
          Sn = {};

        function An() {
          this.a = "", this.b = Pn;
        }

        function Nn(t) {
          return t instanceof An && t.constructor === An && t.b === Pn ? t.a : (O("expected object of type SafeUrl, got '" + t + "' of type " + p(t)), "type_error:SafeUrl")
        }

        An.prototype.na = !0, An.prototype.ma = function () {
          return this.a.toString()
        }, An.prototype.toString = function () {
          return "SafeUrl{" + this.a + "}"
        };
        var On = /^(?:(?:https?|mailto|ftp):|[^:/?#]*(?:[/?#]|$))/i;

        function _n(t) {
          return t instanceof An ? t : (t = "object" == typeof t && t.na ? t.ma() : String(t), On.test(t) || (t = "about:invalid#zClosurez"), Cn(t))
        }

        var Pn = {};

        function Cn(t) {
          var e = new An;
          return e.a = t, e
        }

        function Rn() {
          this.a = "", this.b = Dn;
        }

        Cn("about:blank"), Rn.prototype.na = !0, Rn.prototype.ma = function () {
          return this.a.toString()
        }, Rn.prototype.toString = function () {
          return "SafeHtml{" + this.a + "}"
        };
        var Dn = {};

        function Ln(t) {
          var e = new Rn;
          return e.a = t, e
        }

        function xn(t) {
          var e = document;
          return h(t) ? e.getElementById(t) : t
        }

        function Mn(n, t) {
          it(t, function (t, e) {
            t && "object" == typeof t && t.na && (t = t.ma()), "style" == e ? n.style.cssText = t : "class" == e ? n.className = t : "for" == e ? n.htmlFor = t : jn.hasOwnProperty(e) ? n.setAttribute(jn[e], t) : 0 == e.lastIndexOf("aria-", 0) || 0 == e.lastIndexOf("data-", 0) ? n.setAttribute(e, t) : n[e] = t;
          });
        }

        Ln("<!DOCTYPE html>"), Ln(""), Ln("<br>");
        var jn = {
          cellpadding: "cellPadding",
          cellspacing: "cellSpacing",
          colspan: "colSpan",
          frameborder: "frameBorder",
          height: "height",
          maxlength: "maxLength",
          nonce: "nonce",
          role: "role",
          rowspan: "rowSpan",
          type: "type",
          usemap: "useMap",
          valign: "vAlign",
          width: "width"
        };

        function Un(t, e, n) {
          var i = arguments, r = document, o = String(i[0]), a = i[1];
          if (!vn && a && (a.name || a.type)) {
            if (o = ["<", o], a.name && o.push(' name="', lt(a.name), '"'), a.type) {
              o.push(' type="', lt(a.type), '"');
              var s = {};
              ct(s, a), delete s.type, a = s;
            }
            o.push(">"), o = o.join("");
          }
          return o = r.createElement(o), a && (h(a) ? o.className = a : v(a) ? o.className = a.join(" ") : Mn(o, a)), 2 < i.length && function (e, n, t) {
            function i(t) {
              t && n.appendChild(h(t) ? e.createTextNode(t) : t);
            }

            for (var r = 2; r < t.length; r++) {
              var o = t[r];
              !m(o) || b(o) && 0 < o.nodeType ? i(o) : x(Vn(o) ? q(o) : o, i);
            }
          }(r, o, i), o
        }

        function Vn(t) {
          if (t && "number" == typeof t.length) {
            if (b(t)) return "function" == typeof t.item || "string" == typeof t.item;
            if (g(t)) return "function" == typeof t.item
          }
          return !1
        }

        function Kn(t) {
          var e = [];
          return function t(e, n, i) {
            if (null == n) i.push("null"); else {
              if ("object" == typeof n) {
                if (v(n)) {
                  var r = n;
                  n = r.length, i.push("[");
                  for (var o = "", a = 0; a < n; a++) i.push(o), t(e, r[a], i), o = ",";
                  return void i.push("]")
                }
                if (!(n instanceof String || n instanceof Number || n instanceof Boolean)) {
                  for (r in (i.push("{"), o = "", n)) Object.prototype.hasOwnProperty.call(n, r) && ("function" != typeof (a = n[r]) && (i.push(o), Bn(r, i), i.push(":"), t(e, a, i), o = ","));
                  return void i.push("}")
                }
                n = n.valueOf();
              }
              switch (typeof n) {
                case"string":
                  Bn(n, i);
                  break;
                case"number":
                  i.push(isFinite(n) && !isNaN(n) ? String(n) : "null");
                  break;
                case"boolean":
                  i.push(String(n));
                  break;
                case"function":
                  i.push("null");
                  break;
                default:
                  throw Error("Unknown type: " + typeof n)
              }
            }
          }(new Fn, t, e), e.join("");
        }

        function Fn() {
        }

        var qn = {
          '"': '\\"',
          "\\": "\\\\",
          "/": "\\/",
          "\b": "\\b",
          "\f": "\\f",
          "\n": "\\n",
          "\r": "\\r",
          "\t": "\\t",
          "\v": "\\u000b"
        }, Hn = /\uffff/.test("￿") ? /[\\"\x00-\x1f\x7f-\uffff]/g : /[\\"\x00-\x1f\x7f-\xff]/g;

        function Bn(t, e) {
          e.push('"', t.replace(Hn, function (t) {
            var e = qn[t];
            return e || (e = "\\u" + (65536 | t.charCodeAt(0)).toString(16).substr(1), qn[t] = e), e
          }), '"');
        }

        function Gn() {
          var t = hi();
          return Gt && !!te && 11 == te || /Edge\/\d+/.test(t)
        }

        function Wn() {
          return l.window && l.window.location.href || self && self.location && self.location.href || ""
        }

        function Xn(t, e) {
          e = e || l.window;
          var n = "about:blank";
          t && (n = Nn(_n(t)).toString()), e.location.href = n;
        }

        function Jn(t) {
          return !!((t = (t || hi()).toLowerCase()).match(/android/) || t.match(/webos/) || t.match(/iphone|ipad|ipod/) || t.match(/blackberry/) || t.match(/windows phone/) || t.match(/iemobile/))
        }

        function zn(t) {
          t = t || l.window;
          try {
            t.close();
          } catch (t) {
          }
        }

        function Yn(t, e, n) {
          var i = Math.floor(1e9 * Math.random()).toString();
          e = e || 500, n = n || 600;
          var r = (window.screen.availHeight - n) / 2, o = (window.screen.availWidth - e) / 2;
          for (s in (e = {
            width: e,
            height: n,
            top: 0 < r ? r : 0,
            left: 0 < o ? o : 0,
            location: !0,
            resizable: !0,
            statusbar: !0,
            toolbar: !1
          }, n = hi().toLowerCase(), i && (e.target = i, Z(n, "crios/") && (e.target = "_blank")), si(hi()) == oi && (t = t || "http://localhost", e.scrollbars = !0), n = t || "", (t = e) || (t = {}), i = window, e = n instanceof An ? n : _n(void 0 !== n.href ? n.href : String(n)), n = t.target || n.target, r = [], t)) switch (s) {
            case"width":
            case"height":
            case"top":
            case"left":
              r.push(s + "=" + t[s]);
              break;
            case"target":
            case"noopener":
            case"noreferrer":
              break;
            default:
              r.push(s + "=" + (t[s] ? 1 : 0));
          }
          var a, s = r.join(",");
          if ((nt("iPhone") && !nt("iPod") && !nt("iPad") || nt("iPad") || nt("iPod")) && i.navigator && i.navigator.standalone && n && "_self" != n ? (s = i.document.createElement("A"), e instanceof An || e instanceof An || (e = "object" == typeof e && e.na ? e.ma() : String(e), On.test(e) || (e = "about:invalid#zClosurez"), e = Cn(e)), s.href = Nn(e), s.setAttribute("target", n), t.noreferrer && s.setAttribute("rel", "noreferrer"), (t = document.createEvent("MouseEvent")).initMouseEvent("click", !0, !0, i, 1), s.dispatchEvent(t), s = {}) : t.noreferrer ? (s = i.open("", n, s), t = Nn(e).toString(), s && (Xt && Z(t, ";") && (t = "'" + t.replace(/'/g, "%27") + "'"), s.opener = null, t = Ln('<meta name="referrer" content="no-referrer"><meta http-equiv="refresh" content="0; url=' + lt(t) + '">'), s.document.write((a = t) instanceof Rn && a.constructor === Rn && a.b === Dn ? a.a : (O("expected object of type SafeHtml, got '" + a + "' of type " + p(a)), "type_error:SafeHtml")), s.document.close())) : (s = i.open(Nn(e).toString(), n, s)) && t.noopener && (s.opener = null), s) try {
            s.focus();
          } catch (t) {
          }
          return s
        }

        var $n = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/, Zn = /^[^@]+@[^@]+$/;

        function Qn() {
          var e = null;
          return new gt(function (t) {
            "complete" == l.document.readyState ? t() : (e = function () {
              t();
            }, Te(window, "load", e));
          }).s(function (t) {
            throw (ke(window, "load", e), t)
          });
        }

        function ti(t) {
          return t = t || hi(), !("file:" !== vi() || !t.toLowerCase().match(/iphone|ipad|ipod|android/))
        }

        function ei() {
          var t = l.window;
          try {
            return !(!t || t == t.top)
          } catch (t) {
            return !1
          }
        }

        function ni() {
          return void 0 !== l.WorkerGlobalScope && "function" == typeof l.importScripts
        }

        function ii() {
          return Wh.INTERNAL.hasOwnProperty("reactNative") ? "ReactNative" : Wh.INTERNAL.hasOwnProperty("node") ? "Node" : ni() ? "Worker" : "Browser"
        }

        function ri() {
          var t = ii();
          return "ReactNative" === t || "Node" === t
        }

        var oi = "Firefox", ai = "Chrome";

        function si(t) {
          var e = t.toLowerCase();
          return Z(e, "opera/") || Z(e, "opr/") || Z(e, "opios/") ? "Opera" : Z(e, "iemobile") ? "IEMobile" : Z(e, "msie") || Z(e, "trident/") ? "IE" : Z(e, "edge/") ? "Edge" : Z(e, "firefox/") ? oi : Z(e, "silk/") ? "Silk" : Z(e, "blackberry") ? "Blackberry" : Z(e, "webos") ? "Webos" : !Z(e, "safari/") || Z(e, "chrome/") || Z(e, "crios/") || Z(e, "android") ? !Z(e, "chrome/") && !Z(e, "crios/") || Z(e, "edge/") ? Z(e, "android") ? "Android" : (t = t.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/)) && 2 == t.length ? t[1] : "Other" : ai : "Safari"
        }

        var ui = {Sc: "FirebaseCore-web", Uc: "FirebaseUI-web"};

        function ci(t, e) {
          e = e || [];
          var n, i = [], r = {};
          for (n in ui) r[ui[n]] = !0;
          for (n = 0; n < e.length; n++) void 0 !== r[e[n]] && (delete r[e[n]], i.push(e[n]));
          return i.sort(), (e = i).length || (e = ["FirebaseCore-web"]), "Browser" === (i = ii()) ? i = si(r = hi()) : "Worker" === i && (i = si(r = hi()) + "-" + i), i + "/JsCore/" + t + "/" + e.join(",")
        }

        function hi() {
          return l.navigator && l.navigator.userAgent || ""
        }

        function li(t, e) {
          t = t.split("."), e = e || l;
          for (var n = 0; n < t.length && "object" == typeof e && null != e; n++) e = e[t[n]];
          return n != t.length && (e = void 0), e
        }

        function fi() {
          try {
            var t = l.localStorage, e = wi();
            if (t) return t.setItem(e, "1"), t.removeItem(e), !Gn() || !!l.indexedDB
          } catch (t) {
            return ni() && !!l.indexedDB
          }
          return !1
        }

        function di() {
          return (pi() || "chrome-extension:" === vi() || ti()) && !ri() && fi() && !ni()
        }

        function pi() {
          return "http:" === vi() || "https:" === vi()
        }

        function vi() {
          return l.location && l.location.protocol || null
        }

        function mi(t) {
          return !Jn(t = t || hi()) && si(t) != oi
        }

        function gi(t) {
          return void 0 === t ? null : Kn(t)
        }

        function bi(t) {
          var e, n = {};
          for (e in t) t.hasOwnProperty(e) && null !== t[e] && void 0 !== t[e] && (n[e] = t[e]);
          return n
        }

        function yi(t) {
          if (null !== t) return JSON.parse(t)
        }

        function wi(t) {
          return t || Math.floor(1e9 * Math.random()).toString()
        }

        function Ii(t) {
          return "Safari" != si(t = t || hi()) && !t.toLowerCase().match(/iphone|ipad|ipod/)
        }

        function Ti() {
          var t = l.___jsl;
          if (t && t.H) for (var e in t.H) if (t.H[e].r = t.H[e].r || [], t.H[e].L = t.H[e].L || [], t.H[e].r = t.H[e].L.concat(), t.CP) for (var n = 0; n < t.CP.length; n++) t.CP[n] = null;
        }

        function ki(t, e) {
          if (e < t) throw Error("Short delay should be less than long delay!");
          this.a = t, this.c = e, t = hi(), e = ii(), this.b = Jn(t) || "ReactNative" === e;
        }

        function Ei() {
          var t = l.document;
          return !t || void 0 === t.visibilityState || "visible" == t.visibilityState
        }

        function Si(t) {
          try {
            var e = new Date(parseInt(t, 10));
            if (!isNaN(e.getTime()) && !/[^0-9]/.test(t)) return e.toUTCString()
          } catch (t) {
          }
          return null
        }

        function Ai() {
          return !(!li("fireauth.oauthhelper", l) && !li("fireauth.iframe", l))
        }

        ki.prototype.get = function () {
          var t = l.navigator;
          return !t || "boolean" != typeof t.onLine || !pi() && "chrome-extension:" !== vi() && void 0 === t.connection || t.onLine ? this.b ? this.c : this.a : Math.min(5e3, this.a)
        };
        var Ni, Oi = {};

        function _i(t) {
          Oi[t] || (Oi[t] = !0, "undefined" != typeof console && "function" == typeof console.warn && console.warn(t));
        }

        try {
          var Pi = {};
          Object.defineProperty(Pi, "abcd", {
            configurable: !0,
            enumerable: !0,
            value: 1
          }), Object.defineProperty(Pi, "abcd", {configurable: !0, enumerable: !0, value: 2}), Ni = 2 == Pi.abcd;
        } catch (t) {
          Ni = !1;
        }

        function Ci(t, e, n) {
          Ni ? Object.defineProperty(t, e, {configurable: !0, enumerable: !0, value: n}) : t[e] = n;
        }

        function Ri(t, e) {
          if (e) for (var n in e) e.hasOwnProperty(n) && Ci(t, n, e[n]);
        }

        function Di(t) {
          var e = {};
          return Ri(e, t), e
        }

        function Li(t) {
          var e = t;
          if ("object" == typeof t && null != t) for (var n in (e = "length" in t ? [] : {}, t)) Ci(e, n, Li(t[n]));
          return e
        }

        function xi(t) {
          var e = {}, n = t[ji], i = t[Ui];
          if (!(t = t[Vi]) || t != Mi && !n) throw Error("Invalid provider user info!");
          e[Fi] = i || null, e[Ki] = n || null, Ci(this, Hi, t), Ci(this, qi, Li(e));
        }

        var Mi = "EMAIL_SIGNIN", ji = "email", Ui = "newEmail", Vi = "requestType", Ki = "email", Fi = "fromEmail",
          qi = "data", Hi = "operation";

        function Bi(t, e) {
          this.code = Wi + t, this.message = e || Xi[t] || "";
        }

        function Gi(t) {
          var e = t && t.code;
          return e ? new Bi(e.substring(Wi.length), t.message) : null
        }

        E(Bi, Error), Bi.prototype.w = function () {
          return {code: this.code, message: this.message}
        }, Bi.prototype.toJSON = function () {
          return this.w()
        };
        var Wi = "auth/", Xi = {
          "admin-restricted-operation": "This operation is restricted to administrators only.",
          "argument-error": "",
          "app-not-authorized": "This app, identified by the domain where it's hosted, is not authorized to use Firebase Authentication with the provided API key. Review your key configuration in the Google API console.",
          "app-not-installed": "The requested mobile application corresponding to the identifier (Android package name or iOS bundle ID) provided is not installed on this device.",
          "captcha-check-failed": "The reCAPTCHA response token provided is either invalid, expired, already used or the domain associated with it does not match the list of whitelisted domains.",
          "code-expired": "The SMS code has expired. Please re-send the verification code to try again.",
          "cordova-not-ready": "Cordova framework is not ready.",
          "cors-unsupported": "This browser is not supported.",
          "credential-already-in-use": "This credential is already associated with a different user account.",
          "custom-token-mismatch": "The custom token corresponds to a different audience.",
          "requires-recent-login": "This operation is sensitive and requires recent authentication. Log in again before retrying this request.",
          "dynamic-link-not-activated": "Please activate Dynamic Links in the Firebase Console and agree to the terms and conditions.",
          "email-already-in-use": "The email address is already in use by another account.",
          "expired-action-code": "The action code has expired. ",
          "cancelled-popup-request": "This operation has been cancelled due to another conflicting popup being opened.",
          "internal-error": "An internal error has occurred.",
          "invalid-app-credential": "The phone verification request contains an invalid application verifier. The reCAPTCHA token response is either invalid or expired.",
          "invalid-app-id": "The mobile app identifier is not registed for the current project.",
          "invalid-user-token": "This user's credential isn't valid for this project. This can happen if the user's token has been tampered with, or if the user isn't for the project associated with this API key.",
          "invalid-auth-event": "An internal error has occurred.",
          "invalid-verification-code": "The SMS verification code used to create the phone auth credential is invalid. Please resend the verification code sms and be sure use the verification code provided by the user.",
          "invalid-continue-uri": "The continue URL provided in the request is invalid.",
          "invalid-cordova-configuration": "The following Cordova plugins must be installed to enable OAuth sign-in: cordova-plugin-buildinfo, cordova-universal-links-plugin, cordova-plugin-browsertab, cordova-plugin-inappbrowser and cordova-plugin-customurlscheme.",
          "invalid-custom-token": "The custom token format is incorrect. Please check the documentation.",
          "invalid-dynamic-link-domain": "The provided dynamic link domain is not configured or authorized for the current project.",
          "invalid-email": "The email address is badly formatted.",
          "invalid-api-key": "Your API key is invalid, please check you have copied it correctly.",
          "invalid-cert-hash": "The SHA-1 certificate hash provided is invalid.",
          "invalid-credential": "The supplied auth credential is malformed or has expired.",
          "invalid-message-payload": "The email template corresponding to this action contains invalid characters in its message. Please fix by going to the Auth email templates section in the Firebase Console.",
          "invalid-oauth-provider": "EmailAuthProvider is not supported for this operation. This operation only supports OAuth providers.",
          "invalid-oauth-client-id": "The OAuth client ID provided is either invalid or does not match the specified API key.",
          "unauthorized-domain": "This domain is not authorized for OAuth operations for your Firebase project. Edit the list of authorized domains from the Firebase console.",
          "invalid-action-code": "The action code is invalid. This can happen if the code is malformed, expired, or has already been used.",
          "wrong-password": "The password is invalid or the user does not have a password.",
          "invalid-persistence-type": "The specified persistence type is invalid. It can only be local, session or none.",
          "invalid-phone-number": "The format of the phone number provided is incorrect. Please enter the phone number in a format that can be parsed into E.164 format. E.164 phone numbers are written in the format [+][country code][subscriber number including area code].",
          "invalid-provider-id": "The specified provider ID is invalid.",
          "invalid-recipient-email": "The email corresponding to this action failed to send as the provided recipient email address is invalid.",
          "invalid-sender": "The email template corresponding to this action contains an invalid sender email or name. Please fix by going to the Auth email templates section in the Firebase Console.",
          "invalid-verification-id": "The verification ID used to create the phone auth credential is invalid.",
          "missing-android-pkg-name": "An Android Package Name must be provided if the Android App is required to be installed.",
          "auth-domain-config-required": "Be sure to include authDomain when calling firebase.initializeApp(), by following the instructions in the Firebase console.",
          "missing-app-credential": "The phone verification request is missing an application verifier assertion. A reCAPTCHA response token needs to be provided.",
          "missing-verification-code": "The phone auth credential was created with an empty SMS verification code.",
          "missing-continue-uri": "A continue URL must be provided in the request.",
          "missing-iframe-start": "An internal error has occurred.",
          "missing-ios-bundle-id": "An iOS Bundle ID must be provided if an App Store ID is provided.",
          "missing-or-invalid-nonce": "The OIDC ID token requires a valid unhashed nonce.",
          "missing-phone-number": "To send verification codes, provide a phone number for the recipient.",
          "missing-verification-id": "The phone auth credential was created with an empty verification ID.",
          "app-deleted": "This instance of FirebaseApp has been deleted.",
          "account-exists-with-different-credential": "An account already exists with the same email address but different sign-in credentials. Sign in using a provider associated with this email address.",
          "network-request-failed": "A network error (such as timeout, interrupted connection or unreachable host) has occurred.",
          "no-auth-event": "An internal error has occurred.",
          "no-such-provider": "User was not linked to an account with the given provider.",
          "null-user": "A null user object was provided as the argument for an operation which requires a non-null user object.",
          "operation-not-allowed": "The given sign-in provider is disabled for this Firebase project. Enable it in the Firebase console, under the sign-in method tab of the Auth section.",
          "operation-not-supported-in-this-environment": 'This operation is not supported in the environment this application is running on. "location.protocol" must be http, https or chrome-extension and web storage must be enabled.',
          "popup-blocked": "Unable to establish a connection with the popup. It may have been blocked by the browser.",
          "popup-closed-by-user": "The popup has been closed by the user before finalizing the operation.",
          "provider-already-linked": "User can only be linked to one identity for the given provider.",
          "quota-exceeded": "The project's quota for this operation has been exceeded.",
          "redirect-cancelled-by-user": "The redirect operation has been cancelled by the user before finalizing.",
          "redirect-operation-pending": "A redirect sign-in operation is already pending.",
          "rejected-credential": "The request contains malformed or mismatching credentials.",
          timeout: "The operation has timed out.",
          "user-token-expired": "The user's credential is no longer valid. The user must sign in again.",
          "too-many-requests": "We have blocked all requests from this device due to unusual activity. Try again later.",
          "unauthorized-continue-uri": "The domain of the continue URL is not whitelisted.  Please whitelist the domain in the Firebase console.",
          "unsupported-persistence-type": "The current environment does not support the specified persistence type.",
          "user-cancelled": "User did not grant your application the permissions it requested.",
          "user-not-found": "There is no user record corresponding to this identifier. The user may have been deleted.",
          "user-disabled": "The user account has been disabled by an administrator.",
          "user-mismatch": "The supplied credentials do not correspond to the previously signed in user.",
          "user-signed-out": "",
          "weak-password": "The password must be 6 characters long or more.",
          "web-storage-unsupported": "This browser is not supported or 3rd party cookies and data may be disabled."
        };

        function Ji(t) {
          var e = t[Qi];
          if (void 0 === e) throw new Bi("missing-continue-uri");
          if ("string" != typeof e || "string" == typeof e && !e.length) throw new Bi("invalid-continue-uri");
          this.h = e, this.b = this.a = null, this.g = !1;
          var n = t[zi];
          if (n && "object" == typeof n) {
            e = n[nr];
            var i = n[tr];
            if (n = n[er], "string" == typeof e && e.length) {
              if (this.a = e, void 0 !== i && "boolean" != typeof i) throw new Bi("argument-error", tr + " property must be a boolean when specified.");
              if (this.g = !!i, void 0 !== n && ("string" != typeof n || "string" == typeof n && !n.length)) throw new Bi("argument-error", er + " property must be a non empty string when specified.");
              this.b = n || null;
            } else {
              if (void 0 !== e) throw new Bi("argument-error", nr + " property must be a non empty string when specified.");
              if (void 0 !== i || void 0 !== n) throw new Bi("missing-android-pkg-name")
            }
          } else if (void 0 !== n) throw new Bi("argument-error", zi + " property must be a non null object when specified.");
          if (this.f = null, (e = t[Zi]) && "object" == typeof e) {
            if ("string" == typeof (e = e[ir]) && e.length) this.f = e; else if (void 0 !== e) throw new Bi("argument-error", ir + " property must be a non empty string when specified.")
          } else if (void 0 !== e) throw new Bi("argument-error", Zi + " property must be a non null object when specified.");
          if (void 0 !== (e = t[$i]) && "boolean" != typeof e) throw new Bi("argument-error", $i + " property must be a boolean when specified.");
          if (this.c = !!e, void 0 !== (t = t[Yi]) && ("string" != typeof t || "string" == typeof t && !t.length)) throw new Bi("argument-error", Yi + " property must be a non empty string when specified.");
          this.i = t || null;
        }

        var zi = "android", Yi = "dynamicLinkDomain", $i = "handleCodeInApp", Zi = "iOS", Qi = "url", tr = "installApp",
          er = "minimumVersion", nr = "packageName", ir = "bundleId";

        function rr(t) {
          var e = {};
          for (var n in (e.continueUrl = t.h, e.canHandleCodeInApp = t.c, (e.androidPackageName = t.a) && (e.androidMinimumVersion = t.b, e.androidInstallApp = t.g), e.iOSBundleId = t.f, e.dynamicLinkDomain = t.i, e)) null === e[n] && delete e[n];
          return e
        }

        var or = null, ar = null;

        function sr(t) {
          var e = "";
          return function (i, t) {
            function e(t) {
              for (; r < i.length;) {
                var e = i.charAt(r++), n = ar[e];
                if (null != n) return n;
                if (!/^[\s\xa0]*$/.test(e)) throw Error("Unknown base64 encoding at char: " + e)
              }
              return t
            }

            !function () {
              if (!or) {
                or = {}, ar = {};
                for (var t = 0; t < 65; t++) or[t] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".charAt(t), 62 <= (ar[or[t]] = t) && (ar["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_.".charAt(t)] = t);
              }
            }();
            for (var r = 0; ;) {
              var n = e(-1), o = e(0), a = e(64), s = e(64);
              if (64 === s && -1 === n) break;
              t(n << 2 | o >> 4), 64 != a && (t(o << 4 & 240 | a >> 2), 64 != s && t(a << 6 & 192 | s));
            }
          }(t, function (t) {
            e += String.fromCharCode(t);
          }), e
        }

        function ur(t) {
          this.c = t.sub, this.a = t.provider_id || t.firebase && t.firebase.sign_in_provider || null, this.b = !!t.is_anonymous || "anonymous" == this.a;
        }

        function cr(t) {
          return (t = hr(t)) && t.sub && t.iss && t.aud && t.exp ? new ur(t) : null
        }

        function hr(t) {
          if (!t) return null;
          if (3 != (t = t.split(".")).length) return null;
          for (var e = (4 - (t = t[1]).length % 4) % 4, n = 0; n < e; n++) t += ".";
          try {
            return JSON.parse(sr(t))
          } catch (t) {
          }
          return null
        }

        ur.prototype.f = function () {
          return this.b
        };
        var lr, fr = {
          Yc: {
            ab: "https://www.googleapis.com/identitytoolkit/v3/relyingparty/",
            ib: "https://securetoken.googleapis.com/v1/token",
            id: "p"
          },
          $c: {
            ab: "https://staging-www.sandbox.googleapis.com/identitytoolkit/v3/relyingparty/",
            ib: "https://staging-securetoken.sandbox.googleapis.com/v1/token",
            id: "s"
          },
          ad: {
            ab: "https://www-googleapis-test.sandbox.google.com/identitytoolkit/v3/relyingparty/",
            ib: "https://test-securetoken.sandbox.googleapis.com/v1/token",
            id: "t"
          }
        };

        function dr(t) {
          for (var e in fr) if (fr[e].id === t) return {firebaseEndpoint: (t = fr[e]).ab, secureTokenEndpoint: t.ib};
          return null
        }

        lr = dr("__EID__") ? "__EID__" : void 0;
        var pr = "oauth_consumer_key oauth_nonce oauth_signature oauth_signature_method oauth_timestamp oauth_token oauth_version".split(" "),
          vr = ["client_id", "response_type", "scope", "redirect_uri", "state"], mr = {
            Tc: {Oa: "locale", Ba: 500, Aa: 600, Pa: "facebook.com", hb: vr},
            Vc: {Oa: null, Ba: 500, Aa: 620, Pa: "github.com", hb: vr},
            Wc: {Oa: "hl", Ba: 515, Aa: 680, Pa: "google.com", hb: vr},
            bd: {Oa: "lang", Ba: 485, Aa: 705, Pa: "twitter.com", hb: pr}
          };

        function gr(t) {
          for (var e in mr) if (mr[e].Pa == t) return mr[e];
          return null
        }

        function br(t) {
          var e = {};
          e["facebook.com"] = kr, e["google.com"] = Sr, e["github.com"] = Er, e["twitter.com"] = Ar;
          var n = t && t[wr];
          try {
            if (n) return e[n] ? new e[n](t) : new Tr(t);
            if (void 0 !== t[yr]) return new Ir(t)
          } catch (t) {
          }
          return null
        }

        var yr = "idToken", wr = "providerId";

        function Ir(t) {
          var e = t[wr];
          if (!e && t[yr]) {
            var n = cr(t[yr]);
            n && n.a && (e = n.a);
          }
          if (!e) throw Error("Invalid additional user info!");
          "anonymous" != e && "custom" != e || (e = null), n = !1, void 0 !== t.isNewUser ? n = !!t.isNewUser : "identitytoolkit#SignupNewUserResponse" === t.kind && (n = !0), Ci(this, "providerId", e), Ci(this, "isNewUser", n);
        }

        function Tr(t) {
          Ir.call(this, t), Ci(this, "profile", Li((t = yi(t.rawUserInfo || "{}")) || {}));
        }

        function kr(t) {
          if (Tr.call(this, t), "facebook.com" != this.providerId) throw Error("Invalid provider ID!")
        }

        function Er(t) {
          if (Tr.call(this, t), "github.com" != this.providerId) throw Error("Invalid provider ID!");
          Ci(this, "username", this.profile && this.profile.login || null);
        }

        function Sr(t) {
          if (Tr.call(this, t), "google.com" != this.providerId) throw Error("Invalid provider ID!")
        }

        function Ar(t) {
          if (Tr.call(this, t), "twitter.com" != this.providerId) throw Error("Invalid provider ID!");
          Ci(this, "username", t.screenName || null);
        }

        function Nr(t) {
          this.a = Ye(t);
        }

        function Or(t) {
          var e = Ye(t), n = ze(e, "link"), i = ze(Ye(n), "link");
          return ze(Ye(e = ze(e, "deep_link_id")), "link") || e || i || n || t
        }

        function _r() {
        }

        function Pr(t, n) {
          return t.then(function (t) {
            if (t[ya]) {
              var e = cr(t[ya]);
              if (!e || n != e.c) throw new Bi("user-mismatch");
              return t
            }
            throw new Bi("user-mismatch")
          }).s(function (t) {
            throw t && t.code && t.code == Wi + "user-not-found" ? new Bi("user-mismatch") : t
          })
        }

        function Cr(t, e) {
          if (!e) throw new Bi("internal-error", "failed to construct a credential");
          this.a = e, Ci(this, "providerId", t), Ci(this, "signInMethod", t);
        }

        function Rr(t) {
          return {pendingToken: t.a, requestUri: "http://localhost"}
        }

        function Dr(t) {
          if (t && t.providerId && t.signInMethod && 0 == t.providerId.indexOf("saml.") && t.pendingToken) try {
            return new Cr(t.providerId, t.pendingToken)
          } catch (t) {
          }
          return null
        }

        function Lr(t, e, n) {
          if (this.a = null, e.idToken || e.accessToken) e.idToken && Ci(this, "idToken", e.idToken), e.accessToken && Ci(this, "accessToken", e.accessToken), e.nonce && !e.pendingToken && Ci(this, "nonce", e.nonce), e.pendingToken && (this.a = e.pendingToken); else {
            if (!e.oauthToken || !e.oauthTokenSecret) throw new Bi("internal-error", "failed to construct a credential");
            Ci(this, "accessToken", e.oauthToken), Ci(this, "secret", e.oauthTokenSecret);
          }
          Ci(this, "providerId", t), Ci(this, "signInMethod", n);
        }

        function xr(t) {
          var e = {};
          return t.idToken && (e.id_token = t.idToken), t.accessToken && (e.access_token = t.accessToken), t.secret && (e.oauth_token_secret = t.secret), e.providerId = t.providerId, t.nonce && !t.a && (e.nonce = t.nonce), e = {
            postBody: cn(e).toString(),
            requestUri: "http://localhost"
          }, t.a && (delete e.postBody, e.pendingToken = t.a), e
        }

        function Mr(t) {
          if (t && t.providerId && t.signInMethod) {
            var e = {
              idToken: t.oauthIdToken,
              accessToken: t.oauthTokenSecret ? null : t.oauthAccessToken,
              oauthTokenSecret: t.oauthTokenSecret,
              oauthToken: t.oauthTokenSecret && t.oauthAccessToken,
              nonce: t.nonce,
              pendingToken: t.pendingToken
            };
            try {
              return new Lr(t.providerId, e, t.signInMethod)
            } catch (t) {
            }
          }
          return null
        }

        function jr(t, e) {
          this.Dc = e || [], Ri(this, {
            providerId: t,
            isOAuthProvider: !0
          }), this.zb = {}, this.cb = (gr(t) || {}).Oa || null, this.$a = null;
        }

        function Ur(t) {
          if ("string" != typeof t || 0 != t.indexOf("saml.")) throw new Bi("argument-error", 'SAML provider IDs must be prefixed with "saml."');
          jr.call(this, t, []);
        }

        function Vr(t) {
          jr.call(this, t, vr), this.a = [];
        }

        function Kr() {
          Vr.call(this, "facebook.com");
        }

        function Fr(t) {
          if (!t) throw new Bi("argument-error", "credential failed: expected 1 argument (the OAuth access token).");
          var e = t;
          return b(t) && (e = t.accessToken), (new Kr).credential({accessToken: e})
        }

        function qr() {
          Vr.call(this, "github.com");
        }

        function Hr(t) {
          if (!t) throw new Bi("argument-error", "credential failed: expected 1 argument (the OAuth access token).");
          var e = t;
          return b(t) && (e = t.accessToken), (new qr).credential({accessToken: e})
        }

        function Br() {
          Vr.call(this, "google.com"), this.ua("profile");
        }

        function Gr(t, e) {
          var n = t;
          return b(t) && (n = t.idToken, e = t.accessToken), (new Br).credential({idToken: n, accessToken: e})
        }

        function Wr() {
          jr.call(this, "twitter.com", pr);
        }

        function Xr(t, e) {
          var n = t;
          if (b(n) || (n = {
            oauthToken: t,
            oauthTokenSecret: e
          }), !n.oauthToken || !n.oauthTokenSecret) throw new Bi("argument-error", "credential failed: expected 2 arguments (the OAuth access token and secret).");
          return new Lr("twitter.com", n, "twitter.com")
        }

        function Jr(t, e, n) {
          this.a = t, this.c = e, Ci(this, "providerId", "password"), Ci(this, "signInMethod", n === Yr.EMAIL_LINK_SIGN_IN_METHOD ? Yr.EMAIL_LINK_SIGN_IN_METHOD : Yr.EMAIL_PASSWORD_SIGN_IN_METHOD);
        }

        function zr(t) {
          return t && t.email && t.password ? new Jr(t.email, t.password, t.signInMethod) : null
        }

        function Yr() {
          Ri(this, {providerId: "password", isOAuthProvider: !1});
        }

        function $r(t, e) {
          if (!(e = Zr(e))) throw new Bi("argument-error", "Invalid email link!");
          return new Jr(t, e, Yr.EMAIL_LINK_SIGN_IN_METHOD)
        }

        function Zr(t) {
          var e = ze((t = new Nr(t = Or(t))).a, "oobCode") || null;
          return "signIn" === (ze(t.a, "mode") || null) && e ? e : null
        }

        function Qr(t) {
          if (!(t.Ta && t.Sa || t.Fa && t.$)) throw new Bi("internal-error");
          this.a = t, Ci(this, "providerId", "phone"), Ci(this, "signInMethod", "phone");
        }

        function to(e) {
          if (e && "phone" === e.providerId && (e.verificationId && e.verificationCode || e.temporaryProof && e.phoneNumber)) {
            var n = {};
            return x(["verificationId", "verificationCode", "temporaryProof", "phoneNumber"], function (t) {
              e[t] && (n[t] = e[t]);
            }), new Qr(n)
          }
          return null
        }

        function eo(t) {
          return t.a.Fa && t.a.$ ? {temporaryProof: t.a.Fa, phoneNumber: t.a.$} : {sessionInfo: t.a.Ta, code: t.a.Sa}
        }

        function no(t) {
          try {
            this.a = t || Wh.auth();
          } catch (t) {
            throw new Bi("argument-error", "Either an instance of firebase.auth.Auth must be passed as an argument to the firebase.auth.PhoneAuthProvider constructor, or the default firebase App instance must be initialized via firebase.initializeApp().")
          }
          Ri(this, {providerId: "phone", isOAuthProvider: !1});
        }

        function io(t, e) {
          if (!t) throw new Bi("missing-verification-id");
          if (!e) throw new Bi("missing-verification-code");
          return new Qr({Ta: t, Sa: e})
        }

        function ro(t) {
          if (t.temporaryProof && t.phoneNumber) return new Qr({Fa: t.temporaryProof, $: t.phoneNumber});
          var e = t && t.providerId;
          if (!e || "password" === e) return null;
          var n = t && t.oauthAccessToken, i = t && t.oauthTokenSecret, r = t && t.nonce, o = t && t.oauthIdToken,
            a = t && t.pendingToken;
          try {
            switch (e) {
              case"google.com":
                return Gr(o, n);
              case"facebook.com":
                return Fr(n);
              case"github.com":
                return Hr(n);
              case"twitter.com":
                return Xr(n, i);
              default:
                return n || i || o || a ? a ? 0 == e.indexOf("saml.") ? new Cr(e, a) : new Lr(e, {
                  pendingToken: a,
                  idToken: t.oauthIdToken,
                  accessToken: t.oauthAccessToken
                }, e) : new Vr(e).credential({idToken: o, accessToken: n, rawNonce: r}) : null
            }
          } catch (t) {
            return null
          }
        }

        function oo(t) {
          if (!t.isOAuthProvider) throw new Bi("invalid-oauth-provider")
        }

        function ao(t, e, n, i, r, o) {
          if (this.c = t, this.b = e || null, this.g = n || null, this.f = i || null, this.h = o || null, this.a = r || null, !this.g && !this.a) throw new Bi("invalid-auth-event");
          if (this.g && this.a) throw new Bi("invalid-auth-event");
          if (this.g && !this.f) throw new Bi("invalid-auth-event")
        }

        function so(t) {
          return (t = t || {}).type ? new ao(t.type, t.eventId, t.urlResponse, t.sessionId, t.error && Gi(t.error), t.postBody) : null
        }

        function uo() {
          this.b = null, this.a = [];
        }

        E(Tr, Ir), E(kr, Tr), E(Er, Tr), E(Sr, Tr), E(Ar, Tr), Cr.prototype.la = function (t) {
          return ja(t, Rr(this))
        }, Cr.prototype.b = function (t, e) {
          var n = Rr(this);
          return n.idToken = e, Ua(t, n)
        }, Cr.prototype.f = function (t, e) {
          return Pr(Va(t, Rr(this)), e)
        }, Cr.prototype.w = function () {
          return {providerId: this.providerId, signInMethod: this.signInMethod, pendingToken: this.a}
        }, Lr.prototype.la = function (t) {
          return ja(t, xr(this))
        }, Lr.prototype.b = function (t, e) {
          var n = xr(this);
          return n.idToken = e, Ua(t, n)
        }, Lr.prototype.f = function (t, e) {
          return Pr(Va(t, xr(this)), e)
        }, Lr.prototype.w = function () {
          var t = {providerId: this.providerId, signInMethod: this.signInMethod};
          return this.idToken && (t.oauthIdToken = this.idToken), this.accessToken && (t.oauthAccessToken = this.accessToken), this.secret && (t.oauthTokenSecret = this.secret), this.nonce && (t.nonce = this.nonce), this.a && (t.pendingToken = this.a), t
        }, jr.prototype.Da = function (t) {
          return this.zb = ot(t), this
        }, E(Ur, jr), E(Vr, jr), Vr.prototype.ua = function (t) {
          return U(this.a, t) || this.a.push(t), this
        }, Vr.prototype.Fb = function () {
          return q(this.a)
        }, Vr.prototype.credential = function (t, e) {
          var n;
          if (!(n = b(t) ? {
            idToken: t.idToken || null,
            accessToken: t.accessToken || null,
            nonce: t.rawNonce || null
          } : {
            idToken: t || null,
            accessToken: e || null
          }).idToken && !n.accessToken) throw new Bi("argument-error", "credential failed: must provide the ID token and/or the access token.");
          return new Lr(this.providerId, n, this.providerId)
        }, E(Kr, Vr), Ci(Kr, "PROVIDER_ID", "facebook.com"), Ci(Kr, "FACEBOOK_SIGN_IN_METHOD", "facebook.com"), E(qr, Vr), Ci(qr, "PROVIDER_ID", "github.com"), Ci(qr, "GITHUB_SIGN_IN_METHOD", "github.com"), E(Br, Vr), Ci(Br, "PROVIDER_ID", "google.com"), Ci(Br, "GOOGLE_SIGN_IN_METHOD", "google.com"), E(Wr, jr), Ci(Wr, "PROVIDER_ID", "twitter.com"), Ci(Wr, "TWITTER_SIGN_IN_METHOD", "twitter.com"), Jr.prototype.la = function (t) {
          return this.signInMethod == Yr.EMAIL_LINK_SIGN_IN_METHOD ? ps(t, Xa, {
            email: this.a,
            oobCode: this.c
          }) : ps(t, hs, {email: this.a, password: this.c})
        }, Jr.prototype.b = function (t, e) {
          return this.signInMethod == Yr.EMAIL_LINK_SIGN_IN_METHOD ? ps(t, Ja, {
            idToken: e,
            email: this.a,
            oobCode: this.c
          }) : ps(t, rs, {idToken: e, email: this.a, password: this.c})
        }, Jr.prototype.f = function (t, e) {
          return Pr(this.la(t), e)
        }, Jr.prototype.w = function () {
          return {email: this.a, password: this.c, signInMethod: this.signInMethod}
        }, Ri(Yr, {PROVIDER_ID: "password"}), Ri(Yr, {EMAIL_LINK_SIGN_IN_METHOD: "emailLink"}), Ri(Yr, {EMAIL_PASSWORD_SIGN_IN_METHOD: "password"}), Qr.prototype.la = function (t) {
          return t.Ua(eo(this))
        }, Qr.prototype.b = function (t, e) {
          var n = eo(this);
          return n.idToken = e, ps(t, fs, n)
        }, Qr.prototype.f = function (t, e) {
          var n = eo(this);
          return n.operation = "REAUTH", Pr(t = ps(t, ds, n), e)
        }, Qr.prototype.w = function () {
          var t = {providerId: "phone"};
          return this.a.Ta && (t.verificationId = this.a.Ta), this.a.Sa && (t.verificationCode = this.a.Sa), this.a.Fa && (t.temporaryProof = this.a.Fa), this.a.$ && (t.phoneNumber = this.a.$), t
        }, no.prototype.Ua = function (i, r) {
          var o = this.a.c;
          return Et(r.verify()).then(function (t) {
            if (!h(t)) throw new Bi("argument-error", "An implementation of firebase.auth.ApplicationVerifier.prototype.verify() must return a firebase.Promise that resolves with a string.");
            switch (r.type) {
              case"recaptcha":
                return (e = o, n = {phoneNumber: i, recaptchaToken: t}, ps(e, ns, n)).then(function (t) {
                  return "function" == typeof r.reset && r.reset(), t
                }, function (t) {
                  throw("function" == typeof r.reset && r.reset(), t)
                });
              default:
                throw new Bi("argument-error", 'Only firebase.auth.ApplicationVerifiers with type="recaptcha" are currently supported.')
            }
            var e, n;
          });
        }, Ri(no, {PROVIDER_ID: "phone"}), Ri(no, {PHONE_SIGN_IN_METHOD: "phone"}), ao.prototype.getUid = function () {
          var t = [];
          return t.push(this.c), this.b && t.push(this.b), this.f && t.push(this.f), this.i && t.push(this.i), t.join("-")
        }, ao.prototype.w = function () {
          return {
            type: this.c,
            eventId: this.b,
            urlResponse: this.g,
            sessionId: this.f,
            postBody: this.h,
            error: this.a && this.a.w()
          }
        };
        var co, ho = null;

        function lo(t) {
          var e = "unauthorized-domain", n = void 0, i = Ye(t);
          t = i.b, "chrome-extension" == (i = i.f) ? n = ht("This chrome extension ID (chrome-extension://%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.", t) : "http" == i || "https" == i ? n = ht("This domain (%s) is not authorized to run this operation. Add it to the OAuth redirect domains list in the Firebase console -> Auth section -> Sign in method tab.", t) : e = "operation-not-supported-in-this-environment", Bi.call(this, e, n);
        }

        function fo(t, e, n) {
          Bi.call(this, t, n), (t = e || {}).Ab && Ci(this, "email", t.Ab), t.$ && Ci(this, "phoneNumber", t.$), t.credential && Ci(this, "credential", t.credential);
        }

        function po(t) {
          if (t.code) {
            var e = t.code || "";
            0 == e.indexOf(Wi) && (e = e.substring(Wi.length));
            var n = {credential: ro(t)};
            if (t.email) n.Ab = t.email; else if (t.phoneNumber) n.$ = t.phoneNumber; else if (!n.credential) return new Bi(e, t.message || void 0);
            return new fo(e, n, t.message)
          }
          return null
        }

        function vo() {
        }

        function mo(t) {
          return t.c || (t.c = t.b())
        }

        function go() {
        }

        function bo(t) {
          if (t.f || "undefined" != typeof XMLHttpRequest || "undefined" == typeof ActiveXObject) return t.f;
          for (var e = ["MSXML2.XMLHTTP.6.0", "MSXML2.XMLHTTP.3.0", "MSXML2.XMLHTTP", "Microsoft.XMLHTTP"], n = 0; n < e.length; n++) {
            var i = e[n];
            try {
              return new ActiveXObject(i), t.f = i
            } catch (t) {
            }
          }
          throw Error("Could not create ActiveXObject. ActiveX might be disabled, or MSXML might not be installed")
        }

        function yo() {
        }

        function wo() {
          this.a = new XDomainRequest, this.readyState = 0, this.onreadystatechange = null, this.responseType = this.responseText = this.response = "", this.status = -1, this.statusText = "", this.a.onload = I(this.dc, this), this.a.onerror = I(this.Gb, this), this.a.onprogress = I(this.ec, this), this.a.ontimeout = I(this.ic, this);
        }

        function Io(t, e) {
          t.readyState = e, t.onreadystatechange && t.onreadystatechange();
        }

        function To(t, e, n) {
          this.reset(t, e, n, void 0, void 0);
        }

        function ko(t) {
          this.f = t, this.b = this.c = this.a = null;
        }

        function Eo(t, e) {
          this.name = t, this.value = e;
        }

        uo.prototype.subscribe = function (t) {
          var n = this;
          this.a.push(t), this.b || (this.b = function (t) {
            for (var e = 0; e < n.a.length; e++) n.a[e](t);
          }, "function" == typeof (t = li("universalLinks.subscribe", l)) && t(null, this.b));
        }, uo.prototype.unsubscribe = function (e) {
          K(this.a, function (t) {
            return t == e
          });
        }, E(lo, Bi), E(fo, Bi), fo.prototype.w = function () {
          var t = {code: this.code, message: this.message};
          this.email && (t.email = this.email), this.phoneNumber && (t.phoneNumber = this.phoneNumber);
          var e = this.credential && this.credential.w();
          return e && ct(t, e), t
        }, fo.prototype.toJSON = function () {
          return this.w()
        }, vo.prototype.c = null, E(go, vo), go.prototype.a = function () {
          var t = bo(this);
          return t ? new ActiveXObject(t) : new XMLHttpRequest
        }, go.prototype.b = function () {
          var t = {};
          return bo(this) && (t[0] = !0, t[1] = !0), t
        }, co = new go, E(yo, vo), yo.prototype.a = function () {
          var t = new XMLHttpRequest;
          if ("withCredentials" in t) return t;
          if ("undefined" != typeof XDomainRequest) return new wo;
          throw Error("Unsupported browser")
        }, yo.prototype.b = function () {
          return {}
        }, (t = wo.prototype).open = function (t, e, n) {
          if (null != n && !n) throw Error("Only async requests are supported.");
          this.a.open(t, e);
        }, t.send = function (t) {
          if (t) {
            if ("string" != typeof t) throw Error("Only string data is supported");
            this.a.send(t);
          } else this.a.send();
        }, t.abort = function () {
          this.a.abort();
        }, t.setRequestHeader = function () {
        }, t.getResponseHeader = function (t) {
          return "content-type" == t.toLowerCase() ? this.a.contentType : ""
        }, t.dc = function () {
          this.status = 200, this.response = this.responseText = this.a.responseText, Io(this, 4);
        }, t.Gb = function () {
          this.status = 500, this.response = this.responseText = "", Io(this, 4);
        }, t.ic = function () {
          this.Gb();
        }, t.ec = function () {
          this.status = 200, Io(this, 1);
        }, t.getAllResponseHeaders = function () {
          return "content-type: " + this.a.contentType
        }, To.prototype.a = null, To.prototype.reset = function (t, e, n, i, r) {
          delete this.a;
        }, Eo.prototype.toString = function () {
          return this.name
        };
        var So = new Eo("SEVERE", 1e3), Ao = new Eo("WARNING", 900), No = new Eo("CONFIG", 700),
          Oo = new Eo("FINE", 500);
        ko.prototype.log = function (t, e, n) {
          if (t.value >= function t(e) {
            return e.c ? e.c : e.a ? t(e.a) : (O("Root logger has no level set."), null)
          }(this).value) for (g(e) && (e = e()), t = new To(t, String(e), this.f), n && (t.a = n), n = this; n;) n = n.a;
        };
        var _o, Po = {}, Co = null;

        function Ro(t) {
          var e;
          if (Co || (Co = new ko(""), (Po[""] = Co).c = No), !(e = Po[t])) {
            e = new ko(t);
            var n = t.lastIndexOf("."), i = t.substr(n + 1);
            (n = Ro(t.substr(0, n))).b || (n.b = {}), (n.b[i] = e).a = n, Po[t] = e;
          }
          return e
        }

        function Do(t, e) {
          t && t.log(Oo, e, void 0);
        }

        function Lo(t) {
          this.f = t;
        }

        function xo(t) {
          Re.call(this), this.u = t, this.readyState = Mo, this.status = 0, this.responseType = this.responseText = this.response = this.statusText = "", this.onreadystatechange = null, this.i = new Headers, this.b = null, this.o = "GET", this.g = "", this.a = !1, this.h = Ro("goog.net.FetchXmlHttp"), this.l = this.c = this.f = null;
        }

        E(Lo, vo), Lo.prototype.a = function () {
          return new xo(this.f)
        }, Lo.prototype.b = (_o = {}, function () {
          return _o
        }), E(xo, Re);
        var Mo = 0;

        function jo(t) {
          t.c.read().then(t.cc.bind(t)).catch(t.Ma.bind(t));
        }

        function Uo(t, e) {
          e && t.f && (t.status = t.f.status, t.statusText = t.f.statusText), t.readyState = 4, t.f = null, t.c = null, t.l = null, Vo(t);
        }

        function Vo(t) {
          t.onreadystatechange && t.onreadystatechange.call(t);
        }

        function Ko(t) {
          Re.call(this), this.headers = new Ke, this.D = t || null, this.c = !1, this.A = this.a = null, this.h = this.N = this.l = "", this.f = this.I = this.i = this.G = !1, this.g = 0, this.u = null, this.o = Fo, this.v = this.O = !1;
        }

        (t = xo.prototype).open = function (t, e) {
          if (this.readyState != Mo) throw (this.abort(), Error("Error reopening a connection"));
          this.o = t, this.g = e, this.readyState = 1, Vo(this);
        }, t.send = function (t) {
          if (1 != this.readyState) throw (this.abort(), Error("need to call open() first. "));
          this.a = !0;
          var e = {headers: this.i, method: this.o, credentials: void 0, cache: void 0};
          t && (e.body = t), this.u.fetch(new Request(this.g, e)).then(this.hc.bind(this), this.Ma.bind(this));
        }, t.abort = function () {
          this.response = this.responseText = "", this.i = new Headers, this.status = 0, this.c && this.c.cancel("Request was aborted."), 1 <= this.readyState && this.a && 4 != this.readyState && (this.a = !1, Uo(this, !1)), this.readyState = Mo;
        }, t.hc = function (t) {
          this.a && (this.f = t, this.b || (this.b = t.headers, this.readyState = 2, Vo(this)), this.a && (this.readyState = 3, Vo(this), this.a && ("arraybuffer" === this.responseType ? t.arrayBuffer().then(this.fc.bind(this), this.Ma.bind(this)) : void 0 !== l.ReadableStream && "body" in t ? (this.response = this.responseText = "", this.c = t.body.getReader(), this.l = new TextDecoder, jo(this)) : t.text().then(this.gc.bind(this), this.Ma.bind(this)))));
        }, t.cc = function (t) {
          if (this.a) {
            var e = this.l.decode(t.value ? t.value : new Uint8Array(0), {stream: !t.done});
            e && (this.response = this.responseText += e), t.done ? Uo(this, !0) : Vo(this), 3 == this.readyState && jo(this);
          }
        }, t.gc = function (t) {
          this.a && (this.response = this.responseText = t, Uo(this, !0));
        }, t.fc = function (t) {
          this.a && (this.response = t, Uo(this, !0));
        }, t.Ma = function (t) {
          var e = this.h;
          e && e.log(Ao, "Failed to fetch url " + this.g, t instanceof Error ? t : Error(t)), this.a && Uo(this, !0);
        }, t.setRequestHeader = function (t, e) {
          this.i.append(t, e);
        }, t.getResponseHeader = function (t) {
          return this.b ? this.b.get(t.toLowerCase()) || "" : ((t = this.h) && t.log(Ao, "Attempting to get response header but no headers have been received for url: " + this.g, void 0), "")
        }, t.getAllResponseHeaders = function () {
          if (!this.b) {
            var t = this.h;
            return t && t.log(Ao, "Attempting to get all response headers but no headers have been received for url: " + this.g, void 0), ""
          }
          t = [];
          for (var e = this.b.entries(), n = e.next(); !n.done;) n = n.value, t.push(n[0] + ": " + n[1]), n = e.next();
          return t.join("\r\n")
        }, E(Ko, Re);
        var Fo = "";
        Ko.prototype.b = Ro("goog.net.XhrIo");
        var qo = /^https?$/i, Ho = ["POST", "PUT"];

        function Bo(e, t, n, i, r) {
          if (e.a) throw Error("[goog.net.XhrIo] Object is active with another request=" + e.l + "; newUri=" + t);
          n = n ? n.toUpperCase() : "GET", e.l = t, e.h = "", e.N = n, e.G = !1, e.c = !0, e.a = e.D ? e.D.a() : co.a(), e.A = e.D ? mo(e.D) : mo(co), e.a.onreadystatechange = I(e.Jb, e);
          try {
            Do(e.b, Qo(e, "Opening Xhr")), e.I = !0, e.a.open(n, String(t), !0), e.I = !1;
          } catch (t) {
            return Do(e.b, Qo(e, "Error opening Xhr: " + t.message)), void Wo(e, t)
          }
          t = i || "";
          var o, a = new Ke(e.headers);
          r && function (t, e) {
            if (t.forEach && "function" == typeof t.forEach) t.forEach(e, void 0); else if (m(t) || h(t)) x(t, e, void 0); else for (var n = Ve(t), i = Ue(t), r = i.length, o = 0; o < r; o++) e.call(void 0, i[o], n && n[o], t);
          }(r, function (t, e) {
            a.set(e, t);
          }), r = function (t) {
            t:{
              for (var e = Go, n = t.length, i = h(t) ? t.split("") : t, r = 0; r < n; r++) if (r in i && e.call(void 0, i[r], r, t)) {
                e = r;
                break t
              }
              e = -1;
            }
            return e < 0 ? null : h(t) ? t.charAt(e) : t[e]
          }(a.U()), i = l.FormData && t instanceof l.FormData, !U(Ho, n) || r || i || a.set("Content-Type", "application/x-www-form-urlencoded;charset=utf-8"), a.forEach(function (t, e) {
            this.a.setRequestHeader(e, t);
          }, e), e.o && (e.a.responseType = e.o), "withCredentials" in e.a && e.a.withCredentials !== e.O && (e.a.withCredentials = e.O);
          try {
            Yo(e), 0 < e.g && (e.v = (o = e.a, Gt && ne(9) && "number" == typeof o.timeout && void 0 !== o.ontimeout), Do(e.b, Qo(e, "Will abort after " + e.g + "ms if incomplete, xhr2 " + e.v)), e.v ? (e.a.timeout = e.g, e.a.ontimeout = I(e.Ga, e)) : e.u = Me(e.Ga, e.g, e)), Do(e.b, Qo(e, "Sending request")), e.i = !0, e.a.send(t), e.i = !1;
          } catch (t) {
            Do(e.b, Qo(e, "Send error: " + t.message)), Wo(e, t);
          }
        }

        function Go(t) {
          return "content-type" == t.toLowerCase()
        }

        function Wo(t, e) {
          t.c = !1, t.a && (t.f = !0, t.a.abort(), t.f = !1), t.h = e, Xo(t), zo(t);
        }

        function Xo(t) {
          t.G || (t.G = !0, t.dispatchEvent("complete"), t.dispatchEvent("error"));
        }

        function Jo(e) {
          if (e.c && void 0 !== u) if (e.A[1] && 4 == $o(e) && 2 == Zo(e)) Do(e.b, Qo(e, "Local request error detected and ignored")); else if (e.i && 4 == $o(e)) Me(e.Jb, 0, e); else if (e.dispatchEvent("readystatechange"), 4 == $o(e)) {
            Do(e.b, Qo(e, "Request complete")), e.c = !1;
            try {
              var t, n = Zo(e);
              t:switch (n) {
                case 200:
                case 201:
                case 202:
                case 204:
                case 206:
                case 304:
                case 1223:
                  var i = !0;
                  break t;
                default:
                  i = !1;
              }
              if (!(t = i)) {
                var r;
                if (r = 0 === n) {
                  var o = String(e.l).match(He)[1] || null;
                  if (!o && l.self && l.self.location) {
                    var a = l.self.location.protocol;
                    o = a.substr(0, a.length - 1);
                  }
                  r = !qo.test(o ? o.toLowerCase() : "");
                }
                t = r;
              }
              if (t) e.dispatchEvent("complete"), e.dispatchEvent("success"); else {
                try {
                  var s = 2 < $o(e) ? e.a.statusText : "";
                } catch (t) {
                  Do(e.b, "Can not get status: " + t.message), s = "";
                }
                e.h = s + " [" + Zo(e) + "]", Xo(e);
              }
            } finally {
              zo(e);
            }
          }
        }

        function zo(e, t) {
          if (e.a) {
            Yo(e);
            var n = e.a, i = e.A[0] ? s : null;
            e.a = null, e.A = null, t || e.dispatchEvent("ready");
            try {
              n.onreadystatechange = i;
            } catch (t) {
              (e = e.b) && e.log(So, "Problem encountered resetting onreadystatechange: " + t.message, void 0);
            }
          }
        }

        function Yo(t) {
          t.a && t.v && (t.a.ontimeout = null), t.u && (l.clearTimeout(t.u), t.u = null);
        }

        function $o(t) {
          return t.a ? t.a.readyState : 0
        }

        function Zo(t) {
          try {
            return 2 < $o(t) ? t.a.status : -1
          } catch (t) {
            return -1
          }
        }

        function Qo(t, e) {
          return e + " [" + t.N + " " + t.l + " " + Zo(t) + "]"
        }

        function ta(t) {
          var e = la;
          this.g = [], this.v = e, this.u = t || null, this.f = this.a = !1, this.c = void 0, this.l = this.A = this.i = !1, this.h = 0, this.b = null, this.m = 0;
        }

        function ea(t, e, n) {
          t.a = !0, t.c = n, t.f = !e, oa(t);
        }

        function na(t) {
          if (t.a) {
            if (!t.l) throw new aa(t);
            t.l = !1;
          }
        }

        function ia(t, e, n, i) {
          t.g.push([e, n, i]), t.a && oa(t);
        }

        function ra(t) {
          return j(t.g, function (t) {
            return g(t[1])
          })
        }

        function oa(e) {
          if (e.h && e.a && ra(e)) {
            var n = e.h, i = ca[n];
            i && (l.clearTimeout(i.a), delete ca[n]), e.h = 0;
          }
          e.b && (e.b.m--, delete e.b), n = e.c;
          for (var t = i = !1; e.g.length && !e.i;) {
            var r = e.g.shift(), o = r[0], a = r[1];
            if (r = r[2], o = e.f ? a : o) try {
              var s = o.call(r || e.u, n);
              void 0 !== s && (e.f = e.f && (s == n || s instanceof Error), e.c = n = s), (S(n) || "function" == typeof l.Promise && n instanceof l.Promise) && (t = !0, e.i = !0);
            } catch (t) {
              n = t, e.f = !0, ra(e) || (i = !0);
            }
          }
          e.c = n, t && (s = I(e.o, e, !0), t = I(e.o, e, !1), n instanceof ta ? (ia(n, s, t), n.A = !0) : n.then(s, t)), i && (n = new ua(n), ca[n.a] = n, e.h = n.a);
        }

        function aa() {
          A.call(this);
        }

        function sa() {
          A.call(this);
        }

        function ua(t) {
          this.a = l.setTimeout(I(this.c, this), 0), this.b = t;
        }

        (t = Ko.prototype).Ga = function () {
          void 0 !== u && this.a && (this.h = "Timed out after " + this.g + "ms, aborting", Do(this.b, Qo(this, this.h)), this.dispatchEvent("timeout"), this.abort(8));
        }, t.abort = function () {
          this.a && this.c && (Do(this.b, Qo(this, "Aborting")), this.c = !1, this.f = !0, this.a.abort(), this.f = !1, this.dispatchEvent("complete"), this.dispatchEvent("abort"), zo(this));
        }, t.va = function () {
          this.a && (this.c && (this.c = !1, this.f = !0, this.a.abort(), this.f = !1), zo(this, !0)), Ko.qb.va.call(this);
        }, t.Jb = function () {
          this.qa || (this.I || this.i || this.f ? Jo(this) : this.wc());
        }, t.wc = function () {
          Jo(this);
        }, t.getResponse = function () {
          try {
            if (!this.a) return null;
            if ("response" in this.a) return this.a.response;
            switch (this.o) {
              case Fo:
              case"text":
                return this.a.responseText;
              case"arraybuffer":
                if ("mozResponseArrayBuffer" in this.a) return this.a.mozResponseArrayBuffer
            }
            var t = this.b;
            return t && t.log(So, "Response type " + this.o + " is not supported on this browser", void 0), null
          } catch (t) {
            return Do(this.b, "Can not get response: " + t.message), null
          }
        }, ta.prototype.cancel = function (t) {
          if (this.a) this.c instanceof ta && this.c.cancel(); else {
            if (this.b) {
              var e = this.b;
              delete this.b, t ? e.cancel(t) : (e.m--, e.m <= 0 && e.cancel());
            }
            this.v ? this.v.call(this.u, this) : this.l = !0, this.a || (t = new sa(this), na(this), ea(this, !1, t));
          }
        }, ta.prototype.o = function (t, e) {
          this.i = !1, ea(this, t, e);
        }, ta.prototype.then = function (t, e, n) {
          var i, r, o = new gt(function (t, e) {
            i = t, r = e;
          });
          return ia(this, i, function (t) {
            t instanceof sa ? o.cancel() : r(t);
          }), o.then(t, e, n)
        }, ta.prototype.$goog_Thenable = !0, E(aa, A), aa.prototype.message = "Deferred has already fired", aa.prototype.name = "AlreadyCalledError", E(sa, A), sa.prototype.message = "Deferred was canceled", sa.prototype.name = "CanceledError", ua.prototype.c = function () {
          throw (delete ca[this.a], this.b)
        };
        var ca = {};

        function ha(t) {
          var e, n, i, r, o, a = document, s = In(t).toString(), u = document.createElement("SCRIPT"),
            c = {Lb: u, Ga: void 0}, h = new ta(c);
          return e = window.setTimeout(function () {
            fa(u, !0);
            var t = new va(pa, "Timeout reached for loading script " + s);
            na(h), ea(h, !1, t);
          }, 5e3), c.Ga = e, u.onload = u.onreadystatechange = function () {
            u.readyState && "loaded" != u.readyState && "complete" != u.readyState || (fa(u, !1, e), na(h), ea(h, !0, null));
          }, u.onerror = function () {
            fa(u, !0, e);
            var t = new va(da, "Error while loading script " + s);
            na(h), ea(h, !1, t);
          }, ct(c = {}, {
            type: "text/javascript",
            charset: "UTF-8"
          }), Mn(u, c), i = t, (n = u).src = In(i), null === d && (d = (i = (i = l.document).querySelector && i.querySelector("script[nonce]")) && (i = i.nonce || i.getAttribute("nonce")) && f.test(i) ? i : ""), (i = d) && n.setAttribute("nonce", i), (r = a, (o = (r || document).getElementsByTagName("HEAD")) && 0 != o.length ? o[0] : r.documentElement).appendChild(u), h
        }

        function la() {
          if (this && this.Lb) {
            var t = this.Lb;
            t && "SCRIPT" == t.tagName && fa(t, !0, this.Ga);
          }
        }

        function fa(t, e, n) {
          null != n && l.clearTimeout(n), t.onload = s, t.onerror = s, t.onreadystatechange = s, e && window.setTimeout(function () {
            t && t.parentNode && t.parentNode.removeChild(t);
          }, 0);
        }

        var da = 0, pa = 1;

        function va(t, e) {
          var n = "Jsloader error (code #" + t + ")";
          e && (n += ": " + e), A.call(this, n), this.code = t;
        }

        function ma(t) {
          this.f = t;
        }

        function ga(t, e, n) {
          if (this.b = t, t = e || {}, this.i = t.secureTokenEndpoint || "https://securetoken.googleapis.com/v1/token", this.m = t.secureTokenTimeout || wa, this.f = ot(t.secureTokenHeaders || Ia), this.g = t.firebaseEndpoint || "https://www.googleapis.com/identitytoolkit/v3/relyingparty/", this.h = t.firebaseTimeout || Ta, this.a = ot(t.firebaseHeaders || ka), n && (this.a["X-Client-Version"] = n, this.f["X-Client-Version"] = n), n = "Node" == ii(), !(n = l.XMLHttpRequest || n && Wh.INTERNAL.node && Wh.INTERNAL.node.XMLHttpRequest) && !ni()) throw new Bi("internal-error", "The XMLHttpRequest compatibility library was not found.");
          this.c = void 0, ni() ? this.c = new Lo(self) : ri() ? this.c = new ma(n) : this.c = new yo;
        }

        E(va, A), E(ma, vo), ma.prototype.a = function () {
          return new this.f
        }, ma.prototype.b = function () {
          return {}
        };
        var ba, ya = "idToken", wa = new ki(3e4, 6e4), Ia = {"Content-Type": "application/x-www-form-urlencoded"},
          Ta = new ki(3e4, 6e4), ka = {"Content-Type": "application/json"};

        function Ea(t, e) {
          e ? t.a["X-Firebase-Locale"] = e : delete t.a["X-Firebase-Locale"];
        }

        function Sa(t, e) {
          e ? (t.a["X-Client-Version"] = e, t.f["X-Client-Version"] = e) : (delete t.a["X-Client-Version"], delete t.f["X-Client-Version"]);
        }

        function Aa(t, e, n, i, r, o, a) {
          var s;
          (t = !((s = si(s = hi()) != ai ? null : (s = s.match(/\sChrome\/(\d+)/i)) && 2 == s.length ? parseInt(s[1], 10) : null) && s < 30 || Gt && te && !(9 < te)) || ni() ? I(t.o, t) : (ba || (ba = new gt(function (t, e) {
            !function (t, e) {
              if (((window.gapi || {}).client || {}).request) t(); else {
                l[Oa] = function () {
                  ((window.gapi || {}).client || {}).request ? t() : e(Error("CORS_UNSUPPORTED"));
                };
                var n = Tn(Na, {onload: Oa});
                ia(ha(n), null, function () {
                  e(Error("CORS_UNSUPPORTED"));
                }, void 0);
              }
            }(t, e);
          })), I(t.l, t)))(e, n, i, r, o, a);
        }

        ga.prototype.o = function (t, n, e, i, r, o) {
          if (ni() && (void 0 === l.fetch || void 0 === l.Headers || void 0 === l.Request)) throw new Bi("operation-not-supported-in-this-environment", "fetch, Headers and Request native APIs or equivalent Polyfills must be available to support HTTP requests from a Worker environment.");
          var a = new Ko(this.c);
          if (o) {
            a.g = Math.max(0, o);
            var s = setTimeout(function () {
              a.dispatchEvent("timeout");
            }, o);
          }
          De(a, "complete", function () {
            s && clearTimeout(s);
            var e = null;
            try {
              e = JSON.parse(function (e) {
                try {
                  return e.a ? e.a.responseText : ""
                } catch (t) {
                  return Do(e.b, "Can not get responseText: " + t.message), ""
                }
              }(this)) || null;
            } catch (t) {
              e = null;
            }
            n && n(e);
          }), Le(a, "ready", function () {
            s && clearTimeout(s), Kt(this);
          }), Le(a, "timeout", function () {
            s && clearTimeout(s), Kt(this), n && n(null);
          }), Bo(a, t, e, i, r);
        };
        var Na = new mn(yn, "https://apis.google.com/js/client.js?onload=%{onload}"),
          Oa = "__fcb" + Math.floor(1e6 * Math.random()).toString();

        function _a(t) {
          if (!h(t = t.email) || !Zn.test(t)) throw new Bi("invalid-email")
        }

        function Pa(t) {
          "email" in t && _a(t);
        }

        function Ca(t) {
          if (!t[ya]) throw new Bi("internal-error")
        }

        function Ra(t) {
          if (t.phoneNumber || t.temporaryProof) {
            if (!t.phoneNumber || !t.temporaryProof) throw new Bi("internal-error")
          } else {
            if (!t.sessionInfo) throw new Bi("missing-verification-id");
            if (!t.code) throw new Bi("missing-verification-code")
          }
        }

        ga.prototype.l = function (t, n, i, r, o) {
          var a = this;
          ba.then(function () {
            window.gapi.client.setApiKey(a.b);
            var e = window.gapi.auth.getToken();
            window.gapi.auth.setToken(null), window.gapi.client.request({
              path: t,
              method: i,
              body: r,
              headers: o,
              authType: "none",
              callback: function (t) {
                window.gapi.auth.setToken(e), n && n(t);
              }
            });
          }).s(function (t) {
            n && n({error: {message: t && t.message || "CORS_UNSUPPORTED"}});
          });
        }, ga.prototype.ob = function () {
          return ps(this, os, {})
        }, ga.prototype.rb = function (t, e) {
          return ps(this, is, {idToken: t, email: e})
        }, ga.prototype.sb = function (t, e) {
          return ps(this, rs, {idToken: t, password: e})
        };
        var Da = {displayName: "DISPLAY_NAME", photoUrl: "PHOTO_URL"};

        function La(t) {
          if (!t.requestUri || !t.sessionId && !t.postBody && !t.pendingToken) throw new Bi("internal-error")
        }

        function xa(t, e) {
          return e.oauthIdToken && e.providerId && 0 == e.providerId.indexOf("oidc.") && !e.pendingToken && (t.sessionId ? e.nonce = t.sessionId : t.postBody && (ln(t = new sn(t.postBody), "nonce") && (e.nonce = t.get("nonce")))), e
        }

        function Ma(t) {
          var e = null;
          if (t.needConfirmation ? (t.code = "account-exists-with-different-credential", e = po(t)) : "FEDERATED_USER_ID_ALREADY_LINKED" == t.errorMessage ? (t.code = "credential-already-in-use", e = po(t)) : "EMAIL_EXISTS" == t.errorMessage ? (t.code = "email-already-in-use", e = po(t)) : t.errorMessage && (e = vs(t.errorMessage)), e) throw e;
          if (!t[ya]) throw new Bi("internal-error")
        }

        function ja(t, e) {
          return e.returnIdpCredential = !0, ps(t, as, e)
        }

        function Ua(t, e) {
          return e.returnIdpCredential = !0, ps(t, us, e)
        }

        function Va(t, e) {
          return e.returnIdpCredential = !0, e.autoCreate = !1, ps(t, ss, e)
        }

        function Ka(t) {
          if (!t.oobCode) throw new Bi("invalid-action-code")
        }

        (t = ga.prototype).tb = function (t, i) {
          var r = {idToken: t}, o = [];
          return it(Da, function (t, e) {
            var n = i[e];
            null === n ? o.push(t) : e in i && (r[e] = n);
          }), o.length && (r.deleteAttribute = o), ps(this, is, r)
        }, t.kb = function (t, e) {
          return ct(t = {requestType: "PASSWORD_RESET", email: t}, e), ps(this, Za, t)
        }, t.lb = function (t, e) {
          return ct(t = {requestType: "EMAIL_SIGNIN", email: t}, e), ps(this, Ya, t)
        }, t.jb = function (t, e) {
          return ct(t = {requestType: "VERIFY_EMAIL", idToken: t}, e), ps(this, $a, t)
        }, t.Ua = function (t) {
          return ps(this, ls, t)
        }, t.Za = function (t, e) {
          return ps(this, es, {oobCode: t, newPassword: e})
        }, t.Ka = function (t) {
          return ps(this, qa, {oobCode: t})
        }, t.Wa = function (t) {
          return ps(this, Fa, {oobCode: t})
        };
        var Fa = {endpoint: "setAccountInfo", C: Ka, da: "email"}, qa = {
            endpoint: "resetPassword", C: Ka, J: function (t) {
              var e = t.requestType;
              if (!e || !t.email && "EMAIL_SIGNIN" != e) throw new Bi("internal-error")
            }
          }, Ha = {
            endpoint: "signupNewUser", C: function (t) {
              if (_a(t), !t.password) throw new Bi("weak-password")
            }, J: Ca, R: !0
          }, Ba = {endpoint: "createAuthUri"}, Ga = {endpoint: "deleteAccount", T: ["idToken"]}, Wa = {
            endpoint: "setAccountInfo", T: ["idToken", "deleteProvider"], C: function (t) {
              if (!v(t.deleteProvider)) throw new Bi("internal-error")
            }
          }, Xa = {endpoint: "emailLinkSignin", T: ["email", "oobCode"], C: _a, J: Ca, R: !0},
          Ja = {endpoint: "emailLinkSignin", T: ["idToken", "email", "oobCode"], C: _a, J: Ca, R: !0},
          za = {endpoint: "getAccountInfo"}, Ya = {
            endpoint: "getOobConfirmationCode", T: ["requestType"], C: function (t) {
              if ("EMAIL_SIGNIN" != t.requestType) throw new Bi("internal-error");
              _a(t);
            }, da: "email"
          }, $a = {
            endpoint: "getOobConfirmationCode", T: ["idToken", "requestType"], C: function (t) {
              if ("VERIFY_EMAIL" != t.requestType) throw new Bi("internal-error")
            }, da: "email"
          }, Za = {
            endpoint: "getOobConfirmationCode", T: ["requestType"], C: function (t) {
              if ("PASSWORD_RESET" != t.requestType) throw new Bi("internal-error");
              _a(t);
            }, da: "email"
          }, Qa = {wb: !0, endpoint: "getProjectConfig", Ib: "GET"}, ts = {
            wb: !0, endpoint: "getRecaptchaParam", Ib: "GET", J: function (t) {
              if (!t.recaptchaSiteKey) throw new Bi("internal-error")
            }
          }, es = {endpoint: "resetPassword", C: Ka, da: "email"},
          ns = {endpoint: "sendVerificationCode", T: ["phoneNumber", "recaptchaToken"], da: "sessionInfo"},
          is = {endpoint: "setAccountInfo", T: ["idToken"], C: Pa, R: !0}, rs = {
            endpoint: "setAccountInfo", T: ["idToken"], C: function (t) {
              if (Pa(t), !t.password) throw new Bi("weak-password")
            }, J: Ca, R: !0
          }, os = {endpoint: "signupNewUser", J: Ca, R: !0},
          as = {endpoint: "verifyAssertion", C: La, Qa: xa, J: Ma, R: !0}, ss = {
            endpoint: "verifyAssertion", C: La, Qa: xa, J: function (t) {
              if (t.errorMessage && "USER_NOT_FOUND" == t.errorMessage) throw new Bi("user-not-found");
              if (t.errorMessage) throw vs(t.errorMessage);
              if (!t[ya]) throw new Bi("internal-error")
            }, R: !0
          }, us = {
            endpoint: "verifyAssertion", C: function (t) {
              if (La(t), !t.idToken) throw new Bi("internal-error")
            }, Qa: xa, J: Ma, R: !0
          }, cs = {
            endpoint: "verifyCustomToken", C: function (t) {
              if (!t.token) throw new Bi("invalid-custom-token")
            }, J: Ca, R: !0
          }, hs = {
            endpoint: "verifyPassword", C: function (t) {
              if (_a(t), !t.password) throw new Bi("wrong-password")
            }, J: Ca, R: !0
          }, ls = {endpoint: "verifyPhoneNumber", C: Ra, J: Ca}, fs = {
            endpoint: "verifyPhoneNumber", C: function (t) {
              if (!t.idToken) throw new Bi("internal-error");
              Ra(t);
            }, J: function (t) {
              if (t.temporaryProof) throw (t.code = "credential-already-in-use", po(t));
              Ca(t);
            }
          }, ds = {Wb: {USER_NOT_FOUND: "user-not-found"}, endpoint: "verifyPhoneNumber", C: Ra, J: Ca};

        function ps(t, e, n) {
          if (!function (t, e) {
            if (!e || !e.length) return !0;
            if (!t) return !1;
            for (var n = 0; n < e.length; n++) {
              var i = t[e[n]];
              if (null == i || "" === i) return !1
            }
            return !0
          }(n, e.T)) return St(new Bi("internal-error"));
          var i, r = e.Ib || "POST";
          return Et(n).then(e.C).then(function () {
            return e.R && (n.returnSecureToken = !0), function (t, e, i, r, o, n) {
              var a = Ye(t.g + e);
              Je(a, "key", t.b), n && Je(a, "cb", k().toString());
              var s = "GET" == i;
              if (s) for (var u in r) r.hasOwnProperty(u) && Je(a, u, r[u]);
              return new gt(function (e, n) {
                Aa(t, a.toString(), function (t) {
                  t ? t.error ? n(ms(t, o || {})) : e(t) : n(new Bi("network-request-failed"));
                }, i, s ? void 0 : Kn(bi(r)), t.a, t.h.get());
              })
            }(t, e.endpoint, r, n, e.Wb, e.wb || !1)
          }).then(function (t) {
            return i = t, e.Qa ? e.Qa(n, i) : i
          }).then(e.J).then(function () {
            if (!e.da) return i;
            if (!(e.da in i)) throw new Bi("internal-error");
            return i[e.da]
          })
        }

        function vs(t) {
          return ms({error: {errors: [{message: t}], code: 400, message: t}})
        }

        function ms(t, e) {
          var n = (t.error && t.error.errors && t.error.errors[0] || {}).reason || "",
            i = {keyInvalid: "invalid-api-key", ipRefererBlocked: "app-not-authorized"};
          if (n = i[n] ? new Bi(i[n]) : null) return n;
          for (var r in (n = t.error && t.error.message || "", ct(i = {
            INVALID_CUSTOM_TOKEN: "invalid-custom-token",
            CREDENTIAL_MISMATCH: "custom-token-mismatch",
            MISSING_CUSTOM_TOKEN: "internal-error",
            INVALID_IDENTIFIER: "invalid-email",
            MISSING_CONTINUE_URI: "internal-error",
            INVALID_EMAIL: "invalid-email",
            INVALID_PASSWORD: "wrong-password",
            USER_DISABLED: "user-disabled",
            MISSING_PASSWORD: "internal-error",
            EMAIL_EXISTS: "email-already-in-use",
            PASSWORD_LOGIN_DISABLED: "operation-not-allowed",
            INVALID_IDP_RESPONSE: "invalid-credential",
            INVALID_PENDING_TOKEN: "invalid-credential",
            FEDERATED_USER_ID_ALREADY_LINKED: "credential-already-in-use",
            MISSING_OR_INVALID_NONCE: "missing-or-invalid-nonce",
            INVALID_MESSAGE_PAYLOAD: "invalid-message-payload",
            INVALID_RECIPIENT_EMAIL: "invalid-recipient-email",
            INVALID_SENDER: "invalid-sender",
            EMAIL_NOT_FOUND: "user-not-found",
            RESET_PASSWORD_EXCEED_LIMIT: "too-many-requests",
            EXPIRED_OOB_CODE: "expired-action-code",
            INVALID_OOB_CODE: "invalid-action-code",
            MISSING_OOB_CODE: "internal-error",
            INVALID_PROVIDER_ID: "invalid-provider-id",
            CREDENTIAL_TOO_OLD_LOGIN_AGAIN: "requires-recent-login",
            INVALID_ID_TOKEN: "invalid-user-token",
            TOKEN_EXPIRED: "user-token-expired",
            USER_NOT_FOUND: "user-token-expired",
            CORS_UNSUPPORTED: "cors-unsupported",
            DYNAMIC_LINK_NOT_ACTIVATED: "dynamic-link-not-activated",
            INVALID_APP_ID: "invalid-app-id",
            TOO_MANY_ATTEMPTS_TRY_LATER: "too-many-requests",
            WEAK_PASSWORD: "weak-password",
            OPERATION_NOT_ALLOWED: "operation-not-allowed",
            USER_CANCELLED: "user-cancelled",
            CAPTCHA_CHECK_FAILED: "captcha-check-failed",
            INVALID_APP_CREDENTIAL: "invalid-app-credential",
            INVALID_CODE: "invalid-verification-code",
            INVALID_PHONE_NUMBER: "invalid-phone-number",
            INVALID_SESSION_INFO: "invalid-verification-id",
            INVALID_TEMPORARY_PROOF: "invalid-credential",
            MISSING_APP_CREDENTIAL: "missing-app-credential",
            MISSING_CODE: "missing-verification-code",
            MISSING_PHONE_NUMBER: "missing-phone-number",
            MISSING_SESSION_INFO: "missing-verification-id",
            QUOTA_EXCEEDED: "quota-exceeded",
            SESSION_EXPIRED: "code-expired",
            REJECTED_CREDENTIAL: "rejected-credential",
            INVALID_CONTINUE_URI: "invalid-continue-uri",
            MISSING_ANDROID_PACKAGE_NAME: "missing-android-pkg-name",
            MISSING_IOS_BUNDLE_ID: "missing-ios-bundle-id",
            UNAUTHORIZED_DOMAIN: "unauthorized-continue-uri",
            INVALID_DYNAMIC_LINK_DOMAIN: "invalid-dynamic-link-domain",
            INVALID_OAUTH_CLIENT_ID: "invalid-oauth-client-id",
            INVALID_CERT_HASH: "invalid-cert-hash",
            ADMIN_ONLY_OPERATION: "admin-restricted-operation"
          }, e || {}), e = (e = n.match(/^[^\s]+\s*:\s*(.*)$/)) && 1 < e.length ? e[1] : void 0, i)) if (0 === n.indexOf(r)) return new Bi(i[r], e);
          return !e && t && (e = gi(t)), new Bi("internal-error", e)
        }

        function gs(t) {
          var o;
          this.b = t, this.a = null, this.fb = (o = this, (Is || (Is = new gt(function (t, e) {
            function n() {
              Ti(), li("gapi.load")("gapi.iframes", {
                callback: t, ontimeout: function () {
                  Ti(), e(Error("Network Error"));
                }, timeout: ys.get()
              });
            }

            if (li("gapi.iframes.Iframe")) t(); else if (li("gapi.load")) n(); else {
              var i = "__iframefcb" + Math.floor(1e6 * Math.random()).toString();
              l[i] = function () {
                li("gapi.load") ? n() : e(Error("Network Error"));
              }, Et(ha(i = Tn(bs, {onload: i}))).s(function () {
                e(Error("Network Error"));
              });
            }
          }).s(function (t) {
            throw (Is = null, t)
          }))).then(function () {
            return new gt(function (i, r) {
              li("gapi.iframes.getContext")().open({
                where: document.body,
                url: o.b,
                messageHandlersFilter: li("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"),
                attributes: {style: {position: "absolute", top: "-100px", width: "1px", height: "1px"}},
                dontclear: !0
              }, function (t) {
                function e() {
                  clearTimeout(n), i();
                }

                o.a = t, o.a.restyle({setHideOnLeave: !1});
                var n = setTimeout(function () {
                  r(Error("Network Error"));
                }, ws.get());
                t.ping(e).then(e, function () {
                  r(Error("Network Error"));
                });
              });
            })
          }));
        }

        var bs = new mn(yn, "https://apis.google.com/js/api.js?onload=%{onload}"), ys = new ki(3e4, 6e4),
          ws = new ki(5e3, 15e3), Is = null;

        function Ts(t, e, n) {
          this.i = t, this.g = e, this.h = n, this.f = null, this.a = $e(this.i, "/__/auth/iframe"), Je(this.a, "apiKey", this.g), Je(this.a, "appName", this.h), this.b = null, this.c = [];
        }

        function ks(t, e, n, i, r) {
          this.o = t, this.l = e, this.c = n, this.m = i, this.h = this.g = this.i = null, this.a = r, this.f = null;
        }

        function Es(t) {
          try {
            return Wh.app(t).auth().ya()
          } catch (t) {
            return []
          }
        }

        function Ss(t, e, n, i, r) {
          this.l = t, this.f = e, this.b = n, this.c = i || null, this.h = r || null, this.o = this.u = this.v = null, this.g = [], this.m = this.a = null;
        }

        function As(t) {
          var e, s = Wn();
          return (e = t, ps(e, Qa, {}).then(function (t) {
            return t.authorizedDomains || []
          })).then(function (t) {
            t:{
              var e = Ye(s), n = e.f;
              e = e.b;
              for (var i = 0; i < t.length; i++) {
                var r = t[i], o = e, a = n;
                if (o = 0 == r.indexOf("chrome-extension://") ? Ye(r).b == o && "chrome-extension" == a : ("http" == a || "https" == a) && ($n.test(r) ? o == r : (r = r.split(".").join("\\."), new RegExp("^(.+\\." + r + "|" + r + ")$", "i").test(o)))) {
                  t = !0;
                  break t
                }
              }
              t = !1;
            }
            if (!t) throw new lo(Wn())
          })
        }

        function Ns(r) {
          return r.m || (r.m = Qn().then(function () {
            if (!r.u) {
              var t = r.c, e = r.h, n = Es(r.b), i = new Ts(r.l, r.f, r.b);
              i.f = t, i.b = e, i.c = q(n || []), r.u = i.toString();
            }
            r.i = new gs(r.u), function (i) {
              if (!i.i) throw Error("IfcHandler must be initialized!");
              t = i.i, e = function (t) {
                var e = {};
                if (t && t.authEvent) {
                  var n = !1;
                  for (t = so(t.authEvent), e = 0; e < i.g.length; e++) n = i.g[e](t) || n;
                  return (e = {}).status = n ? "ACK" : "ERROR", Et(e)
                }
                return e.status = "ERROR", Et(e)
              }, t.fb.then(function () {
                t.a.register("authEvent", e, li("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));
              });
              var t, e;
            }(r);
          })), r.m
        }

        function Os(t) {
          return t.o || (t.v = t.c ? ci(t.c, Es(t.b)) : null, t.o = new ga(t.f, dr(t.h), t.v)), t.o
        }

        function _s(t, e, n, i, r, o, a, s, u, c) {
          return (t = new ks(t, e, n, i, r)).i = o, t.g = a, t.h = s, t.b = ot(u || null), t.f = c, t.toString()
        }

        function Ps(t) {
          if (this.a = t || Wh.INTERNAL.reactNative && Wh.INTERNAL.reactNative.AsyncStorage, !this.a) throw new Bi("internal-error", "The React Native compatibility library was not found.");
          this.type = "asyncStorage";
        }

        function Cs(t) {
          this.b = t, this.a = {}, this.c = I(this.f, this);
        }

        Ts.prototype.toString = function () {
          return this.f ? Je(this.a, "v", this.f) : hn(this.a.a, "v"), this.b ? Je(this.a, "eid", this.b) : hn(this.a.a, "eid"), this.c.length ? Je(this.a, "fw", this.c.join(",")) : hn(this.a.a, "fw"), this.a.toString()
        }, ks.prototype.toString = function () {
          var t = $e(this.o, "/__/auth/handler");
          if (Je(t, "apiKey", this.l), Je(t, "appName", this.c), Je(t, "authType", this.m), this.a.isOAuthProvider) {
            var e = this.a;
            try {
              var n = Wh.app(this.c).auth().ea();
            } catch (t) {
              n = null;
            }
            for (var i in (e.$a = n, Je(t, "providerId", this.a.providerId), n = bi((e = this.a).zb))) n[i] = n[i].toString();
            i = e.Dc, n = ot(n);
            for (var r = 0; r < i.length; r++) {
              var o = i[r];
              o in n && delete n[o];
            }
            e.cb && e.$a && !n[e.cb] && (n[e.cb] = e.$a), rt(n) || Je(t, "customParameters", gi(n));
          }
          if ("function" == typeof this.a.Fb && ((e = this.a.Fb()).length && Je(t, "scopes", e.join(","))), this.i ? Je(t, "redirectUrl", this.i) : hn(t.a, "redirectUrl"), this.g ? Je(t, "eventId", this.g) : hn(t.a, "eventId"), this.h ? Je(t, "v", this.h) : hn(t.a, "v"), this.b) for (var a in this.b) this.b.hasOwnProperty(a) && !ze(t, a) && Je(t, a, this.b[a]);
          return this.f ? Je(t, "eid", this.f) : hn(t.a, "eid"), (a = Es(this.c)).length && Je(t, "fw", a.join(",")), t.toString()
        }, (t = Ss.prototype).Ea = function (e, n, t) {
          var i = new Bi("popup-closed-by-user"), r = new Bi("web-storage-unsupported"), o = this, a = !1;
          return this.ga().then(function () {
            var t, i;
            (t = o, i = {type: "webStorageSupport"}, Ns(t).then(function () {
              return e = t.i, n = i, e.fb.then(function () {
                return new gt(function (t) {
                  e.a.send(n.type, n, t, li("gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER"));
                })
              });
              var e, n;
            }).then(function (t) {
              if (t && t.length && void 0 !== t[0].webStorageSupport) return t[0].webStorageSupport;
              throw Error()
            })).then(function (t) {
              t || (e && zn(e), n(r), a = !0);
            });
          }).s(function () {
          }).then(function () {
            if (!a) return n = e, new gt(function (e) {
              return function t() {
                je(2e3).then(function () {
                  if (n && !n.closed) return t();
                  e();
                });
              }()
            });
            var n;
          }).then(function () {
            if (!a) return je(t).then(function () {
              n(i);
            })
          })
        }, t.Mb = function () {
          var t = hi();
          return !mi(t) && !Ii(t)
        }, t.Hb = function () {
          return !1
        }, t.Db = function (e, t, n, i, r, o, a) {
          if (!e) return St(new Bi("popup-blocked"));
          if (a && !mi()) return this.ga().s(function (t) {
            zn(e), r(t);
          }), i(), Et();
          this.a || (this.a = As(Os(this)));
          var s = this;
          return this.a.then(function () {
            var t = s.ga().s(function (t) {
              throw (zn(e), r(t), t)
            });
            return i(), t
          }).then(function () {
            (oo(n), a) || Xn(_s(s.l, s.f, s.b, t, n, null, o, s.c, void 0, s.h), e);
          }).s(function (t) {
            throw("auth/network-request-failed" == t.code && (s.a = null), t)
          });
        }, t.Ca = function (t, e, n) {
          this.a || (this.a = As(Os(this)));
          var i = this;
          return this.a.then(function () {
            oo(e), Xn(_s(i.l, i.f, i.b, t, e, Wn(), n, i.c, void 0, i.h));
          }).s(function (t) {
            throw("auth/network-request-failed" == t.code && (i.a = null), t)
          });
        }, t.ga = function () {
          var t = this;
          return Ns(this).then(function () {
            return t.i.fb
          }).s(function () {
            throw (t.a = null, new Bi("network-request-failed"))
          });
        }, t.Pb = function () {
          return !0
        }, t.wa = function (t) {
          this.g.push(t);
        }, t.La = function (e) {
          K(this.g, function (t) {
            return t == e
          });
        }, (t = Ps.prototype).get = function (t) {
          return Et(this.a.getItem(t)).then(function (t) {
            return t && yi(t)
          })
        }, t.set = function (t, e) {
          return Et(this.a.setItem(t, gi(e)))
        }, t.P = function (t) {
          return Et(this.a.removeItem(t))
        }, t.Y = function () {
        }, t.ca = function () {
        };
        var Rs, Ds = [];

        function Ls(t) {
          this.a = t;
        }

        function xs(t) {
          this.c = t, this.b = !1, this.a = [];
        }

        function Ms(i, t, e, n) {
          var r, o, a, s, u = e || {}, c = null;
          if (i.b) return St(Error("connection_unavailable"));
          var h = n ? 800 : 50, l = "undefined" != typeof MessageChannel ? new MessageChannel : null;
          return new gt(function (e, n) {
            l ? (r = Math.floor(Math.random() * Math.pow(10, 20)).toString(), l.port1.start(), a = setTimeout(function () {
              n(Error("unsupported_event"));
            }, h), c = {
              messageChannel: l, onMessage: o = function (t) {
                t.data.eventId === r && ("ack" === t.data.status ? (clearTimeout(a), s = setTimeout(function () {
                  n(Error("timeout"));
                }, 3e3)) : "done" === t.data.status ? (clearTimeout(s), void 0 !== t.data.response ? e(t.data.response) : n(Error("unknown_error"))) : (clearTimeout(a), clearTimeout(s), n(Error("invalid_response"))));
              }
            }, i.a.push(c), l.port1.addEventListener("message", o), i.c.postMessage({
              eventType: t,
              eventId: r,
              data: u
            }, [l.port2])) : n(Error("connection_unavailable"));
          }).then(function (t) {
            return js(i, c), t
          }).s(function (t) {
            throw (js(i, c), t)
          });
        }

        function js(t, e) {
          if (e) {
            var n = e.messageChannel, i = e.onMessage;
            n && (n.port1.removeEventListener("message", i), n.port1.close()), K(t.a, function (t) {
              return t == e
            });
          }
        }

        function Us() {
          if (!Fs()) throw new Bi("web-storage-unsupported");
          this.c = {}, this.a = [], this.b = 0, this.l = l.indexedDB, this.type = "indexedDB", this.g = this.m = this.f = this.i = null, this.u = !1, this.h = null;
          var t, i = this;
          ni() && self ? (this.m = function () {
            var e = ni() ? self : null;
            if (x(Ds, function (t) {
              t.b == e && (n = t);
            }), !n) {
              var n = new Cs(e);
              Ds.push(n);
            }
            return n
          }(), this.m.subscribe("keyChanged", function (t, n) {
            return Ws(i).then(function (e) {
              return 0 < e.length && x(i.a, function (t) {
                t(e);
              }), {keyProcessed: U(e, n.key)}
            })
          }), this.m.subscribe("ping", function () {
            return Et(["keyChanged"])
          })) : (t = l.navigator, t && t.serviceWorker ? Et().then(function () {
            return t.serviceWorker.ready
          }).then(function (t) {
            return t.active || null
          }).s(function () {
            return null
          }) : Et(null)).then(function (t) {
            (i.h = t) && (i.g = new xs(new Ls(t)), Ms(i.g, "ping", null, !0).then(function (t) {
              t[0].fulfilled && U(t[0].value, "keyChanged") && (i.u = !0);
            }).s(function () {
            }));
          });
        }

        function Vs(r) {
          return new gt(function (e, n) {
            var t = r.l.open("firebaseLocalStorageDb", 1);
            t.onerror = function (t) {
              try {
                t.preventDefault();
              } catch (t) {
              }
              n(Error(t.target.error));
            }, t.onupgradeneeded = function (t) {
              t = t.target.result;
              try {
                t.createObjectStore("firebaseLocalStorage", {keyPath: "fbase_key"});
              } catch (t) {
                n(t);
              }
            }, t.onsuccess = function (t) {
              var i;
              (t = t.target.result).objectStoreNames.contains("firebaseLocalStorage") ? e(t) : (i = r, new gt(function (t, e) {
                var n = i.l.deleteDatabase("firebaseLocalStorageDb");
                n.onsuccess = function () {
                  t();
                }, n.onerror = function (t) {
                  e(Error(t.target.error));
                };
              })).then(function () {
                return Vs(r)
              }).then(function (t) {
                e(t);
              }).s(function (t) {
                n(t);
              });
            };
          })
        }

        function Ks(t) {
          return t.o || (t.o = Vs(t)), t.o
        }

        function Fs() {
          try {
            return !!l.indexedDB
          } catch (t) {
            return !1
          }
        }

        function qs(t) {
          return t.objectStore("firebaseLocalStorage")
        }

        function Hs(t, e) {
          return t.transaction(["firebaseLocalStorage"], e ? "readwrite" : "readonly")
        }

        function Bs(t) {
          return new gt(function (e, n) {
            t.onsuccess = function (t) {
              t && t.target ? e(t.target.result) : e();
            }, t.onerror = function (t) {
              n(t.target.error);
            };
          })
        }

        function Gs(t, e) {
          return t.g && t.h && ((n = l.navigator) && n.serviceWorker && n.serviceWorker.controller || null) === t.h ? Ms(t.g, "keyChanged", {key: e}, t.u).then(function () {
          }).s(function () {
          }) : Et();
          var n;
        }

        function Ws(i) {
          return Ks(i).then(function (t) {
            var r = qs(Hs(t, !1));
            return r.getAll ? Bs(r.getAll()) : new gt(function (e, n) {
              var i = [], t = r.openCursor();
              t.onsuccess = function (t) {
                (t = t.target.result) ? (i.push(t.value), t.continue()) : e(i);
              }, t.onerror = function (t) {
                n(t.target.error);
              };
            })
          }).then(function (t) {
            var e = {}, n = [];
            if (0 == i.b) {
              for (n = 0; n < t.length; n++) e[t[n].fbase_key] = t[n].value;
              n = function t(e, n) {
                var i, r = [];
                for (i in e) i in n ? typeof e[i] != typeof n[i] ? r.push(i) : "object" == typeof e[i] && null != e[i] && null != n[i] ? 0 < t(e[i], n[i]).length && r.push(i) : e[i] !== n[i] && r.push(i) : r.push(i);
                for (i in n) i in e || r.push(i);
                return r
              }(i.c, e), i.c = e;
            }
            return n
          })
        }

        function Xs(t) {
          t.i && t.i.cancel("STOP_EVENT"), t.f && (clearTimeout(t.f), t.f = null);
        }

        function Js(t) {
          var i = this, r = null;
          this.a = [], this.type = "indexedDB", this.c = t, this.b = Et().then(function () {
            if (Fs()) {
              var e = wi(), n = "__sak" + e;
              return Rs || (Rs = new Us), (r = Rs).set(n, e).then(function () {
                return r.get(n)
              }).then(function (t) {
                if (t !== e) throw Error("indexedDB not supported!");
                return r.P(n)
              }).then(function () {
                return r
              }).s(function () {
                return i.c
              })
            }
            return i.c
          }).then(function (t) {
            return i.type = t.type, t.Y(function (e) {
              x(i.a, function (t) {
                t(e);
              });
            }), t
          });
        }

        function zs() {
          this.a = {}, this.type = "inMemory";
        }

        function Ys() {
          if (!function () {
            var t = "Node" == ii();
            if (!(t = $s() || t && Wh.INTERNAL.node && Wh.INTERNAL.node.localStorage)) return !1;
            try {
              return t.setItem("__sak", "1"), t.removeItem("__sak"), !0
            } catch (t) {
              return !1
            }
          }()) {
            if ("Node" == ii()) throw new Bi("internal-error", "The LocalStorage compatibility library was not found.");
            throw new Bi("web-storage-unsupported")
          }
          this.a = $s() || Wh.INTERNAL.node.localStorage, this.type = "localStorage";
        }

        function $s() {
          try {
            var t = l.localStorage, e = wi();
            return t && (t.setItem(e, "1"), t.removeItem(e)), t
          } catch (t) {
            return null
          }
        }

        function Zs() {
          this.type = "nullStorage";
        }

        function Qs() {
          if (!function () {
            var t = "Node" == ii();
            if (!(t = tu() || t && Wh.INTERNAL.node && Wh.INTERNAL.node.sessionStorage)) return !1;
            try {
              return t.setItem("__sak", "1"), t.removeItem("__sak"), !0
            } catch (t) {
              return !1
            }
          }()) {
            if ("Node" == ii()) throw new Bi("internal-error", "The SessionStorage compatibility library was not found.");
            throw new Bi("web-storage-unsupported")
          }
          this.a = tu() || Wh.INTERNAL.node.sessionStorage, this.type = "sessionStorage";
        }

        function tu() {
          try {
            var t = l.sessionStorage, e = wi();
            return t && (t.setItem(e, "1"), t.removeItem(e)), t
          } catch (t) {
            return null
          }
        }

        function eu() {
          var t = {};
          t.Browser = ru, t.Node = ou, t.ReactNative = au, t.Worker = su, this.a = t[ii()];
        }

        Cs.prototype.f = function (n) {
          var i = n.data.eventType, r = n.data.eventId, t = this.a[i];
          if (t && 0 < t.length) {
            n.ports[0].postMessage({status: "ack", eventId: r, eventType: i, response: null});
            var e = [];
            x(t, function (t) {
              e.push(Et().then(function () {
                return t(n.origin, n.data.data)
              }));
            }), Nt(e).then(function (t) {
              var e = [];
              x(t, function (t) {
                e.push({fulfilled: t.Eb, value: t.value, reason: t.reason ? t.reason.message : void 0});
              }), x(e, function (t) {
                for (var e in t) void 0 === t[e] && delete t[e];
              }), n.ports[0].postMessage({status: "done", eventId: r, eventType: i, response: e});
            });
          }
        }, Cs.prototype.subscribe = function (t, e) {
          rt(this.a) && this.b.addEventListener("message", this.c), void 0 === this.a[t] && (this.a[t] = []), this.a[t].push(e);
        }, Cs.prototype.unsubscribe = function (t, e) {
          void 0 !== this.a[t] && e ? (K(this.a[t], function (t) {
            return t == e
          }), 0 == this.a[t].length && delete this.a[t]) : e || delete this.a[t], rt(this.a) && this.b.removeEventListener("message", this.c);
        }, Ls.prototype.postMessage = function (t, e) {
          this.a.postMessage(t, e);
        }, xs.prototype.close = function () {
          for (; 0 < this.a.length;) js(this, this.a[0]);
          this.b = !0;
        }, (t = Us.prototype).set = function (n, i) {
          var r, o = !1, a = this;
          return Ks(this).then(function (t) {
            return Bs((t = qs(Hs(r = t, !0))).get(n))
          }).then(function (t) {
            var e = qs(Hs(r, !0));
            return t ? (t.value = i, Bs(e.put(t))) : (a.b++, o = !0, (t = {}).fbase_key = n, t.value = i, Bs(e.add(t)))
          }).then(function () {
            return a.c[n] = i, Gs(a, n)
          }).ia(function () {
            o && a.b--;
          })
        }, t.get = function (e) {
          return Ks(this).then(function (t) {
            return Bs(qs(Hs(t, !1)).get(e))
          }).then(function (t) {
            return t && t.value
          })
        }, t.P = function (e) {
          var n = !1, i = this;
          return Ks(this).then(function (t) {
            return n = !0, i.b++, Bs(qs(Hs(t, !0)).delete(e))
          }).then(function () {
            return delete i.c[e], Gs(i, e)
          }).ia(function () {
            n && i.b--;
          })
        }, t.Y = function (t) {
          var n;
          0 == this.a.length && (Xs(n = this), function e() {
            n.f = setTimeout(function () {
              n.i = Ws(n).then(function (e) {
                0 < e.length && x(n.a, function (t) {
                  t(e);
                });
              }).then(function () {
                e();
              }).s(function (t) {
                "STOP_EVENT" != t.message && e();
              });
            }, 800);
          }()), this.a.push(t);
        }, t.ca = function (e) {
          K(this.a, function (t) {
            return t == e
          }), 0 == this.a.length && Xs(this);
        }, (t = Js.prototype).get = function (e) {
          return this.b.then(function (t) {
            return t.get(e)
          })
        }, t.set = function (e, n) {
          return this.b.then(function (t) {
            return t.set(e, n)
          })
        }, t.P = function (e) {
          return this.b.then(function (t) {
            return t.P(e)
          })
        }, t.Y = function (t) {
          this.a.push(t);
        }, t.ca = function (e) {
          K(this.a, function (t) {
            return t == e
          });
        }, (t = zs.prototype).get = function (t) {
          return Et(this.a[t])
        }, t.set = function (t, e) {
          return this.a[t] = e, Et()
        }, t.P = function (t) {
          return delete this.a[t], Et()
        }, t.Y = function () {
        }, t.ca = function () {
        }, (t = Ys.prototype).get = function (t) {
          var e = this;
          return Et().then(function () {
            return yi(e.a.getItem(t))
          })
        }, t.set = function (e, n) {
          var i = this;
          return Et().then(function () {
            var t = gi(n);
            null === t ? i.P(e) : i.a.setItem(e, t);
          })
        }, t.P = function (t) {
          var e = this;
          return Et().then(function () {
            e.a.removeItem(t);
          })
        }, t.Y = function (t) {
          l.window && we(l.window, "storage", t);
        }, t.ca = function (t) {
          l.window && ke(l.window, "storage", t);
        }, (t = Zs.prototype).get = function () {
          return Et(null)
        }, t.set = function () {
          return Et()
        }, t.P = function () {
          return Et()
        }, t.Y = function () {
        }, t.ca = function () {
        }, (t = Qs.prototype).get = function (t) {
          var e = this;
          return Et().then(function () {
            return yi(e.a.getItem(t))
          })
        }, t.set = function (e, n) {
          var i = this;
          return Et().then(function () {
            var t = gi(n);
            null === t ? i.P(e) : i.a.setItem(e, t);
          })
        }, t.P = function (t) {
          var e = this;
          return Et().then(function () {
            e.a.removeItem(t);
          })
        }, t.Y = function () {
        }, t.ca = function () {
        };
        var nu, iu, ru = {B: Ys, Ra: Qs}, ou = {B: Ys, Ra: Qs}, au = {B: Ps, Ra: Zs}, su = {B: Ys, Ra: Zs},
          uu = {Xc: "local", NONE: "none", Zc: "session"};

        function cu() {
          var t = !(Ii(hi()) || !ei()), e = mi(), n = fi();
          this.o = t, this.h = e, this.m = n, this.a = {}, nu || (nu = new eu), t = nu;
          try {
            this.g = !Gn() && Ai() || !l.indexedDB ? new t.a.B : new Js(ni() ? new zs : new t.a.B);
          } catch (t) {
            this.g = new zs, this.h = !0;
          }
          try {
            this.i = new t.a.Ra;
          } catch (t) {
            this.i = new zs;
          }
          this.l = new zs, this.f = I(this.Ob, this), this.b = {};
        }

        function hu() {
          return iu || (iu = new cu), iu
        }

        function lu(t, e) {
          switch (e) {
            case"session":
              return t.i;
            case"none":
              return t.l;
            default:
              return t.g
          }
        }

        function fu(t, e) {
          return "firebase:" + t.name + (e ? ":" + e : "")
        }

        function du(t, e, n) {
          return n = fu(e, n), "local" == e.B && (t.b[n] = null), lu(t, e.B).P(n)
        }

        function pu(t) {
          t.c && (clearInterval(t.c), t.c = null);
        }

        function vu(t) {
          this.a = t, this.b = hu();
        }

        (t = cu.prototype).get = function (t, e) {
          return lu(this, t.B).get(fu(t, e))
        }, t.set = function (e, t, n) {
          var i = fu(e, n), r = this, o = lu(this, e.B);
          return o.set(i, t).then(function () {
            return o.get(i)
          }).then(function (t) {
            "local" == e.B && (r.b[i] = t);
          })
        }, t.addListener = function (t, e, n) {
          var i;
          t = fu(t, e), this.m && (this.b[t] = l.localStorage.getItem(t)), rt(this.a) && (lu(this, "local").Y(this.f), this.h || (Gn() || !Ai()) && l.indexedDB || !this.m || (pu(i = this), i.c = setInterval(function () {
            for (var t in i.a) {
              var e = l.localStorage.getItem(t), n = i.b[t];
              e != n && (i.b[t] = e, e = new ce({
                type: "storage",
                key: t,
                target: window,
                oldValue: n,
                newValue: e,
                a: !0
              }), i.Ob(e));
            }
          }, 1e3))), this.a[t] || (this.a[t] = []), this.a[t].push(n);
        }, t.removeListener = function (t, e, n) {
          t = fu(t, e), this.a[t] && (K(this.a[t], function (t) {
            return t == n
          }), 0 == this.a[t].length && delete this.a[t]), rt(this.a) && (lu(this, "local").ca(this.f), pu(this));
        }, t.Ob = function (t) {
          if (t && t.f) {
            var e = t.a.key;
            if (null == e) for (var n in this.a) {
              var i = this.b[n];
              void 0 === i && (i = null);
              var r = l.localStorage.getItem(n);
              r !== i && (this.b[n] = r, this.Xa(n));
            } else if (0 == e.indexOf("firebase:") && this.a[e]) {
              if (void 0 !== t.a.a ? lu(this, "local").ca(this.f) : pu(this), this.o) if (n = l.localStorage.getItem(e), (i = t.a.newValue) !== n) null !== i ? l.localStorage.setItem(e, i) : l.localStorage.removeItem(e); else if (this.b[e] === i && void 0 === t.a.a) return;
              var o = this;
              n = function () {
                void 0 === t.a.a && o.b[e] === l.localStorage.getItem(e) || (o.b[e] = l.localStorage.getItem(e), o.Xa(e));
              }, Gt && te && 10 == te && l.localStorage.getItem(e) !== t.a.newValue && t.a.newValue !== t.a.oldValue ? setTimeout(n, 10) : n();
            }
          } else x(t, I(this.Xa, this));
        }, t.Xa = function (t) {
          this.a[t] && x(this.a[t], function (t) {
            t();
          });
        };
        var mu, gu = {name: "authEvent", B: "local"};

        function bu() {
          this.a = hu();
        }

        function yu(t, e) {
          this.b = wu, this.f = l.Uint8Array ? new Uint8Array(this.b) : Array(this.b), this.g = this.c = 0, this.a = [], this.i = t, this.h = e, this.m = l.Int32Array ? new Int32Array(64) : Array(64), void 0 !== mu || (mu = l.Int32Array ? new Int32Array(Nu) : Nu), this.reset();
        }

        E(yu, function () {
          this.b = -1;
        });
        for (var wu = 64, Iu = wu - 1, Tu = [], ku = 0; ku < Iu; ku++) Tu[ku] = 0;
        var Eu = F(128, Tu);

        function Su(t) {
          for (var e = t.f, n = t.m, i = 0, r = 0; r < e.length;) n[i++] = e[r] << 24 | e[r + 1] << 16 | e[r + 2] << 8 | e[r + 3], r = 4 * i;
          for (e = 16; e < 64; e++) {
            r = 0 | n[e - 15], i = 0 | n[e - 2];
            var o = (0 | n[e - 16]) + ((r >>> 7 | r << 25) ^ (r >>> 18 | r << 14) ^ r >>> 3) | 0,
              a = (0 | n[e - 7]) + ((i >>> 17 | i << 15) ^ (i >>> 19 | i << 13) ^ i >>> 10) | 0;
            n[e] = o + a | 0;
          }
          i = 0 | t.a[0], r = 0 | t.a[1];
          var s = 0 | t.a[2], u = 0 | t.a[3], c = 0 | t.a[4], h = 0 | t.a[5], l = 0 | t.a[6];
          for (o = 0 | t.a[7], e = 0; e < 64; e++) {
            var f = ((i >>> 2 | i << 30) ^ (i >>> 13 | i << 19) ^ (i >>> 22 | i << 10)) + (i & r ^ i & s ^ r & s) | 0;
            a = (o = o + ((c >>> 6 | c << 26) ^ (c >>> 11 | c << 21) ^ (c >>> 25 | c << 7)) | 0) + ((a = (a = c & h ^ ~c & l) + (0 | mu[e]) | 0) + (0 | n[e]) | 0) | 0, o = l, l = h, h = c, c = u + a | 0, u = s, s = r, r = i, i = a + f | 0;
          }
          t.a[0] = t.a[0] + i | 0, t.a[1] = t.a[1] + r | 0, t.a[2] = t.a[2] + s | 0, t.a[3] = t.a[3] + u | 0, t.a[4] = t.a[4] + c | 0, t.a[5] = t.a[5] + h | 0, t.a[6] = t.a[6] + l | 0, t.a[7] = t.a[7] + o | 0;
        }

        function Au(t, e, n) {
          void 0 === n && (n = e.length);
          var i = 0, r = t.c;
          if (h(e)) for (; i < n;) t.f[r++] = e.charCodeAt(i++), r == t.b && (Su(t), r = 0); else {
            if (!m(e)) throw Error("message must be string or array");
            for (; i < n;) {
              var o = e[i++];
              if (!("number" == typeof o && 0 <= o && o <= 255 && o == (0 | o))) throw Error("message must be a byte array");
              t.f[r++] = o, r == t.b && (Su(t), r = 0);
            }
          }
          t.c = r, t.g += n;
        }

        yu.prototype.reset = function () {
          this.g = this.c = 0, this.a = l.Int32Array ? new Int32Array(this.h) : q(this.h);
        };
        var Nu = [1116352408, 1899447441, 3049323471, 3921009573, 961987163, 1508970993, 2453635748, 2870763221, 3624381080, 310598401, 607225278, 1426881987, 1925078388, 2162078206, 2614888103, 3248222580, 3835390401, 4022224774, 264347078, 604807628, 770255983, 1249150122, 1555081692, 1996064986, 2554220882, 2821834349, 2952996808, 3210313671, 3336571891, 3584528711, 113926993, 338241895, 666307205, 773529912, 1294757372, 1396182291, 1695183700, 1986661051, 2177026350, 2456956037, 2730485921, 2820302411, 3259730800, 3345764771, 3516065817, 3600352804, 4094571909, 275423344, 430227734, 506948616, 659060556, 883997877, 958139571, 1322822218, 1537002063, 1747873779, 1955562222, 2024104815, 2227730452, 2361852424, 2428436474, 2756734187, 3204031479, 3329325298];

        function Ou() {
          yu.call(this, 8, _u);
        }

        E(Ou, yu);
        var _u = [1779033703, 3144134277, 1013904242, 2773480762, 1359893119, 2600822924, 528734635, 1541459225];

        function Pu(t, e, n, i, r) {
          this.l = t, this.i = e, this.m = n, this.o = i || null, this.u = r || null, this.h = e + ":" + n, this.v = new bu, this.g = new vu(this.h), this.f = null, this.b = [], this.a = this.c = null;
        }

        function Cu(t) {
          return new Bi("invalid-cordova-configuration", t)
        }

        function Ru(t) {
          var e = new Ou;
          Au(e, t), t = [];
          var n = 8 * e.g;
          e.c < 56 ? Au(e, Eu, 56 - e.c) : Au(e, Eu, e.b - (e.c - 56));
          for (var i = 63; 56 <= i; i--) e.f[i] = 255 & n, n /= 256;
          for (Su(e), i = n = 0; i < e.i; i++) for (var r = 24; 0 <= r; r -= 8) t[n++] = e.a[i] >> r & 255;
          return M(t, function (t) {
            return 1 < (t = t.toString(16)).length ? t : "0" + t
          }).join("")
        }

        function Du(t, e) {
          for (var n = 0; n < t.b.length; n++) try {
            t.b[n](e);
          } catch (t) {
          }
        }

        function Lu(i) {
          return i.f || (i.f = i.ga().then(function () {
            return new gt(function (n) {
              i.wa(function t(e) {
                return n(e), i.La(t), !1
              }), function (r) {
                function e(i) {
                  t = !0, n && n.cancel(), xu(r).then(function (t) {
                    var e = o;
                    if (t && i && i.url) {
                      var n = null;
                      -1 != (e = Or(i.url)).indexOf("/__/auth/callback") && (n = (n = "object" == typeof (n = yi(ze(n = Ye(e), "firebaseError") || null)) ? Gi(n) : null) ? new ao(t.c, t.b, null, null, n) : new ao(t.c, t.b, e, t.f)), e = n || o;
                    }
                    Du(r, e);
                  });
                }

                var o = new ao("unknown", null, null, null, new Bi("no-auth-event")), t = !1,
                  n = je(500).then(function () {
                    return xu(r).then(function () {
                      t || Du(r, o);
                    })
                  }), i = l.handleOpenURL;
                l.handleOpenURL = function (t) {
                  if (0 == t.toLowerCase().indexOf(li("BuildInfo.packageName", l).toLowerCase() + "://") && e({url: t}), "function" == typeof i) try {
                    i(t);
                  } catch (t) {
                    console.error(t);
                  }
                }, ho || (ho = new uo), ho.subscribe(e);
              }(i);
            })
          })), i.f
        }

        function xu(e) {
          var t, n = null;
          return (t = e.g, t.b.get(gu, t.a).then(function (t) {
            return so(t)
          })).then(function (t) {
            return n = t, du((t = e.g).b, gu, t.a)
          }).then(function () {
            return n
          })
        }

        function Mu(t) {
          this.a = t, this.b = hu();
        }

        (t = Pu.prototype).ga = function () {
          return this.za ? this.za : this.za = (ti(void 0) ? Qn().then(function () {
            return new gt(function (t, e) {
              var n = l.document, i = setTimeout(function () {
                e(Error("Cordova framework is not ready."));
              }, 1e3);
              n.addEventListener("deviceready", function () {
                clearTimeout(i), t();
              }, !1);
            })
          }) : St(Error("Cordova must run in an Android or iOS file scheme."))).then(function () {
            if ("function" != typeof li("universalLinks.subscribe", l)) throw Cu("cordova-universal-links-plugin-fix is not installed");
            if (void 0 === li("BuildInfo.packageName", l)) throw Cu("cordova-plugin-buildinfo is not installed");
            if ("function" != typeof li("cordova.plugins.browsertab.openUrl", l)) throw Cu("cordova-plugin-browsertab is not installed");
            if ("function" != typeof li("cordova.InAppBrowser.open", l)) throw Cu("cordova-plugin-inappbrowser is not installed")
          }, function () {
            throw new Bi("cordova-not-ready")
          })
        }, t.Ea = function (t, e) {
          return e(new Bi("operation-not-supported-in-this-environment")), Et()
        }, t.Db = function () {
          return St(new Bi("operation-not-supported-in-this-environment"))
        }, t.Pb = function () {
          return !1
        }, t.Mb = function () {
          return !0
        }, t.Hb = function () {
          return !0
        }, t.Ca = function (t, e, n) {
          if (this.c) return St(new Bi("redirect-operation-pending"));
          var i = this, r = l.document, o = null, a = null, s = null, u = null;
          return this.c = Et().then(function () {
            return oo(e), Lu(i)
          }).then(function () {
            return function (n, t, e, i) {
              var r = function () {
                for (var t = 20, e = []; 0 < t;) e.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62 * Math.random()))), t--;
                return e.join("")
              }(), o = new ao(t, i, null, r, new Bi("no-auth-event")), a = li("BuildInfo.packageName", l);
              if ("string" != typeof a) throw new Bi("invalid-cordova-configuration");
              var s = li("BuildInfo.displayName", l), u = {};
              if (hi().toLowerCase().match(/iphone|ipad|ipod/)) u.ibi = a; else {
                if (!hi().toLowerCase().match(/android/)) return St(new Bi("operation-not-supported-in-this-environment"));
                u.apn = a;
              }
              s && (u.appDisplayName = s), r = Ru(r), u.sessionId = r;
              var c = _s(n.l, n.i, n.m, t, e, null, i, n.o, u, n.u);
              return n.ga().then(function () {
                var t = n.h;
                return n.v.a.set(gu, o.w(), t)
              }).then(function () {
                var t = li("cordova.plugins.browsertab.isAvailable", l);
                if ("function" != typeof t) throw new Bi("invalid-cordova-configuration");
                var e = null;
                t(function (t) {
                  if (t) {
                    if ("function" != typeof (e = li("cordova.plugins.browsertab.openUrl", l))) throw new Bi("invalid-cordova-configuration");
                    e(c);
                  } else {
                    if ("function" != typeof (e = li("cordova.InAppBrowser.open", l))) throw new Bi("invalid-cordova-configuration");
                    t = hi(), n.a = e(c, t.match(/(iPad|iPhone|iPod).*OS 7_\d/i) || t.match(/(iPad|iPhone|iPod).*OS 8_\d/i) ? "_blank" : "_system", "location=yes");
                  }
                });
              })
            }(i, t, e, n)
          }).then(function () {
            return new gt(function (e, t) {
              a = function () {
                var t = li("cordova.plugins.browsertab.close", l);
                return e(), "function" == typeof t && t(), i.a && "function" == typeof i.a.close && (i.a.close(), i.a = null), !1
              }, i.wa(a), s = function () {
                o || (o = je(2e3).then(function () {
                  t(new Bi("redirect-cancelled-by-user"));
                }));
              }, u = function () {
                Ei() && s();
              }, r.addEventListener("resume", s, !1), hi().toLowerCase().match(/android/) || r.addEventListener("visibilitychange", u, !1);
            }).s(function (t) {
              return xu(i).then(function () {
                throw t
              })
            })
          }).ia(function () {
            s && r.removeEventListener("resume", s, !1), u && r.removeEventListener("visibilitychange", u, !1), o && o.cancel(), a && i.La(a), i.c = null;
          })
        }, t.wa = function (e) {
          this.b.push(e), Lu(this).s(function (t) {
            "auth/invalid-cordova-configuration" === t.code && (t = new ao("unknown", null, null, null, new Bi("no-auth-event")), e(t));
          });
        }, t.La = function (e) {
          K(this.b, function (t) {
            return t == e
          });
        };
        var ju = {name: "pendingRedirect", B: "session"};

        function Uu(t) {
          return du(t.b, ju, t.a)
        }

        function Vu(t, e, n) {
          this.i = {}, this.u = 0, this.A = t, this.l = e, this.o = n, this.h = [], this.f = !1, this.m = I(this.bb, this), this.b = new zu, this.v = new Qu, this.g = new Mu(this.l + ":" + this.o), this.c = {}, this.c.unknown = this.b, this.c.signInViaRedirect = this.b, this.c.linkViaRedirect = this.b, this.c.reauthViaRedirect = this.b, this.c.signInViaPopup = this.v, this.c.linkViaPopup = this.v, this.c.reauthViaPopup = this.v, this.a = Ku(this.A, this.l, this.o, lr);
        }

        function Ku(t, e, n, i) {
          var r = Wh.SDK_VERSION || null;
          return ti() ? new Pu(t, e, n, r, i) : new Ss(t, e, n, r, i)
        }

        function Fu(e) {
          e.f || (e.f = !0, e.a.wa(e.m));
          var n = e.a;
          return e.a.ga().s(function (t) {
            throw (e.a == n && e.reset(), t)
          });
        }

        function qu(n) {
          n.a.Mb() && Fu(n).s(function (t) {
            var e = new ao("unknown", null, null, null, new Bi("operation-not-supported-in-this-environment"));
            Wu(t) && n.bb(e);
          }), n.a.Hb() || Yu(n.b);
        }

        (t = Vu.prototype).reset = function () {
          this.f = !1, this.a.La(this.m), this.a = Ku(this.A, this.l, this.o), this.i = {};
        }, t.Ya = function () {
          this.b.Ya();
        }, t.subscribe = function (t) {
          if (U(this.h, t) || this.h.push(t), !this.f) {
            var n = this;
            (e = this.g, e.b.get(ju, e.a).then(function (t) {
              return "pending" == t
            })).then(function (t) {
              t ? Uu(n.g).then(function () {
                Fu(n).s(function (t) {
                  var e = new ao("unknown", null, null, null, new Bi("operation-not-supported-in-this-environment"));
                  Wu(t) && n.bb(e);
                });
              }) : qu(n);
            }).s(function () {
              qu(n);
            });
          }
          var e;
        }, t.unsubscribe = function (e) {
          K(this.h, function (t) {
            return t == e
          });
        }, t.bb = function (t) {
          if (!t) throw new Bi("invalid-auth-event");
          if (6e5 <= k() - this.u && (this.i = {}, this.u = 0), t && t.getUid() && this.i.hasOwnProperty(t.getUid())) return !1;
          for (var e = !1, n = 0; n < this.h.length; n++) {
            var i = this.h[n];
            if (i.xb(t.c, t.b)) {
              (e = this.c[t.c]) && (e.h(t, i), t && (t.f || t.b) && (this.i[t.getUid()] = !0, this.u = k())), e = !0;
              break
            }
          }
          return Yu(this.b), e
        };
        var Hu = new ki(2e3, 1e4), Bu = new ki(3e4, 6e4);

        function Gu(t, e, n, i, r, o) {
          return t.a.Db(e, n, i, function () {
            t.f || (t.f = !0, t.a.wa(t.m));
          }, function () {
            t.reset();
          }, r, o)
        }

        function Wu(t) {
          return !(!t || "auth/cordova-not-ready" != t.code)
        }

        Vu.prototype.fa = function () {
          return this.b.fa()
        }, Vu.prototype.Ca = function (t, e, n) {
          var i, r, o = this;
          return (r = this.g, r.b.set(ju, "pending", r.a)).then(function () {
            return o.a.Ca(t, e, n).s(function (t) {
              if (Wu(t)) throw new Bi("operation-not-supported-in-this-environment");
              return i = t, Uu(o.g).then(function () {
                throw i
              })
            }).then(function () {
              return o.a.Pb() ? new gt(function () {
              }) : Uu(o.g).then(function () {
                return o.fa()
              }).then(function () {
              }).s(function () {
              })
            })
          })
        }, Vu.prototype.Ea = function (e, n, t, i) {
          return this.a.Ea(t, function (t) {
            e.ha(n, null, t, i);
          }, Hu.get())
        };
        var Xu = {};

        function Ju(t, e, n) {
          var i = e + ":" + n;
          return Xu[i] || (Xu[i] = new Vu(t, e, n)), Xu[i]
        }

        function zu() {
          this.b = null, this.f = [], this.c = [], this.a = null, this.i = this.g = !1;
        }

        function Yu(t) {
          t.g || (t.g = !0, Zu(t, !1, null, null));
        }

        function $u(t, e) {
          if (t.b = function () {
            return Et(e)
          }, t.f.length) for (var n = 0; n < t.f.length; n++) t.f[n](e);
        }

        function Zu(t, e, n, i) {
          e ? i ? function (t, e) {
            if (t.b = function () {
              return St(e)
            }, t.c.length) for (var n = 0; n < t.c.length; n++) t.c[n](e);
          }(t, i) : $u(t, n) : $u(t, {user: null}), t.f = [], t.c = [];
        }

        function Qu() {
        }

        function tc() {
          this.ub = !1, Object.defineProperty(this, "appVerificationDisabled", {
            get: function () {
              return this.ub
            }, set: function (t) {
              this.ub = t;
            }, enumerable: !1
          });
        }

        function ec(t, e) {
          this.a = e, Ci(this, "verificationId", t);
        }

        function nc(t, e, n, i) {
          return new no(t).Ua(e, n).then(function (t) {
            return new ec(t, i)
          })
        }

        function ic(t) {
          var e = hr(t);
          if (!(e && e.exp && e.auth_time && e.iat)) throw new Bi("internal-error", "An internal error occurred. The token obtained by Firebase appears to be malformed. Please retry the operation.");
          Ri(this, {
            token: t,
            expirationTime: Si(1e3 * e.exp),
            authTime: Si(1e3 * e.auth_time),
            issuedAtTime: Si(1e3 * e.iat),
            signInProvider: e.firebase && e.firebase.sign_in_provider ? e.firebase.sign_in_provider : null,
            claims: e
          });
        }

        function rc(t, e, n) {
          if (this.h = t, this.i = e, this.g = n, this.c = 3e4, this.f = 96e4, this.b = null, this.a = this.c, this.f < this.c) throw Error("Proactive refresh lower bound greater than upper bound!")
        }

        function oc(t, e) {
          return e ? (t.a = t.c, t.g()) : (e = t.a, t.a *= 2, t.a > t.f && (t.a = t.f), e)
        }

        function ac(t) {
          this.f = t, this.b = this.a = null, this.c = 0;
        }

        function sc(t, e) {
          var n = e[ya], i = e.refreshToken;
          e = uc(e.expiresIn), t.b = n, t.c = e, t.a = i;
        }

        function uc(t) {
          return k() + 1e3 * parseInt(t, 10)
        }

        function cc(e, t) {
          return (i = e.f, r = t, new gt(function (e, n) {
            "refresh_token" == r.grant_type && r.refresh_token || "authorization_code" == r.grant_type && r.code ? Aa(i, i.i + "?key=" + encodeURIComponent(i.b), function (t) {
              t ? t.error ? n(ms(t)) : t.access_token && t.refresh_token ? e(t) : n(new Bi("internal-error")) : n(new Bi("network-request-failed"));
            }, "POST", cn(r).toString(), i.f, i.m.get()) : n(new Bi("internal-error"));
          })).then(function (t) {
            return e.b = t.access_token, e.c = uc(t.expires_in), e.a = t.refresh_token, {
              accessToken: e.b,
              expirationTime: e.c,
              refreshToken: e.a
            }
          }).s(function (t) {
            throw("auth/user-token-expired" == t.code && (e.a = null), t)
          });
          var i, r;
        }

        function hc(t, e) {
          this.a = t || null, this.b = e || null, Ri(this, {lastSignInTime: Si(e || null), creationTime: Si(t || null)});
        }

        function lc(t, e, n, i, r, o) {
          Ri(this, {
            uid: t,
            displayName: i || null,
            photoURL: r || null,
            email: n || null,
            phoneNumber: o || null,
            providerId: e
          });
        }

        function fc(t, e) {
          for (var n in (ue.call(this, t), e)) this[n] = e[n];
        }

        function dc(t, e, n) {
          var i;
          this.G = [], this.l = t.apiKey, this.o = t.appName, this.u = t.authDomain || null, t = Wh.SDK_VERSION ? ci(Wh.SDK_VERSION) : null, this.c = new ga(this.l, dr(lr), t), this.h = new ac(this.c), wc(this, e[ya]), sc(this.h, e), Ci(this, "refreshToken", this.h.a), kc(this, n || {}), Re.call(this), this.I = !1, this.u && di() && (this.a = Ju(this.u, this.l, this.o)), this.N = [], this.i = null, this.A = (i = this, new rc(function () {
            return i.F(!0)
          }, function (t) {
            return !(!t || "auth/network-request-failed" != t.code)
          }, function () {
            var t = i.h.c - k() - 3e5;
            return 0 < t ? t : 0
          })), this.V = I(this.Ha, this);
          var r = this;
          this.ka = null, this.ta = function (t) {
            r.pa(t.g);
          }, this.X = null, this.O = [], this.sa = function (t) {
            vc(r, t.c);
          }, this.W = null;
        }

        function pc(t, e) {
          t.X && ke(t.X, "languageCodeChanged", t.ta), (t.X = e) && we(e, "languageCodeChanged", t.ta);
        }

        function vc(t, e) {
          t.O = e, Sa(t.c, Wh.SDK_VERSION ? ci(Wh.SDK_VERSION, t.O) : null);
        }

        function mc(t, e) {
          t.W && ke(t.W, "frameworkChanged", t.sa), (t.W = e) && we(e, "frameworkChanged", t.sa);
        }

        function gc(e) {
          try {
            return Wh.app(e.o).auth()
          } catch (t) {
            throw new Bi("internal-error", "No firebase.auth.Auth instance is available for the Firebase App '" + e.o + "'!")
          }
        }

        function bc(t) {
          t.D || t.A.b || (t.A.start(), ke(t, "tokenChanged", t.V), we(t, "tokenChanged", t.V));
        }

        function yc(t) {
          ke(t, "tokenChanged", t.V), t.A.stop();
        }

        function wc(t, e) {
          t.ra = e, Ci(t, "_lat", e);
        }

        function Ic(t) {
          for (var e = [], n = 0; n < t.N.length; n++) e.push(t.N[n](t));
          return Nt(e).then(function () {
            return t
          })
        }

        function Tc(t) {
          t.a && !t.I && (t.I = !0, t.a.subscribe(t));
        }

        function kc(t, e) {
          Ri(t, {
            uid: e.uid,
            displayName: e.displayName || null,
            photoURL: e.photoURL || null,
            email: e.email || null,
            emailVerified: e.emailVerified || !1,
            phoneNumber: e.phoneNumber || null,
            isAnonymous: e.isAnonymous || !1,
            metadata: new hc(e.createdAt, e.lastLoginAt),
            providerData: []
          });
        }

        function Ec() {
        }

        function Sc(t) {
          return Et().then(function () {
            if (t.D) throw new Bi("app-deleted")
          })
        }

        function Ac(t) {
          return M(t.providerData, function (t) {
            return t.providerId
          })
        }

        function Nc(t, e) {
          e && (Oc(t, e.providerId), t.providerData.push(e));
        }

        function Oc(t, e) {
          K(t.providerData, function (t) {
            return t.providerId == e
          });
        }

        function _c(t, e, n) {
          ("uid" != e || n) && t.hasOwnProperty(e) && Ci(t, e, n);
        }

        function Pc(e, t) {
          var n, i, r;
          e != t && (Ri(e, {
            uid: t.uid,
            displayName: t.displayName,
            photoURL: t.photoURL,
            email: t.email,
            emailVerified: t.emailVerified,
            phoneNumber: t.phoneNumber,
            isAnonymous: t.isAnonymous,
            providerData: []
          }), t.metadata ? Ci(e, "metadata", new hc((r = t.metadata).a, r.b)) : Ci(e, "metadata", new hc), x(t.providerData, function (t) {
            Nc(e, t);
          }), n = e.h, i = t.h, n.b = i.b, n.a = i.a, n.c = i.c, Ci(e, "refreshToken", e.h.a));
        }

        function Cc(r) {
          return r.F().then(function (t) {
            var e, n, i = r.isAnonymous;
            return (e = r, n = t, ps(e.c, za, {idToken: n}).then(I(e.xc, e))).then(function () {
              return i || _c(r, "isAnonymous", !1), t
            })
          })
        }

        function Rc(t, e) {
          e[ya] && t.ra != e[ya] && (sc(t.h, e), t.dispatchEvent(new fc("tokenChanged")), wc(t, e[ya]), _c(t, "refreshToken", t.h.a));
        }

        function Dc(t, e) {
          return Cc(t).then(function () {
            if (U(Ac(t), e)) return Ic(t).then(function () {
              throw new Bi("provider-already-linked")
            })
          })
        }

        function Lc(t, e, n) {
          return Di({user: t, credential: ro(e), additionalUserInfo: e = br(e), operationType: n})
        }

        function xc(t, e) {
          return Rc(t, e), t.reload().then(function () {
            return t
          })
        }

        function Mc(n, i, t, e, r) {
          if (!di()) return St(new Bi("operation-not-supported-in-this-environment"));
          if (n.i && !r) return St(n.i);
          var o = gr(t.providerId), a = wi(n.uid + ":::"), s = null;
          (!mi() || ei()) && n.u && t.isOAuthProvider && (s = _s(n.u, n.l, n.o, i, t, null, a, Wh.SDK_VERSION || null));
          var u = Yn(s, o && o.Ba, o && o.Aa);
          return e = e().then(function () {
            if (Uc(n), !r) return n.F().then(function () {
            })
          }).then(function () {
            return Gu(n.a, u, i, t, a, !!s)
          }).then(function () {
            return new gt(function (t, e) {
              n.ha(i, null, new Bi("cancelled-popup-request"), n.g || null), n.f = t, n.v = e, n.g = a, n.b = n.a.Ea(n, i, u, a);
            })
          }).then(function (t) {
            return u && zn(u), t ? Di(t) : null
          }).s(function (t) {
            throw (u && zn(u), t)
          }), Vc(n, e, r);
        }

        function jc(e, t, n, i, r) {
          if (!di()) return St(new Bi("operation-not-supported-in-this-environment"));
          if (e.i && !r) return St(e.i);
          var o = null, a = wi(e.uid + ":::");
          return i = i().then(function () {
            if (Uc(e), !r) return e.F().then(function () {
            })
          }).then(function () {
            return e.aa = a, Ic(e)
          }).then(function (t) {
            return e.ba && (t = (t = e.ba).b.set(qc, e.w(), t.a)), t
          }).then(function () {
            return e.a.Ca(t, n, a)
          }).s(function (t) {
            if (o = t, e.ba) return Hc(e.ba);
            throw o
          }).then(function () {
            if (o) throw o
          }), Vc(e, i, r)
        }

        function Uc(t) {
          if (!t.a || !t.I) {
            if (t.a && !t.I) throw new Bi("internal-error");
            throw new Bi("auth-domain-config-required")
          }
        }

        function Vc(t, e, n) {
          var i, r, o, a = (r = e, o = n, (i = t).i && !o ? (r.cancel(), St(i.i)) : r.s(function (t) {
            throw(!t || "auth/user-disabled" != t.code && "auth/user-token-expired" != t.code || (i.i || i.dispatchEvent(new fc("userInvalidated")), i.i = t), t)
          }));
          return t.G.push(a), a.ia(function () {
            V(t.G, a);
          }), a
        }

        function Kc(t) {
          if (!t.apiKey) return null;
          var e = {apiKey: t.apiKey, authDomain: t.authDomain, appName: t.appName}, n = {};
          if (!(t.stsTokenManager && t.stsTokenManager.accessToken && t.stsTokenManager.expirationTime)) return null;
          n[ya] = t.stsTokenManager.accessToken, n.refreshToken = t.stsTokenManager.refreshToken || null, n.expiresIn = (t.stsTokenManager.expirationTime - k()) / 1e3;
          var i = new dc(e, n, t);
          return t.providerData && x(t.providerData, function (t) {
            t && Nc(i, Di(t));
          }), t.redirectEventId && (i.aa = t.redirectEventId), i
        }

        function Fc(t) {
          this.a = t, this.b = hu();
        }

        zu.prototype.reset = function () {
          this.b = null, this.a && (this.a.cancel(), this.a = null);
        }, zu.prototype.h = function (t, e) {
          if (t) {
            this.reset(), this.g = !0;
            var n = t.c, i = t.b, r = t.a && "auth/web-storage-unsupported" == t.a.code,
              o = t.a && "auth/operation-not-supported-in-this-environment" == t.a.code;
            this.i = !(!r && !o), "unknown" != n || r || o ? t.a ? (Zu(this, !0, null, t.a), Et()) : e.xa(n, i) ? function (e, t, n) {
              n = n.xa(t.c, t.b);
              var i = t.g, r = t.f, o = t.h, a = !!t.c.match(/Redirect$/);
              n(i, r, o).then(function (t) {
                Zu(e, a, t, null);
              }).s(function (t) {
                Zu(e, a, null, t);
              });
            }(this, t, e) : St(new Bi("invalid-auth-event")) : (Zu(this, !1, null, null), Et());
          } else St(new Bi("invalid-auth-event"));
        }, zu.prototype.Ya = function () {
          this.g && !this.i && Zu(this, !1, null, null);
        }, zu.prototype.fa = function () {
          var r = this;
          return new gt(function (t, e) {
            var n, i;
            r.b ? r.b().then(t, e) : (r.f.push(t), r.c.push(e), n = r, i = new Bi("timeout"), n.a && n.a.cancel(), n.a = je(Bu.get()).then(function () {
              n.b || (n.g = !0, Zu(n, !0, null, i));
            }));
          })
        }, Qu.prototype.h = function (t, e) {
          if (t) {
            var n = t.c, i = t.b;
            t.a ? (e.ha(t.c, null, t.a, t.b), Et()) : e.xa(n, i) ? (o = e, a = (r = t).b, s = r.c, o.xa(s, a)(r.g, r.f, r.h).then(function (t) {
              o.ha(s, t, null, a);
            }).s(function (t) {
              o.ha(s, null, t, a);
            })) : St(new Bi("invalid-auth-event"));
          } else St(new Bi("invalid-auth-event"));
          var r, o, a, s;
        }, ec.prototype.confirm = function (t) {
          return t = io(this.verificationId, t), this.a(t)
        }, rc.prototype.start = function () {
          this.a = this.c, function e(n, t) {
            n.stop();
            n.b = je(oc(n, t)).then(function () {
              return e = l.document, n = null, Ei() || !e ? Et() : new gt(function (t) {
                n = function () {
                  Ei() && (e.removeEventListener("visibilitychange", n, !1), t());
                }, e.addEventListener("visibilitychange", n, !1);
              }).s(function (t) {
                throw (e.removeEventListener("visibilitychange", n, !1), t)
              });
              var e, n;
            }).then(function () {
              return n.h()
            }).then(function () {
              e(n, !0);
            }).s(function (t) {
              n.i(t) && e(n, !1);
            });
          }(this, !0);
        }, rc.prototype.stop = function () {
          this.b && (this.b.cancel(), this.b = null);
        }, ac.prototype.w = function () {
          return {apiKey: this.f.b, refreshToken: this.a, accessToken: this.b, expirationTime: this.c}
        }, ac.prototype.getToken = function (t) {
          return t = !!t, this.b && !this.a ? St(new Bi("user-token-expired")) : t || !this.b || k() > this.c - 3e4 ? this.a ? cc(this, {
            grant_type: "refresh_token",
            refresh_token: this.a
          }) : Et(null) : Et({accessToken: this.b, expirationTime: this.c, refreshToken: this.a})
        }, hc.prototype.w = function () {
          return {lastLoginAt: this.b, createdAt: this.a}
        }, E(fc, ue), E(dc, Re), dc.prototype.pa = function (t) {
          this.ka = t, Ea(this.c, t);
        }, dc.prototype.ea = function () {
          return this.ka
        }, dc.prototype.ya = function () {
          return q(this.O)
        }, dc.prototype.Ha = function () {
          this.A.b && (this.A.stop(), this.A.start());
        }, Ci(dc.prototype, "providerId", "firebase"), (t = dc.prototype).reload = function () {
          var t = this;
          return Vc(this, Sc(this).then(function () {
            return Cc(t).then(function () {
              return Ic(t)
            }).then(Ec)
          }))
        }, t.bc = function (t) {
          return this.F(t).then(function (t) {
            return new ic(t)
          })
        }, t.F = function (t) {
          var e = this;
          return Vc(this, Sc(this).then(function () {
            return e.h.getToken(t)
          }).then(function (t) {
            if (!t) throw new Bi("internal-error");
            return t.accessToken != e.ra && (wc(e, t.accessToken), e.dispatchEvent(new fc("tokenChanged"))), _c(e, "refreshToken", t.refreshToken), t.accessToken
          }))
        }, t.xc = function (t) {
          if (!(t = t.users) || !t.length) throw new Bi("internal-error");
          kc(this, {
            uid: (t = t[0]).localId,
            displayName: t.displayName,
            photoURL: t.photoUrl,
            email: t.email,
            emailVerified: !!t.emailVerified,
            phoneNumber: t.phoneNumber,
            lastLoginAt: t.lastLoginAt,
            createdAt: t.createdAt
          });
          for (var e = (i = (i = t).providerUserInfo) && i.length ? M(i, function (t) {
            return new lc(t.rawId, t.providerId, t.email, t.displayName, t.photoUrl, t.phoneNumber)
          }) : [], n = 0; n < e.length; n++) Nc(this, e[n]);
          var i;
          _c(this, "isAnonymous", !(this.email && t.passwordHash || this.providerData && this.providerData.length));
        }, t.yc = function (t) {
          return _i("firebase.User.prototype.reauthenticateAndRetrieveDataWithCredential is deprecated. Please use firebase.User.prototype.reauthenticateWithCredential instead."), this.gb(t)
        }, t.gb = function (t) {
          var e = this, n = null;
          return Vc(this, t.f(this.c, this.uid).then(function (t) {
            return Rc(e, t), n = Lc(e, t, "reauthenticate"), e.i = null, e.reload()
          }).then(function () {
            return n
          }), !0)
        }, t.pc = function (t) {
          return _i("firebase.User.prototype.linkAndRetrieveDataWithCredential is deprecated. Please use firebase.User.prototype.linkWithCredential instead."), this.eb(t)
        }, t.eb = function (e) {
          var n = this, i = null;
          return Vc(this, Dc(this, e.providerId).then(function () {
            return n.F()
          }).then(function (t) {
            return e.b(n.c, t)
          }).then(function (t) {
            return i = Lc(n, t, "link"), xc(n, t)
          }).then(function () {
            return i
          }))
        }, t.qc = function (t, e) {
          var n = this;
          return Vc(this, Dc(this, "phone").then(function () {
            return nc(gc(n), t, e, I(n.eb, n))
          }))
        }, t.zc = function (t, e) {
          var n = this;
          return Vc(this, Et().then(function () {
            return nc(gc(n), t, e, I(n.gb, n))
          }), !0)
        }, t.rb = function (e) {
          var n = this;
          return Vc(this, this.F().then(function (t) {
            return n.c.rb(t, e)
          }).then(function (t) {
            return Rc(n, t), n.reload()
          }))
        }, t.Pc = function (e) {
          var n = this;
          return Vc(this, this.F().then(function (t) {
            return e.b(n.c, t)
          }).then(function (t) {
            return Rc(n, t), n.reload()
          }))
        }, t.sb = function (e) {
          var n = this;
          return Vc(this, this.F().then(function (t) {
            return n.c.sb(t, e)
          }).then(function (t) {
            return Rc(n, t), n.reload()
          }))
        }, t.tb = function (e) {
          if (void 0 === e.displayName && void 0 === e.photoURL) return Sc(this);
          var n = this;
          return Vc(this, this.F().then(function (t) {
            return n.c.tb(t, {displayName: e.displayName, photoUrl: e.photoURL})
          }).then(function (t) {
            return Rc(n, t), _c(n, "displayName", t.displayName || null), _c(n, "photoURL", t.photoUrl || null), x(n.providerData, function (t) {
              "password" === t.providerId && (Ci(t, "displayName", n.displayName), Ci(t, "photoURL", n.photoURL));
            }), Ic(n)
          }).then(Ec))
        }, t.Nc = function (r) {
          var o = this;
          return Vc(this, Cc(this).then(function (t) {
            return U(Ac(o), r) ? (e = o.c, n = t, i = [r], ps(e, Wa, {
              idToken: n,
              deleteProvider: i
            })).then(function (t) {
              var e = {};
              return x(t.providerUserInfo || [], function (t) {
                e[t.providerId] = !0;
              }), x(Ac(o), function (t) {
                e[t] || Oc(o, t);
              }), e[no.PROVIDER_ID] || Ci(o, "phoneNumber", null), Ic(o)
            }) : Ic(o).then(function () {
              throw new Bi("no-such-provider")
            });
            var e, n, i;
          }))
        }, t.delete = function () {
          var e = this;
          return Vc(this, this.F().then(function (t) {
            return ps(e.c, Ga, {idToken: t})
          }).then(function () {
            e.dispatchEvent(new fc("userDeleted"));
          })).then(function () {
            for (var t = 0; t < e.G.length; t++) e.G[t].cancel("app-deleted");
            pc(e, null), mc(e, null), e.G = [], e.D = !0, yc(e), Ci(e, "refreshToken", null), e.a && e.a.unsubscribe(e);
          })
        }, t.xb = function (t, e) {
          return !!("linkViaPopup" == t && (this.g || null) == e && this.f || "reauthViaPopup" == t && (this.g || null) == e && this.f || "linkViaRedirect" == t && (this.aa || null) == e || "reauthViaRedirect" == t && (this.aa || null) == e)
        }, t.ha = function (t, e, n, i) {
          "linkViaPopup" != t && "reauthViaPopup" != t || i != (this.g || null) || (n && this.v ? this.v(n) : e && !n && this.f && this.f(e), this.b && (this.b.cancel(), this.b = null), delete this.f, delete this.v);
        }, t.xa = function (t, e) {
          return "linkViaPopup" == t && e == (this.g || null) ? I(this.Bb, this) : "reauthViaPopup" == t && e == (this.g || null) ? I(this.Cb, this) : "linkViaRedirect" == t && (this.aa || null) == e ? I(this.Bb, this) : "reauthViaRedirect" == t && (this.aa || null) == e ? I(this.Cb, this) : null
        }, t.rc = function (t) {
          var e = this;
          return Mc(this, "linkViaPopup", t, function () {
            return Dc(e, t.providerId).then(function () {
              return Ic(e)
            })
          }, !1)
        }, t.Ac = function (t) {
          return Mc(this, "reauthViaPopup", t, function () {
            return Et()
          }, !0)
        }, t.sc = function (t) {
          var e = this;
          return jc(this, "linkViaRedirect", t, function () {
            return Dc(e, t.providerId)
          }, !1)
        }, t.Bc = function (t) {
          return jc(this, "reauthViaRedirect", t, function () {
            return Et()
          }, !0)
        }, t.Bb = function (e, n, i) {
          var r = this;
          this.b && (this.b.cancel(), this.b = null);
          var o = null;
          return Vc(this, this.F().then(function (t) {
            return Ua(r.c, {requestUri: e, postBody: i, sessionId: n, idToken: t})
          }).then(function (t) {
            return o = Lc(r, t, "link"), xc(r, t)
          }).then(function () {
            return o
          }))
        }, t.Cb = function (t, e, n) {
          var i = this;
          this.b && (this.b.cancel(), this.b = null);
          var r = null;
          return Vc(this, Et().then(function () {
            return Pr(Va(i.c, {requestUri: t, sessionId: e, postBody: n}), i.uid)
          }).then(function (t) {
            return r = Lc(i, t, "reauthenticate"), Rc(i, t), i.i = null, i.reload()
          }).then(function () {
            return r
          }), !0)
        }, t.jb = function (e) {
          var n = this, i = null;
          return Vc(this, this.F().then(function (t) {
            return i = t, void 0 === e || rt(e) ? {} : rr(new Ji(e))
          }).then(function (t) {
            return n.c.jb(i, t)
          }).then(function (t) {
            if (n.email != t) return n.reload()
          }).then(function () {
          }))
        }, t.toJSON = function () {
          return this.w()
        }, t.w = function () {
          var e = {
            uid: this.uid,
            displayName: this.displayName,
            photoURL: this.photoURL,
            email: this.email,
            emailVerified: this.emailVerified,
            phoneNumber: this.phoneNumber,
            isAnonymous: this.isAnonymous,
            providerData: [],
            apiKey: this.l,
            appName: this.o,
            authDomain: this.u,
            stsTokenManager: this.h.w(),
            redirectEventId: this.aa || null
          };
          return this.metadata && ct(e, this.metadata.w()), x(this.providerData, function (t) {
            e.providerData.push(function (t) {
              var e, n = {};
              for (e in t) t.hasOwnProperty(e) && (n[e] = t[e]);
              return n
            }(t));
          }), e
        };
        var qc = {name: "redirectUser", B: "session"};

        function Hc(t) {
          return du(t.b, qc, t.a)
        }

        function Bc(t) {
          var e, n, i, r, o, a, s, u, c;
          this.a = t, this.b = hu(), this.c = null, this.f = (e = this, n = Xc("local"), i = Xc("session"), r = Xc("none"), (o = e.b, a = n, s = e.a, u = fu(a, s), c = lu(o, a.B), o.get(a, s).then(function (t) {
            var e = null;
            try {
              e = yi(l.localStorage.getItem(u));
            } catch (t) {
            }
            if (e && !t) return l.localStorage.removeItem(u), o.set(a, e, s);
            e && t && "localStorage" != c.type && l.localStorage.removeItem(u);
          })).then(function () {
            return e.b.get(i, e.a)
          }).then(function (t) {
            return t ? i : e.b.get(r, e.a).then(function (t) {
              return t ? r : e.b.get(n, e.a).then(function (t) {
                return t ? n : e.b.get(Wc, e.a).then(function (t) {
                  return t ? Xc(t) : n
                })
              })
            })
          }).then(function (t) {
            return e.c = t, Gc(e, t.B)
          }).s(function () {
            e.c || (e.c = n);
          })), this.b.addListener(Xc("local"), this.a, I(this.g, this));
        }

        function Gc(t, e) {
          var n, s, i = [];
          for (n in uu) uu[n] !== e && i.push(du(t.b, Xc(uu[n]), t.a));
          return i.push(du(t.b, Wc, t.a)), s = i, new gt(function (n, e) {
            var i = s.length, r = [];
            if (i) for (var t = function (t, e) {
              i--, r[t] = e, 0 == i && n(r);
            }, o = function (t) {
              e(t);
            }, a = 0; a < s.length; a++) At(s[a], T(t, a), o); else n(r);
          })
        }

        Bc.prototype.g = function () {
          var e = this, n = Xc("local");
          $c(this, function () {
            return Et().then(function () {
              return e.c && "local" != e.c.B ? e.b.get(n, e.a) : null
            }).then(function (t) {
              if (t) return Gc(e, "local").then(function () {
                e.c = n;
              })
            })
          });
        };
        var Wc = {name: "persistence", B: "session"};

        function Xc(t) {
          return {name: "authUser", B: t}
        }

        function Jc(t, e) {
          return $c(t, function () {
            return t.b.set(t.c, e.w(), t.a)
          })
        }

        function zc(t) {
          return $c(t, function () {
            return du(t.b, t.c, t.a)
          })
        }

        function Yc(t, e) {
          return $c(t, function () {
            return t.b.get(t.c, t.a).then(function (t) {
              return t && e && (t.authDomain = e), Kc(t || {})
            })
          })
        }

        function $c(t, e) {
          return t.f = t.f.then(e, e), t.f
        }

        function Zc(t) {
          if (this.l = !1, Ci(this, "settings", new tc), Ci(this, "app", t), !oh(this).options || !oh(this).options.apiKey) throw new Bi("invalid-api-key");
          var n, e, i, r, o, a, s, u, c, h, l, f;
          t = Wh.SDK_VERSION ? ci(Wh.SDK_VERSION) : null, this.c = new ga(oh(this).options && oh(this).options.apiKey, dr(lr), t), this.N = [], this.o = [], this.I = [], this.Sb = Wh.INTERNAL.createSubscribe(I(this.mc, this)), this.O = void 0, this.Tb = Wh.INTERNAL.createSubscribe(I(this.nc, this)), ih(this, null), this.h = new Bc(oh(this).options.apiKey + ":" + oh(this).name), this.A = new Fc(oh(this).options.apiKey + ":" + oh(this).name), this.V = ch(this, (e = oh(n = this).options.authDomain, i = (r = n, o = (a = r.A, s = oh(r).options.authDomain, a.b.get(qc, a.a).then(function (t) {
            return t && s && (t.authDomain = s), Kc(t || {})
          })).then(function (t) {
            return (r.D = t) && (t.ba = r.A), Hc(r.A)
          }), ch(r, o)).then(function () {
            return Yc(n.h, e)
          }).then(function (e) {
            return e ? (e.ba = n.A, n.D && (n.D.aa || null) == (e.aa || null) ? e : e.reload().then(function () {
              return Jc(n.h, e).then(function () {
                return e
              })
            }).s(function (t) {
              return "auth/network-request-failed" == t.code ? e : zc(n.h)
            })) : null
          }).then(function (t) {
            ih(n, t || null);
          }), ch(n, i))), this.i = ch(this, (u = this).V.then(function () {
            return u.fa()
          }).s(function () {
          }).then(function () {
            if (!u.l) return u.ka()
          }).s(function () {
          }).then(function () {
            if (!u.l) {
              u.X = !0;
              var t = u.h;
              t.b.addListener(Xc("local"), t.a, u.ka);
            }
          })), this.X = !1, this.ka = I(this.Kc, this), this.Ha = I(this.Z, this), this.ra = I(this.$b, this), this.sa = I(this.jc, this), this.ta = I(this.kc, this), h = oh(c = this).options.authDomain, l = oh(c).options.apiKey, h && di() && (c.Rb = c.V.then(function () {
            if (!c.l) {
              if (c.a = Ju(h, l, oh(c).name), c.a.subscribe(c), ah(c) && Tc(ah(c)), c.D) {
                Tc(c.D);
                var t = c.D;
                t.pa(c.ea()), pc(t, c), vc(t = c.D, c.G), mc(t, c), c.D = null;
              }
              return c.a
            }
          })), this.INTERNAL = {}, this.INTERNAL.delete = I(this.delete, this), this.INTERNAL.logFramework = I(this.tc, this), this.u = 0, Re.call(this), f = this, Object.defineProperty(f, "lc", {
            get: function () {
              return this.ea()
            }, set: function (t) {
              this.pa(t);
            }, enumerable: !1
          }), f.W = null, this.G = [];
        }

        function Qc(t) {
          ue.call(this, "languageCodeChanged"), this.g = t;
        }

        function th(t) {
          ue.call(this, "frameworkChanged"), this.c = t;
        }

        function eh(t) {
          return t.Rb || St(new Bi("auth-domain-config-required"))
        }

        function nh(o, a) {
          var s = {};
          return s.apiKey = oh(o).options.apiKey, s.authDomain = oh(o).options.authDomain, s.appName = oh(o).name, o.V.then(function () {
            return t = s, e = a, n = o.A, i = o.ya(), r = new dc(t, e), n && (r.ba = n), i && vc(r, i), r.reload().then(function () {
              return r
            });
            var t, e, n, i, r;
          }).then(function (t) {
            return ah(o) && t.uid == ah(o).uid ? Pc(ah(o), t) : (ih(o, t), Tc(t)), o.Z(t)
          }).then(function () {
            uh(o);
          })
        }

        function ih(t, e) {
          var n, i;
          ah(t) && (n = ah(t), i = t.Ha, K(n.N, function (t) {
            return t == i
          }), ke(ah(t), "tokenChanged", t.ra), ke(ah(t), "userDeleted", t.sa), ke(ah(t), "userInvalidated", t.ta), yc(ah(t))), e && (e.N.push(t.Ha), we(e, "tokenChanged", t.ra), we(e, "userDeleted", t.sa), we(e, "userInvalidated", t.ta), 0 < t.u && bc(e)), Ci(t, "currentUser", e), e && (e.pa(t.ea()), pc(e, t), vc(e, t.G), mc(e, t));
        }

        function rh(e, t) {
          var n = null, i = null;
          return ch(e, t.then(function (t) {
            return n = ro(t), i = br(t), nh(e, t)
          }).then(function () {
            return Di({user: ah(e), credential: n, additionalUserInfo: i, operationType: "signIn"})
          }))
        }

        function oh(t) {
          return t.app
        }

        function ah(t) {
          return t.currentUser
        }

        function sh(t) {
          return ah(t) && ah(t)._lat || null
        }

        function uh(t) {
          if (t.X) {
            for (var e = 0; e < t.o.length; e++) t.o[e] && t.o[e](sh(t));
            if (t.O !== t.getUid() && t.I.length) for (t.O = t.getUid(), e = 0; e < t.I.length; e++) t.I[e] && t.I[e](sh(t));
          }
        }

        function ch(t, e) {
          return t.N.push(e), e.ia(function () {
            V(t.N, e);
          }), e
        }

        function hh() {
        }

        function lh() {
          this.a = {}, this.b = 1e12;
        }

        Bc.prototype.mb = function (e) {
          var n = null, i = this;
          return function (t) {
            var e = new Bi("invalid-persistence-type"), n = new Bi("unsupported-persistence-type");
            t:{
              for (i in uu) if (uu[i] == t) {
                var i = !0;
                break t
              }
              i = !1;
            }
            if (!i || "string" != typeof t) throw e;
            switch (ii()) {
              case"ReactNative":
                if ("session" === t) throw n;
                break;
              case"Node":
                if ("none" !== t) throw n;
                break;
              default:
                if (!fi() && "none" !== t) throw n
            }
          }(e), $c(this, function () {
            return e != i.c.B ? i.b.get(i.c, i.a).then(function (t) {
              return n = t, Gc(i, e)
            }).then(function () {
              if (i.c = Xc(e), n) return i.b.set(i.c, n, i.a)
            }) : Et()
          })
        }, E(Zc, Re), E(Qc, ue), E(th, ue), (t = Zc.prototype).mb = function (t) {
          return ch(this, t = this.h.mb(t))
        }, t.pa = function (t) {
          this.W === t || this.l || (this.W = t, Ea(this.c, this.W), this.dispatchEvent(new Qc(this.ea())));
        }, t.ea = function () {
          return this.W
        }, t.Qc = function () {
          var t = l.navigator;
          this.pa(t && (t.languages && t.languages[0] || t.language || t.userLanguage) || null);
        }, t.tc = function (t) {
          this.G.push(t), Sa(this.c, Wh.SDK_VERSION ? ci(Wh.SDK_VERSION, this.G) : null), this.dispatchEvent(new th(this.G));
        }, t.ya = function () {
          return q(this.G)
        }, t.toJSON = function () {
          return {
            apiKey: oh(this).options.apiKey,
            authDomain: oh(this).options.authDomain,
            appName: oh(this).name,
            currentUser: ah(this) && ah(this).w()
          }
        }, t.xb = function (t, e) {
          switch (t) {
            case"unknown":
            case"signInViaRedirect":
              return !0;
            case"signInViaPopup":
              return this.g == e && !!this.f;
            default:
              return !1
          }
        }, t.ha = function (t, e, n, i) {
          "signInViaPopup" == t && this.g == i && (n && this.v ? this.v(n) : e && !n && this.f && this.f(e), this.b && (this.b.cancel(), this.b = null), delete this.f, delete this.v);
        }, t.xa = function (t, e) {
          return "signInViaRedirect" == t || "signInViaPopup" == t && this.g == e && this.f ? I(this.Zb, this) : null
        }, t.Zb = function (t, e, n) {
          var i = this;
          t = {requestUri: t, postBody: n, sessionId: e}, this.b && (this.b.cancel(), this.b = null);
          var r = null, o = null, a = ja(i.c, t).then(function (t) {
            return r = ro(t), o = br(t), t
          });
          return ch(this, t = i.V.then(function () {
            return a
          }).then(function (t) {
            return nh(i, t)
          }).then(function () {
            return Di({user: ah(i), credential: r, additionalUserInfo: o, operationType: "signIn"})
          }))
        }, t.Ic = function (e) {
          if (!di()) return St(new Bi("operation-not-supported-in-this-environment"));
          var n = this, t = gr(e.providerId), i = wi(), r = null;
          (!mi() || ei()) && oh(this).options.authDomain && e.isOAuthProvider && (r = _s(oh(this).options.authDomain, oh(this).options.apiKey, oh(this).name, "signInViaPopup", e, null, i, Wh.SDK_VERSION || null));
          var o = Yn(r, t && t.Ba, t && t.Aa);
          return ch(this, t = eh(this).then(function (t) {
            return Gu(t, o, "signInViaPopup", e, i, !!r)
          }).then(function () {
            return new gt(function (t, e) {
              n.ha("signInViaPopup", null, new Bi("cancelled-popup-request"), n.g), n.f = t, n.v = e, n.g = i, n.b = n.a.Ea(n, "signInViaPopup", o, i);
            })
          }).then(function (t) {
            return o && zn(o), t ? Di(t) : null
          }).s(function (t) {
            throw (o && zn(o), t)
          }));
        }, t.Jc = function (t) {
          if (!di()) return St(new Bi("operation-not-supported-in-this-environment"));
          var e = this;
          return ch(this, eh(this).then(function () {
            return $c(t = e.h, function () {
              return t.b.set(Wc, t.c.B, t.a)
            });
            var t;
          }).then(function () {
            return e.a.Ca("signInViaRedirect", t)
          }))
        }, t.fa = function () {
          if (!di()) return St(new Bi("operation-not-supported-in-this-environment"));
          var t = this;
          return ch(this, eh(this).then(function () {
            return t.a.fa()
          }).then(function (t) {
            return t ? Di(t) : null
          }))
        }, t.Oc = function (t) {
          if (!t) return St(new Bi("null-user"));
          var e = this, n = {};
          n.apiKey = oh(this).options.apiKey, n.authDomain = oh(this).options.authDomain, n.appName = oh(this).name;
          var i = function (t, e, n, i) {
            e = e || {apiKey: t.l, authDomain: t.u, appName: t.o};
            var r = t.h, o = {};
            return o[ya] = r.b, o.refreshToken = r.a, o.expiresIn = (r.c - k()) / 1e3, e = new dc(e, o), n && (e.ba = n), i && vc(e, i), Pc(e, t), e
          }(t, n, e.A, e.ya());
          return ch(this, this.i.then(function () {
            if (oh(e).options.apiKey != t.l) return i.reload()
          }).then(function () {
            return ah(e) && t.uid == ah(e).uid ? (Pc(ah(e), t), e.Z(t)) : (ih(e, i), Tc(i), e.Z(i))
          }).then(function () {
            uh(e);
          }))
        }, t.pb = function () {
          var t = this;
          return ch(this, this.i.then(function () {
            return ah(t) ? (ih(t, null), zc(t.h).then(function () {
              uh(t);
            })) : Et()
          }))
        }, t.Kc = function () {
          var i = this;
          return Yc(this.h, oh(this).options.authDomain).then(function (t) {
            if (!i.l) {
              var e;
              if (e = ah(i) && t) {
                e = ah(i).uid;
                var n = t.uid;
                e = null != e && "" !== e && null != n && "" !== n && e == n;
              }
              if (e) return Pc(ah(i), t), ah(i).F();
              (ah(i) || t) && (ih(i, t), t && (Tc(t), t.ba = i.A), i.a && i.a.subscribe(i), uh(i));
            }
          })
        }, t.Z = function (t) {
          return Jc(this.h, t)
        }, t.$b = function () {
          uh(this), this.Z(ah(this));
        }, t.jc = function () {
          this.pb();
        }, t.kc = function () {
          this.pb();
        }, t.mc = function (t) {
          var e = this;
          this.addAuthTokenListener(function () {
            t.next(ah(e));
          });
        }, t.nc = function (t) {
          var e, n, i = this;
          n = function () {
            t.next(ah(i));
          }, (e = this).I.push(n), ch(e, e.i.then(function () {
            !e.l && U(e.I, n) && e.O !== e.getUid() && (e.O = e.getUid(), n(sh(e)));
          }));
        }, t.vc = function (t, e, n) {
          var i = this;
          return this.X && Promise.resolve().then(function () {
            g(t) ? t(ah(i)) : g(t.next) && t.next(ah(i));
          }), this.Sb(t, e, n)
        }, t.uc = function (t, e, n) {
          var i = this;
          return this.X && Promise.resolve().then(function () {
            i.O = i.getUid(), g(t) ? t(ah(i)) : g(t.next) && t.next(ah(i));
          }), this.Tb(t, e, n)
        }, t.ac = function (t) {
          var e = this;
          return ch(this, this.i.then(function () {
            return ah(e) ? ah(e).F(t).then(function (t) {
              return {accessToken: t}
            }) : null
          }))
        }, t.Ec = function (t) {
          var n = this;
          return this.i.then(function () {
            return rh(n, ps(n.c, cs, {token: t}))
          }).then(function (t) {
            var e = t.user;
            return _c(e, "isAnonymous", !1), n.Z(e), t
          })
        }, t.Fc = function (t, e) {
          var n = this;
          return this.i.then(function () {
            return rh(n, ps(n.c, hs, {email: t, password: e}))
          })
        }, t.Vb = function (t, e) {
          var n = this;
          return this.i.then(function () {
            return rh(n, ps(n.c, Ha, {email: t, password: e}))
          })
        }, t.Nb = function (t) {
          var e = this;
          return this.i.then(function () {
            return rh(e, t.la(e.c))
          })
        }, t.nb = function (t) {
          return _i("firebase.auth.Auth.prototype.signInAndRetrieveDataWithCredential is deprecated. Please use firebase.auth.Auth.prototype.signInWithCredential instead."), this.Nb(t)
        }, t.ob = function () {
          var n = this;
          return this.i.then(function () {
            var t = ah(n);
            return t && t.isAnonymous ? Di({
              user: t,
              credential: null,
              additionalUserInfo: Di({providerId: null, isNewUser: !1}),
              operationType: "signIn"
            }) : rh(n, n.c.ob()).then(function (t) {
              var e = t.user;
              return _c(e, "isAnonymous", !0), n.Z(e), t
            })
          })
        }, t.getUid = function () {
          return ah(this) && ah(this).uid || null
        }, t.Ub = function (t) {
          this.addAuthTokenListener(t), this.u++, 0 < this.u && ah(this) && bc(ah(this));
        }, t.Cc = function (e) {
          var n = this;
          x(this.o, function (t) {
            t == e && n.u--;
          }), this.u < 0 && (this.u = 0), 0 == this.u && ah(this) && yc(ah(this)), this.removeAuthTokenListener(e);
        }, t.addAuthTokenListener = function (t) {
          var e = this;
          this.o.push(t), ch(this, this.i.then(function () {
            e.l || U(e.o, t) && t(sh(e));
          }));
        }, t.removeAuthTokenListener = function (e) {
          K(this.o, function (t) {
            return t == e
          });
        }, t.delete = function () {
          this.l = !0;
          for (var t = 0; t < this.N.length; t++) this.N[t].cancel("app-deleted");
          return this.N = [], this.h && (t = this.h).b.removeListener(Xc("local"), t.a, this.ka), this.a && (this.a.unsubscribe(this), this.a.Ya()), Promise.resolve()
        }, t.Yb = function (t) {
          return ch(this, ps(this.c, Ba, {
            identifier: t,
            continueUri: pi() ? Wn() : "http://localhost"
          }).then(function (t) {
            return t.signinMethods || []
          }))
        }, t.oc = function (t) {
          return !!Zr(t)
        }, t.lb = function (e, n) {
          var i = this;
          return ch(this, Et().then(function () {
            var t = new Ji(n);
            if (!t.c) throw new Bi("argument-error", $i + " must be true when sending sign in link to email");
            return rr(t)
          }).then(function (t) {
            return i.c.lb(e, t)
          }).then(function () {
          }))
        }, t.Rc = function (t) {
          return this.Ka(t).then(function (t) {
            return t.data.email
          })
        }, t.Za = function (t, e) {
          return ch(this, this.c.Za(t, e).then(function () {
          }))
        }, t.Ka = function (t) {
          return ch(this, this.c.Ka(t).then(function (t) {
            return new xi(t)
          }))
        }, t.Wa = function (t) {
          return ch(this, this.c.Wa(t).then(function () {
          }))
        }, t.kb = function (e, t) {
          var n = this;
          return ch(this, Et().then(function () {
            return void 0 === t || rt(t) ? {} : rr(new Ji(t))
          }).then(function (t) {
            return n.c.kb(e, t)
          }).then(function () {
          }))
        }, t.Hc = function (t, e) {
          return ch(this, nc(this, t, e, I(this.nb, this)))
        }, t.Gc = function (e, n) {
          var i = this;
          return ch(this, Et().then(function () {
            var t = $r(e, n || Wn());
            return i.nb(t)
          }))
        }, hh.prototype.render = function () {
        }, hh.prototype.reset = function () {
        }, hh.prototype.getResponse = function () {
        }, hh.prototype.execute = function () {
        };
        var fh = null;

        function dh(t, e) {
          return (e = ph(e)) && t.a[e] || null
        }

        function ph(t) {
          return (t = void 0 === t ? 1e12 : t) ? t.toString() : null
        }

        function vh(t, e) {
          this.g = !1, this.c = e, this.a = this.b = null, this.h = "invisible" !== this.c.size, this.f = xn(t);
          var n = this;
          this.i = function () {
            n.execute();
          }, this.h ? this.execute() : we(this.f, "click", this.i);
        }

        function mh(t) {
          if (t.g) throw Error("reCAPTCHA mock was already deleted!")
        }

        function gh() {
        }

        lh.prototype.render = function (t, e) {
          return this.a[this.b.toString()] = new vh(t, e), this.b++
        }, lh.prototype.reset = function (t) {
          var e = dh(this, t);
          t = ph(t), e && t && (e.delete(), delete this.a[t]);
        }, lh.prototype.getResponse = function (t) {
          return (t = dh(this, t)) ? t.getResponse() : null
        }, lh.prototype.execute = function (t) {
          (t = dh(this, t)) && t.execute();
        }, vh.prototype.getResponse = function () {
          return mh(this), this.b
        }, vh.prototype.execute = function () {
          mh(this);
          var n = this;
          this.a || (this.a = setTimeout(function () {
            n.b = function () {
              for (var t = 50, e = []; 0 < t;) e.push("1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".charAt(Math.floor(62 * Math.random()))), t--;
              return e.join("")
            }();
            var t = n.c.callback, e = n.c["expired-callback"];
            if (t) try {
              t(n.b);
            } catch (t) {
            }
            n.a = setTimeout(function () {
              if (n.a = null, n.b = null, e) try {
                e();
              } catch (t) {
              }
              n.h && n.execute();
            }, 6e4);
          }, 500));
        }, vh.prototype.delete = function () {
          mh(this), this.g = !0, clearTimeout(this.a), this.a = null, ke(this.f, "click", this.i);
        }, gh.prototype.g = function () {
          return fh || (fh = new lh), Et(fh)
        }, gh.prototype.c = function () {
        };
        var bh = null;

        function yh() {
          this.b = l.grecaptcha ? 1 / 0 : 0, this.f = null, this.a = "__rcb" + Math.floor(1e6 * Math.random()).toString();
        }

        var wh = new mn(yn, "https://www.google.com/recaptcha/api.js?onload=%{onload}&render=explicit&hl=%{hl}"),
          Ih = new ki(3e4, 6e4);
        yh.prototype.g = function (r) {
          var o = this;
          return new gt(function (t, e) {
            var i = setTimeout(function () {
              e(new Bi("network-request-failed"));
            }, Ih.get());
            !l.grecaptcha || r !== o.f && !o.b ? (l[o.a] = function () {
              if (l.grecaptcha) {
                o.f = r;
                var n = l.grecaptcha.render;
                l.grecaptcha.render = function (t, e) {
                  return t = n(t, e), o.b++, t
                }, clearTimeout(i), t(l.grecaptcha);
              } else clearTimeout(i), e(new Bi("internal-error"));
              delete l[o.a];
            }, Et(ha(Tn(wh, {onload: o.a, hl: r || ""}))).s(function () {
              clearTimeout(i), e(new Bi("internal-error", "Unable to load external reCAPTCHA dependencies!"));
            })) : (clearTimeout(i), t(l.grecaptcha));
          })
        }, yh.prototype.c = function () {
          this.b--;
        };
        var Th = null;

        function kh(t, e, n, i, r, o, a) {
          if (Ci(this, "type", "recaptcha"), this.c = this.f = null, this.D = !1, this.l = e, this.g = null, a = a ? (bh || (bh = new gh), bh) : (Th || (Th = new yh), Th), this.o = a, this.a = n || {
            theme: "light",
            type: "image"
          }, this.h = [], this.a[Ah]) throw new Bi("argument-error", "sitekey should not be provided for reCAPTCHA as one is automatically provisioned for the current project.");
          if (this.i = "invisible" === this.a[Nh], !l.document) throw new Bi("operation-not-supported-in-this-environment", "RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment with DOM support.");
          if (!xn(e) || !this.i && xn(e).hasChildNodes()) throw new Bi("argument-error", "reCAPTCHA container is either not found or already contains inner elements!");
          this.u = new ga(t, o || null, r || null), this.v = i || function () {
            return null
          };
          var s = this;
          this.m = [];
          var u = this.a[Eh];
          this.a[Eh] = function (t) {
            if (Oh(s, t), "function" == typeof u) u(t); else if ("string" == typeof u) {
              var e = li(u, l);
              "function" == typeof e && e(t);
            }
          };
          var c = this.a[Sh];
          this.a[Sh] = function () {
            if (Oh(s, null), "function" == typeof c) c(); else if ("string" == typeof c) {
              var t = li(c, l);
              "function" == typeof t && t();
            }
          };
        }

        var Eh = "callback", Sh = "expired-callback", Ah = "sitekey", Nh = "size";

        function Oh(t, e) {
          for (var n = 0; n < t.m.length; n++) try {
            t.m[n](e);
          } catch (t) {
          }
        }

        function _h(t, e) {
          return t.h.push(e), e.ia(function () {
            V(t.h, e);
          }), e
        }

        function Ph(t) {
          if (t.D) throw new Bi("internal-error", "RecaptchaVerifier instance has been destroyed.")
        }

        function Ch(t, e, n) {
          var i = !1;
          try {
            this.b = n || Wh.app();
          } catch (t) {
            throw new Bi("argument-error", "No firebase.app.App instance is currently initialized.")
          }
          if (!this.b.options || !this.b.options.apiKey) throw new Bi("invalid-api-key");
          n = this.b.options.apiKey;
          var r = this, o = null;
          try {
            o = this.b.auth().ya();
          } catch (t) {
          }
          try {
            i = this.b.auth().settings.appVerificationDisabledForTesting;
          } catch (t) {
          }
          o = Wh.SDK_VERSION ? ci(Wh.SDK_VERSION, o) : null, kh.call(this, n, t, e, function () {
            try {
              var e = r.b.auth().ea();
            } catch (t) {
              e = null;
            }
            return e
          }, o, dr(lr), i);
        }

        function Rh(t, e, n, i) {
          t:{
            n = Array.prototype.slice.call(n);
            for (var r = 0, o = !1, a = 0; a < e.length; a++) if (e[a].optional) o = !0; else {
              if (o) throw new Bi("internal-error", "Argument validator encountered a required argument after an optional argument.");
              r++;
            }
            if (o = e.length, n.length < r || o < n.length) i = "Expected " + (r == o ? 1 == r ? "1 argument" : r + " arguments" : r + "-" + o + " arguments") + " but got " + n.length + "."; else {
              for (r = 0; r < n.length; r++) if (o = e[r].optional && void 0 === n[r], !e[r].M(n[r]) && !o) {
                if (e = e[r], r < 0 || r >= Dh.length) throw new Bi("internal-error", "Argument validator received an unsupported number of arguments.");
                n = Dh[r], i = (i ? "" : n + " argument ") + (e.name ? '"' + e.name + '" ' : "") + "must be " + e.K + ".";
                break t
              }
              i = null;
            }
          }
          if (i) throw new Bi("argument-error", t + " failed: " + i)
        }

        (t = kh.prototype).za = function () {
          var e = this;
          return this.f ? this.f : this.f = _h(this, Et().then(function () {
            if (pi() && !ni()) return Qn();
            throw new Bi("operation-not-supported-in-this-environment", "RecaptchaVerifier is only supported in a browser HTTP/HTTPS environment.")
          }).then(function () {
            return e.o.g(e.v())
          }).then(function (t) {
            return e.g = t, ps(e.u, ts, {})
          }).then(function (t) {
            e.a[Ah] = t.recaptchaSiteKey;
          }).s(function (t) {
            throw (e.f = null, t)
          }));
        }, t.render = function () {
          Ph(this);
          var n = this;
          return _h(this, this.za().then(function () {
            if (null === n.c) {
              var t = n.l;
              if (!n.i) {
                var e = xn(t);
                t = Un("DIV"), e.appendChild(t);
              }
              n.c = n.g.render(t, n.a);
            }
            return n.c
          }))
        }, t.verify = function () {
          Ph(this);
          var r = this;
          return _h(this, this.render().then(function (e) {
            return new gt(function (n) {
              var t = r.g.getResponse(e);
              if (t) n(t); else {
                var i = function (t) {
                  var e;
                  t && (e = i, K(r.m, function (t) {
                    return t == e
                  }), n(t));
                };
                r.m.push(i), r.i && r.g.execute(r.c);
              }
            })
          }))
        }, t.reset = function () {
          Ph(this), null !== this.c && this.g.reset(this.c);
        }, t.clear = function () {
          Ph(this), this.D = !0, this.o.c();
          for (var t = 0; t < this.h.length; t++) this.h[t].cancel("RecaptchaVerifier instance has been destroyed.");
          if (!this.i) {
            t = xn(this.l);
            for (var e; e = t.firstChild;) t.removeChild(e);
          }
        }, E(Ch, kh);
        var Dh = "First Second Third Fourth Fifth Sixth Seventh Eighth Ninth".split(" ");

        function Lh(t, e) {
          return {name: t || "", K: "a valid string", optional: !!e, M: h}
        }

        function xh(t, e) {
          return {name: t || "", K: "a boolean", optional: !!e, M: n}
        }

        function Mh(t, e) {
          return {name: t || "", K: "a valid object", optional: !!e, M: b}
        }

        function jh(t, e) {
          return {name: t || "", K: "a function", optional: !!e, M: g}
        }

        function Uh(t, e) {
          return {name: t || "", K: "null", optional: !!e, M: i}
        }

        function Vh(n) {
          return {
            name: n ? n + "Credential" : "credential",
            K: n ? "a valid " + n + " credential" : "a valid credential",
            optional: !1,
            M: function (t) {
              if (!t) return !1;
              var e = !n || t.providerId === n;
              return !(!t.la || !e)
            }
          }
        }

        function Kh() {
          return {
            name: "applicationVerifier",
            K: "an implementation of firebase.auth.ApplicationVerifier",
            optional: !1,
            M: function (t) {
              return !!(t && h(t.type) && g(t.verify))
            }
          }
        }

        function Fh(e, n, t, i) {
          return {
            name: t || "", K: e.K + " or " + n.K, optional: !!i, M: function (t) {
              return e.M(t) || n.M(t)
            }
          }
        }

        function qh(t, e) {
          for (var n in e) {
            var i = e[n].name;
            t[i] = Gh(i, t[n], e[n].j);
          }
        }

        function Hh(t, e) {
          for (var n in e) {
            var i = e[n].name;
            i !== n && Object.defineProperty(t, i, {
              get: T(function (t) {
                return this[t]
              }, n), set: T(function (t, e, n, i) {
                Rh(t, [n], [i], !0), this[e] = i;
              }, i, n, e[n].vb), enumerable: !0
            });
          }
        }

        function Bh(t, e, n, i) {
          t[e] = Gh(e, n, i);
        }

        function Gh(t, e, n) {
          function i() {
            var t = Array.prototype.slice.call(arguments);
            return Rh(a, n, t), e.apply(this, t)
          }

          if (!n) return e;
          var r, o, a = (o = (o = t).split("."))[o.length - 1];
          for (r in e) i[r] = e[r];
          for (r in e.prototype) i.prototype[r] = e.prototype[r];
          return i
        }

        qh(Zc.prototype, {
          Wa: {name: "applyActionCode", j: [Lh("code")]},
          Ka: {name: "checkActionCode", j: [Lh("code")]},
          Za: {name: "confirmPasswordReset", j: [Lh("code"), Lh("newPassword")]},
          Vb: {name: "createUserWithEmailAndPassword", j: [Lh("email"), Lh("password")]},
          Yb: {name: "fetchSignInMethodsForEmail", j: [Lh("email")]},
          fa: {name: "getRedirectResult", j: []},
          oc: {name: "isSignInWithEmailLink", j: [Lh("emailLink")]},
          uc: {
            name: "onAuthStateChanged",
            j: [Fh(Mh(), jh(), "nextOrObserver"), jh("opt_error", !0), jh("opt_completed", !0)]
          },
          vc: {
            name: "onIdTokenChanged",
            j: [Fh(Mh(), jh(), "nextOrObserver"), jh("opt_error", !0), jh("opt_completed", !0)]
          },
          kb: {
            name: "sendPasswordResetEmail",
            j: [Lh("email"), Fh(Mh("opt_actionCodeSettings", !0), Uh(null, !0), "opt_actionCodeSettings", !0)]
          },
          lb: {name: "sendSignInLinkToEmail", j: [Lh("email"), Mh("actionCodeSettings")]},
          mb: {name: "setPersistence", j: [Lh("persistence")]},
          nb: {name: "signInAndRetrieveDataWithCredential", j: [Vh()]},
          ob: {name: "signInAnonymously", j: []},
          Nb: {name: "signInWithCredential", j: [Vh()]},
          Ec: {name: "signInWithCustomToken", j: [Lh("token")]},
          Fc: {name: "signInWithEmailAndPassword", j: [Lh("email"), Lh("password")]},
          Gc: {name: "signInWithEmailLink", j: [Lh("email"), Lh("emailLink", !0)]},
          Hc: {name: "signInWithPhoneNumber", j: [Lh("phoneNumber"), Kh()]},
          Ic: {
            name: "signInWithPopup",
            j: [{
              name: "authProvider", K: "a valid Auth provider", optional: !1, M: function (t) {
                return !!(t && t.providerId && t.hasOwnProperty && t.hasOwnProperty("isOAuthProvider"))
              }
            }]
          },
          Jc: {
            name: "signInWithRedirect",
            j: [{
              name: "authProvider", K: "a valid Auth provider", optional: !1, M: function (t) {
                return !!(t && t.providerId && t.hasOwnProperty && t.hasOwnProperty("isOAuthProvider"))
              }
            }]
          },
          Oc: {
            name: "updateCurrentUser",
            j: [Fh({
              name: "user", K: "an instance of Firebase User", optional: !1, M: function (t) {
                return !!(t && t instanceof dc)
              }
            }, Uh(), "user")]
          },
          pb: {name: "signOut", j: []},
          toJSON: {name: "toJSON", j: [Lh(null, !0)]},
          Qc: {name: "useDeviceLanguage", j: []},
          Rc: {name: "verifyPasswordResetCode", j: [Lh("code")]}
        }), Hh(Zc.prototype, {
          lc: {
            name: "languageCode",
            vb: Fh(Lh(), Uh(), "languageCode")
          }
        }), (Zc.Persistence = uu).LOCAL = "local", Zc.Persistence.SESSION = "session", Zc.Persistence.NONE = "none", qh(dc.prototype, {
          delete: {name: "delete", j: []},
          bc: {name: "getIdTokenResult", j: [xh("opt_forceRefresh", !0)]},
          F: {name: "getIdToken", j: [xh("opt_forceRefresh", !0)]},
          pc: {name: "linkAndRetrieveDataWithCredential", j: [Vh()]},
          eb: {name: "linkWithCredential", j: [Vh()]},
          qc: {name: "linkWithPhoneNumber", j: [Lh("phoneNumber"), Kh()]},
          rc: {
            name: "linkWithPopup",
            j: [{
              name: "authProvider", K: "a valid Auth provider", optional: !1, M: function (t) {
                return !!(t && t.providerId && t.hasOwnProperty && t.hasOwnProperty("isOAuthProvider"))
              }
            }]
          },
          sc: {
            name: "linkWithRedirect",
            j: [{
              name: "authProvider", K: "a valid Auth provider", optional: !1, M: function (t) {
                return !!(t && t.providerId && t.hasOwnProperty && t.hasOwnProperty("isOAuthProvider"))
              }
            }]
          },
          yc: {name: "reauthenticateAndRetrieveDataWithCredential", j: [Vh()]},
          gb: {name: "reauthenticateWithCredential", j: [Vh()]},
          zc: {name: "reauthenticateWithPhoneNumber", j: [Lh("phoneNumber"), Kh()]},
          Ac: {
            name: "reauthenticateWithPopup",
            j: [{
              name: "authProvider", K: "a valid Auth provider", optional: !1, M: function (t) {
                return !!(t && t.providerId && t.hasOwnProperty && t.hasOwnProperty("isOAuthProvider"))
              }
            }]
          },
          Bc: {
            name: "reauthenticateWithRedirect",
            j: [{
              name: "authProvider", K: "a valid Auth provider", optional: !1, M: function (t) {
                return !!(t && t.providerId && t.hasOwnProperty && t.hasOwnProperty("isOAuthProvider"))
              }
            }]
          },
          reload: {name: "reload", j: []},
          jb: {
            name: "sendEmailVerification",
            j: [Fh(Mh("opt_actionCodeSettings", !0), Uh(null, !0), "opt_actionCodeSettings", !0)]
          },
          toJSON: {name: "toJSON", j: [Lh(null, !0)]},
          Nc: {name: "unlink", j: [Lh("provider")]},
          rb: {name: "updateEmail", j: [Lh("email")]},
          sb: {name: "updatePassword", j: [Lh("password")]},
          Pc: {name: "updatePhoneNumber", j: [Vh("phone")]},
          tb: {name: "updateProfile", j: [Mh("profile")]}
        }), qh(lh.prototype, {
          execute: {name: "execute"},
          render: {name: "render"},
          reset: {name: "reset"},
          getResponse: {name: "getResponse"}
        }), qh(hh.prototype, {
          execute: {name: "execute"},
          render: {name: "render"},
          reset: {name: "reset"},
          getResponse: {name: "getResponse"}
        }), qh(gt.prototype, {
          ia: {name: "finally"},
          s: {name: "catch"},
          then: {name: "then"}
        }), Hh(tc.prototype, {
          appVerificationDisabled: {
            name: "appVerificationDisabledForTesting",
            vb: xh("appVerificationDisabledForTesting")
          }
        }), qh(ec.prototype, {
          confirm: {
            name: "confirm",
            j: [Lh("verificationCode")]
          }
        }), Bh(_r, "fromJSON", function (t) {
          t = h(t) ? JSON.parse(t) : t;
          for (var e, n = [Mr, zr, to, Dr], i = 0; i < n.length; i++) if (e = n[i](t)) return e;
          return null
        }, [Fh(Lh(), Mh(), "json")]), Bh(Yr, "credential", function (t, e) {
          return new Jr(t, e)
        }, [Lh("email"), Lh("password")]), qh(Jr.prototype, {
          w: {
            name: "toJSON",
            j: [Lh(null, !0)]
          }
        }), qh(Kr.prototype, {
          ua: {name: "addScope", j: [Lh("scope")]},
          Da: {name: "setCustomParameters", j: [Mh("customOAuthParameters")]}
        }), Bh(Kr, "credential", Fr, [Fh(Lh(), Mh(), "token")]), Bh(Yr, "credentialWithLink", $r, [Lh("email"), Lh("emailLink")]), qh(qr.prototype, {
          ua: {
            name: "addScope",
            j: [Lh("scope")]
          }, Da: {name: "setCustomParameters", j: [Mh("customOAuthParameters")]}
        }), Bh(qr, "credential", Hr, [Fh(Lh(), Mh(), "token")]), qh(Br.prototype, {
          ua: {
            name: "addScope",
            j: [Lh("scope")]
          }, Da: {name: "setCustomParameters", j: [Mh("customOAuthParameters")]}
        }), Bh(Br, "credential", Gr, [Fh(Lh(), Fh(Mh(), Uh()), "idToken"), Fh(Lh(), Uh(), "accessToken", !0)]), qh(Wr.prototype, {
          Da: {
            name: "setCustomParameters",
            j: [Mh("customOAuthParameters")]
          }
        }), Bh(Wr, "credential", Xr, [Fh(Lh(), Mh(), "token"), Lh("secret", !0)]), qh(Vr.prototype, {
          ua: {
            name: "addScope",
            j: [Lh("scope")]
          },
          credential: {
            name: "credential",
            j: [Fh(Lh(), Fh(Mh(), Uh()), "optionsOrIdToken"), Fh(Lh(), Uh(), "accessToken", !0)]
          },
          Da: {name: "setCustomParameters", j: [Mh("customOAuthParameters")]}
        }), qh(Lr.prototype, {w: {name: "toJSON", j: [Lh(null, !0)]}}), qh(Cr.prototype, {
          w: {
            name: "toJSON",
            j: [Lh(null, !0)]
          }
        }), Bh(no, "credential", io, [Lh("verificationId"), Lh("verificationCode")]), qh(no.prototype, {
          Ua: {
            name: "verifyPhoneNumber",
            j: [Lh("phoneNumber"), Kh()]
          }
        }), qh(Qr.prototype, {w: {name: "toJSON", j: [Lh(null, !0)]}}), qh(Bi.prototype, {
          toJSON: {
            name: "toJSON",
            j: [Lh(null, !0)]
          }
        }), qh(fo.prototype, {toJSON: {name: "toJSON", j: [Lh(null, !0)]}}), qh(lo.prototype, {
          toJSON: {
            name: "toJSON",
            j: [Lh(null, !0)]
          }
        }), qh(Ch.prototype, {
          clear: {name: "clear", j: []},
          render: {name: "render", j: []},
          verify: {name: "verify", j: []}
        }), function () {
          if (void 0 === Wh || !Wh.INTERNAL || !Wh.INTERNAL.registerService) throw Error("Cannot find the firebase namespace; be sure to include firebase-app.js before this library.");
          var t = {Auth: Zc, AuthCredential: _r, Error: Bi};
          Bh(t, "EmailAuthProvider", Yr, []), Bh(t, "FacebookAuthProvider", Kr, []), Bh(t, "GithubAuthProvider", qr, []), Bh(t, "GoogleAuthProvider", Br, []), Bh(t, "TwitterAuthProvider", Wr, []), Bh(t, "OAuthProvider", Vr, [Lh("providerId")]), Bh(t, "SAMLAuthProvider", Ur, [Lh("providerId")]), Bh(t, "PhoneAuthProvider", no, [{
            name: "auth",
            K: "an instance of Firebase Auth",
            optional: !0,
            M: function (t) {
              return !!(t && t instanceof Zc)
            }
          }]), Bh(t, "RecaptchaVerifier", Ch, [Fh(Lh(), {
            name: "", K: "an HTML element", optional: !1, M: function (t) {
              return !!(t && t instanceof Element)
            }
          }, "recaptchaContainer"), Mh("recaptchaParameters", !0), {
            name: "app",
            K: "an instance of Firebase App",
            optional: !0,
            M: function (t) {
              return !!(t && t instanceof Wh.app.App)
            }
          }]), Wh.INTERNAL.registerService("auth", function (t, e) {
            return e({
              INTERNAL: {
                getUid: I((t = new Zc(t)).getUid, t),
                getToken: I(t.ac, t),
                addAuthTokenListener: I(t.Ub, t),
                removeAuthTokenListener: I(t.Cc, t)
              }
            }), t
          }, t, function (t, e) {
            if ("create" === t) try {
              e.auth();
            } catch (t) {
            }
          }), Wh.INTERNAL.extendNamespace({User: dc});
        }();
      }.apply("undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {});
    }).apply(this, arguments);
  } catch (t) {
    throw (console.error(t), new Error("Cannot instantiate firebase-auth - be sure to load firebase-app.js first."))
  }
});

var Fire,
  hasProp = {}.hasOwnProperty;

Fire = class Fire {
  constructor(store) {
    this.store = store;
    this.dbName = this.store.dbName;
    this.tables = this.store.tables;
    this.keyProp = 'id';
    this.fb = this.init(this.config("augm-d4b3c"));
    //@auth() # Anonomous logins have to be enabled
    this.fd = this.fb.database();
  }

  //@openTables( @tables )
  config(projectId) {
    return {
      projectId: projectId,
      apiKey: "AIzaSyD4Py9oML_Y77ze9bGX0I8s9hqndKkBVjY",
      authDomain: `${projectId}.firebaseapp.com`,
      databaseURL: `https://${projectId}.firebaseio.com`,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: "341294405322",
      appID: "1:341294405322:web:06369c7823ccc079"
    };
  }

  /*
  firebase.initializeApp({
    "apiKey": "AIzaSyD4Py9oML_Y77ze9bGX0I8s9hqndKkBVjY",
    "databaseURL": "https://augm-d4b3c.firebaseio.com",
    "storageBucket": "augm-d4b3c.appspot.com",
    "authDomain": "augm-d4b3c.firebaseapp.com",
    "messagingSenderId": "341294405322",
    "projectId": "augm-d4b3c",
    "appId": "1:341294405322:web:06369c7823ccc079"
  });
  */
  init(config) {
    //console.log( 'firebase', firebase )
    firebase$1.initializeApp(config);
    return firebase$1;
  }

  batch(name, obj, objs, callback = null) {
    this.fd.ref(table).once('value').then((snapshot) => {
      if ((snapshot != null) && (snapshot.val() != null)) {
        obj.result = snapshot.val();
        if (this.store.batchComplete(objs)) {
          if (callback != null) {
            return callback(objs);
          } else {
            return this.store.results(name, 'batch', objs);
          }
        }
      }
    }).catch((error) => {
      return this.store.onerror(obj.table, 'batch', error);
    });
  }

  // Have too clarify id with snapshot.key
  change(table, id = 'none', callback = null, Event = 'put') {
    var path;
    path = id === 'none' ? table : table + '/' + id;
    this.fd.ref(path).on(Fire.EventType[Event], onChange).then((snapshot) => {
      var key, val;
      if (snapshot != null) {
        key = snapshot.key;
        val = snapshot.val();
        if (callback != null) {
          return callback(val);
        } else {
          return this.store.results(table, 'change', val, key);
        }
      }
    }).catch((error) => {
      return this.store.onerror(table, 'change', error);
    });
  }

  get(table, id, callback) {
    this.fd.ref(table + '/' + id).once('value').then((snapshot) => {
      if ((snapshot != null) && (snapshot.val() != null)) {
        if (callback != null) {
          return callback(snapshot.val());
        } else {
          return this.store.results(table, 'get', snapshot.val(), id);
        }
      }
    }).catch((error) => {
      return this.store.onerror(table, 'get', error, id);
    });
  }

  add(table, id, object) {
    this.fd.ref(table + '/' + id).set(object).catch((error) => {
      return this.store.onerror(table, 'add', error, id);
    });
  }

  // Same as add
  put(table, id, object) {
    this.fd.ref(table + '/' + id).set(object).catch((error) => {
      return this.store.onerror(table, 'put', error, id);
    });
  }

  del(table, id) {
    this.fd.ref(table + '/' + id).remove().catch((error) => {
      return this.store.onerror(table, 'del', error, id);
    });
  }

  select(table, where, callback = null) {
    this.fd.ref(table).once('value').then((snapshot) => {
      var objs;
      if ((snapshot != null) && (snapshot.val() != null)) {
        objs = this.store.toObjs(snapshot.val(), where, this.keyProp);
        if (callback != null) {
          return callback(objs);
        } else {
          return this.store.results(table, 'select', objs);
        }
      }
    });
  }

  insert(table, objects) {
    this.fd.ref(table).set(objects).catch((error) => {
      return this.store.onerror(table, 'insert', error);
    });
  }

  update(table, objects) {
    this.fd.ref(table).update(objects).catch((error) => {
      return this.store.onerror(table, 'update', error);
    });
  }

  remove(table, where) {
    var key, obj, objs;
    this.fd.ref(table).once('value').then((snapshot) => {}, (function() {
      if ((typeof snapshot !== "undefined" && snapshot !== null) && (snapshot.val() != null)) {
        objs = this.store.toObjs(snapshot.val(), where, this.keyProp);
        for (key in objs) {
          if (!hasProp.call(objs, key)) continue;
          obj = objs[key];
          this.del(table, key); // @fd.ref(table+'/'+key).remove()
        }
        return this.store.results(table, 'select', objs);
      }
    }).call(this));
  }

  range(table, beg, end) {
    this.fd.ref(table).orderByKey().startAt(beg).endAt(end).once('value').then((snapshot) => {
      var objs;
      if ((snapshot != null) && (snapshot.val() != null)) {
        objs = this.toObjects(snapshot.val());
        return this.store.results(table, 'range', objs);
      }
    }).catch((error) => {
      return this.store.onerror(table, 'range', error);
    });
  }

  openTables(tables) {
    var obj, table;
    for (table in tables) {
      if (!hasProp.call(tables, table)) continue;
      obj = tables[table];
      open(table);
    }
  }

  // Need to learn what opening a table means in firebase
  // Problem with Firebase sending a socket.io to url/Prac to Intellij server that becomes a 404
  open(table) {
    var ref;
    ref = this.fd.ref(table);
    if (!ref) {
      this.fd.root().set(table);
    }
  }

  // ref.remove() is Dangerous and has removed all tables in Firebase
  // @fd.ref(table).set( {} )
  //    .catch( (error) =>
  //      @store.onerror( table, 'open', error ) )
  drop(table) {
    this.fd.ref(table).remove().catch((error) => {
      return this.store.onerror(table, 'drop', error);
    });
  }

  // Sign Anonymously
  auth() {
    this.fb.auth().signInAnonymously().catch((error) => {
      return this.store.onerror('auth', 'auth', error);
    });
  }

};

Fire.EventType = {
  get: "value",
  add: "child_added",
  put: "child_changed",
  del: "child_removed"
};

var Fire$1 = Fire;

var Pipe;

Pipe = class Pipe {
  constructor(stream, dbName) {
    this.stream = stream;
    this.dbName = dbName;
  }

  toSubject(table, op) {
    if (table != null) {
      return this.dbName + ':' + table + ':' + op;
    } else {
      return this.dbName + ':' + op;
    }
  }

  subscribe(table, op, source, onSubscribe) {
    var changeOp, i, len, ref;
    if (op !== 'change') {
      this.stream.subscribe(this.toSubject(table, op), source, onSubscribe);
    } else {
      ref = Pipe.changeOps;
      for (i = 0, len = ref.length; i < len; i++) {
        changeOp = ref[i];
        this.stream.subscribe(this.toSubject(table, changeOp), source, onSubscribe);
      }
    }
  }

  publish(table, op, result, id = null) {
    var obj;
    obj = id != null ? {
      [`${id}`]: result
    } : result;
    this.stream.publish(this.toSubject(table, op), obj);
  }

  results(table, op, result, id) {
    this.publish(table, op, result, id);
  }

  add(table, id, object) { // Post an object into table with id
    this.publish(table, 'add', object, id);
  }

  put(table, id, object) { // Put an object into table with id
    this.publish(table, 'put', object, id);
  }

  del(table, id) { // Delete  an object from table with id
    this.publish(table, 'del', {}, id);
  }

  // SQL tables with multiple objects (rows)
  insert(table, objects) { // Insert objects into table with unique id
    this.publish(table, 'insert', objects);
  }

  update(table, objects) { // # Update objects into table mapped by id
    this.publish(table, 'update', objects);
  }

  remove(table, where) { // Remove objects from table with where clause
    this.publish(table, 'remove', where.toString());
  }

  // Table DDL (Data Definition Language)
  open(table) { // Create a table with an optional schema
    this.publish(table, 'open', table);
  }

  drop(table) { // Drop the entire @table - good for testing
    this.publish(table, 'drop', table);
  }

};

Pipe.changeOps = ['change', 'add', 'put', 'del', 'insert', 'update', 'remove'];

var Pipe$1 = Pipe;

var Store,
  hasProp$1 = {}.hasOwnProperty;

Store = class Store {
  constructor(dbName, tables, url) {
    this.dbName = dbName;
    this.tables = tables;
    this.url = url;
    this.rest = null;
    this.fire = null;
    this.index = null;
    this.local = null;
    this.memory = null;
    this.pipe = null;
  }

  table(tn) {
    if (this.tables[tn] == null) {
      this.open(table);
    }
    return this.tables[tn];
  }

  results(table, op, result, id = null) {
    if (this.pipe != null) {
      this.pipe.results(table, op, result, id);
    }
  }

  onerror(table, op, error, id = 'none') {
    console.error('Store.onerror', {
      dbName: this.dbName,
      table: table,
      op: op,
      error: error,
      id: id
    });
  }

  subscribe(table, op, source, onSubscribe) {
    if (this.pipe != null) {
      this.pipe.subscribe(table, op, source, onSubscribe);
    }
  }

  publish(table, op, result, id = null) {
    if (this.pipe != null) {
      this.pipe.publish(table, op, result, id);
    }
  }

  // REST Api  CRUD + Subscribe for objectect records 
  batch(name, objs, callback) { // Batch populate a set of objects from various sources
    var key, obj;
    for (key in objs) {
      if (!hasProp$1.call(objs, key)) continue;
      obj = objs[key];
      switch (obj.src) {
        case 'rest':
          if (this.rest != null) {
            this.rest.batch(name, obj, objs, callback);
          }
          break;
        case 'fire':
          if (this.fire != null) {
            this.fire.batch(name, obj, objs, callback);
          }
          break;
        case 'index':
          if (this.index != null) {
            this.index.batch(name, obj, objs, callback);
          }
          break;
        case 'local':
          if (this.local != null) {
            this.local.batch(name, obj, objs, callback);
          }
          break;
        case 'memory':
          if (this.memory != null) {
            this.memory.batch(name, obj, objs, callback);
          }
      }
    }
  }

  batchComplete(objs) {
    var key, obj;
    for (key in objs) {
      if (!hasProp$1.call(objs, key)) continue;
      obj = objs[key];
      if (!obj['result']) {
        return false;
      }
    }
    return true;
  }

  get(src, table, id, callback) { // Get an object from table with id
    switch (src) {
      case 'rest':
        if (this.rest != null) {
          this.rest.get(table, id, callback);
        }
        break;
      case 'fire':
        if (this.fire != null) {
          this.fire.get(table, id, callback);
        }
        break;
      case 'index':
        if (this.index != null) {
          this.index.get(table, id, callback);
        }
        break;
      case 'local':
        if (this.local != null) {
          this.local.get(table, id, callback);
        }
        break;
      case 'memory':
        if (this.memory != null) {
          this.memory.get(table, id, callback);
        }
    }
  }

  add(table, id, object) { // Post an object into table with id
    if (this.rest != null) {
      this.rest.add(table, id, object);
    }
    if (this.fire != null) {
      this.fire.add(table, id, object);
    }
    if (this.index != null) {
      this.index.add(table, id, object);
    }
    if (this.local != null) {
      this.local.add(table, id, object);
    }
    if (this.memory != null) {
      this.memory.add(table, id, object);
    }
    if (this.pipe != null) {
      this.pipe.add(table, id, object);
    }
  }

  put(table, id, object) { // Put an object into table with id
    if (this.rest != null) {
      this.rest.put(table, id, object);
    }
    if (this.fire != null) {
      this.fire.put(table, id, object);
    }
    if (this.index != null) {
      this.index.put(table, id, object);
    }
    if (this.local != null) {
      this.local.put(table, id, object);
    }
    if (this.memory != null) {
      this.memory.put(table, id, object);
    }
    if (this.pipe != null) {
      this.pipe.put(table, id, object);
    }
  }

  del(table, id) { // Delete  an object from table with id
    if (this.rest != null) {
      this.rest.del(table, id);
    }
    if (this.fire != null) {
      this.fire.del(table, id);
    }
    if (this.index != null) {
      this.index.del(table, id);
    }
    if (this.local != null) {
      this.local.del(table, id);
    }
    if (this.memory != null) {
      this.memory.del(table, id);
    }
    if (this.pipe != null) {
      this.pipe.del(table, id);
    }
  }

  // SQL tables with multiple objects (rows)    
  select(src, table, where = Store.where, callback = null) { // Get an object from table with id
    switch (src) {
      case 'rest':
        if (this.rest != null) {
          this.rest.select(table, where, callback);
        }
        break;
      case 'fire':
        if (this.fire != null) {
          this.fire.select(table, where, callback);
        }
        break;
      case 'index':
        if (this.index != null) {
          this.index.select(table, where, callback);
        }
        break;
      case 'local':
        if (this.local != null) {
          this.local.select(table, where, callback);
        }
        break;
      case 'memory':
        if (this.memory != null) {
          this.memory.select(table, where, callback);
        }
    }
  }

  insert(table, objects) { // Insert objects into table with unique id
    if (this.rest != null) {
      this.rest.insert(table, objects);
    }
    if (this.fire != null) {
      this.fire.insert(table, objects);
    }
    if (this.index != null) {
      this.index.insert(table, objects);
    }
    if (this.local != null) {
      this.local.insert(table, objects);
    }
    if (this.memory != null) {
      this.memory.insert(table, objects);
    }
    if (this.pipe != null) {
      this.pipe.insert(table, objects);
    }
  }

  update(table, objects) { // # Update objects into table mapped by id
    if (this.rest != null) {
      this.rest.update(table, objects);
    }
    if (this.fire != null) {
      this.fire.update(table, objects);
    }
    if (this.index != null) {
      this.index.update(table, objects);
    }
    if (this.local != null) {
      this.local.update(table, objects);
    }
    if (this.memory != null) {
      this.memory.update(table, objects);
    }
    if (this.pipe != null) {
      this.pipe.update(table, objects);
    }
  }

  remove(table, where = Store.where) { // Delete objects from table with where clause
    if (this.rest != null) {
      this.rest.remove(table, where);
    }
    if (this.fire != null) {
      this.fire.remove(table, where);
    }
    if (this.index != null) {
      this.index.remove(table, where);
    }
    if (this.local != null) {
      this.local.remove(table, where);
    }
    if (this.memory != null) {
      this.memory.remove(table, where);
    }
    if (this.pipe != null) {
      this.pipe.remove(table, where);
    }
  }

  // Table DDL (Data Definition Language)  
  show(callback = null) { // Show all table names
    var keys;
    keys = Object.keys(this.tables);
    if (callback != null) {
      callback(keys);
    } else if (this.pipe != null) {
      this.pipe.results(this.dbName, 'show', keys);
    }
  }

  open(table) { // Create a table with an optional schema
    if (this.tables[table] == null) {
      this.tables[table] = {};
      if (this.rest != null) {
        this.rest.open(table);
      }
      if (this.fire != null) {
        this.fire.open(table);
      }
      if (this.index != null) {
        this.index.open(table);
      }
      if (this.local != null) {
        this.local.open(table);
      }
      if (this.pipe != null) {
        this.pipe.open(table);
      }
    } else {
      this.onerror(table, 'open', {
        error: 'Store table already exists'
      });
    }
  }

  drop(table) { // Drop the entire @table - good for testing
    if (this.rest != null) {
      this.rest.drop(table);
    }
    if (this.fire != null) {
      this.fire.drop(table);
    }
    if (this.index != null) {
      this.index.drop(table);
    }
    if (this.local != null) {
      this.local.drop(table);
    }
    if (this.pipe != null) {
      this.pipe.drop(table);
    }
    if (this.tables[table] != null) {
      delete this.tables[table];
    } else {
      this.onerror(table, 'drop', {
        error: 'Store missing table'
      });
    }
  }

  copyTable(src, des, table, where = Store.where) {
    var callback;
    callback = function(results) {
      return des.insert(table, results);
    };
    src.select(table, where, callback);
  }

  copyDatabase(src, des) {
    var data, ref, table;
    ref = this.tables;
    for (table in ref) {
      if (!hasProp$1.call(ref, table)) continue;
      data = ref[table];
      this.copyTable(src, des, table, Store.where);
    }
  }

  // Utilities
  toObjs(results, where, keyProp = 'id') {
    var i, key, len, obj, objs, row;
    if (this.isArray(results)) {
      objs = {};
      for (i = 0, len = results.length; i < len; i++) {
        row = results[i];
        if (where(obj)) {
          objs[row[keyProp]] = row;
        }
      }
      return objs;
    } else if (where({})) { // Checks if where = (obj) -> true
      return results;
    } else {
      objs = {};
      for (key in results) {
        if (!hasProp$1.call(results, key)) continue;
        obj = results[key];
        if (where(obj)) {
          objs[key] = obj;
        }
      }
      return objs;
    }
  }

  isArray(a) {
    return a !== null && typeof a !== "undefined" && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

};

// RDUDC            Retrieve  Create    Update    Delete   Change
Store.restOps = ['get', 'add', 'put', 'del', 'batch'];

Store.sqlOps = ['select', 'insert', 'update', 'remove'];

Store.tableOps = ['show', 'open', 'drop'];

// Dafaults for empty arguments
Store.where = function() {
  return true; // Default where clause filter that returns true to access all records
};

var Store$1 = Store;

var Table;

Table = class Table {
  constructor(stream) {
    this.stream = stream;
    this.dbName = 'Prac';
    this.url = 'http://localhost:63342/aug/pub/app/data/';
    this.tables = {
      Prac: {}
    };
    this.store = new Store$1(this.dbName, this.tables, this.url);
    this.store.fire = new Fire$1(this.store);
    this.store.pipe = new Pipe$1(this.stream, this.dbName);
  }

  //store.rest   = new Rest(   @store )
  //store.local  = new Local(  @store )
  //store.memory = new Memory( @store )
  selectPrac(onSelect) {
    var cols, keys, onPrac, where;
    cols = ['id', 'plane', 'row', 'column', 'icon'];
    keys = ['Collab', 'Domain', 'Discover', 'Adapt', 'Tech', 'Benefit', 'Change', 'Deliver', 'Govern', 'Humanity', 'Science', 'Understand', 'Conduct', 'Cognition', 'Reason', 'Evolve', 'Educate', 'Culture', 'Trust', 'Nature', 'Truth', 'Experience', 'Create', 'Conscious', 'Emerge', 'Inspire', 'Actualize'];
    onPrac = (results) => {
      var col, i, j, key, len, len1, row, rows;
      rows = {};
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        row = {};
        for (j = 0, len1 = cols.length; j < len1; j++) {
          col = cols[j];
          row[col] = results[key][col];
        }
        rows[key] = row;
      }
      onSelect(rows);
    };
    this.store.subscribe("Prac", "select", 'Table', onPrac);
    where = function(obj) {
      return true;
    };
    return this.store.select('fire', 'Prac', where);
  }

  toCap(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  columns(rows) {
    var cols, fkey, key, obj, ref;
    fkey = Object.keys(rows)[0];
    cols = {};
    ref = rows[fkey];
    for (key in ref) {
      obj = ref[key];
      cols[key] = this.toCap(key);
    }
    return cols;
  }

};

var Table$1 = Table;

//

let Table1 = {
  
  data() {
    return { comp:'Table1', key:'Table1', caption:"Table1",
      culs:{},
      rows:{},
      culs2:{  key:"Id", first:"First", last:"Last",    rank:"Rank"    },
      rows2:{
        r1: { key:"1",   first:"Mark",  last:"Felton",  rank:"Colonel" },
        r2: { key:"2",   first:"Brian", last:"Jackson", rank:"Captain" },
        r3: { key:"3",   first:"Dave",  last:"Markum",  rank:"Sargent" } }
   } },

  methods: {},

  mounted: function () {
    let table = new Table$1( this.stream() );
    let onSelect = (results) => {
      this.rows = results;
      this.culs = table.columns(results); };
    table.selectPrac( onSelect );
  }
};

function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier
/* server only */
, shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
  if (typeof shadowMode !== 'boolean') {
    createInjectorSSR = createInjector;
    createInjector = shadowMode;
    shadowMode = false;
  } // Vue.extend constructor export interop.


  var options = typeof script === 'function' ? script.options : script; // render functions

  if (template && template.render) {
    options.render = template.render;
    options.staticRenderFns = template.staticRenderFns;
    options._compiled = true; // functional template

    if (isFunctionalTemplate) {
      options.functional = true;
    }
  } // scopedId


  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode.ssrContext || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext; // functional
      // 2.2 with runInNewContext: true

      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      } // inject component styles


      if (style) {
        style.call(this, createInjectorSSR(context));
      } // register component module identifier for async chunk inference


      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    }; // used by ssr in case component is cached and beforeCreate
    // never gets called


    options._ssrRegister = hook;
  } else if (style) {
    hook = shadowMode ? function () {
      style.call(this, createInjectorShadow(this.$root.$options.shadowRoot));
    } : function (context) {
      style.call(this, createInjector(context));
    };
  }

  if (hook) {
    if (options.functional) {
      // register for functional component in vue file
      var originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

var normalizeComponent_1 = normalizeComponent;

var isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
var HEAD = document.head || document.getElementsByTagName('head')[0];
var styles = {};

function addStyle(id, css) {
  var group = isOldIE ? css.media || 'default' : id;
  var style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    var code = css.source;

    if (css.map) {
      // https://developer.chrome.com/devtools/docs/javascript-debugging
      // this makes source maps inside style tags work properly in Chrome
      code += '\n/*# sourceURL=' + css.map.sources[0] + ' */'; // http://stackoverflow.com/a/26603875

      code += '\n/*# sourceMappingURL=data:application/json;base64,' + btoa(unescape(encodeURIComponent(JSON.stringify(css.map)))) + ' */';
    }

    if (!style.element) {
      style.element = document.createElement('style');
      style.element.type = 'text/css';
      if (css.media) style.element.setAttribute('media', css.media);
      HEAD.appendChild(style.element);
    }

    if ('styleSheet' in style.element) {
      style.styles.push(code);
      style.element.styleSheet.cssText = style.styles.filter(Boolean).join('\n');
    } else {
      var index = style.ids.size - 1;
      var textNode = document.createTextNode(code);
      var nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

var browser = createInjector;

/* script */
const __vue_script__ = Table1;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("table", { staticClass: "table" }, [
    _c("thead", [
      _c(
        "tr",
        [
          _vm._l(_vm.culs, function(col) {
            return [_c("th", [_vm._v(_vm._s(col))])]
          })
        ],
        2
      )
    ]),
    _vm._v(" "),
    _c(
      "tbody",
      [
        _vm._l(_vm.rows, function(row) {
          return [
            _c(
              "tr",
              [
                _vm._l(row, function(cell) {
                  return [_c("td", [_vm._v(_vm._s(cell))])]
                })
              ],
              2
            )
          ]
        })
      ],
      2
    ),
    _vm._v(" "),
    _c("tfoot")
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-7ed4f652_0", { source: ".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.table {\n  background-color: black;\n  justify-self: center;\n  align-self: center;\n  font-size: 1rem;\n  table-layout: fixed;\n  border-collapse: collapse;\n  border: 1px solid wheat;\n}\ncaption {\n  color: wheat;\n}\nthead th {\n  color: wheat;\n  padding: 0.1em 0.2em 0.1em 0.2em;\n  border: 1px solid wheat;\n}\ntbody tr:nth-child(odd) {\n  background-color: #111111;\n}\ntbody tr:nth-child(even) {\n  background-color: #222222;\n}\ntbody tr td {\n  color: wheat;\n  padding: 0.1em 0.2em 0.1em 0.2em;\n  border: 1px solid wheat;\n}\n", map: {"version":3,"sources":["Table1.vue","/Users/ax/Documents/prj/aug/vue/data/Table1.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,eAAe;AACjB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;AACb;AACA;EACE,sBAAsB;EACtB,eAAe;AACjB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,uBAAuB;EACvB,iBAAiB;AACnB;ACCA;EDCE,uBAAuB;ECCzB,iBAAA;AACA;ADCA;ECCA,uBAAA;EACA,iBAAA;ADCA;ACCA;EACA,uBAAA;EACA,iBAAA;ADCA;ACCA;EDCE,uBAAuB;EACvB,oBAAoB;EACpB,kBAAkB;EAClB,eAAe;EACf,mBAAmB;EACnB,yBAAyB;EACzB,uBAAuB;AACzB;AACA;EACE,YAAY;AACd;AACA;EACE,YAAY;EACZ,gCAAgC;EAChC,uBAAuB;AACzB;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,yBAAyB;AAC3B;AACA;EACE,YAAY;EACZ,gCAAgC;EAChC,uBAAuB;AACzB","file":"Table1.vue","sourcesContent":[".theme-icon {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-prac {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n  font-size: 2rem;\n}\n.theme-conn {\n  background-color: #333;\n  border-radius: 36px;\n  width: 90%;\n  height: 90%;\n}\n.theme-desc {\n  background-color: #333;\n  font-size: 2rem;\n}\n.theme-logo {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-menu {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-find {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-tocs {\n  background-color: black;\n  font-size: 2.5rem;\n}\n.theme-view {\n  font-size: 1.5rem;\n}\n.theme-side {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-pref {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-foot {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.theme-trak {\n  background-color: black;\n  font-size: 1.5rem;\n}\n.table {\n  background-color: black;\n  justify-self: center;\n  align-self: center;\n  font-size: 1rem;\n  table-layout: fixed;\n  border-collapse: collapse;\n  border: 1px solid wheat;\n}\ncaption {\n  color: wheat;\n}\nthead th {\n  color: wheat;\n  padding: 0.1em 0.2em 0.1em 0.2em;\n  border: 1px solid wheat;\n}\ntbody tr:nth-child(odd) {\n  background-color: #111111;\n}\ntbody tr:nth-child(even) {\n  background-color: #222222;\n}\ntbody tr td {\n  color: wheat;\n  padding: 0.1em 0.2em 0.1em 0.2em;\n  border: 1px solid wheat;\n}\n","\n<template>\n  <table class=\"table\">\n    <!--caption>{{caption}}</caption-->\n    <thead><tr><template v-for=\"col  in culs\"><th>{{col}}</th></template></tr></thead>\n    <tbody><template v-for=\"row  in rows\">\n       <tr><template v-for=\"cell in row\"><td>{{cell}}</td></template></tr>\n    </template></tbody>\n    <tfoot></tfoot>\n  </table>\n</template>\n\n<script type=\"module\">\n  \n  import Table from '../../pub/base/store/Table.js'\n  \n  let Table1 = {\n    \n    data() {\n      return { comp:'Table1', key:'Table1', caption:\"Table1\",\n        culs:{},\n        rows:{},\n        culs2:{  key:\"Id\", first:\"First\", last:\"Last\",    rank:\"Rank\"    },\n        rows2:{\n          r1: { key:\"1\",   first:\"Mark\",  last:\"Felton\",  rank:\"Colonel\" },\n          r2: { key:\"2\",   first:\"Brian\", last:\"Jackson\", rank:\"Captain\" },\n          r3: { key:\"3\",   first:\"Dave\",  last:\"Markum\",  rank:\"Sargent\" } }\n     } },\n\n    methods: {},\n\n    mounted: function () {\n      let table = new Table( this.stream() );\n      let onSelect = (results) => {\n        this.rows = results;\n        this.culs = table.columns(results); }\n      table.selectPrac( onSelect );\n    }\n  }\n  \n  export default Table1;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .table { background-color:@theme-back; justify-self:center; align-self:center; font-size:@theme-table-size;\n     table-layout: fixed; border-collapse: collapse; border:1px solid @theme-border-color; }\n\n  caption  { color:@theme-color; }\n  thead th { color:@theme-color; padding:0.1em 0.2em 0.1em 0.2em; border:1px solid @theme-border-color; }\n\n  tbody tr {}\n  tbody tr:nth-child(odd)  { background-color: #111111; }\n  tbody tr:nth-child(even) { background-color: #222222; }\n  \n  tbody tr td { color:@theme-color; padding:0.1em 0.2em 0.1em 0.2em; border:1px solid @theme-border-color; }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Table1$1 = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

//

let Table2 = {
  
  extends:Table1$1
};

/* script */
const __vue_script__$1 = Table2;

/* template */

  /* style */
  const __vue_inject_styles__$1 = undefined;
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Table2$1 = normalizeComponent_1(
    {},
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    undefined,
    undefined
  );

export default Table2$1;
