

<script type="module">

  import GeomND  from './GeomND.vue';
  import Planes  from '../../pub/gan/4D/Planes.js';
  import Sphere  from '../../pub/gan/4D/Sphere.js';

  export default {

    extends: GeomND,

    data() {
      return { route:'Geom4D', pageKey:'Sphere', pages:{
          Planes:  { title:'Planes',  key:'Planes',  obj:Planes, created:false, show:false },
          Sphere:  { title:'Sphere',  key:'Sphere',  obj:Sphere, created:false, show:false }
        } } },

  }

</script>