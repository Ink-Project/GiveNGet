import { fetchHandler } from "../utils";
import { useState, useEffect, useContext } from "react";
import CurrentUserContext from "../context/CurrentUserContext";
import { Navigate } from "react-router-dom";

type Post = {
  id: number;
  title: string;
  location: string;
  user_id: number;
};

const Posts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const { currentUser } = useContext(CurrentUserContext);

  if(!currentUser) return <Navigate to="/login" />;

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await fetchHandler("/api/v1/posts");
      setPosts(data);
    };

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((postOrArray) => {
          if (Array.isArray(postOrArray)) {
            return postOrArray.map((post) => (
              <li key={post.id}>
                <p>ID: {post.id}</p>
                <p>Title: {post.title}</p>
                <p>Location: {post.location}</p>
                <p>User ID: {post.user_id}</p>
              </li>
            ));
          }
        })}
      </ul>
    </div>
  );
};

export default Posts;
