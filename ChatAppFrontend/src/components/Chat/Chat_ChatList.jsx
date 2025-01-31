/* eslint-disable react/prop-types */

// const Chat_ChatList = ({ chats, selectedChat, onChatSelect, chatWidth }) => {
//   return (
//     <div
//       className="bg-white flex flex-col h-full overflow-hidden"
//       style={{ width: chatWidth }}
//     >
//       <div className="p-4">
//         <input
//           type="text"
//           placeholder="Search..."
//           className="w-full p-2 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-500"
//         />
//       </div>
//       <div
//         className="overflow-y-auto flex-1"
//         style={{
//           scrollbarWidth: "thin",
//           msOverflowStyle: "none",
//         }}
//       >
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             className={`border-b border-gray-100 p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 ${
//               selectedChat?.id === chat.id ? "bg-gray-200" : ""
//             }`}
//             onClick={() => onChatSelect(chat)}
//           >
//             <div className="flex-shrink-0">
//               <img
//                 src={chat.image}
//                 alt={chat.name}
//                 className="w-10 h-10 border border-gray-200 rounded-full"
//               />
//             </div>
//             <div className="flex-1">
//               <p className="font-medium">{chat.name}</p>
//               <p className="text-sm text-gray-500">{chat.type}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Chat_ChatList;

// import { BiSearchAlt } from "react-icons/bi";
// import { SiAircall } from "react-icons/si";
// import { HiUserGroup } from "react-icons/hi";
// import { AiOutlineUsergroupAdd } from "react-icons/ai";
// import { HiMiniUser } from "react-icons/hi2";

// const Chat_ChatList = ({ chats, selectedChat, onChatSelect, chatWidth }) => {
//   return (
//     <div
//       className="bg-white flex flex-col h-full overflow-hidden"
//       style={{ width: chatWidth }}
//     >
//       {/* Header */}
//       <div className="p-2 flex justify-between items-center border-b border-gray-200">
//         <h1 className="text-xl font-semibold">Chats</h1>
//       </div>

//       {/* Search Bar */}
//       <div className="p-2 flex flex-col gap-2 border-b border-gray-200">
//         <div className="relative flex items-center border border-gray-300 rounded-4xl">
//           {/* Search Icon */}
//           <div className="absolute left-4 cursor-pointer z-50">
//             <BiSearchAlt size={24} />
//           </div>
//           {/* Input Field */}
//           <input
//             type="text"
//             placeholder="Search..."
//             className="w-full pl-12 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-4xl"
//           />
//         </div>
//       </div>

//       {/* Buttons below search bar */}
//       <div className="p-2 flex gap-4 border-b border-gray-200">
//         <button
//           className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-200 "
//           title="All"
//         >
//           <SiAircall size={18} />
//         </button>
//         <button
//           className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100"
//           title="Private"
//         >
//           <HiMiniUser size={18} />
//         </button>
//         <button
//           className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100"
//           title="Group"
//         >
//           <HiUserGroup size={18} />
//         </button>
//         <button
//           className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100"
//           title="Create Group"
//         >
//           <AiOutlineUsergroupAdd size={18} />
//         </button>
//       </div>

//       {/* Chats List */}
//       <div
//         className="overflow-y-auto flex-1"
//         style={{
//           scrollbarWidth: "thin",
//           msOverflowStyle: "none",
//         }}
//       >
//         {chats.map((chat) => (
//           <div
//             key={chat.id}
//             className={`border-b border-gray-100 p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 ${
//               selectedChat?.id === chat.id ? "bg-gray-200" : ""
//             }`}
//             onClick={() => onChatSelect(chat)}
//           >
//             <div className="flex-shrink-0">
//               <img
//                 src={chat.image}
//                 alt={chat.name}
//                 className="w-10 h-10 border border-gray-200 rounded-full"
//               />
//             </div>
//             <div className="flex-1">
//               <p className="font-medium">{chat.name}</p>
//               <p className="text-sm text-gray-500">{chat.type}</p>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Chat_ChatList;


import { BiSearchAlt } from 'react-icons/bi';
import { SiAircall } from 'react-icons/si';
import { HiUserGroup } from 'react-icons/hi';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { HiMiniUser } from 'react-icons/hi2';

const Chat_ChatList = ({ chats, selectedChat, onChatSelect, chatWidth }) => {
  return (
    <div
      className="bg-white flex flex-col h-full overflow-hidden"
      style={{ width: chatWidth }}
    >
      {/* Header */}
      <div className="m-2 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-xl font-semibold">Chats</h1>
      </div>

      {/* Search Bar */}
      <div className="p-2 flex flex-col gap-2 border-b border-gray-200">
        <div className="relative flex items-center border border-gray-300 rounded-4xl">
          {/* Search Icon */}
          <div className="absolute left-4 cursor-pointer z-50">
            <BiSearchAlt size={24} />
          </div>
          {/* Input Field */}
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-12 p-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-4xl"
          />
        </div>
      </div>

      {/* Buttons below search bar */}
      <div className="p-2 flex gap-4 border-b border-gray-200 justify-evenly">
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100 group relative"
        >
          <SiAircall size={18} />
          {/* Tooltip */}
          <span className="absolute left-1/2 transform translate-x-4 bottom-6 bg-gray-300 text-black text-xs px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50" >
            All
          </span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100 group relative"
        >
          <HiMiniUser size={18} />
          {/* Tooltip */}
          <span className="absolute left-1/2 transform translate-x-4 bottom-6 bg-gray-300 text-black text-xs px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            Private
          </span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100 group relative"
        >
          <HiUserGroup size={18} />
          {/* Tooltip */}
          <span className="absolute left-1/2 transform  translate-x-4 bottom-6 bg-gray-300 text-black text-xs px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            Group Chat
          </span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl hover:bg-gray-100 group relative"
        >
          <AiOutlineUsergroupAdd size={18} />
          {/* Tooltip */}
          <span className="absolute left-1/2 transform -translate-2 bottom-6 bg-gray-300 text-black text-xs px-2 py-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
            Create Group
          </span>
        </button>
      </div>

      {/* Chats List */}
      <div
        className="overflow-y-auto flex-1"
        style={{
          scrollbarWidth: "thin",
          msOverflowStyle: "none",
        }}
      >
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`border-b border-gray-100 p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-100 ${
              selectedChat?.id === chat.id ? "bg-gray-200" : ""
            }`}
            onClick={() => onChatSelect(chat)}
          >
            <div className="flex-shrink-0">
              <img
                src={chat.image}
                alt={chat.name}
                className="w-10 h-10 border border-gray-200 rounded-full"
              />
            </div>
            <div className="flex-1">
              <p className="font-medium">{chat.name}</p>
              <p className="text-sm text-gray-500">{chat.type}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat_ChatList;
