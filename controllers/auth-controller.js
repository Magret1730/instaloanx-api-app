import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const validateBodyRequest = (body) => {
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

// const register = async (req, res) => {
//     try {
//         // gets the body request
//         const { first_name, last_name, email, password } = req.body;
//         // console.log(first_name, last_name, email, password);

//         // Basic checks for empty fields
//         if (!first_name || !last_name || !email || !password) {
//             return res.status(400).json({ error: 'All fields are compulsory' });
//         }

//         // Validate the request body
//         const validationError = validateBodyRequest(req.body);
//         if (validationError) {
//             return res.status(400).json({ message: validationError });
//         }

//         // validates existing email
//         const existingUser = await knex("users").where({ email }).first();
//         if (existingUser) {
//             return res.status(401).json({ message: 'User already exist with this email' });
//         }

//         // encrypt password
//         const salt = await bcrypt.genSalt(10);
//         const encryptedPwd = await bcrypt.hash(password, salt);
//         if (!encryptedPwd) {
//             return res.status(500).json({ message: 'Could not encrypt password' });
//         }

//         // // creates token for the user
//         // const token = jwt.sign(
//         //     { email, first_name, last_name, is_admin: false },
//         //     process.env.JWTSECRET,
//         //     { expiresIn: '7d' }
//         // );

//         // Insert the new user into the database
//         const [ newUser ] = await knex("users")
//             .insert({ //insert the new user
//                 first_name: first_name.toLowerCase(),
//                 last_name: last_name.toLowerCase(),
//                 email: email.toLowerCase(),
//                 password: encryptedPwd,
//                 is_admin: false,
//             })
//             .returning(["id", "first_name", "last_name", "email", "is_admin"]); // Ensures ID is returned

//         // Ensure we have user ID before generating token
//         if (!newUser || !newUser.id) {
//             return res.status(500).json({ error: "User registration failed" });
//         }

//         // creates token for the user
//         const token = jwt.sign(
//             { id: newUser.id, email: newUser.email, first_name: newUser.first_name, last_name: newUser.last_name, is_admin: newUser.is_admin },
//             process.env.JWTSECRET,
//             { expiresIn: '7d' }
//         );

//         // Fetch the newly inserted user from the database
//         // const newUser = await knex("users").where({ id: userId }).first();
//         // console.log("New User in auth-controller", newUser);

//         // Update user record with the token (optional)
//         await knex("users").where({ id: newUser.id }).update({ token });

//         // Remove the password field from the response
//         delete newUser.password;

//         // Return data and status to frontend
//         // res.status(201).json({ success: true, data: newUser });
//         res.status(201).json({ success: true, data: token, id: userId });
//     } catch (error) {
//         console.error("Registration errorrrrr:", error);
//         res.status(500).json({ error: "Registration error, something went wrong" });
//     }
// };

const register = async (req, res) => {
    try {
        // gets the body request
        const { first_name, last_name, email, password } = req.body;

        // Basic checks for empty fields
        if (!first_name || !last_name || !email || !password) {
            return res.status(400).json({ error: 'All fields are compulsory' });
        }

        // Validate the request body
        const validationError = validateBodyRequest(req.body);
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
        // console.log("New user in authcontroller.js", newUser);
        
        if (!newUser) {
            return res.status(500).json({ error: "User registration failed" });
        }

        // Create token for the user
        const token = jwt.sign(
            { id: newUser.id, email: newUser.email, first_name: newUser.first_name, last_name: newUser.last_name, is_admin: newUser.is_admin },
            process.env.JWTSECRET,
            { expiresIn: '7d' }
        );

        // Update user record with the token (optional)
        await knex("users").where({ id: newUser.id }).update({ token });

        // Remove the password field from the response
        delete newUser.password;

        // Return data and status to frontend
        res.status(201).json({ success: true, data: { token, id: newUser.id } });
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
        const validationError = validateBodyRequest(req.body);
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
                first_name: existingUser.first_name,
                last_name: existingUser.last_name,
                is_admin: existingUser.is_admin,
            },
            process.env.JWTSECRET,
            { expiresIn: '7d' }
        );

        // console.log("Received Token in login:", token);

        // Update the user's token in the database
        await knex("users")
            .where({ id: existingUser.id })
            .update({ token });

        // Remove the password field from the response
        delete existingUser.password;

        // Return the token and user data
        res.status(200).json({ success: true, token });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login error, something went wrong" });
    }
};

export { register, login };
