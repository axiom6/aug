

<template>
  <div>
    <d-dabs comp="Math" :pages="pages" :init="key"></d-dabs>
    <div class="comp">
      <template v-for="exp in exps">
        <div :class="exp.klass" :ref="exp.klass"></div>
      </template>
    </div>
  </div>
</template>

<script type="module">

  import MathND  from './MathND.vue';
  import Dabs    from '../elem/Dabs.vue';
  import Differ  from '../../pub/math/doc/Differ.js';

  let MathEQ = {

    extends: MathND,

    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'MathEQ', key:'MathEQ', exps:{}, pages:{
          Differ: { title:'Differ', key:'Differ', klass:Differ, created:false }
        } } },
    
    methods:{
      mathMLElems: function ( exps ) {
        for( let key in exps ){
          let exp = exps[key];
          let elem = this.$refs[exp.klass][0];
          elem.innerHTML = exp.mathML; } }
      },
    
    mounted: function () {
      this.differ = new  Differ();
      this.exps   = this.differ.doExps();
      this.$nextTick( function() {
        this.mathMLElems( this.exps ); } ) }
  }
  
  export default MathEQ;

</script>

<style lang="less">
  
  .grid8x3() { display:grid; grid-template-columns:33% 33% 34%;
    grid-template-rows:12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5% 12.5%;
    grid-template-areas:
      "r1c1 r1c2 r1c3" "r2c1 r2c2 r2c3" "r3c1 r3c2 r3c3" "r4c1 r4c2 r4c3"
      "r5c1 r5c2 r5c3" "r6c1 r6c2 r6c3" "r7c1 r7c2 r7c3" "r8c1 r8c2 r8c3"; }

  .c( @rc ) { display:grid; grid-area:@rc; justify-self:stretch; align-self:stretch;
    justify-items:center; align-items:center; background-color:black; color:wheat; border:solid thin wheat; }

  .comp { background-color:black; position:absolute; left:0; top:5%; right:0; bottom:0; font-size:2.5em;
    .grid8x3(); justify-items:center; align-items:center;

    .r1c1{.c(r1c1)}; .r1c2{.c(r1c2)}; .r1c3{.c(r1c3)};
    .r2c1{.c(r2c1)}; .r2c2{.c(r2c2)}; .r2c3{.c(r2c3)};
    .r3c1{.c(r3c1)}; .r3c2{.c(r3c2)}; .r3c3{.c(r3c3)};
    .r4c1{.c(r4c1)}; .r4c2{.c(r4c2)}; .r4c3{.c(r4c3)};
    .r5c1{.c(r5c1)}; .r5c2{.c(r5c2)}; .r5c3{.c(r5c3)};
    .r6c1{.c(r6c1)}; .r6c2{.c(r6c2)}; .r6c3{.c(r6c3)};
    .r7c1{.c(r7c1)}; .r7c2{.c(r7c2)}; .r7c3{.c(r7c3)};
    .r8c1{.c(r8c1)}; .r8c2{.c(r8c2)}; .r8c3{.c(r8c3)};
  }
  
</style>