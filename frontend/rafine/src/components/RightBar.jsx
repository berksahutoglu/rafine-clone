import { Box, Typography } from "@mui/material";
import React from "react";
import AddPost from "./AddPost";

const RightBar = () => {
  const divStyle = {
    fontFamily: "Libre Franklin, sans-serif",
    fontSize: 22,
    fontWeight: "bold",
    color: "#2e423f",
  };

  return (
    <Box
      flex={4}
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <Typography style={divStyle}>Haber Paylaş</Typography>
      <AddPost />
    </Box>
  );
};

export default RightBar;
