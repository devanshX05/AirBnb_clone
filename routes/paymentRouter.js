const express = require("express");

const paymentRouter = express.Router();

const paymentController = require("../controller/paymentController");


paymentRouter.post(
    "/create-order",
    paymentController.createOrder
);


paymentRouter.post(
    "/verify-payment",
    paymentController.verifyPayment
);


module.exports = paymentRouter;