
<template :key="nav.keyIdx(pageKey,pageIdx)">
  <div :style="style(pageKey)">
    <div class="rect-hsvs">{{hsvs()}}</div>
    <div class="rect-rgbs">{{rgbs()}}</div>
  </div>
</template>

<script type="module">

import { inject } from 'vue';
import { vis } from "../../../lib/pub/draw/Vis.js"

let Rect = {

  props: { sat:Number, val:Number, pageKey:String, pageIdx:Number },

  setup( props ) {

    const nav     = inject('nav');
    const debug   = false;
    const p       = 100
    const type    = "HMIR"
    const isRYGB  = false

    const style = (pageKey) => {
      let hue = vis.hue( pageKey, isRYGB );
      let css = vis.css( [ hue, props.sat, props.val, type ] );
      let str = `position:absolute; left:${props.sat*0.9}%; top:${(100-props.val)*0.9}%; width:9%; height:9%; ` +
                `background:${css}`
      if( debug ) { console.log( "Rect.style()",
          { css:css, pageKey:pageKey, hue:hue, sat:props.sat, val:props.val, type:type } ); }
      return str; }

    const hsvs = () => {
      let hue = vis.hue( props.pageKey, isRYGB );
      return `${vis.pad(hue,p)} ${vis.pad(props.sat,p)} ${vis.pad(props.val,p)}` }

    // Chroma name only finds primary colors
    // vis.chroma( [ rgb.r, rgb.g, rgb.b ] ).name(); }
    const name = () => {
      let hue = vis.hue( props.pageKey, isRYGB );
      return vis.str( [ hue, props.sat, props.val, type ] ); }

    const rgbs = () => {
      let hue = vis.hue( props.pageKey, isRYGB );
      let rgb = vis.rgb( [ hue, props.sat, props.val, type ] );
      return `${vis.pad(rgb.r,p)} ${vis.pad(rgb.g,p)} ${vis.pad(rgb.b,p)}` }

    return { style, hsvs, name, rgbs, nav } }
}

export default Rect;

</script>

<style lang="less">

@import '../../../lib/css/themes/theme.less';

@huesFS:@themeFS*0.66;

  .rect-hsvs { color:black; font-size:@huesFS; font-family:RobotoMono, monospace;
    position:absolute; left:0; top: 0;  width:100%; height:50%; }
/*.rect-name{ color:black; font-size:@huesFS; font-family:RobotoMono, monospace;
    position:absolute; left:0; top:33%;  width:100%; height:33%; } */
  .rect-rgbs { color:black; font-size:@huesFS; font-family:RobotoMono, monospace;
    position:absolute; left:0; top:50%; width:100%; height:50%; }

</style>
