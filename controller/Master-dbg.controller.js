sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/m/MessageBox",
		"sap/m/MessageToast",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Sorter"
	],
	function (Controller, Filter, FilterOperator, MessageToast, MessageBox, JSONModel, Sorter) {
		"use strict";
		return Controller.extend("MDG.Help.controller.Master", {
			onInit: function () {
				var that = this;
				that.maxId = 100 + that.getOwnerComponent().getModel("customerInfo").getData().length;
				this.handleCustomerData();
				this.handleProjectData();
				sap.ui.core.UIComponent.getRouterFor(this).getRoute("Master").attachPatternMatched(this._objPatternMatched, this);

			},
			_objPatternMatched: function () {
				this.handleCustomerData();
				this.handleProjectData();
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
							if (res.data[i].attributes.d_customer_type.data != undefined || res.data[i].attributes.d_customer_type.data != null) {
								var customerContactId = res.data[i].attributes.d_customer_type.data.id;
							} else {
								var customerContactId = "";
							}
							for (var j = 0; j < 5; j++) {
								var StaticId = j;
							}
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
								customerContactId: customerContactId,
								customerQuotationId: res.data[i].attributes.d_customer_quotations.data.length > 0 ?
									res.data[i].attributes.d_customer_quotations.data[0].id : "",
								projectId: res.data[i].attributes.d_customer_projects.data.length > 0 ?
									res.data[i].attributes.d_customer_projects.data[0].id : StaticId,
								customerProjects: res.data[i].attributes.d_customer_projects.data
									// dCustomer_TypeCode: res.data[i].attributes.d_customer_type.data.length > 0 ?
									// res.data[i].attributes.d_customer_type.data[0].id : ""
							};
							customerArr.push(obj);
						}
						that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(customerArr), "customerInfo");
						that.getView().setModel(new sap.ui.model.json.JSONModel(customerArr), "customerModel");
						that.getView().getModel("customerModel").updateBindings(true);
						// that.getOwnerComponent().getModel("customerModel").oData = customerArr;
						//that.getOwnerComponent().getModel("customerModel").updateBindings(true);
						//console.log(res);
						//alert(res);
					}
				});
			},
			onSearch: function (evt) {
				var searchString = this.getView().byId("userSearchId").getValue();
				var binding = this.getView().byId("itemlistId").getBinding("items");
				if (searchString && searchString.length > 0) {
					var filter1 = new Filter("dCustomerName", "Contains", searchString);
					var filter2 = new Filter("dWebsite", "Contains", searchString);
					var filter3 = new Filter("id", FilterOperator.EQ, searchString);
					var filter4 = new Filter("dBillingAddress", "Contains", searchString);
					var filter5 = new Filter("dCustomerContact_Name", "Contains", searchString);
					var searchFilter = [filter1, filter2, filter3, filter4, filter5];
					var newfilter = new sap.ui.model.Filter(searchFilter, false);
					var afilters = [];
					afilters.push(newfilter);
					binding.filter(afilters);
				} else {
					var afil = [];

					binding.filter(afil);
				}
			},
			// if (searchString && searchString.length > 0) {
			// 	var filter1 = new Filter("dCustomerName", "Contains", evt.getParameter("newValue", searchString));
			// 	var filter2 = new Filter("dWebsite", "Contains", evt.getParameter("newValue", searchString));
			// 	var filter3 = new Filter("id", "EQ", evt.getParameter("newValue", searchString));
			// 	sFilters.push(filter3);
			// 	var searchFilter = [filter1, filter2];
			// 	var filter2 = new sap.ui.model.Filter(sFilters, false);
			// 	var filter3 = new sap.ui.model.Filter(searchFilter, false);
			// 	var filters = [];
			// 	filters.push(filter2);
			// 	filters.push(filter3);
			// 	binding.filter(filters);
			// }else {
			// 	binding.filter(new sap.ui.model.Filter("id", "EQ", evt.getParameter("newValue", searchString)));
			// }

			onNavBack: function () {
				this.getView().getModel("appView").setProperty("/layout", "OneColumn");
				this.getOwnerComponent().getRouter().navTo("Help");
			},
			__openAddNewCustomer: function () {
				// var that = this;
				//	MessageToast.show("Title clicked");
				//	this.onCloseDetailPress();
				this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				this.getOwnerComponent().getRouter().navTo("AddNewCustomer");
			},

			openAddNewCustomer: function () {
				var that = this;
				//	MessageToast.show("Title clicked");
				//	this.onCloseDetailPress();
				this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getView().getModel("appView").updateBindings(true);
				this.getOwnerComponent().getRouter().navTo("AddNewCustomer", {
					AddCust: "Add"
				});
			},

			handleUsersListPress: function (oEvent) {
				var projectArr = [];
				for (var i = 0; i < 10; i++) {
					projectArr.push(i);
				}
				this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				// this.getView().getModel("appView").setProperty("/previousPage", "Master");
				this.index = oEvent.getSource().getSelectedContextPaths()[0].split("")[1];
				var topicIndex = oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().id;
				this.projectId = oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().projectId;
				//this.projectId = oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().id;
				this.getView().getModel("appView").setProperty("/projectId", this.projectId);
				this.newCustomerId = oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().id;
				this.getView().getModel("appView").setProperty("/newCustomerId", this.newCustomerId);
				var customerQuotationId = oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().customerQuotationId;
				this.getView().getModel("appView").setProperty("/customerQuotationId", customerQuotationId);
				this.customerContactId = oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().customerContactId;
				this.getView().getModel("appView").setProperty("/customerContactId", this.customerContactId);
				this.getView().getModel("appView").setProperty("/CustomerProjectForIds",
					oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().customerProjects);
				// var customerTypeId = oEvent.getSource().getSelectedItem().getBindingContext("customerModel").getObject().customerTypeId;
				// this.getView().getModel("appView").setProperty("/customerTypeId", customerTypeId);
				this.getView().getModel("appView").setProperty("/indexNo", this.index);
				this.getOwnerComponent().getRouter().navTo("Detail", {
					id: topicIndex,
					moduleIndex: this.index,
					newprojectId: this.projectId
				});
			},
			handleProjectData: function () {
				var that = this;
				$.ajax({
					url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=24",
					type: 'GET',
					"headers": {
						"content-type": "application/json"
					},
					dataType: 'json', // added data type
					success: function (res) {
						if(res.data.length != 0 && res.data != undefined){
							var contactData = res.data[0].attributes.d_customer_contacts.data;
							var customerArr = [];
						}else{
							var arr = [];
						}
						for (var i = 0; i < contactData.length; i++) {
							if (that.newCustomerId == contactData[i].id) {
								var obj = {
									id: contactData[i].id,
									dCustomerContact_Name: contactData[i].attributes.dCustomerContact_Name,
									dCustomer_ContactEmail: contactData[i].attributes.dCustomer_ContactEmail,
									dCustomer_Conact_DirectPhone: contactData[i].attributes.dCustomer_Conact_DirectPhone,
									dCustomer_ContactMobile: contactData[i].attributes.dCustomer_ContactMobile,
									createdAt: contactData[i].attributes.createdAt,
									updatedAt: contactData[i].attributes.updatedAt,
									publishedAt: contactData[i].attributes.publishedAt

								};
							}
						}
						customerArr.push(obj);
						that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(customerArr), "ContactInfo");
					}
				});
			},
			handleSortfragment: function () {
				if (!this.sortcustomerFragment) {
					this.sortcustomerFragment = sap.ui.xmlfragment("MDG.Help.fragment.sortCustomer", this);
				}
				this.sortcustomerFragment.open();
			},

			collectFileData: function (oEvent) {
				var file = oEvent.getParameter("files")[0];
				this.fileData = {
					fileName: file.name,
					mediaType: file.type,
					url: "",
					keyword: "",
					shortDescription: ""
				};
			},

			__handleAddUserOkPress: function () {
				var step1Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent();
				var step2Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent();
				var step3Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[2].getContent()[0].getContent();
				this.fileData.keyword = step3Content[1].getValue();
				this.fileData.shortDescription = step3Content[2].getValue();
				var newId = this.maxId + 1;
				var oUserDetails = {
					//id: 104, 
					//100 + this.getOwnerComponent().getModel("userInfo").getData().length + 1
					id: "CUST" + newId,
					customerName: step1Content[1].getValue(),
					email: step1Content[3].getValue(),
					contact: step1Content[5].getValue(),

					//city:step1Content[9].getValue()
					address: step1Content[7].getValue(),

					contactPerson: step2Content[1].getValue(),
					contactEmail: step2Content[3].getValue(),
					contactPhone: step2Content[5].getValue(),
					contactDesignation: step2Content[7].getValue()
						//,zipCode:step1Content[13].getValue()
						,
					documents: [this.fileData]
				};

				// oUserDetails.id = oUserDetails.id + 1;
				var oModel = this.getView().getModel();
				var aUsers = oModel.getData();
				aUsers.push(oUserDetails);
				oModel.updateBindings(true);
				this.maxId++;
				this.handleWizardCancel();
				MessageToast.show("New Customer added succesfuly.");
			},

			handleAddUserOkPress: function () {
				var step1Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent();
				var step2Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent();
				var step3Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[2].getContent()[0].getContent();
				this.fileData.keyword = step3Content[1].getValue();
				this.fileData.shortDescription = step3Content[2].getValue();
				var newId = this.maxId + 1;
				var oUserDetails = {
					//id: 104, 
					//100 + this.getOwnerComponent().getModel("userInfo").getData().length + 1
					id: "CUST" + newId,
					customerName: step1Content[1].getValue(),
					email: step1Content[3].getValue(),
					contact: step1Content[5].getValue(),

					//city:step1Content[9].getValue()
					address: step1Content[7].getValue(),

					contactPerson: step2Content[1].getValue(),
					contactEmail: step2Content[3].getValue(),
					contactPhone: step2Content[5].getValue(),
					contactDesignation: step2Content[7].getValue(),
					//,zipCode:step1Content[13].getValue()

					documents: [this.fileData]
				};

				// oUserDetails.id = oUserDetails.id + 1;
				var oModel = this.getView().getModel();
				var aUsers = oModel.getData();
				aUsers.push(oUserDetails);
				oModel.updateBindings(true);
				this.maxId++;
				this.handleWizardCancel();
				MessageToast.show("New Customer added succesfuly.");
			},

			handleWizardCancel: function () {
				this.AddcustomerFragment.close();
				this.clearData();
			},
			clearData: function () {

				var step1Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent();
				var step2Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent();
				var step3Content = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[2].getContent()[0].getContent();
				step1Content[1].setValue("");
				step1Content[3].setValue("");
				step1Content[5].setValue("");
				step1Content[7].setValue("");
				step1Content[9].setValue("");

				step2Content[1].setValue("");
				step2Content[3].setValue("");
				step2Content[5].setValue("");
				step2Content[7].setValue("");

				step3Content[1].setValue("");
				step3Content[2].setValue("");
			},

			handleAddUserCancelPress: function () {
				// this.valueHelpForNewUser.getContent()[2].getContent()[5].setValueState("None");
				this.AddcustomerFragment.close();
			},
			onDialogNextButton: function () {
				if (this._oWizard.getProgressStep().getValidated()) {
					this._oWizard.nextStep();
				}

				this.handleButtonsVisibility();
			},
			// handleSortfragment:function(){
			// 	if(!this.sortcustomerFragment) { 
			//                  this.sortcustomerFragment = sap.ui.xmlfragment("MDG.Customer.fragment.sortCustomer", this);

			//              }

			//              this.sortcustomerFragment.open();
			// },
			handleConfirm: function (oEvent) {
				var oSortItem = oEvent.getParameter("sortItem");
				var sColumnPath = "id";
				var sColumnPath1 = "dCustomerName";
				var sColumnPath2 = "dWebsite";
				var bDescending = oEvent.getParameter("sortDescending");
				var aSorter = [];
				if (oSortItem) {
					sColumnPath = oSortItem.getKey();
					sColumnPath1 = oSortItem.getKey();
					sColumnPath2 = oSortItem.getKey();
				}
				aSorter.push(new Sorter(sColumnPath, bDescending));
				aSorter.push(new Sorter(sColumnPath1, bDescending));
				aSorter.push(new Sorter(sColumnPath2, bDescending));
				var oList = this.getView().byId("itemlistId");
				var oBinding = oList.getBinding("items");
				oBinding.sort(aSorter);
			}

		});
	});