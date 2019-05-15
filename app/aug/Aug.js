
import Vue    from '../../lib/vue/vue.esm.browser.js';
import Main   from './Main.js';
import Dash   from './Dash.js';
import Router from './Router.js'

Vue['config'].productionTip = false;
Vue['mixin']( Main.vueMixin );

let Aug = {}

Aug.onReady = () => {
    const app = new Vue( { router: Router, render: h => h(Dash),
      mounted: function () {
        /* console.log('Dash.vue', 'mounted'); */ }
    } );
    app.$mount('dash'); }

Aug.start = () => {
    Main.begin(Aug.onReady); }

export default Aug;