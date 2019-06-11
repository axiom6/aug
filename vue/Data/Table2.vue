
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
  
  let Table2 = {
    
    data() {
      return { comp:'Table2', key:'Table1',
        culs:{
                key:"Table2", first:"First", last:"Last",    rank:"Rank"    },
        rows:{
          r1: { key:"1",   first:"Mark",  last:"Felton",  rank:"Colonel" },
          r2: { key:"2",   first:"Brian", last:"Jackson", rank:"Captain" },
          r3: { key:"3",   first:"Dave",  last:"Markum",  rank:"Sargent" } }
         } },

    methods: {
      isTable1: function() {
       return this.comp === 'Table1'; }
    },

    mounted: function () {
      console.log( 'Table2 mounted comp', this.comp );
    }
  }
  
  export default Table2;

</script>

<style lang="less">
  
  .table { background-color:black; justify-self:center; align-self:center; font-size:3em; }
  
  th { color:wheat; }
  tr {}
  td { color:wheat; }

</style>