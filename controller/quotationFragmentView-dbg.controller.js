sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Context",
	"sap/m/MessageBox"
], function (Controller, Context, MessageBox) {
	"use strict";

	return Controller.extend("MDG.Help.controller.quotationFragmentView", {
		onInit: function () {
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var that = this;
			this.getOwnerComponent().getRouter().getRoute("quotationFragmentView").attachPatternMatched(function (oEvent) {
				var usersModel = that.getOwnerComponent().getModel("customerInfo");
				that.path = oEvent.getParameter("arguments").selectedId;
				this.getView().getModel("appView").oData.RequestIdSelected = oEvent.getParameter("arguments").selectedId;
				var oContext = new Context(usersModel, "/" + that.path);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()));
				that.getView().setModel(new sap.ui.model.json.JSONModel([]), "cartItemSummary");
				that.handleitemSummary(oEvent.getParameter("arguments").selectedId);
				that.selectedId = oEvent.getParameter("arguments").selectedId;
			}, this);
			that.maxId = 100 + that.getOwnerComponent().getModel("customerInfo").getData().length;

		},
		handleitemSummary: function (selectedId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-products?populate=*&filters[id][$eq]=" + selectedId,
				//url: "/DanaoStrapi/api/d-products?populate=*",
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					that.products = res.data;
					that.productsArr = [];
					// for (var m = 0; m < products.length; m++) {
					// 	that.productsArr.push(products[m].id,products[m].attributes);
					// }
					that.handleitemfinishes();
				}
			});
		},
		handleitemfinishes: function (quotationArr) {
			var that = this;
			//that.mode = "READ";
			//var selectedId = that.getView().getModel("appView").getProperty("/quotationDetailId", that.selectedId);
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-quotation-details?populate=*",
				//url: "/DanaoStrapi/api/d-customer-quotation-details?populate=*&filters[id][$eq]=" + that.selectedId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					//that.productsArr = quotationArr;
					//var productsArr = [];
					that.customerId = res.data.id;
					var customerQuotationData = res.data;
					for (var n = 0; n < that.products.length; n++) {
						for (var m = 0; m < customerQuotationData.length; m++) {
							if (that.products[n].id === customerQuotationData[m].id) {
								that.products[n]["productDetails"] = customerQuotationData[m].attributes;
								that.selectedQuotationDetails = that.products[n];
								break;
							}
						}
					}
					console.log(that.products);
					console.log(that.selectedQuotationDetails);
					that.getOwnerComponent().getModel("customerQuotModel").oData = that.selectedQuotationDetails;
					that.getOwnerComponent().getModel("customerQuotModel").updateBindings(true);
				}

			});
		},
		onNavBack: function () {
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("quotationDetail", {
				id: "tile",
				QuotationId: "index"
			});
		},
		handleUpdateCancel: function () {
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("quotationDetail", {
				id: "tile",
				QuotationId: "index"
			});
		},
		handleUpdatePress: function () {
			var that = this;
			var obj = {
				"data": {
					dProduct_Quantity: (that.getView().byId("quantity").getValue()).toString()
				}
			};
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-quotation-details/" + that.selectedId,
				type: "PUT",
				"headers": {
					"content-type": "application/json"
				},
				data: JSON.stringify(obj),
				dataType: "json",
				success: function (res) {
					that.handleUpdateCancel();
					sap.m.MessageBox.success("Quotation has been Updated successfully!");
				},
				error: function (err) {
					MessageBox.error(err.responseJSON.error.message);
				}
			});
		}
	});

});