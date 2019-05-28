


<template>
  <div class="comp">
    <template v-for="exp in exps">
      <div :class="exp.klass" v-html="exp.mathML"></div>
    </template>
  </div>
</template>

<script type="module">

  import MathND  from './MathND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Basics  from '../../pub/math/doc/Basics.js';

  let MathML = {

    extends: MathND,

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'MathML', key:'MathML', exps:{}, pages:{
          Basics: { title:'Basics', key:'Basics', klass:Basics, created:false }
        } } },
    
    mounted: function () {
        this.basics = new  Basics();
        this.exps   = this.basics.doExps(); }

  }
  
  export default MathML;

</script>

<style lang="less">
  
  .grid9x3() { display:grid; grid-template-columns:33% 33% 34%; grid-template-rows:11% 11% 11% 11% 11% 11% 11% 11% 12%;
    grid-template-areas:
      "r1c1 r1c2 r1c3" "r2c1 r2c2 r2c3" "r3c1 r3c2 r3c3"
      "r4c1 r4c2 r4c3" "r5c1 r5c2 r5c3" "r6c1 r6c2 r6c3"
      "r7c1 r7c2 r7c3" "r8c1 r8c2 r8c3" "r9c1 r9c2 r9c3"; }

  .c( @rc ) { display:grid; grid-area:@rc; justify-self:stretch; align-self:stretch;
    justify-items:center; align-items:center; background-color:black; color:wheat; border:solid thin wheat; }

  .comp { background-color:black; position:absolute; left:0; top:5%; right:0; bottom:0; font-size:2.5em;
    .grid9x3(); justify-items:center; align-items:center;

    .r1c1{.c(r1c1)}; .r1c2{.c(r1c2)}; .r1c3{.c(r1c3)};
    .r2c1{.c(r2c1)}; .r2c2{.c(r2c2)}; .r2c3{.c(r2c3)};
    .r3c1{.c(r3c1)}; .r3c2{.c(r3c2)}; .r3c3{.c(r3c3)};
    .r4c1{.c(r4c1)}; .r4c2{.c(r4c2)}; .r4c3{.c(r4c3)};
    .r5c1{.c(r5c1)}; .r5c2{.c(r5c2)}; .r5c3{.c(r5c3)};
    .r6c1{.c(r6c1)}; .r6c2{.c(r6c2)}; .r6c3{.c(r6c3)};
    .r7c1{.c(r7c1)}; .r7c2{.c(r7c2)}; .r7c3{.c(r7c3)};
    .r8c1{.c(r8c1)}; .r8c2{.c(r8c2)}; .r8c3{.c(r8c3)};
    .r9c1{.c(r9c1)}; .r9c2{.c(r9c2)}; .r9c3{.c(r9c3)};
  }
  
</style>