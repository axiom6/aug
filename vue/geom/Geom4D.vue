

<script type="module">

  import GeomND  from './GeomND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Planes  from '../../pub/gan/4D/Planes.js';
  import Sphere  from '../../pub/gan/4D/Sphere.js';

  export default {

    extends: GeomND,
    
    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Geom4D', key:'Sphere', pages:{
          Planes:  { title:'Planes',  key:'Planes',  obj:Planes, created:false },
          Sphere:  { title:'Sphere',  key:'Sphere',  obj:Sphere, created:false }
        } } },

  }

</script>