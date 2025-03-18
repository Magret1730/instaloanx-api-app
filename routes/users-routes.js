import express from 'express';
import * as userController from '../controllers/user-controller.js';
import { authorization } from '../middlewares/authorization.js';
// import { adminCheck } from '../middlewares/admin-check.js';

const router = express.Router();

router.route("/").get(authorization, userController.index);

router.route("/:id").get(authorization, userController.findOne);

router.route("/:id/loans").get(authorization, userController.findLoanPerUser );

export default router;