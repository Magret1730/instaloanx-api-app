import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        // queries users database
        const data = await knex('loans').select('*');

        // sends a response with the appropriate status code
        res.status(200).json({ success: true, data });
    } catch (err) {
        // Logs the error for debugging
        console.error(err);

        // Sends appropriate response to frontend
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};

export { index}