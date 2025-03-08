import express from 'express';
import * as loanController from '../controllers/loan-controller.js';

const router = express.Router();

router.route("/")
    .get(loanController.index);

// router.route("/:id")
//     .get(userController.findOne);

export default router;