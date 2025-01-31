/* eslint-disable react/prop-types */
import { FaFont, FaPaintBrush, FaImage } from "react-icons/fa";
import TextSize from "./TextSize";
import Theme from "./Theme"
import ChatWallpaper from "./ChatWallpaper"

const Chats = ({onNavigate}) => {
  const chatsOptions = [
    { name: "Text Size", icon: <FaFont /> ,component: <TextSize/>},
    { name: "Theme", icon: <FaPaintBrush /> ,component:<Theme/>},
    { name: "Chat Wallpaper", icon: <FaImage />,component:<ChatWallpaper/> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {chatsOptions.map((option, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 `}
            onClick={() => option.component && onNavigate(option.name, option.component)}
          >
            <div className="text-gray-600">{option.icon}</div>
            <p className="font-medium">{option.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chats;
