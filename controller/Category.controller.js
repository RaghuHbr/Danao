sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/Device","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/m/MessageToast","sap/ui/model/json/JSONModel","sap/ui/core/Fragment"],function(e,t,i,r,o,a,n){"use strict";return e.extend("MDG.Help.controller.Category",{_iLowFilterPreviousValue:0,_iHighFilterPreviousValue:5e3,onInit:function(){var e=new a({Suppliers:[]});this.getView().setModel(e,"view");var t=this.getOwnerComponent();this._oRouter=t.getRouter()},_loadCategories:function(e){var t=this.getView().getModel("appView").getProperty("/smallScreenMode"),i=e.getParameter("category");if(i==="category"){this._setLayout(t?"One":"Two")}var r=this.getModel();this._loadSuppliers();var o=this.byId("productList");var a=o.getBinding("items");a.attachDataReceived(this.fnDataReceived,this);var n=e.getParameter("arguments").category;this._sProductId=e.getParameter("arguments").productId;r.metadataLoaded().then(function(){var e=this.getView(),t="/"+this.getModel().createKey("ProductCategories",{Category:n});e.bindElement({path:t,parameters:{expand:"Products"},events:{dataRequested:function(){e.setBusy(true)},dataReceived:function(){e.setBusy(false)}}})}.bind(this))},_loadSuppliers:function(){var e=this.getModel();e.read("/Products",{success:function(e){var t=e.results,i=[];t.forEach(function(e){i.push(e.SupplierName)});var r=i.filter(function(e,t,i){return i.indexOf(e)===t}).sort();r.map(function(e,t,i){i[t]={SupplierName:e}});this.getModel("view").setProperty("/Suppliers",r)}.bind(this)});this._clearComparison()},fnDataReceived:function(){var e=this.byId("productList");var t=e.getItems();t.some(function(t){if(t.getBindingContext().getPath()==="/Products('"+this._sProductId+"')"){e.setSelectedItem(t);return true}}.bind(this))},onProductListSelect:function(e){this._showProduct(e)},onProductDetails:function(e){var i;if(t.system.phone){i=e.getSource().getBindingContext()}else{i=e.getSource().getSelectedItem().getBindingContext()}var r=i.getModel();var o=r.getData(i.getPath()).Category;var a=r.getData(i.getPath()).ProductId;var n=this.getModel("appView").getProperty("/layout").startsWith("Three");this._setLayout("Two");this._oRouter.navTo(n?"productCart":"product",{id:o,productId:a},!t.system.phone);this._unhideMiddlePage()},_applyFilter:function(e){var t=this.byId("productList"),o=t.getBinding("items"),a=e.getParameter("filterItems"),n=this.byId("categoryFilterDialog").getFilterItems()[1],s,g={},l=[],u=[],c=[],d=[];if(n.getCustomControl().getAggregation("content")[0].getValue()!==n.getCustomControl().getAggregation("content")[0].getMin()||n.getCustomControl().getAggregation("content")[0].getValue2()!==n.getCustomControl().getAggregation("content")[0].getMax()){a.push(n)}a.forEach(function(e){var t=e.getProperty("key"),o,a;switch(t){case"Available":s=new i("Status",r.EQ,"A");u.push(s);break;case"OutOfStock":s=new i("Status",r.EQ,"O");u.push(s);break;case"Discontinued":s=new i("Status",r.EQ,"D");u.push(s);break;case"Price":o=e.getCustomControl().getAggregation("content")[0].getValue();a=e.getCustomControl().getAggregation("content")[0].getValue2();s=new i("Price",r.BT,o,a);c.push(s);g["priceKey"]={Price:true};break;default:s=new i("SupplierName",r.EQ,t);d.push(s)}});if(u.length>0){l.push(new i({filters:u}))}if(c.length>0){l.push(new i({filters:c}))}if(d.length>0){l.push(new i({filters:d}))}s=new i({filters:l,and:true});if(l.length>0){o.filter(s);this.byId("categoryInfoToolbar").setVisible(true);var h=this.getResourceBundle().getText("filterByText")+" ";var p="";var f=e.getParameter("filterCompoundKeys");var m=Object.assign(f,g);for(var v in m){if(m.hasOwnProperty(v)){h=h+p+this.getResourceBundle().getText(v,[this._iLowFilterPreviousValue,this._iHighFilterPreviousValue]);p=", "}}this.byId("categoryInfoToolbarTitle").setText(h)}else{o.filter(null);this.byId("categoryInfoToolbar").setVisible(false);this.byId("categoryInfoToolbarTitle").setText("")}},onFilter:function(){if(!this._pCategoryFilterDialog){this._pCategoryFilterDialog=n.load({id:this.getView().getId(),name:"sap.ui.demo.cart.view.CategoryFilterDialog",controller:this}).then(function(e){this.getView().addDependent(e);e.addStyleClass(this.getOwnerComponent().getContentDensityClass());return e}.bind(this))}this._pCategoryFilterDialog.then(function(e){e.open()})},handleConfirm:function(e){var t=this.byId("categoryFilterDialog").getFilterItems()[1];var i=t.getCustomControl().getAggregation("content")[0];this._iLowFilterPreviousValue=i.getValue();this._iHighFilterPreviousValue=i.getValue2();this._applyFilter(e)},handleCancel:function(){var e=this.byId("categoryFilterDialog").getFilterItems()[1];var t=e.getCustomControl().getAggregation("content")[0];t.setValue(this._iLowFilterPreviousValue).setValue2(this._iHighFilterPreviousValue);if(this._iLowFilterPreviousValue>t.getMin()||this._iHighFilterPreviousValue!==t.getMax()){e.setFilterCount(1)}else{e.setFilterCount(0)}},handleChange:function(e){var t=this.byId("categoryFilterDialog").getFilterItems()[1];var i=t.getCustomControl().getAggregation("content")[0];var r=e.getParameter("range")[0];var o=e.getParameter("range")[1];if(r!==i.getMin()||o!==i.getMax()){t.setFilterCount(1)}else{t.setFilterCount(0)}},handleResetFilters:function(){var e=this.byId("categoryFilterDialog").getFilterItems()[1];var t=e.getCustomControl().getAggregation("content")[0];t.setValue(t.getMin());t.setValue2(t.getMax());e.setFilterCount(0)},compareProducts:function(e){var t=e.getSource().getBindingContext().getObject();var i=this.getModel("comparison").getProperty("/item1");var r=this.getModel("comparison").getProperty("/item2");this._oRouter.navTo("comparison",{id:t.Category,item1Id:i?i:t.ProductId,item2Id:i&&i!=t.ProductId?t.ProductId:r},true)},onBack:function(){var e=this;var t=sap.ui.core.UIComponent.getRouterFor(e);t.navTo("Home",{test:"ADD"})}})});