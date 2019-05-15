


<script type="module">
  
  import GeomND  from './GeomND.vue'
  import Dabs    from '../elem/Dabs.vue';
  import Lines   from '../../src/gan/3D/Lines.js';
  import Grids   from '../../src/gan/3D/Grids.js';
  import Isomet  from '../../src/gan/3D/Isomet.js';
  import Play    from '../../src/gan/3D/Play.js';
  import Isohed  from '../../src/gan/3D/Isohed.js';
  import Objects from '../../src/gan/3D/Objects.js';
  import Torus   from '../../src/gan/3D/Torus.js';

  export default {

    extends: GeomND,
    
    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom3D', key:'Grids', pages:{
        Lines:   { title:'Lines',   key:'Lines',   klass:Lines,   created:false },
        Grids:   { title:'Grids',   key:'Grids',   klass:Grids,   created:false },
        Isomet:  { title:'Isomet',  key:'Isomet',  klass:Isomet,  created:false },
        Play:    { title:'Play',    key:'Play',    klass:Play,    created:false },
        Isohed:  { title:'Isohed',  key:'Isohed',  klass:Isohed,  created:false },
        Objects: { title:'Objects', key:'Objects', klass:Objects, created:false },
        Torus:   { title:'Torus',   key:'Torus',   klass:Torus,   created:false }
      } } },
    
    }

</script>
