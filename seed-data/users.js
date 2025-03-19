import jwt from 'jsonwebtoken';
import bcrypt from "bcryptjs";

// function generates token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, 'your-secret-key', { expiresIn: '1h' });
};

// Function to hash a password
const hashPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds
    return await bcrypt.hash(password, saltRounds);
};

export default [
    {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: await hashPassword('pass@1'),
        token: generateToken(1),
        is_admin: false,
    },
    {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        password: await hashPassword('pass@2'),
        token: generateToken(2),
        is_admin: false,
    },
    {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: await hashPassword('admin@1'),
        token: generateToken(3),
        is_admin: true,
    },
    {
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@example.com',
        password: await hashPassword('pass@3'),
        token: generateToken(4),
        is_admin: false,
    },
    {
        first_name: 'Bob',
        last_name: 'Brown',
        email: 'bob.brown@example.com',
        password: await hashPassword('pass@4'),
        token: generateToken(5),
        is_admin: false,
    },
        {
        first_name: 'Babe',
        last_name: 'Gold',
        email: 'babe.gold@example.com',
        password: await hashPassword('pass@5'),
        token: generateToken(5),
        is_admin: false,
    },
];