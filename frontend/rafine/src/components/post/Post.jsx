import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import moment from "moment";
import { Box, Menu, MenuItem, Button, TextField, Modal } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const divStyle = {
  fontFamily: "Libre Franklin, sans-serif",
  fontSize: 22,
  fontWeight: "bold",
  color: "#2e423f",
};

const Post = ({ post, notifications }) => {
  const [expanded, setExpanded] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editDesc, setEditDesc] = useState(post.desc);
  const [anchorEl, setAnchorEl] = useState(null);
  const openn = Boolean(anchorEl);
  const [errorMessage, setErrorMessage] = useState("");

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (post_id) => {
      return makeRequest.delete("/posts/" + post_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
      setIsDeleted(true);
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ post_id, updatedPost }) => {
      return makeRequest.put("/posts/" + post_id, updatedPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleDelete = () => {
    handleClose();
    setShowConfirmation(true);
  };

  const handleConfirmDelete = () => {
    deleteMutation.mutate(post._id);
    setIsDeleted(true);
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  const handleEdit = () => {
    setEditMode(true);
    handleClose();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editTitle || !editDesc) {
      setErrorMessage("LÜTFEN TÜM ALANLARI DOLDURUN");
      return;
    }
    const updatedPost = {
      title: editTitle,
      desc: editDesc,
    };

    // Update UI immediately
    setEditMode(false);
    post.title = editTitle;
    post.desc = editDesc;

    editMutation.mutate(
      { post_id: post._id, updatedPost },
      {
        onError: (error) => {
          setErrorMessage("Error updating the post: " + error.message);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  if (isDeleted) {
    return null;
  }

  return (
    <Box mb={4}>
      <Card sx={{ width: 700 }}>
        <CardHeader
          avatar={
            <Avatar
              src={post.userId.profilePic}
              alt=""
              sx={{ bgcolor: red[500] }}
              aria-label="recipe"
            ></Avatar>
          }
          action={
            <IconButton
              aria-controls={openn ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openn ? "true" : undefined}
              onClick={handleClick}
              aria-label="settings"
            >
              <MoreVertIcon />
            </IconButton>
          }
          title={post.userId.name}
          subheader={moment(post.createdAt).fromNow()}
        />
        <Typography
          style={divStyle}
          ml={2}
          mt={2}
          mb={2}
          variant="body1"
          fontSize={"bold"}
        >
          {post.title}
        </Typography>
        <CardMedia
          sx={{
            maxWidth: 700,
            height: "auto",
            maxHeight: 500,
            objectFit: "contain",
          }}
          component="img"
          image={"/upload/" + post.img}
          alt=""
        />

        <CardActions disableSpacing>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            Daha fazlası
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography style={divStyle} paragraph>
              {post.title}:
            </Typography>
            <Typography paragraph>{post.desc}</Typography>
          </CardContent>
        </Collapse>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={openn}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          <MenuItem sx={{ color: "red" }} onClick={handleDelete}>
            Delete
          </MenuItem>
          <MenuItem sx={{ color: "blue" }} onClick={handleEdit}>
            Edit
          </MenuItem>
        </Menu>
      </Card>
      {showConfirmation && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h5">
                Postu Silmek İstediğinizden Emin Misiniz?
              </Typography>
              <Box mt={2} display="flex" justifyContent="space-between">
                <Button
                  variant="contained"
                  color="error"
                  onClick={handleConfirmDelete}
                >
                  Sil
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleCancelDelete}
                >
                  Vazgeç
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
      <Modal
        open={editMode}
        onClose={handleCancelEdit}
        aria-labelledby="edit-modal-title"
        aria-describedby="edit-modal-description"
      >
        <Box
          component="form"
          onSubmit={handleSave}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="edit-modal-title" variant="h6" component="h2">
            Edit Post
          </Typography>
          <TextField
            fullWidth
            label="Title"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            multiline
            rows={4}
            sx={{ mt: 2 }}
          />
          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="contained" color="primary" type="submit">
              Save
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleCancelEdit}
            >
              Cancel
            </Button>
          </Box>
          {errorMessage && (
            <Typography variant="body2" color="error" sx={{ mt: 2 }}>
              {errorMessage}
            </Typography>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Post;
