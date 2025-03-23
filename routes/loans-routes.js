import express from 'express';
import * as loanController from '../controllers/loan-controller.js';
import { authorization } from '../middlewares/authorization.js';
import { adminCheck } from '../middlewares/admin-check.js';

const router = express.Router();

router.route("/").get(authorization, adminCheck, loanController.index); // Gets all loans
router.route("/applyLoan").post(authorization, loanController.applyLoan); // Handles loan application
router.route("/loanHistory").get(authorization, loanController.loanHistory); // Gets loan history per a single user
router.route("/:loanId/status").put(authorization, adminCheck, loanController.updateLoanStatus); // Updates loan status
router.route("/:id/repayLoan").put(authorization, loanController.loanRepayment); // Repay loan

export default router;