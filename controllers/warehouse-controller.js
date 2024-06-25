import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const warehouseIndex = async (req,res) => {
    try{
        const data = await knex("warehouse");
        res.status(200).json(data);
    } catch (err){
        res.status(400).send(`Error in retrieving warehouse details: ${err}`)
    }
}

export {
    warehouseIndex
}