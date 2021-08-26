

<template>
  <div   class="store-pane">
    <div class="store-name"  ><div class="store-title">Store</div></div>
    <div class="store-memory"><div class="store-title" @click="doTest('Memory')">Memory</div></div>
    <div class="store-local" ><div class="store-title" @click="doTest('Local')" >Local</div></div>
    <div class="store-index" ><div class="store-title" @click="doTest('Index')" >Index</div></div>
    <div class="store-fire"  ><div class="store-title" @click="doTest('Fire')"  >Fire</div></div>
 <!--div class="store-couch" ><div class="store-title" @click="doTest('Couch')" >Couch</div></div-->
 <!--div class="store-mongo" ><div class="store-title" @click="doTest('Mongo')" >Mongo</div></div-->
  </div>
</template>

<script type="module">

  import { inject } from "vue";
  import Manager from '../../../pub/data/store/Manager.js'

let Store = {
  
  setup() {

    const nav     = inject('nav');
    const manager = new Manager( nav );

    const doTest = function( name ) {
      manager.test( name );
    }

    return { doTest }; }

}
export default Store;

</script>

<style lang="less">

@import '../../../lib/css/themes/theme.less';

@storeFS:@themeFS;

.store-pane {   font-size:@storeFS; color:@theme-fore; display:grid; background-color:@theme-gray;
                  position:absolute; left:1%; top:0;   width: 96%; height:99%;
  .store-name   { position:absolute; left:0;  top:0;   width:100%; height:10%;
    font-size:4*@storeFS; color:@theme-fore; display:grid; border:@theme-fore solid 1px; }
  .store-memory { position:absolute; left:0;  top:10%; width:100%; height:15%;
    font-size:3*@storeFS; color:@theme-fore; display:grid; border:@theme-fore solid 1px; }
  .store-local  { position:absolute; left:0;  top:25%; width:100%; height:15%;
    font-size:3*@storeFS; color:@theme-fore; display:grid; border:@theme-fore solid 1px; }
  .store-index  { position:absolute; left:0;  top:40%; width:100%; height:15%;
    font-size:3*@storeFS; color:@theme-fore; display:grid; border:@theme-fore solid 1px; }
  .store-fire   { position:absolute; left:0;  top:55%; width:100%; height:15%;
    font-size:3*@storeFS; color:@theme-fore; display:grid; border:@theme-fore solid 1px; }
  .store-couch  { position:absolute; left:0;  top:70%; width:100%; height:15%;
    font-size:3*@storeFS; color:@theme-fore; display:grid; border:@theme-fore solid 1px; }
  .store-mongo  { position:absolute; left:0;  top:85%; width:100%; height:15%;
    font-size:3*@storeFS; color:@theme-fore; display:grid; border:@theme-fore solid 1px; }
}
  .store-title { justify-self:center; align-self:center; }

</style>
