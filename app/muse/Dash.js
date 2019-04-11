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
    inject("data-v-78e66bae_0", { source: ".logo {\n  background-color: #333;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n", map: {"version":3,"sources":["Logo.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB;AACA;EACE,YAAY;EACZ,YAAY;AACd","file":"Logo.vue","sourcesContent":[".logo {\n  background-color: #333;\n}\n.logo img {\n  width: 140px;\n  height: 50px;\n}\n"]}, media: undefined });

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


var script$1 = {
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
const __vue_script__$1 = script$1;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "navb" }, [
    _c(
      "div",
      { staticClass: "home" },
      [
        _c("router-link", { attrs: { to: { name: "Home" } } }, [_vm._v("Home")])
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
      [_vm._m(0)]
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
      [_c("i", { staticClass: "fas fa-sign-in" }), _vm._v("Sign On")]
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
          [_vm._v("Preferences")]
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
          [_vm._v("Connection")]
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
          [_vm._v("Privacy")]
        )
      ])
    ])
  ])
};
var __vue_staticRenderFns__$1 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("label", [
      _c("input", {
        staticClass: "input",
        attrs: { placeholder: "  Search", type: "text", size: "16" }
      })
    ])
  }
];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-1129fc01_0", { source: ".navb {\n  grid-template-columns: 5% 45% 20% 10% 10% 10%;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  background-color: black;\n  color: wheat;\n  display: grid;\n  font-family: Roboto, sans-serif;\n  font-size: 3vh;\n  font-weight: bold;\n}\n.navb .home {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .home a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label .input {\n  font-family: Roboto, sans-serif;\n  font-size: 3vh;\n  font-weight: bold;\n  border-radius: 0 12px 12px 0;\n  background: black;\n  color: wheat;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 2.2vh;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: auto;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  border-radius: 0 18px 18px 0;\n  background: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n", map: {"version":3,"sources":["Navb.vue","/Users/ax/Documents/prj/aug/vue/dash/Navb.vue"],"names":[],"mappings":"AAAA;EACE,6CAA6C;EAC7C,qEAAqE;EACrE,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,+BAA+B;EAC/B,cAAc;EACd,iBAAiB;AACnB;AACA;EACE,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,+BAA+B;EAC/B,cAAc;EACd,iBAAiB;EACjB,4BAA4B;EAC5B,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,mBAAmB;EACnB,mBAAmB;EACnB,kBAAkB;ACCpB;ADCA;ECCA,kBAAA;EACA,mBAAA;EDCE,kBAAkB;ACCpB;AACA;EACA,oBAAA;EACA,mBAAA;EACA,kBAAA;EACA,kBAAA;AACA;AACA;EACA,aAAA;EACA,iBAAA;EACA,gBAAA;EACA,gBAAA;EACA,UAAA;EACA,gBAAA;EACA,kBAAA;EACA,UAAA;EACA,SAAA;EACA,WAAA;EDCE,YAAY;EACZ,gCAAgC;EAChC,4BAA4B;AAC9B;AACA;EACE,4BAA4B;EAC5B,iBAAiB;EACjB,YAAY;EACZ,+BAA+B;EAC/B,gCAAgC;AAClC;AACA;EACE,aAAa;EACb,iBAAiB;EACjB,gBAAgB;AAClB;AACA;EACE,gBAAgB;EAChB,YAAY;AACd","file":"Navb.vue","sourcesContent":[".navb {\n  grid-template-columns: 5% 45% 20% 10% 10% 10%;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  background-color: black;\n  color: wheat;\n  display: grid;\n  font-family: Roboto, sans-serif;\n  font-size: 3vh;\n  font-weight: bold;\n}\n.navb .home {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .home a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label .input {\n  font-family: Roboto, sans-serif;\n  font-size: 3vh;\n  font-weight: bold;\n  border-radius: 0 12px 12px 0;\n  background: black;\n  color: wheat;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 2.2vh;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: auto;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  border-radius: 0 18px 18px 0;\n  background: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n","\n<template>\n  <div class=\"navb\">    <!-- <i class=\"fas fa-home\"></i> -->\n    <div class=\"home\"><router-link :to=\"{ name:'Home'}\">Home</router-link></div>\n    <div class=\"search\"   @click=\"click('Search')\"  >\n      <label><input class=\"input\" placeholder=\"  Search\"  type=\"text\" size=\"16\"></label><!-- &#xF002; -->\n    </div>\n    <div class=\"contact\"  @click=\"click('Contact')\" ><i class=\"fas fa-user\"   ></i>Contact</div>\n    <div class=\"signon\"   @click=\"click('Signon')\"  ><i class=\"fas fa-sign-in\"></i>Sign On</div>\n    <div class=\"settings\"><i class=\"fas fa-cog\"  ></i><span>Settings</span>\n      <ul>\n        <li @click=\"click('Preferences')\">Preferences</li>\n        <li @click=\"click('Connection')\" >Connection</li>\n        <li @click=\"click('Privacy')\"    >Privacy</li>\n      </ul>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  export default {\n    data() {\n      return {} },\n    methods: {\n      click:  function( obj )  {\n        this.publish(  'Navb', obj    ); },\n      onNavb: function( obj )  {\n        console.log(  'Navb.onNavb()', obj ); } },\n    mounted: function () {\n      this.subscribe( 'Navb', 'Navb.vue', this.onNavb ) } };\n  \n</script>\n\n<style lang=\"less\">\n  \n  // top | right | bottom | left\n  \n  .grid1x5() { display:grid; grid-template-columns:5% 45% 20% 10% 10% 10%;\n    grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\"; }\n  \n  .navb {  .grid1x5(); background-color:black; color:wheat; display:grid;\n      font-family:Roboto, sans-serif; font-size:3vh; font-weight:bold;\n    .home     { grid-area:ghome;     justify-self:start; align-self:center;\n      a { color:wheat; text-decoration:none; }}\n    .search   { grid-area:gsearch;   justify-self:start; align-self:center; // font-family:FontAwesome, sans-serif;\n      label .input{ font-family:Roboto, sans-serif; font-size:3vh; font-weight:bold;\n        border-radius:0 12px 12px 0; background:black; color:wheat; } }\n    .contact  { grid-area:gcontact;  justify-self:start; align-self:center; }\n    .signon   { grid-area:gsignon;   justify-self:start; align-self:center; }\n    .settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;\n      ul { display:none; align-self:start; list-style:none; font-size:2.2vh; z-index:3; background:#222;\n        position:absolute; left:10px; top:12px; width:auto; height:auto;\n        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;\n        li { border-radius:0 18px 18px 0;  background:black; color:wheat;\n             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em; } } }\n    .settings:hover {\n      ul { display:grid; align-self:start; background:#444;\n        li:hover { background:#777; color:black; } } } }\n  \n</style>\n"]}, media: undefined });

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
    inject("data-v-4b01193a_0", { source: ".find {\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Find.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB","file":"Find.vue","sourcesContent":[".find {\n  background-color: #333;\n}\n"]}, media: undefined });

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


