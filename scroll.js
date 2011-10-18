/*global $, window: true */
/**
 * @fileoverview This file is used as a plugin of scrolling images
 * @author Roger Huang
 * @version 0.1
 */

/**
  * @description The object of Scroll.
  * @requires jQuery.
  * @param elem: the element contain the images.
  * @param slideClass: the class name of the slide, it's defined by user.
  * @param intervalTime: the interval time.
  * @param animTime: the animate time.
  */
var Scroll = function (elem, slideClass, intervalTime, animTime) {
	this.width = $(window).width();
	this.imgBox = $(elem);
	this.slideClass = slideClass;
	this.currIndex = 0;
	this.count = this.imgBox.find("img").length;
	this.timer = 0;
	this.intervalTime = intervalTime;
	this.animTime = animTime;
};
Scroll.prototype = {
	/**
	 * The interface function for user
	 * Including initialize the slide box, initialize the timer and band events.
	 */
	enable: function () {
		this.initSlide();
		this.start();
		this.bindEvent();
	},
	/**
	 * Start the timer
	 * You can use the function to start the timer outside.
	 */
	start: function () {
		var self = this,
			slideList = $("." + this.slideClass + " li");

		self.timer = window.setInterval(function () {
			if (self.currIndex !== self.count - 1) {
				$(slideList[self.currIndex]).removeClass("active");
				self.currIndex = self.currIndex + 1;
				$(slideList[self.currIndex]).addClass("active");
				self.imgBox.animate({"left": "-=" + self.width}, self.animTime);
			} else {
				self.currIndex = 0;
				$(slideList[self.count - 1]).removeClass("active");
				$(slideList[self.currIndex]).addClass("active");
				self.imgBox.animate({"left": "-=" + self.width}, self.animTime, function () {
					self.imgBox.css("left", 0);
				});
			}
		}, self.intervalTime);
	},
	/**
	 * Stop the timer
	 * You can use the function to stop the timer outside.
	 */
	stop: function () {
		window.clearInterval(this.timer);
	},
	/**
	 * Initialize the slide box
	 * Including create the slide box and append it after the images box.
	 */
	initSlide: function () {
		var self = this,
			template = [],
			slideWidth = 0,
			i,
			slideBox,
			slideList;

		self.imgBox.find(":first-child").clone().appendTo(self.imgBox); // Add the first images after the images list for the animation, any better ways?
		template.push("<ul class='" + self.slideClass + "'>");
		for (i = 0; i < self.count; i = i + 1) {
			if (i) {
				template.push("<li>0" + (i + 1) + ".</li>");
			} else {
				template.push("<li class='active'>0" + (i + 1) + ".</li>");
			}
		}
		template.push("</ul>");
		$(template.join("")).insertAfter(self.imgBox);
		slideBox = $("." + self.slideClass);
		slideList = slideBox.find("li");
		slideList.last().css("border", "none");
		slideWidth = window.parseInt(slideBox.css("width"));
		slideBox.css("left", ($(window).width() - slideWidth) / 2);
		slideList.css("width", slideWidth / self.count - self.count + 1);
	},
	/**
	 * Bind events
	 * Including click event for the slide list, mouseover event and mouseout event for the images list
	 */
	bindEvent: function () {
		var self = this,
			slideList = $(".slide li");

		$.each(slideList, function (index, elem) {
			$(elem).bind("click", function () {
				$(slideList[self.currIndex]).removeClass("active");
				self.currIndex = index;
				$(slideList[self.currIndex]).addClass("active");
				self.imgBox.stop();
				self.imgBox.css("left", -self.currIndex * self.width);
			});
		});
		this.imgBox.delegate("img", "mouseover", function () {
			self.stop();
		});
		this.imgBox.delegate("img", "mouseout", function () {
			self.start(); // Continue the timer by create a new interval, any beter ways?
		});
	}
};