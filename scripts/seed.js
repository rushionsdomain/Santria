const dataStore = require("../models/DataStore");
const moment = require("moment");

console.log("🌱 Starting database seeding...");

// Add more patients
const additionalPatients = [
  {
    firstName: "Emily",
    lastName: "Davis",
    dateOfBirth: "1990-05-12",
    gender: "Female",
    phoneNumber: "+1-555-0129",
    email: "emily.davis@email.com",
    address: "321 Elm St, Nowhere, USA",
    emergencyContact: {
      name: "David Davis",
      relationship: "Husband",
      phone: "+1-555-0130",
    },
    medicalHistory: ["Migraines"],
    insuranceProvider: "UnitedHealth",
    insuranceNumber: "UNH123456789",
  },
  {
    firstName: "Robert",
    lastName: "Wilson",
    dateOfBirth: "1982-09-25",
    gender: "Male",
    phoneNumber: "+1-555-0131",
    email: "robert.wilson@email.com",
    address: "654 Maple Dr, Somewhere, USA",
    emergencyContact: {
      name: "Jennifer Wilson",
      relationship: "Wife",
      phone: "+1-555-0132",
    },
    medicalHistory: ["Hypertension", "Sleep Apnea"],
    insuranceProvider: "Humana",
    insuranceNumber: "HUM987654321",
  },
  {
    firstName: "Lisa",
    lastName: "Brown",
    dateOfBirth: "1988-12-03",
    gender: "Female",
    phoneNumber: "+1-555-0133",
    email: "lisa.brown@email.com",
    address: "987 Cedar Ln, Elsewhere, USA",
    emergencyContact: {
      name: "Mark Brown",
      relationship: "Brother",
      phone: "+1-555-0134",
    },
    medicalHistory: ["Anxiety", "Depression"],
    insuranceProvider: "Kaiser Permanente",
    insuranceNumber: "KP456789123",
  },
  {
    firstName: "James",
    lastName: "Taylor",
    dateOfBirth: "1975-03-18",
    gender: "Male",
    phoneNumber: "+1-555-0135",
    email: "james.taylor@email.com",
    address: "147 Birch Ave, Anywhere, USA",
    emergencyContact: {
      name: "Mary Taylor",
      relationship: "Sister",
      phone: "+1-555-0136",
    },
    medicalHistory: ["Diabetes Type 1", "High Blood Pressure"],
    insuranceProvider: "Blue Cross Blue Shield",
    insuranceNumber: "BCBS789123456",
  },
  {
    firstName: "Amanda",
    lastName: "Garcia",
    dateOfBirth: "1995-07-30",
    gender: "Female",
    phoneNumber: "+1-555-0137",
    email: "amanda.garcia@email.com",
    address: "258 Willow Way, Someplace, USA",
    emergencyContact: {
      name: "Carlos Garcia",
      relationship: "Father",
      phone: "+1-555-0138",
    },
    medicalHistory: ["Asthma", "Seasonal Allergies"],
    insuranceProvider: "Aetna",
    insuranceNumber: "AETNA321654987",
  },
];

// Add more appointments
const additionalAppointments = [
  {
    patientId: "1", // Use existing patient ID
    patientName: "John Doe",
    doctorName: "Dr. Sarah Johnson",
    specialty: "Neurology",
    appointmentDate: moment().add(2, "days").format("YYYY-MM-DD"),
    appointmentTime: "10:30",
    duration: 45,
    status: "confirmed",
    type: "consultation",
    notes: "Follow-up for migraine treatment",
    symptoms: ["Severe headaches", "Light sensitivity"],
  },
  {
    patientId: "2", // Use existing patient ID
    patientName: "Sarah Johnson",
    doctorName: "Dr. Michael Chen",
    specialty: "Cardiology",
    appointmentDate: moment().add(3, "days").format("YYYY-MM-DD"),
    appointmentTime: "14:00",
    duration: 30,
    status: "pending",
    type: "examination",
    notes: "Hypertension check-up",
    symptoms: ["High blood pressure", "Chest tightness"],
  },
  {
    patientId: "3", // Use existing patient ID
    patientName: "Michael Chen",
    doctorName: "Dr. Jennifer Smith",
    specialty: "Psychiatry",
    appointmentDate: moment().add(1, "week").format("YYYY-MM-DD"),
    appointmentTime: "11:00",
    duration: 60,
    status: "confirmed",
    type: "consultation",
    notes: "Mental health evaluation",
    symptoms: ["Anxiety", "Depression", "Insomnia"],
  },
];

// Add patients
console.log("👥 Adding additional patients...");
additionalPatients.forEach((patient) => {
  const newPatient = dataStore.createPatient(patient);
  console.log(
    `✅ Added patient: ${newPatient.firstName} ${newPatient.lastName} (ID: ${newPatient.id})`
  );
});

// Add appointments
console.log("📅 Adding additional appointments...");
additionalAppointments.forEach((appointment) => {
  const newAppointment = dataStore.createAppointment(appointment);
  console.log(
    `✅ Added appointment: ${newAppointment.patientName} with ${newAppointment.doctorName} on ${newAppointment.appointmentDate}`
  );
});

// Display final statistics
console.log("\n📊 Database seeding completed!");
console.log("📈 Final statistics:");

const totalPatients = dataStore.findAllPatients().length;
const totalAppointments = dataStore.findAllAppointments().length;
const appointmentStats = dataStore.getAppointmentStats();

console.log(`👥 Total Patients: ${totalPatients}`);
console.log(`📅 Total Appointments: ${totalAppointments}`);
console.log(`📊 Today's Appointments: ${appointmentStats.total}`);
console.log(`✅ Confirmed: ${appointmentStats.confirmed}`);
console.log(`⏳ Pending: ${appointmentStats.pending}`);
console.log(`✅ Completed: ${appointmentStats.completed}`);
console.log(`❌ Cancelled: ${appointmentStats.cancelled}`);

console.log("\n🚀 Your Digital Health Appointment System is ready!");
console.log("💡 You can now test the API endpoints with the sample data.");
console.log(
  "📖 Check the README.md for API documentation and testing examples."
);
