sap.ui.define([
		"sap/ui/core/mvc/Controller",
		"sap/m/MessageToast",
		"sap/m/MessageBox",
		"sap/ui/model/json/JSONModel",
		"sap/ui/model/Context",
		"sap/ui/model/FilterOperator",
		"sap/m/UploadCollectionParameter",
		"sap/ui/model/Sorter"
	],
	/**
	 * @param {typeof sap.ui.core.mvc.Controller} Controller
	 */
	function (Controller, MessageToast, MessageBox, JSONModel, Context, FilterOperator, UploadCollectionParameter, Sorter) {
		"use strict";

		return Controller.extend("MDG.Customer.controller.DetailQuotation", {

			onInit: function () {
				this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
				this.getOwnerComponent().getRouter().getRoute("DetailQuotation").attachPatternMatched(this.onObjectMatched, this);
				this.oDoc = {
					"fileName": "",
					"mediaType": "",
					"url": "",
					"keyword": "",
					"shortDescription": ""
				};
				if (!this.viewQuatotionDetails) {
					this.viewQuatotionDetails = new sap.ui.xmlfragment("MDG.Help.fragment.product", this);
					//	this.getView().addDependent(this.sortProductDetail);
				}
			},
			onSelectProduct: function () {
				var that = this;
				this.viewQuatotionDetails.open();
			},
			handleAddNewQuotationItemPress: function () {
				var that = this;
				this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				this.getOwnerComponent().getRouter().navTo("Collection", {
					AddCust: "draft"
				});
			},
			handleproductCancelPress: function () {
				this.viewQuatotionDetails.close();
			},

			onObjectMatched: function (oEvent) {
				var that = this;
				that.detailPath = oEvent.getParameter("arguments").sPath;
				var quatationData = that.getOwnerComponent().getModel("Quotation").getData()[this.detailPath];
				this.getView().getModel("appView").setProperty("/status", quatationData.status)
				var quatationModel1 = new JSONModel(quatationData);
				that.getView().setModel(quatationModel1);
			},
			___handleAddUserOkPress: function () {
				this.getOwnerComponent().getModel("customerInfo").getData().push(this.newcustomer);
				this.getOwnerComponent().getModel("customerInfo").updateBindings(true);
				this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
				this.getOwnerComponent().getRouter().navTo("Master");
				this.getView().getModel("appView").getData().lastId = this.getView().getModel("appView").getData().lastId + 1;
			},

			handleAddUserOkPress: function () {
				// this.fileData.keyword = this.byId("keyword").getValue();
				// this.fileData.shortDescription = this.byId("short").getValue();
				// this.newcustomer.documents.push(this.fileData);
				var that = this;
				var Err = 0;
				if (Err == 0) {
					if (that.isAdd == "Edit") {
						this.getOwnerComponent().getModel("customerInfo").oData[that.getView().getModel("appView").oData.indexNo] = this.newcustomer;
						this.getOwnerComponent().getModel("customerInfo").updateBindings(true);
						this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
						var tile = this.getView().getModel("appView").oData.tileIndex;
						this.getOwnerComponent().getRouter().navTo("Master", {
							id: tile
						});

					} else {
						this.getOwnerComponent().getModel("customerInfo").getData().push(this.newcustomer);
						this.getOwnerComponent().getModel("customerInfo").updateBindings(true);
						this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
						var tile = this.getView().getModel("appView").oData.tileIndex;
						this.getOwnerComponent().getRouter().navTo("Master", {
							id: tile
						});
					}

					this.getView().getModel("appView").getData().lastId = this.getView().getModel("appView").getData().lastId + 1;
				} else {
					this.getView().setBusy(false);

					var text = "Mandatory Fields are Required";
					MessageBox.error(text);

				}
			},

			handleWizardCancel: function () {
				this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
				this.getOwnerComponent().getRouter().navTo("Master", {
					id: tile
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
					type: 'Standard',
					// width: "50%",
					// height: "50%",
					resizable: true,
					contentWidth: "50%",
					contentHeight: "50%",
					state: 'None',
					icon: 'sap-icon://attachment',
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

			// onChange: function (oEvent) {

			// 	var file = oEvent.getParameter("files")[0];
			// 	this.fileData = {
			// 		fileName: file.name,
			// 		mediaType: file.type,
			// 		url: "",

			// 	};
			// },
			// onFileDeleted: function (oEvent) {
			// 	gGRAttachments.setBusy(true);
			// 	oPPCCommon.removeAllMsgs();
			// 	var that = this;
			// 	var URL;
			// 	var DocumentDeleteModel = this._oComponent.getModel("SSGW_MM");
			// 	var sLoginID = this.getCurrentUsers("MaterialDocDocuments", "delete");
			// 	// DocumentDeleteModel.setUseBatch(false);
			// 	DocumentDeleteModel.setHeaders({
			// 		"x-arteria-loginid": sLoginID
			// 	});
			// 	var token = this._oComponent.getModel("SSGW_MM").getSecurityToken();
			// 	DocumentDeleteModel.setHeaders({
			// 		"x-csrf-token": token
			// 	});
			// 	// SchemeGUID = gSchemeDetails.getModel("Schemes").getProperty("/SchemeGUID").toUpperCase();

			// 	SchemeGUID = this._oComponent.getModel("LocalViewSetting").getProperty("/GRDocGuid").toUpperCase();

			// 	var SchemeGuid = "guid'" + SchemeGUID + "'";
			// 	URL = "MaterialDocDocuments(MaterialDocGUID=" + SchemeGuid + ",MatDocDocumentGUID='" + escape(oEvent.getParameters().documentId) +
			// 		"',DocumentStore='" + DocumentStore + "')";
			// 	DocumentDeleteModel.remove("/" + URL, {
			// 		headers: {
			// 			"x-arteria-loginid": sLoginID
			// 		},
			// 		success: function () {
			// 			// gGRAttachments.setBusy(false);
			// 			oPPCCommon.removeDuplicateMsgsInMsgMgr();
			// 			var message = oPPCCommon.getMsgsFromMsgMgr();
			// 			vIndex++;
			// 			that.getContractDocumentss(that._oComponent, oi18n.getText(
			// 				"ContractAttachments.message.deleted"));

			// 		},
			// 		error: function (error) {
			// 			gGRAttachments.setBusy(false);
			// 			oPPCCommon.removeDuplicateMsgsInMsgMgr();
			// 			var message = oPPCCommon.getMsgsFromMsgMgr();
			// 			oPPCCommon.displayMsg_MsgBox(that.getView(), message, "error");
			// 			oDialog.close();
			// 		}
			// 	});
			// },
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

				SchemeGUID = SchemeGUID.split("-").join('');

				// var DocTypeID = this.getView().getModel("DocTypeDD").getData()[0].Key;
				var DocumentID = oPPCCommon.generateUUID().toUpperCase();
				DocumentID = DocumentID.split("-").join('');
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
			},
			onSelectionChange: function (evt) {
				var that = this;
				var selectedSegBtn = evt.getParameters().item.getKey();
				if (selectedSegBtn == "collection") {
					this.getView().byId("selectedItemPreview").setVisible(true);
					this.getView().byId("collectionSelect").setVisible(true);
					this.getView().byId("colelctionText").setVisible(true);
					this.getView().byId("productSelect").setVisible(false);
					this.getView().byId("productText").setVisible(false);
					this.getView().byId("selectedItemPreview1").setVisible(false);

				} else {
					this.getView().byId("selectedItemPreview").setVisible(false);
					this.getView().byId("collectionSelect").setVisible(false);
					this.getView().byId("colelctionText").setVisible(false);
					this.getView().byId("selectedItemPreview1").setVisible(true);
					this.getView().byId("productSelect").setVisible(true);
					this.getView().byId("productText").setVisible(true);
				}
			},

			handleItemSelectionChange: function (event) {
				var oSelectedItem = event.getSource().getSelectedItem().mProperties.key;
				var arr = ["Hudson", "Chester", "Hopper", "Topanga"];
				for (var b = 0; b < arr.length; b++) {
					if (oSelectedItem == arr[b])
						this.getView().byId(arr[b]).setVisible(true);
					else
						this.getView().byId(arr[b]).setVisible(false);
				}
			},
			handleproductSelectionChange: function (event) {
				var oSelectedItem = event.getSource().getSelectedItem().mProperties.key;
				var arr = ["Sofas", "SideTables", "DiningTables", "BarTables"];
				for (var b = 0; b < arr.length; b++) {
					if (oSelectedItem == arr[b])
						this.getView().byId(arr[b]).setVisible(true);
					else
						this.getView().byId(arr[b]).setVisible(false);
				}
			},
			handleImagePress: function () {
				if (!this.AddTask) {
					this.AddTask = sap.ui.xmlfragment("MDG.Help.fragment.AddTask", this);
					// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
					this.getView().addDependent(this.AddTask);
				}
				var productData = [];
				var getProductData = this.getOwnerComponent().getModel("customerInfo").getData()[this.path].products[0];
				var productModel = new sap.ui.model.json.JSONModel(getProductData);
				this.AddTask.setModel(productModel);
				// this.AddTask.getContent()[0].getContent()[3].setVisible(true);
				// this.AddTask.getContent()[0].getContent()[4].setVisible(false);
				// this.AddTask.getContent()[0].getContent()[3].setValue("New");
				// var taskModel = new sap.ui.model.json.JSONModel(this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath]
				// 	.tasktable);
				// this.AddTask.getContent()[0].getContent()[20].setModel(taskModel);
				// this.isEditTask = false;
				this.AddTask.open();
			},

			handleAddUserCancelPress: function () {
				// this.AddTask.getContent()[0].getContent()[14].setSelectedKey(null);
				// this.AddTask.getContent()[0].getContent()[16].setSelectedKey(null);
				// this.AddTask.getContent()[0].getContent()[12].setValue(null);
				// this.AddTask.getContent()[0].getContent()[10].setValue(null);
				// this.AddTask.getContent()[0].getContent()[8].setValue(null);
				// this.AddTask.getContent()[0].getContent()[3].setValue(null);
				// this.AddTask.getContent()[0].getContent()[1].setValue(null);
				// this.AddTask.getContent()[0].getContent()[6].setValue(null);

				this.AddTask.close();
			},
			handleAddTaskOkPress: function () {
				var fragmentData = [{
					prodName: this.AddTask.getContent()[0].getContent()[1].getText(),
					material: this.AddTask.getContent()[0].getContent()[3].getText(),
					loadCap: this.AddTask.getContent()[0].getContent()[5].getText(),
					modelNum: this.AddTask.getContent()[0].getContent()[7].getText(),
					dimention: this.AddTask.getContent()[0].getContent()[9].getText(),
					fabric: this.AddTask.getContent()[0].getContent()[11].getSelectedKey(),
					quantity: this.AddTask.getContent()[0].getContent()[13].getValue()
				}];
				var quatationModel = new JSONModel(fragmentData);
				this.getView().setModel(quatationModel, "quatData");
				this.AddTask.close();
			},
			addproduct: function () {
				var that = this;
				this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				this.getOwnerComponent().getRouter().navTo("Home", {
					test: "Edit"
				});
			},
			onSearch: function (evt) {
				var filter1 = new sap.ui.model.Filter("QID", "Contains", evt.getParameter("newValue"));
				var filter2 = new sap.ui.model.Filter("customerName", "Contains", evt.getParameter("newValue"));
				var filter3 = new sap.ui.model.Filter("product", "Contains", evt.getParameter("newValue"));

				this.getView().byId("QuotationTable").getBinding("items").filter(new sap.ui.model.Filter([filter1, filter2, filter3], false));
			},
			handleSortfragment: function () {
				if (!this.sortcustomerFragment) {
					this.sortcustomerFragment = sap.ui.xmlfragment("MDG.Help.fragment.sortQuotation", this);

				}

				this.sortcustomerFragment.open();
			},
			handleConfirm: function (oEvent) {
				var oSortItem = oEvent.getParameter("sortItem");
				var sColumnPath = "id";
				var bDescending = oEvent.getParameter("sortDescending");
				var aSorter = [];
				if (oSortItem) {
					sColumnPath = oSortItem.getKey();
				}
				aSorter.push(new Sorter(sColumnPath, bDescending));
				var oList = this.getView().byId("QuotationTable");
				var oBinding = oList.getBinding("items");
				oBinding.sort(aSorter);
			},
			onNavBack: function () {
				this.getView().getModel("appView").setProperty("/layout", "OneColumn");
				this.getOwnerComponent().getRouter().navTo("Help");
			},

			handleQuotationDetailPress: function () {
				var that = this;
				this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				this.getOwnerComponent().getRouter().navTo("AddNewCustomer", {
					AddCust: "Edit"
				});
			},
			onCloseDetailPress: function () {
				var that = this;
				this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				this.getOwnerComponent().getRouter().navTo("AddNewQuotation", {
					AddCust: "Edit"
				});
			},
			handleAddNewQuotationItemPress: function () {
				var that = this;
				this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
				this.getOwnerComponent().getRouter().navTo("Collection", {
					AddCust: "Draft",
					quotationId: this.detailPath
				});
			},
			handleDeleteQuotationPress: function (evt) {
				var that = this;
				this.deleteQuotation = evt.getSource();
				sap.m.MessageBox.confirm("Do you want to delete the Item?", function (oEvent) {
					if (oEvent == "OK") {
						that.deleteQuotation.getBindingContext().getModel().oData.Items.splice(that.deleteQuotation.getBindingContext().getPath().split(
							"/")[2], 1)
						that.deleteQuotation.getBindingContext().getModel().updateBindings(true);
					}
				});

			},
			downloadPDF: function (evt) {
				var that = this;
				that.getView().setBusy(true);
				window.setTimeout(function () {
					//that.getView().byId("signHboxId").setVisible(true);
					that.getView().byId("QuotationTable").setVisible(false);
					that.getView().byId("panelId").setVisible(true);
					var element = document.getElementById("container-Help---DetailQuotation--ObjectPageLayout");
					// html2pdf(element).save('External Vendor Request');
					var opt = {
						margin: 0.5,
						filename: 'Quotation',
						image: {
							type: 'jpeg',
							quality: 0.98
						},
						html2canvas: {
							scale: 2
						},
						jsPDF: {
							unit: 'in',
							format: 'letter',
							orientation: 'portrait'
						},
						pagebreak: {
							mode: ['css', 'legacy', 'avoid-all']
						}
					};
					// New Promise-based usage:
					// html2pdf().set(opt).from(element).save();

					// Old monolithic-style usage:
					html2pdf().from(element).toPdf().get('pdf').then(function (pdfObject) {
						html2pdf(element, opt);
						//that.getView().byId("signHboxId").setVisible(false);
						window.setTimeout(function () {
							that.getView().byId("QuotationTable").setVisible(true);
							that.getView().byId("panelId").setVisible(false);
							that.getView().setBusy(false)
						}, 1000);
					});
				}, 1500);
			},
			handleSubmitPress: function () {
				var that = this;
				sap.m.MessageBox.confirm("Do you want to submit the quotation?", function (oEvent) {
					if (oEvent == "OK") {
						that.getView().getModel("appView").setProperty("/status", "Submitted");
						that.getOwnerComponent().getModel("Quotation").getData()[that.detailPath].status = "Submitted";
						that.getOwnerComponent().getModel("Quotation").updateBindings(true);
						that.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
						that.getOwnerComponent().getRouter().navTo("AddNewQuotation", {
							AddCust: "Edit"
						});
					}
				});
			}

		});
	});