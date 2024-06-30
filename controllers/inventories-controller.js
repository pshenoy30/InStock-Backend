// controllers/inventories-controller.js
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
    const inventoryItem = await knex("inventory").where({
      id: req.params.id
    });

    if (inventoryItem.length === 0) {
      return res.status(404).json({
        message: `Inventory item with id: ${req.params.id} does not exist`,
      });
    }

    return res.status(200).json(inventoryItem);
  } catch (error) {
    res.status(500).json({
      message: `Unable to retrieve the inventory item: ${error}`,
    });
  }
};

const validateInventoryData = async (data, isUpdate = false) => {
  const errors = {};
  if (!data.warehouse_id) errors.warehouse_id = 'Warehouse ID is required';
  if (!data.item_name) errors.item_name = 'Item name is required';
  if (!isUpdate && !data.description) errors.description = 'Description is required';
  if (!data.category) errors.category = 'Category is required';
  if (!data.status) errors.status = 'Status is required';
  if (data.quantity == null) errors.quantity = 'Quantity is required';
  if (isNaN(Number(data.quantity))) errors.quantity = 'Quantity must be a number';

  if (data.warehouse_id) {
    const warehouseExists = await knex('warehouse').where({
      id: data.warehouse_id
    }).first();
    if (!warehouseExists) {
      errors.warehouse_id = 'Warehouse ID does not exist';
    }
  }

  return errors;
};

const addOrUpdateInventoryItem = async (req, res) => {
  const {
    item_name,
    category,
    warehouse_id
  } = req.body;

  // Checks if an inventory item with the same item_name, category, and warehouse_id already exists
  try {
    const existingItem = await knex('inventory')
      .where({
        item_name,
        category,
        warehouse_id
      })
      .first();

    const validationErrors = await validateInventoryData(req.body, !!existingItem);
    if (Object.keys(validationErrors).length > 0) {
      return res.status(400).json({
        errors: validationErrors
      });
    }

    // Preserve the existing description if it's not provided in the request to update Out of stock inventory
    if (existingItem) {
      const updateData = {
        ...req.body
      };
      if (!req.body.description) {
        updateData.description = existingItem.description;
      }

      await knex('inventory')
        .where({
          id: existingItem.id
        })
        .update(updateData);
      return res.status(200).json({
        message: 'Inventory item updated successfully'
      });
    } else {
      const [id] = await knex('inventory').insert(req.body);
      const newInventoryItem = await knex('inventory').where({
        id
      }).first();
      return res.status(201).json(newInventoryItem);
    }
  } catch (error) {
    res.status(500).json({
      error: 'Internal server error'
    });
  }
};

const uniqueCategories = async (req, res) => {
  try {
    const categories = await knex("inventory").distinct("category");
    res.status(200).json(categories);
  } catch (err) {
    res.status(400).send(`Error in retrieving unique categories: ${err}`);
  }
};

export {
  inventoryIndex,
  inventoryItemBasedOnId,
  addOrUpdateInventoryItem,
  uniqueCategories
};