import React from "react";
import { NavLink } from "react-router-dom";

const Navbar = ({ isLoggedIn }) => {
    return (
        <nav style={styles.navbar}>
            <div style={styles.title}>Library Management System</div>
            <div style={styles.links}>
                {!isLoggedIn ? (
                    <>
                        <NavLink
                            to="/"
                            style={styles.link}
                            activeStyle={styles.activeLink}
                            exact
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/signup"
                            style={styles.link}
                            activeStyle={styles.activeLink}
                        >
                            Sign Up
                        </NavLink>
                    </>
                ) : (
                    <NavLink
                        to="/logout"
                        style={styles.link}
                        activeStyle={styles.activeLink}
                    >
                        Logout
                    </NavLink>
                )}
            </div>
        </nav>
    );
};

const styles = {
    navbar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#34495e",
        padding: "15px 20px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    title: {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#ecf0f1",
        fontFamily: "Arial, sans-serif",
    },
    links: {
        display: "flex",
        gap: "20px",
    },
    link: {
        color: "#ecf0f1",
        textDecoration: "none",
        fontSize: "18px",
        fontWeight: "500",
        transition: "color 0.3s ease",
    },
    activeLink: {
        color: "#1abc9c",
        fontWeight: "bold",
    },
};

export default Navbar;
