import { useEffect, useState } from "react";
import { fetchPatients, createPatient } from "../api/patients";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Box,
  Avatar,
  Chip,
  Alert,
  CircularProgress,
  IconButton,
  Tooltip,
  Divider,
  Paper,
} from "@mui/material";
import {
  People,
  Add,
  Search,
  Email,
  Phone,
  LocationOn,
  Person,
  CheckCircle,
  Error,
  Refresh,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

export default function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "Male",
    email: "",
    phoneNumber: "",
    address: "",
    emergencyContact: { name: "", relationship: "", phone: "" },
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPatients(query);
      setPatients(data);
    } catch (err) {
      setError("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async () => {
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createPatient(form);
      setSuccess("Patient registered successfully!");
      setForm({
        firstName: "",
        lastName: "",
        dateOfBirth: "",
        gender: "Male",
        email: "",
        phoneNumber: "",
        address: "",
        emergencyContact: { name: "", relationship: "", phone: "" },
      });
      await load();
    } catch (err) {
      setError(err.message || "Failed to create patient");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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
              <People />
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
                Patient Management
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Register and manage patient information
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Refresh">
            <IconButton onClick={load} disabled={loading}>
              <Refresh />
            </IconButton>
          </Tooltip>
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

        <Grid container spacing={3}>
          {/* Patient List */}
          <Grid item xs={12} md={6}>
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
                  <Search color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Patient Directory
                  </Typography>
                  <Chip
                    label={`${patients.length} patients`}
                    color="primary"
                    size="small"
                  />
                </Box>

                <Stack direction="row" spacing={2} mb={3}>
                  <TextField
                    size="small"
                    label="Search patients"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <Search sx={{ mr: 1, color: "text.secondary" }} />
                      ),
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={load}
                    disabled={loading}
                    startIcon={
                      loading ? <CircularProgress size={16} /> : <Search />
                    }
                  >
                    Search
                  </Button>
                </Stack>

                {loading ? (
                  <Box display="flex" justifyContent="center" p={3}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <List sx={{ maxHeight: 400, overflow: "auto" }}>
                    {patients.map((p) => (
                      <ListItem
                        key={p.id}
                        divider
                        component={Link}
                        to={`/patients/${p.id}`}
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
                            <Typography variant="subtitle1" fontWeight="medium">
                              {p.firstName} {p.lastName}
                            </Typography>
                          }
                          secondary={
                            <Box
                              display="flex"
                              alignItems="center"
                              gap={1}
                              mt={0.5}
                            >
                              <Email fontSize="small" color="action" />
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {p.email}
                              </Typography>
                              {p.phoneNumber && (
                                <>
                                  <Phone fontSize="small" color="action" />
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                  >
                                    {p.phoneNumber}
                                  </Typography>
                                </>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
          {/* Registration Form */}
          <Grid item xs={12} md={6}>
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
                  <Add color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Register New Patient
                  </Typography>
                </Box>

                <Stack spacing={3}>
                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      required
                      label="First Name"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <TextField
                      required
                      label="Last Name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Stack>

                  <TextField
                    required
                    type="email"
                    label="Email Address"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <TextField
                    required
                    label="Phone Number"
                    value={form.phoneNumber}
                    onChange={(e) =>
                      setForm({ ...form, phoneNumber: e.target.value })
                    }
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      required
                      type="date"
                      label="Date of Birth"
                      InputLabelProps={{ shrink: true }}
                      value={form.dateOfBirth}
                      onChange={(e) =>
                        setForm({ ...form, dateOfBirth: e.target.value })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <TextField
                      select
                      label="Gender"
                      value={form.gender}
                      onChange={(e) =>
                        setForm({ ...form, gender: e.target.value })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Stack>

                  <TextField
                    required
                    label="Address"
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    fullWidth
                    multiline
                    rows={2}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Divider>
                    <Chip label="Emergency Contact" size="small" />
                  </Divider>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                    <TextField
                      label="Emergency Contact Name"
                      value={form.emergencyContact.name}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          emergencyContact: {
                            ...form.emergencyContact,
                            name: e.target.value,
                          },
                        })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                    <TextField
                      label="Relationship"
                      value={form.emergencyContact.relationship}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          emergencyContact: {
                            ...form.emergencyContact,
                            relationship: e.target.value,
                          },
                        })
                      }
                      fullWidth
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Stack>

                  <TextField
                    label="Emergency Phone"
                    value={form.emergencyContact.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        emergencyContact: {
                          ...form.emergencyContact,
                          phone: e.target.value,
                        },
                      })
                    }
                    fullWidth
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 2,
                      },
                    }}
                  />

                  <Button
                    variant="contained"
                    onClick={handleCreatePatient}
                    disabled={submitting}
                    startIcon={
                      submitting ? <CircularProgress size={16} /> : <Add />
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
                    {submitting ? "Creating..." : "Register Patient"}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
