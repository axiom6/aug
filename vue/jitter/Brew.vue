
<script type="module">

  import Choice from './Choice.vue'

  let Brew = {

    extends:Choice,

    data() { return { name:'Brew', btns:{
      ColdBrew:    { title:'Cold Brew',    name:'ColdBrew',    pos:[2, 5,96,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/ColdBrew.jpg' },
      PourOver:    { title:'Pour Over',    name:'PourOver',    pos:[2,20,96,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/PourOver.jpg' },
      AutoDrip:    { title:'Auto Drip',    name:'AutoDrip',    pos:[2,35,96,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/AutoDrip.jpg' },
      SyphonPot:   { title:'Syphon Pot',   name:'SyphonPot',   pos:[2,50,96,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/SyphonPot.jpg' },
      FrenchPress: { title:'French Press', name:'FrenchPress', pos:[2,65,96,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/FrenchPress.jpg' },
      Expresso:    { title:'Expresso',     name:'Expresso',    pos:[2,80,96,13], hsv:[34,44,69],
        check:true, checked:false, img:'brew/Expresso.jpg' }
      } } }

  }

  export default Brew;

</script>