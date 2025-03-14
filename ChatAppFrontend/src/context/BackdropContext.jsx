/* eslint-disable react/prop-types */
import { createContext, useMemo, useState } from "react";

// Create context
const BackdropContext = createContext();

// ModalProvider component
export const BackdropProvider = ({ children }) => {
	const [showContacts, setShowContacts] = useState(false);
	const [addContactClicked, setAddContactClicked] = useState(false);
	const [createGroupOpen, setCreateGroupOpen] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);
	const [showEmojiPicker, setShowEmojiPicker] = useState(false);
	const [createGroupClicked, setCreateGroupClicked] = useState(false);
	// Close all modals and menus
	const closeAll = () => {
		setShowContacts(false);
		setAddContactClicked(false);
		setCreateGroupOpen(false);
		setIsDropdownOpen(false);
		setShowAttachmentOptions(false);
		setShowEmojiPicker(false);
		setCreateGroupClicked(false);
	};

	const contextValue = useMemo(
		() => ({
			showContacts,
			setShowContacts,
			addContactClicked,
			setAddContactClicked,
			createGroupOpen,
			setCreateGroupOpen,
			isDropdownOpen,
			setIsDropdownOpen,
			showAttachmentOptions,
			setShowAttachmentOptions,
			showEmojiPicker,
			setShowEmojiPicker,
			createGroupClicked,
			setCreateGroupClicked,
			closeAll,
		}),
		[
			showContacts,
			addContactClicked,
			createGroupOpen,
			isDropdownOpen,
			showAttachmentOptions,
			showEmojiPicker,
			createGroupClicked,
		]
	);

	return (
		<BackdropContext.Provider value={contextValue}>
			{children}
		</BackdropContext.Provider>
	);
};

export default BackdropContext;