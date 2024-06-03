import {
  Divider,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import React from "react";

const NotificationsPanel = ({ notifications }) => {
  if (!notifications) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ width: "100%", maxWidth: 360, padding: 2 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Notifications
      </Typography>
      <List>
        {notifications.map((notification) => (
          <div key={notification.id}>
            <ListItem>
              <ListItemText primary={notification.message} />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Paper>
  );
};

export default NotificationsPanel;
