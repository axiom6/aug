import { Runtime, Inspector } from 'https://unpkg.com/@observablehq/notebook-runtime@1?module';

// URL: https://observablehq.com/@observablehq/downloading-and-embedding-notebooks
// Title: Downloading and Embedding Notebooks
// Author: Observable (@observablehq)
// Version: 525
// Runtime version: 1

const m0 = {
  id: "c2a04e7b9a9d03bb@525",
  variables: [
    {
      inputs: ["md"],
      value: (function(md){return(
md`# Downloading and Embedding Notebooks

<img src="https://etc.usf.edu/clipart/54200/54238/54238_book_pile_md.gif" style="max-width:450px" />

**tl;dr** *[Notebooks can be embedded and customized](http://ashkenas.com/breakout/) anywhere on the web (or off it).*

So, you’ve written your magnum opus: an awesome notebook full of splendor and delight. Now, the problem is — How do you display it on your website? How do you integrate its nifty charts into your web app? How do you save it to your hard drive, to file away for posterity alongside your old Word documents and vacation photos?

As you’ve probably noticed by now, Observable notebooks are a little bit different than the regular old JavaScripts you know and love. They execute in order of dependency and data flow rather than in a linear sequence of statements, and contain strange and marvelous reactive primitives, like [viewof](https://beta.observablehq.com/@mbostock/a-brief-introduction-to-viewof) and [mutable](https://beta.observablehq.com/@jashkenas/introduction-to-mutable-state).

Luckily, Observable provides an open-source [runtime](https://github.com/observablehq/notebook-runtime), which stitches together a notebook’s cells into a dependency graph and brings them to life through evaluation; a [standard library](https://github.com/observablehq/notebook-stdlib), which provides helpful functions for working with HTML, SVG, generators, files and promises among [other useful sundries](https://beta.observablehq.com/@mbostock/standard-library); and an [inspector](https://github.com/observablehq/notebook-inspector), which implements the default strategy for rendering DOM and JavaScript values into a live web page — although you’re free to write your own.

We’ll use the Observable runtime to render notebooks outside of observablehq.com.`
)})
    },
    {
      inputs: ["iconHeader"],
      value: (function(iconHeader){return(
iconHeader("Notebooks as ES Modules", `<path d="M8.688 1H3.875C3.115 1 2.5 1.627 2.5 2.4v11.2c0 .773.616 1.4 1.375 1.4h8.25c.76 0 1.375-.627 1.375-1.4V5.9L8.687 1z"></path><path d="M8.5 1v5h5"></path>`)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`After you share or publish a notebook, a copy of it, compiled to JavaScript, may be downloaded or linked as an [ES module](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/). Click the **Download code** link in a notebook’s menu to retrieve the URL for your notebook.

<img src="https://gist.githubusercontent.com/jashkenas/4553bbb196e54b301eeca39c7d5cf3cb/raw/3fd26b98b5e7b1b29faacc17379b93066f527220/code.png" style="max-width: 300px;" />

The URL will look something like this:

\`https://api.observablehq.com/@jashkenas/my-neat-notebook.js\``
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`
Using this ES module version of your notebook, you can run and render cells in any web or JavaScript environment.

Here’s a basic example script that renders every cell in a notebook into an empty HTML page:

\`\`\`html
<script type="module">
  // Load the Observable runtime and inspector.
  import {Runtime, Inspector} from "https://unpkg.com/@observablehq/notebook-runtime?module";

  // Your notebook, compiled as an ES module.
  import notebook from "https://api.observablehq.com/@jashkenas/my-neat-notebook.js";

  // Or, your notebook, downloaded locally.
  import notebook from "./my-neat-notebook.js";

  // Load the notebook, observing its cells with a default Inspector
  // that simply renders the value of each cell into the provided DOM node.
  Runtime.load(notebook, Inspector.into(document.body));
</script>
\`\`\``
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`\`Runtime.load()\` takes two or three arguments: a **notebook** module, an optional **builtins** object (which defaults to the Observable [standard library](https://github.com/observablehq/notebook-stdlib)), and an **observer callback**, which is invoked for each cell in your notebook, and may choose to return an **observer object** that can receive or render values as the cell is computed.

Define your **observer object** with three optional methods: 

**pending()** is called whenever the cell is reevaluated.

**fulfilled(value)** is passed the resolved value of the cell, whenever the evaluation has finished.

**rejected(error)** is passed the error when a cell fails to resolve for any reason.`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`
As a first example, let’s build our own version of \`Inspector.into()\`, still using the [notebook-inspector](https://github.com/observablehq/notebook-inspector) library:

\`\`\`js
Runtime.load(notebook, (cell) => {
  var div = document.createElement("div");
  document.body.appendChild(div);
  return new Inspector(div);
});
\`\`\``
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`
Here's an example of an observer callback that doesn't touch the DOM at all, instead logging all evaluation to the console:

\`\`\`js
Runtime.load(notebook, (cell) => {
  return {
    pending: () => console.log(\`\${cell.name} is running...\`),
    fulfilled: (value) => console.log(cell.name, value),
    rejected: (error) => console.error(error)
  };
});
\`\`\``
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`
Finally, here's an example of an observer callback that inserts just a single cell from your notebook into the page:

\`\`\`js
Runtime.load(notebook, (cell) => {
  if (cell.name === "chart") {
    return {
      fulfilled: (value) => {
        document.getElementById("chart").appendChild(value);
      }
    };
  }
});
\`\`\``
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`*Nota bene:* On observablehq.com, each cell in your notebook is evaluated eagerly by default, because each cell is visible on the page. With embedded notebooks, cells for which you do not provide an *observer* will not be evaluated (unless other cells depend on them). This gives you the flexibility to evaluate as much or as little of your notebook as you like, but may also make things appear broken if your notebook uses a lot of side effects. To force evaluation of a cell, just return an observer object (or \`true\`) from the observer callback.

\`\`\`js
Runtime.load(notebook, (cell) => {
  if (cell.name === "canvas") {
    return {fulfilled: (value) => $("#canvas").append(value)};
  } else {
    // Force evaluation of all the other cells in the notebook.
    return true;
  }
});
\`\`\``
)})
    },
    {
      inputs: ["iconHeader"],
      value: (function(iconHeader){return(
iconHeader("Notebooks as npm modules", `<path d="M14 4v9H2V4M1 1h14v3H1zM6.5 6.5h3" />`)
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`Observable also provides a copy of your notebook as an installable npm module, in gzipped tarball flavor.

<img src="https://gist.githubusercontent.com/jashkenas/4553bbb196e54b301eeca39c7d5cf3cb/raw/3fd26b98b5e7b1b29faacc17379b93066f527220/tarball.png" style="max-width: 300px;" />

Right-clicking and copying that link, will get you something that looks like this: <br>
\`https://api.observablehq.com/@jashkenas/my-neat-notebook.tgz\`

You can use this URL to install a notebook into your project with **npm**, **Yarn** or the JavaScript package manager of your choice:

\`\`\`
npm i https://api.observablehq.com/@jashkenas/my-neat-notebook.tgz

yarn add https://api.observablehq.com/@jashkenas/my-neat-notebook.tgz
\`\`\`

This will install the notebook as a package under its published name ("my-neat-notebook"). Notebooks are versioned with every change that you make, and requests to the Observable API for the ES Module or Tarball will receive the latest published or shared version.

If you want to lock your request to a specific version, you can add the version number of any published or shared version of your notebook to the URL:

\`\`\`
https://api.observablehq.com/@jashkenas/my-neat-notebook@42.js
https://api.observablehq.com/@jashkenas/my-neat-notebook@365.tgz
\`\`\``
)})
    },
    {
      name: "demo",
      inputs: ["md"],
      value: (function(md){return(
md`## ✨ Live Demonstrations ✨

As an off-site example of an embedded notebook in action, check out http://ashkenas.com/breakout. It loads the runtime and [this Observable notebook](https://beta.observablehq.com/@jashkenas/breakout), rendering values from four of the notebook cells into the page: the **game canvas**, the **"New Game" button**, the **current score**, and the **high score**.


<a href="http://ashkenas.com/breakout"><img src="https://gist.githubusercontent.com/jashkenas/4553bbb196e54b301eeca39c7d5cf3cb/raw/8fe3d464429e2db7ef78cd99979f05652fb31379/breakout.png" style="max-width: 400px;" /></a>`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`As a second, more minimal, example: [this CodePen](https://codepen.io/jashkenas/pen/gzZXPG) embeds a [simple notebook](https://beta.observablehq.com/d/e8186dc6a68b5179) that exposes a single \`tick\` cell, incrementing every second.

As a third example, [Philippe Rivière](https://beta.observablehq.com/@fil) wrote a brief tutorial that demonstrates embedding [this notebook on Tissot’s indicatrix](https://beta.observablehq.com/@fil/tissots-indicatrix) into a [Jekyll blog post](https://visionscarto.net/observable-jekyll/).

And finally, as an arcane demonstration of the dark arts of recursive embedding, we can use the Observable environment to demonstrate the brainbending reality of a [notebook embedding *itself*](https://beta.observablehq.com/@jashkenas/ouroboros-a-notebook-embeds-itself). Wow!`
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`We’re hoping to continue working to make notebook embedding more useful over time — with your help. If you have interesting use cases, publishing workflows, npm module ideas, website embed techniques, or just want to talk about anything else you’d like to see embedded notebooks do, please join the conversation on [talk.observablehq.com](https://talk.observablehq.com/).`
)})
    },
    {
      name: "iconHeader",
      inputs: ["html"],
      value: (function(html){return(
function iconHeader(title, svg) {
  return html`<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" width="32" height="32" style="stroke-width: 1.5;">${svg}</svg>
<h2 style="display: inline; vertical-align: top; margin-left: 5px;">${title}</h2>`;
}
)})
    },
    {
      inputs: ["md"],
      value: (function(md){return(
md`*Thanks for the pile of books, [ClipArt ETC](http://etc.usf.edu/clipart/54200/54238/54238_book_pile.htm).*`
)})
    }
  ]
};

