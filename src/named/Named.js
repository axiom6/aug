
let Named = {

  import { createApp }                      from 'vue'
  import { createRouter, createWebHistory } from 'vue-router'

    const Home = {template: '<div>This is Home</div>'}
    const Foo = {template: '<div>This is Foo</div>'}
    const Bar = {template: '<div>This is Bar {{ $route.params.id }}</div>'}

    let routes = [
      {path: '/', name: 'home', component: Home},
      {path: '/foo', name: 'foo', component: Foo},
      {path: '/bar/:id', name: 'bar', component: Bar} ]

    let router = createRouter( {
      history: createWebHistory(),
      base: __dirname,
      routes: routes } );

    let start = () => {
      let app = createApp(Link)
      app.use(router)
      app.mount('#app') }

    new Vue({
      router,
      template: `
      <div id="app">
        <h1>Named Routes</h1>
        <p>Current route name: {{ $route.name }}</p>
        <ul>
          <li><router-link :to="{ name: 'home' }">home</router-link></li>
          <li><router-link :to="{ name: 'foo' }">foo</router-link></li>
          <li><router-link :to="{ name: 'bar', params: { id: 123 }}">bar</router-link></li>
        </ul>
        <router-view class="view"></router-view>
      </div>
    `
    }).$mount('#app')
  }
}
export default Named