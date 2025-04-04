# InstaLoanX Backend

## Overview

The InstaLoanX backend is a **RESTful API** built with **Express.js**, **Knex.js** and **MySQL**. It powers the loan management system, enabling users to apply for loans, track their application status, and make repayments. It also provides an admin dashboard for managing loan applications and repayments.

---

## Features

1. **User Authentication**:
   - Register and login users using JWT for secure authentication.
2. **Loan Management**:
   - Submit loan applications.
   - Track loan status (Pending, Approved, Rejected, Fully Repaid).
3. **Repayment System**:
   - Make installment repayments.
4. **Admin Dashboard**:
   - Review and manage loan applications.
   - Monitor repayment statuses.
   - Manage user accounts.

---

## Technologies Used

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **ORM**: Knex.js
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Heroku

---

## Database

![](./public/images/final_db.png)

---

## API Documentation

The backend provides the following RESTful API endpoints:

1.  **POST /api/v1/auth/register**

    - Register a new user.

    _**Request Body**_:

    ```
    {
        "first_name": "John",
        "last_name": "Doe",
        "email": "johndoe@example.com",
        "password": "password123"
    }
    ```

    _**Response**_:

    ```
    {
        "success": true,
        "data": {
            "token": "...",
            "id":...,
            ...
        }
        "message": "User registered successfully.",
        "status": 201
    }
    ```

2.  **POST /api/v1/auth/login**

    - Login a user.

    _**Request Body**_:

    ```
    {
        "email": "johndoe@example.com",
        "password": "password123"
    }
    ```

    **_Response_**:

    ```
    {
        "success": true,
        "data": {
            "token": "...",
            "id":...,
            ...
        }
        "message": "User registered successfully.",
        "status": 200
    }
    ```

3.  **POST /api/v1/loans/applyLoan**

    - Submit a loan application.

    _**Request Body**_:

    ```
    {
        "amount": "5000",
        "purpose": "Reason for the loan (e.g., ["Education", "Business", "Medical", "Personal", "Other"])"
    }
    ```

    **_Response_**:

    ```
    {
        "success": true,
        "data": {
            "id": ...,
            "user_id": ...,
            "loan_amount": ...,
            "loan_purpose": ...,
            "status": ...,
            "remaining_balance": ...,
            "created_at": "2025-03-21T19:29:46.000Z",
            "updated_at": "2025-03-21T19:29:46.000Z"
        }
        "message": "Loan application submitted successfully.",
         "status": 200
    }
    ```

4.  **POST /api/v1/loans/:id/repayLoan**

    - Make a loan repayment.

    _**Request Body**_:

    ```
    {
        "loan_id": ...
        "amount": 1000
    }
    ```

    **_Response_**:

    ```
    {
        "success": true,
        "data": {
            "id": ...,
            "user_id": ...,
            "loan_amount": ...,
            "loan_purpose": ...,
            "status": ...,
            "remaining_balance": ...,
            "created_at": "2025-03-21T19:29:46.000Z",
            "updated_at": "2025-03-21T19:29:46.000Z"
        }
        "message": "Repayment successful.",
         "status": 200
    }
    ```

**Admin Endpoints:**

