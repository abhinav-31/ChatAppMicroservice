/* eslint-disable react/prop-types */
import { BsPaperclip } from "react-icons/bs";
import { GrEmoji } from "react-icons/gr";
import { IoMdSend } from "react-icons/io";

const MessageInput = ({
    message,
    setMessage,
    setShowEmojiPicker,
    showAttachmentOptions,
    setShowAttachmentOptions,
    openFilePicker,
    handleFileSelect,
    sendMessage,
    handleWrapperClick,
    fileInputRef
  }) => (
    <div className="p-4 bg-white flex items-center gap-3 relative" onClick={handleWrapperClick}>
      <BsPaperclip
        className="text-gray-600 text-3xl cursor-pointer hover:text-blue-500"
        onClick={() => setShowAttachmentOptions((prev) => !prev)}
      />
  
      {showAttachmentOptions && (
        <div className="absolute bottom-16 left-4 bg-white shadow-lg rounded-lg z-50" >
          <ul className="text-left">
            {["Document", "Photo", "Audio", "Location", "Video"].map((type) => (
              <li
                key={type}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                
                onClick={() => openFilePicker(type)}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}
  
      <input
        id="file-input"
        type="file"
        className="hidden"
        onChange={handleFileSelect}
        ref={fileInputRef}
      />
  
      <div className="flex-1 relative">
        <input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <GrEmoji
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer hover:text-blue-500"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
        />
        <IoMdSend
          className="absolute right-5 top-1/2 transform -translate-y-1/2 text-xl text-gray-600 cursor-pointer hover:text-blue-500"
          onClick={sendMessage}
        />
      </div>
    </div>
  );

  export default MessageInput;


// import { BsPaperclip } from "react-icons/bs";
// import { GrEmoji } from "react-icons/gr";
// import { IoMdSend } from "react-icons/io";
// import { useRef, useState, useEffect } from "react";

// const MessageInput = ({
//   message,
//   setMessage,
//   setShowEmojiPicker,
//   showAttachmentOptions,
//   setShowAttachmentOptions,
//   openFilePicker,
//   handleFileSelect,
//   sendMessage,
//   handleWrapperClick,
//   fileInputRef
// }) => {
//   const [inputWidth, setInputWidth] = useState("40px");
//   const spanRef = useRef(null);
//   const inputRef = useRef(null);

//   // Adjust input width dynamically based on text length
//   useEffect(() => {
//     if (spanRef.current) {
//       setInputWidth(`${spanRef.current.offsetWidth + 20}px`);
//     }
//   }, [message]);

//   return (
//     <div className="p-4 bg-white flex items-center gap-3 relative" onClick={handleWrapperClick}>
//       <BsPaperclip
//         className="text-gray-600 text-3xl cursor-pointer hover:text-blue-500"
//         onClick={() => setShowAttachmentOptions((prev) => !prev)}
//       />

//       {showAttachmentOptions && (
//         <div className="absolute bottom-16 left-4 bg-white shadow-lg rounded-lg z-50">
//           <ul className="text-left">
//             {["Document", "Photo", "Audio", "Location", "Video"].map((type) => (
//               <li
//                 key={type}
//                 className="p-2 hover:bg-gray-100 cursor-pointer"
//                 onClick={() => openFilePicker(type)}
//               >
//                 {type}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       <input
//         type="file"
//         className="hidden"
//         onChange={handleFileSelect}
//         ref={fileInputRef}
//       />

//       <div className="flex-1 flex items-center border border-gray-300 rounded-4xl px-3 py-2 focus-within:ring-2 focus-within:ring-green-500">
//         {/* Hidden span to measure text width dynamically */}
//         <span
//           ref={spanRef}
//           className="absolute opacity-0 whitespace-pre-wrap"
//         >
//           {message || "Type a message..."}
//         </span>

//         {/* Expanding input field */}
//         <input
//           ref={inputRef}
//           type="text"
//           placeholder="Type a message..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           style={{ width: inputWidth, minWidth: "40px", maxWidth: "100%" }}
//           className="p-2 border-none outline-none bg-transparent"
//         />

//         <GrEmoji
//           className="text-xl text-gray-600 cursor-pointer hover:text-blue-500 mx-2"
//           onClick={() => setShowEmojiPicker((prev) => !prev)}
//         />
//         <IoMdSend
//           className="text-xl text-gray-600 cursor-pointer hover:text-blue-500"
//           onClick={sendMessage}
//         />
//       </div>
//     </div>
//   );
// };

// export default MessageInput;
