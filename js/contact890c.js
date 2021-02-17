jQuery(function() {
	jQuery("#successMsg").hide();
	jQuery("#successChatMsg").hide();
	jQuery("#successCarrerMsg").hide();
	jQuery("#successAffiliateMsg").hide();
	/*Get States*/
	jQuery.ajax({
		dataType: "JSON",
		method: "GET",
		url: portalURL + "/states",
		success: function(resultData) {
			var states = resultData["data"]["states"];
			var stateArray = Object.values(states);
			var stateCount = stateArray.length;
			var stateHTML =
				'<option value="Select State">Select State</option>';
			for (var i = 0; i < stateCount; i++) {
				stateHTML +=
					'<option value="' +
					[i + 1] +
					'">' +
					stateArray[i] +
					"</option>";
			}
			jQuery("#js__states").html(stateHTML);
			jQuery("#js__statedd").html(stateHTML);
		}
	});
	/*END - Get States*/

	/*Get City*/
	jQuery("#js__states").on("change", function() {
		var stateID = jQuery("#js__states").val();
		jQuery.ajax({
			dataType: "JSON",
			method: "GET",
			url: portalURL + "/city/" + stateID,
			success: function(resultData) {
				var city = resultData["data"]["city"];
				var cityKeys = Object.keys(city);
				var cityValues = Object.values(city);
				var cityCount = cityKeys.length;
				var cityHTML =
					'<option value="Select City">Select City</option>';
				for (var i = 0; i < cityCount; i++) {
					cityHTML +=
						'<option value="' +
						cityKeys[i] +
						'">' +
						cityValues[i] +
						"</option>";
				}
				jQuery("#js__city").html(cityHTML);
			}
		});
	});
	/*END -- Get Ciry*/

	/* Validate Name with letters with space*/
	jQuery.validator.addMethod(
		"letterswithspace",
		function(value, element) {
			return (
				this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/)
			);
		},
		"Please enter only letters."
	);

	/* Post Customer Detail */
	jQuery("#contact").validate({
		rules: {
			name: {
				required: true,
				letterswithspace: true
			},
			email: {
				required: true,
				email: true
			},
			mobile_no: {
				required: true,
				digits: true
			},
			msg: {
				required: true
			}
		},
		messages: {
			name: {
				required: "Your name is required."
			},
			email: {
				required: "Your email is required."
			},
			mobile_no: {
				required: "Your phone is required."
			},
			msg: {
				required: "Please enter your message."
			}
		},
		submitHandler: function(form) {

			fullLoader.on({
				text: "Loading..."
			});
			var csourceid = jQuery("#source-id").val();
			var cname = jQuery("#name").val();
			var cemail = jQuery("#email").val();
			var cphone = jQuery("#mobile_no").val();
			var cmessage = jQuery("#msg").val();
			var cstate = jQuery("#js__states")
				.find("option:selected")
				.val();

				jQuery.ajax({
					type: "POST",
					url: portalURL + "/inquiry",
					data: {
						source_id: csourceid,
						state_id: cstate,
						name: cname,
						email: cemail,
						mobile_no: cphone,
						message: cmessage,
					},
					dataType: "JSON",
					success: function(data) {
						fullLoader.off();
						jQuery("#successMsg").show();
						jQuery("#name").val("");
						jQuery("#email").val("");
						jQuery("#mobile_no").val("");
						jQuery("#msg").val("");
						jQuery("#js__states").val("Select State");
					}
				});
			//event.preventDefault();
		}
	});
	/*END - Post Customer Detail*/

	/* Post Enquiry Detail */
	jQuery("#enquiry").validate({
		rules: {
			name: {
				required: true,
				letterswithspace: true
			},
			email: {
				required: true,
				email: true
			},
			mobile_no: {
				required: true,
				digits: true
			},
			msg: {
				required: true
			}
		},
		messages: {
			name: {
				required: "Your name is required."
			},
			email: {
				required: "Your email is required."
			},
			mobile_no: {
				required: "Your phone is required."
			},
			msg: {
				required: "Please enter your message."
			}
		},
		submitHandler: function(form) {
			fullLoader.on({
				text: "Loading..."
			});
			//event.preventDefault();
			var enqSourceid = jQuery("#source-id").val();
			var enqName = jQuery("#name").val();
			var enqEmail = jQuery("#email").val();
			var enqPhone = jQuery("#mobile_no").val();
			var enqState = jQuery("#js__states")
				.find("option:selected")
				.val();
			var enqMessage = jQuery("#msg").val();

			jQuery.ajax({
				type: "POST",
				url: portalURL + "/inquiry",
				data: {
					source_id: enqSourceid,
					name: enqName,
					email: enqEmail,
					mobile_no: enqPhone,
					state_id: enqState,
					message: enqMessage
				},
				dataType: "JSON",
				success: function(data) {
					fullLoader.off();
					//console.log(data);
					jQuery("#successMsg").show();
				}
			});
		}
	});
	/*END - Post Enquiry Detail*/

	/* Service Enquiry Detail */
	jQuery("#service-enquiry").validate({
		rules: {
			name: {
				required: true,
				letterswithspace: true
			},
			email: {
				required: true,
				email: true
			},
			mobile_no: {
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
			mobile_no: {
				required: "Your phone is required."
			}
		},
		submitHandler: function(form) {
			fullLoader.on({
				text: "Loading..."
			});
			//event.preventDefault();
			var gitSourceid = jQuery("#gitservicepage").val();
			var gitName = jQuery("#gitname").val();
			var gitEmail = jQuery("#gitemail").val();
			var gitPhone = jQuery("#gitphone").val();
			var gitMessage = jQuery("#gitservice").val();
			var gitService = jQuery("#gitserviceslug").val();

			jQuery.ajax({
				type: "POST",
				url: portalURL + "/inquiry",
				data: {
					source_id: gitSourceid,
					name: gitName,
					email: gitEmail,
					mobile_no: gitPhone,
					message: gitMessage
				},
				dataType: "JSON",
				success: function(response) {
					window.location.href =
						siteURL + "/packages/?service=" + gitService;
					var userData = response["data"]["inquiry"];
					var userDetail = {
						first_name: userData["name"],
						email: userData["email"],
						mobile_no: userData["mobile_no"]
					};
					sessionStorage.setItem(
						"userDetail",
						JSON.stringify(userDetail)
					);
				}
			});
		}
	});
	/*END - Service Enquiry Detail*/

	/* Post chatBox Detail */
	jQuery("#chatBox").validate({
		rules: {
			chat_name: {
				required: true,
				letterswithspace: true
			},
			chat_email: {
				required: true,
				email: true
			},
			chat_phone: {
				required: true,
				digits: true
			},
			chat_msg: {
				required: true
			}
		},
		messages: {
			chat_name: {
				required: "Your name is required."
			},
			chat_email: {
				required: "Your email is required."
			},
			chat_phone: {
				required: "Your phone is required."
			},
			chat_msg: {
				required: "Please enter your message."
			}
		},
		submitHandler: function(form) {
			fullLoader.on({
				text: "Loading..."
			});
			//event.preventDefault();
			var chatsourceid = jQuery("#chat_sourceid").val();
			var chatname = jQuery("#chat_name").val();
			var chatemail = jQuery("#chat_email").val();
			var chatphone = jQuery("#chat_phone").val();
			var chatmessage = jQuery("#chat_msg").val();
			var chatstate = jQuery("#js__statedd")
				.find("option:selected")
				.val();

			jQuery.ajax({
				type: "POST",
				url: portalURL + "/inquiry",
				data: {
					source_id: chatsourceid,
					state_id: chatstate,
					name: chatname,
					email: chatemail,
					mobile_no: chatphone,
					message: chatmessage
				},
				dataType: "JSON",
				success: function(data) {
					fullLoader.off();
					jQuery("#successChatMsg").show();
					jQuery("#chat_name").val("");
					jQuery("#chat_email").val("");
					jQuery("#chat_phone").val("");
					jQuery("#chat_msg").val("");
					jQuery("#js__statedd").val("Select State");
				}
			});
		}
	});
	/*END - Post chatBox Detail*/

	/* Post Affiliation Detail*/
	jQuery("#affiliate").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			name: {
				required: true,
				letterswithspace: true
			},
			mobile_no: {
				required: true,
				digits: true
			},
			state_id: {
				required: true
			},
			city_id: {
				required: true
			},
			file: {
				//required: true,
				extension: "txt|doc|docx|pdf|jpg|jpeg|png"
			}
		},
		messages: {
			name: {
				required: "Your name is required."
			},
			email: {
				required: "Your email is required."
			},
			mobile_no: {
				required: "Your phone is required."
			},
			state_id: {
				required: "Please select state."
			},
			city_id: {
				required: "Please select city."
			},
			file: {
				required: "Please upload portfolio."
			}
		},
		submitHandler: function(form) {
			fullLoader.on({
				text: "Loading..."
			});
			//event.preventDefault();

			var aname = jQuery("#name").val();
			var aemail = jQuery("#email").val();
			var aphone = jQuery("#mobile_no").val();
			var astate = jQuery("#js__states")
				.find("option:selected")
				.val();
			var acity = jQuery("#js__city")
				.find("option:selected")
				.val();

			//file upload
			var allowed_file_size = "1048576"; //1 MB allowed file size
			if (
				window.File &&
				window.FileReader &&
				window.FileList &&
				window.Blob
			) {
				var total_files_size = 0;

				$(document.getElementById("upload").files).each(function(
					i,
					ifile
				) {
					if (ifile.value !== "") {
						//continue only if file(s) are selected
						total_files_size = total_files_size + ifile.size; //add file size to total size
					}
				});
				if (total_files_size > allowed_file_size) {
					alert("Make sure total file size is less than 1 MB!");
				}
			}
			var form_data = new FormData(document.getElementById("affiliate"));
				jQuery.ajax({
					type: "post",
					data: form_data,
					dataType: "json",
					contentType: false,
					cache: false,
					processData: false,
					url: portalURL + "/affiliation",
					success: function(data) {
						fullLoader.off();
						jQuery("#successAffiliateMsg").show();
						jQuery("#name").val("");
						jQuery("#email").val("");
						jQuery("#mobile_no").val("");
						jQuery("#js__states").val("Select State");
						jQuery("#js__city").val("Select City");
					}
				});
		}
	});

	/* Post Career Detail */
	jQuery("#career").validate({
		rules: {
			email: {
				required: true,
				email: true
			},
			name: {
				required: true
			},
			mobile_no: {
				required: true,
				digits: true
			},
			qualification: {
				required: true
			},
			file: {
				required: true,
				extension: "txt|doc|docx|pdf|jpg|jpeg|png"
			}
		},
		messages: {
			name: {
				required: "Your name is required."
			},
			email: {
				required: "Your email is required."
			},
			mobile_no: {
				required: "Your phone is required."
			},
			qualification: {
				required: "Please enter your qualification."
			},
			file: {
				required: "Please upload your resume."
			}
		},
		submitHandler: function(form) {
			fullLoader.on({
				text: "Loading..."
			});
			//event.preventDefault();

			var name = jQuery("#name").val();
			var email = jQuery("#email").val();
			var phone = jQuery("#phone").val();
			var qualification = jQuery("#qualification").val();

			//file upload
			var allowed_file_size = "1048576"; //1 MB allowed file size

			if (
				window.File &&
				window.FileReader &&
				window.FileList &&
				window.Blob
			) {
				var total_files_size = 0;

				$(document.getElementById("upload").files).each(function(
					i,
					ifile
				) {
					if (ifile.value !== "") {
						//continue only if file(s) are selected
						total_files_size = total_files_size + ifile.size; //add file size to total size
					}
				});
				if (total_files_size > allowed_file_size) {
					alert("Make sure total file size is less than 1 MB!");
				}
			}
			//END -- file upload

			var career_form_data = new FormData(
				document.getElementById("career")
			);
				jQuery.ajax({
					type: "POST",
					url: portalURL + "/career",
					data: career_form_data,
					dataType: "JSON",
					contentType: false,
					cache: false,
					processData: false,
					success: function(data) {
						fullLoader.off();
						jQuery("#successCarrerMsg").show();
						jQuery("#name").val("");
						jQuery("#email").val("");
						jQuery("#phone").val("");
						jQuery("#qualification").val("");
					}
				});
		}
	});

	/*form validation with custom error message.*/

	jQuery.validator.addMethod(
		"letterswithspace",
		function(value, element) {
			return (
				this.optional(element) || value == value.match(/^[a-zA-Z\s]+$/)
			);
		},
		"Please enter only letters."
	);

	jQuery("#validate_form").validate({
		rules: {
			your_name: {
				required: true,
				letterswithspace: true
			},
			your_email: {
				required: true,
				email: true
			},
			your_company: {
				required: true
			},
			your_review: {
				required: true,
				digits: true
			},
			your_comment: {
				required: true
			}
		},
		messages: {
			your_name: {
				required: "Your name is required."
			},
			your_email: {
				required: "Your email is required."
			},
			your_company: {
				required: "Your company name is required."
			},
			your_review: {
				required: "Please enter review number."
			},
			your_comment: {
				required: "Please enter your comment."
			}
		}
	});
});
