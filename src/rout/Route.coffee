
import { createApp }                      from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import   Link                             from '/src/rout/Link.vue'

class Route

  Home = { template:"<div>Home</div>" }
  Info = { template:"<div>Info</div>" }
  Know = { template:"<div>Know</div>" }
  Wise = { template:"<div>Wise</div>" }

  Route.routes = [
    { path:'/',     name:'Home', component:Home },
    { path:'/Info', name:'Info', component:Info },
    { path:'/Know', name:'Know', component:Know },
    { path:'/Wise', name:'Wise', component:Wise } ]

  Route.router = createRouter({
    history: createWebHistory(),
    routes: Route.routes });

  Route.start = () ->
    app = createApp(Link)
    app.use(Route.router)
    app.mount('#app')

export default Route