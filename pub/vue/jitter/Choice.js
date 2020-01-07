//
//
//
//
//
//
//
//
//
//
//
//


let Summ = {

  props: { name:String },

  data() { return { c0:"-", c1:"-", c2:"-" } },

  methods:{
    
    onChoice: function( choice ) {
      let idx = this.mix().choiceIndex( this.name, choice );
      this['c'+idx]     = choice; } },

  mounted: function () {
    this.mix().subscribe( this.name,  this.name+'Id', this.onChoice );
    let choices = this.mix().choices( this.name );
    for( let idx=0; idx <  choices.length; idx++ ) {
      this['c'+idx] = choices[idx]; } }

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
const __vue_script__ = Summ;

/* template */
var __vue_render__ = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "summ-pane" }, [
    _c("div", { staticClass: "summ-name" }, [_vm._v(_vm._s(this.name))]),
    _vm._v(" "),
    _c("div", { staticClass: "summ-choices" }, [
      _c("div", { staticClass: "c1" }, [_vm._v(_vm._s(this.c0))]),
      _vm._v(" "),
      _c("div", { staticClass: "c2" }, [_vm._v(_vm._s(this.c1))]),
      _vm._v(" "),
      _c("div", { staticClass: "c3" }, [_vm._v(_vm._s(this.c2))])
    ])
  ])
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-1f066878_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.summ-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n  border: 1px solid wheat;\n}\n.summ-pane .summ-name {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 50%;\n  font-size: 3vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.summ-pane .summ-choices {\n  position: absolute;\n  left: 0;\n  top: 50%;\n  width: 100%;\n  height: 50%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  grid-template-rows: 100fr;\n  grid-template-columns: 33.3fr 33.3fr 33.3fr;\n  grid-template-areas: \"c1 c2 c3\";\n  font-size: 2vmin;\n}\n.summ-pane .summ-choices .c1 {\n  grid-area: c1;\n}\n.summ-pane .summ-choices .c2 {\n  grid-area: c2;\n}\n.summ-pane .summ-choices .c3 {\n  grid-area: c3;\n}\n", map: {"version":3,"sources":["Summ.vue","/Users/ax/Documents/prj/aug/vue/jitter/Summ.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;ACCA;EDCE,mBAAmB;ECCrB,+BAAA;EDCE,aAAa;ECCf,oBAAA;EACA,kBAAA;EDCE,kBAAkB;ACCpB;AACA;EACA,gBAAA;EDCE,+BAA+B;ECCjC,aAAA;EACA,mBAAA;EDCE,kBAAkB;ECCpB,gBAAA;AACA;AACA;EDCE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;EACX,gBAAgB;EAChB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;EACX,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,yBAAyB;EACzB,2CAA2C;EAC3C,+BAA+B;EAC/B,gBAAgB;AAClB;AACA;EACE,aAAa;AACf;AACA;EACE,aAAa;AACf;AACA;EACE,aAAa;AACf","file":"Summ.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.summ-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n  border: 1px solid wheat;\n}\n.summ-pane .summ-name {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 50%;\n  font-size: 3vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n}\n.summ-pane .summ-choices {\n  position: absolute;\n  left: 0;\n  top: 50%;\n  width: 100%;\n  height: 50%;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  grid-template-rows: 100fr;\n  grid-template-columns: 33.3fr 33.3fr 33.3fr;\n  grid-template-areas: \"c1 c2 c3\";\n  font-size: 2vmin;\n}\n.summ-pane .summ-choices .c1 {\n  grid-area: c1;\n}\n.summ-pane .summ-choices .c2 {\n  grid-area: c2;\n}\n.summ-pane .summ-choices .c3 {\n  grid-area: c3;\n}\n","\n<template>\n  <div   class=\"summ-pane\">\n    <div class=\"summ-name\">{{this.name}}</div>\n    <div class=\"summ-choices\">\n      <div class=\"c1\">{{this.c0}}</div>\n      <div class=\"c2\">{{this.c1}}</div>\n      <div class=\"c3\">{{this.c2}}</div>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  let Summ = {\n\n    props: { name:String },\n\n    data() { return { c0:\"-\", c1:\"-\", c2:\"-\" } },\n\n    methods:{\n      \n      onChoice: function( choice ) {\n        let idx = this.mix().choiceIndex( this.name, choice )\n        this['c'+idx]     = choice; } },\n\n    mounted: function () {\n      this.mix().subscribe( this.name,  this.name+'Id', this.onChoice );\n      let choices = this.mix().choices( this.name );\n      for( let idx=0; idx <  choices.length; idx++ ) {\n        this['c'+idx] = choices[idx]; } }\n\n  }\n\n  export default Summ;\n\n</script>\n\n<style lang=\"less\">\n  \n@import '../../pub/css/themes/theme.less';\n\n@summFS:@themeFS;\n\n.summ-pane { position:absolute; left:0; top:0; width:100%; height:100%;\n        background-color:@theme-back; color:@theme-fore; border:1px solid @theme-fore;\n  \n  // .themeCenterItems() has display:grid;\n  .summ-choices(){ .themeCenterItems(); grid-template-rows:100fr; grid-template-columns:33.3fr 33.3fr 33.3fr;\n    grid-template-areas:\"c1 c2 c3\" }\n  \n  .summ-name {    position:absolute; left:0; top:0;   width:100%; height:50%; font-size:1.5*@summFS;\n    .themeCenterItems(); }\n  \n  .summ-choices { position:absolute; left:0; top:50%; width:100%; height:50%; .summ-choices(); font-size:@summFS;\n    .c1 { grid-area:c1; } .c2 { grid-area:c2; } .c3 { grid-area:c3; } }\n  }\n\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Summ$1 = normalizeComponent_1(
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


// import Data from '../../pub/base/util/Data.js'

var script = {

  props: { name:String, btns:Object },

  methods: {
    pubBtn: function (btn) {
      this.mix().choose(  this.name, btn.name );
      btn.checked = this.mix().choosen( this.name, btn.name );
      // console.log( 'Btns.pubBtn()', this.name, btn.name,  btn.checked );
      this.mix().publish( this.name, btn.name ); },
    aspect: function() {  // Only call in mounted
      let w = this.$refs['Btns']['clientWidth' ];
      let h = this.$refs['Btns']['clientHeight'];
      return h/w; },
    styleBlock: function(p) {
      let sy = 1.0;
      let p2 = p[2]===0 ? p[3] : p[2];
      return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',
      fontSize:(p[3]*0.08)+'em' } },
    styleBtn: function (btn) {
      let back = this.mix().toRgbaHsv( btn.hsv );
      return { color:'black', backgroundColor:back }; },
    classCheck: function (btn) {
      btn.checked = this.mix().choosen( this.name, btn.name );
      // console.log( 'Btns.classCheck()', { checked:btn.checked, name:this.name, choice:btn.name } );
      return btn.checked ? 'check far fa-check-square' : 'check far fa-square'; },
    classIcons: function (btn) {
      return 'icons ' + btn.icon },
    titleRef: function (btn) {
      return 'Title' + btn.name },
    srcImg: function (btn) {
      return '../../css/' + btn.img },
    adjustWidths: function() {
       let names = Object.keys(this.btns);
       for( let name of names ) {
         let btn = this.btns[name];
         if( btn.pos[2]===0 ) {
           let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth'];
           btn.elem   = this.$refs[btn.name][0];
           let wb     = btn.elem['clientWidth'];
           btn.pos[2] = btn.pos[3]*2.4*wt/wb;
           // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
           btn.elem.style.width = btn.pos[2]+'%'; } }
    } },

  mounted: function () {
    this.asp = this.aspect();
    this.adjustWidths(); }

};

/* script */
const __vue_script__$1 = script;

/* template */
var __vue_render__$1 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c(
    "div",
    { ref: "Btns", staticClass: "btns-pane" },
    [
      _vm._l(_vm.btns, function(btn) {
        return [
          _c(
            "div",
            { ref: btn.name, refInFor: true, style: _vm.styleBlock(btn.pos) },
            [
              _c("div", { staticClass: "btns-center" }, [
                _c(
                  "div",
                  {
                    staticClass: "btns-btn",
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
                          attrs: { src: _vm.srcImg(btn), alt: "" }
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
var __vue_staticRenderFns__$1 = [];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-a2f5e2c4_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n.btns-pane {\n  font-size: 2.8vmin;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btns-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btns-btn {\n  display: grid;\n  grid-template-columns: 20fr 24fr 56fr;\n  grid-template-areas: \"check icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 90%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btns-btn .check {\n  grid-area: check;\n  justify-self: center;\n  align-self: center;\n}\n.btns-btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btns-btn .image {\n  grid-area: icons;\n  justify-self: left;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1.5em;\n}\n.btns-btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n", map: {"version":3,"sources":["Btns.vue","/Users/ax/Documents/prj/aug/vue/elem/Btns.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;ACCA;EDCE,kBAAkB;ECCpB,OAAA;EDCE,QAAQ;ECCV,WAAA;EDCE,WAAW;ACCb;ADCA;ECCA,gBAAA;EDCE,UAAU;ECCZ,SAAA;EDCE,gBAAgB;ECClB,iBAAA;AACA;AACA;EDCE,2CAA2C;ACC7C;AACA;EACA,kBAAA;EACA,UAAA;EACA,SAAA;EDCE,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,uBAAuB;AACzB;AACA;EACE,kBAAkB;EAClB,iBAAiB;EACjB,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;AACX;AACA;EACE,aAAa;EACb,WAAW;EACX,YAAY;AACd;AACA;EACE,aAAa;EACb,qCAAqC;EACrC,wCAAwC;EACxC,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,+BAA+B;EAC/B,eAAe;EACf,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,kBAAkB;EAClB,uBAAuB;EACvB,iBAAiB;AACnB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB","file":"Btns.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n.btns-pane {\n  font-size: 2.8vmin;\n  font-weight: bold;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btns-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btns-btn {\n  display: grid;\n  grid-template-columns: 20fr 24fr 56fr;\n  grid-template-areas: \"check icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 90%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btns-btn .check {\n  grid-area: check;\n  justify-self: center;\n  align-self: center;\n}\n.btns-btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btns-btn .image {\n  grid-area: icons;\n  justify-self: left;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1.5em;\n}\n.btns-btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n","\n<template>\n  <div ref=\"Btns\" class=\"btns-pane\">\n    <template v-for=\"btn in btns\">\n      <div        :ref=\"btn.name\"  :style=\"styleBlock(btn.pos)\">\n        <div   class=\"btns-center\">\n          <div class=\"btns-btn\" :style=\"styleBtn(btn)\" @click=\"pubBtn(btn)\">\n            <span v-if=\"btn.check\" :class=\"classCheck(btn)\"></span>\n            <i    v-if=\"btn.icon\"  :class=\"classIcons(btn)\"></i>\n            <img  v-if=\"btn.img\"    class=\"image\" :src=\"srcImg(btn)\" alt=\"\"/>\n            <span v-if=\"btn.title\"  class=\"title\" :ref=\"titleRef(btn)\">{{btn.title}}</span>\n          </div>\n        </div>\n      </div>\n    </template>\n  </div>\n</template>\n\n<script type=\"module\">\n  \n  // import Data from '../../pub/base/util/Data.js'\n\n  export default {\n\n    props: { name:String, btns:Object },\n\n    methods: {\n      pubBtn: function (btn) {\n        this.mix().choose(  this.name, btn.name );\n        btn.checked = this.mix().choosen( this.name, btn.name );\n        // console.log( 'Btns.pubBtn()', this.name, btn.name,  btn.checked );\n        this.mix().publish( this.name, btn.name ); },\n      aspect: function() {  // Only call in mounted\n        let w = this.$refs['Btns']['clientWidth' ];\n        let h = this.$refs['Btns']['clientHeight'];\n        return h/w; },\n      styleBlock: function(p) {\n        let sy = 1.0\n        let p2 = p[2]===0 ? p[3] : p[2];\n        return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',\n        fontSize:(p[3]*0.08)+'em' } },\n      styleBtn: function (btn) {\n        let back = this.mix().toRgbaHsv( btn.hsv );\n        return { color:'black', backgroundColor:back }; },\n      classCheck: function (btn) {\n        btn.checked = this.mix().choosen( this.name, btn.name );\n        // console.log( 'Btns.classCheck()', { checked:btn.checked, name:this.name, choice:btn.name } );\n        return btn.checked ? 'check far fa-check-square' : 'check far fa-square'; },\n      classIcons: function (btn) {\n        return 'icons ' + btn.icon },\n      titleRef: function (btn) {\n        return 'Title' + btn.name },\n      srcImg: function (btn) {\n        return '../../css/' + btn.img },\n      adjustWidths: function() {\n         let names = Object.keys(this.btns)\n         for( let name of names ) {\n           let btn = this.btns[name];\n           if( btn.pos[2]===0 ) {\n             let wt     = this.$refs[this.titleRef(btn)][0]['clientWidth']\n             btn.elem   = this.$refs[btn.name][0]\n             let wb     = btn.elem['clientWidth']\n             btn.pos[2] = btn.pos[3]*2.4*wt/wb\n             // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }\n             btn.elem.style.width = btn.pos[2]+'%' } }\n      } },\n\n    mounted: function () {\n      this.asp = this.aspect();\n      this.adjustWidths(); }\n\n  }\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @btnsFS:1.4*@themeFS;\n\n  .image-radius { border-radius:8px; border:solid @theme-back 1px; }\n  \n  .btns-pane { font-size:@btnsFS; font-weight:bold; position:absolute; left:0; top:0; right:0; bottom:0; }\n  \n  .btns-center { display:grid;  width:100%; height:100%; } // A surrounding div for centering button\n\n  .btns-grid1x3() { display:grid; grid-template-columns:20fr 24fr 56fr; grid-template-areas:\"check icons label\"; }\n\n  .btns-btn { .btns-grid1x3(); justify-self:center; align-self:center;\n    width:90%; height:80%; font-size:inherit; font-family:@theme-font-family;\n    cursor:pointer; border-radius:16px; border: solid @theme-back 1px;\n\n    .check { grid-area:check; justify-self:center; align-self:center; }\n    .icons { grid-area:icons; justify-self:center; align-self:center; } // font-family: \"font-awesome\" serif;\n    .image { grid-area:icons; justify-self:left;   align-self:center; .image-radius; max-height:1.5em; }\n    .title { grid-area:label; justify-self:left;   align-self:center; text-align:left; }\n  }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  var Btns = normalizeComponent_1(
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

let Choice = {

  components:{ 'h-summ':Summ$1, 'h-btns':Btns },

  data() { return { name:'None', btns:{} } },
  
};

/* script */
const __vue_script__$2 = Choice;

/* template */
var __vue_render__$2 = function() {
  var _vm = this;
  var _h = _vm.$createElement;
  var _c = _vm._self._c || _h;
  return _c("div", { staticClass: "choice-pane" }, [
    _c(
      "div",
      { staticClass: "choice-summ" },
      [_c("h-summ", { attrs: { name: _vm.name } })],
      1
    ),
    _vm._v(" "),
    _c(
      "div",
      { staticClass: "choice-btns" },
      [_c("h-btns", { attrs: { name: _vm.name, btns: _vm.btns } })],
      1
    )
  ])
};
var __vue_staticRenderFns__$2 = [];
__vue_render__$2._withStripped = true;

  /* style */
  const __vue_inject_styles__$2 = function (inject) {
    if (!inject) return
    inject("data-v-99ad96fe_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.choice-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n}\n.choice-pane .choice-summ {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 15%;\n}\n.choice-pane .choice-btns {\n  position: absolute;\n  left: 0;\n  top: 15%;\n  width: 100%;\n  height: 85%;\n  background-color: black;\n  color: wheat;\n  border: 1px solid wheat;\n}\n", map: {"version":3,"sources":["Choice.vue","/Users/ax/Documents/prj/aug/vue/jitter/Choice.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;ACCpB;ADCA;ECCA,kBAAA;EACA,6BAAA;EDCE,aAAa;ECCf,oBAAA;EDCE,kBAAkB;ECCpB,kBAAA;AACA;AACA;EDCE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;EACZ,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;EACX,uBAAuB;EACvB,YAAY;EACZ,uBAAuB;AACzB","file":"Choice.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.choice-pane {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  color: wheat;\n}\n.choice-pane .choice-summ {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 15%;\n}\n.choice-pane .choice-btns {\n  position: absolute;\n  left: 0;\n  top: 15%;\n  width: 100%;\n  height: 85%;\n  background-color: black;\n  color: wheat;\n  border: 1px solid wheat;\n}\n","\n<template>\n  <div   class=\"choice-pane\">\n    <div class=\"choice-summ\">\n      <h-summ :name=\"name\" ></h-summ>\n    </div>\n    <div class=\"choice-btns\">\n      <h-btns :name=\"name\" :btns=\"btns\"></h-btns>\n    </div>\n  </div>\n</template>\n\n<script type=\"module\">\n\n  import Summ from './Summ.vue';\n  import Btns from '../../vue/elem/Btns.vue';\n\n  let Choice = {\n\n    components:{ 'h-summ':Summ, 'h-btns':Btns },\n\n    data() { return { name:'None', btns:{} } },\n    \n  }\n\n  export default Choice;\n\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  .choice-pane { position:absolute; left:0; top:0; width:100%; height:100%;\n    background-color:@theme-back; color:@theme-fore;\n    \n    .choice-summ { position:absolute; left:0; top:0;   width:100%; height:15%; }\n    \n    .choice-btns { position:absolute; left:0; top:15%; width:100%; height:85%;\n                   background-color:@theme-back; color:@theme-fore;  border:1px solid @theme-fore; }\n  }\n\n</style>\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$2 = undefined;
  /* module identifier */
  const __vue_module_identifier__$2 = undefined;
  /* functional template */
  const __vue_is_functional_template__$2 = false;
  /* style inject SSR */
  

  
  var Choice$1 = normalizeComponent_1(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2,
    __vue_scope_id__$2,
    __vue_is_functional_template__$2,
    __vue_module_identifier__$2,
    browser,
    undefined
  );

export default Choice$1;
