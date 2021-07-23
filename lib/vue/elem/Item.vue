
<template>
  <div      class="item-pane" :style="style()">
    <div    class="item-line" @click="doClick()">
      <span class="item-icon" v-if="hasProp('icon')"><i :class="icon"></i></span>
      <span class="item-name" v-if="hasProp('name')">{{name}}</span>
      <span class="item-desc" v-if="hasProp('desc')">{{desc}}</span>
    </div>
  </div>
</template>

<script type="module">

  import { inject } from 'vue';
  
  let Item = {

    props: { icon:String, name:String, desc:String, size:Number, fnClick:Function },

    setup( props ) {

      const nav = inject( 'nav' );

      const hasProp = function(name) {
        return nav.isDef(props[name]); }

      const doClick = function() {
        if( nav.isDef(this.fnClick) ) {
          this.fnClick(this.name); } }

      const style = function() {
        return nav.fontSizeCss(this.size); }

    return { hasProp, doClick, style }; }
    
  }
  
  export default Item;
  
</script>

<style scoped lang="less">
  
  @import '../../../css/themes/theme.less';
  
  @itemFS:1.0*@themeFS;

  .item-pane {     display:grid; height:33%;
    .item-line {   display:inline;       justify-self:left; text-align:left;
      .item-icon { display:inline-block; margin-left:@itemFS; }
      .item-name { display:inline-block; margin-left:@itemFS; font-weight:bold; }
      .item-desc { display:inline-block; margin-left:@itemFS; } } }
  
</style>