const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// Test data
const testPatient = {
  firstName: "Test",
  lastName: "Patient",
  dateOfBirth: "1990-01-01",
  gender: "Male",
  phoneNumber: "+1-555-0000",
  email: "test@example.com",
  address: "123 Test St, Test City, USA",
  emergencyContact: {
    name: "Emergency Contact",
    relationship: "Friend",
    phone: "+1-555-0001",
  },
  medicalHistory: ["None"],
  insuranceProvider: "Test Insurance",
  insuranceNumber: "TEST123456789",
};

const testAppointment = {
  patientId: "1", // Use existing patient ID
  doctorName: "Dr. Test Doctor",
  specialty: "General Medicine",
  appointmentDate: "2024-02-01",
  appointmentTime: "10:00",
  duration: 30,
  type: "consultation",
  notes: "Test appointment",
  symptoms: ["Test symptom"],
};

async function testAPI() {
  console.log("🧪 Testing Digital Health Appointment System API\n");

  try {
    // Test 1: Health Check
    console.log("1️⃣ Testing Health Check...");
    const healthResponse = await axios.get(`${BASE_URL}/health`);
    console.log("✅ Health Check:", healthResponse.data.message);

    // Test 2: Get All Patients
    console.log("\n2️⃣ Testing Get All Patients...");
    const patientsResponse = await axios.get(`${BASE_URL}/api/patients`);
    console.log(`✅ Found ${patientsResponse.data.count} patients`);

    // Test 3: Search Patients
    console.log("\n3️⃣ Testing Patient Search...");
    const searchResponse = await axios.get(
      `${BASE_URL}/api/patients?search=john`
    );
    console.log(
      `✅ Search results: ${searchResponse.data.count} patients found`
    );

    // Test 4: Get Patient by ID
    console.log("\n4️⃣ Testing Get Patient by ID...");
    const patientResponse = await axios.get(`${BASE_URL}/api/patients/1`);
    console.log(
      `✅ Patient: ${patientResponse.data.data.firstName} ${patientResponse.data.data.lastName}`
    );

    // Test 5: Create New Patient
    console.log("\n5️⃣ Testing Create Patient...");
    const createPatientResponse = await axios.post(
      `${BASE_URL}/api/patients`,
      testPatient
    );
    console.log(
      `✅ Created patient: ${createPatientResponse.data.data.firstName} ${createPatientResponse.data.data.lastName}`
    );
    const newPatientId = createPatientResponse.data.data.id;

    // Test 6: Update Patient
    console.log("\n6️⃣ Testing Update Patient...");
    const updateResponse = await axios.put(
      `${BASE_URL}/api/patients/${newPatientId}`,
      {
        phoneNumber: "+1-555-9999",
      }
    );
    console.log(
      `✅ Updated patient phone: ${updateResponse.data.data.phoneNumber}`
    );

    // Test 7: Get All Appointments
    console.log("\n7️⃣ Testing Get All Appointments...");
    const appointmentsResponse = await axios.get(
      `${BASE_URL}/api/appointments`
    );
    console.log(`✅ Found ${appointmentsResponse.data.count} appointments`);

    // Test 8: Filter Appointments
    console.log("\n8️⃣ Testing Appointment Filtering...");
    const filteredResponse = await axios.get(
      `${BASE_URL}/api/appointments?status=confirmed`
    );
    console.log(
      `✅ Found ${filteredResponse.data.count} confirmed appointments`
    );

    // Test 9: Get Appointment by ID
    console.log("\n9️⃣ Testing Get Appointment by ID...");
    const appointmentResponse = await axios.get(
      `${BASE_URL}/api/appointments/1`
    );
    console.log(
      `✅ Appointment: ${appointmentResponse.data.data.patientName} with ${appointmentResponse.data.data.doctorName}`
    );

    // Test 10: Create New Appointment
    console.log("\n🔟 Testing Create Appointment...");
    const createAppointmentResponse = await axios.post(
      `${BASE_URL}/api/appointments`,
      testAppointment
    );
    console.log(
      `✅ Created appointment: ${createAppointmentResponse.data.data.patientName} with ${createAppointmentResponse.data.data.doctorName}`
    );
    const newAppointmentId = createAppointmentResponse.data.data.id;

    // Test 11: Update Appointment Status
    console.log("\n1️⃣1️⃣ Testing Update Appointment Status...");
    const statusResponse = await axios.patch(
      `${BASE_URL}/api/appointments/${newAppointmentId}/status`,
      {
        status: "confirmed",
        notes: "Appointment confirmed via API test",
      }
    );
    console.log(`✅ Updated status to: ${statusResponse.data.data.status}`);

    // Test 12: Get Dashboard Stats
    console.log("\n1️⃣2️⃣ Testing Dashboard Statistics...");
    const statsResponse = await axios.get(`${BASE_URL}/api/dashboard/stats`);
    console.log(
      `✅ Dashboard stats: ${statsResponse.data.data.appointments.total} appointments today`
    );

    // Test 13: Get Weekly Stats
    console.log("\n1️⃣3️⃣ Testing Weekly Statistics...");
    const weeklyResponse = await axios.get(`${BASE_URL}/api/dashboard/weekly`);
    console.log(
      `✅ Weekly stats: ${weeklyResponse.data.data.stats.length} days of data`
    );

    // Test 14: Get Monthly Stats
    console.log("\n1️⃣4️⃣ Testing Monthly Statistics...");
    const monthlyResponse = await axios.get(
      `${BASE_URL}/api/dashboard/monthly`
    );
    console.log(
      `✅ Monthly stats: ${monthlyResponse.data.data.monthName} ${monthlyResponse.data.data.year}`
    );

    // Test 15: Error Handling - Invalid Patient ID
    console.log("\n1️⃣5️⃣ Testing Error Handling...");
    try {
      await axios.get(`${BASE_URL}/api/patients/invalid-id`);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        console.log(
          "✅ Error handling working: Invalid patient ID returns 404"
        );
      }
    }

    console.log("\n🎉 All API tests completed successfully!");
    console.log("\n📊 Final Statistics:");
    console.log(`👥 Total Patients: ${patientsResponse.data.count}`);
    console.log(`📅 Total Appointments: ${appointmentsResponse.data.count}`);
    console.log(
      `📈 Today's Appointments: ${statsResponse.data.data.appointments.total}`
    );
  } catch (error) {
    console.error(
      "❌ Test failed:",
      error.response ? error.response.data : error.message
    );
  }
}

// Check if axios is available
try {
  require.resolve("axios");
  testAPI();
} catch (e) {
  console.log("📦 Axios not found. Installing dependencies first...");
  console.log("💡 Run: npm install axios");
  console.log("💡 Then run: node test-api.js");
}
