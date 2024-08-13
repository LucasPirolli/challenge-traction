// Image
import Logo from "../assets/images/logo.svg";

// Styles
import "../assets/styles/components/topbar.scss";

const Topbar = () => {
  return (
    <div className="content-topbar">
      <div className="container-logo">
        <img src={Logo} alt="Logo Tractian" className="image" />
      </div>
    </div>
  );
};

export default Topbar;
