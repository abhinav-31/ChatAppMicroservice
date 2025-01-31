import { useState } from "react";

const ChatWallpaper = () => {
  const [selectedWallpaper, setSelectedWallpaper] = useState(null);
  const [uploadedWallpaper, setUploadedWallpaper] = useState(null);

  const availableWallpapers = [
    "https://brunty.me/files/chat-bgs/1.0/yellow-green-100-pct.png",
   "https://brunty.me/files/chat-bgs/1.0/yellow-green-100-pct.png",
   "https://brunty.me/files/chat-bgs/1.0/yellow-green-100-pct.png",
  ];

  const handleWallpaperChange = (event) => {
    setUploadedWallpaper(URL.createObjectURL(event.target.files[0]));
  };

  return (
    <div className="p-4">
      <h3 className="text-sm font-semibold text-gray-700">Select Chat Wallpaper</h3>
      <div className="mt-4">
        {/* Show available wallpapers */}
        <div className="flex gap-4">
          {availableWallpapers.map((wallpaper, index) => (
            <div
              key={index}
              className={`w-20 h-20 rounded-lg border cursor-pointer ${
                selectedWallpaper === wallpaper ? "border-blue-500" : "border-gray-300"
              }`}
              style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: "cover" }}
              onClick={() => setSelectedWallpaper(wallpaper)}
            />
          ))}
        </div>

        {/* Option to upload from system */}
        <div className="mt-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleWallpaperChange}
            className="mb-4"
          />
        </div>

        {/* Display selected or uploaded wallpaper */}
        <div className="mt-4">
          <h4 className="text-sm text-gray-600">Selected Wallpaper</h4>
          <div
            className="w-full h-40 mt-2 rounded-lg"
            style={{
              backgroundImage: `url(${uploadedWallpaper || selectedWallpaper})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ChatWallpaper;
