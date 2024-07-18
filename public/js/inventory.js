'use strict'

//fetching classification items upon document load
document.addEventListener("load", ()=>{
    fetchClassificationData();
})

//getting the list of inventory items based on the classification_id
const inventoryList = document.querySelector("#classificationList");
inventoryList.addEventListener("change", ()=>{
    let classification_id = inventoryList.value;
    fetchInventoryData(classification_id);
})

async function fetchInventoryData(classification_id){
    let url = "/inv/getInventory/"+classification_id;
    let response = await fetch(url);
    if (response.ok){
        //return await response.json();
        buildInventoryList(await response.json());
    }
    else{
        throw new Error("Network response not ok!");
    }
}

async function fetchClassificationData(){
    let url = "/inv/getclassification";
    let response = await fetch(url);

    if (response.ok){
        buildClassificationList(await response.json());
    }
    else{
        throw new Error("Network response not ok!");
    }
}

function opentab(tabName){
    const tabsList = document.querySelectorAll(".tabcontent");
    tabsList.forEach(tab =>{
        console.log(tab);
        tab.style.display = "none";
        tab.classList.remove("active");
    });

    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).classList.add = "active";
}

async function updateVisibility(id, isvisible, target){
    const jsOutput = document.querySelector("#jsOutput");
    let body = "";
    if (target == "inventory"){
        body = JSON.stringify({
            inv_isvisible: isvisible,
            inv_id: id
            })
    }
    else {
        body = JSON.stringify({
            classification_isvisible: isvisible,
            classification_id: id
        })
    }
    
    const response = await fetch(`/inv/${target}visibility`,{
       
        method: "POST",
        headers:{
            'Content-Type': 'application/json'
        },
        body: body
    });
    if (response.ok && target == "inventory"){
        
        const message = await response.text();

        const divElement = document.createElement("div");
        divElement.classList = "message";
        divElement.innerText = message;

        const close = document.createElement("span");
        close.innerText = "🅧";
        close.style.float = "right";
        close.style.cursor = "pointer";
        close.addEventListener("click", ()=> {divElement.remove()});

        divElement.appendChild(close);

        jsOutput.appendChild(divElement);
    }
    else if(!response.ok){
        alert(`Oh no! something went wrong updating ${target}'s visibility`);
    }
};

function checkboxEventHandler(checkbox){
    let target = checkbox.name;
    if (checkbox.checked){
        updateVisibility(checkbox.id, true, target);
    }
    else{
        updateVisibility(checkbox.id, false, target);
    }
}

function buildInventoryList(data){

    const inventoryTable = document.getElementById("inventoryDisplay");
    //set up table labels
    let dataTable = "<thead>";
    dataTable += "<tr><th>Vehicle Name</th><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr>";
    dataTable += "</thead>";
    //set up table body
    dataTable += "<tbody>";
    //Iterating all vehicles in the array and insert each into a new row
    data.forEach((item)=>{
        dataTable += `<tr><td>${item.inv_make} ${item.inv_model}</td>`;
        dataTable += `<td> <a href="/inv/edit/${item.inv_id}" title="Click to update">Modify</a></td>`;
        dataTable += `<td> <a href="/inv/delete/${item.inv_id}" title="Click to delete">Delete</a></td>`;
        dataTable += `<td> <label>Is Visible: <input type="checkbox" name="inventory" onchange="checkboxEventHandler(this);" id=${item.inv_id} title="check to turn inventory visibility" ${item.inv_isvisible ? "checked":"unchecked"}></label></td></tr>`
    });
    dataTable += "</tbody>";
    inventoryTable.innerHTML = dataTable;
}