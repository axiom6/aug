
<template>
  <div ref="Btns" class="btns-pane">
    <template v-for="btn in btns">
      <div  ref="btnElem"  :style="styleBlock(btn.pos)">
        <div   class="btns-center">
          <div class="btns-btn" :style="styleBtn(btn)" @click="pubBtn(btn)">
            <span v-if="btn.check" :class="classCheck(btn)"></span>
            <i    v-if="btn.icon"  :class="classIcons(btn)"></i>
            <img  v-if="btn.img"    class="image" :src="srcImg(btn)" alt=""/>
            <span v-if="btn.title"  class="title" ref="titElem">{{btn.title}}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';

  let Btns = {

    props: { name:String, btns:Object },

    setup( props ) {

      const mix = inject( 'mix' );
      const btnElem = ref(null);
      const titElem = ref(null);

      const pubBtn = function (btn) {
        mix.choose(  name, btn.name );
        btn.checked = mix.choosen( name, btn.name );
        // console.log( 'Btns.pubBtn()', name, btn.name,  btn.checked );
        mix.publish( name, btn.name ); }
      const aspect = function() {  // Only call in mounted
        let w = $refs['Btns']['clientWidth' ];
        let h = $refs['Btns']['clientHeight'];
        return h/w; }
      const styleBlock = function(p) {
        let sy = 1.0
        let p2 = p[2]===0 ? p[3] : p[2];
        return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',
        fontSize:(p[3]*0.08)+'em' } }
      const styleBtn = function (btn) {
        let back = mix.toRgbaHsv( btn.hsv );
        return { color:'black', backgroundColor:back }; }
      const classCheck = function (btn) {
        btn.checked = mix.choosen( name, btn.name );
        // console.log( 'Btns.classCheck()', { checked:btn.checked, name:name, choice:btn.name } );
        return btn.checked ? 'check far fa-check-square' : 'check far fa-square'; }
      const classIcons = function (btn) {
        return 'icons ' + btn.icon }
      const titleRef = function (btn) {
        return 'Title' + btn.name }
      const srcImg = function (btn) {
        return '../../css/' + btn.img }
      const adjustWidths = function() {
         let names = Object.keys(props.btns)
         for( let name of names ) {
           let btn = props.btns[name];
           if( btn.pos[2]===0 ) {
             btn.elem   = btnElem.value;
             let wt     = titElem.value['clientWidth'];
             let wb     = btn.elem['clientWidth'];
             btn.pos[2] = btn.pos[3]*2.4*wt/wb
             // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
             btn.elem.style.width = btn.pos[2]+'%' } } }

    onMounted( function () {
      asp = aspect();
      adjustWidths(); } )

    return { styleBlock, styleBtn, pubBtn, classCheck, classIcons, srcImg, titleRef, btnElem, titElem  }; }

  }

   export default Btns;

</script>

<style scoped lang="less">

  @import '../../css/themes/theme.less';

  @btnsFS:1.4*@themeFS;

  .image-radius { border-radius:8px; border:solid @theme-back 1px; }

  .btns-pane { font-size:@btnsFS; font-weight:bold; position:absolute; left:0; top:0; right:0; bottom:0; }

  .btns-center { display:grid;  width:100%; height:100%; } // A surrounding div for centering button

  .btns-grid1x3() { display:grid; grid-template-columns:20fr 24fr 56fr; grid-template-areas:"check icons label"; }

  .btns-btn { .btns-grid1x3(); justify-self:center; align-self:center;
    width:90%; height:80%; font-size:inherit; font-family:@theme-font-family;
    cursor:pointer; border-radius:16px; border: solid @theme-back 1px; }

    .check { grid-area:check; justify-self:center; align-self:center; }
    .icons { grid-area:icons; justify-self:center; align-self:center; } // font-family: "font-awesome" serif;
    .image { grid-area:icons; justify-self:left;   align-self:center; .image-radius; max-height:1.5em; }
    .title { grid-area:label; justify-self:left;   align-self:center; text-align:left; }

</style>