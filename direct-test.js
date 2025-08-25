const dataStore = require("./models/DataStore");

console.log("🔍 Direct DataStore Test\n");

// Check patients
const patients = dataStore.findAllPatients();
console.log(`👥 Patients in system: ${patients.length}`);
patients.forEach((p) => {
  console.log(`  - ${p.firstName} ${p.lastName} (ID: ${p.id})`);
});

console.log("\n📅 Appointments in system:");
const appointments = dataStore.findAllAppointments();
console.log(`  Total: ${appointments.length}`);

// Group by status
const byStatus = {};
appointments.forEach((apt) => {
  byStatus[apt.status] = (byStatus[apt.status] || 0) + 1;
});

Object.entries(byStatus).forEach(([status, count]) => {
  console.log(`  ${status}: ${count}`);
});

// Check today's stats
const today = new Date().toISOString().split("T")[0];
const todayStats = dataStore.getAppointmentStats(today);
console.log(`\n📊 Today's stats (${today}):`);
console.log(`  Total: ${todayStats.total}`);
console.log(`  Confirmed: ${todayStats.confirmed}`);
console.log(`  Pending: ${todayStats.pending}`);
console.log(`  Completed: ${todayStats.completed}`);
console.log(`  Cancelled: ${todayStats.cancelled}`);

console.log("\n✅ Direct DataStore test completed!");
