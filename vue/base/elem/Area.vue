
<template>
    <table class="area-pane" :style="style()">
      <tbody>
        <template v-for="area in areat">
          <tr >
            <td v-if="mix.isDef(area.icon)" class="area-icon"><i :class="area.icon"></i></td>
            <td class="area-name" @click="doClick(area.name)">{{area.name}}</td>
            <td class="area-desc">{{area.desc}}</td>
          </tr>
        </template>
      </tbody>
    </table>
</template>

<script type="module">

  import { inject, ref } from 'vue';

  let Area = {

    props: { areat:Object, size:Number, fnClick:Function },

    setup( props ) {

      const mix = inject( 'mix' );

      const area = ref(null);

      const doClick = function(name) {
        if( mix.isDef(props.fnClick) ) {
          props.fnClick(name); } }

      const style = function() {
        return mix.fontSizeCss(props.size); }

    return { area, doClick, style, mix }; }

  }

  export default Area;

</script>

<style scoped lang="less">
  
  @import '../../../css/themes/theme.less';

  @itemFS:1.0*@themeFS;
  
  .area-pane {
      .area-icon { text-align:center;                           }
      .area-name { text-align:left;   font-weight:bold;         }
      .area-desc { text-align:left;   padding-left:2.5; } }

</style>