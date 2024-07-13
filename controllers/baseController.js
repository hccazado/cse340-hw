const utilities = require("../utilities");
const baseController = {};

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    res.render("index", {title: "Home", nav, tools});
}

baseController.buildError= async function(req, res){
    let error = nonExistentController.boom();
    const nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    res.render("index", {title: "Home", nav, tools});
}

module.exports = baseController;