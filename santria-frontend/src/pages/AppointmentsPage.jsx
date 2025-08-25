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
} from "@mui/material";

const statuses = ["scheduled", "in_progress", "completed", "cancelled"];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
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
  });

  const load = async () => {
    const data = await fetchAppointments({
      ...filters,
      status: filters.status || undefined,
      date: filters.date || undefined,
    });
    setAppointments(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Appointments</Typography>
      <Grid container spacing={3} justifyContent="center" sx={{ mt: 2 }}>
        <Grid item xs={12} md={11}>
          <Card>
            <CardContent>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={2}
                sx={{ mb: 2 }}
              >
                <TextField
                  fullWidth
                  type="date"
                  size="small"
                  label="Date"
                  InputLabelProps={{ shrink: true }}
                  value={filters.date}
                  onChange={(e) =>
                    setFilters({ ...filters, date: e.target.value })
                  }
                />
                <TextField
                  fullWidth
                  size="small"
                  select
                  label="Status"
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="pending">pending</MenuItem>
                  <MenuItem value="confirmed">confirmed</MenuItem>
                  <MenuItem value="completed">completed</MenuItem>
                  <MenuItem value="cancelled">cancelled</MenuItem>
                </TextField>
                <Button
                  sx={{ minWidth: 120 }}
                  variant="contained"
                  onClick={load}
                >
                  APPLY
                </Button>
              </Stack>
              <List sx={{ pr: 0 }}>
                {appointments.map((a) => (
                  <ListItem
                    key={a.id}
                    alignItems="flex-start"
                    divider
                    sx={{ py: 2 }}
                  >
                    <Stack
                      direction={{ xs: "column", md: "row" }}
                      spacing={2}
                      sx={{ width: "100%" }}
                      alignItems={{ md: "center" }}
                    >
                      <ListItemText
                        sx={{ flexGrow: 1 }}
                        primaryTypographyProps={{
                          sx: {
                            fontSize: 16,
                            fontWeight: 600,
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          },
                        }}
                        secondaryTypographyProps={{
                          sx: {
                            fontSize: 14,
                            color: "text.secondary",
                            whiteSpace: "normal",
                            wordBreak: "break-word",
                          },
                        }}
                        primary={`${a.appointmentDate} ${a.appointmentTime} • ${a.patientName}`}
                        secondary={`${a.doctorName} • ${a.type}`}
                      />
                      <Stack
                        direction={{ xs: "row", md: "row" }}
                        spacing={1}
                        alignItems="center"
                        flexShrink={0}
                      >
                        <Chip
                          size="small"
                          label={a.status.replace("_", " ")}
                          color={
                            a.status === "completed"
                              ? "success"
                              : a.status === "cancelled"
                              ? "error"
                              : a.status === "confirmed"
                              ? "primary"
                              : "default"
                          }
                        />
                        {["in_progress", "completed", "cancelled"].map((s) => (
                          <Button
                            size="small"
                            key={s}
                            onClick={async () => {
                              await updateAppointmentStatus(a.id, s);
                              await load();
                            }}
                          >
                            {s.replace("_", " ")}
                          </Button>
                        ))}
                      </Stack>
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={11}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Book Appointment
              </Typography>
              <Stack spacing={2}>
                <TextField
                  required
                  label="Patient ID"
                  value={form.patientId}
                  onChange={(e) =>
                    setForm({ ...form, patientId: e.target.value })
                  }
                />
                <TextField
                  required
                  label="Patient Name"
                  value={form.patientName}
                  onChange={(e) =>
                    setForm({ ...form, patientName: e.target.value })
                  }
                />
                <TextField
                  required
                  label="Doctor"
                  value={form.doctorName}
                  onChange={(e) =>
                    setForm({ ...form, doctorName: e.target.value })
                  }
                />
                <TextField
                  label="Specialty"
                  value={form.specialty}
                  onChange={(e) =>
                    setForm({ ...form, specialty: e.target.value })
                  }
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    type="date"
                    label="Date"
                    InputLabelProps={{ shrink: true }}
                    value={form.appointmentDate}
                    onChange={(e) =>
                      setForm({ ...form, appointmentDate: e.target.value })
                    }
                  />
                  <TextField
                    label="Time"
                    value={form.appointmentTime}
                    onChange={(e) =>
                      setForm({ ...form, appointmentTime: e.target.value })
                    }
                  />
                </Stack>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await createAppointment(form);
                    setForm({
                      ...form,
                      patientId: "",
                      patientName: "",
                      doctorName: "",
                      specialty: "",
                      appointmentDate: "",
                    });
                    await load();
                  }}
                >
                  Create
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
