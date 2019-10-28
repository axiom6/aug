
<template>
  <div      class="icon-pane" :style="style()">
    <div    class="icon-line" @click="doClick()">
      <span class="icon-icon"><i :class="icon"></i></span>
      <span class="icon-name">{{name}}</span>
    </div>
  </div>
</template>

<script type="module">
  
  let Icon = {

    props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },
    
    methods: {
      
      hasSumm: function() {
        return this.isDef(this.summ); },
      
      doClick: function() {
        if( this.isDef(this.fnClick) ) {
          this.fnClick(this.name); } },

      style: function() {
        return this.fontSizeCss(this.size); }
    }
  }
  
  export default Icon;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @iconFS:2.0*@themeFS;

  .icon-pane     { display:grid; height:100%;
  
    .icon-line   { display:inline; justify-self:center; text-align:center;  height:auto;
  
      .icon-icon { display:inline-block;  margin-right: 0.25*@iconFS; }
      
      .icon-name { display:inline-block; } }
  }

  
</style>