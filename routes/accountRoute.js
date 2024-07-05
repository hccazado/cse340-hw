//Needed Resources
const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const accountValidate = require("../utilities/account-validations");

router.get("/login", utilities.handleErrors(accountController.buildLogin));

router.post("/login", 
    accountValidate.loginRules(),
    accountValidate.checkLoginData,
    (req, res)=>{
        res.status(200).send("login process");
});

router.get("/register", utilities.handleErrors(accountController.buildRegister));

router.post("/register", 
    accountValidate.registrationRules(),
    accountValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount));

module.exports = router;