let Tocs = {
  
  data() { return { plane:'None', prac:'None',
      komps:{ Cube:{ name:'Cube', pracs:{} },
              Info:{ name:'Info', pracs:{} },
              Know:{ name:'Know', pracs:{} },
              Wise:{ name:'Wise', pracs:{} },
              Wood:{ name:'Wood', pracs:{} } } } },
  
  methods: {
    showPlane: function(plane) {
      this.plane =  plane;
      this.showPrac('All'); },
    showPrac: function(prac) {
      this.prac = prac;
      this.publish( this.plane, { prac:this.prac, disp:'All' } ); },
    showDisp: function(prac,disp) {
      this.publish( this.plane, { prac:prac,      disp:disp  } ); },
    doSelect: function(select) {
      this.publish( 'Select',   select ); },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; } },
  
  mounted: function () {
    for( let key in this.komps ) {
      if( this.komps.hasOwnProperty(key) && key !== 'Cube' && key !== 'Svga' && key !== 'Wood' ) {
        this.komps[key].pracs = this.pracs(key); } } } };

/* script */
const __vue_script__$3 = Tocs;

/* template */
var __vue_render__$3 = function() {
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
                "span",
                {
                  on: {
                    click: function($event) {
                      return _vm.showPlane(komp.name)
                    }
                  }
                },
                [
                  _c("router-link", { attrs: { to: { name: komp.name } } }, [
                    _vm._v(_vm._s(komp.name))
                  ])
                ],
                1
              ),
              _vm._v(" "),
              _vm.plane === komp.name
                ? _c(
                    "ul",
                    [
                      _vm._l(_vm.komps[komp.name].pracs, function(prac) {
                        return [
                          _c(
                            "li",
                            {
                              key: prac.name,
                              style: _vm.style(prac.hsv),
                              on: {
                                click: function($event) {
                                  return _vm.showPrac(prac.name)
                                }
                              }
                            },
                            [
                              _vm._v(_vm._s(prac.name) + "\n          "),
                              _c(
                                "ul",
                                [
                                  _vm._l(prac.disps, function(disp) {
                                    return [
                                      _c(
                                        "li",
                                        {
                                          key: disp.name,
                                          style: _vm.style(disp.hsv),
                                          attrs: { "data-dir": disp.dir },
                                          on: {
                                            click: function($event) {
                                              $event.stopPropagation();
                                              return _vm.showDisp(
                                                prac.name,
                                                disp.name
                                              )
                                            }
                                          }
                                        },
                                        [_vm._v(_vm._s(disp.name))]
                                      )
                                    ]
                                  })
                                ],
                                2
                              )
                            ]
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
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-30bbbc42_0", { source: ".tocs {\n  background-color: black;\n}\n.tocs ul {\n  padding: 0;\n  list-style: none;\n  align-self: start;\n  font-size: 3vh;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 2vh;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul {\n  font-size: 1.5vh;\n  margin-left: 1em;\n  display: none;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: white;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li:hover {\n  background-color: coral;\n  color: black;\n}\n.tocs ul li ul li:hover ul {\n  font-size: 1.5vh;\n  margin-left: 1em;\n  display: block;\n}\n.tocs ul li ul li:hover ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li:hover ul li:hover {\n  background-color: black!important;\n  color: white;\n}\n", map: {"version":3,"sources":["Tocs.vue","/Users/ax/Documents/prj/aug/vue/muse/Tocs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,UAAU;EACV,gBAAgB;EAChB,iBAAiB;EACjB,cAAc;EACd,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,oBAAoB;EACpB,iBAAiB;EACjB,4BAA4B;EAC5B,+BAA+B;AACjC;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,gBAAgB;EAChB,gBAAgB;EAChB,aAAa;AACf;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,gBAAgB;EAChB,gBAAgB;EAChB,cAAc;AAChB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;ACCjC;AACA;EACA,iCAAA;EACA,YAAA;AACA","file":"Tocs.vue","sourcesContent":[".tocs {\n  background-color: black;\n}\n.tocs ul {\n  padding: 0;\n  list-style: none;\n  align-self: start;\n  font-size: 3vh;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 2vh;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul {\n  font-size: 1.5vh;\n  margin-left: 1em;\n  display: none;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: white;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li:hover {\n  background-color: coral;\n  color: black;\n}\n.tocs ul li ul li:hover ul {\n  font-size: 1.5vh;\n  margin-left: 1em;\n  display: block;\n}\n.tocs ul li ul li:hover ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li:hover ul li:hover {\n  background-color: black!important;\n  color: white;\n}\n","\n<template><div class=\"tocs\">\n  <ul><template v-for=\"komp in komps\">\n    <li :key=\"komp.name\"><span v-on:click=\"showPlane(komp.name)\">\n      <router-link :to=\"{ name:komp.name }\">{{komp.name}}</router-link></span>\n      <ul  v-if=\"plane===komp.name\"><template v-for=\"prac in komps[komp.name].pracs\" >\n        <li v-on:click=\"showPrac(prac.name)\" :style=\"style(prac.hsv)\" :key=\"prac.name\">{{prac.name}}\n          <ul><template v-for=\"disp in prac.disps\">\n            <li v-on:click.stop=\"showDisp(prac.name,disp.name)\" :style=\"style(disp.hsv)\" :key=\"disp.name\"\n              :data-dir=\"disp.dir\">{{disp.name}}</li>\n          </template></ul>\n        </li>\n      </template></ul>\n    </li>\n  </template></ul>\n</div></template>\n\n<script type=\"module\">\n  \n  let Tocs = {\n    \n    data() { return { plane:'None', prac:'None',\n        komps:{ Cube:{ name:'Cube', pracs:{} },\n                Info:{ name:'Info', pracs:{} },\n                Know:{ name:'Know', pracs:{} },\n                Wise:{ name:'Wise', pracs:{} },\n                Wood:{ name:'Wood', pracs:{} } } } },\n    \n    methods: {\n      showPlane: function(plane) {\n        this.plane =  plane;\n        this.showPrac('All'); },\n      showPrac: function(prac) {\n        this.prac = prac;\n        this.publish( this.plane, { prac:this.prac, disp:'All' } ); },\n      showDisp: function(prac,disp) {\n        this.publish( this.plane, { prac:prac,      disp:disp  } ); },\n      doSelect: function(select) {\n        this.publish( 'Select',   select ); },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; } },\n    \n    mounted: function () {\n      for( let key in this.komps ) {\n        if( this.komps.hasOwnProperty(key) && key !== 'Cube' && key !== 'Svga' && key !== 'Wood' ) {\n          this.komps[key].pracs = this.pracs(key); } } } };\n  \n   export default Tocs;\n   \n</script>\n\n<style lang=\"less\">\n  .tocs { background-color:black;\n    ul { padding:0; list-style:none; align-self:start; font-size:3vh; display:grid;\n      li  { background-color:#333; padding-left:0.25em; align-self:start;                            // Comp\n            border-radius:0 24px 24px 0; margin:0.2em 0.2em 0.2em 0.2em;\n         a  { color:wheat; text-decoration:none; }\n         ul { font-size:2vh;\n           li { border-radius:0 12px 12px 0; color:black; margin:0.2em 0.2em 0.2em 0.2em;            // Prac\n             ul { font-size:1.5vh; margin-left:1em; display:none;\n               li { border-radius:0 12px 12px 0; color:white; margin:0.2em 0.2em 0.2em 0.2em; } } }  // Disp\n           li:hover { background-color:coral; color:black;                                           // Prac :hover\n             ul { font-size:1.5vh; margin-left:1em; display:block;\n               li { border-radius:0 12px 12px 0;  color:black; margin:0.2em 0.2em 0.2em 0.2em; }     // Disp :hover\n               li:hover { background-color:black!important; color:white; }\n           } } } } }\n  }\n  \n</style>\n"]}, media: undefined });

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
//
//
//


var script$3 = {
  
  methods:{
    show:function() {
      return this.$route.name===null } } };

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
      _c("router-view", { attrs: { name: "Home" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Cube" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Info" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Know" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Wise" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Wood" } })
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-1ebadcda_0", { source: ".banner {\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n", map: {"version":3,"sources":["View.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;EACvB,YAAY;AACd","file":"View.vue","sourcesContent":[".banner {\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var View = normalizeComponent_1(
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
    inject("data-v-48f77378_0", { source: ".side {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Side.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Side.vue","sourcesContent":[".side {\n  background-color: black;\n}\n"]}, media: undefined });

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
    inject("data-v-d140e9be_0", { source: ".pref {\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Pref.vue"],"names":[],"mappings":"AAAA;EACE,sBAAsB;AACxB","file":"Pref.vue","sourcesContent":[".pref {\n  background-color: #333;\n}\n"]}, media: undefined });

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
    inject("data-v-7573ed31_0", { source: ".foot {\n  background-color: black;\n}\n", map: {"version":3,"sources":["Foot.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB","file":"Foot.vue","sourcesContent":[".foot {\n  background-color: black;\n}\n"]}, media: undefined });

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
    inject("data-v-27b0e242_0", { source: "\n.trak { background-color:#333;\n}\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/vue/dash/Trak.vue"],"names":[],"mappings":";AAUA,QAAA,qBAAA;AAAA","file":"Trak.vue","sourcesContent":["\n<template>\n  <div class=\"trak\"></div>\n</template>\n\n<script>\n  export default {}\n</script>\n\n<style type=\"module\">\n     .trak { background-color:#333; }\n</style>\n"]}, media: undefined });

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
//
//
//
//
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
  return _vm._m(0)
};
var __vue_staticRenderFns__$9 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "home" }, [
      _c("div", [
        _c("h1", [_vm._v("Welcome to Augmentation Home Page")]),
        _vm._v(" "),
        _c("h2", [_vm._v("Choose an Application Component on the Left")])
      ])
    ])
  }
];
__vue_render__$9._withStripped = true;

  /* style */
  const __vue_inject_styles__$9 = function (inject) {
    if (!inject) return
    inject("data-v-0a63ac6e_0", { source: ".home {\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n", map: {"version":3,"sources":["Home.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;EACvB,YAAY;AACd","file":"Home.vue","sourcesContent":[".home {\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$9 = undefined;
  /* module identifier */
  const __vue_module_identifier__$9 = undefined;
  /* functional template */
  const __vue_is_functional_template__$9 = false;
  /* style inject SSR */
  

  
  var Home = normalizeComponent_1(
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


var script$9 = {
  
  data() {
    return { comp:'None', prac:'All', disp:'All', practices:{}, baseCols:{},
      rows:{ Learn:{ name:'Learn', dir:'le' },
             Do:{    name:'Do',    dir:'do' },
             Share:{ name:'Share', dir:'sh' } } } },
  
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.prac==='All' },
    isDisp: function (disp) {
      return this.disp===disp || this.disp==='All' },
    isRows: function () {
      return this.prac==='All' },
    onPrac: function (prac) {
      this.prac = prac; this.disp = 'All'; },
    onDisp: function (prac,disp) {
      this.prac = prac; this.disp= disp; },
    pracClass: function(dir) {
      return this.prac==='All' ? dir : 'fullPrac'; },
    dispClass: function(dir) {
      return this.disp==='All' ? dir : 'fullDisp'; },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; } },

  mounted: function () {
    this.practices = this.pracs(this.comp,'Cols');
    this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
       if( obj.disp==='All' ) { this.onPrac(obj.prac); }
       else                   { this.onDisp(obj.prac,obj.disp); } } ); } };

/* script */
const __vue_script__$a = script$9;

/* template */
var __vue_render__$a = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "comp" },
    [
      _vm._l(_vm.practices, function(prac) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isPrac(prac.name),
                  expression: "isPrac(prac.name)"
                }
              ],
              key: prac.name,
              class: _vm.pracClass(prac.dir)
            },
            [
              _c(
                "div",
                { staticClass: "prac" },
                [
                  _c(
                    "div",
                    {
                      directives: [
                        {
                          name: "show",
                          rawName: "v-show",
                          value: _vm.isDisp(prac.name),
                          expression: "isDisp(prac.name)"
                        }
                      ],
                      class: _vm.dispClass("cen"),
                      style: _vm.style(prac.hsv),
                      attrs: { "data-dir": "cen" }
                    },
                    [
                      _c("div", { staticClass: "disp" }, [
                        _vm._v(_vm._s(prac.name))
                      ])
                    ]
                  ),
                  _vm._v(" "),
                  _vm._l(prac.disps, function(disp) {
                    return [
                      _c(
                        "div",
                        {
                          directives: [
                            {
                              name: "show",
                              rawName: "v-show",
                              value: _vm.isDisp(disp.name),
                              expression: "isDisp(disp.name)"
                            }
                          ],
                          class: _vm.dispClass(disp.dir),
                          style: _vm.style(disp.hsv),
                          attrs: { "data-dir": disp.dir }
                        },
                        [
                          _c("div", { staticClass: "disp" }, [
                            _vm._v(_vm._s(disp.name))
                          ])
                        ]
                      )
                    ]
                  })
                ],
                2
              )
            ]
          )
        ]
      }),
      _vm._v(" "),
      _vm._l(_vm.rows, function(row) {
        return [
          _c(
            "div",
            {
              directives: [
                {
                  name: "show",
                  rawName: "v-show",
                  value: _vm.isRows(),
                  expression: "isRows()"
                }
              ],
              key: row.name,
              class: row.dir
            },
            [
              _c("div", { staticClass: "row" }, [
                _c("div", [_vm._v(_vm._s(row.name))])
              ])
            ]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-b49b7360_0", { source: ".comp {\n  background-color: black;\n  position: relative;\n  display: grid;\n  grid-template-columns: 7% 31% 31% 31%;\n  grid-template-rows: 13% 29% 29% 29%;\n  grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n  /* The 9 Practices Grid\n  .grid3x3(); justify-items:center; align-items:center;\n    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   } */\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2.5vh;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 33% 33% 34%;\n  grid-template-rows: 33% 33% 34%;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 3vh;\n}\n.comp .prac div .disp {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 2.1vh;\n}\n.comp .fullPrac {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPrac .prac {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.comp .fullPrac div .disp {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 2em;\n}\n.comp .fullDisp {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDisp .disp {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 2em;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.5vh;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 2em;\n  color: wheat;\n}\n", map: {"version":3,"sources":["Base.vue","/Users/ax/Documents/prj/aug/vue/muse/Base.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,kBAAkB;EAClB,aAAa;EACb,qCAAqC;EACrC,mCAAmC;EACnC,uFAAuF;EACvF,qBAAqB;EACrB,mBAAmB;EACnB;;;;4EAI0E;AAC5E;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;ECCrB,qBAAA;EACA,mBAAA;ADCA;ACCA;EACA,aAAA;EDCE,gBAAgB;ECClB,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;ADCA;ACCA;EACA,aAAA;EDCE,aAAa;ECCf,qBAAA;EDCE,mBAAmB;ECCrB,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EACA,aAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EDCE,cAAc;ECChB,qBAAA;EDCE,mBAAmB;ECCrB,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EDCE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,qBAAA;EDCE,mBAAmB;ACCrB;AACA;EACA,aAAA;EACA,aAAA;EDCE,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,UAAU;EACV,WAAW;EACX,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;EACb,kCAAkC;EAClC,+BAA+B;EAC/B,gEAAgE;AAClE;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;;;EAGE,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,gBAAgB;EAChB,WAAW;EACX,YAAY;EACZ,sBAAsB;EACtB,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,cAAc;AAChB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,cAAc;EACd,YAAY;AACd","file":"Base.vue","sourcesContent":[".comp {\n  background-color: black;\n  position: relative;\n  display: grid;\n  grid-template-columns: 7% 31% 31% 31%;\n  grid-template-rows: 13% 29% 29% 29%;\n  grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n  /* The 9 Practices Grid\n  .grid3x3(); justify-items:center; align-items:center;\n    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   } */\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 2.5vh;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 33% 33% 34%;\n  grid-template-rows: 33% 33% 34%;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 3vh;\n}\n.comp .prac div .disp {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 2.1vh;\n}\n.comp .fullPrac {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPrac .prac {\n  font-size: 1.5em;\n  width: 100%;\n  height: 100%;\n  background-color: #603;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.comp .fullPrac div .disp {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 2em;\n}\n.comp .fullDisp {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDisp .disp {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 2em;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1.5vh;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 2em;\n  color: wheat;\n}\n","\n<template>\n  <div class=\"comp\">\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" :class=\"pracClass(prac.dir)\" :key=\"prac.name\">\n        <div class=\"prac\">\n          <div     v-show=\"isDisp(prac.name)\" :class=\"dispClass('cen')\"    :style=\"style(prac.hsv)\" data-dir=\"cen\">\n            <div class=\"disp\">{{prac.name}}</div></div>\n          <template v-for=\"disp in prac.disps\">\n              <div v-show=\"isDisp(disp.name)\" :class=\"dispClass(disp.dir)\" :style=\"style(disp.hsv)\" :data-dir=\"disp.dir\">\n                <div class=\"disp\">{{disp.name}}</div></div>\n          </template>\n        </div>\n      </div>\n    </template>\n    <template v-for=\"row in rows\">\n      <div v-show=\"isRows()\" :class=\"row.dir\" :key=\"row.name\"><div class=\"row\">\n        <div>{{row.name}}</div></div></div>\n    </template>\n  </div>  \n</template>\n\n<script type=\"module\">\n\n  export default {\n    \n    data() {\n      return { comp:'None', prac:'All', disp:'All', practices:{}, baseCols:{},\n        rows:{ Learn:{ name:'Learn', dir:'le' },\n               Do:{    name:'Do',    dir:'do' },\n               Share:{ name:'Share', dir:'sh' } } } },\n    \n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      isDisp: function (disp) {\n        return this.disp===disp || this.disp==='All' },\n      isRows: function () {\n        return this.prac==='All' },\n      onPrac: function (prac) {\n        this.prac = prac; this.disp = 'All'; },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp= disp; },\n      pracClass: function(dir) {\n        return this.prac==='All' ? dir : 'fullPrac'; },\n      dispClass: function(dir) {\n        return this.disp==='All' ? dir : 'fullDisp'; },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; } },\n\n    mounted: function () {\n      this.practices = this.pracs(this.comp,'Cols');\n      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {\n         if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n         else                   { this.onDisp(obj.prac,obj.disp); } } ); } }\n         \n</script>\n\n<style lang=\"less\">\n\n.grid3x3() { display:grid; grid-template-columns:33% 33% 34%; grid-template-rows:33% 33% 34%;\n             grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\"; }\n\n.grid4x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:13% 29% 29% 29%;\n  grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n.pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n                justify-items:center; align-items:center; }\n\n.ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }\n\n.bgc( @bg )\n  { background-color:@bg; }\n\n.comp { background-color:black; position:relative;\n  \n  // The 4x4 Dim + Per + 9 Practices Grid\n  .grid4x4(); justify-items:center; align-items:center;\n    .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }\n    .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n    .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n    .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n\n  /* The 9 Practices Grid\n  .grid3x3(); justify-items:center; align-items:center;\n    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   } */\n\n  // Placed one level below the 9 Practices Grid\n  .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:2.5vh; font-weight:bold;\n    .grid3x3(); // The 4 Displine plus Practiice name Grid\n                           .north { .ddir(north); }\n    .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }\n                           .south { .ddir(south); }\n    .cen   { font-size:3vh; }\n     div .disp { text-align:center; justify-self:center;  align-self:center; } }\n  \n  .em, .in, .en { .prac .cen { font-size:2.1vh; } }\n\n  // Placed one level above .prac at the 9 Practices Grid level\n  .fullPrac { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n    .prac { font-size:1.5em; width:100%; height:100%; background-color:#603;\n            justify-self:center; align-self:center; display:grid; border-radius:0.5em; }\n     div .disp { text-align:center; justify-self:center;  align-self:center; font-size:2em; } }\n\n  // Placed one level below .prac at the 4 Disipline plus Practice name Grid\n  .fullDisp { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n     .disp  { text-align:center; justify-self:center;  align-self:center; font-size:2em; } }\n  \n  .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:1.5vh;\n         font-weight:bold; display:grid;\n    div { text-align:center; justify-self:center;  align-self:center; font-size:2em; color:wheat; } }\n}\n\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject SSR */
  

  
  var Base = normalizeComponent_1(
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

var script$a = {
  extends: Base,
  beforeMount: function() {
    this.comp = 'Info'; } };

/* script */
const __vue_script__$b = script$a;

/* template */

  /* style */
  const __vue_inject_styles__$b = undefined;
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Info = normalizeComponent_1(
    {},
    __vue_inject_styles__$b,
    __vue_script__$b,
    __vue_scope_id__$b,
    __vue_is_functional_template__$b,
    __vue_module_identifier__$b,
    undefined,
    undefined
  );

//

var script$b = {
  extends: Base,
  beforeMount: function() {
    this.comp = 'Know'; } };

/* script */
const __vue_script__$c = script$b;

/* template */

  /* style */
  const __vue_inject_styles__$c = undefined;
  /* scoped */
  const __vue_scope_id__$c = undefined;
  /* module identifier */
  const __vue_module_identifier__$c = undefined;
  /* functional template */
  const __vue_is_functional_template__$c = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Know = normalizeComponent_1(
    {},
    __vue_inject_styles__$c,
    __vue_script__$c,
    __vue_scope_id__$c,
    __vue_is_functional_template__$c,
    __vue_module_identifier__$c,
    undefined,
    undefined
  );

//

var script$c = {
  extends: Base,
  beforeMount: function() {
    this.comp = 'Wise'; } };

/* script */
const __vue_script__$d = script$c;

/* template */

  /* style */
  const __vue_inject_styles__$d = undefined;
  /* scoped */
  const __vue_scope_id__$d = undefined;
  /* module identifier */
  const __vue_module_identifier__$d = undefined;
  /* functional template */
  const __vue_is_functional_template__$d = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Wise = normalizeComponent_1(
    {},
    __vue_inject_styles__$d,
    __vue_script__$d,
    __vue_scope_id__$d,
    __vue_is_functional_template__$d,
    __vue_module_identifier__$d,
    undefined,
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

var script$d = {

};

/* script */
const __vue_script__$e = script$d;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "wood" }, [
    _c(
      "svg",
      {
        staticClass: "moon",
        attrs: {
          xmlns: "http://www.w3.org/2000/svg",
          viewBox: "0 0 100 100",
          width: "100",
          height: "100"
        }
      },
      [_c("circle", { attrs: { r: "30", fill: "#fff", cx: "70", cy: "70" } })]
    ),
    _vm._v(" "),
    _c("div", { staticClass: "back ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "mid ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "frontmid ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "front ground" }),
    _vm._v(" "),
    _c("div", { staticClass: "horseman" })
  ])
};
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;

  /* style */
  const __vue_inject_styles__$e = function (inject) {
    if (!inject) return
    inject("data-v-f7ac66e8_0", { source: "\n.wood {\n  position:relative; width: 100%; height: 100%;\n  min-height: 700px;\n  background-color: #041e2b;\n  background-image: linear-gradient(to bottom, #041e2b 0%, #407886 41%, #d4dbdb 69%, black 69%, black 100%);\n}\n.wood .moon {  position: absolute; left: 25%; top: 100px;\n}\n.wood .horseman {\n    position: absolute; left: 50%; top: 400px; width: 184px; height: 123px;\n    background: url(\"../anim/wood/svg/horse-hallow5.svg\");\n    animation: horsemove 0.7s steps(15) infinite;\n    margin-left: -100px;\n}\n.wood .ground {\n    position: absolute; left: 0; top:100px; width:151%; height:697px;\n    background-size: 800px, 716px; /*100px *800px 716px; */\n    transform: translateZ(0);\n    backface-visibility: hidden;\n    perspective: 1000px;\n}\n.wood .front {\n    background: url(\"../anim/wood/svg/hallowfront4.svg\") repeat-x;\n    background-size: 1000px 871px; /*1000px 871px; */\n    top: 0;\n    animation: bk 20s -5s linear infinite;\n}\n.wood .frontmid {\n    background: url(\"../anim/wood/svg/hallowmidfront2.svg\") repeat-x;\n    background-size: 1000px 871px; /*background-size: 1000px 871px;*/\n    top: 0;\n    animation: bk 50s -5s linear infinite;\n}\n.wood .mid {\n    background: url(\"../anim/wood/svg/hallowmid2.svg\") repeat-x;\n    background-size: 1000px 871px; /* background-size: 1000px 871px;*/\n    top: 0;\n    animation: bk 100s -5s linear infinite;\n}\n.wood .back {\n    background: url(\"../anim/wood/svg/hallowback2.svg\") repeat-x;\n    background-size: 1000px 871px; /* background-size: 1000px 871px; */\n    top: 0;\n    animation: bk 100s -5s linear infinite;\n}\n@keyframes horsemove {\n100% {\n      background-position: 0 -1848px;\n}\n}\n@keyframes bk {\n100% {\n      background-position: -200% 0;\n}\n}\n  \n\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/app/anim/wood/Wood.vue"],"names":[],"mappings":";AAuBA;EACA,iBAAA,EAAA,WAAA,EAAA,YAAA;EACA,iBAAA;EACA,yBAAA;EACA,yGAAA;AAAA;AAEA,eAAA,kBAAA,EAAA,SAAA,EAAA,UAAA;AAAA;AAEA;IACA,kBAAA,EAAA,SAAA,EAAA,UAAA,EAAA,YAAA,EAAA,aAAA;IACA,qDAAA;IACA,4CAAA;IACA,mBAAA;AAAA;AAEA;IACA,kBAAA,EAAA,OAAA,EAAA,SAAA,EAAA,UAAA,EAAA,YAAA;IACA,6BAAA,EAAA,uBAAA;IACA,wBAAA;IACA,2BAAA;IACA,mBAAA;AAAA;AAEA;IACA,6DAAA;IACA,6BAAA,EAAA,iBAAA;IACA,MAAA;IACA,qCAAA;AAAA;AAEA;IACA,gEAAA;IACA,6BAAA,EAAA,iCAAA;IACA,MAAA;IACA,qCAAA;AAAA;AAEA;IACA,2DAAA;IACA,6BAAA,EAAA,kCAAA;IACA,MAAA;IACA,sCAAA;AAAA;AAEA;IACA,4DAAA;IACA,6BAAA,EAAA,mCAAA;IACA,MAAA;IACA,sCAAA;AAAA;AAEA;AACA;MACA,8BAAA;AAAA;AAAA;AAEA;AACA;MACA,4BAAA;AAAA;AAAA","file":"Wood.vue","sourcesContent":["\n<template>\n  <div class=\"wood\">\n    <svg class=\"moon\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\" width=\"100\" height=\"100\">\n      <circle r=\"30\" fill=\"#fff\" cx=\"70\" cy=\"70\" ></circle>\n    </svg>\n    <div class=\"back ground\"></div>\n    <div class=\"mid ground\"></div>\n    <div class=\"frontmid ground\"></div>\n    <div class=\"front ground\"></div>\n    <div class=\"horseman\"></div>\n  </div>\n</template>\n\n<script>\n  export default {\n  \n  };\n\n</script>\n\n<style>\n  \n.wood {\n  position:relative; width: 100%; height: 100%;\n  min-height: 700px;\n  background-color: #041e2b;\n  background-image: linear-gradient(to bottom, #041e2b 0%, #407886 41%, #d4dbdb 69%, black 69%, black 100%); }\n\n  .wood .moon {  position: absolute; left: 25%; top: 100px; }\n\n  .wood .horseman {\n    position: absolute; left: 50%; top: 400px; width: 184px; height: 123px;\n    background: url(\"../anim/wood/svg/horse-hallow5.svg\");\n    animation: horsemove 0.7s steps(15) infinite;\n    margin-left: -100px; }\n\n  .wood .ground {\n    position: absolute; left: 0; top:100px; width:151%; height:697px;\n    background-size: 800px, 716px; /*100px *800px 716px; */\n    transform: translateZ(0);\n    backface-visibility: hidden;\n    perspective: 1000px; }\n\n.wood .front {\n    background: url(\"../anim/wood/svg/hallowfront4.svg\") repeat-x;\n    background-size: 1000px 871px; /*1000px 871px; */\n    top: 0;\n    animation: bk 20s -5s linear infinite; }\n\n.wood .frontmid {\n    background: url(\"../anim/wood/svg/hallowmidfront2.svg\") repeat-x;\n    background-size: 1000px 871px; /*background-size: 1000px 871px;*/\n    top: 0;\n    animation: bk 50s -5s linear infinite; }\n\n.wood .mid {\n    background: url(\"../anim/wood/svg/hallowmid2.svg\") repeat-x;\n    background-size: 1000px 871px; /* background-size: 1000px 871px;*/\n    top: 0;\n    animation: bk 100s -5s linear infinite; }\n\n.wood .back {\n    background: url(\"../anim/wood/svg/hallowback2.svg\") repeat-x;\n    background-size: 1000px 871px; /* background-size: 1000px 871px; */\n    top: 0;\n    animation: bk 100s -5s linear infinite; }\n  \n  @keyframes horsemove {\n    100% {\n      background-position: 0 -1848px; } }\n  \n  @keyframes bk {\n    100% {\n      background-position: -200% 0; } }\n  \n\n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$e = undefined;
  /* module identifier */
  const __vue_module_identifier__$e = undefined;
  /* functional template */
  const __vue_is_functional_template__$e = false;
  /* style inject SSR */
  

  
  var Wood = normalizeComponent_1(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
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

  Dash.Home = Home;
  Dash.Info = Info;
  Dash.Know = Know;
  Dash.Wise = Wise;
//Dash.Cube = Cube;
  Dash.Wood = Wood;

/* script */
const __vue_script__$f = Dash;

/* template */
var __vue_render__$c = function() {
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
var __vue_staticRenderFns__$c = [];
__vue_render__$c._withStripped = true;

  /* style */
  const __vue_inject_styles__$f = function (inject) {
    if (!inject) return
    inject("data-v-1ce06c50_0", { source: ".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/muse/Dash.vue"],"names":[],"mappings":"AAAA;EACE,+BAA+B;EAC/B,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,qCAAqC;EACrC,iCAAiC;EACjC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EDCE,aAAa;ACCf","file":"Dash.vue","sourcesContent":[".dash {\n  font-family: Roboto, sans-serif;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 140px 1fr 50px;\n  grid-template-rows: 50px 1fr 50px;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from '../dash/Logo.vue';\n  import Navb from '../dash/Navb.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n\n  \n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n\n  // Static imports for minimizing build steps in dev.\n  import Home from './Home.vue';\n  import Info from './Info.vue';\n  import Know from './Know.vue';\n  import Wise from './Wise.vue';\n//import Cube from './Cube.vue';\n  import Wood from '../../app/anim/wood/Wood.vue';\n\n  Dash.Home = Home;\n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n//Dash.Cube = Cube;\n  Dash.Wood = Wood;\n \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n\n   .dash { font-family:Roboto, sans-serif;\n     position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n     grid-template-columns: 140px 1fr 50px;\n     grid-template-rows:     50px 1fr 50px;\n     grid-template-areas:\n       \"logo navb find\"\n       \"tocs view side\"\n       \"pref foot trak\";\n\n    #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }\n    #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }\n    #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }\n    #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; }\n    #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }\n    #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }\n    #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }\n    #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }\n    #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }\n  \n</style>\n\n<!--script type=\"module\">\n\n  import Logo from '../dash/Logo.vue';\n  import Navb from '../dash/Navb.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n\n\n  let Dash = {\n    name: 'dash',\n    components: {\n      'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n      'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n      'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n\n  // Static imports for minimizing build steps in dev.\n\n  import Info from './Info.vue';\n  import Know from './Know.vue';\n  import Wise from './Wise.vue';\n  //import Cube from './Cube.vue';\n  import Svga from '../../app/demo/Svga.vue';\n\n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n  //Dash.Cube = Cube;\n  Dash.Svga = Svga;\n\n  export default Dash;\n\n</script-->\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$f = undefined;
  /* module identifier */
  const __vue_module_identifier__$f = undefined;
  /* functional template */
  const __vue_is_functional_template__$f = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
    browser,
    undefined
  );

export default Dash$1;
