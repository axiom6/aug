import { Runtime, Inspector } from 'https://unpkg.com/@observablehq/notebook-runtime@1?module';

// URL: https://observablehq.com/@axiom6/standard-library
// Title: Standard Library
// Author: Tom Flaherty (@axiom6)
// Version: 648
// Runtime version: 1

const m0 = {
  id: "72db2064e484bfda@648",
  variables: [

    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## DOM`
        )
      })
    },
    {
      inputs: ["DOM"],
      value: (function (DOM) {
        return (
          DOM
        )
      })
    },
    {
      inputs: ["DOM", "width"],
      value: (function (DOM, width) {
          const context = DOM['context2d'](width, 33);
          context.fillText("Hello, I am a canvas!", 0, 20);
          return context.canvas;
        }
      )
    },
    {
      inputs: ["DOM"],
      value: (function (DOM) {
        return (
          DOM.download(
            new Blob([JSON.stringify({hello: "world"})], {type: "application/json"}),
            "hello.json", // optional file name
            "Click to Download" // optional button label
          )
        )
      })
    },
    {
      inputs: ["DOM", "svg"],
      value: (function (DOM, svg) {
          const clip = DOM.uid("clip");
          return svg`<svg width="128" height="128" viewBox="0 0 640 640">
  <defs>
    <clipPath id="${clip.id}">
      <circle cx="320" cy="320" r="320"></circle>
    </clipPath>
  </defs>
  <image
    clip-path="${clip}"
    width="640" height="640"
    preserveAspectRatio="xMidYMin slice"
    xlink:href="https://gist.githubusercontent.com/mbostock/9511ae067889eefa5537eedcbbf87dab/raw/944b6e5fe8dd535d6381b93d88bf4a854dac53d4/mona-lisa.jpg"
  ></image>
</svg>`;
        }
      )
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## HTML`
        )
      })
    },
    {
      inputs: ["html"],
      value: (function (html) {
        return (
          html`I am a text node.`
        )
      })
    },
    {
      inputs: ["DOM"],
      value: (function (DOM) {
        return (
          DOM.text("I am a text node.")
        )
      })
    },
    {
      inputs: ["html", "DOM"],
      value: (function (html, DOM) {
        return (
          html`This is escaped: ${DOM.text("<i>Hello!</i>")}`
        )
      })
    },
    {
      inputs: ["html"],
      value: (function (html) {
        return (
          html`<span style="background:yellow;">
  Hello, <i>world</i>!
</span>`
        )
      })
    },
    {
      inputs: ["html"],
      value: (function (html) {
        return (
          html`<input type=range min=0 max=10 step=1>`
        )
      })
    },
    {
      inputs: ["html"],
      value: (function (html) {
        return (
          html`<select>
  <option>one</option>
  <option>two</option>
  <option>three</option>
</select>`
        )
      })
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## SVG`
        )
      })
    },
    {
      inputs: ["svg", "width"],
      value: (function (svg, width) {
        return (
          svg`<svg width=${width} height=27>
  <text y=22>Hello, I am SVG!</text>
</svg>`
        )
      })
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## Markdown`
        )
      })
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`Hello, I am *Markdown*!`
        )
      })
    },
    {
      inputs: ["md", "now"],
      value: (function (md, now) {
        return (
          md`The current time is ${new Date(now).toLocaleString()}.`
        )
      })
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## LaTeX`
        )
      })
    },
    {
      inputs: ["tex"],
      value: (function (tex) {
        return (
          tex`E = mc^2`
        )
      })
    },
    {
      inputs: ["tex"],
      value: (function (tex) {
        return (
          tex`
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
`
        )
      })
    },
    {
      inputs: ["tex"],
      value: (function (tex) {
        return (
          tex.block`
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
`
        )
      })
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## Files`
        )
      })
    },
    {
      inputs: ["Files"],
      value: (function (Files) {
        return (
          Files
        )
      })
    },
    {
      name: "viewof file",
      inputs: ["html"],
      value: (function (html) {
        return (
          html`<input type=file>`
        )
      })
    },
    {
      name: "file",
      inputs: ["Generators", "viewof file"],
      value: (G, _) => G.input(_)
    },
    {
      inputs: ["Files", "file"],
      value: (function (Files, file) {
        return (
          Files.buffer(file)
        )
      })
    },
    {
      inputs: ["Files", "file"],
      value: (function (Files, file) {
        return (
          Files.text(file)
        )
      })
    },
    {
      inputs: ["Files", "file"],
      value: (function (Files, file) {
        return (
          Files.url(file)
        )
      })
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## Generators`
        )
      })
    },
    {
      inputs: ["Generators"],
      value: (function (Generators) {
        return (
          Generators
        )
      })
    },
    {
      name: "integers",
      value: (function () {
        return (
          function* integers() {
            let i = -1;
            while (true) {
              yield ++i;
            }
          }
        )
      })
    },
    {
      name: "input",
      inputs: ["html"],
      value: (function (html) {
        return (
          html`<input type=range>`
        )
      })
    },
    {
      name: "inputValue",
      inputs: ["Generators", "input"],
      value: (function (Generators, input) {
        return (
          Generators.input(input)
        )
      })
    },
    {
      inputs: ["Generators"],
      value: (function (Generators) {
        return (
          Generators.observe(notify => {
            const mousemoved = event => notify([event.clientX, event.clientY]);
            window.addEventListener("mousemove", mousemoved);
            return () => window.removeEventListener("mousemove", mousemoved);
          })
        )
      })
    },
    {
      inputs: ["Generators"],
      value: (function (Generators) {
        return (
          Generators.queue(notify => {
            const mousemoved = event => notify([event.clientX, event.clientY]);
            window.addEventListener("mousemove", mousemoved);
            return () => window.removeEventListener("mousemove", mousemoved);
          })
        )
      })
    },
    {
      inputs: ["md"],
      value: (function (md) {
        return (
          md`## Promises`
        )
      })
    },
    {
      inputs: ["Promises"],
      value: (function (Promises) {
        return (
          Promises
        )
      })
    },
    {
      inputs: ["Promises"],
      value: (function (Promises) {
        return (
          Promises.delay(5000, "resolved value")
        )
      })
    },
    {
      inputs: ["Promises"],
      value: (function (Promises) {
        return (
          Promises.tick(1000, "resolved value")
        )
      })
    },
    {
      inputs: ["Promises"],
      value: (function* (Promises) {
          while (true) {
            yield Promises.tick(1000).then(() => new Date);
          }
        }
      )
    }

  ]
};

