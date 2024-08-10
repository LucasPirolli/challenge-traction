// React Hooks
import { useState } from "react";

// Functions
import { useNavigate } from "react-router-dom";

// Styles
import "../styles/pages/welcome.scss";

const Welcome = () => {
  const navigate = useNavigate();

  const particles = Array.from({ length: 200 }, (_, i) => (
    <div key={i} className={`particle particle-${i + 1}`} />
  ));

  return ( 
    <>
      <div className="container-welcome">
        <div className="particles">{particles}</div>
        <dl className="content">
          <h3 className="greeting">Hello</h3>
          <dd className="description">
            Welcome to my challenge proposed by Tractian
          </dd>
          <dd className="description funny">Hope you like it :)</dd>
          <button
            className="btn-lets-start"
            type="button"
            onClick={() => navigate("/home")}
          >
            <span className="name">start</span>
          </button>
        </dl>
        <footer className="footer">
          <p className="copy">&copy; 2024 Lucas Pirolli. All rights reserved</p>
        </footer>
      </div>
    </>
  );
};

export default Welcome;
