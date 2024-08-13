import React, { useState, useEffect } from "react";
import "../../assets/styles/components/treeview.scss";
import Icon from "../Icons";

const TreeView = ({ dataset }) => {
  const [locations, setLocations] = useState([]);
  const [assets, setAssets] = useState([]);
  const [treeData, setTreeData] = useState(null);
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const buildTree = (locations, assets) => {
    const locationMap = {};
    const assetMap = {};

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
      }
    });

    Object.values(assetMap).forEach((asset) => {
      if (!asset.locationId && !asset.parentId) {
        root.children.push(asset);
      }
    });

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

  const renderTree = (node) => {
    const isExpanded = expandedNodes.has(node.id || node.name);
    const hasChildren = node.children && node.children.length > 0;

    return (
      <ul key={node.id || node.name}>
        <li>
          <div className="container-informations">
            {hasChildren && (
              <span
                onClick={() => toggleNode(node.id || node.name)}
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
            {getItemIcon(node)} {node.name}
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

  return (
    <>
      <section className="container-tree-view">
        <div className="container-filters">
          <input type="text" className="input" placeholder="Typing..." />
          <button className="btn-filter sensor">
            <Icon name="ray" width="13" height="15" viewBox="0 0 13 15" />
            Power Sensor
          </button>
          <button className="btn-filter sensor">
            <Icon name="critical" width="14" height="14" viewBox="0 0 14 14" />
            Critical
          </button>
        </div>
        <div className="tree-view">
          {treeData ? renderTree(treeData) : <p>Loading...</p>}
        </div>
      </section>
    </>
  );
};

export default TreeView;
