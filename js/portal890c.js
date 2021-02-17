var packageID = 0;
var stateID = 0;
var cart_img = {
	"template_directory_uri": "https://ebizfiling.ga/wp-content/themes/ebizfiling-v2"
};
jQuery(function () {
	if (
		sessionStorage.token &&
		sessionStorage.token != "" &&
		sessionStorage.orderId
	) {
		var order = jQuery.parseJSON(sessionStorage.orderId);
		if (order) {
			getCartDetail(sessionStorage.token, order, function (data) {
				if (data["status"]) {
					renderCart(data);
				} else {
					if (
						data["is_payment_completed"] == true &&
						data["status"] == false
					) {
						// Display order payment complete.
						renderPaymentComplete();
					} else {
						renderBlankCart();
					}
					sessionStorage.removeItem("orderId");
					sessionStorage.removeItem("token");
					sessionStorage.removeItem("cartItem");
					sessionStorage.removeItem("userDetail");
					renderCartIcon();
				}
			});
		}
	} else {
		renderBlankCart();
	}

	function getCartDetail(token, orderId, callback = "") {
		jQuery.ajax({
			type: "get",
			url: ajaxURL,
			data: {
				action: "cart_detail",
				token: token,
				orders: orderId
			},
			dataType: "JSON",
			success: function (response) {
				//console.log(response);
				if (response["status"]) {
					if (callback != "") {
						callback(response["data"]);
					} else {
						return reponse["data"];
					}
				}
			},
			error: function (xhr) {
				//console.log(xhr);
			}
		});
	}

	function renderCart(data) {
		var html = "";
		var orderId = [];
		html +=
			'<input type="hidden" name="token" value="' +
			sessionStorage.token +
			'">';
		html += '<div class="confirm-cart" id="js__cart">';
		html += '<ul class="confirm ul-reset">';
		html += "<li>";
		html += '<div class="cart-header">';
		html += '<div class="cart-order">';
		html += '<label for="">Order ID:</label>';
		$.each(data["order"], function (key, val) {
			html += "<p>" + val["order_code"] + "</p>";
		});
		html += "</div>";
		html += '<ul class="cart-info">';
		if (data["user"]["first_name"] != "") {
			html += "<li>";
			html += '<label for="">Name:</label>';
			html += "<p>" + data["user"]["first_name"] + "</p>";
			html += "</li>";
		}
		if (data["user"]["email"] != "") {
			html += "<li>";
			html += '<label for="">Email:</label>';
			html += "<p>" + data["user"]["email"] + "</p>";
			html += "</li>";
		}
		if (data["user"]["mobile_no"] != "") {
			html += "<li>";
			html += '<label for="">Phone:</label>';
			html += "<p>" + data["user"]["mobile_no"] + "</p>";
			html += "</li>";
		}
		html += "</ul>";
		html += "</div>";
		html += "</li>";
		html += "<li>";
		html += '<ul class="cart-listing ul-reset">';
		html += "<li>";
		html += '<ul class="cart-heading ul-reset">';
		html += "<li>";
		html += '<label for="">Service Name</label>';
		html += "</li>";
		html += "<li>";
		html += '<label for="">Service Price(INR)</label>';
		html += "</li>";
		html += "</ul>";
		html += "</li>";
		html += "<li>";
		$.each(data["order"], function (key, val) {
			orderId.push(val["id"]);
			var count = 0;
			$.each(val["details"], function (index, value) {
				count++;
				html += '<ul class="ul-reset item-box">';
				html += "<li>";
				html +=
					"<p>" +
					value["service"] +
					" (" +
					value["name"] +
					")" +
					"</p>";
				html += "</li>";
				html += "<li>";
				html += '<div class="item-price-box">';
				html += '<div class="item-price">';
				if (value["coupon_code"] != null) {
					html +=
						'<div class="price__box"> ' +
						"<span><strike>" +
						value["price"] +
						"</strike></span>";
					html +=
						"<span>" +
						(value["price"] - value["discount"]) +
						"</span>";
					html += "</div>";
					html += '<div class="coupon__message">';
					html +=
						'<p>(coupon code "' +
						value["coupon_code"] +
						'" applied)</p>';
					html += "</div>";
				} else {
					html +=
						'<div class="price__box"> ' +
						"<span>" +
						value["price"] +
						"</span></div>";
				}
				html += "</div>";
				html += '<div class="item-cancel">';
				html +=
					"<a href='#nogo' class='order-close js__delete_order' data-order-id='" +
					val["id"] +
					"' data-detail-id='" +
					value["id"] +
					"'>";
				html += "<i class='material-icons'>close</i>";
				html += "</a>";
				html += "</div>";
				html += "</div>";
				html += "</li>";
				html += "</ul>";
			});
			sessionStorage.setItem("cartItem", count);
			renderCartIcon();
		});
		html += "</li>";
		html += '<li class="cart-total">';
		html += '<div class="cart-total-box">';
		html += '<label for="">Total:</label>';
		html +=
			'<p class="confirm-price grand-price">' +
			data["grand_total"] +
			"</p>";
		html += '</div">';
		html += "</li>";
		html += '<li class="cart-bottom">';
		html += '<div class="promocode-box">';
		html += '<label for="">Promo Code:</label>';
		html += '<div class="promo">';
		html += '<input type="text" id="js__coupon_code" name="" value="">';
		html +=
			'<a href="javascript:;" class="button button--amber js__apply_coupon_code">Apply</a>';
		html += "</div>";
		$.each(data["order"], function (key1, val1) {
			if (
				jQuery("#js__coupon_code").val() &&
				val1["coupon_code"].indexOf(jQuery("#js__coupon_code").val()) >
				-1
			) {
				html += "<p>Coupon code applied.</p>";
			} else if (
				jQuery("#js__coupon_code").val() &&
				!(
					val1["coupon_code"].indexOf(
						jQuery("#js__coupon_code").val()
					) > -1
				)
			) {
				html += '<p style="color:red;">Invalid coupon code.</p>';
			}
		});
		html += "</div>";
		html += '<div class="cart-checkout">';
		html +=
			'<input type="hidden" name="order_id" value="' +
			JSON.stringify(orderId) +
			'">';
		html +=
			'<button type="submit" class="button button--amber but--comfirm js__make_payment">Confirm & Submit</button>';
		html += "</div>";
		html += "</li>";
		html += "<li>";
		html +=
			"<img src='" +
			cart_img.template_directory_uri +
			"/img/checkout-cover.png' class='checkout-img'>";
		html += "</li>";
		html += "</ul>";
		html += "</li>";
		html += "</ul>";
		html += "<br>";
		//html += '<div class="or-wrap">';
		//html += '<span>or</span>';
		//html += '</div>';
		//html += '<div class="add-more">';
		//html +=
		//'<a href="' +
		//siteURL +
		//'" class="button button--primary">I want to add more services</a>';
		//html += '</div>';
		html += "</div>";

		jQuery(".js__cart").html(html);
	}

	/*remove package from cart*/
	jQuery(document).on("click", ".js__delete_order", function () {
		var orderId = JSON.parse(sessionStorage.getItem("orderId"));
		var id = $(this).data("order-id");
		var rst = {};
		var itemToDelete = [$(this).data("detail-id")];
		sessionStorage.setItem("orderId", JSON.stringify(orderId));
		var userDetails = {
			token: sessionStorage.token
		};
		rst["user_details"] = userDetails;
		rst["orders"] = orderId;
		rst["delete"] = itemToDelete;
		updateCart(JSON.parse(JSON.stringify(rst)));
	});

	/*apply coupon code*/
	jQuery(document).on("click", ".js__apply_coupon_code", function () {
		var orderId = JSON.parse(sessionStorage.getItem("orderId"));
		var rst = {};
		rst["user_details"] = {
			token: sessionStorage.token
		};
		rst["coupon_code"] = jQuery("#js__coupon_code").val();
		rst["orders"] = orderId;
		rst["apply"] = true;
		applyCouponCode(JSON.parse(JSON.stringify(rst)), function (data) {
			renderCart(data);
			return false;
		});
	});

	function renderPaymentComplete() {
		var html = "";
		html += '<div class="wrap">';
		html += '<div class="section">';
		html += '<div class="order-message order-error">';
		html += '<div class="order-success">';
		html +=
			'<img src="' +
			cart_img.template_directory_uri +
			'/img/done.png" class="done">';
		html += "<h3>Your payment is completed.</h3>";
		html += "</div>";
		html += "</div>";
		html += "</div>";
		html += "</div>";
		jQuery(".js__cart").html(html);
	}

	function renderBlankCart() {
		var html = "";
		html += '<div class="ss-container">';
		html += '<div class="zero-cart">';
		html += "<h4>0 Services in Cart</h4>";
		html += '<div class="zero-cart-img">';
		html +=
			'<img src="' +
			cart_img.template_directory_uri +
			'/img/cart-big.png">';
		html += "</div>";
		html += "<p>Your cart is empty. Keep shopping to find a course!</p>";
		html += '<div class="zero-cart-btn">';
		html +=
			'<a href="' +
			siteURL +
			'" class="button button--amber"> Keep Shopping </a>';
		html += "</div>";
		html += "</div>";
		html += "</div>";
		jQuery(".js__cart").html(html);
		sessionStorage.removeItem("cartItem");
		renderCartIcon();
	}

	function applyCouponCode(result) {
		//console.log("inside applyCouponCode");
		jQuery.ajax({
			type: "post",
			url: ajaxURL,
			data: {
				action: "apply_coupon",
				result: result
			},
			dataType: "JSON",
			success: function (response) {
				console.log(response);
				if (response["data"]["status"]) {
					renderCart(response["data"]);
				} else {
					if (
						response["data"]["is_payment_completed"] == true &&
						response["data"]["status"] == false
					) {
						renderPaymentComplete();
					} else {
						renderBlankCart();
					}
				}
			}
		});
	}

	function updateCart(result) {
		//console.log(result);
		jQuery.ajax({
			type: "post",
			url: ajaxURL,
			data: {
				action: "update_cart",
				result: result
			},
			dataType: "JSON",
			success: function (response) {
				if (response["data"]["status"] && response["data"]["order"]) {
					renderCart(response["data"]);
				} else {
					if (
						response["data"]["is_payment_completed"] == true &&
						response["data"]["status"] == false
					) {
						renderPaymentComplete();
					} else {
						renderBlankCart();
					}
				}
			}
		});
	}

	jQuery("#js__cart").submit(function (e) {
		//   if(sessionStorage.getItem('token'))
		//   {
		//     e.preventDefault();
		//     sessionStorage.removeItem('orderId');
		//     sessionStorage.removeItem('token');
		// }
		jQuery("#js__cart").submit();
	});

	jQuery("#service-enquiry-form").removeClass("popup");
	jQuery(".js__addpackages").on("click", function () {
		fullLoader.on({
			text: "Loading..."
		});
		packageID = $(this).data("package-id");
		var packages = packageObj.data;
		if (typeof packages !== "undefined") {
			var priceStrcture = packages.service.amount_type;
			if (priceStrcture == "state_wise") {
				stateID = jQuery("#js__package_state_dd option:selected").val();
				if (stateID == 0) {
					alert("Please select state.");
					fullLoader.off();
				} else {
					startAddToCartFlow();
				}
			} else if (priceStrcture == "fixed") {
				startAddToCartFlow();
				fullLoader.off();
			} else if (priceStrcture == "per_person_per_month") {
				var employee = jQuery("#js__employees").val();
				var noOfMonth = jQuery("#js__months option:selected").val();
				if (employee != "" && noOfMonth != "0") {
					startAddToCartFlow();
					fullLoader.off();
				} else {
					alert("Please select no of employee and months.");
				}
			}
		} else {
			alert("Something went wrong. Please reload page.");
		}
	});

	jQuery("#js__package_state_dd").on("change", function () {
		jQuery(".js__pacakge_price").each(function () {
			var $this = jQuery(this);
			var currentPackageId = $this.data("package-id");

			var currentSelectedState = jQuery(
				"#js__package_state_dd option:selected"
			).val();
			jQuery.each(packageObj.data.packages, function (index, value) {
				if (currentPackageId == value.id) {
					$this.html(value.state_wise[currentSelectedState]);
					return false;
				}
			});
		});
	});

	/*person_month structure*/
	function pricePackageChange(noofemp, noofmonth) {
		var packageObject = packageObj.data.packages;

		$.each(packageObject, function (index, value) {
			var price =
				noofemp * noofmonth * value.per_person_per_month[noofemp];
			var priceVal = price >= value.amount ? price : value.amount;
			console.log("priceVal==>" + priceVal);
			$("#js__price_" + value.id).html(priceVal);
		});
	}

	$("#js__months").on("change", function () {
		var noofemp = $("#js__employees").val();
		var noofmonth = $(this).val();
		console.log(noofemp);
		console.log(noofmonth);
		//$('.pkg-error').remove(); //To remove validation msg
		if (noofemp == "") {
			// 	$('#js__employees').after('<span class="pkg-error" style="color:#f00; font-size:11px; align:left">This is must required</span>');
			alert("Please enter number of empoyee");
		}
		pricePackageChange(noofemp, noofmonth);
	});

	$("#js__employees").on("blur", function () {
		var noofemp = $(this).val();
		var noofmonth = $("#js__months").val();
		// $('.pkg-error').remove(); //To remove validation msg
		// if(noofmonth == '0'){
		// 	//$('#js__months').after('<span class="pkg-error" style="color:#f00; font-size:11px; align:left">This is must required</span>');
		// 	alert("Please enter number of person");
		// }
		pricePackageChange(noofemp, noofmonth);
	});
	/*End-- person_month structure*/

	function startAddToCartFlow() {
		if (sessionStorage.token && sessionStorage.token != "") {
			//console.log("from token");

			var userDetails = {
				token: sessionStorage.token
			};
			//console.log(userDetails);
			var priceStrcture = packageObj.data.service.amount_type;
			if (priceStrcture == "per_person_per_month") {
				var orderDetails = [{
					package_id: packageID,
					number_of_person: jQuery("#js__employees").val(),
					months: jQuery("#js__months").val(),
					quantity: 1
				}];
				console.log(orderDetails);
			} else {
				var orderDetails = [{
					package_id: packageID,
					state_id: stateID,
					quantity: 1
				}];
			}

			var order = JSON.parse(sessionStorage.orderId);

			postOrder(userDetails, orderDetails, order);
		} else {
			if (sessionStorage.userDetail && sessionStorage.userDetail != "") {
				//Set value of popup form
				var UserData = JSON.parse(sessionStorage.userDetail);
				//console.log(UserData);

				jQuery("#user-name").val(UserData.first_name);
				jQuery("#user-email").val(UserData.email);
				jQuery("#user-phone").val(UserData.mobile_no);
				//Trigger form submit

				jQuery("#placeorder").trigger("submit");
			} else {
				//console.log("from popup");
				jQuery("#service-enquiry-form").addClass("popup");
				fullLoader.off();
			}
		}
	}

	jQuery.validator.addMethod(
		"customvalidation",
		function (value, element) {
			return (
				this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/)
			);
		},
		"Please enter only letters."
	);

	jQuery("#placeorder").validate({
		rules: {
			name: {
				required: true,
				customvalidation: true
			},
			email: {
				required: true,
				email: true
			},
			phone: {
				required: true,
				digits: true
			}
		},
		messages: {
			name: {
				required: "Your name is required."
			},
			email: {
				required: "Your email is required."
			},
			phone: {
				required: "Your phone is required."
			}
		},

		submitHandler: function (form) {
			fullLoader.on({
				text: "Loading..."
			});
			//event.preventDefault();
			//console.log("inside submitHandler");
			var uname = jQuery("#user-name").val();
			var email = jQuery("#user-email").val();
			var phone = jQuery("#user-phone").val();

			var userDetails = {
				first_name: uname,
				email: email,
				mobile_no: phone
			};
			//console.log(userDetails);
			var priceStrcture = packageObj.data.service.amount_type;
			if (priceStrcture == "per_person_per_month") {
				var orderDetails = [{
					package_id: packageID,
					number_of_person: jQuery("#js__employees").val(),
					months: jQuery("#js__months").val(),
					quantity: 1
				}];
			} else {
				var orderDetails = [{
					package_id: packageID,
					state_id: stateID,
					quantity: 1
				}];
			}
			postOrder(userDetails, orderDetails);
		}
	});

	/*Custom drafting placeorder*/
	jQuery("#cusotmDraftingPlaceorder").validate({
		rules: {
			name: {
				required: true,
				customvalidation: true
			},
			email: {
				required: true,
				email: true
			},
			phone: {
				required: true,
				digits: true
			}
		},
		messages: {
			name: {
				required: "Your name is required."
			},
			email: {
				required: "Your email is required."
			},
			phone: {
				required: "Your phone is required."
			}
		},

		submitHandler: function (form) {
			//event.preventDefault();
			//console.log("inside submitHandler");
			var uname = jQuery("#u_name").val();
			var email = jQuery("#u_email").val();
			var phone = jQuery("#u_phone").val();
			var p_id = jQuery("#p_id").val();

			var userDetails = {
				first_name: uname,
				email: email,
				mobile_no: phone
			};
			//console.log(userDetails);
			var orderDetails = [{
				package_id: p_id,
				state_id: stateID,
				quantity: 1
			}];

			if (sessionStorage.token && sessionStorage.token != "") {
				var userDetails = {
					token: sessionStorage.token
				};
			}
			if (sessionStorage.orderId) {
				var order = JSON.parse(sessionStorage.orderId);
				postOrder(userDetails, orderDetails, order);
			} else {
				postOrder(userDetails, orderDetails);
			}
		}
	});
	/*END - Custom drafting placeorder*/

	function postOrder(userDetails, orderDetails, order) {
		jQuery.ajax({
			type: "POST",
			url: portalURL + "/orders",
			data: {
				user_details: userDetails,
				order_details: orderDetails,
				order: order
			},
			dataType: "JSON",
			success: function (response) {
				//console.log(response);
				if (response["data"]["status"] == true) {
					//Saving data in sessionStorage
					//console.log("from postorder");
					var orderId = [];
					var res = response["data"];
					var orderId = [];
					// JSON.parse(sessionStorage.getItem('orderId')) ||
					orderId.push({
						id: res["order"]["id"],
						quantity: "1"
					});
					sessionStorage.setItem("token", res["token"]);
					sessionStorage.setItem("orderId", JSON.stringify(orderId));
					jQuery("#user-name").val("");
					jQuery("#user-email").val("");
					jQuery("#user-phone").val("");
					jQuery("#service-enquiry-form .close").click();
					fullLoader.on({
						text: "Loading..."
					});
					//jQuery("#service-enquiry-form").modal();

					window.location.href = siteURL + "/cart";
				} else if (response["data"]["status"] == false) {
					var dataError = response["data"]["errors"];
					var dataErrorObj = Object.keys(dataError);
					var dataErrorCount = dataErrorObj.length;

					for (var i = 0; i < dataErrorCount; i++) {
						//stateHTML += '<option value="'+stateArray[i]+'">'+stateArray[i]+'</option>';
						//console.log(dataError['dataErrorObj']);
					}
				}
			}
		});
	}
});