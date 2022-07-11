sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel"
], function (Controller, MessageBox,JSONModel) {
	"use strict";

	return Controller.extend("MDG.Help.controller.addNewProject", {

		onInit: function () {
			var that = this;
			sap.ui.core.UIComponent.getRouterFor(this).getRoute("addNewProject").attachPatternMatched(this.handlePatternMatched, this);

			// that.addCustomerContacts();
			// that.updateCustomerContacts();
		},
		handlePatternMatched: function (evt) {
			// this.newCustomerId = evt.getParameter("arguments").AddPro;
			this.customerId = evt.getParameter("arguments").AddPro;
			this.mode = evt.getParameter("arguments").mode;
			this.projectId = evt.getParameter("arguments").projectId;
			this.getView().byId("wizardId").setShowNextButton(true);
			this.handleContactName();
			this.handleProjectType();
			this.handleProjectCategory();
			this.handleSalesStage();
				if (this.mode === "Edit") {
				this.handleEdit();
			}
		},	handleEdit: function () {
			var that = this;
			var projectId = that.projectId;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + projectId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				//	data: JSON.stringify(obj),
				dataType: "json",
				success: function (res) {
					var data = res.data;
					var Arr = res.data[0].attributes;
					that.newProject = {
						"dCustomer_ProjectName": Arr.dCustomer_ProjectName,
						"dProject_CompletionDateAtD": Arr.dProject_CompletionDate,
						"dProject_Add_Notes": Arr.dProject_Add_Notes,
						"dProject_Probability": Arr.dProject_Probability,
						"dProject_Expected_CloseDate": Arr.dProject_Expected_CloseDate,
						"dProject_ExpectedStartDate": Arr.dProject_ExpectedStartDate,
						"dProject_Shipto_ldDock": Arr.dProject_Shipto_ldDock,
						"DProject_Sales_Stage": Arr.d_project_sales_stage.data.attributes.DProject_Sales_Stage,
						// "DProject_Type": Arr.d_project_type.data.attributes.DProject_Type,
						// "DProject_Category": Arr.d_project_category.data.attributes.DProject_Category
						"DProject_Type": Arr.d_project_type.data == null ? "" : Arr.d_project_type.data.attributes.DProject_Type,
						"DProject_Category": Arr.d_project_category.data == null ? "" : Arr.d_project_category.data.attributes.DProject_Category,
						"DProject_TypeId": Arr.d_project_type.data.id,
						"DProject_CategoryId": Arr.d_project_category.data.id,
						"DProject_Sales_StageId": Arr.d_project_sales_stage.data.id
					};
					that.getView().setModel(new JSONModel(that.newProject));
					that.getView().getModel().updateBindings(true);
				}
			});
		},

		handleAddProjectPress: function () {
				var that = this;
			var customerId = this.customerId;
			var projectId = this.projectId;
			var mode = this.mode;
			if (mode === "Edit") {
				var obj = {
					"data": {
						dCustomer_ProjectName: this.getView().byId("proName").getValue(),
						dProject_ExpectedStartDate: this.getView().byId("startDate").getValue(),
						dProject_Expected_CloseDate: this.getView().byId("closeDate").getValue(),
						dProject_CompletionDate: this.getView().byId("cDate").getValue(),
						dProject_Add_Notes: this.getView().byId("ProNotes").getValue(),
						dProject_Probability: this.getView().byId("Probability").getValue(),
						dProject_Shipto_ldDock: this.getView().byId("ld_dock_true").getSelected(),
						d_customer_contacts: [this.getView().byId("contName").getSelectedKey()],
						d_project_type: [this.getView().byId("proTypeName").getSelectedKey()],
						d_project_category: [this.getView().byId("catgoryName").getSelectedKey()],
						d_project_sales_stage: [this.getView().byId("salesName").getSelectedKey()]
					}
				};
				$.ajax({
					url: "/DanaoStrapi/api/d-customer-projects/" + projectId,
					type: "PUT",
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						that.mode = "";
						that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
						that.getOwnerComponent().getRouter().navTo("Detail", {
							id: that.getView().getModel("appView").oData.RequestIdSelected,
							moduleIndex: that.getView().getModel("appView").oData.moduleIndexForDetail,
							newprojectId: that.projectId
						});
					}
				});

			} else {
			var obj = {
				"data": {
					dCustomer_ProjectName: this.getView().byId("proName").getValue(),
					dProject_ExpectedStartDate: this.getView().byId("startDate").getValue(),
					dProject_Expected_CloseDate: this.getView().byId("closeDate").getValue(),
					dProject_CompletionDate: this.getView().byId("cDate").getValue(),
					dProject_Add_Notes: this.getView().byId("ProNotes").getValue(),
					dProject_Probability: this.getView().byId("Probability").getValue(),
					dProject_Shipto_ldDock: this.getView().byId("ld_dock_true").getSelected(),
					// d_customer_contacts: [this.getView().byId("contName").getSelectedKey()],
						d_customer_contacts:[that.selectedIdOfContact],
					d_project_type: [this.getView().byId("proTypeName").getSelectedKey()],
					d_project_category: [this.getView().byId("catgoryName").getSelectedKey()],
					d_project_sales_stage: [this.getView().byId("salesName").getSelectedKey()]
				}
			};
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-projects",
				type: "POST",
				"headers": {
					"content-type": "application/json"
				},
				data: JSON.stringify(obj),
				dataType: "json",
				success: function (res) {
					that.getView().getModel("appView").oData.CustomerProjectForIds.push({
						"id": res.data.id
					});
					that.handleAddProjectToCustomer(res.data.id, customerId);
					// that.handleProjectTypePost(res.data.id, customerId);
					MessageBox.success("Project has beeen Created");
					that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
					that.getOwnerComponent().getRouter().navTo("Detail", {
						id: that.getView().getModel("appView").oData.RequestIdSelected,
						moduleIndex: that.getView().getModel("appView").oData.moduleIndexForDetail,
						newprojectId: "newprojectId"
					});
				},
				error: function (err) {
					MessageBox.error(err.responseJSON.error.message);
				}
			});
			}
		},
		// handleAddProjectToCustomer: function (obj, ResponseId, CustomerId) {
		handleAddProjectToCustomer: function (ResponseId, CustomerId) {
			var that = this;
			var projectIds = that.getView().getModel("appView").oData.CustomerProjectIds;
			projectIds.push(ResponseId);

			var obj = {
				"data": {
					"d_customer_projects": projectIds
				}

			};
			$.ajax({
				url: "/DanaoStrapi/api/d-customers/" + CustomerId,
				type: "PUT",
				// type: "POST",
				"headers": {
					"content-type": "application/json"
				},
				data: JSON.stringify(obj),
				dataType: "json",
				success: function (res) {
				//	console.log("Success");
				}

			});

		},

		/*	handleUpdateProjectPress: function () {
				var that = this;
				that.getView().getModel("appView").getProperty("/customerId");
				var obj = {
					"data": {
						dCustomer_ProjectName: this.getView().byId("proName").getValue(),
						DProject_Type: this.getView().byId("proTypeName").getValue(),
						DProject_Category: this.getView().byId("catgoryName").getValue(),
						DProject_Sales_Stage: this.getView().byId("salesName").getValue(),
						dProject_ExpectedStartDate: this.getView().byId("startDate").getValue(),
						dProject_Expected_CloseDate: this.getView().byId("closeDate").getValue(),
						dProject_CompletionDate: this.getView().byId("cDate").getValue(),
						dProject_Add_Notes: this.getView().byId("ProNotes").getValue(),
						dProject_Probability: this.getView().byId("Probability").getValue(),
						dProject_Shipto_ldDock: this.getView().byId("ld_dock_true").getSelected(),
						d_customer_contacts: [this.getView().byId("contName").getSelectedKey()]
					}
				};
				$.ajax({
					url: "/DanaoStrapi/api/d-customers/",
					type: "PUT",
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						MessageBox.success("Project has beeen Updated");
						that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
						that.getOwnerComponent().getRouter().navTo("Detail", {
							id: "addProject",
							moduleIndex: "index"
						});
					},
					error: function (err) {
						MessageBox.error(err.responseJSON.error.message);
					}
				});
			},*/
		/*	addCustomerContacts: function (obj, customerId) {
				var that = this;
				var obj = {
					"data": {
						dCustomerContact_Name: that.getView().byId("contName").getValue(),
						dCustomer_ContactEmail: that.getView().byId("ceml").getValue(),
						dCustomer_Conact_DirectPhone: that.getView().byId("crty").getValue(),
						dCustomer_ContactMobile: this.getView().byId("contNum").getValue()
					}
				};
				$.ajax({
					url: "/DanaoStrapi/api/d-customer-contacts",
					type: "GET",
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						that.updateCustomerContacts(res.data.id, customerId);
					}
				});
			},*/
		/*	updateCustomerContacts: function (contactId, customerId) {
				var that = this;
				var obj = {
					"data": {
						d_customer_contacts: [contactId]
					}
				};

				$.ajax({
					url: "/DanaoStrapi/api/d-customer-contacts/" + customerId,
					type: "PUT",
					"headers": {
						"content-type": "application/json"
					},
					data: JSON.stringify(obj),
					dataType: "json",
					success: function (res) {
						MessageBox.success("Customer has been added successfully");
						var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/closeColumn");
						that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/closeColumn");
						that.getView().getModel("appView").setProperty("/layout", "OneColumn");
						that.getOwnerComponent().getRouter().navTo("Detail", {
							id: "topicIndex",
							moduleIndex: "index"
						});
					}
				});

			},*/
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
						if (that.mode === "Edit") {
						// var typeModel = that.getView().getModel().getData().DProject_Type;
						// that.getView().byId("proTypeName").setValue(typeModel);
							var typeModel = that.getView().getModel().getData().DProject_TypeId;
						that.getView().byId("proTypeName").setSelectedKey(typeModel.toString());
					}
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
					if (that.mode === "Edit") {
						// var model = that.getView().getModel().getData().DProject_Sales_Stage;
						// that.getView().byId("salesName").setValue(model);
							var model = that.getView().getModel().getData().DProject_Sales_StageId;
						that.getView().byId("salesName").setSelectedKey(model.toString());
					}
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
						if (that.mode === "Edit") {
						// var projectCategory = that.getView().getModel().getData().DProject_Category;
						// that.getView().byId("catgoryName").setValue(projectCategory);
						var projectCategory = that.getView().getModel().getData().DProject_CategoryId;
						that.getView().byId("catgoryName").setSelectedKey(projectCategory.toString());
					}
				}
			});
		},
	handleContactName: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + this.customerId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var contactName = res.data[0].attributes.d_customer_contacts.data;
					var contactArr = [];
					for (var m = 0; m < contactName.length; m++) {
						contactName[m].attributes.id = contactName[m].id;
						contactArr.push(contactName[m].attributes);
					}
					$.ajax({
						url: "/DanaoStrapi/api/d-customer-contacts?populate=*&pagination[pageSize]=200",
						type: "GET",
						"headers": {
							"content-type": "application/json"
						},
						dataType: "json", // added data type
						success: function (res) {
							var Arr = res.data;
							var custType = [];
							for (var i = 0; i < contactArr.length; i++) {
								for (var j = 0; j < Arr.length; j++) {
									if (Arr[j].id === contactArr[i].id) {
										if (Arr[j].attributes.d_customer_contact_type.data.attributes.DCustomerContact_type === "Main Contact") {
											custType.push(Arr[j]);
										}
									}
								}
							}
							var arrContact = [];
							for (var m = 0; m < custType.length; m++) {
								arrContact.push(contactName[m].attributes);
								arrContact[m].id = custType[m].id;
							}
							that.getView().setModel(new sap.ui.model.json.JSONModel(arrContact), "contactNameModel");
							that.getView().byId("contName").setValue(arrContact[0].dCustomerContact_Name);
							that.getView().byId("ceml").setValue(arrContact[0].dCustomer_ContactEmail);
							that.getView().byId("crty").setValue(arrContact[0].dCustomer_Conact_DirectPhone);
							that.getView().byId("contNum").setValue(arrContact[0].dCustomer_ContactMobile);
							that.selectedIdOfContact = arrContact[0].id;
						}

					});
				}
			});

		},
		handleProjectCancel: function (oEvent) {
			this.getView().byId("proName").setValue("");
			this.getView().byId("proTypeName").setValue("");
			this.getView().byId("catgoryName").setValue("");
			this.getView().byId("salesName").setValue("");
			this.getView().byId("startDate").setValue("");
			this.getView().byId("closeDate").setValue("");
			this.getView().byId("cDate").setValue("");
			this.getView().byId("ProNotes").setValue("");
			this.getView().byId("Probability").setValue("");

			this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			this.getOwnerComponent().getRouter().navTo("Detail", {
				id: this.getView().getModel("appView").oData.RequestIdSelected,
				moduleIndex: this.getView().getModel("appView").oData.moduleIndexForDetail,
				newprojectId: this.projectId
			});

		},
		handleSelectContact: function (evt) {
				// var selectedData = evt.getSource().getSelectedItem().getBindingContext("contactNameModel").getObject();
				// this.getView().byId("ceml").setValue(selectedData.dCustomer_ContactEmail);
				// this.getView().byId("crty").setValue(selectedData.dCustomer_Conact_DirectPhone);
				// this.getView().byId("contNum").setValue(selectedData.dCustomer_ContactMobile);
			}
			// onStateChanged: function (evt) {
			// var currentvalue = this.getView().byId("switchSettings").getState();
			// // if(currentvalue)
			// // this.getView().byId("wizardId").setShowNextButton(true);
			// // else
			// // this.getView().byId("wizardId").setShowNextButton(false);
			// 	if (currentvalue ) {
			//  this.getView().byId("switchSettings").getValue() = "On";
			// 	} else {
			// 		 this.getView().byId("switchSettings").getValue() = "Off";
			// 	}
			//  }

	});

});

