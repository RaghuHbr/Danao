sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"MDG/Help/util/formatter",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, formatter, MessageBox,MessageToast) {
	"use strict";

	return Controller.extend("MDG.Help.controller.UsersData", {
		formatter: formatter,
		onInit: function () {
			if (!this.valueHelpForApproveRequest)
				this.valueHelpForApproveRequest = new sap.ui.xmlfragment("MDG.Help.fragment.valueHelpForApproveRequest", this);
			this.getView().addDependent(this.valueHelpForApproveRequest);
		},
		onNavBack: function () {
			this.getView().getModel("appView").setProperty("/layout", "OneColumn");
			this.getOwnerComponent().getRouter().navTo("Help");
		},
		handleApproveUserPress: function (evt) {
			var that = this;
			that.selectedApproverData = evt.getSource().getBindingContext("browseByData");
			that.valueHelpForApproveRequest.getContent()[1].getContent()[1].getItems()[0].setValueState("None").setValue();
			that.valueHelpForApproveRequest.open();
		},
		handleApproveButtonPress: function (evt) {
			var that = this;
			if (that.valueHelpForApproveRequest.getContent()[1].getContent()[1].getItems()[0].getValue().length == 0) {
				sap.m.MessageToast.show("Please enter the discount value");
				that.valueHelpForApproveRequest.getContent()[1].getContent()[1].getItems()[0].setValueState("Error");
			} else {
				that.selectedApproverData.getObject().Status = "Approved";
				that.selectedApproverData.getObject().DiscountValue = that.valueHelpForApproveRequest.getContent()[1].getContent()[1].getItems()[0].getValue()+"%";
				that.selectedApproverData.getModel().updateBindings(true);
				that.valueHelpForApproveRequest.close();
				sap.m.MessageBox.success("User has been Approved successfully");
			}
		},
		handleRejectButtonPress: function (evt) {
			var that = this;
			that.selectedApproverData.getObject().Status = "Rejected";
			that.selectedApproverData.getModel().updateBindings(true);
			that.valueHelpForApproveRequest.close();
			sap.m.MessageBox.error("User has been Rejected successfully");
		}

	});

});