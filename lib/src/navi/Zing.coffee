
import { ZingTouch as ZT } from "zingtouch"


class Zing

  constructor:( @stream, @nav ) ->
    @nav.zing = @

  swipe:( elem ) ->
    region = ZT.Region( elem )
    region.bind( elem, "swipe", @onSwipe )

  onSwipe:( event ) ->