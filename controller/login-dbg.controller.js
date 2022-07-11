var that;
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox"
], function (Controller, MessageBox) {
	"use strict";

	return Controller.extend("MDG.Help.controller.login", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MDG.Help.view.login
		 */
		onInit: function () {
			that = this;
			if (window.localStorage.getItem("UserId") == "Raghu") {
				//this.getView().getModel("appView").setProperty("/layout", "OneColumn");
				this.getOwnerComponent().getRouter().navTo("Help");
				// this.getView().getModel("appView").setProperty("/menuBarVisibility", true);

			}
		},
		onAfterRendering: function () {},
			handleLoginButtonPress: function () {
			var that = this;
			var emailValue = this.getView().byId("emailId").getValue();
			var password = this.getView().byId("password").getValue();
			if (emailValue.length == 0) {
				this.getView().byId("emailId").setValueState("Error");
				sap.m.MessageToast.show("Please provide your Email!");
			} else if (password.length == 0) {
				this.getView().byId("password").setValueState("Error");
				sap.m.MessageToast.show("Please provide your Password!");
			} else {
				var data = {
					"identifier": emailValue,
					"password": password
				}
				$.ajax({
					url: "/DanaoStrapi/api/auth/local",
					type: 'POST',
					data: data,
					dataType: 'json', // added data type
					success: function (res) {
						if (res.user.status == "APPROVED") {
							window.localStorage.setItem("UserId", "Raghu");
							that.getView().getModel("appView").setProperty("/menuBarVisibility", true);
							that.getView().getModel("appView").setProperty("/layout", "OneColumn");
							that.getOwnerComponent().getRouter().navTo("Help");
							sap.m.MessageToast.show("LoggedIn Successfully!!")
							that.getView().byId("emailId").setValue().setValueState("None");
							that.getView().byId("password").setValue().setValueState("None");
						} else {
							sap.m.MessageBox.error(
								"User not Approved");
						}
					},
					error: function (res) {
						sap.m.MessageBox.error(
							"Invalid Credentials!!");
					}
				});
			}

		},
	
		handleSignUpPress: function (evt) {
			var that = this;
			this.getView().byId("signInForm").setVisible(false);
			this.getView().byId("signUpForm").setVisible(true);
		},
		HandleEmail: function () {
			var emailId = this.getView().byId("email").getValue();
			var atPos = emailId.indexOf("@");
			var dotPos = emailId.lastIndexOf(".");
			if (atPos < 1 || dotPos < atPos + 2 || dotPos + 2 >= emailId.length) {
				sap.m.MessageBox.error("Please enter valid Email ID");
			}
		},
		PasswordHandle: function () {
			var password = this.getView().byId("password1").getValue();
			var confirmpassword1 = this.getView().byId("confirmpassword").getValue();
			if (password !== confirmpassword1) {
				sap.m.MessageBox.error("Password do not Match");
			}
		},
		HandleContactNumber: function () {
			var contactNumber = this.getView().byId("contactnumber").getValue();
			var regExp = /^\d+$/;
			if (!regExp.test(contactNumber))
				sap.m.MessageBox.error("Please Enter Numbers only");
		},
		handleSignUpButtonPress: function () {
			var that = this;
			if (this.getView().byId("firstname").getValue().length == 0 || this.getView().byId("lastname").getValue().length == 0 || this.getView()
				.byId("email").getValue().length == 0 || this.getView().byId("contactnumber").getValue().length == 0 || this.getView().byId(
					"password1").getValue().length == 0 || this.getView().byId("confirmpassword").getValue().length == 0 || this.getView().byId(
					"salesType").getValue().length == 0 || this.getView().byId("companyname").getValue().length == 0) {
				sap.m.MessageBox.error("Please fill the mandatoryFields");
				return "";
			} else {
				var firstname = this.getView().byId("firstname").getValue();
				var lastname = this.getView().byId("lastname").getValue();
				var email = this.getView().byId("email").getValue();
				var contactnumber = this.getView().byId("contactnumber").getValue();
				var password1 = this.getView().byId("password1").getValue();
				var confirmpassword = this.getView().byId("confirmpassword").getValue();
				var salesType = this.getView().byId("salesType").getSelectedKey();
				var companyname = this.getView().byId("companyname").getValue();
				var data = {
						"firstName": firstname,
						"lastName": lastname,
						"company": companyname,
						"phone": contactnumber,
						"email": email,
						"password": password1,
						"username": email,
						"d_sales_user_types": salesType
						/*"firstName": "Robert1",
						"lastName": "Das",
						"company": "VASPP",
						"phone": "3216549875",
						"email": "das1@gmail.com",
						"password": "Vaspp@123",
						"username": "adsadad1@gmail.com"*/
				};
				$.ajax({
					url: "/DanaoStrapi/api/auth/local/register",
					type: 'POST',
					data: data,
					dataType: 'json', // added data type
					success: function (res) {
						var customerNameArr = [];
						that.getView().byId("signInForm").setVisible(true);
						that.getView().byId("signUpForm").setVisible(false);
						sap.m.MessageBox.success("Thank you for signing up. Once your request is approved you can continue to login and access the Estimator tool");
					},
					error: function (res) {
						console.log(res);
					}
				});
				//console.log(data);

			}

		},
		handleCancelButtonPress: function () {
			this.getView().byId("signInForm").setVisible(true);
			this.getView().byId("signUpForm").setVisible(false);
		}
	});

});