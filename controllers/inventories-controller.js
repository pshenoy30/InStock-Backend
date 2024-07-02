import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const inventoryIndex = async (req, res) => {
  try {
    const data = await knex("inventory")
      .join("warehouse", "inventory.warehouse_id", "warehouse.id")
      .select(
        "inventory.id",
        "warehouse.warehouse_name",
        "inventory.item_name",
        "inventory.description",
        "inventory.category",
        "inventory.status",
        "inventory.quantity"
      );
    res.status(200).json(data);
  } catch (err) {
    res.status(400).send(`Error in retrieving inventory details: ${err}`);
  }
};

const inventoryItemBasedOnId = async (req, res) => {
  try {
    const inventoryItem = await knex("inventory")
      .join("warehouse", "inventory.warehouse_id", "warehouse.id")
      .where({ "inventory.id": req.params.id })
      .select(
        "inventory.id",
        "inventory.warehouse_id",
        "warehouse.warehouse_name",
        "inventory.item_name",
        "inventory.description",
        "inventory.category",
        "inventory.status",
        "inventory.quantity"
      )
      .first();

    if (!inventoryItem) {
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

const addInventoryItem = async (req, res) => {
  const validationErrors = await validateInventoryData(req.body);
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({ errors: validationErrors });
  }

  try {
    const [id] = await knex("inventory").insert(req.body);
    const newInventoryItem = await knex("inventory").where({ id }).first();
    res.status(201).json(newInventoryItem);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

const addOrUpdateInventoryItem = async (req, res) => {
  const {
    item_name,
    category,
    warehouse_id
  } = req.body;

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

const checkIfWarehouseIdExists = async (id) => {
  try {
      const warehouseFound = await knex("warehouse").where({ id });

      if (warehouseFound.length === 0) {
        return false;
      } else {
        return true;
      }

  } catch (err) {
      console.log("Warehouse not found");
  }
};

const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { warehouseId, itemName, description, category, status, quantity } =
    req.body;

  try {
    const doesWarehouseExist = await checkIfWarehouseIdExists(warehouseId);
    if (quantity < 0 || itemName == "" || description == "" || !doesWarehouseExist){
      throw err;
    }
    if (status === "In Stock" && quantity === 0) {
      throw err;
    }

    const updatedInventoryItem = await knex("inventory").where({ id }).update({
      "inventory.warehouse_id": warehouseId,
      "inventory.item_name": itemName,
      description,
      category,
      status,
      quantity,
    });
    if (updatedInventoryItem === 1) {
      res.status(200).json({
        message: "Inventory item updated successfully",
      });
    } else {
      res.status(404).json({
        message: "Inventory item not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `Unable to update inventory item: ${err}`,
    });
  }
};

const deleteInventoryItem = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedInventoryItem = await knex("inventory").where({ id }).delete();

    if (deletedInventoryItem === 1) {
      res.status(204).send();
    } else {
      res.status(404).json({
        message: "Inventory item not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: `Unable to delete the inventory item: ${err}`,
    });
  }
};

export {
  inventoryIndex,
  inventoryItemBasedOnId,
  addInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
  addOrUpdateInventoryItem,
  uniqueCategories
};
