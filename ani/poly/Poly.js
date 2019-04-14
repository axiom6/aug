// Read the article
// https://css-tricks.com/polylion

let staggerFrom = {
	scale: 0,
	opacity: 1,
	transformOrigin: 'center center',
};

let staggerTo = {
  opacity: 1,
  scale: 1,
  ease: Expo.easeOut
};

let transformNum = 0;

let tweenMaxOptions = {
	delay: 1,
	repeat: -1,
	repeatDelay: 1,
	yoyo: true
};

let tweenMaxTimeline = new TimelineMax(tweenMaxOptions),
    shapes   = $('#group polygon'),
    stagger  = 0.005,
    duration = 1.5;

tweenMaxTimeline.staggerFromTo(shapes, duration, staggerFrom, staggerTo, stagger, 0);