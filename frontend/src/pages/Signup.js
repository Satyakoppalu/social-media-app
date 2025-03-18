import { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const SignupLogin = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [isLogin, setIsLogin] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [showForgotPasswordPopup, setShowForgotPasswordPopup] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profileImage: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = isLogin
        ? "http://localhost:8000/api/users/login"
        : "http://localhost:8000/api/users/signup";

      if (!isLogin) {
        const formDataToSend = new FormData();
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        formDataToSend.append("username", formData.username);
        if (formData.profileImage) {
          formDataToSend.append("image", formData.profileImage);
        }

        const res = await axios.post(url, formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        login(res.data.token, res.data.userId);
        navigate("/");
      } else {
        const loginData = {
          email: formData.email,
          password: formData.password,
        };
        const res = await axios.post(url, loginData, {
          headers: { "Content-Type": "application/json" },
        });
        login(res.data.token, res.data.userId);
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error.response.data);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPasswordPopup(true);
  };

  const handleClosePopup = () => {
    setShowForgotPasswordPopup(false);
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    try {
      alert("Password reset link sent!");
      handleClosePopup(); 
    } catch (error) {
      console.error("Error sending reset link:", error);
      alert("Error sending reset link. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
      <div className="box p-4 border shadow-sm" style={{ width: "100%", maxWidth: "400px" }}>
        <h2 className="text-center">{isLogin ? "Log In" : "Sign Up"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {!isLogin && (
            <input
              type="text"
              name="username"
              placeholder="Username"
              onChange={handleChange}
              required
              className="form-control mb-3"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            onChange={handleChange}
            required
            className="form-control mb-3"
          />
          {!isLogin && (
            <div className="mb-3 d-flex align-items-center">
              <label className="form-label me-2">Upload profile picture:</label>
              <div className="mb-2">
                <input
                  type="file"
                  name="image"
                  id="profilePicUpload"
                  onChange={handleFileChange}
                  className="d-none"
                />
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={() => document.getElementById("profilePicUpload").click()}
                >
                  Choose File
                </button>
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-3">
            {isLogin ? "Log In" : "Sign Up"}
          </button>
         
        </form>


        {isLogin && (
          <p className="text-center mb-3">
            <button onClick={handleForgotPassword} className="btn btn-link p-0">
              Forgot Password?
            </button>
          </p>
        )}

        <p className="text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={() => setIsLogin(!isLogin)} className="btn btn-link p-0">
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>


      {showForgotPasswordPopup && (
        <div className="modal show d-block" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset Password</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleClosePopup}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSendResetLink}>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleChange}
                    required
                    className="form-control mb-3"
                  />
                  <div className="d-flex justify-content-center">
                <button type="submit" className="btn btn-primary w-15">
                    Send Reset Link
                </button>
                </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignupLogin;
