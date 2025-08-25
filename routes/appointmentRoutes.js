const express = require("express");
const { body, param, query } = require("express-validator");
const appointmentController = require("../controllers/appointmentController");

const router = express.Router();

// Validation middleware
const validateAppointmentData = [
  body("patientId").isUUID(4).withMessage("Patient ID must be a valid UUID"),

  body("doctorName")
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Doctor name must be between 3 and 100 characters")
    .matches(/^Dr\.\s+[a-zA-Z\s]+$/)
    .withMessage('Doctor name must start with "Dr." followed by the name'),

  body("specialty")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Specialty must be between 3 and 50 characters")
    .isIn([
      "Cardiology",
      "Pulmonology",
      "Endocrinology",
      "Neurology",
      "Orthopedics",
      "Dermatology",
      "General Medicine",
      "Pediatrics",
      "Gynecology",
      "Oncology",
    ])
    .withMessage("Specialty must be one of the predefined medical specialties"),

  body("appointmentDate")
    .isISO8601()
    .withMessage("Appointment date must be a valid date")
    .custom((value) => {
      const appointmentDate = new Date(value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (appointmentDate < today) {
        throw new Error("Appointment date cannot be in the past");
      }
      return true;
    }),

  body("appointmentTime")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Appointment time must be in HH:MM format (24-hour)")
    .custom((value) => {
      const [hours, minutes] = value.split(":").map(Number);
      if (
        hours < 8 ||
        hours > 18 ||
        (hours === 8 && minutes < 0) ||
        (hours === 18 && minutes > 0)
      ) {
        throw new Error("Appointments must be between 8:00 AM and 6:00 PM");
      }
      return true;
    }),

  body("duration")
    .isInt({ min: 15, max: 120 })
    .withMessage("Duration must be between 15 and 120 minutes"),

  body("type")
    .isIn(["consultation", "examination", "follow-up", "emergency", "routine"])
    .withMessage(
      "Appointment type must be one of: consultation, examination, follow-up, emergency, routine"
    ),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),

  body("symptoms")
    .optional()
    .isArray()
    .withMessage("Symptoms must be an array"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage(
      "Status must be one of: pending, confirmed, completed, cancelled"
    ),
];

const validateAppointmentUpdate = [
  param("id").isUUID(4).withMessage("Invalid appointment ID format"),

  body("patientId")
    .optional()
    .isUUID(4)
    .withMessage("Patient ID must be a valid UUID"),

  body("doctorName")
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage("Doctor name must be between 3 and 100 characters")
    .matches(/^Dr\.\s+[a-zA-Z\s]+$/)
    .withMessage('Doctor name must start with "Dr." followed by the name'),

  body("specialty")
    .optional()
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage("Specialty must be between 3 and 50 characters")
    .isIn([
      "Cardiology",
      "Pulmonology",
      "Endocrinology",
      "Neurology",
      "Orthopedics",
      "Dermatology",
      "General Medicine",
      "Pediatrics",
      "Gynecology",
      "Oncology",
    ])
    .withMessage("Specialty must be one of the predefined medical specialties"),

  body("appointmentDate")
    .optional()
    .isISO8601()
    .withMessage("Appointment date must be a valid date"),

  body("appointmentTime")
    .optional()
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Appointment time must be in HH:MM format (24-hour)"),

  body("duration")
    .optional()
    .isInt({ min: 15, max: 120 })
    .withMessage("Duration must be between 15 and 120 minutes"),

  body("type")
    .optional()
    .isIn(["consultation", "examination", "follow-up", "emergency", "routine"])
    .withMessage(
      "Appointment type must be one of: consultation, examination, follow-up, emergency, routine"
    ),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),

  body("symptoms")
    .optional()
    .isArray()
    .withMessage("Symptoms must be an array"),

  body("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage(
      "Status must be one of: pending, confirmed, completed, cancelled"
    ),
];

const validateAppointmentId = [
  param("id").isUUID(4).withMessage("Invalid appointment ID format"),
];

const validateAppointmentFilters = [
  query("date")
    .optional()
    .isISO8601()
    .withMessage("Date filter must be a valid date"),

  query("status")
    .optional()
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage(
      "Status filter must be one of: pending, confirmed, completed, cancelled"
    ),

  query("patientId")
    .optional()
    .isUUID(4)
    .withMessage("Patient ID filter must be a valid UUID"),
];

const validateStatusUpdate = [
  param("id").isUUID(4).withMessage("Invalid appointment ID format"),

  body("status")
    .isIn(["pending", "confirmed", "completed", "cancelled"])
    .withMessage(
      "Status must be one of: pending, confirmed, completed, cancelled"
    ),

  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

// Routes
router.get(
  "/",
  validateAppointmentFilters,
  appointmentController.getAllAppointments
);
router.get(
  "/:id",
  validateAppointmentId,
  appointmentController.getAppointmentById
);
router.post(
  "/",
  validateAppointmentData,
  appointmentController.createAppointment
);
router.put(
  "/:id",
  validateAppointmentUpdate,
  appointmentController.updateAppointment
);
router.delete(
  "/:id",
  validateAppointmentId,
  appointmentController.deleteAppointment
);

// Additional routes for appointment management
router.patch(
  "/:id/status",
  validateStatusUpdate,
  appointmentController.updateAppointmentStatus
);

module.exports = router;
