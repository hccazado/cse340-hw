const { cookie } = require("express-validator");
const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next){
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) =>{
        if (row.classification_isvisible){
            list += "<li>";
            list += '<a href=/inv/type/' + row.classification_id + ' title="See our inventory of '+ row.classification_name +
            ' vehicles">'+ row.classification_name + "</a>"
            list += "</li>";
        }
    });
    list += "</ul>";
    return list;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid;
    if(data || data.length > 0){
        grid = '<ul id="inv-display">';
        data.forEach(vehicle =>{
            //verifying inventory visibility status
            if(vehicle.inv_isvisible){
                grid += `
                    <li>
                        <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model}"> 
                            <img src="${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model} on CSE Motors">
                        </a>
                        <div class="namePrice">
                            <hr>
                            <h2>
                                <a href="../../inv/detail/${vehicle.inv_id}" title="View ${vehicle.inv_make} ${vehicle.inv_model} details">
                                    ${vehicle.inv_make} ${vehicle.inv_model}
                                </a>
                            </h2>
                            <span>$${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</span>
                        </div>
                    </li>`
            }
        });
        grid += '</ul>';
    }
    else{
        grid += '<h2> class="notice">Sorry, no matching vehicles could be found.</h2>';
    }
    return grid;
}

/* **************************************
* Build the inventory's detail view
* ************************************ */
Util.buildInventoryDetails = async function(data){
    if (data.length > 0){
        let htmlContent = `
        <div class="inv-detail">
            <div>
                <img class="inv-detail-img" src=${data[0].inv_image} alt="Image of ${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model} on CSE Motors inventory" width=300 height=300>
            </div>
            <div class="inv-detail-desc">
                <h2>${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model} Details</h2>
                <p><strong>Price: ${new Intl.NumberFormat("en-US", {style:"currency", currency:"USD"}).format(data[0].inv_price)}</strong></p>
                <p><Strong>Description: </strong>${data[0].inv_description}</p>
                <p><strong>Color:</strong> ${data[0].inv_color}</p>
                <p><strong>Miles:</strong> ${new Intl.NumberFormat("en-US").format(data[0].inv_miles)}</p>
            </div>
        </div>`
        return htmlContent;
    }else{
        return '<p class="notice">Sorry, it seems that we could not find the selected inventory!</h2>';
    }
}

/* **************************************
* Build classification list
* ************************************ */
Util.buildClassificationList = async function(classification_id = null){
    let data = await invModel.getClassifications();
    let classificationList = '<select name="classification_id" id="classificationList" required>';
    classificationList += "<option value=''>Choose a Classification</option>";
    data.rows.forEach(row =>{
        classificationList += `<option value="${row.classification_id}" `;
        if(classification_id != null && row.classification_id == classification_id){
            classificationList += " selected";
        }
        classificationList += `> ${row.classification_name}</option>`;
    });
    classificationList += "</select>";
    return classificationList;
}

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/**
 * Middleware to check token validity
 */
Util.checkJWTToken = (req, res, next) =>{
    if(req.cookies.jwt){
        jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET, function (err, accountData){
            if (err){
                req.flash("notice","Please log in");
                res.clearCookie("jwt");
                return res.redirect("/account/login");
            }
            res.locals.accountData = accountData;
            res.locals.loggedin = 1;
            next();
        });
    }
    else{
        next();
    }
}

/**
 * Check Login (Authorization)
 */
Util.checkLogin = (req, res, next) =>{
    if(res.locals.loggedin){
        next();
    }else{
        req.flash("notice", "Please log in");
        return res.redirect("/account/login");
    }
}

/**************
 * Build header Login/Logout
 *************/
Util.getTools = (req) =>{
    if(req.cookies.jwt){
        try{
            const cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
            let html = `<p>Welcome,</p>
            <a title="Click to access account management" href="/account/">${cookieData.account_firstname}</a>
                        <a title="Click to log out" href="/account/logout">Log out</a>`;
            return html;
        }
        catch (error){
            throw new Error (error);
        }
    }
    else{
        let html = '<a title="Click to log in" href="/account/login">My account</a>';
        return html;
    }
}

/**************
 * Authorization only to Employee and Admin accounts
 *************/
Util.authorizedAccounts = (req, res, next) =>{
    if(req.cookies.jwt){
        try{
            const cookieData = jwt.verify(req.cookies.jwt, process.env.ACCESS_TOKEN_SECRET);
            if (cookieData.account_type == "Employee" || cookieData.account_type == "Admin"){
                next();
            }
            else{
                req.flash("notice", "Forbidden access");
                res.status(401).redirect("/account/login");
            }
        }
        catch (error){
            throw new Error (error);
        }
    }
    else{
        res.status(401).redirect("/account/login");
    }
}

/**
 * Build classifications table to inventory management view
 */
Util.buildClassificationTable = async ()=>{
    let data = await invModel.getClassifications();
    //set up table labels
    let dataTable = `
        <table id="classificationDisplay">    
        <thead>
        <tr><th>Classification name</th><td>&nbsp;</td></tr>
        </thead>
        <tbody>`;
    
    //iterating all classifications in the array and insert into a new row
    data.rows.forEach((item)=>{
        dataTable += `<tr><td>${item.classification_name}</td>`
        dataTable += `<td> <label>Is Visible: <input type="checkbox" name="classification" onchange="checkboxEventHandler(this);" id=${item.classification_id} title="check to turn inventory visibility" ${item.classification_isvisible ? "checked":"unchecked"}></label></td></tr>`
    });
    dataTable += "</tbody></table>"

    return dataTable;
}


module.exports = Util;