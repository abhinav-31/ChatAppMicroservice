/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createGroupChat } from "../../features/slice/groupChatSlice";
import { addChat } from "../../features/slice/chatListSlice";
import { useWebSocketContext } from "../../constant/constants";
import toast from "react-hot-toast";
import { FaTimes } from "react-icons/fa";


const CreateGroupModal = ({ createGroupClicked, setCreateGroupClicked, chatWidth }) => {
    const { sendGroupNotification } = useWebSocketContext();
    const dispatch = useDispatch();
    const { senderId } = useSelector((state) => state.user);
    const { contacts } = useSelector((state) => state.contacts);

    const [groupName, setGroupName] = useState("");
    const [groupImage, setGroupImage] = useState(null);
    const [groupMember, setGroupMember] = useState([]);
    const [addMembersButtonClicked, setAddMembersButtonClicked] = useState(false);

    const modalRef = useRef(null);
    const addButtonRef = useRef(null);
    const dropdownRef = useRef(null); // Ref for dropdown
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });



    useEffect(() => {
        if (addButtonRef.current && addMembersButtonClicked) {
            const rect = addButtonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY,
                left: rect.left + window.scrollX,
            });
        }
    }, [addMembersButtonClicked]);

    const toggleMember = (contact) => {
        setGroupMember((prev) => {
            if (prev.some((m) => m.receiverId === contact.receiverId)) {
                toast.success(`${contact.contactName} removed from group`);
                return prev.filter((m) => m.receiverId !== contact.receiverId);
            }
            toast.success(`${contact.contactName} added to ${groupName}`);
            return [...prev, contact];
        });
    };

    const handleCreateButton = async () => {
        const groupMembersList = groupMember.map((grpM) => grpM.receiverId);
        groupMembersList.push(senderId);
        const groupMetaData = {
            groupName,
            groupAdmin: senderId,
            members: groupMembersList,
        };
        try {
            const resultAction = await dispatch(createGroupChat(groupMetaData)).unwrap();
			const { groupId, groupName } = resultAction;
            dispatch(
                addChat({
                    chat: {
                        id: groupId,
                        name: groupName,
                        profilePhoto: groupImage || "gimg.img",
                        latestMessage: "",
                        type: "group",
                    },
                })
            );
            toast.success(`Group ${groupName} Created Successfully!`);
            sendGroupNotification("/app/group-add", resultAction);
            setCreateGroupClicked(false);
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setGroupImage(reader.result);
            reader.readAsDataURL(file);
        }
    };

    return (
		<>
			{/* Modal */}
			{createGroupClicked && (
				<div
					ref={modalRef}
					className='absolute top-[18%] right-1 bg-white p-6 rounded-xl shadow-2xl border border-gray-200 transition-all duration-700 z-50 max-h-[80vh] overflow-y-auto overflow-x-hidden'
					style={{ width: chatWidth }}
					onClick={(e)=> e.stopPropagation()}
				>
					<div className='mb-4 border-b border-gray-200 pb-2'>
						<h2 className='text-xl font-semibold text-gray-800'>
							New Group
						</h2>
					</div>
					<div className='flex items-center gap-4 mb-4 w-full'>
						<label className='cursor-pointer flex-shrink-0'>
							<img
								src={groupImage || "default-group.png"}
								alt='Group Profile'
								className='w-12 h-12 rounded-full border border-gray-300 object-cover hover:opacity-80 transition-opacity'
							/>
							<input
								type='file'
								accept='image/*'
								className='hidden'
								onChange={handleImageChange}
							/>
						</label>
						<input
							type='text'
							placeholder='Enter Group Name...'
							value={groupName}
							onChange={(e) => { setGroupName(e.target.value) }}
							className='w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all duration-200'
						/>
					</div>
					<div className='space-y-2 mb-4'>
						{groupMember.map((member) => (
							<div
								key={member.receiverId}
								className='flex items-center justify-between bg-gray-100 p-2 rounded-lg w-full hover:bg-gray-200 transition-colors duration-200'
							>
								<div className='flex items-center gap-2 truncate'>
									<img
										src={member.profilePhoto}
										alt='Profile'
										className='w-8 h-8 rounded-full border border-gray-200 flex-shrink-0'
									/>
									<span className='text-gray-700 truncate'>
										{member.contactName}
									</span>
								</div>
								<button
									onClick={() => toggleMember(member)}
									className='text-red-500 hover:text-red-700 transition-colors duration-200 flex-shrink-0 ml-2'
								>
									<FaTimes size={16} />
								</button>
							</div>
						))}
					</div>
					<div>
						<button
							ref={addButtonRef}
							className='w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-lg py-2 px-4 hover:from-cyan-500 hover:to-blue-600 transition-all duration-200'
							onClick={(e) => {
								e.stopPropagation();
								setAddMembersButtonClicked((prev) => !prev)
							}}
						>
							Add Members
						</button>
					</div>
					{groupName && (
						<div className='flex justify-between gap-4 mt-6'>
							<button
								onClick={() => {
									setGroupName("");
									setGroupMember([]);
									setCreateGroupClicked(false);
								}}
								className='flex-1 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg py-2 hover:from-pink-600 hover:to-pink-700 transition-all duration-200 cursor-pointer'
							>
								Cancel
							</button>
							<button
								disabled={!groupName}
								onClick={handleCreateButton}
								className='flex-1 bg-gradient-to-r from-green-700 via-green-500 to-green-700 text-white rounded-lg py-2 disabled:opacity-50 hover:from-green-500 hover:to-green-600 transition-all duration-200 cursor-pointer'
							>
								Create
							</button>
						</div>
					)}
				</div>
			)}

			{/* Dropdown Outside Modal */}
			{addMembersButtonClicked && (
				<div
					ref={dropdownRef}
					className='fixed bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[60] p-2 overflow-x-hidden'
					style={{
						width: chatWidth,
						top: `${dropdownPosition.top}px`,
						left: `${dropdownPosition.left}px`,
					}}
					onClick={(e)=> e.stopPropagation()}
				>
					{groupMember.length > 0 && (
						<button
							className='w-full bg-blue-500 text-white rounded-lg py-1 mb-2 hover:bg-blue-600 transition-colors duration-200'
							onClick={() => setAddMembersButtonClicked(false)}
						>
							Done
						</button>
					)}
					{contacts.map((contact) => {
						const isSelected = groupMember.some(
							(m) => m.receiverId === contact.receiverId
						);
						return (
							<div
								key={contact.receiverId}
								className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
									isSelected
										? "bg-green-100 hover:bg-green-200"
										: "hover:bg-gray-100"
								}`}
								onClick={() => toggleMember(contact)}
							>
								<div className='flex items-center gap-2 truncate'>
									<img
										src={contact.profilePhoto}
										alt='Profile'
										className='w-8 h-8 rounded-full border border-gray-200 flex-shrink-0'
									/>
									<span className='text-gray-700 truncate'>
										{contact.contactName}
									</span>
								</div>
								{isSelected && (
									<button className='text-red-500 hover:text-red-700 flex-shrink-0 ml-2'>
										<FaTimes size={14} />
									</button>
								)}
							</div>
						);
					})}
				</div>
			)}
		</>
	);
};

export default CreateGroupModal;