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

async function addClassification (classification_name){
    try{
        const sql = pool.query(
            `INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *`,
            [classification_name]
        );
        return await pool.query(sql, [classification_name]);
    }
    catch(error){
        return error.message;
    }
}

async function addVehicle (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try{
        const sql = pool.query(
            `INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`,
            [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]
        );
        return await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id]);
    }
    catch(error){
        return error.message;
    }
}

async function updateVehicle (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id){
    try{
        const sql = pool.query(
            `UPDATE public.inventory SET inv_make =$1, inv_model = $2, inv_year = $3, inv_description = $4, inv_image = $5, inv_thumbnail = $6, inv_price = $7, inv_miles = $8, inv_color = $9, classification_id = $10
            WHERE inv_id = $11`,
            [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]
        );
        const data = await pool.query(sql, [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id, inv_id]);
        return data.rows[0];
    }
    catch(error){
        return error.message;
    }
}

//deleting an inventory item. a successfull delete query will return 1.
async function deleteVehicle (inv_id){
    try{
        const sql = pool.query(
            `DELETE FROM public.inventory WHERE inv_id = $1`,
            [inv_id]
        );
        const data = await pool.query(sql, [inv_id]);
        return data;
    }
    catch(error){
        return error.message;
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryDetailsById, addClassification, addVehicle, updateVehicle, deleteVehicle}