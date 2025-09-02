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
  Box,
  Paper,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  People,
  Event,
  CheckCircle,
  Pending,
  Cancel,
  CalendarToday,
  AccessTime,
  LocalHospital,
} from "@mui/icons-material";

const COLORS = ["#1976d2", "#42a5f5", "#66bb6a", "#ef5350", "#ff9800"];
const GRADIENT_COLORS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
];

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
        { name: "Confirmed", value: stats.confirmed || 0, color: "#1976d2" },
        { name: "Pending", value: stats.pending || 0, color: "#ff9800" },
        { name: "Completed", value: stats.completed || 0, color: "#66bb6a" },
        { name: "Cancelled", value: stats.cancelled || 0, color: "#ef5350" },
      ]
    : [];

  // Build last-7-days trend from appointments
  const last7 = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().split("T")[0];
    const dayApts = appointments.filter((a) => a.appointmentDate === key);
    return {
      date: key.slice(5),
      total: dayApts.length,
      completed: dayApts.filter((a) => a.status === "completed").length,
      pending: dayApts.filter((a) => a.status === "pending").length,
    };
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

  // Calculate completion rate
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(
    (a) => a.status === "completed"
  ).length;
  const completionRate =
    totalAppointments > 0
      ? (completedAppointments / totalAppointments) * 100
      : 0;

  // 3D Card Component
  const StatCard = ({
    title,
    value,
    icon,
    color,
    gradient,
    trend,
    subtitle,
  }) => (
    <Card
      sx={{
        height: "100%",
        background:
          gradient || `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        borderRadius: 3,
        boxShadow: `0 8px 32px ${color}20`,
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: `0 12px 40px ${color}30`,
        },
        position: "relative",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: gradient || color,
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mb={2}
        >
          <Avatar
            sx={{
              bgcolor: color,
              width: 48,
              height: 48,
              boxShadow: `0 4px 16px ${color}40`,
            }}
          >
            {icon}
          </Avatar>
          {trend && (
            <Chip
              icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
              label={`${Math.abs(trend)}%`}
              color={trend > 0 ? "success" : "error"}
              size="small"
              variant="outlined"
            />
          )}
        </Box>
        <Typography variant="h4" fontWeight="bold" color={color} gutterBottom>
          {value}
        </Typography>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          {title}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  // 3D Chart Card Component
  const ChartCard = ({ title, children, height = 400, gradient }) => (
    <Card
      sx={{
        height,
        background:
          gradient || "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
        border: "1px solid #e0e0e0",
        borderRadius: 3,
        boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        },
        position: "relative",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: 3, height: "100%" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
          {title}
        </Typography>
        <Box sx={{ height: height - 100 }}>{children}</Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ width: "100%", mt: 2 }}>
        <LinearProgress />
        <Typography variant="h6" align="center" sx={{ mt: 2 }}>
          Loading dashboard data...
        </Typography>
      </Box>
    );
  }

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
            Dashboard Overview
          </Typography>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              startIcon={<CalendarToday />}
              component={Link}
              to="/calendar"
              sx={{
                background: "linear-gradient(45deg, #1976d2, #42a5f5)",
                boxShadow: "0 4px 16px rgba(25, 118, 210, 0.3)",
                "&:hover": {
                  background: "linear-gradient(45deg, #1565c0, #1976d2)",
                },
              }}
            >
              View Calendar
            </Button>
            <Button
              variant="outlined"
              startIcon={<Event />}
              component={Link}
              to="/appointments"
            >
              Manage Appointments
            </Button>
          </Box>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Today's Appointments"
              value={stats?.total ?? 0}
              icon={<Event />}
              color="#1976d2"
              gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              subtitle="Total scheduled"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Completed"
              value={stats?.completed ?? 0}
              icon={<CheckCircle />}
              color="#66bb6a"
              gradient="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
              subtitle={`${completionRate.toFixed(1)}% completion rate`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Pending"
              value={stats?.pending ?? 0}
              icon={<Pending />}
              color="#ff9800"
              gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              subtitle="Awaiting confirmation"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Cancelled"
              value={stats?.cancelled ?? 0}
              icon={<Cancel />}
              color="#ef5350"
              gradient="linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)"
              subtitle="Cancelled today"
            />
          </Grid>
        </Grid>

        {/* Charts Row 1 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="Appointment Status Distribution"
              gradient="linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    innerRadius={40}
                    paddingAngle={5}
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={6}>
            <ChartCard
              title="7-Day Trend Analysis"
              gradient="linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last7}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1976d2" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#1976d2"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                    <linearGradient
                      id="colorCompleted"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#66bb6a" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#66bb6a"
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <RechartsTooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#1976d2"
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    name="Total Appointments"
                  />
                  <Area
                    type="monotone"
                    dataKey="completed"
                    stroke="#66bb6a"
                    fillOpacity={1}
                    fill="url(#colorCompleted)"
                    name="Completed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
        </Grid>

        {/* Charts Row 2 */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <ChartCard
              title="Status Distribution Overview"
              gradient="linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={statusBar}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="count" fill="#42a5f5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                height: 400,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(102, 126, 234, 0.3)",
                position: "relative",
                overflow: "hidden",
                "&::before": {
                  content: '""',
                  position: "absolute",
                  top: -50,
                  right: -50,
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.1)",
                },
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.05)",
                },
              }}
            >
              <CardContent
                sx={{ p: 3, height: "100%", position: "relative", zIndex: 1 }}
              >
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Quick Actions
                </Typography>
                <Stack spacing={2} sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/patients"
                    startIcon={<People />}
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        background: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    Add Patient
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/appointments"
                    startIcon={<Event />}
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        background: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/calendar"
                    startIcon={<CalendarToday />}
                    sx={{
                      background: "rgba(255,255,255,0.2)",
                      backdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                      "&:hover": {
                        background: "rgba(255,255,255,0.3)",
                      },
                    }}
                  >
                    View Calendar
                  </Button>
                </Stack>
                <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.3)" }} />
                <Box display="flex" alignItems="center" gap={2}>
                  <LocalHospital sx={{ fontSize: 40, opacity: 0.8 }} />
                  <Box>
                    <Typography variant="h6" fontWeight="bold">
                      Santria Health
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8 }}>
                      Digital Health Management
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Performance Metrics */}
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
                borderRadius: 3,
                boxShadow: "0 8px 32px rgba(0,0,0,0.1)",
                border: "1px solid #e0e0e0",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  System Performance Metrics
                </Typography>
                <Grid container spacing={3} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="#1976d2"
                      >
                        {completionRate.toFixed(1)}%
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Completion Rate
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={completionRate}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="#66bb6a"
                      >
                        {totalAppointments}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Total Appointments
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={100}
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box textAlign="center">
                      <Typography
                        variant="h4"
                        fontWeight="bold"
                        color="#ff9800"
                      >
                        {
                          appointments.filter((a) => a.status === "pending")
                            .length
                        }
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Pending Reviews
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={
                          (appointments.filter((a) => a.status === "pending")
                            .length /
                            totalAppointments) *
                          100
                        }
                        sx={{ mt: 1, height: 8, borderRadius: 4 }}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
}
