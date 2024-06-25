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
};

const warehouseBasedOnId = async (req,res) => {
    try {
        const warehouseFound = await knex("warehouse").where({id: req.params.id});

        if(warehouseFound.length === 0){
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`
            });
        }

        const warehouseData = warehouseFound[0];
        res.status(200).json(warehouseData)
    } catch (err) {
        res.send(500).json({
            message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`
        });
    }
};

const removeWarehouseBasedOnId = async (req, res) => {
    try{
        const warehouseRowDeleted = await knex("warehouse").where({id: req.params.id}).delete();
        const inventoryRowDelete = await knex("inventory").where({warehouse_id: req.params.id}).delete();
        
        if(warehouseRowDeleted === 0){
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`
            });
        }

        res.sendStatus(204);
    } catch (err){
        res.status(500).json({
            message: `Unable to delete warehouse with ID: ${req.params.id}`
        });
    }
}

export {
    warehouseIndex,
    warehouseBasedOnId,
    removeWarehouseBasedOnId
}