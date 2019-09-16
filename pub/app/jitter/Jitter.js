
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Home   from '../../vue/Jitter/Home.js';
import Router from './Router.js'

Vue['config'].productionTip = false;
Vue['mixin']( Main.vueMixin );

let Jitter = {}

Jitter.onReady = () => {
  const app = new Vue( { router: Router, render: h => h(Home.Dash) } );
  app.$mount('j-jitter'); }

Jitter.start = () => {
  Main.begin(Jitter.onReady); }

export default Jitter;