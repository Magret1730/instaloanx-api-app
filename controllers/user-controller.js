import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        // queries users database
        const data = await knex('users');

        // sends a response with the appropriate status code
        res.status(200).json(data);
    } catch (err) {
        res.status(500).send(`Error retrieving inventory: ${err}`);
    }
};

export { index }