import React from "react";
import NavBar from "./NavBar";
import {
  Box,
  Divider,
  List,
  ListItem,
  Stack,
  Switch,
  Typography,
} from "@mui/material";
import SettingsNavbar from "./SettingsNavbar";

const Preferences = () => {
  const divStyle = {
    fontFamily: "Libre Franklin, sans-serif",
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e423f",
  };
  return (
    <>
      <SettingsNavbar />

      <Stack display={"flex"} flexDirection={"row"}>
        <Box
          height={727}
          flex={1.5}
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
          bgcolor={"white"}
        >
          <Typography style={divStyle}>Tercihler</Typography>
        </Box>
        <Box flex={4} bgcolor={"e5e5e5"}>
          <Box
            mt={15}
            ml={3}
            display={"flex"}
            height={400}
            width={630}
            flexDirection={"column"}
            bgcolor={"white"}
            borderRadius={2}
          >
            <Typography ml={3} mt={4} style={divStyle}>
              Bildirimler
            </Typography>
            <List>
              <ListItem sx={{ height: 70 }}>
                Son dakika haberleri <Switch sx={{ ml: 5 }} />
              </ListItem>
              <Divider />
              <ListItem sx={{ height: 70 }}>
                Güç <Switch sx={{ ml: 18 }} />
              </ListItem>
              <Divider />
              <ListItem sx={{ height: 70 }}>
                Kültür <Switch sx={{ ml: 16 }} />
              </ListItem>
              <Divider />
              <ListItem sx={{ height: 70 }}>
                Mahal <Switch sx={{ ml: 16 }} />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default Preferences;
