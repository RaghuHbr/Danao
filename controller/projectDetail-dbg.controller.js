sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Context",
	"MDG/Help/util/formatter",
	"sap/ui/model/Filter",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, Context, formatter, Filter, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("MDG.Help.controller.projectDetail", {
		formatter: formatter,
		onInit: function () {
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var that = this;
			// this.getView().getModel("collectionModel");
			// this.getView().byId("collectionName").setFilterFunction(function (sTerm, oItem) {
			// 	return oItem.getText().match(new RegExp(sTerm, "DCollection_Name")) || oItem.getKey().match(new RegExp(sTerm, oItem.getParameter("newValue")));
			// });
			if (!this.newQuotation) {
				this.newQuotation = sap.ui.xmlfragment("MDG.Help.fragment.createQuotation", this);
				this.getView().addDependent(this.newQuotation);
			}
			if (!this.quotationCart) {
				this.quotationCart = sap.ui.xmlfragment("MDG.Help.fragment.AddtoCart", this);
				this.getView().addDependent(this.quotationCart);
			}
			if (!this.itemSummary) {
				this.itemSummary = sap.ui.xmlfragment("MDG.Help.fragment.itemSummary", this);
				this.getView().addDependent(this.itemSummary);
			}
			if (!this.valueHelpForCustomerContact) {
				this.valueHelpForCustomerContact = new sap.ui.xmlfragment("MDG.Help.fragment.valueHelpForCustomerContact", this);
				this.getView().addDependent(this.valueHelpForCustomerContact);
			}
			this.getOwnerComponent().getRouter().getRoute("projectDetail").attachPatternMatched(function (oEvent) {
				var usersModel = that.getOwnerComponent().getModel("customerInfo");
				that.projectId = oEvent.getParameter("arguments").projectId;
				// that.projectId = that.getOwnerComponent().getModel("projectInfo").oData != undefined ? that.getOwnerComponent().getModel(
				// 	"projectInfo").oData[0].id : "";
				that.path = oEvent.getParameter("arguments").id;
				this.getView().getModel("appView").oData.RequestIdSelected = oEvent.getParameter("arguments").id;
				var oContext = new Context(usersModel, "/" + that.path);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()));
				//that.newId = usersModel.oData != undefined ? usersModel.oData[that.Indexpath].id : "";
				that.getView().setModel(new sap.ui.model.json.JSONModel([]), "cartItemSummary");
				that.handleCustomerProject(oEvent.getParameter("arguments").projectId);
				that.newCustomerId = that.getOwnerComponent().getModel("customerProjectInfo").oData != undefined ? that.getOwnerComponent().getModel(
					"customerProjectInfo").oData[0].id : "";
				that.handleQuotationTableDetails(oEvent.getParameter("arguments").projectId);
				that.handleCollectionName();
				var usersModels = that.getOwnerComponent().getModel("CustomerProjectsModel");
				that.path1 = oEvent.getParameter("arguments").newPro;
				var oContext = new Context(usersModels, "/" + that.path1);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()), "ProjectsDataModel");
				//that.customerId = oEvent.getParameter("arguments").id;
				that.handleProjectType(oEvent.getParameter("arguments").id);
				that.handleProjectCategory(oEvent.getParameter("arguments").id);
				that.handleSalesStage(oEvent.getParameter("arguments").id);
				that.handleCustomerQuotation(oEvent.getParameter("arguments").projectId);
				that.handleContactTypeDetail(oEvent.getParameter("arguments").id);

			}, this);
			that.maxId = 100 + that.getOwnerComponent().getModel("customerInfo").getData().length;
			//that.handleCategoryName();
			that.handleQuotationItemsDetail();
			/*that.productName();
			that.prodectSpec();*/
		},
		handleDeleteContact: function (oEvent) {
			var that = this;
			var projectId = that.projectId;
			// var	customerId = this.getView().getModel("appView").getProperty("/customerId", this.index);
			var selected = oEvent.getSource().getBindingContext("newContactModel").sPath.split("/")[1];
			MessageBox.confirm("Do you want delete the customer contact", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {

					if (oAction === "YES") {
						var obj = {
							// id: customerId,
							// id: this.getView().getModel().getProperty.customerId,?populate=*&filters[id][$eq]=
						};

						$.ajax({
							url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + projectId,
							//	url: "/DanaoStrapi/api/d-customer-s?populate=*&filters[id][$eq]=" + that.customerId,
							type: "GET",
							"headers": {
								"content-type": "application/json"
							},
							dataType: "json", // added data type
							success: function (res) {
								var contactArr = [];
								var contact = res.data[0].attributes.d_customer_contacts.data;
								for (var i = 0; i < contact.length; i++)
									contactArr.push(contact[i]);

								var contactId = contactArr[selected].id;
								$.ajax({
									url: "/DanaoStrapi/api/d-customer-contacts/" + contactId,
									type: "DELETE",
									headers: {
										"content-type": "application/json"
									},
									data: JSON.stringify(obj),
									dataType: "json",
									success: function (res) {
										// var oModel = that.getOwnerComponent().getModel("customerInfo");
										MessageToast.show("Project contact Deleted sucessfully", {
											closeOnBrowserNavigation: false
										});
										// that.onCloseDetailPress();
										that.handleContactTypeDetail();
									}
								});
							}

						});

					}
				}
			});
		},
		//INDIVITUAL DELETE QUOTATION
		handleDeleteQuotationPress: function (evt) {
			var that = this;
			// var customerId = this.getView().getModel("appView").getProperty("/customerId", this.index);
			// var selected = oEvent.getSource().getBindingContext("DetailProjectsModel").sPath.split("/")[1];
			var selected = evt.getSource().getBindingContext("QuotaionDetailsModel").sPath.split("/")[1];
			MessageBox.confirm("Do you want delete the Quotation?", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					if (oAction === "YES") {
						$.ajax({
							url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + that.projectId,
							type: "GET",
							"headers": {
								"content-type": "application/json"
							},
							dataType: "json",
							success: function (res) {
								var quotationArr = [];
								var quotation = res.data[0].attributes.d_customer_quotations.data;
								for (var i = 0; i < quotation.length; i++)
									quotationArr.push(quotation[i]);
								var quotationId = quotationArr[selected].id;
								$.ajax({
									url: "/DanaoStrapi/api/d-customer-quotations/" + quotationId,
									type: "DELETE",
									"headers": {
										"content-type": "application/json"
									},
									dataType: "json",
									success: function (res) {
										that.handleQuotationTableDetails(that.projectId);
										MessageToast.show("Quotation Deleted sucessfully", {
											closeOnBrowserNavigation: false
										});
									}
								});
							}
						});
					}
				}
			});
		},
		handleAddNewContact: function () {
			this.valueHelpForCustomerContact.open();
		},
		handleAddCustomerCancel: function () {
			this.valueHelpForCustomerContact.getContent()[0].getContent()[1].setValue("");
			this.valueHelpForCustomerContact.getContent()[0].getContent()[3].setValue("");
			this.valueHelpForCustomerContact.getContent()[0].getContent()[5].setValue("");
			this.valueHelpForCustomerContact.getContent()[0].getContent()[7].setValue("");
			this.valueHelpForCustomerContact.getContent()[0].getContent()[9].setValue("");
			this.valueHelpForCustomerContact.close();
		},
		handleContactTypeDetail: function () {
			var that = this;
			var projectId = that.projectId;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-contacts?populate=*&pagination[pageSize]=200",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var arr = [];
					var contactData = res.data;
					for (var m = 0; m < contactData.length; m++) {
						arr.push({
							DCustomerContact_type: contactData[m].attributes,
							id: contactData[m].id
						});
					}
					that.handleDetailContactData(projectId, arr);
				}
			});
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-contact-types?populate=*",

				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var arr = [];
					var contactData = res.data;
					for (var m = 0; m < contactData.length; m++) {
						arr.push({
							"DCustomerContact_type": contactData[m].attributes.DCustomerContact_type,
							id: contactData[m].id
						});
					}
					var model = new sap.ui.model.json.JSONModel(arr);
					that.getView().setModel(model, "contactTypeModel");
				}
			});
		},
		handleDetailContactData: function (projectId, arr) {
			var that = this;
			$.ajax({
				//	url: "/DanaoStrapi/api/d-customer-contacts?populate=*&filters[id][$eq]=" + projectId,
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + projectId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var contactData = res.data[0].attributes.d_customer_contacts.data;
					var contactArr = [],
						customerTypeArr = [];
					var contactType = [];
					for (var i = 0; i < arr.length; i++) {
						for (var m = 0; m < contactData.length; m++) {
							//	contactData.d_customer_contacts.data[m].attributes.dCustomerContact_Name
							if (contactData[m].attributes.dCustomerContact_Name === arr[i].DCustomerContact_type.dCustomerContact_Name) {
								contactArr.push(arr[i]);
							}
						}
					}
					// for (var m = 0; m < contactData.length; m++) {
					// 	for (var i = 0; i < arr.length; i++) {
					// 	//	contactData.d_customer_contacts.data[m].attributes.dCustomerContact_Name
					// 		if (contactData.d_customer_contacts.data[m].attributes.dCustomerContact_Name === arr[i].DCustomerContact_type.dCustomerContact_Name) {
					// 			contactArr.push(arr[i]);
					// 		}
					// 	}
					// }
					// 	var customerTypeData = res.data[0].attributes.d_customer_contact_type.data.attributes.DCustomerContact_type;
					// 	for (var n = 0; n < customerTypeData.length; n++) {
					// 		customerTypeArr.push(customerTypeData);
					// 	}
					// //	console.log(contactArr);
					// 	that.getOwnerComponent().getModel("DetailCustomerTypeModel").oData = customerTypeArr;
					// 	that.getOwnerComponent().getModel("DetailCustomerTypeModel").updateBindings(true);
					that.getOwnerComponent().getModel("newContactModel").oData = contactArr;
					that.getOwnerComponent().getModel("newContactModel").updateBindings(true);
				}
			});
		},
		handleAddCustomerContactPost: function () {
			var that = this;
			var customerId = that.newCustomerId;
			var projectId = that.projectId;
			$.ajax({
				//	url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + customerId, //customerid
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + projectId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					if (res.data.length != 0) {
						var contactData = res.data[0].attributes.d_customer_contacts.data;
					}
					var contactArr = [],
						customerTypeArr = [],
						contactType = [];
					for (var m = 0; m < contactData.length; m++) {
						customerTypeArr.push(contactData[m].id);
					}
					$.ajax({
						url: "/DanaoStrapi/api/d-customer-contacts?populate=*",
						type: "GET",
						"headers": {
							"content-type": "application/json"
						},
						dataType: "json",
						success: function (res) {
							var Arr = res.data;
							var custType = [];
							for (var i = 0; i < customerTypeArr.length; i++) {
								for (var j = 0; j < Arr.length; j++) {
									if (Arr[j].id === customerTypeArr[i]) {
										custType.push(Arr[j].attributes.d_customer_contact_type.data === null ? "" : Arr[j].attributes.d_customer_contact_type
											.data.attributes.DCustomerContact_type);
									}
								}
							}
							var obj = {
								"data": {
									dCustomerContact_Name: that.valueHelpForCustomerContact.getContent()[0].getContent()[1].getValue(),
									dCustomer_ContactEmail: that.valueHelpForCustomerContact.getContent()[0].getContent()[3].getValue(),
									dCustomer_Conact_DirectPhone: that.valueHelpForCustomerContact.getContent()[0].getContent()[5].getValue(),
									d_customer_contact_type: [that.valueHelpForCustomerContact.getContent()[0].getContent()[7].getSelectedKey()],
									//	dCustomer_Conact_Type: that.valueHelpForCustomerContact.getContent()[0].getContent()[7].getSelectedKey(),
									dCustomer_ContactMobile: that.valueHelpForCustomerContact.getContent()[0].getContent()[9].getValue()
								}
							};
							//	var customerId = that.customerId;
							if (custType.includes("Main Contact") === true) {
								if (obj.data.d_customer_contact_type[0] === "3") {
									sap.m.MessageBox.error("There can only be one Main contact");
								} else {
									$.ajax({
										url: "/DanaoStrapi/api/d-customer-contacts",
										type: "POST",
										"headers": {
											"content-type": "application/json"
										},
										data: JSON.stringify(obj),
										dataType: "json",
										success: function (res) {
											var ContactId = res.data.id;
											that.addCustomerContact(obj, projectId, ContactId);
											that.handleAddCustomerCancel();
											MessageBox.success("Contact has beeen Added");
										},
										error: function (err) {
											MessageBox.error(err.responseJSON.error.message);
										}
									});
								}
							} else {
								$.ajax({
									url: "/DanaoStrapi/api/d-customer-contacts",
									type: "POST",
									"headers": {
										"content-type": "application/json"
									},
									data: JSON.stringify(obj),
									dataType: "json",
									success: function (res) {
										var ContactId = res.data.id;
										that.addCustomerContact(obj, projectId, ContactId);
										that.handleAddCustomerCancel();
										MessageBox.success("Contact has beeen Added");
									},
									error: function (err) {
										MessageBox.error(err.responseJSON.error.message);
									}
								});
							}
						}
					});
				}
			});

		},
		addCustomerContact: function (obj, projectId, ContactId) {
			var that = this;
			//	var projectId = that.projectId;
			$.ajax({
				// url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + customerId, //projectId for contacts
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + projectId, //change to projectid
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var contactData = res.data[0].attributes.d_customer_contacts.data;
					var contactArr = [],
						customerTypeArr = [];
					var contactType = [];
					for (var m = 0; m < contactData.length; m++) {
						customerTypeArr.push(contactData[m].id);
					}
					customerTypeArr.push(ContactId);
					var obj = {
						"data": {
							"d_customer_contacts": customerTypeArr
						}
					};
					$.ajax({
						//	api/d-customer-projects
						url: "/DanaoStrapi/api/d-customer-projects/" + projectId,
						type: "PUT",
						"headers": {
							"content-type": "application/json"
						},
						data: JSON.stringify(obj),
						dataType: "json",
						success: function (res) {
							that.handleContactTypeDetail();
						}
					});
				}
			});
		},

		//DELETE BUTTON
		handleDeleteUserPress: function (projectId) {
			var that = this;
			projectId = that.projectId;
			MessageBox.confirm("Do you want to delete the project?", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					if (oAction === "YES") {
						$.ajax({
							url: "/DanaoStrapi/api/d-customer-projects/" + that.projectId,
							type: "DELETE",
							"headers": {
								"content-type": "application/json"
							},
							dataType: "json",
							success: function (res) {
								MessageToast.show("Project has been deleted successfully!", {
									closeOnBrowserNavigation: false
								});
								that.onCloseDetailPress();
							}
						});
					}
				}
			});
		},
		//Close Project Detail
		onCloseDetailPress: function (evt) {
			var that = this;
			that.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Detail", {
				id: that.newCustomerId,
				moduleIndex: "0",
				newprojectId: that.projectId
			});
		},
		handleEditUserPress: function () {
			var that = this;
			that.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			that.getView().getModel("appView").updateBindings(true);
			that.getOwnerComponent().getRouter().navTo("addNewProject", {
				AddPro: that.newCustomerId,
				mode: "Edit",
				projectId: that.projectId
			});
		},
		handleCustomerProject: function (customerId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + customerId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					//var data = res.data[0].attributes.d_project_type.data;
					var data = res.data;
					var projectArr = [],
						salesArr = [],
						categArr = [];
					for (var m = 0; m < data.length; m++) {
						projectArr.push(data[m].attributes.d_project_type.data.attributes);
					}
					for (var b = 0; b < data.length; b++) {
						salesArr.push(data[b].attributes.d_project_sales_stage.data.attributes);
					}
					for (var k = 0; k < data.length; k++) {
						categArr.push(data[k].attributes.d_project_category.data.attributes);
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(projectArr), "proDataModel");
					that.getView().getModel("proDataModel").updateBindings(true);
					that.getView().setModel(new sap.ui.model.json.JSONModel(salesArr), "salesModel");
					that.getView().getModel("salesModel").updateBindings(true);
					that.getView().setModel(new sap.ui.model.json.JSONModel(categArr), "categModel");
					that.getView().getModel("categModel").updateBindings(true);
				}

			});
		},
		//Quotation Fragment
		handlenewQuotation: function () {
			this.handleQuotationItemsDetail();
			this.newQuotation.getContent()[0].getContentLeft()[1].setSelectedKey(null);
			this.newQuotation.getContent()[0].getContentMiddle()[1].setSelectedKey(null);
			this.newQuotation.open();
		},
		//Close fragment
		onCloseQuotation: function () {
			this.newQuotation.close();
		},
		// //Close Project Detail
		// onCloseDetailPress: function () {
		// 	this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
		// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		// 	oRouter.navTo("Detail", {
		// 		id: "tile",
		// 		moduleIndex: "index"
		// 	});
		// },
		handleCollectionName: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-collections?populate=*",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var collectionName = res.data;
					var collectionArr = [];
					for (var m = 0; m < collectionName.length; m++) {
						collectionName[m].attributes.id = collectionName[m].id;
						//collectionName[m].attributes.d_products.data[0].attributes.DProduct_Name
						collectionArr.push(collectionName[m].attributes);
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(collectionArr), "collectionModel");
					that.getView().getModel("collectionModel").updateBindings(true);
					console.log(collectionArr);
				}
			});
		},
		handleProjectType: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-project-types?populate=*",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var projectName = res.data;
					var projectArr = [];
					for (var m = 0; m < projectName.length; m++) {
						projectName[m].attributes.id = projectName[m].id;
						projectArr.push(projectName[m].attributes);
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(projectArr), "ProjectTypeModel");
				}
			});
		},
		handleSalesStage: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-project-sales-stages?populate=*",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var projectName = res.data;
					var projectArr = [];
					for (var m = 0; m < projectName.length; m++) {
						projectName[m].attributes.id = projectName[m].id;
						projectArr.push(projectName[m].attributes);
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(projectArr), "ProjectModel");
				}
			});
		},
		handleProjectCategory: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-project-categories?populate=*",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var projectName = res.data;
					var projectArr = [];
					for (var m = 0; m < projectName.length; m++) {
						projectName[m].attributes.id = projectName[m].id;
						projectArr.push(projectName[m].attributes);
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(projectArr), "ProjectCategoryModel");
				}
			});
		},
		handleSelectCollection: function (evt) {
			var that = this;
			that.collectionData = evt.getSource().getSelectedItem().getBindingContext("collectionModel").getObject().d_products.data;
			that.selectedData = evt.getSource().getSelectedItem().getBindingContext("collectionModel").getObject().d_product_types.data;
			var categoryArr = [];
			for (var m = 0; m < that.selectedData.length; m++) {
				categoryArr.push({
					id: that.selectedData[m].id,
					DProduct_Type: that.selectedData[m].attributes.DProduct_Type
				});
			}
			that.getView().setModel(new sap.ui.model.json.JSONModel(categoryArr), "categoryModel");

		},
		handleSelectCategory: function (evt) {
			var that = this;
			//that.categoryNewId = [];
			that.categoryData = evt.getSource().getSelectedItem().getBindingContext("categoryModel").getObject().id;
			//that.categoryData = evt.getSource().getSelectedItem().getBindingContext("categoryModel").getObject().DProduct_Type;
			// $.ajax({
			// 	url: "/DanaoStrapi/api/d-product-types?populate=*",
			// 	type: "GET",
			// 	"headers": {
			// 		"content-type": "application/json"
			// 	},
			// 	dataType: "json",
			// 	success: function (res) {
			// 		that.categoryName = res.data;
			// 		for (var m = 0; m < that.categoryName.length; m++) {
			// 			that.categoryNewId.push(that.categoryName[m].id);
			// 		}
			// 		//that.getView().setModel(new sap.ui.model.json.JSONModel(categoryArr), "categoryModel");
			// 	}
			// });

		},
		onPressGo: function () {
			var that = this;
			//var data = this.newQuotation.getContent()[0].getContentRight()[0];
			$.ajax({
				url: "/DanaoStrapi/api/d-products?populate=*",
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					var productData = res.data,
						categorySelectedProduct = [],
						SelectedProduct = [];
					for (var i = 0; i < that.collectionData.length; i++) {
						//for (var k = 0; k < that.selectedData.length; k++) {
						for (var b = 0; b < productData.length; b++) {
							if (that.categoryData == null && that.collectionData[i].attributes.DProduct_Name == productData[b].attributes.DProduct_Name) {
								//if (that.collectionData == productData[b].id) {
								//that.handleQuotationItemsDetail(categoryData);
								categorySelectedProduct.push(productData[b]);
							}
						}
					}
					//for (var k = 0; k < that.categoryNewId.length; k++) {
					for (var l = 0; l < productData.length; l++) {
						// if (that.selectedData[k].attributes.DProduct_Type == productData[b].attributes.d_product_type.data.attributes.DProduct_Type) {
						if (that.categoryData == productData[l].attributes.d_product_type.data.id) {
							SelectedProduct.push(productData[l]);
						}
					}
					//}
					var arr1 = categorySelectedProduct;
					var arr2 = SelectedProduct;
					res.data = arr1.concat(arr2);
					//	res.data = categorySelectedProduct;
					var rowCount = 0;
					that.newQuotation.getContent()[1].getContent()[0].removeAllContent();
					for (var m = 0; m < res.data.length; m++) {
						if (rowCount == 0) {
							rowCount++;
							var blockLayoutRow = new sap.ui.layout.BlockLayoutRow();
							that.newQuotation.getContent()[1].getContent()[0].addContent(blockLayoutRow);
						} else {
							rowCount--;
						}
						var blockLayoutCell = new sap.ui.layout.BlockLayoutCell();
						var flexboxTitle = new sap.m.FlexBox({
							height: "3.5rem"
						});
						var verticalLayout = new sap.ui.layout.VerticalLayout({});
						var identifier = new sap.m.ObjectIdentifier({
							title: res.data[m].attributes.DProduct_Name,
							//class:sapUiTinyMarginBottom
						});
						identifier.addStyleClass("sapUiTinyMarginBottom");
						var productNumber = new sap.m.Label({
							text: "Product Number : " + res.data[m].attributes.DProduct_Number,
							class: "sapUiSmallMarginBottom"
						});
						productNumber.addStyleClass("sapUiSmallMarginBottom");
						var status = new sap.m.ObjectStatus({
							text: "Available",
							state: "Success"
						});
						verticalLayout.addContent(identifier);
						verticalLayout.addContent(productNumber);
						verticalLayout.addContent(status);
						flexboxTitle.addItem(verticalLayout);
						var flexboxImage = new sap.m.FlexBox({
							renderType: "Bare",
							justifyContent: "Center"
						});
						var image = new sap.m.Image({
							height: "15rem",
							width: "15rem",
							src: res.data[m].attributes.DProduct_Image.data[0].attributes.name
						});
						image.addStyleClass("QuotationImageClass");
						flexboxImage.addItem(image);
						blockLayoutCell.addContent(flexboxTitle);
						blockLayoutCell.addContent(flexboxImage);
						var cartButton = new sap.m.Button({
							//press: that.onAddToCart,
							press: function (evt) {
								var selectedId = evt.getSource().getParent().getParent().getContent()[0].getItems()[0].getContent()[1].getText()
									.split(
										" : ")[1];
								that.handleitemSummary(selectedId);
								//that.handleQuotationDetail(selectedId);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(-
									1);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[1].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[3].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[5].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[7].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(0);

							},
							icon: "sap-icon://cart-3",
							type: "Emphasized"
						});
						/*	var price = new sap.m.ObjectListItem({
								number:res.data[m].attributes.DProduct_Price_Grade_A,
								numberUnit:"EUR"
							});*/
						var price = new sap.m.FlexBox({
							alignItems: "Center",
							justifyContent: "End",
							items: new sap.m.ObjectListItem({
								number: Math.round((that.customerTypeArr / 100) * res.data[m].attributes.DProduct_Price_Grade_A),
								numberUnit: "USD",
								numberState: "Success"
							})
						});
						var HBox = new sap.m.HBox({
							items: [cartButton, price]
						});
						price.addStyleClass("welcomePrice");
						/*	blockLayoutCell.addContent(cartButton);
							blockLayoutCell.addContent(price);*/
						blockLayoutCell.addContent(HBox);
						blockLayoutRow.addContent(blockLayoutCell);

					}
				}
			});
		},
		handleCustomerQuotation: function (customerContactId) {
			customerContactId = this.getView().getModel("appView").getProperty("/customerContactId");
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-types?populate=*&filters[id][$eq]=" + customerContactId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var customerTypeData = res.data;
					that.customerTypeArr = [];
					for (var m = 0; m < customerTypeData.length; m++) {
						//customerTypeData[m].attributes[that.price] = customerTypeData[m].id;
						that.customerTypeArr.push(customerTypeData[m].attributes.dCustomer_Type_DiscStructure);
					}
					that.getView().getModel("appView").setProperty("/discountPrice", that.customerTypeArr[0]);
					that.getOwnerComponent().getModel("qCustomerTypeModels").oData = that.customerTypeArr;
					that.getOwnerComponent().getModel("qCustomerTypeModels").updateBindings(true);
				}

			});
		},
		handleQuotationItemsDetail: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-products?populate=*",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					console.log(res.data);
					that.newQuotation.getContent()[1].getContent()[0].removeAllContent();
					var rowCount = 0;
					for (var m = 0; m < res.data.length; m++) {
						if (rowCount == 0) {
							rowCount++;
							var blockLayoutRow = new sap.ui.layout.BlockLayoutRow();
							that.newQuotation.getContent()[1].getContent()[0].addContent(blockLayoutRow);
						} else {
							rowCount--;
						}
						var blockLayoutCell = new sap.ui.layout.BlockLayoutCell();
						var flexboxTitle = new sap.m.FlexBox({
							height: "3.5rem"
						});
						var verticalLayout = new sap.ui.layout.VerticalLayout({});
						var identifier = new sap.m.ObjectIdentifier({
							title: res.data[m].attributes.DProduct_Name,
							//class:sapUiTinyMarginBottom
						});
						identifier.addStyleClass("sapUiTinyMarginBottom");
						var productNumber = new sap.m.Label({
							text: "Product Number : " + res.data[m].attributes.DProduct_Number,
							class: "sapUiSmallMarginBottom"
						});
						productNumber.addStyleClass("sapUiSmallMarginBottom");
						var status = new sap.m.ObjectStatus({
							text: "Available",
							state: "Success"
						});
						verticalLayout.addContent(identifier);
						verticalLayout.addContent(productNumber);
						verticalLayout.addContent(status);
						flexboxTitle.addItem(verticalLayout);
						var flexboxImage = new sap.m.FlexBox({
							renderType: "Bare",
							justifyContent: "Center"
						});
						var image = new sap.m.Image({
							height: "15rem",
							width: "15rem",
							src: res.data[m].attributes.DProduct_Image.data[0].attributes.name
						});
						image.addStyleClass("QuotationImageClass");
						flexboxImage.addItem(image);
						blockLayoutCell.addContent(flexboxTitle);
						blockLayoutCell.addContent(flexboxImage);
						var cartButton = new sap.m.Button({
							//press: that.onAddToCart,
							press: function (evt) {
								var selectedId = evt.getSource().getParent().getParent().getContent()[0].getItems()[0].getContent()[1].getText()
									.split(
										" : ")[1];
								that.handleitemSummary(selectedId);
								//that.handleQuotationDetail(selectedId);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(-
									1);
								//that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[19].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[1].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[3].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[5].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[7].setVisible(
									false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(0);
							},
							icon: "sap-icon://cart-3",
							type: "Emphasized"
						});
						/*	var price = new sap.m.ObjectListItem({
								number:res.data[m].attributes.DProduct_Price_Grade_A,
								numberUnit:"EUR"
		 					});*/
						var price = new sap.m.FlexBox({
							alignItems: "Center",
							justifyContent: "End",
							items: new sap.m.ObjectListItem({
								number: Math.round((that.customerTypeArr / 100) * res.data[m].attributes.DProduct_Price_Grade_A),
								numberUnit: "USD",
								numberState: "Success"
									//formatter: formatter.priceFormat
							})
						});
						var HBox = new sap.m.HBox({
							items: [cartButton, price]
						});
						price.addStyleClass("welcomePrice");
						/*	blockLayoutCell.addContent(cartButton);
							blockLayoutCell.addContent(price);*/
						blockLayoutCell.addContent(HBox);
						blockLayoutRow.addContent(blockLayoutCell);

					}
				}

			});
		},
		//Cart Fragment
		/*onAddToCart: function (evt) {
			var that = this;
			var selectedId = evt.getSource().getParent().getParent().getContent()[0].getItems()[0].getContent()[1].getText().split(" : ")[1]
			
			viewData.handleitemSummary(selectedId);
			viewData.quotationCart.open();
		},*/
		//Close fragment
		onCloseCart: function () {
			this.quotationCart.close();
		},
		handleitemSummary: function (selectedId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-products?populate=*&filters[DProduct_Number][$eq]=" + selectedId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var products = res.data;
					var productsArr = [];
					for (var m = 0; m < products.length; m++) {
						productsArr.push(products[m].attributes);
					}
					if (productsArr[0].d_finish.data == null) {
						sap.m.MessageBox.error("Selected Product doesn't have the finishing Details to show");
					} else {
						that.selectedFinishId = productsArr[0].d_finish.data.id;
						that.handleitemfinishes(that.selectedFinishId);
						that.getOwnerComponent().getModel("quotationItemsDetial").oData = productsArr;
						that.getOwnerComponent().getModel("quotationItemsDetial").updateBindings(true);
					}

				}

			});
		},
		handleitemfinishes: function (selectedFinishId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-finishes?populate=*&filters[id][$eq]=" + selectedFinishId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var allFinishes = res.data;
					var allFinishesArr = [],
						productsArr = [],
						framesArr = [],
						strapsArr = [],
						accentArr = [],
						batyLinesArr = [];
					for (var b = 0; b < allFinishes.length; b++) {
						// allFinishes[b].attributes["id"] = allFinishes[b].id;
						allFinishesArr.push(allFinishes[b].attributes);
					}
					if (allFinishesArr[0].d_accents.data.length == 0) {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[4].setText("");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[15].setVisible(
							false);
					} else {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[4].setText(
							"Selection Display(Accent)");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[15].setVisible(true);
						that.selectedAccentId = allFinishesArr[0].d_accents.data[0].id;
						that.handleItemAccent(that.selectedAccentId);
					}
					if (allFinishesArr[0].d_frame_straps.data.length == 0) {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[2].setText("");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[11].setVisible(
							false);
					} else {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[2].setText(
							"Selection Display(Straps)");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[11].setVisible(true);
						that.selectedStrapId = allFinishesArr[0].d_frame_straps.data[0].id;
						that.handleItemStraps(that.selectedStrapId);
					}
					if (allFinishesArr[0].d_frame_colors.data.length == 0) {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[0].setText("");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[3].setVisible(false);
					} else {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[0].setText(
							"Selection Display(Frames)");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[3].setVisible(true);
						that.selectedFrameId = allFinishesArr[0].d_frame_colors.data[0].id;
						that.handleitemFrames(that.selectedFrameId);
					}
					for (var m = 0; m < res.data[0].attributes.d_fabric_grades.data.length; m++) {
						productsArr.push({
							id: res.data[0].attributes.d_fabric_grades.data[m].id,
							DFabric_Grade: res.data[0].attributes.d_fabric_grades.data[m].attributes.DFabric_Grade
						});
					}
					if (res.data[0].attributes.d_fabric_grades.data.length == 0) {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[6].setText("");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[23].setVisible(
							false);
					} else {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[6].setText(
							"Selection Display(Finishes)");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[23].setVisible(true);
					}
					for (var n = 0; n < res.data[0].attributes.d_batylines.data.length; n++) {
						batyLinesArr.push({
							id: res.data[0].attributes.d_batylines.data[n].id,
							DBatyline_Name: res.data[0].attributes.d_fabric_grades.data[n].attributes.DBatyline_Name
						});
					}
					if (res.data[0].attributes.d_batylines.data.length == 0) {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[19].setVisible(
							false);
					} else {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[19].setVisible(true);
					}
					for (var k = 0; k < res.data[0].attributes.d_frames.data.length; k++) {
						framesArr.push({
							id: res.data[0].attributes.d_frames.data[k].id,
							DFrame_Color: res.data[0].attributes.d_frames.data[k].attributes.DFrame_Color,
							DFrame_Material_Code: res.data[0].attributes.d_frames.data[k].attributes.DFrame_Material_Code,
							DFrame_Material_Name: res.data[0].attributes.d_frames.data[k].attributes.DFrame_Material_Name
						});
					}
					for (var i = 0; i < res.data[0].attributes.d_frame_straps.data.length; i++) {
						strapsArr.push({
							id: res.data[0].attributes.d_frame_straps.data[i].id,
							DFrame_Straps_Name: res.data[0].attributes.d_frame_straps.data[i].attributes.DFrame_Straps_Name,
							DFrame_Straps_Code: res.data[0].attributes.d_frame_straps.data[i].attributes.DFrame_Straps_Code
						});
					}
					for (var j = 0; j < res.data[0].attributes.d_accents.data.length; j++) {
						accentArr.push({
							id: res.data[0].attributes.d_accents.data[j].id,
							DAccent_Name: res.data[0].attributes.d_accents.data[j].attributes.DAccent_Name,
							DAccent_Code: res.data[0].attributes.d_accents.data[j].attributes.DAccent_Code
						});
					}
					/*	that.selectedAccentId = allFinishesArr[0].d_accents.data.id;
						that.handleItemAccent(that.selectedAccentId);
						that.selectedStrapId = allFinishesArr[0].d_frame_straps.data.id;
						that.handleItemStraps(that.selectedStrapId);
						that.selectedFrameId = allFinishesArr[0].d_frame_colors.data.id;
						that.handleitemFrames(that.selectedFrameId);*/
					that.getView().setModel(new sap.ui.model.json.JSONModel(accentArr), "accentModel");
					that.getView().getModel("accentModel").updateBindings(true);
					that.getView().setModel(new sap.ui.model.json.JSONModel(batyLinesArr), "batyLineModel");
					that.getView().getModel("batyLineModel").updateBindings(true);
					that.getView().setModel(new sap.ui.model.json.JSONModel(strapsArr), "strapsModel");
					that.getView().getModel("strapsModel").updateBindings(true);
					that.getView().setModel(new sap.ui.model.json.JSONModel(framesArr), "framesModel");
					that.getView().getModel("framesModel").updateBindings(true);
					// that.getView().setModel(new sap.ui.model.json.JSONModel(productsArr), "quotationItemFinishes");
					// that.getView().getModel("quotationItemFinishes").updateBindings(true);
					that.getOwnerComponent().getModel("quotationItemFinishes").oData = productsArr;
					that.getOwnerComponent().getModel("quotationItemFinishes").updateBindings(true);
					// that.getView().getModel("cartItemSummary").oData = [];
					// that.getView().getModel("cartItemSummary").updateBindings(true);
					//this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getSelectedButton()(-1);
					that.mode = "CREATE";
					that.quotationCart.open();
				}

			});
		},
		handleitemFrames: function (selectedFrameId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-frame-colors?populate=*&filters[id][$eq]=" + selectedFrameId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					//var frames = res.data;
					var framesColorArr = [];
					//	var frameColor = res.data[0].attributes.DFrameColor_Image.data;
					for (var b = 0; b < res.data.length; b++) {
						framesColorArr.push({
							id: res.data[b].id,
							//name: frameColor[b].attributes.name
							DFrameColor: res.data[b].attributes.DFrameColor,
							name: window.location.origin + "/DanaoStrapi" + res.data[b].attributes.DFrameColor_Image.data[0].attributes.url

						});
					}
					// that.getView().getModel("cartItemSummary").oData = [];
					// that.getView().getModel("cartItemSummary").updateBindings(true);
					that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[1].setVisible(true);
					that.getView().setModel(new sap.ui.model.json.JSONModel(framesColorArr), "framesImageModel");
					that.getView().getModel("framesImageModel").updateBindings(true);
					that.mode = "CREATE";
					that.quotationCart.open();
				}

			});
		},
		handleItemStraps: function (selectedStrapId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-frame-straps?populate=*&filters[id][$eq]=" + selectedStrapId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					//var frames = res.data;
					var frameStrapArr = [];
					//	var frameColor = res.data[0].attributes.DFrameColor_Image.data;
					for (var b = 0; b < res.data.length; b++) {
						frameStrapArr.push({
							id: res.data[b].id,
							DFrame_Straps_Name: res.data[b].attributes.DFrame_Straps_Name,
							url: window.location.origin + "/DanaoStrapi" + res.data[b].attributes.DFrame_Straps_Image.data[0].attributes.url

						});
					}
					that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[3].setVisible(true);
					//that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[4].getText();
					that.getView().setModel(new sap.ui.model.json.JSONModel(frameStrapArr), "frameStrapModel");
					that.getView().getModel("frameStrapModel").updateBindings(true);
				}

			});
		},
		handleItemAccent: function (selectedAccentId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-accents?populate=*&filters[id][$eq]=" + selectedAccentId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					var frameAccentArr = [];
					for (var b = 0; b < res.data.length; b++) {
						frameAccentArr.push({
							id: res.data[b].id,
							DAccent_Name: res.data[b].attributes.DAccent_Name,
							Image: window.location.origin + "/DanaoStrapi" + res.data[b].attributes.DAccent_Image.data[0].attributes.url

						});
					}
					that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[5].setVisible(true);
					that.getView().setModel(new sap.ui.model.json.JSONModel(frameAccentArr), "framesAccentModel");
					that.getView().getModel("framesAccentModel").updateBindings(true);
				}

			});
		},
		handleGradeDisplay: function (selectedData) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-fabric-grades?populate=*&filters[id][$eq]=" + selectedData,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					var fabricData = res.data[0].attributes.d_fabrics.data;
					var gradeArr = [];
					for (var m = 0; m < fabricData.length; m++) {
						gradeArr.push({
							id: fabricData[m].id,
							DFabric_Code: fabricData[m].attributes.DFabric_Code,
							DFabric_Name: fabricData[m].attributes.DFabric_Name,
							createdAt: fabricData[m].attributes.createdAt,
							publishedAt: fabricData[m].attributes.publishedAt,
							updatedAt: fabricData[m].attributes.updatedAt
						});
					}
					//that.getOwnerComponent().getModel("fabricModel").oData = gradeArr;
					that.handleImageDisplay(selectedData, gradeArr);

				}
			});
		},
		handleImageDisplay: function (selectedData, gradeArr) {
			var that = this;
			that.gradeArr = gradeArr;
			$.ajax({
				url: "/DanaoStrapi/api/d-fabrics?populate=*&pagination[pageSize]=100",
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					/*var imageData = res.data[0].attributes.DFabric_Image.data;
					var imageArr = [];
					for (var m = 0; m < imageData.length; m++) {
						imageArr.push({
							id: imageData[m].id,
							name: imageData[m].attributes.name
						});
					}
					//to get the image data
					that.getOwnerComponent().getModel("imageModel").oData = imageArr;
					that.getOwnerComponent().getModel("imageModel").updateBindings(true);*/
					for (var b = 0; b < that.gradeArr.length; b++) {
						for (var r = 0; r < res.data.length; r++) {
							if (res.data[r].attributes.DFabric_Code == that.gradeArr[b].DFabric_Code) {
								//that.gradeArr[b]["imageUrl"] = res.data[r].attributes.DFabric_Image.data[0].attributes.name;
								//that.gradeArr[b]["thumbNail"] = res.data[r].attributes.DFabric_Image.data[0].attributes.formats.thumbnail.name.replace("thumbnail_","");
								if (res.data[r].attributes.DFabric_Image.data[0].attributes.name.indexOf("https") != (-1))
									that.gradeArr[b]["imageUrl"] = res.data[r].attributes.DFabric_Image.data[0].attributes.name;
								else
									that.gradeArr[b]["imageUrl"] = window.location.origin + "/DanaoStrapi" + res.data[r].attributes.DFabric_Image.data[
										0].attributes
									.formats.thumbnail.url;
								that.gradeArr[b]["thumbNail"] = res.data[r].attributes.DFabric_Image.data[0].attributes.url;
								break;
							}
						}
					}
					// that.getView().getModel("cartItemSummary").oData = [];
					// that.getView().getModel("cartItemSummary").updateBindings(true);
					that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[7].setVisible(true);
					that.getOwnerComponent().getModel("fabricModel").oData = that.gradeArr;
					that.getOwnerComponent().getModel("fabricModel").updateBindings(true);
				}
			});
		},
		handleGradeButtonSelect: function (evt) {
			var that = this;
			that.selectedData = evt.getSource().getSelectedButton().getBindingContext("quotationItemFinishes").getObject().id;
			if (that.selectedData === 1) {
				//this.selectedGradeId = productsArr[0].d_fabric_grades.data.id;
				that.handleGradeDisplay(that.selectedData);
			} else if (that.selectedData === 2) {
				that.handleGradeDisplay(that.selectedData);
			} else if (that.selectedData === 3) {
				that.handleGradeDisplay(that.selectedData);
			} else {}

		},
		handleAddCartPress: function () {
			var totalQuantity = this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue();
			var totalPrice = this.getView().getModel("appView").getProperty("/totalAmount");
			if (this.selectedData === 1) {
				var unitPrice = Math.round((this.customerTypeArr / 100) * (this.getView().getModel("quotationItemsDetial").oData[0].DProduct_Price_Grade_A));
				//this.Price = Math.round((this.customerTypeArr / 100) * (this.getView().getModel("quotationItemsDetial").oData[0].DProduct_Price_Grade_A));
			} else if (this.selectedData == 2) {
				unitPrice = Math.round((this.customerTypeArr / 100) * (this.getView().getModel("quotationItemsDetial").oData[0].DProduct_Price_GradeB));
				//this.Price = Math.round((this.customerTypeArr / 100) * (this.getView().getModel("quotationItemsDetial").oData[0].DProduct_Price_Grade_A));
			} else {}
			totalPrice = unitPrice * totalQuantity;
			if (this.mode == "CREATE") {
				var cartObj = {
					itemDetails: this.getView().getModel("quotationItemsDetial").oData[0],
					frame: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[4].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[4].getSelectedButton()
						.getText() : "",
					straps: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[12].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[12].getSelectedButton()
						.getText() : "",
					accent: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[16].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[16].getSelectedButton()
						.getText() : "",
					// batyLine: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[10].getSelectedButton() !=
					// 	undefined ?
					// 	this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[10].getSelectedButton().getText() : "",
					grade: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getSelectedButton()
						.getText() : "",
					dProduct_UnitPrice: unitPrice != undefined ? Math.round((this.customerTypeArr / 100) * unitPrice) : "",
					dProduct_Total_Price: totalPrice != undefined ? Math.round((this.customerTypeArr / 100) * totalPrice) : "",
					// dProduct_UnitPrice: (unitPrice).toString() != undefined ? (unitPrice).toString() : "",
					// dProduct_Total_Price: (totalPrice).toString() != undefined ? (totalPrice).toString() : "",
					Qty: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue(),
					SKU: "33230110" + this.getView().getModel("cartItemSummary").oData.length,
					fabricType: this.selectedFabric != undefined ? this.selectedFabric : "",
					fabricName: this.selectedFabric != undefined ? this.selectedFabric.DFabric_Name : "",
					imageUrl: this.selectedFabric != undefined ? this.selectedFabric.imageUrl : "",
					frameImage: this.selectedFrame != undefined ? this.selectedFrame : "",
					strapImage: this.selectedStrap != undefined ? this.selectedStrap : "",
					accentImage: this.selectedAccent != undefined ? this.selectedAccent : "",
					frameColor: this.selectedFrameColor != undefined ? this.selectedFrameColor : "",
					createdAt: this.selectedFabric != undefined ? this.selectedFabric.createdAt : "",
					fabricId: this.selectedFabric != undefined ? this.selectedFabric.id : ""
				};
				var totalAmount = this.getView().getModel("appView").getProperty("/totalAmount");
				totalAmount += cartObj.dProduct_Total_Price;
				var qty = this.getView().getModel("appView").getProperty("/qty");
				qty += this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue();
				this.getView().getModel("appView").setProperty("/totalAmount", totalAmount);
				this.getView().getModel("appView").setProperty("/qty", qty);
				if (this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue() > 0) {
					this.getView().getModel("cartItemSummary").oData.push(cartObj);
					sap.m.MessageToast.show("Item is added to the cart");
					this.getView().getModel("cartItemSummary").updateBindings(true);
					this.quotationCart.close();
				} else
					sap.m.MessageBox.error("Please enter the quantity");
			} else if (this.mode == "EDIT") {
				this.cartObjUpdated = {
					itemDetails: this.getView().getModel("quotationItemsDetial").oData[0],
					frame: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[4].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[4].getSelectedButton()
						.getText() : "",
					straps: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[12].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[12].getSelectedButton()
						.getText() : "",
					accent: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[16].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[16].getSelectedButton()
						.getText() : "",
					// batyLine: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[10].getSelectedButton() !=
					// 	undefined ?
					// 	this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[10].getSelectedButton().getText() : "",
					grade: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getSelectedButton() !=
						undefined ?
						this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getSelectedButton()
						.getText() : "",
					dProduct_UnitPrice: unitPrice != undefined ? Math.round((this.customerTypeArr / 100) *
						unitPrice) : "",
					dProduct_Total_Price: totalPrice != undefined ? Math.round((this.customerTypeArr /
						100) * totalPrice) : "",
					// dProduct_UnitPrice: (unitPrice).toString() != undefined ? (unitPrice).toString() : "",
					// dProduct_Total_Price: (totalPrice != undefined ? (totalPrice).toString() : "",
					Qty: this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue(),
					SKU: "33230110" + this.getView().getModel("cartItemSummary").oData.length,
					fabricType: this.selectedFabric != undefined ? this.selectedFabric : "",
					fabricName: this.selectedFabric != undefined ? this.selectedFabric.DFabric_Name : "",
					imageUrl: this.selectedFabric != undefined ? this.selectedFabric.imageUrl : "",
					frameImage: this.selectedFrame != undefined ? this.selectedFrame : "",
					strapImage: this.selectedStrap != undefined ? this.selectedStrap : "",
					accentImage: this.selectedAccent != undefined ? this.selectedAccent : "",
					frameColor: this.selectedFrameColor != undefined ? this.selectedFrameColor : "",
					createdAt: this.selectedFabric != undefined ? this.selectedFabric.createdAt : "",
					fabricId: this.selectedFabric != undefined ? this.selectedFabric.id : ""
				};
				var totalAmt = this.getView().getModel("appView").getProperty("/totalAmount");
				totalAmt += this.cartObjUpdated.dProduct_Total_Price - this.selectedProductPrice;
				var quantity = this.getView().getModel("appView").getProperty("/qty");
				quantity += this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue() - this.selectedQuantity;
				this.getView().getModel("appView").setProperty("/totalAmount", totalAmt);
				this.getView().getModel("appView").setProperty("/qty", quantity);
				if (this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue() > 0) {
					this.getView().getModel("cartItemSummary").oData[this.selectedEditPath] = this.cartObjUpdated;
					this.getView().getModel("cartItemSummary").updateBindings(true);
					this.quotationCart.close();
				} else
					sap.m.MessageBox.error("Please enter the quantity");
			}
		},
		handleCartSelectedItems: function () {
			this.itemSummary.open();
		},
		handleCancelItemSummaryPress: function () {
			this.itemSummary.close();
		},
		onPressEditItem: function (evt) {
			var that = this;
			that.selectedEditPath = evt.getSource().getParent().getParent().getParent().getBindingContext("cartItemSummary").getPath().split(
				"/")[1];
			that.selectedProductPrice = evt.getSource().getParent().getParent().getParent().getModel("cartItemSummary").oData[evt.getSource().getParent()
				.getParent().getParent().getBindingContext("cartItemSummary").getPath()
				.split("/")[1]].dProduct_Total_Price;
			that.selectedQuantity = evt.getSource().getParent().getParent().getParent().getModel("cartItemSummary").oData[evt.getSource().getParent()
				.getParent().getParent().getBindingContext("cartItemSummary").getPath()
				.split("/")[1]].Qty;
			var ProductGrade = evt.getSource().getBindingContext("cartItemSummary").getObject().grade;
			var cartGrade = that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getButtons();
			for (var i = 0; i < cartGrade.length; i++) {
				if (ProductGrade == cartGrade[i].getBindingContext("quotationItemFinishes").getObject().DFabric_Grade) {
					var selectedId = cartGrade[i].getBindingContext("quotationItemFinishes").getObject().id;
					that.handleGradeDisplay(selectedId);
					that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(i);
				}
			}
			var Qty = evt.getSource().getBindingContext("cartItemSummary").getObject().Qty;
			if (Qty) {
				that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(Qty);
			}
			var frame = evt.getSource().getBindingContext("cartItemSummary").getObject().frame;
			if (frame) {
				that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[4].getSelectedButton().setText(
					frame);
			} else {
				that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[4].getSelectedButton().setVisible(
					false);
			}
			var DProduct_Number = evt.getSource().getBindingContext("cartItemSummary").getObject().itemDetails.DProduct_Number;
			if (DProduct_Number) {
				that.quotationCart.getContent()[0].getContent()[0].getContent()[0].getContent()[0].getContent()[2].setText(DProduct_Number);
			} else {
				that.quotationCart.getContent()[0].getContent()[0].getContent()[0].getContent()[0].getContent()[2].getText();
			}
			var DProduct_Name = evt.getSource().getBindingContext("cartItemSummary").getObject().itemDetails.DProduct_Name;
			if (DProduct_Name) {
				that.quotationCart.getContent()[0].getParent().setTitle(DProduct_Name);
			} else {
				that.quotationCart.getContent()[0].getParent().getTitle();
			}
			var productImage = evt.getSource().getBindingContext("cartItemSummary").getObject().itemDetails.DProduct_Image.data[0].attributes.formats
				.thumbnail.name.split("thumbnail_")[1];
			if (productImage) {
				that.quotationCart.getContent()[0].getContent()[0].getContent()[1].getContent()[1].getPages()[0].getItems()[0].setSrc(productImage);
			} else {
				that.quotationCart.getContent()[0].getContent()[0].getContent()[1].getContent()[1].getPages()[0].getItems()[0].getSrc();
			}
			that.quotationCart.open();
			that.mode = "EDIT";
			// that.getView().getModel("cartItemSummary").oData[that.selectedEditPath] = (that.selectedEditPath);
			// that.getView().getModel("cartItemSummary").updateBindings(true);
			//that.handleUpdateItemSummary(that.quotationDetailId);
		},
		onPressDeleteItem: function (evt) {
			var that = this;
			var selectedPrice = evt.getSource().getParent().getParent().getParent().getModel(
				"cartItemSummary").oData[evt.getSource().getBindingContext("cartItemSummary").sPath.split("/")[1]].dProduct_Total_Price;
			var totalAmt = parseInt(that.itemSummary.getContent()[1].getItems()[0].mAggregations.items[1].getText().split("$")[1]);
			var newPrice = totalAmt - selectedPrice;
			that.selectedPath = evt.getSource().getBindingContext("cartItemSummary").sPath.split("/")[1];
			MessageBox.confirm("Do you want to delete the Item?", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					if (oAction === "YES") {
						// var totalAmt = that.getView().getModel("appView").getProperty("/totalAmount");
						// totalAmt += Math.round((this.customerTypeArr / 100) * (that.cartObjUpdated.dProduct_Total_Price - this.selectedProductPrice));
						that.getView().getModel("appView").setProperty("/totalAmount", newPrice);
						that.getView().getModel("cartItemSummary").oData.splice(that.selectedPath, 1);
						that.getView().getModel("cartItemSummary").updateBindings(true);
					}
				}
			});
		},
		handleUpdateItems: function (obj, customerId, ContactId) {
			var that = this;
			var obj = {
				"data": {
					"d_customer_contacts": [ContactId]
				}
			};
			$.ajax({
				url: "/DanaoStrapi/api/d-customers/" + customerId,
				type: "PUT",
				//	type: "POST",
				"headers": {
					"content-type": "application/json"
				},
				data: JSON.stringify(obj),
				dataType: "json",
				success: function (res) {

				}
			});
		},
		handleDraftItemSummaryPress: function (evt) {
			var that = this;
			var cartItemSummary = that.getView().getModel("cartItemSummary").oData;
			that.servicecall = 0;
			that.quotationDetailArr = [];
			for (var m = 0; m < cartItemSummary.length; m++) {
				var obj = {
					"data": {
						"dProduct_SKU": cartItemSummary[m].SKU,
						"dProduct_Quantity": cartItemSummary[m].Qty + "",
						"d_frames": cartItemSummary[m].frame,
						"d_frame_straps": cartItemSummary[m].straps,
						"d_ropes": "",
						"d_batylines": "",
						"d_accents": cartItemSummary[m].accent,
						"d_frame_tops": "",
						"d_weaves": "",
						"createdAt": cartItemSummary[m].createdAt,
						"d_fabric_grades": cartItemSummary[m].grade,
						"d_Quotation_ProdNotes": "",
						"dFabric_ID": cartItemSummary[m].fabricId != undefined ? (cartItemSummary[m].fabricId).toString() : "",
						"dProduct_UnitPrice": cartItemSummary[m].dProduct_UnitPrice != undefined ? (cartItemSummary[m].dProduct_UnitPrice).toString() : "",
						"dProduct_Total_Price": cartItemSummary[m].dProduct_Total_Price != undefined ? (cartItemSummary[m].dProduct_Total_Price).toString() : "",
						"dProduct_Name": cartItemSummary[m].itemDetails != undefined ? cartItemSummary[m].itemDetails.DProduct_Name : "",
						"dProduct_Thumbnail": cartItemSummary[m].itemDetails != undefined ? cartItemSummary[m].itemDetails.DProduct_Image.data[0].attributes
							.name : ""
					}
				};
				$.ajax({
					url: "/DanaoStrapi/api/d-customer-quotation-details",
					type: "POST",
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						that.servicecall++;
						that.quotationDetailId = res.data.id;
						//sap.m.MessageBox.success("Quotation has been posted successfully");
						that.quotationDetailArr.push(res.data.id);
						//that.quotationDetailArr.push(res.data.attributes.dProduct_SKU);
						if (cartItemSummary.length == that.servicecall)
							that.handlePushQuotationItemAfterPost();
						//that.itemSummary.close();
					},
					error: function (res) {
						var x = res;
					}
				});
			}

		},
		handlePushQuotationItemAfterPost: function () {
			var that = this;
			//var customerId = this.getView().getModel("appView").setProperty("/newCustomerId");
			var projectId = that.projectId;
			var postObj = {
				"data": {
					"dQuotation_Item_Price": that.getView().getModel("appView").getProperty("/totalAmount") + "",
					"dQuotation_Item_Quantity": that.getView().getModel("appView").getProperty("/qty") + "",
					"DQuotation_Status": "Draft",
					// "d_customer": [this.getView().getModel("appView").getProperty("/customerId")],
					"d_customer": [that.newCustomerId],
					"d_customer_project": [that.projectId],
					"d_customer_quotation_details": (that.quotationDetailArr)
				}
			};
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-quotations",
				type: "POST",
				"headers": {
					"content-type": "application/json"
				},
				data: JSON.stringify(postObj),
				dataType: "json",
				success: function (res) {
					var objId = res.data.id;
					that.handleUpdateQuotationItemAfterPost(postObj, that.projectId, objId);
					//that.handleQuotationTableDetails(objId);
					sap.m.MessageBox.success("Quotation has been created successfully");
					that.itemSummary.close();
					that.quotationCart.close();
					that.getView().getModel("appView").setProperty("/totalAmount", 0);
					that.getView().getModel("appView").setProperty("/qty", 0);
					that.getView().getModel("cartItemSummary").oData = [];
					that.getView().getModel("cartItemSummary").updateBindings(true);
				},
				error: function (res) {
					var x = res;
				}
			});
		},
		handleUpdateQuotationItemAfterPost: function (postObj, projectId, objId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + that.projectId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var quotationData = res.data[0].attributes.d_customer_quotations.data;
					var quotationArr = [];
					for (var m = 0; m < quotationData.length; m++) {
						quotationArr.push(quotationData[m].id);
					}
					quotationArr.push(objId);
					postObj = {
						"data": {
							"d_customer_quotations": quotationArr
						}
					};
					$.ajax({
						url: "/DanaoStrapi/api/d-customer-projects/" + that.projectId,
						type: "PUT",
						"headers": {
							"content-type": "application/json"
						},
						data: JSON.stringify(postObj),
						dataType: "json",
						success: function (res) {
							that.handleQuotationTableDetails(that.projectId);
						},
						error: function (err) {
							MessageBox.error(err.responseJSON.error.message);
						}
					});
				}
			});
		},
		handleQuotationTableDetails: function (objId) {
			var that = this;
			//projectId = that.getView().getModel("appView").getProperty("/quotationId");
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + that.projectId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var products = res.data;
					if (res.data.length > 0) {
						var quotationData = res.data[0].attributes.d_customer_quotations.data;
						var quotationContactData = res.data[0].attributes.d_customer_contacts.data;
					} else {
						var quotationContactData = [];
						var quotationData = [];
					}
					//var quotationData = res.data;
					var quotationArr = [],
						contactArr = [];
					for (var m = 0; m < quotationData.length; m++) {
						quotationArr.push({
							id: quotationData[m].id,
							DQuotation_Status: quotationData[m].attributes.DQuotation_Status,
							createdAt: quotationData[m].attributes.createdAt,
							dQuotation_Item_Price: quotationData[m].attributes.dQuotation_Item_Price,
							dQuotation_Item_Quantity: quotationData[m].attributes.dQuotation_Item_Quantity,
							publishedAt: quotationData[m].attributes.publishedAt,
							updatedAt: quotationData[m].attributes.updatedAt
						});
					}
					for (var n = 0; n < quotationContactData.length; n++) {
						contactArr.push({
							id: quotationContactData[n].id,
							dCustomerContact_Name: quotationContactData[n].attributes.dCustomerContact_Name,
							dCustomer_ContactEmail: quotationContactData[n].attributes.dCustomer_ContactEmail,
							dCustomer_Conact_DirectPhone: quotationContactData[n].attributes.dCustomer_Conact_DirectPhone,
							dCustomer_ContactMobile: quotationContactData[n].attributes.dCustomer_ContactMobile,
							createdAt: quotationContactData[n].attributes.createdAt,
							updatedAt: quotationContactData[n].attributes.updatedAt,
							publishedAt: quotationContactData[n].attributes.publishedAt
						});
					}
					that.getOwnerComponent().getModel("QuotaionContactModel").oData = contactArr;
					that.getOwnerComponent().getModel("QuotaionContactModel").updateBindings(true);
					that.getOwnerComponent().getModel("QuotaionDetailsModel").oData = quotationArr;
					that.getOwnerComponent().getModel("QuotaionDetailsModel").updateBindings(true);
				}

			});
		},
		handleFabricSelection: function (evt) {
			sap.m.MessageToast.show("Fabric " + evt.getSource().getBindingContext("fabricModel").getObject().DFabric_Name +
				" is selected");
			this.selectedFabric = evt.getSource().getBindingContext("fabricModel").getObject();
		},
		handleFrameSelection: function (evt) {
			sap.m.MessageToast.show(evt.getSource().getBindingContext("framesImageModel").getObject().DFrameColor + " is selected");
			this.selectedFrame = evt.getSource().getBindingContext("framesImageModel").getObject().name;
			this.selectedFrameColor = evt.getSource().getBindingContext("framesImageModel").getObject().DFrameColor;

		},
		handleStrapSelection: function (evt) {
			sap.m.MessageToast.show(evt.getSource().getBindingContext("frameStrapModel").getObject().DFrame_Straps_Name +
				" is selected");
			this.selectedStrap = evt.getSource().getBindingContext("frameStrapModel").getObject().url;
		},
		handleAccentSelection: function (evt) {
			sap.m.MessageToast.show(evt.getSource().getBindingContext("framesAccentModel").getObject().DAccent_Name + " is selected");
			this.selectedAccent = evt.getSource().getBindingContext("framesAccentModel").getObject().Image;
		},
		onPressQuotation: function (evt) {
			// var selectedId = evt.getSource().getBindingContext("QuotaionDetailsModel").getObject().id;
			//var that = this;
			//var selectedId = evt.getSource().getBindingContext("QuotaionDetailsModel").getObject().id;
			//this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getOwnerComponent().getRouter().navTo("quotationDetailProject", {
				customerId: this.newCustomerId,
				id: this.projectId,
				ModuleIndex: evt.getSource().getBindingContextPath().split("/")[1],
				QuotationId: evt.getSource().getBindingContext("QuotaionDetailsModel").getObject().id
			});
		}
	});
});