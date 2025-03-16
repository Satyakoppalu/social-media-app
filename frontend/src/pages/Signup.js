import { useContext, useState } from "react";
import axios from  "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const SignupLogin=()=>{
    const [formData, setFormData]=useState({
        username:"",
        email:"",
        password:"",
        profileImage:null
    });

    const [isLogin, setIsLogin]=useState(false);
    const navigate=useNavigate();
    const { login }=useContext(AuthContext);

    const handleChange =(e)=>{
        setFormData({...formData, [e.target.name]:e.target.value});
    };

    const handleFileChange=(e)=>{
        setFormData({...formData, profileImage:e.target.files[0]});
    };


    const handleSubmit=async (e) =>{
        e.preventDefault();


        try {
            const url=isLogin?"http://localhost:8000/api/users/login":"http://localhost:8000/api/users/signup";

            if (!isLogin){
                const formDataToSend=new FormData();
                formDataToSend.append("email", formData.email);
                formDataToSend.append("password", formData.password);
                formDataToSend.append("username", formData.username);
                if (formData.profileImage){
                    formDataToSend.append("image", formData.profileImage);
                }
            

            const res = await axios.post(url, formDataToSend, {
              headers: { "Content-Type": "multipart/form-data" },
            });
            login(res.data.token);
            navigate("/");
        }else{
            const loginData={
                email:formData.email,
                password:formData.password
            };
            const res = await axios.post(url, loginData, {
                headers: { "Content-Type": "application/json" },
              });
            login(res.data.token);
            navigate("/");
        }
          } catch (error) {
            console.error("Signup error:", error.response.data);
          }
        };



return (
    <div className="container mt-4">
        <h2>{isLogin? "Log In": "Sign Up"}</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        {!isLogin && (<input type="text" name="username" placeholder="Username" onChange={handleChange} required/>)}
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required/>
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required/>
        {!isLogin && (<input type="file" name="image" onChange={handleFileChange}/>)}
        <button type="submit">{isLogin?"Log In":"Sign Up"}</button>
        </form>
        <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={()=> setIsLogin(!isLogin)}>
                {isLogin?"Sign up":"Log in"}
            </button>
        </p>
    </div>
);


};

export default SignupLogin