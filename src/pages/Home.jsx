// React Hooks
import React, { useState } from "react";

// My Components
import Tabs from "../components/Tabs";
import TreeView from "../components/TreeView/TreeView";
import TopBar from "../components/Topbar";

// Styles
import "../assets/styles/pages/home.scss";

const Home = () => {
  const [selectedDataset, setSelectedDataset] = useState("JaguarUnit");

  return (
    <>
      <TopBar />
      <div className="container-home">
        <Tabs onDatasetChange={setSelectedDataset} />
        <div className="content">
          <TreeView dataset={selectedDataset} />
        </div>
      </div>
    </>
  );
};

export default Home;
