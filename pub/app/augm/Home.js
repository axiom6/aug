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


var script = {

  props: { comp:String, btns:Object, klass:String, init:String, back:String, active:String },

  data() { return { key:this.init,
    colors: { primary:'#007bff', secondary:'#6c757d', success:'#28a745', info:'#17a2b8',
              warning:'#ffc107', danger:   '#dc3545', light:  '#f8f9fa', dark:'#343a40' } } },

  methods: {
    pubBtn: function (btn) {
      this.key = btn.key;
      this.publish( this.comp, btn.key ); },
    aspect: function() {  // Only call in mounted
      let w = this.$refs['Btns']['clientWidth' ];
      let h = this.$refs['Btns']['clientHeight'];
      return h/w; },
    styleBlock: function(p) {
      let p2 = p[2]===0 ? p[3] : p[2];
      return { position:'absolute', left:p[0]+'%', top:p[1]+'%', width:p2+'%', height:p[3]+'%',
      fontSize:(p[3]*0.1)+'em' } },
    styleBtn: function (btn) {
      let back = this.colors[btn.back] ? this.colors[btn.back] : this.back;
      return this.key===btn.key ? { color:'black', backgroundColor:this.active }
                                : { color:'black', backgroundColor:back }; },
    classCheck: function (btn) {
      return this.key===btn.key ? 'check far fa-check-square' : 'check far fa-square' },
    classIcons: function (btn) {
      return 'icons ' + btn.icon },
    titleRef: function (btn) {
      return 'Title' + btn.key },
    img: function (btn) {
      return 'css/' + btn.img }, // return '../../css/' + btn.img },
    adjustWidths: function() {
       let keys = Object.keys(this.btns);
       for( let key of keys ) {
         let btn = this.btns[key];
         if( btn.pos[2]===0 ) {
           let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth'];
           let el     = this.$refs[btn.key][0];
           let wb     = el['clientWidth'];
           btn.pos[2] = btn.pos[3]*2.4*wt/wb;
           // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
           this.$refs[btn.key][0].style.width = btn.pos[2]+'%'; } }
    } },

  mounted: function () {
    this.asp = this.aspect();
    this.adjustWidths();
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
const __vue_script__ = script;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Btns", staticClass: "btns" },
    [
      _vm._l(_vm.btns, function(btn) {
        return [
          _c(
            "div",
            { ref: btn.key, refInFor: true, style: _vm.styleBlock(btn.pos) },
            [
              _c("div", { staticClass: "btn-center" }, [
                _c(
                  "div",
                  {
                    staticClass: "btn",
                    style: _vm.styleBtn(btn),
                    on: {
                      click: function($event) {
                        return _vm.pubBtn(btn)
                      }
                    }
                  },
                  [
                    btn.check
                      ? _c("span", { class: _vm.classCheck(btn) })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.icon
                      ? _c("i", { class: _vm.classIcons(btn) })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.img
                      ? _c("img", {
                          staticClass: "image",
                          attrs: { src: _vm.img(btn), alt: "" }
                        })
                      : _vm._e(),
                    _vm._v(" "),
                    btn.title
                      ? _c(
                          "span",
                          {
                            ref: _vm.titleRef(btn),
                            refInFor: true,
                            staticClass: "title"
                          },
                          [_vm._v(_vm._s(btn.title))]
                        )
                      : _vm._e()
                  ]
                )
              ])
            ]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-2e3e0fe5_0", { source: ".btns {\n  font-size: 3vh;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 35% 65%;\n  grid-template-areas: \"icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n", map: {"version":3,"sources":["Btns.vue"],"names":[],"mappings":"AAAA;EACE,cAAc;EACd,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;AACX;AACA;EACE,aAAa;EACb,WAAW;EACX,YAAY;AACd;AACA;EACE,aAAa;EACb,8BAA8B;EAC9B,kCAAkC;EAClC,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,+BAA+B;EAC/B,eAAe;EACf,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,uBAAuB;AACzB","file":"Btns.vue","sourcesContent":[".btns {\n  font-size: 3vh;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 35% 65%;\n  grid-template-areas: \"icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Btns = normalizeComponent_1(
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
//

var script$1 = {};

/* script */
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "logo" })
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-78e66bae_0", { source: ".logo {\n  background-color: #333;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n", map: {"version":3,"sources":["Logo.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB;AACA;EACE,YAAY;EACZ,YAAY;AACd","file":"Logo.vue","sourcesContent":[".logo {\n  background-color: #333;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Logo = normalizeComponent_1(
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


var script$2 = {
  data() {
    return {} },
  methods: {
    click:  function( obj )  {
      this.publish(  'Navb', obj    ); },
    onNavb: function( obj )  {
      console.log(  'Navb.onNavb()', obj ); } },
  mounted: function () {
    this.subscribe( 'Navb', 'Navb.vue', this.onNavb ); } };

/* script */
const __vue_script__$2 = script$2;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "navb" }, [
    _c(
      "div",
      { staticClass: "home" },
      [
        _c("router-link", { attrs: { to: { name: "Home" } } }, [
          _c("i", { staticClass: "fas fa-home" }),
          _vm._v("Home")
        ])
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "search",
        on: {
          click: function($event) {
            return _vm.click("Search")
          }
        }
      },
      [_c("i", { staticClass: "fas fa-search" }), _vm._v(" "), _vm._m(0)]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "contact",
        on: {
          click: function($event) {
            return _vm.click("Contact")
          }
        }
      },
      [_c("i", { staticClass: "fas fa-user" }), _vm._v("Contact")]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        staticClass: "signon",
        on: {
          click: function($event) {
            return _vm.click("Signon")
          }
        }
      },
      [_c("i", { staticClass: "fas fa-sign-in-alt" }), _vm._v("Sign On")]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "settings" }, [
      _c("i", { staticClass: "fas fa-cog" }),
      _c("span", [_vm._v("Settings")]),
      _vm._v(" "),
      _c("ul", [
        _c(
          "li",
          {
            on: {
              click: function($event) {
                return _vm.click("Preferences")
              }
            }
          },
          [
            _c("i", { staticClass: "fas fa-cog" }),
            _c("span", [_vm._v("Preferences")])
          ]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            on: {
              click: function($event) {
                return _vm.click("Connection")
              }
            }
          },
          [
            _c("i", { staticClass: "fas fa-cog" }),
            _c("span", [_vm._v("Connection")])
          ]
        ),
        _vm._v(" "),
        _c(
          "li",
          {
            on: {
              click: function($event) {
                return _vm.click("Privacy")
              }
            }
          },
          [
            _c("i", { staticClass: "fas fa-cog" }),
            _c("span", [_vm._v("Privacy")])
          ]
        )
      ])
    ])
  ])
};
var __vue_staticRenderFns__$2 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("label", { attrs: { for: "search" } }, [
      _c("input", {
        staticClass: "input",
        attrs: {
          placeholder: " Search",
          id: "search",
          type: "text",
          size: "16"
        }
      })
    ])
  }
];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-52179ed9_0", { source: ".navb {\n  grid-template-columns: 5% 40% 25% 10% 10% 10%;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  background-color: black;\n  color: wheat;\n  display: grid;\n  font-family: Roboto, sans-serif;\n  font-size: 1.4vw;\n  font-weight: bold;\n}\n.navb .home {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .home i {\n  margin-right: 0.3em;\n}\n.navb .home a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: black;\n  color: wheat;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7em;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.navb .settings ul li span {\n  display: inline-block;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.navb div i {\n  margin-right: 0.3em;\n}\n", map: {"version":3,"sources":["Navb.vue","/Users/ax/Documents/prj/aug/vue/dash/Navb.vue"],"names":[],"mappings":"AAAA;EACE,6CAA6C;EAC7C,qEAAqE;EACrE,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,+BAA+B;EAC/B,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,+BAA+B;EAC/B,iBAAiB;EACjB,gBAAgB;EAChB,4BAA4B;EAC5B,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,mBAAmB;EACnB,mBAAmB;EACnB,kBAAkB;ACCpB;ADCA;ECCA,kBAAA;EACA,mBAAA;EDCE,kBAAkB;ACCpB;AACA;EACA,oBAAA;EACA,mBAAA;EACA,kBAAA;EACA,kBAAA;AACA;AACA;EACA,aAAA;EACA,iBAAA;EACA,gBAAA;EACA,gBAAA;EACA,UAAA;EACA,gBAAA;EACA,kBAAA;EACA,UAAA;EACA,SAAA;EACA,YAAA;EACA,YAAA;EACA,gCAAA;EACA,4BAAA;AACA;ADCA;EACE,eAAe;EACf,4BAA4B;EAC5B,iBAAiB;EACjB,YAAY;EACZ,+BAA+B;EAC/B,gCAAgC;AAClC;AACA;EACE,qBAAqB;EACrB,oBAAoB;AACtB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,iBAAiB;EACjB,gBAAgB;AAClB;AACA;EACE,gBAAgB;EAChB,YAAY;AACd;AACA;EACE,mBAAmB;AACrB","file":"Navb.vue","sourcesContent":[".navb {\n  grid-template-columns: 5% 40% 25% 10% 10% 10%;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  background-color: black;\n  color: wheat;\n  display: grid;\n  font-family: Roboto, sans-serif;\n  font-size: 1.4vw;\n  font-weight: bold;\n}\n.navb .home {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .home i {\n  margin-right: 0.3em;\n}\n.navb .home a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: black;\n  color: wheat;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7em;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.navb .settings ul li span {\n  display: inline-block;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.navb div i {\n  margin-right: 0.3em;\n}\n","\n<template>\n  <div class=\"navb\">    <!-- <i class=\"fas fa-home\"></i> -->\n    <div class=\"home\"><router-link :to=\"{ name:'Home'}\"><i class=\"fas fa-home\"></i>Home</router-link></div>\n    <div class=\"search\"   @click=\"click('Search')\">\n      <i class=\"fas fa-search\"></i>\n      <label for=\"search\"><input class=\"input\" placeholder=\" Search\" id=\"search\" type=\"text\" size=\"16\"></label><!--\n      &#xF002;\n       -->\n    </div>\n    <div class=\"contact\"  @click=\"click('Contact')\" ><i class=\"fas fa-user\"       ></i>Contact</div>\n    <div class=\"signon\"   @click=\"click('Signon')\"  ><i class=\"fas fa-sign-in-alt\"></i>Sign On</div>\n    <div class=\"settings\"><i class=\"fas fa-cog\"></i><span>Settings</span>\n      <ul>\n        <li @click=\"click('Preferences')\"><i class=\"fas fa-cog\"></i><span>Preferences</span></li>\n        <li @click=\"click('Connection')\" ><i class=\"fas fa-cog\"></i><span>Connection</span></li>\n        <li @click=\"click('Privacy')\"    ><i class=\"fas fa-cog\"></i><span>Privacy</span></li>\n      </ul>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  export default {\n    data() {\n      return {} },\n    methods: {\n      click:  function( obj )  {\n        this.publish(  'Navb', obj    ); },\n      onNavb: function( obj )  {\n        console.log(  'Navb.onNavb()', obj ); } },\n    mounted: function () {\n      this.subscribe( 'Navb', 'Navb.vue', this.onNavb ) } };\n  \n</script>\n\n<style lang=\"less\">\n  \n  // top | right | bottom | left\n  \n  .grid1x5() { display:grid; grid-template-columns:5% 40% 25% 10% 10% 10%;\n    grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\"; }\n  \n  .navb {  .grid1x5(); background-color:black; color:wheat; display:grid;\n      font-family:Roboto, sans-serif; font-size:1.4vw; font-weight:bold;    // Using because Navb sensistive to width\n    .home     { grid-area:ghome;     justify-self:start; align-self:center;\n      i { margin-right:0.3em; }\n      a { color:wheat; text-decoration:none; }}\n    .search   { grid-area:gsearch;   justify-self:start; align-self:center; // font-family:FontAwesome, sans-serif;\n      label .input{ font-family:Roboto, sans-serif; font-weight:bold;  font-size:0.9em;\n        border-radius:0 12px 12px 0; background:black; color:wheat; } }\n    .contact  { grid-area:gcontact;  justify-self:start; align-self:center; }\n    .signon   { grid-area:gsignon;   justify-self:start; align-self:center; }\n    .settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;\n      ul { display:none; align-self:start; list-style:none; font-size:0.7em; z-index:3; background:#222;\n        position:absolute; left:10px; top:12px; width:200px; height:auto;\n        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;\n        li { display:inline; border-radius:0 18px 18px 0;  background:black; color:wheat;\n             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em;\n          i {    display:inline-block; margin-right:0.25em; }\n          span { display:inline-block; } } } }\n    .settings:hover {\n      ul { display:grid; align-self:start; background:#444;\n        li:hover { background:#777; color:black; } } }\n     div i { margin-right:0.3em; } }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Navb = normalizeComponent_1(
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

var script$3 = {};

/* script */
const __vue_script__$3 = script$3;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "find" })
};
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-4b01193a_0", { source: ".find {\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Find.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB","file":"Find.vue","sourcesContent":[".find {\n  background-color: #333;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Find = normalizeComponent_1(
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
  
  data() { return {  comp:'None', prac:'None', disp:'None', komps:{} } },
  
  methods: {
    
    isPrac: function(prac) {
      return this.prac === prac;  },
    onComp: function(comp) {
      this.comp = comp; },
    onPrac: function(prac) {
      this.prac = prac; },
    onDisp: function(prac,disp) {
      this.prac = prac; this.disp = disp; },
    pubComp: function(comp) {
      this.comp =   comp;
      if( this.komps[this.comp].ikw ) {
          this.pubPrac('All'); } },
    pubPrac: function(prac) {
      this.prac = prac;
      this.publish( this.comp, { prac:this.prac, disp:'All' } ); },
    pubDisp: function(prac,disp) {
      this.publish( this.comp, { prac:prac, disp:disp  } ); },
    doSelect: function(select) {
      this.publish( 'Select',   select ); },
    stylePrac: function( prac, hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; },
    styleDisp: function( disp, hsv ) {
      if( this.disp!==disp ) {
        return { color:'black', backgroundColor:this.toRgbaHsv(hsv) }; }
      else {
        return { color:'white', backgroundColor:'black' }; } } },
  
  mounted: function () {
    this.komps = this.kompsTocs();
    for( let key in this.komps ) {
      if( this.komps.hasOwnProperty(key) && this.komps[key].ikw ) {
        this.komps[key].pracs = this.pracs(key);
        this.subscribe( key, 'Tocs.vue', (obj) => {
          this.onComp(key);
          if( obj.disp==='All' ) { this.onPrac(obj.prac); }
          else                   { this.onDisp(obj.prac,obj.disp); } } ); } }
    this.subscribe( 'Tocs', 'Tocs.vue', (obj) => {
      if( obj==='Close' ) {
        this.onComp('None'); } } ); }
  };

/* script */
const __vue_script__$4 = Tocs;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "tocs" }, [
    _c(
      "ul",
      [
        _vm._l(_vm.komps, function(komp) {
          return [
            _c("li", { key: komp.name }, [
              _c(
                "div",
                {
                  on: {
                    click: function($event) {
                      return _vm.pubComp(komp.name)
                    }
                  }
                },
                [
                  _c("router-link", { attrs: { to: { name: komp.comp } } }, [
                    _c("i", { class: komp.icon }),
                    _vm._v(_vm._s(komp.name))
                  ])
                ],
                1
              ),
              _vm._v(" "),
              _vm.comp === komp.name
                ? _c(
                    "ul",
                    [
                      _vm._l(_vm.komps[komp.name].pracs, function(prac) {
                        return [
                          _c(
                            "li",
                            {
                              key: prac.name,
                              style: _vm.stylePrac(prac.name, prac.hsv),
                              on: {
                                click: function($event) {
                                  return _vm.pubPrac(prac.name)
                                }
                              }
                            },
                            [
                              _c("i", { class: prac.icon }),
                              _vm._v(" "),
                              komp.link
                                ? _c(
                                    "router-link",
                                    { attrs: { to: { name: prac.name } } },
                                    [_vm._v(_vm._s(prac.name))]
                                  )
                                : _vm._e(),
                              _vm._v(" "),
                              !komp.link
                                ? _c("span", [_vm._v(_vm._s(prac.name))])
                                : _vm._e(),
                              _vm._v(" "),
                              _c(
                                "ul",
                                {
                                  directives: [
                                    {
                                      name: "show",
                                      rawName: "v-show",
                                      value: _vm.isPrac(prac.name),
                                      expression: "isPrac(prac.name)"
                                    }
                                  ]
                                },
                                [
                                  _vm._l(prac.disps, function(disp) {
                                    return [
                                      _c(
                                        "li",
                                        {
                                          key: disp.name,
                                          style: _vm.styleDisp(
                                            disp.name,
                                            disp.hsv
                                          ),
                                          on: {
                                            click: function($event) {
                                              $event.stopPropagation();
                                              return _vm.pubDisp(
                                                prac.name,
                                                disp.name
                                              )
                                            }
                                          }
                                        },
                                        [
                                          _c("i", { class: disp.icon }),
                                          _vm._v(_vm._s(disp.name))
                                        ]
                                      )
                                    ]
                                  })
                                ],
                                2
                              )
                            ],
                            1
                          )
                        ]
                      })
                    ],
                    2
                  )
                : _vm._e()
            ])
          ]
        })
      ],
      2
    )
  ])
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-450094a6_0", { source: ".tocs {\n  background-color: black;\n  font-size: 3vh;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black!important;\n  color: white!important;\n}\n", map: {"version":3,"sources":["Tocs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,cAAc;AAChB;AACA;EACE,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,oBAAoB;EACpB,iBAAiB;EACjB,4BAA4B;EAC5B,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,gBAAgB;EAChB,iBAAiB;EACjB,UAAU;EACV,SAAS;AACX;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;AACd;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,mBAAmB;AACrB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iCAAiC;EACjC,sBAAsB;AACxB","file":"Tocs.vue","sourcesContent":[".tocs {\n  background-color: black;\n  font-size: 3vh;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black!important;\n  color: white!important;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Tocs$1 = normalizeComponent_1(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4,
    __vue_scope_id__$4,
    __vue_is_functional_template__$4,
    __vue_module_identifier__$4,
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


var script$4 = {
  
  methods:{
    show:function() {
      return this.$route.name===null } } };

/* script */
const __vue_script__$5 = script$4;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    [
      _c("router-view", { attrs: { name: "Data" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Math" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Geom" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Draw" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Note" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Home" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Info" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Know" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Wise" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Cube" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Wood" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    undefined,
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
  return _c("div", { staticClass: "side" })
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = function (inject) {
    if (!inject) return
    inject("data-v-48f77378_0", { source: ".side {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Side.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Side.vue","sourcesContent":[".side {\n  background-color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject SSR */
  

  
  var Side = normalizeComponent_1(
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
  return _c("div", { staticClass: "pref" })
};
var __vue_staticRenderFns__$7 = [];
__vue_render__$7._withStripped = true;

  /* style */
  const __vue_inject_styles__$7 = function (inject) {
    if (!inject) return
    inject("data-v-d140e9be_0", { source: ".pref {\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Pref.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB","file":"Pref.vue","sourcesContent":[".pref {\n  background-color: #333;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject SSR */
  

  
  var Pref = normalizeComponent_1(
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
  return _c("div", { staticClass: "foot" })
};
var __vue_staticRenderFns__$8 = [];
__vue_render__$8._withStripped = true;

  /* style */
  const __vue_inject_styles__$8 = function (inject) {
    if (!inject) return
    inject("data-v-7573ed31_0", { source: ".foot {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Foot.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Foot.vue","sourcesContent":[".foot {\n  background-color: black;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$8 = undefined;
  /* module identifier */
  const __vue_module_identifier__$8 = undefined;
  /* functional template */
  const __vue_is_functional_template__$8 = false;
  /* style inject SSR */
  

  
  var Foot = normalizeComponent_1(
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
//
//
//
//

var script$8 = {};

/* script */
const __vue_script__$9 = script$8;

/* template */
var __vue_render__$9 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "trak" })
};
var __vue_staticRenderFns__$9 = [];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return
    inject("data-v-27b0e242_0", { source: "\n.trak { background-color:#333;\n}\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/vue/dash/Trak.vue"],"names":[],"mappings":";AAUA,QAAA,qBAAA;AAAA","file":"Trak.vue","sourcesContent":["\n<template>\n  <div class=\"trak\"></div>\n</template>\n\n<script>\n  export default {}\n</script>\n\n<style type=\"module\">\n     .trak { background-color:#333; }\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  

  
  var Trak = normalizeComponent_1(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9,
    __vue_scope_id__$9,
    __vue_is_functional_template__$9,
    __vue_module_identifier__$9,
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
const __vue_script__$a = Dash;

/* template */
var __vue_render__$a = function() {
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
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-8980d6e4_0", { source: "@import 'css/fontawesome/init.css';\n.dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA,kCAAkC;AAClC;EACE,+BAA+B;EAC/B,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,oCAAoC;EACpC,gCAAgC;EAChC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;ECCjB,qBAAA;EDCE,mBAAmB;ECCrB,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;ADCA;ECCA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EDCE,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf","file":"Dash.vue","sourcesContent":["@import 'css/fontawesome/init.css';\n.dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from '../dash/Logo.vue';\n  import Navb from '../dash/Navb.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from '../dash/Tocs.vue';\n  import View from '../dash/View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import 'css/fontawesome/init.css';\n\n  .dash { font-family:Roboto, sans-serif; font-size:1rem;\n   position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n   grid-template-columns: 11vw 85vw 4vw;\n   grid-template-rows:     6vh 88vh 6vh;\n   grid-template-areas:\n     \"logo navb find\"\n     \"tocs view side\"\n     \"pref foot trak\";\n  \n  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }\n  #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }\n  #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }\n  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; }\n  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }\n  #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }\n  #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }\n  #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }\n  #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a,
    __vue_scope_id__$a,
    __vue_is_functional_template__$a,
    __vue_module_identifier__$a,
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


let Math = {

  data() { return { comp:'Math',
    maths:[
      { title:'MathML', key:'ML' },
      { title:'MathEQ', key:'EQ' } ] } },

  mounted: function () {} 

};

/* script */
const __vue_script__$b = Math;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Math", staticClass: "math" },
    [
      _vm.comp === "Math" ? _c("h1", [_vm._v("Mathematics")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.maths, function(math) {
        return [_c("router-view", { attrs: { name: _vm.comp + math.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;

  /* style */
  const __vue_inject_styles__$b = function (inject) {
    if (!inject) return
    inject("data-v-592dfb65_0", { source: ".math {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.math h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n", map: {"version":3,"sources":["Math.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,cAAc;AAChB","file":"Math.vue","sourcesContent":[".math {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.math h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* style inject SSR */
  

  
  var Math$1 = normalizeComponent_1(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
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


let Geom = {

  data() { return { comp:'Geom',
    geoms:[
      { title:'Geom2D', key:'2D' },
      { title:'Geom3D', key:'3D' },
      { title:'Geom4D', key:'4D' } ] } },

  mounted: function () {}

};

/* script */
const __vue_script__$c = Geom;

/* template */
var __vue_render__$c = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Geom", staticClass: "geom" },
    [
      _vm.comp === "Geom" ? _c("h1", [_vm._v("Geometric Algebra")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.geoms, function(geom) {
        return [_c("router-view", { attrs: { name: _vm.comp + geom.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$c = [];
__vue_render__$c._withStripped = true;

  /* style */
  const __vue_inject_styles__$c = function (inject) {
    if (!inject) return
    inject("data-v-f74ebfd4_0", { source: ".geom {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.geom h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n", map: {"version":3,"sources":["Geom.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,cAAc;AAChB","file":"Geom.vue","sourcesContent":[".geom {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.geom h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$c = undefined;
  /* module identifier */
  const __vue_module_identifier__$c = undefined;
  /* functional template */
  const __vue_is_functional_template__$c = false;
  /* style inject SSR */
  

  
  var Geom$1 = normalizeComponent_1(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
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


var script$9 = {

  props: { comp:String, pages:Array, init:String },
  
  data() { return { tab:this.init } },
  
  methods: {
    pubTab: function (tab) {
      this.tab = tab;
      this.publish( 'Tabs', tab ); },
    classTab: function (tab) {
      return this.tab===tab ? 'tab-active' : 'tab'; },
    name: function(page) {
      return this.comp+page.key; } },

  mounted: function () {}
  
  };

/* script */
const __vue_script__$d = script$9;

/* template */
var __vue_render__$d = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "tabs" },
    [
      _vm._l(_vm.pages, function(page) {
        return [
          _c(
            "div",
            {
              class: _vm.classTab(page.key),
              on: {
                click: function($event) {
                  return _vm.pubTab(page.key)
                }
              }
            },
            [
              _c("router-link", { attrs: { to: { name: _vm.name(page) } } }, [
                _vm._v(_vm._s(page.title))
              ])
            ],
            1
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$d = [];
__vue_render__$d._withStripped = true;

  /* style */
  const __vue_inject_styles__$d = function (inject) {
    if (!inject) return
    inject("data-v-7da51896_0", { source: ".tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5em;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab:hover a {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  background-color: wheat;\n  color: black;\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab-active a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab-active a {\n  background-color: wheat;\n  color: black !important;\n  text-decoration: none;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,UAAU;EACV,uBAAuB;EACvB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;AAChC;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,qBAAqB;EACrB,gBAAgB;ECClB,gCAAA;EACA,4BAAA;EACA,6BAAA;EACA,4BAAA;EACA,8BAAA;AACA;AACA;EACA,uBAAA;EACA,YAAA;EDCE,qBAAqB;AACvB;AACA;EACE,uBAAuB;EACvB,uBAAuB;EACvB,qBAAqB;AACvB","file":"Tabs.vue","sourcesContent":[".tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5em;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab:hover a {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  background-color: wheat;\n  color: black;\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab-active a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab-active a {\n  background-color: wheat;\n  color: black !important;\n  text-decoration: none;\n}\n","\n<template>\n  <div class=\"tabs\">\n    <template v-for=\"page in pages\">\n      <div :class=\"classTab(page.key)\" @click=\"pubTab(page.key)\">\n        <router-link :to=\"{ name:name(page) }\">{{page.title}}</router-link>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { comp:String, pages:Array, init:String },\n    \n    data() { return { tab:this.init } },\n    \n    methods: {\n      pubTab: function (tab) {\n        this.tab = tab;\n        this.publish( 'Tabs', tab ); },\n      classTab: function (tab) {\n        return this.tab===tab ? 'tab-active' : 'tab'; },\n      name: function(page) {\n        return this.comp+page.key; } },\n\n    mounted: function () {}\n    \n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  .tabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:black; font-size:1.5em;\n    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;\n      border-radius:12px 12px 0 0; border-left: wheat solid thin;\n      border-top:wheat solid thin; border-right:wheat solid thin;\n      a         { background-color:black; color:wheat; text-decoration:none; } }\n    .tab:hover  { background-color:wheat; color:black;\n      a         { background-color:wheat; color:black } }\n    .tab-active { background-color:wheat; color:black; .tab();\n      a         { background-color:wheat; color:black !important; text-decoration:none; } } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$d = undefined;
  /* module identifier */
  const __vue_module_identifier__$d = undefined;
  /* functional template */
  const __vue_is_functional_template__$d = false;
  /* style inject SSR */
  

  
  var Tabs = normalizeComponent_1(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d,
    __vue_scope_id__$d,
    __vue_is_functional_template__$d,
    __vue_module_identifier__$d,
    browser,
    undefined
  );

//

let Note = {
  
  components:{ 'n-tabs':Tabs },

  data() {
    return { comp:'Note', tab:'Standard', pages:[
        { title:'Standard', key:'Stand' },
        { title:'Embed',    key:'Embed' },
        { title:'Maths',    key:'Maths' },
        { title:'Ganja',    key:'Ganja' },
      ] } },
  
  methods: {
    
    name: function(page) {
      return this.comp+page.key; } },
  
};

/* script */
const __vue_script__$e = Note;

/* template */
var __vue_render__$e = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "note" },
    [
      _c("n-tabs", { attrs: { comp: _vm.comp, pages: _vm.pages } }),
      _vm._v(" "),
      _vm.comp === "Note" ? _c("h1", [_vm._v("Notebooks")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.pages, function(page) {
        return [
          _c("router-view", { attrs: { name: _vm.name(page), id: page.key } })
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$e = [];
__vue_render__$e._withStripped = true;

  /* style */
  const __vue_inject_styles__$e = function (inject) {
    if (!inject) return
    inject("data-v-3ca17eed_0", { source: ".note {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.note h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n", map: {"version":3,"sources":["Note.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,cAAc;AAChB","file":"Note.vue","sourcesContent":[".note {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.note h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$e = undefined;
  /* module identifier */
  const __vue_module_identifier__$e = undefined;
  /* functional template */
  const __vue_is_functional_template__$e = false;
  /* style inject SSR */
  

  
  var Note$1 = normalizeComponent_1(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
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


let Data = {

  data() { return { comp:'Data', datas:[
    { title:'Tables', key:'Tables' },
    { title:'Pivots', key:'Pivots' } ] } },

  methods: {
    isData: function() {
      return this.comp === 'Data'; } },

  mounted: function () {}

};

/* script */
const __vue_script__$f = Data;

/* template */
var __vue_render__$f = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Data", staticClass: "data" },
    [
      _c("h1", { attrs: { "v-if": _vm.isData() } }, [_vm._v("Data")]),
      _vm._v(" "),
      _vm._l(_vm.datas, function(dat) {
        return [_c("router-view", { attrs: { name: dat.key } })]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$f = [];
__vue_render__$f._withStripped = true;

  /* style */
  const __vue_inject_styles__$f = function (inject) {
    if (!inject) return
    inject("data-v-45adb441_0", { source: ".data {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n", map: {"version":3,"sources":["Data.vue"],"names":[],"mappings":"AAAA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,aAAa;AACf;AACA;EACE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,cAAc;AAChB","file":"Data.vue","sourcesContent":[".data {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.data h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$f = undefined;
  /* module identifier */
  const __vue_module_identifier__$f = undefined;
  /* functional template */
  const __vue_is_functional_template__$f = false;
  /* style inject SSR */
  

  
  var Data$1 = normalizeComponent_1(
    { render: __vue_render__$f, staticRenderFns: __vue_staticRenderFns__$f },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
    browser,
    undefined
  );

//

 let Home = {
  
  components:{ 'h-btns':Btns },

data() { return { comp:'Draw', key:'Axes', btns:{
  Axes:    { title:'Axes',    key:'Axes',    obj:null, pos:[ 5,10,0,10], back:'primary',   check:true              },
  Chord:   { title:'Chord',   key:'Chord',   obj:null, pos:[30,10,0,20], back:'secondary', img:'brew/AutoDrip.jpg' },
  Cluster: { title:'Cluster', key:'Cluster', obj:null, pos:[50,10,0,10], back:'success',   icon:'fas fa-circle'    },
  Link:    { title:'Link',    key:'Link',    obj:null, pos:[ 5,25,0,20], back:'info',      check:true              },
  Radar:   { title:'Radar',   key:'Radar',   obj:null, pos:[ 5,40,0,10], back:'warning',   icon:'fas fa-circle'    },
  Radial:  { title:'Radial',  key:'Radial',  obj:null, pos:[ 5,55,0,20], back:'danger',    img:'brew/AutoDrip.jpg' },
  Tree:    { title:'Tree',    key:'Tree',    obj:null, pos:[40,40,0,30], back:'light',     icon:'fas fa-circle'    },
  Wheel:   { title:'Wheel',   key:'Wheel',   obj:null, pos:[60,60,0,30], back:'dark',      img:'brew/AutoDrip.jpg' }
  } } },

 mounted: function () {
     this.publish( 'Tocs', 'Close' ); }
 
};

Home.Dash = Dash$1;
Home.Math = Math$1;
Home.Geom = Geom$1;
Home.Note = Note$1;
Home.Data = Data$1;

/* script */
const __vue_script__$g = Home;

/* template */
var __vue_render__$g = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "home" }, [
    _vm._m(0),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "elem" },
      [
        _c("h-btns", {
          attrs: {
            comp: "Home",
            btns: _vm.btns,
            init: "Axes",
            back: "#3B5999",
            active: "tan"
          }
        })
      ],
      1
    ),
    _vm._v(" "),
    _vm._m(1)
  ])
};
var __vue_staticRenderFns__$g = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "head" }, [
      _c("div", [
        _c("h1", [_vm._v("Welcome to Augmentation Home Page")]),
        _vm._v(" "),
        _c("h2", [_vm._v("Choose an Application Component on the Left")])
      ])
    ])
  },
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "foot" }, [
      _c("div", [_c("h1", [_vm._v("Axiom Architectures")])])
    ])
  }
];
__vue_render__$g._withStripped = true;

  /* style */
  const __vue_inject_styles__$g = function (inject) {
    if (!inject) return
    inject("data-v-e91596e4_0", { source: ".home {\n  display: grid;\n  grid-template-columns: 100%;\n  grid-template-rows: 10% 80% 10%;\n  grid-template-areas: \"head\" \"elem\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.elem {\n  grid-area: elem;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n", map: {"version":3,"sources":["Home.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,2BAA2B;EAC3B,+BAA+B;EAC/B,yCAAyC;EACzC,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,YAAY;AACd;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB","file":"Home.vue","sourcesContent":[".home {\n  display: grid;\n  grid-template-columns: 100%;\n  grid-template-rows: 10% 80% 10%;\n  grid-template-areas: \"head\" \"elem\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.elem {\n  grid-area: elem;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$g = undefined;
  /* module identifier */
  const __vue_module_identifier__$g = undefined;
  /* functional template */
  const __vue_is_functional_template__$g = false;
  /* style inject SSR */
  

  
  var Home$1 = normalizeComponent_1(
    { render: __vue_render__$g, staticRenderFns: __vue_staticRenderFns__$g },
    __vue_inject_styles__$g,
    __vue_script__$g,
    __vue_scope_id__$g,
    __vue_is_functional_template__$g,
    __vue_module_identifier__$g,
    browser,
    undefined
  );

export default Home$1;
