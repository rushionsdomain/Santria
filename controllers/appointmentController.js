const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const { validationResult } = require("express-validator");
const moment = require("moment");

// Get all appointments with optional filters
const getAllAppointments = (req, res) => {
  try {
    const { date, status, patientId } = req.query;
    const filters = {};

    if (date) filters.date = date;
    if (status) filters.status = status;
    if (patientId) filters.patientId = patientId;

    const appointments = Appointment.findAll(filters);

    res.status(200).json({
      success: true,
      count: appointments.length,
      filters,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve appointments",
      message: error.message,
    });
  }
};

// Get appointment by ID
const getAppointmentById = (req, res) => {
  try {
    const { id } = req.params;
    const appointment = Appointment.findById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
        message: `No appointment found with ID: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve appointment",
      message: error.message,
    });
  }
};

// Create new appointment
const createAppointment = (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        error: "Validation failed",
        errors: errors.array(),
      });
    }

    const appointmentData = req.body;

    // Validate patient exists
    if (!Patient.exists(appointmentData.patientId)) {
      return res.status(400).json({
        success: false,
        error: "Invalid patient",
        message: "Patient not found",
      });
    }

    // Get patient name for the appointment
    const patient = Patient.findById(appointmentData.patientId);
    appointmentData.patientName = `${patient.firstName} ${patient.lastName}`;

    // Check if appointment date is in the future
    const appointmentDateTime = moment(
      `${appointmentData.appointmentDate} ${appointmentData.appointmentTime}`
    );
    if (appointmentDateTime.isBefore(moment(), "day")) {
      return res.status(400).json({
        success: false,
        error: "Invalid appointment date",
        message: "Appointment date cannot be in the past",
      });
    }

    // Check doctor availability
    if (
      !Appointment.checkAvailability(
        appointmentData.doctorName,
        appointmentData.appointmentDate,
        appointmentData.appointmentTime,
        appointmentData.duration
      )
    ) {
      return res.status(400).json({
        success: false,
        error: "Doctor unavailable",
        message: "Doctor is not available at the requested time",
      });
    }

    // Set default status if not provided
    if (!appointmentData.status) {
      appointmentData.status = "pending";
    }

    const newAppointment = Appointment.create(appointmentData);

    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: newAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to create appointment",
      message: error.message,
    });
  }
};

// Update appointment
const updateAppointment = (req, res) => {
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

    // Check if appointment exists
    if (!Appointment.exists(id)) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
        message: `No appointment found with ID: ${id}`,
      });
    }

    // If updating date/time, check availability
    if (
      updateData.appointmentDate ||
      updateData.appointmentTime ||
      updateData.duration
    ) {
      const currentAppointment = Appointment.findById(id);
      const date =
        updateData.appointmentDate || currentAppointment.appointmentDate;
      const time =
        updateData.appointmentTime || currentAppointment.appointmentTime;
      const duration = updateData.duration || currentAppointment.duration;

      if (
        !Appointment.checkAvailability(
          currentAppointment.doctorName,
          date,
          time,
          duration
        )
      ) {
        return res.status(400).json({
          success: false,
          error: "Doctor unavailable",
          message: "Doctor is not available at the requested time",
        });
      }
    }

    // If updating patient, validate patient exists and update patient name
    if (updateData.patientId) {
      if (!Patient.exists(updateData.patientId)) {
        return res.status(400).json({
          success: false,
          error: "Invalid patient",
          message: "Patient not found",
        });
      }

      const patient = Patient.findById(updateData.patientId);
      updateData.patientName = `${patient.firstName} ${patient.lastName}`;
    }

    const updatedAppointment = Appointment.update(id, updateData);

    res.status(200).json({
      success: true,
      message: "Appointment updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update appointment",
      message: error.message,
    });
  }
};

// Delete appointment (cancel)
const deleteAppointment = (req, res) => {
  try {
    const { id } = req.params;

    if (!Appointment.exists(id)) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
        message: `No appointment found with ID: ${id}`,
      });
    }

    // Instead of deleting, mark as cancelled
    const updatedAppointment = Appointment.update(id, {
      status: "cancelled",
      notes: updateData.notes || "Appointment cancelled by user",
    });

    res.status(200).json({
      success: true,
      message: "Appointment cancelled successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to cancel appointment",
      message: error.message,
    });
  }
};

// Update appointment status
const updateAppointmentStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!Appointment.exists(id)) {
      return res.status(404).json({
        success: false,
        error: "Appointment not found",
        message: `No appointment found with ID: ${id}`,
      });
    }

    const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: "Invalid status",
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updateData = { status };
    if (notes) updateData.notes = notes;

    const updatedAppointment = Appointment.update(id, updateData);

    res.status(200).json({
      success: true,
      message: "Appointment status updated successfully",
      data: updatedAppointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to update appointment status",
      message: error.message,
    });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  updateAppointmentStatus,
};
