import initKnex from "knex";
import configuration from "../knexfile.js";
const knex = initKnex(configuration);

const index = async (_req, res) => {
    try {
        // queries users database
        const data = await knex('loans').select('*');

        // sends a response with the appropriate status code
        res.status(200).json({ success: true, data });
    } catch (err) {
        // Logs the error for debugging
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
            'loans.updated_at as updatedAt',
            'loans.status as status',
            // 'loans.remaining_balance as remainingBalance'
        );

        // console.log(loanHistoryData);

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

        // console.log(groupedData);

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

        // Insert loan application
        const [newLoanId] = await knex("loans")
            .insert({
                user_id: req.user.id,
                loan_amount: amount,
                loan_purpose: purpose,
                status: "Pending", // Default status
            });

        // Fetch the newly inserted user
        const newLoan = await knex("loans").where({ id: newLoanId }).first();
        // console.log(newLoan);

        res.status(201).json({ success: true, data: newLoan });
    } catch (error) {
        console.error("Loan application error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

// Updates loan status
const updateLoanStatus = async (req, res) => {
    const { loanId } = req.params;
    // console.log("Loan ID", loanId);
    const { status } = req.body;
    // console.log("Status", status);

    try {
        // Updates the loan status in the database
        const loanStat = await knex("loans").where({ id: loanId }).update({ status });
        // console.log("Loan Status", loanStat);

        // Fetch loan data for the user from the database
        const updatedLoan = await knex("loans").where({ id: loanId }).first();

        // const updatedLoan = Loans.findByIdAndUpdate(
        //     loanId,
        //     { status },
        //     { new: true }
        // );

        // console.log("Updated loan", updatedLoan);

        if (updatedLoan.length === 0) {
            return res.status(404).json({ success: false, message: "Loan not found" });
        }

        res.status(200).json({ success: true, data: updatedLoan });
    } catch (err) {
        res.status(500).json({ success: false, message: "Failed to update loan status", error: err.message });
    }
}

export { index, applyLoan, loanHistory, updateLoanStatus }