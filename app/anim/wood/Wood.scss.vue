
<template>
  <div>
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
  export default {

  };

</script>

<style lang="sccs">
  
  body, html {
    width: 100%;
    height: 100%;
    min-height: 700px;
    background: rgb(4,30,43); /* Old browsers */
    background: linear-gradient(to bottom, rgba(4,30,43,1) 0%,rgba(64,120,134,1) 41%,rgba(212,219,219,1) 69%,rgba(0,0,0,1) 69%,rgba(0,0,0,1) 100%);
  }
  
  h1 {
    position: absolute;
    top: 550px;
    width: 100%;
    text-align: center;
    font-size: 45px;
    color: orange;
    white-space: pre;
    margin-left: 20px;
  }
  
  span {
    letter-spacing: 200px;
  }
  
  .moon {
    left: 25%;
    position: absolute;
    top: 100px;
  }
  
  .horseman {
    width: 184px;
    height: 123px;
    background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/horse-hallow5.svg');
    animation: horsemove 0.7s steps(15) infinite;
    position: absolute;
    left: 50%;
    margin-left: -100px;
    top: 300px;
  }
  
  .ground {
    width: 151%;
    height: 697px;
    position: absolute;
    background-size: 800px 716px;
    left: 0;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  .front {
    background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/hallowfront4.svg') repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 20s -5s linear infinite;
  }
  
  .frontmid {
    background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/hallowmidfront2.svg') repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 50s -5s linear infinite;
  }
  
  .mid {
    background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/hallowmid2.svg') repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 100s -5s linear infinite;
  }
  
  .back {
    background: url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/28963/hallowback2.svg') repeat-x;
    background-size: 1000px 871px;
    top: -100px;
    animation: bk 100s -5s linear infinite;
  }
  
  @keyframes horsemove {
    100% { background-position: 0 -1848px; }
  }
  
  @keyframes bk {
    100% { background-position: -200% 0; }
  }

</style>

