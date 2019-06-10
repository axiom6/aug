
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Home    from './Home.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazy = (name) => () => {
  return import( `../../${name}.js` ); }

export default new Router( {
  routes:[
    { path: '/',      name:'Home',      components:{ Home:     Home } },
    { path: '/info',  name:'Info',      components:{ Info:     Home.Info }, children: [
      { path:'prac',  name:'InfoPrac',  components:{ InfoPrac: lazy( 'vue/page/Prac') } },
      { path:'conn',  name:'InfoConn',  components:{ InfoConn: lazy( 'vue/page/Conn') } },
      { path:'enli',  name:'InfoEnli',  components:{ InfoEnli: lazy( 'vue/page/Enli') } },
      { path:'data',  name:'InfoData',  components:{ InfoData: lazy( 'vue/page/Data') } } ] },
    { path: '/know',  name:'Know',      components:{ Know:     Home.Know }, children: [
      { path:'prac',  name:'KnowPrac',  components:{ KnowPrac: lazy( 'vue/page/Prac') } },
      { path:'conn',  name:'KnowConn',  components:{ KnowConn: lazy( 'vue/page/Conn') } },
      { path:'enli',  name:'KnowEnli',  components:{ KnowEnli: lazy( 'vue/page/Enli') } },
      { path:'data',  name:'KnowData',  components:{ KnowData: lazy( 'vue/page/Data') } } ] },
    { path: '/wise',  name:'Wise',      components:{ Wise:     Home.Wise }, children: [
      { path:'prac',  name:'WisePrac',  components:{ WisePrac: lazy( 'vue/page/Prac') } },
      { path:'conn',  name:'WiseConn',  components:{ WiseConn: lazy( 'vue/page/Conn') } },
      { path:'enli',  name:'WiseEnli',  components:{ WiseEnli: lazy( 'vue/page/Enli') } },
      { path:'data',  name:'WiseData',  components:{ WiseData: lazy( 'vue/page/Data') } } ] },
    { path: '/cube',  name:'Cube',      components:{ Cube:     lazy('vue/comp/Cube'     ) } }
    ] } )
