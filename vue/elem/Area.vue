
<template>
    <table class="area-pane" :style="style()">
      <tbody>
        <template v-for="area in areat">
          <tr >
            <td v-if="isDef(area.icon)" class="area-icon"><i :class="area.icon"></i></td>
            <td class="area-name" @click="doClick(area.name)">{{area.name}}</td>
            <td class="area-desc">{{area.desc}}</td>
          </tr>
        </template>
      </tbody>
    </table>
</template>

<script type="module">

  import { inject } from 'vue';
  let Area = {

    props: { areat:Object, size:Number, fnClick:Function },

    data() { return { area:null } },

    methods: {
      
      isDef:function( obj ) {
        return this.mix.isDef(obj); },

      doClick: function(name) {
        if( this.mix.isDef(this.fnClick) ) {
          this.fnClick(name); } },

      style: function() {
        return this.mix.fontSizeCss(this.size); }

    }

  }

  export default Area;

</script>

<style lang="less">
  
  @import '../../css/themes/theme.less';
  
  @itemFS:1.0*@themeFS;
  
  .area-pane {
      .area-icon { text-align:center;                           }
      .area-name { text-align:left;   font-weight:bold;         }
      .area-desc { text-align:left;   padding-left:1.5*@itemFS; } }

</style>