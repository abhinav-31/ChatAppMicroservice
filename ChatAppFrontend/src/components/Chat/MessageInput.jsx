/* eslint-disable react/prop-types */
import TextareaAutosize from "react-textarea-autosize";
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
	fileInputRef,
	chat,
}) => {
	const handleKeyDown = (e) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	};

	return (
		<div
			className='flex relative items-center p-3 bg-white' //   Parent remains relative for absolute positioning
			onClick={handleWrapperClick}
		>
			{/* file picker */}
			<div className=' '>
				<div className='absolute bottom-5 '>
					<BsPaperclip
						className='text-gray-600 text-3xl cursor-pointer hover:text-blue-500'
						onClick={(e) => {
							e.stopPropagation();
							setShowAttachmentOptions((prev) => !prev)
						}}
					/>
				</div>
				{showAttachmentOptions && (
					<div className='absolute bottom-18 left-2 bg-white shadow-lg rounded-lg z-50'>
						<ul className='text-left'>
							{[
								"Document",
								"Photo",
								"Audio",
								"Location",
								"Video",
							].map((type) => (
								<li
									key={type}
									className='p-2 hover:bg-gray-100 cursor-pointer'
									onClick={() => openFilePicker(type)}
								>
									{type}
								</li>
							))}
						</ul>
					</div>
				)}

				<input
					id='file-input'
					type='file'
					className='hidden'
					onChange={handleFileSelect}
					ref={fileInputRef}
				/>
			</div>
			<div className='relative flex-1 flex flex-col-reverse ml-7 '>
				<div className='relative flex-grow items-center'>
					<div className='border border-gray-200 rounded-md p-2 bg-white pr-12 pl-10 pb-0.5'>
	
						<TextareaAutosize			value={message}
							onChange={(e) => setMessage(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder='Enter your msg...'
							minRows={1}
							maxRows={6}
							className='w-full border-none focus:outline-none resize-none overflow-y-auto'
						/>
					</div>
				</div>
			</div>
			{/* emoji picker */}
			<div className='absolute left-12 bottom-5'>
				<GrEmoji
					className='text-xl text-gray-600 cursor-pointer hover:text-blue-500'
					onClick={(e) => { e.stopPropagation(); setShowEmojiPicker((prev) => !prev); }}
					size={30}
				/>
			</div>

			{/* send button */}
			<div className='absolute right-4 bottom-3'>
				<button disabled={!chat || message.length === 0}>
					<IoMdSend
						size={30}
						onClick={() => chat && sendMessage()}
						className='text-cyan-700 cursor-pointer'
					/>
				</button>
			</div>
		</div>
	);
};

export default MessageInput;