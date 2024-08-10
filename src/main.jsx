import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Libs Components 
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Pages
import Welcome from "./pages/Welcome.jsx";
import Home from "./pages/Home.jsx";

// Style
import "./index.scss";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
