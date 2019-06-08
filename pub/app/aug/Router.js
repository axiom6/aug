
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Dash    from '../../vue/dash/Dash.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazy = (name) => () => {
  return import( `../../${name}.js` ); }

// redirect:{ name:"NoteStand"},

export default new Router( {
  routes:[
    { path: '/',      name:'Home',      components:{ Home:     Dash.Home } },
    { path: '/info',  name:'Info',      components:{ Info:     Dash.Info }, children: [
      { path:'prac',  name:'InfoPrac',  components:{ InfoPrac: lazy( 'vue/page/Prac') } },
      { path:'conn',  name:'InfoConn',  components:{ InfoConn: lazy( 'vue/page/Conn') } },
      { path:'enli',  name:'InfoEnli',  components:{ InfoEnli: lazy( 'vue/page/Enli') } },
      { path:'data',  name:'InfoData',  components:{ InfoData: lazy( 'vue/page/Data') } } ] },
    { path: '/know',  name:'Know',      components:{ Know:     Dash.Know }, children: [
      { path:'prac',  name:'KnowPrac',  components:{ KnowPrac: lazy( 'vue/page/Prac') } },
      { path:'conn',  name:'KnowConn',  components:{ KnowConn: lazy( 'vue/page/Conn') } },
      { path:'enli',  name:'KnowEnli',  components:{ KnowEnli: lazy( 'vue/page/Enli') } },
      { path:'data',  name:'KnowData',  components:{ KnowData: lazy( 'vue/page/Data') } } ] },
    { path: '/wise',  name:'Wise',      components:{ Wise:     Dash.Wise }, children: [
      { path:'prac',  name:'WisePrac',  components:{ WisePrac: lazy( 'vue/page/Prac') } },
      { path:'conn',  name:'WiseConn',  components:{ WiseConn: lazy( 'vue/page/Conn') } },
      { path:'enli',  name:'WiseEnli',  components:{ WiseEnli: lazy( 'vue/page/Enli') } },
      { path:'data',  name:'WiseData',  components:{ WiseData: lazy( 'vue/page/Data') } } ] },
    { path: '/math',  name:'Math',      components:{ Math:     Dash.Math }, children: [
      { path:'ML',    name:'MathML',    components:{ MathML:   lazy( 'vue/math/MathML') } },
      { path:'EQ',    name:'MathEQ',    components:{ MathEQ:   lazy( 'vue/math/MathEQ') } } ] },
    { path: '/geom',  name:'Geom',      components:{ Geom:     Dash.Geom }, children: [
      { path:'2D',    name:'Geom2D',    components:{ Geom2D:   lazy( 'vue/geom/Geom2D') } },
      { path:'3D',    name:'Geom3D',    components:{ Geom3D:   lazy( 'vue/geom/Geom3D') } },
      { path:'4D',    name:'Geom4D',    components:{ Geom4D:   lazy( 'vue/geom/Geom4D') } } ] },
    { path: '/data',  name:'Data',      components:{ Geom:     Dash.Data }, children: [
      { path:'table', name:'Table',     components:{ Table:    lazy( 'vue/data/Table') } },
      { path:'pivot', name:'Pivot',     components:{ Pivot:    lazy( 'vue/data/Pivot') } } ] },
    { path: '/draw',  name:'Draw',      components:{ Draw:     lazy( 'vue/comp/Draw') } },
    { path: '/note',  name:'Note',      components:{ Note:     Dash.Note }, children: [
      { path:'stand', name:'NoteStand', components:{ NoteStand:lazy('vue/note/StandVue' ) } },
      { path:'embed', name:'NoteEmbed', components:{ NoteEmbed:lazy('vue/note/EmbedVue' ) } },
      { path:'maths', name:'NoteMaths', components:{ NoteMaths:lazy('vue/note/MathsVue' ) } },
      { path:'ganja', name:'NoteGanja', components:{ NoteGanja:lazy('vue/note/GanjaVue' ) } } ] },
    { path: '/cube',  name:'Cube',      components:{ Cube:     lazy('vue/comp/Cube'     ) } },
    { path: '/wood',  name:'Wood',      components:{ Wood:     lazy('vue/comp/Wood'     ) } }
    ] } )
