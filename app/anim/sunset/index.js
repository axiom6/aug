
$(window).scroll(function() {
	// scrollable content is doc height minus viewport height
	let numToScroll = $(document).height() - $(window).height();
	// how much of doc has been scrolled
	let docScrolled     = $(document).scrollTop();
	let scrollRemaining = numToScroll - docScrolled;
	// convert to percentage (taken from one to get amount remaining)
	let scrollPercent = Math.round((1-(scrollRemaining/numToScroll))*100);
  let skyBottom = 50-(scrollPercent/2)+"%";
  let skyTop = (scrollPercent-100)+"%";
$("#sky").css({"bottom":skyBottom,"top":skyTop});
 
});