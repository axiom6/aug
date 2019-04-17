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
      this.setComp( comp );
      this.comp =   comp;
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
    inject("data-v-2fa9e19e_0", { source: "@import '../../css/fontawesome/init.css';\n.tocs {\n  background-color: black;\n  font-size: 3vh;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black!important;\n  color: white!important;\n}\n", map: {"version":3,"sources":["Tocs.vue"],"names":[],"mappings":"AAAA,wCAAwC;AACxC;EACE,uBAAuB;EACvB,cAAc;AAChB;AACA;EACE,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,sBAAsB;EACtB,oBAAoB;EACpB,iBAAiB;EACjB,4BAA4B;EAC5B,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,gBAAgB;EAChB,iBAAiB;EACjB,UAAU;EACV,SAAS;AACX;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,mBAAmB;AACrB;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,mBAAmB;AACrB;AACA;EACE,4BAA4B;EAC5B,YAAY;EACZ,+BAA+B;AACjC;AACA;EACE,oBAAoB;AACtB;AACA;EACE,iCAAiC;EACjC,sBAAsB;AACxB","file":"Tocs.vue","sourcesContent":["@import '../../css/fontawesome/init.css';\n.tocs {\n  background-color: black;\n  font-size: 3vh;\n}\n.tocs ul {\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  align-self: start;\n  display: grid;\n}\n.tocs ul li {\n  background-color: #333;\n  padding-left: 0.25em;\n  align-self: start;\n  border-radius: 0 24px 24px 0;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li i {\n  margin-right: 0.4em;\n}\n.tocs ul li a {\n  color: wheat;\n  text-decoration: none;\n}\n.tocs ul li ul {\n  font-size: 0.8em;\n  font-weight: bold;\n  padding: 0;\n  margin: 0;\n}\n.tocs ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li i {\n  margin-right: 0.3em;\n}\n.tocs ul li ul li ul {\n  font-size: 0.8em;\n  padding: 0;\n  margin: 0 0 0 0.2em;\n}\n.tocs ul li ul li ul li {\n  border-radius: 0 12px 12px 0;\n  color: black;\n  margin: 0.2em 0.2em 0.2em 0.2em;\n}\n.tocs ul li ul li ul li i {\n  margin-right: 0.25em;\n}\n.tocs ul li ul li ul li:hover {\n  background-color: black!important;\n  color: white!important;\n}\n"]}, media: undefined });

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
      _c("router-view", { key: _vm.$route.fullPath, attrs: { name: "Info" } }),
      _vm._v(" "),
      _c("router-view", { key: _vm.$route.fullPath, attrs: { name: "Know" } }),
      _vm._v(" "),
      _c("router-view", { key: _vm.$route.fullPath, attrs: { name: "Wise" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Conn" } }),
      _vm._v(" "),
      _c("router-view", { attrs: { name: "Cube" } }),
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
    inject("data-v-05ebe37c_0", { source: ".banner {\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n", map: {"version":3,"sources":["View.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;EACvB,YAAY;AACd","file":"View.vue","sourcesContent":[".banner {\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n}\n"]}, media: undefined });

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


var script$9 = {
  
  data() {
    return { tab:'Practices' } },

  methods: {
    toName: function () {
      console.log( 'Tabs.toName()', this.$route.name );
      return { name:this.$route.name } },
    pubTab: function (tab) {
      this.tab = tab;
      this.publish( 'Tabs', tab ); },
    classTab: function (tab) {
      return this.tab===tab ? 'tab-active' : 'tab'; } },

  mounted: function () {}
  
  };

/* script */
const __vue_script__$a = script$9;

/* template */
var __vue_render__$a = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "tabs" }, [
    _c(
      "div",
      { class: _vm.classTab("Practices") },
      [
        _c("router-link", { attrs: { to: _vm.toName() } }, [
          _vm._v("Practices")
        ])
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { class: _vm.classTab("Connections") },
      [
        _c("router-link", { attrs: { to: { name: "Conn" } } }, [
          _vm._v("Connections")
        ])
      ],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        class: _vm.classTab("Enlight"),
        on: {
          click: function($event) {
            return _vm.pubTab("Enlight")
          }
        }
      },
      [_vm._v("Enlight")]
    ),
    _vm._v(" "),
    _c(
      "div",
      {
        class: _vm.classTab("Data Science"),
        on: {
          click: function($event) {
            return _vm.pubTab("Data Science")
          }
        }
      },
      [_vm._v("Data Science")]
    )
  ])
};
var __vue_staticRenderFns__$a = [];
__vue_render__$a._withStripped = true;

  /* style */
  const __vue_inject_styles__$a = function (inject) {
    if (!inject) return
    inject("data-v-3191b08a_0", { source: ".tabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab a {\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  background-color: wheat;\n  color: black;\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab-active a {\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab-active a {\n  color: black;\n  text-decoration: none;\n}\n", map: {"version":3,"sources":["Tabs.vue"],"names":[],"mappings":"AAAA;EACE,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;AAChC;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;EACZ,qBAAqB;EACrB,gBAAgB;EAChB,gCAAgC;EAChC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;AAChC;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB;AACA;EACE,YAAY;EACZ,qBAAqB;AACvB","file":"Tabs.vue","sourcesContent":[".tabs .tab {\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab a {\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs .tab-active {\n  background-color: wheat;\n  color: black;\n  display: inline-block;\n  margin-left: 2em;\n  padding: 0.2em 0.3em 0.1em 0.3em;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n}\n.tabs .tab-active a {\n  color: wheat;\n  text-decoration: none;\n}\n.tabs .tab-active a {\n  color: black;\n  text-decoration: none;\n}\n"]}, media: undefined });

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

var script$a = {
  
  components:{ 'b-tabs':Tabs },
  
  data() { return {
    comp:'None', prac:'All', disp:'All', tab:'Practices', practices:{},
    rows: {
      Learn:{ name:'Learn', dir:'le', icon:"fas fa-graduation-cap" },
      Do:{    name:'Do',    dir:'do', icon:"fas fas fa-cogs" },
      Share:{ name:'Share', dir:'sh', icon:"fas fa-share-alt-square" } } } },
  
  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.prac==='All' },
    isDisp: function (disp) {
      return this.disp===disp || this.disp==='All' },
    isRows: function () {
      return this.prac==='All' },
    pubTab: function (tab) {
      this.tab = tab; },
    classTab: function (tab) {
      return this.tab===tab ? 'tab-active' : 'tab' },
    pubPrac: function (prac) {
      this.publish( this.comp, { prac:prac, disp:'All' } ); },
    pubDisp: function (prac,disp) {
      this.publish( this.comp, { prac:prac, disp:disp  } ); },
    onPrac: function (prac) {
      this.prac = prac; this.disp='All'; },
    onDisp: function (prac,disp) {
      this.prac = prac; this.disp=disp; },
    onTabs: function (tab) {
      this.tab = tab; },
    pracDir: function(dir) {
      return this.prac==='All' ? dir : 'fullPracDir'; },
    dispDir: function(dir) {
      return this.disp==='All' ? dir : 'fullDispDir'; },
    areaDir: function() {
      return this.prac==='All' ? 'none' : 'area' },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; } },

  beforeMount: function() {
    console.log( 'Base.beforeMount()', this.$route.name );
    this.comp = this.$route.name; },

  mounted: function () {
    this.practices = this.pracs(this.comp,'Cols');
    this.subscribe(  this.comp, this.comp+'.vue', (obj) => {
       if( obj.disp==='All' ) { this.onPrac(obj.prac); }
       else                   { this.onDisp(obj.prac,obj.disp); } } );
    this.subscribe(  "Tabs",    this.comp+'.vue', (obj) => {
      this.onTabs(obj); } ); }
};

/* script */
const __vue_script__$b = script$a;

