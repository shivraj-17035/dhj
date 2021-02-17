// Sticky js
//var Sticky = require("sticky-js");

//Toggle
var toggle = {
	data: {},
	el: {},

	init: function() {
		var _this = this;
		_this.bindUIActions();
	},

	bindUIActions: function() {
		var _this = this;

		jQuery(document).on("click", "[data-toggle]", function() {
			_this.open(jQuery(this));
		});

		jQuery(document).mouseup(function(e) {
			_this.checkOther(e);
		});
	},

	open: function(ele) {
		//Setting Parameters
		var toOpen;
		var toFocus;
		var nearest;
		var bodyOverflow;

		if (ele.data("focus")) {
			toFocus = jQuery(ele.data("focus"));
		}
		if (ele.data("toggle")) {
			toOpen = jQuery(ele.data("toggle"));
		}
		if (ele.data("scroll")) {
			bodyOverflow = ele.data("scroll");
		}
		if (ele.data("nearest")) {
			nearest = ele.data("nearest");
		}

		//If element is in active state.
		if (ele.hasClass("active")) {
			ele.removeClass("active");
			if (toOpen && nearest != null) {
				ele
					.parent()
					.find(ele.data("toggle"))
					.removeClass("open");
			} else if (toOpen) {
				toOpen.removeClass("open");
			}
			if (toFocus) {
				toFocus.blur();
			}
			if (bodyOverflow) {
				jQuery("body").css({
					overflow: "initial"
				});
			}
		} else {
			//If element is in normal state
			//Close all other togglers
			//jQuery('[data-toggle]').not(ele).removeClass('active');
			//jQuery('[data-autoclose]').not(toOpen).removeClass('open');

			ele.addClass("active");
			if (toOpen && nearest != null) {
				ele
					.parent()
					.find(ele.data("toggle"))
					.addClass("open");
			} else if (toOpen) {
				toOpen.addClass("open");
			} else {
				console.log("Please define toggle element!");
			}

			if (toFocus) {
				toFocus.focus();
			}
			if (bodyOverflow) {
				jQuery("body").css({
					overflow: "hidden"
				});
			}
		}
	},

	checkOther: function(e) {
		var toggler = jQuery("[data-toggle]");
		toggler.each(function() {
			var _this = jQuery(this);
			var toOpen = jQuery(_this.data("toggle"));
			var bodyOverflow = _this.data("scroll");
			var autoClose = _this.data("autoclose");
			if (
				!_this.is(e.target) &&
				_this.has(e.target).length === 0 &&
				!toOpen.is(e.target) &&
				toOpen.has(e.target).length === 0
			) {
				if (autoClose != null) {
					toOpen.removeClass("open");
					_this.removeClass("active");
				}
				if (bodyOverflow) {
					jQuery("body").css({
						overflow: "initial"
					});
				}
			}
		});
	}
};

//Popup
var popup = {
	el: {},

	data: {
		currentPopup: []
	},

	init: function(settings) {
		var _this = this;

		_this.bindUIActions();
		if (settings) {
			_this.data.settings = settings;
		}

		//Check URL for poup id
		if (window.location.hash) {
			_this.open(window.location.hash.replace("#", ""));
		}
	},

	bindUIActions: function() {
		var _this = this;

		//When clicked on opener
		jQuery(document).on("click", "[data-popup]", function() {
			if (jQuery(this).data("popup")) {
				var settings = {};
				if (jQuery(this).data("popup-autoclose")) {
					settings.autoclose = true;
				}
				_this.open(jQuery(this).data("popup"), settings);
			} else {
				alert("Please provide popup Id.");
			}
		});

		//When clicked on close
		jQuery(document).on("click", ".popup__close", function() {
			_this.close(
				jQuery(this)
					.parents(".popup")
					.attr("id")
			);
		});

		//Clicked outside popup
		jQuery(document).mouseup(function(e) {
			_this.autoclose(e);
		});

		//Key Up
		jQuery(document).keyup(function(e) {
			_this.autoclose(e);
		});
	},

	autoclose: function(e) {
		var _this = this;
		if (_this.data.currentPopup.length > 0) {
			var popupID =
				_this.data.currentPopup[_this.data.currentPopup.length - 1];
			if (jQuery("#" + popupID).hasClass("popup--autoclose")) {
				var container = jQuery(".popup__wrap");
				if (
					!container.is(e.target) &&
					container.has(e.target).length === 0
				) {
					_this.close();
				} else if (e.keyCode == 27) {
					_this.close();
				}
			}
		}
	},

	open: function(popupID, settings) {
		var _this = this;
		var popupObj = jQuery("#" + popupID);
		if (popupObj.length > 0) {
			_this.data.currentPopup.push(popupID);
			popupObj
				.css("z-index", 99 + _this.data.currentPopup.length)
				.addClass("open");
			popupObj.find(".popup_focus").focus();
			stateID = jQuery("#js__package_state_dd option:selected").val();
			employee = jQuery("#js__employees").val();
			noOfMonth = jQuery("#js__months").val();
			if (stateID != 0 && (employee != "" && noOfMonth != 0)) {
				jQuery("body").addClass("popup__is-open");
			}
			if (settings && settings.autoclose) {
				popupObj.addClass("popup--autoclose");
			}
			if (_this.data.settings && _this.data.settings.afterOpen) {
				_this.data.settings.afterOpen(popupID);
			}
		}
	},

	close: function(popupID) {
		var _this = this;
		//If popupid is not defined set the last opened popup
		if (!popupID) {
			popupID =
				_this.data.currentPopup[_this.data.currentPopup.length - 1];
		}
		var popupObj = jQuery("#" + popupID);
		if (popupObj.length > 0) {
			var popupIndex = _this.data.currentPopup.indexOf(popupID);
			_this.data.currentPopup.splice(popupIndex, 1);
			popupObj.removeClass("open popup--autoclose");
			//popupObj.removeClass('open').css('z-index',-1);

			jQuery("body").removeClass("popup__is-open");

			if (_this.data.settings && _this.data.settings.afterClose) {
				_this.data.settings.afterClose(popupID);
			}
		} else {
			alert("Popup Not Found!");
		}
	}
};

