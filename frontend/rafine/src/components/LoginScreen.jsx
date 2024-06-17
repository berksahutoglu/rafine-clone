import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { ReactComponent as Logo } from "../photos/logo.svg";
import { TextField, Typography } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
const LoginScreen = () => {
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });
  const [err, setErr] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(inputs);
      navigate("/home");
    } catch (err) {
      if (err.response && err.response.data) {
        setErr(err.response.data);
      } else {
        setErr("Wrong email or password!");
      }
      console.log(err);
    }
  };

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
          top: 100,
          bgcolor: "#e5e5e5",
        }}
      >
        <Box
          name="LOGO"
          sx={{
            bgcolor: "#e5e5e5",
            width: 200,
            height: 500,
            display: "flex",
            position: "relative",
            boxShadow: "4px 0 4px #0000001a",
            justifyContent: "center",
          }}
        >
          <Box position={"relative"} top={20}>
            <Logo />
          </Box>
        </Box>
        <Box
          name="left"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 500,
            top: 100,
            gap: 3,
          }}
        >
          <Box sx={{ display: "flex" }}>
            Henüz üye değil misin?
            <Typography
              fontWeight={"bold"}
              onClick={() => navigate("/signup")}
              sx={{ textDecoration: "underline", cursor: "pointer" }}
            >
              Üye ol.
            </Typography>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <Typography fontSize={15} fontWeight={"bold"}>
              Email
            </Typography>
            <TextField
              name="email"
              onChange={handleChange}
              sx={{ width: 386 }}
            />
            <Typography fontSize={15} fontWeight={"bold"}>
              Şifre
            </Typography>
            <TextField
              name="password"
              onChange={handleChange}
              type="password"
            />
          </Box>
          {err && (
            <Typography
              color="error"
              sx={{ width: 386, textAlign: "center", marginTop: 2 }}
            >
              {err}
            </Typography>
          )}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Button
              variant="contained"
              onClick={handleLogin}
              sx={{
                width: 386,
                height: 50,
                backgroundColor: "#223734", // Change background color
                color: "white", // Change text color
                "&:hover": {
                  backgroundColor: "#223734", // Change background color on hover
                },
              }}
              style={buttonStyle}
            >
              Giriş Yap
            </Button>
            <Typography>Şifremi Unuttum</Typography>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default LoginScreen;
