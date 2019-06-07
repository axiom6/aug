
<script type="module">

  import GeomND  from './GeomND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Graph   from '../../pub/gan/2D/Graph.js';
  import Basics  from '../../pub/gan/2D/Basics.js';

  export default {

    extends: GeomND,

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom2D', key:'Graph', pages:{
        Graph:  { title:'Graph',  key:'Graph',  obj:Graph,  created:false },
        Basics: { title:'Basics', key:'Basics', obj:Basics, created:false }
    } } },
    
  }

</script>

