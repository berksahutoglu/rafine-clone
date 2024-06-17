import React from "react";
import { Box } from "@mui/material";

import TabContext from "@mui/lab/TabContext";
import TabPanel from "@mui/lab/TabPanel";
import Posts from "./post/Posts.jsx";

const Feed = ({ value }) => {
  // Check if post is not undefined before filtering

  return (
    <Box width={800}>
      <TabContext value={value}>
        <TabPanel value="1">
          <Posts filterValue={value === "1" ? "piyasa" : undefined} />
        </TabPanel>
        <TabPanel value="2">
          {" "}
          <Posts filterValue={value === "2" ? "güç" : undefined} />
        </TabPanel>
        <TabPanel value="3">
          {" "}
          <Posts filterValue={value === "3" ? "kültür" : undefined} />
        </TabPanel>
        <TabPanel value="4">
          {" "}
          <Posts filterValue={value === "4" ? "mahal" : undefined} />
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default Feed;
