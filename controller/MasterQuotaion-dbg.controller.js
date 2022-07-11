sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"MDG/Help/util/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/core/Fragment"
	],
	function (Controller, formatter, Filter, FilterOperator, Fragment) {
		"use strict";

		return Controller.extend("MDG.Help.controller.MasterQuotaion", {
			formatter: formatter,
			onInit: function () {
				var that = this;
				that.maxId = 100 + that.getOwnerComponent().getModel("customerInfo").getData().length;
				sap.ui.core.UIComponent.getRouterFor(this).getRoute("MasterQuotaion").attachPatternMatched(this._objPatternMatched, this);
			},
			_objPatternMatched: function () {
				this.handleMasterQuotationTableDetails();
			},
			onNavBack: function () {
				this.getView().getModel("appView").setProperty("/layout", "OneColumn");
				this.getOwnerComponent().getRouter().navTo("Help");
			},
			handleOpenDialog: function () {
				if (!this.sortQuotationFragment) {
					this.sortQuotationFragment = sap.ui.xmlfragment("MDG.Help.fragment.filterQuotation", this);
				}
				this.sortQuotationFragment.open();
			},
			onSearch: function (evt) {
				var filter1 = new sap.ui.model.Filter("dCustomerName", "Contains", evt.getParameter("newValue"));
				var filter2 = new sap.ui.model.Filter("id", "EQ", evt.getParameter("newValue"));
				var filter3 = new sap.ui.model.Filter("dCustomer_ProjectName", "Contains", evt.getParameter("newValue"));
				var filter4 = new sap.ui.model.Filter("DQuotation_Status", "Contains", evt.getParameter("newValue"));

				this.getView().byId("QuotationsTable").getBinding("items").filter(new sap.ui.model.Filter([filter1, filter2, filter3, filter4]));
			},
			handleConfirm: function (evt) {
				var oQuotationItem = evt.getParameter("filterItems")[0].getProperty("key");
				var sColumnPath = "Draft";
				var sColumnPath1 = "Completed";
				var sColumnPath2 = "Value C";
				var filter1 = new sap.ui.model.Filter("DQuotation_Status", "Contains", sColumnPath);
				var filter2 = new sap.ui.model.Filter("DQuotation_Status", "Contains", sColumnPath1);
				var filter3 = new sap.ui.model.Filter("DQuotation_Status", "Contains", sColumnPath2);
				if (oQuotationItem == "Draft")
					this.getView().byId("QuotationsTable").getBinding("items").filter(new sap.ui.model.Filter([filter1]));
				else if (oQuotationItem == "Completed")
					this.getView().byId("QuotationsTable").getBinding("items").filter(new sap.ui.model.Filter([filter2]));
				else
					this.getView().byId("QuotationsTable").getBinding("items").filter(new sap.ui.model.Filter([filter3]));

			},
			// onPress: function (oEvent) {
			// 	var this=that;
			// 	//this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			// 	this.index = oEvent.getSource().getBindingContext("QuotationMasterModel").sPath.split("/")[1];
			// 	var test = oEvent.getSource().getModel("QuotationMasterModel").getData()[this.index].id;

			// 	var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
			// 	that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn");
			// 	that.getView().getModel("appView").setProperty("/layout", "OneColumn");
			// 	this.getView().getModel("appView").updateBindings(true);
			// 	this.getView().getModel("appView").setProperty("/indexNo", this.index);
			// 	this.getOwnerComponent().getRouter().navTo("quotationDetail", {
			// 		id: this.index,
			// 		QuotationId: test
			// 		// 	id: test,
			// 		// QuotationId: this.index
			// 	});
			// },
			onPress: function (oEvent) {
				// var that = this;
				// MessageToast.show("Title clicked");
				// this.onCloseDetailPress();
				this.getView().getModel("appView").setProperty("/layout", "OneColumn");
				//	this.index = oEvent.getSource().getBindingContext("QuotationMasterModel").sPath.split("/")[1];
				var QuotationIdFinder = oEvent.getSource().getBindingContext("QuotationMasterModel").sPath.split("/")[1];
				this.index = oEvent.getSource().getBindingContext("QuotationMasterModel").getObject().customerId;
				this.projectId =  oEvent.getSource().getBindingContext("QuotationMasterModel").getObject().projectId;
				var test = oEvent.getSource().getModel("QuotationMasterModel").getData()[QuotationIdFinder].id;
				//	var test = oEvent.getSource().getSelectedItem().getBindingContext("QuotationMasterModel").getObject().id;
				this.getView().getModel("appView").updateBindings(true);
				this.getView().getModel("appView").setProperty("/indexNo", this.index);
				this.getView().getModel("appView").setProperty("/customerId", this.index);
				this.getView().getModel("appView").setProperty("/projectId", this.projectId);
				this.getView().getModel("appView").setProperty("/quotationId", test);
				this.getOwnerComponent().getRouter().navTo("quotationDetailAlone", {
					id: this.index,
					projectId: this.projectId,
					ModuleIndex: QuotationIdFinder,
					QuotationId: test
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
					dataType: 'json',
					success: function (res) {
						var products = res.data;
						if (res.data.length > 0)
							var quotationData = res.data;
						else
							var quotationData = [];
						var quotationArr = [];
						for (var m = 0; m < quotationData.length; m++) {

							quotationArr.push({
								// customerId:quotationData[m].attributes.d_customer.data.id,
								// id: quotationData[m].id,
								// dCustomerName: quotationData[m].attributes.d_customer.data.attributes.dCustomerName,
								projectId: quotationData[m].attributes.d_customer_project.data === null ? "" : quotationData[m].attributes.d_customer_project.data.id,
								customerId: quotationData[m].attributes.d_customer.data === null ? "" : quotationData[m].attributes.d_customer.data.id,
								id: quotationData[m].id,
								dCustomerName: quotationData[m].attributes.d_customer.data === null ? "" : quotationData[m].attributes.d_customer.data.attributes
									.dCustomerName,
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

						that.getView().setModel(new sap.ui.model.json.JSONModel(quotationArr), "QuotationMasterModel");
					}
				});
			}
		});

	});