/* eslint-disable react/prop-types */
const MessageBubble = ({ message, isSender, isFirstSender, isFirstReceiver }) => (
    <div className={`flex gap-3 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`p-2 max-w-xs rounded-lg ${
          isSender ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        } ${
          isSender && isFirstSender ? "rounded-br-none rounded-br-custom" : ""
        } ${
          !isSender && isFirstReceiver ? "rounded-bl-none rounded-bl-custom" : ""
        }`}
      >
        {message.text}
      </div>
    </div>
  );

  export default MessageBubble;