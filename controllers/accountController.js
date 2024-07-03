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

module.exports = accountController;