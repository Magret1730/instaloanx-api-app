import express from 'express';
import * as loanController from '../controllers/loan-controller.js';
import { authorization } from '../middlewares/authorization.js';

const router = express.Router();

router.route("/").get(authorization, loanController.index); // Gets all loans
router.route("/applyLoan").post(authorization, loanController.applyLoan); // Handles loan application
router.route("/loanHistory").get(authorization, loanController.loanHistory); // Gets loan history per a single user
router.put("/:loanId/status", loanController.updateLoanStatus); // UPdates loan status

export default router;