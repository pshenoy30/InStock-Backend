// routes/warehouse.js
import express from 'express';
import * as warehouseController from '../controllers/warehouse-controller.js';

const router = express.Router();

router.get('/names', warehouseController.uniqueWarehouses); // New route for unique warehouse names

router.route('/')
    .get(warehouseController.warehouseIndex)
    .post(warehouseController.addWarehouse);

router.route('/:id')
    .get(warehouseController.warehouseBasedOnId)
    .put(warehouseController.editWarehouseBasedOnId)
    .delete(warehouseController.removeWarehouseBasedOnId);

router.route("/:id/inventories")
    .get(warehouseController.inventoryByWarehouseId);
export default router;