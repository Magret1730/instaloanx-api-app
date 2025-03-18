/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function up(knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary(); 
            table.string('first_name', 255).notNullable();
            table.string('last_name', 255).notNullable();
            table.string('email', 255).notNullable().unique();
            table.string('password', 255).notNullable();
            table.string('token', 255).nullable();
            table.boolean('is_admin').defaultTo(false);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table
                .timestamp("updated_at")
                .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable('loans', (table) => {
            table.increments('id').primary(); 
            table.integer('user_id').unsigned().notNullable();
            table.decimal('loan_amount', 10, 2).notNullable();
            table.text('loan_purpose').notNullable();
            table
                .enum('status', ['Pending', 'Active', 'Rejected', 'Fully Repaid'])
                .defaultTo('Pending');
            // table.decimal('remaining_balance', 10, 2).notNullable();
            // table.integer('tenor').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table
                .foreign('user_id')
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table
                .timestamp("updated_at")
                .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        })
        .createTable('repayments', (table) => {
            table.increments('id').primary(); 
            table.integer('loan_id').unsigned().notNullable();
            table.decimal('amount', 10, 2).notNullable();
            table.timestamp('payment_date').defaultTo(knex.fn.now());
            table
                .foreign('loan_id')
                .references('id')
                .inTable('loans')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table
                .timestamp("updated_at")
                .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
        });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export function down(knex) {
    return knex.schema
        .dropTableIfExists('repayments')
        .dropTableIfExists('loans')
        .dropTableIfExists('users');
};
