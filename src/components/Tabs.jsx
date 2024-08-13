// React Hooks
import React, { useState } from "react";

// Styles
import "../assets/styles/components/tabs.scss";

const Tabs = ({ onDatasetChange }) => {
  const [selectedDataset, setSelectedDataset] = useState("JaguarUnit");

  const menuItems = [
    { icon: "jaguar", text: "Jaguar Unit", value: "JaguarUnit" },
    { icon: "tobias", text: "Tobias Unit", value: "TobiasUnit" },
    { icon: "apex", text: "Apex Unit", value: "ApexUnit" },
  ];
  const handleNavigateClick = (value) => {
    setSelectedDataset(value);
    onDatasetChange(value);
  };

  return (
    <div className="container-tabs">
      {menuItems.map((item, index) => (
        <button
          key={index}
          className={`tab ${selectedDataset === item.value ? "active" : ""}`}
          type="button"
          onClick={() => handleNavigateClick(item.value)}
        >
          {item.text}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
