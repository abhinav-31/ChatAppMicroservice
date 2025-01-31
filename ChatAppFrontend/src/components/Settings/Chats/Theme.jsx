import { useState } from "react";

const Theme = () => {
  const [selectedTheme, setSelectedTheme] = useState("System Default");

  const handleThemeChange = (event) => {
    setSelectedTheme(event.target.value);
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700">Select Theme</h3>
      <div className="mt-4">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="theme"
            value="System Default"
            checked={selectedTheme === "System Default"}
            onChange={handleThemeChange}
          />
          System Default
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="radio"
            name="theme"
            value="Dark"
            checked={selectedTheme === "Dark"}
            onChange={handleThemeChange}
          />
          Dark
        </label>
        <label className="flex items-center gap-2 mt-2">
          <input
            type="radio"
            name="theme"
            value="White"
            checked={selectedTheme === "White"}
            onChange={handleThemeChange}
          />
          White
        </label>
      </div>
    </div>
  );
};

export default Theme;
