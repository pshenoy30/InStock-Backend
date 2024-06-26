import express from 'express';
import * as warehouseController from '../controllers/warehouse-controller.js';

const router = express.Router();

router.route('/')
    .get(warehouseController.warehouseIndex)
    .post(warehouseController.addWarehouse);

router.route('/:id')
    .get(warehouseController.warehouseBasedOnId)
    .delete(warehouseController.removeWarehouseBasedOnId);

export default router;
