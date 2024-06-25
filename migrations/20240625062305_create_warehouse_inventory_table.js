/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
        .createTable('warehouse', (table) => {
            table.increments('id').primary();
            table.string('warehouse_name').notNullable();
            table.string('address').notNullable();
            table.string('city').notNullable();
            table.string('country').notNullable();
            table.string('contact_name').notNullable();
            table.string('contact_position').notNullable();
            table.string('contact_phone').notNullable();
            table.string('contact_email').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        })
        .createTable('inventory', (table) => {
            table.increments('id').primary();
            table.integer('warehouse_id').unsigned().references('id').inTable('warehouse').onUpdate('CASCADE').onDelete('CASCADE');
            table.string('item_name').notNullable();
            table.string('description').notNullable();
            table.string('category').notNullable();
            table.string('status').notNullable();
            table.integer('quantity').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
        });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
        .dropTable('inventory')  // Drops the inventory first due to the foreign key constraint
        .dropTable('warehouse');
}
