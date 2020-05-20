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

  props: { route:String, pages:Object, position:{ default:'full', type:String } },
  
  data() { return { pageKey:'None', pageObj:null,
    positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },
  
  methods: {
    doTabs: function () {
      this.nav().setPages(this.route,this.pages); // Will only set pages if needed
      let first   = this.pageKey==='None' && !this.mix().hasInov(this.route);
      let pageKey = this.nav().getPageKey(this.route);
      // console.log( 'Tabs.init()', obj, { route:this.route, pageKey:pageKey, pages:this.pages } );
      if( first ){ this.doPage(pageKey); }
      else       { this.onPage(pageKey); } },
    isPage: function (pageKey) {
      return this.mix().isDef(this.route) && this.mix().isDef(pageKey); },
    onPage: function (pageKey) {
      if( this.isPage(pageKey) ) {
        this.pageKey = pageKey;
        this.nav().setPageKey( this.route, pageKey ); }
      else {
        console.log( 'Tabs.onPage() bad pageKey', { route:this.route, pageKey:pageKey } ); } },
    doPage: function (pageKey) {
      if( this.isPage(pageKey) ) {
          this.onPage(pageKey) ;
          let obj = { source:'Tabs',route:this.route };
          obj.inovKey = this.mix().hasInov(this.route) ? pageKey : 'None';
           this.nav().pub(obj); } },
    stylePos: function () {
      return this.positions[this.position]; },
    classTab: function (pageKey) {
      return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },
  mounted: function() {
    this.doTabs();
    this.mix().subscribe(  "Nav", 'Tabs.vue.'+this.route, (obj) => {
      if( obj.source !== 'Tabs'  ) { // && obj.route === this.route
        this.$nextTick( function() {
          this.doTabs(); } ); } } ); }
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
    inject("data-v-4af43c03_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: tan;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n", map: {"version":3,"sources":["Tabs.vue","/Users/ax/Documents/prj/aug/vue/elem/Tabs.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;ACCA;EDCE,kBAAkB;ECCpB,OAAA;EDCE,MAAM;ECCR,WAAA;EACA,YAAA;ADCA;ACCA;EACA,kBAAA;EACA,OAAA;EACA,MAAA;EACA,WAAA;EACA,WAAA;ADCA;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,uBAAuB;EACvB,gBAAgB;EAChB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,UAAU;EACV,UAAU;AACZ;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,YAAY;AACd;AACA;EACE,qBAAqB;EACrB,iBAAiB;EACjB,oCAAoC;EACpC,4BAA4B;EAC5B,6BAA6B;EAC7B,4BAA4B;EAC5B,8BAA8B;EAC9B,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd","file":"Tabs.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.tabs-pane {\n  background-color: black;\n  font-size: 3vmin;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 50%;\n  height: 5%;\n}\n.tabs-pane .tabs-tab {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n}\n.tabs-pane .tabs-tab:hover {\n  background-color: tan;\n  color: black;\n}\n.tabs-pane .tabs-tab-active {\n  display: inline-block;\n  margin-left: 2rem;\n  padding: 0.2rem 0.3rem 0.1rem 0.3rem;\n  border-radius: 12px 12px 0 0;\n  border-left: wheat solid thin;\n  border-top: wheat solid thin;\n  border-right: wheat solid thin;\n  background-color: black;\n  color: wheat;\n  background-color: wheat;\n  color: black;\n}\n","\n<template>\n  <div class=\"tabs-pane\" :style=\"stylePos()\">\n    <template v-for=\"pageObj in pages\">\n      <div :class=\"classTab(pageObj.key)\" @click=\"doPage(pageObj.key)\">{{pageObj.title}}</div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  export default {\n\n    props: { route:String, pages:Object, position:{ default:'full', type:String } },\n    \n    data() { return { pageKey:'None', pageObj:null,\n      positions:{ left:{ left:0, width:'60%' }, right:{ left:'60%', width:'40%' }, full:{ left:0, width:'100%' } } } },\n    \n    methods: {\n      doTabs: function () {\n        this.nav().setPages(this.route,this.pages); // Will only set pages if needed\n        let first   = this.pageKey==='None' && !this.mix().hasInov(this.route);\n        let pageKey = this.nav().getPageKey(this.route);\n        // console.log( 'Tabs.init()', obj, { route:this.route, pageKey:pageKey, pages:this.pages } );\n        if( first ){ this.doPage(pageKey); }\n        else       { this.onPage(pageKey); } },\n      isPage: function (pageKey) {\n        return this.mix().isDef(this.route) && this.mix().isDef(pageKey); },\n      onPage: function (pageKey) {\n        if( this.isPage(pageKey) ) {\n          this.pageKey = pageKey;\n          this.nav().setPageKey( this.route, pageKey ); }\n        else {\n          console.log( 'Tabs.onPage() bad pageKey', { route:this.route, pageKey:pageKey } ); } },\n      doPage: function (pageKey) {\n        if( this.isPage(pageKey) ) {\n            this.onPage(pageKey) ;\n            let obj = { source:'Tabs',route:this.route }\n            obj.inovKey = this.mix().hasInov(this.route) ? pageKey : 'None';\n             this.nav().pub(obj); } },\n      stylePos: function () {\n        return this.positions[this.position]; },\n      classTab: function (pageKey) {\n        return this.pageKey===pageKey ? 'tabs-tab-active' : 'tabs-tab'; } },\n    mounted: function() {\n      this.doTabs();\n      this.mix().subscribe(  \"Nav\", 'Tabs.vue.'+this.route, (obj) => {\n        if( obj.source !== 'Tabs'  ) { // && obj.route === this.route\n          this.$nextTick( function() {\n            this.doTabs(); } ); } } ); }\n    }\n  \n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @tabsFS:1.5*@themeFS;\n  \n  .tabs-pane { background-color:@theme-back; font-size:@tabsFS;\n    position:absolute; left:0; top:0; width:@theme-tabs-width; height:@theme-tabs-height;\n    \n    .tabs-tab { display:inline-block; margin-left:2.0rem; padding:0.2rem 0.3rem 0.1rem 0.3rem;\n      border-radius:12px 12px 0 0; border-left: @theme-fore solid thin;\n      border-top:@theme-fore solid thin; border-right:@theme-fore solid thin;\n                                    background-color:@theme-back; color:@theme-fore; }\n    .tabs-tab:hover  {              background-color:@theme-hove; color:@theme-back; }\n    .tabs-tab-active { .tabs-tab(); background-color:@theme-fore; color:@theme-back; } }\n  \n</style>"]}, media: undefined });

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

var Style;

Style = class Style {
  constructor(elem) {
    this.process = this.process.bind(this);
    this.elem = elem;
    this.width = elem['clientWidth'];
    this.height = elem['clientHeight'];
  }

  process(key, graph) {
    var context, style;
    if (key === 'Objects') {
      this.width * 0.25;
    }
    style = `width:${this.width}px; height:${this.height}px; background:#000000;`;
    graph.setAttribute('style', style);
    if (graph.tagName === 'CANVAS') {
      context = graph.getContext('webgl');
      context.fillStyle = '#000000';
    }
    this.elem.appendChild(graph);
  }

};

var Style$1 = Style;

//

let GeomND = {

  components:{ 'd-tabs':Tabs },

  data() { return { route:'Geom', pages:{} } },

  methods: {
    
    onNav: function(obj) {
      if( this.nav().isMyNav( obj, this.route ) ) {
        this.pageKey = this.nav().getPageKey(this.route);
        if( this.pageKey !== 'None') {
            this.create(this.pageKey); } } },

    create: function( pageKey ) {
      if( !this.pages[pageKey].created ) {
           this.pages[pageKey].created = true;
           this.$nextTick( function() { // Wait for DOM to render
             window['Geom'][pageKey] = new Style$1( this.$refs[pageKey][0] );
             this.pages[pageKey].obj.ga(); } ); } }
  },

  mounted: function () {
    this.nav().setPages( this.route, this.pages );
    this.mix().subscribe(  'Nav', 'Geom.vue', (obj) => {
      this.onNav(obj); } ); }
  };

/* script */
const __vue_script__$1 = GeomND;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { staticClass: "geom-nd-pane" },
    [
      _c("d-tabs", { attrs: { route: _vm.route, pages: _vm.pages } }),
      _vm._v(" "),
      _vm._l(_vm.pages, function(page) {
        return [
          _c("div", {
            directives: [
              {
                name: "show",
                rawName: "v-show",
                value: page.show,
                expression: "page.show"
              }
            ],
            key: page.key,
            ref: page.key,
            refInFor: true,
            staticClass: "geom-nd-page"
          })
        ]
      })
    ],
    2
  )
};
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-08922216_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.geom-nd-page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n  background-color: black;\n  display: grid;\n  font-size: 2vmin;\n}\n", map: {"version":3,"sources":["GeomND.vue","/Users/ax/Documents/prj/aug/vue/geom/GeomND.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;ECCA,gBAAA;EDCE,+BAA+B;ECCjC,aAAA;EDCE,mBAAmB;ECCrB,kBAAA;EDCE,gBAAgB;ACClB;AACA;EDCE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,WAAW;EACX,WAAW;EACX,uBAAuB;EACvB,aAAa;EACb,gBAAgB;AAClB","file":"GeomND.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.geom-nd-page {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n  background-color: black;\n  display: grid;\n  font-size: 2vmin;\n}\n","\n<template>\n  <div class=\"geom-nd-pane\">\n    <d-tabs :route=\"route\" :pages=\"pages\"></d-tabs>\n    <template v-for=\"page in pages\">\n      <div :ref=\"page.key\" v-show=\"page.show\" class=\"geom-nd-page\" :key=\"page.key\"></div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  import Tabs  from '../elem/Tabs.vue';\n  import Style from '../../pub/geom/lib/Style.js';\n\n  let GeomND = {\n\n    components:{ 'd-tabs':Tabs },\n\n    data() { return { route:'Geom', pages:{} } },\n\n    methods: {\n      \n      onNav: function(obj) {\n        if( this.nav().isMyNav( obj, this.route ) ) {\n          this.pageKey = this.nav().getPageKey(this.route);\n          if( this.pageKey !== 'None') {\n              this.create(this.pageKey); } } },\n\n      create: function( pageKey ) {\n        if( !this.pages[pageKey].created ) {\n             this.pages[pageKey].created = true;\n             this.$nextTick( function() { // Wait for DOM to render\n               window['Geom'][pageKey] = new Style( this.$refs[pageKey][0] );\n               this.pages[pageKey].obj.ga(); } ) } }\n    },\n\n    mounted: function () {\n      this.nav().setPages( this.route, this.pages );\n      this.mix().subscribe(  'Nav', 'Geom.vue', (obj) => {\n        this.onNav(obj); } ) }\n    }\n    \n    export default GeomND;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n\n  @geomNDFS:@themeFS;\n  \n  .geom-nd-pane {}\n  \n  .geom-nd-page { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;\n     background-color:@theme-back; display:grid; font-size:@geomNDFS; }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var GeomND$1 = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var ganja_esm = createCommonjsModule(function (module) {
/** Ganja.js - Geometric Algebra - Not Just Algebra. 
  * @author Enki
  * @link   https://github.com/enkimute/ganja.js
  */

/*********************************************************************************************************************/
// 
// Ganja.js is an Algebra generator for javascript. It generates a wide variety of Algebra's and supports operator
// overloading, algebraic literals and a variety of graphing options.
//
// Ganja.js is designed with prototyping and educational purposes in mind. Clean mathematical syntax is the primary
// target.
//
// Ganja.js exports only one function called *Algebra*. This function is used to generate Algebra classes. (say complex
// numbers, minkowski or 3D CGA). The returned class can be used to create, add, multiply etc, but also to upgrade
// javascript functions with algebraic literals, operator overloading, vectors, matrices and much more.
//
// As a simple example, multiplying two complex numbers 3+2i and 1+4i could be done like this :
//
//  var complex = Algebra(0,1);
//  var a = new complex([3,2]);
//  var b = new complex([1,3]); 
//  var result = a.Mul(b);
// 
// But the same can be written using operator overloading and algebraic literals. (where scientific notation with
// lowercase e is overloaded to directly specify generators (e1, e2, e12, ...))
//
//   var result = Algebra(0,1,()=>(3+2e1)*(1+4e1));
//
// Please see github for user documentation and examples. 
//
/*********************************************************************************************************************/

// Documentation below is for implementors. I'll assume you know about Clifford Algebra's, grades, its products, etc ..
// I'll also assume you are familiar with ES6. My style may feel a bith mathematical, advise is to read slow. 

