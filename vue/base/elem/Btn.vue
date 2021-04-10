
<template>
   <div class="btn-nice" :style="styleBtn()" ref="elem" @click="pubBtn()">
     <i    class="btn-image fas fa-mug-hot"></i>
     <span class="btn-label">{{name}}</span>

   </div>
</template>

<script type="module">

import { inject, ref, onMounted } from 'vue';

let Btn = {

  props: { name:String, position:Array, background:String },

  setup( props ) {

    const mix  = inject( 'mix' );
    const elem = ref(null);

    const styleBtn = function () {
      let p = props.position;
      return { position:'absolute', left:p[0]+'%', top:p[1]+'%', width:p[2]+'%', height:p[3]+'%',
       background:props.background } }

    const pubBtn = function () {
      mix.publish( { pageKey:props.name } ); }

    onMounted( function () {
      } )

    return { elem, pubBtn, styleBtn }; }

}

export default Btn;

</script>

<style scoped lang="less">

  .btn-font{ font-family:Roboto, sans-serif;}

  @btn-unit:1vmin;
  @btn-size:              @btn-unit*6;
  @btn-size-before:       @btn-unit*4;
  @btn-font-size:         @btn-unit*1.9;
  @btn-font-size-before:  @btn-font-size*0.7;
  @btn-line-height:       @btn-unit*4;
  @btn-pad:               @btn-unit*2;
  @btn-pad-two:           @btn-pad*2;
  @btn-pad-top:           @btn-pad*0.5;
  @btn-pad-bottom:        @btn-pad*0.5;
  @btn-margin-left:       @btn-unit*10;
  @btn-top-active:        @btn-unit*0.6;
  @btn-border-radius:     @btn-unit*1.7;
  @btn-border-radius-img: @btn-unit;
  @btn-border-thin:       @btn-unit*0.2;
  @btn-shadow:            @btn-unit;
  @btn-shadow-active:     @btn-shadow*0.2;

  .btn-font{ font-family:Roboto, sans-serif;}

  .btn-nice {
    transition: all 0s ease-out;
    .btn-font;
    font-size: @btn-font-size;
    color: #000;
    background: #3B5999;
    text-decoration: none;
    text-align: center;
    text-shadow: 0 -@btn-border-thin 0 rgba(0,0,0,0.4);
    padding-left:@btn-pad*1.5;
    padding-top:@btn-pad-top;
    padding-bottom:@btn-pad-bottom;
    position:relative; left:0;
    cursor: pointer;
    border: solid black 1px;
    border-radius:@btn-border-radius;
    border-left:  solid @btn-border-thin #2E4476;
    box-shadow: @btn-unit @btn-unit 0 0 #2E4476;
    display: flex;  align-items: center;  justify-content: center;
  }

  .btn-nice:active, .btn-nice-active {
    top:        @btn-top-active;
    left:       @btn-top-active;
    box-shadow: @btn-shadow-active @btn-shadow-active 0 0 #2E4476;
  }

  .btn-nice::before { position:absolute; left:@btn-pad; content: " "; }

  .btn-tall::before { padding-top:@btn-pad; }

  .btn-nice:active::before, .btn-nice-active::before {  content: "\2713"; }

  // justify-self:start;

  .btn-nice .btn-image { float:left; align-self:center; margin-right: @btn-pad; border-radius:@btn-border-radius-img; border:solid black 1px;}
  .btn-nice .btn-icons { float:left; align-self:center; padding-right:@btn-pad; } // font-family: "font-awesome" serif;
  .btn-nice .btn-label { float:left; align-self:center; padding-right:@btn-pad; }

  //@btnFS:1.4*@themeFS;

</style>