
import  Vue     from '../../lib/vue/vue.esm.browser.js';
import  Home    from './Home.js';
import  Router  from '../../lib/vue/vue-router.esm.js';
Vue.use(Router);

let lazy = (name) => () => {
  return import( `../../${name}.js` ); }

export default new Router( {
  routes:[
    { path: '/',       name:'Home',     components:{ Home:     Home } },
    { path: '/math',   name:'Math',     components:{ Math:     Home.Math }, children: [
      { path:'ML',     name:'MathML',   components:{ MathML:   lazy( 'vue/math/MathML') } },
      { path:'EQ',     name:'MathEQ',   components:{ MathEQ:   lazy( 'vue/math/MathEQ') } } ] },
    { path: '/geom',   name:'Geom',     components:{ Geom:     Home.Geom }, children: [
      { path:'2D',     name:'Geom2D',   components:{ Geom2D:   lazy( 'vue/geom/Geom2D') } },
      { path:'3D',     name:'Geom3D',   components:{ Geom3D:   lazy( 'vue/geom/Geom3D') } },
      { path:'4D',     name:'Geom4D',   components:{ Geom4D:   lazy( 'vue/geom/Geom4D') } } ] },
    { path: '/data',   name:'Data',     components:{ Geom:     Home.Data }, children: [
      { path:'/table', name:'Table',    components:{ Table:    Home.Data.Table }, children: [
        { path:'table1', name:'Table1', components:{ Table1:   lazy( 'vue/data/Table1') } },
        { path:'table2', name:'Table2', components:{ Table2:   lazy( 'vue/data/Table2') } } ] },
      { path:'/pivot', name:'Pivot',    components:{ Pivot:    Home.Data.Pivot }, children: [
        { path:'pivot1', name:'Pivot1', components:{ Pivot1:   lazy( 'vue/data/Pivot1') } },
        { path:'pivot1', name:'Pivot2', components:{ Pivot2:   lazy( 'vue/data/Pivot2') } } ] } ] },
    { path: '/draw',  name:'Draw',      components:{ Draw:     lazy( 'vue/comp/Draw') } },
    { path: '/note',  name:'Note',      components:{ Note:     Home.Note }, children: [
      { path:'stand', name:'NoteStand', components:{ NoteStand:lazy('vue/note/StandVue' ) } },
      { path:'embed', name:'NoteEmbed', components:{ NoteEmbed:lazy('vue/note/EmbedVue' ) } },
      { path:'maths', name:'NoteMaths', components:{ NoteMaths:lazy('vue/note/MathsVue' ) } },
      { path:'ganja', name:'NoteGanja', components:{ NoteGanja:lazy('vue/note/GanjaVue' ) } } ] },
    { path: '/wood',  name:'Wood',      components:{ Wood:     lazy('vue/comp/Wood'     ) } }
    ] } )
