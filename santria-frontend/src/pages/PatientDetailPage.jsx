import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchPatient } from "../api/patients";
import { fetchAppointments } from "../api/appointments";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function PatientDetailPage() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const p = await fetchPatient(id);
      const a = await fetchAppointments({ patientId: id });
      if (mounted) {
        setPatient(p);
        setHistory(a);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  if (!patient) return <Typography>Loading...</Typography>;

  return (
    <Stack spacing={3}>
      <Typography variant="h5">
        {patient.firstName} {patient.lastName}
      </Typography>
      <Card>
        <CardContent>
          <Typography variant="subtitle2">Contact</Typography>
          <Typography>
            {patient.email} • {patient.phoneNumber}
          </Typography>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Appointment History
          </Typography>
          <List>
            {history.map((apt) => (
              <ListItem key={apt.id} divider>
                <ListItemText
                  primary={`${apt.appointmentDate} ${apt.appointmentTime} • ${apt.status}`}
                  secondary={`${apt.doctorName} • ${apt.type}`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
}