1.  **GET /api/v1/loans/**

    - View all loan applications.

    **_Response_**:

    ```
    [
        {
            "success": true,
            "data": [
                {
                    "id": "12345",
                    "user_id": "8906,
                    "loan_amount": "5000.00",
                    "loan_purpose": "Home renovation",
                    "status": "Fully Repaid",
                    "remaining_balance": "0.00",
                    "created_at": "2025-03-20T12:13:53.000Z",
                    "updated_at": "2025-03-20T12:13:53.000Z"
                },
                {
                    "id": "67890",
                    "user_id": "56789",
                    "loan_amount": "10000.00",
                    "loan_purpose": "Business expansion",
                    "status": "Rejected",
                    "remaining_balance": "1000.00",
                    "created_at": "2025-03-20T12:13:53.000Z",
                    "updated_at": "2025-03-20T12:20:04.000Z"
                },
                ...
            ]
        }
    ]
    ```

2.  **PUT /api/v1/loans/:loanId/status**

    - Update loan status (Reject/Active).

    **Request Body**\_:

    ```
    {
        "status": e.g., "Active", "Rejected", "Pending"
    }
    ```

    **_Response_**:

    ```
    {
        "success": true,
        "data": {
            "id": 2,
            "user_id": 2,
            "loan_amount": "10000.00",
            "loan_purpose": "Business expansion",
            "status": "Active",
            "remaining_balance": "1000.00",
            "created_at": "2025-03-20T12:13:53.000Z",
            "updated_at": "2025-03-21T19:51:03.000Z"
        }
        "message": "Loan status updated successfully."
    }
    ```

3.  **GET /api/v1/users**

    - View all users.

    **_Response_**:

    ```
         {
             "success": true,
             "data": [
             {
                 "id": 1,
                 "first_name": "John",
                 "last_name": "Doe",
                 "email": "john.doe@example.com",
                 "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImZpcnN0X25hbWUiOiJKb2huIiwibGFzdF9uYW1lIjoiRG9lIiwiaXNfYWRtaW4iOjAsImlhdCI6MTc0MjU3Njc4NCwiZXhwIjoxNzQzMTgxNTg0fQ.AYsziR749Qg1zJSP95CDi12YZ-X4tX7rSAvPixqtEdI",
                 "is_admin": 0,
                 "created_at": "2025-03-20T12:13:53.000Z",
                 "updated_at": "2025-03-21T17:06:24.000Z"
             },
             ...
             ]
         }
    ```

4.  **GET /api/v1/users/:id**

    - View a single user.

    **_Response_**:

    ```
        {
        "success": true,
        "data": {
            "id": 1,
            "first_name": "John",
            "last_name": "Doe",
            "email": "john.doe@example.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJqb2huLmRvZUBleGFtcGxlLmNvbSIsImZpcnN0X25hbWUiOiJKb2huIiwibGFzdF9uYW1lIjoiRG9lIiwiaXNfYWRtaW4iOjAsImlhdCI6MTc0MjU3Njc4NCwiZXhwIjoxNzQzMTgxNTg0fQ.AYsziR749Qg1zJSP95CDi12YZ-X4tX7rSAvPixqtEdI",
            "is_admin": 0,
            "created_at": "2025-03-20T12:13:53.000Z",
            "updated_at": "2025-03-21T17:06:24.000Z"
        }
    }
    ```

5.  **GET /api/v1/users/:id/loans**

    - View loan history of a single user

    **_Response_**:

    ```
    {
        "success": true,
        "data": {
            "loans": [
            {
                "id": 2,
                "user_id": 2,
                "loan_amount": "10000.00",
                "loan_purpose": "Business expansion",
                "status": "Active",
                "remaining_balance": "1000.00",
                "created_at": "2025-03-20T12:13:53.000Z",
                "updated_at": "2025-03-21T19:51:03.000Z"
            }
            ],
            "user": {
            "id": 2,
            "first_name": "Jane",
            "last_name": "Smith",
            "email": "jane.smith@example.com",
            "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNzQyNDcyODMyLCJleHAiOjE3NDI0NzY0MzJ9.Mvxb8pyxFFceBmuJUx7OmVEbfC8ek8cENUu6eiK2PPM",
            "is_admin": 0,
            "created_at": "2025-03-20T12:13:53.000Z",
            "updated_at": "2025-03-20T12:13:53.000Z"
            }
        }
    }
    ```

6.  **GET /api/v1/loans/loanHistory**

    - View loan history of all users

    **_Response_**:

    ```
        {
            "success": true,
            "data": [
                {
                "userId": 1,
                "firstName": "John",
                "lastName": "Doe",
                "loans": [
                    {
                    "loanAmount": "5000.00",
                    "createdAt": "2025-03-20T12:13:53.000Z",
                    "status": "Fully Repaid",
                    "loanId": 1,
                    "updatedAt": "2025-03-20T12:13:53.000Z",
                    "remainingBalance": "0.00"
                    },
                    {
                    "loanAmount": "2000.00",
                    "createdAt": "2025-03-20T12:13:53.000Z",
                    "status": "Rejected",
                    "loanId": 5,
                    "updatedAt": "2025-03-20T12:13:53.000Z",
                    "remainingBalance": "2000.00"
                    },
                    ...
                ]
            }
        ]
    }
    ```

---

## Installation Guide

1. Clone the repository:
   ```
   git clone https://github.com/Magret1730/instaloanx-api-app.git
   ```
2. Install dependencies:
   `npm install`
3. Set up the database:
   - Create a MySQL database and update the `.env` file with your database credentials using `.env_example` file.
   - Run migrations using migration tables and mock seed data provided. Run this on terminal:
     `npm run migrate`
     `npm run seed`
4. Start the server:
   `npm run start`
5. The app will be available at `http://localhost:8081` or on whatever port you use.
6. To get the frontend running, follow the [Frontend Readme](https://github.com/Magret1730/instaloanx-app) installation guide

---

### Figma Designs

**[Link To InstaloanX Design On Figma](https://www.figma.com/design/u2gKS7ifPagYso0AEHiyUq/InstaloanX?node-id=0-1&t=9CRpjgKD7NpSBltD-1)**

---

## Quick Walkthrough

For a detailed demonstration of InstaLoanX, check out the [Walkthrough Video](https://youtu.be/kvF3to6XBpQ)

---

## Deployment

InstaLoanX is deployed and accessible online. Here’s how the deployment is structured:

- **Frontend**: Hosted on [Netlify](https://instaloanx.netlify.app/)
- **Backend**: Hosted on [Heroku](https://instaloanx-3b9381667c7d.herokuapp.com/)


You can access the live application here: [InstaloanX Application](https://instaloanx.netlify.app/)

---

## Contribution Guidelines

We welcome contributions from the community! Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated. Please follow these guidelines to contribute to InstaLoanX.

### How to Contribute

1. **Fork the Repository**:

   - Click the **Fork** button on the top right of the repository page to create a copy of the project in your GitHub account.

2. **Clone the Repository**:

   - Clone your forked repository to your local machine:
     ```
     git clone https://github.com/Magret1730/instaloanx-api-app.git
     ```
   - Navigate to the project directory:
     ```
     cd instaloanx-api-app
     ```

3. **Create a New Branch**:

   - Create a new branch for your feature or bug fix:
     ```
     git checkout -b feature/your-feature-name
     ```
   - Use a descriptive branch name that reflects the changes you're making.

4. **Make Your Changes**:

   - Write your code and ensure it follows the project's coding standards.
   - Add comments and documentation where necessary.
   - Test your changes thoroughly.

5. **Commit Your Changes**:

   - Stage your changes:
     ```
     git add .
     ```
   - Commit your changes with a clear and descriptive message:
     ```
     git commit -m "Add your commit message here"
     ```

6. **Push Your Changes**:

   - Push your changes to your forked repository:
     ```
     git push origin feature/your-feature-name
     ```

7. **Submit a Pull Request (PR)**:
   - Go to the original repository on GitHub and click the **New Pull Request** button.
   - Select your branch and provide a detailed description of your changes.
   - Submit the PR and wait for feedback from the maintainers.

---

## License

InstaLoanX Backend is licensed under the [MIT License](./LICENSE).

---

## Contact

For any questions or feedback, please reach out to:

- **Email**: [belloabiodun17@gmail.com](mailto:belloabiodun17@gmail.com)
- **GitHub**: [Magret1730](https://github.com/Magret1730)
- **LinkedIn**: [Oyedele Abiodun](https://www.linkedin.com/in/oyedele-abiodun/)
