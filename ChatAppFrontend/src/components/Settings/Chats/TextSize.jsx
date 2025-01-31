import { useState } from "react";

const TextSize = () => {
  const [textSize, setTextSize] = useState(16); // Default text size

  const handleSliderChange = (event) => {
    setTextSize(event.target.value);
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700">Select Text Size</h3>
      <div className="mt-4">
        <input
          type="range"
          min="10"
          max="30"
          value={textSize}
          onChange={handleSliderChange}
          className="w-full"
        />
        <div className="mt-2 text-center">{textSize}px</div>
      </div>
    </div>
  );
};

export default TextSize;