const notebook = {
  id: "c2a04e7b9a9d03bb@525",
  modules: [m0]
};

//

var script = {

  methods: {
    run: function( ref, notebook ){
      let elem = this.$refs[ref];
      Runtime.load( notebook, Inspector['into']( elem ) ); } },

  mounted: function () {
    this.run( 'EmbedNB', notebook ); }

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
  return _c("div", { ref: "EmbedNB", staticClass: "embed-pane" })
};
var __vue_staticRenderFns__ = [];
__vue_render__._withStripped = true;

  /* style */
  const __vue_inject_styles__ = function (inject) {
    if (!inject) return
    inject("data-v-47a13a74_0", { source: ".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.embed-pane {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n  font-size: 2vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n  overflow: scroll;\n}\n", map: {"version":3,"sources":["Embed.vue","/Users/ax/Documents/prj/aug/vue/note/Embed.vue"],"names":[],"mappings":"AAAA;EACE,gBAAgB;EAChB,uBAAuB;EACvB,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,kBAAkB;EAClB,2BAA2B;EAC3B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;ECCA,gBAAA;EDCE,+BAA+B;ECCjC,aAAA;EDCE,oBAAoB;ECCtB,kBAAA;EACA,kBAAA;ADCA;AACA;EACE,kBAAkB;EAClB,6BAA6B;EAC7B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,mBAAmB;EACnB,+BAA+B;EAC/B,aAAa;EACb,oBAAoB;EACpB,kBAAkB;EAClB,kBAAkB;AACpB;AACA;EACE,gBAAgB;EAChB,+BAA+B;EAC/B,aAAa;EACb,mBAAmB;EACnB,kBAAkB;EAClB,gBAAgB;AAClB;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,YAAY;AACd;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,MAAM;EACN,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,QAAQ;EACR,WAAW;EACX,WAAW;AACb;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;EAChB,iBAAiB;AACnB;AACA;EACE,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,gBAAgB;EAChB,UAAU;EACV,SAAS;EACT,gBAAgB;AAClB;AACA;EACE,mBAAmB;EACnB,2CAA2C;AAC7C;AACA;EACE,kBAAkB;EAClB,OAAO;EACP,OAAO;EACP,WAAW;EACX,WAAW;EACX,gBAAgB;EAChB,aAAa;EACb,qBAAqB;EACrB,mBAAmB;EACnB,kBAAkB;EAClB,uBAAuB;EACvB,YAAY;EACZ,gBAAgB;AAClB","file":"Embed.vue","sourcesContent":[".theme-h1 {\n  font-size: 8vmin;\n  margin: 2vmin 0 2vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h2 {\n  font-size: 6.4vmin;\n  margin: 1.6vmin 0 1.6vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h3 {\n  font-size: 5.12vmin;\n  margin: 1.28vmin 0 1.28vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h4 {\n  font-size: 4vmin;\n  margin: 1.024vmin 0 1.024vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h5 {\n  font-size: 3.2vmin;\n  margin: 0.82vmin 0 0.82vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-h6 {\n  font-size: 2.56vmin;\n  margin: 0.656vmin 0 0.656vmin 0;\n  display: grid;\n  justify-self: center;\n  align-self: center;\n  text-align: center;\n}\n.theme-p {\n  font-size: 2vmin;\n  margin: 0.524vmin 0 0.524vmin 0;\n  display: grid;\n  justify-self: start;\n  align-self: center;\n  text-align: left;\n}\n.theme-article {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\n.theme-header {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 20%;\n}\n.theme-section {\n  position: absolute;\n  left: 0;\n  top: 20%;\n  width: 100%;\n  height: 60%;\n}\n.theme-footer {\n  position: absolute;\n  left: 0;\n  top: 80%;\n  width: 100%;\n  height: 20%;\n}\n.theme-ul {\n  font-size: 4vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n  font-weight: bold;\n}\n.theme-ul li {\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul {\n  font-size: 3.5vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.theme-ul li ul li ul {\n  font-size: 3vmin;\n  padding: 0;\n  margin: 0;\n  list-style: none;\n}\n.theme-ul li ul li ul li {\n  padding-left: 1vmin;\n  margin: 0.25vmin 0.25vmin 0.25vmin 0.25vmin;\n}\n.embed-pane {\n  position: absolute;\n  left: 0;\n  top: 5%;\n  width: 100%;\n  height: 95%;\n  font-size: 2vmin;\n  display: grid;\n  justify-items: center;\n  align-items: center;\n  text-align: center;\n  background-color: black;\n  color: wheat;\n  overflow: scroll;\n}\n","\n<template>\n  <div class=\"embed-pane\" ref=\"EmbedNB\"></div>\n</template>\n\n<script type=\"module\">\n\n  import { Inspector, Runtime } from 'https://unpkg.com/@observablehq/notebook-runtime@1?module';\n  import EmbedNB from './EmbedNB.js';\n\n  export default {\n\n    methods: {\n      run: function( ref, notebook ){\n        let elem = this.$refs[ref];\n        Runtime.load( notebook, Inspector['into']( elem ) ); } },\n\n    mounted: function () {\n      this.run( 'EmbedNB', EmbedNB ) }\n\n  }\n</script>\n\n<style lang=\"less\">\n  \n  @import '../../pub/css/themes/theme.less';\n  \n  @embedFS:@themeFS;\n  \n  .embed-pane { position:absolute; left:0; top:@theme-tabs-height; width:100%; height:100%-@theme-tabs-height;\n    font-size:@embedFS;.themeCenterItems(); background-color:@theme-back; color:@theme-fore; overflow:scroll; }\n\n</style>"]}, media: undefined });

  };
  /* scoped */
  const __vue_scope_id__ = undefined;
  /* module identifier */
  const __vue_module_identifier__ = undefined;
  /* functional template */
  const __vue_is_functional_template__ = false;
  /* style inject SSR */
  

  
  var Embed = normalizeComponent_1(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__,
    __vue_scope_id__,
    __vue_is_functional_template__,
    __vue_module_identifier__,
    browser,
    undefined
  );

export default Embed;
