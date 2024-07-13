const utilities = require(".");
const {body, validationResult} = require("express-validator");
const accountModel = require("../models/account-model");
const jwt = require("jsonwebtoken");
const { cookie } = require("express-validator");
const validate = {};

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registrationRules = () =>{
    return [
        //firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), //error message
        
        //lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:2 })
            .withMessage("Please provide a last name."), //error message

        //valid email is required and cannot already exist in db
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid mail is required.") //error message
            .custom(async (account_email)=>{
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (emailExists){
                    throw new Error("Email exists. Please log in or use a different email.");
                }
            }),

        //password is required and must be strong
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/*  **********************************
  *  Update Data Validation Rules
  * ********************************* */
validate.updateAccountRules = () =>{
    return [
        //firstname is required and must be string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min: 1 })
            .withMessage("Please provide a first name."), //error message
        
        //lastname is required and must be string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .isLength({ min:2 })
            .withMessage("Please provide a last name."), //error message

        //valid email is required and cannot already exist in db
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("A valid mail is required.") //error message
            .custom(async (account_email)=>{
                const modelResult = await accountModel.checkExistingEmail(account_email);
                if (modelResult.account_email != body.account_email ){
                    throw new Error("Email exists. Please log in or use a different email.");
                }
            })
    ]
}


/*  **********************************
  *  Update Password Rules
  * ********************************* */
validate.updatePasswordRules = () =>{
    return [
        //password is required and must be strong
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}


/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

validate.checkRegData = async (req, res, next) =>{
    const {account_firstname, account_lastname, account_email} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        res.render("account/register",{
            errors,
            title: "Registration",
            tools,
            nav,
            account_firstname,
            account_lastname,
            account_email
        });
        return
    }
    next();
}

/*  **********************************
*  Login Data Validation Rules
* ********************************* */
validate.loginRules = () =>{
    return  [
        //login is required and must be an email
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .isEmail()
            .normalizeEmail()
            .withMessage("An valid email must be informed")
            .custom(async (account_email)=>{
                const emailExists = await accountModel.checkExistingEmail(account_email);
                if (!emailExists){
                    throw new Error("Email not registered. Please register to log in.");
                }
            }),
        
        //password is required and must meet criteria
        body("account_password")
            .trim()
            .notEmpty()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) =>{
    const {account_email} = req.body;
    let  errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        res.render("account/login",{
            errors,
            title: "Login",
            tools,
            nav,
            account_email
        })
        return;
    }
    else{
        next();
    }
}

/* ******************************
 * Check update data and return errors or continue to update account
 * ***************************** */
validate.checkAccountUpdateData = async (req, res, next) =>{
    const {account_firstname, account_lastname, account_email, account_id} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        const cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
        res.render("account/management",{
            errors,
            title: "Account Management",
            tools,
            nav,
            account_firstname,
            account_lastname,
            account_email,
            account_id,
            cookieData
        });
        return
    }
    next();
}

/* ******************************
 * Check update password and return errors or continue to update password
 * ***************************** */
validate.checkUpdatePassword = async (req, res, next) =>{
    const {account_firstname, account_lastname, account_id} = req.body;
    let errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        let tools = utilities.getTools(req);
        const cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
        res.render("account/management",{
            errors,
            title: "Account Management",
            tools,
            nav,
            account_firstname: cookieData.account_firstname,
            account_lastname: cookieData.account_lastname,
            account_email: cookieData.account_email,
            account_id: cookieData.account_id,
            cookieData
        });
        return
    }
    next();
}

module.exports = validate;