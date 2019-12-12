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

  props: { route:String, pages:Object, defn:{ default:'null', type:String }, position:{ default:'full', type:String } },
  
  data() { return { pageKey:'None', pageObj:null,
    positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
  
  methods: {
    onPage: function (key) {
      if( key !== 'None') {
        this.pageKey = key;
        this.nav().setPageKey( this.route, key ); } },
    doPage: function (key) {
        this.onPage( key );
        let route = this.isDef(this.pages[key].route) ? this.pages[key].route : this.route;
        this.nav().pub( { source:'Tabs', route:route, pageKey:key } ); },
    stylePos: function () {
      return this.positions[this.position]; },
    classTab: function (pageKey) {
      return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },

  created: function () {  // We want to set the routes pages asap
    this.onPage( this.nav().setPages( this.route, this.pages, this.defn ) ); },

  mounted: function() {
    this.subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
      if( obj.source !== 'Tabs' && obj.route === this.route ) {
        this.onPage( obj.pageKey ); } } ); }  // this.nav().getPageKey(this.route)
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
    { staticClass: "tabs-pane", style: _vm.stylePos() },
    [
      _vm._l(_vm.pages, function(pageObj) {
        return [
          _c(
            "div",
            {
              class: _vm.classTab(pageObj.key),
              on: {
                click: function($event) {
                  return _vm.doPage(pageObj.key)
                }
              }
            },
            [_vm._v(_vm._s(pageObj.title))]
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
    inject("data-v-36652744_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;ECCtB,kBAAA;EDCE,kBAAkB;ACCpB;ADCA;ECCA,gBAAA;EACA,+BAAA;EDCE,aAAa;ECCf,mBAAA;EACA,kBAAA;EACA,gBAAA;AACA;AACA;EACA,kBAAA;EDCE,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,uBAAuB;EACvB,gBAAgB;EAChB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,UAAU;EACV,UAAU;AACZ;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Tabs.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: wheat;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"tabs-pane\" :style=\"stylePos()\">\n    <template v-for=\"pageObj in pages\">\n      <div :class=\"classTab(pageObj.key)\" @click=\"doPage(pageObj.key)\">{{pageObj.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { route:String, pages:Object, defn:{ default:'null', type:String }, position:{ default:'full', type:String } },\n    \n    data() { return { pageKey:'None', pageObj:null,\n      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },\n    \n    methods: {\n      onPage: function (key) {\n        if( key !== 'None') {\n          this.pageKey = key;\n          this.nav().setPageKey( this.route, key ); } },\n      doPage: function (key) {\n          this.onPage( key );\n          let route = this.isDef(this.pages[key].route) ? this.pages[key].route : this.route\n          this.nav().pub( { source:'Tabs', route:route, pageKey:key } ); },\n      stylePos: function () {\n        return this.positions[this.position]; },\n      classTab: function (pageKey) {\n        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },\n\n    created: function () {  // We want to set the routes pages asap\n      this.onPage( this.nav().setPages( this.route, this.pages, this.defn ) ); },\n\n    mounted: function() {\n      this.subscribe(  \"Nav\", 'Tabs.vue.'+this.route, (obj) => {\n        if( obj.source !== 'Tabs' && obj.route === this.route ) {\n          this.onPage( obj.pageKey ); } } ); }  // this.nav().getPageKey(this.route)\n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @tabsFS:1.5*@themeFS;\n  \n  .tabs-pane { background-color:@theme-back; font-size:@tabsFS;\n    position:absolute; left:0; top:0; width:@theme-tabs-width; height:@theme-tabs-height;\n    \n    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;\n      border-radius:12px 12px 0 0; border-left: @theme-fore solid thin;\n      border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;\n                  background-color:@theme-back;  color:@theme-fore;}\n    .tabs-tab:hover  {         background-color:@theme-fore; color:@theme-back; }\n    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Tabs = normalizeComponent_1(
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


let Dims = {

  props: { dispObj:Object, from:String },

  methods: {
    doClick: function (key) {
      if( this.isDef(this.dispObj.column) ) { this.doPrac(key); }
      else                                  { this.doDisp(key); } },
    gridClass: function() {
      return this.dispObj.column==="Innovate" ? 'dd-4x4' : 'dd-4x3'; },
    doDisp:  function (dispKey) {
      let obj = { route:"Disp", dispKey:dispKey }; // pracKey:this.pracObj.name,
      this.nav().pub( obj ); },
    doPrac: function (pracKey) {
      let obj = { route:"Prac", pracKey:pracKey };
      this.nav().pub( obj ); },
    dispClass: function() {
      return this.from==='Disp' ? 'dims-disp' : 'dims-dirs';
    },
    style: function( ikwObj ) {
      let fontSize = this.from==='Disp' ? 2.0 : 1.0;
      return this.styleObj(ikwObj,fontSize); } },
};

/* script */
const __vue_script__$1 = Dims;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { class: _vm.dispClass(), style: _vm.style(_vm.dispObj) }, [
    _c(
      "div",
      {
        staticClass: "dims-head",
        on: {
          click: function($event) {
            return _vm.doClick(_vm.dispObj.name)
          }
        }
      },
      [
        _c("div", { staticClass: "dims-title" }, [
          _c("i", { class: _vm.dispObj.icon }),
          _vm._v(" "),
          _c("span", { staticClass: "dims-name" }, [
            _vm._v(_vm._s(_vm.dispObj.name))
          ])
        ])
      ]
    ),
    _vm._v(" "),
    _c(
      "div",
      { class: _vm.gridClass() },
      [
        _vm._l(_vm.dispObj.dims, function(ddObj) {
          return [
            _c("div", { class: ddObj.klass }, [
              _c("i", { class: ddObj.icon }),
              _vm._v(" "),
              _c("span", { staticClass: "dims-name" }, [
                _vm._v(_vm._s(ddObj.name))
              ])
            ])
          ]
        })
      ],
      2
    )
  ])
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-3768f549_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.dims-disp {\n  font-size: 5.2vmin;\n  border-radius: 1.3vmin;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n}\n.dims-dirs {\n  font-size: 2.6vmin;\n  border-radius: 36px;\n}\n.dims-head {\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 5.98vmin;\n}\n.dims-head .dims-title {\n  display: inline;\n}\n.dims-head .dims-title i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dims-head .dims-title .dims-name {\n  display: inline-block;\n}\n.dd-4x3 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pk pw\" \"li lk lw\" \"di dk dw\" \"si sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x3 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pd pk pw\" \"li ld lk lw\" \"di dd dk dw\" \"si sd sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x4 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pd {\n  display: inline;\n  grid-area: pd;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pd i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .ld {\n  display: inline;\n  grid-area: ld;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .ld i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .ld .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dd {\n  display: inline;\n  grid-area: dd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sd {\n  display: inline;\n  grid-area: sd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sw .dims-name {\n  display: inline-block;\n}\n", map: {"version":3,"sources":["Dims.vue","/Users/ax/Documents/prj/aug/vue/prac/Dims.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;ECCf,mBAAA;EDCE,kBAAkB;ECCpB,gBAAA;ADCA;ACCA;EACA,kBAAA;EDCE,OAAO;ECCT,MAAA;EACA,WAAA;EDCE,YAAY;ACCd;AACA;EDCE,kBAAkB;ECCpB,OAAA;EDCE,MAAM;ECCR,WAAA;EACA,WAAA;AACA;AACA;EDCE,kBAAkB;ECCpB,OAAA;EACA,QAAA;EACA,WAAA;EDCE,WAAW;ACCb;AACA;EACA,kBAAA;EDCE,OAAO;ECCT,QAAA;EACA,WAAA;EACA,WAAA;AACA;AACA;EDCE,gBAAgB;ECClB,UAAA;EACA,SAAA;EACA,gBAAA;EACA,iBAAA;AACA;ADCA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,sBAAsB;EACtB,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,QAAQ;EACR,SAAS;AACX;AACA;EACE,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,mBAAmB;AACrB;AACA;EACE,eAAe;AACjB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,kCAAkC;EAClC,mCAAmC;EACnC,gEAAgE;EAChE,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,aAAa;EACb,sCAAsC;EACtC,mCAAmC;EACnC,4EAA4E;EAC5E,oBAAoB;AACtB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,qBAAqB;AACvB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB;AACA;EACE,eAAe;EACf,aAAa;EACb,mBAAmB;EACnB,gBAAgB;AAClB;AACA;EACE,qBAAqB;EACrB,sBAAsB;AACxB;AACA;EACE,qBAAqB;AACvB","file":"Dims.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.dims-disp {\n  font-size: 5.2vmin;\n  border-radius: 1.3vmin;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  right: 0;\n  bottom: 0;\n}\n.dims-dirs {\n  font-size: 2.6vmin;\n  border-radius: 36px;\n}\n.dims-head {\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n  font-size: 5.98vmin;\n}\n.dims-head .dims-title {\n  display: inline;\n}\n.dims-head .dims-title i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dims-head .dims-title .dims-name {\n  display: inline-block;\n}\n.dd-4x3 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pk pw\" \"li lk lw\" \"di dk dw\" \"si sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x3 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x3 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x3 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x3 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x3 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x3 .sw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr 1fr;\n  grid-template-rows: 1fr 1fr 1fr 1fr;\n  grid-template-areas: \"pi pd pk pw\" \"li ld lk lw\" \"di dd dk dw\" \"si sd sk sw\";\n  margin-left: 2.6vmin;\n}\n.dd-4x4 .pi {\n  display: inline;\n  grid-area: pi;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pi i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pi .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pd {\n  display: inline;\n  grid-area: pd;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pd i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pk {\n  display: inline;\n  grid-area: pk;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pk i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .pw {\n  display: inline;\n  grid-area: pw;\n  font-size: 3.12vmin;\n  text-align: left;\n}\n.dd-4x4 .pw i {\n  display: inline-block;\n  margin-right: 0.25rem;\n}\n.dd-4x4 .pw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .li {\n  display: inline;\n  grid-area: li;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .li i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .li .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .ld {\n  display: inline;\n  grid-area: ld;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .ld i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .ld .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lk {\n  display: inline;\n  grid-area: lk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .lw {\n  display: inline;\n  grid-area: lw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .lw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .lw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .di {\n  display: inline;\n  grid-area: di;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .di i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .di .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dd {\n  display: inline;\n  grid-area: dd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dk {\n  display: inline;\n  grid-area: dk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .dw {\n  display: inline;\n  grid-area: dw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .dw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .dw .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .si {\n  display: inline;\n  grid-area: si;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .si i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .si .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sd {\n  display: inline;\n  grid-area: sd;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sd i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sd .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sk {\n  display: inline;\n  grid-area: sk;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sk i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sk .dims-name {\n  display: inline-block;\n}\n.dd-4x4 .sw {\n  display: inline;\n  grid-area: sw;\n  font-size: 2.34vmin;\n  text-align: left;\n}\n.dd-4x4 .sw i {\n  display: inline-block;\n  margin-right: 0.65vmin;\n}\n.dd-4x4 .sw .dims-name {\n  display: inline-block;\n}\n","\n<template>\n  <div  :class=\"dispClass()\" :style=\"style(dispObj)\">\n    <div   class=\"dims-head\" @click=\"doClick(dispObj.name)\">\n      <div class=\"dims-title\">\n        <i   :class=\"dispObj.icon\"></i>\n        <span class=\"dims-name\">{{dispObj.name}}</span>\n      </div>\n    </div>\n    <div  :class=\"gridClass()\">\n      <template v-for=\"ddObj in dispObj.dims\">\n        <div   :class=\"ddObj.klass\">\n          <i   :class=\"ddObj.icon\"></i>\n          <span class=\"dims-name\">{{ddObj.name}}</span>\n        </div>\n      </template>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Dims = {\n\n    props: { dispObj:Object, from:String },\n\n    methods: {\n      doClick: function (key) {\n        if( this.isDef(this.dispObj.column) ) { this.doPrac(key) }\n        else                                  { this.doDisp(key) } },\n      gridClass: function() {\n        return this.dispObj.column===\"Innovate\" ? 'dd-4x4' : 'dd-4x3'; },\n      doDisp:  function (dispKey) {\n        let obj = { route:\"Disp\", dispKey:dispKey }; // pracKey:this.pracObj.name,\n        this.nav().pub( obj ); },\n      doPrac: function (pracKey) {\n        let obj = { route:\"Prac\", pracKey:pracKey };\n        this.nav().pub( obj ); },\n      dispClass: function() {\n        return this.from==='Disp' ? 'dims-disp' : 'dims-dirs';\n      },\n      style: function( ikwObj ) {\n        let fontSize = this.from==='Disp' ? 2.0 : 1.0;\n        return this.styleObj(ikwObj,fontSize); } },\n  }\n\n  export default Dims;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  @dimsFS:1.3*@themeFS;\n\n  .dims-grid4x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr 1fr;\n    grid-template-areas: \"pi pk pw\" \"li lk lw\" \"di dk dw\" \"si sk sw\"; }\n\n  .dims-grid4x4() { display:grid; grid-template-columns:1fr 1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr 1fr;\n    grid-template-areas: \"pi pd pk pw\" \"li ld lk lw\" \"di dd dk dw\" \"si sd sk sw\"; }\n  \n  .dims-disp { font-size:2.0*@dimsFS; border-radius:0.5*@dimsFS;\n    position:absolute; left:0; top:@theme-tabs-height; right:0; bottom:0; }\n\n  .dims-dirs { font-size:@dimsFS; border-radius:36px; }\n\n  .dims-head    { display:grid; justify-self:center; align-self:center; text-align:center; font-size:2.3*@dimsFS;\n    .dims-title { display:inline;\n    i           { display:inline-block;  margin-right:0.25*@dimsFS; }\n    .dims-name  { display:inline-block; } } }\n\n  .plane( @area ) { display:inline; grid-area:@area; font-size:1.2*@dimsFS; text-align:left;\n    i             { display:inline-block;  margin-right: 0.25rem; }\n    .dims-name    { display:inline-block; } }\n\n  .study( @area ) { display:inline; grid-area:@area; font-size:0.9*@dimsFS; text-align:left;\n    i             { display:inline-block;  margin-right:0.25*@dimsFS; }\n    .dims-name    { display:inline-block; } }\n\n  .dd-4x3 { .dims-grid4x3(); margin-left:@dimsFS;\n    .pi { .plane(pi); }  .pk { .plane(pk); }  .pw { .plane(pw); }\n    .li { .study(li); }  .lk { .study(lk); }  .lw { .study(lw); }\n    .di { .study(di); }  .dk { .study(dk); }  .dw { .study(dw); }\n    .si { .study(si); }  .sk { .study(sk); }  .sw { .study(sw); } }\n  \n  .dd-4x4 { .dims-grid4x4(); margin-left:@dimsFS;\n    .pi { .plane(pi); }  .pd { .plane(pd); } .pk { .plane(pk); }  .pw { .plane(pw); }\n    .li { .study(li); }  .ld { .study(ld); } .lk { .study(lk); }  .lw { .study(lw); }\n    .di { .study(di); }  .dd { .study(dd); } .dk { .study(dk); }  .dw { .study(dw); }\n    .si { .study(si); }  .sd { .study(sd); } .sk { .study(sk); }  .sw { .study(sw); } }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Dims$1 = normalizeComponent_1(
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


let Icon = {

  props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },
  
  methods: {
    
    hasSumm: function() {
      return this.isDef(this.summ); },
    
    doClick: function() {
      if( this.isDef(this.fnClick) ) {
        this.fnClick(this.name); } },

    style: function() {
      return this.fontSizeCss(this.size); }
  }
};

/* script */
const __vue_script__$2 = Icon;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "icon-pane", style: _vm.style() }, [
    _c(
      "div",
      {
        staticClass: "icon-line",
        on: {
          click: function($event) {
            return _vm.doClick()
          }
        }
      },
      [
        _c("span", { staticClass: "icon-icon" }, [
          _c("i", { class: _vm.icon })
        ]),
        _vm._v(" "),
        _c("span", { staticClass: "icon-name" }, [_vm._v(_vm._s(_vm.name))])
      ]
    )
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-2bfd5374_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.icon-pane {\n  display: grid;\n  height: 100%;\n}\n.icon-pane .icon-line {\n  display: inline;\n  justify-self: center;\n  text-align: center;\n  height: auto;\n}\n.icon-pane .icon-line .icon-icon {\n  display: inline-block;\n  margin-right: 1vmin;\n}\n.icon-pane .icon-line .icon-name {\n  display: inline-block;\n}\n", map: {"version":3,"sources":["Icon.vue","/Users/ax/Documents/prj/aug/vue/elem/Icon.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;ECCf,oBAAA;EDCE,kBAAkB;ECCpB,kBAAA;ADCA;ACCA;EDCE,mBAAmB;ECCrB,+BAAA;EDCE,aAAa;ECCf,oBAAA;EDCE,kBAAkB;ECCpB,kBAAA;AACA;ADCA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,aAAa;EACb,YAAY;AACd;AACA;EACE,eAAe;EACf,oBAAoB;EACpB,kBAAkB;EAClB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,qBAAqB;AACvB","file":"Icon.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.icon-pane {\n  display: grid;\n  height: 100%;\n}\n.icon-pane .icon-line {\n  display: inline;\n  justify-self: center;\n  text-align: center;\n  height: auto;\n}\n.icon-pane .icon-line .icon-icon {\n  display: inline-block;\n  margin-right: 1vmin;\n}\n.icon-pane .icon-line .icon-name {\n  display: inline-block;\n}\n","\n<template>\n  <div      class=\"icon-pane\" :style=\"style()\">\n    <div    class=\"icon-line\" @click=\"doClick()\">\n      <span class=\"icon-icon\"><i :class=\"icon\"></i></span>\n      <span class=\"icon-name\">{{name}}</span>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Icon = {\n\n    props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },\n    \n    methods: {\n      \n      hasSumm: function() {\n        return this.isDef(this.summ); },\n      \n      doClick: function() {\n        if( this.isDef(this.fnClick) ) {\n          this.fnClick(this.name); } },\n\n      style: function() {\n        return this.fontSizeCss(this.size); }\n    }\n  }\n  \n  export default Icon;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @iconFS:2.0*@themeFS;\n\n  .icon-pane     { display:grid; height:100%;\n  \n    .icon-line   { display:inline; justify-self:center; text-align:center;  height:auto;\n  \n      .icon-icon { display:inline-block;  margin-right: 0.25*@iconFS; }\n      \n      .icon-name { display:inline-block; } }\n  }\n\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Icon$1 = normalizeComponent_1(
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


let Area = {

  props: { areat:Object, size:Number, fnClick:Function },

  data() { return { area:null } },

  methods: {

    doClick: function(name) {
      if( this.isDef(this.fnClick) ) {
        this.fnClick(name); } },

    style: function() {
      return this.fontSizeCss(this.size); }

  }

};

/* script */
const __vue_script__$3 = Area;

/* template */
var __vue_render__$3 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("table", { staticClass: "area-pane", style: _vm.style() }, [
    _c(
      "tbody",
      [
        _vm._l(_vm.areat, function(area) {
          return [
            _c("tr", [
              _vm.isDef(area.icon)
                ? _c("td", { staticClass: "area-icon" }, [
                    _c("i", { class: area.icon })
                  ])
                : _vm._e(),
              _vm._v(" "),
              _c(
                "td",
                {
                  staticClass: "area-name",
                  on: {
                    click: function($event) {
                      return _vm.doClick(area.name)
                    }
                  }
                },
                [_vm._v(_vm._s(area.name))]
              ),
              _vm._v(" "),
              _c("td", { staticClass: "area-desc" }, [
                _vm._v(_vm._s(area.desc))
              ])
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
    inject("data-v-de514b9c_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.area-pane .area-icon {\n  text-align: center;\n}\n.area-pane .area-name {\n  text-align: left;\n  font-weight: bold;\n}\n.area-pane .area-desc {\n  text-align: left;\n  padding-left: 3vmin;\n}\n", map: {"version":3,"sources":["Area.vue","/Users/ax/Documents/prj/aug/vue/elem/Area.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;ECCrB,+BAAA;EDCE,aAAa;ECCf,oBAAA;EDCE,kBAAkB;ECCpB,kBAAA;AACA;AACA;EACA,gBAAA;EDCE,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,gBAAgB;EAChB,mBAAmB;AACrB","file":"Area.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.area-pane .area-icon {\n  text-align: center;\n}\n.area-pane .area-name {\n  text-align: left;\n  font-weight: bold;\n}\n.area-pane .area-desc {\n  text-align: left;\n  padding-left: 3vmin;\n}\n","\n<template>\n    <table class=\"area-pane\" :style=\"style()\">\n      <tbody>\n        <template v-for=\"area in areat\">\n          <tr >\n            <td v-if=\"isDef(area.icon)\" class=\"area-icon\"><i :class=\"area.icon\"></i></td>\n            <td class=\"area-name\" @click=\"doClick(area.name)\">{{area.name}}</td>\n            <td class=\"area-desc\">{{area.desc}}</td>\n          </tr>\n        </template>\n      </tbody>\n    </table>\n</template>\n\n<script type=\"module\">\n\n  let Area = {\n\n    props: { areat:Object, size:Number, fnClick:Function },\n\n    data() { return { area:null } },\n\n    methods: {\n\n      doClick: function(name) {\n        if( this.isDef(this.fnClick) ) {\n          this.fnClick(name); } },\n\n      style: function() {\n        return this.fontSizeCss(this.size); }\n\n    }\n\n  }\n\n  export default Area;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @itemFS:1.0*@themeFS;\n  \n  .area-pane {\n      .area-icon { text-align:center;                           }\n      .area-name { text-align:left;   font-weight:bold;         }\n      .area-desc { text-align:left;   padding-left:1.5*@itemFS; } }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$3 = undefined;
  /* module identifier */
  const __vue_module_identifier__$3 = undefined;
  /* functional template */
  const __vue_is_functional_template__$3 = false;
  /* style inject SSR */
  

  
  var Area$1 = normalizeComponent_1(
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

let Desc = {
  
  components: { 'd-icon':Icon$1, 'd-area':Area$1 },

  props: { dispObj:Object, from:String },

  data() { return { areaObj:null, iarea:1 } },

  methods: {
    style: function (ikwObj) {
      return this.styleObj(ikwObj); },
    toDesc: function(desc) {
      return this.isStr(desc) ? desc : "This is a test description"; }
  }
};

/* script */
const __vue_script__$4 = Desc;

/* template */
var __vue_render__$4 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "disp-desc-pane", style: _vm.style(_vm.dispObj) },
    [
      _c("d-icon", {
        staticClass: "disp-desc-icon",
        attrs: { icon: _vm.dispObj.icon, name: _vm.dispObj.name, size: 5.0 }
      }),
      _vm._v(" "),
      _c("div", { staticClass: "disp-desc-summ" }, [
        _vm._v(_vm._s(_vm.dispObj["desc"]))
      ]),
      _vm._v(" "),
      _c("d-area", {
        staticClass: "disp-desc-area",
        attrs: { areat: _vm.dispObj.areas, size: 2.0 }
      })
    ],
    1
  )
};
var __vue_staticRenderFns__$4 = [];
__vue_render__$4._withStripped = true;

  /* style */
  const __vue_inject_styles__$4 = function (inject) {
    if (!inject) return
    inject("data-v-7117403c_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.disp-desc-pane {\n  font-size: 2vmin;\n  color: black;\n  border-radius: 4vmin;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n}\n.disp-desc-pane .disp-desc-icon {\n  position: absolute;\n  left: 0;\n  top: 3%;\n  width: 100%;\n  height: 18%;\n}\n.disp-desc-pane .disp-desc-summ {\n  position: absolute;\n  left: 3%;\n  top: 21%;\n  width: 94%;\n  height: 28%;\n  text-align: left;\n  font-size: 5vmin;\n}\n.disp-desc-pane .disp-desc-area {\n  position: absolute;\n  left: 3%;\n  top: 49%;\n  width: 94%;\n  height: 51%;\n}\n", map: {"version":3,"sources":["Desc.vue","/Users/ax/Documents/prj/aug/vue/disp/Desc.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;ECC/B,aAAA;EDCE,oBAAoB;ECCtB,kBAAA;EACA,kBAAA;ADCA;ACCA;EACA,mBAAA;EACA,+BAAA;EACA,aAAA;EACA,oBAAA;EDCE,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,YAAY;EACZ,oBAAoB;EACpB,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,QAAQ;EACR,UAAU;EACV,WAAW;EACX,gBAAgB;EAChB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,QAAQ;EACR,QAAQ;EACR,UAAU;EACV,WAAW;AACb","file":"Desc.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.disp-desc-pane {\n  font-size: 2vmin;\n  color: black;\n  border-radius: 4vmin;\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n}\n.disp-desc-pane .disp-desc-icon {\n  position: absolute;\n  left: 0;\n  top: 3%;\n  width: 100%;\n  height: 18%;\n}\n.disp-desc-pane .disp-desc-summ {\n  position: absolute;\n  left: 3%;\n  top: 21%;\n  width: 94%;\n  height: 28%;\n  text-align: left;\n  font-size: 5vmin;\n}\n.disp-desc-pane .disp-desc-area {\n  position: absolute;\n  left: 3%;\n  top: 49%;\n  width: 94%;\n  height: 51%;\n}\n","\n<template>\n  <div      class=\"disp-desc-pane\" :style=\"style(dispObj)\">\n    <d-icon class=\"disp-desc-icon\" :icon=\"dispObj.icon\" :name=\"dispObj.name\" :size=\"5.0\" ></d-icon>\n    <div    class=\"disp-desc-summ\">{{dispObj['desc']}}</div>\n    <d-area class=\"disp-desc-area\" :areat=\"dispObj.areas\" :size=\"2.0\"></d-area>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Icon from \"../elem/Icon.vue\"\n  import Area from \"../elem/Area.vue\"\n\n  let Desc = {\n    \n    components: { 'd-icon':Icon, 'd-area':Area },\n\n    props: { dispObj:Object, from:String },\n\n    data() { return { areaObj:null, iarea:1 } },\n\n    methods: {\n      style: function (ikwObj) {\n        return this.styleObj(ikwObj); },\n      toDesc: function(desc) {\n        return this.isStr(desc) ? desc : \"This is a test description\"; }\n    }\n  }\n  export default Desc;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @descFS:@themeFS;\n  @th:@theme-tabs-height;\n\n.disp-desc-pane {   font-size:@descFS; color:black; border-radius:2.0*@descFS;\n                    position:absolute; left:0;  top:@th; width:100%; height:100%-@th;\n  .disp-desc-icon { position:absolute; left:0;  top: 3%; width:100%; height: 18%; }\n  .disp-desc-summ { position:absolute; left:3%; top:21%; width: 94%; height: 28%;text-align:left;font-size:2.5*@descFS;}\n  .disp-desc-area { position:absolute; left:3%; top:49%; width: 94%; height: 51%; } }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$4 = undefined;
  /* module identifier */
  const __vue_module_identifier__$4 = undefined;
  /* functional template */
  const __vue_is_functional_template__$4 = false;
  /* style inject SSR */
  

  
  var Desc$1 = normalizeComponent_1(
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

let Disp = {

  components:{ 'd-tabs':Tabs, 'd-dims':Dims$1, 'd-desc':Desc$1 },
  
  data() { return { dispObj:null, // compKey:'Desc', 
    pages:{
      Dims: { title:'Disciplines',  key:'Dims', show:true  },
      Desc: { title:'Descriptions', key:'Desc', show:false } } } },
  
  methods: {
    
    onDisp: function(dispKey) {
      this.dispObj  = this.dispObject( this.nav().compKey, this.nav().pracKey, dispKey );
      if( !this.isDef(this.dispObj) ) {
        console.error('Disp.onDisp() disp null',{comp:this.nav().compKey,prac:this.nav().pracKey,disp:dispKey});}},
    doPage: function( pageKey ) {
      this.nav().setPageKey( 'Disp', pageKey ); },
    onNav:  function (obj) {
      if( this.nav().isMyNav( obj, 'Disp' ) ) {
          this.onDisp( obj.dispKey ); } } },

  beforeMount: function() {
    this.onDisp( this.nav().dispKey ); },

  mounted: function () {
    this.doPage( this.nav().getPageKey('Disp') );
    this.subscribe(  "Nav", 'Disp.vue', (obj) => {
      this.onNav(obj); } ); }
};

/* script */
const __vue_script__$5 = Disp;

/* template */
var __vue_render__$5 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "disp-pane" },
    [
      _c("d-tabs", { attrs: { route: "Disp", pages: _vm.pages } }),
      _vm._v(" "),
      _vm.pages["Dims"].show
        ? _c("d-dims", { attrs: { dispObj: _vm.dispObj, from: "Disp" } })
        : _vm._e(),
      _vm._v(" "),
      _vm.pages["Desc"].show
        ? _c("d-desc", { attrs: { dispObj: _vm.dispObj, from: "Disp" } })
        : _vm._e()
    ],
    1
  )
};
var __vue_staticRenderFns__$5 = [];
__vue_render__$5._withStripped = true;

  /* style */
  const __vue_inject_styles__$5 = function (inject) {
    if (!inject) return
    inject("data-v-9a649ce4_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.disp-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #333;\n}\n", map: {"version":3,"sources":["Disp.vue","/Users/ax/Documents/prj/aug/vue/disp/Disp.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;ECCjC,aAAA;EDCE,mBAAmB;ECCrB,kBAAA;EDCE,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,sBAAsB;AACxB","file":"Disp.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.disp-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: #333;\n}\n","\n<template>\n  <div class=\"disp-pane\">\n    <d-tabs route=\"Disp\" :pages=\"pages\"></d-tabs>\n    <d-dims v-if=\"pages['Dims'].show\" :dispObj=\"dispObj\" from=\"Disp\"></d-dims>\n    <d-desc v-if=\"pages['Desc'].show\" :dispObj=\"dispObj\" from=\"Disp\"></d-desc>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Tabs from '../elem/Tabs.vue';\n  import Dims from '../prac/Dims.vue';\n  import Desc from './Desc.vue';\n  \n  let Disp = {\n\n    components:{ 'd-tabs':Tabs, 'd-dims':Dims, 'd-desc':Desc },\n    \n    data() { return { dispObj:null, // compKey:'Desc', \n      pages:{\n        Dims: { title:'Disciplines',  key:'Dims', show:true  },\n        Desc: { title:'Descriptions', key:'Desc', show:false } } } },\n    \n    methods: {\n      \n      onDisp: function(dispKey) {\n        this.dispObj  = this.dispObject( this.nav().compKey, this.nav().pracKey, dispKey );\n        if( !this.isDef(this.dispObj) ) {\n          console.error('Disp.onDisp() disp null',{comp:this.nav().compKey,prac:this.nav().pracKey,disp:dispKey})}},\n      doPage: function( pageKey ) {\n        this.nav().setPageKey( 'Disp', pageKey ); },\n      onNav:  function (obj) {\n        if( this.nav().isMyNav( obj, 'Disp' ) ) {\n            this.onDisp( obj.dispKey ); } } },\n\n    beforeMount: function() {\n      this.onDisp( this.nav().dispKey ); },\n\n    mounted: function () {\n      this.doPage( this.nav().getPageKey('Disp') );\n      this.subscribe(  \"Nav\", 'Disp.vue', (obj) => {\n        this.onNav(obj); } ); }\n  }\n  \n  export default Disp;\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  .disp-pane { position:absolute; left:0; top:0; width:100%; height:100%; background-color:@theme-gray; }\n  \n</style>\n\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$5 = undefined;
  /* module identifier */
  const __vue_module_identifier__$5 = undefined;
  /* functional template */
  const __vue_is_functional_template__$5 = false;
  /* style inject SSR */
  

  
  var Disp$1 = normalizeComponent_1(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5,
    __vue_scope_id__$5,
    __vue_is_functional_template__$5,
    __vue_module_identifier__$5,
    browser,
    undefined
  );

export default Disp$1;
