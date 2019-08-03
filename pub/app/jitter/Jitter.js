
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Home   from '../../vue/Jitter/Home.js';
import Router from './Router.js'

Vue['config'].productionTip = false;
Vue['mixin']( Main.vueMixin );

let Demo = {}

Demo.onReady = () => {
  const app = new Vue( { router: Router, render: h => h(Home.Dash) } );
  app.$mount('demo'); }

Demo.start = () => {
  Main.begin(Demo.onReady); }

export default Demo;