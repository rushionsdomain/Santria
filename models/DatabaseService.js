const { PrismaClient } = require("@prisma/client");
const DataStore = require("./DataStore");

class DatabaseService {
  constructor() {
    this.usePrisma = !!process.env.DATABASE_URL;

    if (this.usePrisma) {
      this.prisma = new PrismaClient();
      console.log("✅ Using Prisma with PostgreSQL database");
    } else {
      this.dataStore = DataStore.getInstance();
      console.log("✅ Using in-memory DataStore");
    }
  }

  // Patient operations
  async createPatient(patientData) {
    if (this.usePrisma) {
      return await this.prisma.patient.create({
        data: patientData,
      });
    } else {
      return this.dataStore.createPatient(patientData);
    }
  }

  async findAllPatients(search = "") {
    if (this.usePrisma) {
      const where = search
        ? {
            OR: [
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
              { idNumber: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      return await this.prisma.patient.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });
    } else {
      return this.dataStore.findAllPatients(search);
    }
  }

  async findPatientById(id) {
    if (this.usePrisma) {
      return await this.prisma.patient.findUnique({
        where: { id },
        include: {
          appointments: {
            orderBy: { appointmentDate: "desc" },
          },
        },
      });
    } else {
      return this.dataStore.findPatientById(id);
    }
  }

  async updatePatient(id, updateData) {
    if (this.usePrisma) {
      return await this.prisma.patient.update({
        where: { id },
        data: updateData,
      });
    } else {
      return this.dataStore.updatePatient(id, updateData);
    }
  }

  async deletePatient(id) {
    if (this.usePrisma) {
      return await this.prisma.patient.delete({
        where: { id },
      });
    } else {
      return this.dataStore.deletePatient(id);
    }
  }

  async patientExists(id) {
    if (this.usePrisma) {
      const patient = await this.prisma.patient.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!patient;
    } else {
      return this.dataStore.patientExists(id);
    }
  }

  // Appointment operations
  async createAppointment(appointmentData) {
    if (this.usePrisma) {
      return await this.prisma.appointment.create({
        data: appointmentData,
        include: {
          patient: true,
        },
      });
    } else {
      return this.dataStore.createAppointment(appointmentData);
    }
  }

  async findAllAppointments(filters = {}) {
    if (this.usePrisma) {
      const where = {};

      if (filters.date) {
        const startOfDay = new Date(filters.date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(filters.date);
        endOfDay.setHours(23, 59, 59, 999);

        where.appointmentDate = {
          gte: startOfDay,
          lte: endOfDay,
        };
      }

      if (filters.status) {
        where.status = filters.status;
      }

      return await this.prisma.appointment.findMany({
        where,
        include: {
          patient: true,
        },
        orderBy: { appointmentDate: "desc" },
      });
    } else {
      return this.dataStore.findAllAppointments(filters);
    }
  }

  async findAppointmentById(id) {
    if (this.usePrisma) {
      return await this.prisma.appointment.findUnique({
        where: { id },
        include: {
          patient: true,
        },
      });
    } else {
      return this.dataStore.findAppointmentById(id);
    }
  }

  async updateAppointment(id, updateData) {
    if (this.usePrisma) {
      return await this.prisma.appointment.update({
        where: { id },
        data: updateData,
        include: {
          patient: true,
        },
      });
    } else {
      return this.dataStore.updateAppointment(id, updateData);
    }
  }

  async deleteAppointment(id) {
    if (this.usePrisma) {
      return await this.prisma.appointment.delete({
        where: { id },
      });
    } else {
      return this.dataStore.deleteAppointment(id);
    }
  }

  async appointmentExists(id) {
    if (this.usePrisma) {
      const appointment = await this.prisma.appointment.findUnique({
        where: { id },
        select: { id: true },
      });
      return !!appointment;
    } else {
      return this.dataStore.appointmentExists(id);
    }
  }

  // Dashboard statistics
  async getDashboardStats(date = new Date()) {
    if (this.usePrisma) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [todayStats, weeklyStats, monthlyStats] = await Promise.all([
        // Today's stats
        this.prisma.appointment.groupBy({
          by: ["status"],
          where: {
            appointmentDate: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
          _count: true,
        }),
        // Weekly stats (last 7 days)
        this.prisma.appointment.findMany({
          where: {
            appointmentDate: {
              gte: new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000),
              lte: endOfDay,
            },
          },
          select: {
            appointmentDate: true,
            status: true,
          },
        }),
        // Monthly stats (current month)
        this.prisma.appointment.groupBy({
          by: ["status"],
          where: {
            appointmentDate: {
              gte: new Date(date.getFullYear(), date.getMonth(), 1),
              lte: new Date(
                date.getFullYear(),
                date.getMonth() + 1,
                0,
                23,
                59,
                59,
                999
              ),
            },
          },
          _count: true,
        }),
      ]);

      return {
        today: this.formatStats(todayStats),
        weekly: this.formatWeeklyStats(weeklyStats),
        monthly: this.formatStats(monthlyStats),
      };
    } else {
      return this.dataStore.getDashboardStats(date);
    }
  }

  formatStats(stats) {
    const result = { scheduled: 0, completed: 0, cancelled: 0, noShow: 0 };
    stats.forEach((stat) => {
      result[stat.status] = stat._count;
    });
    return result;
  }

  formatWeeklyStats(weeklyStats) {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStats = weeklyStats.filter((stat) => {
        const statDate = new Date(stat.appointmentDate);
        return statDate.toDateString() === date.toDateString();
      });

      result.push({
        date: date.toISOString().split("T")[0],
        count: dayStats.length,
      });
    }
    return result;
  }

  // Check appointment availability
  async checkAvailability(date, time, doctor) {
    if (this.usePrisma) {
      const appointmentDateTime = new Date(`${date}T${time}`);
      const existingAppointment = await this.prisma.appointment.findFirst({
        where: {
          appointmentDate: appointmentDateTime,
          doctor: doctor,
          status: { in: ["scheduled", "completed"] },
        },
      });
      return !existingAppointment;
    } else {
      return this.dataStore.checkAvailability(date, time, doctor);
    }
  }

  // Close database connection
  async disconnect() {
    if (this.usePrisma && this.prisma) {
      await this.prisma.$disconnect();
    }
  }
}

module.exports = new DatabaseService();
