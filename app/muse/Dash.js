//
//
//
//
//
//

var script = {};

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
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "logo" })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-c5a33bc6_0", { source: ".logo {\n  background-color: black;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n", map: {"version":3,"sources":["Logo.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,YAAY;EACZ,YAAY;AACd","file":"Logo.vue","sourcesContent":[".logo {\n  background-color: black;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Logo = normalizeComponent_1(
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
//
//
//
//

var script$1 = {};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "navb" })
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-20da0a6a_0", { source: ".navb {\n  background-color: darkgrey;\n}\n", map: {"version":3,"sources":["Navb.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B","file":"Navb.vue","sourcesContent":[".navb {\n  background-color: darkgrey;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Navb = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

//
//
//
//
//

var script$2 = {};

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "find" })
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-77e50730_0", { source: ".find {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Find.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Find.vue","sourcesContent":[".find {\n  background-color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Find = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

let Tocs = {
  data() { return { plane:"None" } },
  methods: {
    showPlane: function(plane) {
      this.plane =  plane;
      this.showPrac(plane); },
    showPrac: function(prac) {
      //console.log( 'Tocs.showPrac', { plane:this.plane, 'prac':prac } );
      this.publish( this.plane, prac ); },
    doSelect: function(select) {
      this.publish( 'Select',   select ); }
  } };

/* script */
const __vue_script__$3 = Tocs;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "tocs" }, [
    _c("ul", [
      _c("li", [
        _c(
          "span",
          {
            on: {
              click: function($event) {
                return _vm.showPlane("Info")
              }
            }
          },
          [
            _c("router-link", { attrs: { to: { name: "Info" } } }, [
              _vm._v("Info")
            ])
          ],
          1
        ),
        _vm._v(" "),
        _vm.plane === "Info"
          ? _c("ul", [
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Collab")
                    }
                  }
                },
                [_vm._v("Collab")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Domain")
                    }
                  }
                },
                [_vm._v("Domain")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Discover")
                    }
                  }
                },
                [_vm._v("Discover")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Adapt")
                    }
                  }
                },
                [_vm._v("Adapt")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Make")
                    }
                  }
                },
                [_vm._v("Make")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Benefit")
                    }
                  }
                },
                [_vm._v("Benefit")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Change")
                    }
                  }
                },
                [_vm._v("Change")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Deliver")
                    }
                  }
                },
                [_vm._v("Deliver")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Govern")
                    }
                  }
                },
                [_vm._v("Govern")]
              )
            ])
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "span",
          {
            on: {
              click: function($event) {
                return _vm.showPlane("Know")
              }
            }
          },
          [
            _c("router-link", { attrs: { to: { name: "Know" } } }, [
              _vm._v("Know")
            ])
          ],
          1
        ),
        _vm._v(" "),
        _vm.plane === "Know"
          ? _c("ul", [
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Human")
                    }
                  }
                },
                [_vm._v("Human")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Science")
                    }
                  }
                },
                [_vm._v("Science")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Grasp")
                    }
                  }
                },
                [_vm._v("Grasp")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Conduct")
                    }
                  }
                },
                [_vm._v("Conduct")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Think")
                    }
                  }
                },
                [_vm._v("Think")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Reason")
                    }
                  }
                },
                [_vm._v("Reason")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Evolve")
                    }
                  }
                },
                [_vm._v("Evolve")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Educate")
                    }
                  }
                },
                [_vm._v("Educate")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Culture")
                    }
                  }
                },
                [_vm._v("Culture")]
              )
            ])
          : _vm._e()
      ]),
      _vm._v(" "),
      _c("li", [
        _c(
          "span",
          {
            on: {
              click: function($event) {
                return _vm.showPlane("Wise")
              }
            }
          },
          [
            _c("router-link", { attrs: { to: { name: "Wise" } } }, [
              _vm._v("Wise")
            ])
          ],
          1
        ),
        _vm._v(" "),
        _vm.plane === "Wise"
          ? _c("ul", [
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Trust")
                    }
                  }
                },
                [_vm._v("Trust")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Nature")
                    }
                  }
                },
                [_vm._v("Nature")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Truth")
                    }
                  }
                },
                [_vm._v("Truth")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Explore")
                    }
                  }
                },
                [_vm._v("Explore")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Create")
                    }
                  }
                },
                [_vm._v("Create")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Mind")
                    }
                  }
                },
                [_vm._v("Mind")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Emerge")
                    }
                  }
                },
                [_vm._v("Emerge")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Inspire")
                    }
                  }
                },
                [_vm._v("Inspire")]
              ),
              _vm._v(" "),
              _c(
                "li",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPrac("Actual")
                    }
                  }
                },
                [_vm._v("Actual")]
              )
            ])
          : _vm._e()
      ])
    ])
  ])
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-330f4b64_0", { source: ".tocs {\n  background-color: darkgrey;\n}\n.tocs ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.tocs ul li {\n  margin: 0;\n  background-color: black;\n  color: white;\n  border: white solid 1px;\n  padding-left: 0.25em;\n}\n.tocs ul li a {\n  color: white;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  margin-left: 1em;\n}\n.tocs ul li:hover {\n  margin: 0;\n  background-color: white;\n  color: black;\n  border: white solid 1px;\n}\n.tocs ul li:hover a {\n  color: black;\n  text-decoration: none;\n}\n", map: {"version":3,"sources":["Tocs.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B;AACA;EACE,SAAS;EACT,UAAU;EACV,gBAAgB;AAClB;AACA;EACE,SAAS;EACT,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,oBAAoB;AACtB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,SAAS;EACT,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;AACzB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB","file":"Tocs.vue","sourcesContent":[".tocs {\n  background-color: darkgrey;\n}\n.tocs ul {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n}\n.tocs ul li {\n  margin: 0;\n  background-color: black;\n  color: white;\n  border: white solid 1px;\n  padding-left: 0.25em;\n}\n.tocs ul li a {\n  color: white;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  margin-left: 1em;\n}\n.tocs ul li:hover {\n  margin: 0;\n  background-color: white;\n  color: black;\n  border: white solid 1px;\n}\n.tocs ul li:hover a {\n  color: black;\n  text-decoration: none;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Tocs$1 = normalizeComponent_1(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3,
    __vue_scope_id__$3,
    __vue_is_functional_template__$3,
    __vue_module_identifier__$3,
    browser,
    undefined
  );

//
//
//
//
//
//
//
//
//

var script$3 = {
};

/* script */
const __vue_script__$4 = script$3;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "Info" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Know" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Wise" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = undefined;
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
    undefined,
    undefined
  );

