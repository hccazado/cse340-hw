const pool = require("../database/");

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name");
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function  getInventoryByClassificationId(classification_id){
    try{
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`, [classification_id]
        );
        return data.rows;
    }catch (error){
        console.error("getCLassificationbyid error: "+ error);
    }
}

async function getInventoryDetailsById(inventory_id){
    try{
        const data = await pool.query(
            `SELECT * 
            FROM public.inventory
            WHERE inv_id = $1`, [inventory_id]
        );
        return data.rows;
    }catch(error){
        console.error("getInventoryDetailsById error: "+ error);
    }

}
/**
 * All new classifications are created as hidden
 */
async function addClassification (classification_name){
    try{
        const sql = await pool.query(
            `INSERT INTO public.classification (classification_name, classification_isvisible) VALUES ($1, $2) RETURNING *`,
            [classification_name, false]
        );
        return sql.rows;
    }
    catch(error){
        return error.message;
    }
}

/**
 * All new vehicles are added as hidden
 */
async function addVehicle (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try{
        const sql = await pool.query(
            `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_isvisible, classification_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
            [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, false, classification_id]
        );
        return sql.rows[0];
    }
    catch(error){
        return error.message;
    }
}

async function updateVehicle (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_isvisible, classification_id){
    try{
        const sql = await pool.query(
            `UPDATE public.inventory SET inv_make =$1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, inv_isvisible = $10, classification_id = $11
            WHERE inv_id = $12 RETURNING *`,
            [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_isvisible, classification_id, inv_id]
        );
        return sql.rows[0];
    }
    catch(error){
        return error.message;
    }
}

/**
 * update the visibility from an inventory item
 */
async function updateVehicleVisibilityStatus (inv_id, inv_isVisible){
    try{
        const sql = await pool.query("UPDATE public.INVENTORY SET inv_isvisible = $1 WHERE inv_id = $2 RETURNING *",
        [inv_isVisible, inv_id]);
        return sql.rows[0];
    }
    catch(error){
        console.log(error.message);
    }
}

/**
 * update the visibility from a classification item
 */
async function updateClassificationVisibilityStatus (classification_id, classification_isVisible){
    try{
        const sql = await pool.query("UPDATE public.classification SET classification_isvisible = $1 WHERE classification_id = $2 RETURNING *",
        [classification_isVisible, classification_id]);
        return sql.rows[0];
    }
    catch(error){
        console.log(error.message);
    }
}

//deleting an inventory item. a successfull delete query will return 1.
async function deleteVehicle (inv_id){
    try{
        const sql = await pool.query(
            `DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *`,
            [inv_id]
        );
        return sql.rows[0];
    }
    catch(error){
        return error.message;
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryDetailsById, addClassification, addVehicle, updateVehicle, deleteVehicle, updateVehicleVisibilityStatus, updateClassificationVisibilityStatus}