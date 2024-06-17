import * as React from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

import { ReactComponent as Logo } from "../photos/logo.svg";
import { TextField, Typography } from "@mui/material";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

const SignUpScreen = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "https://rafine-clone-6.onrender.com/api/auth/register",
        inputs
      );
      navigate("/login");
    } catch (err) {
      setErr(err.response.data);
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

  const divStyle = {
    fontFamily: "Libre Franklin, sans-serif",
    fontSize: 22,
    fontWeight: "bold",
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
          top: 10,
        }}
      >
        <Box
          name="LOGO"
          sx={{
            width: 200,
            height: 700,
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
          name="left"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 500,
            top: 10,

            gap: 3,
          }}
        >
          <Box sx={{ width: 386 }}>
            <Typography style={divStyle}>Şimdi Üye Ol!</Typography>
            <Typography sx={{ fontWeight: "lighter" }}>
              Daha iyi bir haber deneyimi için Rafine'ye üye ol.
            </Typography>

            <Box sx={{ display: "flex" }}>
              Zaten üye misiniz?
              <Typography
                fontWeight={"bold"}
                onClick={() => navigate("/login")}
                sx={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Giriş Yap
              </Typography>
            </Box>
          </Box>
          <Box
            name="inputs"
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Typography fontSize={15} fontWeight={"bold"}>
              E-posta Adresi
            </Typography>
            <TextField
              onChange={handleChange}
              sx={{ width: 386 }}
              name="email"
            />
            <Typography fontSize={15} fontWeight={"bold"}>
              İsim
            </Typography>
            <TextField
              name="name"
              onChange={handleChange}
              sx={{ width: 386 }}
            />

            <Typography fontSize={15} fontWeight={"bold"}>
              Şifre
            </Typography>

            <TextField
              type="password"
              id="password"
              onChange={handleChange}
              name="password"
            />
            <Typography fontSize={15} fontWeight={"bold"}>
              Şifre Tekrar
            </Typography>

            <TextField type="password" />
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {err && (
              <Typography
                color="error"
                sx={{ width: 386, textAlign: "center", marginTop: 2 }}
              >
                {err}
              </Typography>
            )}
            <Button
              variant="contained"
              onClick={handleClick}
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
              Üye Ol!
            </Button>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default SignUpScreen;
