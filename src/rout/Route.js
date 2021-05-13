var Route;

import {
  createApp
} from 'vue';

import {
  createRouter,
  createWebHistory
} from 'vue-router';

Route = (function() {
  class Route {
    static start() {
      var app;
      app = createApp(Route.Home);
      app.use(Route.router);
      return app.mount('#app');
    }

  };

  Route.Home = {
    template: '<div>Home</div>'
  };

  Route.Info = {
    template: '<div>Info</div>'
  };

  Route.Know = {
    template: '<div>Know</div>'
  };

  Route.Wise = {
    template: '<div>Wise</div>'
  };

  Route.routes = [
    {
      path: '/',
      name: 'Home',
      component: Route.Home
    },
    {
      path: '/Info',
      name: 'Info',
      component: Route.Info
    },
    {
      path: '/Know',
      name: 'Know',
      component: Route.Know
    },
    {
      path: '/Wise',
      name: 'Wise',
      component: Route.Wise
    }
  ];

  Route.router = createRouter({
    history: createWebHistory(),
    routes: Route.routes
  });

  return Route;

}).call(this);

export default Route;
