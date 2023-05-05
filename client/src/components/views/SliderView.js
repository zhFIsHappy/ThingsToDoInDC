import React, { useState,useRef,useEffect } from "react";
import '../../css/SliderView.scss'

function Slider({ value, min = 0, max = 100, step = 1, onChange }) {
  const [sliderValue, setSliderValue] = useState(value);

  const handleChange = (event) => {
    const newValue = Number(event.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  return (
    <div>
      <div style={{color:'white'}}>{sliderValue}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleChange}
      />
    </div>
  );
}


const DoubleSlider = ({ min = 0, max = 100, step = 1, onChange }) => {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);

  const sliderRef = useRef();
  const minThumbRef = useRef();
  const maxThumbRef = useRef();

  useEffect(() => {
    onChange && onChange(minValue, maxValue);
  }, [minValue, maxValue, onChange]);

  const getPercentage = (value) => ((value - min) / (max - min)) * 100;

  const handleMinThumbMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMinThumbMouseMove);
    document.addEventListener("mouseup", handleMinThumbMouseUp);
  };

  const handleMinThumbMouseMove = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const value = Math.round(((max - min) * percentage) / 100/ step)*step + min;
    setMinValue(Math.min(Math.max(min, value), maxValue));
  };

  const handleMinThumbMouseUp = () => {
    document.removeEventListener("mousemove", handleMinThumbMouseMove);
    document.removeEventListener("mouseup", handleMinThumbMouseUp);
  };

  const handleMaxThumbMouseDown = (e) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMaxThumbMouseMove);
    document.addEventListener("mouseup", handleMaxThumbMouseUp);
  };

  const handleMaxThumbMouseMove = (e) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = (x / rect.width) * 100;
    const value = Math.round(((max - min) * percentage) / 100/ step)*step + min;
    setMaxValue(Math.max(Math.min(max, value), minValue));
  };

  const handleMaxThumbMouseUp = () => {
    document.removeEventListener("mousemove", handleMaxThumbMouseMove);
    document.removeEventListener("mouseup", handleMaxThumbMouseUp);
  };
  return (
    <div className="double-slider" ref={sliderRef}>
      <div
        className="track"
        style={{
          left: `${getPercentage(minValue)}%`,
          width: `${getPercentage(maxValue) - getPercentage(minValue)}%`,
        }}
      />
      <div
        className="thumb"
        ref={minThumbRef}
        style={{ left: `calc(${getPercentage(minValue)}% - 10px)` }}
        onMouseDown={handleMinThumbMouseDown}
      />
      <div
        className="thumb"
        ref={maxThumbRef}
        style={{ left: `calc(${getPercentage(maxValue)}% - 10px)` }}
        onMouseDown={handleMaxThumbMouseDown}
      />
    </div>
   
  );
};

export { Slider, DoubleSlider };