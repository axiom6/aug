
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Home   from './Home.js';
import Router from './Router.js'
import Mixin  from '../../base/vue/Mixin.js'

let mixin = new Mixin( Main, ['Home','Math','Geom','Data','Draw','Note','Wood' ] )

Vue['config'].productionTip = false;
Vue['mixin']( mixin.mixin() );

let Augm = {}

Augm.onReady = () => {
  const app = new Vue( { router: Router, render: h => h(Home.Dash) } );
  app.$mount('augm'); }

Augm.start = () => {
  Main.begin(Augm.onReady); }

export default Augm;