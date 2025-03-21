// This authenticate middleware checks this token and attaches the user
// information to the request object if the token is valid.
import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import jwt from 'jsonwebtoken';

export const authorization = async (req, res, next) => {
    try {
        // finds if the user has authorization header in the request body
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // splits the token to extract only the token needed
        const token = authHeader.split(" ")[1];

        // verify the token provided with JWTSECRET
        const response = jwt.verify(token, process.env.JWTSECRET);

        req.user = response; // Attach the user to req.user

        next(); // Proceed to the next middleware
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token has expired. Please log in again.' });
        }
        console.error('Authentication error:', error);
        res.status(401).json({ error: 'Invalid token' });
    }
};