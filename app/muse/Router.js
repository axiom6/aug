
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Dash    from './Dash.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazyLoading = (name) => () => {
  //console.log( 'Router', name )
  return import( `../../vue/${name}.js` ); }

if( lazyLoading===false){}

export default new Router( { // Static Import for quich dev cycles
  routes:[
    { path:'/info', name:'Info', components:{ Info:Dash.Info } },
    { path:'/know', name:'Know', components:{ Know:Dash.Know } },
    { path:'/wise', name:'Wise', components:{ Wise:Dash.Wise } }
    ] } )

/*
  const Parent = {
    template:'<router-view></router-view>' };


export default new Router( { // Dynamic Importing
  routes:[
    { path:'/info', name:'Info', components:{ Info:lazyLoading('muse/Info')  } },
    { path:'/know', name:'Know', components:{ Know:lazyLoading('muse/Know')  } },
    { path:'/wise', name:'Wise', components:{ Wise:lazyLoading('muse/Wise')  } }
    ] } )
 */

