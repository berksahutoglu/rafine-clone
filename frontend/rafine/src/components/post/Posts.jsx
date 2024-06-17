import React from "react";
import { useQuery } from "@tanstack/react-query";
import Post from "./Post";
import { makeRequest } from "../../axios";

const Posts = ({ user_id, filterValue }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: () =>
      makeRequest.get("/posts?user_id=" + user_id).then((res) => res.data),
  });

  // Add a null check before calling the filter method
  const filteredPosts = data
    ? data.filter((post) => post.content === filterValue)
    : [];

  return (
    <div className="posts">
      {error
        ? "Something went wrong!"
        : isLoading
        ? "loading"
        : filteredPosts.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