/* template */
var __vue_render__$b = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "comp" },
    [
      _c("b-tabs"),
      _vm._v(" "),
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
var __vue_staticRenderFns__$b = [];
__vue_render__$b._withStripped = true;

  /* style */
  const __vue_inject_styles__$b = function (inject) {
    if (!inject) return
    inject("data-v-9d06477c_0", { source: "@import '../../css/fontawesome/init.css';\n.comp {\n  background-color: black;\n  position: relative;\n  font-size: 1.75vmin;\n  display: grid;\n  grid-template-columns: 7% 31% 31% 31%;\n  grid-template-rows: 7% 12% 27% 27% 27%;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.2em;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 33% 33% 34%;\n  grid-template-rows: 33% 33% 34%;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.3em;\n}\n.comp .prac div {\n  font-size: 1.1em;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.2em;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5em 0.5em 0.5em 0.5em;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6% 22% 72%;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.3em;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 2.4em !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 3em !important;\n  padding-bottom: 0;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 1em;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2em;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1em;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 2.4em !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 3em !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1em;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.8em;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2em;\n  display: block;\n}\n", map: {"version":3,"sources":["Base.vue","/Users/ax/Documents/prj/aug/vue/muse/Base.vue"],"names":[],"mappings":"AAAA,wCAAwC;AACxC;EACE,uBAAuB;EACvB,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,qCAAqC;EACrC,sCAAsC;EACtC,6GAA6G;EAC7G,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,eAAe;EACf,YAAY;EACZ,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;ECCA,aAAA;EDCE,cAAc;ECChB,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,eAAA;EDCE,qBAAqB;ECCvB,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;ADCA;ECCA,aAAA;EDCE,aAAa;ECCf,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;ADCA;ACCA;EACA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;ADCA;ACCA;EACA,aAAA;EACA,gBAAA;EACA,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,aAAA;EACA,qBAAA;EACA,mBAAA;EDCE,qBAAqB;ECCvB,mBAAA;AACA;AACA;EACA,sBAAA;EACA,mBAAA;EDCE,UAAU;ECCZ,WAAA;EDCE,cAAc;ECChB,iBAAA;EACA,aAAA;EACA,kCAAA;EACA,+BAAA;EACA,gEAAA;AACA;AACA;EDCE,aAAa;ECCf,gBAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,mBAAA;AACA;ADCA;ECCA,aAAA;EACA,cAAA;EACA,qBAAA;EACA,mBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;ECCf,eAAA;EDCE,qBAAqB;ECCvB,mBAAA;EACA,mBAAA;AACA;AACA;EDCE,aAAa;EACb,gBAAgB;ECClB,qBAAA;EDCE,mBAAmB;EACnB,mBAAmB;AACrB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,eAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,oBAAoB;AACtB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,+BAA+B;EAC/B,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,iCAAiC;EACjC,qCAAqC;EACrC,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;EAChB,kBAAkB;EAClB,UAAU;EACV,YAAY;EACZ,gBAAgB;AAClB;AACA;EACE,eAAe;AACjB;AACA;EACE,eAAe;EACf,gBAAgB;AAClB;AACA;EACE,eAAe;AACjB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,2BAA2B;EAC3B,cAAc;AAChB;AACA;EACE,yBAAyB;EACzB,iBAAiB;AACnB;AACA;EACE,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,cAAc;EACd,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,cAAc;EACd,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,OAAO;EACP,SAAS;EACT,UAAU;EACV,aAAa;EACb,mBAAmB;AACrB;AACA;EACE,oBAAoB;EACpB,SAAS;AACX;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,2BAA2B;AAC7B;AACA;EACE,2BAA2B;EAC3B,cAAc;AAChB;AACA;EACE,yBAAyB;EACzB,iBAAiB;AACnB;AACA;;;EAGE,cAAc;AAChB;AACA;EACE,sBAAsB;EACtB,mBAAmB;EACnB,gBAAgB;EAChB,UAAU;EACV,WAAW;EACX,cAAc;EACd,iBAAiB;EACjB,aAAa;AACf;AACA;EACE,kBAAkB;EAClB,oBAAoB;EACpB,kBAAkB;EAClB,gBAAgB;EAChB,YAAY;AACd;AACA;EACE,oBAAoB;EACpB,cAAc;AAChB","file":"Base.vue","sourcesContent":["@import '../../css/fontawesome/init.css';\n.comp {\n  background-color: black;\n  position: relative;\n  font-size: 1.75vmin;\n  display: grid;\n  grid-template-columns: 7% 31% 31% 31%;\n  grid-template-rows: 7% 12% 27% 27% 27%;\n  grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.comp .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.2em;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.comp .cm {\n  display: grid;\n  grid-area: cm;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .em {\n  display: grid;\n  grid-area: em;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .in {\n  display: grid;\n  grid-area: in;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .en {\n  display: grid;\n  grid-area: en;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .le {\n  display: grid;\n  grid-area: le;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .do {\n  display: grid;\n  grid-area: do;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sh {\n  display: grid;\n  grid-area: sh;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.comp .prac {\n  background-color: #603;\n  border-radius: 36px;\n  width: 90%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n  grid-template-columns: 33% 33% 34%;\n  grid-template-rows: 33% 33% 34%;\n  grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\";\n}\n.comp .prac .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  border-radius: 36px;\n}\n.comp .prac .cen {\n  font-size: 1.3em;\n}\n.comp .prac div {\n  font-size: 1.1em;\n}\n.comp .disp {\n  display: inline;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 1.2em;\n}\n.comp .disp i {\n  display: inline-block;\n  margin-right: 0.25em;\n}\n.comp .disp .name {\n  display: inline-block;\n}\n.comp .disp .desc {\n  display: none;\n  margin: 0.5em 0.5em 0.5em 0.5em;\n  text-align: left;\n}\n.comp .area {\n  display: grid;\n  grid-template-columns: 6% 22% 72%;\n  grid-template-areas: \"icon name desc\";\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n  margin-left: 1.5em;\n  width: 90%;\n  height: auto;\n  font-size: 1.3em;\n}\n.comp .area i {\n  grid-area: icon;\n}\n.comp .area .name {\n  grid-area: name;\n  font-weight: 900;\n}\n.comp .area .desc {\n  grid-area: desc;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 2.4em !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 3em !important;\n  padding-bottom: 0;\n}\n.comp .none {\n  display: none;\n}\n.comp .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.comp .fullPracDir .prac {\n  font-size: 1em;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.comp .fullPracDir .prac div {\n  padding-bottom: 2em;\n}\n.comp .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.comp .fullPracDir .prac div .disp i {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .name {\n  font-size: 1.6em;\n}\n.comp .fullPracDir .prac div .disp .desc {\n  font-size: 1em;\n  display: block;\n}\n.comp .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n.comp .fullDispDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n  border-radius: 72px;\n}\n.comp .fullDispDir .disp {\n  justify-self: center;\n  margin: 0;\n}\n.comp .fullDispDir .disp i {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .name {\n  font-size: 4.8em !important;\n}\n.comp .fullDispDir .disp .desc {\n  font-size: 2.4em !important;\n  display: block;\n}\n.comp .fullDispDir .area {\n  font-size: 3em !important;\n  padding-bottom: 0;\n}\n.comp .em .prac .cen,\n.comp .in .prac .cen,\n.comp .en .prac .cen {\n  font-size: 1em;\n}\n.comp .row {\n  background-color: #603;\n  border-radius: 36px;\n  margin-left: 10%;\n  width: 80%;\n  height: 80%;\n  font-size: 1em;\n  font-weight: bold;\n  display: grid;\n}\n.comp .row div {\n  text-align: center;\n  justify-self: center;\n  align-self: center;\n  font-size: 1.8em;\n  color: wheat;\n}\n.comp .row i {\n  margin-bottom: 0.2em;\n  display: block;\n}\n","\n<template>\n  <div class=\"comp\">\n    <b-tabs></b-tabs>\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" :class=\"pracDir(prac.dir)\" :key=\"prac.name\">\n        <div class=\"prac\">\n          <div v-show=\"isDisp(prac.name)\" :class=\"dispDir('cen')\" :style=\"style(prac.hsv)\">\n            <div class=\"disp\" @click=\"pubPrac(prac.name)\">\n              <i   :class=\"prac.icon\"></i>\n              <span class=\"name\">{{prac.name}}</span>\n              <span class=\"desc\">{{prac.desc}}</span>\n            </div>\n          </div>\n          <template  v-for=\"disp in prac.disps\">\n            <div v-show=\"isDisp(disp.name)\" :class=\"dispDir(disp.dir)\" :style=\"style(disp.hsv)\">\n            <div class=\"disp\" @click=\"pubDisp(prac.name,disp.name)\">\n              <i   :class=\"disp.icon\"></i>\n              <span class=\"name\">{{disp.name}}</span>\n              <span class=\"desc\">{{disp.desc}}</span>\n            </div>\n            <template v-for=\"area in disp.areas\">\n              <div :class=\"areaDir()\">\n                <i :class=\"area.icon\"></i>\n                <span class=\"name\">{{area.name}}</span>\n                <span class=\"desc\">{{area.desc}}</span>\n              </div>\n            </template>\n          </div>\n          </template>\n        </div>\n      </div>\n    </template>\n    <template v-for=\"row in rows\">\n      <div v-show=\"isRows()\" :class=\"row.dir\" :key=\"row.name\"><div class=\"row\">\n        <div><i :class=\"row.icon\"></i>{{row.name}}</div></div></div>\n    </template>\n  </div>  \n</template>\n\n<script type=\"module\">\n\n  import Tabs from './Tabs.vue';\n\n  export default {\n    \n    components:{ 'b-tabs':Tabs },\n    \n    data() { return {\n      comp:'None', prac:'All', disp:'All', tab:'Practices', practices:{},\n      rows: {\n        Learn:{ name:'Learn', dir:'le', icon:\"fas fa-graduation-cap\" },\n        Do:{    name:'Do',    dir:'do', icon:\"fas fas fa-cogs\" },\n        Share:{ name:'Share', dir:'sh', icon:\"fas fa-share-alt-square\" } } } },\n    \n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      isDisp: function (disp) {\n        return this.disp===disp || this.disp==='All' },\n      isRows: function () {\n        return this.prac==='All' },\n      pubTab: function (tab) {\n        this.tab = tab },\n      classTab: function (tab) {\n        return this.tab===tab ? 'tab-active' : 'tab' },\n      pubPrac: function (prac) {\n        this.publish( this.comp, { prac:prac, disp:'All' } ); },\n      pubDisp: function (prac,disp) {\n        this.publish( this.comp, { prac:prac, disp:disp  } ); },\n      onPrac: function (prac) {\n        this.prac = prac; this.disp='All'; },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp=disp; },\n      onTabs: function (tab) {\n        this.tab = tab; },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'fullPracDir'; },\n      dispDir: function(dir) {\n        return this.disp==='All' ? dir : 'fullDispDir'; },\n      areaDir: function() {\n        return this.prac==='All' ? 'none' : 'area' },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; } },\n\n    beforeMount: function() {\n      console.log( 'Base.beforeMount()', this.$route.name );\n      this.comp = this.$route.name; },\n\n    mounted: function () {\n      this.practices = this.pracs(this.comp,'Cols');\n      this.subscribe(  this.comp, this.comp+'.vue', (obj) => {\n         if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n         else                   { this.onDisp(obj.prac,obj.disp); } } );\n      this.subscribe(  \"Tabs\",    this.comp+'.vue', (obj) => {\n        this.onTabs(obj); } ); }\n  }\n         \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../css/fontawesome/init.css';\n\n  .grid3x3() { display:grid; grid-template-columns:33% 33% 34%; grid-template-rows:33% 33% 34%;\n               grid-template-areas: \"nw north ne\" \"west cen east\" \"sw south se\"; }\n  \n  .grid4x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:13% 29% 29% 29%;\n    grid-template-areas: \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid5x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:7% 12% 27% 27% 27%;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid1x3() { display:grid; grid-template-columns:6% 22% 72%; grid-template-areas: \"icon name desc\"; }\n  \n  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n                  justify-items:center; align-items:center; }\n  \n  .ddir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch; border-radius:36px; }\n  \n  .bgc( @bg )\n    { background-color:@bg; } // top | right | bottom | left\n  \n  .comp { background-color:black; position:relative; font-size:1.75vmin;\n    \n    .grid5x4(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid\n      .tabs{ grid-area:tabs; display:inline; color:wheat; font-size:1.2em;\n             justify-self:start; align-self:center; text-align:left; }\n      .cm { .pdir(cm); } .em   { .pdir(em);   } .in    { .pdir(in); }    .en   { .pdir(en);   }\n      .le { .pdir(le); } .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n      .do { .pdir(do); } .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n      .sh { .pdir(sh); } .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n    \n      // Placed one level below the 9 Practices Grid\n    .prac { background-color:#603; border-radius:36px; width:90%; height:80%; font-size:1em; font-weight:bold;\n      .grid3x3(); // The 4 Displine plus Practiice name Grid\n                             .north { .ddir(north); }\n      .west { .ddir(west); } .cen   { .ddir(cen);   } .east { .ddir(east); }\n                             .south { .ddir(south); }\n      .cen  { font-size:1.3em; }\n      div   { font-size:1.1em; } }\n  \n    .disp {   display:inline; justify-self:center; align-self:center; text-align:center; font-size:1.2em;\n      i     { display:inline-block;  margin-right: 0.25em; }\n      .name { display:inline-block; }\n      .desc { display:none; margin:0.5em 0.5em 0.5em 0.5em; text-align:left; } }\n  \n    .area { .grid1x3(); justify-self:start; align-self:center; text-align:left; margin-left:1.5em;\n      width:90%; height:auto; font-size:1.3em;\n      i     { grid-area:icon; }\n      .name { grid-area:name; font-weight:900; }\n      .desc { grid-area:desc; } }\n  \n    .none { display:none; }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n      .disp { justify-self:center; margin:0;\n        i     { font-size:4.8em !important; }\n        .name { font-size:4.8em !important; }\n        .desc { font-size:2.4em !important; display:block; } }  // Turns on .disp .desc\n      .area {   font-size:3.0em !important; padding-bottom:0; } }\n  \n    .none { display:none; }\n    \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:1em; width:100%; height:100%;\n              justify-self:center; align-self:center; display:grid; border-radius:0.5em;\n        div {     padding-bottom:2em;\n          .disp { padding-bottom:0;\n            i     { font-size:1.6em; }\n            .name { font-size:1.6em; }\n            .desc { font-size:1.0em; display:block; } } }  // Turns on .disp .desc\n          .area { padding-bottom:0; } } }\n  \n    // Placed one level above .dir at the 4 Disipline plus Practice name Grid Direction\n    .fullDispDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid; border-radius:72px;\n       .disp { justify-self:center; margin:0;\n         i     { font-size:4.8em !important; }\n         .name { font-size:4.8em !important; }\n         .desc { font-size:2.4em !important; display:block; } }  // Turns on .disp .desc\n       .area {   font-size:3.0em !important; padding-bottom:0; } }\n    \n    .em, .in, .en { .prac .cen { font-size:1em; } } // Font size columns\n  \n    .row { background-color:#603; border-radius:36px; margin-left:10%; width:80%; height:80%; font-size:1em;\n      font-weight:bold; display:grid;\n      div { text-align:center; justify-self:center;  align-self:center; font-size:1.8em; color:wheat; }\n      i { margin-bottom: 0.2em; display:block; } }\n    \n    \n  }\n  \n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$b = undefined;
  /* module identifier */
  const __vue_module_identifier__$b = undefined;
  /* functional template */
  const __vue_is_functional_template__$b = false;
  /* style inject SSR */
  

  
  var Base = normalizeComponent_1(
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

var script$b = {
  extends: Base,
  beforeMount: function() {
    this.comp = 'Info'; } };

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
  

  
  var Info = normalizeComponent_1(
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
    this.comp = 'Know'; } };

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

var script$d = {
  extends: Base,
  beforeMount: function() {
    this.comp = 'Wise'; } };

/* script */
const __vue_script__$e = script$d;

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

var Util,
  indexOf = [].indexOf,
  hasProp = {}.hasOwnProperty;

Util = class Util {
  constructor() {
    this.dummy = "";
    Util.noop(Util.loadScript, Util.hasMethod, Util.dependsOn, Util.setInstance, Util.getInstance);
    Util.noop(Util.toError, Util.logJSON, Util.isNot, Util.isVal, Util.isntStr);
    Util.noop(Util.inIndex, Util.isEvent, Util.atArray, Util.atLength, Util.isStrInteger);
    Util.noop(Util.isStrCurrency, Util.isStrFloat, Util.isDefs, Util.toPosition, Util.xyScale);
    Util.noop(Util.resizeTimeout, Util.eventErrorCode, Util.toAlpha, Util.hashCode, Util.pdfCSS);
    Util.noop(Util.padStr, Util.isoDateTime, Util.toHMS, Util.toInt, Util.hex32);
    Util.noop(Util.toFloat, Util.toCap, Util.match_test, Util.svgId, Util.saveFile);
  }

  static element($elem) {
    // console.log( 'Dom.element()', $elem, Dom.isJQueryElem( $elem ) )
    if (Util.isJQueryElem($elem)) {
      return $elem.get(0);
    } else if (Util.isStr($elem)) {
      return $($elem).get(0);
    } else {
      console.error('Dom.domElement( $elem )', typeof $elem, $elem, '$elem is neither jQuery object nor selector');
      return $().get(0);
    }
  }

  static isJQueryElem($elem) {
    return (typeof $ !== "undefined" && $ !== null) && ($elem != null) && ($elem instanceof $ || indexOf.call(Object($elem), 'jquery') >= 0);
  }

  static loadScript(path, fn) {
    var head, script;
    head = document.getElementsByTagName('head')[0];
    script = document.createElement('script');
    script.src = path;
    script.async = false;
    if (Util.isFunc(fn)) {
      script.onload = fn;
    }
    head.appendChild(script);
  }

  static ready(fn) {
    if (!Util.isFunc(fn)) { // Sanity check
      return;
    } else if (Util.skipReady) {
      fn();
    } else if (document.readyState === 'complete') { // If document is already loaded, run method
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn, false);
    }
  }

  static isChild(key) {
    var a, b;
    a = key.charAt(0);
    b = key.charAt(key.length - 1);
    return a === a.toUpperCase() && a !== '$' && b !== '_';
  }

  // ---- Inquiry ----
  static hasMethod(obj, method, issue = false) {
    var has;
    has = typeof obj[method] === 'function';
    if (!has && issue) {
      console.log('Util.hasMethod()', method, has);
    }
    return has;
  }

  static hasGlobal(global, issue = true) {
    var has;
    has = window[global] != null;
    if (!has && issue) {
      console.error(`Util.hasGlobal() ${global} not present`);
    }
    return has;
  }

  static getGlobal(global, issue = true) {
    if (Util.hasGlobal(global, issue)) {
      return window[global];
    } else {
      return null;
    }
  }

  static hasModule(path, issue = true) {
    var has;
    has = Util.modules[path] != null;
    if (!has && issue) {
      console.error(`Util.hasModule() ${path} not present`);
    }
    return has;
  }

  static dependsOn() {
    var arg, has, j, len1, ok;
    ok = true;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      has = Util.hasGlobal(arg, false) || Util.hasModule(arg, false) || Util.hasPlugin(arg, false);
      if (!has) {
        console.error('Missing Dependency', arg);
      }
      if (has === false) {
        ok = has;
      }
    }
    return ok;
  }

  // ---- Instances ----
  static setInstance(instance, path) {
    console.log('Util.setInstance()', path);
    if ((instance == null) && (path != null)) {
      console.error('Util.setInstance() instance not defined for path', path);
    } else if ((instance != null) && (path == null)) {
      console.error('Util.setInstance() path not defined for instance', instance.toString());
    } else {
      Util.instances[path] = instance;
    }
  }

  static getInstance(path, dbg = false) {
    var instance;
    if (dbg) {
      console.log('getInstance', path);
    }
    instance = Util.instances[path];
    if (instance == null) {
      console.error('Util.getInstance() instance not defined for path', path);
    }
    return instance;
  }

  // ---- Logging -------

  // args should be the arguments passed by the original calling function
  // This method should not be called directly
  static toStrArgs(prefix, args) {
    var arg, j, len1, str;
    Util.logStackNum = 0;
    str = Util.isStr(prefix) ? prefix + " " : "";
    for (j = 0, len1 = args.length; j < len1; j++) {
      arg = args[j];
      str += Util.toStr(arg) + " ";
    }
    return str;
  }

  static toStr(arg) {
    Util.logStackNum++;
    if (Util.logStackNum > Util.logStackMax) {
      return '';
    }
    switch (typeof arg) {
      case 'null':
        return 'null';
      case 'string':
        return Util.toStrStr(arg);
      case 'number':
        return arg.toString();
      case 'object':
        return Util.toStrObj(arg);
      default:
        return arg;
    }
  }

  // Recusively stringify arrays and objects
  static toStrObj(arg) {
    var a, j, key, len1, str, val;
    str = "";
    if (arg == null) {
      str += "null";
    } else if (Util.isArray(arg)) {
      str += "[ ";
      for (j = 0, len1 = arg.length; j < len1; j++) {
        a = arg[j];
        str += Util.toStr(a) + ",";
      }
      str = str.substr(0, str.length - 1) + " ]";
    } else if (Util.isObjEmpty(arg)) {
      str += "{}";
    } else {
      str += "{ ";
      for (key in arg) {
        if (!hasProp.call(arg, key)) continue;
        val = arg[key];
        str += key + ":" + Util.toStr(val) + ", ";
      }
      str = str.substr(0, str.length - 2) + " }"; // Removes last comma
    }
    return str;
  }

  static toStrStr(arg) {
    if (arg.length > 0) {
      return arg;
    } else {
      return '""';
    }
  }

  static toOut(obj, level = 0) {
    var ind, key, out, val;
    ind = Util.indent(level * 2);
    out = "";
    for (key in obj) {
      if (!hasProp.call(obj, key)) continue;
      val = obj[key];
      if (!(key.charAt(0) === key.charAt(0).toUpperCase())) {
        continue;
      }
      out += ind + key + '\n';
      if (Util.isObj(val)) {
        out += Util.toOut(val, level + 1);
      }
    }
    return out;
  }

  // Consume unused but mandated variable to pass code inspections
  static noop(...args) {
  }

  static toError() {
    var str;
    str = Util.toStrArgs('Error:', arguments);
    return new Error(str);
  }

  static alert() {
    var str;
    str = Util.toStrArgs('', arguments);
    console.log(str);
    alert(str);
  }

  static logJSON(json) {
    var obj;
    obj = JSON.parse(json);
    console.log(obj);
  }

  static jQueryHasNotBeenLoaded() {
    if (typeof jQuery === 'undefined') {
      console.error('Util JQuery has not been loaded');
      return true;
    } else {
      return false;
    }
  }

  // ------ Validators ------
  static isDef(d) {
    return d !== null && typeof d !== 'undefined';
  }

  static isNot(d) {
    return !Util.isDef(d);
  }

  static isStr(s) {
    return Util.isDef(s) && typeof s === "string" && s.length > 0;
  }

  static isntStr(s) {
    return !Util.isStr(s);
  }

  static isNum(n) {
    return !isNaN(n);
  }

  static isObj(o) {
    return Util.isDef(o) && typeof o === "object";
  }

  static isVal(v) {
    return typeof v === "number" || typeof v === "string" || typeof v === "boolean";
  }

  static isNaN(v) {
    return Util.isDef(v) && typeof v === "number" && Number.isNaN(v);
  }

  static isSym(v) {
    return typeof v === "symbol";
  }

  static isObjEmpty(o) {
    return Util.isObj(o) && Object.getOwnPropertyNames(o).length === 0;
  }

  static isFunc(f) {
    return Util.isDef(f) && typeof f === "function";
  }

  static isArray(a) {
    return Util.isDef(a) && typeof a !== "string" && (a.length != null) && a.length > 0;
  }

  static isEvent(e) {
    return Util.isDef(e) && (e.target != null);
  }

  static inIndex(a, i) {
    return Util.isArray(a) && 0 <= i && i < a.length;
  }

  static inArray(a, e) {
    return Util.isArray(a) && a.indexOf(e) > -1;
  }

  static atArray(a, e) {
    if (Util.inArray(a, e)) {
      return a.indexOf(e);
    } else {
      return -1;
    }
  }

  static inString(s, e) {
    return Util.isStr(s) && s.indexOf(e) > -1;
  }

  static atLength(a, n) {
    return Util.isArray(a) && a.length === n;
  }

  static head(a) {
    if (Util.isArray(a)) {
      return a[0];
    } else {
      return null;
    }
  }

  static tail(a) {
    if (Util.isArray(a)) {
      return a[a.length - 1];
    } else {
      return null;
    }
  }

  static time() {
    return new Date().getTime();
  }

  static isStrInteger(s) {
    return /^\s*(\+|-)?\d+\s*$/.test(s);
  }

  static isStrFloat(s) {
    return /^\s*(\+|-)?((\d+(\.\d+)?)|(\.\d+))\s*$/.test(s);
  }

  static isStrCurrency(s) {
    return /^\s*(\+|-)?((\d+(\.\d\d)?)|(\.\d\d))\s*$/.test(s);
  }

  //@isStrEmail:(s)   -> /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/.test(s)
  static isDefs() {
    var arg, j, len1;
    for (j = 0, len1 = arguments.length; j < len1; j++) {
      arg = arguments[j];
      if (arg == null) {
        return false;
      }
    }
    return true;
  }

  static checkTypes(type, args) {
    var arg, key;
    for (key in args) {
      if (!hasProp.call(args, key)) continue;
      arg = args[key];
      // console.log( "Util.checkTypes isNum() argument #{key} is #{type}", arg, Util.isNum(arg) )
      if (!Util.checkType(type, arg)) {
        console.log(`Util.checkTypes(type,args) argument ${key} is not ${type}`, arg);
        console.trace();
      }
    }
  }

  static checkType(type, arg) {
    switch (type) {
      case "string":
        return Util.isStr(arg);
      case "number":
        return Util.isNum(arg);
      case "object":
        return Util.isObj(arg);
      case "symbol":
        return Util.isSym(arg);
      case "function":
        return Util.isFunc(arg);
      case "array":
        return Util.isArray(arg);
      default:
        return false;
    }
  }

  static copyProperties(to, from) {
    var key, val;
    for (key in from) {
      if (!hasProp.call(from, key)) continue;
      val = from[key];
      to[key] = val;
    }
    return to;
  }

  static contains(array, value) {
    return Util.isArray(array) && array.indexOf(value) !== -1;
  }

  // Screen absolute (left top width height) percent positioning and scaling

  // Percent array to position mapping
  static toPosition(array) {
    return {
      left: array[0],
      top: array[1],
      width: array[2],
      height: array[3]
    };
  }

  // Adds Percent from array for CSS position mapping
  static toPositionPc(array) {
    return {
      position: 'absolute',
      left: array[0] + '%',
      top: array[1] + '%',
      width: array[2] + '%',
      height: array[3] + '%'
    };
  }

  static xyScale(prev, next, port, land) {
    var xn, xp, xs, yn, yp, ys;
    xp = 0;
    yp = 0;
    xn = 0;
    yn = 0;
    [xp, yp] = prev.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    [xn, yn] = next.orientation === 'Portrait' ? [port[2], port[3]] : [land[2], land[3]];
    xs = next.width * xn / (prev.width * xp);
    ys = next.height * yn / (prev.height * yp);
    return [xs, ys];
  }

  // ----------------- Guarded jQuery dependent calls -----------------
  static resize(callback) {
    window.onresize = function() {
      return setTimeout(callback, 100);
    };
  }

  static resizeTimeout(callback, timeout = null) {
    window.onresize = function() {
      if (timeout != null) {
        clearTimeout(timeout);
      }
      return timeout = setTimeout(callback, 100);
    };
  }

  // ------ Html ------------
  static getHtmlId(name, type = '', ext = '') {
    var id;
    id = name + type + ext + Util.uniqueIdExt;
    return id.replace(/[ \.]/g, "");
  }

  static htmlId(name, type = '', ext = '', issueError = true) {
    var id;
    id = Util.getHtmlId(name, type, ext);
    if ((Util.htmlIds[id] != null) && issueError) {
      console.error('Util.htmlId() duplicate html id', id);
    }
    Util.htmlIds[id] = id;
    return id;
  }

  static clearHtmlIds() {
    return Util.htmlIds = {};
  }

  // ------ Converters ------
  static extend(obj, mixin) {
    var method, name;
    for (name in mixin) {
      if (!hasProp.call(mixin, name)) continue;
      method = mixin[name];
      obj[name] = method;
    }
    return obj;
  }

  static include(klass, mixin) {
    return Util.extend(klass.prototype, mixin);
  }

  static eventErrorCode(e) {
    var errorCode;
    errorCode = (e.target != null) && e.target.errorCode ? e.target.errorCode : 'unknown';
    return {
      errorCode: errorCode
    };
  }

  static toName(s1) {
    var s2, s3, s4, s5;
    if (s1 == null) {
      console.trace();
      return "???";
    }
    s2 = s1.replace('_', ' ');
    s3 = s2.replace(/([A-Z][a-z])/g, ' $1');
    s4 = s3.replace(/([A-Z]+)/g, ' $1');
    s5 = s4.replace(/([0-9][A-Z])/g, ' $1');
    return s5;
  }

  static toAlpha(s1) {
    return s1.replace(/\W/g, '');
  }

  static indent(n) {
    var i, j, ref, str;
    str = '';
    for (i = j = 0, ref = n; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      str += ' ';
    }
    return str;
  }

  static hashCode(str) {
    var hash, i, j, ref;
    hash = 0;
    for (i = j = 0, ref = str.length; (0 <= ref ? j < ref : j > ref); i = 0 <= ref ? ++j : --j) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
    }
    return hash;
  }

  static lastTok(str, delim) {
    return str.split(delim).pop();
  }

  static firstTok(str, delim) {
    if (Util.isStr(str) && (str.split != null)) {
      return str.split(delim)[0];
    } else {
      console.error("Util.firstTok() str is not at string", str);
      return '';
    }
  }

  static pdfCSS(href) {
    var link;
    if (!window.location.search.match(/pdf/gi)) {
      return;
    }
    link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = href;
    document.getElementsByTagName('head')[0].appendChild(link);
  }

  /*
  parse = document.createElement('a')
  parse.href =  "http://example.com:3000/dir1/dir2/file.ext?search=test#hash"
  parse.protocol  "http:"
  parse.hostname  "example.com"
  parse.port      "3000"
  parse.pathname  "/dir1/dir2/file.ext"
  parse.segments  ['dir1','dir2','file.ext']
  parse.fileExt   ['file','ext']
  parse.file       'file'
  parse.ext        'ext'
  parse.search    "?search=test"
  parse.hash      "#hash"
  parse.host      "example.com:3000"
  */
  static parseURI(uri) {
    var a, j, len1, name, nameValue, nameValues, parse, value;
    parse = {};
    parse.params = {};
    a = document.createElement('a');
    a.href = uri;
    parse.href = a.href;
    parse.protocol = a.protocol;
    parse.hostname = a.hostname;
    parse.port = a.port;
    parse.segments = a.pathname.split('/');
    parse.fileExt = parse.segments.pop().split('.');
    parse.file = parse.fileExt[0];
    parse.ext = parse.fileExt.length === 2 ? parse.fileExt[1] : '';
    parse.dbName = parse.file;
    parse.fragment = a.hash;
    parse.query = Util.isStr(a.search) ? a.search.substring(1) : '';
    nameValues = parse.query.split('&');
    if (Util.isArray(nameValues)) {
      for (j = 0, len1 = nameValues.length; j < len1; j++) {
        nameValue = nameValues[j];
        name = '';
        value = '';
        [name, value] = nameValue.split('=');
        parse.params[name] = value;
      }
    }
    return parse;
  }

  static quicksort(array) {
    var a, head, large, small;
    if (array.length === 0) {
      return [];
    }
    head = array.pop();
    small = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a <= head) {
          results.push(a);
        }
      }
      return results;
    })();
    large = (function() {
      var j, len1, results;
      results = [];
      for (j = 0, len1 = array.length; j < len1; j++) {
        a = array[j];
        if (a > head) {
          results.push(a);
        }
      }
      return results;
    })();
    return (Util.quicksort(small)).concat([head]).concat(Util.quicksort(large));
  }

  static pad(n) {
    if (n < 10) {
      return '0' + n;
    } else {
      return n;
    }
  }

  static padStr(n) {
    if (n < 10) {
      return '0' + n.toString();
    } else {
      return n.toString();
    }
  }

  // Return and ISO formated data string
  static isoDateTime(dateIn) {
    var date, pad;
    date = dateIn != null ? dateIn : new Date();
    console.log('Util.isoDatetime()', date);
    console.log('Util.isoDatetime()', date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes, date.getUTCSeconds);
    pad = function(n) {
      return Util.pad(n);
    };
    return date.getFullYear()(+'-' + pad(date.getUTCMonth() + 1) + '-' + pad(date.getUTCDate()) + 'T' + pad(date.getUTCHours()) + ':' + pad(date.getUTCMinutes()) + ':' + pad(date.getUTCSeconds()) + 'Z');
  }

  static toHMS(unixTime) {
    var ampm, date, hour, min, sec, time;
    date = new Date();
    if (Util.isNum(unixTime)) {
      date.setTime(unixTime);
    }
    hour = date.getHours();
    ampm = 'AM';
    if (hour > 12) {
      hour = hour - 12;
      ampm = 'PM';
    }
    min = ('0' + date.getMinutes()).slice(-2);
    sec = ('0' + date.getSeconds()).slice(-2);
    time = `${hour}:${min}:${sec} ${ampm}`;
    return time;
  }

  // Generate four random hex digits
  static hex4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  }

  // Generate a 32 bits hex
  static hex32() {
    var hex, i, j;
    hex = this.hex4();
    for (i = j = 1; j <= 4; i = ++j) {
      Util.noop(i);
      hex += this.hex4();
    }
    return hex;
  }

  // Return a number with fixed decimal places
  static toFixed(arg, dec = 2) {
    var num;
    num = (function() {
      switch (typeof arg) {
        case 'number':
          return arg;
        case 'string':
          return parseFloat(arg);
        default:
          return 0;
      }
    })();
    return num.toFixed(dec);
  }

  static toInt(arg) {
    switch (typeof arg) {
      case 'number':
        return Math.floor(arg);
      case 'string':
        return parseInt(arg);
      default:
        return 0;
    }
  }

  static toFloat(arg) {
    switch (typeof arg) {
      case 'number':
        return arg;
      case 'string':
        return parseFloat(arg);
      default:
        return 0;
    }
  }

  static toCap(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
  }

  static unCap(str) {
    return str.charAt(0).toLowerCase() + str.substring(1);
  }

  static toArray(objects, whereIn = null, keyField = 'id') {
    var array, j, key, len1, object, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    array = [];
    if (Util.isArray(objects)) {
      for (j = 0, len1 = array.length; j < len1; j++) {
        object = array[j];
        if (!(where(object))) {
          continue;
        }
        if ((object['id'] != null) && keyField !== 'id') {
          object[keyField] = object['id'];
        }
        array.push(object);
      }
    } else {
      for (key in objects) {
        if (!hasProp.call(objects, key)) continue;
        object = objects[key];
        if (!(where(key, object))) {
          continue;
        }
        object[keyField] = key;
        array.push(object);
      }
    }
    return array;
  }

  static toObjects(rows, whereIn = null, keyField = 'id') {
    var j, key, len1, objects, row, where;
    where = whereIn != null ? whereIn : function() {
      return true;
    };
    objects = {};
    if (Util.isArray(rows)) {
      for (j = 0, len1 = rows.length; j < len1; j++) {
        row = rows[j];
        if (!(where(row))) {
          continue;
        }
        if ((row['id'] != null) && keyField !== 'id') {
          row[keyField] = row['id'];
        }
        objects[row[keyField]] = row;
      }
    } else {
      for (key in rows) {
        row = rows[key];
        if (!(where(row))) {
          continue;
        }
        row[keyField] = key;
        objects[key] = row;
      }
    }
    return objects;
  }

  static lenObject(object, where = function() {
      return true;
    }) {
    var key, len, obj;
    len = 0;
    for (key in object) {
      if (!hasProp.call(object, key)) continue;
      obj = object[key];
      if (where(key)) {
        len = len + 1;
      }
    }
    return len;
  }

  // Beautiful Code, Chapter 1.
  // Implements a regular expression matcher that supports character matches,
  // '.', '^', '$', and '*'.

  // Search for the regexp anywhere in the text.
  static match(regexp, text) {
    if (regexp[0] === '^') {
      return Util.match_here(regexp.slice(1), text);
    }
    while (text) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      text = text.slice(1);
    }
    return false;
  }

  // Search for the regexp at the beginning of the text.
  static match_here(regexp, text) {
    var cur, next;
    cur = "";
    next = "";
    [cur, next] = [regexp[0], regexp[1]];
    if (regexp.length === 0) {
      return true;
    }
    if (next === '*') {
      return Util.match_star(cur, regexp.slice(2), text);
    }
    if (cur === '$' && !next) {
      return text.length === 0;
    }
    if (text && (cur === '.' || cur === text[0])) {
      return Util.match_here(regexp.slice(1), text.slice(1));
    }
    return false;
  }

  // Search for a kleene star match at the beginning of the text.
  static match_star(c, regexp, text) {
    while (true) {
      if (Util.match_here(regexp, text)) {
        return true;
      }
      if (!(text && (text[0] === c || c === '.'))) {
        return false;
      }
      text = text.slice(1);
    }
  }

  static match_test() {
    console.log(Util.match_args("ex", "some text"));
    console.log(Util.match_args("s..t", "spit"));
    console.log(Util.match_args("^..t", "buttercup"));
    console.log(Util.match_args("i..$", "cherries"));
    console.log(Util.match_args("o*m", "vrooooommm!"));
    return console.log(Util.match_args("^hel*o$", "hellllllo"));
  }

  static match_args(regexp, text) {
    return console.log(regexp, text, Util.match(regexp, text));
  }

  static svgId(name, type, svgType, check = false) {
    if (check) {
      return this.id(name, type, svgType);
    } else {
      return name + type + svgType;
    }
  }

  static css(name, type = '') {
    return name + type;
  }

  static icon(name, type, fa) {
    return name + type + ' fa fa-' + fa;
  }

  // json - "application/json;charset=utf-8"
  // svg
  static mineType(fileType) {
    var mine;
    mine = (function() {
      switch (fileType) {
        case 'json':
          return "application/json";
        case 'adoc':
          return "text/plain";
        case 'html':
          return "text/html";
        case 'svg':
          return "image/svg+xml";
        default:
          return "text/plain";
      }
    })();
    mine += ";charset=utf-8";
    return mine;
  }

  static saveFile(stuff, fileName, fileType) {
    var blob, downloadLink, url;
    blob = new Blob([stuff], {
      type: this.mineType(fileType)
    });
    url = window['URL'].createObjectURL(blob);
    downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

// Static class variables have to be declared outside of class declarion to avoid function wrapper
Util.htmlIds = {}; // Object of unique Html Ids

Util.myVar = 'myVar';

Util.skipReady = false;

Util.modules = [];

Util.instances = [];

Util.logStackNum = 0;

Util.logStackMax = 100;

Util.fills = {};

Util.uniqueIdExt = '';

var Util$1 = Util;

var Data,
  hasProp$1 = {}.hasOwnProperty;

Data = class Data {
  // Util.noop( Data.hosted, Data.planeData, Data.refine, Data.asyncJSON )
  static refine(data, type) {
    var akey, area, base, bkey, ckey, comp, disp, dkey, ikey, item, pkey, prac;
    if (type === 'None') {
      return data;
    }
    data.comps = {};
    for (ckey in data) {
      comp = data[ckey];
      if (!(Util$1.isChild(ckey))) {
        continue;
      }
      // console.log( 'Data.refine comp', comp )
      data.comps[ckey] = comp;
      if (comp['name'] == null) {
        comp['name'] = ckey;
      }
      comp.pracs = {};
      for (pkey in comp) {
        prac = comp[pkey];
        if (!(Util$1.isChild(pkey))) {
          continue;
        }
        // console.log( '  Data.refine prac', prac )
        comp.pracs[pkey] = prac;
        prac.comp = comp;
        if (prac['name'] == null) {
          prac['name'] = pkey;
        }
        prac.disps = {};
        for (dkey in prac) {
          disp = prac[dkey];
          if (!(Util$1.isChild(dkey))) {
            continue;
          }
          prac.disps[dkey] = disp;
          disp.prac = prac;
          if (disp['name'] == null) {
            disp['name'] = dkey;
          }
          disp.areas = {};
          for (akey in disp) {
            area = disp[akey];
            if (!(Util$1.isChild(akey))) {
              continue;
            }
            disp.areas[akey] = area;
            area.disp = disp;
            if (area['name'] == null) {
              area['name'] = akey;
            }
            area.items = {};
            for (ikey in area) {
              item = area[ikey];
              if (!(Util$1.isChild(ikey))) {
                continue;
              }
              area.items[ikey] = item;
              item.area = area;
              if (item['name'] == null) {
                item['name'] = ikey;
              }
              item.bases = {};
              for (bkey in item) {
                base = item[bkey];
                if (!(Util$1.isChild(bkey))) {
                  continue;
                }
                item.bases[bkey] = base;
                base.item = item;
                if (base['name'] == null) {
                  base['name'] = bkey;
                }
              }
            }
          }
        }
      }
    }
    return data;
  }

  // ---- Read JSON with batch async
  static batchRead(batch, callback, create = null) {
    var key, obj;
    for (key in batch) {
      if (!hasProp$1.call(batch, key)) continue;
      obj = batch[key];
      this.batchJSON(obj, batch, callback, create);
    }
  }

  static batchComplete(batch) {
    var key, obj;
    for (key in batch) {
      if (!hasProp$1.call(batch, key)) continue;
      obj = batch[key];
      if (!obj['data']) {
        return false;
      }
    }
    return true;
  }

  static batchJSON(obj, batch, callback, refine = null) {
    var url;
    url = Data.baseUrl() + obj.url;
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      obj['data'] = Util$1.isFunc(refine) ? refine(data, obj.type) : data;
      if (Data.batchComplete(batch)) {
        return callback(batch);
      }
    }).catch((error) => {
      return console.error("Data.batchJSON()", {
        url: url,
        error: error
      });
    });
  }

  static asyncJSON(url, callback) {
    url = Data.baseUrl() + url;
    fetch(url).then((response) => {
      return response.json();
    }).then((data) => {
      return callback(data);
    }).catch((error) => {
      return console.error("Data.asyncJSON()", {
        url: url,
        error: error
      });
    });
  }

  static planeData(batch, plane) {
    return batch[plane].data[plane];
  }

  static baseUrl() {
    if (window.location.href.includes('localhost')) {
      return Data.local;
    } else {
      return Data.hosted;
    }
  }

  // ------ Quick JSON read ------
  static read(url, callback) {
    if (Util$1.isObj(url)) {
      Data.readFile(url, callback);
    } else {
      Data.asynsJson(url, callback);
    }
  }

  static readFile(fileObj, doJson) {
    var fileReader;
    fileReader = new FileReader();
    fileReader.onerror = function(e) {
      return console.error('Store.readFile', fileObj.name, e.target.error);
    };
    fileReader.onload = function(e) {
      return doJson(JSON.parse(e.target.result));
    };
    fileReader.readAsText(fileObj);
  }

  static saveFile(data, fileName) {
    var downloadLink, htmlBlob, htmlUrl;
    htmlBlob = new Blob([data], {
      type: "text/html;charset=utf-8"
    });
    htmlUrl = window['URL'].createObjectURL(htmlBlob);
    downloadLink = document.createElement("a");
    downloadLink.href = htmlUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

Data.local = "http://localhost:63342/aug/app/data/";

Data.hosted = "https://ui-48413.firebaseapp.com/";

var Data$1 = Data;

var Build,
  hasProp$2 = {}.hasOwnProperty;

Build = class Build {
  // ---- Class Methods for Practices ----
  static create(data, type) {
    switch (type) {
      case 'Pack':
        return Build.createPacks(data);
      case 'Prac':
        return Build.createPracs(data);
      default:
        return data;
    }
  }

  static createPacks(data) {
    var key, pack;
    for (key in data) {
      pack = data[key];
      if (!(Util$1.isChild(key))) {
        continue;
      }
      if (pack['name'] == null) {
        pack['name'] = key;
      }
      Build.createPracs(pack);
    }
    return data;
  }

  static createPracs(data) {
    var base, bkey, ikey, item, pkey, pract, skey, study, tkey, topic;
    for (pkey in data) {
      pract = data[pkey];
      if (!(Util$1.isChild(pkey))) {
        continue;
      }
      if (pract['name'] == null) {
        pract['name'] = pkey;
      }
      for (skey in pract) {
        study = pract[skey];
        if (!(Util$1.isChild(skey))) {
          continue;
        }
        if (study['name'] == null) {
          study['name'] = skey;
        }
        for (tkey in study) {
          topic = study[tkey];
          if (!(Util$1.isChild(tkey))) {
            continue;
          }
          if (topic['name'] == null) {
            topic['name'] = tkey;
          }
          for (ikey in topic) {
            item = topic[ikey];
            if (!(Util$1.isChild(ikey))) {
              continue;
            }
            if (item['name'] == null) {
              item['name'] = ikey;
            }
            for (bkey in item) {
              base = item[bkey];
              if (Util$1.isChild(bkey)) {
                if (base['name'] == null) {
                  base['name'] = bkey;
                }
              }
            }
          }
        }
      }
    }
    return data;
  }

  static colPractices(batch) {
    var cols, i, len, plane, ref;
    cols = batch.Cols.data['Cols'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      plane = ref[i];
      batch[plane].data['Cols'] = cols;
    }
  }

  static rowPractices(batch) {
    var i, len, plane, ref, rows;
    rows = batch.Rows.data['Rows'];
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      plane = ref[i];
      batch[plane].data['Rows'] = rows;
    }
  }

  static copyAtt(src, des) {
    var key, obj;
    for (key in src) {
      if (!hasProp$2.call(src, key)) continue;
      obj = src[key];
      if (!Util$1.isChild(key)) {
        des[key] = obj;
      }
    }
    return des;
  }

  // for dir in [ 'west', 'north', 'east', 'south'   ]
  // Call after all practices and studies have been read in
  // Not used because we store studies with practices in /pract
  static expandStudys(groups, studies) {
    var gkey, group, pkey, pract, skey, study;
    for (gkey in groups) {
      group = groups[gkey];
      if (Util$1.isChild(gkey)) {
        for (pkey in group) {
          pract = group[pkey];
          if (Util$1.isChild(pkey)) {
            for (skey in pract) {
              study = pract[skey];
              if (Util$1.isChild(skey)) {
                if (studies[skey] != null) {
                  pract[skey] = studies[skey];
                }
              }
            }
          }
        }
      }
    }
  }

  // Call after all practices and topics have been read in
  static expandTopics(groups, topics, log = false) {
    var gkey, group, pkey, pract, skey, study, tkey, topic;
    for (gkey in groups) {
      group = groups[gkey];
      if (!(Util$1.isChild(gkey))) {
        continue;
      }
      if (log) {
        console.log(gkey);
      }
      for (pkey in group) {
        pract = group[pkey];
        if (!(Util$1.isChild(pkey))) {
          continue;
        }
        if (log) {
          console.log("  ", pkey);
        }
        for (skey in pract) {
          study = pract[skey];
          if (!(Util$1.isChild(skey))) {
            continue;
          }
          if (log) {
            console.log("    ", skey);
          }
          for (tkey in study) {
            topic = study[tkey];
            if (Util$1.isChild(tkey)) {
              if (topics[tkey] != null) {
                if (log) {
                  console.log("      ", tkey, "match");
                }
                if (topics[tkey]['name'] == null) {
                  topics[tkey]['name'] = tkey;
                }
                study[tkey] = topics[tkey];
              } else {
                if (log) {
                  console.log("      ", tkey);
                }
              }
            }
          }
        }
      }
    }
  }

  // Build instance
  constructor(batch1, plane1) {
    this.batch = batch1;
    this.plane = plane1;
    //@Spec   = @batch.Muse.data
    this.None = {
      name: "None"
    };
    Util$1.noop(this.toGroups, this.setAdjacents, Build.copyAtt);
  }

  getSpecs(plane) {
    if (this.batch[plane] != null) {
      return this.batch[plane].data;
    } else {
      console.error(`Build.getSpecs() ${plane}.json has not been input`);
      return null;
    }
  }

  toGroups(groups) {
    var group, key;
    for (key in groups) {
      group = groups[key];
      group['key'] = key;
      group['name'] = group.name != null ? group.name : key;
      group['border'] = group['border'] != null ? group['border'] : '0';
    }
    return groups;
  }

  toStudies(prac) {
    var skey, studies, study;
    studies = {};
    for (skey in prac) {
      study = prac[skey];
      if (Util$1.isChild(skey)) {
        studies[skey] = study;
      }
    }
    return this.toOrder(studies);
  }

  toOrder(studies, dirs = ['north', 'west', 'east', 'south']) {
    var dir, i, len, ordered, skey, study;
    ordered = {};
    for (i = 0, len = dirs.length; i < len; i++) {
      dir = dirs[i];
      for (skey in studies) {
        study = studies[skey];
        if (study.dir === dir) {
          ordered[skey] = study;
        }
      }
    }
    return ordered;
  }

  combine() {
    var arg, i, key, len, obj, val;
    obj = {};
    for (i = 0, len = arguments.length; i < len; i++) {
      arg = arguments[i];
      for (key in arg) {
        if (!hasProp$2.call(arg, key)) continue;
        val = arg[key];
        obj[key] = val;
      }
    }
    return obj;
  }

  west(col) {
    switch (col) {
      case 'Embrace':
        return 'None';
      case 'Innovate':
        return 'Embrace';
      case 'Encourage':
        return 'Innovate';
      default:
        return 'None';
    }
  }

  east(col) {
    switch (col) {
      case 'Embrace':
        return 'Innovate';
      case 'Innovate':
        return 'Encourage';
      case 'Encourage':
        return 'None';
      default:
        return 'None';
    }
  }

  north(row) {
    switch (row) {
      case 'Learn':
        return 'None';
      case 'Do':
        return 'Learn';
      case 'Share':
        return 'Do';
      default:
        return 'None';
    }
  }

  south(row) {
    switch (row) {
      case 'Learn':
        return 'Do';
      case 'Do':
        return 'Share';
      case 'Share':
        return 'None';
      default:
        return 'None';
    }
  }

  prev(plane) {
    switch (plane) {
      case 'Info':
        return 'None';
      case 'Know':
        return 'Info';
      case 'Wise':
        return 'Know';
      default:
        return 'None';
    }
  }

  next(plane) {
    switch (plane) {
      case 'Info':
        return 'Know';
      case 'Know':
        return 'Wise';
      case 'Wise':
        return 'None';
      default:
        return 'None';
    }
  }

  adjacentPractice(prac, dir) {
    var adj, col, key, pln, pracs, row;
    if ((prac == null) || (prac.name == null) || prac.name === 'None' || (prac.column == null)) {
      // console.log( 'adjacentPractice', { prac:prac, dir:dir } )
      return this.None;
    }
    col = "";
    row = "";
    pln = "";
    [col, row, pln] = (function() {
      switch (dir) {
        case 'west':
        case 'nw':
        case 'sw':
          return [this.west(prac.column), prac.row, prac.plane];
        case 'east':
        case 'sw':
        case 'se':
          return [this.east(prac.column), prac.row, prac.plane];
        case 'north':
          return [prac.column, this.north(prac.row), prac.plane];
        case 'south':
          return [prac.column, this.south(prac.row), prac.plane];
        case 'prev':
          return [prac.column, prac.row, this.prev(prac.plane)];
        case 'next':
          return [prac.column, prac.row, this.next(prac.plane)];
        default:
          return ["None", "None", "None"];
      }
    }).call(this);
    if ([col, row, pln] === ["None", "None", "None"]) {
      //console.log( 'adjacentPractice[col,row,pln]', [col,row,pln] )
      return this.None;
    }
    pracs = this.getPractices(pln);
    for (key in pracs) {
      if (!hasProp$2.call(pracs, key)) continue;
      adj = pracs[key];
      if (Util$1.isChild(key)) {
        if (adj.column === col && adj.row === row && adj.plane === pln) {
          return adj;
        }
      }
    }
    return this.None;
  }

  adjacentStudies(practice, dir) {
    var adjPrac;
    adjPrac = this.adjacentPractice(practice, dir);
    if (adjPrac.name !== 'None') {
      return this.toStudies(adjPrac);
    } else {
      return {};
    }
  }

  connectName(practice, dir, reverse) {
    var adjacent;
    adjacent = this.adjacentPractice(practice, dir);
    if (adjacent.name !== 'None') {
      return this.centerBegEnd(practice.name, adjacent.name, reverse);
    } else {
      return 'None' + '\n' + 'None';
    }
  }

  centerBegEnd(beg, end, reverse) {
    var b, e;
    b = end.length > beg.length ? Util$1.indent((end.length - beg.length) / 2) + beg : beg;
    e = beg.length > end.length ? Util$1.indent((beg.length - end.length) / 2) + end : end;
    // console.log( 'Build.centerBegEnd()', { beg:beg, end:end, blen:beg.length, elen:end.length, b:b, e:e,be:b+'\n'+e })
    if (!reverse) {
      return b + '\n' + e;
    } else {
      return e + '\n' + b;
    }
  }

  setAdjacents(practice) {
    practice.west = this.adjacentPractice(practice, 'west');
    practice.east = this.adjacentPractice(practice, 'east');
    practice.north = this.adjacentPractice(practice, 'north');
    practice.south = this.adjacentPractice(practice, 'south');
    practice.prev = this.adjacentPractice(practice, 'prev');
    practice.next = this.adjacentPractice(practice, 'next');
  }

  getPractices(plane) {
    if ((this.batch[plane] != null) && (this.batch[plane].data[plane] != null)) {
      return this.batch[plane].data[plane];
    } else {
      console.error('Build.getPractices()', plane);
      return {};
    }
  }

  getPractice(row, column, plane = this.plane) {
    var pkey, prac, practices;
    practices = this.getPractices(plane);
    for (pkey in practices) {
      if (!hasProp$2.call(practices, pkey)) continue;
      prac = practices[pkey];
      if (Util$1.isChild(pkey) && prac.column === column && prac.row === row) {
        return prac;
      }
    }
    console.error('Prac.getPractice() practice not found for', {
      column: column,
      row: row,
      plane: plane
    });
    return null; // Landmine
  }

  getPracticeStudy(row, column, dir, plane = this.plane) {
    var practice, study;
    practice = this.getPractice(row, column, plane);
    study = this.getDir(practice, dir);
    return study;
  }

  getDir(practice, dir) {
    var skey, study;
    for (skey in practice) {
      if (!hasProp$2.call(practice, skey)) continue;
      study = practice[skey];
      if (Util$1.isChild(skey)) {
        if (study.dir === dir) {
          return study;
        }
      }
    }
    return null;
  }

  getDim(cname, dir) {
    var col, dim, key;
    col = this.getCol(cname);
    for (key in col) {
      dim = col[key];
      if (Util$1.isChild(key)) {
        if (dim.dir === dir) {
          return key;
        }
      }
    }
    return this.None;
  }

  getCol(cname) {
    return this.batch.Cols.data['Cols'][cname];
  }

  logPlanes() {
    var i, keyBase, keyItem, keyPlane, keyPractice, keyStudy, keyTopic, len, objBase, objItem, objPractice, objStudy, objTopic, practices, ref;
    console.log('----- Beg Log Planes  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      keyPlane = ref[i];
      console.log("Plane: ", keyPlane);
      practices = this.getPractices(keyPlane);
      for (keyPractice in practices) {
        if (!hasProp$2.call(practices, keyPractice)) continue;
        objPractice = practices[keyPractice];
        if (!(Util$1.isChild(keyPractice))) {
          continue;
        }
        console.log("  Practice: ", keyPractice);
        for (keyStudy in objPractice) {
          if (!hasProp$2.call(objPractice, keyStudy)) continue;
          objStudy = objPractice[keyStudy];
          if (!(Util$1.isChild(keyStudy))) {
            continue;
          }
          console.log("    Study: ", keyStudy);
          for (keyTopic in objStudy) {
            if (!hasProp$2.call(objStudy, keyTopic)) continue;
            objTopic = objStudy[keyTopic];
            if (!(Util$1.isChild(keyTopic))) {
              continue;
            }
            console.log("      Topic: ", keyTopic);
            for (keyItem in objTopic) {
              if (!hasProp$2.call(objTopic, keyItem)) continue;
              objItem = objTopic[keyItem];
              if (!(Util$1.isChild(keyItem))) {
                continue;
              }
              console.log("        Item: ", keyItem);
              for (keyBase in objItem) {
                if (!hasProp$2.call(objItem, keyBase)) continue;
                objBase = objItem[keyBase];
                if (Util$1.isChild(keyBase)) {
                  console.log("          Base: ", keyBase);
                }
              }
            }
          }
        }
      }
    }
    console.log('----- End Log Planes ------');
  }

  logBatch(batch) {
    var batKey, batObj, i, j, keyPractice, keyStudy, len, len1, objPractice, objStudy, packKey, packObj, ref, ref1;
    console.log('----- Beg Log Batch  ------');
    ref = ['Info', 'Know', 'Wise'];
    for (i = 0, len = ref.length; i < len; i++) {
      batKey = ref[i];
      console.log("Batch File: ", batKey);
      batObj = batch[batKey].data;
      ref1 = ['Info', 'Know', 'Wise', 'Cols', 'Rows'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        packKey = ref1[j];
        packObj = batObj[packKey];
        console.log("  Pack: ", packKey, packObj);
        for (keyPractice in packObj) {
          if (!hasProp$2.call(packObj, keyPractice)) continue;
          objPractice = packObj[keyPractice];
          if (!(Util$1.isChild(keyPractice))) {
            continue;
          }
          console.log("    Practice: ", keyPractice);
          for (keyStudy in objPractice) {
            if (!hasProp$2.call(objPractice, keyStudy)) continue;
            objStudy = objPractice[keyStudy];
            if (Util$1.isChild(keyStudy)) {
              console.log("      Study: ", keyStudy);
            }
          }
        }
      }
    }
    console.log('----- End Log Batch ------');
  }

  logByConduit() {
    var col, dir, i, infod, infop, j, k, knowd, knowp, len, len1, len2, ref, ref1, ref2, row, wised, wisep;
    console.log('----- Beg Log By Conduit  ------');
    ref = ['Learn', 'Do', 'Share'];
    for (i = 0, len = ref.length; i < len; i++) {
      row = ref[i];
      ref1 = ['Embrace', 'Innovate', 'Encourage'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        col = ref1[j];
        infop = this.getPractice(row, col, 'Info');
        knowp = this.getPractice(row, col, 'Know');
        wisep = this.getPractice(row, col, 'Wise');
        console.log(infop.name, knowp.name, wisep.name);
        ref2 = ['west', 'north', 'east', 'south'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          dir = ref2[k];
          infod = this.getDir(infop, dir);
          knowd = this.getDir(knowp, dir);
          wised = this.getDir(wisep, dir);
          console.log('    ', infod.name, knowd.name, wised.name);
        }
      }
    }
    console.log('----- End Log By Conduit  ------');
  }

  logByColumn() {
    var cname, dim, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, plane, ref, ref1, ref2, share, sprac;
    console.log('----- Beg Log By Column  ------');
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      cname = ref[i];
      console.log(cname);
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        dim = this.getDim(cname, dir);
        console.log('  ', dir, dim.name, 'Learn', 'Do', 'Share');
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          plane = ref2[k];
          lprac = this.getPractice('Learn', cname, plane);
          dprac = this.getPractice('Do', cname, plane);
          sprac = this.getPractice('Share', cname, plane);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          console.log('    ', plane + ':', dim.name, learn.name, doit.name, share.name);
        }
      }
    }
    console.log('----- End Log By Column  ------');
  }

  logAsTable() {
    var cname, dim, dir, doit, dprac, i, j, k, learn, len, len1, len2, lprac, obj, plane, ref, ref1, ref2, share, sprac;
    console.log('----- Beg Log As Table  ------');
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      cname = ref[i];
      console.log(col);
      obj = {};
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        dim = this.getDim(cname, dir);
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          plane = ref2[k];
          lprac = this.getPractice('Learn', cname, plane);
          dprac = this.getPractice('Do', cname, plane);
          sprac = this.getPractice('Share', cname, plane);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          obj[plane] = {
            Dimension: dim.name,
            Learn: learn.name,
            Do: doit.name,
            Share: share.name
          };
        }
      }
      // data.push( [ pln, prin, learn.name, doit.name, share.name ] )
      // console.table( data, ['Plane','Principle','Learn', 'Do', 'Share'])
      console.table(obj);
    }
    console.log('----- End Log As Table  ------');
  }

  saveAsHtml(name) {
    var col, dim, dir, doit, dprac, htm, i, j, k, learn, len, len1, len2, lprac, plane, ref, ref1, ref2, share, sprac;
    htm = `<!DOCTYPE html>\n<html lang="en">\n  <head><meta charset="utf-8">\n    <title>${name}</title>`;
    htm += `\n    <link href="${name}.css" rel="stylesheet" type="text/css"/>\n  </head>\n  <body>\n`;
    ref = ['Embrace', 'Innovate', 'Encourage'];
    for (i = 0, len = ref.length; i < len; i++) {
      col = ref[i];
      htm += `    <div class="col">${col}</div>\n`;
      ref1 = ['west', 'north', 'east', 'south'];
      for (j = 0, len1 = ref1.length; j < len1; j++) {
        dir = ref1[j];
        dim = this.getDim(col, dir);
        htm += "    <table>\n      <thead>\n        ";
        htm += `<tr><th>Plane</th><th>${dim}</th><th>Learn</th><th>Do</th><th>Share</th></tr>\n      </thead>\n      <tbody>\n`;
        ref2 = ['Info', 'Know', 'Wise'];
        for (k = 0, len2 = ref2.length; k < len2; k++) {
          plane = ref2[k];
          lprac = this.getPractice('Learn', col, plane);
          dprac = this.getPractice('Do', col, plane);
          sprac = this.getPractice('Share', col, plane);
          learn = this.getDir(lprac, dir);
          doit = this.getDir(dprac, dir);
          share = this.getDir(sprac, dir);
          htm += `        <tr><td>${plane}:</td><td>${dim}</td><td>${learn.name}</td><td>${doit.name}</td><td>${share.name}</td></tr>\n`;
        }
        htm += "      </tbody>\n    </table>\n";
      }
    }
    htm += "  </body>\n</html>\n";
    Data$1.saveHtml(name, htm);
  }

};

