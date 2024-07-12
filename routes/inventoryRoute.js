//Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const inventoryValidate = require("../utilities/inventory-validations")

//Route to build inventory management view
router.get("/", invController.buildManagementView);

//Route to build add new classification view
router.get("/newclassification", invController.buildNewClassificationView);

//Route to validate and add classification
router.post("/newclassification", 
    inventoryValidate.classificationRules(),
    inventoryValidate.checkClassificationData,
    utilities.handleErrors(invController.addNewClassification)
);

//Route to build inventory management view
router.get("/newvehicle", invController.buildAddNewVehicleView);

//Route to validate and add vehicle
router.post("/newvehicle",
    inventoryValidate.vehicleRules(),
    inventoryValidate.checkVehicleData,
    utilities.handleErrors(invController.addNewVehicle)
);

//Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

//Route to display inventory item details
router.get("/detail/:vehicleId", invController.buildDetailsByInventoryId);

//Route to return inventory list based on id_classification
router.get("/getinventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

//Route to get the edit view of an inventory item
router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventory));

//Route to update the edited inventory item
router.post("/update/", 
    inventoryValidate.vehicleRules(),
    inventoryValidate.checkVehicleUpdateData,
    utilities.handleErrors(invController.updateInventory));

//Route to display confirmation before deleting of an inventory item
router.get("/delete/:inventory_id", utilities.handleErrors(invController.buildDeleteInventory));

//Route to delete an inventory item
router.post("/delete", utilities.handleErrors(invController.deleteInventory))


module.exports = router;