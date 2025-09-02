import { useEffect, useState } from "react";
import {
  fetchAppointments,
  createAppointment,
  updateAppointmentStatus,
} from "../api/appointments";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box,
  Avatar,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Event,
  Add,
  Search,
  FilterList,
  Person,
  Schedule,
  LocalHospital,
  CheckCircle,
  Pending,
  Cancel,
  Edit,
  Delete,
  Refresh,
  CalendarToday,
  AccessTime,
  LocationOn,
} from "@mui/icons-material";
import { fetchPatients } from "../api/patients";

const statuses = ["scheduled", "in_progress", "completed", "cancelled"];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [filters, setFilters] = useState({ date: "", status: "" });
  const [form, setForm] = useState({
    patientId: "",
    patientName: "",
    doctorName: "",
    specialty: "",
    appointmentDate: "",
    appointmentTime: "09:00",
    duration: 30,
    status: "scheduled",
    type: "consultation",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchAppointments({
        ...filters,
        status: filters.status || undefined,
        date: filters.date || undefined,
      });
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const loadPatients = async () => {
    try {
      const data = await fetchPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
    }
  };

  const handleCreateAppointment = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const patient = patients.find((p) => p.id === form.patientId);
      if (!patient) {
        setError("Please select a patient");
        return;
      }

      const appointmentData = {
        ...form,
        patientName: `${patient.firstName} ${patient.lastName}`,
      };

      await createAppointment(appointmentData);
      setSuccess("Appointment created successfully!");
      setForm({
        patientId: "",
        patientName: "",
        doctorName: "",
        specialty: "",
        appointmentDate: "",
        appointmentTime: "09:00",
        duration: 30,
        status: "scheduled",
        type: "consultation",
        notes: "",
      });
      setDialogOpen(false);
      await load();
    } catch (err) {
      setError(err.message || "Failed to create appointment");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    load();
    loadPatients();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "primary";
      case "completed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle />;
      case "completed":
        return <CheckCircle />;
      case "pending":
        return <Pending />;
      case "cancelled":
        return <Cancel />;
      default:
        return <Schedule />;
    }
  };

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

  return (
    <Box
      sx={{
        p: 3,
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        width: "100%",
        height: "100vh",
        overflow: "auto",
      }}
    >
      <Stack spacing={4}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 48,
                height: 48,
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              }}
            >
              <Event />
            </Avatar>
            <Box>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{
                  background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Appointment Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Schedule and manage patient appointments
              </Typography>
            </Box>
          </Box>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setDialogOpen(true)}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #1976d2)",
                },
              }}
            >
              New Appointment
            </Button>
            <Tooltip title="Refresh">
              <IconButton onClick={load} disabled={loading}>
                <Refresh />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {/* Alerts */}
        {error && (
          <Alert severity="error" onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        {/* Filters */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <FilterList color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Filter Appointments
              </Typography>
            </Box>

            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="Filter by Date"
                  InputLabelProps={{ shrink: true }}
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Filter by Status</InputLabel>
                  <Select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    label="Filter by Status"
                    sx={{
                      borderRadius: 2,
                    }}
                  >
                    <MenuItem value="">All Statuses</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={load}
                  disabled={loading}
                  startIcon={
                    loading ? <CircularProgress size={16} /> : <Search />
                  }
                  sx={{
                    background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                    borderRadius: 2,
                    py: 1.5,
                    "&:hover": {
                      background: "linear-gradient(45deg, #1565c0, #1976d2)",
                    },
                  }}
                >
                  {loading ? "Loading..." : "Apply Filters"}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Appointments List */}
        <Card
          sx={{
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderRadius: 3,
            boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
            border: "1px solid #e0e0e0",
          }}
        >
          <CardContent>
            <Box display="flex" alignItems="center" gap={2} mb={3}>
              <Schedule color="primary" />
              <Typography variant="h6" fontWeight="bold">
                Appointments ({appointments.length})
              </Typography>
            </Box>

            {loading ? (
              <Box display="flex" justifyContent="center" p={3}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ maxHeight: 600, overflow: "auto" }}>
                {appointments.map((appointment) => (
                  <ListItem
                    key={appointment.id}
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      transition: "all 0.2s ease",
                      "&:hover": {
                        backgroundColor: "rgba(25, 118, 210, 0.08)",
                        transform: "translateX(4px)",
                      },
                    }}
                  >
                    <Avatar sx={{ mr: 2, bgcolor: "primary.main" }}>
                      <Person />
                    </Avatar>
                    <ListItemText
                      primary={
                        <Box display="flex" alignItems="center" gap={2}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {appointment.patientName}
                          </Typography>
                          <Chip
                            label={appointment.status}
                            size="small"
                            color={getStatusColor(appointment.status)}
                            icon={getStatusIcon(appointment.status)}
                          />
                        </Box>
                      }
                      secondary={
                        <Box mt={1}>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={0.5}
                          >
                            <LocalHospital fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {appointment.doctorName} - {appointment.specialty}
                            </Typography>
                          </Box>
                          <Box
                            display="flex"
                            alignItems="center"
                            gap={1}
                            mb={0.5}
                          >
                            <CalendarToday fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(
                                appointment.appointmentDate
                              ).toLocaleDateString()}
                            </Typography>
                          </Box>
                          <Box display="flex" alignItems="center" gap={1}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="body2" color="text.secondary">
                              {appointment.appointmentTime} (
                              {appointment.duration} min)
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    <Box display="flex" gap={1}>
                      <Tooltip title="Edit">
                        <IconButton size="small">
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* New Appointment Dialog */}
        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            },
          }}
        >
          <DialogTitle
            sx={{
              background: "linear-gradient(45deg, #1976d2, #42a5f5)",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Add />
            <Typography variant="h6">New Appointment</Typography>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Patient</InputLabel>
                  <Select
                    value={form.patientId}
                    onChange={(e) =>
                      setForm({ ...form, patientId: e.target.value })
                    }
                    label="Patient"
                    sx={{ borderRadius: 2 }}
                  >
                    {patients.map((patient) => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.firstName} {patient.lastName} - {patient.email}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    value={form.doctorName}
                    onChange={(e) =>
                      setForm({ ...form, doctorName: e.target.value })
                    }
                    label="Doctor"
                    sx={{ borderRadius: 2 }}
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor} value={doctor}>
                        {doctor}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <FormControl fullWidth required>
                  <InputLabel>Specialty</InputLabel>
                  <Select
                    value={form.specialty}
                    onChange={(e) =>
                      setForm({ ...form, specialty: e.target.value })
                    }
                    label="Specialty"
                    sx={{ borderRadius: 2 }}
                  >
                    {specialties.map((specialty) => (
                      <MenuItem key={specialty} value={specialty}>
                        {specialty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Appointment Date"
                  InputLabelProps={{ shrink: true }}
                  value={form.appointmentDate}
                  onChange={(e) =>
                    setForm({ ...form, appointmentDate: e.target.value })
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="time"
                  label="Appointment Time"
                  InputLabelProps={{ shrink: true }}
                  value={form.appointmentTime}
                  onChange={(e) =>
                    setForm({ ...form, appointmentTime: e.target.value })
                  }
                  required
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  type="number"
                  label="Duration (minutes)"
                  value={form.duration}
                  onChange={(e) =>
                    setForm({ ...form, duration: parseInt(e.target.value) })
                  }
                  required
                  inputProps={{ min: 15, max: 240, step: 15 }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>
            </Grid>
          </DialogContent>

          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={handleCreateAppointment}
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} /> : <Add />}
              sx={{
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #1976d2)",
                },
              }}
            >
              {submitting ? "Creating..." : "Create Appointment"}
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    </Box>
  );
}