/*
getPrevNextPlanes:( plane ) ->

isPractice:( key, plane=@plane ) ->
@getPractices(plane)[key]?

logAdjacentPractices:() ->
@setAdjacents( @None )
for key, plane of @Planes
practices = @getPractices( key )
for own pkey, p of practices  when Util.isChild(pkey)
  @setAdjacents( p )
 * console.log( { p:key, column:p.column, west:p.west.name, east:p.east.name, north:p.north.name, south:p.south.name, prev:p.prev.name, next:p.next.name } )
return

 */
var Build$1 = Build;

var FaLookup;

FaLookup = {};

FaLookup.icons = {
  "fas fa-network-wired": "\uf6ff",
  "fas fa-warehouse": "\uf494",
  "fas fa-infinity": "\uf534",
  "fas fa-satellite": "\uf7bf",
  "fas fa-hands": "\uf4c2",
  "fas fa-chalkboard-teacher": "\uf51c",
  "fas fa-landmark": "\uf66f",
  "fas fa-podcast": "\uf2ce",
  "fas fa-hot-tub": "\uf593",
  "fas fa-brain": "\uf5dc",
  "fas fa-pen-fancy": "\uf5ac",
  "fas fa-shapes": "\uf61f",
  "fas fa-images": "\uf302",
  "fas fa-people-carry": "\uf4ce",
  "fas fa-poll": "\uf681",
  "fas fa-user-graduate": "\uf501",
  "fab fa-galactic-republic": "\uf50c",
  "fas fa-address-book": "\uf2b9",
  "fas fa-address-card": "\uf2bb",
  "fas fa-adjust": "\uf042",
  "fas fa-align-center": "\uf037",
  "fas fa-align-justify": "\uf039",
  "fas fa-align-left": "\uf036",
  "fas fa-align-right": "\uf038",
  "fas fa-allergies": "\uf461",
  "fas fa-ambulance": "\uf0f9",
  "fas fa-american-sign-language-interpreting": "\uf2a3",
  "fas fa-anchor": "\uf13d",
  "fas fa-angle-double-down": "\uf103",
  "fas fa-angle-double-left": "\uf100",
  "fas fa-angle-double-right": "\uf101",
  "fas fa-angle-double-up": "\uf102",
  "fas fa-angle-down": "\uf107",
  "fas fa-angle-left": "\uf104",
  "fas fa-angle-right": "\uf105",
  "fas fa-angle-up": "\uf106",
  "fas fa-archive": "\uf187",
  "fas fa-arrow-alt-circle-down": "\uf358",
  "fas fa-arrow-alt-circle-left": "\uf359",
  "fas fa-arrow-alt-circle-right": "\uf35a",
  "fas fa-arrow-alt-circle-up": "\uf35b",
  "fas fa-arrow-circle-down": "\uf0ab",
  "fas fa-arrow-circle-left": "\uf0a8",
  "fas fa-arrow-circle-right": "\uf0a9",
  "fas fa-arrow-circle-up": "\uf0aa",
  "fas fa-arrow-down": "\uf063",
  "fas fa-arrow-left": "\uf060",
  "fas fa-arrow-right": "\uf061",
  "fas fa-arrow-up": "\uf062",
  "fas fa-arrows-alt": "\uf0b2",
  "fas fa-arrows-alt-h": "\uf337",
  "fas fa-arrows-alt-v": "\uf338",
  "fas fa-assistive-listening-systems": "\uf2a2",
  "fas fa-asterisk": "\uf069",
  "fas fa-at": "\uf1fa",
  "fas fa-atom": "\uf5d2",
  "fas fa-atom fa-spin": "\uf5d2",
  "fas fa-audio-description": "\uf29e",
  "fas fa-backward": "\uf04a",
  "fas fa-balance-scale": "\uf24e",
  "fas fa-ban": "\uf05e",
  "fas fa-band-aid": "\uf462",
  "fas fa-barcode": "\uf02a",
  "fas fa-bars": "\uf0c9",
  "fas fa-baseball-ball": "\uf433",
  "fas fa-basketball-ball": "\uf434",
  "fas fa-bath": "\uf2cd",
  "fas fa-battery-empty": "\uf244",
  "fas fa-battery-full": "\uf240",
  "fas fa-battery-half": "\uf242",
  "fas fa-battery-quarter": "\uf243",
  "fas fa-battery-three-quarters": "\uf241",
  "fas fa-bed": "\uf236",
  "fas fa-beer": "\uf0fc",
  "fas fa-bell": "\uf0f3",
  "fas fa-bell-slash": "\uf1f6",
  "fas fa-bicycle": "\uf206",
  "fas fa-binoculars": "\uf1e5",
  "fas fa-birthday-cake": "\uf1fd",
  "fas fa-blind": "\uf29d",
  "fas fa-bold": "\uf032",
  "fas fa-bolt": "\uf0e7",
  "fas fa-bomb": "\uf1e2",
  "fas fa-book": "\uf02d",
  "fas fa-bookmark": "\uf02e",
  "fas fa-bowling-ball": "\uf436",
  "fas fa-box": "\uf466",
  "fas fa-box-open": "\uf49e",
  "fas fa-boxes": "\uf468",
  "fas fa-braille": "\uf2a1",
  "fas fa-briefcase": "\uf0b1",
  "fas fa-briefcase-medical": "\uf469",
  "fas fa-bug": "\uf188",
  "fas fa-building": "\uf1ad",
  "fas fa-bullhorn": "\uf0a1",
  "fas fa-bullseye": "\uf140",
  "fas fa-burn": "\uf46a",
  "fas fa-bus": "\uf207",
  "fas fa-calculator": "\uf1ec",
  "fas fa-calendar": "\uf133",
  "fas fa-calendar-alt": "\uf073",
  "fas fa-calendar-check": "\uf274",
  "fas fa-calendar-minus": "\uf272",
  "fas fa-calendar-plus": "\uf271",
  "fas fa-calendar-times": "\uf273",
  "fas fa-camera": "\uf030",
  "fas fa-camera-retro": "\uf083",
  "fas fa-capsules": "\uf46b",
  "fas fa-car": "\uf1b9",
  "fas fa-caret-down": "\uf0d7",
  "fas fa-caret-left": "\uf0d9",
  "fas fa-caret-right": "\uf0da",
  "fas fa-caret-square-down": "\uf150",
  "fas fa-caret-square-left": "\uf191",
  "fas fa-caret-square-right": "\uf152",
  "fas fa-caret-square-up": "\uf151",
  "fas fa-caret-up": "\uf0d8",
  "fas fa-cart-arrow-down": "\uf218",
  "fas fa-cart-plus": "\uf217",
  "fas fa-certificate": "\uf0a3",
  "fas fa-chart-area": "\uf1fe",
  "fas fa-chart-bar": "\uf080",
  "fas fa-chart-line": "\uf201",
  "fas fa-chart-pie": "\uf200",
  "fas fa-check": "\uf00c",
  "fas fa-check-circle": "\uf058",
  "fas fa-check-square": "\uf14a",
  "fas fa-chess": "\uf439",
  "fas fa-chess-bishop": "\uf43a",
  "fas fa-chess-board": "\uf43c",
  "fas fa-chess-king": "\uf43f",
  "fas fa-chess-knight": "\uf441",
  "fas fa-chess-pawn": "\uf443",
  "fas fa-chess-queen": "\uf445",
  "fas fa-chess-rook": "\uf447",
  "fas fa-chevron-circle-down": "\uf13a",
  "fas fa-chevron-circle-left": "\uf137",
  "fas fa-chevron-circle-right": "\uf138",
  "fas fa-chevron-circle-up": "\uf139",
  "fas fa-chevron-down": "\uf078",
  "fas fa-chevron-left": "\uf053",
  "fas fa-chevron-right": "\uf054",
  "fas fa-chevron-up": "\uf077",
  "fas fa-child": "\uf1ae",
  "fas fa-circle": "\uf111",
  "fas fa-circle-notch": "\uf1ce",
  "fas fa-clipboard": "\uf328",
  "fas fa-clipboard-check": "\uf46c",
  "fas fa-clipboard-list": "\uf46d",
  "fas fa-clock": "\uf017",
  "fas fa-clone": "\uf24d",
  "fas fa-closed-captioning": "\uf20a",
  "fas fa-cloud": "\uf0c2",
  "fas fa-cloud-download-alt": "\uf381",
  "fas fa-cloud-upload-alt": "\uf382",
  "fas fa-code": "\uf121",
  "fas fa-code-branch": "\uf126",
  "fas fa-coffee": "\uf0f4",
  "fas fa-cog": "\uf013",
  "fas fa-cogs": "\uf085",
  "fas fa-columns": "\uf0db",
  "fas fa-comment": "\uf075",
  "fas fa-comment-alt": "\uf27a",
  "fas fa-comment-dots": "\uf4ad",
  "fas fa-comment-slash": "\uf4b3",
  "fas fa-comments": "\uf086",
  "fas fa-compass": "\uf14e",
  "fas fa-compress": "\uf066",
  "fas fa-copy": "\uf0c5",
  "fas fa-copyright": "\uf1f9",
  "fas fa-couch": "\uf4b8",
  "fas fa-credit-card": "\uf09d",
  "fas fa-crop": "\uf125",
  "fas fa-crosshairs": "\uf05b",
  "fas fa-cube": "\uf1b2",
  "fas fa-cubes": "\uf1b3",
  "fas fa-cut": "\uf0c4",
  "fas fa-database": "\uf1c0",
  "fas fa-deaf": "\uf2a4",
  "fas fa-desktop": "\uf108",
  "fas fa-diagnoses": "\uf470",
  "fas fa-dna": "\uf471",
  "fas fa-dollar-sign": "\uf155",
  "fas fa-dolly": "\uf472",
  "fas fa-dolly-flatbed": "\uf474",
  "fas fa-donate": "\uf4b9",
  "fas fa-dot-circle": "\uf192",
  "fas fa-dove": "\uf4ba",
  "fas fa-download": "\uf019",
  "fas fa-edit": "\uf044",
  "fas fa-eject": "\uf052",
  "fas fa-ellipsis-h": "\uf141",
  "fas fa-ellipsis-v": "\uf142",
  "fas fa-envelope": "\uf0e0",
  "fas fa-envelope-open": "\uf2b6",
  "fas fa-envelope-square": "\uf199",
  "fas fa-eraser": "\uf12d",
  "fas fa-euro-sign": "\uf153",
  "fas fa-exchange-alt": "\uf362",
  "fas fa-exclamation": "\uf12a",
  "fas fa-exclamation-circle": "\uf06a",
  "fas fa-exclamation-triangle": "\uf071",
  "fas fa-expand": "\uf065",
  "fas fa-expand-arrows-alt": "\uf31e",
  "fas fa-external-link-alt": "\uf35d",
  "fas fa-external-link-square-alt": "\uf360",
  "fas fa-eye": "\uf06e",
  "fas fa-eye-dropper": "\uf1fb",
  "fas fa-eye-slash": "\uf070",
  "fas fa-fast-backward": "\uf049",
  "fas fa-fast-forward": "\uf050",
  "fas fa-fax": "\uf1ac",
  "fas fa-female": "\uf182",
  "fas fa-fighter-jet": "\uf0fb",
  "fas fa-file": "\uf15b",
  "fas fa-file-alt": "\uf15c",
  "fas fa-file-archive": "\uf1c6",
  "fas fa-file-audio": "\uf1c7",
  "fas fa-file-code": "\uf1c9",
  "fas fa-file-excel": "\uf1c3",
  "fas fa-file-image": "\uf1c5",
  "fas fa-file-medical": "\uf477",
  "fas fa-file-medical-alt": "\uf478",
  "fas fa-file-pdf": "\uf1c1",
  "fas fa-file-powerpoint": "\uf1c4",
  "fas fa-file-video": "\uf1c8",
  "fas fa-file-word": "\uf1c2",
  "fas fa-film": "\uf008",
  "fas fa-filter": "\uf0b0",
  "fas fa-fire": "\uf06d",
  "fas fa-fire-extinguisher": "\uf134",
  "fas fa-first-aid": "\uf479",
  "fas fa-flag": "\uf024",
  "fas fa-flag-checkered": "\uf11e",
  "fas fa-flask": "\uf0c3",
  "fas fa-folder": "\uf07b",
  "fas fa-folder-open": "\uf07c",
  "fas fa-font": "\uf031",
  "fas fa-football-ball": "\uf44e",
  "fas fa-forward": "\uf04e",
  "fas fa-frown": "\uf119",
  "fas fa-futbol": "\uf1e3",
  "fas fa-gamepad": "\uf11b",
  "fas fa-gavel": "\uf0e3",
  "fas fa-gem": "\uf3a5",
  "fas fa-genderless": "\uf22d",
  "fas fa-gift": "\uf06b",
  "fas fa-glass-martini": "\uf000",
  "fas fa-globe": "\uf0ac",
  "fas fa-golf-ball": "\uf450",
  "fas fa-graduation-cap": "\uf19d",
  "fas fa-h-square": "\uf0fd",
  "fas fa-hand-holding": "\uf4bd",
  "fas fa-hand-holding-heart": "\uf4be",
  "fas fa-hand-holding-usd": "\uf4c0",
  "fas fa-hand-lizard": "\uf258",
  "fas fa-hand-paper": "\uf256",
  "fas fa-hand-peace": "\uf25b",
  "fas fa-hand-point-down": "\uf0a7",
  "fas fa-hand-point-left": "\uf0a5",
  "fas fa-hand-point-right": "\uf0a4",
  "fas fa-hand-point-up": "\uf0a6",
  "fas fa-hand-pointer": "\uf25a",
  "fas fa-hand-rock": "\uf255",
  "fas fa-hand-scissors": "\uf257",
  "fas fa-hand-spock": "\uf259",
  "fas fa-hands": "\uf4c2",
  "fas fa-hands-helping": "\uf4c4",
  "fas fa-handshake": "\uf2b5",
  "fas fa-hashtag": "\uf292",
  "fas fa-hdd": "\uf0a0",
  "fas fa-heading": "\uf1dc",
  "fas fa-headphones": "\uf025",
  "fas fa-heart": "\uf004",
  "fas fa-heartbeat": "\uf21e",
  "fas fa-history": "\uf1da",
  "fas fa-hockey-puck": "\uf453",
  "fas fa-home": "\uf015",
  "fas fa-hospital": "\uf0f8",
  "fas fa-hospital-alt": "\uf47d",
  "fas fa-hospital-symbol": "\uf47e",
  "fas fa-hourglass": "\uf254",
  "fas fa-hourglass-end": "\uf253",
  "fas fa-hourglass-half": "\uf252",
  "fas fa-hourglass-start": "\uf251",
  "fas fa-i-cursor": "\uf246",
  "fas fa-id-badge": "\uf2c1",
  "fas fa-id-card": "\uf2c2",
  "fas fa-id-card-alt": "\uf47f",
  "fas fa-image": "\uf03e",
  "fas fa-inbox": "\uf01c",
  "fas fa-indent": "\uf03c",
  "fas fa-industry": "\uf275",
  "fas fa-info": "\uf129",
  "fas fa-info-circle": "\uf05a",
  "fas fa-italic": "\uf033",
  "fas fa-key": "\uf084",
  "fas fa-keyboard": "\uf11c",
  "fas fa-language": "\uf1ab",
  "fas fa-laptop": "\uf109",
  "fas fa-leaf": "\uf06c",
  "fas fa-lemon": "\uf094",
  "fas fa-level-down-alt": "\uf3be",
  "fas fa-level-up-alt": "\uf3bf",
  "fas fa-life-ring": "\uf1cd",
  "fas fa-lightbulb": "\uf0eb",
  "fas fa-link": "\uf0c1",
  "fas fa-lira-sign": "\uf195",
  "fas fa-list": "\uf03a",
  "fas fa-list-alt": "\uf022",
  "fas fa-list-ol": "\uf0cb",
  "fas fa-list-ul": "\uf0ca",
  "fas fa-location-arrow": "\uf124",
  "fas fa-lock": "\uf023",
  "fas fa-lock-open": "\uf3c1",
  "fas fa-long-arrow-alt-down": "\uf309",
  "fas fa-long-arrow-alt-left": "\uf30a",
  "fas fa-long-arrow-alt-right": "\uf30b",
  "fas fa-long-arrow-alt-up": "\uf30c",
  "fas fa-low-vision": "\uf2a8",
  "fas fa-magic": "\uf0d0",
  "fas fa-magnet": "\uf076",
  "fas fa-male": "\uf183",
  "fas fa-map": "\uf279",
  "fas fa-map-marker": "\uf041",
  "fas fa-map-marker-alt": "\uf3c5",
  "fas fa-map-pin": "\uf276",
  "fas fa-map-signs": "\uf277",
  "fas fa-mars": "\uf222",
  "fas fa-mars-double": "\uf227",
  "fas fa-mars-stroke": "\uf229",
  "fas fa-mars-stroke-h": "\uf22b",
  "fas fa-mars-stroke-v": "\uf22a",
  "fas fa-medkit": "\uf0fa",
  "fas fa-meh": "\uf11a",
  "fas fa-mercury": "\uf223",
  "fas fa-microchip": "\uf2db",
  "fas fa-microphone": "\uf130",
  "fas fa-microphone-slash": "\uf131",
  "fas fa-minus": "\uf068",
  "fas fa-minus-circle": "\uf056",
  "fas fa-minus-square": "\uf146",
  "fas fa-mobile": "\uf10b",
  "fas fa-mobile-alt": "\uf3cd",
  "fas fa-money-bill-alt": "\uf3d1",
  "fas fa-moon": "\uf186",
  "fas fa-motorcycle": "\uf21c",
  "fas fa-mouse-pointer": "\uf245",
  "fas fa-music": "\uf001",
  "fas fa-neuter": "\uf22c",
  "fas fa-newspaper": "\uf1ea",
  "fas fa-notes-medical": "\uf481",
  "fas fa-object-group": "\uf247",
  "fas fa-object-ungroup": "\uf248",
  "fas fa-outdent": "\uf03b",
  "fas fa-paint-brush": "\uf1fc",
  "fas fa-pallet": "\uf482",
  "fas fa-paper-plane": "\uf1d8",
  "fas fa-paperclip": "\uf0c6",
  "fas fa-parachute-box": "\uf4cd",
  "fas fa-paragraph": "\uf1dd",
  "fas fa-paste": "\uf0ea",
  "fas fa-pause": "\uf04c",
  "fas fa-pause-circle": "\uf28b",
  "fas fa-paw": "\uf1b0",
  "fas fa-pen-square": "\uf14b",
  "fas fa-pencil-alt": "\uf303",
  "fas fa-percent": "\uf295",
  "fas fa-phone": "\uf095",
  "fas fa-phone-slash": "\uf3dd",
  "fas fa-phone-square": "\uf098",
  "fas fa-phone-volume": "\uf2a0",
  "fas fa-piggy-bank": "\uf4d3",
  "fas fa-pills": "\uf484",
  "fas fa-plane": "\uf072",
  "fas fa-play": "\uf04b",
  "fas fa-play-circle": "\uf144",
  "fas fa-plug": "\uf1e6",
  "fas fa-plus": "\uf067",
  "fas fa-plus-circle": "\uf055",
  "fas fa-plus-square": "\uf0fe",
  "fas fa-poo": "\uf2fe",
  "fas fa-pound-sign": "\uf154",
  "fas fa-power-off": "\uf011",
  "fas fa-prescription-bottle": "\uf485",
  "fas fa-prescription-bottle-alt": "\uf486",
  "fas fa-print": "\uf02f",
  "fas fa-procedures": "\uf487",
  "fas fa-puzzle-piece": "\uf12e",
  "fas fa-qrcode": "\uf029",
  "fas fa-question": "\uf128",
  "fas fa-question-circle": "\uf059",
  "fas fa-quidditch": "\uf458",
  "fas fa-quote-left": "\uf10d",
  "fas fa-quote-right": "\uf10e",
  "fas fa-random": "\uf074",
  "fas fa-recycle": "\uf1b8",
  "fas fa-redo": "\uf01e",
  "fas fa-redo-alt": "\uf2f9",
  "fas fa-registered": "\uf25d",
  "fas fa-reply": "\uf3e5",
  "fas fa-reply-all": "\uf122",
  "fas fa-retweet": "\uf079",
  "fas fa-ribbon": "\uf4d6",
  "fas fa-road": "\uf018",
  "fas fa-rocket": "\uf135",
  "fas fa-rss": "\uf09e",
  "fas fa-rss-square": "\uf143",
  "fas fa-ruble-sign": "\uf158",
  "fas fa-rupee-sign": "\uf156",
  "fas fa-save": "\uf0c7",
  "fas fa-search": "\uf002",
  "fas fa-search-minus": "\uf010",
  "fas fa-search-plus": "\uf00e",
  "fas fa-seedling": "\uf4d8",
  "fas fa-server": "\uf233",
  "fas fa-share": "\uf064",
  "fas fa-share-alt": "\uf1e0",
  "fas fa-share-alt-square": "\uf1e1",
  "fas fa-share-square": "\uf14d",
  "fas fa-shekel-sign": "\uf20b",
  "fas fa-shield-alt": "\uf3ed",
  "fas fa-ship": "\uf21a",
  "fas fa-shipping-fast": "\uf48b",
  "fas fa-shopping-bag": "\uf290",
  "fas fa-shopping-basket": "\uf291",
  "fas fa-shopping-cart": "\uf07a",
  "fas fa-shower": "\uf2cc",
  "fas fa-sign": "\uf4d9",
  "fas fa-sign-in-alt": "\uf2f6",
  "fas fa-sign-language": "\uf2a7",
  "fas fa-sign-out-alt": "\uf2f5",
  "fas fa-signal": "\uf012",
  "fas fa-sitemap": "\uf0e8",
  "fas fa-sliders-h": "\uf1de",
  "fas fa-smile": "\uf118",
  "fas fa-smoking": "\uf48d",
  "fas fa-snowflake": "\uf2dc",
  "fas fa-sort": "\uf0dc",
  "fas fa-sort-alpha-down": "\uf15d",
  "fas fa-sort-alpha-up": "\uf15e",
  "fas fa-sort-amount-down": "\uf160",
  "fas fa-sort-amount-up": "\uf161",
  "fas fa-sort-down": "\uf0dd",
  "fas fa-sort-numeric-down": "\uf162",
  "fas fa-sort-numeric-up": "\uf163",
  "fas fa-sort-up": "\uf0de",
  "fas fa-space-shuttle": "\uf197",
  "fas fa-spinner": "\uf110",
  "fas fa-spinner fa-pulse": "\uf110",
  "fas fa-square": "\uf0c8",
  "fas fa-square-full": "\uf45c",
  "fas fa-star": "\uf005",
  "fas fa-star-half": "\uf089",
  "fas fa-step-backward": "\uf048",
  "fas fa-step-forward": "\uf051",
  "fas fa-stethoscope": "\uf0f1",
  "fas fa-sticky-note": "\uf249",
  "fas fa-stop": "\uf04d",
  "fas fa-stop-circle": "\uf28d",
  "fas fa-stopwatch": "\uf2f2",
  "fas fa-street-view": "\uf21d",
  "fas fa-strikethrough": "\uf0cc",
  "fas fa-subscript": "\uf12c",
  "fas fa-subway": "\uf239",
  "fas fa-suitcase": "\uf0f2",
  "fas fa-sun": "\uf185",
  "fas fa-superscript": "\uf12b",
  "fas fa-sync": "\uf021",
  "fas fa-sync fa-spin": "\uf021",
  "fas fa-sync-alt": "\uf2f1",
  "fas fa-syringe": "\uf48e",
  "fas fa-table": "\uf0ce",
  "fas fa-table-tennis": "\uf45d",
  "fas fa-tablet": "\uf10a",
  "fas fa-tablet-alt": "\uf3fa",
  "fas fa-tablets": "\uf490",
  "fas fa-tachometer-alt": "\uf3fd",
  "fas fa-tag": "\uf02b",
  "fas fa-tags": "\uf02c",
  "fas fa-tape": "\uf4db",
  "fas fa-tasks": "\uf0ae",
  "fas fa-taxi": "\uf1ba",
  "fas fa-terminal": "\uf120",
  "fas fa-text-height": "\uf034",
  "fas fa-text-width": "\uf035",
  "fas fa-th": "\uf00a",
  "fas fa-th-large": "\uf009",
  "fas fa-th-list": "\uf00b",
  "fas fa-thermometer": "\uf491",
  "fas fa-thermometer-empty": "\uf2cb",
  "fas fa-thermometer-full": "\uf2c7",
  "fas fa-thermometer-half": "\uf2c9",
  "fas fa-thermometer-quarter": "\uf2ca",
  "fas fa-thermometer-three-quarters": "\uf2c8",
  "fas fa-thumbs-down": "\uf165",
  "fas fa-thumbs-up": "\uf164",
  "fas fa-thumbtack": "\uf08d",
  "fas fa-ticket-alt": "\uf3ff",
  "fas fa-times": "\uf00d",
  "fas fa-times-circle": "\uf057",
  "fas fa-tint": "\uf043",
  "fas fa-toggle-off": "\uf204",
  "fas fa-toggle-on": "\uf205",
  "fas fa-trademark": "\uf25c",
  "fas fa-train": "\uf238",
  "fas fa-transgender": "\uf224",
  "fas fa-transgender-alt": "\uf225",
  "fas fa-trash": "\uf1f8",
  "fas fa-trash-alt": "\uf2ed",
  "fas fa-tree": "\uf1bb",
  "fas fa-trophy": "\uf091",
  "fas fa-truck": "\uf0d1",
  "fas fa-truck-loading": "\uf4de",
  "fas fa-truck-moving": "\uf4df",
  "fas fa-tty": "\uf1e4",
  "fas fa-tv": "\uf26c",
  "fas fa-umbrella": "\uf0e9",
  "fas fa-underline": "\uf0cd",
  "fas fa-undo": "\uf0e2",
  "fas fa-undo-alt": "\uf2ea",
  "fas fa-universal-access": "\uf29a",
  "fas fa-university": "\uf19c",
  "fas fa-unlink": "\uf127",
  "fas fa-unlock": "\uf09c",
  "fas fa-unlock-alt": "\uf13e",
  "fas fa-upload": "\uf093",
  "fas fa-user": "\uf007",
  "fas fa-user-circle": "\uf2bd",
  "fas fa-user-md": "\uf0f0",
  "fas fa-user-plus": "\uf234",
  "fas fa-user-secret": "\uf21b",
  "fas fa-user-times": "\uf235",
  "fas fa-user-friends": "\uf500",
  "fas fa-users": "\uf0c0",
  "fas fa-utensil-spoon": "\uf2e5",
  "fas fa-utensils": "\uf2e7",
  "fas fa-venus": "\uf221",
  "fas fa-venus-double": "\uf226",
  "fas fa-venus-mars": "\uf228",
  "fas fa-vial": "\uf492",
  "fas fa-vials": "\uf493",
  "fas fa-video": "\uf03d",
  "fas fa-video-slash": "\uf4e2",
  "fas fa-volleyball-ball": "\uf45f",
  "fas fa-volume-down": "\uf027",
  "fas fa-volume-off": "\uf026",
  "fas fa-volume-up": "\uf028",
  "fas fa-weight": "\uf496",
  "fas fa-wheelchair": "\uf193",
  "fas fa-wifi": "\uf1eb",
  "fas fa-window-close": "\uf410",
  "fas fa-window-maximize": "\uf2d0",
  "fas fa-window-minimize": "\uf2d1",
  "fas fa-window-restore": "\uf2d2",
  "fas fa-wine-glass": "\uf4e3",
  "fas fa-won-sign": "\uf159",
  "fas fa-wrench": "\uf0ad",
  "fas fa-x-ray": "\uf497",
  "fas fa-yen-sign": "\uf157",
  "fab fa-500px": "\uf26e",
  "fab fa-accessible-icon": "\uf368",
  "fab fa-accusoft": "\uf369",
  "fab fa-adn": "\uf170",
  "fab fa-adversal": "\uf36a",
  "fab fa-affiliatetheme": "\uf36b",
  "fab fa-algolia": "\uf36c",
  "fab fa-amazon": "\uf270",
  "fab fa-amazon-pay": "\uf42c",
  "fab fa-amilia": "\uf36d",
  "fab fa-android": "\uf17b",
  "fab fa-angellist": "\uf209",
  "fab fa-angrycreative": "\uf36e",
  "fab fa-angular": "\uf420",
  "fab fa-app-store": "\uf36f",
  "fab fa-app-store-ios": "\uf370",
  "fab fa-apper": "\uf371",
  "fab fa-apple": "\uf179",
  "fab fa-apple-pay": "\uf415",
  "fab fa-asymmetrik": "\uf372",
  "fab fa-audible": "\uf373",
  "fab fa-autoprefixer": "\uf41c",
  "fab fa-avianex": "\uf374",
  "fab fa-aviato": "\uf421",
  "fab fa-aws": "\uf375",
  "fab fa-bandcamp": "\uf2d5",
  "fab fa-behance": "\uf1b4",
  "fab fa-behance-square": "\uf1b5",
  "fab fa-bimobject": "\uf378",
  "fab fa-bitbucket": "\uf171",
  "fab fa-bitcoin": "\uf379",
  "fab fa-bity": "\uf37a",
  "fab fa-black-tie": "\uf27e",
  "fab fa-blackberry": "\uf37b",
  "fab fa-blogger": "\uf37c",
  "fab fa-blogger-b": "\uf37d",
  "fab fa-bluetooth": "\uf293",
  "fab fa-bluetooth-b": "\uf294",
  "fab fa-btc": "\uf15a",
  "fab fa-buromobelexperte": "\uf37f",
  "fab fa-buysellads": "\uf20d",
  "fab fa-cc-amazon-pay": "\uf42d",
  "fab fa-cc-amex": "\uf1f3",
  "fab fa-cc-apple-pay": "\uf416",
  "fab fa-cc-diners-club": "\uf24c",
  "fab fa-cc-discover": "\uf1f2",
  "fab fa-cc-jcb": "\uf24b",
  "fab fa-cc-mastercard": "\uf1f1",
  "fab fa-cc-paypal": "\uf1f4",
  "fab fa-cc-stripe": "\uf1f5",
  "fab fa-cc-visa": "\uf1f0",
  "fab fa-centercode": "\uf380",
  "fab fa-chrome": "\uf268",
  "fab fa-cloudscale": "\uf383",
  "fab fa-cloudsmith": "\uf384",
  "fab fa-cloudversify": "\uf385",
  "fab fa-codepen": "\uf1cb",
  "fab fa-codiepie": "\uf284",
  "fab fa-connectdevelop": "\uf20e",
  "fab fa-contao": "\uf26d",
  "fab fa-cpanel": "\uf388",
  "fab fa-creative-commons": "\uf25e",
  "fab fa-css3": "\uf13c",
  "fab fa-css3-alt": "\uf38b",
  "fab fa-cuttlefish": "\uf38c",
  "fab fa-d-and-d": "\uf38d",
  "fab fa-dashcube": "\uf210",
  "fab fa-delicious": "\uf1a5",
  "fab fa-deploydog": "\uf38e",
  "fab fa-deskpro": "\uf38f",
  "fab fa-deviantart": "\uf1bd",
  "fab fa-digg": "\uf1a6",
  "fab fa-digital-ocean": "\uf391",
  "fab fa-discord": "\uf392",
  "fab fa-discourse": "\uf393",
  "fab fa-dochub": "\uf394",
  "fab fa-docker": "\uf395",
  "fab fa-draft2digital": "\uf396",
  "fab fa-dribbble": "\uf17d",
  "fab fa-dribbble-square": "\uf397",
  "fab fa-dropbox": "\uf16b",
  "fab fa-drupal": "\uf1a9",
  "fab fa-dyalog": "\uf399",
  "fab fa-earlybirds": "\uf39a",
  "fab fa-edge": "\uf282",
  "fab fa-elementor": "\uf430",
  "fab fa-ember": "\uf423",
  "fab fa-empire": "\uf1d1",
  "fab fa-envira": "\uf299",
  "fab fa-erlang": "\uf39d",
  "fab fa-ethereum": "\uf42e",
  "fab fa-etsy": "\uf2d7",
  "fab fa-expeditedssl": "\uf23e",
  "fab fa-facebook": "\uf09a",
  "fab fa-facebook-f": "\uf39e",
  "fab fa-facebook-messenger": "\uf39f",
  "fab fa-facebook-square": "\uf082",
  "fab fa-firefox": "\uf269",
  "fab fa-first-order": "\uf2b0",
  "fab fa-firstdraft": "\uf3a1",
  "fab fa-flickr": "\uf16e",
  "fab fa-flipboard": "\uf44d",
  "fab fa-fly": "\uf417",
  "fab fa-font-awesome": "\uf2b4",
  "fab fa-font-awesome-alt": "\uf35c",
  "fab fa-font-awesome-flag": "\uf425",
  "fab fa-fonticons": "\uf280",
  "fab fa-fonticons-fi": "\uf3a2",
  "fab fa-fort-awesome": "\uf286",
  "fab fa-fort-awesome-alt": "\uf3a3",
  "fab fa-forumbee": "\uf211",
  "fab fa-foursquare": "\uf180",
  "fab fa-free-code-camp": "\uf2c5",
  "fab fa-freebsd": "\uf3a4",
  "fab fa-get-pocket": "\uf265",
  "fab fa-gg": "\uf260",
  "fab fa-gg-circle": "\uf261",
  "fab fa-git": "\uf1d3",
  "fab fa-git-square": "\uf1d2",
  "fab fa-github": "\uf09b",
  "fab fa-github-alt": "\uf113",
  "fab fa-github-square": "\uf092",
  "fab fa-gitkraken": "\uf3a6",
  "fab fa-gitlab": "\uf296",
  "fab fa-gitter": "\uf426",
  "fab fa-glide": "\uf2a5",
  "fab fa-glide-g": "\uf2a6",
  "fab fa-gofore": "\uf3a7",
  "fab fa-goodreads": "\uf3a8",
  "fab fa-goodreads-g": "\uf3a9",
  "fab fa-google": "\uf1a0",
  "fab fa-google-drive": "\uf3aa",
  "fab fa-google-play": "\uf3ab",
  "fab fa-google-plus": "\uf2b3",
  "fab fa-google-plus-g": "\uf0d5",
  "fab fa-google-plus-square": "\uf0d4",
  "fab fa-google-wallet": "\uf1ee",
  "fab fa-gratipay": "\uf184",
  "fab fa-grav": "\uf2d6",
  "fab fa-gripfire": "\uf3ac",
  "fab fa-grunt": "\uf3ad",
  "fab fa-gulp": "\uf3ae",
  "fab fa-hacker-news": "\uf1d4",
  "fab fa-hacker-news-square": "\uf3af",
  "fab fa-hips": "\uf452",
  "fab fa-hire-a-helper": "\uf3b0",
  "fab fa-hooli": "\uf427",
  "fab fa-hotjar": "\uf3b1",
  "fab fa-houzz": "\uf27c",
  "fab fa-html5": "\uf13b",
  "fab fa-hubspot": "\uf3b2",
  "fab fa-imdb": "\uf2d8",
  "fab fa-instagram": "\uf16d",
  "fab fa-internet-explorer": "\uf26b",
  "fab fa-ioxhost": "\uf208",
  "fab fa-itunes": "\uf3b4",
  "fab fa-itunes-note": "\uf3b5",
  "fab fa-java": "\uf4e4",
  "fab fa-jenkins": "\uf3b6",
  "fab fa-joget": "\uf3b7",
  "fab fa-joomla": "\uf1aa",
  "fab fa-js": "\uf3b8",
  "fab fa-js-square": "\uf3b9",
  "fab fa-jsfiddle": "\uf1cc",
  "fab fa-keycdn": "\uf3ba",
  "fab fa-kickstarter": "\uf3bb",
  "fab fa-kickstarter-k": "\uf3bc",
  "fab fa-korvue": "\uf42f",
  "fab fa-laravel": "\uf3bd",
  "fab fa-lastfm": "\uf202",
  "fab fa-lastfm-square": "\uf203",
  "fab fa-leanpub": "\uf212",
  "fab fa-less": "\uf41d",
  "fab fa-line": "\uf3c0",
  "fab fa-linkedin": "\uf08c",
  "fab fa-linkedin-in": "\uf0e1",
  "fab fa-linode": "\uf2b8",
  "fab fa-linux": "\uf17c",
  "fab fa-lyft": "\uf3c3",
  "fab fa-magento": "\uf3c4",
  "fab fa-maxcdn": "\uf136",
  "fab fa-medapps": "\uf3c6",
  "fab fa-medium": "\uf23a",
  "fab fa-medium-m": "\uf3c7",
  "fab fa-medrt": "\uf3c8",
  "fab fa-meetup": "\uf2e0",
  "fab fa-microsoft": "\uf3ca",
  "fab fa-mix": "\uf3cb",
  "fab fa-mixcloud": "\uf289",
  "fab fa-mizuni": "\uf3cc",
  "fab fa-modx": "\uf285",
  "fab fa-monero": "\uf3d0",
  "fab fa-napster": "\uf3d2",
  "fab fa-nintendo-switch": "\uf418",
  "fab fa-node": "\uf419",
  "fab fa-node-js": "\uf3d3",
  "fab fa-npm": "\uf3d4",
  "fab fa-ns8": "\uf3d5",
  "fab fa-nutritionix": "\uf3d6",
  "fab fa-odnoklassniki": "\uf263",
  "fab fa-odnoklassniki-square": "\uf264",
  "fab fa-opencart": "\uf23d",
  "fab fa-openid": "\uf19b",
  "fab fa-opera": "\uf26a",
  "fab fa-optin-monster": "\uf23c",
  "fab fa-osi": "\uf41a",
  "fab fa-page4": "\uf3d7",
  "fab fa-pagelines": "\uf18c",
  "fab fa-palfed": "\uf3d8",
  "fab fa-patreon": "\uf3d9",
  "fab fa-paypal": "\uf1ed",
  "fab fa-periscope": "\uf3da",
  "fab fa-phabricator": "\uf3db",
  "fab fa-phoenix-framework": "\uf3dc",
  "fab fa-php": "\uf457",
  "fab fa-pied-piper": "\uf2ae",
  "fab fa-pied-piper-alt": "\uf1a8",
  "fab fa-pied-piper-hat": "\uf4e5",
  "fab fa-pied-piper-pp": "\uf1a7",
  "fab fa-pinterest": "\uf0d2",
  "fab fa-pinterest-p": "\uf231",
  "fab fa-pinterest-square": "\uf0d3",
  "fab fa-playstation": "\uf3df",
  "fab fa-product-hunt": "\uf288",
  "fab fa-pushed": "\uf3e1",
  "fab fa-python": "\uf3e2",
  "fab fa-qq": "\uf1d6",
  "fab fa-quinscape": "\uf459",
  "fab fa-quora": "\uf2c4",
  "fab fa-ravelry": "\uf2d9",
  "fab fa-react": "\uf41b",
  "fab fa-readme": "\uf4d5",
  "fab fa-rebel": "\uf1d0",
  "fab fa-red-river": "\uf3e3",
  "fab fa-reddit": "\uf1a1",
  "fab fa-reddit-alien": "\uf281",
  "fab fa-reddit-square": "\uf1a2",
  "fab fa-rendact": "\uf3e4",
  "fab fa-renren": "\uf18b",
  "fab fa-replyd": "\uf3e6",
  "fab fa-resolving": "\uf3e7",
  "fab fa-rocketchat": "\uf3e8",
  "fab fa-rockrms": "\uf3e9",
  "fab fa-safari": "\uf267",
  "fab fa-sass": "\uf41e",
  "fab fa-schlix": "\uf3ea",
  "fab fa-scribd": "\uf28a",
  "fab fa-searchengin": "\uf3eb",
  "fab fa-sellcast": "\uf2da",
  "fab fa-sellsy": "\uf213",
  "fab fa-servicestack": "\uf3ec",
  "fab fa-shirtsinbulk": "\uf214",
  "fab fa-simplybuilt": "\uf215",
  "fab fa-sistrix": "\uf3ee",
  "fab fa-skyatlas": "\uf216",
  "fab fa-skype": "\uf17e",
  "fab fa-slack": "\uf198",
  "fab fa-slack-hash": "\uf3ef",
  "fab fa-slideshare": "\uf1e7",
  "fab fa-snapchat": "\uf2ab",
  "fab fa-snapchat-ghost": "\uf2ac",
  "fab fa-snapchat-square": "\uf2ad",
  "fab fa-soundcloud": "\uf1be",
  "fab fa-speakap": "\uf3f3",
  "fab fa-spotify": "\uf1bc",
  "fab fa-stack-exchange": "\uf18d",
  "fab fa-stack-overflow": "\uf16c",
  "fab fa-staylinked": "\uf3f5",
  "fab fa-steam": "\uf1b6",
  "fab fa-steam-square": "\uf1b7",
  "fab fa-steam-symbol": "\uf3f6",
  "fab fa-sticker-mule": "\uf3f7",
  "fab fa-strava": "\uf428",
  "fab fa-stripe": "\uf429",
  "fab fa-stripe-s": "\uf42a",
  "fab fa-studiovinari": "\uf3f8",
  "fab fa-stumbleupon": "\uf1a4",
  "fab fa-stumbleupon-circle": "\uf1a3",
  "fab fa-superpowers": "\uf2dd",
  "fab fa-supple": "\uf3f9",
  "fab fa-telegram": "\uf2c6",
  "fab fa-telegram-plane": "\uf3fe",
  "fab fa-tencent-weibo": "\uf1d5",
  "fab fa-themeisle": "\uf2b2",
  "fab fa-trello": "\uf181",
  "fab fa-tripadvisor": "\uf262",
  "fab fa-tumblr": "\uf173",
  "fab fa-tumblr-square": "\uf174",
  "fab fa-twitch": "\uf1e8",
  "fab fa-twitter": "\uf099",
  "fab fa-twitter-square": "\uf081",
  "fab fa-typo3": "\uf42b",
  "fab fa-uber": "\uf402",
  "fab fa-uikit": "\uf403",
  "fab fa-uniregistry": "\uf404",
  "fab fa-untappd": "\uf405",
  "fab fa-usb": "\uf287",
  "fab fa-ussunnah": "\uf407",
  "fab fa-vaadin": "\uf408",
  "fab fa-viacoin": "\uf237",
  "fab fa-viadeo": "\uf2a9",
  "fab fa-viadeo-square": "\uf2aa",
  "fab fa-viber": "\uf409",
  "fab fa-vimeo": "\uf40a",
  "fab fa-vimeo-square": "\uf194",
  "fab fa-vimeo-v": "\uf27d",
  "fab fa-vine": "\uf1ca",
  "fab fa-vk": "\uf189",
  "fab fa-vnv": "\uf40b",
  "fab fa-vuejs": "\uf41f",
  "fab fa-weibo": "\uf18a",
  "fab fa-weixin": "\uf1d7",
  "fab fa-whatsapp": "\uf232",
  "fab fa-whatsapp-square": "\uf40c",
  "fab fa-whmcs": "\uf40d",
  "fab fa-wikipedia-w": "\uf266",
  "fab fa-windows": "\uf17a",
  "fab fa-wordpress": "\uf19a",
  "fab fa-wordpress-simple": "\uf411",
  "fab fa-wpbeginner": "\uf297",
  "fab fa-wpexplorer": "\uf2de",
  "fab fa-wpforms": "\uf298",
  "fab fa-xbox": "\uf412",
  "fab fa-xing": "\uf168",
  "fab fa-xing-square": "\uf169",
  "fab fa-y-combinator": "\uf23b",
  "fab fa-yahoo": "\uf19e",
  "fab fa-yandex": "\uf413",
  "fab fa-yandex-international": "\uf414",
  "fab fa-yelp": "\uf1e9",
  "fab fa-yoast": "\uf2b1",
  "fab fa-youtube": "\uf167",
  "fab fa-youtube-square": "\uf431"
};

