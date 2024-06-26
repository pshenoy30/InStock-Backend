import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const inventoryIndex = async (req, res) => {
  try {
    const data = await knex("inventory");
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error in retrieving inventory details: ${err}`);
  }
};

const inventoryItemBasedOnId = async (req, res) => {
  try {
    const inventoryItem = await knex("inventory").where({ id: req.params.id });

    if (inventoryItem.length === 0) {
      return res.status(404).json({
        message: `Inventory item with id: ${req.params.id} doesnot exist`,
      });
    }

    return res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retreive the inventory item: ${error}`,
    });
  }
};

export { 
    inventoryIndex, 
    inventoryItemBasedOnId 
};
