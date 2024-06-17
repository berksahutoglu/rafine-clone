import React, { useContext, useState, useEffect } from "react";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, QueryClient } from "@tanstack/react-query";
import { makeRequest } from "../axios";
import SettingsNavBar from "./SettingsNavbar";
import { AuthContext } from "../context/authContext";

const Settings = () => {
  const divStyle = {
    fontFamily: "Libre Franklin, sans-serif",
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e423f",
  };

  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState(currentUser?.name || "");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState(currentUser?.profilePic || "");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [file, setFile] = useState(null);

  const queryClient = new QueryClient();

  useEffect(() => {
    console.log("Current User:", currentUser);
  }, [currentUser]);

  const updateUserMutation = useMutation({
    mutationFn: async ({ user_id, userData }) => {
      const response = await makeRequest.put(`/users/${user_id}`, userData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries("users");
      setSuccessMessage("Değişiklikleriniz kaydedildi");
      setErrorMessage("");
      console.log("Data received on success:", data);
    },
    onError: (error) => {
      console.log("Error:", error);
      if (error.response && error.response.data) {
        setErrorMessage(
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data)
        );
      } else {
        setErrorMessage("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
      setSuccessMessage("");
    },
  });

  const handleSaveChanges = async () => {
    if (!name || !password || !newPassword || !confirmNewPassword) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      setSuccessMessage("");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMessage("Yeni şifreler eşleşmiyor.");
      setSuccessMessage("");
      return;
    }

    let profilePicUrl = profilePic;

    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const uploadRes = await makeRequest.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        profilePicUrl = `/upload/${uploadRes.data}`;
      } catch (err) {
        console.error("Failed to upload file", err);
        setErrorMessage("Profil fotoğrafı yüklenemedi.");
        return;
      }
    }

    const userData = {
      name,
      password,
      newPassword,
      profilePic: profilePicUrl,
    };

    if (currentUser?._id) {
      updateUserMutation.mutate({ user_id: currentUser._id, userData });
    } else {
      setErrorMessage("Kullanıcı ID bulunamadı.");
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <SettingsNavBar />
      <Stack display={"flex"} flexDirection={"row"}>
        <Box
          height={727}
          flex={1.5}
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
          bgcolor={"white"}
        >
          <Typography style={divStyle}>Hesabım</Typography>
          <Avatar sx={{ height: 200, width: 200 }} src={profilePic}>
            Sss
          </Avatar>
          <Button variant="contained" component="label" sx={{ mt: 2 }}>
            Profil Fotoğrafı Yükle
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </Button>
        </Box>
        <Box flex={4} bgcolor={"#e5e5e5"}>
          <Box
            mt={15}
            ml={3}
            display={"flex"}
            height={520}
            width={630}
            flexDirection={"column"}
            bgcolor={"white"}
            borderRadius={2}
          >
            <Typography ml={3} mt={2} style={divStyle}>
              Kişisel Bilgiler
            </Typography>
            <Divider />

            <List>
              <ListItem sx={{ display: "flex", alignItems: "center" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>İsim</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem sx={{ display: "flex", alignItems: "center" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>Mevcut Şifre</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem sx={{ display: "flex", alignItems: "center" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>Yeni Şifre</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem sx={{ display: "flex", alignItems: "center" }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3}>
                    <Typography>Yeni Şifre Tekrar</Typography>
                  </Grid>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
              </ListItem>
            </List>
            {errorMessage && (
              <Typography color="error" sx={{ ml: 3, mt: 2 }}>
                {errorMessage}
              </Typography>
            )}
            {successMessage && (
              <Typography color="success" sx={{ ml: 3, mt: 2 }}>
                {successMessage}
              </Typography>
            )}
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveChanges}
              sx={{ ml: 3, mt: 2 }}
            >
              Değişiklikleri Kaydet
            </Button>
          </Box>
        </Box>
      </Stack>
    </>
  );
};

export default Settings;
