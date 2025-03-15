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

export { index, applyLoan }