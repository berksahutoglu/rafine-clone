import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Collapse,
  IconButton,
  styled,
} from "@mui/material";
import { makeRequest } from "../axios"; // axios ile istek yapmak için
import resim1 from "../photos/resim1.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const StyledExpandMore = styled((props) => {
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

const LeftBar = () => {
  const [posts, setPosts] = useState([]);
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await makeRequest.get("/posts");
        const importantPosts = res.data.filter(
          (post) => post.isChecked === true
        );
        setPosts(importantPosts);
      } catch (err) {
        console.log(err);
      }
    };

    fetchPosts();
  }, []);

  const handleExpandClick = (postId) => {
    setExpandedPost(expandedPost === postId ? null : postId);
  };

  return (
    <Box flex={4} display={"flex"} flexDirection={"column"} alignItems={"end"}>
      <Typography sx={{ alignSelf: "center" }} style={divStyle}>
        {posts ? posts.length : 0} Önemli Konu
      </Typography>
      {posts.map((post) => (
        <Card key={post.id} sx={{ width: 300, m: 2 }}>
          <Box marginTop={2} mb={2}>
            <div style={divStyle}>{post.desc}</div>
          </Box>
          <CardMedia
            component="img"
            height="140"
            image={"/upload/" + post.img || resim1} // Eğer post.img yoksa varsayılan resim kullanılır
            alt="Post image"
          />
          <CardActions disableSpacing>
            <Box>
              <div>Daha fazlası</div>
              <StyledExpandMore
                expand={expandedPost === post.id}
                onClick={() => handleExpandClick(post.id)}
                aria-expanded={expandedPost === post.id}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </StyledExpandMore>
            </Box>
          </CardActions>
          <Collapse in={expandedPost === post.id} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography style={divStyle} paragraph>
                {post.title}:
              </Typography>
              <Typography paragraph>{post.desc}</Typography>
            </CardContent>
          </Collapse>
        </Card>
      ))}
    </Box>
  );
};

export default LeftBar;
