
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SignupLogin from "./pages/Signup";
// import Login from "./pages/Login";
import Profile from "./pages/Profile";
import CreatePost from "./pages/CreatePost";
import UserProfile from "./pages/UserProfile";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/"element={<Home />} />
        <Route path="/signupLogin"element={<SignupLogin />} />
        {/* <Route path="/login"element={<Signup />} /> */}
        <Route path="/profile"element={<Profile />} />
        <Route path="/create-post"element={<CreatePost />} />
        <Route path="/user/:id"element={<UserProfile />} />
      </Routes>

    </Router>
    
  );
}


// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Signup from "./pages/Signup";

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/signup" element={<Signup />} />
//       </Routes>
//     </Router>
//   );
// }

export default App;
