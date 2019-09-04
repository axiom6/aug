
import  Vue     from '../../pub/lib/vue/vue.esm.browser.js';
import  Home    from './Home.js';
import  Router  from '../../pub/lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazy = (name) => () => {
  return import( `../../${name}.js` ); }

export default new Router( {
  routes:[
    { path: '/',      name:'Home', components:{ Home: Home      } },
    { path: '/comp',  name:'Comp', components:{ Comp: Home.Comp } },
    { path: '/prac',  name:'Prac', components:{ Comp: Home.Prac } },
    { path: '/disp',  name:'Disp', components:{ Disp: Home.Disp } },
    { path: '/cube',  name:'Cube', components:{ Cube: lazy( 'vue/cube/Cube') } }
    ] } )
