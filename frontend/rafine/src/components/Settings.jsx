import React, { useContext, useState } from "react";
import NavBar from "./NavBar";
import {
  Avatar,
  Box,
  Button,
  Divider,
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

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Add this line
  const { currentUser } = useContext(AuthContext);

  const updateUserMutation = useMutation({
    mutationFn: ({ user_id, userData }) =>
      makeRequest.put("/users/" + user_id, userData),
    onSuccess: () => {
      // Invalidate user data in the cache
      queryClient.invalidateQueries("users");
    },
  });

  console.log("id: ", currentUser);

  const queryClient = new QueryClient();

  const handleSaveChanges = async () => {
    // Validate form fields here if needed
    if (!name || !password) {
      setErrorMessage("Lütfen tüm alanları doldurun.");
      return;
    }

    const userData = {
      name,
      password,
    };

    // Make PUT request to update user
    updateUserMutation.mutate(
      { user_id: currentUser.id, userData },
      {
        onError: (error) => {
          if (error.response && error.response.data) {
            setErrorMessage(error.response.data);
          } else {
            setErrorMessage(
              "Bir hata oluştu. Lütfen daha sonra tekrar deneyin."
            );
          }
        },
      }
    );
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
          <Avatar sx={{ height: 200, width: 200 }}>Sss</Avatar>
        </Box>
        <Box flex={4} bgcolor={"e5e5e5"}>
          <Box
            mt={15}
            ml={3}
            display={"flex"}
            height={420}
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
              <ListItem sx={{ display: "flex", gap: 3 }}>
                <Typography>İsim</Typography>
                <TextField
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  variant="outlined"
                />
              </ListItem>

              <ListItem sx={{ display: "flex", gap: 3 }}>
                <Typography>Yeni Şifre</Typography>
                <TextField
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  variant="outlined"
                />
              </ListItem>
            </List>
            <Button
              variant="contained"
              color="success"
              onClick={handleSaveChanges}
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
