const dataStore = require("./models/DataStore");

console.log("Testing DataStore...");
console.log("Patients count:", dataStore.findAllPatients().length);
console.log("Appointments count:", dataStore.findAllAppointments().length);
