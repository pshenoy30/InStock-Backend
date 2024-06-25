// 20240625050437_create_inventories_table.js
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema.createTable('inventories', (table) => {
      table.increments('id').primary();
      table
        .integer('warehouse_id')
        .unsigned()
        .references('warehouses.id')
        .onUpdate('CASCADE')
        .onDelete('CASCADE');
      table.string('item_name').notNullable();
      table.string('description').notNullable();
      table.string('category').notNullable();
      table.string('status').notNullable();
      table.integer('quantity').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.raw('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'));
    });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  export function down(knex) {
    return knex.schema.dropTable('inventories');
  };
  