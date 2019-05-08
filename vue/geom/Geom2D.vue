
<script type="module">

  import GeomND  from './GeomND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Basics  from '../../src/ganja/2D/Basics.js';

  export default {

    extends: GeomND,

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom2D', key:'Basics', pages:{
        Basics:  { title:'Basics', key:'Basics', klass:Basics, created:false }
    } } },
    
  }

</script>