var FaLookup$1 = FaLookup;

var Vis$1;

Vis$1 = class Vis {
  static translate(x0, y0) {
    Util$1.checkTypes('number', {
      x0: x0,
      y0: y0
    });
    return ` translate( ${x0}, ${y0} )`;
  }

  static scale(sx, sy) {
    Util$1.checkTypes('number', {
      sx: sx,
      sy: sy
    });
    return ` scale( ${sx}, ${sy} )`;
  }

  static rotate(a, x, y) {
    Util$1.checkTypes('number', {
      a: a,
      x: x,
      y: y
    });
    return ` rotate(${a} ${x} ${y} )`;
  }

  static rad(deg) {
    return deg * Math.PI / 180;
  }

  static deg(rad) {
    return rad * 180 / Math.PI;
  }

  static sin(deg) {
    return Math.sin(Vis.rad(deg));
  }

  static cos(deg) {
    return Math.cos(Vis.rad(deg));
  }

  static rot(deg, ang) {
    var a;
    a = deg + ang;
    if (a < 0) {
      a = a + 360;
    }
    return a;
  }

  static toRadian(h, hueIsRygb = false) {
    var hue, radian;
    hue = hueIsRygb ? Vis.toHueRygb(h) : h;
    radian = 2 * Math.PI * (90 - hue) / 360; // Correction for MathBox polar coordinate system
    if (radian < 0) {
      radian = 2 * Math.PI + radian;
    }
    return radian;
  }

  static svgDeg(deg) {
    return 360 - deg;
  }

  static svgRad(rad) {
    return 2 * Math.PI - rad;
  }

  static radSvg(deg) {
    return Vis.rad(360 - deg);
  }

  static degSvg(rad) {
    return Vis.deg(2 * Math.PI - rad);
  }

  static sinSvg(deg) {
    return Math.sin(Vis.radSvg(deg));
  }

  static cosSvg(deg) {
    return Math.cos(Vis.radSvg(deg));
  }

  //hexCss:( hex ) -> """##{hex.toString(16)}""" # For orthogonality
  static rgbCss(rgb) {
    return `rgb(${rgb.r},${rgb.g},${rgb.b})`;
  }

  static hslCss(hsl) {
    return `hsl(${hsl.h},${hsl.s * 100}%,${hsl.l * 100}%)`;
  }

  static cssHex(str) {
    return parseInt(str.substr(1), 16);
  }

  static rndRgb(rgb) {
    return {
      r: Math.round(rgb.r),
      g: Math.round(rgb.g),
      b: Math.round(rgb.b)
    };
  }

  static hexRgb(hex) {
    return Vis.rndRgb({
      r: (hex & 0xFF0000) >> 16,
      g: (hex & 0x00FF00) >> 8,
      b: hex & 0x0000FF
    });
  }

  static rgbHex(rgb) {
    return rgb.r * 4096 + rgb.g * 256 + rgb.b;
  }

  static interpolateHexRgb(hex1, r1, hex2, r2) {
    return Vis.interpolateRgb(Vis.hexRgb(hex1), r1, Vis.hexRgb(hex2), r2);
  }

  static interpolateRgb(rgb1, r1, rgb2, r2) {
    return {
      r: rgb1.r * r1 + rgb2.r * r2,
      g: rgb1.g * r1 + rgb2.g * r2,
      b: rgb1.b * r1 + rgb2.b * r2
    };
  }

  static toRgbHsvStr(hsv) {
    var i, j, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    str = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
    //console.log( "Vis.toRgbHsvStr()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbaHsv(hsv) {
    var i, j, rgba, str;
    rgba = Vis.toRgbHsvSigmoidal(hsv[0], hsv[1], hsv[2] * 255, true);
    for (i = j = 0; j < 3; i = ++j) {
      rgba[i] = Math.round(rgba[i]);
    }
    str = `rgba(${rgba[0]},${rgba[1]},${rgba[2]},${rgba[3]})`;
    //console.log( "Vis.toRgbaHsv()", {h:hsv[0],s:hsv[1],v:hsv[2]}, str )
    return str;
  }

  static toRgbHsv(H, C, V, toRygb = true) {
    return Vis.toRgbHsvSigmoidal(H, C, V, toRygb);
  }

  static toRgbHsvSigmoidal(H, C, V, toRygb = true) {
    var b, c, d, f, g, h, i, r, v, x, y, z;
    h = toRygb ? Vis.toHueRgb(H) : H;
    d = C * 0.01;
    c = Vis.sigmoidal(d, 2, 0.25);
    v = V * 0.01;
    i = Math.floor(h / 60);
    f = h / 60 - i;
    x = 1 - c;
    y = 1 - f * c;
    z = 1 - (1 - f) * c;
    r = 1;
    g = 1;
    b = 1;
    [r, g, b] = (function() {
      switch (i % 6) {
        case 0:
          return [1, z, x, 1];
        case 1:
          return [y, 1, x, 1];
        case 2:
          return [x, 1, z, 1];
        case 3:
          return [x, y, 1, 1];
        case 4:
          return [z, x, 1, 1];
        case 5:
          return [1, x, y, 1];
      }
    })();
    return [r * v, g * v, b * v, 1];
  }

  static hsvToRgb(hsv) {
    var f, i, p, q, rgb, t, v;
    i = Math.floor(hsv.h / 60);
    f = hsv.h / 60 - i;
    p = hsv.v * (1 - hsv.s);
    q = hsv.v * (1 - f * hsv.s);
    t = hsv.v * (1 - (1 - f) * hsv.s);
    v = hsv.v;
    rgb = (function() {
      switch (i % 6) {
        case 0:
          return {
            r: v,
            g: t,
            b: p
          };
        case 1:
          return {
            r: q,
            g: v,
            b: p
          };
        case 2:
          return {
            r: p,
            g: v,
            b: t
          };
        case 3:
          return {
            r: p,
            g: q,
            b: v
          };
        case 4:
          return {
            r: t,
            g: p,
            b: v
          };
        case 5:
          return {
            r: v,
            g: p,
            b: q
          };
        default:
          console.error('Vis.hsvToRgb()');
          return {
            r: v,
            g: t,
            b: p // Should never happend
          };
      }
    })();
    return Vis.roundRgb(rgb, 255);
  }

  static roundRgb(rgb, f = 1.0) {
    return {
      r: Math.round(rgb.r * f),
      g: Math.round(rgb.g * f),
      b: Math.round(rgb.b * f)
    };
  }

  static sigmoidal(x, k, x0 = 0.5, L = 1) {
    return L / (1 + Math.exp(-k * (x - x0)));
  }

  // ransform RyGB to RGB hueT
  static toHueRgb(hue) {
    var hRgb;
    hRgb = 0;
    if (0 <= hue && hue < 90) {
      hRgb = hue * 60 / 90;
    } else if (90 <= hue && hue < 180) {
      hRgb = 60 + (hue - 90) * 60 / 90;
    } else if (180 <= hue && hue < 270) {
      hRgb = 120 + (hue - 180) * 120 / 90;
    } else if (270 <= hue && hue < 360) {
      hRgb = 240 + (hue - 270) * 120 / 90;
    }
    return hRgb;
  }

  static toRgba(study) {
    var hsv;
    hsv = study.hsv != null ? study.hsv : [90, 90, 90];
    return Vis.toRgbHsv(hsv[0], hsv[1], hsv[2]);
  }

  static toRgbSphere(hue, phi, rad) {
    return Vis.toRgbHsv(Vis.rot(hue, 90), 100 * Vis.sin(phi), 100 * rad);
  }

  // Key algorithm from HCI for converting RGB to HCS  h 360 c 100 s 100
  static toHcsRgb(R, G, B, toRygb = true) {
    var H, a, b, c, g, h, r, s, sum;
    sum = R + G + B;
    r = R / sum;
    g = G / sum;
    b = B / sum;
    s = sum / 3;
    c = R === G && G === B ? 0 : 1 - 3 * Math.min(r, g, b); // Center Grayscale
    a = Vis.deg(Math.acos((r - 0.5 * (g + b)) / Math.sqrt((r - g) * (r - g) + (r - b) * (g - b))));
    h = b <= g ? a : 360 - a;
    if (c === 0) {
      h = 0;
    }
    H = toRygb ? Vis.toHueRgb(h) : h;
    return [H, c * 100, s / 2.55];
  }

  static sScale(hue, c, s) {
    var ch, m120, m60, s60, ss;
    ss = 1.0;
    m60 = hue % 60;
    m120 = hue % 120;
    s60 = m60 / 60;
    ch = c / 100;
    ss = m120 < 60 ? 3.0 - 1.5 * s60 : 1.5 + 1.5 * s60;
    return s * (1 - ch) + s * ch * ss;
  }

  static sScaleCf(hue, c, s) {
    var cf, cosd, cosu, m120, m60, ss;
    ss = sScale(hue, c, s);
    m60 = hue % 60;
    m120 = hue % 120;
    cosu = (1 - Vis.cos(m60)) * 100.00;
    cosd = (1 - Vis.cos(60 - m60)) * 100.00;
    cf = m120 < 60 ? cosu : cosd;
    return ss - cf;
  }

  static floor(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.floor(x / dr) * dr;
  }

  static ceil(x, dx) {
    var dr;
    dr = Math.round(dx);
    return Math.ceil(x / dr) * dr;
  }

  static within(beg, deg, end) {
    return beg <= deg && deg <= end; // Closed interval with <=
  }

  static isZero(v) {
    return -0.01 < v && v < 0.01;
  }

  static unicode(icon) {
    var uc;
    uc = FaLookup$1.icons[icon];
    if (uc == null) {
      console.error('Vis.unicode() missing icon in Vis.FontAwesomeUnicodes for', icon);
      uc = "\uf111"; // Circle
    }
    return uc;
  }

};

