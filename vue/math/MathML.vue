
<script type="module">

  import MathND  from './MathND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Basics  from '../../pub/math/doc/Basics.js';

  let MathML = {

    extends: MathND,

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'MathML', key:'Basics', exps:{}, pages:{
          Basics: { title:'Basics', key:'Basics', create:Basics, obj:null }
        } } },
    
  }
  
  export default MathML;

</script>
