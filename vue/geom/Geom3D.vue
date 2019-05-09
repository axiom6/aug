


<script type="module">
  
  import GeomND  from './GeomND.vue'
  import Dabs    from '../elem/Dabs.vue';
  import Lines   from '../../src/ganja/3D/Lines.js';
  import Grids   from '../../src/ganja/3D/Grids.js';
  import Isomet  from '../../src/ganja/3D/Isomet.js';
  import Play    from '../../src/ganja/3D/Play.js';
  import Isohed  from '../../src/ganja/3D/Isohed.js';

  export default {

    extends: GeomND,
    
    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom3D', key:'Grids', pages:{
        Lines:   { title:'Lines',  key:'Lines',  klass:Lines,  created:false },
        Grids:   { title:'Grids',  key:'Grids',  klass:Grids,  created:false },
        Isomet:  { title:'Isomet', key:'Isomet', klass:Isomet, created:false },
        Play:    { title:'Play',   key:'Play',   klass:Play,   created:false },
        Isohed:  { title:'Isohed', key:'Isohed', klass:Isohed, created:false }
      } } },
    
    }

</script>
