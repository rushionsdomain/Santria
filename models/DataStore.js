// Simple in-memory data store that can be shared between models
class DataStore {
  constructor() {
    this.patients = new Map();
    this.appointments = new Map();
    this.initializeSampleData();
  }

  initializeSampleData() {
    // Sample patients
    const samplePatients = [
      {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: "1985-03-15",
        gender: "Male",
        phoneNumber: "+1-555-0123",
        email: "john.doe@email.com",
        address: "123 Main St, Anytown, USA",
        emergencyContact: {
          name: "Jane Doe",
          relationship: "Spouse",
          phone: "+1-555-0124",
        },
        medicalHistory: ["Hypertension", "Diabetes Type 2"],
        insuranceProvider: "Blue Cross Blue Shield",
        insuranceNumber: "BCBS123456789",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        firstName: "Sarah",
        lastName: "Johnson",
        dateOfBirth: "1992-07-22",
        gender: "Female",
        phoneNumber: "+1-555-0125",
        email: "sarah.johnson@email.com",
        address: "456 Oak Ave, Somewhere, USA",
        emergencyContact: {
          name: "Mike Johnson",
          relationship: "Father",
          phone: "+1-555-0126",
        },
        medicalHistory: ["Asthma"],
        insuranceProvider: "Aetna",
        insuranceNumber: "AETNA987654321",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        firstName: "Michael",
        lastName: "Chen",
        dateOfBirth: "1978-11-08",
        gender: "Male",
        phoneNumber: "+1-555-0127",
        email: "michael.chen@email.com",
        address: "789 Pine Rd, Elsewhere, USA",
        emergencyContact: {
          name: "Lisa Chen",
          relationship: "Wife",
          phone: "+1-555-0128",
        },
        medicalHistory: ["High Cholesterol"],
        insuranceProvider: "Cigna",
        insuranceNumber: "CIGNA456789123",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Sample appointments
    const sampleAppointments = [
      {
        id: "1",
        patientId: "1",
        patientName: "John Doe",
        doctorName: "Dr. Emily Smith",
        specialty: "Cardiology",
        appointmentDate: "2024-01-15",
        appointmentTime: "09:00",
        duration: 30,
        status: "confirmed",
        type: "consultation",
        notes: "Follow-up appointment for hypertension management",
        symptoms: ["High blood pressure", "Chest discomfort"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "2",
        patientId: "2",
        patientName: "Sarah Johnson",
        doctorName: "Dr. Robert Wilson",
        specialty: "Pulmonology",
        appointmentDate: "2024-01-16",
        appointmentTime: "14:30",
        duration: 45,
        status: "pending",
        type: "examination",
        notes: "Asthma check-up and medication review",
        symptoms: ["Shortness of breath", "Wheezing"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "3",
        patientId: "3",
        patientName: "Michael Chen",
        doctorName: "Dr. Lisa Rodriguez",
        specialty: "Endocrinology",
        appointmentDate: "2024-01-17",
        appointmentTime: "11:00",
        duration: 30,
        status: "completed",
        type: "consultation",
        notes: "Cholesterol management consultation",
        symptoms: ["High cholesterol levels"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: "4",
        patientId: "1",
        patientName: "John Doe",
        doctorName: "Dr. Emily Smith",
        specialty: "Cardiology",
        appointmentDate: "2024-01-20",
        appointmentTime: "10:00",
        duration: 30,
        status: "cancelled",
        type: "follow-up",
        notes: "Patient requested cancellation due to scheduling conflict",
        symptoms: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // Initialize data
    samplePatients.forEach((patient) => {
      this.patients.set(patient.id, patient);
    });

    sampleAppointments.forEach((appointment) => {
      this.appointments.set(appointment.id, appointment);
    });
  }

  // Patient methods
  createPatient(patientData) {
    const { v4: uuidv4 } = require("uuid");
    const id = uuidv4();
    const now = new Date().toISOString();

    const patient = {
      id,
      ...patientData,
      createdAt: now,
      updatedAt: now,
    };

    this.patients.set(id, patient);
    return patient;
  }

  findAllPatients(query = "") {
    let patients = Array.from(this.patients.values());

    if (query) {
      const searchTerm = query.toLowerCase();
      patients = patients.filter(
        (patient) =>
          patient.firstName.toLowerCase().includes(searchTerm) ||
          patient.lastName.toLowerCase().includes(searchTerm) ||
          patient.id.includes(searchTerm)
      );
    }

    return patients.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  findPatientById(id) {
    return this.patients.get(id);
  }

  updatePatient(id, updateData) {
    const patient = this.patients.get(id);
    if (!patient) {
      return null;
    }

    const updatedPatient = {
      ...patient,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  deletePatient(id) {
    return this.patients.delete(id);
  }

  patientExists(id) {
    return this.patients.has(id);
  }

  // Appointment methods
  createAppointment(appointmentData) {
    const { v4: uuidv4 } = require("uuid");
    const id = uuidv4();
    const now = new Date().toISOString();

    const appointment = {
      id,
      ...appointmentData,
      createdAt: now,
      updatedAt: now,
    };

    this.appointments.set(id, appointment);
    return appointment;
  }

  findAllAppointments(filters = {}) {
    let appointments = Array.from(this.appointments.values());

    // Filter by date
    if (filters.date) {
      appointments = appointments.filter(
        (appointment) => appointment.appointmentDate === filters.date
      );
    }

    // Filter by status
    if (filters.status) {
      appointments = appointments.filter(
        (appointment) => appointment.status === filters.status
      );
    }

    // Filter by patient ID
    if (filters.patientId) {
      appointments = appointments.filter(
        (appointment) => appointment.patientId === filters.patientId
      );
    }

    return appointments.sort((a, b) => {
      const moment = require("moment");
      const dateA = moment(`${a.appointmentDate} ${a.appointmentTime}`);
      const dateB = moment(`${b.appointmentDate} ${b.appointmentTime}`);
      return dateA - dateB;
    });
  }

  findAppointmentById(id) {
    return this.appointments.get(id);
  }

  updateAppointment(id, updateData) {
    const appointment = this.appointments.get(id);
    if (!appointment) {
      return null;
    }

    const updatedAppointment = {
      ...appointment,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    this.appointments.set(id, updatedAppointment);
    return updatedAppointment;
  }

  deleteAppointment(id) {
    return this.appointments.delete(id);
  }

  appointmentExists(id) {
    return this.appointments.has(id);
  }

  getAppointmentStats(date = null) {
    const appointments = date
      ? this.findAllAppointments({ date })
      : Array.from(this.appointments.values());

    const total = appointments.length;
    const confirmed = appointments.filter(
      (a) => a.status === "confirmed"
    ).length;
    const pending = appointments.filter((a) => a.status === "pending").length;
    const completed = appointments.filter(
      (a) => a.status === "completed"
    ).length;
    const cancelled = appointments.filter(
      (a) => a.status === "cancelled"
    ).length;

    return {
      total,
      confirmed,
      pending,
      completed,
      cancelled,
      date: date || "all",
    };
  }

  checkAppointmentAvailability(doctorName, date, time, duration = 30) {
    const appointments = this.findAllAppointments({ date });
    const moment = require("moment");
    const requestedTime = moment(`${date} ${time}`);
    const requestedEnd = requestedTime.clone().add(duration, "minutes");

    for (const appointment of appointments) {
      if (
        appointment.doctorName === doctorName &&
        appointment.status !== "cancelled"
      ) {
        const existingTime = moment(
          `${appointment.appointmentDate} ${appointment.appointmentTime}`
        );
        const existingEnd = existingTime
          .clone()
          .add(appointment.duration, "minutes");

        if (
          requestedTime.isBefore(existingEnd) &&
          requestedEnd.isAfter(existingTime)
        ) {
          return false; // Conflict found
        }
      }
    }

    return true; // No conflicts
  }
}

// Export a single instance
module.exports = new DataStore();
