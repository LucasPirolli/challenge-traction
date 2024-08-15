// React Hooks
import React, { useState, useEffect } from "react";

// My Components
import Icon from "../Icons";
import Loader from "../Loader";

// Style
import "../../assets/styles/components/treeview.scss";

const TreeView = ({ dataset }) => {
  const [locations, setLocations] = useState([]);
  const [assets, setAssets] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sensorFilter, setSensorFilter] = useState("all");
  const [noResults, setNoResults] = useState(false);

  const [selectedComponent, setSelectedComponent] = useState(null);
  const [componentImageUrl, setComponentImageUrl] = useState("");

  const buildTree = (locations, assets) => {
    const locationMap = {};
    const assetMap = {};
    const firstLevelNodes = new Set();

    locations.forEach((location) => {
      location.children = [];
      locationMap[location.id] = location;

      if (location.parentId) {
        const parent = locationMap[location.parentId];
        if (parent) {
          parent.children.push(location);
        }
      }
    });

    assets.forEach((asset) => {
      asset.children = [];
      if (asset.locationId) {
        const location = locationMap[asset.locationId];
        if (location) {
          location.children.push(asset);
        }
      } else if (asset.parentId) {
        const parent = assetMap[asset.parentId];
        if (parent) {
          parent.children.push(asset);
        }
      } else {
        if (!assetMap[asset.id]) {
          assetMap[asset.id] = asset;
        }
      }
    });

    assets.forEach((asset) => {
      if (asset.parentId) {
        const parent = assetMap[asset.parentId];
        if (parent) {
          parent.children.push(asset);
        }
      }
    });

    const root = {
      name: "ROOT",
      children: [],
    };

    Object.values(locationMap).forEach((location) => {
      if (!location.parentId) {
        root.children.push(location);
        firstLevelNodes.add(location.id);
      }
    });

    Object.values(assetMap).forEach((asset) => {
      if (!asset.locationId && !asset.parentId) {
        root.children.push(asset);
        firstLevelNodes.add(asset.id);
      }
    });

    setExpandedNodes(new Set([...firstLevelNodes, root.name]));

    return root;
  };

  const getItemIcon = (item) => {
    if (item.sensorType) {
      return (
        <Icon name="component" width="17" height="17" viewBox="0 0 21 21" />
      );
    } else if (item.parentId && !item.sensorType) {
      return <Icon name="asset" width="17" height="17" viewBox="0 0 19 21" />;
    } else if (item.locationId || item.parentId === null) {
      return (
        <Icon name="location" width="17" height="17" viewBox="0 0 17 21" />
      );
    }
  };

  const getItemIconStatus = (item) => {
    if (item.sensorType === "energy" && item.status === "operating") {
      return <Icon name="bold" width="9" height="12" viewBox="0 0 9 12" />;
    } else if (item.status === "operating") {
      return (
        <Icon name="operating_icon" width="8" height="9" viewBox="0 0 8 9" />
      );
    } else if (item.status === "alert") {
      return <Icon name="alert_icon" width="8" height="9" viewBox="0 0 8 9" />;
    }
    return null;
  };

  const generateRandomImageUrl = () => {
    const randomColor = Math.floor(Math.random() * 10).toString(16);
    return `https://dummyimage.com/336x226/${randomColor}/fff&text=Tractian`;
  };

  const toggleNode = (id) => {
    setExpandedNodes((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(id)) {
        newExpanded.delete(id);
      } else {
        newExpanded.add(id);
      }
      return newExpanded;
    });
  };

  const handleComponentClick = (component) => {
    setSelectedComponent(component);
    const randomImageUrl = generateRandomImageUrl();
    setComponentImageUrl(randomImageUrl);
  };

  const matchesFilters = (node, term, statusFilter, sensorFilter) => {
    const matchesSearch = node.name.toLowerCase().includes(term.toLowerCase());

    const matchesCriticalStatus =
      statusFilter === "all" || node.status === statusFilter;

    const matchesSensorEnergy =
      sensorFilter === "all" || node.sensorType === sensorFilter;

    if (matchesSearch && matchesCriticalStatus && matchesSensorEnergy) {
      return true;
    }

    if (node.children) {
      return node.children.some((child) =>
        matchesFilters(child, term, statusFilter, sensorFilter)
      );
    }

    return false;
  };

  const renderTree = (node) => {
    const isExpanded = expandedNodes.has(node.id || node.name);
    const hasChildren = node.children && node.children.length > 0;

    if (!matchesFilters(node, searchTerm, statusFilter, sensorFilter)) {
      return null;
    }

    const isSelected = selectedComponent && selectedComponent.id === node.id;

    return (
      <ul key={node.id || node.name}>
        <li>
          <div
            className={`container-informations ${isSelected ? "selected" : ""}`}
            onClick={() => node.sensorType && handleComponentClick(node)}
          >
            {hasChildren && (
              <span
                onClick={(e) => {
                  e.stopPropagation(); // Evita que o clique expanda/colapse ao selecionar um componente
                  toggleNode(node.id || node.name);
                }}
                className={isExpanded ? "expanded" : ""}
              >
                <Icon
                  name="arrow_right"
                  width="10"
                  height="10"
                  viewBox="0 0 12 16"
                  className={`arrow-icon ${isExpanded ? "expanded" : ""}`}
                />
              </span>
            )}
            {getItemIcon(node)}
            {node.name}
            {getItemIconStatus(node)}
          </div>
          {isExpanded && node.children && node.children.length > 0 && (
            <ul>{node.children.map((child) => renderTree(child))}</ul>
          )}
        </li>
      </ul>
    );
  };

  const loadData = async () => {
    try {
      const locationsData = await fetch(
        `../../../src/assets/datasets/${dataset}/locations.json`
      ).then((res) => res.json());

      const assetsData = await fetch(
        `../../../src/assets/datasets/${dataset}/assets.json`
      ).then((res) => res.json());

      setLocations(locationsData);
      setAssets(assetsData);
    } catch (error) {
      console.error("Error loading dataset:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [dataset]);

  useEffect(() => {
    if (locations.length && assets.length) {
      const tree = buildTree(locations, assets);
      setTreeData(tree);
    }
  }, [locations, assets]);

  useEffect(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setSensorFilter("all");
    setNoResults(false);
  }, [dataset]);

  useEffect(() => {
    if (treeData) {
      const noMatch = !matchesFilters(
        treeData,
        searchTerm,
        statusFilter,
        sensorFilter
      );
      setNoResults(noMatch);
    } else {
      setNoResults(false);
    }
  }, [searchTerm, statusFilter, sensorFilter, treeData]);

  return (
    <>
      <section className="container-tree-view">
        <div className="container-filters">
          <input
            type="text"
            className="input"
            placeholder="Typing..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            className={`btn-filter sensor ${
              sensorFilter === "energy" ? "active" : ""
            }`}
            onClick={() =>
              setSensorFilter((prevFilter) =>
                prevFilter === "energy" ? "all" : "energy"
              )
            }
          >
            <Icon name="ray" width="13" height="15" viewBox="0 0 13 15" />
            Power Sensor
          </button>
          <button
            className={`btn-filter critical ${
              statusFilter === "alert" ? "active" : ""
            }`}
            onClick={() =>
              setStatusFilter((prevFilter) =>
                prevFilter === "alert" ? "all" : "alert"
              )
            }
          >
            <Icon name="critical" width="14" height="14" viewBox="0 0 14 14" />
            Critical
          </button>
        </div>
        <div className="tree-view">
          {noResults ? (
            <p className="no-results">No results found</p>
          ) : treeData ? (
            renderTree(treeData)
          ) : (
            <Loader />
          )}
        </div>
      </section>

      {selectedComponent && (
        <section className="component-details">
          <h3 className="title">
            {selectedComponent.name} {getItemIconStatus(selectedComponent)}
          </h3>
          <div className="container-infos">
            <figure className="container-image">
              <img
                src={componentImageUrl}
                alt={`Image of ${selectedComponent.name}`}
                className="image"
              />
            </figure>
            <section className="content-infos">
              {selectedComponent.id && (
                <div className="content-text">
                  <label className="label">Identifier</label>
                  <span className="value">{selectedComponent.id}</span>
                </div>
              )}
              {selectedComponent.sensorType && (
                <div className="content-text">
                  <label className="label">Sensor Type</label>
                  <span className="value">
                    {selectedComponent.sensorType === "energy"
                      ? "Energy"
                      : selectedComponent.sensorType === "vibration"
                      ? "Vibration"
                      : ""}
                  </span>
                </div>
              )}
            </section>
          </div>
        </section>
      )}
    </>
  );
};

export default TreeView;
