sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("MDG.Help.controller.Help", {
		onInit: function () {
			var that = this;
			that.maxId = 100 + that.getOwnerComponent().getModel("customerInfo").getData().length;

			this.handleCustomerData();
			var totalcustomer = 0;
			this.handleUserData();
			this.handleMasterQuotationTableDetails();
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("Master").attachPatternMatched(this._objPatternMatched, this);

		},
		_objPatternMatched: function () {
			this.handleCustomerData();
		},

		press: function (oEvent) {
			var tileIndex,
				tileHeader = oEvent.getSource().getHeader();
			if (tileHeader == "Customers") {
				tileIndex = 0;
			} else if (tileHeader == "Quotation") {
				tileIndex = 1;
			}

			var oRouter = this.getOwnerComponent().getRouter();
			oRouter.navTo("Master", {
				id: tileIndex
			});

			this.getView().getModel("appView").setProperty("/tileIndex", tileIndex);
		},
		handleCustomerData: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*",
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var customerArr = [];
					for (var i = 0; i < res.data.length; i++) {
						var obj = {
							id: res.data[i].id,
							createdAt: res.data[i].attributes.createdAt,
							dBillingAddress: res.data[i].attributes.dBillingAddress,
							dCustomerName: res.data[i].attributes.dCustomerName,
							dOfficePhone: res.data[i].attributes.dOfficePhone,
							dWebsite: res.data[i].attributes.dWebsite,
							publishedAt: res.data[i].attributes.publishedAt,
							updatedAt: res.data[i].attributes.updatedAt,
							dCustomerContact_Name: res.data[i].attributes.d_customer_contacts.data.length > 0 ?
								res.data[i].attributes.d_customer_contacts.data[0].attributes.dCustomerContact_Name : "",
							projectCount: res.data[i].attributes.d_customer_projects.data.length,
							//dCustomer_ProjectName: res.data[0].attributes.dCustomer_ProjectName

						};
						customerArr.push(obj);
						// console.log(obj);
					}

					that.getView().byId("customerValue").setValue(customerArr.length);
					that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(customerArr), "customerInfo");
					that.getView().setModel(new sap.ui.model.json.JSONModel(customerArr), "customerModel");
					// that.getOwnerComponent().getModel("customerModel").oData = customerArr;
					//that.getOwnerComponent().getModel("customerModel").updateBindings(true);
					//console.log(res);
					//alert(res);
				}
			});
		},
		handleUserData: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/users?populate=*",

				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var userArr = [];

					for (var i = 0; i < res.length; i++) {
						var obj = {
							id: res[i].id,
							firstName: res[i].firstName,
							company: res[i].company,
							status: res[i].status

						};
						userArr.push(obj);
						// console.log(obj);

					}

					that.getView().byId("userValue").setValue(userArr.length);

					that.getView().setModel(new sap.ui.model.json.JSONModel(userArr), "UserNameModel");
					// that.maxId = 100 + that.getOwnerComponent().getModel("UserNameModel").getData().length;

				}
			});
		},
		handleMasterQuotationTableDetails: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-quotations?populate=*&pagination[pageSize]=500",
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var products = res.data;
					if (res.data.length > 0)
						var quotationData = res.data;
					else
						var quotationData = [];
					var quotationArr = [];
					for (var m = 0; m < quotationData.length; m++) {

						quotationArr.push({
							id: quotationData[m].id,
							// dCustomerName: quotationData[m].attributes.d_customer.data.attributes.dCustomerName,
							dCustomerName: quotationData[m].attributes.d_customer.data === null ? "" : quotationData[m].attributes.d_customer.data
								.attributes.dCustomerName,
							dCustomer_ProjectName: quotationData[m].attributes.d_customer_project.data == null ? "" : quotationData[m].attributes.d_customer_project
								.data.attributes.dCustomer_ProjectName,
							DQuotation_Status: quotationData[m].attributes.DQuotation_Status,
							createdAt: quotationData[m].attributes.createdAt,
							dQuotation_Item_Price: quotationData[m].attributes.dQuotation_Item_Price,
							dQuotation_Item_Quantity: quotationData[m].attributes.dQuotation_Item_Quantity,
							publishedAt: quotationData[m].attributes.publishedAt,
							updatedAt: quotationData[m].attributes.updatedAt
						});
					}
					//	debugger
					that.getView().byId("quotationValue").setValue(quotationArr.length);
					that.getView().setModel(new sap.ui.model.json.JSONModel(quotationArr), "QuotationMasterModel");
				}
			});
		},
		pressQuotationTile: function (oEvent) {
			var that = this;
			var tileIndex,
				tileHeader = oEvent.getSource().getHeader();
			if (tileHeader == "Quotation") {
				tileIndex = 0;
			} else if (tileHeader == "Customers") {
				tileIndex = 1;
			}
			this.getOwnerComponent().getRouter().navTo("MasterQuotaion", {
				 id: tileIndex
			});
			this.getView().getModel("appView").setProperty("/tileIndex", tileIndex);
		},

		// pressQuotationTile: function () {
		// 	var that = this;
		// 	this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
		// 	this.getOwnerComponent().getRouter().navTo("AddNewQuotation", {
		// 		AddCust: "Edit"
		// 	});
		// },
		handleApproveUserPress: function () {
			var that = this;
			//this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			this.getOwnerComponent().getRouter().navTo("MasterUser");

		}

	});

});