//
//
//
//
//

var script$4 = {};

/* script */
const __vue_script__$5 = script$4;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "side" })
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return
    inject("data-v-585a5ed0_0", { source: ".side {\n  background-color: darkgrey;\n}\n", map: {"version":3,"sources":["Side.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B","file":"Side.vue","sourcesContent":[".side {\n  background-color: darkgrey;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  

  
  var Side = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    browser,
    undefined
  );

//
//
//
//
//

var script$5 = {};

/* script */
const __vue_script__$6 = script$5;

/* template */
var __vue_render__$6 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "pref" })
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return
    inject("data-v-dc85fe1c_0", { source: ".pref {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Pref.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Pref.vue","sourcesContent":[".pref {\n  background-color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  

  
  var Pref = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    browser,
    undefined
  );

//
//
//
//
//

var script$6 = {};

/* script */
const __vue_script__$7 = script$6;

/* template */
var __vue_render__$7 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "foot" })
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = function (inject) {
    if (!inject) return
    inject("data-v-debe8272_0", { source: ".foot {\n  background-color: darkgrey;\n}\n", map: {"version":3,"sources":["Foot.vue"],"names":[],"mappings":"AAAA;EACE,0BAA0B;AAC5B","file":"Foot.vue","sourcesContent":[".foot {\n  background-color: darkgrey;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject SSR */
  

  
  var Foot = normalizeComponent_1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    browser,
    undefined
  );

//
//
//
//
//

var script$7 = {};

/* script */
const __vue_script__$8 = script$7;

/* template */
var __vue_render__$8 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "trak" })
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = function (inject) {
    if (!inject) return
    inject("data-v-1ab71cff_0", { source: "\n.trak { background-color:black;\n}\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/vue/dash/Trak.vue"],"names":[],"mappings":";AAUA,QAAA,sBAAA;AAAA","file":"Trak.vue","sourcesContent":["\n<template>\n  <div class=\"trak\"></div>\n</template>\n\n<script>\n  export default {}\n</script>\n\n<style type=\"module\">\n     .trak { background-color:black; }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject SSR */
  

  
  var Trak = normalizeComponent_1(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8,
    __vue_scope_id__$8,
    __vue_is_functional_template__$8,
    __vue_module_identifier__$8,
    browser,
    undefined
  );

//

let Dash = {
    name: 'dash',
    components: {
      'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,
      'd-tocs':Tocs$1, 'd-view':View, 'd-side':Side,
      'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };

/* script */
const __vue_script__$9 = Dash;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "dash" },
    [
      _c("d-logo", { attrs: { id: "logo" } }),
      _vm._v(" "),
      _c("d-navb", { attrs: { id: "navb" } }),
      _vm._v(" "),
      _c("d-find", { attrs: { id: "find" } }),
      _vm._v(" "),
      _c("d-tocs", { attrs: { id: "tocs" } }),
      _vm._v(" "),
      _c("d-view", { attrs: { id: "view" } }),
      _vm._v(" "),
      _c("d-side", { attrs: { id: "side" } }),
      _vm._v(" "),
      _c("d-pref", { attrs: { id: "pref" } }),
      _vm._v(" "),
      _c("d-foot", { attrs: { id: "foot" } }),
      _vm._v(" "),
      _c("d-trak", { attrs: { id: "trak" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return
    inject("data-v-8d73f166_0", { source: ".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: start;\n  display: grid;\n  background-color: gray;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA;EACE,+BAA+B;EAC/B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,qCAAqC;EACrC,iCAAiC;EACjC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,iBAAiB;EACjB,aAAa;EACb,sBAAsB;AACxB;AACA;EACE,eAAe;EACf,qBAAqB;ECCvB,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;ADCA;ACCA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EDCE,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf","file":"Dash.vue","sourcesContent":[".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: start;\n  display: grid;\n  background-color: gray;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from './Logo.vue';\n  import Navb from './Navb.vue';\n  import Find from './Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from './Side.vue';\n  import Pref from './Pref.vue';\n  import Foot from './Foot.vue';\n  import Trak from './Trak.vue';\n\n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n\n   .dash { font-family:Roboto, sans-serif;\n     position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n     grid-template-columns: 140px 1fr 50px;\n     grid-template-rows:     50px 1fr 50px;\n     grid-template-areas:\n       \"logo navb find\"\n       \"tocs view side\"\n       \"pref foot trak\";\n\n    #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }\n    #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }\n    #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }\n    #tocs { grid-area:tocs; justify-self:stretch; align-self:start;   display:grid; background-color:gray;  }\n    #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }\n    #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }\n    #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }\n    #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }\n    #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }\n  \n</style>\n\n/* Static Imports\n  import Info from '../muse/Info.vue';\n  import Know from '../muse/Know.vue';\n  import Wise from '../muse/Wise.vue';\n  \n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n*/"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
    browser,
    undefined
  );

export default Dash$1;
