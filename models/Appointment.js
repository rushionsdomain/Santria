const dataStore = require("./DataStore");

class Appointment {
  create(appointmentData) {
    return dataStore.createAppointment(appointmentData);
  }

  findAll(filters = {}) {
    return dataStore.findAllAppointments(filters);
  }

  findById(id) {
    return dataStore.findAppointmentById(id);
  }

  update(id, updateData) {
    return dataStore.updateAppointment(id, updateData);
  }

  delete(id) {
    return dataStore.deleteAppointment(id);
  }

  exists(id) {
    return dataStore.appointmentExists(id);
  }

  getStats(date = null) {
    return dataStore.getAppointmentStats(date);
  }

  checkAvailability(doctorName, date, time, duration = 30) {
    return dataStore.checkAppointmentAvailability(
      doctorName,
      date,
      time,
      duration
    );
  }
}

module.exports = new Appointment();
