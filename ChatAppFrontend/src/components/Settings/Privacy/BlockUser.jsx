// import { useState } from "react";
// import { MdPersonRemoveAlt1 } from "react-icons/md";

// const BlockUser = () => {
//   const [blockedUserList, setBlockedUserList] = useState([]);
//   const [showContacts, setShowContacts] = useState(false);

//   const userContactList = [
//     { name: "Abhinav", phoneNumber: 8523697410 },
//     { name: "Abhilash", phoneNumber: 8523697411 },
//   ];

//   const handleBlockUser = (user) => {
//     setBlockedUserList([...blockedUserList, user]);
//     setShowContacts(false); // Close the contact list after selection
//   };

//   const handleRemoveBlockedUser = (user)=>{
//     setBlockedUserList(blockedUserList.filter((blockedUserList)=>!blockedUserList.phoneNumber !=user.phoneNumber))
//   }

//   return (
//     <div className="flex flex-col h-full p-4">
//       <h2 className="text-lg font-bold">Blocked Users</h2>

//       {/* Blocked Users List */}
//       <ul className="mt-4 space-y-2">
//         {blockedUserList.map((user, index) => (
//           <li key={index} className="p-2 flex items-center bg-gray-200 rounded-md">
//             {user.name} - {user.phoneNumber}
//             <MdPersonRemoveAlt1 className="curson-pointer ml-auto"  onClick={()=> handleRemoveBlockedUser(user)} />
//           </li>
//         ))}
//       </ul>

//       {/* Button to Open Contact List */}
//       <button
//         onClick={() => setShowContacts(!showContacts)}
//         className="mt-4 w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-md right-4"
//       >
//         +
//       </button>

//       {/* Contact List Box */}
//       {showContacts && (
//         <div className="absolute top-20 left-4 bg-white shadow-lg rounded-lg p-4 w-64">
//           <h3 className="text-md font-semibold mb-2">Select User to Block</h3>
//           <ul className="space-y-2">
//             {userContactList.map((user) => (
//               <li
//                 key={user.phoneNumber}
//                 className="p-2 bg-gray-100 rounded-md cursor-pointer hover:bg-gray-300"
//                 onClick={() => handleBlockUser(user)}
//               >
//                 {user.name} - {user.phoneNumber}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//     </div>
//   );
// };

// export default BlockUser;
import { useState } from "react";
import { MdPersonRemoveAlt1 } from "react-icons/md";
import ReactImage from '../../../assets/react.svg'

const BlockUser = () => {
  const [blockedUserList, setBlockedUserList] = useState([]);
  const [showContacts, setShowContacts] = useState(false);

  const userContactList = [
    { name: "Abhinav", phoneNumber: 8523697410, image: ReactImage },
    { name: "Abhilash", phoneNumber: 8523697411, image: ReactImage },
  ];

  const handleBlockUser = (user) => {
    // Check if the user is already blocked
    if (
      !blockedUserList.some(
        (blockedUser) => blockedUser.phoneNumber === user.phoneNumber
      )
    ) {
      setBlockedUserList([...blockedUserList, user]);
      setShowContacts(false); // Close the contact list after selection
    }
  };

  const handleRemoveBlockedUser = (user) => {
    setBlockedUserList(
      blockedUserList.filter(
        (blockedUser) => blockedUser.phoneNumber !== user.phoneNumber
      )
    );
  };

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-lg font-bold">Blocked Users</h2>

      {/* Blocked Users List */}
      <ul className="mt-4 space-y-2">
        {blockedUserList.map((user, index) => (
          <li
            key={index}
            className="p-2 flex items-center bg-gray-200 rounded-md"
          >
            {user.name} - {user.phoneNumber}
            <MdPersonRemoveAlt1
              className="cursor-pointer ml-auto"
              onClick={() => handleRemoveBlockedUser(user)}
            />
          </li>
        ))}
      </ul>

      {/* Button to Open Contact List (Aligned to the right) */}
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => setShowContacts(!showContacts)}
          className="w-10 h-10 bg-blue-500 text-white flex items-center justify-center rounded-md"
        >
          +
        </button>
      </div>

      {/* Contact List Box */}
      {showContacts && (
        <div className="flex flex-col top-20 left-4 bg-white shadow-lg rounded-lg p-4 w-64">
          <h3 className="text-md font-semibold mb-2">Select User to Block</h3>
          <ul className="space-y-2">
            {userContactList.map((user) => (
              <li
                key={user.phoneNumber}
                className={`p-2 border-b flex flex-row items-center border-gray-200 rounded-md hover:bg-gray-300 ${
                  blockedUserList.some(
                    (blockedUser) =>
                      blockedUser.phoneNumber === user.phoneNumber
                  )
                    ? "text-black bg-gray-400 cursor-not-allowed"
                    : "cursor-pointer"
                }`}
                onClick={() => handleBlockUser(user)}
              >
                <img
                  src={user.image}
                  alt="userImage"
                  className="w-5 h-5 rounded-full border-gray-200"
                />
                <div className="ml-5">
                  {user.name} - {user.phoneNumber}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BlockUser;
