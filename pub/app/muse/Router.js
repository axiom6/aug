
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Home    from './Home.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazy = (name) => () => {
  return import( `../../${name}.js` ); }

export default new Router( {
  routes:[
    { path: '/',      name:'Home',      components:{ Home:     Home } },
    { path: '/prin',  name:'Prin',      components:{ Prin:     Home.Prin }, children: [
      { path:'prac',  name:'PrinPrac',  components:{ PrinPrac: lazy( 'vue/prac/Prac') } },
      { path:'conn',  name:'PrinConn',  components:{ PrinConn: lazy( 'vue/prac/Conn') } } ] },
    { path: '/info',  name:'Info',      components:{ Info:     Home.Info }, children: [
      { path:'page',  name:'InfoPage',  components:{ InfoPage: lazy( 'vue/page/Page') } },
      { path:'prac',  name:'InfoPrac',  components:{ InfoPrac: lazy( 'vue/prac/Prac') } },
      { path:'konn',  name:'InfoKonn',  components:{ InfoKonn: lazy( 'vue/prac/Conn') } },
      { path:'enli',  name:'InfoEnli',  components:{ InfoEnli: lazy( 'vue/prac/Enli') } },
      { path:'data',  name:'InfoData',  components:{ InfoData: lazy( 'vue/prac/Data') } } ] },
    { path: '/know',  name:'Know',      components:{ Know:     Home.Know }, children: [
      { path:'page',  name:'KnowPage',  components:{ KnowPage: lazy( 'vue/page/Page') } },
      { path:'prac',  name:'KnowPrac',  components:{ KnowPrac: lazy( 'vue/prac/Prac') } },
      { path:'konn',  name:'KnowKonn',  components:{ KnowKonn: lazy( 'vue/prac/Conn') } },
      { path:'enli',  name:'KnowEnli',  components:{ KnowEnli: lazy( 'vue/prac/Enli') } },
      { path:'data',  name:'KnowData',  components:{ KnowData: lazy( 'vue/prac/Data') } } ] },
    { path: '/wise',  name:'Wise',      components:{ Wise:     Home.Wise }, children: [
      { path:'page',  name:'WisePage',  components:{ WisePage: lazy( 'vue/page/Page') } },
      { path:'prac',  name:'WisePrac',  components:{ WisePrac: lazy( 'vue/prac/Prac') } },
      { path:'konn',  name:'WiseKonn',  components:{ WiseKonn: lazy( 'vue/prac/Conn') } },
      { path:'enli',  name:'WiseEnli',  components:{ WiseEnli: lazy( 'vue/prac/Enli') } },
      { path:'data',  name:'WiseData',  components:{ WiseData: lazy( 'vue/prac/Data') } } ] },
    { path: '/cube',  name:'Cube',      components:{ Cube:     lazy( 'vue/prac/Cube') } }
    ] } )
