// This authenticate middleware checks this token and attaches the user
// information to the request object if the token is valid.
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jwt from 'jsonwebtoken';

export const authorization = async (req, res, next) => {
    try {
        // finds if the user has authoruzation header in the request body
        const authHeader = req.headers.authorization;
        // console.log("athHeader authorization", authHeader);

        // splits the token to extract only the token needed
        const token = authHeader.split(" ")[1];
        // console.log("token authorization", token);

        const { id } = jwt.verify(token, process.env.JWTSECRET);
        // console.log("id authorizatiob", id);

        // find the user with the 'id' from the jwt payload
        const user = await knex("users").select("id").where({ id }).first();
        // console.log("user authorizatiob", user);
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