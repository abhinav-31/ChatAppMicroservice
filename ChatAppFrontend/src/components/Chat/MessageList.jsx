/* eslint-disable react/prop-types */
import MessageBubble from "./MessageBubble";

const MessageList = ({ messages,handleWrapperClick }) => (
    <div className="flex-1 p-4 flex flex-col-reverse overflow-auto" style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }} onClick={handleWrapperClick}>
      <div className="space-y-1">
        {messages.map((message, index) => {
          const isSender = message.sender === "me";
          const isFirstSender = index === 0 || messages[index - 1].sender !== "me";
          const isFirstReceiver = index === 0 || messages[index - 1].sender !== "other";
  
          return (
            <MessageBubble
              key={index}
              message={message}
              isSender={isSender}
              isFirstSender={isFirstSender}
              isFirstReceiver={isFirstReceiver}
            />
          );
        })}
      </div>
    </div>
  );

  export default MessageList;