
<template>
  <div class="prin-dirs-pane">
    <div class="cen" :style="style(pracObj)">
      <div class="prin-dirs-disp" @click="doPrac(pracObj.name)">
        <i   :class="pracObj.icon"></i>
        <span class="prin-dirs-name">{{pracObj.name}}</span>
      </div>
    </div>
    <template v-for="dispObj in pracObj.disps">
      <div   :class="dispObj.dir" :style="style(dispObj)"  :ref="dispObj.name">
        <div class="prin-dirs-disp" @click="doDisp(prac.name,dispObj.name)">
          <i   :class="dispObj.icon"></i>
          <span class="prin-dirs-name">{{dispObj.name}}</span>
        </div>
        <template v-for="ddObj in dispObj.disps">
          <div class="prin-dirs-disp">
            <i   :class="ddObj.icon"></i>
            <span class="prin-dirs-name">{{ddObj.name}}</span>
          </div>
        </template>
        </div>
    </template>
  </div>
</template>

<script type="module">

   import { inject, ref } from 'vue'

  let Dirs = {

    props: { pracObj:Object },

    setup() {

      const nav = inject( 'nav' );

      const dispObj = ref(null);
      const ddObj   = ref(null);

      const doPrac = function (pracKey) {
        let obj = { level:"Prac", pracKey:pracKey };
        nav.pub( obj ); }

      const doDisp = function (pracKey,dispKey) {
        let obj = { level:"Disp", pracKey:pracKey, dispKey:dispKey };
        nav.pub( obj ); }

      const style = function( ikwObj ) {
        return nav.styleObj(ikwObj); }

    return { dispObj, ddObj, doPrac, doDisp, style }; }
  }

  export default Dirs;

</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';

  @prinDirsFS:1.25*@themeFS;

  .prin-dirs-grid3x3() { display:grid; grid-template-columns:1fr 1fr 1fr; grid-template-rows:1fr 1fr 1fr;
    grid-template-areas: "nw north ne" "west cen east" "sw south se"; }

  .prin-dirs-dir( @dir ) { .themeCenterStretch(); grid-area:@dir; border-radius:1.0*@prinDirsFS; }

  .prin-dirs-pane { font-size:1.6*@prinDirsFS; width:90%; height:96%;
    color:black; background-color:@theme-gray; border-radius:1.0*@prinDirsFS; font-weight:bold;
  
      .prin-dirs-grid3x3(); // The 4 Displine plus Practiice name Grid
                                       .north { .prin-dirs-dir(north); }
      .west { .prin-dirs-dir(west); }  .cen   { .prin-dirs-dir(cen);   } .east { .prin-dirs-dir(east); }
                                       .south { .prin-dirs-dir(south); }
      .cen { font-size:1.6*@prinDirsFS; }
    
    .prin-dirs-disp   { display:block; text-align:center;
       i              { display:block; }
      .prin-dirs-name { display:block; } } }
  
</style>