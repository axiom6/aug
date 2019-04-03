
import Vue          from '../../libs/vue/vue.esm.browser.js'
import Vuex         from '../../libs/vue/vuex.esm.js'
import app          from './app.js'
import * as getters from './getters.js'

Vue.config.productionTip = false;
Vuex.process  = { env:{ NODE_ENV:'production' } };
Vue.use( Vuex );
let Store = new Vuex.Store( { strict:true, getters, modules:{app}, state:{}, mutations:{} } );
Vue.use( Store );
export { Store };

