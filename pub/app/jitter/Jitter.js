
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Home   from '../../vue/Jitter/Home.js';
import Router from './Router.js'
import Mixin  from '../../base/vue/Mixin.js'

let mixin = new Mixin( Main, ['Home','Flavor','Roast','Brew','Drink','Body'] )

Vue['config'].productionTip = false;
Vue['mixin']( mixin.mixin() );

let Jitter = {}

Jitter.onReady = () => {
  const app = new Vue( { router: Router, render: h => h(Home.Dash) } );
  app.$mount('j-jitter'); }

Jitter.start = () => {
  Main.begin(Jitter.onReady); }

export default Jitter;