sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Context",
		"sap/ui/model/FilterOperator",
		"sap/m/UploadCollectionParameter"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, MessageToast, MessageBox, JSONModel, Context, FilterOperator, UploadCollectionParameter) {
		"use strict";

		return Controller.extend("MDG.Customer.controller.AddNewCustomer", {

			onInit: function () {
				var that = this;
				this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				this.getOwnerComponent().getRouter().getRoute("AddNewCustomer").attachPatternMatched(this.onObjectMatched, this);

				this.oDoc = {
					"fileName": "",
					"mediaType": "",
					"url": "",
					"keyword": "",
					"shortDescription": ""
				};
				that.handleCustomerType();
				// that.addCustomerContacts();
				that.addCustomerProjects();
				that.handleCustomerContactType();
				// that.handleAddUserOkPress();
			},
			handleCustomerType: function () {
				var that = this;
				var UserId = "3";
				$.ajax({
					url: "/DanaoStrapi/api/d-sales-user-types?populate=*&filters[id][$eq]=" + UserId,
					type: "GET",
					"headers": {
						"content-type": "application/json"
					},
					dataType: "json", // added data type
					success: function (res) {
						var customerType = res.data[0].attributes.d_customer_types.data;
						var customerTypeArr = [];
						for (var m = 0; m < customerType.length; m++) {
							customerType[m].attributes.id = customerType[m].id;
							customerTypeArr.push(customerType[m].attributes);
						}
						that.getView().setModel(new sap.ui.model.json.JSONModel(customerTypeArr), "customerTypeModel");
					}
				});
			},
			onObjectMatched: function (oEvent) {
				var that = this;
				var task = oEvent.getParameter("arguments").AddCust;
				that.isAdd = task;
				if (task !== "Edit") {
					/*	that.path = that.getView().getModel("appView").oData.indexNo;
					var usersModel = that.getOwnerComponent().getModel("customerInfo");
					var oContext = new sap.ui.model.Context(usersModel, "/" + that.path);
					that.customerId= oContext.getObject().id;*/
					that.mode = "Create";
					var newId = "CUST" + (this.getView().getModel("appView").getData().lastId + 1);

					that.newcustomer = {
						"id": newId,
						"customerName": "",
						"email": "",
						"contact": "",
						"contactPerson": "",
						"contactEmail": "",
						"contactPhone": "",
						"contactDesignation": "",
						"country": "",
						"city": "",
						"address": "",
						"description": "",
						"zipCode": "",
						"documents": []
					};
					that.getView().setModel(new JSONModel(that.newcustomer));
				} else {
					that.mode = "Edit";
					that.path = that.getView().getModel("appView").oData.indexNo;
					var usersModel = that.getOwnerComponent().getModel("customerInfo");
					var oContext = new sap.ui.model.Context(usersModel, "/" + that.path);
					that.newcustomer = oContext.getObject();
					that.customerId = oContext.getObject().id;
					that.getView().setModel(new JSONModel(that.newcustomer));
					that.getView().getModel().updateBindings(true);
				}
			},
			// collectFileData1: function (oEvent) {
			// 	this.oDoc.fileName = oEvent.getParameters().files[0].name;
			// 	this.oDoc.mediaType = oEvent.getParameter("files")[0].type;
			// },

			___handleAddUserOkPress: function () {
				// this.fileData.keyword = this.byId("keyword").getValue();
				// this.fileData.shortDescription = this.byId("short").getValue();
				// this.newcustomer.documents.push(this.fileData);

				// this.getOwnerComponent().getModel().getData().push(this.newcustomer);
				// this.getOwnerComponent().getModel().updateBindings(true);
				this.getOwnerComponent().getModel("customerInfo").getData().push(this.newcustomer);
				this.getOwnerComponent().getModel("customerInfo").updateBindings(true);

				this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
				this.getOwnerComponent().getRouter().navTo("Master");

				this.getView().getModel("appView").getData().lastId = this.getView().getModel("appView").getData().lastId + 1;
			},

			// handleAddUserOkPress: function (oEvent) {
			// 	var that = this;
			// 	var obj = {
			// 		"data": {
			// 			dCustomerName: this.getView().byId("custName").getValue(),
			// 			dWebsite: this.getView().byId("website").getValue(),
			// 			dOfficePhone: this.getView().byId("abtCust").getValue(),
			// 			dBillingAddress: this.getView().byId("addr").getValue(),
			// 			d_customer_type: [this.getView().byId("custType").getSelectedKey()]

			// 		}
			// 	};
			// 	$.ajax({
			// 		url: "/DanaoStrapi/api/d-customers",
			// 		type: "POST",
			// 		"headers": {
			// 			"content-type": "application/json"
			// 		},
			// 		data: JSON.stringify(obj),
			// 		dataType: "json",
			// 		success: function (res) {
			// 			that.addCustomerContacts(obj, res.data.id);
			// 			// 	that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// 			// that.getOwnerComponent().getRouter().navTo("Master", {
			// 			// 	id: "addProject",
			// 			// 	moduleIndex: "index"
			// 			// });

			// 			/*that.index = oEvent.getSource().getSelectedContextPaths()[0].split("")[1];
			// 			var topicIndex = oEvent.getSource().getSelectedItem().getBindingContext("customerInfo").getObject().id;
			// 			that.getView().getModel("appView").setProperty("/indexNo", this.index);
			// 			MessageBox.success("Customer has been added successfully");
			// 			var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
			// 			that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn");
			// 			that.getView().getModel("appView").setProperty("/layout", "OneColumn");
			// 			that.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			// 			// that.getOwnerComponent().getModel("customerInfo").getData().push(res.data.attributes);
			// 			// that.getOwnerComponent().getModel("customerInfo").updateBindings(true);
			// 			that.getOwnerComponent().getRouter().navTo("Detail", {
			// 				id: topicIndex,
			// 				moduleIndex: this.index
			// 		});*/
			// 		},
			// 		error: function (err) {
			// 			MessageBox.error(err.responseJSON.error.message);
			// 		}
			// 	});
			// 	// that.getOwnerComponent().getModel("DetailProjectsModel").getData().push(res.data.attributes.d_customer_projects.data.attributes);
			// 	// that.getOwnerComponent().getModel("DetailProjectsModel").updateBindings(true);
			// 	// that.getOwnerComponent().getModel("DetailProjectsModel").getData().push(res.data.attributes.d_customer_projects.data.attributes);
			// 	// that.getOwnerComponent().getModel("DetailProjectsModel").updateBindings(true);
			// 	// that.getOwnerComponent().getModel("DetailContactModel").getData().push(res.data.attributes.d_customer_contacts.data.attributes);
			// 	// that.getOwnerComponent().getModel("DetailContactModel").updateBindings(true);
			// 	// this.getOwnerComponent().getRouter().navTo("Master");
			// },

			handleAddUserOkPress: function (customerId) {

				//customerId = this.getView().getModel("appView").getProperty("/customerId", this.index);
				//debugger
				var that = this;
				var obj = {
					"data": {
						dCustomerName: this.getView().byId("custName").getValue(),
						dWebsite: this.getView().byId("website").getValue(),
						dOfficePhone: this.getView().byId("abtCust").getValue(),
						dBillingAddress: this.getView().byId("addr").getValue(),
						d_customer_type: [this.getView().byId("custType").getSelectedKey()]
					}
				};
				var baseUrl;
				var callMethod;
				if (that.mode == "Create") {
					baseUrl = "/DanaoStrapi/api/d-customers";
					callMethod = "POST";

				} else {
					baseUrl = "/DanaoStrapi/api/d-customers/" + that.customerId;
					callMethod = "PUT";
				}
			//	console.log("ran", callMethod);
				$.ajax({
					url: baseUrl,
					type: callMethod,
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						that.addCustomerContacts(obj, res.data.id);
						// MessageToast.show("Customer has been added sucessfully", {
						// 	closeOnBrowserNavigation: false
						// });
						// that.handleWizardCancel();
					},
					error: function (err) {
						MessageBox.error(err.responseJSON.error.message);
					}
				});
			},
			handleWizardCancel: function () {
				this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
				this.getOwnerComponent().getRouter().navTo("Master");
				this.getView().getModel("appView").setProperty("/layout", "OneColumn");
			},
			handleCustomerContactType: function () {
				var that = this;
				$.ajax({
					url: "/DanaoStrapi/api/d-customer-contact-types",
					type: "GET",
					"headers": {
						"content-type": "application/json"
					},
					dataType: "json",
					success: function (res) {
						var contactName = res.data;
						var contactArr = [];
						for (var m = 0; m < contactName.length; m++) {
							//contactName[m].attributes.id = contactName[m].id;
							contactArr.push({
								id: contactName[m].id,
								DCustomerContact_type: contactName[m].attributes.DCustomerContact_type
							});
						}
						console.log(contactArr);
						that.getView().setModel(new sap.ui.model.json.JSONModel(contactArr), "CustomerContactModel");
					}
				});
			},
			addCustomerContacts: function (obj, customerId) {
				var that = this;
				var obj = {
					"data": {
						dCustomerContact_Name: that.getView().byId("cname").getValue(),
						dCustomer_ContactEmail: that.getView().byId("ceml").getValue(),
						dCustomer_Conact_DirectPhone: that.getView().byId("crty").getValue(),
						dCustomer_ContactMobile: that.getView().byId("contNum").getValue(),
						// dCustomer_MainContact: this.getView().byId("contMain").getSelected(),
						// DCustomerContact_type: that.getView().byId("conctType").getValue()
						d_customer_contact_type: [that.getView().byId("conctType").getSelectedKey()]

					}
				};
				$.ajax({
					url: "/DanaoStrapi/api/d-customer-contacts",
					type: "POST",
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						// that.index = oEvent.getSource().getSelectedContextPaths()[0].split("")[1];
						//	var topicIndex = oEvent.getSource().getSelectedItem().getBindingContext("DetailContactModel").getObject().id;
						that.updateCustomerContacts(res.data.id, customerId);
						//	MessageBox.success("Customer has been added successfully");

						/*var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
						that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn");*/
						that.getView().getModel("appView").setProperty("/layout", "OneColumn");
						that.getView().getModel("appView").setProperty("/indexNo", this.index);
						// that.getOwnerComponent().getModel("DetailContactModel").getData().push(res.data.attributes.d_customer_contacts.data.attributes);
						// that.getOwnerComponent().getModel("DetailContactModel").updateBindings(true);
						/*that.getOwnerComponent().getRouter().navTo("Detail", {
							id: "topicIndex",
							moduleIndex: "thisindex"
						});*/

					},
					error: function () {
						sap.m.MessageBox.error("Contact Data has not Added");
					}
				});
				// error: function (err) {
				// 	MessageBox.error(err.responseJSON.error.message);
				// }
			},
			updateCustomerContacts: function (contactId, customerId) {
				var that = this;
				var obj = {
					"data": {
						/*	dCustomerName: this.getView().byId("custName").getValue(),
							dWebsite: this.getView().byId("website").getValue(),
							dOfficePhone: this.getView().byId("abtCust").getValue(),
							dBillingAddress: this.getView().byId("addr").getValue(),
							d_customer_type: [this.getView().byId("custType").getSelectedKey()],*/

						d_customer_contacts: [contactId]

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
						// that.index = oEvent.getSource().getSelectedContextPaths()[0].split("")[1];
						//	var topicIndex = oEvent.getSource().getSelectedItem().getBindingContext("DetailContactModel").getObject().id;

						MessageBox.success("Customer has been added successfully");

						/*	var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
							that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn");*/
						that.getView().getModel("appView").setProperty("/layout", "OneColumn");
						that.getView().getModel("appView").setProperty("/indexNo", this.index);
						// that.getOwnerComponent().getModel("DetailContactModel").getData().push(res.data.attributes.d_customer_contacts.data.attributes);
						// that.getOwnerComponent().getModel("DetailContactModel").updateBindings(true);
						/*	that.getOwnerComponent().getRouter().navTo("Detail", {
								id: topicIndex,
								moduleIndex: this.index
							});*/
						var oRouter = that.getOwnerComponent().getRouter();
						oRouter.navTo("Master", {
							id: "0"
						});
					}
				});
				// error: function (err) {
				// 	MessageBox.error(err.responseJSON.error.message);
				// }
			},
			addCustomerProjects: function (oEvent) {
				var that = this;
				var obj = {
					"data": {
						dCustomer_TypeCode: this.getView().byId("custType").getValue()
					}
				};
				$.ajax({
					url: "/DanaoStrapi/api/d-customers",
					type: "POST",
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						that.index = oEvent.getSource().getSelectedContextPaths()[0].split("")[1];
						var topicIndex = oEvent.getSource().getSelectedItem().getBindingContext("customerTypeModel").getObject().id;
						that.getView().getModel("appView").setProperty("/indexNo", this.index);
						MessageBox.success("Customer has been added successfully");
						var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
						that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn");
						that.getView().getModel("appView").setProperty("/layout", "OneColumn");
						// that.getOwnerComponent().getModel("customerTypeModel").getData().push(res.data.attributes.d_customer_type.data.attributes);
						// that.getOwnerComponent().getModel("customerTypeModel").updateBindings(true);
						that.getOwnerComponent().getRouter().navTo("Detail", {
							id: topicIndex,
							moduleIndex: this.index
						});
					}
				});
				// error: function (err) {
				// 	MessageBox.error(err.responseJSON.error.message);
				// }
			},
			// 	that.getOwnerComponent().setModel(new JSONModel(customerArr), "customerModel");
			// that.getOwnerComponent().getModel((new JSONModel(customerArr), "customerModel").updateBindings(true);
			// that.getView().setModel(new sap.ui.model.json.JSONModel(customerArr), "customerModel");
			// console.log(res);
			//alert(res);
			// 	});
			// },

			// handleAddUserOkPress: function () {
			// this.fileData.keyword = this.byId("keyword").getValue();
			// this.fileData.shortDescription = this.byId("short").getValue();
			// this.newcustomer.documents.push(this.fileData);
			// 	var that = this;
			// 	//var Err = this.ValidateCreateCust();
			// 	var Err = 0;
			// 	if (this.getView().byId("custName").getValue().length == 0 || this.getView().byId("eml").getValue().length == 0 ||
			// 		this.getView().byId("contNum").getValue().length == 0) {
			// 		sap.m.MessageBox.error("Please fill the mandatory fields");
			// 		return;
			// 	}
			// 	if (Err == 0) {
			// 		if (that.isAdd == "Edit") {
			// 			this.getOwnerComponent().getModel("customerInfo").oData[that.getView().getModel("appView").oData.indexNo] = this.newcustomer;
			// 			this.getOwnerComponent().getModel("customerInfo").updateBindings(true);
			// 			this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// 			var tile = this.getView().getModel("appView").oData.tileIndex;
			// 			this.getOwnerComponent().getRouter().navTo("Master", {
			// 				id: tile
			// 			});

			// 		} else {
			// 			this.getOwnerComponent().getModel("customerInfo").getData().push(this.newcustomer);
			// 			this.getOwnerComponent().getModel("customerInfo").updateBindings(true);
			// 			this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// 			var tile = this.getView().getModel("appView").oData.tileIndex;
			// 			this.getOwnerComponent().getRouter().navTo("Master", {
			// 				id: tile
			// 			});
			// 		}

			// 		this.getView().getModel("appView").getData().lastId = this.getView().getModel("appView").getData().lastId + 1;
			// 	} else {
			// 		this.getView().setBusy(false);

			// 		var text = "Mandatory Fields are Required";
			// 		MessageBox.error(text);

			// 	}
			// },

			// handleWizardCancel: function () {
			// 	this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			// 	// this.getOwnerComponent().getRouter().navTo("Master");
			// 	this.getView().getModel("appView").setProperty("/layout", "OneColumn");
			// },

			handleDocumentUpload: function () {
				if (!this.AddDocumentFragment) {

					this.AddDocumentFragment = sap.ui.xmlfragment("MDG.Customer.fragment.customerDocument", this);
					// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
					this.getView().addDependent(this.AddDocumentFragment);
				}
				this.AddDocumentFragment.open();
				//         this.getOwnerComponent().getModel("appsModel").updateBindings(true);

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
				this.fileData.shortDescription = this.AddDocumentFragment.getContent()[0].getContent()[2].getValue();
				// this.getView().byId("UploadSet").getModel().getData().documents.push(this.fileData);
				// this.getView().byId("UploadSet").getModel().updateBindings(true);
				this.getView().getModel().getData().documents.push(this.fileData);
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

			ValidateCreateCust: function () {
				var Err = 0;
				if (this.getView().byId("custName").getValue() == "" || this.getView().byId("custName").getValue() === null) {
					Err++;
					// this.getView().byId("custName").setValueState("Error");
				} else {
					this.getView().byId("custName").setValueState("None");
				}
				if (this.getView().byId("eml").getValue() == "" || this.getView().byId("eml").getValue() === null) {
					Err++;
					// this.getView().byId("eml").setValueState("Error");
				} else {
					this.getView().byId("eml").setValueState("None");
				}
				if (this.getView().byId("contNum").getValue() == "" || this.getView().byId("contNum").getValue() === null) {
					Err++;
					// this.getView().byId("contNum").setValueState("Error");
				} else {
					this.getView().byId("contNum").setValueState("None");
				}
				if (this.getView().byId("abtCust").getValue() == "" || this.getView().byId("abtCust").getValue() === null) {
					Err++;
					// this.getView().byId("abtCust").setValueState("Error");
				} else {
					this.getView().byId("abtCust").setValueState("None");
				}
				if (this.getView().byId("addr").getValue() == "" || this.getView().byId("addr").getValue() === null) {
					Err++;
					// this.getView().byId("addr").setValueState("Error");
				} else {
					this.getView().byId("addr").setValueState("None");
				}
				if (this.getView().byId("cty").getValue() == "" || this.getView().byId("cty").getValue() === null) {
					Err++;
					// this.getView().byId("cty").setValueState("Error");
				} else {
					this.getView().byId("cty").setValueState("None");
				}
				if (this.getView().byId("crty").getValue() == "" || this.getView().byId("cty").getValue() === null) {
					Err++;
					// this.getView().byId("crty").setValueState("Error");
				} else {
					this.getView().byId("crty").setValueState("None");
				}

				return Err;
			},

			selectDocumentType: function (oEvent) {
				// alert("Hai");
				var that = this;
				var oPanel = new sap.m.Panel();
				var DocTypeHBox = new sap.m.HBox();
				DocTypeHBox.addStyleClass("sapUiTinyMarginTop");
				//var FileChooser=new sap.m.HBox();
				var VBox = new sap.m.VBox();
				var Text = new sap.m.Text({
					text: ""
				});
				var oDocTypeItemTemplate = new sap.ui.core.Item({
					key: "{Key}",
					text: "{Key}{Seperator}{Text}{Mandatory}",
					tooltip: "{Key}{Seperator}{Text}"
				});

				var UploadCollection = new sap.m.UploadCollection({
					// width: "100%",
					fileType: ["jpg", "png", "jpeg", "bmp"],
					maximumFilenameLength: 55,
					maximumFileSize: 1,
					multiple: false,
					sameFilenameAllowed: false,
					instantUpload: false,
					showSeparators: "All",
					noDataText: "No Data Found",
					change: function (oEvent) {
						that.onChange(oEvent);
					},
					fileDeleted: function (oEvent) {
						that.onFileDeleted(oEvent);
					},
					filenameLengthExceed: function (oEvent) {
						that.onFilenameLengthExceed(oEvent);
					},
					fileSizeExceed: function (oEvent) {
						that.onFileSizeExceed(oEvent);
					},
					typeMissmatch: function (oEvent) {
						that.onTypeMissmatch(oEvent);
					},
					beforeUploadStarts: function (oEvent) {
						that.onBeforeUploadStarts(oEvent);
					},
					uploadComplete: function (oEvent) {
						that.onUploadComplete(oEvent);
					},
					uploadUrl: ""
				});
				VBox.addItem(UploadCollection);
				VBox.addStyleClass("sapUiTinyMargin");
				oPanel.addContent(VBox);
				this.dialog = new sap.m.Dialog({
					title: "My Document",
					type: "Standard",
					// width: "50%",
					// height: "50%",
					resizable: true,
					contentWidth: "50%",
					contentHeight: "50%",
					state: "None",
					icon: "sap-icon://attachment",
					draggable: true,
					content: oPanel,
					buttons: [new sap.m.Button({
							text: "Upload",
							press: function () {
								// 				this.fileData.keyword = this.AddDocumentFragment.getContent()[0].getContent()[1].getValue();
								// this.fileData.shortDescription = this.AddDocumentFragment.getContent()[0].getContent()[2].getValue();
								this.getView().byId("UploadSet").getModel().getData().documents.push(this.fileData);
								this.getView().byId("UploadSet").getModel().updateBindings(true);
								this.getView().getModel().getData().documents.push(this.fileData);
								this.getView().getModel().updateBindings(true);

								this.handleAddUserCancelPress();
								MessageToast.show("Document added succesfuly.");
							}
						}),
						new sap.m.Button({
							text: "Cancel",
							press: function () {
								//that.getInvoiceContractDocumentss(that._oComponent);
								that.dialog.close();
							}
						})
					],
					afterClose: function () {
						//that.dialog.destroy();
					}
				});
				var aDialog = this.dialog;
				that.dialog.open();
				if (sap.ui.Device.support.touch === false) {
					that.dialog.addStyleClass("sapUiSizeCompact");
				}
			},

			onFileSizeExceed: function (oEvent) {
				sap.m.MessageToast.show("Please select less than 1 mb file");
				if (this.onFileSizeExceed_Exit) {
					this.onFileSizeExceed_Exit();
				}
			},

			onTypeMissmatch: function (oEvent) {
				sap.m.MessageToast.show("Please Select Images");
				if (this.onTypeMissmatch_Exit) {
					this.onTypeMissmatch_Exit();
				}
			},

			onChange: function (oEvent) {

				var file = oEvent.getParameter("files")[0];
				this.fileData = {
					fileName: file.name,
					mediaType: file.type,
					url: ""

				};
			},
			onFileDeleted: function (oEvent) {
				gGRAttachments.setBusy(true);
				oPPCCommon.removeAllMsgs();
				var that = this;
				var URL;
				var DocumentDeleteModel = this._oComponent.getModel("SSGW_MM");
				var sLoginID = this.getCurrentUsers("MaterialDocDocuments", "delete");
				// DocumentDeleteModel.setUseBatch(false);
				DocumentDeleteModel.setHeaders({
					"x-arteria-loginid": sLoginID
				});
				var token = this._oComponent.getModel("SSGW_MM").getSecurityToken();
				DocumentDeleteModel.setHeaders({
					"x-csrf-token": token
				});
				// SchemeGUID = gSchemeDetails.getModel("Schemes").getProperty("/SchemeGUID").toUpperCase();

				SchemeGUID = this._oComponent.getModel("LocalViewSetting").getProperty("/GRDocGuid").toUpperCase();

				var SchemeGuid = "guid'" + SchemeGUID + "'";
				URL = "MaterialDocDocuments(MaterialDocGUID=" + SchemeGuid + ",MatDocDocumentGUID='" + escape(oEvent.getParameters().documentId) +
					"',DocumentStore='" + DocumentStore + "')";
				DocumentDeleteModel.remove("/" + URL, {
					headers: {
						"x-arteria-loginid": sLoginID
					},
					success: function () {
						// gGRAttachments.setBusy(false);
						oPPCCommon.removeDuplicateMsgsInMsgMgr();
						var message = oPPCCommon.getMsgsFromMsgMgr();
						vIndex++;
						that.getContractDocumentss(that._oComponent, oi18n.getText(
							"ContractAttachments.message.deleted"));

					},
					error: function (error) {
						gGRAttachments.setBusy(false);
						oPPCCommon.removeDuplicateMsgsInMsgMgr();
						var message = oPPCCommon.getMsgsFromMsgMgr();
						oPPCCommon.displayMsg_MsgBox(that.getView(), message, "error");
						oDialog.close();
					}
				});
			},
			onFilenameLengthExceed: function (UploadCollection) {
				if (UploadCollection.mParameters.mParameters.fileName.length > 55) {
					var msg1 = oi18n.getText("File name Length Exceeded");
					oPPCCommon.displayMsg_MsgBox(this.getView(), msg1, "error");
				}
				if (this.onFilenameLengthExceed_Exit) {
					this.onFilenameLengthExceed_Exit();
				}
			},
			onBeforeUploadStarts: function (oEvent) {
				var sLoginID = this.getCurrentUsers("MaterialDocDocuments", "write");
				var oHeaderLoginId = new sap.m.UploadCollectionParameter({
					name: "x-arteria-loginid",
					value: sLoginID
				});
				var oHeaderSlug;

				var oHeaderToken = new sap.m.UploadCollectionParameter({
					name: "helo",
					value: token
				});

				var DocTypeID = this._oComponent.getModel("LocalViewSetting").getProperty("/DocType");
				vIndex++;
				// var DocTypeDesc = this.DocType.getSelectedItem().getText().split(" - ")[1].trim();
				var sFileName = oEvent.mParameters.fileName;
				// ContractNo = this.getView().getModel("Contracts").getProperty("/ContractNo");
				// SchemeGUID = gSchemeDetails.getModel("Schemes").getProperty("/SchemeGUID").toUpperCase();
				// SchemeGUID = SchemeGUID.split("-").join('');

				SchemeGUID = this._oComponent.getModel("LocalViewSetting").getProperty("/GRDocGuid").toUpperCase();

				SchemeGUID = SchemeGUID.split("-").join("");

				// var DocTypeID = this.getView().getModel("DocTypeDD").getData()[0].Key;
				var DocumentID = oPPCCommon.generateUUID().toUpperCase();
				DocumentID = DocumentID.split("-").join("");
				oHeaderSlug = new sap.m.UploadCollectionParameter({
					name: "SLUG",
					value: "MaterialDocGUID:" + SchemeGUID + ",DocumentStore:" + DocumentStore + ",MatDocDocumentGUID:" + DocumentID +
						",DocumentTypeID:" +
						DocTypeID + ",FileName:" +
						sFileName +
						",LoginID:" + sLoginID
				});
				oEvent.getParameters().addHeaderParameter(oHeaderToken);
				oEvent.getParameters().addHeaderParameter(oHeaderLoginId);
				oEvent.getParameters().addHeaderParameter(oHeaderSlug);

			},
			onUploadComplete: function (oEvent) {
				if (oEvent.getParameter("files")[0].status === 201) {
					this.getContractDocumentss(this._oComponent, oi18n.getText(
						"ContractAttachments.message.uploaded"));
				} else {
					var message = "";
					var response = oEvent.getParameter("files")[0].responseRaw;

				}
			}
		});
	});