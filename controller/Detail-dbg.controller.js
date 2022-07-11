sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Context",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"MDG/Help/util/formatter"

], function (Controller, Fragment, JSONModel, MessageToast, MessageBox, Context, Filter, FilterOperator, formatter) {
	"use strict";

	return Controller.extend("MDG.Help.controller.Detail", {
		formatter: formatter,
		onInit: function () {
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			//this.newProjectData();
			//this.handleCustomerNameData();

			var that = this;
			this.getOwnerComponent().getRouter().getRoute("Detail").attachPatternMatched(function (oEvent) {
				var usersModel = that.getOwnerComponent().getModel("customerInfo");
				that.path = oEvent.getParameter("arguments").moduleIndex;
				var oContext = new Context(usersModel, "/" + that.path);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()));
				that.getView().getModel("appView").oData.RequestIdSelected = oEvent.getParameter("arguments").id;
				that.getView().getModel("appView").oData.currentCustomerData = oContext.getObject();
				that.getView().getModel("appView").oData.moduleIndexForDetail = oEvent.getParameter("arguments").moduleIndex;
				that.handleDetailProjectData(oEvent.getParameter("arguments").id);
				that.handleContactData(oEvent.getParameter("arguments").id);
				that.handleContactTypeDetail(oEvent.getParameter("arguments").id);
				that.handleDetailCustomerTypeData(oEvent.getParameter("arguments").id);
				that.customerId = oEvent.getParameter("arguments").id;
				that.detailCustomerId = oEvent.getParameter("arguments").id;
				that.handleProjectData(oEvent.getParameter("arguments").id);
				that.projectId = oEvent.getParameter("arguments").newprojectId;
				that.handleQuotationTableDetails(oEvent.getParameter("arguments").newprojectId);
				//that.handleCustomerProject(oEvent.getParameter("arguments").id);
				// that.handleCustomerproTypeData(oEvent.getParameter("arguments").id);
				that.handleCustomerProjectsForMultiple(oEvent.getParameter("arguments").id);
			}, this);
			that.maxId = 100 + that.getOwnerComponent().getModel("customerInfo").getData().length;
			if (!this.valueHelpForCustomerContact) {
				this.valueHelpForCustomerContact = new sap.ui.xmlfragment("MDG.Help.fragment.valueHelpForCustomerContact", this);
			}
			this.getView().addDependent(this.valueHelpForCustomerContact);

		},
		handleDeleteContact: function (oEvent) {
			var that = this;
			// var	customerId = this.getView().getModel("appView").getProperty("/customerId", this.index);
			var selected = oEvent.getSource().getBindingContext("DetailContactModel").sPath.split("/")[1];
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
							url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + that.customerId,
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

										MessageToast.show("Customer contact Deleted sucessfully", {
											closeOnBrowserNavigation: false
										});
										that.onCloseDetailPress();
									}
								});
							}

						});

					}
				}
			});
		},
		handleCustomerProjectsForMultiple: function (customerId) {
			var that = this;
			var CustomerIdssArr = [];
			var projectsArr = [],
				idValue,
				CustomerProjectsArr = this.getView().getModel("appView").getProperty("/CustomerProjectForIds");
			if (CustomerProjectsArr.length > 0) {
				for (var z = 0; z < CustomerProjectsArr.length; z++) {
					CustomerIdssArr.push(CustomerProjectsArr[z].id);
					idValue = CustomerProjectsArr[z].id;
					$.ajax({
						url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + idValue,
						type: 'GET',
						"headers": {
							"content-type": "application/json"
						},
						dataType: 'json', // added data type
						success: function (res) {
							if (res.data.length > 0) {
								res.data[0].attributes.id = res.data[0].id;
								projectsArr.push(res.data[0].attributes);
							}
							if (projectsArr.length > 0) {
								projectsArr.sort(function (a, b) {
									return a.id - b.id
								});
							}
							that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(projectsArr), "CustomerProjectsModel");
							that.getView().setModel(new sap.ui.model.json.JSONModel(projectsArr), "CustomerProjectsModel");
							that.getView().getModel("CustomerProjectsModel").updateBindings(true);
						},
						error: function (err) {
							console.log(err);
						}
					});
				}
			} else {
				that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel([]), "CustomerProjectsModel");
				that.getView().setModel(new sap.ui.model.json.JSONModel([]), "CustomerProjectsModel");
				that.getView().getModel("CustomerProjectsModel").updateBindings(true);
			}

		},
		handleProjectData: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + that.customerId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var customerArr = [],
						projectArr = [];
					for (var i = 0; i < res.data.length; i++) {
						if (that.customerId == res.data[i].id) {
							var obj = {
								id: res.data[i].id,
								createdAt: res.data[i].attributes.createdAt,
								dBillingAddress: res.data[i].attributes.dBillingAddress,
								dCustomerName: res.data[i].attributes.dCustomerName,
								dOfficePhone: res.data[i].attributes.dOfficePhone,
								dWebsite: res.data[i].attributes.dWebsite,
								publishedAt: res.data[i].attributes.publishedAt,
								updatedAt: res.data[i].attributes.updatedAt,

							};
						}
					}
					customerArr.push(obj);
					var projectData = res.data[0].attributes.d_customer_projects.data;
					for (var j = 0; j < projectData.length; j++) {
						if (that.projectId == projectData[j].id) {
							var obj = {
								id: projectData[j].id,
								dCustomer_ProjectName: projectData[j].attributes.dCustomer_ProjectName,
								dProject_CompletionDate: projectData[j].attributes.dProject_CompletionDate,
								dProject_Add_Notes: projectData[j].attributes.dProject_Add_Notes,
								dProject_Probability: projectData[j].attributes.dProject_Probability,
								dProject_Expected_CloseDate: projectData[j].attributes.dProject_Expected_CloseDate,
								createdAt: projectData[j].attributes.createdAt,
								updatedAt: projectData[j].attributes.updatedAt,
								publishedAt: projectData[j].attributes.publishedAt,
								dProject_ExpectedStartDate: projectData[j].attributes.dProject_ExpectedStartDate,

							};
						}
					}
					projectArr.push(obj);
					that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(projectArr), "projectInfo");
					that.getOwnerComponent().setModel(new sap.ui.model.json.JSONModel(customerArr), "customerProjectInfo");
					that.Id = that.getOwnerComponent().getModel("customerProjectInfo").oData != undefined ? that.getOwnerComponent().getModel(
						"customerProjectInfo").oData[0].id : "";
				}
			});
		},
		handleQuotationTableDetails: function (projectId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + projectId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					if (res.data[0].attributes.d_customer_quotations.data != undefined || res.data[0].attributes.d_customer_quotations.data !=
						null) {
						var quotationCusData = res.data[0].attributes.d_customer_quotations.data;
						var quotationCusArr = [];
					} else {
						var arr = [];
					}
					for (var m = 0; m < quotationCusData.length; m++) {
						quotationCusArr.push({
							id: quotationCusData[m].id,
							DQuotation_Status: quotationCusData[m].attributes.DQuotation_Status,
							createdAt: quotationCusData[m].attributes.createdAt,
							dQuotation_Item_Price: quotationCusData[m].attributes.dQuotation_Item_Price,
							dQuotation_Item_Quantity: quotationCusData[m].attributes.dQuotation_Item_Quantity,
							publishedAt: quotationCusData[m].attributes.publishedAt,
							updatedAt: quotationCusData[m].attributes.updatedAt
						});
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(quotationCusArr), "customerModel");
				}

			});
		},
		handleDetailProjectData: function (customerId) {
			var that = this;
			that.newCustomerId = customerId;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + customerId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					if (res.data.length > 0 && res.data[0].attributes !== undefined)
						var projectsData = res.data[0].attributes.d_customer_projects.data;
					else
						var projectsData = [];
					var projectsArr = [],
						ProjectIds = [];
					for (var m = 0; m < projectsData.length; m++) {
						projectsData[m].attributes["id"] = projectsData[m].id;
						projectsArr.push(projectsData[m].attributes);
						ProjectIds.push(projectsData[m].id);
					}
					that.getView().getModel("appView").oData.CustomerProjectIds = ProjectIds;
					that.getOwnerComponent().getModel("DetailProjectsModel").oData = projectsArr;
					that.getOwnerComponent().getModel("DetailProjectsModel").updateBindings(true);
				}

			});
		},
		handleContactData: function (customerId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-contacts?populate=*&filters[id][$eq]=" + customerId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					var contactData = res.data;
					var contactArr = [];
					for (var m = 0; m < contactData.length; m++) {
						contactArr.push(contactData[m].attributes);
					}
					//console.log(contactArr);
					that.getOwnerComponent().getModel("newContactModel").oData = contactArr;
					that.getOwnerComponent().getModel("newContactModel").updateBindings(true);
				}

			});
		},
		// handleContactData: function (customerId) {
		// 	var that = this;
		// 	$.ajax({
		// 		url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + customerId,
		// 		type: 'GET',
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		dataType: 'json',
		// 		success: function (res) {
		// 			var contactData = res.data[0].attributes.d_customer_contacts.data;
		// 			var contactArr = [];
		// 			for (var m = 0; m < contactData.length; m++) {
		// 				contactArr.push(contactData[m].attributes);
		// 			}
		// 			that.getOwnerComponent().getModel("newContactModel").oData = contactArr;
		// 			that.getOwnerComponent().getModel("newContactModel").updateBindings(true);
		// 		}

		// 	});
		// },
		handleContactTypeDetail: function (contactId) {
			var that = this;
			$.ajax({
				//	url: "/DanaoStrapi/api/d-customer-contacts?populate=*",
				url: "/DanaoStrapi/api/d-customer-contacts?populate=*&pagination[pageSize]=200",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json", // added data type
				success: function (res) {
					var arr = [];
					var contactData = res.data;
					for (var m = 0; m < contactData.length; m++) {
						arr.push({
							DCustomerContact_type: contactData[m].attributes,
							id: contactData[m].id
						});
					}
					//	console.log(arr);
					that.handleDetailContactData(contactId, arr);
				}

			});
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-contact-types?populate=*",
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json", // added data type
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
		handleAddContact: function () {
			//	this.handleContactType();
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
		handleAddCustomerContactPost: function () {
			var that = this;
			var customerId = that.customerId;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + customerId, //customerid
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json", // added data type
				success: function (res) {
					if (res.data.length != 0) {
						var contactData = res.data[0].attributes.d_customer_contacts.data;
					}
					var contactArr = [];
					var customerTypeArr = [];
					var contactType = [];
					for (var m = 0; m < contactData.length; m++) {
						customerTypeArr.push(contactData[m].id);
					}
					$.ajax({
						// url: "/DanaoStrapi/api/d-customer-contacts?populate=*", //customerid?populate=*&pagination[pageSize]=100
						url: "/DanaoStrapi/api/d-customer-contacts?populate=*&pagination[pageSize]=200",
						type: "GET",
						"headers": {
							"content-type": "application/json"
						},
						dataType: "json", // added data type
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
									//	dCustomer_Conact_Type: this.valueHelpForCustomerContact.getContent()[0].getContent()[7].getValue(),
									// dCustomer_Conact_Type: [that.valueHelpForCustomerContact.getContent()[0].getContent()[7].getSelectedKey()],
									d_customer_contact_type: [that.valueHelpForCustomerContact.getContent()[0].getContent()[7].getSelectedKey()],
									dCustomer_ContactMobile: that.valueHelpForCustomerContact.getContent()[0].getContent()[9].getValue()
								}
							};
							if (custType.includes("Main Contact") === true) {
								if (obj.data.d_customer_contact_type[0] === "3") {
									sap.m.MessageBox.error("There can only be one Main contact");
								} else {
									$.ajax({
										url: "/DanaoStrapi/api/d-customer-contacts",
										// url: "/DanaoStrapi/api/d-customer-contacts?populate=*",
										//+ this.customerId,
										type: "POST",
										"headers": {
											"content-type": "application/json"
										},
										data: JSON.stringify(obj),
										dataType: "json",
										success: function (res) {
											var ContactId = res.data.id;
											//	obj.data.dProject_Id.push(projectId);
											that.addCustomerContact(obj, customerId, ContactId);
											that.handleAddCustomerCancel();
											MessageBox.success("Contact has beeen Added");
											// that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
											// that.getOwnerComponent().getRouter().navTo("Detail", {
											// 	// id: "addProject",
											// 	// moduleIndex: "index"
											// 	id: customerId,
											// 	moduleIndex: "0"
											// });
											// 	id: customerId,
											// 	moduleIndex: "0"
											// });

										},
										error: function (err) {
											MessageBox.error(err.responseJSON.error.message);
										}
									});
								}
							} else {
								$.ajax({
									url: "/DanaoStrapi/api/d-customer-contacts",
									// url: "/DanaoStrapi/api/d-customer-contacts?populate=*",
									//+ this.customerId,
									type: "POST",
									"headers": {
										"content-type": "application/json"
									},
									data: JSON.stringify(obj),
									dataType: "json",
									success: function (res) {
										var ContactId = res.data.id;
										//	obj.data.dProject_Id.push(projectId);
										that.addCustomerContact(obj, customerId, ContactId);
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
		addCustomerContact: function (obj, customerId, ContactId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + customerId, //customerid
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json", // added data type
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
						url: "/DanaoStrapi/api/d-customers/" + customerId,
						type: "PUT",

						"headers": {
							"content-type": "application/json"
						},
						data: JSON.stringify(obj),
						dataType: "json",
						success: function (res) {
							that.handleContactTypeDetail(customerId);
						}
					});
				}
			});

		},
		//INDIVIDUAL PROJECT DELETE BUTTON

		handleDeleteProjectPress: function (oEvent) {
			var that = this;
			// var customerId = this.getView().getModel("appView").getProperty("/customerId", this.index);
			// var selected = oEvent.getSource().getBindingContext("DetailProjectsModel").sPath.split("/")[1];
			var selected = oEvent.getSource().getBindingContext("CustomerProjectsModel").sPath.split("/")[1];
			MessageBox.confirm("Do you want delete the Project", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {

					if (oAction === "YES") {
						var obj = {
							// id: customerId,
							// id: this.getView().getModel().getProperty.customerId,
						};
						$.ajax({
							url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + that.customerId,
							type: "GET",
							"headers": {
								"content-type": "application/json"
							},
							dataType: "json", // added data type
							success: function (res) {
								var contactArr = [];
								var contact = res.data[0].attributes.d_customer_projects.data;
								for (var i = 0; i < contact.length; i++)
									contactArr.push(contact[i]);
								var projectId = contactArr[selected].id;
								$.ajax({
									url: "/DanaoStrapi/api/d-customer-projects/" + projectId,
									type: "DELETE",
									"headers": {
										"content-type": "application/json"
									},
									// data: JSON.stringify(obj),
									dataType: "json",
									success: function (res) {
										// var oModel = that.getOwnerComponent().getModel("customerInfo");

										MessageToast.show("Project Deleted sucessfully", {
											closeOnBrowserNavigation: false
										});
										that.onCloseDetailPress();
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
			var selected = evt.getSource().getBindingContext("customerModel").sPath.split("/")[1];
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
										//that.onCloseDetailPress();
									}
								});
							}
						});
					}
				}
			});
		},
		// handleAddContact: function () {
		// 	//	this.handleContactType();
		// 	this.valueHelpForCustomerContact.open();
		// },
		// handleAddCustomerCancel: function () {
		// 	this.valueHelpForCustomerContact.close();
		// },
		// handleAddCustomerContactPost: function () {

		// 	var that = this;
		// 	var obj = {
		// 		"data": {
		// 			dCustomerContact_Name: this.valueHelpForCustomerContact.getContent()[0].getContent()[1].getValue(),
		// 			dCustomer_ContactEmail: this.valueHelpForCustomerContact.getContent()[0].getContent()[3].getValue(),
		// 			dCustomer_Conact_DirectPhone: this.valueHelpForCustomerContact.getContent()[0].getContent()[5].getValue(),
		// 			//	dCustomer_Conact_Type: this.valueHelpForCustomerContact.getContent()[0].getContent()[7].getValue(),
		// 			dCustomer_Conact_Type: this.valueHelpForCustomerContact.getContent()[0].getContent()[7].getSelectedKey(),
		// 			dCustomer_ContactMobile: this.valueHelpForCustomerContact.getContent()[0].getContent()[9].getValue()
		// 		}
		// 	};
		// 	var customerId = that.customerId;

		// 	$.ajax({
		// 		url: "/DanaoStrapi/api/d-customer-contacts",
		// 		//+ this.customerId,
		// 		type: "POST",
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		data: JSON.stringify(obj),
		// 		dataType: "json",
		// 		success: function (res) {
		// 			var ContactId = res.data.id;
		// 			//	obj.data.dProject_Id.push(projectId);
		// 			that.addCustomerContact(obj, customerId, ContactId);
		// 			MessageBox.success("Contact has beeen Added");
		// 			that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
		// 			that.getOwnerComponent().getRouter().navTo("Detail", {
		// 				// id: "addProject",
		// 				// moduleIndex: "index"
		// 				id: customerId,
		// 				moduleIndex: "0"
		// 			});
		// 		},
		// 		error: function (err) {
		// 			MessageBox.error(err.responseJSON.error.message);
		// 		}
		// 	});
		// },
		// addCustomerContact: function (obj, customerId, ContactId) {
		// 	var that = this;
		// 	var obj = {
		// 		"data": {
		// 			"d_customer_contacts": [ContactId]
		// 		}
		// 	};
		// 	$.ajax({
		// 		url: "/DanaoStrapi/api/d-customers/" + customerId,
		// 		type: "PUT",
		// 		//	type: "POST",
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		data: JSON.stringify(obj),
		// 		dataType: "json",
		// 		success: function (res) {

		// 		}
		// 	});
		// },

		handleDetailContactData: function (contactId, arr) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + contactId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json", // added data type
				success: function (res) {
					var contactData = res.data[0].attributes.d_customer_contacts.data;
					var contactArr = [],
						customerTypeArr = [];
					var contactType = [];
					for (var m = 0; m < contactData.length; m++) {
						for (var i = 0; i < arr.length; i++) {
							if (contactData[m].attributes.dCustomerContact_Name === arr[i].DCustomerContact_type.dCustomerContact_Name)
								contactArr.push(arr[i]);
						}
					}
					//console.log(contactArr);
					// 	for ( m = 0; m < arr.length; m++) {
					// 	contactType.push(arr[m]);
					// }
					// console.log(contactType);
					var customerTypeData = res.data[0].attributes.d_customer_type.data === null ? "" : res.data[0].attributes.d_customer_type.data;
					// var customerTypeData = res.data[0].attributes.d_customer_type.data;
					for (var n = 0; n < customerTypeData.length; n++) {
						customerTypeData[n].attributes.id = customerTypeData[n].id;
						customerTypeArr.push(customerTypeData[n].attributes);
					}
					// var contactLength = [];
					// contactLength = res.data[0].attributes.d_customer_contacts;
					console.log(contactArr);
					that.getOwnerComponent().getModel("DetailCustomerTypeModel").oData = customerTypeArr;
					that.getOwnerComponent().getModel("DetailCustomerTypeModel").updateBindings(true);
					that.getOwnerComponent().getModel("DetailContactModel").oData = contactArr;
					that.getOwnerComponent().getModel("DetailContactModel").updateBindings(true);
				}

			});
		},
		/*	handleDetailContactData: function (contactId) {
				var that = this;
				$.ajax({
					url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + contactId,
					type: 'GET',
					"headers": {
						"content-type": "application/json"
					},
					dataType: 'json', // added data type
					success: function (res) {
						var contactData = res.data[0].attributes.d_customer_contacts.data;
						var contactArr = [],
							customerTypeArr = [];
						for (var m = 0; m < contactData.length; m++) {
							contactArr.push(contactData[m].attributes);
						}
						that.getOwnerComponent().getModel("DetailContactModel").oData = contactArr;
						that.getOwnerComponent().getModel("DetailContactModel").updateBindings(true);
					}

				});
			},*/
		handleDetailCustomerTypeData: function (contactId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + contactId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					/*var customerTypeData = res.data[0].attributes.d_customer_type.data;
					var customerTypeArr = [];
					for (var m = 0; m < customerTypeData.length; m++) {
						customerTypeArr.push(customerTypeData[m].attributes);
					}
					that.getOwnerComponent().getModel("DetailCustomerTypeModel").oData = customerTypeArr;
					that.getOwnerComponent().getModel("DetailCustomerTypeModel").updateBindings(true);*/
					var customerTypeData = res.data[0].attributes.d_customer_type.data;
					that.getView().byId("customerTypeId").setText(customerTypeData.attributes.dCustomer_TypeCode + " - " +
						customerTypeData.attributes.dCustomerType_Description);
				}

			});
		},
		// handleCustomerProject: function (customerId, projectArr) {
		// 	var that = this;
		// 	//that.newCustomerId = customerId;
		// 	//customerId =that.getView().getModel("appView").getProperty("/customerContactId");
		// 	that.typeArr = projectArr;
		// 	$.ajax({
		// 		// url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + that.newCustomerId,
		// 			url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + customerId,

		// 		type: "GET",
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		dataType: "json",
		// 		success: function (res) {
		// 			//var projectArr = [];
		// 			var projectData = res.data;
		// 			for (var n = 0; n < that.typeArr.length; n++) {
		// 				for (var m = 0; m < projectData.length; m++) {
		// 					if (that.typeArr[n].id === projectData[m].id)
		// 						that.typeArr[n]["dCustomerProjects"] = projectData[m].attributes;
		// 					//id: projectData[m].id
		// 					//});
		// 				}
		// 				//	console.log(arr);
		// 				//that.handleDetailCustomerData(customerId, projectArr);
		// 			}
		// 			that.handleDetailCustomerData(customerId, that.typeArr);
		// 		}

		// 	});
		// },
		// handleCustomerproCategoryData: function (customerId, arr) {
		// 	var that = this;
		// 	that.typeArr = arr;
		// 	customerId = that.getView().getModel("appView").getProperty("/customerContactId");
		// 	$.ajax({
		// 		url: "/DanaoStrapi/api/d-project-categories?populate=*&filters[id][$eq]=" + customerId,
		// 		type: "GET",
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		dataType: "json",
		// 		success: function (res) {
		// 			//	var arr = [];
		// 			var categoryData = res.data;
		// 			for (var n = 0; n < that.typeArr.length; n++) {
		// 				for (var m = 0; m < categoryData.length; m++) {
		// 					if (that.typeArr[n].id === categoryData[m].id)
		// 						that.typeArr[n]["DProject_Category"] = categoryData[m].attributes.DProject_Category;
		// 					//id: categoryData[m].id
		// 					//});
		// 				}
		// 			}
		// 			that.handleCustomerProject(customerId, that.typeArr);
		// 			//that.handleDetailCustomerData(customerId, that.typeArr);
		// 			// that.handleCustomerproTypeData(projectId, that.typeArr);
		// 			// var model = new sap.ui.model.json.JSONModel(arr);
		// 			// that.getView().setModel(model, "newCategoryModel");
		// 			//	console.log(arr);
		// 			// that.handleDetailContactData(projectId,arr);
		// 		}

		// 	});
		// },
		// handleCustomerproTypeData: function (customerId) {
		// 	var that = this;
		// 	customerId = that.getView().getModel("appView").getProperty("/customerContactId");
		// 	$.ajax({
		// 		url: "/DanaoStrapi/api/d-project-types?populate=*&filters[id][$eq]=" + customerId,
		// 		type: "GET",
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		dataType: "json",
		// 		success: function (res) {
		// 			var typeArr = [];
		// 			var projectData = res.data;
		// 			for (var m = 0; m < projectData.length; m++) {
		// 				typeArr.push({
		// 					DProject_Type: projectData[m].attributes.DProject_Type,
		// 					id: projectData[m].id
		// 				});
		// 			}
		// 			//that.handleDetailCustomerData(customerId, typeArr);
		// 			that.handleCustomerproCategoryData(customerId, typeArr);
		// 			// var model = new sap.ui.model.json.JSONModel(arr);
		// 			// that.getView().setModel(model, "newprojectTypeModel");
		// 		}
		// 	});
		// },
		// handleDetailCustomerData: function (customerId, newArr) {
		// 	var that = this;
		// 	that.typeArr = newArr;
		// 	$.ajax({
		// 		url: "/DanaoStrapi/api/d-project-sales-stages?populate=*",
		// 		type: 'GET',
		// 		"headers": {
		// 			"content-type": "application/json"
		// 		},
		// 		dataType: 'json',
		// 		success: function (res) {
		// 			var projectsData = res.data;
		// 			//var projectsArr = [];
		// 			for (var n = 0; n < that.typeArr.length; n++) {
		// 				for (var m = 0; m < projectsData.length; m++) {
		// 					if (that.typeArr[n].id === projectsData[m].id)
		// 					//projectsData[m].attributes["id"] = projectsData[n].id;
		// 					// that.typeArr.push(projectsData[m]);
		// 						that.typeArr[n]["salesType"] = projectsData[m].attributes.DProject_Sales_Stage;
		// 				}
		// 			}
		// 			console.log(that.typeArr);
		// 			var model = new sap.ui.model.json.JSONModel(that.typeArr);
		// 			that.getView().setModel(model, "DetailTableModel");
		// 			that.getView().getModel("DetailTableModel").updateBindings(true);
		// 			// that.getOwnerComponent().getModel("DetailTableModel").oData = that.typeArr;
		// 			// that.getOwnerComponent().getModel("DetailTableModel").updateBindings(true);
		// 		}
		// 	});
		// },
		/*	for (var b = 0; b < data.length; b++) {
				salesArr.push(data[b].attributes.d_project_sales_stage.data.attributes);
			}
			for (var k = 0; k < data.length; k++) {
				categArr.push(data[k].attributes.d_project_category.data.attributes);
			}*/
		/*	that.getView().setModel(new sap.ui.model.json.JSONModel(projectArr), "proDataModel");
			that.getView().getModel("proDataModel").updateBindings(true);
			that.getView().setModel(new sap.ui.model.json.JSONModel(salesArr), "salesModel");
			that.getView().getModel("salesModel").updateBindings(true);
			that.getView().setModel(new sap.ui.model.json.JSONModel(categArr), "categModel");
			that.getView().getModel("categModel").updateBindings(true);*/
		// 			}

		// 		});
		// },
		// onPress: function (oEvent) {
		// 	//var that = this;
		// 	this.getView().getModel("appView").setProperty("/quotationId", oEvent.getSource().getBindingContext("DetailProjectsModel").getObject().id);
		// 	// 	.id);
		// 	this.getOwnerComponent().getRouter().navTo("projectDetail", {
		// 		id: this.customerId,
		// 		newPro: "index",
		// 		projectId: oEvent.getSource().getBindingContext("DetailProjectsModel").getObject().id
		// 	});
		// },
		onPress: function (oEvent) {
			//var that = this;
			// this.getView().getModel("appView").setProperty("/customerId", oEvent.getSource().getBindingContext("CustomerProjectsModel").getObject()
			// 	.id);
			this.getOwnerComponent().getRouter().navTo("projectDetail", {
				id: this.customerId,
				newPro: oEvent.getSource().getBindingContextPath().split("/")[1],
				// projectId: this.projectId
				projectId: oEvent.getSource().getBindingContext("CustomerProjectsModel").getObject().id
			});
		},
		onPressQuotation: function (evt) {
			var that = this;
			that.getView().getModel("appView").getProperty("/customerId", that.Id);
			this.getView().getModel("appView").setProperty("/quotationId", evt.getSource().getBindingContext("customerModel").getObject().id);
			this.getOwnerComponent().getRouter().navTo("quotationDetail", {
				customerId: that.Id,
				id: this.projectId,
				ModuleIndex: evt.getSource().getBindingContextPath().split("/")[1],
				QuotationId: evt.getSource().getBindingContext("customerModel").getObject().id
			});
		},
		/*		handleprojectDetail: function (projectId) {
					var that = this;
					$.ajax({
						url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + projectId,
						type: 'GET',
						"headers": {
							"content-type": "application/json"
						},
						dataType: 'json',
						success: function (res) {
							var projectData = res.data[0].attributes.d_customer_projects.data;
							var customerArr = [];
							for (var m = 0; m < projectData.length; m++) {
								customerArr.push(projectData[m].attributes);
							}
							that.getOwnerComponent().getModel("projectNewModel").oData = customerArr;
							that.getOwnerComponent().getModel("projectNewModel").updateBindings(true);
						}

					});
				},*/
		handlenewProject: function (evt) {
			// var that = this;
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getView().getModel("appView").updateBindings(true);
			this.getOwnerComponent().getRouter().navTo("addNewProject", {
				AddPro: this.customerId,
				mode: "Add",
				projectId: this.projectId
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
			oRouter.navTo("Master", {
				id: this.newCustomerId
			});
		},

		// handleDeleteUserPress: function () {
		// 	var that = this;
		// 	MessageBox.confirm("Confirm Customer Delete", {
		// 		title: "Confirm Deletion",
		// 		icon: MessageBox.Icon.WARNING,
		// 		actions: [MessageBox.Action.YES, MessageBox.Action.NO],
		// 		emphasizedAction: MessageBox.Action.YES,
		// 		onClose: function (oAction) {

		// 			if (oAction === "YES") {

		// 				var oModel = that.getOwnerComponent().getModel("customerInfo");
		// 				var oModelData = oModel.getData();

		// 				//var oModel = that.getView().getModel();
		// 				//var aUser = oModel.getData();

		// 				var itemIndex = parseInt(that.path, 10);

		// 				oModelData.splice(itemIndex, 1);
		// 				oModel.updateBindings(true);
		// 				MessageToast.show("Customer Deleted sucessfully", {
		// 					closeOnBrowserNavigation: false
		// 				});
		// 				that.onCloseDetailPress();
		// 			}
		// 		}
		// 	});
		// },

		handleDeleteUserPress: function (customerId) {
			var that = this;
			customerId = this.getView().getModel("appView").getProperty("/customerId", this.index);
			MessageBox.confirm("Do you want to delete the customer?", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {

					if (oAction === "YES") {
						var obj = {
							// id: customerId,
							// id: this.getView().getModel().getProperty.customerId,
						};
						$.ajax({
							url: "/DanaoStrapi/api/d-customers/" + that.customerId,
							type: "DELETE",
							"headers": {
								"content-type": "application/json"
							},
							// data: JSON.stringify(obj),
							dataType: "json",
							success: function (res) {
								// var oModel = that.getOwnerComponent().getModel("customerInfo");
								MessageToast.show("Customer has been deleted sucessfully!", {
									closeOnBrowserNavigation: false
								});
								that.onCloseDetailPress();
							}
						});
					}
				}
			});
		},
		handleDocumentUpload: function () {
			if (!this.AddDocumentFragment) {

				this.AddDocumentFragment = sap.ui.xmlfragment("MDG.Customer.fragment.customerDocument", this);
				// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
				this.getView().addDependent(this.AddDocumentFragment);
			}
			this.AddDocumentFragment.open();
			//         this.getOwnerComponent().getModel("appsModel").updateBindings(true);
		},

		handleAppListSearch: function (evt) {
			if (evt.getParameter("value").length > 0)
				var data = [new sap.ui.model.Filter("application", "Contains", evt.getParameter("value"))];
			else
				var data = [];
			this.AddappFragment.getBinding("items").filter(data);

		},
		__handleEditUserPress: function () {

			var userObj = this.getView().getModel().getData();
			// var userObj = this.getView().getBindingContext().getObject();
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent()[1].setValue(
				userObj.customerName);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent()[3].setValue(
				userObj.email);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent()[5].setValue(
				userObj.contact);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent()[7].setValue(
				userObj.address);
			// this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent()[9].setValue(userObj.customerName);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent()[1].setValue(
				userObj.contactPerson);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent()[3].setValue(
				userObj.contactEmail);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent()[5].setValue(
				userObj.contactPhone);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent()[7].setValue(
				userObj.contactDesignation);

			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[2].getContent()[0].getContent()[1].setValue(
				userObj.keyword);
			this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[2].getContent()[0].getContent()[2].setValue(
				userObj.shortDescription);
			//this.addNewUser.getContent()[2].getContent()[9].setSelectedKey(userObj.roletype);
			this.AddcustomerFragment.open();

		},
		handleEditUserPress: function () {
			var that = this;
			this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			this.getOwnerComponent().getRouter().navTo("AddNewCustomer", {
				AddCust: this.customerId
			});
		},
		handleWizardCancel: function () {
			// this.valueHelpForNewUser.getContent()[2].getContent()[5].setValueState("None");
			this.AddcustomerFragment.close();
		},
		handleAddUserOkPress: function () {
			var userObj = this.getView().getModel().getData();
			// var userObj = this.getView().getBindingContext().getObject();
			var content1 = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[0].getContent()[0].getContent();
			var content2 = this.AddcustomerFragment.getContent()[0].getPages()[0].getContent()[0].getSteps()[1].getContent()[0].getContent();
			userObj.customerName = content1[1].getValue();
			userObj.email = content1[3].getValue();
			userObj.contact = content1[5].getValue();
			userObj.address = content1[7].getValue();

			userObj.contactPerson = content2[1].getValue();
			userObj.contactPhone = content2[3].getValue();
			userObj.contactEmail = content2[5].getValue();
			userObj.contactDesignation = content2[7].getValue();

			this.getView().getModel().updateBindings(true);
			// this.getOwnerComponent().getModel().getData().splice(this.path, 1, userObj);
			MessageToast.show("Customer updated successfully.", {
				closeOnBrowserNavigation: false
			});
			this.AddcustomerFragment.close();
		},

		handleConfirmAppList: function (evt) {
			var assignedApps = this.getView().getBindingContext().getObject().assignedApps;
			var selectedApps = evt.getParameter("selectedItems");
			var assignedAppsUpdated = [],
				exists;

			//Removing apps
			for (var m = 0; m < assignedApps.length; m++) {
				exists = false;
				for (var n = 0; n < selectedApps.length; n++) {
					var selectedApp = selectedApps[n].getBindingContext("appsModel").getObject();
					if (assignedApps[m].appId == selectedApp.appId) {
						exists = true;
						break;
					}
				}
				if (exists === true) {
					assignedAppsUpdated.push(assignedApps[m]);
				}
			}

		},
		press: function () {
			MessageBox.information("Navigating to the Help Section..... ");
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
		handleAddDocumentOkPress: function () {
			this.fileData.keyword = this.AddDocumentFragment.getContent()[0].getContent()[1].getValue();
			this.fileData.shortDescription = this.AddDocumentFragment.getContent()[0].getContent()[1].getValue();
			this.getView().getBindingContext().getObject().documents.push(this.fileData);
			this.getView().getModel().updateBindings(true);

			this.handleAddUserCancelPress();
			MessageToast.show("Document added succesfuly.");
		},
		handleAddUserCancelPress: function () {
			this.AddDocumentFragment.close();
			this.clear();
		},
		clear: function () {
			this.fileData.keyword = this.AddDocumentFragment.getContent()[0].getContent()[1].setValue("");
			this.fileData.shortDescription = this.AddDocumentFragment.getContent()[0].getContent()[2].setValue("");
		},
		OnItemPress: function (oItem) {

			this.getView().getModel("appView").setProperty("/layout", "ThreeColumnsEndExpanded");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detailDetail", {
				id: oItem.getParameters().listItem.getNumber(),
				ProjectId: oItem.getParameters().listItem.getTitle()
			});
		},
		onSearch: function (evt) {
			var filter1 = new sap.ui.model.Filter("product", "Contains", evt.getParameter("newValue"));
			var filter2 = new sap.ui.model.Filter("Qid", "Contains", evt.getParameter("newValue"));
			var filter3 = new sap.ui.model.Filter("customerName", "Contains", evt.getParameter("newValue"));

			this.getView().byId("itemlistId").getBinding("items").filter(new sap.ui.model.Filter([filter1, filter2, filter3], false));
		},
		onSearchQuotation: function (evt) {
			var filter1 = new sap.ui.model.Filter("id", "EQ", evt.getParameter("newValue"));
			var filter2 = new sap.ui.model.Filter("dQuotation_Item_Quantity", "Contains", evt.getParameter("newValue"));
			var filter3 = new sap.ui.model.Filter("dQuotation_Item_Price", "Contains", evt.getParameter("newValue"));
			var filters = new sap.ui.model.Filter([filter1, filter2, filter3], false);
			this.getView().byId("CustomersTable").getBinding("items").filter(filters);
		},
		addQuotation: function () {
			var that = this;
			this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			this.getOwnerComponent().getRouter().navTo("AddNewQuotation", {
				AddCust: this.customerId
			});
		}
	});

});