// sap.ui.define([
//             "sap/ui/core/mvc/Controller",
//             "sap/m/MessageBox",
//         ], function (Controller, MessageBox) {
//             "use strict";

//             return Controller.extend("MDG.Help.controller.addNewProject", {

//                     onInit: function () {
//                         sap.ui.core.UIComponent.getRouterFor(this).getRoute("addNewProject").attachPatternMatched(this.handlePatternMatched, this);
//                     },
//                     handlePatternMatched: function(evt){
//                             this.getView().byId("wizardId").setShowNextButton(false);
//                     },

//                     handleAddProjectPress: function () {
//                         var that = this;
//                         var obj = {
//                             "data": {
//                                 dCustomer_ProjectName: this.getView().byId("proName").getValue(),
//                                 DProject_Type: this.getView().byId("type").getValue(),
//                                 DProject_Category: this.getView().byId("ProCatg").getValue(),
//                                 DProject_Sales_Stage:this.getView().byId("salesStage").getValue(),
//                                 dProject_ExpectedStartDate: this.getView().byId("startDate").getValue(),
//                                 dProject_Expected_CloseDate: this.getView().byId("closeDate").getValue(),
//                                 dProject_CompletionDateAtD: this.getView().byId("cDate").getValue(),
//                                 // dProject_Shipto_IdDock: this.getView().byId("switchSettings").getValue(),
//                                 dProject_Add_Notes: "",
//                                 dProject_Probability: "",
//                                 Customer: {
//                                     d_customer_contacts: this.getView().byId("contNum").getValue(),
//                                 dCustomer_ContactEmail: this.getView().byId("emailNum").getValue(),
//                                     dCustomer_Contact_DirectPhone: this.getView().byId("DirctNum").getValue(),
//                                     dCustomer_ContactMobile: this.getView().byId("mobileNum").getValue()
//                                 }
//                                 // Customer: {
//                                 //     d_customer_contacts: this.getView().byId("contNum").getValue(),
//                                 //     dCustomer_ContactEmail: "customer@gmail.com",
//                                 //     dCustomer_Contact_DirectPhone: "",
//                                 //     dCustomer_ContactMobile: ""
//                                 // }
//                             }
//                         };
//                         $.ajax({
//                             url: "/DanaoStrapi/api/d-customers",

