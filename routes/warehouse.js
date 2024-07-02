// routes/warehouse.js
import express from 'express';
import "dotenv";

const router = express.Router();

router.route('/')
    .get(warehouseController.warehouseIndex)
    .post(warehouseController.addWarehouse);

router.route('/:id')
    .get(warehouseController.warehouseBasedOnId)
    .put(warehouseController.editWarehouseBasedOnId)
    .delete(warehouseController.removeWarehouseBasedOnId);

export default router;
