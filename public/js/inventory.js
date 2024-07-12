'use strict'

//Getting the list of items in inventory based on the classification_id
const classificationList = document.querySelector("#classificationList");
classificationList.addEventListener("change", ()=>{
    let classification_id = classificationList.value;
    console.log("classification id: "+classification_id);
    fetchInventoryData(classification_id);
})

async function fetchInventoryData(classification_id){
    let classIdURL = "/inv/getInventory/"+classification_id;
    let response = await fetch(classIdURL);
    if (response.ok){
        //return await response.json();
        buildInventoryList(await response.json());
    }
    else{
        throw new Error("Network response not ok!");
    }
}

function buildInventoryList(data){
    console.log(data)
    const inventoryTable = document.getElementById("inventoryDisplay");
    //set up table labels
    let dataTable = "<thead>";
    dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td></tr>";
    dataTable += "</thead>";
    //set up table body
    dataTable += "<tbody>";
    //Iterating all vehicles in the array and insert each into a new row
    data.forEach((item)=>{
        dataTable += `<tr><td>${item.inv_make} ${item.inv_model}</td>`;
        dataTable += `<td> <a href="/inv/edit/${item.inv_id}" title="Click to update">Modify</a></td>`;
        dataTable += `<td> <a href="/inv/delete/${item.inv_id}" title="Click to delete">Delete</a></td></tr>`;
    });
    dataTable += "</tbody>";
    inventoryTable.innerHTML = dataTable;
}