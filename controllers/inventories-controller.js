import initKnex from 'knex';
import configuration from '../knexfile.js';

const knex = initKnex(configuration);

const inventoryItemBasedOnId = async (req, res) => {
    try {
        const inventoryItem =  await knex("inventory").where({id: req.params.id});
        
        if(inventoryItem.length === 0 ){
            return res.status(404).json({
                message: `Inventory item with id: ${req.params.id} doesnot exist`
            })
        }

        return res.status(200).json(inventoryItem);
    } catch (error) {
        res.status(500).json({
            message: `Unable to retreive the inventory item: ${error}`
        })
    }
}

export {
    inventoryItemBasedOnId
}