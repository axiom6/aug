
<template>
  <!--d-dabs comp="Data" :pages="pages" :init="key"></d-dabs-->
  <table class="table">
    <thead><template v-for="col in culs"><th>{{col}}</th></template></thead>
    <tbody><template v-for="row in rows">
       <tr><template v-for="cell in row"><td>{{cell}}</td></template></tr>
    </template></tbody>
    <tfoot></tfoot>
  </table>

</template>

<script type="module">
  
  import Dabs  from '../elem/Dabs.vue';
  
  let Table = {
    
    components:{ 'd-dabs':Dabs },

    data() {
      return { comp:'Table', key:'Table',
        pages:{
          Table1: { title:'Table1', key:'Table1', obj:null, created:false },
          Table2: { title:'Table2', key:'Table2', obj:null, created:false } },
        culs:{
                key:"Key", first:"First", last:"Last",    rank:"Rank"    },
        rows:{
          r1: { key:"1",   first:"Mark",  last:"Nelson",  rank:"Colonel" },
          r2: { key:"2",   first:"Brian", last:"Jackson", rank:"Captain" },
          r3: { key:"3",   first:"Dave",  last:"Markum",  rank:"Sargent" } }
         } },

    methods: {},
    
    mount:{}
  }
  
  export default Table;

</script>

<style lang="less">
  
  .table { position:absolute; left:0; top:5%; right:0; bottom:0; background-color:black;
    justify-self:center; align-self:center; font-size:3em; }
  
  th { color:wheat; }
  tr {}
  td { color:wheat; }

</style>