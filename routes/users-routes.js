import express from 'express';
import * as userController from '../controllers/user-controller.js';
import { authorization } from '../middlewares/authorization.js';
import { adminCheck } from '../middlewares/admin-check.js';

const router = express.Router();

router.route("/").get(authorization, adminCheck, userController.index); // Gets all users
router.route("/:id").get(authorization, userController.findOne); // Gets a single user
router.route("/:id/loans").get(authorization, userController.findLoanPerUser); // Gets all loans attached to a user

export default router;