import React, { useState } from "react";
import "../../css/CollapseView.scss";

const CollapsePanel = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`collapse-panel${isOpen ? " open" : ""}`}>
      <div className="header" onClick={togglePanel}>
        <h3 className="title">{title}</h3>
        <span className={`arrow${isOpen ? " up" : " down"}`}>&#x25BC;</span>
      </div>
      <div className={`content${isOpen ? " open" : ""}`}>
        <div className="inner">{children}</div>
      </div>
    </div>
  );
};

export default CollapsePanel;