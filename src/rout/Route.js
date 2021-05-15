var Route;

import {
  createApp
} from 'vue';

import {
  createRouter,
  createWebHashHistory
} from 'vue-router';

import Link from '/src/rout/Link.vue';

import Home from '/src/rout/Home.vue';

import Info from '/src/rout/Info.vue';

import Know from '/src/rout/Know.vue';

import Wise from '/src/rout/Wise.vue';

Route = (function() {
  class Route {
    static start() {
      var app;
      app = createApp(Link);
      app.provide('router', Route.router);
      app.use(Route.router);
      return app.mount('#app');
    }

  };

  Route.routes = [
    {
      path: '/',
      name: 'Home',
      components: {
        Home: Home
      }
    },
    {
      path: '/Info',
      name: 'Info',
      components: {
        Info: Info
      }
    },
    {
      path: '/Know',
      name: 'Know',
      components: {
        Know: Know
      }
    },
    {
      path: '/Wise',
      name: 'Wise',
      components: {
        Wise: Wise
      }
    }
  ];

  Route.router = createRouter({
    history: createWebHashHistory(),
    routes: Route.routes
  });

  return Route;

}).call(this);

export default Route;

/*
  Route.routes = [
    { path:'/',     name:'Home', components:{ Home:Home } },
    { path:'/Info', name:'Info', components:{ Info:Info } },
    { path:'/Know', name:'Know', components:{ Know:Know } },
    { path:'/Wise', name:'Wise', components:{ Wise:Wise } } ]

  Home = { template:"<div>Home</div>" }
  Info = { template:"<div>Info</div>" }
  Know = { template:"<div>Know</div>" }
  Wise = { template:"<div>Wise</div>" }
*/
