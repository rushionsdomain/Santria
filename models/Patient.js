const dataStore = require("./DataStore");

class Patient {
  create(patientData) {
    return dataStore.createPatient(patientData);
  }

  findAll(query = "") {
    return dataStore.findAllPatients(query);
  }

  findById(id) {
    return dataStore.findPatientById(id);
  }

  update(id, updateData) {
    return dataStore.updatePatient(id, updateData);
  }

  delete(id) {
    return dataStore.deletePatient(id);
  }

  exists(id) {
    return dataStore.patientExists(id);
  }
}

module.exports = new Patient();
