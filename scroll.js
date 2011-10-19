/*global $, jQuery, window: true */
/**
 * @fileoverview This file is used as a plugin of scrolling images
 * @author Roger Huang
 * @version 0.1
 */
jQuery.extend({
	/**
	  * @description The object of Scroll.
	  * @requires jQuery.
	  * @param elem: the element contain the images.
	  * @param slideClass: the class name of the slide, it's defined by user.
	  * @param intervalTime: the interval time.
	  * @param animTime: the animate time.
	  * @param isTop: if true, scroll vertically, otherwise, scroll horizontally.
	  */
	imgScroll: function (elem, slideClass, intervalTime, animTime, isTop) {
		var win = window,
			imgBox = $(elem),
			img = imgBox.find("img"),
			width = win.screen.width,
			height = imgBox.height(),
			currIndex = 0,
			count = img.length,
			timer = 0,
			direction = "",
			distance = 0,
			styles = {},
			start,
			stop,
			initImages,
			initDirection,
			initSlide,
			bindEvent;

		initImages = function () {
			imgBox.parent(".wrapper").css("width", width);
			img.css({
				"width": width,
				"height": height
			});
		};
		initDirection = function () {
			if (isTop) {
				imgBox.addClass("isTop");
				direction = "top";
				distance = height;
				styles = {"top": "-=" + distance};
			} else {
				direction = "left";
				distance = width;
				styles = {"left": "-=" + distance};
			}
		};
		/**
		 * Initialize the slide box
		 * Including create the slide box and append it after the images box.
		 */
		initSlide = function () {
			var template = [],
				slideWidth = 0,
				i,
				slideBox,
				slideList;

			template.push("<ul class='" + slideClass + "'>");
			for (i = 0; i < count; i = i + 1) {
				if (i) {
					template.push("<li>0" + (i + 1) + ".</li>");
				} else {
					template.push("<li class='active'>0" + (i + 1) + ".</li>");
				}
			}
			template.push("</ul>");
			$(template.join("")).insertAfter(imgBox);
			slideBox = $("." + slideClass);
			slideList = slideBox.find("li");
			slideList.last().css("border", "none");
			slideWidth = win.parseInt(slideBox.css("width"));
			slideBox.css("left", (width - slideWidth) / 2);
			slideList.css("width", slideWidth / count - count + 1);
		};
		/**
		 * Bind events
		 * Including click event for the slide list, mouseover event and mouseout event for the images list
		 */
		bindEvent = function () {
			var slideList = $(".slide li");

			$.each(slideList, function (index, elem) {
				$(elem).bind("click", function () {
					$(slideList[currIndex]).removeClass("active");
					currIndex = index;
					$(slideList[currIndex]).addClass("active");
					imgBox.stop();
					imgBox.css(direction, -currIndex * distance);
				});
			});
			imgBox.delegate("img", "mouseover", function () {
				stop();
			});
			imgBox.delegate("img", "mouseout", function () {
				start(); // Continue the timer by create a new interval, any beter ways?
			});
		};
		/**
		 * Start the timer
		 * You can use the function to start the timer outside.
		 */
		start = function () {
			var slideList = $("." + slideClass + " li"),
				firstImg = imgBox.find("img").first();

			timer = win.setInterval(function () {
				if (currIndex !== count - 1) {
					$(slideList[currIndex]).removeClass("active");
					currIndex = currIndex + 1;
					$(slideList[currIndex]).addClass("active");
					imgBox.animate(styles, animTime);
				} else {
					currIndex = 0;
					$(slideList[count - 1]).removeClass("active");
					$(slideList[currIndex]).addClass("active");
					firstImg.css(direction, count * distance);
					imgBox.animate(styles, animTime, function () {
						imgBox.css(direction, 0);
						firstImg.css(direction, 0);
					});
				}
			}, intervalTime);
		};
		/**
		 * Stop the timer
		 * You can use the function to stop the timer outside.
		 */
		stop = function () {
			win.clearInterval(timer);
		};
		return {
			/**
			 * The interface function for user
			 * Including initialize the slide box, initialize the timer and band events.
			 */
			enable: function () {
				initImages();
				initDirection();
				initSlide();
				start();
				bindEvent();
			},
			stop: function () {
				stop();
			},
			start: function () {
				start();
			}
		};
	}
});