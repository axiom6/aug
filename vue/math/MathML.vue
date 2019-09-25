
<script type="module">

  import MathND  from './MathND.vue';
  import Basics  from '../../pub/math/doc/Basics.js';

  let MathML = {

    extends: MathND,

    data() {
      return { route:'MathML', pageKey:'Basics', exps:{}, pages:{
          Basics: { title:'Basics', key:'Basics', create:Basics, obj:null }
        } } }
    
  }
  
  export default MathML;

</script>
