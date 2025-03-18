import React, { useEffect, useState } from "react";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const headers = { Authorization: `${token}` };
    try {
      const res = await axios.get("http://localhost:8000/api/posts/home", {
        headers: { Authorization: `${token}` },
      });
      setPosts(res.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error liking post:", error.response?.data?.message);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/api/posts/unlike/${postId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error unliking post:", error.response?.data?.message);
    }
  };

  const handleComment = async (postId) => {
    if (!commentText[postId]) return;

    try {
      await axios.post(`http://localhost:8000/api/posts/comment/${postId}`, { text: commentText[postId] }, {
        headers: { Authorization: `${token}` },
      });
      setCommentText({ ...commentText, [postId]: "" });
      fetchPosts();
    } catch (error) {
      console.error("Error adding comment:", error.response?.data?.message);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/comment/${postId}/${commentId}`, {
        headers: { Authorization: `${token}` },
      });
      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data?.message);
    }
  };

  return (
    <div className="container mt-4">
      {posts.length === 0 ? (
        <p className="text-center">No posts yet</p>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="row" style={{ maxWidth: '500px', width: '100%'}}>
            {posts.map((post) => (
              <div key={post._id} className="col-20 mb-4">
                <div className="card">
                  <div className="card-body position-relative">

                  <div className="d-flex align-items-center mb-2">
                    <img
                      src={post.user.profileImageUrl}
                      alt={post.user.username}
                      className="rounded-circle"
                      width="40"
                      height="40"
                      style={{ marginRight: "10px" }}
                    />
                    <strong>{post.user.username}</strong>
                  </div>

  
                    <p>{post.text}</p>
                    {post.imageUrl && (
                      <div className="text-center">
                        <img 
                          src={post.imageUrl} 
                          alt="Post" 
                          className="img-fluid" 
                          style={{
                            width: 'auto', 
                            height: 'auto', 
                            maxHeight: '300px', 
                            objectFit: 'contain', 
                            marginBottom: '15px'
                          }}
                        />
                      </div>
                    )}
  
                 
                    <div className="d-flex align-items-center mt-2">
                    <button
                    className="btn d-flex align-items-center"
                    onClick={() =>
                      post.likes.includes(localStorage.getItem("userId"))
                        ? handleUnlike(post._id)
                        : handleLike(post._id)
                    }
                  >
                    {post.likes.includes(localStorage.getItem("userId")) ? (
                      <ThumbUpRoundedIcon fontSize="medium" style={{ color: "#007bff" }} className="me-1" />
                    ) : (
                      <ThumbUpOutlinedIcon fontSize="medium"  style={{ color: "#007bff" }} className="me-1" />
                    )}
                    <small className="text-muted "style={{ fontSize: "medium" }}>{post.likes.length}</small>

                  </button>
                  
                    </div>

  

                    <div className="mt-3">
                      <h6>Comments</h6>
                      {post.comments.length > 0 ? (
                        <ul className="list-group">
                          {post.comments.map((comment) => (
                            <li key={comment._id} className="list-group-item d-flex align-items-center">
                              <img
                                src={comment.user.profileImageUrl}
                                alt={comment.user.username}
                                className="rounded-circle"
                                width="30"
                                height="30"
                                style={{ marginRight: "10px" }}
                              />
                              <strong>{comment.user.username}: </strong> {comment.text}
                              {comment.user._id === loggedInUserId && (
                                <IconButton
                                aria-label="delete"
                                onClick={() => handleDeleteComment(post._id, comment._id)}
                                className="position-absolute top-0 end-0"
                                sx={{ marginTop: '5px', marginRight: '5px', color: 'primary' }}
                              >
                                <DeleteIcon fontSize="small"/>
                              </IconButton>
                    
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p></p>
                      )}
                    </div>
  

                    <div className="mt-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment"
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText({ ...commentText, [post._id]: e.target.value })
                        }
                      />
                      <button
                        className="btn btn-primary mt-2"
                        onClick={() => handleComment(post._id)}
                      >
                        Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )};
  

export default Home;