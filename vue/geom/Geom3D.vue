

<script type="module">
  
  import GeomND  from './GeomND.vue'
  import Lines   from '../../pub/geom/3D/Lines.js';
  import Grids   from '../../pub/geom/3D/Grids.js';
  import Isomet  from '../../pub/geom/3D/Isomet.js';
  import Play    from '../../pub/geom/3D/Play.js';
  import Isohed  from '../../pub/geom/3D/Isohed.js';
  import Objects from '../../pub/geom/3D/Objects.js';
  import Torus   from '../../pub/geom/3D/Torus.js';

  export default {

    extends: GeomND,

    data() {
      return { route:'Geom3D', pageKey:'Grids', pages:{
        Lines:   { title:'Lines',   key:'Lines',   obj:Lines,   created:false, show:false },
        Grids:   { title:'Grids',   key:'Grids',   obj:Grids,   created:false, show:false },
        Isomet:  { title:'Isomet',  key:'Isomet',  obj:Isomet,  created:false, show:false },
        Play:    { title:'Play',    key:'Play',    obj:Play,    created:false, show:false },
        Isohed:  { title:'Isohed',  key:'Isohed',  obj:Isohed,  created:false, show:false },
        Objects: { title:'Objects', key:'Objects', obj:Objects, created:false, show:false },
        Torus:   { title:'Torus',   key:'Torus',   obj:Torus,   created:false, show:false }
      } } },
    
    }

</script>
