import Unsplash, { toJson } from 'unsplash-js';

const unsplash = new Unsplash({
								  applicationId:
									  'f3a562a5af73aeba7b26055ab87f226b06b83a8d47cd93c63ea5dea131b09ec8',
								  secret: '6b687268c997f100ac1a0b74333f86185f271e53c0272fba78737d68c8e438fd',
								  callbackUrl: 'urn:ietf:wg:oauth:2.0:oob'
							  });

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this,
			args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
}

$(document).ready(function() {
	var hand = $('.hand-left'),
		finger = $('.finger'),
		slider = $('.slider'),
		handRight = $('.hand-right'),
		FINGER_RATIO_X = 2.95,
		FINGER_RATIO_Y = 3.351,
		SLIDER_RATIO_X = 11.793,
		SLIDER_RATIO_Y = 10.687,
		HAND_RIGHT_RATIO_X = -7.29,
		HAND_RIGHT_RATIO_Y = 5.96;

	setPositionAll();

	$(window).resize(setPositionAll);
	document.addEventListener('wheel', debounce(onScroll, 200));

	function setPositionAll() {
		setPosition(finger, FINGER_RATIO_X, FINGER_RATIO_Y);
		setPosition(slider, SLIDER_RATIO_X, SLIDER_RATIO_Y);
		setPosition(handRight, HAND_RIGHT_RATIO_X, HAND_RIGHT_RATIO_Y);
		// shiftSecondPicture();
	}

	function onScroll() {
		slideNextPicture();
		setNextBullet();
		triggerHandRight();
	}

	function setPosition(elem, ratioX, ratioY) {
		elem.css({
					 top: hand.height() / ratioY + 'px',
					 right: hand.width() / ratioX + 'px',
					 opacity: elem == handRight ? 0 : 1
				 });
	}

	function shiftSecondPicture(pic) {
		if (!pic) {
			pic = slider.children().not('.slider-pic--active');
		}

		pic[0].onload = function() {
			pic.css({
						right: '-' + secondPicture.width() + 'px'
					});
		};
	}

	function slideNextPicture() {
		let source = 'https://source.unsplash.com/',
			size = '/270x480',
			picId,
			firstPicture = slider.children(':first-child'),
			secondPicture = slider.children(':last-child');

		if (firstPicture.hasClass('slider-pic--active')) {
			//пока глазеем на новую картинку, подгружается вторая
			changePicture(firstPicture, secondPicture);
		} else {
			changePicture(secondPicture, firstPicture);
		}

		function changePicture(pic1, pic2) {
			unsplash.photos.getRandomPhoto().then(toJson).then(json => {
				picId = json.id;
			pic1.attr('src', source + picId + size);
		});
			pic1.removeClass('slider-pic--active');
			pic2.addClass('slider-pic--active');
			//shiftSecondPicture(pic1);
		}
	}

	function triggerHandRight() {
		handRight.addClass('hand-right--motion');
		setTimeout(function() {
			handRight.removeClass('hand-right--motion');
		}, 2000); //время выполнения анимации
	}

	function addClassToBullet(bullet) {
		return bullet
			.addClass('bullet--active')
			.siblings()
			.removeClass('bullet--active');
	}

	function setNextBullet() {
		let bul = $('.bullet--active');
		if (bul.next().length > 0) {
			return addClassToBullet(bul.next());
		}
		return addClassToBullet(bul.siblings(':first-child'));
	}
});