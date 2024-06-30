// routes/inventory.js
import express from 'express';
import * as inventoryController from "../controllers/inventories-controller.js";

const router = express.Router();

router.get('/categories', inventoryController.uniqueCategories); // New route for unique inventory categories

router.route('/')
  .get(inventoryController.inventoryIndex)
  .post(inventoryController.addOrUpdateInventoryItem);

router.route('/:id')
  .get(inventoryController.inventoryItemBasedOnId);

export default router;