const express = require("express");
const { body, param, query } = require("express-validator");
const patientController = require("../controllers/patientController");

const router = express.Router();

// Validation middleware
const validatePatientData = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("dateOfBirth")
    .isISO8601()
    .withMessage("Date of birth must be a valid date")
    .custom((value) => {
      const birthDate = new Date(value);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      if (age < 0 || age > 120) {
        throw new Error("Date of birth must be reasonable");
      }
      return true;
    }),

  body("gender")
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("phoneNumber")
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Phone number must be valid"),

  body("email").isEmail().normalizeEmail().withMessage("Email must be valid"),

  body("address")
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),

  body("emergencyContact.name")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Emergency contact name must be between 2 and 50 characters"),

  body("emergencyContact.relationship")
    .trim()
    .isLength({ min: 2, max: 30 })
    .withMessage(
      "Emergency contact relationship must be between 2 and 30 characters"
    ),

  body("emergencyContact.phone")
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Emergency contact phone must be valid"),

  body("medicalHistory")
    .optional()
    .isArray()
    .withMessage("Medical history must be an array"),

  body("insuranceProvider")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Insurance provider must be between 2 and 100 characters"),

  body("insuranceNumber")
    .optional()
    .trim()
    .isLength({ min: 5, max: 50 })
    .withMessage("Insurance number must be between 5 and 50 characters"),
];

const validatePatientUpdate = [
  param("id").isUUID(4).withMessage("Invalid patient ID format"),

  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters and spaces"),

  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("Last name can only contain letters and spaces"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Gender must be Male, Female, or Other"),

  body("phoneNumber")
    .optional()
    .matches(/^\+?[\d\s\-\(\)]+$/)
    .withMessage("Phone number must be valid"),

  body("email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Email must be valid"),

  body("address")
    .optional()
    .trim()
    .isLength({ min: 10, max: 200 })
    .withMessage("Address must be between 10 and 200 characters"),
];

const validatePatientId = [
  param("id").isUUID(4).withMessage("Invalid patient ID format"),
];

const validateSearchQuery = [
  query("search")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Search query must be between 1 and 100 characters"),
];

// Routes
router.get("/", validateSearchQuery, patientController.getAllPatients);
router.get("/:id", validatePatientId, patientController.getPatientById);
router.post("/", validatePatientData, patientController.createPatient);
router.put("/:id", validatePatientUpdate, patientController.updatePatient);
router.delete("/:id", validatePatientId, patientController.deletePatient);

module.exports = router;
