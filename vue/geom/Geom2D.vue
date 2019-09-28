
<script type="module">

  import GeomND  from './GeomND.vue';
  import Graph   from '../../pub/gan/2D/Graph.js';
  import Basics  from '../../pub/gan/2D/Basics.js';

  export default {

    extends: GeomND,

    data() {
      return { route:'Geom2D', pageKey:'Graph', pages:{
        Graph:  { title:'Graph',  key:'Graph',  obj:Graph,  created:false, show:false },
        Basics: { title:'Basics', key:'Basics', obj:Basics, created:false, show:false }
    } } },
    
  }

</script>

