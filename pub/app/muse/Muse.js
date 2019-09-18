
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Home   from './Home.js';
import Router from './Router.js'
import Mixin  from '../../base/vue/Mixin.js'

let mixin = new Mixin( Main, ['Home','Prin','Comp','Prac','Disp','Cube'] )

Vue['config'].productionTip = false;
Vue['mixin']( mixin.mixin() );

let Muse = {}

Muse.onReady = () => {
    const app = new Vue( { router:Router, render: h => h(Home.Dash) } );
    app.$mount('muse'); }

Muse.start = () => {
    Main.begin(Muse.onReady); }

export default Muse;