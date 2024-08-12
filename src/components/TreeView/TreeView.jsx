import React, { useState, useEffect } from "react";
import "../../assets/styles/components/treeview.scss";
import Icon from "../Icons";

const TreeView = ({ dataset }) => {
  const [locations, setLocations] = useState([]);
  const [assets, setAssets] = useState([]);
  const [treeData, setTreeData] = useState(null);

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
        <Icon name="component" width="20" height="20" viewBox="0 0 20 20" />
      );
    } else if (item.parentId && !item.sensorType) {
      return <Icon name="asset" width="20" height="20" viewBox="0 0 20 20" />;
    } else if (item.locationId || item.parentId === null) {
      return (
        <Icon name="location" width="16" height="20" viewBox="0 0 16 20" />
      );
    }
  };

  const renderTree = (node) => {
    return (
      <ul key={node.id || node.name}>
        <li>
          {getItemIcon(node)} {node.name}
          {node.children && node.children.length > 0 && (
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
    <div className="tree-view">
      <h2>{dataset} Asset Tree</h2>
      {treeData ? renderTree(treeData) : <p>Loading...</p>}
    </div>
  );
};

export default TreeView;
