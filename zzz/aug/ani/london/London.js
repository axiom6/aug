// Inspired by Dribbble shot https://dribbble.com/shots/2041810-City-intro-animation - Be sure to check this talented guy out.

$(".bttn").click(function() {
 $(".background").toggleClass("paris").toggleClass("london");
 $(".london").toggleClass("active");
 $(".paris").toggleClass("active");
});