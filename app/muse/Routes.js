
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

const Info = { template:`
  <div class="ikw" id="Info">
    <router-view name="InfoPrac"></router-view>
    <router-view name="InfoConn"></router-view>
    <router-view name="InfoEnli"></router-view>
    <router-view name="InfoData"></router-view>
  </div>` }

const Know = { template:`
  <div class="ikw" id="Know">
    <router-view name="KnowPrac"></router-view>
    <router-view name="KnowConn"></router-view>
    <router-view name="KnowEnli"></router-view>
    <router-view name="KnowData"></router-view>
  </div>` }

const Wise = { template:`
  <div class="ikw" id="Wise">
    <router-view name="WisePrac"></router-view>
    <router-view name="WiseConn"></router-view>
    <router-view name="WiseEnli"></router-view>
    <router-view name="WiseData"></router-view>
  </div>` }

const Enli = { template:`<h1 class="enli">Enlight</h1>` }
const Data = { template:`<h1 class="data">Data Science</h1>` }

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


