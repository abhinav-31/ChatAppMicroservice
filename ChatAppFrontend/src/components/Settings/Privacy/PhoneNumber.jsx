import { useState } from "react";


const PhoneNumber = () => {

     const [phoneNumberVisibility, setPhoneNumberVisibility] = useState("Everyone");
     
    
      const handleVisibilityChange = (type, value) => {
        if (type === "phoneNumber") {
          setPhoneNumberVisibility(value);
        }
      };
  return (
    <div className="flex flex-col h-full">
        <div className="p-4 ">
        {/* Section 1: Who can see Last Seen */}
        <div>
          <p className="text-sm text-gray-600">Who can see my phone number</p>
          <div className="flex flex-col  gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="Everyone"
                checked={phoneNumberVisibility === "Everyone"}
                onChange={() => handleVisibilityChange("phoneNumber", "Everyone")}
                className="mr-2"
              />
              Everyone
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="MyContacts"
                checked={phoneNumberVisibility === "MyContacts"}
                onChange={() =>
                  handleVisibilityChange("phoneNumber", "MyContacts")
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
                checked={phoneNumberVisibility === "Nobody"}
                onChange={() => handleVisibilityChange("phoneNumber", "Nobody")}
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

export default PhoneNumber;