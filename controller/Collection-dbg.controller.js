sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/format/DateFormat",
	"MDG/Help/util/formatter",
], function (
	Controller, DateFormat, formatter) {
	"use strict";

	return Controller.extend("MDG.Help.controller.Collection", {
		formatter: formatter,

		onInit: function () {
			var oComponent = this.getOwnerComponent();
			this._router = oComponent.getRouter();
			this.getOwnerComponent().getRouter().attachRouteMatched(this._routePatternMatched, this);
			/*if (!this.addProductcart) {
				this.addProductcart = new sap.ui.xmlfragment("MDG.Help.fragment.AddtoCart", this);
				this.getView().addDependent(this.addProductcart);
			}*/
			if (!this.sortProductDetail) {
				this.sortProductDetail = new sap.ui.xmlfragment("MDG.Help.fragment.product", this);
				//	this.getView().addDependent(this.sortProductDetail);

			}
			if (!this.addProductcart) {
				this.addProductcart = new sap.ui.xmlfragment("MDG.Help.fragment.AddtoCart", this);
				//	this.getView().addDependent(this.addProductcart);
			}
			if (!this.itemSummary)
				this.itemSummary = new sap.ui.xmlfragment("MDG.Help.fragment.itemSummary", this);
			this.getView().addDependent(this.itemSummary);
			// this._router.getTarget("product").attachDisplay(function (oEvent) {
			// 	this.fnUpdateProduct(oEvent.getParameter("data").productId);// update the binding based on products cart selection
			// }, this);
		},

		_routePatternMatched: function (oEvent) {
			var that = this;
			var sId = oEvent.getParameter("arguments").AddCust,
				oView = this.getView(),
				oModel = oView.getModel();
			this.sId = sId;
			this.getOwnerComponent().getModel("browseByData").oData.itemSummary = [];
			this.getView().getModel("appView").setProperty("/totalAmount", 0);
			this.getView().getModel("appView").setProperty("/cartCount", 0);
			this.getView().byId("cartIconId").setText(cartCount);
			if (sId == "Draft") {
				this.quotationPath = oEvent.getParameter("arguments").quotationId;
				var quatationData = that.getOwnerComponent().getModel("Quotation").getData()[oEvent.getParameter("arguments").quotationId].Items;
				var cartCount = 0,
					totalamount = 0;
				for (var i = 0; i < quatationData.length; i++) {
					cartCount++;
					totalamount += parseInt(quatationData[i].price);
					this.getOwnerComponent().getModel("browseByData").oData.itemSummary.push({
						"Name": quatationData[i].Name,
						"ItemId": "M34657879",
						"SKU": quatationData[i].SKU,
						"currency": quatationData[i].price,
						"src": quatationData[i].src,
						"Qty": quatationData[i].Qty,
						"fabricType": quatationData[i].fabricType,
						"color": quatationData[i].color
					});
				}
				this.getView().getModel("appView").setProperty("/totalAmount", totalamount);
				this.getView().getModel("appView").setProperty("/cartCount", cartCount);
				this.getView().byId("cartIconId").setText(cartCount);
				this.getOwnerComponent().getModel("browseByData").updateBindings(true);
				var selectedCartProducts = this.getOwnerComponent().getModel("browseByData").oData.Catalogs[0].Items[0];
				this.getView().getModel("appView").setProperty("/cartItems", selectedCartProducts);
			}
			this.getView().byId("addToCart1Id").setText("Add To Cart").setType("Emphasized");
			this.getView().byId("addToCart2Id").setText("Add To Cart").setType("Emphasized");
			this.getView().byId("addToCart3Id").setText("Add To Cart").setType("Emphasized");
			this.getView().byId("addToCart4Id").setText("Add To Cart").setType("Emphasized");
		},

		fnUpdateProduct: function (productId) {
			var sPath = "/Products('" + productId + "')",
				fnCheck = function () {
					this._checkIfProductAvailable(sPath);
				};

			this.getView().bindElement({
				path: sPath,
				events: {
					change: fnCheck.bind(this)
				}
			});
		},

		_checkIfProductAvailable: function (sPath) {
			var oModel = this.getModel();
			var oData = oModel.getData(sPath);

			// show not found page
			if (!oData) {
				this._router.getTargets().display("notFound");
			}
		},

		/**
		 * Navigate to the generic cart view
		 * @param {sap.ui.base.Event} @param oEvent the button press event
		 */
		onToggleCart: function (oEvent) {
			var bPressed = oEvent.getParameter("pressed");
			var oEntry = this.getView().getBindingContext().getObject();

			this._setLayout(bPressed ? "Three" : "Two");
			this.getRouter().navTo(bPressed ? "productCart" : "product", {
				id: oEntry.Category,
				productId: oEntry.ProductId
			});
		},
		openEditProgram: function () {
			var that = this;

			this.getView().getModel("appView").setProperty("/layout", "ThreeColumnsEndExpanded");
			this.getOwnerComponent().getRouter().navTo("addProduct");

		},
		addToCart: function () {
			var that = this;
			var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
			oRouter.navTo("Home", {
				test: "ADD"
			});
		},
		handlecollectionBack: function () {
			var that = this;
			this.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
			this.getOwnerComponent().getRouter().navTo("AddNewQuotation", {
				AddCust: "Edit"
			});
		},
		onSelectProduct: function () {
			var that = this;

			this.sortProductDetail.open();
		},

		handleproductCancelPress: function () {
			var that = this;
			that.sortProductDetail.close();
		},

		onAddToCart: function (evt) {
			var that = this;
			this.addToCartBUtton = evt.getSource();
			this.selectedCurrency = evt.getSource().getParent().getParent().getParent().getContent()[0].getContent()[3].getNumber();
			this.selectedProductName = evt.getSource().getParent().getParent().getParent().getContent()[0].getContent()[0].getItems()[0].getContent()[
				0].getTitle();
			this.selectedImagePath = evt.getSource().getParent().getParent().getParent().getContent()[0].getContent()[1].getItems()[0].getSrc();
			this.addProductcart.getContent()[0].getContent()[0].getContent()[0].getContent()[0].getPages()[0].getItems()[0].setSrc(this.selectedImagePath);
			this.addProductcart.getContent()[2].getContent()[4].setSelectedIndex(-1);
			//this.addProductcart.getContent()[2].getContent()[6].setSelectedKey(null);
			//this.addProductcart.getContent()[2].getContent()[8].setSelectedKey(null);
			this.addProductcart.getContent()[2].getContent()[10].getItems()[0].setValue();
			this.addProductcart.getContent()[2].getContent()[5].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[6].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[7].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[8].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[12].setSelectedIndex(-1);
			this.addProductcart.getContent()[2].getContent()[13].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[14].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[15].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[16].setVisible(false);
			this.addProductcart.getContent()[2].getContent()[18].setText();
			//this.addProductcart.getContent()[2].getContent()[12].setSelectedKey(null);
			//this.addProductcart.getContent()[2].getContent()[14].setText();
			this.addProductcart.open();
		},

		handleAddcartCancelPress: function () {
			var that = this;
			that.addProductcart.close();
		},
		handleAddCartPress: function () {
			var that = this;
			this.addToCartBUtton.setText("Go To Cart").setType("Accept");
			sap.m.MessageBox.success("Item has been added to cart successfully");
			this.selectedCurrency = this.selectedCurrency.replace("$", "");
			this.getView().getModel("appView").setProperty("/totalAmount", this.getView().getModel("appView").getProperty("/totalAmount") +
				parseInt(this.selectedCurrency));
			this.getView().getModel("appView").setProperty("/cartCount", this.getView().getModel("appView").getProperty("/cartCount") + 1);
			this.getView().byId("cartIconId").setText(this.getView().getModel("appView").getProperty("/cartCount"));
			this.getOwnerComponent().getModel("browseByData").oData.itemSummary.push({
				"Name": this.selectedProductName,
				"currency": this.selectedCurrency,
				"src": this.addProductcart.getContent()[0].getContent()[0].getContent()[0].getContent()[0].getPages()[0].getItems()[0].getSrc(),
				"fabricType": this.selectedFabricType,
				"materalType": this.selecetedMetalText,
				"woodType": this.selecetedWoodText,
				"Qty": this.addProductcart.getContent()[2].getContent()[10].getItems()[0].getValue(),
				"color": this.selectedFabricType,
				"SKU": this.addProductcart.getContent()[2].getContent()[18].getText()
			});
			this.getOwnerComponent().getModel("browseByData").updateBindings(true);
			that.addProductcart.close();
		},
		handleItemSummaryPress: function () {
			this.itemSummary.open();
		},
		handleCancelItemSummaryPress: function () {
			this.itemSummary.close();
		},
		handleDraftItemSummaryPress: function () {
			var that = this;
			var itemsData = this.getOwnerComponent().getModel("browseByData").oData.itemSummary;
			var quotationModel = this.getOwnerComponent().getModel("Quotation").oData;
			if (this.sId == "Draft") {
				sap.m.MessageBox.confirm("Do you want to save it as a draft?", function (oEvent) {
					if (oEvent == "OK") {
						that.getOwnerComponent().getModel("Quotation").oData[that.quotationPath].Items = itemsData;
						try {
							itemsData.forEach(function (obj) {
								obj.QID = that.getOwnerComponent().getModel("Quotation").oData[that.quotationPath].QID;
								obj.CustomerName = that.getView().getModel("appView").getProperty("/customerData").customerName;
								obj.EmailID = that.getView().getModel("appView").getProperty("/customerData").email;
								obj.phoneNo = that.getView().getModel("appView").getProperty("/customerData").contactPhone;
								obj.TotalPrice = parseInt(obj.Qty) * parseInt(obj.currency.replace("$", ""));
								obj.price = obj.currency;
							});
						} catch (e) {}
						that.getOwnerComponent().getModel("Quotation").updateBindings(true);
						sap.m.MessageToast.show("Quotation has been created as Draft");
						that.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
						that.getOwnerComponent().getRouter().navTo("DetailQuotation", {
							AddCust: "Edit",
							sPath: that.quotationPath
						});
					}
				});

			} else {
				var id = parseInt(quotationModel[quotationModel.length - 1].QID.split("Q")[1]) + 1;
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "MM/dd/yyyy"
				});
				var dateStr = dateFormat.format(new Date());
				var obj = {
					"QID": "Q" + id,
					"customerName": that.getView().getModel("appView").getProperty("/customerData").customerName,
					"CustomerName": that.getView().getModel("appView").getProperty("/customerData").customerName,
					"EmailID": that.getView().getModel("appView").getProperty("/customerData").email,
					"phoneNo": that.getView().getModel("appView").getProperty("/customerData").contactPhone,
					"product": "Table",
					"Qty": 0,
					"price": 0,
					"status": "Draft",
					"stateStatus": "Success",
					"createdDate": dateStr,
					"collection": "Hopper",
					"Items": []
				};
				for (var i = 0; i < itemsData.length; i++) {

					obj.Qty += parseInt(itemsData[i].Qty);
					obj.price += parseInt(itemsData[i].currency)
					itemsData[i].price = itemsData[i].currency
					itemsData[i].TotalPrice = parseInt(itemsData[i].Qty) * parseInt(itemsData[i].currency);
					itemsData[i].TotalPrice = itemsData[i].TotalPrice;
					obj.Items.push(itemsData[i]);
				}
				sap.m.MessageBox.confirm("Do you want to save it as a draft?", function (oEvent) {
					if (oEvent == "OK") {
						quotationModel.push(obj);
						that.getOwnerComponent().getModel("Quotation").updateBindings(true);
						sap.m.MessageToast.show("Quotation has been created as Draft");
						that.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
						that.getOwnerComponent().getRouter().navTo("AddNewQuotation", {
							AddCust: "Edit"
						});
					}
				})
			}

		},
		handleSubmitItemSummaryPress: function (evt) {
			var that = this;
			var itemsData = this.getOwnerComponent().getModel("browseByData").oData.itemSummary;
			var quotationModel = this.getOwnerComponent().getModel("Quotation").oData;
			if (this.sId == "Draft") {
				sap.m.MessageBox.confirm("Do you want to submit the quotation?", function (oEvent) {
					if (oEvent == "OK") {
						that.getOwnerComponent().getModel("Quotation").oData[that.quotationPath].Items = itemsData;
						that.getOwnerComponent().getModel("Quotation").oData[that.quotationPath].status = "Submitted";
						try {
							itemsData.forEach(function (obj) {
								obj.QID = that.getOwnerComponent().getModel("Quotation").oData[that.quotationPath].QID;
								obj.CustomerName = that.getView().getModel("appView").getProperty("/customerData").customerName;
								obj.EmailID = that.getView().getModel("appView").getProperty("/customerData").email;
								obj.phoneNo = that.getView().getModel("appView").getProperty("/customerData").contactPhone;
								obj.TotalPrice = parseInt(obj.Qty) * parseInt(obj.currency.replace("$", ""));
								obj.price = obj.currency;
							});
						} catch (e) {}
						that.getOwnerComponent().getModel("Quotation").updateBindings(true);
						sap.m.MessageToast.show("Quotation has been submitted successfully");
						that.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
						that.getOwnerComponent().getRouter().navTo("DetailQuotation", {
							AddCust: "Edit",
							sPath: that.quotationPath
						});
					}
				});
			} else {
				var id = parseInt(quotationModel[quotationModel.length - 1].QID.split("Q")[1]) + 1;
				var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({
					pattern: "MM/dd/yyyy"
				});
				var dateStr = dateFormat.format(new Date());
				var obj = {
					"QID": "Q" + id,
					//"customerName": "Quadrangle Systems",
					"customerName": that.getView().getModel("appView").getProperty("/customerData").customerName,
					"CustomerName": that.getView().getModel("appView").getProperty("/customerData").customerName,
					"EmailID": that.getView().getModel("appView").getProperty("/customerData").email,
					"phoneNo": that.getView().getModel("appView").getProperty("/customerData").contactPhone,
					"product": "Table",
					"Qty": 0,
					"price": 0,
					"status": "Submitted",
					"stateStatus": "Success",
					"createdDate": dateStr,
					"collection": "Hopper",
					"Items": []
				}
				for (var i = 0; i < itemsData.length; i++) {
					//obj.Items.push(itemsData[i]);
					obj.Qty += parseInt(itemsData[i].Qty);
					obj.price += parseInt(itemsData[i].currency);
					itemsData[i].price = itemsData[i].currency
					itemsData[i].TotalPrice = parseInt(itemsData[i].Qty) * parseInt(itemsData[i].currency);
					itemsData[i].TotalPrice = itemsData[i].TotalPrice;
					obj.Items.push(itemsData[i]);
				}
				sap.m.MessageBox.confirm("Do you want to submit the quotation?", function (oEvent) {
					if (oEvent == "OK") {
						quotationModel.push(obj);
						that.getOwnerComponent().getModel("Quotation").updateBindings(true);
						sap.m.MessageToast.show("Quotation has been submitted successfully");
						that.getView().getModel("appView").setProperty("/layout", "MidColumnFullScreen");
						that.getOwnerComponent().getRouter().navTo("AddNewQuotation", {
							AddCust: "Edit"
						});
					}
				})
			}
		},
		handleRadioButtonSelect: function (evt) {
			if (evt.getSource().getSelectedButton().getText() == "Metal") {
				this.addProductcart.getContent()[2].getContent()[5].setVisible(true);
				this.addProductcart.getContent()[2].getContent()[6].setVisible(true);
				this.addProductcart.getContent()[2].getContent()[7].setVisible(false);
				this.addProductcart.getContent()[2].getContent()[8].setVisible(false);
			} else {
				this.addProductcart.getContent()[2].getContent()[5].setVisible(false);
				this.addProductcart.getContent()[2].getContent()[6].setVisible(false);
				this.addProductcart.getContent()[2].getContent()[7].setVisible(true);
				this.addProductcart.getContent()[2].getContent()[8].setVisible(true);
			}
		},
		handleRadioButtonSelectForFabric: function (evt) {
			if (evt.getSource().getSelectedButton().getText() == "Grade - A") {
				this.addProductcart.getContent()[2].getContent()[13].setVisible(true);
				this.addProductcart.getContent()[2].getContent()[14].setVisible(true);
				this.addProductcart.getContent()[2].getContent()[15].setVisible(false);
				this.addProductcart.getContent()[2].getContent()[16].setVisible(false);
			} else {
				this.addProductcart.getContent()[2].getContent()[13].setVisible(false);
				this.addProductcart.getContent()[2].getContent()[14].setVisible(false);
				this.addProductcart.getContent()[2].getContent()[15].setVisible(true);
				this.addProductcart.getContent()[2].getContent()[16].setVisible(true);
			}
		},
		handleMaterialTypeChange: function (evt) {
			var selectedKey = evt.getSource().getSelectedKey().split(" - ")[1];
			if (this.addProductcart.getContent()[2].getContent()[14].getText().length == 0)
				skuNo = "M94" + selectedKey;
			else
				var skuNo = selectedKey;
			this.addProductcart.getContent()[2].getContent()[14].setText(this.addProductcart.getContent()[2].getContent()[14].getText() + skuNo);
		},
		handleWoodTypeChange: function (evt) {
			var selectedKey = evt.getSource().getSelectedKey().split(" - ")[1];
			if (this.addProductcart.getContent()[2].getContent()[14].getText().length == 0)
				var skuNo = "M94" + selectedKey;
			else
				var skuNo = selectedKey;
			this.addProductcart.getContent()[2].getContent()[14].setText(this.addProductcart.getContent()[2].getContent()[14].getText() + skuNo);
		},
		handleChangeFabricType: function (evt) {
			var selectedKey = evt.getSource().getSelectedKey().split(" - ")[1];
			if (this.addProductcart.getContent()[2].getContent()[14].getText().length == 0)
				var skuNo = "M94" + selectedKey;
			else
				var skuNo = selectedKey;
			this.addProductcart.getContent()[2].getContent()[14].setText(this.addProductcart.getContent()[2].getContent()[14].getText() + skuNo);
		},
		handleMetalType: function (evt) {
			var selectedText = evt.getSource().getParent().getItems()[1].getText();
			this.selecetedMetalText = selectedText;
			sap.m.MessageToast.show(selectedText + " is selected");
			if (this.addProductcart.getContent()[2].getContent()[18].getText().length == 0)
				var skuNo = "M94" + selectedText.split(" - ")[1];
			else
				var skuNo = selectedText.split(" - ")[1];
			this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText() + skuNo);
		},
		handleWoodType: function (evt) {
			var selectedText = evt.getSource().getParent().getItems()[1].getText();
			this.selecetedWoodText = selectedText;
			sap.m.MessageToast.show(selectedText + " is selected");
			if (this.addProductcart.getContent()[2].getContent()[18].getText().length == 0)
				var skuNo = "M94" + selectedText.split(" - ")[1];
			else
				var skuNo = selectedText.split(" - ")[1];
			this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText() + skuNo);
		},
		handleGradeAPress: function (evt) {
			var selectedText = evt.getSource().getParent().getItems()[1].getText();
			this.selectedFabricType = selectedText;
			sap.m.MessageToast.show(selectedText + " is selected");
			if (this.addProductcart.getContent()[2].getContent()[18].getText().length == 0)
				var skuNo = "M94" + selectedText.split(" - ")[1];
			else
				var skuNo = selectedText.split(" - ")[1];
			this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText() + skuNo);
		},
		handleGradeBPress: function (evt) {
			var selectedText = evt.getSource().getParent().getItems()[1].getText();
			this.selectedFabricType = selectedText;
			sap.m.MessageToast.show(selectedText + " is selected");
			if (this.addProductcart.getContent()[2].getContent()[18].getText().length == 0)
				var skuNo = "M94" + selectedText.split(" - ")[1];
			else
				var skuNo = selectedText.split(" - ")[1];
			this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText() + skuNo);
		}
	});
});