import express from 'express';
import * as inventoryController from "../controllers/inventories-controller.js";

const router = express.Router();

router.route('/')
    .get(inventoryController.inventoryIndex)
    .post(inventoryController.addInventoryItem);

router.route('/:id')
    .get(inventoryController.inventoryItemBasedOnId);
 

export default router;
