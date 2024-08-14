// Image
import Logo from "../assets/images/logo.svg";

// Functions
import { useNavigate } from "react-router-dom";

// Styles
import "../assets/styles/components/topbar.scss";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <div className="content-topbar">
      <div className="container-logo" onClick={() => navigate("/")}>
        <img src={Logo} alt="Logo Tractian" className="image" />
      </div>
    </div>
  );
};

export default Topbar;
