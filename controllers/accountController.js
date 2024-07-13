const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt =  require("bcryptjs");
const jwt = require("jsonwebtoken");
const { cookie } = require("express-validator");
const { user } = require("pg/lib/defaults");
require("dotenv").config();

const accountController = {};

/* ****************************************
*  Deliver login view
* *************************************** */
accountController.buildLogin = async function (req, res, next){
    const title = "Login";
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    res.render("./account/login",{
        title: title,
        tools,
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
    let tools = utilities.getTools(req);
    res.render("./account/register",{
        title: title,
        tools,
        nav,
        errors: null
    });
}

/* ****************************************
*  Register new account
* *************************************** */
accountController.registerAccount = async function(req, res){
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
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
        res.status(500).render("./account/register",{
            title: "Registration",
            tools,
            nav,
            errors: null
        });
    }

    const regResult = await accountModel.registerAccount(account_firstname, 
        account_lastname, account_email, hashedPassword);

    if (regResult){
        req.flash("success", `Congratulations you're registered ${account_firstname}. Please log in.`);
        res.status(201).render("./account/login",{
            title: "Login",
            tools,
            nav,
            errors: null
        });
    } 
    else{
        req.flash("notice", "Sorry, the registration failed.");
        res.status(501).render("./account/register",{
            title: "Registration",
            tools,
            nav,
            errors: null
        });
    }
}

/************************
 * Process login request
 **********************/
accountController.accountLogin = async function(req, res){
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    const {account_email, account_password} = req.body;
    const accountData = await  accountModel.getAccountByEmail(account_email);
    if(!accountData){
        req.flash("notice", "Please check your credentials and try again.");
        res.status(400).render("./account/login", {
            title: "Login",
            tools,
            nav,
            errors: null,
            account_email
        });
        return;
    }
    try{
        if( await bcrypt.compare(account_password, accountData.account_password)){
            delete accountData.account_password;
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600});
            if(process.env.NODE_ENV === "development"){
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000});
            }
            else{
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000});
            }
            return res.redirect("/account/");
        }
    } catch(error){
        return new Error("Access Forbiden");
    }
}

/************************
 * Process logout request
 **********************/
accountController.logout = async function (req, res, next){
    if(req.cookies.jwt){
        req.flash("success", "Have a great day!")
        res.clearCookie("jwt")
        return res.status(200).redirect("/");
    }
    else{
        req.flash("notice", "You are not logged in")
        return res.status(401).redirect("/account/login");
    }
}

/**************
 * Build account management view
 *************/
accountController.buildManagement = async function(req, res){
    let nav = await utilities.getNav();
    let tools = utilities.getTools(req);
    try{
        const cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
        const userData = await accountModel.getAccountById(cookieData.account_id);
        res.render("./account/management",{
            title: "Account Management",
            tools,
            nav,
            errors: null,
            account_firstname: userData.account_firstname,
            account_lastname: userData.account_lastname,
            account_email: userData.account_email,
            account_id: userData.account_id,
            cookieData
        });
    }
    catch (error){
        throw new Error (error);
    }
}

/* ***************************
 *  Update Account
 * ************************** */
accountController.updateAccount = async (req, res, next) =>{
    const {
        account_firstname,
        account_lastname,
        account_email,
        account_id
    } = req.body;

    let cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
    let modelResult = await accountModel.updateAccount(account_firstname, account_lastname, account_email, account_id);
    console.log(modelResult)

    if (modelResult){
        res.clearCookie("jwt");
        delete modelResult.account_password;
        const accessToken = jwt.sign(modelResult, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600});
            if(process.env.NODE_ENV === "development"){
                res.cookie("jwt", accessToken, {httpOnly: true, maxAge: 3600 * 1000});
            }
            else{
                res.cookie("jwt", accessToken, {httpOnly: true, secure: true, maxAge: 3600 * 1000});
            }
        req.flash("success", `${modelResult.account_firstname}, your account was successfully updated.`);
        res.redirect("/account/");
    }
    else{
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        req.flash("notice",`Sorry, ${account_firstname} something went wrong.`)
        res.status(501).render("./account/management",{
            nav,
            tools,
            title: `Account Management`,
            errors: null,
            account_id,
            account_firstname, 
            account_lastname, 
            account_email,
            cookieData
        })
    }
}

/* ***************************
 *  Update Password
 * ************************** */
accountController.updatePassword = async (req, res, next) =>{
    const {
        account_password,
        account_id
    } = req.body;
    let cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
    const hashedPassword = await bcrypt.hashSync(account_password, 10);
    const modelResult = await accountModel.updateAccountPassword(hashedPassword, account_id);

    if (modelResult){
        req.flash("success", `${cookieData.account_firstname}, your passsord was successfully updated.`);
        res.redirect("/account/");
    }
    else{
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        
        req.flash("notice",`Sorry, ${account_firstname} something went wrong.`)
        res.status(501).render("account/management",{
            nav,
            tools,
            title: `Account Management`,
            errors: null,
            account_firstname: cookieData.account_firstname,
            account_lastname: cookieData.account_lastname,
            account_email: cookieData.account_email,
            account_id: cookieData.account_id,
            cookieData
        })
    }
}

module.exports = accountController;