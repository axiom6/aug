
<template>
  <div   class="summ-pane">
    <div v-if="isRouted()" class="summ-route">
      <h-navb :title="name" :compKey="name"></h-navb>
    </div>
    <div v-if="!isRouted()" class="summ-name">{{name}}</div>
    <div class="summ-choices">
      <div class="c1">{{c0}}</div>
      <div class="c2">{{c1}}</div>
      <div class="c3">{{c2}}</div>
    </div>
  </div>
</template>

<script type="module">

  import { inject, ref, onMounted } from 'vue';
  import Navb from '../../../lib/vue/elem/Navb.vue';

  let Summ = {

    components: { 'h-navb':Navb },

    props: { name:{ type:String, default:'none' } },

    setup( props ) {

      const nav    = inject('nav');
      const choice = inject('choice')
      const c0     = ref('-');
      const c1     = ref('-');
      const c2     = ref('-');
      const debug  = false;

      const onChoices = function( obj ) {
        if( obj.compKey !== props.name ) { return } // || !nav.isStr(obj.choice) )
        choice.choose( obj )
        setChoices() }

      const setChoices = () => {
        let choices = choice.choices( props.name )
        if( debug ) { console.log( 'Summ.onChoices()', obj, choices ); }
        for( let i = 0; i < 3; i++ ) {
          let select = i < choices.length ? choices[i] : '-';
          setChoice( i, select ) } }

      const setChoice = function( idx, select ) {
        if(      idx===0 ) c0.value  = select;
        else if( idx===1 ) c1.value  = select;
        else if( idx===2 ) c2.value  = select; }
      
      const isRouted = function() {
        return props.name !== 'none'; }

      onMounted( function () {
        setChoices()
        nav.subscribe( 'Nav', 'Summ', (obj) => { onChoices(obj); } ); } )

      return { c0, c1, c2, isRouted }; },
  }

  export default Summ;

</script>

<style lang="less">
  
@import '../../../css/themes/theme.less';

@summFS:@themeFS;

.summ-pane { position:absolute; left:0; top:0; width:100%; height:100%;
        background-color:@theme-back; color:@theme-fore; border:1px solid @theme-fore;
  
  // .themeCenterItems() has display:grid;
  .summ-choices(){ .themeCenterItems(); grid-template-rows:100fr; grid-template-columns:33.3fr 33.3fr 33.3fr;
    grid-template-areas:"c1 c2 c3" }

  .summ-route { position:absolute; left:32%; top:8%; width:36%; height:50%; .themeCenterItems(); }
  
  .summ-name { position:absolute; left:0; top:0;   width:100%; height:50%; font-size:2.5*@summFS;
    .themeCenterItems(); }
  
  .summ-choices { position:absolute; left:0; top:50%; width:100%; height:50%; .summ-choices(); font-size:1.5*@summFS;
    .c1 { grid-area:c1; } .c2 { grid-area:c2; } .c3 { grid-area:c3; } }
  }

</style>

<!--

            -->
