const utilities = require(".");
const {body, validationResult} = require("express-validator");
const validate = {};

/*  **********************************
  *  New Classification Rules
  * ********************************* */
validate.classificationRules = () =>{
    return [
        //firstname is required and must be string
        body("classification_name")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a valid classification.") //error message
            .custom(value => !/\s/.test(value))
            .withMessage("Please provide a valid classification.") //error message
    ]
}

/*  **********************************
  *  New Vehicle Rules
  * ********************************* */
validate.vehicleRules = () =>{
    return [
        //make is required and must be string
        body("inv_make")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid vehicle make."), //error message
        //model is required and must be string
        body("inv_model")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 3 })
            .withMessage("Please provide a valid vehicle make."), //error message
        //year is required and must be number
        body("inv_year")
            .trim()
            .escape()
            .notEmpty()
            .toInt()
            .isNumeric()
            .isLength({ min: 4, max: 4}) //full year (4 digits)
            .withMessage("Please provide a valid vehicle's year (i.e 2004)."), //error message
        //description is required and must be string
        body("inv_description")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1})
            .withMessage("Please provide a vehicle description."), //error message
        //Image is required and path must be string
        body("inv_image")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10})
            .withMessage("Please provide a vehicle image."), //error message
        //Thumbnail is required and path must be string
        body("inv_thumbnail")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 10})
            .withMessage("Please provide a vehicle thumbnail."), //error message
        //miles is required and path must be string
        body("inv_price")
            .trim()
            .escape()
            .notEmpty()
            .toFloat()
            .isFloat()
            .withMessage("Please provide a valid vehicle price."), //error message
        //miles is required and path must be string
        body("inv_miles")
            .trim()
            .escape()
            .notEmpty()
            .toInt()
            .isNumeric()
            .withMessage("Please provide a valid vehicle mileage."), //error message
        //miles is required and path must be string
        body("inv_color")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a valid vehicle color."), //error message
    ]
}



/* ******************************
 * Check data and return errors or continue to add classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) =>{
    const {classification_name} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        res.render("inventory/newClassification", {
            tools,
            nav,
            title: "Add New Classification",
            errors,
            classification_name
        });
        return;
    }
    else{
        next();
    }
}

/* ******************************
 * Check data and return errors or continue to add vehicle
 * ***************************** */
validate.checkVehicleData = async (req, res, next) =>{
    const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, classification_id} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        let classificationList = await utilities.buildClassificationList(classification_id);
        res.render("inventory/newVehicle", {
            tools,
            nav,
            title: "Add New Vehicle",
            errors,
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
        });
        return;
    }
    else{
        next();
    }
}

/* ******************************
 * Check data and return errors or continue to add vehicle
 * ***************************** */
validate.checkVehicleUpdateData = async (req, res, next) =>{
    const {inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_miles, inv_color, inv_price, inv_isvisible, classification_id} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        let classificationList = await utilities.buildClassificationList(classification_id);
        const itemName = inv_make + " "+ inv_model;
        res.render("inventory/editInventory", {
            tools,
            nav,
            title: `Edit ${itemName}`,
            errors,
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
        });
        return;
    }
    else{
        next();
    }
}

module.exports = validate;
        