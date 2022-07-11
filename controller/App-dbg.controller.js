sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment"
], function (Controller, Fragment) {
	"use strict";

	return Controller.extend("MDG.Help.controller.App", {
		onInit: function () {
			var oViewModel = new sap.ui.model.json.JSONModel({
				busy: true,
				delay: 0,
				layout: "OneColumn",
				previousLayout: "",
				actionButtonsInfo: {
					midColumn: {
						fullScreen: false
					}
				},
				menuBarVisibility: false,
				previousPage: "Master",
				lastId: 104,
				discountPrice: "",
				newcustomerId: "",
				customerId: "",
				projectId: "",
				quotationId: "",
				customerContactId: "",
				customerTypeId: "",
				customerQuotationId: "",
				quotationDetailId: "",
				qty: 0,
				totalAmount: 0,
				status: "",
				catalogItems: [],
				categoryItems: [],
				customerData: {},
				"cartItems" : []
			});
			this.getView().setModel(oViewModel, "appView");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			//oRouter.navTo("help");
			oRouter.navTo("login");
			if (window.localStorage.getItem("UserId") == "Raghu") {
				this.getView().getModel("appView").setProperty("/menuBarVisibility", true);

			}
		},

		handleLogoutPress: function () {
			var that = this;
			this.getView().getModel("appView").setProperty("/menuBarVisibility", false);
			this.getView().getModel("appView").setProperty("/layout", "OneColumn");
			window.localStorage.setItem("UserId", null);
			window.localStorage.setItem("loginTime", null)
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			oRouter.navTo("login");
			window.location.reload();
			function preventBack() {
				window.history.forward();
			}
			setTimeout(preventBack(), 0);
			window.onunload = function () {
				null
			};
			window.localStorage.setItem("loginDetails", null);
		},
		/*, {
		"title": "Chester",
		"Items": [{
			"title": "Chester 3 Seat Sofa"
		}, {
			"title": "Chester Arm Wheels Pool Chaise"
		}, {
			"title": "Chester Rectangular Table"
		}, {
			"title": "Chester Batyline Wheels Pool Chaise"
		}]
	}, {
		"title": "Topanga",
		"Items": [{
			"title": "Topana Round Dining Table"
		}, {
			"title": "Topana Chaise Longue"
		}, {
			"title": "Topana Tall Side Table"
		}, {
			"title": "Topana Pool Bed"
		}, {
			"title": "Topana Square Desk"
		}]
	}*/
	});

});