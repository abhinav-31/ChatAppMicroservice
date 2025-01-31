/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";

const LastSeenAndOnline = () => {
  const [lastSeenVisibility, setLastSeenVisibility] = useState("Everyone");
  const [onlineVisibility, setOnlineVisibility] = useState("Everyone");

  const handleVisibilityChange = (type, value) => {
    if (type === "lastSeen") {
      setLastSeenVisibility(value);
    } else {
      setOnlineVisibility(value);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 ">
        {/* Section 1: Who can see Last Seen */}
        <div>
          <p className="text-sm text-gray-600">Who can see Last Seen</p>
          <div className="flex flex-col  gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="Everyone"
                checked={lastSeenVisibility === "Everyone"}
                onChange={() => handleVisibilityChange("lastSeen", "Everyone")}
                className="mr-2"
              />
              Everyone
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="MyContacts"
                checked={lastSeenVisibility === "MyContacts"}
                onChange={() =>
                  handleVisibilityChange("lastSeen", "MyContacts")
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
                checked={lastSeenVisibility === "Nobody"}
                onChange={() => handleVisibilityChange("lastSeen", "Nobody")}
                className="mr-2"
              />
              Nobody
            </label>
          </div>
        </div>

        {/* Section 2: Who can see when I'm online */}
        <div className="mt-4">
          <p className="text-sm text-gray-600">Who can see when I'm online</p>
          <div className="flex flex-col  gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="online"
                value="Everyone"
                checked={onlineVisibility === "Everyone"}
                onChange={() => handleVisibilityChange("online", "Everyone")}
                className="mr-2"
              />
              Everyone
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="online"
                value="MyContacts"
                checked={onlineVisibility === "MyContacts"}
                onChange={() => handleVisibilityChange("online", "MyContacts")}
                className="mr-2"
              />
              My Contacts
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="online"
                value="Nobody"
                checked={onlineVisibility === "Nobody"}
                onChange={() => handleVisibilityChange("online", "Nobody")}
                className="mr-2"
              />
              Nobody
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LastSeenAndOnline;
