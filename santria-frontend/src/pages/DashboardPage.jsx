import { useEffect, useMemo, useState } from "react";
import { fetchStats } from "../api/dashboard";
import { fetchAppointments } from "../api/appointments";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
} from "recharts";

const COLORS = ["#1976d2", "#42a5f5", "#66bb6a", "#ef5350"];

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const today = useMemo(() => new Date().toISOString().split("T")[0], []);

  useEffect(() => {
    let mounted = true;
    Promise.all([fetchStats(today), fetchAppointments()])
      .then(([s, a]) => {
        if (!mounted) return;
        setStats(s);
        setAppointments(a);
      })
      .catch(() => mounted && setStats(null))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [today]);

  const chartData = stats
    ? [
        { name: "Confirmed", value: stats.confirmed || 0 },
        { name: "Pending", value: stats.pending || 0 },
        { name: "Completed", value: stats.completed || 0 },
        { name: "Cancelled", value: stats.cancelled || 0 },
      ]
    : [];

  // Build last-7-days trend from appointments
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const dayApts = appointments.filter((a) => a.appointmentDate === key);
    return { date: key.slice(5), total: dayApts.length };
  });

  // Simple per-status bar data
  const statusBar = [
    {
      status: "confirmed",
      count: appointments.filter((a) => a.status === "confirmed").length,
    },
    {
      status: "pending",
      count: appointments.filter((a) => a.status === "pending").length,
    },
    {
      status: "completed",
      count: appointments.filter((a) => a.status === "completed").length,
    },
    {
      status: "cancelled",
      count: appointments.filter((a) => a.status === "cancelled").length,
    },
  ];

  return (
    <Stack spacing={3}>
      <Typography variant="h5">Dashboard</Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Today's Appointments</Typography>
              <Typography variant="h4">
                {stats?.total ?? (loading ? "…" : 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Completed</Typography>
              <Typography variant="h4">
                {stats?.completed ?? (loading ? "…" : 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Pending</Typography>
              <Typography variant="h4">
                {stats?.pending ?? (loading ? "…" : 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2">Cancelled</Typography>
              <Typography variant="h4">
                {stats?.cancelled ?? (loading ? "…" : 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 420 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Appointment Status
              </Typography>
              <ResponsiveContainer width="100" height={300}>
                <PieChart>
                  <Pie dataKey="value" data={chartData} outerRadius={120} label>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 420 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Last 7 Days
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={last7}
                  margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="total"
                    stroke="#1976d2"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 420 }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Status Distribution (All)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={statusBar}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#42a5f5" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>
                Quick Actions
              </Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <Button variant="contained" component={Link} to="/patients">
                  Add Patient
                </Button>
                <Button variant="outlined" component={Link} to="/appointments">
                  Book Appointment
                </Button>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Typography color="text.secondary">
                Data refreshes automatically from backend.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}
