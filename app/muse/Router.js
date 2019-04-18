
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Dash    from './Dash.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazyLoading = (name) => () => {
  return import( `../../vue/${name}.js` ); }

let animLoading = (name) => () => {
  return import( `../../ani/${name}.js` ); }


export default new Router( { // Static Import for quich dev cycles
  routes:[                   // Not really using props
    { path: '/',     name:'Home',     components:{ Home:    Dash.Home } },
    { path: '/info', name:'Info',     components:{ Info:    Dash.Info }, redirect:{ name:"InfoPrac"}, children: [
      { path:'prac', name:'InfoPrac', components:{ InfoPrac:Dash.Prac } },
      { path:'conn', name:'InfoConn', components:{ InfoConn:Dash.Conn } },
      { path:'enli', name:'InfoEnli', components:{ InfoEnli:Dash.Enli } },
      { path:'data', name:'InfoData', components:{ InfoData:Dash.Data } } ] },
    { path: '/know', name:'Know',     components:{ Know:    Dash.Know }, redirect:{ name:"KnowPrac"}, children: [
      { path:'prac', name:'KnowPrac', components:{ KnowPrac:Dash.Prac } },
      { path:'conn', name:'KnowConn', components:{ KnowConn:Dash.Conn } },
      { path:'enli', name:'KnowEnli', components:{ KnowEnli:Dash.Enli } },
      { path:'data', name:'KnowData', components:{ KnowData:Dash.Data } } ] },
    { path: '/wise', name:'Wise',     components:{ Wise:    Dash.Wise },redirect:{ name:"WisePrac"}, children: [
      { path:'prac', name:'WisePrac', components:{ WisePrac:Dash.Prac } },
      { path:'conn', name:'WiseConn', components:{ WiseConn:Dash.Conn } },
      { path:'enli', name:'WiseEnli', components:{ WiseEnli:Dash.Enli } },
      { path:'data', name:'WiseData', components:{ WiseData:Dash.Data } } ] },
    { path:'/cube',  name:'Cube',     components:{ Cube:lazyLoading('muse/Cube') } },
    { path:'/wood',  name:'Wood',     components:{ Wood:animLoading('wood/Wood') } }
    ] } )
