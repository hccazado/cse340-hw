const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt =  require("bcryptjs");

const accountController = {};

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next){
    const title = "Login";
    let nav = await utilities.getNav();
    res.render("./account/login",{
        title: title,
        nav,
        errors: null
    });
}

/* ****************************************
*  Deliver registration view
* *************************************** */
accountController.buildRegister = async function(req, res, next){
    const title = "Registration";
    let nav = await utilities.getNav();
    res.render("./account/register",{
        title: title,
        nav,
        errors: null
    });
}

/* ****************************************
*  Register new account
* *************************************** */
accountController.registerAccount = async function(req, res){
    let nav = await utilities.getNav();

    const {
        account_firstname,
        account_lastname,
        account_email,
        account_password
    } = req.body;

    //hashing password before persisting data
    let hashedPassword;
    try{
        hashedPassword = await bcrypt.hashSync(account_password, 10);
    }catch(error){
        req.flash("notice", "Sorry, there was an error processing the registration.");
        res.status(500).render("account/register",{
            title: "Registration",
            nav,
            errors: null
        });
    }

    const regResult = await accountModel.registerAccount(account_firstname, 
        account_lastname, account_email, hashedPassword);

    if (regResult){
        req.flash("success", `Congratulations you're registered ${account_firstname}. Please log in.`);
        res.status(201).render("account/login",{
            title: "Login",
            nav,
            errors: null
        });
    } 
    else{
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("account/register",{
            title: "Registration",
            nav,
            errors: null
        });
    }
}

module.exports = accountController;