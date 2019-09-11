
<template>
  <div class="choice">
    <div class="name">Body</div>
    <div class="choices">
      <div class="c1">{{this.c0}}</div>
      <div class="c2">{{this.c1}}</div>
      <div class="c3">{{this.c2}}</div>
    </div>
    <div class="body">
      <h-btns comp="Body" :btns="btns" init="None" :choices="choices" back="#3B5999" active="tan"></h-btns>
    </div>
  </div>
</template>

<script type="module">

  import Btns from '../../vue/elem/Btns.vue';

  let Body = {

    components:{ 'h-btns':Btns },

    data() { return { comp:'Body', idx:-1, choices:['None','None','None'], c0:'None', c1:'None', c2:'None', btns:{
      Thick:  { title:'Thick',  key:'Thick',  obj:null, pos:[20, 5,60,14], back:'primary',   check:true },
      Full:   { title:'Full',   key:'Full',   obj:null, pos:[20,24,60,14], back:'secondary', check:true },
      Creamy: { title:'Creamy', key:'Creamy', obj:null, pos:[20,43,60,14], back:'success',   check:true },
      Milky:  { title:'Milky',  key:'Milky',  obj:null, pos:[20,62,60,14], back:'info',      check:true },
      Silky:  { title:'Silky',  key:'Silky',  obj:null, pos:[20,81,60,14], back:'warning',   check:true }
    } } },
    
    methods:{
      onBtn: function( choice ) {
        this.idx = ++this.idx % this.choices.length;
        this.choices[this.idx] = choice;
        this['c'+this.idx]     = choice; } },
    
    mounted: function () {
      this.publish(   'Nav',  'Body' );
      this.subscribe( 'Body', 'Body', this.onBtn ); }

  }

  export default Body;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .choice { position:absolute; left:0; top:0; width:100%; height:100%;
    background-color:@theme-back; color:@theme-color;

    .gridChoices(){ display:grid; grid-template-rows:100fr; grid-template-columns:33.3fr 33.3fr 33.3fr;
      justify-items:center; align-items:center; text-align:center;
      grid-template-areas:"c1 c2 c3" }
    
    .name    { position:absolute; left:0; top:0; width:100%; height:10%; font-size:@theme-h1-size;
      display:grid; justify-items:center; align-items:center; text-align:center; }
  
    .choices { position:absolute; left:0; top:10%; width:100%; height:5%; .gridChoices(); font-size:@theme-choice-size;
       .c1 { grid-area:c1; } .c2 { grid-area:c2; } .c3 { grid-area:c3; } }
    
    .body { position:absolute; left:0; top:15%; width:100%; height:85%;
            background-color:@theme-back; color:@theme-color; }
  }

</style>
