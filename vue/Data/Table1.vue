
<template>
    <table class="table">
      <thead><template v-for="col  in culs"><th>{{col}}</th></template></thead>
      <tbody><template v-for="row  in rows">
         <tr><template v-for="cell in row"><td>{{cell}}</td></template></tr>
      </template></tbody>
      <tfoot></tfoot>
    </table>
</template>

<script type="module">
  
  let Table1 = {
    
    data() {
      return { comp:'Table1', key:'Table1',
        culs:{
                key:"Table1", first:"First", last:"Last",    rank:"Rank"    },
        rows:{
          r1: { key:"1",   first:"Mark",  last:"Felton",  rank:"Colonel" },
          r2: { key:"2",   first:"Brian", last:"Jackson", rank:"Captain" },
          r3: { key:"3",   first:"Dave",  last:"Markum",  rank:"Sargent" } }
         } },

    methods: {},

    mounted: function () {
      console.log( 'Table1 mounted comp', this.comp ); }
  }
  
  export default Table1;

</script>

<style lang="less">
  
  .table { background-color:black; justify-self:center; align-self:center; font-size:3em; }
  
  th { color:wheat; }
  tr {}
  td { color:wheat; }

</style>