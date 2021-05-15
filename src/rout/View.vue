
<template>
  <router-view name="Home"></router-view>
  <router-view name="Info"></router-view>
  <router-view name="Know"></router-view>
  <router-view name="Wise"></router-view>
</template>

<script type="module">

  let View = {

    setup() {

    return{} }
  }

  export default View;

</script>

<!--
  <router-view/>
  <router-view :name="'Home'"></router-view>
  <router-view :name="'Info'"></router-view>
  <router-view :name="'Know'"></router-view>
  <router-view :name="'Wise'"></router-view>

  <router-view name="Home"></router-view>
  <router-view name="Info"></router-view>
  <router-view name="Know"></router-view>
  <router-view name="Wise"></router-view>
-->