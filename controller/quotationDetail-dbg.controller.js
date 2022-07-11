sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Context",
	"MDG/Help/util/formatter",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, Context, formatter, MessageBox, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("MDG.Help.controller.quotationDetail", {
		formatter: formatter,
		onInit: function () {
			this.oBundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
			var that = this;
			if (!this.newQuotation) {
				this.newQuotation = sap.ui.xmlfragment("MDG.Help.fragment.createQuotation", this);
				this.getView().addDependent(this.newQuotation);
			}
			if (!this.quotationCart) {
				this.quotationCart = sap.ui.xmlfragment("MDG.Help.fragment.AddtoCart", this);
				this.getView().addDependent(this.quotationCart);
			}
			/*if (!this.itemSummary) {
				this.itemSummary = sap.ui.xmlfragment("MDG.Help.fragment.itemSummary", this);
				this.getView().addDependent(this.itemSummary);
			}*/
			this.getOwnerComponent().getRouter().getRoute("quotationDetail").attachPatternMatched(function (oEvent) {
				var usersModel = that.getOwnerComponent().getModel("customerInfo");
				var contactModel = that.getOwnerComponent().getModel("ContactInfo");
				that.path = oEvent.getParameter("arguments").id;
				that.quotationId = oEvent.getParameter("arguments").QuotationId;
				this.getView().getModel("appView").oData.RequestIdSelected = oEvent.getParameter("arguments").id;
				var oContext = new Context(usersModel, "/" + that.path);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()));
				that.getView().setModel(new sap.ui.model.json.JSONModel([]), "cartItemSummary");
				//that.handleQuotationProducts(oEvent.getParameter("arguments").QuotationId);
				that.handleQuotationDetail(oEvent.getParameter("arguments").QuotationId);
				//that.handleQuotationItemDetail(oEvent.getParameter("arguments").QuotationId);
				that.handleCustomerQuotation(oEvent.getParameter("arguments").QuotationId);
				that.handleQuotationTableDetails(oEvent.getParameter("arguments").id);
				that.newProjectId = oEvent.getParameter("arguments").id;
				that.handleCollectionName();
				//that.handleProjectData(oEvent.getParameter("arguments").customerId);
				that.handleitemSummary();
				that.handleCustomerModel();
				that.customerId = that.getOwnerComponent().getModel("customerProjectInfo").oData != undefined ? that.getOwnerComponent().getModel(
					"customerProjectInfo").oData[0].id : "";
			}, this);
			this.getOwnerComponent().getRouter().getRoute("quotationDetailAlone").attachPatternMatched(function (oEvent) {
				var usersModel = that.getOwnerComponent().getModel("customerInfo");
				var customerProjectInfo = that.getOwnerComponent().getModel("customerProjectInfo");
				that.path = oEvent.getParameter("arguments").id;
				that.quotationId = oEvent.getParameter("arguments").QuotationId;
				this.getView().getModel("appView").oData.RequestIdSelected = oEvent.getParameter("arguments").id;
				var oContext = new Context(usersModel, "/" + that.path);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()));
				that.getView().setModel(new sap.ui.model.json.JSONModel([]), "cartItemSummary");
				//that.handleQuotationProducts(oEvent.getParameter("arguments").QuotationId);
				that.handleQuotationDetail(oEvent.getParameter("arguments").QuotationId);
				//that.handleQuotationItemDetail(oEvent.getParameter("arguments").QuotationId);
				that.handleCustomerQuotation(oEvent.getParameter("arguments").QuotationId);
				that.handleQuotationTableDetails(oEvent.getParameter("arguments").projectId);
				that.newProjectId = oEvent.getParameter("arguments").projectId;
				that.handleCollectionName();
				//that.handleProjectData(oEvent.getParameter("arguments").customerId);
				that.handleitemSummary();
				that.handleCustomerModel();
				that.customerId = oEvent.getParameter("arguments").id;
			}, this);
			this.getOwnerComponent().getRouter().getRoute("quotationDetailProject").attachPatternMatched(function (oEvent) {
				var usersModel = that.getOwnerComponent().getModel("customerInfo");
				that.path = oEvent.getParameter("arguments").id;
				that.quotationId = oEvent.getParameter("arguments").QuotationId;
				this.getView().getModel("appView").oData.RequestIdSelected = oEvent.getParameter("arguments").id;
				var oContext = new Context(usersModel, "/" + that.path);
				that.getView().setModel(new sap.ui.model.json.JSONModel(oContext.getObject()));
				that.getView().setModel(new sap.ui.model.json.JSONModel([]), "cartItemSummary");
				//that.handleQuotationProducts(oEvent.getParameter("arguments").QuotationId);
				that.handleQuotationDetail(oEvent.getParameter("arguments").QuotationId);
				//that.handleQuotationItemDetail(oEvent.getParameter("arguments").QuotationId);
				that.handleCustomerQuotation(oEvent.getParameter("arguments").QuotationId);
				that.handleQuotationTableDetails(oEvent.getParameter("arguments").id);
				that.newProjectId = oEvent.getParameter("arguments").id;
				that.handleCollectionName();
				//that.handleProjectData(oEvent.getParameter("arguments").customerId);
				that.handleitemSummary();
				that.handleCustomerModel();
				that.customerId = that.getOwnerComponent().getModel("customerProjectInfo").oData != undefined ? that.getOwnerComponent().getModel(
					"customerProjectInfo").oData[0].id : "";
			}, this);
			//that.maxId = that.getOwnerComponent().getModel("customerProjectInfo").getData() != undefined ? 100 + that.getOwnerComponent().getModel("customerProjectInfo").getData().length : "";
		},
		handleQuotationTableDetails: function (projectId) {
			var that = this;
			//projectId = that.getView().getModel("appView").getProperty("/quotationId");
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-projects?populate=*&filters[id][$eq]=" + projectId,
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
						var projectData = res.data;
					} else {
						var quotationContactData = [];
						var quotationData = [];
					}
					//var quotationData = res.data;
					var quotationArr = [],
						contactArr = [],
						projectArr = [];
					for (var m = 0; m < quotationData.length; m++) {
						if (that.quotationId == quotationData[m].id) {
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
						//quotationArr.push(quotationData[m].attributes);
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(quotationArr), "QuotationDataModel");
					that.getView().getModel("QuotationDataModel").updateBindings(true);
				}

			});
		},
		handleCustomerModel: function () {
			var that = this;
			var quotationContactData = that.getOwnerComponent().getModel("DetailContactModel").oData;
			var contactArr = [];
			for (var n = 0; n < quotationContactData.length; n++) {
				// if (that.customerId == quotationContactData[n].id) {
				contactArr.push({
					id: quotationContactData[n].id,
					dCustomerContact_Name: quotationContactData[n].DCustomerContact_type.dCustomerContact_Name,
					dCustomer_ContactEmail: quotationContactData[n].DCustomerContact_type.dCustomer_ContactEmail,
					dCustomer_Conact_DirectPhone: quotationContactData[n].DCustomerContact_type.dCustomer_Conact_DirectPhone,
					dCustomer_ContactMobile: quotationContactData[n].DCustomerContact_type.dCustomer_ContactMobile,
					createdAt: quotationContactData[n].DCustomerContact_type.createdAt,
					updatedAt: quotationContactData[n].DCustomerContact_type.updatedAt,
					publishedAt: quotationContactData[n].DCustomerContact_type.publishedAt
				});
				// }
			}
			that.getView().setModel(new sap.ui.model.json.JSONModel(contactArr), "QuotaionContactsModel");
			that.getView().getModel("QuotaionContactsModel").updateBindings(true);
		},

		handleCustomerModel_old: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + that.customerId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					if (res.data.length > 0) {
						var quotationContactData = res.data[0].attributes.d_customer_contacts.data;
					} else {
						quotationContactData = [];
					}
					var contactArr = [];
					for (var n = 0; n < quotationContactData.length; n++) {
						if (that.customerId == quotationContactData[n].id) {
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
					}
					that.getView().setModel(new sap.ui.model.json.JSONModel(contactArr), "QuotaionContactsModel");
					that.getView().getModel("QuotaionContactsModel").updateBindings(true);
				}
			});
		},
		/*	handleProjectData: function (customerId) {
				var that = this;
				$.ajax({
					url: "/DanaoStrapi/api/d-customers?populate=*&filters[id][$eq]=" + customerId,
					type: 'GET',
					"headers": {
						"content-type": "application/json"
					},
					dataType: 'json', // added data type
					success: function (res) {
						var quotationContactData = res.data;
						var contactArr = [];
						for (var n = 0; n < quotationContactData.length; n++) {
							if (customerId == quotationContactData[n].id) {
								contactArr.push({
									id: quotationContactData[n].id,
									dCustomerName: quotationContactData[n].dCustomerName,
									dWebsite: quotationContactData[n].dWebsite,
									dOfficePhone: quotationContactData[n].dOfficePhone,
									dBillingAddress: quotationContactData[n].dBillingAddress,
									createdAt: quotationContactData[n].createdAt,
									updatedAt: quotationContactData[n].updatedAt,
									publishedAt: quotationContactData[n].publishedAt
								});
							}
						}
						that.getView().setModel(new sap.ui.model.json.JSONModel(contactArr), "projectInfo");
						that.getView().getModel("projectInfo").updateBindings(true);
					}
				});
			},*/
		handleDeleteQuotationPress: function (quotationId) {
			quotationId = this.getView().getModel("appView").getProperty("/quotationId");
			MessageBox.confirm("Do you want to delete the Quotation?", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					if (oAction === "YES") {
						$.ajax({
							url: "/DanaoStrapi/api/d-customer-quotation-details/" + quotationId,
							type: "DELETE",
							"headers": {
								"content-type": "application/json"
							},
							dataType: "json",
							success: function (res) {
								sap.m.MessageToast.show("Quotation has been deleted successfully!", {
									closeOnBrowserNavigation: false
								});
							}
						});
					}
				}
			});
		},
		/*		handleQuotationDetail: function (quotationId) {
					var that = this;
					quotationId = this.getView().getModel("appView").getProperty("/quotationId");
					$.ajax({
						url: "/DanaoStrapi/api/d-customer-quotations?populate=*&filters[id][$eq]=" + quotationId,
						type: 'GET',
						"headers": {
							"content-type": "application/json"
						},
						dataType: 'json',
						success: function (res) {
							var quotationData = res.data[0].attributes.d_customer_quotation_details.data;
							var quotationArr = [];
							console.log(quotationArr);
							for (var m = 0; m < quotationData.length; m++) {

								// if (quotationData[m].id == quotationId) {
								// 	that.selectedQuotation = quotationData[m];
								// }
								quotationArr.push({
									id: quotationData[m].id,
									dProduct_SKU: quotationData[m].attributes.dProduct_SKU,
									dProduct_Quantity: quotationData[m].attributes.dProduct_Quantity,
									dProduct_Total_Price: quotationData[m].attributes.dProduct_Total_Price,
									createdAt: quotationData[m].attributes.createdAt,
									updatedAt: quotationData[m].attributes.updatedAt,
									publishedAt: quotationData[m].attributes.publishedAt,
									d_frames: quotationData[m].attributes.d_frames,
									d_frame_straps: quotationData[m].attributes.d_frame_straps,
									d_fabric_grades: quotationData[m].attributes.d_fabric_grades,
									d_Quotation_ProdNotes: quotationData[m].attributes.d_Quotation_ProdNotes,
									d_ropes: quotationData[m].attributes.d_ropes
								});
							}
							//that.handleQuotationProducts(quotationId, that.selectedQuotation);
							that.handleQuotationProducts(quotationId, quotationArr);
							//that.getView().setModel(new sap.ui.model.json.JSONModel(quotationArr), "QuotationsModel");
						}

					});
				},
				handleQuotationProducts: function (quotationId, quotationArr) {
					var that = this;
					that.quotationArr = quotationArr;
					$.ajax({
						url: "/DanaoStrapi/api/d-products?populate=*&filters[id][$eq]=" + quotationId,
						type: 'GET',
						"headers": {
							"content-type": "application/json"
						},
						dataType: 'json',
						success: function (res) {
							for (var m = 0; m < that.quotationArr.length; m++) {
								for (var i = 0; i < res.data.length; i++) {
									if (res.data[i].id == that.quotationArr[m].id) {
										if (res.data[i].attributes.DProduct_Name) {
											that.quotationArr[m]["prodName"] = res.data[i].attributes.DProduct_Name;
											that.quotationArr[m]["imageUrl"] = res.data[i].attributes.DProduct_Image.data[0].attributes.name;
										}
										// else{
										// 	that.quotationArr[m]["imageUrl"] = window.location.origin + "/DanaoStrapi" + res.data[i].attributes.DProduct_Image.data[0]
										// 		.attributes.formats.thumbnail.url;
										// 	that.quotationArr[m]["thumbNail"] = res.data[i].attributes.DFabric_Image.data[0].attributes.url;
										break;
											// if (res.data[i].attributes.DProduct_Name)
											// 	that.quotationArr[m]["prodName"] = res.data[i].attributes.DProduct_Name;
											// that.quotationArr[m]["imageUrl"] = res.data[i].attributes.DProduct_Image.data[0].attributes.name;
									}
								}
							}
							that.getOwnerComponent().getModel("QuotationProductModel").oData = that.quotationArr;
							that.getOwnerComponent().getModel("QuotationProductModel").updateBindings(true);
						}
					});
				},*/
		onCloseDetailPress: function () {
			if (window.location.hash.split("/")[1] == "quotationDetailAlone") {
				this.getOwnerComponent().getRouter().navTo("MasterQuotaion", {
					id: "test",
					module: "module"
				});
			} else if (window.location.hash.split("/")[1] == "quotationDetailProject") {
				this.getOwnerComponent().getRouter().navTo("projectDetail", {
					id: this.newProjectId,
					newPro: "0",
					projectId: this.newProjectId
				});
			} else {
				//this.getView().getModel("appView").setProperty("/newCustomerId", this.newCustomerId);
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("Detail", {
					id: this.customerId,
					moduleIndex: "0",
					newprojectId: this.newProjectId
				});
			}
		},
		/*handleQuotationItemDetail: function (QuotationId) {
			var that = this;
			var quotationId = this.getView().getModel("appView").getProperty("/quotationId");
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-quotations?populate=*&filters[id][$eq]=" + quotationId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					var quotationData = res.data;
					var quotationArr = [];
					for (var i = 0; i < quotationData.length; i++) {
						quotationArr.push({
							id: quotationData[i].id,
							dQuotation_Item_Quantity: quotationData[i].attributes.dQuotation_Item_Quantity,
							dQuotation_Item_Price: quotationData[i].attributes.dQuotation_Item_Price,
							createdAt: quotationData[i].attributes.createdAt,
							updatedAt: quotationData[i].attributes.updatedAt,
							publishedAt: quotationData[i].attributes.publishedAt,
							DQuotation_Status: quotationData[i].attributes.DQuotation_Status
						});
					}
					console.log(quotationArr);
					that.getView().setModel(new sap.ui.model.json.JSONModel(quotationArr), "QuotationDataModel");
					that.getView().getModel("QuotationDataModel").updateBindings(true);
				}
			});
		},*/
		onCloseQuotation: function () {
			this.newQuotation.close();
		},
		onPressAdd: function () {
			this.handleQuotationItemsDetail();
			//this.handleitemSummary();
			this.newQuotation.getContent()[0].getContentLeft()[1].setSelectedKey(null);
			this.newQuotation.getContent()[0].getContentMiddle()[1].setSelectedKey(null);
			this.newQuotation.getBeginButton().setVisible(false);
			this.newQuotation.open();
		},
		/*	onPressAddtoCart: function (evt) {
				// this.quotationId = this.getView().getModel("appView").getProperty("/quotationDetailId", evt.getSource().getBindingContext(
				// 	"cartItemSummary").getObject().id);
				//that.handleitemSummary(selectedId);
				//var selectedId = evt.getSource().getBindingContext("cartItemSummary").getObject().dProduct_UnitPrice;
				//var selectedId = evt.getSource().getBindingContext("cartItemSummary").getObject().itemDetails.DProduct_Image.data[0].id;
				// var selectedId = evt.getSource().getBindingContext("cartItemSummary").getObject().fabricType.id;
				this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("quotationFragmentView", {
					selectedId: selectedId
				});
			},*/
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
					//console.log(collectionArr);
				}
			});
		},
		handleSelectCollection: function (evt) {
			var that = this;
			that.collectionData = evt.getSource().getSelectedItem().getBindingContext("collectionModel").getObject().d_products.data;
			var selectedData = evt.getSource().getSelectedItem().getBindingContext("collectionModel").getObject().d_product_types.data;
			var categoryArr = [];
			for (var m = 0; m < selectedData.length; m++) {
				categoryArr.push({
					id: selectedData[m].id,
					DProduct_Type: selectedData[m].attributes.DProduct_Type
				});
			}
			that.getView().setModel(new sap.ui.model.json.JSONModel(categoryArr), "categoryModel");

		},
		handleSelectCategory: function (evt) {
			var that = this;
			that.categoryData = evt.getSource().getSelectedItem().getBindingContext("categoryModel").getObject().id;
		},
		onPressGo: function () {
			var that = this;
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
								categorySelectedProduct.push(productData[b]);
							}
						}
					}
					for (var l = 0; l < productData.length; l++) {
						if (that.categoryData == productData[l].attributes.d_product_type.data.id) {
							SelectedProduct.push(productData[l]);
						}
					}
					//}
					var arr1 = categorySelectedProduct;
					var arr2 = SelectedProduct;
					res.data = arr1.concat(arr2);
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
								var selectedId = evt.getSource().getParent().getParent().getContent()[0].getItems()[0].getContent()[1].getText().split(
									" : ")[1];
								that.handleitemSummary(selectedId);
								that.mode = "CREATE";
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(-
									1);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[1].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[3].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[5].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[7].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(0);

							},
							icon: "sap-icon://cart-3",
							type: "Emphasized"
						});
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
								var selectedId = evt.getSource().getParent().getParent().getContent()[0].getItems()[0].getContent()[1].getText().split(
									" : ")[1];
								that.handleitemSummary(selectedId);
								that.mode = "CREATE";
								//that.handleAddCartPress(selectedId);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(-
									1);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[1].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[3].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[5].setVisible(false);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[7].setVisible(false);
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
		// onPressAddtoCart: function(){
		// 	this.quotationCart.open();
		// },
		onCloseCart: function () {
			this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(-
				1);
			//that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[19].setVisible(false);
			this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[1].setVisible(
				false);
			this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[3].setVisible(
				false);
			this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[5].setVisible(
				false);
			this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[7].setVisible(
				false);
			this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(0);
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
					var productsArr = [],
						graderArr = [];
					for (var m = 0; m < products.length; m++) {
						productsArr.push(products[m].attributes);
					}
					if (productsArr[0].d_finish.data == null) {
						sap.m.MessageBox.error("Selected Product doesn't have the finishing Details to show");
					} else {
						that.selectedFinishId = productsArr[0].d_finish.data.id;
						that.handleitemfinishes(that.selectedFinishId);
					}
					that.getOwnerComponent().getModel("quotationItemsDetial").oData = productsArr;
					that.getOwnerComponent().getModel("quotationItemsDetial").updateBindings(true);
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
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[15].setVisible(false);
					} else {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[4].setText(
							"Selection Display(Accent)");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[15].setVisible(true);
						that.selectedAccentId = allFinishesArr[0].d_accents.data[0].id;
						that.handleItemAccent(that.selectedAccentId);
					}
					if (allFinishesArr[0].d_frame_straps.data.length == 0) {
						that.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[2].setText("");
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[11].setVisible(false);
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
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[23].setVisible(false);
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
						that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[19].setVisible(false);
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
					that.getView().setModel(new sap.ui.model.json.JSONModel(productsArr), "quotationItemFinishes");
					that.getView().getModel("quotationItemFinishes").updateBindings(true);
					// that.getOwnerComponent().getModel("quotationItemFinishes").oData = productsArr;
					// that.getOwnerComponent().getModel("quotationItemFinishes").updateBindings(true);
					// that.getView().getModel("cartItemSummary").oData = [];
					// that.getView().getModel("cartItemSummary").updateBindings(true);
					//this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getSelectedButton()(-1);
					//that.mode = "CREATE";
					// that.mode = "EDIT";
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
					// that.mode = "CREATE";
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
				dataType: 'json', // added data type
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
									that.gradeArr[b]["imageUrl"] = window.location.origin + "/DanaoStrapi" + res.data[r].attributes.DFabric_Image.data[0]
									.attributes
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
					/*	var cartGrade = that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getButtons();
						var ProductGrade = evt.getSource().getBindingContext("cartItemSummary").getObject().grade;
						//window.setTimeout(function () {
						for (var i = 0; i < cartGrade.length; i++) {
							if (ProductGrade == cartGrade[i].getBindingContext("quotationItemFinishes").getObject().DFabric_Grade) {
								var selectedId = cartGrade[i].getBindingContext("quotationItemFinishes").getObject().id;
								//that.handleGradeDisplay(selectedId);
								that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(i);
								break;
							}
						}*/
				}
			});
		},
		handleGradeButtonSelect: function (evt) {
			var that = this;
			that.selectedData = evt.getSource().getSelectedButton().getBindingContext("quotationItemFinishes").getObject().id;
			//that.selectedGrade = selectedData;
			if (that.selectedData === 1) {
				//this.selectedGradeId = productsArr[0].d_fabric_grades.data.id;
				that.handleGradeDisplay(that.selectedData);
			} else if (that.selectedData === 2) {
				that.handleGradeDisplay(that.selectedData);
			} else if (that.selectedData === 3) {
				that.handleGradeDisplay(that.selectedData);
			} else {}
		},
		onPressAddtoCart: function (evt) {
			var that = this;
			// that.getView().getModel("cartItemSummary").oData[that.selectedEditPath] = (that.selectedEditPath);
			// that.getView().getModel("cartItemSummary").updateBindings(true);
			that.selectedEditPath = evt.getSource().getBindingContext("cartItemSummary").sPath.split(
				"/")[1];
			that.selectedProductPrice = evt.getSource().getModel("cartItemSummary").oData[evt.getSource().getBindingContext("cartItemSummary").sPath
				.split("/")[1]].dProduct_Total_Price;
			that.selectedQuantity = evt.getSource().getModel("cartItemSummary").oData[evt.getSource().getBindingContext(
				"cartItemSummary").sPath.split(
				"/")[1]].Qty;
			var ProductGrade = evt.getSource().getBindingContext("cartItemSummary").getObject().grade;
			var Thumbnail = evt.getSource().getBindingContext("cartItemSummary").getObject().dProduct_Thumbnail;
			var prodName = evt.getSource().getBindingContext("cartItemSummary").getObject().dProduct_Name;
			//that.handleitemSummary(that.productNumber);
			var cartGrade = that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getButtons();
			//window.setTimeout(function () {
			for (var i = 0; i < cartGrade.length; i++) {
				if (ProductGrade == cartGrade[i].getBindingContext("quotationItemFinishes").getObject().DFabric_Grade) {
					var selectedId = cartGrade[i].getBindingContext("quotationItemFinishes").getObject().id;
					that.handleGradeDisplay(selectedId);
					that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(i);
					//break;
				}
			}
			//	}, 1500);
			var Quantity = evt.getSource().getBindingContext("cartItemSummary").getObject().Qty;
			if (Quantity) {
				that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(Quantity);
			} else {
				that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(0);
			}
			if (Thumbnail) {
				that.quotationCart.getContent()[0].getContent()[0].getContent()[1].getContent()[1].getPages()[0].getItems()[0].setSrc(Thumbnail);
			} else {
				that.quotationCart.getContent()[0].getContent()[0].getContent()[1].getContent()[1].getPages()[0].getItems()[0].getSrc();
			}
			that.quotationCart.getContent()[0].getParent().setTitle(prodName);
			//that.quotationCart.getContent()[0].getContent()[0].getContent()[1].getContent()[1].getPages()[0].getItems()[0].setSrc(Thumbnail);
			that.quotationCart.open();
			that.mode = "EDIT";
		},
		onPressDeleteItem: function (evt) {
			var that = this;
			that.selectedPath = evt.getSource().getBindingContext("cartItemSummary").sPath.split("/")[1];
			MessageBox.confirm("Do you want to delete the Item?", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					if (oAction === "YES") {
						that.getView().getModel("cartItemSummary").oData.splice(that.selectedPath, 1);
						that.getView().getModel("cartItemSummary").updateBindings(true);
						sap.m.MessageToast.show("Quotation Deleted sucessfully", {
							closeOnBrowserNavigation: false
						});
						$.ajax({
							url: "/DanaoStrapi/api/d-customer-quotations?populate=*&filters[id][$eq]=" + that.quotationId,
							type: "GET",
							"headers": {
								"content-type": "application/json"
							},
							dataType: "json",
							success: function (res) {
								var quotationArr = [];
								var quotation = res.data[0].attributes.d_customer_quotation_details.data;
								for (var i = 0; i < quotation.length; i++)
									quotationArr.push(quotation[i]);
								var quotationId = quotationArr[that.selectedPath].id;
								$.ajax({
									url: "/DanaoStrapi/api/d-customer-quotation-details/" + quotationId,
									type: "DELETE",
									headers: {
										"content-type": "application/json"
									},
									dataType: "json",
									success: function (res) {
										that.handleQuotationDetail(that.quotationId);
										sap.m.MessageToast.show("Quotation Deleted sucessfully", {
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
		/*	handleUpdateItems: function (obj, customerId, ContactId) {
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
			},*/
		handleAddCartPress: function (evt) {
			var cartGrade = this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].getButtons();
			var totalQuantity = this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue();
			var totalPrice = this.getView().getModel("appView").getProperty("/totalAmount");
			for (var i = 0; i < cartGrade.length; i++) {
				if (cartGrade[i].getBindingContext("quotationItemFinishes").getObject().id === 1) {
					var unitPrice = Math.round((this.customerTypeArr / 100) * (this.getView().getModel("quotationItemsDetial").oData[0].DProduct_Price_Grade_A));
				} else if (cartGrade[i].getBindingContext("quotationItemFinishes").getObject().id === 2) {
					unitPrice = Math.round((this.customerTypeArr / 100) * (this.getView().getModel("quotationItemsDetial").oData[0].DProduct_Price_GradeB));
				} else {}
			}
			totalPrice = unitPrice * totalQuantity;
			if (this.mode == "EDIT") {
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
					dProduct_UnitPrice: unitPrice != undefined ? Math.round((this.customerTypeArr / 100) * unitPrice) : "",
					dProduct_Total_Price: totalPrice != undefined ? Math.round((this.customerTypeArr / 100) * totalPrice) : "",
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
					fabricId: this.selectedFabric != undefined ? this.selectedFabric.id : "",
					dProduct_Name: this.getView().getModel("quotationItemsDetial").oData[0] != undefined ? this.getView().getModel(
						"quotationItemsDetial").oData[0].DProduct_Name : "",
					dProduct_Thumbnail: this.getView().getModel("quotationItemsDetial").oData[0] != undefined ? this.getView().getModel(
						"quotationItemsDetial").oData[0].DProduct_Image.data[0].attributes.name : ""
				};
				var totalAmt = this.getView().getModel("appView").getProperty("/totalAmount");
				totalAmt += this.cartObjUpdated.dProduct_Total_Price - this.selectedProductPrice;
				var quantity = this.getView().getModel("appView").getProperty("/qty");
				quantity += this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue() - this
					.selectedQuantity;
				this.getView().getModel("appView").setProperty("/totalAmount", totalAmt);
				this.getView().getModel("appView").setProperty("/qty", quantity);
				if (this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].getValue() > 0) {
					// this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[24].setSelectedIndex(-
					// 	1);
					// //that.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[19].setVisible(false);
					// this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[1].setVisible(
					// 	false);
					// this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[3].setVisible(
					// 	false);
					// this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[5].setVisible(
					// 	false);
					// this.quotationCart.getContent()[1].getContent()[0].getContent()[1].getContent()[0].getContent()[7].setVisible(
					// 	false);
					// this.quotationCart.getContent()[1].getContent()[0].getContent()[0].getContent()[0].getContent()[8].setValue(0);
					//this.handleUpdateQuotationItemAfterPost(this.cartObjUpdated, this.quotationId);
					this.getView().getModel("cartItemSummary").oData[this.selectedEditPath] = this.cartObjUpdated;
					this.getView().getModel("cartItemSummary").updateBindings(true);
					this.quotationCart.close();
				} else
					sap.m.MessageBox.error("Please enter the quantity");
			} else if (this.mode == "CREATE") {
				//this.handleitemSummary(that.productNumber);
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
					fabricId: this.selectedFabric != undefined ? this.selectedFabric.id : "",
					dProduct_Name: this.getView().getModel("quotationItemsDetial").oData != undefined ? this.getView().getModel(
						"quotationItemsDetial").oData[0].DProduct_Name : "",
					dProduct_Thumbnail: this.getView().getModel("quotationItemsDetial").oData != undefined ? this.getView().getModel(
						"quotationItemsDetial").oData[0].DProduct_Image.data[0].attributes.name : ""

				};
				var totalAmount = this.getView().getModel("appView").getProperty("/totalAmount");
				totalAmount += Math.round((this.customerTypeArr / 100) * cartObj.dProduct_Total_Price);
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
			}
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
						//that.cartItemsummary = cartItemSummary;
						var quotationDetailId = res.data.id;
						that.quotationDetailArr.push(res.data.id);
						if (cartItemSummary.length == that.servicecall)
						//that.handlePushQuotationItemAfterPost();
						that.handleUpdateQuotationItemAfterPost(obj, that.quotationId, quotationDetailId);
						sap.m.MessageBox.success("Quotation has been created successfully");
						// that.getView().getModel("cartItemSummary").oData = that.cartItemsummary;
						// that.getView().getModel("cartItemSummary").updateBindings(true);
					},
					error: function (res) {
						var x = res;
					}
				});
			}

		},
		handleUpdateQuotationItemAfterPost: function (obj, quotationId, quotationDetailId) {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-quotations?populate=*&filters[id][$eq]=" + that.quotationId,
				type: "GET",
				"headers": {
					"content-type": "application/json"
				},
				dataType: "json",
				success: function (res) {
					var quotationData = res.data[0].attributes.d_customer_quotation_details.data;
					var quotationArr = [];
					for (var m = 0; m < quotationData.length; m++) {
						quotationArr.push(quotationData[m].id);
					}
					quotationArr.push(quotationDetailId);
					obj = {
						"data": {
							"d_customer_quotation_details": quotationArr
						}
					};
					/*obj = {
						"data": {
							"d_customer_quotation_details": that.quotationDetailArr
							}
						};*/
					$.ajax({
						url: "/DanaoStrapi/api/d-customer-quotations/" + that.quotationId,
						type: "PUT",
						"headers": {
							"content-type": "application/json"
						},
						data: JSON.stringify(obj),
						dataType: "json",
						success: function (res) {
							//that.getView().getModel("cartItemSummary").oData[that.selectedEditPath] = that.cartItemsummary;
							that.handleQuotationDetail(that.quotationId);
							//that.getView().getModel("cartItemSummary").oData = that.cartItemsummary;
							// that.getView().getModel("cartItemSummary").updateBindings(true);
						},
						error: function (err) {
							MessageBox.error(err.responseJSON.error.message);
						}
					});
				}
			});
		},
		/*	handlePushQuotationItemAfterPost: function () {
				var that = this;
				//var customerId = this.getView().getModel("appView").setProperty("/newCustomerId");
				var projectId = that.newProjectId;
				var postObj = {
					"data": {
						"dQuotation_Item_Price": that.getView().getModel("appView").getProperty("/totalAmount") + "",
						"dQuotation_Item_Quantity": that.getView().getModel("appView").getProperty("/qty") + "",
						"DQuotation_Status": "Draft",
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
						that.handleUpdateQuotationItemAfterPost(postObj, that.quotationId, objId);
						sap.m.MessageBox.success("Quotation has been created successfully");
						that.getView().getModel("appView").setProperty("/totalAmount", 0);
						that.getView().getModel("appView").setProperty("/qty", 0);
						that.getView().getModel("cartItemSummary").oData = that.cartItemsummary;
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
					url: "/DanaoStrapi/api/d-customer-quotations?populate=*&filters[id][$eq]=" + objId,
					//url: "/DanaoStrapi/api/d-customer-quotation-details?populate=*&filters[id][$eq]=" + that.quotationDetailId,
					type: "GET",
					"headers": {
						"content-type": "application/json"
					},
					dataType: "json",
					success: function (res) {
						var quotationData = res.data[0].attributes.d_customer_quotation_details.data;
						var quotationsData = res.data;
						//var Id = res.data[0].id;
						var quotationArr = [],
							quotationsArr = [];
						for (var m = 0; m < quotationData.length; m++) {
							quotationArr.push(quotationData[m].id);
						}
						for (var m = 0; m < quotationsData.length; m++) {
							quotationsArr.push(quotationsData[m].id);
						}
						//quotationArr.push(objId);
						postObj = {
							"data": {
								"id": quotationsArr,
								"d_customer_quotation_details": [quotationArr]
							}
						};
						$.ajax({
							url: "/DanaoStrapi/api/d-customer-quotations/" + objId,
							//url: "/DanaoStrapi/api/d-customer-quotations/" + that.quotationId,
							//url: "/DanaoStrapi/api/d-customer-quotation-details/" + that.quotationDetailId,
							type: "PUT",
							"headers": {
								"content-type": "application/json"
							},
							data: JSON.stringify(postObj),
							dataType: "json",
							success: function (res) {
								//that.getView().getModel("cartItemSummary").oData[that.selectedEditPath] = that.cartItemsummary;
								that.getView().getModel("cartItemSummary").oData = that.cartItemsummary;
								that.getView().getModel("cartItemSummary").updateBindings(true);
							},
							error: function (err) {
								MessageBox.error(err.responseJSON.error.message);
							}
						});
					}
				});
			},*/
		handleQuotationDetail: function (objId) {
			var that = this;
			//quotationId = this.getView().getModel("appView").getProperty("/quotationId");
			$.ajax({
				url: "/DanaoStrapi/api/d-products?populate=*",
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					that.products = res.data;
					var productsArr = [];
					// console.log(productsArr);
					that.handleQuotationProducts(objId);
				}
			});
		},
		handleQuotationProducts: function (objId) {
			var that = this;
			//that.newMode = "EDIT";
			$.ajax({
				url: "/DanaoStrapi/api/d-customer-quotations?populate=*&filters[id][$eq]=" + objId,
				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json',
				success: function (res) {
					/*that.productsArr = quotationArr;
					console.log(quotationArr);*/
					var customerQuotationData = res.data[0].attributes.d_customer_quotation_details.data;
					//var customerQuotationData = res.data;
					var quotationFormattedArr = [];
					for (var m = 0; m < customerQuotationData.length; m++) {
						/*	if (customerQuotationData[m].attributes.d_ropes == that.selectedProduct.id) {
							customerQuotationData[m].attributes["productDetails"] = that.selectedProduct;
							that.selectedQuotationDetails = customerQuotationData[m];
							break;
						}*/
						for (var n = 0; n < that.products.length; n++) {
							if (that.products[n].attributes.DProduct_Name == customerQuotationData[m].attributes.dProduct_Name) {
								customerQuotationData[m].attributes["itemDetails"] = that.products[n];
								that.productNumber = that.products[n].attributes.DProduct_Number;
								quotationFormattedArr.push({
									id: customerQuotationData[m].id,
									createdAt: customerQuotationData[m].attributes.createdAt,
									dFabric_ID: customerQuotationData[m].attributes.dFabric_ID,
									Qty: customerQuotationData[m].attributes.dProduct_Quantity + "",
									SKU: customerQuotationData[m].attributes.dProduct_SKU,
									dProduct_UnitPrice: customerQuotationData[m].attributes.dProduct_UnitPrice,
									dProduct_Total_Price: customerQuotationData[m].attributes.dProduct_Total_Price,
									d_Quotation_ProdNotes: customerQuotationData[m].attributes.d_Quotation_ProdNotes,
									accent: customerQuotationData[m].attributes.d_accents,
									d_batylines: customerQuotationData[m].attributes.d_batylines,
									grade: customerQuotationData[m].attributes.d_fabric_grades,
									straps: customerQuotationData[m].attributes.d_frame_straps,
									d_frame_tops: customerQuotationData[m].attributes.d_frame_tops,
									frame: customerQuotationData[m].attributes.d_frames,
									d_ropes: customerQuotationData[m].attributes.d_ropes,
									d_weaves: customerQuotationData[m].attributes.d_weaves,
									dProduct_Name: customerQuotationData[m].attributes.dProduct_Name,
									dProduct_Thumbnail: customerQuotationData[m].attributes.dProduct_Thumbnail,
									// itemDetails: customerQuotationData[m].itemDetails
								});
							}
						}
					}
					that.getView().getModel("cartItemSummary").oData = quotationFormattedArr;
					that.getView().getModel("cartItemSummary").updateBindings(
						true);
					// that.getOwnerComponent().getModel("QuotationProductModel").oData = quotationFormattedArr;
					// that.getOwnerComponent().getModel("QuotationProductModel").updateBindings(true);
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
			sap.m.MessageToast.show(evt.getSource().getBindingContext("frameStrapModel").getObject().DFrame_Straps_Name + " is selected");
			this.selectedStrap = evt.getSource().getBindingContext("frameStrapModel").getObject().url;
		},
		handleAccentSelection: function (evt) {
			sap.m.MessageToast.show(evt.getSource().getBindingContext("framesAccentModel").getObject().DAccent_Name + " is selected");
			this.selectedAccent = evt.getSource().getBindingContext("framesAccentModel").getObject().Image;
		},
		onSearch: function (evt) {
			var filter1 = new sap.ui.model.Filter("dProduct_Name", "Contains", evt.getParameter("newValue"));
			var filter2 = new sap.ui.model.Filter("SKU", "Contains", evt.getParameter("newValue"));
			var filter3 = new sap.ui.model.Filter("grade", "Contains", evt.getParameter("newValue"));
			var filter4 = new sap.ui.model.Filter("frame", "Contains", evt.getParameter("newValue"));
			var filters = new sap.ui.model.Filter([filter1, filter2, filter3, filter4], false);
			this.getView().byId("tableItemsId").getBinding("items").filter(filters);
		}

		/*	var searchString = this.getView().byId("tableItemsId").getValue();
			var binding = this.getView().byId("tableItemsId").getBinding("items");
			if (searchString && searchString.length > 0) {
				var filter1 = new Filter("DProduct_Name", "Contains", searchString);
				var filter2 = new Filter("grade", "Contains", searchString);
				var filter3 = new Filter("SKU", "Contains", searchString);
				var filter4 = new Filter("createdAt", "Contains", searchString);
				var filter5 = new Filter("frame", "Contains", searchString);
				var searchFilter = [filter1, filter2, filter3, filter4, filter5];
				var newfilter = new sap.ui.model.Filter(searchFilter, false);
				var afilters = [];
				afilters.push(newfilter);
				binding.filter(afilters);
			} else {
				var afil = [];
				binding.filter(afil);
			}
		}*/

	});

});