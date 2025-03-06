/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// import seed data files, arrays of objects
import usersData from "../seed-data/users.js";
import loansData from "../seed-data/loans.js";
import repaymentsData from "../seed-data/repayments.js";

// export async function seed(knex) {
//   await knex("users").del();
//   await knex("loans").del();
//   await knex("repayments").del();
//   await knex("users").insert(usersData);
//   await knex("loans").insert(loansData);
//   await knex("repayments").insert(repaymentsData);
// }

export async function seed(knex) {
  try {
    await knex.transaction(async (trx) => {
      // Delete existing data
      await trx("repayments").del();
      await trx("loans").del();
      await trx("users").del();

      // Insert new data
      await trx("users").insert(usersData);
      await trx("loans").insert(loansData);
      await trx("repayments").insert(repaymentsData);
    });
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}
