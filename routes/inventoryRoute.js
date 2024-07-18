//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const inventoryValidate = require("../utilities/inventory-validations")

//Route to build inventory management view
router.get("/", utilities.authorizedAccounts, utilities.handleErrors(invController.buildManagementView));

//Route to build add new classification view
router.get("/newclassification", utilities.authorizedAccounts, invController.buildNewClassificationView);

//Route to validate and add classification
router.post("/newclassification", 
    utilities.authorizedAccounts,
    inventoryValidate.classificationRules(),
    inventoryValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification)
);

//Route to build inventory management view
router.get("/newvehicle", utilities.authorizedAccounts, invController.buildAddNewVehicleView);

//Route to validate and add vehicle
router.post("/newvehicle",
    utilities.authorizedAccounts,
    inventoryValidate.vehicleRules(),
    inventoryValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
);

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to display inventory item details
router.get("/detail/:vehicleId", invController.buildDetailsByInventoryId);

//Route to return inventory list based on id_classification
router.get("/getinventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route to return JSON classification list
router.get("getclassification", utilities.handleErrors(invController.getClassificationJSON));

//Route to get the edit view of an inventory item
router.get("/edit/:inventory_id", utilities.authorizedAccounts, utilities.handleErrors(invController.buildEditInventory));

//Route to update the edited inventory item
router.post("/update/", 
    utilities.authorizedAccounts,
    inventoryValidate.vehicleRules(),
    inventoryValidate.checkVehicleUpdateData,
    utilities.handleErrors(invController.updateInventory));

//Route to display confirmation before deleting of an inventory item
router.get("/delete/:inventory_id", utilities.authorizedAccounts, utilities.handleErrors(invController.buildDeleteInventory));

//Route to change visibility inventory visibility status
router.post("/inventoryvisibility", utilities.authorizedAccounts, utilities.handleErrors(invController.updateInventoryVisibility));

//Route to change visibility inventory visibility status
router.post("/classificationvisibility", utilities.authorizedAccounts, utilities.handleErrors(invController.updateClassificationVisibility));

//Route to delete an inventory item
router.post("/delete", utilities.authorizedAccounts, utilities.handleErrors(invController.deleteInventory))


module.exports = router;