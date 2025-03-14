/* eslint-disable react/prop-types */

import { useSelector } from "react-redux";
import { useBackdropContext } from "../../constant/constants";

const ContactListModal = ({
	handleSelectContact
}) => {
	const {
		showContacts,
		setShowContacts,
		setAddContactClicked,
		addContactClicked,
	} = useBackdropContext();
	const { contacts } = useSelector(state => state.contacts);
	return (
		<>
			{showContacts && (
				<div
					className='absolute bottom-20 right-4 bg-white p-4 rounded-lg shadow-lg w-64 border border-gray-200 transition z-50 max-h-[500px] overflow-y-auto'
					style={{
						scrollbarWidth: "thin", 
						msOverflowStyle: "none",
						borderBlockEnd: "rounded",
					}}
				>
					{/* Add Contact Button */}
					<button
						className='w-full bg-gradient-to-r from-green-500 via-green-300 to-green-500 text-blue-950 py-2 rounded-lg hover:bg-blue-600 transition cursor-pointer'
						onClick={(e) => {
							e.stopPropagation();
							setAddContactClicked(!addContactClicked);
							setShowContacts(!showContacts);
						}}
					>
						Add Contact
					</button>

					{/* Show contact list only if contacts exist */}
					{contacts.length > 0 ? (
						<>
							<h3 className='text-lg font-semibold mb-2 mt-3'>
								Select Contact
							</h3>
							<ul>
								{contacts.map((contact,index) => (
									<li
										key={index}
										className='flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer'
										onClick={() =>
											handleSelectContact(contact.receiverId)
										}
									>
										<img
											src={contact.profilePhoto}
											alt={contact.profilePhoto}
											className='w-8 h-8 rounded-full mr-2'
										/>
										<span className='h-8 border-b text-black border-gray-200'>
											{contact.contactName}
										</span>
									</li>
								))}
							</ul>
						</>
					) : (
						<p className='text-center text-gray-500 text-sm mt-2'>
							No contacts added yet.
						</p>
					)}

					{/* Cancel Button */}
					<button
						className='mt-2 w-full text-center text-sm text-gray-500 hover:text-gray-700'
						onClick={() => setShowContacts(false)}
					>
						Cancel
					</button>
				</div>
			)}
		</>
	);
};

export default ContactListModal;