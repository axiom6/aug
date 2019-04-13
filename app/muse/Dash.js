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
var __vue_staticRenderFns__$1 = [
  function() {
    var _vm = this;
    var _h = _vm.$createElement;
    var _c = _vm._self._c || _h;
    return _c("label", [
      _c("input", {
        staticClass: "input",
        attrs: { placeholder: " Search", type: "text", size: "16" }
      })
    ])
  }
];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-7fd01775_0", { source: ".navb {\n  grid-template-columns: 5% 40% 25% 10% 10% 10%;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  background-color: black;\n  color: wheat;\n  display: grid;\n  font-family: Roboto, sans-serif;\n  font-size: 1.4vw;\n  font-weight: bold;\n}\n.navb .home {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .home i {\n  margin-right: 0.3em;\n}\n.navb .home a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: black;\n  color: wheat;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7em;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.navb .settings ul li span {\n  display: inline-block;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.navb div i {\n  margin-right: 0.3em;\n}\n", map: {"version":3,"sources":["Navb.vue","/Users/ax/Documents/prj/aug/vue/dash/Navb.vue"],"names":[],"mappings":"AAAA;EACE,6CAA6C;EAC7C,qEAAqE;EACrE,uBAAuB;EACvB,YAAY;EACZ,aAAa;EACb,+BAA+B;EAC/B,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,kBAAkB;EAClB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,+BAA+B;EAC/B,iBAAiB;EACjB,gBAAgB;EAChB,4BAA4B;EAC5B,iBAAiB;EACjB,YAAY;AACd;AACA;EACE,mBAAmB;ECCrB,mBAAA;EDCE,kBAAkB;ACCpB;AACA;EDCE,kBAAkB;ECCpB,mBAAA;EACA,kBAAA;AACA;AACA;EACA,oBAAA;EACA,mBAAA;EACA,kBAAA;EACA,kBAAA;AACA;AACA;EACA,aAAA;EACA,iBAAA;EACA,gBAAA;EACA,gBAAA;EACA,UAAA;EACA,gBAAA;EACA,kBAAA;EACA,UAAA;EACA,SAAA;EACA,YAAA;EACA,YAAA;EACA,gCAAA;EDCE,4BAA4B;AAC9B;AACA;EACE,eAAe;EACf,4BAA4B;EAC5B,iBAAiB;EACjB,YAAY;EACZ,+BAA+B;EAC/B,gCAAgC;AAClC;AACA;EACE,qBAAqB;EACrB,oBAAoB;AACtB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,iBAAiB;EACjB,gBAAgB;AAClB;AACA;EACE,gBAAgB;EAChB,YAAY;AACd;AACA;EACE,mBAAmB;AACrB","file":"Navb.vue","sourcesContent":[".navb {\n  grid-template-columns: 5% 40% 25% 10% 10% 10%;\n  grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\";\n  background-color: black;\n  color: wheat;\n  display: grid;\n  font-family: Roboto, sans-serif;\n  font-size: 1.4vw;\n  font-weight: bold;\n}\n.navb .home {\n  grid-area: ghome;\n  justify-self: start;\n  align-self: center;\n}\n.navb .home i {\n  margin-right: 0.3em;\n}\n.navb .home a {\n  color: wheat;\n  text-decoration: none;\n}\n.navb .search {\n  grid-area: gsearch;\n  justify-self: start;\n  align-self: center;\n}\n.navb .search label .input {\n  font-family: Roboto, sans-serif;\n  font-weight: bold;\n  font-size: 0.9em;\n  border-radius: 0 12px 12px 0;\n  background: black;\n  color: wheat;\n}\n.navb .contact {\n  grid-area: gcontact;\n  justify-self: start;\n  align-self: center;\n}\n.navb .signon {\n  grid-area: gsignon;\n  justify-self: start;\n  align-self: center;\n}\n.navb .settings {\n  grid-area: gsettings;\n  justify-self: start;\n  align-self: center;\n  position: relative;\n}\n.navb .settings ul {\n  display: none;\n  align-self: start;\n  list-style: none;\n  font-size: 0.7em;\n  z-index: 3;\n  background: #222;\n  position: absolute;\n  left: 10px;\n  top: 12px;\n  width: 200px;\n  height: auto;\n  padding: 0.2em 0.2em 0.2em 0.6em;\n  border-radius: 0 24px 24px 0;\n}\n.navb .settings ul li {\n  display: inline;\n  border-radius: 0 18px 18px 0;\n  background: black;\n  color: wheat;\n  margin: 0.3em 0.3em 0.3em 0.3em;\n  padding: 0.2em 0.4em 0.2em 0.4em;\n}\n.navb .settings ul li i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.navb .settings ul li span {\n  display: inline-block;\n}\n.navb .settings:hover ul {\n  display: grid;\n  align-self: start;\n  background: #444;\n}\n.navb .settings:hover ul li:hover {\n  background: #777;\n  color: black;\n}\n.navb div i {\n  margin-right: 0.3em;\n}\n","\n<template>\n  <div class=\"navb\">    <!-- <i class=\"fas fa-home\"></i> -->\n    <div class=\"home\"><router-link :to=\"{ name:'Home'}\"><i class=\"fas fa-home\"></i>Home</router-link></div>\n    <div class=\"search\"   @click=\"click('Search')\">\n      <i class=\"fas fa-search\"></i>\n      <label><input class=\"input\" placeholder=\" Search\"  type=\"text\" size=\"16\"></label><!-- &#xF002; -->\n    </div>\n    <div class=\"contact\"  @click=\"click('Contact')\" ><i class=\"fas fa-user\"       ></i>Contact</div>\n    <div class=\"signon\"   @click=\"click('Signon')\"  ><i class=\"fas fa-sign-in-alt\"></i>Sign On</div>\n    <div class=\"settings\"><i class=\"fas fa-cog\"></i><span>Settings</span>\n      <ul>\n        <li @click=\"click('Preferences')\"><i class=\"fas fa-cog\"></i><span>Preferences</span></li>\n        <li @click=\"click('Connection')\" ><i class=\"fas fa-cog\"></i><span>Connection</span></li>\n        <li @click=\"click('Privacy')\"    ><i class=\"fas fa-cog\"></i><span>Privacy</span></li>\n      </ul>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  export default {\n    data() {\n      return {} },\n    methods: {\n      click:  function( obj )  {\n        this.publish(  'Navb', obj    ); },\n      onNavb: function( obj )  {\n        console.log(  'Navb.onNavb()', obj ); } },\n    mounted: function () {\n      this.subscribe( 'Navb', 'Navb.vue', this.onNavb ) } };\n  \n</script>\n\n<style lang=\"less\">\n  \n  // top | right | bottom | left\n  \n  .grid1x5() { display:grid; grid-template-columns:5% 40% 25% 10% 10% 10%;\n    grid-template-areas: \"gleft ghome gsearch gcontact gsettings gsignon\"; }\n  \n  .navb {  .grid1x5(); background-color:black; color:wheat; display:grid;\n      font-family:Roboto, sans-serif; font-size:1.4vw; font-weight:bold;    // Using because Navb sensistive to width\n    .home     { grid-area:ghome;     justify-self:start; align-self:center;\n      i { margin-right:0.3em; }\n      a { color:wheat; text-decoration:none; }}\n    .search   { grid-area:gsearch;   justify-self:start; align-self:center; // font-family:FontAwesome, sans-serif;\n      label .input{ font-family:Roboto, sans-serif; font-weight:bold;  font-size:0.9em;\n        border-radius:0 12px 12px 0; background:black; color:wheat; } }\n    .contact  { grid-area:gcontact;  justify-self:start; align-self:center; }\n    .signon   { grid-area:gsignon;   justify-self:start; align-self:center; }\n    .settings { grid-area:gsettings; justify-self:start; align-self:center; position:relative;\n      ul { display:none; align-self:start; list-style:none; font-size:0.7em; z-index:3; background:#222;\n        position:absolute; left:10px; top:12px; width:200px; height:auto;\n        padding:0.2em 0.2em 0.2em 0.6em; border-radius:0 24px 24px 0;\n        li { display:inline; border-radius:0 18px 18px 0;  background:black; color:wheat;\n             margin:0.3em 0.3em 0.3em 0.3em; padding:0.2em 0.4em 0.2em 0.4em;\n          i {    display:inline-block; margin-right:0.25em; }\n          span { display:inline-block; } } } }\n    .settings:hover {\n      ul { display:grid; align-self:start; background:#444;\n        li:hover { background:#777; color:black; } } }\n     div i { margin-right:0.3em; } }\n  \n</style>\n"]}, media: undefined });

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
//


