
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
  routes:[                   // Not really using props
    { path:'/',         name:'Home',     components:{ Home:Dash.Home } },
    { path:'/info',     name:'Info',     components:{ Info:Dash.Prac } },
    { path:'/know',     name:'Know',     components:{ Know:Dash.Prac } },
    { path:'/wise',     name:'Wise',     components:{ Wise:Dash.Prac } },
    { path:'/infoconn', name:'InfoConn', components:{ InfoConn:Dash.Conn } },
    { path:'/knowconn', name:'KnowConn', components:{ KnowConn:Dash.Conn } },
    { path:'/wiseconn', name:'WiseConn', components:{ WiseConn:Dash.Conn } },
    { path:'/cube',     name:'Cube',     components:{ Cube:lazyLoading('muse/Cube')   } },
    { path:'/wood',     name:'Wood',     components:{ Wood:animLoading('wood/Wood')   } }
    ] } )


