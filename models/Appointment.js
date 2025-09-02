const DatabaseService = require("./DatabaseService");

class Appointment {
  async create(appointmentData) {
    return await DatabaseService.createAppointment(appointmentData);
  }

  async findAll(filters = {}) {
    return await DatabaseService.findAllAppointments(filters);
  }

  async findById(id) {
    return await DatabaseService.findAppointmentById(id);
  }

  async update(id, updateData) {
    return await DatabaseService.updateAppointment(id, updateData);
  }

  async delete(id) {
    return await DatabaseService.deleteAppointment(id);
  }

  async exists(id) {
    return await DatabaseService.appointmentExists(id);
  }

  async getStats(date = null) {
    return await DatabaseService.getDashboardStats(date);
  }

  async checkAvailability(doctorName, date, time, duration = 30) {
    return await DatabaseService.checkAvailability(date, time, doctorName);
  }
}

module.exports = new Appointment();
