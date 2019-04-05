
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Dash   from './Dash.js';
import Router from './Router.js'

Vue['config'].productionTip = false;
Vue['mixin']( Main.vueMixin );

let Muse = {}

Muse.onReady = () => {
    const app = new Vue( { router: Router, render: h => h(Dash),
      mounted: function () {
        /* console.log('Dash.vue', 'mounted'); */ }
    } );
    app.$mount('dash'); }

Muse.start = () => {
    Main.begin(Muse.onReady); }

export default Muse;