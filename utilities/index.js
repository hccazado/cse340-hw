const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function(req, res, next){
    let data = await invModel.getClassifications();
    let list = "<ul>";
    list += '<li><a href="/" title="Home page">Home</a></li>';
    data.rows.forEach((row) =>{
        list += "<li>";
        list += '<a href=/inv/type/' + row.classification_id + ' title="See our inventory of '+ row.classification_name +
        ' vehicles">'+ row.classification_name + "</a>"
        list += "</li>";
    });
    list += "</ul>";
    return list;
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid;
    if(data.length > 0){
        grid = '<ul id="inv-display">';
        data.forEach(vehicle =>{
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
        });
        grid += '</ul>';
    }
    else{
        grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;