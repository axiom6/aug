
<template>
  <div class="wood">
    <svg class="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
      <circle r="30" fill="#fff" cx="70" cy="70" ></circle>
    </svg>
    <div class="back ground"></div>
    <div class="mid ground"></div>
    <div class="frontmid ground"></div>
    <div class="front ground"></div>
    <div class="horseman"></div>
  </div>
</template>

<script>
  let Wood = {}
  export default Wood;
</script>

<style lang="less">
  
  @import '../../../css/themes/theme.less';
  
.wood { position:absolute; left:0; top:0; width:100%; height:100%; min-height:700px;
    overflow:hidden; background-color:black; // background-color:#041e2b;
    background-image: linear-gradient(to bottom, #041e2b 0%, #407886 41%, #d4dbdb 69%, black 69%, black 100%); }

  .wood .moon {  position:absolute; left:25%; top:100px; }

  .wood .horseman {
    position: absolute; left:50%; top:300px; width:184px; height:123px; margin-left: -100px;
    background: url("./horse-hallow5.svg");
    animation: horsemove 0.7s steps(15) infinite; }

  .wood .ground {
    position: absolute; left:0; top:0; width:151%; height:100%; // height:697px;
    background-size: 800px, 716px;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px; }

.wood .front {
    background: url("./hallowfront4.svg") repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 20s -5s linear infinite; }

.wood .frontmid {
    background: url("./hallowmidfront2.svg") repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 50s -5s linear infinite; }

.wood .mid {
    background: url("./hallowmid2.svg") repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 100s -5s linear infinite; }

.wood .back {
    background: url("./hallowback2.svg") repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 100s -5s linear infinite; }
  
  @keyframes horsemove {
    100% {
      background-position: 0 -1848px; } }
  
  @keyframes bk {
    100% {
      background-position: -200% 0; } }
  

</style>

