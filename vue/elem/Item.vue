
<template>
  <div      class="item-pane" :style="style()">
    <div    class="item-line" @click="doClick()">
      <span class="item-icon"><i :class="icon"></i></span>
      <span class="item-name">{{name}}</span>
      <span class="item-summ" v-if="hasSumm()">{{summ}}</span>
    </div>
  </div>
</template>

<script type="module">
  
  let Item = {

    props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },
    
    methods: {
      
      hasSumm: function() {
        return this.isDef(this.summ); },
      
      doClick: function() {
        if( this.isDef(this.fnClick) ) {
          this.fnClick(this.name); } },

      style: function() {
        return { fontSize:this.size+'rem' }; },

    }
    
  }
  
  export default Item;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @iconFS:2.0*@themeFS;

  .item-pane  {
  
    .item-grid1x3() { display:grid; grid-template-columns:10fr 20fr 70fr;
      grid-template-areas:"item-area-icon item-area-name item-area-summ"; }

    .item-line { .item-grid1x3(); margin-left:@iconFS; }
  
    .item-icon { grid-area:item-area-icon; .themeLeftSelf(); }
    
    .item-name { grid-area:item-area-name; .themeLeftSelf(); font-weight:bold; }
  
    .item-summ { grid-area:item-area-summ; .themeLeftSelf(); }
    
  }

  
</style>