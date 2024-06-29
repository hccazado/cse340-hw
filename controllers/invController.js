const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next){
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);
    if(data.length > 0){
        const grid = await utilities.buildClassificationGrid(data);
        let nav = await utilities.getNav();
        const className = data[0].classification_name;
        res.render("./inventory/classification", {
            title: `${className} vehicles`,
            nav,
            grid
        });
    }
    else{
        next({status: 500, message: "Sorry, we appear to have lost the selected classification."});
    }
}

/* ***************************
 *  Build invenotry details view
 * ************************** */
invCont.buildDetailsByInventoryId = async function (req, res, next){
    const inventoryId = req.params.vehicleId;
    const data = await invModel.getInventoryDetailsById(inventoryId);
    if(data.length > 0){
        const inventoryDetail = await utilities.buildInventoryDetails(data);
        let nav = await utilities.getNav();
        const invTitle = `${data[0].inv_make} ${data[0].inv_model}`;
        res.render("./inventory/detail", {
            title: invTitle,
            nav,
            inventoryDetail
        });
    }
    else{
        next({status: 500, message: "Sorry, we appear to have lost the selected inventory."});
    }
}
module.exports = invCont;