/* eslint-disable react/prop-types */

import { RxHamburgerMenu } from "react-icons/rx";

// Sub-component for Chat Header
const ChatHeader = ({
  selectedChat,
  toggleDropdown,
  isMenuClicked,
  isDropdownOpen,
  setIsDropdownOpen,
  resetMenuState,
  messages,
  handleDeleteChat,
  handleCloseChat
}) =>{ 
  const handleClearChat = ()=>{
    messages.splice(0,messages.length);
  }

 return (
  <div className="p-2 h-[8%] bg-gray-300 flex items-center gap-4">
    <img
      src={selectedChat.image}
      alt={selectedChat.name}
      className="w-14 h-14 ml-3 rounded-full border border-gray-400 object-cover"
    />
    <h2 className="text-lg font-bold">{selectedChat.name}</h2>
    <div
      className="ml-auto cursor-pointer flex flex-col justify-center items-center space-y-2"
      onClick={toggleDropdown}
      style={{
        width: "30px",
        height: "30px",
        transition: "transform 0.1s ease",
      }}
    >
      <RxHamburgerMenu
        size={30}
        className={`hover:text-cyan-500 transition-all duration-100 ease-in-out ${
          isMenuClicked ? "transform -rotate-90" : ""
        }`}
      />
    </div>
    {isDropdownOpen && (
      <div className="absolute top-16 right-4 w-fit bg-white shadow-lg rounded-lg">
        <ul className="text-left">
          {[
            "Contact info",
            "Add to contact",
            "Block user",
            "Clear chat",
            "Delete chat",
            "Close chat",
          ].map((option) => (
            <li
              key={option}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                console.log(option);
                if(option==="Clear chat"){handleClearChat()}
                if(option==="Delete chat"){handleDeleteChat()}
                if(option==="Close chat"){handleCloseChat()}
                setIsDropdownOpen(false);
                resetMenuState();
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
}
export default ChatHeader;
