
<template>
  <div   class="summ-pane">
    <div class="summ-name">{{this.name}}</div>
    <div class="summ-choices">
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
        let idx = this.mix().choiceIndex( this.name, choice )
        this['c'+idx]     = choice; } },

    mounted: function () {
      this.mix().subscribe( this.name,  this.name+'Id', this.onChoice );
      let choices = this.mix().choices( this.name );
      for( let idx=0; idx <  choices.length; idx++ ) {
        this['c'+idx] = choices[idx]; } }

  }

  export default Summ;

</script>

<style lang="less">
  
@import '../../pub/css/themes/theme.less';

@summFS:@themeFS;

.summ-pane { position:absolute; left:0; top:0; width:100%; height:100%;
        background-color:@theme-back; color:@theme-fore; border:1px solid @theme-fore;
  
  // .themeCenterItems() has display:grid;
  .summ-choices(){ .themeCenterItems(); grid-template-rows:100fr; grid-template-columns:33.3fr 33.3fr 33.3fr;
    grid-template-areas:"c1 c2 c3" }
  
  .summ-name {    position:absolute; left:0; top:0;   width:100%; height:50%; font-size:1.5*@summFS;
    .themeCenterItems(); }
  
  .summ-choices { position:absolute; left:0; top:50%; width:100%; height:50%; .summ-choices(); font-size:@summFS;
    .c1 { grid-area:c1; } .c2 { grid-area:c2; } .c3 { grid-area:c3; } }
  }

</style>
