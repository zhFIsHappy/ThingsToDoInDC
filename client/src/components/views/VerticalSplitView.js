import React, { useState } from 'react';
import '../../css/VerticalSplitView.scss'

const VerticalSplit = ({ leftComponent, rightComponent }) => {
  const [hoverOffset, setHoverOffset] = useState(0);
  const [leftHovered, setLeftHovered] = useState(false);
  const [rightHovered, setRightHovered] = useState(false);

  const handleMouseMove = (e) => {
    const x = e.pageX - e.target.offsetLeft;
    const y = e.pageY - e.target.offsetTop;
    if (Math.abs(x - hoverOffset) > 1) {
      requestAnimationFrame(() => {
        setHoverOffset(y);
      });
    }
  };

  const handleMouseLeave = () => {
    setHoverOffset(0);
    setLeftHovered(false);
    setRightHovered(false);
  };

  return (
    <div
      className="vertical-split-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`vertical-split-left${leftHovered ? ' hovered' : ''}`}
        onMouseEnter={() => setLeftHovered(true)}
        onMouseLeave={() => setLeftHovered(false)}
      >
        {leftComponent}
      </div>
      <div className="vertical-split-hover">
        <div
          className="vertical-split-hover-inner"
          style={{ transform: `translateY(${hoverOffset - 10}px)` }}
        >
          <div className="vertical-split-hover-ball" />
        </div>
      </div>
      <div
        className={`vertical-split-right${rightHovered ? ' hovered' : ''}`}
        onMouseEnter={() => setRightHovered(true)}
        onMouseLeave={() => setRightHovered(false)}
      >
        {rightComponent}
      </div>
      <div className="vertical-split-divider" />
    </div>
  );
};

export default VerticalSplit;