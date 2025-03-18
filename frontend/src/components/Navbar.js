import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext";
import axios from "axios";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate(); 

  const handlePostChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e) => {
    setPostImage(e.target.files[0]);
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("text", postText);
    if (postImage) {
      formData.append("image", postImage);
    }

    try {
      await axios.post("http://localhost:8000/api/posts/create", formData, {
        headers: {
          Authorization: `${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setIsModalOpen(false);
      setPostText(""); 
      setPostImage(null); 
    } catch (error) {
      console.error("Error creating post:", error.response?.data?.message);
    }
  };

  const handleCancel = () => {
    setPostText("");
    setPostImage(null);
    setIsModalOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/signupLogin"); 
  };

  const handleSearch = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/search?query=${searchQuery}`,
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      setSearchResults(response.data.users); 
    } catch (error) {
      console.error("Error searching for users:", error);
    }
  };

  const handleSearchClick = (userId) => {
    navigate(`/user/${userId}`);
    setSearchResults([]); 
    setSearchQuery(""); 
  };

  return (
    <nav className="navbar navbar-light bg-dark d-flex justify-content-between">
      <Link to="/" className="navbar-brand text-white"style={{ marginLeft: '10px' }}>Social App</Link>

      
      {user && (
        <form
          className="d-flex mx-auto"
          onSubmit={handleSearch}
          style={{ width: "42%" ,paddingLeft: "175px" }}
        >
          <input
            type="text"
            className="form-control me-2"
            placeholder="Search for users"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="btn btn-outline-primary text-white">
            Search
          </button>


          {searchQuery && searchResults.length > 0 && (
            <div
              className="dropdown-menu show"
              style={{ position: "absolute", zIndex: 1050, width: "50%" }}
            >
              {searchResults.map((result) => (
                <button
                  key={result._id}
                  className="dropdown-item"
                  onClick={() => handleSearchClick(result._id)}
                >
                  {result.username}
                </button>
              ))}
            </div>
          )}
        </form>
      )}

      <div>
        {user ? (
          <>
            <button
              className="btn btn-outline-primary mx-2 text-white"
              onClick={() => setIsModalOpen(true)}
            >
              Create Post
            </button>
            <Link to={`/user/${userId}`} className="btn btn-outline-primary mx-2 text-white">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-outline-danger text-white" style={{ marginRight: '10px' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/signupLogin" className="btn btn-outline-primary mx-2 text-white">
              Sign up/Login
            </Link>
          </>
        )}
      </div>


      {isModalOpen && (
        <div
          className="modal show"
          style={{
            display: "block",
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1050,
          }}
          onClick={handleCancel} 
        >
          <div
            className="modal-dialog"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Post</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCancel} 
                ></button>
              </div>
              <div className="modal-body">
                <textarea
                  className="form-control mb-2"
                  value={postText}
                  onChange={handlePostChange}
                  placeholder="What's on your mind?"
                  rows="4"
                ></textarea>
                <input
                  type="file"
                  className="form-control mb-2"
                  onChange={handleImageChange}
                />
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={handleCreatePost}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
