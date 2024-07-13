//Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const accountValidate = require("../utilities/account-validations");

router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

router.post("/update",
    accountValidate.updateAccountRules(),
    accountValidate.checkAccountUpdateData,
    utilities.handleErrors(accountController.updateAccount));

router.post("/updatePassword",
    accountValidate.updatePasswordRules(),
    accountValidate.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword));   

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.get("/logout", utilities.handleErrors(accountController.logout));

router.post("/login", 
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin));

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post("/register", 
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

module.exports = router;