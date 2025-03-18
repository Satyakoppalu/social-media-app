import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";

const EditProfile=({user, onProfileUpdated, setEditing})=>{
    const [bio, setBio]=useState(user.bio||"");
    const [profilePic, setProfilePic]=useState(null);
    const [password, setPassword]=useState("");
    const navigate=useNavigate();
    const token=localStorage.getItem("token");

    const handleProfileUpdate=async(e)=>{
        e.preventDefault();
        const formData=new FormData();
        if (profilePic) formData.append("image", profilePic);

        try{
            const res=await axios.put("http://localhost:8000/api/users/update-profile-pic", formData,
            {headers:{Authorization:`${token}`, "Content-Type":"multipart/form-data"}});
            alert("Profile picture updated!");
            onProfileUpdated(res.data.user);
            setEditing(false);
        }catch(error){
            console.error("Error updating profile pic", error);
        }

    };
    const handleBioUpdate = async () => {
        try {
          const res = await axios.put(
            "http://localhost:8000/api/users/update-bio",
            { bio },
            { headers: { Authorization: `${token}` } }
          );
          alert("Bio updated!");
          onProfileUpdated(res.data.user);
          setEditing(false);
        } catch (error) {
          console.error("Error updating bio:", error);
        }
      };
    
    const handlePasswordUpdate = async () => {
        if (!password) return alert("Enter a new password.");
        try {
          await axios.put(
            "http://localhost:8000/api/users/update-password",
            { password },
            { headers: { Authorization: `${token}` } }
          );
          alert("Password updated!");
          setEditing(false);
        } catch (error) {
          console.error("Error updating password:", error);
        }
      };
    
    const handleDeleteAccount = async () => {
        const confirmDelete = window.confirm("Are you sure? This action is irreversible.");
        if (!confirmDelete) return;
    
        try {
          await axios.delete("http://localhost:8000/api/users/delete-account", { headers: { Authorization: `${token}` } });
          alert("Account deleted.");
          localStorage.removeItem("token");
          navigate("/signup");
        } catch (error) {
          console.error("Error deleting account:", error);
        }
      };

    return (
    <div className="container mt-4">
        <h2>Edit Profile</h2>

        {/* Update Profile Picture */}
        <form onSubmit={handleProfileUpdate}>
        <div className="mb-3">
            <label className="form-label">Profile Picture</label>
            <input type="file" className="form-control" onChange={(e) => setProfilePic(e.target.files[0])} />
            <button type="submit" className="btn btn-primary mt-2">Update Profile Picture</button>
        </div>
        </form>

        {/* Update Bio */}
        <div className="mb-3">
        <label className="form-label">Bio</label>
        <textarea className="form-control" value={bio} onChange={(e) => setBio(e.target.value)} />
        <button className="btn btn-primary mt-2" onClick={handleBioUpdate}>Update Bio</button>
        </div>

        {/* Change Password */}
        <div className="mb-3">
        <label className="form-label">New Password</label>
        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="btn btn-primary mt-2" onClick={handlePasswordUpdate}>Update Password</button>
        </div>

        {/* Delete Account */}
        <button className="btn btn-danger mt-4" onClick={handleDeleteAccount}>Delete Account</button>
    </div>
    );
};

export default EditProfile;