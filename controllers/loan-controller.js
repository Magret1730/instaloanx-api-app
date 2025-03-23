import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

// Fetches all loan from db
const index = async (_req, res) => {
    try {
        // queries users database
        const data = await knex('loans').select('*');

        // sends a response with the appropriate status code
        res.status(200).json({ success: true, data });
    } catch (err) {
        console.error(err);

        // Sends appropriate response to frontend
        res.status(500).send({ success: false, message: "Internal server error" });
    }
};

// Fetch users with their loan history using a LEFT JOIN (in the case some users don't have loans).
const loanHistory = async (req, res) => {
    try {
        const loanHistoryData = await knex('users')
        .leftJoin('loans', 'users.id', 'loans.user_id')
        .select(
            'users.id as userId',
            'users.first_name as firstName',
            'users.last_name as lastName',
            'loans.id as loanId',
            'loans.loan_amount as loanAmount',
            'loans.created_at as createdAt',
            'loans.remaining_balance as remainingBalance',
            'loans.updated_at as updatedAt',
            'loans.status as status',
        );

        // Group by user
        const groupedData = loanHistoryData.reduce((acc, curr) => {
            const { userId, firstName, lastName, loanAmount, createdAt, status, remainingBalance, loanId, updatedAt } = curr;

            if (!acc[userId]) {
                acc[userId] = {
                userId,
                firstName,
                lastName,
                loans: [],
                };
            }

            if (loanAmount !== null) {
                acc[userId].loans.push({
                loanAmount,
                createdAt,
                status,
                loanId,
                updatedAt,
                remainingBalance,
                });
            }

            return acc;
        }, {});

        // Converts the object into an array
        const result = Object.values(groupedData);

        res.status(200).json({ success: true, data: result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Failed to fetch loan history' });
    }
};

// Handles loan application
const applyLoan = async (req, res) => {
    try {
        const { amount, purpose } = req.body;

        // loan purposes
        const purposes = ["Education", "Business", "Medical", "Personal", "Other"];

        // Check if user has an active loan
        const activeLoan = await knex("loans")
            .where({ user_id: req.user.id, status: "Active" || "Pending" })
            .first();

        if (activeLoan) {
            return res.status(400).json({ message: "You already have an active loan." });
        }

        // Validations
        if (!amount || isNaN(amount) || Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid loan amount" });
        }

        if (!purpose || typeof purpose !== "string" || !purposes.includes(purpose)) {
            return res.status(400).json({ message: "Invalid loan purpose" });
        }

        if (Number(amount) < 50) {
            return res.status(400).json({message: "The minimum loan amount is $50."});
        }

        if (Number(amount) > 1000000) {
            return res.status(400).json({message: "The maximum loan amount is $1,000,000."});
        }

        // Insert loan application
        const [newLoanId] = await knex("loans")
            .insert({
                user_id: req.user.id,
                loan_amount: amount,
                remaining_balance: amount,
                loan_purpose: purpose,
                status: "Pending", // Default status
            });

        // Fetch the newly inserted user
        const newLoan = await knex("loans").where({ id: newLoanId }).first();

        res.status(201).json({ success: true, data: newLoan });
    } catch (error) {
        console.error("Loan application error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Updates loan status
const updateLoanStatus = async (req, res) => {
    const { loanId } = req.params;
    const { status } = req.body;

    try {
        // Updates the loan status in the database
        await knex("loans").where({ id: loanId }).update({ status: status });

        // Fetch loan data for the user from the database
        const updatedLoan = await knex("loans").where({ id: loanId }).first();

        // checks if there is no loan data returned
        if (updatedLoan.length === 0) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        res.status(200).json({ success: true, data: updatedLoan });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update loan status", error: err.message });
    }
}

// Hanldes loan repayment
const loanRepayment = async (req, res) => {
    try {
        const {id} = req.params;
        const { loan_id, amount_paid } = req.body;

        // Fetch loan data for the user from the database
        const fetchedLoan = await knex("loans").where({ id: loan_id }).first();
        if (!fetchedLoan) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        // Validates if the loan belongs to the user
        if (fetchedLoan.user_id !== (parseInt(id))) {
            return res.status(403).json({ success: false, message: "You are not authorized to repay this loan." });
        }

        // status should be "active" before "repayment can be done"
        if (fetchedLoan.status !== "Active") {
            return res.status(400).json({
                success: false,
                message: "You don't have an active loan.",
            });
        }

        // Converts from string to number
        let amountPaid = Number(amount_paid);
        let remainBalance = Number(fetchedLoan.remaining_balance);

        // Validate if amount is less than $50
        if (amountPaid < 50) {
            return res.status(400).json({
                success: false,
                message: "The least amount to repay is $50.",
            });
        }

        // Validate the repayment amount
        if (amountPaid <= 0 || amountPaid > remainBalance) {
            return res.status(400).json({
                success: false,
                message: "Amount cannot be less than or equal to 0 or greater than the remaining balance.",
            });
        }

        // Update the remaining balance in the loans table
        const newRemainingBalance = remainBalance - amountPaid;

        const updateData = await knex("loans")
            .where({ id: loan_id })
            .update({ remaining_balance: newRemainingBalance });

        // Insert new repayment record
        await knex("repayments").insert({
            loan_id,
            amount_paid: amountPaid,
        });

        // Update loan status if fully repaid
        if (newRemainingBalance === 0) {
            await knex("loans")
                .where({ id: loan_id })
                .update({ status: "Fully Repaid" });
        }

        // Fetch updated loan data
        const updatedLoan = await knex("loans").where({ id: loan_id }).first();

        // Return success response
        res.status(200).json({
            success: true,
            message: "Repayment successful",
            data: {
                loan: updatedLoan,
                // amount_paid: amountPaid
            },
        });

    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to repay loan", error: err.message });
    }
}

export { index, applyLoan, loanHistory, updateLoanStatus, loanRepayment }