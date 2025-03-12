// This authenticate middleware checks this token and attaches the user
// information to the request object if the token is valid.
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jwt from 'jsonwebtoken';

export const authorization = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        const token = authHeader.split(" ")[1];

        const { id } = jwt.verify(token, process.env.JWTSECRET);

        // find the user with the 'id' from the jwt payload
        const user = await knex("users").select("id").where({ id }).first();
        if (!user) {
            throw new Error('User not found.');
        }

        req.user = user; // Attach the user to req.user
        next(); // Proceed to the next middleware
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired. Please log in again.' });
        }
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};