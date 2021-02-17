/*
* 📣 : After Page Load
*/
//

jQuery(function() {

	jQuery("table").wrap("<div class='table-responsive'></div>");

	fullLoader.init();
	renderCartIcon();

	// var filterizd = jQuery(".filtr-container").filterizr({
	// 	//options object
	// });
	// jQuery(".library--filters ul li a").click(function() {
	// 	jQuery(this)
	// 		.parent()
	// 		.addClass("active")
	// 		.siblings()
	// 		.removeClass("active");
	// });
	jQuery('.custom_upload input[type="file"]').on("change", function() {
		//on file input change
		var f_val = jQuery(this).val();
		var test = f_val.split("\\");
		jQuery(this)
			.parents(".custom_upload")
			.find(".f_name")
			.text(test[2]);
	});

	/*var serviceName = jQuery(".service__title").text();
    jQuery(".service").val(serviceName);
    */
	// jQuery('.custom_upload input[type=file]').change(function () {
	//     jQuery(this).parent().find('.f_name').text(jQuery(this).val());
	// });

	jQuery(".chat-close").click(function() {
		jQuery(".chat-box").removeClass("open");
		jQuery(".chat-opener").removeClass("active");
	});
	if (jQuery(window).innerWidth() <= 1199) {
		jQuery(".mega-item").css("position", "relative");
	} else {
	}
	if (jQuery(window).innerWidth() <= 992) {
		jQuery(".menu-item-has-children ").click(function() {
			jQuery(this).toggleClass("open");
			jQuery(this)
				.siblings("li")
				.removeClass("open");
		});
	} else {
	}

	jQuery(".search-close").click(function() {
		jQuery(".header__search").removeClass("active");
		jQuery(".search-box").removeClass("open");
	});
	jQuery(".offer-wrap").slick({
		infinite: true,
		slidesToShow: 4,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1
				}
			},
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					adaptiveHeight: true
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					adaptiveHeight: true,
					arrows: false,
					dots: true
				}
			}
		]
	});
	jQuery(".htesti-content").slick({
		infinite: true,
		slidesToShow: 3,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 992,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
					adaptiveHeight: true
				}
			},
			{
				breakpoint: 768,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
					adaptiveHeight: true,
					arrows: false,
					dots: true
				}
			}
		]
	});
});

function renderCartIcon() {
	var cartItemCount = sessionStorage.getItem("cartItem");
	if (cartItemCount != null) {
		jQuery("#cartItemCount")
			.html(cartItemCount)
			.css("display", "inline-flex");
	} else {
		jQuery("#cartItemCount").hide();
	}
}
