
<template>
  <div class="summ">
    <div class="name">{{this.name}}</div>
    <div class="choices">
      <div class="c1">{{this.c0}}</div>
      <div class="c2">{{this.c1}}</div>
      <div class="c3">{{this.c2}}</div>
    </div>
  </div>
</template>

<script type="module">
  
  let Summ = {

    props: { name:String },

    data() { return { c0:"-", c1:"-", c2:"-" } },

    methods:{
      
      onChoice: function( choice ) {
        let idx = this.choiceIndex( this.name, choice )
        this['c'+idx]     = choice; } },

    mounted: function () {
      this.subscribe( this.name,  this.name+'Id', this.onChoice );
      let choices = this.choices( this.name );
      for( let idx=0; idx <  choices.length; idx++ ) {
        this['c'+idx] = choices[idx]; } }

  }

  export default Summ;

</script>

<style lang="less">
  
@import '../../pub/css/themes/theme.less';

.summ { position:absolute; left:0; top:0; width:100%; height:100%;
        background-color:@theme-back; color:@theme-color; border:1px solid @theme-color;
  
  // .themeCenterItems() has display:grid;
  .gridChoices(){ .themeCenterItems(); grid-template-rows:100fr; grid-template-columns:33.3fr 33.3fr 33.3fr;
    grid-template-areas:"c1 c2 c3" }
  
  .name {    position:absolute; left:0; top:0;   width:100%; height:50%; font-size:@theme-h1-size;
    .themeCenterItems(); }
  
  .choices { position:absolute; left:0; top:50%; width:100%; height:50%; .gridChoices(); font-size:@theme-choice-size;
    .c1 { grid-area:c1; } .c2 { grid-area:c2; } .c3 { grid-area:c3; } }
  }

</style>
