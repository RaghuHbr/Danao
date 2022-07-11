sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/Filter","sap/ui/model/FilterOperator","sap/ui/Device"],function(t,e,i,o){"use strict";return t.extend("MDG.Help.controller.Home",{onInit:function(){var t=this.getOwnerComponent();this._router=t.getRouter();this._router.getRoute("Home").attachMatched(this._onRouteMatched,this)},_onRouteMatched:function(){},onSearch:function(){this._search()},onRefresh:function(){var t=this.byId("productList");var e=t.getBinding("items");var i=function(){this.byId("pullToRefresh").hide();e.detachDataReceived(i)}.bind(this);e.attachDataReceived(i);this._search()},_search:function(){var t=this.getView();var o=t.byId("productList");var r=t.byId("categoryList");var n=t.byId("searchField");var a=n.getValue().length!==0;o.setVisible(a);r.setVisible(!a);var s=o.getBinding("items");if(s){if(a){var c=new e("Name",i.Contains,n.getValue());s.filter([c])}else{s.filter([])}}},onCategoryListItemPress:function(t){var e=t.getParameter("listItem");this.handleNavigation(e)},handleNavigation:function(t){var e=this;e.getOwnerComponent().getRouter().navTo("category",{category:"category"})},onProductListSelect:function(t){var e=t.getParameter("listItem");this._showProduct(e)},onProductListItemPress:function(t){var e=t.getSource();this._showProduct(e)},_showProduct:function(t){var e=t.getBindingContext().getObject();this._router.navTo("product",{id:e.Category,productId:e.ProductId},!o.system.phone)},onBack:function(){var t=this;var e=sap.ui.core.UIComponent.getRouterFor(t);e.navTo("Master",{id:"back"})}})});