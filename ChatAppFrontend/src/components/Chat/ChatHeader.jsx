/* eslint-disable react/prop-types */

import { RxHamburgerMenu } from "react-icons/rx";

const ChatHeader = ({
	chat,
  toggleDropdown,
  isDropdownOpen,
  setIsDropdownOpen,
  messages,
  handleDeleteChat,
  handleCloseChat
}) => { 
  const handleClearChat = ()=>{
    messages.splice(0,messages.length);
  }
 return (
		<div className='p-2 h-[8%] bg-gradient-to-r from-indigo-200  via-cyan-50 to-blue-200 flex items-center gap-4'>
			<img
				src={chat?.profilePhoto || chat?.contactProfilePhoto}
				alt={chat?.profilePhoto || chat?.contactProfilePhoto}
				className='w-14 h-14 ml-3 rounded-full border border-gray-400 object-cover'
			/>
			<h2 className='text-lg font-bold'>
				{chat?.name || chat?.contactName}
			</h2>
			<div
				className='ml-auto cursor-pointer flex flex-col justify-center items-center space-y-2'
				onClick={(e) => {
					e.stopPropagation();
					toggleDropdown();
				}}
				style={{
					width: "30px",
					height: "30px",
					transition: "transform 0.1s ease",
				}}
			>
				<RxHamburgerMenu
					size={30}
					className={`hover:text-fuchsia-500 transition-all duration-100 ease-in-out ${
						isDropdownOpen ? "transform -rotate-90" : ""
					}`}
				/>
			</div>
			{isDropdownOpen && (
				<div className='absolute z-50 top-16 right-4 w-fit bg-white shadow-lg rounded-lg'>
					<ul className='text-left'>
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
								className='p-2 hover:bg-gray-100 cursor-pointer'
								onClick={() => {
									if (option === "Clear chat") {
										handleClearChat();
									}
									if (option === "Delete chat") {
										handleDeleteChat();
									}
									if (option === "Close chat") {
										handleCloseChat();
									}
									setIsDropdownOpen(false);
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
