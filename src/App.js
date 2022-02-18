import "./App.css";
import { useEffect, useState } from "react";
import scheduleAPI from "./api/scheduleAPI";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/index.jsx";
import Schedule from "./pages/Schedule/index.jsx";

function App() {
  

  return (
    <div className="App">
      <div className="container">
        <Router>
          <Routes>
            <Route path="/schedule" element={<Schedule/>} />
            <Route path="/" element={<Home/>} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
