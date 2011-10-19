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
	  */
	imgScroll: function (elem, slideClass, intervalTime, animTime) {
		var win = window,
			imgBox = $(elem),
			width = imgBox.find("img").width(),
			currIndex = 0,
			count = imgBox.find("img").length,
			timer = 0,
			start,
			stop,
			initSlide,
			bindEvent;
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

			imgBox.find(":first-child").clone().appendTo(imgBox); // Add the first images after the images list for the animation, any better ways?
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
					imgBox.css("left", -currIndex * width);
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
			var slideList = $("." + slideClass + " li");

			timer = win.setInterval(function () {
				if (currIndex !== count - 1) {
					$(slideList[currIndex]).removeClass("active");
					currIndex = currIndex + 1;
					$(slideList[currIndex]).addClass("active");
					imgBox.animate({"left": "-=" + width}, animTime);
				} else {
					currIndex = 0;
					$(slideList[count - 1]).removeClass("active");
					$(slideList[currIndex]).addClass("active");
					imgBox.animate({"left": "-=" + width}, animTime, function () {
						imgBox.css("left", 0);
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