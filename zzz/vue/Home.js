//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//


let script = {

  props: { comp:String, btns:Object, klass:String, init:String, back:String, high:String },

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
      return this.key===btn.key ? { color:'black', backgroundColor:this.high }
                                : { color:'black', backgroundColor:back }; },
    classCheck: function (btn) {
      return this.key===btn.key ? 'check far fa-check-square' : 'check far fa-square' },
    classIcons: function (btn) {
      return 'icons ' + btn.icon },
    titleRef: function (btn) {
      return 'Title' + btn.key },
    img: function (btn) {
      return '../../css/' + btn.img },
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


  let options = typeof script === 'function' ? script.options : script; // render functions

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

  let hook;

  if (moduleIdentifier) {
    // server build
    hook = function hook(context) {
      // 2.3 injection
      context = context || // cached call
      this.$vnode && this.$vnode['ssrContext'] || // stateful
      this.parent && this.parent.$vnode && this.parent.$vnode['ssrContext']; // functional
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
      let originalRender = options.render;

      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return originalRender(h, context);
      };
    } else {
      // inject component registration as beforeCreate hook
      let existing = options.beforeCreate;
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    }
  }

  return script;
}

let normalizeComponent_1 = normalizeComponent;

let isOldIE = typeof navigator !== 'undefined' && /msie [6-9]\\b/.test(navigator.userAgent.toLowerCase());
function createInjector(context) {
  return function (id, style) {
    return addStyle(id, style);
  };
}
let HEAD = document.head || document.getElementsByTagName('head')[0];
let styles = {};

function addStyle(id, css) {
  let group = isOldIE ? css.media || 'default' : id;
  let style = styles[group] || (styles[group] = {
    ids: new Set(),
    styles: []
  });

  if (!style.ids.has(id)) {
    style.ids.add(id);
    let code = css.source;

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
      let index = style.ids.size - 1;
      let textNode = document.createTextNode(code);
      let nodes = style.element.childNodes;
      if (nodes[index]) style.element.removeChild(nodes[index]);
      if (nodes.length) style.element.insertBefore(textNode, nodes[index]);else style.element.appendChild(textNode);
    }
  }
}

let browser = createInjector;

/* script */
const __vue_script__ = script;

/* template */
let __vue_render__ = function() {
  let _vm = this;
  let _h = _vm.$createElement;
  let _c = _vm._self._c || _h;
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
                  "button",
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
let __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-d4b758b6_0", { source: ".btns {\n  font-size: 3vh;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 35% 65%;\n  grid-template-areas: \"icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n", map: {"version":3,"sources":["Btns.vue"],"names":[],"mappings":"AAAA;EACE,cAAc;EACd,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;AACX;AACA;EACE,aAAa;EACb,WAAW;EACX,YAAY;AACd;AACA;EACE,aAAa;EACb,8BAA8B;EAC9B,kCAAkC;EAClC,oBAAoB;EACpB,kBAAkB;EAClB,UAAU;EACV,WAAW;EACX,kBAAkB;EAClB,+BAA+B;EAC/B,eAAe;EACf,mBAAmB;EACnB,uBAAuB;AACzB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;EAClB,uBAAuB;EACvB,eAAe;AACjB;AACA;EACE,gBAAgB;EAChB,kBAAkB;EAClB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,uBAAuB;AACzB","file":"Btns.vue","sourcesContent":[".btns {\n  font-size: 3vh;\n  position: absolute;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n}\n.btn-center {\n  display: grid;\n  width: 100%;\n  height: 100%;\n}\n.btn {\n  display: grid;\n  grid-template-columns: 35% 65%;\n  grid-template-areas: \"icons label\";\n  justify-self: center;\n  align-self: center;\n  width: 80%;\n  height: 80%;\n  font-size: inherit;\n  font-family: Roboto, sans-serif;\n  cursor: pointer;\n  border-radius: 16px;\n  border: solid black 1px;\n}\n.btn .check {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .icons {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n}\n.btn .image {\n  grid-area: icons;\n  justify-self: center;\n  align-self: center;\n  border-radius: 8px;\n  border: solid black 1px;\n  max-height: 1em;\n}\n.btn .title {\n  grid-area: label;\n  justify-self: left;\n  align-self: center;\n  text-align: left;\n}\n.image-radius {\n  border-radius: 8px;\n  border: solid black 1px;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  let Btns = normalizeComponent_1(
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

let script$1 = {
  
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
};

/* script */
const __vue_script__$1 = script$1;

/* template */
let __vue_render__$1 = function() {
  let _vm = this;
  let _h = _vm.$createElement;
  let _c = _vm._self._c || _h;
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
let __vue_staticRenderFns__$1 = [
  function() {
    let _vm = this;
    let _h = _vm.$createElement;
    let _c = _vm._self._c || _h;
    return _c("div", { staticClass: "head" }, [
      _c("div", [
        _c("h1", [_vm._v("Welcome to Augmentation Home Page")]),
        _vm._v(" "),
        _c("h2", [_vm._v("Choose an Application Component on the Left")])
      ])
    ])
  },
  function() {
    let _vm = this;
    let _h = _vm.$createElement;
    let _c = _vm._self._c || _h;
    return _c("div", { staticClass: "foot" }, [
      _c("div", [_c("h1", [_vm._v("Axiom Architectures")])])
    ])
  }
];
__vue_render__$1._withStripped = true;

  /* style */
  const __vue_inject_styles__$1 = function (inject) {
    if (!inject) return
    inject("data-v-fa9c4756_0", { source: ".home {\n  display: grid;\n  grid-template-columns: 100%;\n  grid-template-rows: 10% 80% 10%;\n  grid-template-areas: \"head\" \"elem\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.elem {\n  grid-area: elem;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n", map: {"version":3,"sources":["Home.vue"],"names":[],"mappings":"AAAA;EACE,aAAa;EACb,2BAA2B;EAC3B,+BAA+B;EAC/B,yCAAyC;EACzC,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,SAAS;EACT,uBAAuB;EACvB,YAAY;AACd;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB;AACA;EACE,eAAe;EACf,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,QAAQ;EACR,YAAY;AACd;AACA;EACE,eAAe;EACf,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;AACrB","file":"Home.vue","sourcesContent":[".home {\n  display: grid;\n  grid-template-columns: 100%;\n  grid-template-rows: 10% 80% 10%;\n  grid-template-areas: \"head\" \"elem\" \"foot\";\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  background-color: black;\n  color: wheat;\n}\n.head {\n  grid-area: head;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n.elem {\n  grid-area: elem;\n  position: relative;\n  left: 0;\n  top: 0;\n  right: 0;\n  height: 100%;\n}\n.foot {\n  grid-area: foot;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  display: grid;\n  justify-self: stretch;\n  align-self: stretch;\n}\n"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__$1 = undefined;
  /* module identifier */
  const __vue_module_identifier__$1 = undefined;
  /* functional template */
  const __vue_is_functional_template__$1 = false;
  /* style inject SSR */
  

  
  let Home = normalizeComponent_1(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1,
    __vue_scope_id__$1,
    __vue_is_functional_template__$1,
    __vue_module_identifier__$1,
    browser,
    undefined
  );

export default Home;
