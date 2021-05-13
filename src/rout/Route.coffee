
import { createApp }                      from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

class Route

  Route.Home = { template:'<div>Home</div>' }
  Route.Info = { template:'<div>Info</div>' }
  Route.Know = { template:'<div>Know</div>' }
  Route.Wise = { template:'<div>Wise</div>' }

  Route.routes = [
    { path:'/',     name:'Home', component:Route.Home },
    { path:'/Info', name:'Info', component:Route.Info },
    { path:'/Know', name:'Know', component:Route.Know },
    { path:'/Wise', name:'Wise', component:Route.Wise } ]

  Route.router = createRouter({
    history: createWebHistory(),
    routes: Route.routes });

  Route.start = () ->
    app = createApp(Route.Home)
    app.use(Route.router)
    app.mount('#app')

export default Route