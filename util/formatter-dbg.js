jQuery.sap.require("sap.ui.core.format.DateFormat");
sap.ui.define([], function () {
	"use strict";
	return {
		getQuotationState: function (status) {
			if (status == "Draft") {
				return "Warning";
			} else if (status == "Submitted") {
				return "Success";
			} else {
				return "Error";
			}
		},
		getUserStatus: function (status) {
			if (status == "Pending") {
				return "Warning";
			} else if (status == "Approved") {
				return "Success";
			} else {
				return "Error";
			}
		},
		getuserShowStatus: function (status) {
			if (status == "PENDING") {
				return "Warning";
			} else if (status == "APPROVED") {
				return "Success";
			} else {
				return "Error";
			}
		},
		getApproveButtonVisibility: function (status) {
			if (status === "PENDING")
				return true;
			else
				return false;
		},
		getCartVisibility: function (data) {
			if (data === undefined)
				return false;
			else
				return true;
		},
		dateFormatter: function (value) {
			if (value) {
				var oDateFormat = sap.ui.core.format.DateFormat.getDateTimeInstance({
					pattern: "MM/dd/yyyy"
				});
				return oDateFormat.format(new Date(value));
			} else
				return value;
		},
		getDiscountPrice: function (price, discount) {
			if (price && discount) {
				return Math.round((discount / 100) * price);
			} else
				return "";

		}
	};
});