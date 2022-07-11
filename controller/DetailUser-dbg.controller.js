sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Context",
	"sap/m/MessageBox",
	"MDG/Help/util/formatter"
], function (Controller, Context, MessageBox, formatter) {
	"use strict";

	return Controller.extend("MDG.Help.controller.DetailUser", {
		formatter: formatter,
		onInit: function () {
			console.log("test");
			//this.handleDetailUserData();
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var that = this;
			this.getOwnerComponent().getRouter().getRoute("DetailUser").attachPatternMatched(function (oEvent) {
				var usersModel = that.getOwnerComponent().getModel("UserNameModel");
				that.path = oEvent.getParameter("arguments").module;
				this.getView().getModel("appView").oData.RequestIdSelected = oEvent.getParameter("arguments").id;
				var oContext = new Context(usersModel, "/" + that.path);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()));
				//that.handleDetailUserData(oEvent.getParameter("arguments").id);
				that.handleSalesUserTypeData(oEvent.getParameter("arguments").id);
				that.userId = oEvent.getParameter("arguments").id;
			}, this);
			that.maxId = 100 + that.getOwnerComponent().getModel("UserNameModel").getData().length;

		},
		// handleDetailUserData: function (userId) {
		// 	var that = this;
		// 	$.ajax({
		// 		url: "/DanaoStrapi/api/users?populate=*&filters[id][$eq]=" + userId,
		// 		type: "POST",
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		dataType: "json", // added data type
		// 		success: function (res) {
		// 			var userData = res.data;
		// 			var userArr = [];
		// 			for (var m = 0; m < userData.length; m++) {
		// 				userArr.push(userData[m]);
		// 			}
		// 			that.getOwnerComponent().getModel("UserNameModel").oData = userArr;
		// 			that.getOwnerComponent().getModel("UserNameModel").updateBindings(true);
		// 		}

		// 	});
		// },
		handleSalesUserTypeData: function (contactId) {
			var that = this;
			$.ajax({
				// url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + contactId,
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + contactId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				// success: function (res) {
				// 	/*var customerTypeData = res.data[0].attributes.d_customer_type.data;
				// 	var customerTypeArr = [];
				// 	for (var m = 0; m < customerTypeData.length; m++) {
				// 		customerTypeArr.push(customerTypeData[m].attributes);
				// 	}
				// 	that.getOwnerComponent().getModel("DetailCustomerTypeModel").oData = customerTypeArr;
				// 	that.getOwnerComponent().getModel("DetailCustomerTypeModel").updateBindings(true);*/
				// 	var customerTypeData = res.data[0].attributes.d_customer_type.data
				// 	that.getView().byId("SalesUserTypeId").setText(customerTypeData.attributes.dCustomer_TypeCode + " - " +
				// 	customerTypeData.attributes.dCustomerType_Description);
				// }

				success: function (res) {

					if (res.data.length > 0) {
						if (res.data[0].attributes.d_project_sales_stage !== undefined && res.data[0].attributes.d_project_sales_stage.data !== null &&
							res.data[0].attributes.d_project_sales_stage.data.attributes !== undefined &&
							res.data[0].attributes.d_project_sales_stage.data.attributes.DProject_Sales_Stage !== undefined)
							that.getView().byId("SalesUserTypeId").setText(res.data[0].attributes.d_project_sales_stage.data.attributes.DProject_Sales_Stage);
						else
							that.getView().byId("SalesUserTypeId").setText("");

					} else {
						that.getView().byId("SalesUserTypeId").setText("");
					}
				}

			});
		},
		fullScreen: function () {
			this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			this.byId("enterFullScreen").setVisible(false);
			this.byId("exitFullScreen").setVisible(true);
		},

		exitFullScreen: function () {
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.byId("exitFullScreen").setVisible(false);
			this.byId("enterFullScreen").setVisible(true);
		},

		onCloseDetailPress: function () {
			var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
			this.getView().getModel("appView").setProperty("/layout", "OneColumn");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("MasterUser");

		},

		onApprovePress: function () {
			var that = this;
			var obj = {
				id: this.getView().getModel().oData.id,
				// 	username:"Raghu",
				// email:"nithin@gmail.com",
				// password:"ab@12",
				status: "APPROVED"
			};
			$.ajax({
				url: "/DanaoStrapi/api/users/" + this.getView().getModel().oData.id,
				type: "PUT",
				"headers": {
					"content-type": "application/json"
				},
				data: JSON.stringify(obj),
				dataType: "json",
				success: function (res) {

						MessageBox.success("User has been Approved");
						that.getView().getModel().oData.status = "APPROVED";
						that.getView().getModel().updateBindings(true);
						var bFullScreen = that.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
						that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn", !bFullScreen);
						that.getView().getModel("appView").setProperty("/layout", "OneColumn");
						that.getView().getModel().updateBindings(true);
						that.getOwnerComponent().getRouter().navTo("MasterUser");
					}
					// error: function (err) {
					// 	MessageBox.error(err.responseJSON.error.message);
					// }
			});

		},

		onRejectPress: function () {
			var that = this;
			var obj = {
				id: this.getView().getModel().oData.id,
				// 	username:"Raghu",
				// email:"nithin@gmail.com",
				// password:"ab@12",
				status: "REJECTED"
			};
			$.ajax({
				url: "/DanaoStrapi/api/users/" + this.getView().getModel().oData.id,
				type: "PUT",
				"headers": {
					"content-type": "application/json"
				},
				data: JSON.stringify(obj),
				dataType: "json",
				success: function (res) {

						MessageBox.success("User has been Rejected");
						that.getView().getModel().oData.status = "REJECTED";
						that.getView().getModel().updateBindings(true);
						var bFullScreen = that.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
						that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn", !bFullScreen);
						that.getView().getModel("appView").setProperty("/layout", "OneColumn");
						that.getView().getModel().updateBindings(true);
						that.getOwnerComponent().getRouter().navTo("MasterUser");
					}
					// error: function (err) {
					// 	MessageBox.error(err.responseJSON.error.message);
					// }
			});

		},

		// onRejectPress: function () {
		// 	var that = this;
		// 	this.getView().getModel().oData.status = "REJECTED";
		// 	this.getView().updateBindings(true);
		// 	MessageBox.success("User has been Rejected");
		// 	var bFullScreen = that.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
		// 	that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn", !bFullScreen);
		// 	that.getView().getModel("appView").setProperty("/layout", "OneColumn");
		// 	that.getOwnerComponent().getRouter().navTo("MasterUser");
		// }
	});

});