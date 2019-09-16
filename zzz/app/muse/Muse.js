
import Vue    from '../../pub/lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Home   from './Home.js';
import Router from './Router.js'

Vue['config'].productionTip = false;
Vue['mixin']( Main.vueMixin );

let Muse = {}

Muse.onReady = () => {
    const app = new Vue( { router: Router, render: h => h(Home.Dash) } );
    app.$mount('muse'); }

Muse.start = () => {
    Main.begin(Muse.onReady); }

export default Muse;