/*
  @uniawe:( icon ) ->
temp = document.createElement("i")
temp.className = icon
document.body.appendChild(temp)
uni = window.getComputedStyle( document.querySelector('.' + icon), ':before' ).getPropertyValue('content')
console.log( 'uniawe', icon, uni )
temp.remove()
uni
*/
var Vis$2 = Vis$1;

var Convey;

Convey = class Convey {
  constructor(shapes, defs, g, x, y, w, h) {
    this.doData = this.doData.bind(this);
    this.sankeyLink = this.sankeyLink.bind(this);
    this.shapes = shapes;
    this.defs = defs;
    this.g = g;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.d3 = Util$1.getGlobal('d3');
    this.nw = 24;
    this.np = 0;
    this.showLabel = false;
    this.shapes.gradientDef(this.defs, 'WhiteBlack', 'white', 'black');
    this.gc = this.g.append("g");
  }

  doData(graph) {
    this.sankey = this.createSankey();
    this.graph = this.sankey(graph);
    [this.linkSvg, this.nodeSvg] = this.doSankey(this.sankey, this.graph);
  }

  createSankey() {
    var sankey;
    sankey = this.d3.sankey().nodeWidth(this.nw).nodePadding(this.np).extent([[this.x, this.y], [this.x + this.w, this.y + this.h]]);
    sankey.link = this.sankeyLink;
    return sankey;
  }

  sankeyLink(d) {
    var curvature, x0, x1, x2, x3, xi, y0, y1;
    curvature = .5;
    x0 = d.source.x1;
    x1 = d.target.x0;
    xi = this.d3.interpolateNumber(x0, x1);
    x2 = xi(curvature);
    x3 = xi(1 - curvature);
    y0 = d.y0;
    y1 = d.y1 + 0.1; // 0.1 prevents a pure horizontal line that did not respond to color gradients
    return 'M' + x0 + ',' + y0 + 'C' + x2 + ',' + y0 + ' ' + x3 + ',' + y1 + ' ' + x1 + ',' + y1;
  }

  doSankey(sankey, graph) {
    var linkSvg, nodeSvg;
    sankey.nodes(graph.nodes).links(graph.links);
    //console.log( 'Node', node ) for node in graph.nodes
    linkSvg = this.doLinks(graph);
    nodeSvg = this.doNodes(graph);
    return [linkSvg, nodeSvg];
  }

  // .attr( "stroke", "url(#WhiteBlack)" ).attr( "fill","none")#
  doLinks(graph) {
    var d, gLink, gLinks, i, id, len, ref;
    gLinks = this.gc.append("svg:g");
    ref = graph.links;
    for (i = 0, len = ref.length; i < len; i++) {
      d = ref[i];
      //console.log( 'Convey.doLinks() d', d )
      id = d.source.name + d.target.name;
      this.shapes.gradientDef(this.defs, id, d.source.color, d.target.color);
      gLink = gLinks.append("svg:g").attr("stroke", `url(#${id})`).attr("fill", "none");
      //sort( (a, b) -> (b.y1-b.y0) - (a.y1-a.y0) )
      gLink.append("svg:path").attr("d", this.sankey.link(d)).style("stroke-width", 1).append("title").text(d.source.name + " → " + d.target.name); //.attr("class", "link")
    }
    return gLinks;
  }

  doNodes(graph) {
    var node;
    node = this.gc.append("g").selectAll(".node").data(graph.nodes).enter().append("g").attr("class", "node").attr("transform", function(d) {
      return Vis$2.translate(d.x0, d.y0);
    });
    node.append("rect").attr("height", function(d) {
      return d.y1 - d.y0;
    }).attr("width", this.sankey.nodeWidth()).attr("fill", (d) => {
      return d.color;
    }).append("title").text((d) => {
      return d.name; //  + "\n" + d.value
    });
    if (this.showLabel) {
      node.append("text").attr("x", -6).attr("y", function(d) {
        return (d.y1 - d.y0) / 2;
      }).attr("dy", ".35em").attr("text-anchor", "end").text(function(d) {
        return d.name;
      }).filter((d) => {
        return d['x'] < this.w / 2;
      }).attr("x", 6 + this.sankey.nodeWidth()).attr("text-anchor", "start");
    }
    return node;
  }

};

