
<template>
  <div :style="style()">
    <div class="rect-hsvs">{{hsv()}}</div>
    <div class="rect-rgbs">{{rgb()}}</div>
  </div>
</template>

<script type="module">

import { vis } from "../../../lib/pub/draw/Vis.js"

let Rect = {

  props: { page:Object, sat:Number, val:Number },

  setup( props ) {

    const debug = true;
    let   hue   = vis.hue( props.page.key )

    const style = () => {
      let str = `position:absolute; left:${props.sat*0.9}%; top:${(100-props.val)*0.9}%; width:9%; height:9%; ` +
                `background:${ vis.css( [ hue, props.sat, props.val ] ) }`
      if( debug ) { console.log( "Rect.style()", str, hue, props.sat, props.val ); }
      return str; }

    const hsv = () => {
      return `${vis.pad(hue,100)} ${vis.pad(props.sat,100)} ${vis.pad(props.val,100)}` }

    const rgb = () => {
      let obj = vis.rgb( [ hue, props.sat, props.val ] );
      return `${vis.pad(obj.r,100)} ${vis.pad(obj.g,100)} ${vis.pad(obj.b,100)}` }

    return { style, hsv, rgb } }
}

export default Rect;

</script>

<style lang="less">

@import '../../../lib/css/themes/theme.less';

@huesFS:@themeFS*0.66;

  .rect-hsvs { color:black; font-size:@huesFS; font-family:mono;
    position:absolute; left:0; top: 0;  width:100%; height:50%; }
  .rect-rgbs { color:black; font-size:@huesFS; font-family:mono;
    position:absolute; left:0; top:50%; width:100%; height:50%; }

</style>
