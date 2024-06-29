import initKnex from "knex";
import configuration from "../knexfile.js";

const knex = initKnex(configuration);

const warehouseIndex = async (req, res) => {
    try {
        const data = await knex("warehouse");
        res.status(200).json(data);
    } catch (err) {
        res.status(400).send(`Error in retrieving warehouse details: ${err}`);
    }
};

const warehouseBasedOnId = async (req, res) => {
    try {
        const warehouseFound = await knex("warehouse").where({ id: req.params.id });

        if (warehouseFound.length === 0) {
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`
            });
        }

        const warehouseData = warehouseFound[0];
        res.status(200).json(warehouseData);
    } catch (err) {
        res.status(500).json({
            message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`
        });
    }
};

const removeWarehouseBasedOnId = async (req, res) => {
    try {
        const warehouseRowDeleted = await knex("warehouse").where({ id: req.params.id }).delete();
        const inventoryRowDelete = await knex("inventory").where({ warehouse_id: req.params.id }).delete();

        if (warehouseRowDeleted === 0) {
            return res.status(404).json({
                message: `Warehouse with ID ${req.params.id} not found`
            });
        }

        res.sendStatus(204);
    } catch (err) {
        res.status(500).json({
            message: `Unable to delete warehouse with ID: ${req.params.id}`
        });
    }
};

const validateWarehouseData = (data) => {
    const errors = {};
    if (!data.warehouse_name) errors.warehouse_name = 'Warehouse name is required';
    if (!data.address) errors.address = 'Address is required';
    if (!data.city) errors.city = 'City is required';
    if (!data.country) errors.country = 'Country is required';
    if (!data.contact_name) errors.contact_name = 'Contact name is required';
    if (!data.contact_position) errors.contact_position = 'Contact position is required';
    if (!data.contact_phone) errors.contact_phone = 'Contact phone is required';
    if (!/^\+?(\d.*){3,}$/.test(data.contact_phone)) errors.contact_phone = 'Invalid phone number';
    if (!data.contact_email) errors.contact_email = 'Contact email is required';
    if (!/\S+@\S+\.\S+/.test(data.contact_email)) errors.contact_email = 'Invalid email address';
    return errors;
};

const addWarehouse = async (req, res) => {
    const validationErrors = validateWarehouseData(req.body);
    if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    try {
        const [id] = await knex('warehouse').insert(req.body);
        const newWarehouse = await knex('warehouse').where({ id }).first();
        res.status(201).json(newWarehouse);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

const editWarehouseBasedOnId = async (req, res) => {
    const validationErrors = validateWarehouseData(req.body);
    if (Object.keys(validationErrors).length > 0) {
        return res.status(400).json({ errors: validationErrors });
    }

    try {
        const { id } = req.params;
        const warehouseFound = await knex('warehouse').where({ id }).first();

        if (!warehouseFound) {
            return res.status(404).json({
                message: `Warehouse with ID ${id} not found`
            });
        }

        await knex('warehouse').where({ id }).update(req.body);
        const updatedWarehouse = await knex('warehouse').where({ id }).first();
        res.status(200).json(updatedWarehouse);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export {
    warehouseIndex,
    warehouseBasedOnId,
    removeWarehouseBasedOnId,
    addWarehouse,
    editWarehouseBasedOnId
};