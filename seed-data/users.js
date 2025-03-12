import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
    return jwt.sign({ id: userId }, 'your-secret-key', { expiresIn: '1h' });
};

export default [
    {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        password: 'hashed_password_1',
        token: generateToken(1),
        is_admin: false,
    },
    {
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        password: 'hashed_password_2',
        token: generateToken(2),
        is_admin: false,
    },
    {
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        password: 'hashed_admin_password',
        token: generateToken(3),
        is_admin: true,
    },
    {
        first_name: 'Alice',
        last_name: 'Johnson',
        email: 'alice.johnson@example.com',
        password: 'hashed_password_3',
        token: generateToken(4),
        is_admin: false,
    },
    {
        first_name: 'Bob',
        last_name: 'Brown',
        email: 'bob.brown@example.com',
        password: 'hashed_password_4',
        token: generateToken(5),
        is_admin: false,
    },
];