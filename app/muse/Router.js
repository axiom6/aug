
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
  <div>
    <router-view name="InfoPrac"></router-view>
    <router-view name="InfoConn"></router-view>
  </div>` }
const Know = { template:'<div></div>' }
const Wise = { template:'<div></div>' }

export default new Router( { // Static Import for quich dev cycles
  routes:[                   // Not really using props
    { path:'/',      name:'Home',     components:{ Home:Dash.Home } },
    { path: '/info', name:'Info',     components:{ Info:Info }, children: [
      { path:'prac', name:'InfoPrac', components:{ InfoPrac:Dash.Prac }, props:{ comp:'Info' } },
      { path:'conn', name:'InfoConn', components:{ InfoConn:Dash.Conn }, props:{ comp:'Info' } } ] },
    { path: '/know', name:'Know',     components:{ Know:Know }, children: [
      { path:'prac', name:'KnowPrac', components:{ KnowPrac:Dash.Prac }, props:{ comp:'Know' } },
      { path:'conn', name:'KnowConn', components:{ KnowConn:Dash.Conn }, props:{ comp:'Know' } } ] },
    { path: '/wise', name:'Wise',     components:{ Wise:Wise }, children: [
      { path:'prac', name:'WisePrac', components:{ WisePrac:Dash.Prac }, props:{ comp:'Wise' } },
      { path:'conn', name:'WiseConn', components:{ WiseConn:Dash.Conn }, props:{ comp:'Wise' } } ] },
    { path:'/cube',  name:'Cube',     components:{ Cube:lazyLoading('muse/Cube') } },
    { path:'/wood',  name:'Wood',     components:{ Wood:animLoading('wood/Wood') } }
    ] } )


