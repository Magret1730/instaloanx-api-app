import express from 'express';
import * as userController from '../controllers/user-controller.js';

const router = express.Router();

router.route("/")
    .get(userController.index);

router.route("/:id")
    .get(userController.findOne);

export default router;