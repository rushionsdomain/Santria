const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");
const moment = require("moment");

// Get dashboard statistics
const getDashboardStats = (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date || moment().format("YYYY-MM-DD");

    // Get appointment statistics
    const appointmentStats = Appointment.getStats(targetDate);

    // Get patient statistics
    const allPatients = Patient.findAll();
    const totalPatients = allPatients.length;

    // Get recent appointments (last 7 days)
    const sevenDaysAgo = moment().subtract(7, "days").format("YYYY-MM-DD");
    const recentAppointments = Appointment.findAll().filter((apt) =>
      moment(apt.appointmentDate).isSameOrAfter(sevenDaysAgo)
    );

    // Get upcoming appointments (next 7 days)
    const nextSevenDays = moment().add(7, "days").format("YYYY-MM-DD");
    const upcomingAppointments = Appointment.findAll().filter(
      (apt) =>
        moment(apt.appointmentDate).isSameOrBefore(nextSevenDays) &&
        apt.status !== "cancelled" &&
        apt.status !== "completed"
    );

    // Get appointments by specialty
    const appointmentsBySpecialty = {};
    Appointment.findAll().forEach((apt) => {
      if (apt.status !== "cancelled") {
        appointmentsBySpecialty[apt.specialty] =
          (appointmentsBySpecialty[apt.specialty] || 0) + 1;
      }
    });

    // Get appointments by doctor
    const appointmentsByDoctor = {};
    Appointment.findAll().forEach((apt) => {
      if (apt.status !== "cancelled") {
        appointmentsByDoctor[apt.doctorName] =
          (appointmentsByDoctor[apt.doctorName] || 0) + 1;
      }
    });

    // Calculate trends (compare with previous day)
    const previousDay = moment(targetDate)
      .subtract(1, "day")
      .format("YYYY-MM-DD");
    const previousDayStats = Appointment.getStats(previousDay);

    const trends = {
      total: appointmentStats.total - previousDayStats.total,
      confirmed: appointmentStats.confirmed - previousDayStats.confirmed,
      pending: appointmentStats.pending - previousDayStats.pending,
      completed: appointmentStats.completed - previousDayStats.completed,
      cancelled: appointmentStats.cancelled - previousDayStats.cancelled,
    };

    const dashboardData = {
      date: targetDate,
      appointments: {
        ...appointmentStats,
        trends,
      },
      patients: {
        total: totalPatients,
        newThisWeek: allPatients.filter((p) =>
          moment(p.createdAt).isSameOrAfter(sevenDaysAgo)
        ).length,
      },
      recent: {
        last7Days: recentAppointments.length,
        next7Days: upcomingAppointments.length,
      },
      analytics: {
        bySpecialty: appointmentsBySpecialty,
        byDoctor: appointmentsByDoctor,
        averageAppointmentsPerDay: Math.round(
          Appointment.findAll().filter((apt) =>
            moment(apt.createdAt).isSameOrAfter(moment().subtract(30, "days"))
          ).length / 30
        ),
      },
      timestamp: new Date().toISOString(),
    };

    res.status(200).json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve dashboard statistics",
      message: error.message,
    });
  }
};

// Get weekly statistics
const getWeeklyStats = (req, res) => {
  try {
    const { startDate } = req.query;
    const weekStart = startDate ? moment(startDate) : moment().startOf("week");
    const weekEnd = weekStart.clone().endOf("week");

    const weeklyStats = [];
    const currentDate = weekStart.clone();

    while (currentDate.isSameOrBefore(weekEnd)) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      const dayStats = Appointment.getStats(dateStr);

      weeklyStats.push({
        date: dateStr,
        day: currentDate.format("dddd"),
        ...dayStats,
      });

      currentDate.add(1, "day");
    }

    res.status(200).json({
      success: true,
      data: {
        weekStart: weekStart.format("YYYY-MM-DD"),
        weekEnd: weekEnd.format("YYYY-MM-DD"),
        stats: weeklyStats,
        total: weeklyStats.reduce(
          (acc, day) => ({
            total: acc.total + day.total,
            confirmed: acc.confirmed + day.confirmed,
            pending: acc.pending + day.pending,
            completed: acc.completed + day.completed,
            cancelled: acc.cancelled + day.cancelled,
          }),
          { total: 0, confirmed: 0, pending: 0, completed: 0, cancelled: 0 }
        ),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve weekly statistics",
      message: error.message,
    });
  }
};

// Get monthly statistics
const getMonthlyStats = (req, res) => {
  try {
    const { year, month } = req.query;
    const targetYear = year || moment().year();
    const targetMonth = month || moment().month() + 1;

    const monthStart = moment(
      `${targetYear}-${targetMonth.toString().padStart(2, "0")}-01`
    );
    const monthEnd = monthStart.clone().endOf("month");

    const monthlyStats = [];
    const currentDate = monthStart.clone();

    while (currentDate.isSameOrBefore(monthEnd)) {
      const dateStr = currentDate.format("YYYY-MM-DD");
      const dayStats = Appointment.getStats(dateStr);

      monthlyStats.push({
        date: dateStr,
        day: currentDate.date(),
        ...dayStats,
      });

      currentDate.add(1, "day");
    }

    const totalStats = monthlyStats.reduce(
      (acc, day) => ({
        total: acc.total + day.total,
        confirmed: acc.confirmed + day.confirmed,
        pending: acc.pending + day.pending,
        completed: acc.completed + day.completed,
        cancelled: acc.cancelled + day.cancelled,
      }),
      { total: 0, confirmed: 0, pending: 0, completed: 0, cancelled: 0 }
    );

    res.status(200).json({
      success: true,
      data: {
        year: targetYear,
        month: targetMonth,
        monthName: monthStart.format("MMMM"),
        stats: monthlyStats,
        total: totalStats,
        average: {
          total: Math.round(totalStats.total / monthEnd.date()),
          confirmed: Math.round(totalStats.confirmed / monthEnd.date()),
          pending: Math.round(totalStats.pending / monthEnd.date()),
          completed: Math.round(totalStats.completed / monthEnd.date()),
          cancelled: Math.round(totalStats.cancelled / monthEnd.date()),
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Failed to retrieve monthly statistics",
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getWeeklyStats,
  getMonthlyStats,
};
