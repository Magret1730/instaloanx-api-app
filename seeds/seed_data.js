/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */

// import seed data files, arrays of objects
import usersData from "../seed-data/users.js";
import loansData from "../seed-data/loans.js";
import repaymentsData from "../seed-data/repayments.js";

export async function seed(knex) {
  try {
    await knex.transaction(async (trx) => {
      // Deletes existing data
      await trx("repayments").del();
      await trx("loans").del();
      await trx("users").del();

      // Inserts new data
      await trx("users").insert(usersData);
      await trx("loans").insert(loansData);
      await trx("repayments").insert(repaymentsData);
    });
    console.log("Seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding data:", error);
  }
}
