sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"MDG/Help/util/formatter",
			"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/Sorter"

], function (Controller, formatter, Filter, FilterOperator, Sorter) {


	return Controller.extend("MDG.Help.controller.MasterUser", {
		formatter: formatter,
		onInit: function () {
			var that = this;

			this.handleUserData();
		},
		handleUserData: function () {
			var that = this;
			$.ajax({
				url: "/DanaoStrapi/api/users?populate=*",

				type: 'GET',
				"headers": {
					"content-type": "application/json"
				},
				dataType: 'json', // added data type
				success: function (res) {
					var userArr = [];
					for (var i = 0; i < res.data.length; i++) {
						var obj = {
							id: res.data[i].id,
							firstName: res.data[i].firstName,
							company: res.data[i].company,
							status: res.data[i].status

						};
						userArr.push(obj);

					}

					that.getView().setModel(new sap.ui.model.json.JSONModel(userArr), "UserNameModel");

				}
			});
		},
		
		onSearch: function (evt) {
				var searchString = this.getView().byId("userSearchId").getValue();
				var binding = this.getView().byId("itemlistId").getBinding("items");
				if (searchString && searchString.length > 0) {
					var filter1 = new Filter("firstName", "Contains", searchString);
					var filter2 = new Filter("lastName", "Contains", searchString);
					var filter3 = new Filter("status", FilterOperator.EQ, searchString);
					var filter4 = new Filter("company", "Contains", searchString);
					var searchFilter = [filter1, filter2, filter3, filter4];
					var newfilter = new sap.ui.model.Filter(searchFilter, false);
					var afilters = [];
					afilters.push(newfilter);
					binding.filter(afilters);
				}else {
					var afil=[];
					binding.filter(afil);
				}
			},

		handleUsersListPress: function (oEvent) {
			//	var that = this;
			//	MessageToast.show("Title clicked");
			//	this.onCloseDetailPress();
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.index = oEvent.getSource().getSelectedContextPaths()[0].split("/")[1];
			var test = oEvent.getSource().getSelectedItem().getBindingContext("UserNameModel").getObject().id;
			this.getView().getModel("appView").updateBindings(true);
			this.getView().getModel("appView").setProperty("/indexNo", this.index);
			this.getOwnerComponent().getRouter().navTo("DetailUser", {
				id: test,
				module: this.index

			});
		},

		onNavBack: function () {
			this.getView().getModel("appView").setProperty("/layout", "OneColumn");
			this.getOwnerComponent().getRouter().navTo("Help");
		}
	});

});