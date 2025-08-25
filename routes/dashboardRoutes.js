const express = require("express");
const { query } = require("express-validator");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

// Validation middleware
const validateDateQuery = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid ISO 8601 date"),
];

const validateWeeklyQuery = [
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
];

const validateMonthlyQuery = [
  query("year")
    .optional()
    .isInt({ min: 2020, max: 2030 })
    .withMessage("Year must be between 2020 and 2030"),

  query("month")
    .optional()
    .isInt({ min: 1, max: 12 })
    .withMessage("Month must be between 1 and 12"),
];

// Routes
router.get("/stats", validateDateQuery, dashboardController.getDashboardStats);
router.get("/weekly", validateWeeklyQuery, dashboardController.getWeeklyStats);
router.get(
  "/monthly",
  validateMonthlyQuery,
  dashboardController.getMonthlyStats
);

module.exports = router;
