sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/Context",
	"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",

	"sap/ui/export/library",
	"sap/ui/export/Spreadsheet"
], function (Controller, Context, Fragment, JSONModel, MessageToast, MessageBox, Filter, FilterOperator, Spreadsheet) {
	"use strict";

	return Controller.extend("MDG.Help.controller.detailDetail", {
	
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf MDG.Program.view.detailDetail
		 */
		onInit: function () {

			var i18nModel = this.getOwnerComponent().getModel("i18n");
			var ViewModel = {
				isProjectArchived: false,
				isProjectCancelled: false,
				isProjectEditable: false,
				isCRUDBtnsVisible: false,
				isRetriveVisible: false

			};
			
			var model = new JSONModel(ViewModel);
			this.getView().setModel(model, "DetailDetailView");
			// if (!this.EditProject) {
			// 	this.EditProject = sap.ui.xmlfragment(this.getView().getId(), "MDG.Program.fragment.EditProject", this);
			// 	this.EditProject.setModel(i18nModel, "i18n");
			// 	var customerModel = new JSONModel(this.getOwnerComponent().getModel("customerdata").getData());
			// 	//var customerModel = new JSONModel(this.getOwnerComponent().getModel("customerInfo").getData());
			// 	this.EditProject.getContent()[0].getContent()[14].setModel(customerModel);
			// 	//this.EditProject.setModel(customerModel);
			// 	var vendorsModel = new JSONModel(this.getOwnerComponent().getModel("vendorInfo").getData());
			// 	this.EditProject.getContent()[0].getContent()[11].setModel(vendorsModel);
			// 	//this.EditProject.setModel(vendorsModel);
			// 	this.getView().addDependent(this.EditProject);
			// }
			this.getOwnerComponent().getRouter().getRoute("detailDetail").attachPatternMatched(function (oEvent) {
				var usersModel = this.getOwnerComponent().getModel();

				var programJSONRoot = "/programs/";
				var projectJSONSRoot = "/Projects/";

				this.programObjectPath = oEvent.getParameter("arguments").ProgramPath;
				this.projectObjectPath = oEvent.getParameter("arguments").ProjectId;

				var oContext = new Context(usersModel, programJSONRoot + this.programObjectPath + projectJSONSRoot + this.projectObjectPath);
				this.getView().setBindingContext(oContext);
				this.users = oContext.getObject();
				if (oContext.getObject().status == "Archived") {
					this.getView().getModel("DetailDetailView").setProperty("/isProjectArchived", false);
					this.getView().getModel("DetailDetailView").setProperty("/isProjectCancelled", false);
					this.getView().getModel("DetailDetailView").setProperty("/isCRUDBtnsVisible", false);
					this.getView().getModel("DetailDetailView").setProperty("/isRetriveVisible", true);
				} else if (oContext.getObject().status == "Cancelled") {
					this.getView().getModel("DetailDetailView").setProperty("/isProjectCancelled", false);
					this.getView().getModel("DetailDetailView").setProperty("/isProjectArchived", false);
					this.getView().getModel("DetailDetailView").setProperty("/isCRUDBtnsVisible", false);
					this.getView().getModel("DetailDetailView").setProperty("/isRetriveVisible", true);
				} else {
					this.getView().getModel("DetailDetailView").setProperty("/isProjectCancelled", true);
					this.getView().getModel("DetailDetailView").setProperty("/isProjectArchived", true);
					this.getView().getModel("DetailDetailView").setProperty("/isCRUDBtnsVisible", true);
					this.getView().getModel("DetailDetailView").setProperty("/isRetriveVisible", false);
				}
				this.getView().getModel("DetailDetailView").updateBindings(true);
				this.teamMemRoles();
			}, this);

		},
		// onConfirmCustomer: function (oEvent) {
		// 	var that = this;
		// 	this.CustomerObj = "";
		// 	var oCustomer = oEvent.getSource().getSelectedKey();

		// 	this.getOwnerComponent().getModel("customerdata").getData().forEach(function (item, index) {
		// 		//this.getOwnerComponent().getModel("customerInfo").getData().forEach(function (item, index) {
		// 		if (item.customerName == oCustomer) {
		// 			that.CustomerObj = item;

		// 		}
		// 	});
		// 	this.EditProject.getContent()[0].getContent()[11].setValue(oCustomer);
		// 	//this.getView().getModel().updateBindings(true);
		// },
		onConfirmVendorsPress: function (oEvent) {
			var that = this;
			this.VendorsObj = "";
			var selKey = oEvent.getSource().getSelectedKey();
			this.getView().getModel().getData().assignedVendors = [];
			//	this.getView().getModel().getData().assignedVendors.push(oEvent.getParameters().selectedItems[0]);
			this.getOwnerComponent().getModel("vendorInfo").getData().forEach(function (item, index) {
				if (item.vendor_Name == selKey) {
					that.VendorsObj = item;

				}
			});

			this.EditProject.getContent()[0].getContent()[14].setValue(oEvent.getSource().getSelectedKey());
			//	this.getView().getModel().updateBindings(true);

		},

		//handle print of customer to excel -------sathish-----
		// Snippet from my controller
		// toExcel: function () {
		//   var oExport = new Export({
		//     exportType: new ExportTypeCSV({ // required from "sap/ui/core/util/ExportTypeCSV"
		//       separatorChar: ",",
		//       charset: "utf-8"
		//     }),
		// // var model = that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath];
		//     //models: this.getView().getModel("oListOrderMod_rent"),
		//     models: this.getView().byId("CustomersTable"),
		//     rows: { path:'customer/'},
		//     columns: [
		//       {
		//         name: "Name",
		//         template: {
		//           content: "{name}"
		//         }
		//       },
		//       {
		//         name: "Email",
		//         template: {
		//           content: "{email}"
		//         }
		//       },
		//        {
		//         name: "Contact",
		//         template: {
		//           content: "{contact}"
		//         }
		//       },
		//        {
		//         name: "City",
		//         template: {
		//           content: "{city}"
		//         }
		//       },
		//        {
		//         name: "Country",
		//         template: {
		//           content: "{country}"
		//         }
		//       }

		//     ]
		//   });
		//  oExport.saveFile().catch(function(oError) {
		//    MessageBox.error("Error when downloading data. ..." + oError);
		//  }).then(function() {
		//    oExport.destroy();
		//  });
		//},
		createColumns: function (i) {
			if (i == 1) {
				return [{
					label: "Name",
					property: "customerName"
				}, {
					label: "Email",
					property: "email"
				}, {
					label: "Contact",
					property: "contact"
				}, {
					label: "City",
					property: "city"
				}, {
					label: "Country",
					property: "country"
				}];
			}
			if (i == 2) {
				return [{
					label: "Name",
					property: "vendor_Name"
				}, {
					label: "Email",
					property: "vendor_email"
				}, {
					label: "Contact",
					property: "vendor_contact"
				}, {
					label: "City",
					property: "vendor_city"
				}, {
					label: "Country",
					property: "vendor_country"
				}];
			}
			if (i == 3) {
				return [{
					label: "Team Members",
					property: "firstName"
				}, {
					label: "Contact",
					property: "contact"
				}, {
					label: "Email",
					property: "email"
				}, {
					label: "Role",
					property: "role"
				}];
			}
			if (i == 4) {
				return [{
					label: "Milestone Name",
					property: "milestoneName"
				}, {
					label: "Milestone Description",
					property: "milestonedes"
				}, {
					label: "Start Date",
					property: "startDate_M"
				}, {
					label: "End Date",
					property: "endDate_M"
				}];
			}
		},

		onExport: function (oEvent) {

			//var binding = this.byId("CustomersTable").getBinding("items");
			var id = oEvent.getSource().getId().split("--")[1];
			var oData, oSheet;
			if (id == 'downloadButtonIDCustomers') {
				oData = this.getView().getBindingContext().getObject().customer;
				oSheet = new sap.ui.export.Spreadsheet({
					workbook: {
						columns: this.createColumns(1)
					},
					dataSource: oData,
					fileName: "customer.xlsx"
				});
				oSheet.build();
			}
			if (id == 'downloadButtonIDVendors') {
				oData = this.getView().getBindingContext().getObject().assignedVendors;
				oSheet = new sap.ui.export.Spreadsheet({
					workbook: {
						columns: this.createColumns(2)
					},
					dataSource: oData,
					fileName: "vendor.xlsx"
				});
				oSheet.build();

			}
			if (id == 'downloadButtonIDteammember') {
				oData = this.getView().getBindingContext().getObject().assigned_teammember;
				oSheet = new sap.ui.export.Spreadsheet({
					workbook: {
						columns: this.createColumns(3)
					},
					dataSource: oData,
					fileName: "TeamMember.xlsx"
				});
				oSheet.build();

			}
			if (id == 'downloadButtonIDmilestone') {
				oData = this.getView().getBindingContext().getObject().milestones;
				oSheet = new sap.ui.export.Spreadsheet({
					workbook: {
						columns: this.createColumns(4)
					},
					dataSource: oData,
					fileName: "Milestone.xlsx"
				});
				oSheet.build();

			}
		},

		//handles print of Tasks Report
		handlePrintTask: function () {
			var oTarget = this.getView().byId("vBxReport"),
				$domTarget = oTarget.$()[0],
				sTargetContent = $domTarget.innerHTML;
			var printWindow = window.open("", "", "height=800,width=800");
			// Constructing the report window for printing
		printWindow.document.write("<html><head><title></title>");
			printWindow.document.write("<link rel='stylesheet' href='applications/Manage_Programs/webapp/css/style.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/ui/core/themes/sap_belize_plus/library.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/ui/layout/themes/sap_belize_plus/library.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/ui/unified/themes/sap_belize_plus/library.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/ui/table/themes/sap_belize_plus/library.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/suite/ui/commons/themes/sap_belize_plus/library.css'>"
			);
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/m/themes/sap_belize_plus/library.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/tnt/themes/sap_belize_plus/library.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/f/themes/sap_belize_plus/library.css'>");
			printWindow.document.write(
				"<link rel='stylesheet' href='https://sapui5.hana.ondemand.com/resources/sap/viz/themes/sap_belize_plus/library.css'>");
			printWindow.document.write('</head><body >');
			printWindow.document.write(sTargetContent);
			printWindow.document.write('</body></html>');
			// Giving time for rendering the page
			setTimeout(function () {
				printWindow.print();
			}, 2000);
			// Automatically closing the preview window once the user has pressed the "Print" or, "Cancel" button.
			printWindow.onafterprint = function () {
				setTimeout(function () {
						printWindow.close();
				}, 4000);
			};
		},
		handleAddProject: function (evt) {
			var that = this;
			var that = this;
			var Err = this.ValidateEditAddProjectFragment();
			if (Err == 0) {
				var vendorsObjModel = that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath].assignedVendors;
				var vendorToUpdate = that.VendorsObject == undefined ? vendorsObjModel : that.VendorsObject;
				that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath].assignedVendors =
					vendorToUpdate;
				// that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath].assignedVendors.push(
				// 	vendorToUpdate);
				if (!that.CustomerObject == "") {
					var model = that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath];
					var custObj = model.customer;
					model.customer = this.CustomerObject == undefined ? custObj : this.CustomerObject;
				}
				this.getView().getModel().updateBindings(true);
				this.EditProject.close();
				// this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("detailList", {
					objectId: this.programObjectPath
				});
			} else {
				sap.m.MessageBox.error("Please fill Mandatory fields.");
			}
		},
		// onValueHelpRequestCustomer: function () {
		// 	var that = this;
		// 	if (!this.SelectCustomerDialog) {
		// 		this.SelectCustomerDialog = sap.ui.xmlfragment("MDG.Program.fragment.SelectCustomerDialog", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.SelectCustomerDialog);
		// 	}
		// 	this.EditProject.getContent()[0].getContent()[11].setModel(new JSONModel([]));
		// 	var fragmentModel = new sap.ui.model.json.JSONModel(this.getOwnerComponent().getModel("customerInfo").getData());
		// 	this.SelectCustomerDialog.setModel(fragmentModel);
		// 	this.SelectCustomerDialog.open();
		// },
		onSelectCustomer: function (evt) {
			var that = this;
			var aContexts = evt.getParameter("selectedContexts");
			that.CustomerObject = [];
			evt.getParameters().selectedContexts.forEach(function (obj, index) {
				var appPresent = false;
				if (that.CustomerObject) {
					var access = that.CustomerObject;
					for (var i = 0; i < access.length; i++) {
						if (access[i].customerName == obj.getObject().customerName) {
							appPresent = true;
							break;
						}
					}
				}
				if (!appPresent)
					that.CustomerObject.push(obj.getObject());
			});
			//	this.AddProject.getModel().getData()["SelVendors"]= this.VendorsObject;
			this.EditProject.getContent()[0].getContent()[11].setModel(new JSONModel(this.CustomerObject));
			this.EditProject.getModel().updateBindings(true);

		},
		openEditProject: function (evt) {
			var that = this;
			var ObjData = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath];

			var fragmentModel = new sap.ui.model.json.JSONModel(ObjData);
			this.EditProject.setModel(fragmentModel);
			this.EditProject.getContent()[0].getContent()[14].setModel(new JSONModel(ObjData.assignedVendors));
			this.EditProject.getContent()[0].getContent()[11].setModel(new JSONModel(ObjData.customer)); //setSelectedKey(ObjData.customer.customerName);
			this.EditProject.open();
		},
		// onValueHelpRequestVendor: function () {
		// 	var that = this;
		// 	if (!this.SelectVendorsDialog) {
		// 		this.SelectVendorsDialog = sap.ui.xmlfragment("MDG.Program.fragment.SelectVendorsDialog", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.SelectVendorsDialog);
		// 	}
		// 	this.EditProject.getContent()[0].getContent()[14].setModel(new JSONModel([]));
		// 	var fragmentModel = new sap.ui.model.json.JSONModel(this.getView().getModel("vendorInfo").getData());
		// 	this.SelectVendorsDialog.setModel(fragmentModel);
		// 	this.SelectVendorsDialog.open();
		// },
		onSelectVendors: function (evt) {
			var that = this;
			var aContexts = evt.getParameter("selectedContexts");
			that.VendorsObject = [];
			evt.getParameters().selectedContexts.forEach(function (obj, index) {
				var appPresent = false;
				if (that.VendorsObject) {
					var access = that.VendorsObject;
					for (var i = 0; i < access.length; i++) {
						if (access[i].vendor_Name == obj.getObject().vendor_Name) {
							appPresent = true;
							break;
						}
					}
				}
				if (!appPresent)
					that.VendorsObject.push(obj.getObject());
			});
			this.EditProject.getContent()[0].getContent()[14].setModel(new JSONModel(this.VendorsObject));
			this.EditProject.getModel().updateBindings(true);

		},
		//onSearch Vendors ValueHelp press
		onSearchVendorsValueHelp: function (evt) {
			this.SelectVendorsDialog.getBinding("items").filter([new sap.ui.model.Filter("vendor_Name", sap.ui.model.FilterOperator.Contains,
				evt.getParameters().value)]);
		},

		// handling delete function on removing 
		handleInputTokenDeleted: function (evt) {
			var that = this;
			this.EditProject.getModel().getData().assignedVendors.forEach(function (obj, index) {
				if (obj.vendor_Name == evt.getParameters().removedTokens[0].getText()) {
					that.EditProject.getModel().getData().assignedVendors.splice(index, 1);
					that.EditProject.getModel().updateBindings(true);
				}
			});
		},
		//Search implimentation of add vendors fragment
		handleSearchAddVendorsFragment: function (evt) {
			this.assignedVendors.getBinding("items").filter([new sap.ui.model.Filter("vendor_Name", sap.ui.model.FilterOperator.Contains,
				evt.getParameters().value)]);
		},
		//Search implimentation of add Team member fragment
		handleSearchAddTeamMem: function (evt) {
			this.assignTeamFragment.getBinding("items").filter([new sap.ui.model.Filter("tmName", sap.ui.model.FilterOperator.Contains,
				evt.getParameters().value)]);
		},
		//Search implimentation select task Value help fragment
		onSearchSelectTaskValueHelp: function (evt) {
			this.SelectTaskDialog.getBinding("items").filter([new sap.ui.model.Filter("taskName", sap.ui.model.FilterOperator.Contains,
				evt.getParameters().value)]);
		},
		handleProjectCancel: function (evt) {
			var that = this;
			this.EditProject.close();
		},
		fullScreen: function () 
		{
			this.getView().getModel("appView").setProperty("/layout", "EndColumnFullScreen");
			this.byId("enterFullScreen").setVisible(false);
			this.byId("exitFullScreen").setVisible(true);
		},
		

		exitFullScreen: function () {
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.byId("exitFullScreen").setVisible(false);
			this.byId("enterFullScreen").setVisible(true);
		},

		onCloseDetailPress: function () {
			// this.getOwnerComponent().getModel("appView").getProperty("/DetailListThis").getView().byId("list2").removeSelections();
			// var bFullScreen = this.getView().getModel("appView").getProperty("/actionButtonsInfo/midColumn/fullScreen");
			// this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", !bFullScreen);
			// this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			this.getView().getModel("appView").setProperty("/actionButtonsInfo/midColumn/fullScreen", false);
			var tile = this.getView().getModel("appView").oData.tileIndex;
			this.getOwnerComponent().getRouter().navTo("Master", {
				id: tile
			});
		},
		// todelete Project from list 
		openDeleteProject: function (evt) {
			var that = this;
			MessageBox.confirm("Are you sure you want to delete Project?", {
				title: "Confirm Deletion",
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {
					var deleteObj = that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath].id;
					that.getView().getModel().getData().programs[that.programObjectPath].Projects.forEach(function (item, index) {
						if (deleteObj == item.id) {

							that.getView().getModel().getData().programs[that.programObjectPath].Projects.splice(index, 1);
							that.getView().getModel().updateBindings(true);
							MessageToast.show("Project Deleted sucessfully", {
								closeOnBrowserNavigation: false
							});
							that.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
							var oRouter = sap.ui.core.UIComponent.getRouterFor(that);
							oRouter.navTo("detailList", {
								objectId: that.programObjectPath
							});
						}
					});
				}
			});
		},
		handleDeleteUserPress: function () {
			var that = this;
			MessageBox.confirm("Confirm Project Delete", {
				title: "Confirm Deletion",
				icon: MessageBox.Icon.WARNING,
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				emphasizedAction: MessageBox.Action.YES,
				onClose: function (oAction) {

					if (oAction === "YES") {
						var oModel = that.getView().getModel();
						var aUser = oModel.getData();

						var itemIndex = parseInt(that.path, 10);
						aUser.splice(itemIndex, 1);
						oModel.updateBindings(true);
						MessageToast.show("Project Deleted sucessfully", {
							closeOnBrowserNavigation: false
						});
						that.onCloseDetailPress();
					}
				}
			});
		},
		// handleAddPagesAccess: function () {
		// 	if (!this.AddTask) {
		// 		this.AddTask = sap.ui.xmlfragment("MDG.Program.fragment.AddTask", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.AddTask);
		// 	}
		// 	this.AddTask.getContent()[0].getContent()[3].setVisible(true);
		// 	this.AddTask.getContent()[0].getContent()[4].setVisible(false);
		// 	this.AddTask.getContent()[0].getContent()[3].setValue("New");
		// 	var taskModel = new sap.ui.model.json.JSONModel(this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath]
		// 		.tasktable);
		// 	this.AddTask.getContent()[0].getContent()[20].setModel(taskModel);
		// 	this.isEditTask = false;
		// 	this.AddTask.open();
		// },
		OnSelectYesToDepencyPress: function (evt) {
			var that = this;
			if (evt.getSource().getText() == "No") {
				this.AddTask.getContent()[0].getContent()[19].setVisible(false);
				this.AddTask.getContent()[0].getContent()[20].setVisible(false);
			} else {
				this.AddTask.getContent()[0].getContent()[19].setVisible(true);
				this.AddTask.getContent()[0].getContent()[20].setVisible(true);
			}

		},
		onDependencySelect: function (evt) {
			var that = this;
			var selectedTask = evt;
			//

		},
		onDeleteDoc: function (evt) {
			console.log(evt);
		},
		// assignTeamMember: function () {
		// 	if (!this.assignTeamFragment) {
		// 		this.assignTeamFragment = sap.ui.xmlfragment("MDG.Program.fragment.assignTeamMembertoTheProject", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.assignTeamFragment);
		// 	}
		// 	var usersData = this.getOwnerComponent().getModel("users").getData(),
		// 		usersFilteredData = [];
		// 	var assigned_team = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assigned_teammember;
		// 	var flag;
		// 	usersData.forEach(function (user) {
		// 		flag = 0;
		// 		for (var i = 0; i < assigned_team.length; i++) {
		// 			if (user.id === assigned_team[i].id || user.role === 'SuperAdmin') {
		// 				flag = 1;
		// 				break;
		// 			}
		// 		}
		// 		if (!flag)
		// 			usersFilteredData.push(user);
		// 	});
		// 	var TeamMemberModel = new JSONModel(usersFilteredData);
		// 	//	this.assignTeamFragment.getContent()[0].getContent()[14].setModel(TeamMember);
		// 	this.assignTeamFragment.setModel(TeamMemberModel);
		// 	this.assignTeamFragment.open();
		// },
		//on segmented btn change 
		onSelectionChange: function (evt) {
			var that = this;
			var selectedSegBtn = evt.getParameters().item.getKey();
			if (selectedSegBtn == "Teammember") {
				this.AddTask.getContent()[0].getContent()[16].setVisible(true);
				this.AddTask.getContent()[0].getContent()[18].setVisible(false);
				this.AddTask.getContent()[0].getContent()[18].setSelectedKey(" ");
				this.AddTask.getContent()[0].getContent()[19].setVisible(false);
			} else if (selectedSegBtn == "Vendor") {
				this.AddTask.getContent()[0].getContent()[16].setVisible(false);
				this.AddTask.getContent()[0].getContent()[16].setSelectedKey(" ");
				this.AddTask.getContent()[0].getContent()[18].setVisible(true);
			} else {
				this.AddTask.getContent()[0].getContent()[18].setVisible(true);
				this.AddTask.getContent()[0].getContent()[16].setVisible(true);
			}
		},
		onTeamMemberRoleChange: function (evt) {
			var that = this;
			var selKey = evt.getSource().getSelectedKey();
			evt.getSource().getBindingContext("TeamMember").getObject().tmRole = selKey;
			this.getView().getModel().updateBindings(true);
		},
		// addVendors: function () {
		// 	if (!this.assignedVendors) {
		// 		this.assignedVendors = sap.ui.xmlfragment("MDG.Program.fragment.addVendortoProject", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.assignedVendors);
		// 	}
		// 	this.assignedVendors.open();
		// },
		// addcustomer: function () {
		// 	if (!this.assignedCustomers) {
		// 		this.assignedCustomers = sap.ui.xmlfragment("MDG.Program.fragment.addCustomerToProject", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.assignedCustomers);
		// 	}
		// 	var customerModel = new JSONModel(this.getOwnerComponent().getModel("customerInfo").getData());
		// 	this.assignedCustomers.setModel(customerModel);
		// 	this.assignedCustomers.open();
		// },
		handleAppListSearch: function (evt) {
			if (evt.getParameter("value").length > 0)
				var data = [new sap.ui.model.Filter("application", "Contains", evt.getParameter("value"))];
			else
				var data = [];
			this.AddTask.getBinding("items").filter(data);

		},
		handleEditUserPress: function () {

			var userObj = this.getView().getBindingContext().getObject();
			this.AdduserFragment.getContent()[0].getContent()[1].setValue(userObj.firstName);
			this.AdduserFragment.getContent()[0].getContent()[3].setValue(userObj.lastname);
			this.AdduserFragment.getContent()[0].getContent()[5].setValue(userObj.email);
			this.AdduserFragment.getContent()[0].getContent()[7].setValue(userObj.contact);
			this.AdduserFragment.getContent()[0].getContent()[9].setValue(userObj.city);
			this.AdduserFragment.getContent()[0].getContent()[11].setValue(userObj.zipCode);
			this.AdduserFragment.getContent()[0].getContent()[13].setSelectedKey(userObj.role);
			this.AdduserFragment.getContent()[0].getContent()[15].setValue(userObj.address);
			//this.addNewUser.getContent()[2].getContent()[9].setSelectedKey(userObj.roletype);
			this.AdduserFragment.open();

		},
		handleAddUserCancelPress: function () {
			this.AddTask.getContent()[0].getContent()[14].setSelectedKey(null);
			this.AddTask.getContent()[0].getContent()[16].setSelectedKey(null);
			this.AddTask.getContent()[0].getContent()[12].setValue(null);
			this.AddTask.getContent()[0].getContent()[10].setValue(null);
			this.AddTask.getContent()[0].getContent()[8].setValue(null);
			this.AddTask.getContent()[0].getContent()[3].setValue(null);
			this.AddTask.getContent()[0].getContent()[1].setValue(null);
			this.AddTask.getContent()[0].getContent()[6].setValue(null);

			this.AddTask.close();
		},
		handleSearch: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("Name", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		handleSearchCustomerPress: function (oEvent) {
			var sValue = oEvent.getParameter("value");
			var oFilter = new Filter("customerName", FilterOperator.Contains, sValue);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([oFilter]);
		},
		/*onaddTeamConfirm: function (oEvent) {
			var itemPresent = false;
			var leng = oEvent.getParameters().selectedItems.length;
			for (var i = 0; i < leng; i++) {
				var oSelected = oEvent.getParameters().selectedItems[i].getBindingContext().getObject();
				var tableItems = this.getView().byId("assignTeamMembers").getItems();
				for (var j = 0; j < tableItems.length; j++) {
					if (tableItems[j].getCells()[0].getText() == (oSelected.firstName + " " + oSelected.lastname)) {
						itemPresent = true;
						break;
					}
				}
				if (!itemPresent) {
					this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assigned_teammember.push(
						oSelected);
					var assignmtm = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assigned_teammember;
					assignmtm[assignmtm.length - 1].role = oEvent.getParameters().selectedItems[i].getCells()[3].getSelectedKey();
					this.getView().getModel().updateBindings(true);
					var oBinding = oEvent.getSource().getBinding("items");
					oBinding.filter([]);
					this.getView().getModel().refresh();
				}
			}
			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length && itemPresent == false) {
				MessageToast.show("Team Member Added Successfully!");
			} else
				MessageToast.show("Team Member is already present!");

		},*/
		onaddTeamConfirm: function (oEvent) {
			if (oEvent.getParameters().selectedItems.length > 0) {
				for (var i = 0; i < oEvent.getParameters().selectedItems.length; i++) {
					var obj = oEvent.getParameters().selectedItems[i].getBindingContext().getObject();
					obj.role = oEvent.getParameters().selectedItems[i].getCells()[3].getSelectedKey();
					this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assigned_teammember.push(
						obj);
				}
				this.getView().getModel().updateBindings(true);
				MessageToast.show("Team Member Added Successfully!");
			} else {
				MessageToast.show("Please select a member to add to project!");
			}
		},
		// handleListItemPress: function (evt) {
		// 	var that = this;
		// 	this.isEditTask = true;
		// 	this.taskPath = evt.getSource().getBindingContext().sPath.split("/")[6];
		// 	if (!this.AddTask) {
		// 		this.AddTask = sap.ui.xmlfragment("MDG.Program.fragment.AddTask", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.AddTask);
		// 	}
		// 	var taskStatData = [{
		// 		"taskStatus": "New"
		// 	}, {
		// 		"taskStatus": "In Progress"
		// 	}, {
		// 		"taskStatus": "Completed"
		// 	}];
		// 	var taskStatusModel = new sap.ui.model.json.JSONModel(taskStatData);
		// 	var fragmentModel = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].tasktable[
		// 		this.taskPath];
		// 	this.AddTask.getContent()[0].getContent()[3].setVisible(false);
		// 	this.AddTask.getContent()[0].getContent()[4].setVisible(true);
		// 	this.AddTask.getContent()[0].getContent()[4].setModel(taskStatusModel);
		// 	this.AddTask.getContent()[0].getContent()[4].setSelectedKey(fragmentModel.taskStatus);

		// 	this.AddTask.getContent()[0].getContent()[12].setValue(fragmentModel.deadLineDate);
		// 	this.AddTask.getContent()[0].getContent()[10]
		// 		.setValue(fragmentModel.endDate);
		// 	this.AddTask.getContent()[0].getContent()[8].setValue(fragmentModel.startDate);

		// 	this.AddTask.getContent()[0].getContent()[1].setValue(fragmentModel.taskName);
		// 	this.AddTask.getContent()[0].getContent()[6].setValue(
		// 		fragmentModel.taskdesp);
		// 	this.AddTask.open();

		// },
		onConfirm: function (oEvent) {

			var itemPresent = false;
			var selecetedVendorPath = oEvent.getParameters().selectedItems[0].getBindingContextPath().split("/")[1];
			var oSelected = oEvent.getParameters().selectedItems[0].getBindingContext("vendorInfo").getObject();
			var tableItems = this.getView().byId("vendorTable").getItems();
			for (var j = 0; j < tableItems.length; j++) {
				if (tableItems[j].getCells()[0].getText() == oSelected.vendor_Name) {
					itemPresent = true;
					break;
				}
			}
			if (!itemPresent)
				this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assignedVendors.push(
					oSelected);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);
			this.getView().getModel().refresh();

			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length && itemPresent == false) {
				MessageToast.show("Vendor Added Successfully!");
			} else
				MessageToast.show("Vendor is already present!");

		},
		onConfirmCustomer: function (oEvent) {

			var itemPresent = false;
			var selecetedCustPath = oEvent.getParameters().selectedItems[0].getBindingContextPath("customerdata").split("/")[1];
			var oSelected = oEvent.getParameters().selectedItems[0].getBindingContext("customerdata").getObject(); //.customer[selecetedCustPath];
			var tableItems = this.getView().byId("CustomersTable").getItems();
			for (var j = 0; j < tableItems.length; j++) {
				if (tableItems[j].getCells()[0].getText() == oSelected.customerName) {
					itemPresent = true;
					break;
				}
			}
			if (!itemPresent)
				this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].customer.push(
					oSelected);
			var oBinding = oEvent.getSource().getBinding("items");
			oBinding.filter([]);
			this.getView().getModel().updateBindings(true);
			this.getView().getModel().refresh();

			var aContexts = oEvent.getParameter("selectedContexts");
			if (aContexts && aContexts.length && itemPresent == false) {
				MessageToast.show("Customer Added Successfully!");
			} else
				MessageToast.show("Customer is already present!");

		},
		vendorFragmentCancelPress: function () {
			// this.valueHelpForNewUser.getContent()[2].getContent()[5].setValueState("None");
			this.assignedVendors.close();
		},

		assignTeamMemberFragmentCancelPress: function () {
			// this.valueHelpForNewUser.getContent()[2].getContent()[5].setValueState("None");
			this.assignTeamFragment.close();
		},

		handleAddTaskOkPress: function () {
			var that = this;
			var taskStatus;
			if (this.isEditTask) {
				var userData = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath];
				var formData = this.AddTask.getContent()[0].getContent();
				if (formData[3].getValue() == "") {
					taskStatus = formData[4].getValue();
				} else {
					taskStatus = formData[3].getValue();
				}
				var obj = {
					assignedTeamMember: formData[16].getSelectedKey(),
					assignedTo: formData[18].getSelectedKey(),
					deadLineDate: formData[12].getValue(),
					endDate: formData[10].getValue(),
					startDate: formData[8].getValue(),
					taskStatus: taskStatus,
					taskName: formData[1].getValue(),
					taskdesp: formData[6].getValue(),
					dependentTask: formData[21].getSelectedItem() == null ? '' : formData[21].getSelectedItem().getText(),
					assignedvendor: formData[18].getSelectedKey()
				};
				//	userData.tasktable[parseInt(this.taskPath)] = obj;
				userData.tasktable.splice(parseInt(this.taskPath), 1);
				userData.tasktable.splice(parseInt(this.taskPath), 0, obj);
				//	userData.tasktable[this.taskPath]=obj;
			} else {

				var userData = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath];

				var formData = this.AddTask.getContent()[0].getContent();
				if (formData[3].getValue() == "") {
					taskStatus = formData[4].getValue();
				} else {
					taskStatus = formData[3].getValue();
				}
				var obj = {
					assignedTeamMember: formData[16].getSelectedKey(),
					assignedTo: formData[18].getSelectedKey(),
					deadLineDate: formData[12].getValue(),
					endDate: formData[10].getValue(),
					startDate: formData[8].getValue(),
					taskStatus: taskStatus,
					taskName: formData[1].getValue(),
					taskdesp: formData[6].getValue(),
					dependentTask: formData[21].getSelectedItem() == null ? '' : formData[21].getSelectedItem().getText(),
					assignedvendor: formData[18].getSelectedKey()
				};
				userData.tasktable.push(obj);
			}
			this.getView().getModel().updateBindings(true);
			this.handleAddUserCancelPress();
			//this.AddTask.close();
		},
		userNameClicked: function (evt) {
			var that = this;

			this.getView().getModel("appView").setProperty("/layout", "ThreeColumnsEndExpanded");
			this.getOwnerComponent().getRouter().navTo("ProccessFlowView");

		},
		deleteTeamMember: function (evt) {
			var that = this;
			var selectedContexts = this.getView().byId("assignTeamMembers").getSelectedContexts();
			var selectedItemsData = this.getView().byId("assignTeamMembers").getSelectedItems();
			// var selectedContexts = "0";
			if (selectedContexts.length > 0) {
				var TaskPresentForSelectedItems = false,
					tasksDeletionArr = [];
				var tasks = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].tasktable;
				for (var k = 0; k < tasks.length; k++) {
					for (var c = 0; c < selectedItemsData.length; c++) {
						if (tasks[k].assignedTeamMember == selectedItemsData[c].getCells()[0].getText()) {
							TaskPresentForSelectedItems = true;
							tasksDeletionArr.push(k);
						}
					}
				}
				if (!TaskPresentForSelectedItems) {
					for (var t = selectedContexts.length - 1; t >= 0; t--) {
						this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assigned_teammember.splice(
							selectedContexts[t].sPath.split('/assigned_teammember/')[1], 1);
						try {
							this.getView().byId("assignTeamMembers").getItems()[selectedContexts[t].sPath.split('/assigned_teammember/')[1]].setSelected(
								false);
						} catch (e) {}
					}
					this.getView().getModel().updateBindings(true);
				} else {
					sap.m.MessageBox.warning(
						//	"Selected Team Member are assigned to some tasks, this will delete the assigned tasks the deleted team member. Are you sure you want to delete the Team Member.", {
						"Selected Team Member assigned to some tasks, unable to delete the Team Member.", {

							onClose: function (oEvent) {
								if (oEvent == "OK") {
									// for (var t = selectedContexts.length - 1; t >= 0; t--) {
									// that.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assigned_teammember.splice(
									// 		selectedContexts[t].sPath.split('/assigned_teammember/')[1], 1);
									// 	try {
									// 		that.getView().byId("assignTeamMembers").getItems()[selectedContexts[t].sPath.split('/assigned_teammember/')[1]].setSelected(
									// 			false);
									// 	} catch (e) {}
									// }
									// for (var x = 0; x < tasksDeletionArr.length; x++) {
									// 	this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].tasktable.splice(tasksDeletionArr[x], 1);
									// }
									// that.getView().getModel().updateBindings(true);
								}
							}
						});
				}
			} else {
				sap.m.MessageBox.warning("Please select atleast one item.");
			}
		},
		//adds control to enter new notes
		// addNewNotes: function () {
		// 	var that = this;
		// 	this.editMilestoneFlag = false;
		// 	if (!this.addMileStoneInfo) {
		// 		this.addMileStoneInfo = sap.ui.xmlfragment("MDG.Program.fragment.addMileStoneInfo", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.addMileStoneInfo);
		// 	}
		// 	var milestoneobj = {
		// 		milestoneName: "",
		// 		milestonedes: "",
		// 		startDate_M: "",
		// 		endDate_M: "",
		// 		status: "Success",
		// 		nodes: [],
		// 		lanes: []
		// 	};
		// 	var fragmentModel = new sap.ui.model.json.JSONModel(milestoneobj);
		// 	this.addMileStoneInfo.setModel(fragmentModel);
		// 	this.addMileStoneInfo.open();

		// },
		// OnMileStoneEditPress: function (evt) {
		// 	var that = this;
		// 	this.editMilestoneFlag = true;
		// 	if (!this.addMileStoneInfo) {
		// 		this.addMileStoneInfo = sap.ui.xmlfragment("MDG.Program.fragment.addMileStoneInfo", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.addMileStoneInfo);
		// 	}
		// 	var selObject = evt.getSource().getBindingContext().getObject();
		// 	this.TaskArr = [];
		// 	var tasksLinked = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].tasktable;
		// 	tasksLinked.forEach(function (item, index) {
		// 		if (selObject.milestoneName == item.milestoneName) {
		// 			that.TaskArr.push(item);
		// 		}
		// 	});
		// 	for (var i = 0; i < that.TaskArr.length; i++) {
		// 		this.addMileStoneInfo.getContent()[0].getContent()[5].addToken(new sap.m.Token({
		// 			key: that.TaskArr[i].taskName,
		// 			text: that.TaskArr[i].taskName
		// 		}));
		// 	}
		// 	selObject.nodes = that.TaskArr;
		// 	selObject.lanes = that.TaskArr;
		// 	var editObject = new sap.ui.model.json.JSONModel(selObject);
		// 	this.addMileStoneInfo.setModel(editObject);
		// 	this.addMileStoneInfo.open();
		// },
		// onValueHelpRequest: function () {
		// 	var that = this;
		// 	if (!this.SelectTaskDialog) {
		// 		this.SelectTaskDialog = sap.ui.xmlfragment("MDG.Program.fragment.SelectTaskDialog", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.SelectTaskDialog);
		// 	}
		// 	// if (this.TaskArr != undefined) {
		// 	// 	var fragmentModel = new sap.ui.model.json.JSONModel(that.TaskArr);
		// 	// 	this.SelectTaskDialog.setModel(fragmentModel);
		// 	// } else {
		// 	var fragmentModel = new sap.ui.model.json.JSONModel(this.getView().getModel().getData().programs[this.programObjectPath].Projects[
		// 		this.projectObjectPath].tasktable);
		// 	this.SelectTaskDialog.setModel(fragmentModel);
		// 	//	}
		// 	this.SelectTaskDialog.open();
		// },
		onSelectTask: function (evt) {
			var that = this;
			var aContexts = evt.getParameter("selectedContexts");
			that.appObject = [];
			evt.getParameters().selectedContexts.forEach(function (obj, index) {
				var appPresent = false;
				if (that.appObject) {
					var access = that.appObject;
					for (var i = 0; i < access.length; i++) {
						if (access[i].taskName == obj.getObject().taskName) {
							appPresent = true;
							break;
						}
					}
				}
				if (!appPresent)
					that.appObject.push(obj.getObject());
			});
			this.addMileStoneInfo.getModel().getData()["nodes"] = this.appObject;
			this.addMileStoneInfo.getModel().getData()["lanes"] = this.appObject;
			this.addMileStoneInfo.getModel().updateBindings(true);

		},
		onAdd: function () {
			var that = this;
			var nodeid = 0;
			var lane_Position = 0;
			var err = this.ValidateMilestoneFragmentFields();
			if (err == 0) {
				if (!this.editMilestoneFlag) {
					var FragmentData = this.addMileStoneInfo.getModel().getData();
					for (var i = 0; i < FragmentData.nodes.length; i++) {
						nodeid++;
						FragmentData.nodes[i].id = nodeid;
						FragmentData.nodes[i].lane = lane_Position;
						FragmentData.nodes[i].taskStatus = "In Progress";
						FragmentData.status = "Warning";
						if (nodeid == FragmentData.nodes.length) {
							FragmentData.nodes[i].children = [];
						} else {
							FragmentData.nodes[i].children = [nodeid];
						}

						FragmentData.lanes[i].id = lane_Position;
						FragmentData.lanes[i].position = lane_Position;
						lane_Position++;
					}
					this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].milestones.push(
						FragmentData);
					var taskTable = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].tasktable;
					for (var j = 0; j < FragmentData.nodes.length; j++) {

						for (var k = 0; k < taskTable.length; k++) {
							if ((taskTable[k].taskName == FragmentData.nodes[j].taskName)) {
								taskTable[k].milestoneName = FragmentData.milestoneName;
							}
						}

					}

					//Setting Milestone StartDate and End Date
					if (FragmentData.nodes.length == 1) {
						FragmentData.startDate_M = FragmentData.nodes[0].startDate.split("/").join("-");
						FragmentData.endDate_M = FragmentData.nodes[0].endDate.split("/").join("-");
					} else {
						var dates = [];
						var startDates;
						var endDates;
						for (var a = 0; a < FragmentData.nodes.length; a++) {
							//To get Standared Date Format
							if (FragmentData.nodes[a].startDate.includes("/")) {
								startDates = FragmentData.nodes[a].startDate.split("/").reverse().join("-");
							} else {
								startDates = FragmentData.nodes[a].startDate.split("-").reverse().join("/");
							}
							dates.push(new Date(startDates));
							if (FragmentData.nodes[a].endDate.includes("/")) {
								endDates = FragmentData.nodes[a].endDate.split("/").reverse().join("-");
							} else {
								endDates = FragmentData.nodes[a].endDate.split("-").reverse().join("/");
							}
							dates.push(new Date(endDates));
						}
						var maxDate = (new Date(Math.max.apply(null, dates))).toLocaleDateString('pt-PT');
						var minDate = (new Date(Math.min.apply(null, dates))).toLocaleDateString('pt-PT');
						FragmentData.startDate_M = minDate.split("/").join("-");
						FragmentData.endDate_M = maxDate.split("/").join("-");
					}
				}
				this.getView().getModel().updateBindings(true);
				// this.getView().getModel("ProgramsModel").updateBindings(true);
				this.addMileStoneInfo.close();

			} else {
				sap.m.MessageBox.error("Please fill Mandatory fields.");
			}
		},
		ValidateMilestoneFragmentFields: function () {
			var err = 0;
			if (this.addMileStoneInfo.getContent()[0].getContent()[1].getValue() == "" || this.addMileStoneInfo.getContent()[0].getContent()[
					1]
				.getValue() ==
				null) {
				err++;
			} else {

			}
			if (this.addMileStoneInfo.getContent()[0].getContent()[3].getValue() == "" || this.addMileStoneInfo.getContent()[0].getContent()[
					3]
				.getValue() ==
				null) {
				err++;
			} else {

			}
			if (this.addMileStoneInfo.getContent()[0].getContent()[5].getTokens().length == 0) {
				err++;
			} else {

			}

			return err;
		},
		onClear: function () {
			var that = this;
			var milestoneobj = {
				milestoneName: "",
				milestonedes: "",
				startDate_M: "",
				endDate_M: "",
				status: "Success"
			};
			var fragmentModel = new sap.ui.model.json.JSONModel(milestoneobj);
			this.addMileStoneInfo.setModel(fragmentModel);
			this.addMileStoneInfo.close();

		},
		handleDeleteTask: function (evt) {
			var that = this;

			var SelItemlen = this.getView().byId("pagesAccessId").getSelectedItems().length;
			var tableItems = this.getView().byId("pagesAccessId").getItems();
			if (SelItemlen > 0) {
				var path = this.getView().byId("pagesAccessId").getSelectedContexts()[0].sPath.split("/")[6];
				MessageBox.confirm("Are you sure you want to delete task?", {
					title: "Confirm Deletion",
					icon: MessageBox.Icon.WARNING,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function (oAction) {

						if (oAction === "YES") {
							var oModel = that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath];
							var tasktable = oModel.tasktable;
							var dleteArr = [];
							var index = "";
							for (var k = 0; k < tasktable.length; k++) {
								for (var i = 0; i < SelItemlen; i++) {
									if (tasktable[k].taskName == that.getView().byId("pagesAccessId").getSelectedContexts()[i].getObject().taskName) {
										dleteArr.push(that.getView().byId("pagesAccessId").getSelectedContexts()[i].getObject());
									}
								}
							}
							for (var l = 0; l < dleteArr.length; l++) {
								tasktable.forEach(function (item, index) {
									if (item.taskName == dleteArr[l].taskName) {
										tasktable.splice(index, 1);
									}
								});
							}
							that.byId("pagesAccessId").removeSelections(true);
							that.getView().getModel().updateBindings(true);
							MessageToast.show("Task Deleted sucessfully");
						}
					}
				});
			} else {
				sap.m.MessageBox.warning("Please select atleast one item.");
			}
		},
		OnToggleDeletePress: function () {
			var that = this;
			if (!this.getView().byId("Processflow").getContent()[3].getVisible()) {
				this.getView().byId("Processflow").getContent()[3].setVisible(true);
				this.getView().byId("Processflow").getContent()[1].setVisible(false);
				this.getView().byId("Processflow").getContent()[2].setVisible(false);
			} else {
				this.getView().byId("Processflow").getContent()[3].setVisible(false);
				this.getView().byId("Processflow").getContent()[1].setVisible(true);
				this.getView().byId("Processflow").getContent()[2].setVisible(false);
			}
		},

		ToggleProcessflowView: function (evt) {
			this.getView().byId("processflow").setZoomLevel("One");
			var that = this;
			if (this.getView().byId("chartContainer").getFullScreen()) {
				window.history.go(-1);
			}
			if (evt.getParameters().selectedItem) {
				var sPath = parseInt(evt.getParameters().selectedItem.oBindingContexts.undefined.sPath.split("/")[6]);
				var SelMileStonemodel = that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath].milestones[
					sPath];
				this.getView().getModel("processFlowModel").getData().lanes = [];
				this.getView().getModel("processFlowModel").getData().nodes = [];
				this.getView().getModel("processFlowModel").getData().lanes = SelMileStonemodel.lanes;
				this.getView().getModel("processFlowModel").getData().nodes = SelMileStonemodel.nodes;
				this.getView().getModel("processFlowModel").updateBindings(true);
			}
			if (!this.getView().byId("Processflow").getContent()[2].getVisible()) {
				this.getView().byId("Processflow").getContent()[1].setVisible(false);
				this.getView().byId("Processflow").getContent()[2].setVisible(true);
			} else {
				this.getView().byId("Processflow").getContent()[1].setVisible(true);
				this.getView().byId("Processflow").getContent()[2].setVisible(false);
			}

		},
		onIconTabSel: function (evt) {
			var that = this;
			if (evt.getParameters().selectedKey == "IconTabBarMileStone") {
				this.getView().byId("Processflow").getContent()[1].setVisible(true);
				this.getView().byId("Processflow").getContent()[2].setVisible(false);

			}

		},
		// handleDocumentUpload: function () {
		// 	if (!this.AddDocumentFragment) {

		// 		this.AddDocumentFragment = sap.ui.xmlfragment("MDG.Program.fragment.customerDocument", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.AddDocumentFragment);
		// 	}
		// 	var TaskTable = new JSONModel(this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath]);
		// 	this.AddDocumentFragment.getContent()[0].getContent()[3].setModel(TaskTable);
		// 	var categoryTypeData = [{
		// 		"category": "Metting Minutes (MOM)"
		// 	}, {
		// 		"category": "Document"
		// 	}, {
		// 		"category": "Questionnaire"
		// 	}, {
		// 		"category": "Roadmap/Timeline"
		// 	}, {
		// 		"category": "Assessment"
		// 	}, {
		// 		"category": "Business Process"
		// 	}, {
		// 		"category": "Lean Specification"
		// 	}, {
		// 		"category": "Technical Specification"
		// 	}, {
		// 		"category": "IT Process"
		// 	}];
		// 	var categoryTypeModel = new sap.ui.model.json.JSONModel(categoryTypeData);
		// 	this.AddDocumentFragment.getContent()[0].getContent()[4].setModel(categoryTypeModel);
		// 	this.AddDocumentFragment.open();
		// 	//         this.getOwnerComponent().getModel("appsModel").updateBindings(true);
		// },
		handleAddDocumentOkPress: function () {
			this.fileData.keyword = this.AddDocumentFragment.getContent()[0].getContent()[1].getValue();
			this.fileData.shortDescription = this.AddDocumentFragment.getContent()[0].getContent()[2].getValue();
			this.fileData.LinkedTask = this.AddDocumentFragment.getContent()[0].getContent()[3].getSelectedKey();
			this.fileData.Category = this.AddDocumentFragment.getContent()[0].getContent()[4].getSelectedKey();
			this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].documents.push(this.fileData);
			//	this.handleDocclosePress();
			MessageToast.show("Document added succesfuly.");
			this.getView().getModel().updateBindings(true);
			this.AddDocumentFragment.getContent()[0].getContent()[0].setValue("");
			this.AddDocumentFragment.getContent()[0].getContent()[1].setValue("");
			this.AddDocumentFragment.getContent()[0].getContent()[2].setValue("");
			this.AddDocumentFragment.close();
		},
		collectFileData: function (oEvent) {
			var file = oEvent.getParameter("files")[0];
			this.fileData = {
				fileName: file.name,
				mediaType: file.type,
				url: "",
				keyword: "",
				shortDescription: "",
				LinkedTask: "",
				Category: ""
			};
		},
		OnTaskLinkedChange: function (evt) {
			var that = this;
			var taskName = evt.getSource().getSelectedKey();
			this.fileData.LinkedTask = taskName;

		},
		handleDocclosePress: function () {
			this.AddDocumentFragment.close();
			this.clearDocfragment();
		},
		clearDocfragment: function () {
			//	this.fileData.keyword = this.AddDocumentFragment.getContent()[0].getContent()[0].setValue("");
			this.fileData.keyword = this.AddDocumentFragment.getContent()[0].getContent()[1].setValue("");
			this.fileData.shortDescription = this.AddDocumentFragment.getContent()[0].getContent()[2].setValue("");
			this.fileData.fileName = this.AddDocumentFragment.getContent()[0].getContent()[0].setValue("");
		},
		deleteMileStone: function (evt) {
			var that = this;
			var deleteObj = evt.getSource().getBindingContext().getObject();
			that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath].milestones.forEach(function (
				item, index) {
				if (deleteObj.milestoneName == item.milestoneName) {

					that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath].milestones.splice(index,
						1);
					that.getView().getModel().updateBindings(true);

				}
			});
		},
		deletecustomer: function (evt) {
			var that = this;

			var SelItemlen = this.getView().byId("CustomersTable").getSelectedItems().length;
			var tableItems = this.getView().byId("CustomersTable").getItems();
			if (SelItemlen > 0) {
				var path = this.getView().byId("CustomersTable").getSelectedContexts()[0].sPath.split("/")[6];
				MessageBox.confirm("Are you sure you want to delete customer?", {
					title: "Confirm Deletion",
					icon: MessageBox.Icon.WARNING,
					actions: [MessageBox.Action.YES, MessageBox.Action.NO],
					emphasizedAction: MessageBox.Action.YES,
					onClose: function (oAction) {

						if (oAction === "YES") {
							var oModel = that.getView().getModel().getData().programs[that.programObjectPath].Projects[that.projectObjectPath];
							var tasktable = oModel.customer;
							var dleteArr = [];
							var index = "";
							for (var k = 0; k < tasktable.length; k++) {
								for (var i = 0; i < SelItemlen; i++) {
									if (tasktable[k].customerName == that.getView().byId("CustomersTable").getSelectedContexts()[i].getObject().customerName) {
										dleteArr.push(that.getView().byId("CustomersTable").getSelectedContexts()[i].getObject());
									}
								}
							}
							for (var l = 0; l < dleteArr.length; l++) {
								tasktable.forEach(function (item, index) {
									if (item.customerName == dleteArr[l].customerName) {
										tasktable.splice(index, 1);
									}
								});
							}
							that.getView().getModel().updateBindings(true);
							MessageToast.show("Customer Deleted sucessfully");
						}
					}
				});
			} else {
				sap.m.MessageBox.warning("Please select atleast one item.");
			}
		},
		deleteVendors: function (evt) {
			var that = this;
			var selectedContexts = this.getView().byId("vendorTable").getSelectedContexts();
			if (selectedContexts.length > 0) {
				var selectedItemsData = this.getView().byId("vendorTable").getSelectedItems();
				// var selectedContexts = "0";
				var TaskPresentForSelectedItems = false,
					tasksDeletionArr = [];
				var tasks = this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].tasktable; //this.getView().getModel().getData()[this.path].tasktable;
				for (var k = 0; k < tasks.length; k++) {
					for (var c = 0; c < selectedItemsData.length; c++) {
						if (tasks[k].assignedTo == selectedItemsData[c].getCells()[0].getText()) {
							TaskPresentForSelectedItems = true;
							tasksDeletionArr.push(k);
						}
					}
				}
				if (!TaskPresentForSelectedItems) {
					for (var t = selectedContexts.length - 1; t >= 0; t--) {
						this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].assignedVendors.splice(
							selectedContexts[t].sPath.split('/assignedVendors/')[1], 1);
						try {
							this.getView().byId("vendorTable").getItems()[selectedContexts[t].sPath.split('/assignedVendors/')[1]].setSelected(false);
						} catch (e) {}
					}
					this.getView().getModel().updateBindings(true);
				} else {
					sap.m.MessageBox.warning(
						//	"Selected Vendors are assigned to some tasks, this will delete the assigned tasks the deleted vendors. Are you sure you want to delete the vendors", {
						"Selected Vendors assigned to some tasks, Unable to delete", {

							onClose: function (oEvent) {
								if (oEvent == "OK") {
									// for (var t = selectedContexts.length - 1; t >= 0; t--) {
									// 	that.getView().getModel().getData()[that.path].assignedVendors.splice(
									// 		selectedContexts[t].sPath.split('/assignedVendors/')[1], 1);
									// 	try {
									// 		that.getView().byId("vendorTable").getItems()[selectedContexts[t].sPath.split('/assignedVendors/')[1]].setSelected(false);
									// 	} catch (e) {}
									// }
									// for (var x = 0; x < tasksDeletionArr.length; x++) {
									// 	that.getView().getModel().getData()[that.path].tasktable.splice(tasksDeletionArr[x], 1);
									// }
									// that.getView().getModel().updateBindings(true);
								}
							}
						});
				}
			} else {
				sap.m.MessageBox.warning("Please select atleast one item.");
			}
		},
		ValidateEditAddProjectFragment: function () {
			var Err = 0;
			if (this.EditProject.getContent()[0].getContent()[2].getValue() == "" || this.EditProject.getContent()[0].getContent()[2].getValue() ==
				null) {
				Err++;
				//	this.EditProject.getContent()[0].getContent()[2].setValueState("Error");
			} else {
				//	this.EditProject.getContent()[0].getContent()[2].setValueState("None");
			}

			if (this.EditProject.getContent()[0].getContent()[4].getValue() == "" || this.EditProject.getContent()[0].getContent()[4].getValue() ==
				null) {
				Err++;
				//	this.EditProject.getContent()[0].getContent()[4].setValueState("Error");
			} else {
				//	this.EditProject.getContent()[0].getContent()[4].setValueState("None");
			}

			if (this.EditProject.getContent()[0].getContent()[6].getValue() == "" || this.EditProject.getContent()[0].getContent()[6].getValue() ==
				null) {
				Err++;
				//	this.EditProject.getContent()[0].getContent()[6].setValueState("Error");
			} else {
				//	this.EditProject.getContent()[0].getContent()[6].setValueState("None");
			}

			if (this.EditProject.getContent()[0].getContent()[8].getValue() == "" || this.EditProject.getContent()[0].getContent()[8].getValue() ==
				null) {
				Err++;
				//	this.EditProject.getContent()[0].getContent()[8].setValueState("Error");
			} else {
				//	this.EditProject.getContent()[0].getContent()[8].setValueState("None");
			}
			if (this.EditProject.getContent()[0].getContent()[11].getTokens().length == 0) {
				Err++;
				//	(this.EditProject.getContent()[0].getContent()[11].setValueState("Error");
			} else {
				//	(this.EditProject.getContent()[0].getContent()[11].setValueState("None");
			}
			if (this.EditProject.getContent()[0].getContent()[14].getTokens().length == 0) {
				Err++;
				//	this.EditProject.getContent()[0].getContent()[14].setValueState("Error");
			} else {
				//	this.EditProject.getContent()[0].getContent()[14].setValueState("None");
			}

			return Err;
		},
		openArchiveProgram: function (evt) {
			var that = this;
			this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].status = "Archived";
			this.getView().getModel("appView").getData().detailthis.getView().getModel("ProgramsModel").getData().Projects[this.projectObjectPath]
				.status = "Archived";
			this.getView().getModel().updateBindings(true);
			this.getView().getModel("appView").getData().detailthis.getView().getModel("ProgramsModel").updateBindings(true)
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("detailList", {
			// 	objectId: this.programObjectPath
			// });
			this.onCloseDetailPress();
		},
		openCancelProgram: function (evt) {
			var that = this;
			this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].status = "Cancelled";
			this.getView().getModel().updateBindings(true);
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("detailList", {
				objectId: this.programObjectPath
			});
		},
		openRetriveProgram: function (evt) {
			var that = this;
			if (this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].status == "Archived") {
				this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].status = "In Progress";
				this.getView().getModel("appView").getData().detailthis.getView().getModel("ProgramsModel").getData().Projects[this.projectObjectPath]
					.status = "In Progress";
			} else {
				this.getView().getModel().getData().programs[this.programObjectPath].Projects[this.projectObjectPath].status = "In Progress";
				this.getView().getModel("appView").getData().detailthis.getView().getModel("ProgramsModel").getData().Projects[this.projectObjectPath]
					.status = "In Progress";

			}
			this.getView().getModel().updateBindings(true);
			this.getView().getModel("appView").setProperty("/layout", "TwoColumnsMidExpanded");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			// oRouter.navTo("detailList", {
			// 	objectId: this.programObjectPath
			// });
			this.getView().getModel("appView").getData().detailthis.getView().getModel("ProgramsModel").updateBindings(true);
			this.onCloseDetailPress();
		},
		teamMemRoles: function () {
			var roles = this.getOwnerComponent().getModel("roles").getData();
			var reqRoles = [];
			for (var i = 0; i < roles.length; i++) {
				if (roles[i].roleType === "solutionRole") {
					reqRoles.push(roles[i]);
				}
			}
			var updatedRoles = new JSONModel(reqRoles);
			this.getView().setModel(updatedRoles, "rolesModel");

		},
		// onTeamMemberItemPress: function (oEvent){
		// 	if (!this.TeamMemberDetails) {
		// 		this.TeamMemberDetails = sap.ui.xmlfragment("MDG.Program.fragment.TeamMemberDetails", this);
		// 		// this.CreateUpdateMobDialog.setModel(this.getView().getModel("i18n"), "i18n");
		// 		this.getView().addDependent(this.TeamMemberDetails);
		// 	}
		// 	var teamMember = oEvent.getSource().getBindingContext().getObject();
		// 	var extraInfo = {
		// 		contact : teamMember.contact,
		// 		email : teamMember.email,
		// 		firstName : teamMember.firstName,
		// 		lastname : teamMember.lastname,
		// 		role : teamMember.role,
		// 		orgName : "Vaspp Inc",
		// 		location : "Germany",
		// 		customer : "RV Infotech",
		// 		vendor: "Sprinkles Corp",
		// 		ProgramsName: "",
		// 		Description: "",
		// 		startdate: "08-12-2021",
		// 		enddate: "29-12-2021"
		// 	};
		// 	// extraInfo.push(teamMember);
		// 	var teamInfo = new sap.ui.model.json.JSONModel(extraInfo);
		// 	this.TeamMemberDetails.setModel(teamInfo);
		// 	this.TeamMemberDetails.open();
		// },
		handleTeamDetailCancel: function(){
			this.TeamMemberDetails.close();
		}

	});

});