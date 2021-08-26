
<template>
  <div ref="Btns" class="btns-pane">
    <template v-for="btn in btns">
      <div  ref="btnElem"  :style="styleBlock(btn)">
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
  import { vis } from "../../pub/draw/Vis.js"

  let Btns = {

    props: { name:String, btns:Object },

    setup( props ) {

      const nav     = inject( 'nav' );
      let   btn     = ref({} );
      const btnElem = ref(null);
      const titElem = ref(null);
      let   asp     = 0;

      const pubBtn = function (btn) {
        let checked = nav.isDef(btn.checked) ? btn.checked : false;
        if( btn.type==='choice' ) {
          btn.checked.value = !btn.checked.value;
          checked = btn.checked.value;
          nav.pub( { source:'Btns.vue', compKey:props.name, choice:btn.name, checked:checked } ); }
        else if( btn.type==='pub' ) {
          nav.pub( { pageKey:props.name } ); } // Need to determine what to publish on Nav here
        else {
          console.log( 'Btn.pubBtn() unknown btn.type', btn.type ) } }
      const aspect = function() {  // Only call in mounted
        let elem = btnElem['value'];
        let w    = elem['clientWidth' ];
        let h    = elem['clientHeight'];
        return h/w; }
      const styleBlock = function(btn) {
        let p  = btn.pos;
        let sy = 1.0;
        let p2 = p[2]===0 ? p[3] : p[2];
        let fs = btn.type==='choice' ? (p[3]*0.06)+'em' : (p[3]*0.07)+'em';
        return { position:'absolute', left:sy*p[0]+'%', top:sy*p[1]+'%', width:sy*p2+'%', height:sy*p[3]+'%',
          fontSize:fs, 'z-index':2 } }
      const styleBtn = function (btn) {
        let back = vis.css( btn.hsv );
        return { color:'black', backgroundColor:back }; }
      const classCheck = function (btn) {
        // console.log( 'Btns.classCheck()', { checked:btn.checked.value, name:props.name, choice:btn.name } );
        return btn.checked.value ? 'check far fa-check-square' : 'check far fa-square'; }
      const classIcons = function (btn) {
        return 'icons ' + btn.icon }
      const titleRef = function (btn) {
        return 'Title' + btn.name }
      const srcImg = function (btn) {
        return btn.img.includes('css') ||  btn.img.includes('assets') ? btn.img : '../../css/' + btn.img; }
      const adjustWidths = function() {
         let names = Object.keys(props.btns)
         for( let name of names ) {
           let btn = props.btns[name];
           if( btn.pos[2]===0 ) {
             btn.elem   = btnElem['value'];
             let wt     = titElem['value']['clientWidth'];
             let wb     = btn.elem['clientWidth'];
             btn.pos[2] = btn.pos[3]*2.4*wt/wb
             // console.log( 'Adj', { wt:wt, wb:wb, w:btn.pos[2], h:btn.pos[3] } ) }
             btn.elem.style.width = btn.pos[2]+'%' } } }

    onMounted( function () {
      asp = aspect();
      adjustWidths(); } )

    return { btn, styleBlock, styleBtn, pubBtn, classCheck, classIcons, srcImg, titleRef, btnElem, titElem  }; }

  }

   export default Btns;

</script>

<style scoped lang="less">

  @import '../../css/themes/theme.less';

  @btnsFS:2.5*@themeFS;

  .image-radius { border-radius:8px; border:solid @theme-back 1px; }

  .btns-pane { font-size:@btnsFS; font-weight:bold; position:absolute; left:0; top:0; width:100%; height:100%; }

  .btns-center { display:grid;  width:100%; height:100%; } // A surrounding div for centering button

  .btns-grid1x3() { display:grid; grid-template-columns:20fr 24fr 56fr; grid-template-areas:"check icons label"; }

  .btns-btn { .btns-grid1x3(); justify-self:center; align-self:center;
    width:90%; height:80%; font-size:inherit; font-family:@theme-font-family;
    cursor:pointer; border-radius:16px; border: solid @theme-back 1px; }

    .check { grid-area:check; justify-self:center; align-self:center; }
    .icons { grid-area:icons; justify-self:center; align-self:center; } // font-family: "font-awesome" serif;
    .image { grid-area:icons; justify-self:left;   align-self:center; .image-radius; max-height:1.8em; }
    .title { grid-area:label; justify-self:left;   align-self:center; text-align:left; }

</style>