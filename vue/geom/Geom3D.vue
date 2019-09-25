

<script type="module">
  
  import GeomND  from './GeomND.vue'
  import Lines   from '../../pub/gan/3D/Lines.js';
  import Grids   from '../../pub/gan/3D/Grids.js';
  import Isomet  from '../../pub/gan/3D/Isomet.js';
  import Play    from '../../pub/gan/3D/Play.js';
  import Isohed  from '../../pub/gan/3D/Isohed.js';
  import Objects from '../../pub/gan/3D/Objects.js';
  import Torus   from '../../pub/gan/3D/Torus.js';

  export default {

    extends: GeomND,

    data() {
      return { route:'Geom3D', pageKey:'Grids', pages:{
        Lines:   { title:'Lines',   key:'Lines',   obj:Lines,   created:false },
        Grids:   { title:'Grids',   key:'Grids',   obj:Grids,   created:false },
        Isomet:  { title:'Isomet',  key:'Isomet',  obj:Isomet,  created:false },
        Play:    { title:'Play',    key:'Play',    obj:Play,    created:false },
        Isohed:  { title:'Isohed',  key:'Isohed',  obj:Isohed,  created:false },
        Objects: { title:'Objects', key:'Objects', obj:Objects, created:false },
        Torus:   { title:'Torus',   key:'Torus',   obj:Torus,   created:false }
      } } },
    
    }

</script>