let Tocs = {
  
  data() { return {  comp:'None', prac:'None', disp:'None',
      komps:{ Info:{ name:'Info', pracs:{}, icon:"fas fa-th"          },
              Know:{ name:'Know', pracs:{}, icon:"fas fa-university"  },
              Wise:{ name:'Wise', pracs:{}, icon:"fab fa-tripadvisor" },
              Cube:{ name:'Cube', pracs:{}, icon:"fas fa-cubes"       },
              Wood:{ name:'Wood', pracs:{}, icon:"fas fa-tree"        } } } },
  
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
      this.comp =  comp;
      this.pubPrac('All'); },
    pubPrac: function(prac) {
      this.prac = prac;
      this.publish( this.comp, { prac:this.prac, disp:'All' } ); },
    pubDisp: function(prac,disp) {
      this.publish( this.comp, { prac:prac,      disp:disp  } ); },
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
    
    for( let key in this.komps ) {
      if( this.komps.hasOwnProperty(key) && key !== 'Cube' && key !== 'Svga' && key !== 'Wood' ) {
        this.komps[key].pracs = this.pracs(key);
        this.subscribe( key, 'Tocs.vue', (obj) => {
          this.onComp(key);
          if( obj.disp==='All' ) { this.onPrac(obj.prac); }
          else                   { this.onDisp(obj.prac,obj.disp); } } ); } }
    }
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
                "span",
                {
                  on: {
                    click: function($event) {
                      return _vm.pubComp(komp.name)
                    }
                  }
                },
                [
                  _c("router-link", { attrs: { to: { name: komp.name } } }, [
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
                              _vm._v(_vm._s(prac.name) + "\n          "),
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
    inject("data-v-004cd23f_0", { source: "@import '../../css/fontawesome/init.css';\n.tocs {\n  background-color: black;\n  font-size: 3vh;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black!important;\n  color: white!important;\n}\n", map: {"version":3,"sources":["Tocs.vue"],"names":[],"mappings":"AAAA,wCAAwC;AACxC;EACE,uBAAuB;EACvB,cAAc;AAChB;AACA;EACE,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,oBAAoB;EACpB,iBAAiB;EACjB,4BAA4B;EAC5B,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,gBAAgB;EAChB,iBAAiB;EACjB,UAAU;EACV,SAAS;AACX;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,mBAAmB;AACrB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iCAAiC;EACjC,sBAAsB;AACxB","file":"Tocs.vue","sourcesContent":["@import '../../css/fontawesome/init.css';\n.tocs {\n  background-color: black;\n  font-size: 3vh;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black!important;\n  color: white!important;\n}\n"]}, media: undefined });

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
    return { comp:'None', prac:'All', disp:'All', area:'All', practices:{}, baseCols:{},
      rows:{ Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
             Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cogs" },
             Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
  
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.prac==='All' },
    isDisp: function (disp) {
      return this.disp===disp || this.disp==='All' },
    isArea: function (area) {
      return this.area===area || this.area==='All' },
    isRows: function () {
      return this.prac==='All' },
    pubPrac: function (prac) {
      this.publish( this.comp, { prac:prac, disp:'All' } ); },
    pubDisp: function (prac,disp) {
      this.publish( this.comp, { prac:prac, disp:disp  } ); },
    onPrac: function (prac) {
      this.prac = prac; this.disp='All'; },
    onDisp: function (prac,disp) {
      this.prac = prac; this.disp=disp; },
    onArea: function (prac,disp,area) {
      this.prac = prac; this.disp = disp; this.area = area; },
    pracDir: function(dir) {
      return this.prac==='All' ? dir : 'fullPracDir'; },
    dispDir: function(dir) {
      return this.disp==='All' ? dir : 'fullDispDir'; },
    areaDir: function() {
      return this.prac!=='All' ? 'area' : 'none' }, // this.area!=='All' ? 'area' : 'fullArea'; },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; } },

  mounted: function () {
    if( this.onArea===false ) ;
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
              class: _vm.pracDir(prac.dir)
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
                      class: _vm.dispDir("cen"),
                      style: _vm.style(prac.hsv)
                    },
                    [
                      _c(
                        "div",
                        {
                          staticClass: "disp",
                          on: {
                            click: function($event) {
                              return _vm.pubPrac(prac.name)
                            }
                          }
                        },
                        [
                          _c("i", { class: prac.icon }),
                          _vm._v(" "),
                          _c("span", { staticClass: "name" }, [
                            _vm._v(_vm._s(prac.name))
                          ]),
                          _vm._v(" "),
                          _c("span", { staticClass: "desc" }, [
                            _vm._v(_vm._s(prac.desc))
                          ])
                        ]
                      )
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
                          class: _vm.dispDir(disp.dir),
                          style: _vm.style(disp.hsv)
                        },
                        [
                          _c(
                            "div",
                            {
                              staticClass: "disp",
                              on: {
                                click: function($event) {
                                  return _vm.pubDisp(prac.name, disp.name)
                                }
                              }
                            },
                            [
                              _c("i", { class: disp.icon }),
                              _vm._v(" "),
                              _c("span", { staticClass: "name" }, [
                                _vm._v(_vm._s(disp.name))
                              ]),
                              _vm._v(" "),
                              _c("span", { staticClass: "desc" }, [
                                _vm._v(_vm._s(disp.desc))
                              ])
                            ]
                          ),
                          _vm._v(" "),
                          _vm._l(disp.areas, function(area) {
                            return [
                              _c("div", { class: _vm.areaDir() }, [
                                _c("i", { class: area.icon }),
                                _vm._v(" "),
                                _c("span", { staticClass: "name" }, [
                                  _vm._v(_vm._s(area.name))
                                ]),
                                _vm._v(" "),
                                _c("span", { staticClass: "desc" }, [
                                  _vm._v(_vm._s(area.desc))
                                ])
                              ])
                            ]
                          })
                        ],
                        2
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
                _c("div", [
                  _c("i", { class: row.icon }),
                  _vm._v(_vm._s(row.name))
                ])
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
    inject("data-v-6a310951_0", { source: "@import '../../css/fontawesome/init.css';\n.comp {\n  background-color: black;\n  position: relative;\n  font-size: 1.75vmin;\n  display: grid;\n  grid-template-columns: 7% 31% 31% 31%;\n  grid-template-rows: 13% 29% 29% 29%;\n  grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 33% 33% 34%;\n  grid-template-rows: 33% 33% 34%;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.3em;\n}\n.comp .prac div {\n  font-size: 1.1em;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.2em;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5em 0.5em 0.5em 0.5em;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6% 22% 72%;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.3em;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 1em;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2em;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1em;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 2.4em !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 3em !important;\n  padding-bottom: 0;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.8em;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2em;\n  display: block;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1em;\n}\n", map: {"version":3,"sources":["Base.vue","/Users/ax/Documents/prj/aug/vue/muse/Base.vue"],"names":[],"mappings":"AAAA,wCAAwC;AACxC;EACE,uBAAuB;EACvB,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,qCAAqC;EACrC,mCAAmC;EACnC,uFAAuF;EACvF,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,cAAA;EDCE,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EDCE,eAAe;ECCjB,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;ADCA;ACCA;EACA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;AACA;EACA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EDCE,mBAAmB;ACCrB;AACA;EACA,aAAA;EACA,gBAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,aAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,sBAAA;EACA,mBAAA;EACA,UAAA;EACA,WAAA;EACA,cAAA;EDCE,iBAAiB;ECCnB,aAAA;EACA,kCAAA;EACA,+BAAA;EACA,gEAAA;AACA;AACA;EACA,aAAA;EDCE,gBAAgB;ECClB,qBAAA;EACA,mBAAA;EACA,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,eAAA;EDCE,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,eAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,oBAAoB;AACtB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,+BAA+B;EAC/B,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,iCAAiC;EACjC,qCAAqC;EACrC,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB,UAAU;EACV,YAAY;EACZ,gBAAgB;AAClB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,eAAe;AACjB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,cAAc;EACd,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,cAAc;EACd,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,2BAA2B;EAC3B,cAAc;AAChB;AACA;EACE,yBAAyB;EACzB,iBAAiB;AACnB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,cAAc;EACd,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,gBAAgB;EAChB,YAAY;AACd;AACA;EACE,oBAAoB;EACpB,cAAc;AAChB;AACA;;;EAGE,cAAc;AAChB","file":"Base.vue","sourcesContent":["@import '../../css/fontawesome/init.css';\n.comp {\n  background-color: black;\n  position: relative;\n  font-size: 1.75vmin;\n  display: grid;\n  grid-template-columns: 7% 31% 31% 31%;\n  grid-template-rows: 13% 29% 29% 29%;\n  grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 33% 33% 34%;\n  grid-template-rows: 33% 33% 34%;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.3em;\n}\n.comp .prac div {\n  font-size: 1.1em;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.2em;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5em 0.5em 0.5em 0.5em;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6% 22% 72%;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.3em;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 1em;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2em;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1em;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 2.4em !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 3em !important;\n  padding-bottom: 0;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.8em;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2em;\n  display: block;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1em;\n}\n","\n<template>\n  <div class=\"comp\">\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" :class=\"pracDir(prac.dir)\" :key=\"prac.name\">\n        <div class=\"prac\">\n          <div v-show=\"isDisp(prac.name)\" :class=\"dispDir('cen')\" :style=\"style(prac.hsv)\">\n            <div class=\"disp\" v-on:click=\"pubPrac(prac.name)\">\n              <i   :class=\"prac.icon\"></i>\n              <span class=\"name\">{{prac.name}}</span>\n              <span class=\"desc\">{{prac.desc}}</span>\n            </div>\n          </div>\n          <template v-for=\"disp in prac.disps\">\n            <div v-show=\"isDisp(disp.name)\" :class=\"dispDir(disp.dir)\" :style=\"style(disp.hsv)\">\n              <div class=\"disp\" v-on:click=\"pubDisp(prac.name,disp.name)\">\n                  <i   :class=\"disp.icon\"></i>\n                  <span class=\"name\">{{disp.name}}</span>\n                  <span class=\"desc\">{{disp.desc}}</span>\n              </div>\n              <template v-for=\"area in disp.areas\">\n                <div :class=\"areaDir()\">\n                  <i :class=\"area.icon\"></i>\n                  <span class=\"name\">{{area.name}}</span>\n                  <span class=\"desc\">{{area.desc}}</span>\n                </div>\n              </template>\n            </div>\n          </template>\n        </div>\n      </div>\n    </template>\n    <template v-for=\"row in rows\">\n      <div v-show=\"isRows()\" :class=\"row.dir\" :key=\"row.name\"><div class=\"row\">\n        <div><i :class=\"row.icon\"></i>{{row.name}}</div></div></div>\n    </template>\n  </div>  \n</template>\n\n<script type=\"module\">\n\n  export default {\n    \n    data() {\n      return { comp:'None', prac:'All', disp:'All', area:'All', practices:{}, baseCols:{},\n        rows:{ Learn:{ name:'Learn', dir:'le', icon:\"fas fa-graduation-cap\" },\n               Do:{    name:'Do',    dir:'do', icon:\"fas fas fa-cogs\" },\n               Share:{ name:'Share', dir:'sh', icon:\"fas fa-share-alt-square\" } } } },\n    \n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      isDisp: function (disp) {\n        return this.disp===disp || this.disp==='All' },\n      isArea: function (area) {\n        return this.area===area || this.area==='All' },\n      isRows: function () {\n        return this.prac==='All' },\n      pubPrac: function (prac) {\n        this.publish( this.comp, { prac:prac, disp:'All' } ); },\n      pubDisp: function (prac,disp) {\n        this.publish( this.comp, { prac:prac, disp:disp  } ); },\n      onPrac: function (prac) {\n        this.prac = prac; this.disp='All'; },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp=disp; },\n      onArea: function (prac,disp,area) {\n        this.prac = prac; this.disp = disp; this.area = area; },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'fullPracDir'; },\n      dispDir: function(dir) {\n        return this.disp==='All' ? dir : 'fullDispDir'; },\n      areaDir: function() {\n        return this.prac!=='All' ? 'area' : 'none' }, // this.area!=='All' ? 'area' : 'fullArea'; },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; } },\n\n    mounted: function () {\n      if( this.onArea===false ) {}\n      this.practices = this.pracs(this.comp,'Cols');\n      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {\n         if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n         else                   { this.onDisp(obj.prac,obj.disp); } } ); } }\n         \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../css/fontawesome/init.css';\n\n  .grid3x3() { display:grid; grid-template-columns:33% 33% 34%; grid-template-rows:33% 33% 34%;\n               grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\"; }\n  \n  .grid4x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:13% 29% 29% 29%;\n    grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid1x3() { display:grid; grid-template-columns:6% 22% 72%; grid-template-areas: \"icon name desc\"; }\n  \n  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n                  justify-items:center; align-items:center; }\n  \n  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }\n  \n  .bgc( @bg )\n    { background-color:@bg; }\n  \n  .comp { background-color:black; position:relative; font-size:1.75vmin;\n    \n    .grid4x4(); justify-items:center; align-items:center; // The 4x4 Dim + Per + 9 Practices Grid\n      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }\n      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n  \n    // Placed one level below the 9 Practices Grid\n    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:1em; font-weight:bold;\n      .grid3x3(); // The 4 Displine plus Practiice name Grid\n                             .north { .ddir(north); }\n      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }\n                             .south { .ddir(south); }\n      .cen  { font-size:1.3em; }\n      div   { font-size:1.1em; } }\n  \n    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:1.2em;\n      i     { display:inline-block;  margin-right: 0.25em; }\n      .name { display:inline-block; }\n      .desc { display:none; margin:0.5em 0.5em 0.5em 0.5em; text-align:left; } }\n    \n    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;\n            width:90%; height:auto; font-size:1.3em;\n      i     { grid-area:icon; }\n      .name { grid-area:name; font-weight:900; }\n      .desc { grid-area:desc; } }\n  \n    .none { display:none; }\n    \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:1em; width:100%; height:100%;\n              justify-self:center; align-self:center; display:grid; border-radius:0.5em;\n        div {     padding-bottom:2em;\n          .disp { padding-bottom:0;\n            i     { font-size:1.6em; }\n            .name { font-size:1.6em; }\n            .desc { font-size:1.0em; display:block; } } }  // Turns on .disp .desc\n          .area { padding-bottom:0; } } }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n       .disp { justify-self:center; margin:0;\n         i     { font-size:4.8em !important; }\n         .name { font-size:4.8em !important; }\n         .desc { font-size:2.4em !important; display:block; } }  // Turns on .disp .desc\n       .area {   font-size:3.0em !important; padding-bottom:0; } }\n    \n    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:1em;\n           font-weight:bold; display:grid;\n      div { text-align:center; justify-self:center;  align-self:center; font-size:1.8em; color:wheat; }\n        i { margin-bottom: 0.2em; display:block; } }\n  \n    .em, .in, .en { .prac .cen { font-size:1em; } } // Font size columns\n  }\n  \n</style>\n"]}, media: undefined });

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

  
  let Dash = {
      name: 'dash',
      components: {
        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,
        'd-tocs':Tocs$1, 'd-view':View, 'd-side':Side,
        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };
//import Cube from './Cube.vue';
//import Wood from '../../app/anim/wood/Wood.vue';

  Dash.Home = Home;
  Dash.Info = Info;
  Dash.Know = Know;
  Dash.Wise = Wise;

/* script */
const __vue_script__$e = Dash;

/* template */
var __vue_render__$b = function() {
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
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;

  /* style */
  const __vue_inject_styles__$e = function (inject) {
    if (!inject) return
    inject("data-v-06fb0d85_0", { source: ".dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/muse/Dash.vue"],"names":[],"mappings":"AAAA;EACE,+BAA+B;EAC/B,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,oCAAoC;EACpC,gCAAgC;EAChC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;ECCA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA;AACA;EACA,eAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,aAAA;AACA","file":"Dash.vue","sourcesContent":[".dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from '../dash/Logo.vue';\n  import Navb from '../dash/Navb.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n\n  \n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n\n  // Static imports for minimizing build steps in dev.\n  import Home from './Home.vue';\n  import Info from './Info.vue';\n  import Know from './Know.vue';\n  import Wise from './Wise.vue';\n//import Cube from './Cube.vue';\n//import Wood from '../../app/anim/wood/Wood.vue';\n\n  Dash.Home = Home;\n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n//Dash.Cube = Cube;\n//Dash.Wood = Wood;\n \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n\n   .dash { font-family:Roboto, sans-serif; font-size:1rem;\n     position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n     grid-template-columns: 11vw 85vw 4vw;\n     grid-template-rows:     6vh 88vh 6vh;\n     grid-template-areas:\n       \"logo navb find\"\n       \"tocs view side\"\n       \"pref foot trak\";\n\n    #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }\n    #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }\n    #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }\n    #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; }\n    #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }\n    #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }\n    #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }\n    #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }\n    #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }\n  \n</style>\n\n<!--script type=\"module\">\n\n  import Logo from '../dash/Logo.vue';\n  import Navb from '../dash/Navb.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n\n\n  let Dash = {\n    name: 'dash',\n    components: {\n      'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n      'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n      'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n\n  // Static imports for minimizing build steps in dev.\n\n  import Info from './Info.vue';\n  import Know from './Know.vue';\n  import Wise from './Wise.vue';\n  //import Cube from './Cube.vue';\n  import Svga from '../../app/demo/Svga.vue';\n\n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n  //Dash.Cube = Cube;\n  Dash.Svga = Svga;\n\n  export default Dash;\n\n</script-->\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$e = undefined;
  /* module identifier */
  const __vue_module_identifier__$e = undefined;
  /* functional template */
  const __vue_is_functional_template__$e = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$e,
    __vue_script__$e,
    __vue_scope_id__$e,
    __vue_is_functional_template__$e,
    __vue_module_identifier__$e,
    browser,
    undefined
  );

export default Dash$1;
