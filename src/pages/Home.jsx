import React, { useState } from "react";
import TreeView from "../components/TreeView/TreeView";

const Home = () => {
  const [selectedDataset, setSelectedDataset] = useState("JaguarUnit");

  return (
    <div className="app">
      <header>
        <h1>Company Asset Tree</h1>
        <select
          onChange={(e) => setSelectedDataset(e.target.value)}
          value={selectedDataset}
        >
          <option value="JaguarUnit">Jaguar Unit</option>
          <option value="TobiasUnit">Tobias Unit</option>
          <option value="ApexUnit">Apex Unit</option>
        </select>
      </header>
      <TreeView dataset={selectedDataset} />
    </div>
  );
};

export default Home;
