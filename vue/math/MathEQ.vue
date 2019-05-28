

<script type="module">

  import MathND  from './MathND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Solves  from '../../pub/math/doc/Solves.js';

  export default {

    extends: MathND,

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'MathEQ', key:'MathEQ', pages:{
          Solves: { title:'Solves', key:'Solves', klass:Solves, created:false }
        } } },

  }

</script>