import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../utils/mailer.js";

const validateRegisterRequest = (body) => {
    const { first_name, last_name, email, password } = body;

    // Validates first and last name
    const firstLastNameRegex = /^[a-zA-Z\s\-'.]+$/;
    if (!firstLastNameRegex.test(first_name)) {
        return "Invalid First Name. Allowed: A-Z, a-z, spaces, hyphens (-), apostrophes ('), periods (.)";
    }

    if (!firstLastNameRegex.test(last_name)) {
        return "Invalid Last Name. Allowed: A-Z, a-z, spaces, hyphens (-), apostrophes ('), periods (.)";
    }

    // Validate email format
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return "Invalid Email Format. Example of valid format: user@example.com ";
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
    if (!passwordRegex.test(password)) {
        return "Password should contain at least one letter and one number, and be at least 4 characters long";
    }

    // If all validations pass, return null
    return null;
};

const validateLoginRequest = (body) => {
    const { email, password } = body;

    if (!email || !password) {
        return "Email and password are required";
    }

    // Validate email format
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return "Invalid Email Format. Example of valid format: user@example.com ";
    }

    // Validate password
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
    if (!passwordRegex.test(password)) {
        return "Password should contain at least one letter and one number, and be at least 4 characters long";
    }

    return null;
};

const validateEmail = (email) => {
    // Validate email format
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!emailRegex.test(email)) {
        return "Invalid Email Format. Example of valid format: user@example.com ";
    }

    return null;
};

const register = async (req, res) => {
    try {
        // gets the body request
        const { first_name, last_name, email, password } = req.body;

        // Basic checks for empty fields
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: 'All fields are compulsory' });
        }

        // Validate the request body
        const validationError = validateRegisterRequest(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // validates existing email
        const existingUser = await knex("users").where({ email }).first();
        if (existingUser) {
            return res.status(401).json({ message: 'User already exists with this email' });
        }

        // encrypt password
        const salt = await bcrypt.genSalt(10);
        const encryptedPwd = await bcrypt.hash(password, salt);
        if (!encryptedPwd) {
            return res.status(500).json({ message: 'Could not encrypt password' });
        }

        // Insert the new user into the database
        const [insertedId] = await knex("users")
            .insert({
                first_name: first_name.toLowerCase(),
                last_name: last_name.toLowerCase(),
                email: email.toLowerCase(),
                password: encryptedPwd,
                is_admin: false,
            });

        // Fetch the newly inserted user
        const newUser = await knex("users").where({ id: insertedId }).first();
        
        if (!newUser) {
            return res.status(500).json({ error: "User registration failed" });
        }

        // Create token for the user
        const token = jwt.sign(
            { id: newUser.id, 
                email: newUser.email,
                // first_name: newUser.first_name,
                // last_name: newUser.last_name,
                is_admin: newUser.is_admin },
            process.env.JWTSECRET,
            { expiresIn: '15m' }
        );

        // Updates user record with the token
        await knex("users").where({ id: newUser.id }).update({ token });

        // Removes the password field from the response
        delete newUser.password;

        // Returns data and status to frontend
        res.status(201).json({ success: true, data: { token,
                                                        id: newUser.id,
                                                        first_name: newUser.first_name,
                                                        last_name: newUser.last_name,
                                                        email: newUser.email,
                                                        is_admin: newUser.is_admin }
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Registration error, something went wrong" });
    }
};

const login = async (req, res) => {
    try {
        // gets body request
        const { email, password } = req.body;

        // Check if email and password are provided
        if (!(email && password)) {
            return res.status(400).json({ error: 'All fields are compulsory' });
        };

        // Validate the request body
        const validationError = validateLoginRequest(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // find user in db
        const existingUser = await knex("users").where({ email }).first();

        // respond if no existing user
        if (!existingUser) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, existingUser.password)
        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate a new token
        const token = jwt.sign(
            { id: existingUser.id,
                email,
                // first_name: existingUser.first_name,
                // last_name: existingUser.last_name,
                is_admin: existingUser.is_admin,
            },
            process.env.JWTSECRET,
            { expiresIn: '15m' }
        );

        // Update the user's token in the database
        await knex("users").where({ id: existingUser.id }).update({ token });

        // Remove the password field from the responsee
        delete existingUser.password;

        // Returns data and status to frontend
        res.status(200).json({ success: true, data: { token,
                                                        id: existingUser.id,
                                                        first_name: existingUser.first_name,
                                                        last_name: existingUser.last_name,
                                                        email: existingUser.email,
                                                        is_admin: existingUser.is_admin } });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login error, something went wrong" });
    }
};

// Function to get link in email
export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!(email)) {
            return res.status(400).json({ error: 'Email is required' });
        };

        // Validate the request body
        const validationError = validateEmail(email);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        // find user in db
        const existingUser = await knex("users").where({ email }).first();

        // respond if no existing user
        if (!existingUser) {
            return res.status(400).json({ error: "User not found" });
        }

        // Generate a new token
        const token = jwt.sign(
            { id: existingUser.id},
            process.env.RESET_PASSWORD_KEY,
            { expiresIn: '15m' }
        );

        // Update the user's token in the database
        await knex("users").where({ id: existingUser.id }).update({ token: "" });

        // Send the email
        const sendEmail = await sendMail({
            to: email,
            subject: 'InstaLoanX Password Reset',
            html: `
                    <h2>Click the following link to reset your password:</h2>
                    <h2>The link expires in 15 minutes</h2>
                    <p>${process.env.FRONTEND_URL}/resetPassword/${token}</p>

                    <p>If you did not request this, please ignore this email.</p>
                    <p>Thank you!</p>
                    <p>InstaLoanX Team</p>
                `,
        });

        if (sendEmail) {
            return res.status(200).json({ message: 'Email has been sent, kindly follow the instructions' });
        } else {
            return res.status(500).json({ error: 'Failed to send email' });
        }

    } catch (error) { 
        console.error('Error in forgotPassword:', error.message);
        return res.status(500).json({ error: error.message });
    }
};

// Function to resetPassword
export const resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        // verifies token
        const decoded = jwt.verify(token, process.env.RESET_PASSWORD_KEY);

        // find user in db
        const user = await knex("users").where({ id: decoded.id }).first();

        // respond if no user
        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        // Validate password
        const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{4,}$/;
        if (!passwordRegex.test(newPassword)) {
            return "Password should contain at least one letter and one number, and be at least 4 characters long";
        } else if (newPassword !== confirmPassword) {
            return res.status(400).json({ error: "Passwords do not match" });
        }

        // Encrypt the new password
        const salt = await bcrypt.genSalt(10);
        const encryptedPwd = await bcrypt.hash(newPassword, salt);
        if (!encryptedPwd) {
            return res.status(500).json({ message: 'Could not encrypt password' });
        }

        // Update the user's token in the database
        await knex("users").where({ id: user.id }).update({
            password: encryptedPwd,
            token: ''
        });

        return res.status(200).json({ message: 'Your password has been changed. Please log in with your new password.' });
    } catch (error) {
        res.status(401).json({ error: 'Incorrect or expired token. Please request a new one.' });
    }
};

export { register, login };
