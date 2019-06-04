

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

  import Dabs  from '../elem/Dabs.vue';

  let MathND = {

    components:{ 'd-dabs':Dabs },

    methods: {

      isPage: function(key) {
        return this.key === key; },

      onTabs: function(key, ml ) {
        if( this.pages[key] ) {
          this.key = key;
          this.create(this.key); }
        if( ml ){
          this.mathML(this.exps); } },

      create: function( key ) {
        let page = this.pages[key];
        if( page.obj===null ) {
            page.obj = new page.klass(); }
        this.exps = page.obj.math(); },

      mathML: function ( exps ) {
        for( let key in exps ){
          let exp = exps[key];
          if( this.inKlass(exp.klass) ) {
            let elem = this.$refs[exp.klass][0];
            elem.innerHTML = exp.mathML; } } },
      
      inKlass: function( klass ) {
        console.log( 'MathMN.inKlass klass', klass );
        status = typeof(this.$refs[klass][0]) !== 'undefined';
        if( !status ) {
          console.log( 'MathMN.inKlass ref undefined for', klass ); }
        return status; }
    },

    mounted: function () {
      this.onTabs( this.key, false );
      this.subscribe( 'Math', this.comp+'.vue', (key) => {
        if( typeof(key)==='string' ) {
          this.onTabs( key, true ); } } );
      this.$nextTick( function() {
        this.mathML( this.exps ); } ); }
  }
  
export default MathND;

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