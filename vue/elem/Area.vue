
<template>
    <table class="area-pane" :style="style()">
      <tbody>
        <template v-for="area in dispObj.areas">
          <tr>
            <td class="area-name">{{area.name}}</td>
            <td class="area-desc">{{area.desc}}</td>
          </tr>
        </template>
      </tbody>
    </table>
</template>

<script type="module">

  let Area = {

    props: { dispObj:Object, size:Number },

    data() { return { area:null } },

    methods: {

      doClick: function() {
        if( this.isDef(this.fnClick) ) {
          this.fnClick(this.name); } },

      style: function() {
        return this.fontSizeCss(this.size); }

    }

  }

  export default Area;

</script>

<style lang="less">
  
  @import '../../pub/css/themes/theme.less';
  
  @itemFS:1.0*@themeFS;
  
  .area-pane {
      .area-name { font-weight:bold;         }
      .area-desc { padding-left:0.5*@itemFS; } }

</style>