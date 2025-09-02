import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  ChevronLeft,
  ChevronRight,
  Add,
  Edit,
  Delete,
  Visibility,
} from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import {
  fetchAppointments,
  createAppointment,
  updateAppointment,
} from "../api/appointments";
import { fetchPatients } from "../api/patients";

const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientId: "",
    appointmentDate: moment().format("YYYY-MM-DD"),
    appointmentTime: "09:00",
    doctorName: "",
    specialty: "",
    duration: 30,
    notes: "",
    status: "scheduled",
  });
  const [error, setError] = useState("");

  const doctors = [
    "Dr. Sarah Johnson",
    "Dr. Michael Chen",
    "Dr. Emily Rodriguez",
    "Dr. David Kim",
    "Dr. Lisa Thompson",
  ];

  const specialties = [
    "General Medicine",
    "Cardiology",
    "Dermatology",
    "Orthopedics",
    "Pediatrics",
    "Neurology",
    "Psychiatry",
    "Ophthalmology",
  ];

  useEffect(() => {
    loadAppointments();
    loadPatients();
  }, [currentDate]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (error) {
      console.error("Error loading patients:", error);
    }
  };

  const getAppointmentsForDate = (date) => {
    return appointments.filter(
      (apt) =>
        moment(apt.appointmentDate).format("YYYY-MM-DD") ===
        date.format("YYYY-MM-DD")
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "primary";
      case "confirmed":
        return "info";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      case "noShow":
        return "warning";
      default:
        return "default";
    }
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setFormData((prev) => ({
      ...prev,
      appointmentDate: date.format("YYYY-MM-DD"),
    }));
    setDialogOpen(true);
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setViewDialogOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const patient = patients.find((p) => p.id === formData.patientId);
      if (!patient) {
        setError("Please select a patient");
        return;
      }

      const appointmentData = {
        ...formData,
        patientName: `${patient.firstName} ${patient.lastName}`,
      };

      if (selectedAppointment) {
        await updateAppointment(selectedAppointment.id, appointmentData);
      } else {
        await createAppointment(appointmentData);
      }

      setDialogOpen(false);
      setSelectedAppointment(null);
      setFormData({
        patientId: "",
        appointmentDate: moment().format("YYYY-MM-DD"),
        appointmentTime: "09:00",
        doctorName: "",
        specialty: "",
        duration: 30,
        notes: "",
        status: "scheduled",
      });
      loadAppointments();
    } catch (error) {
      setError(error.response?.data?.message || "Failed to save appointment");
    }
  };

  const handleEditAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientId: appointment.patientId,
      appointmentDate: appointment.appointmentDate,
      appointmentTime: appointment.appointmentTime,
      doctorName: appointment.doctorName,
      specialty: appointment.specialty,
      duration: appointment.duration,
      notes: appointment.notes || "",
      status: appointment.status,
    });
    setViewDialogOpen(false);
    setDialogOpen(true);
  };

  const renderCalendarGrid = () => {
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const startOfCalendar = startOfMonth.clone().startOf("week");
    const endOfCalendar = endOfMonth.clone().endOf("week");

    const days = [];
    const currentDay = startOfCalendar.clone();

    while (currentDay.isSameOrBefore(endOfCalendar)) {
      const dayAppointments = getAppointmentsForDate(currentDay);
      const isCurrentMonth = currentDay.isSame(currentDate, "month");
      const isToday = currentDay.isSame(moment(), "day");

      days.push(
        <Grid item xs={12 / 7} key={currentDay.format("YYYY-MM-DD")}>
          <Paper
            elevation={isToday ? 3 : 1}
            sx={{
              p: { xs: 0.5, sm: 1 },
              minHeight: { xs: 80, sm: 120 },
              cursor: "pointer",
              backgroundColor: isToday ? "#e3f2fd" : "white",
              border: isToday ? "2px solid #2196f3" : "1px solid #e0e0e0",
              "&:hover": {
                backgroundColor: "#f5f5f5",
              },
            }}
            onClick={() => handleDateClick(currentDay)}
          >
            <Typography
              variant="body2"
              sx={{
                fontWeight: isToday ? "bold" : "normal",
                color: isCurrentMonth ? "text.primary" : "text.secondary",
                mb: 0.5,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
              }}
            >
              {currentDay.format("D")}
            </Typography>
            <Box sx={{ maxHeight: { xs: 60, sm: 80 }, overflow: "hidden" }}>
              {dayAppointments.slice(0, 2).map((apt, index) => (
                <Chip
                  key={apt.id}
                  label={`${apt.appointmentTime} - ${apt.patientName}`}
                  size="small"
                  color={getStatusColor(apt.status)}
                  sx={{
                    mb: 0.5,
                    fontSize: { xs: "0.6rem", sm: "0.7rem" },
                    height: { xs: 16, sm: 20 },
                    "& .MuiChip-label": {
                      px: 0.5,
                      display: { xs: "none", sm: "block" },
                    },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAppointmentClick(apt);
                  }}
                />
              ))}
              {dayAppointments.length > 2 && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontSize: { xs: "0.6rem", sm: "0.75rem" } }}
                >
                  +{dayAppointments.length - 2} more
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      );
      currentDay.add(1, "day");
    }

    return days;
  };

  const renderWeekDays = () => {
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return weekDays.map((day) => (
      <Grid item xs={12 / 7} key={day}>
        <Typography
          variant="subtitle2"
          align="center"
          sx={{ fontWeight: "bold", py: 1 }}
        >
          {day}
        </Typography>
      </Grid>
    ));
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Box sx={{ height: "100vh", width: "100%", overflow: "auto" }}>
        {/* Calendar Header */}
        <Box
          display="flex"
          flexDirection={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          mb={3}
          gap={2}
        >
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontSize: { xs: "1.5rem", sm: "2rem" },
              textAlign: { xs: "center", sm: "left" },
            }}
          >
            Appointment Calendar
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
            flexDirection={{ xs: "column", sm: "row" }}
            width={{ xs: "100%", sm: "auto" }}
          >
            <Box display="flex" alignItems="center" gap={1}>
              <IconButton
                onClick={() =>
                  setCurrentDate(currentDate.clone().subtract(1, "month"))
                }
                size="small"
              >
                <ChevronLeft />
              </IconButton>
              <Typography
                variant="h6"
                sx={{
                  minWidth: { xs: 150, sm: 200 },
                  textAlign: "center",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                {currentDate.format("MMMM YYYY")}
              </Typography>
              <IconButton
                onClick={() =>
                  setCurrentDate(currentDate.clone().add(1, "month"))
                }
                size="small"
              >
                <ChevronRight />
              </IconButton>
            </Box>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setSelectedAppointment(null);
                setFormData({
                  patientId: "",
                  appointmentDate: moment().format("YYYY-MM-DD"),
                  appointmentTime: "09:00",
                  doctorName: "",
                  specialty: "",
                  duration: 30,
                  notes: "",
                  status: "scheduled",
                });
                setDialogOpen(true);
              }}
              fullWidth={{ xs: true, sm: false }}
              sx={{
                minWidth: { xs: "100%", sm: "auto" },
                fontSize: { xs: "0.875rem", sm: "1rem" },
              }}
            >
              New Appointment
            </Button>
          </Box>
        </Box>

        {/* Calendar Grid */}
        <Paper
          elevation={2}
          sx={{ p: 2, flex: 1, height: "calc(100vh - 200px)" }}
        >
          <Grid container spacing={1} sx={{ height: "100%" }}>
            {renderWeekDays()}
            {renderCalendarGrid()}
          </Grid>
        </Paper>

        {/* Appointment Form Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {selectedAppointment ? "Edit Appointment" : "New Appointment"}
          </DialogTitle>
          <form onSubmit={handleFormSubmit}>
            <DialogContent>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Patient</InputLabel>
                    <Select
                      value={formData.patientId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          patientId: e.target.value,
                        }))
                      }
                    >
                      {patients.map((patient) => (
                        <MenuItem key={patient.id} value={patient.id}>
                          {patient.firstName} {patient.lastName} -{" "}
                          {patient.email}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <DatePicker
                    label="Appointment Date"
                    value={moment(formData.appointmentDate)}
                    onChange={(date) =>
                      setFormData((prev) => ({
                        ...prev,
                        appointmentDate: date.format("YYYY-MM-DD"),
                      }))
                    }
                    renderInput={(params) => (
                      <TextField {...params} fullWidth required />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Appointment Time"
                    type="time"
                    value={formData.appointmentTime}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        appointmentTime: e.target.value,
                      }))
                    }
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Doctor</InputLabel>
                    <Select
                      value={formData.doctorName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          doctorName: e.target.value,
                        }))
                      }
                    >
                      {doctors.map((doctor) => (
                        <MenuItem key={doctor} value={doctor}>
                          {doctor}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Specialty</InputLabel>
                    <Select
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specialty: e.target.value,
                        }))
                      }
                    >
                      {specialties.map((specialty) => (
                        <MenuItem key={specialty} value={specialty}>
                          {specialty}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Duration (minutes)"
                    type="number"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        duration: parseInt(e.target.value),
                      }))
                    }
                    fullWidth
                    required
                    inputProps={{ min: 15, max: 240, step: 15 }}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.value,
                        }))
                      }
                    >
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="confirmed">Confirmed</MenuItem>
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="cancelled">Cancelled</MenuItem>
                      <MenuItem value="noShow">No Show</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    label="Notes"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        notes: e.target.value,
                      }))
                    }
                    fullWidth
                  />
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">
                {selectedAppointment ? "Update" : "Create"}
              </Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Appointment View Dialog */}
        <Dialog
          open={viewDialogOpen}
          onClose={() => setViewDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Appointment Details</DialogTitle>
          <DialogContent>
            {selectedAppointment && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  {selectedAppointment.patientName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Date:</strong>{" "}
                  {moment(selectedAppointment.appointmentDate).format(
                    "MMMM D, YYYY"
                  )}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Time:</strong> {selectedAppointment.appointmentTime}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Doctor:</strong> {selectedAppointment.doctorName}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Specialty:</strong> {selectedAppointment.specialty}
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Duration:</strong> {selectedAppointment.duration}{" "}
                  minutes
                </Typography>
                <Typography variant="body1" gutterBottom>
                  <strong>Status:</strong>
                  <Chip
                    label={selectedAppointment.status}
                    color={getStatusColor(selectedAppointment.status)}
                    size="small"
                    sx={{ ml: 1 }}
                  />
                </Typography>
                {selectedAppointment.notes && (
                  <Typography variant="body1" gutterBottom>
                    <strong>Notes:</strong> {selectedAppointment.notes}
                  </Typography>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            <Button
              startIcon={<Edit />}
              onClick={() => handleEditAppointment(selectedAppointment)}
              variant="outlined"
            >
              Edit
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
};

export default CalendarView;
