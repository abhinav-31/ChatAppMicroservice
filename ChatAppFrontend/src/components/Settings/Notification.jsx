import { FaCommentDots, FaUsers } from "react-icons/fa";

const Notification = (onNavigate) => {
  const notificationsOptions = [
    { name: "For Private Chat", icon: <FaCommentDots /> },
    { name: "For Group Chat", icon: <FaUsers /> },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {notificationsOptions.map((option, index) => (
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

export default Notification;