var Convey$1 = Convey;

var Shapes,
  hasProp$3 = {}.hasOwnProperty;

Shapes = class Shapes {
  constructor(stream) {
    this.createSvg = this.createSvg.bind(this);
    this.layoutSvg = this.layoutSvg.bind(this);
    this.stream = stream;
    this.d3 = Util$1.getGlobal('d3');
    this.cos30 = 0.86602540378;
    //@cos15 = Vis.cos(15)
    this.fontText = "Roboto";
    Util$1.noop(this.ellipse, this.pathPlot, this.textFill, this.rectGrad, this.saveSvg, this.createSvg, this.layoutSvg);
  }

  createSvg(elem, name, w, h) {
    var defs, g, gId, svg, svgId;
    svgId = Util$1.htmlId(name, 'Svg', '', false); // Turn off duplicate id error message
    gId = Util$1.htmlId(name, 'SvgG', '', false); // Turn off duplicate id error message
    svg = this.d3.select(elem).append("svg:svg");
    svg.attr("id", svgId).attr("width", w).attr("height", h).attr("xmlns", "http://www.w3.org/2000/svg");
    defs = svg.append("svg:defs");
    g = svg.append("svg:g").attr("id", gId); // All transforms are applied to g
    return [svg, g, svgId, gId, defs];
  }

  layoutSvg(svg, g, w, h, sx, sy) {
    svg.attr("width", w).attr("height", h);
    g.attr('transform', Vis$2.scale(sx, sy));
  }

  rectGrad(g, defs, xc, yc, w, h, fill, stroke, text) {
    this.rectCenter(g, xc, yc, w * 1.5, h * 1.5, fill, stroke, 0.1);
    this.rectCenter(g, xc, yc, w * 1.4, h * 1.4, fill, stroke, 0.2);
    this.rectCenter(g, xc, yc, w * 1.3, h * 1.3, fill, stroke, 0.3);
    this.rectCenter(g, xc, yc, w * 1.2, h * 1.2, fill, stroke, 0.4);
    this.rectCenter(g, xc, yc, w * 1.1, h * 1.1, fill, stroke, 0.5);
    this.rectCenter(g, xc, yc, w, h, fill, stroke, 0.6, text);
  }

  rectCenter(g, xc, yc, w, h, fill, stroke, opacity, text = '') {
    this.rect(g, xc - w * 0.5, yc - h * 0.5, w, h, fill, stroke, opacity, text);
  }

  toFill(studyPrac, darken = false) {
    var hsv;
    hsv = (studyPrac.hsv != null) && studyPrac.hsv.length === 3 ? studyPrac.hsv : [50, 50, 50];
    hsv = darken ? [hsv[0], hsv[1], hsv[2] * 0.75] : hsv; // [hsv[0],60,30]
    // console.log( 'Shapes.toFill()', studyPrac.hsv, hsv ) if darken
    if ((studyPrac.hsv != null) && studyPrac.hsv.length === 3) {
      return Vis$2.toRgbHsvStr(hsv);
    } else {
      console.error('Shapes.toFill() unknown fill code', {
        name: studyPrac.name,
        fill: studyPrac.fill,
        spec: studyPrac
      });
      return '#888888';
    }
  }

  arrange(prac) {
    var dir, i, len, ref, studies;
    studies = {};
    ref = ['north', 'west', 'east', 'south'];
    for (i = 0, len = ref.length; i < len; i++) {
      dir = ref[i];
      studies[this.key(prac, dir)] = this.obj(prac, dir);
    }
    return studies;
  }

  key(prac, dir) {
    var key, study;
    for (key in prac) {
      study = prac[key];
      if (Util$1.isChild(key) && study.dir === dir) {
        return key;
      }
    }
    return '???';
  }

  obj(prac, dir) {
    var key, study;
    for (key in prac) {
      study = prac[key];
      if (Util$1.isChild(key) && study.dir === dir) {
        return study;
      }
    }
    return {};
  }

  htmlId(pracName, contentName) {
    return Util$1.getHtmlId(pracName, 'Info', contentName); // @ui.plane.id
  }

  size(obj) {
    if (obj != null) {
      return Object.keys(obj).length;
    } else {
      return 0;
    }
  }

  isWest(col) {
    return col === 'Embrace';
  }

  layout(geom, col, ns, ni) {
    var lay;
    lay = {}; // Layout ob
    lay.dir = (this.isWest(col)) ? 1 : -1; // convey direction
    lay.xc = geom.x0; // x center
    lay.yc = geom.y0; // y center
    lay.w = geom.w; // pane width
    lay.h = geom.h; // pane height
    lay.hk = lay.h / 8; // height keyhole rect
    lay.xk = (this.isWest(col)) ? lay.w : 0; // x keyhole rect
    lay.yk = lay.yc - lay.hk; // y keyhole rect
    lay.rs = lay.yc * 0.85; // Outer  study section radius
    lay.ro = lay.rs - lay.hk; // Inner  study section radius
    lay.ri = lay.ro - lay.hk / 4; // Icon   intersction   radius
    lay.yt = lay.yc + lay.ro + lay.rs * 0.65; // y for practice text
    lay.a1 = (this.isWest(col)) ? 60 : 120; // Begin  study section angle
    lay.a2 = (this.isWest(col)) ? 300 : -120; // Ending study section angle
    lay.ns = ns; // Number of studies
    lay.da = (lay.a1 - lay.a2) / lay.ns; // Angle of each section
    lay.ds = lay.da / 12; // Link angle dif
    lay.li = lay.ds / 2; // Link begin inset
    lay.wr = 8; // Width  study rect  24
    lay.hr = lay.ri / lay.ns; // Height study rect
    lay.xr = lay.xc + lay.dir * (lay.rs / 2 + lay.wr); // x orgin study rect
    lay.yr = lay.yc - lay.ri / 2; // r orgin study rect
    lay.dl = lay.hr / 12; // link dif on study rect
    lay.xl = lay.xr + lay.wr; // x link   on study rect
    lay.yl = lay.yr + lay.dl / 2; // y link   on study rect
    lay.ni = ni; // Number of innovative studies
    lay.xi = 0; // x innovative study rects
    lay.yi = lay.yc - lay.ri / 2; // y innovative study rects
    lay.wi = lay.wr; // w innovative study rects
    lay.hi = lay.ri / lay.ni; // h innovative study rects
    lay.thick = 1; // line thickness
    lay.stroke = 'none'; // line stroke
    // console.log( 'Shapes.layout()', col, geom, lay )
    return lay;
  }

  click(path, text) {
    path.style('z-index', '4'); //.style("pointer-events","all").style("visibility", "visible" )
    path.on("click", () => {
      var select;
      //console.log( 'Shape.click',  text )
      select = {}; // UI.toTopic(  text, 'Shapes', UI.SelectStudy )
      return this.stream.publish('Select', select);
    });
  }

  wedge(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId) {
    var arc;
    arc = this.d3.arc().innerRadius(r1).outerRadius(r2).startAngle(this.radD3(a1)).endAngle(this.radD3(a2));
    //console.log( 'Shape.wedge()', { x0:x0, y0:y0 } )
    g.append("svg:path").attr("d", arc).attr("fill", fill).attr("stroke", "none").attr("transform", Vis$2.translate(x0, y0));
    this.wedgeText(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId);
  }

  wedgeText(g, r1, r2, a1, a2, x0, y0, fill, text, wedgeId) {
    var as, at, path, rt, th, x, y;
    Util$1.noop(wedgeId);
    th = 14;
    at = (a1 + a2) / 2;
    if ((210 <= at && at <= 330) || (-150 <= at && at <= -30)) {
      rt = (r1 + r2) / 2 + th * 0.25;
      as = 270 - at;
    } else {
      rt = (r1 + r2) / 2 - th * 0.5;
      as = 90 - at;
    }
    x = x0 + rt * this.cos(at);
    y = y0 + rt * this.sin(at);
    path = g.append("svg:text").text(text).attr("x", x).attr("y", y).attr("transform", Vis$2.rotate(as, x, y)).attr("text-anchor", "middle").attr("font-size", `${th}px`).attr("font-family", this.fontText).attr("font-weight", "bold").attr('fill', '#000000'); // @textFill(fill))
    this.click(path, text);
  }

  icon(g, x0, y0, name, iconId, uc) {
    var path;
    path = g.append("svg:text").text(uc).attr("x", x0).attr("y", y0 + 12).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", "4vh").attr("font-family", "FontAwesome");
    this.click(path, name);
  }

  text(g, x0, y0, name, textId, color, size) {
    var path;
    path = g.append("svg:text").text(name).attr("x", x0).attr("y", y0).attr("id", textId).attr("fill", color).attr("text-anchor", "middle").attr("font-size", size).attr("font-family", this.fontText).attr("font-weight", "bold");
    this.click(path, name);
  }

  link(g, a, ra, rb, xc, yc, xd, yd, xe, ye, stroke, thick) {
    var data, xa, xb, ya, yb;
    xa = xc + ra * this.cos(a);
    ya = yc + ra * this.sin(a);
    xb = xc + rb * this.cos(a);
    yb = yc + rb * this.sin(a);
    data = `M${xa},${ya} C${xb},${yb} ${xd},${yd} ${xe},${ye}`;
    this.curve(g, data, stroke, thick);
  }

  curve(g, data, stroke, thick) {
    g.append("svg:path").attr("d", data).attr("stroke-linejoin", "round").attr("fill", "none").attr("stroke", stroke).attr("stroke-width", thick);
  }

  keyHole(g, xc, yc, xs, ys, ro, ri, fill, stroke = 'none', thick = 0) {
    var a, data, h, isweep, osweep, rh, rx;
    h = yc - ys;
    a = Math.asin(h / ro);
    rx = Math.cos(a) * ro;
    rh = ri;
    osweep = 0; // Negative
    isweep = 1; // Positive
    if (xs < xc) {
      rx = -rx;
      rh = -ri;
      osweep = 1; // Positive
      isweep = 0; // Negative
    }
    data = `M${xs},   ${ys}`;
    data += `L${xc + rx},${ys} A${ro},${ro} 0, 1,${osweep} ${xc + rx},${yc + h}`;
    data += `L${xs},   ${yc + h} L${xs},${ys}`;
    data += `M${xc + rh},${yc} A${ri},${ri} 0, 1,${isweep} ${xc + rh},${yc - 0.001 // Donut hole
}`;
    //console.log( 'Shapes.keyhole()', { xc:xc, yc:yc, xs:xs, ys:ys, ro:ro, ri:ri, h:h, a:a, rx:rx } )
    this.poly(g, data, fill, stroke, thick);
  }

  poly(g, data, fill) {
    g.append("svg:path").attr("d", data).attr("stroke-linejoin", "round").attr("fill", fill);
  }

  // svg:rect x="0" y="0" width="0" height="0" rx="0" ry="0"
  rect(g, x0, y0, w, h, fill, stroke, opacity = 1.0, text = '', size = '2em') {
    g.append("svg:rect").attr("x", x0).attr("y", y0).attr("width", w).attr("height", h).attr("fill", fill).attr("stroke", stroke).style("opacity", opacity);
    if (opacity < 1.0) {
      g.style('background', '#000000');
    }
    if (text !== '') {
      g.append("svg:text").text(text).attr("x", x0 + w / 2).attr("y", y0 + h / 2 + 14).attr('fill', 'wheat').attr("text-anchor", "middle").attr("font-size", size).attr("font-family", this.fontText).attr("font-weight", "bold");
    }
  }

  round(g, x0, y0, w, h, rx, ry, fill, stroke) {
    g.append("svg:rect").attr("x", x0).attr("y", y0).attr("width", w).attr("height", h).attr("rx", rx).attr("ry", ry).attr("fill", fill).attr("stroke", stroke);
  }

  // svg:ellipse cx="0" cy="0" rx="0" ry="0"
  ellipse(g, cx, cy, rx, ry, fill, stroke) {
    g.append("svg:ellipse").attr("cx", cx).attr("cy", cy).attr("rx", rx).attr("ry", ry).attr("fill", fill).attr("stroke", stroke);
  }

  // svg:ellipse cx="0" cy="0" rx="0" ry="0"
  circle(g, cx, cy, r, fill, stroke) {
    g.append("svg:ellipse").attr("cx", cx).attr("cy", cy).attr("r", r).attr("fill", fill).attr("stroke", stroke);
  }

  nodesLinks(studies, innovs) {
    var iK, iKey, innov, key, links, nodes, sK, sKey, study;
    nodes = [];
    for (key in studies) {
      if (!hasProp$3.call(studies, key)) continue;
      study = studies[key];
      nodes.push({
        name: key,
        color: this.toFill(study)
      });
    }
    for (key in innovs) {
      if (!hasProp$3.call(innovs, key)) continue;
      innov = innovs[key];
      nodes.push({
        name: key,
        color: this.toFill(innov)
      });
    }
    links = [];
    sK = 0;
    for (sKey in studies) {
      if (!hasProp$3.call(studies, sKey)) continue;
      study = studies[sKey];
      iK = 4;
      for (iKey in innovs) {
        if (!hasProp$3.call(innovs, iKey)) continue;
        innov = innovs[iKey];
        links.push({
          source: sK,
          target: iK,
          value: 1 // sourceName:sKey, targetName:iKey,
        });
        iK++;
      }
      sK++;
    }
    return {
      //console.log( 'Shape.nodesLinks', nodes, links )
      nodes: nodes,
      links: links
    };
  }

  conveySankey(col, defs, g, studies, innovs, x, y, w, h) {
    var convey, nodesLinks;
    //console.log( { col:col, studies:studies, innovs:innovs, x:x, y:y, w:w, h:h } )
    convey = new Convey$1(this, defs, g, x, y, w, h);
    nodesLinks = {};
    if (col === "Embrace") {
      nodesLinks = this.nodesLinks(studies, innovs);
    } else if (col === "Encourage") {
      nodesLinks = this.nodesLinks(innovs, studies);
    }
    convey.doData(nodesLinks);
  }

  // All flows are colored the north color of yellow [[90,90.90]
  practiceFlow(g, geom, spec) {
    if (spec.row == null) {
      return;
    }
    switch (spec.row) {
      case 'Learn':
        this.flow(g, geom, [90, 90, 90], 'south', 12);
        break;
      case 'Do':
        this.flow(g, geom, [90, 90, 90], 'north', 12);
        this.flow(g, geom, [90, 90, 90], 'south', 12);
        break;
      case 'Share':
        this.flow(g, geom, [90, 90, 90], 'sorth', 12);
        break;
      default:
        console.error(' unknown spec row ', spec.name, spec.row);
        this.flow(g, geom, [90, 90, 90], 'south', 12);
    }
  }

  flow(g, geom, hsv, dir, h) {
    var fill, w, x0, y0;
    w = 18;
    x0 = geom.x0 - w / 2;
    y0 = dir === 'south' ? geom.h - h : 0;
    fill = Vis$2.toRgbHsvStr(hsv);
    this.rect(g, x0, y0, w, h, fill, 'none');
  }

  // Convert degress to radians and make angle counter clockwise
  rad(deg) {
    return (360 - deg) * Math.PI / 180.0;
  }

  //degSVG:( deg ) -> 360-deg
  radD3(deg) {
    return (450 - deg) * Math.PI / 180.0;
  }

  //degD3:( rad )  -> -rad * 180.0 / Math.PI
  cos(deg) {
    return Vis$2.cosSvg(deg);
  }

  sin(deg) {
    return Vis$2.sinSvg(deg);
  }

  gradientDef(defs, id, color1, color2, x1 = '0%', x2 = '100%', y1 = '0%', y2 = '100%') {
    var grad;
    grad = defs.append("svg:linearGradient");
    grad.attr("id", id).attr("x1", x1).attr("y1", y1).attr("x2", x2).attr("y2", y2);
    grad.append("svg:stop").attr("offset", "10%").attr("stop-color", color1);
    grad.append("svg:stop").attr("offset", "90%").attr("stop-color", color2);
  }

  pathPlot(g, stroke, thick, d) {
    g.append('svg:path').attr('d', d).attr('stroke', stroke).attr('stroke-width', thick).attr('fill', 'none').attr("stroke-linejoin", 'round');
  }

  textFill(hex, dark = '#000000', light = '#FFFFFF') {
    if (hex > 0x888888) {
      return dark;
    } else {
      return light;
    }
  }

  saveSvg(name, id) {
    var downloadLink, fileName, svgBlob, svgData, svgUrl;
    fileName = name + '.svg';
    svgData = $('#' + id)[0].outerHTML;
    svgBlob = new Blob([svgData], {
      type: "image/svg+xml;charset=utf-8"
    });
    svgUrl = window['URL'].createObjectURL(svgBlob);
    downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = fileName;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

};

var Shapes$1 = Shapes;

var Embrace,
  hasProp$4 = {}.hasOwnProperty;

Embrace = class Embrace {
  constructor(spec, shapes, build) {
    this.drawSvg = this.drawSvg.bind(this);
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.innovs = this.build.adjacentStudies(this.spec, 'east');
  }

  drawSvg(g, geom, defs) {
    var a, a1, fill, h, i, key, lay, ref, ref1, ref2, ref3, study, w, wedgeId, x, xr, xt, y, yl, yr, yt;
    lay = this.shapes.layout(geom, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.innovs));
    fill = this.shapes.toFill(this.spec, true);
    this.shapes.keyHole(g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke);
    yl = lay.yl;
    a1 = lay.a1;
    xr = lay.xr + lay.wr;
    yr = lay.yr;
    ref = this.studies;
    for (key in ref) {
      if (!hasProp$4.call(ref, key)) continue;
      study = ref[key];
      fill = this.shapes.toFill(study);
      wedgeId = this.shapes.htmlId(study.name, 'Wedge');
      this.shapes.wedge(g, lay.ro, lay.rs, a1, a1 - lay.da, lay.xc, lay.yc, fill, study.name, wedgeId);
      for (a = i = ref1 = a1 - lay.li, ref2 = a1 - lay.da, ref3 = -lay.ds; ref3 !== 0 && (ref3 > 0 ? i < ref2 : i > ref2); a = i += ref3) {
        this.shapes.link(g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick);
        yl += lay.dl;
      }
      a1 -= lay.da;
      yr += lay.hr;
    }
    x = lay.xr + lay.wr;
    y = lay.yr;
    w = lay.w - x;
    h = lay.ri;
    xt = x + w * 0.5;
    yt = geom.y0 * 0.5;
    this.shapes.conveySankey("Embrace", defs, g, this.studies, this.innovs, x, y, w, h);
    this.shapes.icon(g, geom.x0, geom.y0, this.spec.name, this.shapes.htmlId(this.spec.name, 'IconSvg'), Vis$2.unicode(this.spec.icon));
    this.shapes.text(g, xt, yt, this.spec.name, this.shapes.htmlId(this.spec.name, 'TextSvg'), 'wheat', '2em');
    this.shapes.practiceFlow(g, geom, this.spec);
  }

  // Not called but matches innovation
  innovateStudies(g, geom) {
    var fill, h, innov, key, r0, ref, w, x0, y0;
    r0 = geom.x0 / 2 - 36;
    w = 24;
    h = r0 / this.shapes.size(this.innovs);
    x0 = geom.w - w;
    y0 = geom.y0 - r0 / 2;
    ref = this.innovs;
    for (key in ref) {
      if (!hasProp$4.call(ref, key)) continue;
      innov = ref[key];
      fill = this.shapes.toFill(innov);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

};

var Embrace$1 = Embrace;

var Innovate;

Innovate = class Innovate {
  constructor(spec, shapes, build) {
    this.hexStudy = this.hexStudy.bind(this);
    this.line = this.line.bind(this);
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.d3 = Util$1.getGlobal('d3');
    this.studies = this.shapes.arrange(this.spec);
    this.cos30 = this.shapes.cos30;
    this.t = 24;
    this.xh = 0;
    this.yh = 0;
    this.r = 0;
    this.thick = 1;
    this.stroke = 'black';
  }

  drawSvg(g, geom, defs) {
    var key, ref, study;
    Util$1.noop(defs);
    this.lay = this.shapes.layout(geom, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.studies));
    this.colorRing = Vis$2.toRgbHsvStr([90, 55, 90]);
    this.colorBack = 'rgba(97, 56, 77, 1.0 )';
    switch (this.spec.row) {
      case 'Learn':
        this.concept(g, geom);
        break;
      case 'Do':
        this.technology(g, geom);
        break;
      case 'Share':
        this.facilitate(g, geom);
        break;
      default:
        this.technology(g, geom); // Default for group spec
    }
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      this.hexStudy(g, geom, study);
    }
    this.shapes.rect(g, 20, 24, 120, 44, this.colorBack, 'none', 1.0, this.spec.name, '2em');
  }

  concept(g, geom) {
    var t, t1, t2, t3, t4;
    t = 0;
    t1 = 0;
    t2 = 0;
    t3 = 0;
    t4 = 0;
    [t, t1, t2, t3, t4] = [this.t, this.t, this.t * 2, this.t * 4, this.t * 2];
    this.shapes.round(g, t, t1, geom.w - t * 2, geom.h - t4, t, t, this.colorRing, 'none');
    this.shapes.round(g, t * 2, t2, geom.w - t * 4, geom.h - t3, t, t, this.colorBack, 'none');
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
  }

  // "ArchitectEngineerConstruct":{"dir":"pradd","icon":"fa-university","hsv":[ 30,60,90]}
  technology(g, geom) {
    var t, t1, t2, t3, t4, xt, yt;
    t = 0;
    t1 = 0;
    t2 = 0;
    t3 = 0;
    t4 = 0;
    [t, t1, t2, t3, t4] = [this.t, this.t, this.t * 2, this.t * 4, this.t * 2];
    this.shapes.round(g, t, t1, geom.w - t * 2, geom.h - t4, t, t, this.colorRing, 'none');
    this.shapes.round(g, t * 2, t2, geom.w - t * 4, geom.h - t3, t, t, this.colorBack, 'none');
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.northInovate(g, geom, function(study) {
      return study.dir !== 'south';
    });
    this.southInovate(g, geom, function(study) {
      return study.dir !== 'north';
    });
    if (this.spec.name === 'OpenSource') {
      xt = geom.x0 - 65;
      yt = geom.y0 - geom.h * 0.455;
      this.shapes.rect(g, xt, yt, 150, this.t, 'none', 'none', "Architect Engineer Construct", 0.75);
    }
  }

  facilitate(g, geom) {
    var t, t1, t2, t3, t4;
    t = 0;
    t1 = 0;
    t2 = 0;
    t3 = 0;
    t4 = 0;
    [t, t1, t2, t3, t4] = [this.t, this.t, this.t * 2, this.t * 4, this.t * 2];
    this.shapes.round(g, t, t1, geom.w - t * 2, geom.h - t4, t, t, this.colorRing, 'none');
    this.shapes.round(g, t * 2, t2, geom.w - t * 4, geom.h - t3, t, t, this.colorBack, 'none');
    this.eastInovate(g, geom);
    this.westInovate(g, geom);
    this.northInovate(g, geom);
  }

  westInovate(g, geom) {
    var fill, h, key, r0, ref, study, w, x0, y0;
    r0 = this.lay.ri; // geom.x0/2 - 36
    w = 24;
    h = r0 / this.shapes.size(this.studies);
    x0 = geom.w - w;
    y0 = geom.y0 - r0 / 2;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  eastInovate(g, geom) {
    var fill, h, key, r0, ref, study, w, x0, y0;
    r0 = this.lay.ri; // geom.x0/2 - 36
    w = 24;
    h = r0 / this.shapes.size(this.studies);
    x0 = 0;
    y0 = geom.y0 - r0 / 2;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      y0 += h;
    }
  }

  northInovate(g, geom) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = 18;
    h = 24;
    dx = geom.r * 1.5;
    x0 = geom.x0 - dx - w / 2;
    y0 = 0;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  southInovate(g, geom) {
    var dx, fill, h, key, ordered, study, w, x0, y0;
    w = 18;
    h = 24;
    dx = geom.r * 1.5;
    x0 = geom.x0 - dx - w / 2;
    y0 = geom.h - h;
    ordered = this.build.toOrder(this.studies, ['west', 'north', 'east']);
    for (key in ordered) {
      study = ordered[key];
      fill = this.shapes.toFill(study);
      this.shapes.rect(g, x0, y0, w, h, fill, 'none');
      x0 += dx;
    }
  }

  hexStudy(g, geom, study) {
    var dx, dy, fill, i, j, uc, x, x0, y, y0, yh;
    this.r = geom.r;
    dx = this.r * 1.5;
    dy = this.r * 2.0 * this.cos30;
    x0 = geom.x0;
    y0 = geom.y0; // - 26
    j = 0;
    i = 0;
    [j, i] = this.hexPosTier(study.dir);
    yh = j % 2 === 0 ? 0 : this.r * this.cos30;
    x = j * dx + x0;
    y = -i * dy + y0 + yh;
    fill = this.shapes.toFill(study);
    uc = Vis$2.unicode(study.icon);
    // console.log( 'Innovate.hexStudy()', study.icon, uc )
    this.hexPath(fill, g, x, y, this.shapes.htmlId(study.name, 'HexPath'));
    this.hexText(study.name, g, x, y, this.shapes.htmlId(study.name, 'HexText'));
    this.hexIcon(uc, g, x, y, this.shapes.htmlId(study.name, 'HexIcon'));
  }

  hexPosTier(dir) {
    switch (dir) {
      case 'west':
      case 'westd':
        return [-1, 0.5];
      case 'north':
      case 'northd':
        return [0, 0.5];
      case 'east':
      case 'eastd':
        return [1, 0.5];
      case 'south':
      case 'southd':
        return [0, -0.5];
      case 'nw':
      case 'nwd':
        return [-1, 1.5];
      case 'ne':
      case 'ned':
        return [1, 1.5];
      case 'sw':
      case 'swd':
        return [-1, -0.5];
      case 'se':
      case 'sed':
        return [1, -0.5];
      default:
        console.error('Innovate.hexPos() unknown dir', dir, 'returning [0, 0.5] for Service');
        return [0, 0.5];
    }
  }

  line() {
    return this.d3.line().x((ang) => {
      return this.r * Vis$2.cosSvg(ang) + this.xh;
    }).y((ang) => {
      return this.r * Vis$2.sinSvg(ang) + this.yh;
    });
  }

  hexPath(fill, g, x0, y0, pathId) {
    var ang, k, len, path, ref, xp, yp;
    xp = (ang) => {
      return this.r * Vis$2.cosSvg(ang) + x0;
    };
    yp = (ang) => {
      return this.r * Vis$2.sinSvg(ang) + y0;
    };
    path = this.d3.path();
    path.moveTo(xp(0), yp(0));
    ref = [60, 120, 180, 240, 300, 360];
    for (k = 0, len = ref.length; k < len; k++) {
      ang = ref[k];
      path.lineTo(xp(ang), yp(ang));
    }
    path.closePath();
    // console.log( 'hexPathV4 path', path )
    g.append("svg:path").attr("d", path).attr("id", pathId).attr("stroke-width", this.thick).attr("stroke", this.stroke).attr("fill", fill);
  }

  hexText(text, g, x0, y0, textId) {
    var path;
    path = g.append("svg:text").text(text).attr("id", textId).attr("x", x0).attr("y", y0 + 16).attr("text-anchor", "middle").attr("font-size", "2.0vh").attr("font-family", this.shapes.fontText).attr("font-weight", "bold");
    this.shapes.click(path, text);
  }

  hexIcon(icon, g, x0, y0, iconId) {
    g.append("svg:text").text(icon).attr("x", x0).attr("y", y0 - 2).attr("id", iconId).attr("text-anchor", "middle").attr("font-size", "3.0vh").attr("font-family", "FontAwesome");
  }

};

