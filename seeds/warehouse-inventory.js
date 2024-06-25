// Import seed data files, arrays of objects
import warehouseData from "../seed-data/warehouse.js";
import inventoryData from "../seed-data/inventory.js";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function seed(knex) {
    // Deletes ALL existing entries
    await knex("warehouse").del();
    await knex("inventory").del();

    // Insert new seed data
    await knex("warehouse").insert(warehouseData);
    await knex("inventory").insert(inventoryData);
}
