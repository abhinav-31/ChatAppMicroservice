/* eslint-disable react/prop-types */
import EmojiPicker from "emoji-picker-react";
import { useRef, useState } from "react";
import ChatHeader from "./ChatHeader";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";

const Chat_MessageBox = ({
  selectedChat,
  messages,
  onSendMessage,
  handleDeleteChat,
  handleCloseChat,
}) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuClicked, setIsMenuClicked] = useState(false);

  const fileInputRef = useRef(null);
  // Handlers moved inside the component
  const handleEmojiClick = (emoji) => {
    setMessage((prev) => prev + emoji.emoji);
    setShowEmojiPicker(false);
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) setSelectedFile(file.name);
  };

  const openFilePicker = (type) => {
    console.log(`Selected attachment type: ${type}`);
    fileInputRef.current?.click();
    // document.getElementById("file-input").click();
    setShowAttachmentOptions(false);
  };
  const handleSendMessage = () => {
    if (message.trim() || selectedFile) {
      onSendMessage(message, selectedFile);
      setMessage("");
      setSelectedFile(null);
    }
  };
  const dropdownRef = useRef(null);

  const handleWrapperClick = (e) => {
    // Check if click occurred outside the dropdown container
    if (isMenuClicked &&   !dropdownRef.current?.contains(e.target)) {
      setIsDropdownOpen(false);
      setIsMenuClicked(!isMenuClicked);
    }

  };

  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
    setIsMenuClicked(!isMenuClicked);
  };

  const resetMenuState = () => {
    setIsMenuClicked(false); // Reset the hamburger menu rotation state when an option is selected
  };

  return (
    <div className="flex-1 bg-gray-50 h-full flex items-center justify-center relative ">
      {selectedChat ? (
        <div className="w-full h-full flex flex-col">
          <ChatHeader
            selectedChat={selectedChat}
            toggleDropdown={toggleDropdown}
            isMenuClicked={isMenuClicked}
            isDropdownOpen={isDropdownOpen}
            setIsDropdownOpen={setIsDropdownOpen}
            resetMenuState={resetMenuState}
            messages={messages}
            handleDeleteChat={handleDeleteChat}
            handleCloseChat={handleCloseChat}
          />
          {messages.length === 0 ? (
            <div className="flex-1 p-4 flex justify-center items-center text-center">
              <p className="text-gray-500">
                Start chatting with {selectedChat.name}...
              </p>
            </div>
          ) : (
            <MessageList
              messages={messages}
              handleWrapperClick={handleWrapperClick}
            />
          )}

          <MessageInput
            message={message}
            setMessage={setMessage}
            setShowEmojiPicker={setShowEmojiPicker}
            showAttachmentOptions={showAttachmentOptions}
            setShowAttachmentOptions={setShowAttachmentOptions}
            openFilePicker={openFilePicker}
            handleFileSelect={handleFileSelect}
            sendMessage={handleSendMessage}
            handleWrapperClick={handleWrapperClick}
            fileInputRef={fileInputRef}
          />

          {showEmojiPicker && (
            <div className="absolute bottom-16 left-8">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
      ) : (
        <div className="text-gray-400 text-lg font-medium">
          Select a chat to start messaging
        </div>
      )}
    </div>
  );
};

export default Chat_MessageBox;
