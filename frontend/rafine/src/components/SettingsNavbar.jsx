import { AppBar, Box, Button, Drawer, Toolbar, styled } from "@mui/material";
import React, { useState } from "react";
import { ReactComponent as Logo } from "../photos/logo.svg";

import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import SettingsIcon from "@mui/icons-material/Settings";
import PersonIcon from "@mui/icons-material/Person";
import { useNavigate } from "react-router-dom";
import NotificationsPanel from "./NotificationsPanel";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../axios";

const SettingsNavbar = ({ value, handleChange, userId }) => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const {
    isLoading,
    error,
    data: notifications,
  } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => makeRequest.get(`/notifications`).then((res) => res.data),
  });

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  const toggleNotifications = () => {
    setNotificationsOpen(!notificationsOpen);
  };

  const StyledToolBar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between",
  });

  const divStyle = {
    fontFamily: "Libre Franklin, sans-serif",
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    width: 250,
    height: "100%",
    bgcolor: "#223734",
  };

  const DrawerList = (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"start"}
      sx={divStyle}
      role="presentation"
      onClick={toggleDrawer(false)}
    >
      <Button
        onClick={() => navigate("/preferences")}
        sx={{ color: "white" }}
        startIcon={<SettingsIcon />}
      >
        Tercihler
      </Button>
      <Button
        onClick={() => navigate("/settings")}
        sx={{ color: "white" }}
        startIcon={<PersonIcon />}
      >
        Hesabım
      </Button>
      <Button
        onClick={() => navigate("/login")}
        sx={{ color: "white" }}
        startIcon={<PersonIcon />}
      >
        Çıkış Yap
      </Button>
    </Box>
  );

  return (
    <AppBar sx={{ height: 60, bgcolor: "white", display: "flex" }}>
      <StyledToolBar>
        <Box sx={{ ml: 11 }} width={100}>
          <Button onClick={() => navigate("/home")}>
            <Logo />
          </Button>
        </Box>

        <Box mr={11}>
          <Box display={"flex"}>
            <Button
              sx={{ display: "flex", gap: 4, color: "#223734" }}
              onClick={toggleNotifications}
            >
              <NotificationsActiveIcon />
            </Button>
            <Button onClick={toggleDrawer(true)} sx={{ color: "#223734" }}>
              <MoreHorizIcon />
            </Button>
            <div>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
              >
                {DrawerList}
              </Drawer>
            </div>
          </Box>
        </Box>
      </StyledToolBar>
      {notificationsOpen && (
        <Box
          sx={{
            position: "absolute",
            top: 60,
            right: 11,
            zIndex: 1300,
            width: "360px",
            bgcolor: "background.paper",
            boxShadow: 3,
          }}
        >
          <NotificationsPanel
            notifications={notifications}
            isLoading={isLoading}
            error={error}
          />
        </Box>
      )}
    </AppBar>
  );
};

export default SettingsNavbar;
