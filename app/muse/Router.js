
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Dash    from './Dash.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazyLoading = (name) => () => {
  return import( `../../vue/${name}.js` ); }

let animLoading = (name) => () => {
  return import( `../../ani/${name}.js` ); }

const Parent = { template:'<router-view></router-view>' };

if( lazyLoading===false && Parent===false ){}

export default new Router( { // Static Import for quich dev cycles
  routes:[
    { path:'/',     name:'Home', components:{ Home:Dash.Home } },
    { path:'/info', name:'Info', components:{ Info:Dash.Base }, props:{ comp:'Info'} }, // Not really using props
    { path:'/know', name:'Know', components:{ Know:Dash.Base }, props:{ comp:'Know'} },
    { path:'/wise', name:'Wise', components:{ Wise:Dash.Base }, props:{ comp:'Wise'} },
    { path:'/conn', name:'Conn', components:{ Conn:Dash.Conn } },
    { path:'/cube', name:'Cube', components:{ Cube:lazyLoading('muse/Cube') } },
    { path:'/wood', name:'Wood', components:{ Wood:animLoading('wood/Wood') } }
    ] } )