const StandNB = {
  id: "72db2064e484bfda@648",
  modules: [m0]
};

//

var script = {

  methods: {
    run: function( ref, notebook ){
      let elem = this.$refs[ref];
      Runtime.load( notebook, Inspector['into']( elem ) ); } },

  mounted: function () {
    this.run( 'StandNB', StandNB ); }
    
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
  return _c("div", { ref: "StandNB", staticClass: "stand-pane" })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-654d610f_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.ganja-pane {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n  font-size: 2vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n  overflow: scroll;\n}\n", map: {"version":3,"sources":["Stand.vue","/Users/ax/Documents/prj/aug/vue/note/Stand.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;ACCA;EDCE,gBAAgB;ECClB,+BAAA;EDCE,aAAa;ECCf,oBAAA;EACA,kBAAA;EDCE,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,WAAW;EACX,WAAW;EACX,gBAAgB;EAChB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;EACvB,YAAY;EACZ,gBAAgB;AAClB","file":"Stand.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.ganja-pane {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n  font-size: 2vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n  overflow: scroll;\n}\n","\n<template>\n  <div class=\"stand-pane\" ref=\"StandNB\"></div>\n</template>\n\n<script type=\"module\">\n\n  import { Inspector, Runtime } from 'https://unpkg.com/@observablehq/notebook-runtime@1?module';\n  import StandNB from './StandNB.js';\n  \n  export default {\n\n    methods: {\n      run: function( ref, notebook ){\n        let elem = this.$refs[ref];\n        Runtime.load( notebook, Inspector['into']( elem ) ); } },\n\n    mounted: function () {\n      this.run( 'StandNB', StandNB ) }\n      \n  }\n</script>\n\n<style lang=\"less\">\n  @import '../../pub/css/themes/theme.less';\n  \n  @standFS:@themeFS;\n\n  .ganja-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;\n    font-size:@standFS;.themeCenterItems(); background-color:@theme-back; color:@theme-fore; overflow:scroll; }\n  \n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Stand = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Stand;
