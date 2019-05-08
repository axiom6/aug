

<script type="module">

  import GeomND  from './GeomND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Planes  from '../../src/ganja/4D/Planes.js';
  import Sphere  from '../../src/ganja/4D/Sphere.js';
//import Conform from '../../src/ganja/4D/Conform.js';

  export default {

    extends: GeomND,
    
    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom4D', key:'Sphere', pages:{
          Planes:  { title:'Planes',  key:'Planes',  klass:Planes,  created:false },
          Sphere:  { title:'Sphere',  key:'Sphere',  klass:Sphere,  created:false }
       // Conform: { title:'Conform', key:'Conform', klass:Conform, created:false }
        } } },

  }

</script>