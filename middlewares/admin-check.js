// A middleware function that checks if the authenticated user is an admin.
import jwt from "jsonwebtoken";

export const adminCheck = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({ message: "No token provided" });
        }

        // splits the token to extract only the token needed
        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, process.env.JWTSECRET);

        // checks  for admin
        if (req.user && (decoded.is_admin === 1)) {
            return next();
        }

        res.status(403).json({ error: 'Access denied. Admins only.' });
    } catch (error) {
        console.error('Authorization error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};