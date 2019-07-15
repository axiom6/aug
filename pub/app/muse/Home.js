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
    inject("data-v-67c2686b_0", { source: ".logo img {\n  width: 140px;\n  height: 50px;\n}\n", map: {"version":3,"sources":["Logo.vue"],"names":[],"mappings":"AAAA;EACE,YAAY;EACZ,YAAY;AACd","file":"Logo.vue","sourcesContent":[".logo img {\n  width: 140px;\n  height: 50px;\n}\n"]}, media: undefined });

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
      { staticClass: "navh" },
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
      [
        _c("label", { attrs: { for: "search" } }, [_vm._v("Search")]),
        _vm._v(" "),
        _c("i", { staticClass: "fas fa-search" }),
        _vm._v(" "),
        _c("input", {
          staticClass: "input",
          attrs: {
            placeholder: " Search",
            id: "search",
            type: "text",
            size: "16"
          }
        })
      ]
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
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-20503b3f_0", { source: ".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.navb {\n  grid-template-columns: 5% 40% 25% 10% 10% 10%;\n  grid-template-rows: 6vh;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  display: grid;\n  background: black;\n  color: wheat;\n  font-family: Roboto, sans-serif;\n  font-size: 1.4vw;\n  font-weight: bold;\n}\n.navb .navh {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .navh i {\n  margin-right: 0.3em;\n}\n.navb .navh a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label {\n  color: black;\n}\n.navb .search .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: wheat;\n  color: black;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7em;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background-color: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.navb .settings ul li span {\n  display: inline-block;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.navb div i {\n  margin-right: 0.3em;\n}\n", map: {"version":3,"sources":["Navb.vue","/Users/ax/Documents/prj/aug/vue/dash/Navb.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,6CAA6C;EAC7C,uBAAuB;EACvB,qEAAqE;EACrE,aAAa;EACb,iBAAiB;EACjB,YAAY;EACZ,+BAA+B;EAC/B,gBAAgB;EAChB,iBAAiB;AACnB;ACCA;EDCE,gBAAgB;ECClB,mBAAA;EACA,kBAAA;ADCA;ACCA;EACA,mBAAA;AACA;AACA;EACA,YAAA;EACA,qBAAA;AACA;AACA;EACA,kBAAA;EACA,mBAAA;EACA,kBAAA;AACA;AACA;EACA,YAAA;AACA;AACA;EACA,+BAAA;EACA,iBAAA;EACA,gBAAA;EACA,4BAAA;EACA,iBAAA;EACA,YAAA;AACA;ADCA;EACE,mBAAmB;EACnB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,oBAAoB;EACpB,mBAAmB;EACnB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,aAAa;EACb,iBAAiB;EACjB,gBAAgB;EAChB,gBAAgB;EAChB,UAAU;EACV,gBAAgB;EAChB,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,YAAY;EACZ,YAAY;EACZ,gCAAgC;EAChC,4BAA4B;AAC9B;AACA;EACE,eAAe;EACf,4BAA4B;EAC5B,uBAAuB;EACvB,YAAY;EACZ,+BAA+B;EAC/B,gCAAgC;AAClC;AACA;EACE,qBAAqB;EACrB,oBAAoB;AACtB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,iBAAiB;EACjB,gBAAgB;AAClB;AACA;EACE,gBAAgB;EAChB,YAAY;AACd;AACA;EACE,mBAAmB;AACrB","file":"Navb.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.navb {\n  grid-template-columns: 5% 40% 25% 10% 10% 10%;\n  grid-template-rows: 6vh;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  display: grid;\n  background: black;\n  color: wheat;\n  font-family: Roboto, sans-serif;\n  font-size: 1.4vw;\n  font-weight: bold;\n}\n.navb .navh {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .navh i {\n  margin-right: 0.3em;\n}\n.navb .navh a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label {\n  color: black;\n}\n.navb .search .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: wheat;\n  color: black;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7em;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background-color: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.navb .settings ul li span {\n  display: inline-block;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.navb div i {\n  margin-right: 0.3em;\n}\n","\n<template>\n  <div class=\"navb\">    <!-- <i class=\"fas fa-home\"></i> -->\n    <div class=\"navh\"><router-link :to=\"{ name:'Home'}\"><i class=\"fas fa-home\"></i>Home</router-link></div>\n    <div class=\"search\"   @click=\"click('Search')\">\n      <label for=\"search\">Search</label>\n      <i class=\"fas fa-search\"></i>\n      <input class=\"input\" placeholder=\" Search\" id=\"search\" type=\"text\" size=\"16\">\n    </div>\n    <div class=\"contact\"  @click=\"click('Contact')\" ><i class=\"fas fa-user\"       ></i>Contact</div>\n    <div class=\"signon\"   @click=\"click('Signon')\"  ><i class=\"fas fa-sign-in-alt\"></i>Sign On</div>\n    <div class=\"settings\"><i class=\"fas fa-cog\"></i><span>Settings</span>\n      <ul>\n        <li @click=\"click('Preferences')\"><i class=\"fas fa-cog\"></i><span>Preferences</span></li>\n        <li @click=\"click('Connection')\" ><i class=\"fas fa-cog\"></i><span>Connection</span></li>\n        <li @click=\"click('Privacy')\"    ><i class=\"fas fa-cog\"></i><span>Privacy</span></li>\n      </ul>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  export default {\n    data() {\n      return {} },\n    methods: {\n      click:  function( obj )  {\n        this.publish(  'Navb', obj    ); },\n      onNavb: function( obj )  {\n        console.log(  'Navb.onNavb()', obj ); } },\n    mounted: function () {\n      this.subscribe( 'Navb', 'Navb.vue', this.onNavb ) } };\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .grid1x5() { display:grid; grid-template-columns:5% 40% 25% 10% 10% 10%; grid-template-rows:@theme-north;\n    grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\"; }\n  \n  .navb {  .grid1x5(); display:grid; background:@theme-back; color:@theme-color;\n    font-family:@theme-font-family; font-size:1.4vw; font-weight:bold;    // Using because Navb sensistive to width\n    .navh     { grid-area:ghome;     justify-self:start; align-self:center;\n      i { margin-right:0.3em; }\n      a { color:@theme-color; text-decoration:none; }}\n    .search   { grid-area:gsearch;   justify-self:start; align-self:center;\n      label { color:@theme-back; }\n      .input{ font-family:@theme-font-family; font-weight:bold;  font-size:0.9em;\n        border-radius:0 12px 12px 0; background:@theme-color; color:@theme-back; } }\n    .contact  { grid-area:gcontact;  justify-self:start; align-self:center; }\n    .signon   { grid-area:gsignon;   justify-self:start; align-self:center; }\n    .settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;\n      ul { display:none; align-self:start; list-style:none; font-size:0.7em; z-index:3; background:@theme-back-navb-menu;\n        position:absolute; left:10px; top:12px; width:200px; height:auto;\n        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;\n        li { display:inline; border-radius:0 18px 18px 0;  background-color:@theme-back; color:@theme-color;\n             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em;\n          i {    display:inline-block; margin-right:0.25em; }\n          span { display:inline-block; } } } }\n    .settings:hover {\n      ul { display:grid; align-self:start; background:@theme-back-navb-item;\n        li:hover { background:@theme-back-navb-item-hover; color:@theme-color-navb-item-hover; } } }\n     div i { margin-right:0.3em; } }\n  \n</style>\n"]}, media: undefined });

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
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Find = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
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
var __vue_staticRenderFns__$3 = [];
__vue_render__$3._withStripped = true;

  /* style */
  const __vue_inject_styles__$3 = function (inject) {
    if (!inject) return
    inject("data-v-52f25f14_0", { source: ".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.tocs {\n  font-size: 3vh;\n  font-family: Roboto, sans-serif;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n", map: {"version":3,"sources":["Tocs.vue","/Users/ax/Documents/prj/aug/vue/dash/Tocs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,cAAc;EACd,+BAA+B;AACjC;AACA;EACE,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,oBAAoB;EACpB,iBAAiB;EACjB,4BAA4B;EAC5B,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,gBAAgB;EAChB,iBAAiB;EACjB,UAAU;EACV,SAAS;AACX;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;AACd;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,mBAAmB;AACrB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;ECCA,oBAAA;ADCA;ACCA;EACA,kCAAA;EACA,uBAAA;AACA","file":"Tocs.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.tocs {\n  font-size: 3vh;\n  font-family: Roboto, sans-serif;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li a {\n  color: black;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black !important;\n  color: white !important;\n}\n","\n<template><div class=\"tocs\">\n  <ul>\n    <template v-for=\"komp in komps\">\n    <li :key=\"komp.name\">\n      <div   v-on:click=\"pubComp(komp.name)\">\n        <router-link :to=\"{ name:komp.comp }\"><i :class=\"komp.icon\"></i>{{komp.name}}</router-link>\n      </div>\n      <ul  v-if=\"comp===komp.name\"><template v-for=\"prac in komps[komp.name].pracs\" >\n        <li v-on:click=\"pubPrac(prac.name)\" :style=\"stylePrac(prac.name,prac.hsv)\" :key=\"prac.name\">\n          <i :class=\"prac.icon\"></i>\n          <router-link v-if=\" komp.link\" :to=\"{ name:prac.name }\">{{prac.name}}</router-link>\n          <span        v-if=\"!komp.link\">{{prac.name}}</span>\n          <ul v-show=\"isPrac(prac.name)\"><template v-for=\"disp in prac.disps\">\n            <li v-on:click.stop=\"pubDisp(prac.name,disp.name)\" :style=\"styleDisp(disp.name,disp.hsv)\" :key=\"disp.name\">\n              <i :class=\"disp.icon\"></i>{{disp.name}}</li>\n          </template></ul>\n        </li>\n      </template></ul>\n    </li>\n  </template>\n  </ul>\n</div></template>\n\n<script type=\"module\">\n  \n  let Tocs = {\n    \n    data() { return {  comp:'None', prac:'None', disp:'None', komps:{} } },\n    \n    methods: {\n      \n      isPrac: function(prac) {\n        return this.prac === prac;  },\n      onComp: function(comp) {\n        this.comp = comp; },\n      onPrac: function(prac) {\n        this.prac = prac; },\n      onDisp: function(prac,disp) {\n        this.prac = prac; this.disp = disp; },\n      pubComp: function(comp) {\n        this.comp =   comp;\n        if( this.komps[this.comp].ikw ) {\n            this.pubPrac('All'); } },\n      pubPrac: function(prac) {\n        this.prac = prac;\n        this.publish( this.comp, { prac:this.prac, disp:'All' } ); },\n      pubDisp: function(prac,disp) {\n        this.publish( this.comp, { prac:prac, disp:disp  } ); },\n      doSelect: function(select) {\n        this.publish( 'Select',   select ); },\n      stylePrac: function( prac, hsv ) {\n        if( prac===false ) {} // Consume arg\n        return { backgroundColor:this.toRgbaHsv(hsv) }; },\n      styleDisp: function( disp, hsv ) {\n        if( this.disp!==disp ) {\n          return { color:'black', backgroundColor:this.toRgbaHsv(hsv) }; }\n        else {\n          return { color:'white', backgroundColor:'black' }; } } },\n    \n    mounted: function () {\n      this.komps = this.kompsTocs();\n      for( let key in this.komps ) {\n        if( this.komps.hasOwnProperty(key) && this.komps[key].ikw ) {\n          this.komps[key].pracs = this.pracs(key);\n          this.subscribe( key, 'Tocs.vue', (obj) => {\n            this.onComp(key);\n            if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n            else                   { this.onDisp(obj.prac,obj.disp); } } ); } }\n      this.subscribe( 'Tocs', 'Tocs.vue', (obj) => {\n        if( obj==='Close' ) {\n          this.onComp('None'); } } ); }\n    }\n  \n   export default Tocs;\n   \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .tocs { font-size:3vh; font-family:@theme-font-family;\n    ul { padding:0; margin:0; list-style:none; align-self:start; display:grid;\n      li  { background-color:@theme-back-tocs-comp; padding-left:0.25em; align-self:start;   // Comp\n            border-radius:0 24px 24px 0; margin:0.2em 0.2em 0.2em 0.2em;\n         i  { margin-right: 0.4em; }\n         a  { color:@theme-color; text-decoration:none; }\n         ul { font-size:0.8em; font-weight:bold; padding:0; margin:0;\n           li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2em 0.2em 0.2em 0.2em;            // Prac\n             i { margin-right: 0.3em; }\n             a { color:@theme-high; }\n             ul { font-size:0.8em; padding:0; margin:0 0 0 0.2em;\n               li { border-radius:0 12px 12px 0; color:@theme-back; margin:0.2em 0.2em 0.2em 0.2em;       // Disp\n                 i { margin-right: 0.25em; } }\n               li:hover { background-color:@theme-back!important; color:@theme-color-tocs-disp!important; } } } } } } }\n</style>\n"]}, media: undefined });

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
      _c("router-view", { attrs: { name: "Wood" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Prac" } })
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
  const __vue_inject_styles__$5 = undefined;
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Side = normalizeComponent_1(
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
  return _c("div", { staticClass: "pref" })
};
var __vue_staticRenderFns__$6 = [];
__vue_render__$6._withStripped = true;

  /* style */
  const __vue_inject_styles__$6 = undefined;
  /* scoped */
  const __vue_scope_id__$6 = undefined;
  /* module identifier */
  const __vue_module_identifier__$6 = undefined;
  /* functional template */
  const __vue_is_functional_template__$6 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Pref = normalizeComponent_1(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6,
    __vue_scope_id__$6,
    __vue_is_functional_template__$6,
    __vue_module_identifier__$6,
    undefined,
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
  const __vue_inject_styles__$7 = undefined;
  /* scoped */
  const __vue_scope_id__$7 = undefined;
  /* module identifier */
  const __vue_module_identifier__$7 = undefined;
  /* functional template */
  const __vue_is_functional_template__$7 = false;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Foot = normalizeComponent_1(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7,
    __vue_scope_id__$7,
    __vue_is_functional_template__$7,
    __vue_module_identifier__$7,
    undefined,
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
    inject("data-v-52d499cd_0", { source: "\n.trak {\n}\n", map: {"version":3,"sources":["/Users/ax/Documents/prj/aug/vue/dash/Trak.vue"],"names":[],"mappings":";AAUA;AAAA","file":"Trak.vue","sourcesContent":["\n<template>\n  <div class=\"trak\"></div>\n</template>\n\n<script>\n  export default {}\n</script>\n\n<style type=\"module\">\n     .trak { }\n</style>\n"]}, media: undefined });

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
    inject("data-v-1c5ea085_0", { source: ".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/dash/Dash.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,+BAA+B;EAC/B,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,oCAAoC;EACpC,gCAAgC;EAChC,uEAAuE;AACzE;ACCA;EDCE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EACA,aAAA;EACA,uBAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,aAAA;EACA,uBAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;EACA,uBAAA;ADCA;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;AACzB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;AACzB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;AACzB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;AACzB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;AACzB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;EACb,uBAAuB;AACzB","file":"Dash.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n  background-color: black;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from '../dash/Logo.vue';\n  import Navb from '../dash/Navb.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from '../dash/Tocs.vue';\n  import View from '../dash/View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n  \n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n  \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  .dash { font-family:@theme-font-family; font-size:1rem;\n   position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n   grid-template-columns: @theme-west  @theme-center @theme-east;\n   grid-template-rows:    @theme-north @theme-middle @theme-south;\n   grid-template-areas:\n     \"logo navb find\"\n     \"tocs view side\"\n     \"pref foot trak\";\n  \n  #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; .theme-logo; }\n  #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; .theme-navb; }\n  #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; .theme-find; }\n  #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; .theme-tocs; }\n  #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; .theme-view; }\n  #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; .theme-side; }\n  #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; .theme-pref; }\n  #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; .theme-foot; }\n  #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; .theme-trak; } }\n  \n</style>\n\n"]}, media: undefined });

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


var script$8 = {

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
const __vue_script__$a = script$8;

/* template */
var __vue_render__$a = function() {
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
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-7b9aaaae_0", { source: ".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5em;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab:hover a {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  background-color: wheat;\n  color: black;\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab-active a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab-active a {\n  background-color: wheat;\n  color: black !important;\n  text-decoration: none;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,UAAU;EACV,uBAAuB;EACvB,gBAAgB;AAClB;ACCA;EDCE,qBAAqB;ECCvB,gBAAA;EACA,gCAAA;EACA,4BAAA;EACA,6BAAA;EACA,4BAAA;EACA,8BAAA;AACA;AACA;EACA,uBAAA;EDCE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;AAChC;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,uBAAuB;EACvB,uBAAuB;EACvB,qBAAqB;AACvB","file":"Tabs.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.tabs {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 5%;\n  background-color: black;\n  font-size: 1.5em;\n}\n.tabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab:hover a {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  background-color: wheat;\n  color: black;\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab-active a {\n  background-color: black;\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab-active a {\n  background-color: wheat;\n  color: black !important;\n  text-decoration: none;\n}\n","\n<template>\n  <div class=\"tabs\">\n    <template v-for=\"page in pages\">\n      <div :class=\"classTab(page.key)\" @click=\"pubTab(page.key)\">\n        <router-link :to=\"{ name:name(page) }\">{{page.title}}</router-link>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { comp:String, pages:Array, init:String },\n    \n    data() { return { tab:this.init } },\n    \n    methods: {\n      pubTab: function (tab) {\n        this.tab = tab;\n        this.publish( 'Tabs', tab ); },\n      classTab: function (tab) {\n        return this.tab===tab ? 'tab-active' : 'tab'; },\n      name: function(page) {\n        return this.comp+page.key; } },\n\n    mounted: function () {}\n    \n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .tabs { position:absolute; left:0; top:0; width:100%; height:5%; background-color:@theme-back; font-size:1.5em;\n    .tab { display:inline-block; margin-left:2.0em; padding:0.2em 0.3em 0.1em 0.3em;\n      border-radius:12px 12px 0 0; border-left: @theme-color solid thin;\n      border-top:@theme-color solid thin; border-right:@theme-color solid thin;\n      a         { background-color:@theme-back;  color:@theme-color; text-decoration:none; } }\n    .tab:hover  { background-color:@theme-color; color:@theme-back;\n      a         { background-color:@theme-color; color:@theme-back } }\n    .tab-active { background-color:@theme-color; color:@theme-back; .tab();\n      a         { background-color:@theme-color; color:@theme-back!important; text-decoration:none; } } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$a = undefined;
  /* module identifier */
  const __vue_module_identifier__$a = undefined;
  /* functional template */
  const __vue_is_functional_template__$a = false;
  /* style inject SSR */
  

  
  var Tabs = normalizeComponent_1(
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

var script$9 = {
  components:{ 'b-tabs':Tabs },

  data() { return { comp:'None', pages:[
      { title:'Practices',    key:'Prac' },
      { title:'Connections',  key:'Conn' },
      { title:'Enlight',      key:'Enli' },
      { title:'Data Science', key:'Data' },
    ] } },

  beforeMount: function() {
    this.comp = this.$route.name; },
};

/* script */
const __vue_script__$b = script$9;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "ikws" },
    [
      _c("b-tabs", { attrs: { comp: _vm.comp, pages: _vm.pages } }),
      _vm._v(" "),
      _vm.comp === "Info" ? _c("h1", [_vm._v("Information")]) : _vm._e(),
      _vm._v(" "),
      _vm.comp === "Know" ? _c("h1", [_vm._v("Knowledge")]) : _vm._e(),
      _vm._v(" "),
      _vm.comp === "Wise" ? _c("h1", [_vm._v("Wisdom")]) : _vm._e(),
      _vm._v(" "),
      _vm._l(_vm.pages, function(page) {
        return [_c("router-view", { attrs: { name: _vm.comp + page.key } })]
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
    inject("data-v-63c6c075_0", { source: ".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.ikws {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.ikws h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n", map: {"version":3,"sources":["Ikws.vue","/Users/ax/Documents/prj/aug/vue/comp/Ikws.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;ECCzB,aAAA;AACA;AACA;EDCE,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,YAAY;EACZ,cAAc;AAChB","file":"Ikws.vue","sourcesContent":[".theme-logo {\n  background-color: black;\n}\n.theme-navb {\n  background-color: black;\n}\n.theme-find {\n  background-color: black;\n}\n.theme-tocs {\n  background-color: black;\n}\n.theme-view {\n  background-color: black;\n}\n.theme-side {\n  background-color: black;\n}\n.theme-pref {\n  background-color: black;\n}\n.theme-foot {\n  background-color: black;\n}\n.theme-trak {\n  background-color: black;\n}\n.ikws {\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  display: grid;\n}\n.ikws h1 {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  color: wheat;\n  font-size: 3em;\n}\n","\n<template>\n  <div class=\"ikws\">\n    <b-tabs :comp=\"comp\" :pages=\"pages\"></b-tabs>\n    <h1 v-if=\"comp==='Info'\">Information</h1>\n    <h1 v-if=\"comp==='Know'\">Knowledge</h1>\n    <h1 v-if=\"comp==='Wise'\">Wisdom</h1>\n    <template v-for=\"page in pages\">\n      <router-view :name=\"comp+page.key\"></router-view>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  \n  import Tabs from '../elem/Tabs.vue';\n  \n  export default {\n    components:{ 'b-tabs':Tabs },\n\n    data() { return { comp:'None', pages:[\n        { title:'Practices',    key:'Prac' },\n        { title:'Connections',  key:'Conn' },\n        { title:'Enlight',      key:'Enli' },\n        { title:'Data Science', key:'Data' },\n      ] } },\n\n    beforeMount: function() {\n      this.comp = this.$route.name },\n  }\n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  .ikws { position:relative; left:0; top:0; right:0; bottom:0; background-color:@theme-back; display:grid;\n    h1    { justify-self:center; align-self:center; text-align:center; color:@theme-color; font-size:3em; } }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* style inject SSR */
  

  
  var Ikws = normalizeComponent_1(
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

let Info = {
  
  extends: Ikws,
  beforeMount: function() {
    this.comp = 'Info'; } };

/* script */
const __vue_script__$c = Info;

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
  

  
  var Info$1 = normalizeComponent_1(
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

var script$a = {
  extends: Ikws,
  beforeMount: function() {
    this.comp = 'Know'; } };

/* script */
const __vue_script__$d = script$a;

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
  

  
  var Know = normalizeComponent_1(
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

var script$b = {
  extends: Ikws,
  beforeMount: function() {
    this.comp = 'Wise'; } };

/* script */
const __vue_script__$e = script$b;

/* template */

  /* style */
  const __vue_inject_styles__$e = undefined;
  /* scoped */
  const __vue_scope_id__$e = undefined;
  /* module identifier */
  const __vue_module_identifier__$e = undefined;
  /* functional template */
  const __vue_is_functional_template__$e = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Wise = normalizeComponent_1(
    {},
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
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
//
//
//
//
//
//


let Home = {

  data() { return { comp:'Home', key:'Home' } },
  
  mounted: function () {
    this.publish( 'Tocs', 'Close' ); }
};

Home.Dash = Dash$1;
Home.Info = Info$1;
Home.Know = Know;
Home.Wise = Wise;

/* script */
const __vue_script__$f = Home;

/* template */
var __vue_render__$c = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _vm._m(0)
};
var __vue_staticRenderFns__$c = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("div", { staticClass: "home" }, [
      _c("div", { staticClass: "head" }, [
        _c("div", [
          _c("h1", [_vm._v("Welcome to Muse Home Page")]),
          _vm._v(" "),
          _c("h2", [_vm._v("Choose an Application Component on the Left")])
        ])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "midd" }, [
        _c("h1", [_vm._v("Humanistic Practices")])
      ]),
      _vm._v(" "),
      _c("div", { staticClass: "foot" }, [
        _c("div", [_c("h1", [_vm._v("Axiom Architectures")])])
      ])
    ])
  }
];
__vue_render__$c._withStripped = true;

  /* style */
  const __vue_inject_styles__$f = function (inject) {
    if (!inject) return
    inject("data-v-18bf22a0_0", { source: ".home {\n  display: grid;\n  grid-template-columns: 100%;\n  grid-template-rows: 30% 40% 30%;\n  grid-template-areas: \"head\" \"midd\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.midd {\n  grid-area: midd;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\nh1 {\n  justify-self: center;\n  align-self: center;\n  font-size: 3em;\n}\n", map: {"version":3,"sources":["Home.vue","/Users/ax/Documents/prj/aug/pub/app/muse/Home.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,2BAA2B;EAC3B,+BAA+B;EAC/B,yCAAyC;EACzC,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,YAAY;EACZ,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,kBAAkB;ECCpB,cAAA;AACA","file":"Home.vue","sourcesContent":[".home {\n  display: grid;\n  grid-template-columns: 100%;\n  grid-template-rows: 30% 40% 30%;\n  grid-template-areas: \"head\" \"midd\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.midd {\n  grid-area: midd;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\nh1 {\n  justify-self: center;\n  align-self: center;\n  font-size: 3em;\n}\n","\n<template>\n  <div class=\"home\">\n    <div class=\"head\">\n      <div>\n        <h1>Welcome to Muse Home Page</h1>\n        <h2>Choose an Application Component on the Left</h2>\n      </div>\n    </div>\n    <div class=\"midd\">\n      <h1>Humanistic Practices</h1>\n    </div>\n    <div class=\"foot\">\n      <div>\n        <h1>Axiom Architectures</h1>\n      </div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Home = {\n\n    data() { return { comp:'Home', key:'Home' } },\n    \n    mounted: function () {\n      this.publish( 'Tocs', 'Close' ); }\n  }\n\n  import Dash from '../../../vue/dash/Dash.vue';\n  import Info from '../../../vue/comp/Info.vue';\n  import Know from '../../../vue/comp/Know.vue';\n  import Wise from '../../../vue/comp/Wise.vue';\n\n  Home.Dash = Dash;\n  Home.Info = Info;\n  Home.Know = Know;\n  Home.Wise = Wise;\n\n    export default Home;\n</script>\n\n<style lang=\"less\">\n  \n  .grid3x1() { display:grid; grid-template-columns:100%; grid-template-rows:30% 40% 30%;\n      grid-template-areas:\"head\" \"midd\" \"foot\"; }\n  \n  .home { .grid3x1(); position:relative; left:0; top:0; right:0; bottom:0;\n    background-color:black; color:wheat; }\n\n  .head { grid-area:head; justify-items:center; align-items:center; text-align:center; display:grid;\n    justify-self:stretch; align-self:stretch; }\n  \n  .midd { grid-area:midd; position:relative; left:0; top:0; right:0; height:100%; display:grid;\n    justify-self:stretch; align-self:stretch; }\n\n  .foot { grid-area:foot; justify-items:center; align-items:center; text-align:center; display:grid;\n    justify-self:stretch; align-self:stretch;  }\n  \n  h1 { justify-self:center; align-self:center; font-size:3em; }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$f = undefined;
  /* module identifier */
  const __vue_module_identifier__$f = undefined;
  /* functional template */
  const __vue_is_functional_template__$f = false;
  /* style inject SSR */
  

  
  var Home$1 = normalizeComponent_1(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
    browser,
    undefined
  );

export default Home$1;
