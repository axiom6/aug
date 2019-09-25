
<script type="module">

  import MathND from './MathND.vue';
  import Differ from '../../pub/math/doc/Differ.js';
  import Solves from '../../pub/math/doc/Solves.js';

  let MathEQ = {

    extends: MathND,

    data() {
      return { route:'MathEQ', pageKey:'Differ', exps:{}, pages:{
          Differ: { title:'Differ', key:'Differ', create:Differ, obj:null },
          Solves: { title:'Solves', key:'Solves', create:Solves, obj:null }
        } } }
  }
  
  export default MathEQ;

</script>

