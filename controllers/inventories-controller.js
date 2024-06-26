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
    const inventoryItem = await knex("inventory").where({ id: req.params.id });

    if (inventoryItem.length === 0) {
      return res.status(404).json({
        message: `Inventory item with id: ${req.params.id} doesnot exist`,
      });
    }

    return res.status(200).json(inventoryItem);
  } catch (err) {
    res.status(500).json({
      message: `Unable to retreive the inventory item: ${err}`,
    });
  }
};

const updateInventoryItem = async (req, res) => {
  const { id } = req.params;
  const { warehouse_id, item_name, description, catergory, status, quantity } =
    req.body;

  try {
    const updatedInventoryItem = await knex("inventory")
      .where({ id })
      .update({
        warehouse_id,
        item_name,
        description,
        catergory,
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
      res.status(200).json({
        message: "Inventory item deleted successfully",
      });
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
  updateInventoryItem,
  deleteInventoryItem,
};