//easyTabs

// Easy Responsive Tabs Plugin
// Author: Samson.Onna <Email : samson3d@gmail.com>
(function(jQuery) {
	jQuery.fn.extend({
		easyResponsiveTabs: function(options) {
			//Set the default values, use comma to separate the settings, example:
			var defaults = {
				type: "default", //default, vertical, accordion;
				width: "auto",
				fit: true,
				closed: false,
				tabidentify: "",
				activetab_bg: "white",
				inactive_bg: "#F5F5F5",
				active_border_color: "#c1c1c1",
				active_content_border_color: "#c1c1c1",
				activate: function() {}
			};
			//Variables
			var options = jQuery.extend(defaults, options);
			var opt = options,
				jtype = opt.type,
				jfit = opt.fit,
				jwidth = opt.width,
				vtabs = "vertical",
				accord = "accordion";
			var hash = window.location.hash;
			var historyApi = !!(window.history && history.replaceState);

			//Events
			jQuery(this).bind("tabactivate", function(e, currentTab) {
				if (typeof options.activate === "function") {
					options.activate.call(currentTab, e);
				}
			});

			//Main function
			this.each(function() {
				var jQueryrespTabs = jQuery(this);
				var jQueryrespTabsList = jQueryrespTabs.find(
					"ul.resp-tabs-list." + options.tabidentify
				);
				var respTabsId = jQueryrespTabs.attr("id");
				jQueryrespTabs
					.find("ul.resp-tabs-list." + options.tabidentify + " li")
					.addClass("resp-tab-item")
					.addClass(options.tabidentify);
				jQueryrespTabs.css({
					display: "block",
					width: jwidth
				});

				if (options.type == "vertical")
					jQueryrespTabsList.css("margin-top", "3px");

				jQueryrespTabs
					.find(".resp-tabs-container." + options.tabidentify)
					.css("border-color", options.active_content_border_color);
				jQueryrespTabs
					.find(
						".resp-tabs-container." + options.tabidentify + " > div"
					)
					.addClass("resp-tab-content")
					.addClass(options.tabidentify);
				jtab_options();
				//Properties Function
				function jtab_options() {
					if (jtype == vtabs) {
						jQueryrespTabs
							.addClass("resp-vtabs")
							.addClass(options.tabidentify);
					}
					if (jfit == true) {
						jQueryrespTabs.css({ width: "100%", margin: "0px" });
					}
					if (jtype == accord) {
						jQueryrespTabs
							.addClass("resp-easy-accordion")
							.addClass(options.tabidentify);
						jQueryrespTabs
							.find(".resp-tabs-list")
							.css("display", "none");
					}
				}

				//Assigning the h2 markup to accordion title
				var jQuerytabItemh2;
				jQueryrespTabs
					.find(".resp-tab-content." + options.tabidentify)
					.before(
						"<h2 class='resp-accordion " +
							options.tabidentify +
							"' role='tab'><span class='resp-arrow'></span></h2>"
					);

				jQueryrespTabs
					.find(".resp-tab-content." + options.tabidentify)
					.prev("h2")
					.css({
						"background-color": options.inactive_bg,
						"border-color": options.active_border_color
					});

				var itemCount = 0;
				jQueryrespTabs.find(".resp-accordion").each(function() {
					jQuerytabItemh2 = jQuery(this);
					var jQuerytabItem = jQueryrespTabs.find(
						".resp-tab-item:eq(" + itemCount + ")"
					);
					var jQueryaccItem = jQueryrespTabs.find(
						".resp-accordion:eq(" + itemCount + ")"
					);
					jQueryaccItem.append(jQuerytabItem.html());
					jQueryaccItem.data(jQuerytabItem.data());
					jQuerytabItemh2.attr(
						"aria-controls",
						options.tabidentify + "_tab_item-" + itemCount
					);
					itemCount++;
				});

				//Assigning the 'aria-controls' to Tab items
				var count = 0,
					jQuerytabContent;
				jQueryrespTabs.find(".resp-tab-item").each(function() {
					jQuerytabItem = jQuery(this);
					jQuerytabItem.attr(
						"aria-controls",
						options.tabidentify + "_tab_item-" + count
					);
					jQuerytabItem.attr("role", "tab");
					jQuerytabItem.css({
						"background-color": options.inactive_bg,
						"border-color": "none"
					});

					//Assigning the 'aria-labelledby' attr to tab-content
					var tabcount = 0;
					jQueryrespTabs
						.find(".resp-tab-content." + options.tabidentify)
						.each(function() {
							jQuerytabContent = jQuery(this);
							jQuerytabContent
								.attr(
									"aria-labelledby",
									options.tabidentify +
										"_tab_item-" +
										tabcount
								)
								.css({
									"border-color": options.active_border_color
								});
							tabcount++;
						});
					count++;
				});

				// Show correct content area
				var tabNum = 0;
				if (hash != "") {
					var matches = hash.match(
						new RegExp(respTabsId + "([0-9]+)")
					);
					if (matches !== null && matches.length === 2) {
						tabNum = parseInt(matches[1], 10) - 1;
						if (tabNum > count) {
							tabNum = 0;
						}
					}
				}

				//Active correct tab
				jQuery(
					jQueryrespTabs.find(
						".resp-tab-item." + options.tabidentify
					)[tabNum]
				)
					.addClass("resp-tab-active")
					.css({
						"background-color": options.activetab_bg,
						"border-color": options.active_border_color
					});

				//keep closed if option = 'closed' or option is 'accordion' and the element is in accordion mode
				if (
					options.closed !== true &&
					!(
						options.closed === "accordion" &&
						!jQueryrespTabsList.is(":visible")
					) &&
					!(
						options.closed === "tabs" &&
						jQueryrespTabsList.is(":visible")
					)
				) {
					jQuery(
						jQueryrespTabs.find(
							".resp-accordion." + options.tabidentify
						)[tabNum]
					)
						.addClass("resp-tab-active")
						.css({
							"background-color":
								options.activetab_bg + " !important",
							"border-color": options.active_border_color,
							background: "none"
						});

					jQuery(
						jQueryrespTabs.find(
							".resp-tab-content." + options.tabidentify
						)[tabNum]
					)
						.addClass("resp-tab-content-active")
						.addClass(options.tabidentify)
						.attr("style", "display:block");
				} else {
					//assign proper classes for when tabs mode is activated before making a selection in accordion mode
					// jQuery(jQueryrespTabs.find('.resp-tab-content.' + options.tabidentify)[tabNum]).addClass('resp-accordion-closed'); //removed resp-tab-content-active
				}

				//Tab Click action function
				jQueryrespTabs.find("[role=tab]").each(function() {
					var jQuerycurrentTab = jQuery(this);
					jQuerycurrentTab.click(function() {
						var jQuerycurrentTab = jQuery(this);
						var jQuerytabAria = jQuerycurrentTab.attr(
							"aria-controls"
						);

						if (
							jQuerycurrentTab.hasClass("resp-accordion") &&
							jQuerycurrentTab.hasClass("resp-tab-active")
						) {
							jQueryrespTabs
								.find(
									".resp-tab-content-active." +
										options.tabidentify
								)
								.slideUp("", function() {
									jQuery(this).addClass(
										"resp-accordion-closed"
									);
								});
							jQuerycurrentTab
								.removeClass("resp-tab-active")
								.css({
									"background-color": options.inactive_bg,
									"border-color": "none"
								});
							return false;
						}
						if (
							!jQuerycurrentTab.hasClass("resp-tab-active") &&
							jQuerycurrentTab.hasClass("resp-accordion")
						) {
							jQueryrespTabs
								.find(".resp-tab-active." + options.tabidentify)
								.removeClass("resp-tab-active")
								.css({
									"background-color": options.inactive_bg,
									"border-color": "none"
								});
							jQueryrespTabs
								.find(
									".resp-tab-content-active." +
										options.tabidentify
								)
								.slideUp()
								.removeClass(
									"resp-tab-content-active resp-accordion-closed"
								);
							jQueryrespTabs
								.find("[aria-controls=" + jQuerytabAria + "]")
								.addClass("resp-tab-active")
								.css({
									"background-color": options.activetab_bg,
									"border-color": options.active_border_color
								});

							jQueryrespTabs
								.find(
									".resp-tab-content[aria-labelledby = " +
										jQuerytabAria +
										"]." +
										options.tabidentify
								)
								.slideDown()
								.addClass("resp-tab-content-active");
						} else {
							console.log("here");
							jQueryrespTabs
								.find(".resp-tab-active." + options.tabidentify)
								.removeClass("resp-tab-active")
								.css({
									"background-color": options.inactive_bg,
									"border-color": "none"
								});

							jQueryrespTabs
								.find(
									".resp-tab-content-active." +
										options.tabidentify
								)
								.removeAttr("style")
								.removeClass("resp-tab-content-active")
								.removeClass("resp-accordion-closed");

							jQueryrespTabs
								.find("[aria-controls=" + jQuerytabAria + "]")
								.addClass("resp-tab-active")
								.css({
									"background-color": options.activetab_bg,
									"border-color": options.active_border_color
								});

							jQueryrespTabs
								.find(
									".resp-tab-content[aria-labelledby = " +
										jQuerytabAria +
										"]." +
										options.tabidentify
								)
								.addClass("resp-tab-content-active")
								.attr("style", "display:block");
						}
						//Trigger tab activation event
						jQuerycurrentTab.trigger(
							"tabactivate",
							jQuerycurrentTab
						);

						//Update Browser History
						if (historyApi) {
							var currentHash = window.location.hash;
							var tabAriaParts = jQuerytabAria.split("tab_item-");
							// var newHash = respTabsId + (parseInt(jQuerytabAria.substring(9), 10) + 1).toString();
							var newHash =
								respTabsId +
								(parseInt(tabAriaParts[1], 10) + 1).toString();
							if (currentHash != "") {
								var re = new RegExp(respTabsId + "[0-9]+");
								if (currentHash.match(re) != null) {
									newHash = currentHash.replace(re, newHash);
								} else {
									newHash = currentHash + "|" + newHash;
								}
							} else {
								newHash = "#" + newHash;
							}

							history.replaceState(null, null, newHash);
						}
					});
				});

				//Window resize function
				jQuery(window).resize(function() {
					jQueryrespTabs
						.find(".resp-accordion-closed")
						.removeAttr("style");
				});
			});
		}
	});
})(jQuery);
jQuery(".descl__tab").easyResponsiveTabs({ tabidentify: "vert" });
/*
* 📣 : After Page Load
*/
jQuery(function() {
	toggle.init();
	popup.init();

	var fixHeader = 320;
	jQuery(window).scroll(function() {
		var scroll = getCurrentScroll();
		if (scroll >= fixHeader) {
			jQuery(".header").addClass("fixed");
		} else {
			jQuery(".header").removeClass("fixed");
		}
	});

	function getCurrentScroll() {
		return window.pageYOffset || document.documentElement.scrollTop;
	}

	jQuery(".htesti-content").slick({
		slidesToShow: 3,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		responsive:[
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow:1,
					slidesToScroll:1,
					arrows:false,
					dots:true
				}
			}
		]
	});
	jQuery(".offer-wrap").slick({
		slidesToShow: 4,
		slidesToScroll: 1,
		arrows: true,
		dots: false,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 568,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					arrows: false,
					dots: true
				}
			}
		]
	});
	jQuery(".upev").slick({
		slidesToShow: 6,
		slidesToScroll: 6,
		arrows: true,
		dots: false,
		infinite: false,
		responsive: [
			{
				breakpoint: 1200,
				settings: {
					slidesToShow: 5,
					slidesToScroll: 5
				}
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 4
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 520,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	});
	//toogle
	jQuery(document).mouseup(function(e) {
		var container = jQuery(".closethis");

		if (!container.is(e.target) && container.has(e.target).length === 0) {
			container.removeClass("open");
		}
	});
});
