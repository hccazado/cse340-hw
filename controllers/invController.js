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
        let tools = utilities.getTools(req);
        const className = data[0].classification_name;
        res.render("./inventory/classification", {
            title: `${className} vehicles`,
            tools,
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
        let tools = utilities.getTools(req);
        const invTitle = `${data[0].inv_make} ${data[0].inv_model}`;
        res.render("./inventory/detail", {
            title: invTitle,
            tools,
            nav,
            inventoryDetail
        });
    }
    else{
        next({status: 500, message: "Sorry, we appear to have lost the selected inventory."});
    }
}

/* ***************************
 *  Build invenotry management view
 * ************************** */
invCont.buildManagementView = async (req, res, next)=>{
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    let classificationSelect = await utilities.buildClassificationList();
    let classificationTable = await utilities.buildClassificationTable();
    res.render("./inventory/management",{
        title: "Inventory Management",
        nav,
        tools,
        classificationSelect,
        classificationTable
    });
}

/* ***************************
 *  Build add classification view
 * ************************** */
invCont.buildNewClassificationView = async (req, res, next)=>{
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    res.render("./inventory/newClassification",{
        nav,
        tools,
        title: "Add New Classification",
        errors: null
    });
}

/* ***************************
 *  Build add new vehicle view
 * ************************** */
invCont.buildAddNewVehicleView = async (req, res, next)=>{
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    let classificationList = await utilities.buildClassificationList();
    res.render("./inventory/newVehicle",{
        nav,
        tools,
        title: "Add New Vehicle",
        classificationList,
        errors: null
    });
}

/* ***************************
 *  Add Classification
 *  all new classifications are created with not visible status and should be enabled on inventory management section.
 * ************************** */
invCont.addNewClassification = async (req, res, next)=>{
    const {classification_name} = req.body;

    const modelResult = await invModel.addClassification(classification_name);

    if (modelResult){
        req.flash("success", `Classification ${classification_name} was successfully added.`);
        res.status(201).redirect("/inv/");
    }
    else{
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        req.flash("notice",`Sorry, something went wrong adding ${classification_name}.`)
        res.status(501).render("inventory/newClassification",{
            nav,
            tools,
            title: "Add New Classification",
            errors: null,
            classification_name
        })
    }
}

/* ***************************
 *  Add Vehicle
 * ************************** */
invCont.addNewVehicle = async (req, res, next)=>{
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body;
    const modelResult = await invModel.addVehicle(inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id);
    if (modelResult){
        let classificationList = await utilities.buildClassificationList();
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        req.flash("success", `Vehicle ${inv_model} was successfully added.`);
        res.status(201).redirect("/inv/");
    }
    else{
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        let classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice",`Sorry, something went wrong adding ${inv_model}.`)
        res.status(501).render("inventory/newVehicle",{
            nav,
            tools,
            title: "Add New Vehicle",
            errors: null,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price,
            inv_miles, 
            inv_color, 
            classificationList
        })
    }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) =>{
    const classification_id = parseInt(req.params.classification_id);
    const invData = await invModel.getInventoryByClassificationId(classification_id);
    if(invData[0].inv_id){
        return res.json(invData);
    }
    else{
        next(new Error("No data returned"));
    }
}

/* ***************************
 *  Return Classifications As JSON
 * ************************** */
invCont.getClassificationJSON = async (req, res, next) =>{
    const classData = await invModel.getClassifications();
    if(classData[0].inv_id){
        return res.json(classData);
    }
    else{
        next(new Error("No data returned"));
    }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async (req, res, next) =>{
    const inventory_id = req.params.inventory_id;
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    const itemData = await invModel.getInventoryDetailsById(inventory_id);
    const classificationSelect = await utilities.buildClassificationList(itemData[0].classification_id);
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
    res.render("./inventory/editInventory",{
        title: "Edit "+itemName,
        nav,
        tools,
        errors: null,
        classificationList: classificationSelect,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_description: itemData[0].inv_description,
        inv_image: itemData[0].inv_image,
        inv_thumbnail: itemData[0].inv_thumbnail,
        inv_price: itemData[0].inv_price,
        inv_miles: itemData[0].inv_miles,
        inv_color: itemData[0].inv_color,
        inv_isvisible: itemData[0].inv_isvisible,
        classification_id: itemData[0].classification_id
    });
}

/* ***************************
 *  Update edited inventory
 * ************************** */
invCont.updateInventory = async (req, res, next) =>{
    const {inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_isvisible, classification_id} = req.body;
    const modelResult = await invModel.updateVehicle(inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_isvisible, classification_id);

    console.log(inv_isvisible)

    if (modelResult){
        req.flash("success", `Vehicle ${inv_model} was successfully updated.`);
        res.status(201).redirect("/inv/");
    }
    else{
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        let classificationList = await utilities.buildClassificationList(classification_id);
        req.flash("notice",`Sorry, something went wrong updating ${inv_model}.`)
        res.status(501).render("inventory/editInventory",{
            nav,
            tools,
            title: `Edit Vehicle ${inv_make} ${inv_model}`,
            errors: null,
            inv_id,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_description, 
            inv_image, 
            inv_thumbnail, 
            inv_price,
            inv_miles, 
            inv_color,
            inv_isvisible, 
            classificationList
        })
    }
}

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async (req, res, next) =>{
    const inventory_id = req.params.inventory_id;
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    const itemData = await invModel.getInventoryDetailsById(inventory_id);
    const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
    res.render("./inventory/deleteInventory",{
        title: "Delete "+itemName,
        nav,
        tools,
        errors: null,
        inv_id: itemData[0].inv_id,
        inv_make: itemData[0].inv_make,
        inv_model: itemData[0].inv_model,
        inv_year: itemData[0].inv_year,
        inv_price: itemData[0].inv_price
    });
}

/* ***************************
 *  Update inventory visibility
 * ************************** */
invCont.updateInventoryVisibility = async (req, res, next)=>{
    const {inv_id, inv_isvisible} = req.body;
    const modelResult = await invModel.updateVehicleVisibilityStatus(inv_id, inv_isvisible);

    if (modelResult.inv_id){
        return res.status(200).send("Inventory visibility updated!");
    }
    else{
        return res.status(500).json({message:"Something went wrong! Inventory visibility not changed"});
    }
}

/* ***************************
 *  Update classification visibility
 * ************************** */
invCont.updateClassificationVisibility = async (req, res, next)=>{
    const {classification_id, classification_isvisible} = req.body;
    const modelResult = await invModel.updateClassificationVisibilityStatus(classification_id, classification_isvisible);
    
    if(modelResult.classification_id){
        return res.status(200).json({message:"Classification visibility updated!"});
    }
    else{
        return res.status(500).json({message:"Something went wrong! Classification visibility not changed"});
    }
}


/* ***************************
 *  Delete an inventory item
 * ************************** */
invCont.deleteInventory = async (req, res, next) =>{
    const {inv_id, inv_make, inv_model, inv_year, inv_price} = req.body;
    const modelResult = await invModel.deleteVehicle(inv_id);

    if (modelResult){
        req.flash("success", `Vehicle ${inv_model} was successfully deleted.`);
        res.redirect("/inv/");
    }
    else{
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        const itemName = inv
        req.flash("notice",`Sorry, something went wrong deleting ${inv_model}.`)
        res.status(501).render("inventory/deleteInventory",{
            nav,
            tools,
            title: `Delete ${itemName}`,
            errors: null,
            inv_id,
            inv_make, 
            inv_model, 
            inv_year, 
            inv_price
        });
    }
}

module.exports = invCont;