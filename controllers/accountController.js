const utilities = require("../utilities/");

const accountController = {};

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next){
    const title = "Login";
    let nav = await utilities.getNav();
    res.render("./account/login",{
        title: title,
        nav
    });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegistration = async function(req, res, next){
    const title = "Register";
    let nav = await utilities.getNav();
    res.render("./account/register",{
        title: title,
        nav,
        errors: null
    });
}

module.exports = accountController;