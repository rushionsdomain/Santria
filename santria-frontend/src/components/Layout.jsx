import { Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Button,
} from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";

const drawerWidth = 240;

const NavList = () => {
  const { pathname } = useLocation();
  const items = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Patients", to: "/patients" },
    { label: "Appointments", to: "/appointments" },
  ];
  return (
    <List>
      {items.map((it) => (
        <ListItemButton
          key={it.to}
          component={Link}
          to={it.to}
          selected={pathname === it.to}
        >
          <ListItemText primary={it.label} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default function Layout() {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <VaccinesIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Santria - Patient Management
          </Typography>
          <Button color="inherit" component={Link} to="/appointments">
            Book Appointment
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <NavList />
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
