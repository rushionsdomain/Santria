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
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import VaccinesIcon from "@mui/icons-material/Vaccines";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";

const drawerWidth = 240;

const NavList = ({ onItemClick }) => {
  const { pathname } = useLocation();
  const items = [
    { label: "Dashboard", to: "/dashboard" },
    { label: "Patients", to: "/patients" },
    { label: "Appointments", to: "/appointments" },
    { label: "Calendar", to: "/calendar" },
  ];
  return (
    <List>
      {items.map((it) => (
        <ListItemButton
          key={it.to}
          component={Link}
          to={it.to}
          selected={pathname === it.to}
          onClick={onItemClick}
        >
          <ListItemText primary={it.label} />
        </ListItemButton>
      ))}
    </List>
  );
};

export default function Layout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerClose = () => {
    setMobileOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          background: "linear-gradient(45deg, #1976d2, #42a5f5)",
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <VaccinesIcon sx={{ mr: 1 }} />
          <Typography
            variant={isMobile ? "subtitle1" : "h6"}
            sx={{ flexGrow: 1 }}
          >
            {isMobile ? "Santria" : "Santria - Patient Management"}
          </Typography>
          {!isMobile && (
            <Button
              color="inherit"
              component={Link}
              to="/appointments"
              sx={{
                background: "rgba(255,255,255,0.1)",
                "&:hover": { background: "rgba(255,255,255,0.2)" },
              }}
            >
              Book Appointment
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
            borderRight: "1px solid #e0e0e0",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <NavList onItemClick={isMobile ? handleDrawerClose : undefined} />
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
