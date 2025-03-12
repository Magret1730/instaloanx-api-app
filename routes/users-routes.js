import express from 'express';
import * as userController from '../controllers/user-controller.js';
import { authorization } from '../middlewares/authorization.js';
import { adminCheck } from '../middlewares/admin-check.js';

const router = express.Router();

router.route("/").get(authorization, adminCheck, userController.index);

router.route("/:id").get(userController.findOne);

export default router;