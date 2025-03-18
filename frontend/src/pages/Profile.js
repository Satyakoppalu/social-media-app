import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditProfile from "./EditProfile";
import ThumbUpRoundedIcon from '@mui/icons-material/ThumbUpRounded';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [isOwner, setIsOwner] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [editing, setEditing] = useState(false);
  const token = localStorage.getItem("token");
  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const res = await axios.get(`http://localhost:8000/api/users/user/${id}`, {
        headers: { Authorization: `${token}` },
      });
      setUser(res.data.user);
      setPosts(res.data.posts);
      setIsOwner(res.data.user._id === loggedInUserId);
      setIsFollowing(res.data.user.followers.includes(loggedInUserId));
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const followUser = async () => {
    try {
      await axios.post(`http://localhost:8000/api/follow/follow/${id}`, null, {
        headers: { Authorization: `${token}` },
      });

      setIsFollowing(true);
      setUser((prevUser) => ({
        ...prevUser,
        followers: [...prevUser.followers, loggedInUserId],
      }));
    } catch (error) {
      console.error("Error following user:", error.response?.data?.message);
    }
  };

  const unfollowUser = async () => {
    try {
      await axios.post(`http://localhost:8000/api/follow/unfollow/${id}`, null, {
        headers: { Authorization: `${token}` },
      });

      setIsFollowing(false);
      setUser((prevUser) => ({
        ...prevUser,
        followers: prevUser.followers.filter(
          (follower) => follower !== loggedInUserId
        ),
      }));
    } catch (error) {
      console.error("Error unfollowing user:", error.response?.data?.message);
    }
  };


  const handleLike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/api/posts/like/${postId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      fetchUserProfile();
    } catch (error) {
      console.error("Error liking post:", error.response?.data?.message);
    }
  };

  const handleUnlike = async (postId) => {
    try {
      await axios.post(`http://localhost:8000/api/posts/unlike/${postId}`, {}, {
        headers: { Authorization: `${token}` },
      });
      fetchUserProfile();
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
      fetchUserProfile();
    } catch (error) {
      console.error("Error adding comment:", error.response?.data?.message);
    }
  };


  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/comment/${postId}/${commentId}`, {
        headers: { Authorization: `${token}` },
      });
      fetchUserProfile();
    } catch (error) {
      console.error("Error deleting comment:", error.response?.data?.message);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:8000/api/posts/delete/${postId}`, {
        headers: { Authorization: `${token}` },
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post._id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error.response.data.message);
    }
  };

  return (
    <div className="container mt-4">
  {user ? (
    <>

      <div className="text-center mb-4">
        <img
          src={user.profileImageUrl || ""}
          alt="Profile"
          className="rounded-circle"
          width="170"
          height="170"
        />
        <h2>{user.username}</h2>
        {user.bio && <p>{user.bio}</p>}

        <div className="d-flex justify-content-center mb-3">
          <div className="mx-3">
            <strong>{user.followers ? user.followers.length : 0}</strong>
            <p>Followers</p>
          </div>
          <div className="mx-3">
            <strong>{user.following ? user.following.length : 0}</strong>
            <p>Following</p>
          </div>
        </div>

        {isOwner && !editing ? (
          <button
            className="btn btn-primary mt-2"
            onClick={() => setEditing(true)}
          >
            Edit Profile
          </button>
        ) : (
          isOwner && (
            <div className="position-relative">
              <button
                className="btn btn position-absolute top-0 end-0 m-2 fs-4"
                onClick={() => setEditing(false)} 
              >
                ✖
              </button>
        

              <EditProfile user={user} onProfileUpdated={setUser} setEditing={setEditing} />
            </div>
          )
        )}

        {!isOwner && (
          <button
            className={`btn mt-3 ${isFollowing ? "btn-danger" : "btn-primary"}`}
            onClick={isFollowing ? unfollowUser : followUser}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>


      <h4 className="mt-4 text-center">Posts</h4>
      {posts.length === 0 ? (
        <p className="text-center">No posts yet</p>
      ) : (
        <div className="d-flex justify-content-center">
          <div className="row" style={{ maxWidth: '500px', width: '100%'}}>
            {posts.map((post) => (
              <div key={post._id} className="col-20 mb-4">
                <div className="card">
                  <div className="card-body position-relative">

                    {isOwner && (
                      <IconButton
                        aria-label="delete"
                        onClick={() => handleDeletePost(post._id)}
                        className="position-absolute top-0 end-0"
                        sx={{ marginTop: '10px', marginRight: '10px', color: 'primary' }}  // Optional: Add color if needed
                      >
                        <DeleteIcon />
                      </IconButton>
                    )}


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
    </>
  ) : (
    <h4 className="text-center">Loading...</h4>
  )}
</div>


  );
};

export default Profile;
