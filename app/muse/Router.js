
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Dash    from './Dash.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazyLoading = (name) => () => {
  return import( `../../vue/${name}.js` ); }

if( lazyLoading===false){}

export default new Router( { // Static Import for quich dev cycles
  routes:[
    { path:'/',     name:'Home', components:{ Home:Dash.Home } },
    { path:'/cube', name:'Cube', components:{ Cube:lazyLoading('muse/Cube') } },
    { path:'/info', name:'Info', components:{ Info:Dash.Info } },
    { path:'/know', name:'Know', components:{ Know:Dash.Know } },
    { path:'/wise', name:'Wise', components:{ Wise:Dash.Wise } },
    { path:'/wood', name:'Wood', components:{ Wood:Dash.Wood } }
    ] } )

/*
  const Parent = {
    template:'<router-view></router-view>' };
 */

