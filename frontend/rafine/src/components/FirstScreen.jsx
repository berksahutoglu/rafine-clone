import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import People from "../photos/people.jpg";
import News from "../photos/news.png";
import { ReactComponent as Logo } from "../photos/logo.svg";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { Tab } from "@mui/material";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const FirstScreen = () => {
  const navigate = useNavigate();

  const theme = createTheme({
    components: {
      MuiTabs: {
        styleOverrides: {
          indicator: {
            display: "none",
          },
        },
      },
    },
  });

  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const divStyle = {
    fontFamily: "Libre Franklin, sans-serif",
    fontSize: 22,
    fontWeight: 600,
    color: "#223734",
  };
  const buttonStyle = {
    fontFamily: "Libre Franklin, sans-serif",
    fontSize: 13,
    fontWeight: 600,
    color: "white",
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          position: "relative",
          top: 30,
        }}
      >
        <Box
          sx={{
            width: 200,
            height: 650,
            display: "flex",
            backgroundColor: "white",
            position: "relative",
            boxShadow: "4px 0 4px #0000001a",
            justifyContent: "center",
            bgcolor: "#e5e5e5",
          }}
        >
          <Box position={"relative"} top={20}>
            <Logo />
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 500,
          }}
        >
          <TabContext value={value}>
            <TabPanel value="1">
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <div className="img">
                  <img src={People} alt="" width={387} height={"auto"} />
                </div>
                <Box width={350}>
                  <div style={divStyle}>
                    Dünyayı şekillendiren güçleri anlamak için
                  </div>
                </Box>
              </Box>
            </TabPanel>
          </TabContext>

          <TabContext value={value}>
            <TabPanel value="2">
              <Box
                sx={{
                  height: 400,
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                }}
              >
                <div className="img">
                  <img src={News} alt="" width={387} height={"auto"} />
                </div>
                <Box width={350}>
                  <div style={divStyle}>Haber rutinine ekle</div>
                </Box>
              </Box>
            </TabPanel>
          </TabContext>

          <Box position={"static"}>
            <Box
              className="img-changer"
              position={"relative"}
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TabContext value={value}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab icon={<FiberManualRecordIcon />} value="1" />
                  <Tab icon={<FiberManualRecordIcon />} value="2" />
                </TabList>
              </TabContext>
            </Box>
            <Box
              className="login-buttons"
              sx={{ display: "flex", flexDirection: "column", gap: 3 }}
            >
              <Button
                variant="contained"
                onClick={() => navigate("/login")}
                sx={{
                  width: 386,
                  height: 40,
                  backgroundColor: "#223734", // Change background color
                  color: "white", // Change text color
                  "&:hover": {
                    backgroundColor: "#223734", // Change background color on hover
                  },
                }}
                style={buttonStyle}
              >
                Giriş
              </Button>

              <Button
                variant="contained"
                onClick={() => navigate("/signup")}
                sx={{
                  width: 386,
                  height: 40,
                  backgroundColor: "#223734", // Change background color
                  color: "white", // Change text color
                  "&:hover": {
                    backgroundColor: "#223734", // Change background color on hover
                  },
                }}
                style={buttonStyle}
              >
                Üye Ol
              </Button>
            </Box>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default FirstScreen;
