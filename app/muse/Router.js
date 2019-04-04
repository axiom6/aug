
import  Vue         from '../../lib/vue/vue.esm.browser.js';
import  Router      from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazyLoading = (name) => () => {
  console.log( 'Router', name )
  return import( `../../vue/${name}.js` ); }

if( lazyLoading===false){}

export default new Router( {
  routes:[
    { path:'/info', name:'Info', component:lazyLoading('muse/Info')  },
    { path:'/know', name:'Know', component:lazyLoading('muse/Know')  },
    { path:'/wise', name:'Wise', component:lazyLoading('muse/Wise')  },
    ] } )

/*
  const Parent = {
    template:'<router-view></router-view>' };
 */

