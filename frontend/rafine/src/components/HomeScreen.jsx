import React, { useState } from "react";
import NavBar from "./NavBar";
import Feed from "./Feed";
import LeftBar from "./LeftBar";
import { Box } from "@mui/material";
import RightBar from "./RightBar";

const HomeScreen = () => {
  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <NavBar value={value} handleChange={handleChange} />
      <Box display={"flex"} mt={15}>
        <LeftBar />
        <Feed value={value} />
        <RightBar />
      </Box>
    </div>
  );
};

export default HomeScreen;
