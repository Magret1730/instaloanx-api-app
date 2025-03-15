import express from 'express';
import * as loanController from '../controllers/loan-controller.js';
import { authorization } from '../middlewares/authorization.js';

const router = express.Router();

router.route("/").get(authorization, loanController.index);
router.route("/applyLoan").post(authorization, loanController.applyLoan);

// router.route("/:id")
//     .get(loanController.findLoanPerUser );

export default router;