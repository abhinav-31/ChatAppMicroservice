/* eslint-disable react/prop-types */

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveContact } from "../../services/UserSettingService/UserSettingServiceAuth";
import { addContact } from "../../features/slice/contactSlice";
import toast from "react-hot-toast";
import { updateChatListForUnknownContact } from "../../features/slice/chatListSlice";
import { useBackdropContext } from "../../constant/constants";

const AddContact = () => {
	const { addContactClicked, setAddContactClicked } = useBackdropContext();
	const dispatch = useDispatch();
	const contacts = useSelector((state) => state.contacts.contacts);
	const { chatList } = useSelector((state) => state.chatLists);

	const [contactName, setContactName] = useState("");
	const [contactPhoneNumber, setContactPhoneNumber] = useState("");
	const [isChecking, setIsChecking] = useState(false);
	const isContactExist = useRef(false);

	// Run contact existence check only when phone number is fully entered (10 digits)
	const contactsRef = useRef(contacts); // Store initial contacts reference

	useEffect(() => {
		if (contactPhoneNumber.length === 10) {
			setIsChecking(true);

			const formattedNumber = contactPhoneNumber.startsWith("+91")
				? contactPhoneNumber
				: `+91${contactPhoneNumber}`;

			// Use contactsRef.current instead of contacts (prevents re-execution on Redux updates)
			const exists = contactsRef.current.some(
				(contact) => contact.phoneNumber === formattedNumber
			);

			isContactExist.current = exists;
			setIsChecking(false);
		} else {
			isContactExist.current = false;
		}
	}, [contactPhoneNumber]);
	// Handle saving the contact
	const handleContactSaved = async () => {
		if (!contactName || contactPhoneNumber.length !== 10) {
			toast.error("Invalid contact details.");
			return;
		}

		try {
			const formattedNumber = contactPhoneNumber.startsWith("+91")
				? contactPhoneNumber
				: `+91${contactPhoneNumber}`;

			const addContactData = {
				contactName,
				contactPhoneNumber: formattedNumber,
			};

			const response = await saveContact(addContactData);
			const newContact = response.data;

			// Reset local state before updating Redux to prevent isContactExist from being set to true
			setContactName("");
			setContactPhoneNumber("");

			// Check if contact was previously "Unknown Contact" in chat list
			const receiverId = newContact.receiverId;
			const isContactExistInChatListAsUnknown =
				chatList[receiverId] &&
				chatList[receiverId].name === "Unknown Contact";

			if (isContactExistInChatListAsUnknown) {
				dispatch(updateChatListForUnknownContact(newContact));
			}
			// Add contact to Redux store
			dispatch(addContact(newContact));

			toast.success(
				`Contact ${newContact.contactName} added successfully.`
			);
			setAddContactClicked(false);
		} catch {
			toast.error("Contact not added.");
		}
	};

	return (
		<>
			{addContactClicked && (
				<div
					className='absolute top-[28%]  right-3 bg-white p-4 rounded-lg shadow-lg w-74 border border-gray-200 transition z-50 max-h-[500px] overflow-y-auto'
					onClick={(e) => e.stopPropagation()}
				>
					<div className=' mb-2 flex justify-between items-center border-b border-gray-200'>
						<h2 className='text-xl font-semibold'>Add Contact</h2>
					</div>
					{/* Show warning message if contact exists */}
					{isContactExist.current && (
						<div className='bg-red-100 border border-red-400 text-red-700 px-2 py-2 rounded-md mb-3'>
							<p className='font-medium'>
								Contact already exists.
							</p>
							<p>Enter different phone no.</p>
						</div>
					)}
					<div className='flex flex-col mb-2'>
						<label
							className='text-base font-medium text-gray-700 sm:text-lg'
							htmlFor='name'
						>
							Name
						</label>
						<input
							type='text'
							id='name'
							placeholder='Enter contact name'
							value={contactName}
							onChange={(e) => {
								e.stopPropagation();
								setContactName(e.target.value);
							}}
							className='w-full p-2 border border-gray-300 rounded-lg sm:p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
						/>
					</div>
					<div className='flex flex-col mb-4'>
						<label
							className='text-base font-medium text-gray-700 sm:text-lg'
							htmlFor='phone'
						>
							Phone Number
						</label>
						<input
							type='tel'
							id='phone'
							placeholder='Enter phone number'
							value={contactPhoneNumber}
							onChange={(e) => {
								e.stopPropagation();
								setContactPhoneNumber(e.target.value);
							}}
							className='w-full p-2 border border-gray-300 rounded-lg sm:p-3 focus:outline-none focus:ring-2 focus:ring-cyan-500'
						/>
					</div>
					{contactName &&
						contactPhoneNumber.length === 10 &&
						!isContactExist.current && (
							<div className='flex flex-col'>
								<button
									className='w-full bg-gradient-to-r from-green-500 via-green-300 to-green-500 text-blue-950 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer'
									onClick={handleContactSaved}
								>
									{isChecking ? "Checking..." : "Save"}
								</button>
							</div>
						)}
				</div>
			)}
		</>
	);
};

export default AddContact;
