sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/core/format/DateFormat","MDG/Help/util/formatter"],function(t,e,o){"use strict";return t.extend("MDG.Help.controller.Collection",{formatter:o,onInit:function(){var t=this.getOwnerComponent();this._router=t.getRouter();this.getOwnerComponent().getRouter().attachRouteMatched(this._routePatternMatched,this);if(!this.sortProductDetail){this.sortProductDetail=new sap.ui.xmlfragment("MDG.Help.fragment.product",this)}if(!this.addProductcart){this.addProductcart=new sap.ui.xmlfragment("MDG.Help.fragment.AddtoCart",this)}if(!this.itemSummary)this.itemSummary=new sap.ui.xmlfragment("MDG.Help.fragment.itemSummary",this);this.getView().addDependent(this.itemSummary)},_routePatternMatched:function(t){var e=this;var o=t.getParameter("arguments").AddCust,a=this.getView(),n=a.getModel();this.sId=o;this.getOwnerComponent().getModel("browseByData").oData.itemSummary=[];this.getView().getModel("appView").setProperty("/totalAmount",0);this.getView().getModel("appView").setProperty("/cartCount",0);this.getView().byId("cartIconId").setText(s);if(o=="Draft"){this.quotationPath=t.getParameter("arguments").quotationId;var r=e.getOwnerComponent().getModel("Quotation").getData()[t.getParameter("arguments").quotationId].Items;var s=0,i=0;for(var d=0;d<r.length;d++){s++;i+=parseInt(r[d].price);this.getOwnerComponent().getModel("browseByData").oData.itemSummary.push({Name:r[d].Name,ItemId:"M34657879",SKU:r[d].SKU,currency:r[d].price,src:r[d].src,Qty:r[d].Qty,fabricType:r[d].fabricType,color:r[d].color})}this.getView().getModel("appView").setProperty("/totalAmount",i);this.getView().getModel("appView").setProperty("/cartCount",s);this.getView().byId("cartIconId").setText(s);this.getOwnerComponent().getModel("browseByData").updateBindings(true);var g=this.getOwnerComponent().getModel("browseByData").oData.Catalogs[0].Items[0];this.getView().getModel("appView").setProperty("/cartItems",g)}this.getView().byId("addToCart1Id").setText("Add To Cart").setType("Emphasized");this.getView().byId("addToCart2Id").setText("Add To Cart").setType("Emphasized");this.getView().byId("addToCart3Id").setText("Add To Cart").setType("Emphasized");this.getView().byId("addToCart4Id").setText("Add To Cart").setType("Emphasized")},fnUpdateProduct:function(t){var e="/Products('"+t+"')",o=function(){this._checkIfProductAvailable(e)};this.getView().bindElement({path:e,events:{change:o.bind(this)}})},_checkIfProductAvailable:function(t){var e=this.getModel();var o=e.getData(t);if(!o){this._router.getTargets().display("notFound")}},onToggleCart:function(t){var e=t.getParameter("pressed");var o=this.getView().getBindingContext().getObject();this._setLayout(e?"Three":"Two");this.getRouter().navTo(e?"productCart":"product",{id:o.Category,productId:o.ProductId})},openEditProgram:function(){var t=this;this.getView().getModel("appView").setProperty("/layout","ThreeColumnsEndExpanded");this.getOwnerComponent().getRouter().navTo("addProduct")},addToCart:function(){var t=this;var e=sap.ui.core.UIComponent.getRouterFor(t);e.navTo("Home",{test:"ADD"})},handlecollectionBack:function(){var t=this;this.getView().getModel("appView").setProperty("/layout","MidColumnFullScreen");this.getOwnerComponent().getRouter().navTo("AddNewQuotation",{AddCust:"Edit"})},onSelectProduct:function(){var t=this;this.sortProductDetail.open()},handleproductCancelPress:function(){var t=this;t.sortProductDetail.close()},onAddToCart:function(t){var e=this;this.addToCartBUtton=t.getSource();this.selectedCurrency=t.getSource().getParent().getParent().getParent().getContent()[0].getContent()[3].getNumber();this.selectedProductName=t.getSource().getParent().getParent().getParent().getContent()[0].getContent()[0].getItems()[0].getContent()[0].getTitle();this.selectedImagePath=t.getSource().getParent().getParent().getParent().getContent()[0].getContent()[1].getItems()[0].getSrc();this.addProductcart.getContent()[0].getContent()[0].getContent()[0].getContent()[0].getPages()[0].getItems()[0].setSrc(this.selectedImagePath);this.addProductcart.getContent()[2].getContent()[4].setSelectedIndex(-1);this.addProductcart.getContent()[2].getContent()[10].getItems()[0].setValue();this.addProductcart.getContent()[2].getContent()[5].setVisible(false);this.addProductcart.getContent()[2].getContent()[6].setVisible(false);this.addProductcart.getContent()[2].getContent()[7].setVisible(false);this.addProductcart.getContent()[2].getContent()[8].setVisible(false);this.addProductcart.getContent()[2].getContent()[12].setSelectedIndex(-1);this.addProductcart.getContent()[2].getContent()[13].setVisible(false);this.addProductcart.getContent()[2].getContent()[14].setVisible(false);this.addProductcart.getContent()[2].getContent()[15].setVisible(false);this.addProductcart.getContent()[2].getContent()[16].setVisible(false);this.addProductcart.getContent()[2].getContent()[18].setText();this.addProductcart.open()},handleAddcartCancelPress:function(){var t=this;t.addProductcart.close()},handleAddCartPress:function(){var t=this;this.addToCartBUtton.setText("Go To Cart").setType("Accept");sap.m.MessageBox.success("Item has been added to cart successfully");this.selectedCurrency=this.selectedCurrency.replace("$","");this.getView().getModel("appView").setProperty("/totalAmount",this.getView().getModel("appView").getProperty("/totalAmount")+parseInt(this.selectedCurrency));this.getView().getModel("appView").setProperty("/cartCount",this.getView().getModel("appView").getProperty("/cartCount")+1);this.getView().byId("cartIconId").setText(this.getView().getModel("appView").getProperty("/cartCount"));this.getOwnerComponent().getModel("browseByData").oData.itemSummary.push({Name:this.selectedProductName,currency:this.selectedCurrency,src:this.addProductcart.getContent()[0].getContent()[0].getContent()[0].getContent()[0].getPages()[0].getItems()[0].getSrc(),fabricType:this.selectedFabricType,materalType:this.selecetedMetalText,woodType:this.selecetedWoodText,Qty:this.addProductcart.getContent()[2].getContent()[10].getItems()[0].getValue(),color:this.selectedFabricType,SKU:this.addProductcart.getContent()[2].getContent()[18].getText()});this.getOwnerComponent().getModel("browseByData").updateBindings(true);t.addProductcart.close()},handleItemSummaryPress:function(){this.itemSummary.open()},handleCancelItemSummaryPress:function(){this.itemSummary.close()},handleDraftItemSummaryPress:function(){var t=this;var e=this.getOwnerComponent().getModel("browseByData").oData.itemSummary;var o=this.getOwnerComponent().getModel("Quotation").oData;if(this.sId=="Draft"){sap.m.MessageBox.confirm("Do you want to save it as a draft?",function(o){if(o=="OK"){t.getOwnerComponent().getModel("Quotation").oData[t.quotationPath].Items=e;try{e.forEach(function(e){e.QID=t.getOwnerComponent().getModel("Quotation").oData[t.quotationPath].QID;e.CustomerName=t.getView().getModel("appView").getProperty("/customerData").customerName;e.EmailID=t.getView().getModel("appView").getProperty("/customerData").email;e.phoneNo=t.getView().getModel("appView").getProperty("/customerData").contactPhone;e.TotalPrice=parseInt(e.Qty)*parseInt(e.currency.replace("$",""));e.price=e.currency})}catch(t){}t.getOwnerComponent().getModel("Quotation").updateBindings(true);sap.m.MessageToast.show("Quotation has been created as Draft");t.getView().getModel("appView").setProperty("/layout","MidColumnFullScreen");t.getOwnerComponent().getRouter().navTo("DetailQuotation",{AddCust:"Edit",sPath:t.quotationPath})}})}else{var a=parseInt(o[o.length-1].QID.split("Q")[1])+1;var n=sap.ui.core.format.DateFormat.getDateInstance({pattern:"MM/dd/yyyy"});var r=n.format(new Date);var s={QID:"Q"+a,customerName:t.getView().getModel("appView").getProperty("/customerData").customerName,CustomerName:t.getView().getModel("appView").getProperty("/customerData").customerName,EmailID:t.getView().getModel("appView").getProperty("/customerData").email,phoneNo:t.getView().getModel("appView").getProperty("/customerData").contactPhone,product:"Table",Qty:0,price:0,status:"Draft",stateStatus:"Success",createdDate:r,collection:"Hopper",Items:[]};for(var i=0;i<e.length;i++){s.Qty+=parseInt(e[i].Qty);s.price+=parseInt(e[i].currency);e[i].price=e[i].currency;e[i].TotalPrice=parseInt(e[i].Qty)*parseInt(e[i].currency);e[i].TotalPrice=e[i].TotalPrice;s.Items.push(e[i])}sap.m.MessageBox.confirm("Do you want to save it as a draft?",function(e){if(e=="OK"){o.push(s);t.getOwnerComponent().getModel("Quotation").updateBindings(true);sap.m.MessageToast.show("Quotation has been created as Draft");t.getView().getModel("appView").setProperty("/layout","MidColumnFullScreen");t.getOwnerComponent().getRouter().navTo("AddNewQuotation",{AddCust:"Edit"})}})}},handleSubmitItemSummaryPress:function(t){var e=this;var o=this.getOwnerComponent().getModel("browseByData").oData.itemSummary;var a=this.getOwnerComponent().getModel("Quotation").oData;if(this.sId=="Draft"){sap.m.MessageBox.confirm("Do you want to submit the quotation?",function(t){if(t=="OK"){e.getOwnerComponent().getModel("Quotation").oData[e.quotationPath].Items=o;e.getOwnerComponent().getModel("Quotation").oData[e.quotationPath].status="Submitted";try{o.forEach(function(t){t.QID=e.getOwnerComponent().getModel("Quotation").oData[e.quotationPath].QID;t.CustomerName=e.getView().getModel("appView").getProperty("/customerData").customerName;t.EmailID=e.getView().getModel("appView").getProperty("/customerData").email;t.phoneNo=e.getView().getModel("appView").getProperty("/customerData").contactPhone;t.TotalPrice=parseInt(t.Qty)*parseInt(t.currency.replace("$",""));t.price=t.currency})}catch(t){}e.getOwnerComponent().getModel("Quotation").updateBindings(true);sap.m.MessageToast.show("Quotation has been submitted successfully");e.getView().getModel("appView").setProperty("/layout","MidColumnFullScreen");e.getOwnerComponent().getRouter().navTo("DetailQuotation",{AddCust:"Edit",sPath:e.quotationPath})}})}else{var n=parseInt(a[a.length-1].QID.split("Q")[1])+1;var r=sap.ui.core.format.DateFormat.getDateInstance({pattern:"MM/dd/yyyy"});var s=r.format(new Date);var i={QID:"Q"+n,customerName:e.getView().getModel("appView").getProperty("/customerData").customerName,CustomerName:e.getView().getModel("appView").getProperty("/customerData").customerName,EmailID:e.getView().getModel("appView").getProperty("/customerData").email,phoneNo:e.getView().getModel("appView").getProperty("/customerData").contactPhone,product:"Table",Qty:0,price:0,status:"Submitted",stateStatus:"Success",createdDate:s,collection:"Hopper",Items:[]};for(var d=0;d<o.length;d++){i.Qty+=parseInt(o[d].Qty);i.price+=parseInt(o[d].currency);o[d].price=o[d].currency;o[d].TotalPrice=parseInt(o[d].Qty)*parseInt(o[d].currency);o[d].TotalPrice=o[d].TotalPrice;i.Items.push(o[d])}sap.m.MessageBox.confirm("Do you want to submit the quotation?",function(t){if(t=="OK"){a.push(i);e.getOwnerComponent().getModel("Quotation").updateBindings(true);sap.m.MessageToast.show("Quotation has been submitted successfully");e.getView().getModel("appView").setProperty("/layout","MidColumnFullScreen");e.getOwnerComponent().getRouter().navTo("AddNewQuotation",{AddCust:"Edit"})}})}},handleRadioButtonSelect:function(t){if(t.getSource().getSelectedButton().getText()=="Metal"){this.addProductcart.getContent()[2].getContent()[5].setVisible(true);this.addProductcart.getContent()[2].getContent()[6].setVisible(true);this.addProductcart.getContent()[2].getContent()[7].setVisible(false);this.addProductcart.getContent()[2].getContent()[8].setVisible(false)}else{this.addProductcart.getContent()[2].getContent()[5].setVisible(false);this.addProductcart.getContent()[2].getContent()[6].setVisible(false);this.addProductcart.getContent()[2].getContent()[7].setVisible(true);this.addProductcart.getContent()[2].getContent()[8].setVisible(true)}},handleRadioButtonSelectForFabric:function(t){if(t.getSource().getSelectedButton().getText()=="Grade - A"){this.addProductcart.getContent()[2].getContent()[13].setVisible(true);this.addProductcart.getContent()[2].getContent()[14].setVisible(true);this.addProductcart.getContent()[2].getContent()[15].setVisible(false);this.addProductcart.getContent()[2].getContent()[16].setVisible(false)}else{this.addProductcart.getContent()[2].getContent()[13].setVisible(false);this.addProductcart.getContent()[2].getContent()[14].setVisible(false);this.addProductcart.getContent()[2].getContent()[15].setVisible(true);this.addProductcart.getContent()[2].getContent()[16].setVisible(true)}},handleMaterialTypeChange:function(t){var e=t.getSource().getSelectedKey().split(" - ")[1];if(this.addProductcart.getContent()[2].getContent()[14].getText().length==0)o="M94"+e;else var o=e;this.addProductcart.getContent()[2].getContent()[14].setText(this.addProductcart.getContent()[2].getContent()[14].getText()+o)},handleWoodTypeChange:function(t){var e=t.getSource().getSelectedKey().split(" - ")[1];if(this.addProductcart.getContent()[2].getContent()[14].getText().length==0)var o="M94"+e;else var o=e;this.addProductcart.getContent()[2].getContent()[14].setText(this.addProductcart.getContent()[2].getContent()[14].getText()+o)},handleChangeFabricType:function(t){var e=t.getSource().getSelectedKey().split(" - ")[1];if(this.addProductcart.getContent()[2].getContent()[14].getText().length==0)var o="M94"+e;else var o=e;this.addProductcart.getContent()[2].getContent()[14].setText(this.addProductcart.getContent()[2].getContent()[14].getText()+o)},handleMetalType:function(t){var e=t.getSource().getParent().getItems()[1].getText();this.selecetedMetalText=e;sap.m.MessageToast.show(e+" is selected");if(this.addProductcart.getContent()[2].getContent()[18].getText().length==0)var o="M94"+e.split(" - ")[1];else var o=e.split(" - ")[1];this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText()+o)},handleWoodType:function(t){var e=t.getSource().getParent().getItems()[1].getText();this.selecetedWoodText=e;sap.m.MessageToast.show(e+" is selected");if(this.addProductcart.getContent()[2].getContent()[18].getText().length==0)var o="M94"+e.split(" - ")[1];else var o=e.split(" - ")[1];this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText()+o)},handleGradeAPress:function(t){var e=t.getSource().getParent().getItems()[1].getText();this.selectedFabricType=e;sap.m.MessageToast.show(e+" is selected");if(this.addProductcart.getContent()[2].getContent()[18].getText().length==0)var o="M94"+e.split(" - ")[1];else var o=e.split(" - ")[1];this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText()+o)},handleGradeBPress:function(t){var e=t.getSource().getParent().getItems()[1].getText();this.selectedFabricType=e;sap.m.MessageToast.show(e+" is selected");if(this.addProductcart.getContent()[2].getContent()[18].getText().length==0)var o="M94"+e.split(" - ")[1];else var o=e.split(" - ")[1];this.addProductcart.getContent()[2].getContent()[18].setText(this.addProductcart.getContent()[2].getContent()[18].getText()+o)}})});