(function (name, context, definition) {
  if (module.exports) module.exports = definition();
  else context[name] = definition();
}('Algebra', commonjsGlobal, function () {

/** The Algebra class generator. Possible calling signatures : 
  *   Algebra([func])                      => algebra with no dimensions, i.e. R. Optional function for the translator.
  *   Algebra(p,[func])                    => 'p' positive dimensions and an optional function to pass to the translator.
  *   Algebra(p,q,[func])                  => 'p' positive and 'q' negative dimensions and optional function.
  *   Algebra(p,q,r,[func])                => 'p' positive, 'q' negative and 'r' zero dimensions and optional function.
  *   Algebra({                            => for custom basis, cayley, mixing, etc pass in an object as first parameter.
  *     [p:p],                             => optional 'p' for # of positive dimensions
  *     [q:q],                             => optional 'q' for # of negative dimensions
  *     [r:r],                             => optional 'r' for # of zero dimensions
  *     [metric:array],                    => alternative for p,q,r. e.g. ([1,1,1,-1] for spacetime)
  *     [basis:array],                     => array of strings with basis names. (e.g. ['1','e1','e2','e12'])
  *     [Cayley:Cayley],                   => optional custom Cayley table (strings). (e.g. [['1','e1'],['e1','-1']])                            
  *     [mix:boolean],                     => Allows mixing of various algebras. (for space efficiency).
  *     [graded:boolean],                  => Use a graded algebra implementation. (automatic for +6D)
  *     [baseType:Float32Array]            => optional basetype to use. (only for flat generator)
  *   },[func])                            => optional function for the translator.
 **/  
  return function Algebra(p,q,r) {
  // Resolve possible calling signatures so we know the numbers for p,q,r. Last argument can always be a function.
    var fu=arguments[arguments.length-1],options=p; if (options instanceof Object) {
      q = (p.q || (p.metric && p.metric.filter(x=>x==-1).length))| 0;
      r = (p.r || (p.metric && p.metric.filter(x=>x==0).length)) | 0;
      p = p.p === undefined ? (p.metric && p.metric.filter(x=>x==1).length) || 0 : p.p || 0;
    } else { options={}; p=p|0; r=r|0; q=q|0; }
  // Support for multi-dual-algebras
    if (p==0 && q==0 && r>1) { // Create a dual number algebra if r>1 .. consider more explicit syntax
      options.basis  = [...Array(r+1)].map((a,i)=>i?'e0'+i:'1');  options.metric = [1,...Array(r)]; options.tot=r+1;
      options.Cayley = [...Array(r+1)].map((a,i)=>[...Array(r+1)].map((y,j)=>i*j==0?((i+j)?'e0'+(i+j):'1'):'0'));
    }
  

  // Calculate the total number of dimensions.
    var tot = options.tot = (options.tot||(p||0)+(q||0)+(r||0)||(options.basis&&options.basis.length))|0;
 
  // Unless specified, generate a full set of Clifford basis names. We generate them as an array of strings by starting
  // from numbers in binary representation and changing the set bits into their relative position.  
  // Basis names are ordered first per grade, then lexically (not cyclic!). 
  // For 10 or more dimensions all names will be double digits ! 1e01 instead of 1e1 .. 
    var basis=options.basis||[...Array(2**tot)]                                                                                 // => [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined]
              .map((x,xi)=>(((1<<30)+xi).toString(2)).slice(-tot||-1)                                                           // => ["000", "001", "010", "011", "100", "101", "110", "111"]  (index of array in base 2)
              .replace(/./g,(a,ai)=>a=='0'?'':String.fromCharCode(66+ai-(r!=0))))                                               // => ["", "3", "2", "23", "1", "13", "12", "123"] (1 bits replaced with their positions, 0's removed)
              .sort((a,b)=>(a.toString().length==b.toString().length)?(a>b?1:b>a?-1:0):a.toString().length-b.toString().length) // => ["", "1", "2", "3", "12", "13", "23", "123"] (sorted numerically)
              .map(x=>x&&'e'+(x.replace(/./g,x=>('0'+(x.charCodeAt(0)-65)).slice(tot>9?-2:-1) ))||'1');                          // => ["1", "e1", "e2", "e3", "e12", "e13", "e23", "e123"] (converted to commonly used basis names)
              
  // See if the basis names start from 0 or 1, store grade per component and lowest component per grade.             
    var low=basis.length==1?1:basis[1].match(/\d+/g)[0]*1,
        grades=options.grades||basis.map(x=>tot>9?(x.length-1)/2:x.length-1),
        grade_start=grades.map((a,b,c)=>c[b-1]!=a?b:-1).filter(x=>x+1).concat([basis.length]);

  // String-simplify a concatenation of two basis blades. (and supports custom basis names e.g. e21 instead of e12)      
  // This is the function that implements e1e1 = +1/-1/0 and e1e2=-e2e1. The brm function creates the remap dictionary.
    var simplify = (s,p,q,r)=>{
          var sign=1,c,l,t=[],f=true,ss=s.match(tot>9?/(\d\d)/g:/(\d)/g);if (!ss) return s; s=ss; l=s.length;
          while (f) { f=false;
          // implement Ex*Ex = metric.
            for (var i=0; i<l;) if (s[i]===s[i+1]) { if ((s[i]-low)>=(p+r)) sign*=-1; else if ((s[i]-low)<r) sign=0; i+=2; f=true; } else t.push(s[i++]);
          // implement Ex*Ey = -Ey*Ex while sorting basis vectors.  
            for (var i=0; i<t.length-1; i++) if (t[i]>t[i+1]) { c=t[i];t[i]=t[i+1];t[i+1]=c;sign*=-1;f=true; break;} if (f) { s=t;t=[];l=s.length; }
          }
          var ret=(sign==0)?'0':((sign==1)?'':'-')+(t.length?'e'+t.join(''):'1'); return (brm&&brm[ret])||(brm&&brm['-'+ret]&&'-'+brm['-'+ret])||ret;
        },
        brm=(x=>{ var ret={}; for (var i in basis) ret[basis[i]=='1'?'1':simplify(basis[i],p,q,r)] = basis[i]; return ret; })(basis);
        
  // As an alternative to the string fiddling, one can also bit-fiddle. In this case the basisvectors are represented by integers with 1 bit per generator set.
    var simplify_bits = (A,B,p2)=>{ var n=p2||(p+q+r),t=0,ab=A&B,res=A^B; if (ab&((1<<r)-1)) return [0,0]; while (n--) t^=(A=A>>1); t&=B; t^=ab>>(p+r); t^=t>>16; t^=t>>8; t^=t>>4; return [1-2*(27030>>(t&15)&1),res]; },
        bc = (v)=>{ v=v-((v>>1)& 0x55555555); v=(v&0x33333333)+((v>>2)&0x33333333); c=((v+(v>>4)&0xF0F0F0F)*0x1010101)>>24; return c }; 
  
  if (!options.graded && tot <= 6 || options.Cayley) {
  // Faster and degenerate-metric-resistant dualization. (a remapping table that maps items into their duals).         
    var drm=basis.map((a,i)=>{ return {a:a,i:i} })
                 .sort((a,b)=>a.a.length>b.a.length?1:a.a.length<b.a.length?-1:(+a.a.slice(1).split('').sort().join(''))-(+b.a.slice(1).split('').sort().join('')) )
                 .map(x=>x.i).reverse(),
        drms=drm.map((x,i)=>(x==0||i==0)?1:simplify(basis[x]+basis[i])[0]=='-'?-1:1);
 
  /// Store the full metric (also for bivectors etc ..)         
    var metric = basis.map((x,xi)=>simplify(x+x,p,q,r)|0);
    
  /// Generate multiplication tables for the outer and geometric products.  
    var mulTable   = options.Cayley||basis.map(x=>basis.map(y=>(x==1)?y:(y==1)?x:simplify(x+y,p,q,r)));

  /// Convert Cayley table to product matrices. The outer product selects the strict sum of the GP (but without metric), the inner product
  /// is the left contraction.           
    var gp=basis.map(x=>basis.map(x=>'0')), cp=gp.map(x=>gp.map(x=>'0')), cps=gp.map(x=>gp.map(x=>'0')), op=gp.map(x=>gp.map(x=>'0')), gpo={};          // Storage for our product tables.
    basis.forEach((x,xi)=>basis.forEach((y,yi)=>{ var n = mulTable[xi][yi].replace(/^-/,''); if (!gpo[n]) gpo[n]=[]; gpo[n].push([xi,yi]); }));
    basis.forEach((o,oi)=>{
      gpo[o].forEach(([xi,yi])=>op[oi][xi]=(grades[oi]==grades[xi]+grades[yi])?((mulTable[xi][yi]=='0')?'0':((mulTable[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']'):'0');
      gpo[o].forEach(([xi,yi])=>{
        gp[oi][xi] =((gp[oi][xi]=='0')?'':gp[oi][xi]+'+')   + ((mulTable[xi][yi]=='0')?'0':((mulTable[xi][yi][0]!='-')?'':'-')+'b['+yi+']*this['+xi+']');
        cp[oi][xi] =((cp[oi][xi]=='0')?'':cp[oi][xi]+'+')   + ((grades[oi]==grades[yi]-grades[xi])?gp[oi][xi]:'0'); 
        cps[oi][xi]=((cps[oi][xi]=='0')?'':cps[oi][xi]+'+') + ((grades[oi]==Math.abs(grades[yi]-grades[xi]))?gp[oi][xi]:'0'); 
      });
    });
    
  /// Flat Algebra Multivector Base Class.
    var generator = class MultiVector extends (options.baseType||Float32Array) {
    /// constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a||basis.length); return this; }
 
    /// grade selection - return a only the part of the input with the specified grade.  
      Grade(grade,res) { res=res||new this.constructor(); for (var i=0,l=res.length; i<l; i++) if (grades[i]==grade) res[i]=this[i]; else res[i]=0; return res; }
      Even(res) { res=res||new this.constructor(); for (var i=0,l=res.length; i<l; i++) if (grades[i]%2==0) res[i]=this[i]; else res[i]=0; return res; }
      
    /// grade creation - convert array with just one grade to full multivector.
      nVector(grade,...args) { this.set(args,grade_start[grade]); return this; }
    
    /// Fill in coordinates (accepts sequence of index,value as arguments)
      Coeff() { for (var i=0,l=arguments.length; i<l; i+=2) this[arguments[i]]=arguments[i+1]; return this; }
      
    /// Negates specific grades (passed in as args)
      Map(res, ...a) { for (var i=0, l=res.length; i<l; i++) res[i] = (~a.indexOf(grades[i]))?-this[i]:this[i]; return res; }

    /// Returns the vector grade only.
      get Vector ()    { return this.slice(grade_start[1],grade_start[2]); };

      toString() { var res=[]; for (var i=0; i<basis.length; i++) if (Math.abs(this[i])>1e-10) res.push(((this[i]==1)&&i?'':((this[i]==-1)&&i)?'-':(this[i].toFixed(10)*1))+(i==0?'':tot==1&&q==1?'i':basis[i].replace('e','e_'))); return res.join('+').replace(/\+-/g,'-')||'0'; }
    };  
    
  /// Convert symbolic matrices to code. (skipping zero's on dot and wedge matrices).
  /// These all do straightforward string fiddling. If the 'mix' option is set they reference basis components using e.g. '.e1' instead of eg '[3]' .. so that
  /// it will work for elements of subalgebras etc.
    generator.prototype.Add   = new Function('b,res','res=res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=b['+xi+']+this['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res');
    generator.prototype.Scale = new Function('b,res','res=res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=b*this['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res');
    generator.prototype.Sub   = new Function('b,res','res=res||new this.constructor();\n'+basis.map((x,xi)=>'res['+xi+']=this['+xi+']-b['+xi+']').join(';\n').replace(/(b|this)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';\nreturn res');
    generator.prototype.Mul   = new Function('b,res','res=res||new this.constructor();\n'+gp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a).replace(/\+0/g,'')+';').join('\n')+'\nreturn res;');
    generator.prototype.LDot  = new Function('b,res','res=res||new this.constructor();\n'+cp.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
    generator.prototype.Dot   = new Function('b,res','res=res||new this.constructor();\n'+cps.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
    generator.prototype.Wedge = new Function('b,res','res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+ri+']='+r.join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');
    generator.prototype.Vee   = new Function('b,res','res=res||new this.constructor();\n'+op.map((r,ri)=>'res['+drm[ri]+']='+r.map(x=>x.replace(/\[(.*?)\]/g,function(a,b){return '['+(drm[b|0])+']'})).join('+').replace(/\+\-/g,'-').replace(/\+0/g,'').replace(/(\w*?)\[(.*?)\]/g,(a,b,c)=>options.mix?'('+b+'.'+(c|0?basis[c]:'s')+'||0)':a)+';').join('\n')+'\nreturn res;');

  /// Add getter and setters for the basis vectors/bivectors etc .. 
    basis.forEach((b,i)=>{generator.prototype.__defineGetter__(i?b:'s',function(){ return this[i] }); }); 
    basis.forEach((b,i)=>{generator.prototype.__defineSetter__(i?b:'s',function(x){ this[i]=x; }); });
    
  /// Reversion, Involutions, Conjugation for any number of grades, component acces shortcuts.
    generator.prototype.__defineGetter__('Negative', function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= -this[i]; return res; });
    generator.prototype.__defineGetter__('Reverse',  function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,1,-1,-1][grades[i]%4]; return res; });
    generator.prototype.__defineGetter__('Involute', function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,1,-1][grades[i]%4]; return res; });
    generator.prototype.__defineGetter__('Conjugate',function(){ var res = new this.constructor(); for (var i=0; i<this.length; i++) res[i]= this[i]*[1,-1,-1,1][grades[i]%4]; return res; });
  
  /// The Dual, Length, non-metric length and normalized getters.  
    generator.prototype.__defineGetter__('Dual',function(){ if (r) return this.map((x,i,a)=>a[drm[i]]*drms[i]); var res = new this.constructor(); res[res.length-1]=1; return res.Mul(this); });
    generator.prototype.__defineGetter__('Length',  function(){  return Math.sqrt(Math.abs(this.Mul(this.Conjugate).s)); }); 
    generator.prototype.__defineGetter__('VLength',  function(){ var res = 0; for (var i=0; i<this.length; i++) res += this[i]*this[i]; return Math.sqrt(res); });
    generator.prototype.__defineGetter__('Normalized', function(){ var res = new this.constructor(),l=this.Length; if (!l) return this; l=1/l; for (var i=0; i<this.length; i++) res[i]=this[i]*l; return res; });
  
  /// Graded generator for high-dimensional algebras.
  } else {
  
  /// extra graded lookups.
    var basisg = grade_start.slice(0,grade_start.length-1).map((x,i)=>basis.slice(x,grade_start[i+1]));
    var counts = grade_start.map((x,i,a)=>i==a.length-1?0:a[i+1]-x).slice(0,tot+1);
    var basis_bits = basis.map(x=>x=='1'?0:x.slice(1).match(tot>9?/\d\d/g:/\d/g).reduce((a,b)=>a+(1<<(b-low)),0)),
        bits_basis = []; basis_bits.forEach((b,i)=>bits_basis[b]=i);    
    var metric = basisg.map((x,xi)=>x.map((y,yi)=>simplify_bits(basis_bits[grade_start[xi]+yi],basis_bits[grade_start[xi]+yi])[0]));
    var drms   = basisg.map((x,xi)=>x.map((y,yi)=>simplify_bits(basis_bits[grade_start[xi]+yi],(~basis_bits[grade_start[xi]+yi])&((1<<tot)-1))[0]));
    
  /// Flat Algebra Multivector Base Class.
    var generator = class MultiVector extends Array {
    /// constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a||tot); return this; }
 
    /// grade selection - return a only the part of the input with the specified grade.  
      Grade(grade,res) { res=new this.constructor(); res[grade] = this[grade]; return res; }
      
    /// grade creation - convert array with just one grade to full multivector.
      nVector(grade,...args) { this[grade]=args; return this; }
    
    /// Fill in coordinates (accepts sequence of index,value as arguments)
      Coeff() { 
                for (var i=0,l=arguments.length; i<l; i+=2) { 
                 var gi = grades[arguments[i]];
                 if (this[gi]==undefined) this[gi]=[];
                 this[gi][arguments[i]-grade_start[gi]]=arguments[i+1]; 
                } 
                return this; 
              }
      
    /// Negates specific grades (passed in as args)
      Map(res, ...a) {  /* tbc */ }

    /// Returns the vector grade only.
      get Vector ()    { return this[1] };
      
    /// multivector addition, subtraction and scalar multiplication.
      Add(b,r) {
        r=r||new this.constructor();
        for (var i=0,l=Math.max(this.length,b.length);i<l;i++) 
          if (!this[i] || !b[i]) r[i] = (!this[i]) ? b[i]:this[i];
          else { if (r[i]==undefined) r[i]=[]; for(var j=0,m=Math.max(this[i].length,b[i].length);j<m;j++) 
          {
            if (typeof this[i][j]=="string" || typeof r[i][j]=="string" || typeof b[i][j]=="string") {
             if (!this[i][j]) r[i][j] = ""+b[i][j];
             else if (!b[i][j]) r[i][j] = ""+this[i][j];
             else r[i][j]="("+(this[i][j]||"0")+(b[i][j][0]=="-"?"":"+")+(b[i][j]||"0")+")"; 
            } else r[i][j]=(this[i][j]||0)+(b[i][j]||0); 
          }}
        return r;
      }
      Sub(b,r) {
        r=r||new this.constructor();
        for (var i=0,l=Math.max(this.length,b.length);i<l;i++) 
          if (!this[i] || !b[i]) r[i] = (!this[i]) ? (b[i]?b[i].map(x=>(typeof x=="string")?"-"+x:-x):undefined):this[i];
          else { if (r[i]==undefined) r[i]=[]; for(var j=0,m=Math.max(this[i].length,b[i].length);j<m;j++) 
            if (typeof this[i][j]=="string" || typeof r[i][j]=="string" || typeof b[i][j]=="string") r[i][j]="("+(this[i][j]||"0")+"-"+(b[i][j]||"0")+")"; 
            else r[i][j]=(this[i][j]||0)-(b[i][j]||0); 
          }    
        return r;
      }
      Scale(s) { return this.map(x=>x&&x.map(y=>typeof y=="string"?y+"*"+s:y*s)); }      
      
    // geometric product.
      Mul(b,r) {
        r=r||new this.constructor(); var gotstring=false;
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i==j && a==bb) { r[0] = r[0]||(typeof x[0]=="string" || typeof y[bb]=="string"?[""]:[0]); 
            if (typeof x[a]=="string" || typeof r[0][0]=="string" || typeof y[bb]=="string") {
            r[0][0] = (r[0][0]?(r[0][0]+(x[a][0]=="-"?"":"+")):"")+ x[a]+"*"+y[bb]+(metric[i][a]!=1?"*"+metric[i][a]:"");  gotstring=true;
            } else r[0][0] += x[a]*y[bb]*metric[i][a]; 
          } else { 
             var rn=simplify_bits(basis_bits[gsx+a],basis_bits[gsy+bb]), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g]; 
             if (!r[g])r[g]=[]; 
               if (typeof r[g][e]=="string"||typeof x[a]=="string"||typeof y[bb]=="string") { 
                 r[g][e] = (r[g][e]?r[g][e]+"+":"") + (rn[0]!=1?rn[0]+"*":"")+ x[a]+(y[bb]!=1?"*"+y[bb]:""); gotstring=true;
               } else r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb];
          }  
        }
        if (gotstring) return r.map(g=>g.map(e=>e&&'('+e+')'))
        return r;
      }    
    // outer product.     
      Wedge(b,r) {
        r=r||new this.constructor();
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i!=j || a!=bb) { 
             var n1=basis_bits[gsx+a], n2=basis_bits[gsy+bb], rn=simplify_bits(n1,n2,tot), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g]; 
             if (g == i+j) { if (!r[g]) r[g]=[]; r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb]; }
          }  
        }
        return r;
      }    
    // outer product glsl output.     
      OPNS_GLSL(b,point_source) {
        var r='',count=0,curg;
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<counts[i]; a++) for (var bb=0; bb<counts[j]; bb++) {
          if (i!=j || a!=bb) { 
             var n1=basis_bits[gsx+a], n2=basis_bits[gsy+bb], rn=simplify_bits(n1,n2,tot), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g]; 
             if (g == i+j) { curg=g; r += `res[${e}]${rn[0]=='1'?"+=":"-="}(${point_source[a]})*b[${bb}]; //${count++}\n`;  }
          }  
        }
        r=r.split('\n').filter(x=>x).sort((a,b)=>((a.match(/\d+/)[0]|0)-(b.match(/\d+/)[0]|0))||((a.match(/\d+$/)[0]|0)-(b.match(/\d+$/)[0]|0))).map(x=>x.replace(/\/\/\d+$/,''));
        var r2 = 'float sum=0.0; float res=0.0;\n', g=0;
        r.forEach(x=>{
          var cg = x.match(/\d+/)[0]|0;
          if (cg != g) r2 += "sum "+(((metric[curg][g]==-1))?"-=":"+=")+" res*res;\nres = 0.0;\n";
          r2 += x.replace(/\[\d+\]/,'') + '\n';
          g=cg;
        });
        r2+= "sum "+((metric[curg][g]==-1)?"-=":"+=")+" res*res;\n";
        return r2;
      }    
    // Left contraction.
      LDot(b,r) {
        r=r||new this.constructor();
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i==j && a==bb) { r[0] = r[0]||[0]; r[0][0] += x[a]*y[bb]*metric[i][a]; } 
          else { 
             var rn=simplify_bits(basis_bits[gsx+a],basis_bits[gsy+bb]), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g]; 
             if (g == j-i) { if (!r[g])r[g]=[]; r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb]; }
          }  
        }
        return r;
      }    
    // Symmetric contraction.
      LDot(b,r) {
        r=r||new this.constructor();
        for (var i=0,x,gsx; gsx=grade_start[i],x=this[i],i<this.length; i++) if (x) for (var j=0,y,gsy;gsy=grade_start[j],y=b[j],j<b.length; j++) if (y) for (var a=0; a<x.length; a++) if (x[a]) for (var bb=0; bb<y.length; bb++) if (y[bb]) {
          if (i==j && a==bb) { r[0] = r[0]||[0]; r[0][0] += x[a]*y[bb]*metric[i][a]; } 
          else { 
             var rn=simplify_bits(basis_bits[gsx+a],basis_bits[gsy+bb]), g=bc(rn[1]), e=bits_basis[rn[1]]-grade_start[g]; 
             if (g == Math.abs(j-i)) { if (!r[g])r[g]=[]; r[g][e] = (r[g][e]||0) + rn[0]*x[a]*y[bb]; }
          }  
        }
        return r;
      }    
    // Should be optimized..  
      Vee(b,r)          { return (this.Dual.Wedge(b.Dual)).Dual; }
    // Output, lengths, involutions, normalized, dual.  
      toString()        { return [...this].map((g,gi)=>g&&g.map((c,ci)=>!c?undefined:c+basisg[gi][ci]).filter(x=>x).join('+')).filter(x=>x).join('+').replace(/\+\-/g,'-'); }  
      get s ()          { if (this[0]) return this[0][0]||0; return 0; }
      get Length ()     { var res=0; this.forEach((g,gi)=>g&&g.forEach((e,ei)=>res+=(e||0)**2*metric[gi][ei])); return Math.abs(res)**.5; }
      get VLength ()    { var res=0; this.forEach((g,gi)=>g&&g.forEach((e,ei)=>res+=(e||0)**2)); return Math.abs(res)**.5; }
      get Reverse ()    { var r=new this.constructor(); this.forEach((x,gi)=>x&&x.forEach((e,ei)=>{if(!r[gi])r[gi]=[]; r[gi][ei] = this[gi][ei]*[1,1,-1,-1][gi%4]; })); return r; }
      get Involute ()   { var r=new this.constructor(); this.forEach((x,gi)=>x&&x.forEach((e,ei)=>{if(!r[gi])r[gi]=[]; r[gi][ei] = this[gi][ei]*[1,-1,1,-1][gi%4]; })); return r; }
      get Conjugate ()  { var r=new this.constructor(); this.forEach((x,gi)=>x&&x.forEach((e,ei)=>{if(!r[gi])r[gi]=[]; r[gi][ei] = this[gi][ei]*[1,-1,-1,1][gi%4]; })); return r; }
      get Dual()        { var r=new this.constructor(); this.forEach((g,gi)=>{ if (!g) return; r[tot-gi]=[]; g.forEach((e,ei)=>r[tot-gi][counts[gi]-1-ei]=drms[gi][ei]*e); }); return r; }
      get Normalized () { return this.Scale(1/this.Length); }
    };  

    
   // This generator is UNDER DEVELOPMENT - I'm publishing it so I can test on observable.
  }
  
  // Generate a new class for our algebra. It extends the javascript typed arrays (default float32 but can be specified in options).
    var res = class Element extends generator {
    
    // constructor - create a floating point array with the correct number of coefficients.
      constructor(a) { super(a); return this; }
      
    // Grade selection. (implemented by parent class).   
      Grade(grade,res) { res=res||new Element(); return super.Grade(grade,res); }
      
    // Right and Left divide - Defined on the elements, shortcuts to multiplying with the inverse.  
      Div  (b,res) { return this.Mul(b.Inverse,res); }
      LDiv (b,res) { return b.Inverse.Mul(this,res); }
    
    // Taylor exp - I will replace this with something smarter for elements of the even subalgebra's and other pure blades.  
      Exp  ()      { 
        if (r==1 && tot<=4 && this[0]==0) { 
          var sq = this.Mul(this).s;       if (sq==0) { var res = Element.Scalar(1); return this.Add(res,res); }
          var l = Math.sqrt(Math.abs(sq)); if (sq<0)  { var res = this.Scale( Math.sin(l)/l ); res[0]=Math.cos(l); return res; }
          var res = this.Scale( Math.sinh(l)/l ); res[0]=Math.cosh(l); return res;
        }
        var res = Element.Scalar(1), y=1, M= new Element(this), N=new Element(this); for (var x=1; x<25; x++) { res=res.Add(M.Mul(Element.Scalar(1/y))); M=M.Mul(N); y=y*(x+1); } return res; 
      }
      
    // Helper for efficient inverses. (custom involutions - negates grades in arguments). 
      Map () { var res=new Element(); return super.Map(res,...arguments); }
      
    // Factories - Make it easy to generate vectors, bivectors, etc when using the functional API. None of the examples use this but
    // users that have used other GA libraries will expect these calls. The Coeff() is used internally when translating algebraic literals.
      static Element()   { return new Element([...arguments]); };
      static Coeff()     { return (new Element()).Coeff(...arguments); }
      static Scalar(x)   { return (new Element()).Coeff(0,x); }
      static Vector()    { return (new Element()).nVector(1,...arguments); }
      static Bivector()  { return (new Element()).nVector(2,...arguments); }
      static Trivector() { return (new Element()).nVector(3,...arguments); }
      static nVector(n)  { return (new Element()).nVector(...arguments); }
    
    // Static operators. The parser will always translate operators to these static calls so that scalars, vectors, matrices and other non-multivectors can also be handled.
    // The static operators typically handle functions and matrices, calling through to element methods for multivectors. They are intended to be flexible and allow as many
    // types of arguments as possible. If performance is a consideration, one should use the generated element methods instead. (which only accept multivector arguments)
      static toEl(x)        { if (x instanceof Function) x=x(); if (!(x instanceof Element)) x=Element.Scalar(x); return x; }
    
    // Addition and subtraction. Subtraction with only one parameter is negation.   
      static Add(a,b,res)   { 
      // Resolve expressions passed in.
        while(a.call)a=a(); while(b.call)b=b(); if (a.Add && b.Add) return a.Add(b,res);  
      // If either is a string, the result is a string.  
        if ((typeof a=='string')||(typeof b=='string')) return a.toString()+b.toString(); 
      // If only one is an array, add the other element to each of the elements.   
        if ((a instanceof Array)^(b instanceof Array)) return (a instanceof Array)?a.map(x=>Element.Add(x,b)):b.map(x=>Element.Add(a,x)); 
      // If both are equal length arrays, add elements one-by-one  
        if ((a instanceof Array)&&(b instanceof Array)&&a.length==b.length) return a.map((x,xi)=>Element.Add(x,b[xi])); 
      // If they're both not elements let javascript resolve it.  
        if (!(a instanceof Element || b instanceof Element)) return a+b; 
      // Here we're left with scalars and multivectors, call through to generated code.   
        a=Element.toEl(a); b=Element.toEl(b); return a.Add(b,res);
      }
      
      static Sub(a,b,res)   {  
      // Resolve expressions passed in.
        while(a.call)a=a(); while(b&&b.call) b=b(); if (a.Sub && b && b.Sub) return a.Sub(b,res);
      // If only one is an array, add the other element to each of the elements.   
        if (b&&((a instanceof Array)^(b instanceof Array))) return (a instanceof Array)?a.map(x=>Element.Sub(x,b)):b.map(x=>Element.Sub(a,x)); 
      // If both are equal length arrays, add elements one-by-one  
        if (b&&(a instanceof Array)&&(b instanceof Array)&&a.length==b.length) return a.map((x,xi)=>Element.Sub(x,b[xi])); 
      // Negation  
        if (arguments.length==1) return Element.Mul(a,-1); 
      // If none are elements here, let js do it.  
        if (!(a instanceof Element || b instanceof Element)) return a-b; 
      // Here we're left with scalars and multivectors, call through to generated code.   
        a=Element.toEl(a); b=Element.toEl(b); return a.Sub(b,res);
      }
    
    // The geometric product. (or matrix*matrix, matrix*vector, vector*vector product if called with 1D and 2D arrays)
      static Mul(a,b,res)   {
      // Resolve expressions  
        while(a.call&&!a.length)a=a(); while(b.call&&!b.length)b=b(); if (a.Mul && b.Mul) return a.Mul(b,res);
      // still functions -> experimental curry style (dont use this.)
        if (a.call && b.call) return (ai,bi)=>Element.Mul(a(ai),b(bi));   
      // scalar mul.
        if (typeof a == 'number' && b.Scale) return b.Scale(a); if (typeof b=='number' && a.Scale) return a.Scale(b);  
      // Handle matrices and vectors.  
        if ((a instanceof Array)&&(b instanceof Array)) { 
        // vector times vector performs a dot product. (which internally uses the GP on each component)
          if((!(a[0] instanceof Array) || (a[0] instanceof Element)) &&(!(b[0] instanceof Array) || (b[0] instanceof Element))) { var r=tot?Element.Scalar(0):0; a.forEach((x,i)=>r=Element.Add(r,Element.Mul(x,b[i]),r)); return r; } 
        // Array times vector  
          if(!(b[0] instanceof Array)) return a.map((x,i)=>Element.Mul(a[i],b)); 
        // Array times Array  
          var r=a.map((x,i)=>b[0].map((y,j)=>{ var r=tot?Element.Scalar(0):0; x.forEach((xa,k)=>r=Element.Add(r,Element.Mul(xa,b[k][j]))); return r; })); 
        // Return resulting array or scalar if 1 by 1.   
          if (r.length==1 && r[0].length==1) return r[0][0]; else return r;  
        } 
      // Only one is an array multiply each of its elements with the other.  
        if ((a instanceof Array)^(b instanceof Array)) return (a instanceof Array)?a.map(x=>Element.Mul(x,b)):b.map(x=>Element.Mul(a,x)); 
      // Try js multiplication, else call through to geometric product.  
        var r=a*b; if (!isNaN(r)) return r; 
        a=Element.toEl(a); b=Element.toEl(b); return a.Mul(b,res);
      }  
      
    // The inner product. (default is left contraction).  
      static LDot(a,b,res)   {  
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); //if (a.LDot) return a.LDot(b,res);
      // Map elements in array  
        if (b instanceof Array && !(a instanceof Array)) return b.map(x=>Element.LDot(a,x)); 
        if (a instanceof Array && !(b instanceof Array)) return a.map(x=>Element.LDot(x,b)); 
      // js if numbers, else contraction product.  
        if (!(a instanceof Element || b instanceof Element)) return a*b; 
        a=Element.toEl(a);b=Element.toEl(b); return a.LDot(b,res); 
      }  
 
    // The symmetric inner product. (default is left contraction).  
      static Dot(a,b,res)   {  
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); //if (a.LDot) return a.LDot(b,res);
      // js if numbers, else contraction product.  
        if (!(a instanceof Element || b instanceof Element)) return a|b; 
        a=Element.toEl(a);b=Element.toEl(b); return a.Dot(b,res); 
      }  
      
    // The outer product. (Grassman product - no use of metric)  
      static Wedge(a,b,res) {  
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.Wedge) return a.Wedge(Element.toEl(b),res); 
      // The outer product of two vectors is a matrix .. internally Mul not Wedge !  
        if (a instanceof Array && b instanceof Array) return a.map(xa=>b.map(xb=>Element.Mul(xa,xb)));
      // js, else generated wedge product.
        if (!(a instanceof Element || b instanceof Element)) return a*b; 
        a=Element.toEl(a);b=Element.toEl(b); return a.Wedge(b,res); 
      }  
      
    // The regressive product. (Dual of the outer product of the duals). 
      static Vee(a,b,res) {  
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.Vee) return a.Vee(Element.toEl(b),res);
      // js, else generated vee product. (shortcut for dual of wedge of duals)
        if (!(a instanceof Element || b instanceof Element)) return 0; 
        a=Element.toEl(a);b=Element.toEl(b); return a.Vee(b,res); 
      }  
     
    // The sandwich product. Provided for convenience (>>> operator)  
      static sw(a,b) {  
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.sw) return a.sw(b);
      // Map elements in array  
        if (b instanceof Array) return b.map(x=>Element.sw(a,x)); 
      // Call through. no specific generated code for it so just perform the muls.  
        a=Element.toEl(a); b=Element.toEl(b); return a.Mul(b).Mul(a.Conjugate); 
      }

    // Division - scalars or cal through to element method.
      static Div(a,b,res) {  
      // Expressions
        while(a.call)a=a(); while(b.call)b=b();
      // js or call through to element divide.  
        if (!(a instanceof Element || b instanceof Element)) return a/b; 
        a=Element.toEl(a);
        if (typeof b=="number") { return a.Scale(1/b,res); }
        b=Element.toEl(b); return a.Div(b,res); 
      }  
      
    // Pow - needs obvious extensions for natural powers. (exponentiation by squaring)  
      static Pow(a,b,res) {  
      // Expressions
        while(a.call)a=a(); while(b.call)b=b(); if (a.Pow) return a.Pow(b,res); 
      // Squaring  
        if (b==2) return this.Mul(a,a,res);
      // No elements, call through to js  
        if (!(a instanceof Element || b instanceof Element)) return a**b; 
      // Inverse  
        if (b==-1) return a.Inverse;  
      // Exponentiation.  
        if (a==Math.E) return b.Exp(); 
      // Call through to element pow.  
        a=Element.toEl(a); return a.Pow(b); 
      }  
      
    // Handles scalars and calls through to element method.  
      static exp(a) {  
      // Expressions.
        while(a.call)a=a(); 
      // If it has an exp callthrough, use it, else call through to math.  
        if (a.Exp) return a.Exp(); 
        return Math.exp(a); 
      }
      
    // Dual, Involute, Reverse, Conjugate, Normalize and length, all direct call through. Conjugate handles matrices.
      static Dual(a)      { return Element.toEl(a).Dual; }; 
      static Involute(a)  { return Element.toEl(a).Involute; }; 
      static Reverse(a)   { return Element.toEl(a).Reverse; }; 
      static Conjugate(a) { if (a.Conjugate) return a.Conjugate; if (a instanceof Array) return a[0].map((c,ci)=>a.map((r,ri)=>Element.Conjugate(a[ri][ci]))); return Element.toEl(a).Conjugate; }
      static Normalize(a) { return Element.toEl(a).Normalized; }; 
      static Length(a)    { return Element.toEl(a).Length };
      
    // Comparison operators always use length. Handle expressions, then js or length comparison  
      static eq(a,b)  { if (!(a instanceof Element)||!(b instanceof Element)) return a==b; while(a.call)a=a(); while(b.call)b=b(); for (var i=0; i<a.length; i++) if (a[i]!=b[i]) return false; return true; }
      static neq(a,b) { if (!(a instanceof Element)||!(b instanceof Element)) return a!=b; while(a.call)a=a(); while(b.call)b=b(); for (var i=0; i<a.length; i++) if (a[i]!=b[i]) return true; return false; }
      static lt(a,b)  { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)<(b instanceof Element?b.Length:b); }
      static gt(a,b)  { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)>(b instanceof Element?b.Length:b); }
      static lte(a,b) { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)<=(b instanceof Element?b.Length:b); }
      static gte(a,b) { while(a.call)a=a(); while(b.call)b=b(); return (a instanceof Element?a.Length:a)>=(b instanceof Element?b.Length:b); }
      
    // Debug output and printing multivectors.  
      static describe(x) { if (x===true) console.log(`Basis\n${basis}\nMetric\n${metric.slice(1,1+tot)}\nCayley\n${mulTable.map(x=>(x.map(x=>('           '+x).slice(-2-tot)))).join('\n')}\nMatrix Form:\n`+gp.map(x=>x.map(x=>x.match(/(-*b\[\d+\])/)).map(x=>x&&((x[1].match(/-/)||' ')+String.fromCharCode(65+1*x[1].match(/\d+/)))||' 0')).join('\n')); return {basis:basisg||basis,metric,mulTable} }    
      
    // Direct sum of algebras - experimental
      static sum(B){
        var A = Element;
        // Get the multiplication tabe and basis.
        var T1 = A.describe().mulTable, T2 = B.describe().mulTable;
        var B1 = A.describe().basis, B2 = B.describe().basis;
        // Get the maximum index of T1, minimum of T2 and rename T2 if needed.
        var max_T1 = B1.filter(x=>x.match(/e/)).map(x=>x.match(/\d/g)).flat().map(x=>x|0).sort((a,b)=>b-a)[0];
        var max_T2 = B2.filter(x=>x.match(/e/)).map(x=>x.match(/\d/g)).flat().map(x=>x|0).sort((a,b)=>b-a)[0];
        var min_T2 = B2.filter(x=>x.match(/e/)).map(x=>x.match(/\d/g)).flat().map(x=>x|0).sort((a,b)=>a-b)[0];
        // remapping ..
        T2 = T2.map(x=>x.map(y=>y.match(/e/)?y.replace(/(\d)/g,(x)=>(x|0)+max_T1):y.replace("1","e"+(1+max_T2+max_T1))));
        B2 = B2.map((y,i)=>i==0?y.replace("1","e"+(1+max_T2+max_T1)):y.replace(/(\d)/g,(x)=>(x|0)+max_T1));
        // Build the new basis and multable..
        var basis = [...B1,...B2];
        var Cayley = T1.map((x,i)=>[...x,...T2[0].map(x=>"0")]).concat(T2.map((x,i)=>[...T1[0].map(x=>"0"),...x]));
        // Build the new algebra.
        var grades = [...B1.map(x=>x=="1"?0:x.length-1),...B2.map((x,i)=>i?x.length-1:0)];
        var a = Algebra({basis,Cayley,grades,tot:Math.log2(B1.length)+Math.log2(B2.length)});
        // And patch up ..
        a.Scalar = function(x) {
          var res = new a();
          for (var i=0; i<res.length; i++) res[i] = basis[i] == Cayley[i][i] ? x:0;
          return res;
        };
        return a;
      }  
      
    // The graphing function supports several modes. It can render 1D functions and 2D functions on canvas, and PGA2D, PGA3D and CGA2D functions using SVG.
    // It handles animation and interactivity.
    //   graph(function(x))     => function of 1 parameter will be called with that parameter from -1 to 1 and graphed on a canvas. Returned values should also be in the [-1 1] range
    //   graph(function(x,y))   => functions of 2 parameters will be called from -1 to 1 on both arguments. Returned values can be 0-1 for greyscale or an array of three RGB values.
    //   graph(array)           => array of algebraic elements (points, lines, circles, segments, texts, colors, ..) is graphed.
    //   graph(function=>array) => same as above, for animation scenario's this function is called each frame.
    // An optional second parameter is an options object { width, height, animate, camera, scale, grid, canvas } 
      static graph(f,options) { 
      // Store the original input
        if (!f) return; var origf=f; 
      // generate default options.  
        options=options||{}; options.scale=options.scale||1; options.camera=options.camera||(tot<4?Element.Scalar(1):new Element([0.7071067690849304, 0, 0, 0, 0, 0, 0, 0, 0, 0.7071067690849304, 0, 0, 0, 0, 0, 0])); 
        var ww=options.width, hh=options.height, cvs=options.canvas, tpcam=new Element([0,0,0,0,0,0,0,0,0,0,0,-5,0,0,1,0]),tpy=this.Coeff(4,1),tp=new Element(), 
      // project 3D to 2D. This allows to render 3D and 2D PGA with the same code.    
        project=(o)=>{ if (!o) return o; while (o.call) o=o(); return (tot==4 && (o.length==16))?(tpcam).Vee(options.camera.Mul(o).Mul(options.camera.Conjugate)).Wedge(tpy):(o.length==2**tot)?Element.sw(options.camera,o):o;};
      // gl escape.
        if (options.gl) return Element.graphGL(f,options); if (options.up) return Element.graphGL2(f,options);
      // if we get an array or function without parameters, we render c2d or p2d SVG points/lines/circles/etc
        if (!(f instanceof Function) || f.length===0) { 
        // Our current cursor, color, animation state and 2D mapping.
          var lx,ly,lr,color,res,anim=false,to2d=(tot==3)?[0,1,2,3,4,5,6,7]:[0,7,9,10,13,12,14,15];
        // Make sure we have an array of elements. (if its an object, convert to array with elements and names.)   
          if (f instanceof Function) f=f(); if (!(f instanceof Array)) f=[].concat.apply([],Object.keys(f).map((k)=>typeof f[k]=='number'?[f[k]]:[f[k],k])); 
        // The build function generates the actual SVG. It will be called everytime the user interacts or the anim flag is set.  
          function build(f,or) {
          // Make sure we have an aray. 
            if (or && f && f instanceof Function) f=f(); 
          // Reset position and color for cursor.  
            lx=-2;ly=-1.85;lr=0;color='#444'; 
          // Create the svg element. (master template string till end of function)  
            var svg=new DOMParser().parseFromString(`<SVG onmousedown="if(evt.target==this)this.sel=undefined" viewBox="-2 -${2*(hh/ww||1)} 4 ${4*(hh/ww||1)}" style="width:${ww||512}px; height:${hh||512}px; background-color:#eee; -webkit-user-select:none; -moz-user-select:none; -ms-user-select:none; user-select:none">
            // Add a grid (option)
            ${options.grid?[...Array(21)].map((x,xi)=>`<line x1="-10" y1="${((xi-10)/2-(tot<4?2*options.camera.e02:0))*options.scale}" x2="10" y2="${((xi-10)/2-(tot<4?2*options.camera.e02:0))*options.scale}" stroke-width="0.005" stroke="#CCC"/><line y1="-10" x1="${((xi-10)/2-(tot<4?2*options.camera.e01:0))*options.scale}" y2="10" x2="${((xi-10)/2-(tot<4?2*options.camera.e01:0))*options.scale}"  stroke-width="0.005" stroke="#CCC"/>`):''}
            // Handle conformal 2D elements. 
            ${options.conformal?f.map&&f.map((o,oidx)=>{ 
            // Optional animation handling.
              if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; }
            // Resolve expressions passed in.  
              while (o.call) o=o();
            // Arrays are rendered as segments or polygons. (2 or more elements)  
              if (o instanceof Array)  { lx=ly=lr=0; o=o.map(o=>{ while(o.call)o=o(); return o; }); o.forEach((o)=>{lx+=o.e1;ly+=-o.e2;});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>(o.e1+','+(-o.e2)+' '))}"/>`:`<LINE style="pointer-events:none" x1=${o[0].e1} y1=${-o[0].e2} x2=${o[1].e1} y2=${-o[1].e2} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}"/>`; }
            // Strings are rendered at the current cursor position.  
              if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${ly}" font-family="Verdana" font-size="${options.fontSize*0.1||0.1}" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${lr},${lx},${ly})">&nbsp;${o}&nbsp;</text>`; ly+=0.14; return res2; }
            // Numbers change the current color.  
              if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; }            // All other elements are rendered ..  
              var b1=o.Grade(1).VLength>0.001,b2=o.Grade(2).VLength>0.001,b3=o.Grade(3).VLength>0.001; 
            // Points  
              if (b1 && !b2 && !b3) { lx=o.e1; ly=-o.e2; lr=0; return res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`; }
              else if (!b1 && !b2 && b3) { var isLine=Element.Coeff(4,1,3,-1).LDot(o).Length==0; 
              // Lines.
                if (isLine) { var loc=((Element.Coeff(4,-.5).Add(Element.Coeff(3,-.5))).LDot(o)).Div(o), att=(Element.Coeff(4,1,3,-1)).LDot(o); lx=-loc.e1; ly=loc.e2; lr=Math.atan2(att[8],att[7])/Math.PI*180; return `<LINE style="pointer-events:none" x1=${lx-10} y1=${ly} x2=${lx+10} y2=${ly} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}" transform="rotate(${lr},${lx},${ly})"/>`;}              // Circles.  
                var loc=o.Div((Element.Coeff(4,1,3,-1)).LDot(o)); lx=-loc.e1; ly=loc.e2; var r=-o.Mul(o.Conjugate).s/(Element.Pow((Element.Coeff(4,1,3,-1)).LDot(o),2).s); r=r**0.5; return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${r}" stroke-width="${options.lineWidth*0.005||0.005}" fill="none" stroke="${color||'green'}"/>`;   
              } else if (!b1 && b2 &&!b3) { 
              // Point Pairs.
                lr=0; var ei=Element.Coeff(4,1,3,-1),eo=Element.Coeff(4,.5,3,.5), nix=o.Wedge(ei), sqr=o.LDot(o).s/nix.LDot(nix).s, r=Math.sqrt(Math.abs(sqr)), attitude=((ei.Wedge(eo)).LDot(nix)).Normalized.Mul(Element.Scalar(r)), pos=o.Div(nix); pos=pos.Div( pos.LDot(Element.Sub(ei))); 
                lx=pos.e1; ly=-pos.e2; if (sqr<0) return `<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" stroke-width="0.005" fill="none" stroke="${color||'green'}"/>`;
                lx=pos.e1+attitude.e1; ly=-pos.e2-attitude.e2; var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`;
                lx=pos.e1-attitude.e1; ly=-pos.e2+attitude.e2; return res2+`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`;
              }
            // Handle projective 2D and 3D elements.  
            }):f.map&&f.map((o,oidx)=>{  if((o==Element.graph && or!==false)||(oidx==0&&options.animate&&or!==false)) { anim=true; requestAnimationFrame(()=>{var r=build(origf,(!res)||(document.body.contains(res))).innerHTML; if (res) res.innerHTML=r; }); if (!options.animate) return; } while (o instanceof Function) o=o(); o=(o instanceof Array)?o.map(project):project(o); if (o===undefined) return; 
            // line segments and polygons
              if (o instanceof Array && o.length)  { lx=ly=lr=0; o.forEach((o)=>{while (o.call) o=o(); lx+=options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[drm[2]]/o[drm[1]];ly+=options.scale*o[drm[3]]/o[drm[1]];});lx/=o.length;ly/=o.length; return o.length>2?`<POLYGON STYLE="pointer-events:none; fill:${color};opacity:0.7" points="${o.map(o=>((drm[1]==6||drm[1]==14)?-1:1)*options.scale*o[drm[2]]/o[drm[1]]+','+options.scale*o[drm[3]]/o[drm[1]]+' ')}"/>`:`<LINE style="pointer-events:none" x1=${options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[0][drm[2]]/o[0][drm[1]]} y1=${options.scale*o[0][drm[3]]/o[0][drm[1]]} x2=${options.scale*((drm[1]==6||drm[1]==14)?-1:1)*o[1][drm[2]]/o[1][drm[1]]} y2=${options.scale*o[1][drm[3]]/o[1][drm[1]]} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}"/>`; }
            // svg
              if (typeof o =='string' && o[0]=='<') { return o; }  
            // Labels  
              if (typeof o =='string') { var res2=(o[0]=='_')?'':`<text x="${lx}" y="${ly}" font-family="Verdana" font-size="${options.fontSize*0.1||0.1}" style="pointer-events:none" fill="${color||'#333'}" transform="rotate(${lr},0,0)">&nbsp;${o}&nbsp;</text>`; ly+=0.14; return res2; }
            // Colors  
              if (typeof o =='number') { color='#'+(o+(1<<25)).toString(16).slice(-6); return ''; }            // Points  
              if (o[to2d[6]]**2        >0.0001) { lx=options.scale*o[drm[2]]/o[drm[1]]; if (drm[1]==6||drm[1]==14) lx*=-1; ly=options.scale*o[drm[3]]/o[drm[1]]; lr=0;  var res2=`<CIRCLE onmousedown="this.parentElement.sel=${oidx}" cx="${lx}" cy="${ly}" r="${options.pointRadius*0.03||0.03}" fill="${color||'green'}"/>`; ly-=0.05; lx-=0.1; return res2; }
            // Lines  
              if (o[to2d[2]]**2+o[to2d[3]]**2>0.0001) { var l=Math.sqrt(o[to2d[2]]**2+o[to2d[3]]**2); o[to2d[2]]/=l; o[to2d[3]]/=l; o[to2d[1]]/=l; lx=0.5; ly=options.scale*((drm[1]==6)?-1:-1)*o[to2d[1]]; lr=-Math.atan2(o[to2d[2]],o[to2d[3]])/Math.PI*180; var res2=`<LINE style="pointer-events:none" x1=-10 y1=${ly} x2=10 y2=${ly} stroke-width="${options.lineWidth*0.005||0.005}" stroke="${color||'#888'}" transform="rotate(${lr},0,0)"/>`; ly-=0.05; return res2; }
            // Vectors   
              if (o[to2d[4]]**2+o[to2d[5]]**2>0.0001) { lr=0; ly+=0.05; lx+=0.1; var res2=`<LINE style="pointer-events:none" x1=${lx} y1=${ly} x2=${lx-o.e02} y2=${ly+o.e01} stroke-width="0.005" stroke="${color||'#888'}"/>`; ly=ly+o.e01/4*3-0.05; lx=lx-o.e02/4*3; return res2; }
            }).join()}`,'text/html').body; 
          // return the inside of the created svg element.  
            return svg.removeChild(svg.firstChild); 
          }        // Create the initial svg and install the mousehandlers.  
          res=build(f); res.value=f; res.options=options;
          res.onmousemove=(e)=>{ if (res.sel===undefined || !e.buttons) return;var resx=res.getBoundingClientRect().width,resy=res.getBoundingClientRect().height,x=((e.clientX-res.getBoundingClientRect().left)/(resx/4||128)-2)*(resx>resy?resx/resy:1),y=((e.clientY-res.getBoundingClientRect().top)/(resy/4||128)-2)*(resy>resx?resy/resx:1);x/=options.scale;y/=options.scale; if (options.conformal) {f[res.sel][1]=x; f[res.sel][2]=-y; var l=x*x+y*y; f[res.sel][3]=0.5-l*0.5; f[res.sel][4]=0.5+l*0.5; } else {f[res.sel][drm[2]]=((drm[1]==6)?-x:x)-((tot<4)?2*options.camera.e01:0); f[res.sel][drm[3]]=y+((tot<4)?2*options.camera.e02:0); f[res.sel][drm[1]]=1;} if (!anim) res.innerHTML=build(f).innerHTML; res.dispatchEvent(new CustomEvent('input')); }; 
          return res;
        }  
      // 1d and 2d functions are rendered on a canvas.   
        cvs=cvs||document.createElement('canvas'); if(ww)cvs.width=ww; if(hh)cvs.height=hh; var w=cvs.width,h=cvs.height,context=cvs.getContext('2d'), data=context.getImageData(0,0,w,h);
      // two parameter functions .. evaluate for both and set resulting color.  
        if (f.length==2) for (var px=0; px<w; px++) for (var py=0; py<h; py++) { var res=f(px/w*2-1, py/h*2-1); res=res.buffer?[].slice.call(res):res.slice?res:[res,res,res]; data.data.set(res.map(x=>x*255).concat([255]),py*w*4+px*4); }
      // one parameter function.. go over x range, use result as y.   
        else if (f.length==1) for (var px=0; px<w; px++) { var res=f(px/w*2-1); res=Math.round((res/2+0.5)*h); if (res > 0 && res < h-1) data.data.set([0,0,0,255],res*w*4+px*4); }
        return context.putImageData(data,0,0),cvs;       
      }
      
    // webGL2 Graphing function. (for OPNS/IPNS implicit 2D and 1D surfaces in 3D space).
      static graphGL2(f,options) {
      // Create canvas, get webGL2 context.
        var canvas=document.createElement('canvas'); canvas.style.width=options.width||''; canvas.style.height=options.height||''; canvas.style.backgroundColor='#EEE';
        if (options.width && options.width.match && options.width.match(/px/i)) canvas.width = parseFloat(options.width); if (options.height && options.height.match && options.height.match(/px/i)) canvas.height = parseFloat(options.height);
        var gl=canvas.getContext('webgl2',{alpha:options.alpha||false,preserveDrawingBuffer:true,antialias:true,powerPreference:'high-performance'});
        var gl2=!!gl; if (!gl) gl=canvas.getContext('webgl',{alpha:options.alpha||false,preserveDrawingBuffer:true,antialias:true,powerPreference:'high-performance'});
        gl.clearColor(240/255,240/255,240/255,1.0); gl.enable(gl.DEPTH_TEST); if (!gl2) { gl.getExtension("EXT_frag_depth"); gl.va = gl.getExtension('OES_vertex_array_object'); }
        else gl.va = { createVertexArrayOES : gl.createVertexArray.bind(gl), bindVertexArrayOES : gl.bindVertexArray.bind(gl), deleteVertexArrayOES : gl.deleteVertexArray.bind(gl)  };
      // Compile vertex and fragment shader, return program.
        var compile=(vs,fs)=>{
          var s=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((t,i)=>{
            var r=gl.createShader(t); gl.shaderSource(r,[vs,fs][i]); gl.compileShader(r);
            return gl.getShaderParameter(r, gl.COMPILE_STATUS)&&r||console.error(gl.getShaderInfoLog(r));
          });
          var p = gl.createProgram(); gl.attachShader(p, s[0]); gl.attachShader(p, s[1]); gl.linkProgram(p);
          gl.getProgramParameter(p, gl.LINK_STATUS)||console.error(gl.getProgramInfoLog(p));
          return p;
        };
      // Create vertex array and buffers, upload vertices and optionally texture coordinates.
        var createVA=function(vtx) {
          var r = gl.va.createVertexArrayOES(); gl.va.bindVertexArrayOES(r);
          var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b);
          gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
          gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
          return {r,b}
        },
      // Destroy Vertex array and delete buffers.
        destroyVA=function(va) {
          if (va.b) gl.deleteBuffer(va.b); if (va.r) gl.va.deleteVertexArrayOES(va.r);
        };
      // Drawing function  
        var M=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,5,1];
        var draw=function(p, tp, vtx, color, color2, ratio, texc, va, b,color3,r,g){
            gl.useProgram(p); gl.uniformMatrix4fv(gl.getUniformLocation(p, "mv"),false,M);
            gl.uniformMatrix4fv(gl.getUniformLocation(p, "p"),false, [5,0,0,0,0,5*(ratio||1),0,0,0,0,1,2,0,0,-1,0]);
            gl.uniform3fv(gl.getUniformLocation(p, "color"),new Float32Array(color));
            gl.uniform3fv(gl.getUniformLocation(p, "color2"),new Float32Array(color2));
            if (color3) gl.uniform3fv(gl.getUniformLocation(p, "color3"),new Float32Array(color3));
            if (b) gl.uniform1fv(gl.getUniformLocation(p, "b"),(new Float32Array(counts[g])).map((x,i)=>b[g][i]||0));
            if (texc) gl.uniform1i(gl.getUniformLocation(p, "texc"),0);
            if (r) gl.uniform1f(gl.getUniformLocation(p,"ratio"),r);
            var v; if (!va) v = createVA(vtx); else gl.va.bindVertexArrayOESOES(va.r);
            gl.drawArrays(tp, 0, (va&&va.tcount)||vtx.length/3);
            if (v) destroyVA(v);
        };
      // Compile the OPNS renderer. (sphere tracing)
        var programs = [], genprog = grade=>compile(`${gl2?"#version 300 es":""}
             ${gl2?"in":"attribute"} vec4 position; ${gl2?"out":"varying"} vec4 Pos; uniform mat4 mv; uniform mat4 p;
             void main() { Pos=mv*position; gl_Position = p*Pos; }`,
            `${!gl2?"#extension GL_EXT_frag_depth : enable":"#version 300 es"}
             precision highp float;  
             uniform vec3 color; uniform vec3 color2; 
             uniform vec3 color3; uniform float b[${counts[grade]}];
             uniform float ratio; ${gl2?"out vec4 col;":""}
             ${gl2?"in":"varying"} vec4 Pos; 
             float dist (in float z, in float y, in float x, in float[${counts[grade]}] b) {
                ${this.nVector(1,[]).OPNS_GLSL(this.nVector(grade,[]), options.up)}
                return ${grade!=tot-1?"sign(sum)*sqrt(abs(sum))":"res"};
             }
             vec3 trace_depth (in vec3 start, vec3 dir, in float thresh) {
                vec3 orig=start; float lastd = 1000.0; const int count=${(options.maxSteps||64)};
                float s =  sign(dist(start[0],start[1],start[2],b));
                for (int i=0; i<count; i++) {
                  float d = s*dist(start[0],start[1],start[2],b);
                  if (d < thresh) return start - lastd*${(options.stepSize||0.25)}*dir*(thresh-d)/(lastd-d);
                  lastd = d; start += dir*${(options.stepSize||0.25)}*d;
                }
                return orig;
             }
             void main() { 
               vec3 p = -5.0*normalize(color2); 
               vec3 dir = normalize((-Pos[0]/5.0)*color + color2 + vec3(0.0,Pos[1]/5.0*ratio,0.0));  p += 1.0*dir;
               vec3 L = 5.0*normalize( -0.5*color + 0.85*color2 + vec3(0.0,-0.5,0.0) );
               vec3 d2 = trace_depth( p , dir, ${grade!=tot-1?(options.thresh||0.2):"0.0075"} );
               float dl2 = dot(d2-p,d2-p); const float h=0.1; 
               if (dl2>0.0) {
                 vec3 n = normalize(vec3(
                        dist(d2[0]+h,d2[1],d2[2],b)-dist(d2[0]-h,d2[1],d2[2],b),
                        dist(d2[0],d2[1]+h,d2[2],b)-dist(d2[0],d2[1]-h,d2[2],b),
                        dist(d2[0],d2[1],d2[2]+h,b)-dist(d2[0],d2[1],d2[2]-h,b)
                      ));
                 ${gl2?"gl_FragDepth":"gl_FragDepthEXT"} = dl2/50.0;
                 ${gl2?"col":"gl_FragColor"} = vec4(max(0.2,abs(dot(n,normalize(L-d2))))*color3 + pow(abs(dot(n,normalize(normalize(L-d2)+dir))),100.0),1.0);
               } else discard; 
             }`),genprog2D = grade=>compile(`${gl2?"#version 300 es":""}
             ${gl2?"in":"attribute"} vec4 position; ${gl2?"out":"varying"} vec4 Pos; uniform mat4 mv; uniform mat4 p;
             void main() { Pos=mv*position; gl_Position = p*Pos; }`,
            `${!gl2?"#extension GL_EXT_frag_depth : enable":"#version 300 es"}
             precision highp float;  
             uniform vec3 color; uniform vec3 color2; 
             uniform vec3 color3; uniform float b[${counts[grade]}];
             uniform float ratio; ${gl2?"out vec4 col;":""}
             ${gl2?"in":"varying"} vec4 Pos; 
             float dist (in float z, in float y, in float x, in float[${counts[grade]}] b) {
                ${this.nVector(1,[]).OPNS_GLSL(this.nVector(grade,[]), options.up)}
                return ${grade!=tot-1?"sqrt(abs(sum))":"res"};
             }
             float trace_depth (in vec3 start, vec3 dir, in float thresh) {
                vec3 orig=start; float lastd = 1000.0; const int count=${(options.maxSteps||64)};
                float s = dist(start[0]*5.0,start[1]*5.0,start[2]*5.0,b);
                s=s*s;
                return 1.0-s*150.0;
             }
             void main() { 
               vec3 p = -5.0*normalize(color2); 
               vec3 dir = normalize((-Pos[0]/5.0)*color + color2 + vec3(0.0,Pos[1]/5.0*ratio,0.0));  p += 1.0*dir;
               vec3 L = 5.0*normalize( -0.5*color + 0.85*color2 + vec3(0.0,-0.5,0.0) );
               float d2 = trace_depth( p , dir, ${grade!=tot-1?(options.thresh||0.2):"0.0075"} );
               if (d2>0.0) {
                 ${gl2?"gl_FragDepth":"gl_FragDepthEXT"} = d2/50.0;
                 ${gl2?"col":"gl_FragColor"} = vec4(d2*color3,d2);
               } else discard;  
             }`);
      // canvas update will (re)render the content.            
        var armed=0;
        canvas.update = (x)=>{
        // Start by updating canvas size if needed and viewport.
          var s = getComputedStyle(canvas); if (s.width) { canvas.width = parseFloat(s.width); canvas.height = parseFloat(s.height); }
          gl.viewport(0,0, canvas.width|0,canvas.height|0); var r=canvas.width/canvas.height;
        // Defaults, resolve function input  
          var c=[.5,.5,.5]; gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT); while (x.call) x=x();
        // Loop over all items to render.  
          for (var i=0,ll=x.length;i<ll;i++) { 
            var e=x[i]; while (e&&e.call) e=e(); if (e==undefined) continue;
            if (typeof e == "number") { c[0]=((e>>>16)&0xff)/255; c[1]=((e>>>8)&0xff)/255; c[2]=(e&0xff)/255; }
            if (e instanceof Element){
              var tt = options.spin?-performance.now()*options.spin/1000:-options.h||0; tt+=Math.PI/2; var r = canvas.height/canvas.width;
              var g=tot-1; while(!e[g]&&g>1) g--;
              if (!programs[tot-1-g]) programs[tot-1-g] = (options.up.find(x=>x.match&&x.match("z")))?genprog(g):genprog2D(g);
              gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
              draw(programs[tot-1-g],gl.TRIANGLES,[-2,-2,0,-2,2,0,2,-2,0,-2,2,0,2,-2,0,2,2,0],[Math.cos(tt),0,-Math.sin(tt)],[Math.sin(tt),0,Math.cos(tt)],undefined,undefined,undefined,e,c,r,g);
              gl.disable(gl.BLEND);
            }
          }
          // if we're no longer in the page .. stop doing the work.
          armed++; if (document.body.contains(canvas)) armed=0; if (armed==2) return;
          canvas.value=x; if (options&&!options.animate) canvas.dispatchEvent(new CustomEvent('input'));
          if (options&&options.animate) { requestAnimationFrame(canvas.update.bind(canvas,f,options)); }
          if (options&&options.still) { canvas.value=x; canvas.dispatchEvent(new CustomEvent('input')); canvas.im.width=canvas.width; canvas.im.height=canvas.height; canvas.im.src = canvas.toDataURL(); }
        };
        // Basic mouse interactivity. needs more love.
        var sel=-1; canvas.oncontextmenu = canvas.onmousedown = (e)=>{ e.preventDefault(); e.stopPropagation(); sel=-2;
          var rc = canvas.getBoundingClientRect(), mx=(e.x-rc.left)/(rc.right-rc.left)*2-1, my=((e.y-rc.top)/(rc.bottom-rc.top)*-4+2)*canvas.height/canvas.width;
          canvas.onwheel=e=>{e.preventDefault(); e.stopPropagation(); options.z = (options.z||5)+e.deltaY/100; if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));};
          canvas.onmouseup=e=>sel=-1; canvas.onmouseleave=e=>sel=-1;
          canvas.onmousemove=(e)=>{ 
            var rc = canvas.getBoundingClientRect(); 
            var mx =(e.movementX)/(rc.right-rc.left)*2, my=((e.movementY)/(rc.bottom-rc.top)*-2)*canvas.height/canvas.width;
            if (sel==-2) { options.h =  (options.h||0)+mx; if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options)); return; } if (sel < 0) return;
          };
        };
        canvas.value = f.call?f():f; canvas.options = options;
        if (options&&options.still) {
          var i=new Image(); canvas.im = i; return requestAnimationFrame(canvas.update.bind(canvas,f,options)),i;
        } else return requestAnimationFrame(canvas.update.bind(canvas,f,options)),canvas;
        
      }
    
      
    // webGL Graphing function. (for parametric defined objects)
      static graphGL(f,options) {
      // Create a canvas, webgl2 context and set some default GL options.
        var canvas=document.createElement('canvas'); canvas.style.width=options.width||''; canvas.style.height=options.height||''; canvas.style.backgroundColor='#EEE';
        if (options.width && options.width.match && options.width.match(/px/i)) canvas.width = parseFloat(options.width); if (options.height && options.height.match && options.height.match(/px/i)) canvas.height = parseFloat(options.height);
        var gl=canvas.getContext('webgl',{alpha:options.alpha||false,antialias:true,preserveDrawingBuffer:options.still||true,powerPreference:'high-performance'}); 
        gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); if (!options.alpha) gl.clearColor(240/255,240/255,240/255,1.0); gl.getExtension("OES_standard_derivatives"); gl.va=gl.getExtension("OES_vertex_array_object");
      // Compile vertex and fragment shader, return program.  
        var compile=(vs,fs)=>{ 
          var s=[gl.VERTEX_SHADER,gl.FRAGMENT_SHADER].map((t,i)=>{
            var r=gl.createShader(t); gl.shaderSource(r,[vs,fs][i]); gl.compileShader(r);
            return gl.getShaderParameter(r, gl.COMPILE_STATUS)&&r||console.error(gl.getShaderInfoLog(r));
          });
          var p = gl.createProgram(); gl.attachShader(p, s[0]); gl.attachShader(p, s[1]); gl.linkProgram(p);
          gl.getProgramParameter(p, gl.LINK_STATUS)||console.error(gl.getProgramInfoLog(p));
          return p;
        };
      // Create vertex array and buffers, upload vertices and optionally texture coordinates.  
        var createVA=function(vtx, texc, idx, clr) {
              var r = gl.va.createVertexArrayOES(); gl.va.bindVertexArrayOES(r);
              var b = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b); 
              gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vtx), gl.STATIC_DRAW);
              gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(0);
              if (texc){
                var b2=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b2);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texc), gl.STATIC_DRAW);
                gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(1);
              }
              if (clr){
                var b3=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, b3);
                gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(clr), gl.STATIC_DRAW);
                gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 0, 0); gl.enableVertexAttribArray(1);
              }
              if (idx) {
                var b4=gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, b4);
                gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
              }
              return {r,b,b2,b4,b3}
            },
      // Destroy Vertex array and delete buffers.
            destroyVA=function(va) {
              [va.b,va.b2,va.b4,va.b3].forEach(x=>{if(x) gl.deleteBuffer(x);}); if (va.r) gl.va.deleteVertexArrayOES(va.r);
            };
      // Default modelview matrix, convert camera to matrix (biquaternion->matrix)      
        var M=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,5,1], mtx = x=>{ var t=options.animate?performance.now()/1000:options.h||0, t2=options.p||0;
          var ct = Math.cos(t), st= Math.sin(t), ct2 = Math.cos(t2), st2 = Math.sin(t2), xx=options.posx||0, y=options.posy||0, z=options.posz||0, zoom=options.z||5;
          if (tot==5) return [ct,st*-st2,st*ct2,0,0,ct2,st2,0,-st,ct*-st2,ct*ct2,0,xx*ct+z*-st,y*ct2+(xx*st+z*ct)*-st2,y*st2+xx*st+z*ct*ct2+zoom,1];
          x=x.Normalized; var y=x.Mul(x.Dual),X=-x.e23,Y=-x.e13,Z=x.e12,W=x.s;
          var xx = X*X, xy = X*Y, xz = X*Z, xw = X*W, yy = Y*Y, yz = Y*Z, yw = Y*W, zz = Z*Z, zw = Z*W;
          return [ 1-2*(yy+zz), 2*(xy+zw), 2*(xz-yw), 0, 2*(xy-zw), 1-2*(xx+zz), 2*(yz+xw), 0, 2*(xz+yw), 2*(yz-xw), 1-2*(xx+yy), 0, -2*y.e23, -2*y.e13, 2*y.e12+5, 1];
        };
      // Render the given vertices. (autocreates/destroys vertex array if not supplied).  
        var draw=function(p, tp, vtx, color, color2, ratio, texc, va){
          gl.useProgram(p); gl.uniformMatrix4fv(gl.getUniformLocation(p, "mv"),false,M); 
          gl.uniformMatrix4fv(gl.getUniformLocation(p, "p"),false, [5,0,0,0,0,5*(ratio||2),0,0,0,0,1,2,0,0,-1,0]);
          gl.uniform3fv(gl.getUniformLocation(p, "color"),new Float32Array(color));
          gl.uniform3fv(gl.getUniformLocation(p, "color2"),new Float32Array(color2));
          if (texc) gl.uniform1i(gl.getUniformLocation(p, "texc"),0);
          var v; if (!va) v = createVA(vtx, texc); else gl.va.bindVertexArrayOES(va.r);
          if (va && va.b4) {
            gl.drawElements(tp, va.tcount, gl.UNSIGNED_SHORT, 0);
          } else {
            gl.drawArrays(tp, 0, (va&&va.tcount)||vtx.length/3);
          }  
          if (v) destroyVA(v);
        };
      // Program for the geometry. Derivative based normals. Basic lambert shading.    
        var program = compile(`attribute vec4 position; varying vec4 Pos; uniform mat4 mv; uniform mat4 p; 
                 void main() { gl_PointSize=6.0; Pos=mv*position; gl_Position = p*Pos; }`,
                `#extension GL_OES_standard_derivatives : enable
                 precision highp float; uniform vec3 color; uniform vec3 color2; varying vec4 Pos; 
                 void main() { vec3 ldir = normalize(Pos.xyz - vec3(1.0,1.0,2.0));
                 vec3 normal = normalize(cross(dFdx(Pos.xyz), dFdy(Pos.xyz))); float l=dot(normal,ldir);
                 vec3 E = normalize(-Pos.xyz); vec3 R = normalize(reflect(ldir,normal));  
                 gl_FragColor = vec4(max(0.0,l)*color+vec3(0.5*pow(max(dot(R,E),0.0),20.0))+color2, 1.0);  }`);
        var programcol = compile(`attribute vec4 position; attribute vec3 col; varying vec3 Col; varying vec4 Pos; uniform mat4 mv; uniform mat4 p; 
                 void main() { gl_PointSize=6.0; Pos=mv*position; gl_Position = p*Pos; Col=col; }`,
                `#extension GL_OES_standard_derivatives : enable
                 precision highp float; uniform vec3 color; uniform vec3 color2; varying vec4 Pos; varying vec3 Col; 
                 void main() { vec3 ldir = normalize(Pos.xyz - vec3(1.0,1.0,2.0));
                 vec3 normal = normalize(cross(dFdx(Pos.xyz), dFdy(Pos.xyz))); float l=dot(normal,ldir);
                 vec3 E = normalize(-Pos.xyz); vec3 R = normalize(reflect(ldir,normal));  
                 gl_FragColor = vec4(max(0.3,l)*Col+vec3(0.5*pow(max(dot(R,E),0.0),20.0))+color2, 1.0);  }`);
      // Create a font texture, lucida console or otherwise monospaced.
        var fw=22, font = Object.assign(document.createElement('canvas'),{width:94*fw,height:32}), 
            ctx = Object.assign(font.getContext('2d'),{font:'bold 32px lucida console, monospace'}),
            ftx = gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, ftx);
            for (var i=33; i<127; i++) ctx.fillText(String.fromCharCode(i),(i-33)*fw,26);
            // 2.0 gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,94*fw,32,0,gl.RGBA,gl.UNSIGNED_BYTE,font);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, font);

            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);  
      // Font rendering program. Renders billboarded fonts, transforms offset passed as color2.
        var program2 = compile(`attribute vec4 position; attribute vec2 texc; varying vec2 tex; varying vec4 Pos; uniform mat4 mv; uniform mat4 p; uniform vec3 color2; 
                 void main() { tex=texc; gl_PointSize=6.0; vec4 o=mv*vec4(color2,0.0); Pos=(-1.0/(o.z-mv[3][2]))*position+vec4(mv[3][0],mv[3][1],mv[3][2],0.0)+o; gl_Position = p*Pos; }`,
                `precision highp float; uniform vec3 color; varying vec4 Pos; varying vec2 tex; 
                 uniform sampler2D texm; void main() { vec4 c = texture2D(texm,tex); if (c.a<0.01) discard; gl_FragColor = vec4(color,c.a);}`);
      // Conformal space needs a bit extra magic to extract euclidean parametric representations.
        if (tot==5 && options.conformal) var ninf = Element.Coeff(4,1).Add(Element.Coeff(5,1)), no = Element.Coeff(4,0.5).Sub(Element.Coeff(5,0.5));
        var interprete = (x)=>{
          if (!(x instanceof Element)) return { tp:0 };
          // tp = { 0:unknown 1:point 2:line, 3:plane, 4:circle, 5:sphere
          var X2 = (x.Mul(x)).s, tp=0, weight2, opnix = ninf.Wedge(x), ipnix = ninf.LDot(x), 
              attitude, pos, normal, tg,btg,epsilon = 0.001/(options.scale||1), I3=Element.Coeff(16,-1);
          var x2zero = Math.abs(X2) < epsilon, ipnixzero = ipnix.VLength < epsilon, opnixzero = opnix.VLength < epsilon;
          if (opnixzero && ipnixzero) ; else if (opnixzero && !ipnixzero) {         // bound flat (lines)
            attitude = no.Wedge(ninf).LDot(x); 
            weight2 = Math.abs(attitude.LDot(attitude).s)**.5;
            pos = attitude.LDot(x.Reverse); //Inverse);
            pos = [-pos.e15/pos.e45,-pos.e25/pos.e45,-pos.e34/pos.e45];
            if (x.Grade(3).VLength) {
              normal = [attitude.e1/weight2,attitude.e2/weight2,attitude.e3/weight2]; tp=2; 
            } else {
              normal = Element.LDot(Element.Mul(attitude,1/weight2),I3).Normalized;
              var r=normal.Mul(Element.Coeff(3,1)); if (r[0]==-1) r[0]=1; else {r[0]+=1; r=r.Normalized;}
              tg = [...r.Mul(Element.Coeff(1,1)).Mul(r.Conjugate)].slice(1,4);
              btg = [...r.Mul(Element.Coeff(2,1)).Mul(r.Conjugate)].slice(1,4);
              normal = [...normal.slice(1,4)]; tp=3;
            }
          } else if (!opnixzero && ipnixzero) ; else if (x2zero) {                          // bound vec,biv,tri (points)
            attitude = ninf.Wedge(no).LDot(ninf.Wedge(x)); 
            pos = [...(Element.LDot(1/(ninf.LDot(x)).s,x)).slice(1,4)].map(x=>-x);
            tp=1; 
          } else if (!x2zero) {                          // round (point pair,circle,sphere)
            tp = x.Grade(3).VLength?4:x.Grade(2).VLength?6:5; 
            var nix  = ninf.Wedge(x), nix2 = (nix.Mul(nix)).s;
            attitude = ninf.Wedge(no).LDot(nix);
            pos = [...(x.Mul(ninf).Mul(x)).slice(1,4)].map(x=>-x/(2.0*nix2));
            weight2 = Math.abs((x.LDot(x)).s / nix2)**.5;
            if (tp==4) {
              if (x.LDot(x).s < 0) { weight2 = -weight2; }
              normal = Element.LDot(Element.Mul(attitude,1/weight2),I3).Normalized;
              var r=normal.Mul(Element.Coeff(3,1)); if (r[0]==-1) r[0]=1; else {r[0]+=1; r=r.Normalized;}
              tg = [...r.Mul(Element.Coeff(1,1)).Mul(r.Conjugate)].slice(1,4);
              btg = [...r.Mul(Element.Coeff(2,1)).Mul(r.Conjugate)].slice(1,4);
              normal = [...normal.slice(1,4)]; 
            } else if (tp==6) {
              weight2 = (x.LDot(x).s < 0)?-(weight2):weight2;
              normal = Element.Mul(attitude.Normalized,weight2).slice(1,4);
            } else {
              normal = [...((Element.LDot(Element.Mul(attitude,1/weight2),I3)).Normalized).slice(1,4)];
            }
          }
          return {tp,pos:pos?pos.map(x=>x*(options.scale||1)):[0,0,0],normal,tg,btg,weight2:weight2*(options.scale||1)}
        };                 
      // canvas update will (re)render the content.            
        var armed=0,sphere,e14 = Element.Coeff(14,1);
        canvas.update = (x)=>{
        // restore from still..
          if (options && !options.still && canvas.im && canvas.im.parentElement) { canvas.im.parentElement.insertBefore(canvas,canvas.im); canvas.im.parentElement.removeChild(canvas.im); }
        // Start by updating canvas size if needed and viewport.
          var s = getComputedStyle(canvas); if (s.width) { canvas.width = parseFloat(s.width); canvas.height = parseFloat(s.height); }
          gl.viewport(0,0, canvas.width|0,canvas.height|0); var r=canvas.width/canvas.height;
        // Defaults, resolve function input  
          var a,p=[],l=[],t=[],c=[.5,.5,.5],alpha=0,lastpos=[-2,2,0.2]; gl.clear(gl.COLOR_BUFFER_BIT+gl.DEPTH_BUFFER_BIT); while (x.call) x=x();
        // Create default camera matrix and initial lastposition (contra-compensated for camera)  
          M = mtx(options.camera); lastpos = options.camera.Normalized.Conjugate.Mul(((a=new this()).set(lastpos,11),a)).Mul(options.camera.Normalized).slice(11,14);
        // Grid.
          if (options.grid) {
            if (!options.gridLines) { options.gridLines=[[],[],[]]; for (var i=-5; i<=5; i++) {
                options.gridLines[0].push(i,0,5, i,0,-5, 5,0,i, -5,0,i); options.gridLines[1].push(i,5,0, i,-5,0, 5,i,0, -5,i,0); options.gridLines[2].push(0,i,5, 0,i,-5, 0,5,i, 0,-5,i);
            }}
            gl.depthMask(false);
              draw(program,gl.LINES,options.gridLines[0],[0,0,0],[.6,1,.6],r); draw(program,gl.LINES,options.gridLines[1],[0,0,0],[1,.8,.8],r); draw(program,gl.LINES,options.gridLines[2],[0,0,0],[.8,.8,1],r);
            gl.depthMask(true);
          }
        // Loop over all items to render.  
          for (var i=0,ll=x.length;i<ll;i++) { 
            var e=x[i]; while (e&&e.call&&e.length==0) e=e(); if (e==undefined) continue;
          // CGA
            if (tot==5 && options.conformal) {
              if (e instanceof Array && e.length==2) { e.forEach(x=>{ while (x.call) x=x.call(); x=interprete(x);l.push.apply(l,x.pos); });  var d = {tp:-1}; }
              else if (e instanceof Array && e.length==3) { e.forEach(x=>{ while (x.call) x=x.call(); x=interprete(x);t.push.apply(t,x.pos); });  var d = {tp:-1}; }
              else var d = interprete(e);
              if (d.tp) lastpos=d.pos;
              if (d.tp==1) p.push.apply(p,d.pos);
              if (d.tp==2) { l.push.apply(l,d.pos.map((x,i)=>x-d.normal[i]*10)); l.push.apply(l,d.pos.map((x,i)=>x+d.normal[i]*10)); }
              if (d.tp==3) { t.push.apply(t,d.pos.map((x,i)=>x+d.tg[i]+d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x-d.tg[i]+d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x+d.tg[i]-d.btg[i])); 
                             t.push.apply(t,d.pos.map((x,i)=>x-d.tg[i]+d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x+d.tg[i]-d.btg[i])); t.push.apply(t,d.pos.map((x,i)=>x-d.tg[i]-d.btg[i])); }
              if (d.tp==4) {
                var ne=0,la=0;
                if (d.weight2<0) { c[0]=1;c[1]=0;c[2]=0; }
                for (var j=0; j<65; j++) {
                  ne = d.pos.map((x,i)=>x+Math.cos(j/32*Math.PI)*d.weight2*d.tg[i]+Math.sin(j/32*Math.PI)*d.weight2*d.btg[i]); if (ne&&la&&(d.weight2>0||j%2==0)) { l.push.apply(l,la); l.push.apply(l,ne); } la=ne;
                }
              }               
              if (d.tp==6) {
                if (d.weight2<0) { c[0]=1;c[1]=0;c[2]=0; }
                if (options.useUnnaturalLineDisplayForPointPairs) {
                  l.push.apply(l,d.pos.map((x,i)=>x-d.normal[i]*(options.scale||1)));
                  l.push.apply(l,d.pos.map((x,i)=>x+d.normal[i]*(options.scale||1)));
                } 
                p.push.apply(p,d.pos.map((x,i)=>x-d.normal[i]*(options.scale||1)));
                p.push.apply(p,d.pos.map((x,i)=>x+d.normal[i]*(options.scale||1)));
              }
              if (d.tp==5) {
                if (!sphere) {
                  var pnts = [], tris=[], S=Math.sin, C=Math.cos, pi=Math.PI, W=96, H=48;
                  for (var j=0; j<W+1; j++) for (var k=0; k<H; k++) {
                    pnts.push( [S(2*pi*j/W)*S(pi*k/(H-1)), C(2*pi*j/W)*S(pi*k/(H-1)), C(pi*k/(H-1))]);
                    if (j && k) {
                      tris.push.apply(tris, pnts[(j-1)*H+k-1]);tris.push.apply(tris, pnts[(j-1)*H+k]);tris.push.apply(tris, pnts[j*H+k-1]);
                      tris.push.apply(tris, pnts[j*H+k-1]); tris.push.apply(tris, pnts[(j-1)*H+k]); tris.push.apply(tris, pnts[j*H+k]);
                  }}
                  sphere = { va : createVA(tris,undefined) }; sphere.va.tcount = tris.length/3;
                }
                var oldM = M;
                M=[].concat.apply([],Element.Mul([[d.weight2,0,0,0],[0,d.weight2,0,0],[0,0,d.weight2,0],[d.pos[0],d.pos[1],d.pos[2],1]],[[M[0],M[1],M[2],M[3]],[M[4],M[5],M[6],M[7]],[M[8],M[9],M[10],M[11]],[M[12],M[13],M[14],M[15]]])).map(x=>x.s);
                gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,0.5); gl.enable(gl.CULL_FACE);
                draw(program,gl.TRIANGLES,undefined,c,[0,0,0],r,undefined,sphere.va);
                gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE);
                M = oldM;
              }
              if (i==ll-1 || d.tp==0) {
              // render triangles, lines, points.
                if (alpha) { gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,1-alpha); }
                if (t.length) { draw(program,gl.TRIANGLES,t,c,[0,0,0],r); t.forEach((x,i)=>{ if (i%9==0) lastpos=[0,0,0]; lastpos[i%3]+=x/3; }); t=[];  }
                if (l.length) { draw(program,gl.LINES,l,[0,0,0],c,r); var l2=l.length-1; lastpos=[(l[l2-2]+l[l2-5])/2,(l[l2-1]+l[l2-4])/2+0.1,(l[l2]+l[l2-3])/2]; l=[]; }
                if (p.length) { draw(program,gl.POINTS,p,[0,0,0],c,r); lastpos = p.slice(-3); lastpos[0]-=0.075; lastpos[1]+=0.075; p=[]; }
                if (alpha) gl.disable(gl.BLEND);
                // we could also be an object with cached vertex array of triangles ..   
                  if (e instanceof Object && e.data) {
                    // Create the vertex array and store it for re-use.
                    if (!e.va) {
                      var et=[],et2=[],et3=[],lc=0,pc=0,tc=0; e.data.forEach(e=>{ 
                        if (e instanceof Array && e.length==3) { tc++; e.forEach(x=>{ while (x.call) x=x.call(); x=interprete(x);et3.push.apply(et3,x.pos); });  var d = {tp:-1}; }
                        else {
                          var d = interprete(e); 
                          if (d.tp==1) { pc++; et.push(...d.pos);  }
                          if (d.tp==2) { lc++; et2.push(...d.pos.map((x,i)=>x-d.normal[i]*10),...d.pos.map((x,i)=>x+d.normal[i]*10)); }
                        }
                      });
                      e.va = createVA(et,undefined); e.va.tcount = pc;
                      e.va2 = createVA(et2,undefined); e.va2.tcount = lc*2;
                      e.va3 = createVA(et3,undefined); e.va3.tcount = tc*3;
                    }
                    // render the vertex array.
                    if (e.va.tcount) draw(program,gl.POINTS,undefined,[0,0,0],c,r,undefined,e.va);
                    if (e.va2.tcount) draw(program,gl.LINES,undefined,[0,0,0],c,r,undefined,e.va2);
                    if (e.va3.tcount) draw(program,gl.TRIANGLES,undefined,[0,0,0],c,r,undefined,e.va3);
                  }
              // setup a new color  
                if (typeof e == "number") { alpha=((e>>>24)&0xff)/255; c[0]=((e>>>16)&0xff)/255; c[1]=((e>>>8)&0xff)/255; c[2]=(e&0xff)/255; }
                if (typeof(e)=='string') {
                  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA); 
                  draw(program2,gl.TRIANGLES, 
                       [...Array(e.length*6*3)].map((x,i)=>{ var x=0,z=-0.2, o=x+(i/18|0)*1.1; return (0.05*(options.z||5))*[o,-1,z,o+1.2,-1,z,o,1,z,o+1.2,-1,z,o+1.2,1,z,o,1,z][i%18]}),c,lastpos,r,
                       [...Array(e.length*6*2)].map((x,i)=>{ var o=(e.charCodeAt(i/12|0)-33)/94; return [o,1,o+1/94,1,o,0,o+1/94,1,o+1/94,0,o,0][i%12]})); gl.disable(gl.BLEND); lastpos[1]-=0.18;
                }
              }
              continue;
            }
          // PGA   
          // Convert planes to polygons.
            if (e instanceof Element && e.Grade(1).Length) {
              var m = Element.Add(1, Element.Mul(e.Normalized, Element.Coeff(3,1))).Normalized, e0 = 0;
              e=Element.sw(m,[[-1,-1],[-1,1],[1,1],[-1,-1],[1,1],[1,-1]].map(([x,z])=>Element.Trivector(x,e0,z,1)));
            }
          // Convert lines to line segments.  
            if (e instanceof Element && e.Grade(2).Length) 
               e=[e.LDot(e14).Wedge(e).Add(e.Wedge(Element.Coeff(1,1)).Mul(Element.Coeff(0,-500))),e.LDot(e14).Wedge(e).Add(e.Wedge(Element.Coeff(1,1)).Mul(Element.Coeff(0,500)))];
          // If euclidean point, store as point, store line segments and triangles.
            if (e.e123) p.push.apply(p,e.slice(11,14).map((y,i)=>(i==0?1:-1)*y/e[14]).reverse());
            if (e instanceof Array && e.length==2) l=l.concat.apply(l,e.map(x=>[...x.slice(11,14).map((y,i)=>(i==0?1:-1)*y/x[14]).reverse()])); 
            if (e instanceof Array && e.length%3==0) t=t.concat.apply(t,e.map(x=>[...x.slice(11,14).map((y,i)=>(i==0?1:-1)*y/x[14]).reverse()]));
          // Render orbits of parametrised motors
            if ( e.call && e.length==1) { var count=64;
              for (var xx,o=Element.Coeff(14,1),ii=0; ii<count; ii++) {
                if (ii>1) l.push(-xx[13]/xx[14],-xx[12]/xx[14],xx[11]/xx[14]); 
                xx = Element.sw(e(ii/(count-1)),o);
                l.push(-xx[13]/xx[14],-xx[12]/xx[14],xx[11]/xx[14]); 
              }
            }  
            if ( e.call && e.length==2 && !e.va) { var countx=e.dx||64,county=e.dy||32; 
              var temp=[],o=Element.Coeff(14,1),norm=o.Add(Element.Coeff(13,-1)),et=[];
              for (ii=0; ii<countx; ii++) for (var jj=0; jj<county; jj++) temp.push.apply(temp,Element.sw(e(ii/(countx-1),jj/(county-1)),o).slice(11,14).map((x,i,a)=>i?-x:x).reverse());
              for (ii=0; ii<countx-1; ii++) for (var jj=0; jj<county; jj++) et.push((ii+0)*county+(jj+0),(ii+0)*county+(jj+1),(ii+1)*county+(jj+1),(ii+0)*county+(jj+0),(ii+1)*county+(jj+1),(ii+1)*county+(jj+0));
              e.va = createVA(temp,undefined,et.map(x=>x%(countx*county))); e.va.tcount = (countx-1)*county*2*3;
            }  
          // we could also be an object with cached vertex array of triangles ..   
            if (e.va || (e instanceof Object && e.data)) {
              // Create the vertex array and store it for re-use.
              if (!e.va) {
                if (e.idx) {
                  var et = e.data.map(x=>[...x.slice(11,14).map((y,i)=>(i==0?1:-1)*y/x[14]).reverse()]).flat();
                } else {
                  var et=[]; e.data.forEach(e=>{if (e instanceof Array && e.length==3) et=et.concat.apply(et,e.map(x=>[...x.slice(11,14).map((y,i)=>(i==0?1:-1)*y/x[14]).reverse()]));});
                }
                e.va = createVA(et,undefined,e.idx,e.color?new Float32Array(e.color):undefined); e.va.tcount = (e.idx && e.idx.length)?e.idx.length:e.data.length*3;
              }
              // render the vertex array.
              if (e.transform) { M=mtx(options.camera.Mul(e.transform)); }
              if (alpha) { gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,1-alpha); }
              draw(e.color?programcol:program,gl.TRIANGLES,t,c,[0,0,0],r,undefined,e.va);
              if (alpha) gl.disable(gl.BLEND);
              if (e.transform) { M=mtx(options.camera); }
            }
          // if we're a number (color), label or the last item, we output the collected items.  
            else if (!isNaN(e) || i==ll-1 || typeof e == 'string') {
            // render triangles, lines, points.
              if (alpha) { gl.enable(gl.BLEND); gl.blendFunc(gl.CONSTANT_ALPHA, gl.ONE_MINUS_CONSTANT_ALPHA); gl.blendColor(1,1,1,1-alpha); }
              if (t.length) { draw(program,gl.TRIANGLES,t,c,[0,0,0],r); t.forEach((x,i)=>{ if (i%9==0) lastpos=[0,0,0]; lastpos[i%3]+=x/3; }); t=[];  }
              if (l.length) { draw(program,gl.LINES,l,[0,0,0],c,r); var l2=l.length-1; lastpos=[(l[l2-2]+l[l2-5])/2,(l[l2-1]+l[l2-4])/2+0.1,(l[l2]+l[l2-3])/2]; l=[]; }
              if (p.length) { draw(program,gl.POINTS,p,[0,0,0],c,r); lastpos = p.slice(-3); lastpos[0]-=0.075; lastpos[1]+=0.075; p=[]; }
              if (alpha) gl.disable(gl.BLEND);
            // setup a new color  
              if (typeof e == "number") { alpha=((e>>>24)&0xff)/255; c[0]=((e>>>16)&0xff)/255; c[1]=((e>>>8)&0xff)/255; c[2]=(e&0xff)/255; }
            // render a label  
              if (typeof(e)=='string') {
                gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA); 
                draw(program2,gl.TRIANGLES, 
                     [...Array(e.length*6*3)].map((x,i)=>{ var x=0,z=-0.2, o=x+(i/18|0)*1.1; return 0.25*[o,-1,z,o+1.2,-1,z,o,1,z,o+1.2,-1,z,o+1.2,1,z,o,1,z][i%18]}),c,lastpos,r,
                     [...Array(e.length*6*2)].map((x,i)=>{ var o=(e.charCodeAt(i/12|0)-33)/94; return [o,1,o+1/94,1,o,0,o+1/94,1,o+1/94,0,o,0][i%12]})); gl.disable(gl.BLEND); lastpos[1]-=0.18;
              }
            }  
          }          // if we're no longer in the page .. stop doing the work.
          armed++; if (document.body.contains(canvas)) armed=0; if (armed==2) return;
          canvas.value=x; if (options&&!options.animate) canvas.dispatchEvent(new CustomEvent('input')); canvas.options=options;
          if (options&&options.animate) { requestAnimationFrame(canvas.update.bind(canvas,f,options)); }
          if (options&&options.still) { canvas.value=x; canvas.dispatchEvent(new CustomEvent('input')); canvas.im.style.width=canvas.style.width; canvas.im.style.height=canvas.style.height; canvas.im.src = canvas.toDataURL(); 
            var p=canvas.parentElement;  if (p) { p.insertBefore(canvas.im,canvas); p.removeChild(canvas); }
          }
        };
        // Basic mouse interactivity. needs more love.
        var sel=-1; canvas.oncontextmenu = canvas.onmousedown = (e)=>{e.preventDefault(); e.stopPropagation();  if (e.detail===0) return; 
          var rc = canvas.getBoundingClientRect(), mx=(e.x-rc.left)/(rc.right-rc.left)*2-1, my=((e.y-rc.top)/(rc.bottom-rc.top)*-4+2)*canvas.height/canvas.width;
          sel = (e.button==2)?-3:-2; canvas.value.forEach((x,i)=>{
            x = interprete(x); if (x.tp==1) {
              var pos2 = Element.Mul( [[M[0],M[4],M[8],M[12]],[M[1],M[5],M[9],M[13]],[M[2],M[6],M[10],M[14]],[M[3],M[7],M[11],M[15]]], [...x.pos,1]).map(x=>x.s);
              pos2 = Element.Mul( [[5,0,0,0],[0,5*(r||2),0,0],[0,0,1,-1],[0,0,2,0]], pos2).map(x=>x.s).map((x,i,a)=>x/a[3]);
              if ((mx-pos2[0])**2 + (my-pos2[1])**2 < 0.01) sel=i;
            }
          });
          canvas.onwheel=e=>{e.preventDefault(); e.stopPropagation(); options.z = (options.z||5)+e.deltaY/100; if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));};
          canvas.onmouseup=e=>sel=-1; canvas.onmouseleave=e=>sel=-1;
          var tx,ty; canvas.ontouchstart = (e)=>{e.preventDefault();  canvas.focus(); var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY; tx=x; ty=y; };
          canvas.ontouchmove = function (e) { e.preventDefault();
             var x = e.changedTouches[0].pageX, y = e.changedTouches[0].pageY, mx = (x-(tx||x))/1000, my = -(y-(ty||y))/1000; tx=x; ty=y; 
             options.h = (options.h||0)+mx; options.p = Math.max(-Math.PI/2,Math.min(Math.PI/2, (options.p||0)+my)); if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options)); return;  
          };
          canvas.onmousemove=(e)=>{ 
            var rc = canvas.getBoundingClientRect(), x=interprete(canvas.value[sel]);
            var mx =(e.movementX)/(rc.right-rc.left)*2, my=((e.movementY)/(rc.bottom-rc.top)*-2)*canvas.height/canvas.width;
            if (sel==-2) { options.h =  (options.h||0)+mx; options.p = Math.max(-Math.PI/2,Math.min(Math.PI/2, (options.p||0)+my)); if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options)); return; }            if (sel==-3) { var ct = Math.cos(options.h||0), st= Math.sin(options.h||0), ct2 = Math.cos(options.p||0), st2 = Math.sin(options.p||0);
              if (e.shiftKey) { options.posy = (options.posy||0)+my; } else { options.posx = (options.posx||0)+mx*ct+my*st; options.posz = (options.posz||0)+mx*-st+my*ct*ct2; } if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));return; } if (sel < 0) return;
            x.pos[0] += (e.buttons!=2)?Math.cos(-(options.h||0))*mx:Math.sin((options.h||0))*my; x.pos[1]+=(e.buttons!=2)?my:0; x.pos[2]+=(e.buttons!=2)?Math.sin(-(options.h||0))*mx:Math.cos((options.h||0))*my;
            canvas.value[sel].set(Element.Mul(ninf,(x.pos[0]**2+x.pos[1]**2+x.pos[2]**2)*0.5).Sub(no)); canvas.value[sel].set(x.pos,1);
            if (!options.animate) requestAnimationFrame(canvas.update.bind(canvas,f,options));
          };
        };
        canvas.value = f.call?f():f; canvas.options=options;
        if (options&&options.still) {
          var i=new Image(); canvas.im = i; return requestAnimationFrame(canvas.update.bind(canvas,f,options)),canvas;
        } else return requestAnimationFrame(canvas.update.bind(canvas,f,options)),canvas;
      }  
    
    // The inline function is a js to js translator that adds operator overloading and algebraic literals.
    // It can be called with a function, a string, or used as a template function.  
      static inline(intxt) {
      // If we are called as a template function. 
        if (arguments.length>1 || intxt instanceof Array) {
          var args=[].slice.call(arguments,1);
          return res.inline(new Function(args.map((x,i)=>'_template_'+i).join(),'return ('+intxt.map((x,i)=>(x||'')+(args[i]&&('_template_'+i)||'')).join('')+')')).apply(res,args);
        }
      // Get the source input text.    
        var txt = (intxt instanceof Function)?intxt.toString():`function(){return (${intxt})}`;
      // Our tokenizer reads the text token by token and stores it in the tok array (as type/token tuples).   
        var tok = [], resi=[], t, tokens = [/^[\s\uFFFF]|^[\u000A\u000D\u2028\u2029]|^\/\/[^\n]*\n|^\/\*[\s\S]*?\*\//g,                 // 0: whitespace/comments
          /^\"\"|^\'\'|^\".*?[^\\]\"|^\'.*?[^\\]\'|^\`[\s\S]*?[^\\]\`/g,                                                                // 1: literal strings
          /^\d+[.]{0,1}\d*[ei][\+\-_]{0,1}\d*|^\.\d+[ei][\+\-_]{0,1}\d*|^e_\d*/g,                                                       // 2: literal numbers in scientific notation (with small hack for i and e_ asciimath)
          /^\d+[.]{0,1}\d*[E][+-]{0,1}\d*|^\.\d+[E][+-]{0,1}\d*|^0x\d+|^\d+[.]{0,1}\d*|^\.\d+|^\(\/.*[^\\]\/\)/g,                       // 3: literal hex, nonsci numbers and regex (surround regex with extra brackets!)
          /^(\.Normalized|\.Length|\.\.\.|>>>=|===|!==|>>>|<<=|>>=|=>|\|\||[<>\+\-\*%&|^\/!\=]=|\*\*|\+\+|\-\-|<<|>>|\&\&|\^\^|^[{}()\[\];.,<>\+\-\*%|&^!~?:=\/]{1})/g,   // 4: punctuator
          /^[A-Za-z0-9_]*/g];                                                                                                            // 5: identifier
        while (txt.length) for(t in tokens) if(resi=txt.match(tokens[t])){ tok.push([t|0,resi[0]]); txt=txt.slice(resi[0].length); break;} // tokenise 
      // Translate algebraic literals. (scientific e-notation to "this.Coeff"
        tok=tok.map(t=>(t[0]==2)?[2,'Element.Coeff('+basis.indexOf('e'+(t[1].split(/e_|e|i/)[1]||1))+','+parseFloat(t[1][0]=='e'?1:t[1].split(/e_|e|i/)[0])+')']:t);
      // We support two syntaxes, standard js or if you pass in a text, asciimath.       
        var syntax = (intxt instanceof Function)?[[['.Normalized','Normalize',2],['.Length','Length',2]],[['~','Conjugate',1],['!','Dual',1]],[['**','Pow',0,1]],[['^','Wedge'],['&','Vee'],['<<','LDot']],[['*','Mul'],['/','Div']],[['|','Dot']],[['>>>','sw',0,1]],[['-','Sub'],['+','Add']],[['==','eq'],['!=','neq'],['<','lt'],['>','gt'],['<=','lte'],['>=','gte']]]
                                                :[[['pi','Math.PI'],['sin','Math.sin']],[['ddot','this.Reverse'],['tilde','this.Involute'],['hat','this.Conjugate'],['bar','this.Dual']],[['^','Pow',0,1]],[['^^','Wedge'],['*','LDot']],[['**','Mul'],['/','Div']],[['-','Sub'],['+','Add']],[['<','lt'],['>','gt'],['<=','lte'],['>=','gte']]];
      // For asciimath, some fixed translations apply (like pi->Math.PI) etc ..                                          
        tok=tok.map(t=>(t[0]!=5)?t:[].concat.apply([],syntax).filter(x=>x[0]==t[1]).length?[5,[].concat.apply([],syntax).filter(x=>x[0]==t[1])[0][1]]:t); 
      // Now the token-stream is translated recursively.    
        function translate(tokens) {
           // helpers : first token to the left of x that is not of a type in the skip list.
           var left = (x=ti-1,skip=[0])=>{ while(x>=0&&~skip.indexOf(tokens[x][0])) x--; return x; },
           // first token to the right of x that is not of a type in the skip list.
               right= (x=ti+1,skip=[0])=>{ while(x<tokens.length&&~skip.indexOf(tokens[x][0])) x++; return x; },
           // glue from x to y as new type, optionally replace the substring with sub.    
               glue = (x,y,tp=5,sub)=>{tokens.splice(x,y-x+1,[tp,...(sub||tokens.slice(x,y+1))]);},
           // match O-C pairs. returns the 'matching bracket' position    
               match = (O="(",C=")")=>{var o=1,x=ti+1; while(o){if(tokens[x][1]==O)o++;if(tokens[x][1]==C)o--; x++;} return x-1;};
           // grouping (resolving brackets).    
           for (var ti=0,t,si;t=tokens[ti];ti++) if (t[1]=="(") glue(ti,si=match(),6,[[4,"("],...translate(tokens.slice(ti+1,si)),[4,")"]]); 
           // [] dot call and new
           for (var ti=0,t,si; t=tokens[ti];ti++) {
             if (t[1]=="[") { glue(ti,si=match("[","]"),6,[[4,"["],...translate(tokens.slice(ti+1,si)),[4,"]"]]); if (ti)ti--;}    // matching []
             else if (t[1]==".") { glue(left(),right()); ti--; }                                                                   // dot operator
             else if (t[0]==6 && ti && left()>=0 && tokens[left()][0]>=5 && tokens[left()][1]!="return") { glue(left(),ti--); }     // collate ( and [
             else if (t[1]=='new') { glue(ti,right()); }           }
           // ++ and --
           for (var ti=0,t; t=tokens[ti];ti++) if (t[1]=="++" || t[1]=="--") glue(left(),ti);  
           // unary - and + are handled seperately from syntax ..
           for (var ti=0,t,si; t=tokens[ti];ti++) 
             if (t[1]=="-" && (left()<0 || (tokens[left()]||[4])[0]==4)) glue(ti,right(),5,["Element.Sub(",tokens[right()],")"]);   // unary minus works on all types.
             else if (t[1]=="+" && (tokens[left()]||[0])[0]==4) glue(ti,ti+1);                                                      // unary plus is glued, only on scalars.
           // now process all operators in the syntax list .. 
           for (var si=0,s; s=syntax[si]; si++) for (var ti=s[0][3]?tokens.length-1:0,t; t=tokens[ti];s[0][3]?ti--:ti++) for (var opi=0,op; op=s[opi]; opi++) if (t[1]==op[0]) {
             // exception case .. ".Normalized" and ".Length" properties are re-routed (so they work on scalars etc ..)
                    if (op[2]==2) { var arg=tokens[left()]; glue(ti-1,ti,5,["Element."+op[1],"(",arg,")"]); }                                    
             // unary operators (all are to the left)      
               else if (op[2])    { var arg=tokens[right()]; glue(ti, right(), 5, ["Element."+op[1],"(",arg,")"]); }
             // binary operators  
                             else { var l=left(),r=right(),a1=tokens[l],a2=tokens[r]; glue(l,r,5,["Element."+op[1],"(",a1,",",a2,")"]); ti--; }
           }
           return tokens;
        }        
      // Glue all back together and return as bound function.  
        return eval( ('('+(function f(t){return t.map(t=>t instanceof Array?f(t):typeof t == "string"?t:"").join('');})(translate(tok))+')') );
      }
    };
    
    
  // Matrix-free inverses up to 5D. Should translate this to an inline call for readability.
  // http://repository.essex.ac.uk/17282/1/TechReport_CES-534.pdf  
    res.prototype.__defineGetter__('Inverse', function(){  
      return (tot==0)?new this.constructor.Scalar([1/this[0]]):
             (tot==1)?this.Involute.Mul(this.constructor.Scalar(1/this.Mul(this.Involute)[0])):
             (tot==2)?this.Conjugate.Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate)[0])):
             (tot==3)?this.Reverse.Mul(this.Involute).Mul(this.Conjugate).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse)[0])):
             (tot==4)?this.Conjugate.Mul(this.Mul(this.Conjugate).Map(3,4)).Mul( this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Mul(this.Conjugate).Map(3,4))[0])):
                      this.Conjugate.Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4)).Mul(this.constructor.Scalar(1/this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Mul(this.Mul(this.Conjugate).Mul(this.Involute).Mul(this.Reverse).Map(1,4))[0]));
    });
    
  // If a function was passed in, translate, call and return its result. Else just return the Algebra.  
    if (fu instanceof Function) return res.inline(fu)(); else return res;  
  }
}));
});

let Lines  = class Lines {

  static ga() {

  ganja_esm( 3, 0, 1, () => {

  // We work in dual space. Our 1-blade's are dual-vectors (aka functionals of the
  // form ax + by + cz + dw = 0).
  // The four basis functionals are thus (x=0, y=0, z=0, w=0). In three dimensions
  // these represent the yz, xz, xy and
  // ideal plane.

  // Specify a point directly (trivectors specified with overloaded e-notation.)
  let point = (x,y,z)=>1e123-x*1e012+y*1e013+z*1e023;

  // Lines can be defined using plucker coordinates
  // let line = (px,py,pz,dx,dy,dz)=>px*1e01+py&1e02+pz*1e03+dx*1e12+dy*1e13+dz*1e23;

  // Planes can be defined directly using e0,e1,e2,e3
  // let plane = (a,b,c,d)=>d*1e0+a*1e1+b*1e2+c*1e3;

  // Useful joins
     let line_from_points  = (P1,P2)=>P1.Normalized&P2.Normalized;
  // let plane_from_points = (P1,P2,P3)=>P1&P2&P3;
  // let plane_from_point_and_line = (P,L)=>P&L;

  // Usefull meets
     let line_from_planes  = (p1,p2)=>p1^p2;
  // let point_from_planes = (p1,p2,p3)=>p1^p2^p3;
     let point_from_line_and_plane = (L,P)=>L^P;

   // Create 5 points and some joining lines.
      let A=point(0,-1,0  );
      let B=point(1,1,-1  );
      let C=point(-1,1,-1 );
      let D=point(1,1, 1  );
      let E=point(-1,1, 1 );
      let centroid=A+B+C+D+E;
      let camera=1e0;

  // Graph the 3D items
  let graph = Element.graph( ()=> {
    let time=performance.now()/12000;
    camera['set'](Math.cos(time)+Math.sin(time)*1e13);                      // rotate around Y
    return [
      0xddaaff,[A,B,C],                                            // graph on face
      0xAA88FF,[A,B],[A,C],[A,D],[B,C],[B,D],[C,E],[A,E],[E,D],    // graph all edges
      0x444444,A,"A",B,"B",C,"C",D,"D",E,"E",                      // graph all vertices
      0xFF8888,C+E,centroid,"sum of points",
      0x8888FF,line_from_points(centroid,C+E),"line from points ..",
      0x44AA44,line_from_planes(A&B&C,B&C&D),"line from planes ..",
      0x4488FF,point_from_line_and_plane(line_from_points(centroid,C+E),A&D&B),
        "point from line and plane ..",
      0xFFAA66,(B&D)+(C&E),"sum of lines"]; }, { animate:true, camera } );

    window['Geom']['Lines'].process( 'Lines', graph );

  } ); } };

let Grids  = class Grids {

  static ga() {

  ganja_esm( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space. (dual)

  let items = [];
  let origin=1e123, EX=1e012, EY=1e013, EZ=1e023;
  
  let widthf  = 5.0;
  let heightf = 5.0;
  let widthb  = 3.0;
  let heightb = 3.0;
  let widtho  = 4.0;
  let heighto = 4.0;
  let depth   = 2.0;
  let scale   = 0.35;
  
  let point  = (x,y,z)=> origin + x*scale*EX - y*scale*EY + z*scale*EZ;
  let linePP = (p1,p2)=> p1.Normalized & p2.Normalized;
  let lineX  = (x,sw,nw,se,ne) => [sw*(1-x)+se*x, nw*(1-x)+ne*x]; // x scales from [0,1]
  let lineY  = (y,sw,se,nw,ne) => [sw*(1-y)+nw*y, se*(1-y)+ne*y]; // y scales from [0,1]

  // Rotations can be specified through exponentiation (angle around line).
  // let rotor = (line,angle)=>Math.cos(angle/2) + Math.sin(angle/2)*line.Normalized;
    
  let ooo = point(   0, 0,  0   );
  let pxa = point( widtho, 0,  0   );
  let pya = point( 0, heighto, 0   );
  let pza = point( 0, 0,     depth );

  let xaxis = linePP( ooo, pxa );
  let yaxis = linePP( ooo, pya );
  let zaxis = linePP( ooo, pza );

  items.push( 0x00FF00, xaxis, yaxis, zaxis );
  
  let fsw = point( -widthf, -heightf, -depth );
  let fse = point(  widthf, -heightf, -depth );
  let fnw = point( -widthf,  heightf, -depth );
  let fne = point(  widthf,  heightf, -depth );
  let bsw = point( -widthb, -heightb,  depth );
  let bse = point(  widthb, -heightb,  depth );
  let bnw = point( -widthb,  heightb,  depth );
  let bne = point(  widthb,  heightb,  depth );
  
  items.push( 0xFFFFFF,
    ooo, 'OOO', pxa, 'PXA', pya, 'PYA', pza, 'PZA',
    fsw, 'FSW', fse, 'FSE', fnw, 'FNW', fne, 'FNE',
    bsw, 'BSW', bse, 'BSE', bnw, 'BNW', bne, 'BNE'  );

  let stroke = ( i, n2 ) => {
    return i % n2 === 0 ? 0xFFFFFF : 0x666666; };

  let grid = ( n1, n2, sw, se, nw, ne, array ) => {
    let d1 = 1.0 / n1;
    for( let x=0, i=0; i<=n1; i++, x=i*d1 ) { array.push( stroke(i,n2), lineX(x,sw,nw,se,ne) ); }
    for( let y=0, i=0; i<=n1; i++, y=i*d1 ) { array.push( stroke(i,n2), lineY(y,sw,se,nw,ne) ); } };

    grid( 100, 10, fsw, fse, bsw, bse, items );  // South Grid
    grid( 100, 10, fsw, bsw, fnw, bnw, items );  // West  Grid
    grid( 100, 10, bsw, bse, bnw, bne, items );  // Back  Grid
    grid( 100, 10, fse, bse, fne, bne, items );  // East  Grid

    let camera = 1e0;

    let svg = Element.graph( () => {
      let time = performance.now()/12000;
      camera['set']( Math.cos(time) + Math.sin(time)*1e13 ); // rotate around Y
      return items; }, { animate:true, camera } );

    window['Geom']['Grids'].process( 'Grids', svg );

  } ); } };

let Isomet  = class Isomet {

  static ga() {

  ganja_esm( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space. (dual)

  let items = [];
  let origin=1e123, EX=-1e012, EY=1e013, EZ=1e012;
  let point  = (x,y,z)=>origin+x*EX-y*EY+z*EZ;

  let s =  0.20;    // xyz Scale
  let t = 10.00*s; // Total lengths
  let c =  8.66*s; // Cos(30)
  let h =  5.00*s; // Sin(30) or Half
  let i =  0.50*s; // 10% increment

  let ooo = point(0,0 ,0 );
  let xoo = point(c,-h, 0 );
  let oyo = point(0,t, 0 );
  let ooz = point(0,-h, c );
  let xyo = point(c,h, 0 );
  let oyz = point(0,h, c );
  let xoz = point(c,-t, c );

  items.push( 0xFFFFFF, ooo, 'ooo', xoo, 'xoo', oyo, 'oyo', ooz, 'ooz',
                        xyo, 'xyo', oyz, 'oyz', xoz, 'xoz' );

  let xy = [ooo,xoo,xyo,oyo];
  let yz = [ooo,ooz,oyz,oyo];
  let zx = [ooo,ooz,xoz,xoo];

  items.push( 0x888888, xy, 0x666666, yz, 0x444444, zx );

  let xyX = (x) => [ooo*(1-x)+xoo*x, oyo*(1-x)+xyo*x]; // x scales from [0,1]
  let xyY = (y) => [ooo*(1-y)+oyo*y, xoo*(1-y)+xyo*y]; // y scales from [0,1]
  let yzY = (y) => [ooo*(1-y)+oyo*y, ooz*(1-y)+oyz*y]; // y scales from [0,1]
  let yzZ = (z) => [ooo*(1-z)+ooz*z, oyo*(1-z)+oyz*z]; // z scales from [0,1]
  let zxX = (x) => [ooo*(1-x)+xoo*x, ooz*(1-x)+xoz*x]; // x scales from [0,1]
  let zxZ = (z) => [ooo*(1-z)+ooz*z, xoo*(1-z)+xoz*z]; // z scales from [0,1]

  let gxy = (t,i, xf, yf, items ) => {
    items.push(0xFFFFFF);
    for( let x=0; x < t; x+=i ) { items.push(xf(x)); }
    for( let y=0; y < t; y+=i ) { items.push(yf(y)); } };

  gxy( h, i, xyX, xyY, items ); // Not sure why h
  gxy( h, i, yzY, yzZ, items );
  gxy( h, i, zxX, zxZ, items );

  let svg = Element.graph( () => { return items; }, {} );

  window['Geom']['Isomet'].process( 'Isomet', svg );

  } ); } };

let Play  = class Play {

  static ga() {

  ganja_esm(3,0,1,()=> {

    // console.log( 'PGA3D', this.describe() );

    let graph = Element.graph([1e123,1e23,1e13,1e12],{camera:1+.5e01-.5e02}); // and in 3D PGA

    window['Geom']['Play'].process( 'Play', graph );

  } ); } };

let Isohed  = class Isohed {

  static ga() {

ganja_esm(3,0,1,()=>{  // Create a Clifford Algebra with 3,0,1 metric. 

  // Specify a point directly (trivectors specified with overloaded e-notation.)
  let point = (x,y,z)=>1e123-x*1e012+y*1e013+z*1e023;
  let rotor = (P,a)=>Math.cos(a/2)+Math.sin(a/2)*P;

  // Our camera position and orientation
  let  camera=1e0;

  // We construct faces, edges and vertices of an icosahedron.
  let r = rotor(1e13,Math.PI/2.5);
  let A = point(0,1,0);
  let B = point((1-Math.atan(0.5)**2)**0.5,Math.atan(0.5),0);
  let C = rotor(1e13,Math.PI/5)>>>(1e2>>>B);
  let items=[A,"A",B,"B",C,"C"];

  // vertices
  items.push(0x4444FF);
  for (let i=0;i<5;i++) items.push(A,B=r>>>B,C=r>>>C,1e2>>>A);

  // edges
  items.push(0x444444);
  for (let i=0;i<5;i++) items.push([A,B],[B,C],[B,B=r>>>B],[B,C],[C,C=r>>>C],[1e2>>>A,C]);

  // faces
  items.push(0xFFCCCC);
  for (let i=0;i<5;i++) items.push([A,B,r>>>B],[B,B=r>>>B,C],[C,B,r>>>C],[C,1e2>>>A,C=r>>>C]);

  // Graph the 3D items
  let graph = Element.graph( () => {
    let time=performance.now()/4000;
    camera['set'](rotor(1e13,time)*rotor(1e12,time*1.23131));                // animate camera
    return items.slice(0,1+((Math.floor(time*50))%(items.length+20))); },   // show more and more elements
  { gl:true, animate:true, camera } );


  window['Geom']['Isohed'].process( 'Isohed', graph );

  } ); } };

let Objects  = class Objects {

  static ga() {

    ganja_esm( 3, 0, 1, () => {

    // rotation helper and Lathe function.
    let rot = (a,P)=>Math.cos(a)+Math.sin(a)*P.Normalized,
      lathe=(X,n,P,m)=>[...Array(n+1)].map((x,i)=>rot(i/n*Math.PI*(m||1),P)>>>X),

    // wrap takes X, a double array of points, and generates triangles.
    wrap=(X)=>{
      let u=X.length-1,v=X[0].length-1; X=[].concat.apply([],X);
      let P=[],vp=v+1; for(let i=0;i<u*vp;i+=vp)for(let j=0;j<v;j++)P.push([i+j,i+j+1,vp+i+j],[i+j+1,vp+i+j,vp+i+j+1]);
      return P.map(x=>x.map(x=>X[x]));
    },

    // Basic primitives constructed by Lathing points, line segments, etc.
    cylinder = (r=1,h=1,x=32)=>wrap(lathe([!1e0,!(1e0+r*1e3),!(1e0+r*1e3+h*1e1),!(1e0+h*1e1)],x,1e23)),
    torus    = (r=.3,r2=.25,x=32,y=16)=>wrap(lathe((1+r*.5e03)>>>lathe(!(1e0+r2*(1e1+1e3)/2**.5),y,1e13),x,1e23)),
    sphere   = (r=1,x=32,y=16)=>wrap(lathe(lathe(!(1e0+r*1e1),y,1e13,.5),x,1e23)),
    cone     = (r=1,h=1,x=64)=>wrap(lathe([!1e0,!(1e0+r*1e3),!(1e0+h*1e1)],x,1e23)),
    arrow    = ()=>[...cone(.15,.3),...cone(.15,0),...cylinder(.05,-2)],

    // A selection of these objects.
    objs=[ arrow(),         torus(0.8,.3),       sphere(.8),        sphere(.8,3,2),
           cone(1,2**.5,3), cone(1,2**.5,4),     cone(1,2**.5),     torus(.8,.2,5,32),
           cylinder(),      cylinder(1,2**.5,4), torus(.8,.3,4,4),
           torus(.8,.3,64,4)].map(x=>( {data:x} ) );

  let canvas = Element.graph( () => {
    let time = performance.now()/1000;
    objs.forEach((obj,i) => obj.transform =
      (1+1e0-3e01-((i%3)-1)*1.5e03-((i/3|0)-1.5)*1.5e02)*rot(time,1e12)*rot(time*0.331,1e13));
    return [0xFF0088,...objs]; }, { gl:true, animate:false } );

/* let svg = Element.graph( () => {
    objs.forEach((obj,i) => obj.transform =
      (1+1e0-3e01-((i%3)-1)*1.5e03-((i/3|0)-1.5)*1.5e02)); // *rot(time,1e12)*rot(time*0.331,1e13));
      (1+1e0-3e01-((i%3)-1)*1.5e03-((i/3|0)-1.5)*1.5e02)*rot(time,1e12)*rot(time*0.331,1e13));
    return [0xFF8888,...objs]; }, { } ); */

    window['Geom']['Objects'].process( 'Objects', canvas );

} ); } };

let Torus  = class Torus {

  static ga() {

    ganja_esm( 3, 0, 1, () => {  // PGA3D Projective Euclidean 3D space.

  // Ganja.js can graph the orbits of parametrised motor variables :
  // these are functions that take one parameter 0<x<1 and return a motor.
  // For a function of 1 parameter, the orbit is rendered as a curve.

  let circle  = (BV,r)=>x=>Math.E**(Math.PI*x*BV)*(1+r*.5e01),
      segment = (BV)=>x=>1+x*0.5*BV;

  // The product of two such parametrised 1D orbits is a 2D manifold :
  // In ganja, you can simply multiply the two 1-parameter orbits to
  // make a 2-parameter manifold. (rendered as a sheet)

  // this allows us to multiply two circles into a torus or sphere,
  // two segments into a plane, or a segment and a circle to produce
  // a disk, cone or cylinder.

  let torus    = (r1,r2)=>circle(1e12,r1)*circle(1e13,r2),
      sphere   = (r)=>circle(1e13,0)*circle(1e12,r),
      plane    = (x,y)=>segment(x*1e02)*segment(y*1e03),
      cylinder = (r,l)=>segment(l*1e02)*circle(1e13,r),
      disk     = (r)=>circle(1e12,0)*segment(r*1e01),
      cone     = (r,l)=>circle(1e12,0)*segment(r*1e01-l*1e03);

  // we can render these now just as our other primitives ..
  let elements = [
    0xff0000, circle(1e12,1),
    0x0000ff, segment(1e01),
    0xff0088, torus(.5,.2),
    0xffff00, sphere(0.1),
    0x00ffff, plane(0.2,0.2),
    0x8800ff, cylinder(.05,1),
    0x00ff00, disk(0.2),
    0xffffff, cone(0.1,0.2)
  ];

  // show with rotating camera..
     let camera=1e1+1; // 0e1+1


  let canvas = Element.graph( () => {
    let time = performance.now()/1234;
    camera['set']( Math.cos(time) + Math.sin(time)*1e13 ); // rotate around Y
    return elements; }, { gl:true, animate:true, camera } ); // Requires gl canvas

  window['Geom']['Torus'].process( 'Torus', canvas );

} ); } };

/*
  document.body.appendChild(this.graph(()=>{
    var t=performance.now()/1234;
    camera.set( Math.cos(t) + Math.sin(t)*1e13  );
    return elements;
  },{camera,gl:1,animate:1}));
 */

//

var script$1 = {

  extends: GeomND$1,

  data() {
    return { route:'Geom3D', pageKey:'Grids', pages:{
      Lines:   { title:'Lines',   key:'Lines',   obj:Lines,   created:false, show:false },
      Grids:   { title:'Grids',   key:'Grids',   obj:Grids,   created:false, show:false },
      Isomet:  { title:'Isomet',  key:'Isomet',  obj:Isomet,  created:false, show:false },
      Play:    { title:'Play',    key:'Play',    obj:Play,    created:false, show:false },
      Isohed:  { title:'Isohed',  key:'Isohed',  obj:Isohed,  created:false, show:false },
      Objects: { title:'Objects', key:'Objects', obj:Objects, created:false, show:false },
      Torus:   { title:'Torus',   key:'Torus',   obj:Torus,   created:false, show:false }
    } } },
  
  };

/* script */
const __vue_script__$2 = script$1;

/* template */

  /* style */
  const __vue_inject_styles__$2 = undefined;
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = undefined;
  /* style inject */
  
  /* style inject SSR */
  

  
  var Geom3D = normalizeComponent_1(
    {},
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    undefined,
    undefined
  );

export default Geom3D;
