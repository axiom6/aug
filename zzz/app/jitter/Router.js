
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Home    from 'Home.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazy = (name) => () => {
  return import( `../../${name}.js` ); }

export default new Router( {
  routes:[
    { path: '/',       name:'Home',   components:{ Home:   Home } },
    { path: '/flavor', name:'Flavor', components:{ Flavor: lazy('vue/jitter/Flavor' ) } },
    { path: '/roast',  name:'Roast',  components:{ Roast:  lazy('vue/jitter/Roast'  ) } },
    { path: '/brew',   name:'Brew',   components:{ Brew:   lazy('vue/jitter/Brew'   ) } },
    { path: '/drink',  name:'Drink',  components:{ Brew:   lazy('vue/jitter/Drink'  ) } },
    { path: '/body',   name:'Body',   components:{ Body:   lazy('vue/jitter/Body'   ) } },
    { path: '/world',  name:'World',  components:{ World:  lazy('vue/jitter/World'  ) } },
    { path: '/region', name:'Region', components:{ Region: lazy('vue/jitter/Region' ) } }
  ] } )
