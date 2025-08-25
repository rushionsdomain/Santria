const Patient = require("../models/Patient");
const { validationResult } = require("express-validator");

// Get all patients with optional search
const getAllPatients = (req, res) => {
  try {
    const { search } = req.query;
    const patients = Patient.findAll(search);

    res.status(200).json({
      success: true,
      count: patients.length,
      data: patients,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve patients",
      message: error.message,
    });
  }
};

// Get patient by ID
const getPatientById = (req, res) => {
  try {
    const { id } = req.params;
    const patient = Patient.findById(id);

    if (!patient) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
        message: `No patient found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve patient",
      message: error.message,
    });
  }
};

// Create new patient
const createPatient = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: errors.array(),
      });
    }

    const patientData = req.body;

    // Check if patient with same email already exists
    const existingPatients = Patient.findAll();
    const emailExists = existingPatients.some(
      (patient) => patient.email === patientData.email
    );

    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "Email already exists",
        message: "A patient with this email address already exists",
      });
    }

    const newPatient = Patient.create(patientData);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: newPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create patient",
      message: error.message,
    });
  }
};

// Update patient
const updatePatient = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: errors.array(),
      });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Check if patient exists
    if (!Patient.exists(id)) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
        message: `No patient found with ID: ${id}`,
      });
    }

    // Check if email is being updated and if it conflicts with existing patients
    if (updateData.email) {
      const existingPatients = Patient.findAll();
      const emailExists = existingPatients.some(
        (patient) => patient.email === updateData.email && patient.id !== id
      );

      if (emailExists) {
        return res.status(400).json({
          success: false,
          error: "Email already exists",
          message: "A patient with this email address already exists",
        });
      }
    }

    const updatedPatient = Patient.update(id, updateData);

    res.status(200).json({
      success: true,
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update patient",
      message: error.message,
    });
  }
};

// Delete patient
const deletePatient = (req, res) => {
  try {
    const { id } = req.params;

    if (!Patient.exists(id)) {
      return res.status(404).json({
        success: false,
        error: "Patient not found",
        message: `No patient found with ID: ${id}`,
      });
    }

    Patient.delete(id);

    res.status(200).json({
      success: true,
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to delete patient",
      message: error.message,
    });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient,
};
