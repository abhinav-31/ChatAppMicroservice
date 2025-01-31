import { useState } from "react";


const ProfilePhotos = () => {

     const [profilePhotoVisibility, setProfilePhotoVisibility] = useState("Everyone");
     
    
      const handleVisibilityChange = (type, value) => {
        if (type === "profilePhoto") {
          setProfilePhotoVisibility(value);
        }
      };
  return (
    <div className="flex flex-col h-full">
        <div className="p-4 ">
        {/* Section 1: Who can see Last Seen */}
        <div>
          <p className="text-sm text-gray-600">Who can see my profile photo</p>
          <div className="flex flex-col  gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="Everyone"
                checked={profilePhotoVisibility === "Everyone"}
                onChange={() => handleVisibilityChange("profilePhoto", "Everyone")}
                className="mr-2"
              />
              Everyone
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="MyContacts"
                checked={profilePhotoVisibility === "MyContacts"}
                onChange={() =>
                  handleVisibilityChange("profilePhoto", "MyContacts")
                }
                className="mr-2"
              />
              My Contacts
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="Nobody"
                checked={profilePhotoVisibility === "Nobody"}
                onChange={() => handleVisibilityChange("profilePhoto", "Nobody")}
                className="mr-2"
              />
              Nobody
            </label>
          </div>
        </div>
        </div>
        </div>
  )
}

export default ProfilePhotos;