import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        // queries users database
        const data = await knex('users').select('*');

        // sends a response with the appropriate status code
        res.status(200).json({ success: true, data });
    } catch (err) {
        // Logs the error for debugging
        console.error(err);

        // Sends appropriate response to frontend
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};

const findOne = async (req, res) => {
    try {
        // gets id to make the request
        const { id } = req.params;

        // checks for valid id
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                message: `User with ID ${id} is invalid`,
            });
        }

        // queries database
        const usersFound = await knex("users")
            .where({ "users.id": id });

        // Checks if ID is found
        if (usersFound.length === 0) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${id} not found` 
            });
        }

        // Sends first data found of user
        const userData = usersFound[0];

         // sends a response with the appropriate status code
        res.json({ success: true, data: userData });
    } catch (error) {
        // Logs the error for debugging
        console.error(error);

        // Sends appropriate response to frontend
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

// Backend route to get all loans for a single user
// router.get("/users/:userId/loans", authorization, async (req, res) => {
// http://localhost:8080/api/v1/users/6/loans
// the user data should be sent alongside the loan history
const findLoanPerUser = async (req, res) => {
    try {
        const { id } = req.params;

        // checks for valid id
        if (isNaN(id) || id <= 0) {
            return res.status(400).json({
                success: false,
                message: `User with ID ${id} is invalid`,
            });
        }

        // Fetch user details
        const user = await knex("users").where({ id }).first();

        if (!user) {
            return res.status(404).json({
                success: false,
                message: `User with ID ${id} not found`,
            });
        }

        // Removes the password field from the responsee
        delete user.password;

        // Fetch loans for the user from the database
        const loans = await knex("loans").where({ user_id: id });

        res.status(200).json({ success: true, data: {loans, user}, });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to fetch loans" });
    }
};

export { index, findOne, findLoanPerUser }