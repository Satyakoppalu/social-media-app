import {Link} from "react-router-dom";
import {useContext} from "react";
import {AuthContext} from "../AuthContext";

const Navbar=()=>{
    const{user, logout}=useContext(AuthContext);

    return (
        <nav className="navbar navbar-light bg-light">
            <Link to="/" className="navbar-brand">Social App</Link>
            <div>
                
                    {user?(
                        <>
                        <Link to="/profile" className="btn btn-outline-primary mx-2">Profile</Link>
                        <button onClick={logout} className="btn btn-outline-danger">Logout</button>
                        </>
                    ):(
                        <>
                        <Link to="/signupLogin" className="btn btn-outline-primary mx-2">Sign up/Login</Link>  
                        </>
                    )}
                
            </div>
        </nav>
    );
};

export default Navbar;