//                             type: "POST",
//                             "headers": {
//                                 "content-type": "application/json"
//                             },
//                             data: JSON.stringify(obj),
//                             dataType: "json",
//                             success: function (res) {
//                                 MessageBox.success("Project has been added successfully");
//                                 that.getOwnerComponent().getModel("projectModel").getData().push(res.data.attributes);
//                                 that.getOwnerComponent().getModel("projectModel").updateBindings(true);
//                                 that.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
//                                 that.getOwnerComponent().getRouter().navTo("Detail");
//                             },
//                             error: function (err) {
//                                 MessageBox.error(err.responseJSON.error.message);
//                             }
//                         });
//                     },
//                     handleProjectCancel: function (oEvent) {
//                         this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
//                         this.getOwnerComponent().getRouter().navTo("Detail", {
//                             id: "addProject",
//                             moduleIndex: "index"
//                         });
//                     },
//                     onStateChanged: function (evt) {
//                     var currentvalue = this.getView().byId("switchSettings").getState();
//                     if(currentvalue)
//                     this.getView().byId("wizardId").setShowNextButton(true);
//                     else
//                     this.getView().byId("wizardId").setShowNextButton(false);
//                     // //    if (currentvalue == "O") {
//                     //          this.getView().byId("switchSettings").getValue() = "On";
//                     //     } else {
//                     //          this.getView().byId("switchSettings").getValue() = "Off";
//                     //     }
//                      },
//                      	selectDocumentType: function (oEvent) {
// 				// alert("Hai");
// 				var that = this;
// 				var oPanel = new sap.m.Panel();
// 				var DocTypeHBox = new sap.m.HBox();
// 				DocTypeHBox.addStyleClass("sapUiTinyMarginTop");
// 				//var FileChooser=new sap.m.HBox();
// 				var VBox = new sap.m.VBox();
// 				var Text = new sap.m.Text({
// 					text: ""
// 				});
// 				var oDocTypeItemTemplate = new sap.ui.core.Item({
// 					key: "{Key}",
// 					text: "{Key}{Seperator}{Text}{Mandatory}",
// 					tooltip: "{Key}{Seperator}{Text}"
// 				});

