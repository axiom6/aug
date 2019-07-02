
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Home   from './Home.js';
import Router from './Router.js'
import             '../../bas/sw/registerServiceWorker.ini.js'

Vue['config'].productionTip = false;
Vue['mixin']( Main.vueMixin );

let Augm = {}

Augm.onReady = () => {
  const app = new Vue( { router: Router, render: h => h(Home.Dash) } );
  app.$mount('augm'); }

Augm.start = () => {
  Main.begin(Augm.onReady); }

export default Augm;