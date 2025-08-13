import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Dashboard from "./Dashboard";
import Navbar from "./Navbar";

function App() {
  // State to track if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Determine the current route to conditionally show the Logout button
  const location = useLocation();

  // The user is logged in only when on the Dashboard page
  const showLogout = location.pathname === "/dashboard";

  return (
    <>
      {/* Pass isLoggedIn based on the current route */}
      <Navbar isLoggedIn={showLogout} />
      <Routes>
        <Route path="/" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
