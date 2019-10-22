
<template>
  <div      class="icon-pane">
    <div   :style="style()" @click="doClick()">
      <span class="icon-icon"><i :class="icon"></i></span>
      <span class="icon-name">{{name}}</span>
      <span class="icon-summ" v-if="hasSumm()">{{summ}}</span>
    </div>
  </div>
</template>

<script type="module">
  
  let Icon = {

    props: { icon:String, name:String, summ:String, size:Number, fnClick:Function },
    
    methods: {
      
      hasSumm: function() {
        return this.isDef(this.summ); },
      
      icClass:function() {
        return this.hasSumm() ? 'icon-summ' : 'icon-name'; },
      
      doClick: function() {
        if( this.isDef(this.fnClick) ) {
          this.fnClick(this.name); } },
      
      style: function() {
        return { fontSize:this.size+'rem' }; }

    }
    
  }
  
  export default Icon;
  
</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  .icon-grid1x2() { display:grid; grid-template-columns:30fr 10fr 30fr 30fr;
    grid-template-areas:"nleft nicon nname nright"; }

  .icon-pane {}
  
  .icon-icon {}
  
  .icon-name { .icon-grid1x2(); align-self:center;  justify-self:center; height:100%;
    i     { grid-area:nicon; .themeCenterItems(); }
    .name { grid-area:nname; .themeCenterItems(); } }

  .icon-grid1x4() { display:grid; grid-template-columns:5fr 10fr 20fr 65fr; grid-template-areas:"sleft sicon sname ssumm"; }

  .icon-summ { .icon-grid1x4(); align-self:start;  justify-self:center;
    i     { grid-area:sicon; .themeLeftSelf(); }
    .name { grid-area:sname; .themeLeftSelf(); font-weight:900; }
    .summ { grid-area:ssumm; .themeLeftSelf(); } }
  
</style>