/*

x0y0:( j, i, r, x0, y0 ) ->
dx = @r * 1.5
dy = @r * 2.0 * @cos30
yh = if j % 2 is 0 then 0 else  @r*@cos30
x  =  j*dx + x0
y  = -i*dy + y0 + yh
[x,y]

 * Not used but good example
hexLoc:( g, id, j,i, r, fill, text="", icon="" ) ->
[x0,y0] = @x0y0( j, i, @r, @x0, @y0 )
@hexPath( fill, g, x0, y0, id )
@hexText( text, g, x0, y0, id ) if Util.isStr(text)
@hexIcon( icon, g, x0, y0, id ) if Util.isStr(icon)
{ x0, y0, r }

hexPos:( dir ) ->
@hexPosTier(dir) # if @spec.svg? and @spec.svg is 'Data' then @hexPosData(dir) else @hexPosTier(dir)
return

hexPosData:( dir ) ->
switch dir
when 'west'           then [-1,   0.0]
when 'westd'          then [-2,   0.0]
when 'north','northd' then [ 0,   0.0]
when 'east'           then [ 1,   0.0]
when 'eastd'          then [ 2,   0.0]
when 'south','southd' then [ 0,   0.0]
when 'nw',   'nwd'    then [-1,   1.0]
when 'ne',   'ned'    then [ 1,   1.0]
when 'sw'             then [-1,   0.0]
when 'swd'            then [-1,   0.0]
when 'se'             then [ 1,   0.0]
when 'sed'            then [ 1,   0.0]
else
  console.error( 'Innovate.hexPos() unknown dir', dir, 'returning [0, 0.5] for Service' )
  [0, 0.5]

 * Not working in v4
hexPathV3:( fill, g, x0, y0, pathId ) ->
@xh = x0
@yh = y0
g.append("svg:path").data(@angs).attr("id", pathId ).attr( "d", @line(@angs) )
.attr("stroke-width", @thick ).attr("stroke", @stroke ).attr("fill", fill )
return
 */
var Innovate$1 = Innovate;

var Encourage;

