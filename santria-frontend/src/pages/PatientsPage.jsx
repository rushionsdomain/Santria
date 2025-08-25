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
} from "@mui/material";

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

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchPatients(query);
      setPatients(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Patients</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  size="small"
                  label="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <Button variant="contained" onClick={load} disabled={loading}>
                  Search
                </Button>
              </Stack>
              <List>
                {patients.map((p) => (
                  <ListItem
                    key={p.id}
                    divider
                    button
                    component="a"
                    href={`/patients/${p.id}`}
                  >
                    <ListItemText
                      primary={`${p.firstName} ${p.lastName}`}
                      secondary={p.email}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Register New Patient
              </Typography>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    required
                    label="First Name"
                    value={form.firstName}
                    onChange={(e) =>
                      setForm({ ...form, firstName: e.target.value })
                    }
                  />
                  <TextField
                    required
                    label="Last Name"
                    value={form.lastName}
                    onChange={(e) =>
                      setForm({ ...form, lastName: e.target.value })
                    }
                  />
                </Stack>
                <TextField
                  required
                  type="email"
                  label="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <TextField
                  label="Phone"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    setForm({ ...form, phoneNumber: e.target.value })
                  }
                />
                <TextField
                  type="date"
                  label="Date of Birth"
                  InputLabelProps={{ shrink: true }}
                  value={form.dateOfBirth}
                  onChange={(e) =>
                    setForm({ ...form, dateOfBirth: e.target.value })
                  }
                />
                <TextField
                  select
                  label="Gender"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </TextField>
                <TextField
                  label="Address"
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                />
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <TextField
                    label="Emergency Name"
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
                  />
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
                  />
                </Stack>
                <Button
                  variant="contained"
                  onClick={async () => {
                    await createPatient(form);
                    setForm({
                      firstName: "",
                      lastName: "",
                      dateOfBirth: "",
                      gender: "Male",
                      email: "",
                      phoneNumber: "",
                      address: "",
                      emergencyContact: {
                        name: "",
                        relationship: "",
                        phone: "",
                      },
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
