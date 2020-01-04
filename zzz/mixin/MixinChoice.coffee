
class MixinChoice

  constructor:() ->

  mixin:() ->

    return  {

      created: () ->
        return

      methods: {

        choice:() ->
          this.batchDataUtil('Choice')
        choices:( name ) ->
          obj = this.choice()[name]
          if obj?
            obj.choices
          else
            console.error( 'Mixin.choices() bad choice name', { name:name } )
            []
        choose:( name, choice ) ->
          obj = this.choice()[name]
          if obj?
            obj.choices[obj.idx] = choice;
            obj.idx = ++obj.idx % obj.choices.length;
          else
            console.error( 'Mixin.choose() bad choice', { name:name, choice:choice } )
          return
        choosen:( name, choice ) ->
          this.choice()[name]? and this.inArray( choice, this.choices(name) )
        choiceIndex:( name, choice ) ->
          obj = this.choice()[name]
          idx = 0
          if obj?
            idx = obj.choices.indexOf(choice)
            idx = if idx is -1 then 0 else idx
          else
            console.error( 'Mixin.choiceIndex() bad choice name', { name:name, idx:idx } )
          idx

      }
}

export default MixinChoice