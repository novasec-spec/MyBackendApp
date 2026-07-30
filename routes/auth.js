const express = require("express");

const router = express.Router();

const authController =
require("../controllers/authController");

const {
    registerValidation,
    validate
} = require("../middleware/validator");

const authLimiter =
require("../middleware/limiter");

router.post(
    "/register",
    registerValidation,
    validate,
    authLimiter,
    authController.register
);

router.post(
    "/login",
    authLimiter,
    authController.login
);

module.exports = router;
