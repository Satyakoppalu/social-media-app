
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Home from "./pages/Home";
import SignupLogin from "./pages/Signup";
import Profile from "./pages/Profile";
import Navbar from "./components/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/"element={<Home />} />
        <Route path="/signupLogin"element={<SignupLogin />} />
        <Route path="/user/:id"element={<Profile />} />
      </Routes>

    </Router>
    
  );
}

export default App;
