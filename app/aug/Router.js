
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Dash    from '../../pub/vue/dash/Dash.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazy = (name) => () => {
  return import( `../../${name}.js` ); }

export default new Router( {
  routes:[
    { path: '/',      name:'Home',      components:{ Home:     Dash.Home } },
    { path: '/info',  name:'Info',      components:{ Info:     Dash.Info }, redirect:{ name:"InfoPrac"}, children: [
      { path:'prac',  name:'InfoPrac',  components:{ InfoPrac: Dash.Prac } },
      { path:'conn',  name:'InfoConn',  components:{ InfoConn: Dash.Conn } },
      { path:'enli',  name:'InfoEnli',  components:{ InfoEnli: Dash.Enli } },
      { path:'data',  name:'InfoData',  components:{ InfoData: Dash.Data } } ] },
    { path: '/know',  name:'Know',      components:{ Know:     Dash.Know }, redirect:{ name:"KnowPrac"}, children: [
      { path:'prac',  name:'KnowPrac',  components:{ KnowPrac: Dash.Prac } },
      { path:'conn',  name:'KnowConn',  components:{ KnowConn: Dash.Conn } },
      { path:'enli',  name:'KnowEnli',  components:{ KnowEnli: Dash.Enli } },
      { path:'data',  name:'KnowData',  components:{ KnowData: Dash.Data } } ] },
    { path: '/wise',  name:'Wise',      components:{ Wise:     Dash.Wise }, redirect:{ name:"WisePrac"}, children: [
      { path:'prac',  name:'WisePrac',  components:{ WisePrac: Dash.Prac } },
      { path:'conn',  name:'WiseConn',  components:{ WiseConn: Dash.Conn } },
      { path:'enli',  name:'WiseEnli',  components:{ WiseEnli: Dash.Enli } },
      { path:'data',  name:'WiseData',  components:{ WiseData: Dash.Data } } ] },
    { path: '/geom',  name:'Geom',      components:{ Geom:     Dash.Geom }, children: [
      { path:'2D',    name:'Geom2D',    components:{ Geom2D:   Dash.Geom2D } },
      { path:'3D',    name:'Geom3D',    components:{ Geom3D:   Dash.Geom3D } },
      { path:'4D',    name:'Geom4D',    components:{ Geom4D:   Dash.Geom4D } } ] },
    { path: '/draw',  name:'Draw',      components:{ Draw:     Dash.Draw } },
    { path: '/note',  name:'Note',      components:{ Note:     Dash.Note },redirect:{ name:"NoteStand"}, children: [
      { path:'stand', name:'NoteStand', components:{ NoteStand:lazy('pub/vue/note/StandVue' ) } },
      { path:'embed', name:'NoteEmbed', components:{ NoteEmbed:lazy('pub/vue/note/EmbedVue' ) } },
      { path:'maths', name:'NoteMaths', components:{ NoteMaths:lazy('pub/vue/note/MathsVue' ) } },
      { path:'ganja', name:'NoteGanja', components:{ NoteGanja:lazy('pub/vue/note/GanjaVue' ) } } ] },
    { path: '/cube',  name:'Cube',      components:{ Cube:     lazy('pub/vue/comp/Cube'     ) } },
    { path: '/wood',  name:'Wood',      components:{ Wood:     lazy('pub/vue/comp/Wood'     ) } }
    ] } )