// 				var UploadCollection = new sap.m.UploadCollection({
// 					// width: "100%",
// 					fileType: ["jpg", "png", "jpeg", "bmp"],
// 					maximumFilenameLength: 55,
// 					maximumFileSize: 1,
// 					multiple: false,
// 					sameFilenameAllowed: false,
// 					instantUpload: false,
// 					showSeparators: "All",
// 					noDataText: "No Data Found",
// 					change: function (oEvent) {
// 						that.onChange(oEvent);
// 					},
// 					fileDeleted: function (oEvent) {
// 						that.onFileDeleted(oEvent);
// 					},
// 					filenameLengthExceed: function (oEvent) {
// 						that.onFilenameLengthExceed(oEvent);
// 					},
// 					fileSizeExceed: function (oEvent) {
// 						that.onFileSizeExceed(oEvent);
// 					},
// 					typeMissmatch: function (oEvent) {
// 						that.onTypeMissmatch(oEvent);
// 					},
// 					beforeUploadStarts: function (oEvent) {
// 						that.onBeforeUploadStarts(oEvent);
// 					},
// 					uploadComplete: function (oEvent) {
// 						that.onUploadComplete(oEvent);
// 					},
// 					uploadUrl: ""
// 				});
// 				VBox.addItem(UploadCollection);
// 				VBox.addStyleClass("sapUiTinyMargin");
// 				oPanel.addContent(VBox);
// 				this.dialog = new sap.m.Dialog({
// 					title: "My Document",
// 					type: 'Standard',
// 					// width: "50%",
// 					// height: "50%",
// 					resizable: true,
// 					contentWidth: "50%",
// 					contentHeight: "50%",
// 					state: 'None',
// 					icon: 'sap-icon://attachment',
// 					draggable: true,
// 					content: oPanel,
// 					buttons: [new sap.m.Button({
// 							text: "Upload",
// 							press: function () {
// 								// 				this.fileData.keyword = this.AddDocumentFragment.getContent()[0].getContent()[1].getValue();
// 								// this.fileData.shortDescription = this.AddDocumentFragment.getContent()[0].getContent()[2].getValue();
// 								this.getView().byId("UploadSet").getModel().getData().documents.push(this.fileData);
// 								this.getView().byId("UploadSet").getModel().updateBindings(true);
// 								this.getView().getModel().getData().documents.push(this.fileData);
// 								this.getView().getModel().updateBindings(true);

// 								this.handleAddUserCancelPress();
// 								MessageToast.show("Document added succesfuly.");
// 							}
// 						}),
// 						new sap.m.Button({
// 							text: "Cancel",
// 							press: function () {
// 								//that.getInvoiceContractDocumentss(that._oComponent);
// 								that.dialog.close();
// 							}
// 						})
// 					],
// 					afterClose: function () {
// 						//that.dialog.destroy();
// 					}
// 				});
// 				var aDialog = this.dialog;
// 				that.dialog.open();
// 				if (sap.ui.Device.support.touch === false) {
// 					that.dialog.addStyleClass("sapUiSizeCompact");
// 				}
// 			}
//                     });

//             });