Encourage = class Encourage {
  constructor(spec, shapes, build) {
    this.spec = spec;
    this.shapes = shapes;
    this.build = build;
    this.studies = this.shapes.arrange(this.spec);
    this.innovs = this.build.adjacentStudies(this.spec, 'west');
  }

  drawSvg(g, geom, defs) {
    var a, a1, fill, h, i, key, lay, r0, ref, ref1, ref2, ref3, study, w, wedgeId, x, xr, xt, y, yl, yr, yt;
    lay = this.shapes.layout(geom, this.spec.column, this.shapes.size(this.studies), this.shapes.size(this.innovs));
    fill = this.shapes.toFill(this.spec, true);
    this.shapes.keyHole(g, lay.xc, lay.yc, lay.xk, lay.yk, lay.ro, lay.hk, fill, lay.stroke);
    yl = lay.yl;
    a1 = lay.a1;
    xr = lay.xr + lay.wr;
    yr = lay.yr;
    ref = this.studies;
    for (key in ref) {
      study = ref[key];
      fill = this.shapes.toFill(study);
      wedgeId = this.shapes.htmlId(study.name, 'Wedge');
      this.shapes.wedge(g, lay.ro, lay.rs, a1, a1 - lay.da, lay.xc, lay.yc, fill, study.name, wedgeId);
      for (a = i = ref1 = a1 - lay.li, ref2 = a1 - lay.da, ref3 = -lay.ds; ref3 !== 0 && (ref3 > 0 ? i < ref2 : i > ref2); a = i += ref3) {
        this.shapes.link(g, a, lay.ro, lay.ri, lay.xc, lay.yc, lay.xc, yl, xr, yl, fill, lay.thick);
        yl += lay.dl;
      }
      a1 -= lay.da;
      yr += lay.hr;
    }
    //@innovateStudies( g, lay )
    x = 0; // lay.xr+lay.wr
    r0 = lay.ri; // geom.x0/2 - 36
    y = geom.y0 - r0 / 2; // lay.yr
    w = lay.xr + lay.wr;
    h = r0; // lay.ri
    xt = x + w * 0.5;
    yt = geom.y0 * 0.5;
    this.shapes.conveySankey("Encourage", defs, g, this.studies, this.innovs, x, y, w, h);
    this.shapes.icon(g, geom.x0, geom.y0, this.spec.name, this.shapes.htmlId(this.spec.name, 'IconSvg'), Vis$2.unicode(this.spec.icon));
    this.shapes.text(g, xt, yt, this.spec.name, this.shapes.htmlId(this.spec.name, 'TextSvg'), 'wheat', '2em');
    this.shapes.practiceFlow(g, geom, this.spec);
  }

  // Not called but matches Sankey
  innovateStudies(g, lay) {
    var fill, innov, key, ref, yi;
    yi = lay.yi;
    ref = this.innovs;
    for (key in ref) {
      innov = ref[key];
      fill = this.shapes.toFill(innov);
      this.shapes.rect(g, lay.xi, yi, lay.wi, lay.hi, fill, lay.stroke);
      yi += lay.hi;
    }
  }

};

var Encourage$1 = Encourage;

var Connect;

Connect = class Connect {
  constructor(stream, build, prac, size, elem) {
    this.stream = stream;
    this.build = build;
    this.prac = prac;
    this.size = size;
    this.elem = elem;
    this.shapes = new Shapes$1(this.stream);
    this.ready();
  }

  createDraw() {
    switch (this.prac.column) {
      case 'Embrace':
        return new Embrace$1(this.prac, this.shapes, this.build);
      case 'Innovate':
        return new Innovate$1(this.prac, this.shapes, this.build);
      case 'Encourage':
        return new Encourage$1(this.prac, this.shapes, this.build);
      default:
        return new Innovate$1(this.prac, this.shapes, this.build);
    }
  }

  ready() {
    var gId, geo, svgId;
    geo = this.geom(this.size.width, this.size.height, this.size.width, this.size.height);
    this.graph = null;
    this.g = null;
    svgId = '';
    gId = '';
    this.defs = null;
    [this.graph, this.g, svgId, gId, this.defs] = this.shapes.createSvg(this.elem, this.prac.name, this.size.width, this.size.height);
    this.draw = this.createDraw();
    this.draw.drawSvg(this.g, geo, this.defs);
    return this.htmlId = svgId;
  }

  layout() {
    var geo;
    geo = this.geom(this.size.fullWidth, this.size.fullHeight, this.size.width, this.size.height);
    this.shapes.layout(this.graph, this.g, geo.w, geo.h, geo.sx, geo.sy);
  }

  geom(width, height, wgpx, hgpx) {
    var g;
    g = {};
    [g.w, g.h] = [width, height];
    g.r = Math.min(g.w, g.h) * 0.2; // Use for hexagons
    g.x0 = g.w * 0.5;
    g.y0 = g.h * 0.5;
    g.sx = g.w / wgpx;
    g.sy = g.h / hgpx;
    g.s = Math.min(g.sx, g.sy);
    g.fontSize = '2em'; // @toVh( 5 )+'vh'
    g.iconSize = '2em'; // @toVh( 5 )+'vh'
    // console.log( "Connect.geom()", { wgpx:wgpx, hgpx:hgpx }, g )
    return g;
  }

  toFill(hsv) {
    return Vis.toRgbHsvStr(hsv);
  }

};

var Connect$1 = Connect;

//

var script$e = {

  components:{ 'b-tabs':Tabs },

  data() {
    return { comp:'Info', prac:'All', disp:'All', tab:'Connections',
             build:{}, connects:{}, practices:{} }; },

  methods: {
    isPrac: function (prac) {
      return this.prac===prac || this.prac==='All' },
    onPrac: function (prac) {
      this.prac = prac; this.disp='All'; },
    onDisp: function (prac,disp) {
      this.prac = prac; this.disp=disp; },
    pracDir: function(dir) {
      return this.prac==='All' ? dir : 'fullPracDir'; },
    pubTab: function (tab) {
      this.tab = tab; },
    classTab: function (tab) {
      return this.tab===tab ? 'tab-active' : 'tab' },
    style: function( hsv ) {
      return { backgroundColor:this.toRgbaHsv(hsv) }; },
    createConnects: function( stream, build ) {
      //console.log( 'Conn.createConnects() refs', this.$refs );
      let fullWidth  = this.$refs['FullPrac'][0]['clientWidth' ];
      let fullHeight = this.$refs['FullPrac'][0]['clientHeight'];
      
      for( let key in this.practices ) {
        
        if( this.practices.hasOwnProperty(key) ) {
          let prac = this.practices[key];
          if( prac.row !== 'Dim' ) {
            let elem = this.$refs[prac.name][0];
            // console.log( 'Conn.createConnects() elem', elem );
            let size = { fullWidth:fullWidth, fullHeight:fullHeight,
              width:elem['clientWidth' ], height:elem['clientHeight'] };
            // console.log( 'Conn.createConnects() size', size );
            this.connects[prac.name] = new Connect$1( stream, build, prac, size, elem ); } } }
      
      return this.connects; } },

  mounted: function () {
    this.build     = new Build$1( this.batch() );
    this.practices = this.conns(  this.comp );
    this.subscribe(  this.comp, this.comp+'.vue', function(obj) {
      if( obj.disp==='All' ) { this.onPrac(obj.prac); }
      else                   { this.onDisp(obj.prac,obj.disp); } } );
    this.$nextTick( function() {
      this.connects  = this.createConnects( this.stream(), this.build ); } ); }
  };

/* script */
const __vue_script__$f = script$e;

/* template */
var __vue_render__$c = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "conn", attrs: { id: "Conn" } },
    [
      _c("b-tabs"),
      _vm._v(" "),
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
              ref: "FullPrac",
              refInFor: true,
              class: _vm.pracDir(prac.dir)
            },
            [
              _c("div", {
                ref: prac.name,
                refInFor: true,
                staticClass: "prac",
                staticStyle: { "background-color": "rgba(97,56,77,1.0)" },
                attrs: { id: prac.name }
              })
            ]
          )
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$c = [];
__vue_render__$c._withStripped = true;

  /* style */
  const __vue_inject_styles__$f = function (inject) {
    if (!inject) return
    inject("data-v-2a08359f_0", { source: ".conn {\n  background-color: black;\n  position: relative;\n  font-size: 1.75vmin;\n  display: grid;\n  grid-template-columns: 33.3% 33.3% 33.4%;\n  grid-template-rows: 7% 31% 31% 31%;\n  grid-template-areas: \"tabs tabs tabs\" \"nw north ne\" \"west cen east\" \"sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.conn .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.2em;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.conn .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .prac {\n  display: grid;\n  border-radius: 36px;\n  width: 99%;\n  height: 98%;\n  font-size: 1em;\n  font-weight: bold;\n}\n.conn .prac .name {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.conn .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.conn .fullPracDir .prac {\n  font-size: 1em;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.conn .fullPracDir .prac div {\n  padding-bottom: 2em;\n}\n.conn .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.conn .fullPracDir .prac div .disp i {\n  font-size: 1.6em;\n}\n.conn .fullPracDir .prac div .disp .name {\n  font-size: 1.6em;\n}\n.conn .fullPracDir .prac div .disp .desc {\n  font-size: 1em;\n  display: block;\n}\n.conn .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n", map: {"version":3,"sources":["Conn.vue","/Users/ax/Documents/prj/aug/vue/muse/Conn.vue"],"names":[],"mappings":"AAAA;EACE,uBAAuB;EACvB,kBAAkB;EAClB,mBAAmB;EACnB,aAAa;EACb,wCAAwC;EACxC,kCAAkC;EAClC,iFAAiF;EACjF,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,eAAe;EACf,YAAY;EACZ,gBAAgB;EAChB,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,gBAAgB;EAChB,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,cAAc;EACd,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,qBAAqB;EACrB,mBAAmB;ACCrB;AACA;EDCE,aAAa;ECCf,gBAAA;EACA,qBAAA;EDCE,mBAAmB;ECCrB,qBAAA;EACA,mBAAA;ADCA;ACCA;EACA,aAAA;EDCE,aAAa;ECCf,qBAAA;EACA,mBAAA;EACA,qBAAA;EACA,mBAAA;AACA;AACA;EACA,aAAA;EDCE,mBAAmB;ECCrB,UAAA;EACA,WAAA;EDCE,cAAc;ECChB,iBAAA;AACA;AACA;EACA,oBAAA;EACA,kBAAA;EACA,kBAAA;AACA;AACA;EACA,kBAAA;EACA,QAAA;EACA,OAAA;EDCE,SAAS;EACT,UAAU;EACV,aAAa;AACf;AACA;EACE,cAAc;EACd,WAAW;EACX,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,aAAa;EACb,oBAAoB;AACtB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,iBAAiB;AACnB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,gBAAgB;AAClB;AACA;EACE,cAAc;EACd,cAAc;AAChB;AACA;EACE,iBAAiB;AACnB","file":"Conn.vue","sourcesContent":[".conn {\n  background-color: black;\n  position: relative;\n  font-size: 1.75vmin;\n  display: grid;\n  grid-template-columns: 33.3% 33.3% 33.4%;\n  grid-template-rows: 7% 31% 31% 31%;\n  grid-template-areas: \"tabs tabs tabs\" \"nw north ne\" \"west cen east\" \"sw south se\";\n  justify-items: center;\n  align-items: center;\n}\n.conn .tabs {\n  grid-area: tabs;\n  display: inline;\n  color: wheat;\n  font-size: 1.2em;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.conn .nw {\n  display: grid;\n  grid-area: nw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .north {\n  display: grid;\n  grid-area: north;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .ne {\n  display: grid;\n  grid-area: ne;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .west {\n  display: grid;\n  grid-area: west;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .cen {\n  display: grid;\n  grid-area: cen;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .east {\n  display: grid;\n  grid-area: east;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .sw {\n  display: grid;\n  grid-area: sw;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .south {\n  display: grid;\n  grid-area: south;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .se {\n  display: grid;\n  grid-area: se;\n  justify-self: stretch;\n  align-self: stretch;\n  justify-items: center;\n  align-items: center;\n}\n.conn .prac {\n  display: grid;\n  border-radius: 36px;\n  width: 99%;\n  height: 98%;\n  font-size: 1em;\n  font-weight: bold;\n}\n.conn .prac .name {\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.conn .fullPracDir {\n  position: absolute;\n  left: 3%;\n  top: 6%;\n  right: 3%;\n  bottom: 6%;\n  display: grid;\n}\n.conn .fullPracDir .prac {\n  font-size: 1em;\n  width: 100%;\n  height: 100%;\n  justify-self: center;\n  align-self: center;\n  display: grid;\n  border-radius: 0.5em;\n}\n.conn .fullPracDir .prac div {\n  padding-bottom: 2em;\n}\n.conn .fullPracDir .prac div .disp {\n  padding-bottom: 0;\n}\n.conn .fullPracDir .prac div .disp i {\n  font-size: 1.6em;\n}\n.conn .fullPracDir .prac div .disp .name {\n  font-size: 1.6em;\n}\n.conn .fullPracDir .prac div .disp .desc {\n  font-size: 1em;\n  display: block;\n}\n.conn .fullPracDir .prac .area {\n  padding-bottom: 0;\n}\n","\n\n<template>\n  <div id=\"Conn\" class=\"conn\">\n    <b-tabs></b-tabs>\n    <template v-for=\"prac in practices\">\n      <div v-show=\"isPrac(prac.name)\" ref=\"FullPrac\" :class=\"pracDir(prac.dir)\" :key=\"prac.name\">\n        <div :id=\"prac.name\" :ref=\"prac.name\" class=\"prac\" style=\"background-color:rgba(97,56,77,1.0)\">\n          <!--div class=\"name\">{{prac.name}}</div--></div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Build   from '../../pub/cube/Build.js'\n  import Connect from '../../pub/conn/Connect.js'\n  import Tabs    from './Tabs.vue';\n\n  export default {\n\n    components:{ 'b-tabs':Tabs },\n\n    data() {\n      return { comp:'Info', prac:'All', disp:'All', tab:'Connections',\n               build:{}, connects:{}, practices:{} }; },\n\n    methods: {\n      isPrac: function (prac) {\n        return this.prac===prac || this.prac==='All' },\n      onPrac: function (prac) {\n        this.prac = prac; this.disp='All'; },\n      onDisp: function (prac,disp) {\n        this.prac = prac; this.disp=disp; },\n      pracDir: function(dir) {\n        return this.prac==='All' ? dir : 'fullPracDir'; },\n      pubTab: function (tab) {\n        this.tab = tab },\n      classTab: function (tab) {\n        return this.tab===tab ? 'tab-active' : 'tab' },\n      style: function( hsv ) {\n        return { backgroundColor:this.toRgbaHsv(hsv) }; },\n      createConnects: function( stream, build ) {\n        //console.log( 'Conn.createConnects() refs', this.$refs );\n        let fullWidth  = this.$refs['FullPrac'][0]['clientWidth' ];\n        let fullHeight = this.$refs['FullPrac'][0]['clientHeight'];\n        \n        for( let key in this.practices ) {\n          \n          if( this.practices.hasOwnProperty(key) ) {\n            let prac = this.practices[key];\n            if( prac.row !== 'Dim' ) {\n              let elem = this.$refs[prac.name][0]\n              // console.log( 'Conn.createConnects() elem', elem );\n              let size = { fullWidth:fullWidth, fullHeight:fullHeight,\n                width:elem['clientWidth' ], height:elem['clientHeight'] };\n              // console.log( 'Conn.createConnects() size', size );\n              this.connects[prac.name] = new Connect( stream, build, prac, size, elem ); } } }\n        \n        return this.connects; } },\n\n    mounted: function () {\n      this.build     = new Build( this.batch() );\n      this.practices = this.conns(  this.comp );\n      this.subscribe(  this.comp, this.comp+'.vue', function(obj) {\n        if( obj.disp==='All' ) { this.onPrac(obj.prac); }\n        else                   { this.onDisp(obj.prac,obj.disp); } } );\n      this.$nextTick( function() {\n        this.connects  = this.createConnects( this.stream(), this.build ); } ) }\n    }\n\n</script>\n\n<style lang=\"less\">\n  .grid5x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:7% 12% 27% 27% 27%;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"cm em in en\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid4x4() { display:grid; grid-template-columns:7% 31% 31% 31%; grid-template-rows:7% 31% 31% 31%;\n    grid-template-areas: \"tabs tabs tabs tabs\" \"le nw north ne\" \"do west cen east\" \"sh sw south se\"; }\n\n  .grid4x3() { display:grid; grid-template-columns:33.3% 33.3% 33.4%; grid-template-rows:7% 31% 31% 31%;\n    grid-template-areas: \"tabs tabs tabs\" \"nw north ne\" \"west cen east\" \"sw south se\"; }\n  \n  .pdir( @dir ) { display:grid; grid-area:@dir; justify-self:stretch; align-self:stretch;\n    justify-items:center; align-items:center; }\n  \n  .conn { background-color:black; position:relative; font-size:1.75vmin;\n    .grid4x3(); justify-items:center; align-items:center; // The 5x4 Tabs + Dim + Per + 9 Practices Grid\n    .tabs{ grid-area:tabs; display:inline; color:wheat; font-size:1.2em;\n      justify-self:start; align-self:center; text-align:left; }\n    .nw   { .pdir(nw);   } .north { .pdir(north); } .ne   { .pdir(ne);   }\n    .west { .pdir(west); } .cen   { .pdir(cen);   } .east { .pdir(east); }\n    .sw   { .pdir(sw);   } .south { .pdir(south); } .se   { .pdir(se);   }\n    \n    .prac { display:grid; border-radius:36px; width:99%; height:98%; font-size:1em; font-weight:bold;\n      .name { justify-self:center; align-self:center; text-align:center; } }\n  \n    // Placed one level above .prac at the 9 Practices Grid Direction\n    .fullPracDir { position:absolute; left:3%; top:6%; right:3%; bottom:6%; display:grid;\n      .prac { font-size:1em; width:100%; height:100%;\n        justify-self:center; align-self:center; display:grid; border-radius:0.5em;\n        div {     padding-bottom:2em;\n          .disp { padding-bottom:0;\n            i     { font-size:1.6em; }\n            .name { font-size:1.6em; }\n            .desc { font-size:1.0em; display:block; } } }  // Turns on .disp .desc\n        .area { padding-bottom:0; } } }\n  }\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$f = undefined;
  /* module identifier */
  const __vue_module_identifier__$f = undefined;
  /* functional template */
  const __vue_is_functional_template__$f = false;
  /* style inject SSR */
  

  
  var Conn = normalizeComponent_1(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$f,
    __vue_script__$f,
    __vue_scope_id__$f,
    __vue_is_functional_template__$f,
    __vue_module_identifier__$f,
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
//import Cube from './Cube.vue';
//import Wood from '../wood/Wood.vue';

  Dash.Home = Home;
  Dash.Base = Base;
  Dash.Info = Info;
  Dash.Know = Know;
  Dash.Wise = Wise;
  Dash.Conn = Conn;

/* script */
const __vue_script__$g = Dash;

/* template */
var __vue_render__$d = function() {
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
var __vue_staticRenderFns__$d = [];
__vue_render__$d._withStripped = true;

  /* style */
  const __vue_inject_styles__$g = function (inject) {
    if (!inject) return
    inject("data-v-ff38f7de_0", { source: ".dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n", map: {"version":3,"sources":["Dash.vue","/Users/ax/Documents/prj/aug/vue/muse/Dash.vue"],"names":[],"mappings":"AAAA;EACE,+BAA+B;EAC/B,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,aAAa;EACb,oCAAoC;EACpC,gCAAgC;EAChC,uEAAuE;AACzE;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;AACf;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,aAAa;ACCf;AACA;EACA,eAAA;EACA,qBAAA;EACA,mBAAA;EACA,aAAA;AACA","file":"Dash.vue","sourcesContent":[".dash {\n  font-family: Roboto, sans-serif;\n  font-size: 1rem;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  display: grid;\n  grid-template-columns: 11vw 85vw 4vw;\n  grid-template-rows: 6vh 88vh 6vh;\n  grid-template-areas: \"logo navb find\" \"tocs view side\" \"pref foot trak\";\n}\n.dash #logo {\n  grid-area: logo;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #navb {\n  grid-area: navb;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #find {\n  grid-area: find;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #tocs {\n  grid-area: tocs;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #view {\n  grid-area: view;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #side {\n  grid-area: side;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #pref {\n  grid-area: pref;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #foot {\n  grid-area: foot;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n.dash #trak {\n  grid-area: trak;\n  justify-self: stretch;\n  align-self: stretch;\n  display: grid;\n}\n","\n<template>\n  <div class=\"dash\">\n    <d-logo id=\"logo\"></d-logo>\n    <d-navb id=\"navb\"></d-navb>\n    <d-find id=\"find\"></d-find>\n    <d-tocs id=\"tocs\"></d-tocs>\n    <d-view id=\"view\"></d-view>\n    <d-side id=\"side\"></d-side>\n    <d-pref id=\"pref\"></d-pref>\n    <d-foot id=\"foot\"></d-foot>\n    <d-trak id=\"trak\"></d-trak>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Logo from '../dash/Logo.vue';\n  import Navb from '../dash/Navb.vue';\n  import Find from '../dash/Find.vue';\n  import Tocs from './Tocs.vue';\n  import View from './View.vue';\n  import Side from '../dash/Side.vue';\n  import Pref from '../dash/Pref.vue';\n  import Foot from '../dash/Foot.vue';\n  import Trak from '../dash/Trak.vue';\n\n  \n  let Dash = {\n      name: 'dash',\n      components: {\n        'd-logo':Logo, 'd-navb':Navb, 'd-find':Find,\n        'd-tocs':Tocs, 'd-view':View, 'd-side':Side,\n        'd-pref':Pref, 'd-foot':Foot, 'd-trak':Trak } };\n\n  // Static imports for minimizing build steps in dev.\n  import Home from './Home.vue';\n  import Base from './Base.vue';\n  import Info from './Info.vue';\n  import Know from './Know.vue';\n  import Wise from './Wise.vue';\n  import Conn from './Conn.vue';\n//import Cube from './Cube.vue';\n//import Wood from '../wood/Wood.vue';\n\n  Dash.Home = Home;\n  Dash.Base = Base;\n  Dash.Info = Info;\n  Dash.Know = Know;\n  Dash.Wise = Wise;\n  Dash.Conn = Conn;\n//Dash.Cube = Cube;\n//Dash.Wood = Wood;\n \n  export default Dash;\n  \n</script>\n\n<style lang=\"less\">\n\n   .dash { font-family:Roboto, sans-serif; font-size:1rem;\n     position:absolute; left:0; top:0; right:0; bottom:0; display:grid;\n     grid-template-columns: 11vw 85vw 4vw;\n     grid-template-rows:     6vh 88vh 6vh;\n     grid-template-areas:\n       \"logo navb find\"\n       \"tocs view side\"\n       \"pref foot trak\";\n\n    #logo { grid-area:logo; justify-self:stretch; align-self:stretch; display:grid; }\n    #navb { grid-area:navb; justify-self:stretch; align-self:stretch; display:grid; }\n    #find { grid-area:find; justify-self:stretch; align-self:stretch; display:grid; }\n    #tocs { grid-area:tocs; justify-self:stretch; align-self:stretch; display:grid; }\n    #view { grid-area:view; justify-self:stretch; align-self:stretch; display:grid; }\n    #side { grid-area:side; justify-self:stretch; align-self:stretch; display:grid; }\n    #pref { grid-area:pref; justify-self:stretch; align-self:stretch; display:grid; }\n    #foot { grid-area:foot; justify-self:stretch; align-self:stretch; display:grid; }\n    #trak { grid-area:trak; justify-self:stretch; align-self:stretch; display:grid; } }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$g = undefined;
  /* module identifier */
  const __vue_module_identifier__$g = undefined;
  /* functional template */
  const __vue_is_functional_template__$g = false;
  /* style inject SSR */
  

  
  var Dash$1 = normalizeComponent_1(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$g,
    __vue_script__$g,
    __vue_scope_id__$g,
    __vue_is_functional_template__$g,
    __vue_module_identifier__$g,
    browser,
    undefined
  );

export default Dash$1;
