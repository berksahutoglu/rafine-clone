import React, { useState } from "react";
import {
  Tooltip,
  Fab,
  Modal,
  Box,
  TextField,
  Button,
  styled,
  FormControl,
  MenuItem,
  Select,
  Checkbox,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { makeRequest } from "../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const StyledModal = styled(Modal)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const ImageUploadButton = ({ onChange }) => (
  <label htmlFor="icon-button-file">
    <input
      accept="image/*"
      id="icon-button-file"
      type="file"
      style={{ display: "none" }}
      onChange={onChange}
    />
    <Button
      sx={{ bgcolor: "#223734" }}
      variant="contained"
      component="span"
      startIcon={<PhotoCamera />}
    >
      Fotoğraf Yükle
    </Button>
  </label>
);

const NewPost = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [checked, setChecked] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("Uploading file:", file);

      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("File upload response:", res.data);
      return res.data.url;
    } catch (err) {
      console.error("File upload error:", err);
      setErrorMessage("Dosya yüklenemedi");
    }
  };

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (newPost) => makeRequest.post("/posts", newPost),
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const notificationMutation = useMutation({
    mutationFn: (newNotification) =>
      makeRequest.post("/notifications", newNotification),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    if (!title || !desc || !file) {
      setErrorMessage("LÜTFEN TÜM ALANLARI DOLDURUN");
      console.log("Form is incomplete");
      return;
    }

    let imgUrl = "";
    if (file) imgUrl = await upload();
    console.log("Image URL:", imgUrl);
    const newPost = {
      desc,
      img: imgUrl,
      title,
      content,
      isChecked: checked ? 1 : 0,
    };

    console.log("Creating new post:", newPost);
    mutation.mutate(newPost, {
      onSuccess: (data) => {
        console.log("Post created successfully:", data);
        const newNotification = {
          message: `${content} ile ilgili yeni haber var!`,
          postId: data.data.id,
        };

        notificationMutation.mutate(newNotification, {
          onSuccess: () => {
            console.log("Notification created successfully");
          },
        });

        handleClose();
        setDesc("");
        setFile(null);
        setTitle("");
        setContent("");
        setChecked(false);
        setErrorMessage(""); // Reset error message
      },
      onError: (error) => {
        console.error("Error sharing the post:", error);
        setErrorMessage("Error sharing the post: " + error.message);
      },
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    setContent(e.target.value.toString());
    console.log("Selected Content:", e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
    console.log("Checked:", e.target.checked);
  };

  return (
    <>
      <Tooltip onClick={() => setOpen(true)} className="New Post">
        <Fab color="primary" aria-label="add">
          <AddIcon />
        </Fab>
      </Tooltip>
      <StyledModal
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          width={600}
          height={600}
          bgcolor={"background.default"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <TextField
            label="Başlık"
            variant="outlined"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {file && (
            <Box
              component="img"
              src={URL.createObjectURL(file)}
              alt="Selected"
              sx={{
                width: "100%",
                height: "auto",
                maxHeight: 200,
                objectFit: "contain",
                borderRadius: 2,
                marginBottom: 2,
              }}
            />
          )}
          <ImageUploadButton
            role={undefined}
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              console.log("Selected file:", selectedFile);
              setFile(selectedFile);
            }}
          />
          <TextField
            label="Yazı"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />

          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={content}
                label="Tür"
                onChange={handleChange}
              >
                <MenuItem value={"piyasa"}>Piyasa</MenuItem>
                <MenuItem value={"güç"}>Güç</MenuItem>
                <MenuItem value={"kültür"}>Kültür</MenuItem>
                <MenuItem value={"mahal"}>Mahal</MenuItem>
              </Select>
            </FormControl>
            <div>
              Önemli Konu?
              <Checkbox checked={checked} onChange={handleCheckboxChange} />
            </div>
          </Box>

          {errorMessage && (
            <Typography
              color="error"
              sx={{
                width: 386,
                textAlign: "center",
                marginTop: 2,
                justifyContent: "center",
              }}
            >
              {errorMessage}
            </Typography>
          )}
          <Button
            variant="contained"
            sx={{ bgcolor: "#223734" }}
            onClick={handleClick}
          >
            Gönder
          </Button>
        </Box>
      </StyledModal>
    </>
  );
};

export default NewPost;
