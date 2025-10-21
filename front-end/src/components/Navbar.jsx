import React from "react";
import "./Navbar.css"
import { Link } from "react-router-dom";

function Navbar () {
    return(

        <div className="navbar">
           <div className="logo">Luct Reporting System</div>
            <nav className="nav">
                <ul className="nav-links">
                    <li className="nav-item">
                        <Link to="/" className="">Home</Link>    
                    </li>
                    <li className="nav-item">
                        <Link to="/contacts" className="">Contacts</Link>
                        </li>
                    <li className="nav-item">
                        <Link to="/about" className="">About</Link>
                        </li>
                    <li className="nav-item">
                        <Link to="/login" className="">Login</Link>
                        </li>
                    <li className="nav-item">
                        <Link to="/register" className="">Register</Link>
                    </li>
                </ul>
            </nav>

        </div>
    )
}
export default Navbar;