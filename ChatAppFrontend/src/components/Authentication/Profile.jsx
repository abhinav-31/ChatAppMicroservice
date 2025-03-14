import toast from "react-hot-toast";
import { PiCameraThin, PiPencilSimple } from "react-icons/pi";
import { useNavigate } from "react-router";
import {
	saveUser,
	updateUser,
} from "../../services/UserSettingService/UserSettingServiceAuth";
import { useDispatch, useSelector } from "react-redux";
import { saveUserProfile } from "../../features/slice/userSlice";
import { useState } from "react";
import { useAuthFlow } from "../../constant/constants";

const ProfileForm = () => {
	const { setContext } = useAuthFlow();
	const savedProfile = useSelector((state) => state.user);
	const [formData, setFormData] = useState({
		username: savedProfile?.username || "",
		about: savedProfile?.about || "",
		profilePhoto: savedProfile?.profilePhoto || null,
	});
	const [isEditing, setIsEditing] = useState({
		username: false,
		about: false,
		profilePhoto: false,
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const imageUrl = formData.profilePhoto
		? `../../assets/${formData.profilePhoto}`
		: "";

	const handleCancelButton = () => {
		setFormData({
			username: savedProfile?.username || "",
			about: savedProfile?.about || "",
			profilePhoto: savedProfile?.profilePhoto || null,
		});
		setIsEditing({ username: false, about: false, profilePhoto: false });
		toast("Changes Cancelled");
	};

	const handleUsernameChange = (e) => {
		setFormData((prev) => ({ ...prev, username: e.target.value }));
		setIsEditing((prev) => ({ ...prev, username: true }));
	};

	const handleAboutChange = (e) => {
		setFormData((prev) => ({ ...prev, about: e.target.value }));
		setIsEditing((prev) => ({ ...prev, about: true }));
	};

	const handleImageChange = (e) => {
		if (e.target.files?.[0]) {
			const file = e.target.files[0];
			setFormData((prev) => ({ ...prev, profilePhoto: file.name }));
			setIsEditing((prev) => ({ ...prev, profilePhoto: true }));
		}
	};

	const handleSave = async () => {
		if (!formData.username) {
			toast.error("Username is required");
			return;
		}

		try {
			await toast.promise(
				savedProfile?.username
					? updateUser(formData)
					: saveUser(formData),
				{
					loading: "Saving...",
					success: savedProfile?.username
						? "Profile updated successfully"
						: "Profile Created Successfully",
					error: "Error saving user data",
				}
			);
			dispatch(saveUserProfile(formData));
			setIsEditing({
				username: false,
				about: false,
				profilePhoto: false,
			});
			if (!savedProfile?.username) {
				setContext("login");
				navigate("/login");
			}
		} catch (error) {
			toast.error(`Error: ${error.message}`);
		}
	};

	return (
		<div className='flex flex-col items-start justify-center bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg mx-auto mt-6 border border-gray-200'>
			<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
				Profile
			</h2>

			{/* Profile Image Editing */}
			<div className='relative w-28 h-28 mb-6 mx-auto'>
				<input
					type='file'
					id='profileImage'
					accept='image/*'
					className='hidden'
					onChange={handleImageChange}
				/>
				<label htmlFor='profileImage' className='cursor-pointer'>
					{/* Profile Image */}
					<div className='w-full h-full rounded-full border-2 border-gray-300 flex items-center justify-center overflow-hidden'>
						{formData.profilePhoto ? (
							<img
								src={`${imageUrl}`} // Make sure the image is in the public directory
								alt='Profile'
								className='w-full h-full object-cover'
							/>
						) : (
							<span className='text-gray-400 text-sm font-medium'>
								Upload
							</span>
						)}
					</div>
					<div className='absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full'>
						<PiCameraThin size={18} />
					</div>
				</label>
			</div>

			{/* Username Editing */}
			<div className='w-full mb-4 border-b border-gray-200'>
				<label className='text-lg ml-2 font-medium text-gray-700'>
					Your Name <span className='text-red-500'>*</span>
				</label>
				{isEditing.username ? (
					<input
						type='text'
						value={formData.username}
						onChange={handleUsernameChange}
						placeholder='Enter your name'
						className='w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
						required
					/>
				) : (
					<div className='flex justify-between items-center p-2 rounded-md'>
						<p className='text-gray-800'>
							{formData.username || "Enter your name"}
						</p>
						<PiPencilSimple
							size={18}
							className='cursor-pointer text-gray-500'
							onClick={() =>
								setIsEditing((prev) => ({
									...prev,
									username: true,
								}))
							}
						/>
					</div>
				)}
			</div>

			{/* About Editing */}
			<div className='w-full mb-6 border-b border-gray-200'>
				<label className='text-lg ml-2 font-medium text-gray-700'>
					About (optional)
				</label>
				{isEditing.about ? (
					<div
						contentEditable
						suppressContentEditableWarning={true}
						className='w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 min-h-[50px] max-h-[200px] overflow-y-auto resize-none'
						onChange={handleAboutChange}
					>
						{formData.about}
					</div>
				) : (
					<div className='flex justify-between items-center p-2 rounded-md'>
						<p className='text-gray-800'>
							{formData.about || "No description added"}
						</p>
						<PiPencilSimple
							size={18}
							className='cursor-pointer text-gray-500'
							onClick={() =>
								setIsEditing((prev) => ({
									...prev,
									about: true,
								}))
							}
						/>
					</div>
				)}
			</div>

			{/* Save and Cancel Buttons */}
			{isEditing.username && (
				<div className='flex w-full justify-between'>
					<button
						onClick={handleCancelButton}
						className='w-1/2 mr-2 py-2 bg-fuchsia-800 text-gray-600 font-semibold rounded-lg shadow-md hover:scale-105 cursor-pointer'
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className='w-1/2 ml-2 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:scale-105 cursor-pointer'
					>
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default ProfileForm;
