/* eslint-disable react/prop-types */

const MessageBubble = ({
	message,
	isSender,
	isFirstSender,
	isFirstReceiver,
	timestamp,
	chatType,
}) => {
	//   Extract time from timestamp (format: "2025-02-18T14:17:21.608" → "14:17")
	const formattedTime = timestamp ? timestamp.split("T")[1].slice(0, 5) : "";

	//   Determine checkmark styles for private messages
	let checkmark = null;
	if (chatType === "private" && isSender) {
		if (message.readTime) {
			checkmark = (
				<span className='ml-1'>
					<img src='check-read.svg' alt='✔✔' />
				</span>
			);
		} else if (message.deliveredTime) {
			checkmark = (
				<span className='ml-1'>
					<img src='check-read-svgrepo-com.svg' alt='✔✔' />
				</span>
			); //   Double Check (Delivered, Gray)
		} else if (message.sentTime) {
			checkmark = <span className='ml-1 text-gray-500'>✓</span>; //   Single Check (Sent)
		}
	}

	return (
		<div
			className={`flex gap-3 ${
				isSender ? "justify-end" : "justify-start"
			} items-end`}
		>
			<div
				className={`flex flex-col gap-1 justify-end relative p-3 max-w-auto rounded-lg shadow-md ${
					isSender
						? "bg-gradient-to-br from-cyan-200"
						: "bg-gradient-to-tr to-fuchsia-100 text-black border border-gray-300"
				} ${
					isSender && isFirstSender
						? "rounded-br-none"
						: !isSender && isFirstReceiver
						? "rounded-bl-none"
						: ""
				}`}
				style={{
					paddingBottom: "18px",
					minWidth: "80px", //   Ensures bubble doesn't shrink too much
					maxWidth: "65%",
				}} //   Adds space for timestamp
			>
				
				{/*   Show sender name for group messages */}
				{chatType === "group" && !isSender && (
					<p className='text-xs font-semibold text-gray-500'>
						{message.sender.substring(0, 8)}
					</p>
				)}
				{/*   Message Content */}
				<p className='pb-1'>{message.content}</p>{" "}
				{/*   Adds a small gap above the timestamp */}
				{/*   Timestamp Inside Bubble (Bottom-Right) */}
				<div className='absolute bottom-1 right-2 text-xs flex items-center gap-1'>
					<span
						className={
							isSender
								? "bg-gradient-to-r from-red-600 via-blue-900 to-cyan-800 bg-clip-text text-transparent"
								: "bg-gradient-to-r from-cyan-600 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent"
						}
					>
						{formattedTime}
					</span>
					{checkmark} {/*   Show checkmarks for private messages */}
				</div>
			</div>
		</div>
	);
};

export default MessageBubble;
