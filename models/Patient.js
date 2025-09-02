const DatabaseService = require("./DatabaseService");

class Patient {
  async create(patientData) {
    return await DatabaseService.createPatient(patientData);
  }

  async findAll(query = "") {
    return await DatabaseService.findAllPatients(query);
  }

  async findById(id) {
    return await DatabaseService.findPatientById(id);
  }

  async update(id, updateData) {
    return await DatabaseService.updatePatient(id, updateData);
  }

  async delete(id) {
    return await DatabaseService.deletePatient(id);
  }

  async exists(id) {
    return await DatabaseService.patientExists(id);
  }
}

module.exports = new Patient();
