
import  Vue         from '../../lib/vue/vue.esm.browser.js';

import  Router      from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazyLoading = (name) => () => {
  console.log( 'Router', name )
  return import( `../../vue/${name}.vue` ); }

if( lazyLoading===false){}

import Dash   from './Dash.js';

export default new Router( {
  routes:[
    { path:'/info', name:'Info', component:Dash.Info },
    { path:'/know', name:'Know', component:Dash.Know },
    { path:'/wise', name:'Wise', component:Dash.Wise }
    ] } )

/*
  const Parent = {
    template:'<router-view></router-view>' };

  import Info from '../../vue/muse/Info.vue';
  import Know from '../../vue/muse/Know.vue';
  import Wise from '../../vue/muse/Wise.vue';

  { path:'/info', name:'Info', component:lazyLoading('muse/Info') },
  { path:'/know', name:'Know', component:lazyLoading('muse/Know') },
  { path:'/wise', name:'Wise', component:lazyLoading('muse/Wise') }
 */

