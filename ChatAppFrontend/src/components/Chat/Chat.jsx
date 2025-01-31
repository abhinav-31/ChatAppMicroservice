import { useState, useRef } from "react";
import Chat_SideBar from "./Chat_SideBar";
import Chat_ChatList from "./Chat_ChatList";
import Chat_MessageBox from "./Chat_MessageBox";
import Settings from "../Settings/Settings";
import Profile from "../Profile";
import { RiUserAddLine } from "react-icons/ri";
const Chat = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [isResizing, setIsResizing] = useState(false);
  const [chatWidth, setChatWidth] = useState(320); // Initial width of the chat box
  const [selectedSidebarItem, setSelectedSidebarItem] = useState("chat"); // Default to "chat"

  const [showContacts, setShowContacts] = useState(false); // Contact list visibility
  const [tempChat, setTempChat] = useState(null); // Temporarily selected chat

  const chatRef = useRef(null);

  const contacts = [
    { id: 5, name: "Michael Brown", image: "/images/michael.png" },
    { id: 6, name: "Sarah Wilson", image: "/images/sarah.png" },
  ];
  const intitialChats = [
    { id: 1, name: "John Doe", type: "private", image: "/images/john.png" },
    { id: 2, name: "Project Team", type: "group", image: "/images/team.png" },
    { id: 3, name: "Jane Smith", type: "private", image: "/images/jane.png" },
    { id: 4, name: "Emily Davis", type: "private", image: "/images/emily.png" },
  ];

  const [chats, setChats] = useState(intitialChats);
  const handleCloseChat = () => {
    setSelectedChat(null);
  };
  const initialMessages = [
    { sender: "me", text: "Hello! How are you?" },
    { sender: "other", text: "I'm good, thanks! How about you?" },
    { sender: "me", text: "I'm doing well, just working on a project." },
  ];
  const [messages, setMessages] = useState(initialMessages);
  const handleDeleteChat = () => {
    setChats(chats.filter((chat) => chat !== selectedChat));
    setSelectedChat(null); // Set selectedChat to null after deletion
  };

  const handleSidebarItemClick = (item) => {
    setSelectedSidebarItem(item);
  };

  const handleSendMessage = (message, file) => {
    console.log("Message sent:", message);
    setMessages([...messages, { sender: "me", text: message }]);

    if (file) console.log("File sent:", file);

    if (tempChat) {
      setChats([...chats, tempChat]); // Add new contact only after first message
      setTempChat(null);
    }
  };

  const handleSelectContact = (contact) => {
    setTempChat(contact); // Store selected contact temporarily
    setSelectedChat(contact); // Show message box
    setShowContacts(false); // Hide contact list
  };
  // Handle the mouse events for resizing
  const handleMouseDown = () => {
    setIsResizing(true);
  };

  const handleMouseMove = (e) => {
    if (isResizing) {
      const newWidth = e.clientX - chatRef.current.getBoundingClientRect().left;
      // Restrict the width between 200px and 500px (or any other value you want)
      if (newWidth > 200 && newWidth < 500) {
        setChatWidth(newWidth);
      }
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  return (
    <div
      className="bg-white h-screen w-screen flex justify-center items-center overflow-hidden"
      onMouseMove={handleMouseMove} // Track mouse move on the entire screen to update the width
      onMouseUp={handleMouseUp} // Stop resizing when mouse is released
    >
      <div
        ref={chatRef}
        className="relative border border-gray-200 rounded-lg shadow-xl transform scale-105 w-full max-w-[90%] xl:max-w-[94%] h-[92vh] flex"
        style={{ transition: "width 0.1s ease" }}
      >
        {/* Sidebar */}
        <Chat_SideBar onSidebarItemClick={handleSidebarItemClick} />

        {/* Conditional content based on selected sidebar item */}
        {selectedSidebarItem === "settings" ? (
          <Settings user={{ image: "profile.jpg", name: "John Doe" }} />
        ) : selectedSidebarItem === "chat" ? (
          <div className="relative flex flex-col w-[chatwidth]">
            <Chat_ChatList
              chats={chats}
              selectedChat={selectedChat}
              onChatSelect={setSelectedChat}
              chatWidth={chatWidth}
            />
            {/* Floating Add Contact Button */}
            <button
              className="absolute bottom-4 right-4 bg-gradient-to-r from-cyan-600 via-violet-600 to-fuchsia-600 text-white p-3 rounded-2xl shadow-lg hover:bg-blue-600 transition z-50"
              onClick={() => {
                console.log("Hello");
                setShowContacts(!showContacts);
              }}
            >
              <RiUserAddLine size={24} />
            </button>
            {/* Contact List Modal */}
            {showContacts && (
              <div
                className="absolute bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg w-64 border border-gray-200 transition z-50 max-h-[500px] overflow-y-auto"
                style={{
                  scrollbarWidth: "thin", // For Firefox and others that support it
                  msOverflowStyle: "none", // For Internet Explorer and Edge
                  borderBlockEnd: "rounded"
                }}
              >
                <h3 className="text-lg font-semibold mb-2">Select Contact</h3>
                <ul>
                  {contacts.map((contact) => (
                    <li
                      key={contact.id}
                      className="flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer"
                      onClick={() => handleSelectContact(contact)}
                    >
                      <img
                        src={contact.image}
                        alt={contact.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span>{contact.name}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700"
                  onClick={() => setShowContacts(false)}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ) : selectedSidebarItem === "user" ? (
          <Profile user={{ image: "profile.jpg", name: "John Doe" }} />
        ) : null}

        {/* Resizable Border */}
        <div
          className="cursor-ew-resize bg-transparent"
          onMouseDown={handleMouseDown} // Start resizing
          style={{ width: "1px" }}
        />

        {/* Message Box */}
        <Chat_MessageBox
          selectedChat={selectedChat}
          messages={messages}
          onSendMessage={handleSendMessage}
          handleDeleteChat={handleDeleteChat}
          handleCloseChat={handleCloseChat}
        />
      </div>
    </div>
  );
};

export default Chat;
