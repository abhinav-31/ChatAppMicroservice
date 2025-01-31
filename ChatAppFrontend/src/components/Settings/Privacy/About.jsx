import { useState } from "react";


const About = () => {

     const [aboutVisibility, setAboutVisibility] = useState("Everyone");
     
    
      const handleVisibilityChange = (type, value) => {
        if (type === "about") {
            setAboutVisibility(value);
        }
      };
  return (
    <div className="flex flex-col h-full">
        <div className="p-4 ">
        {/* Section 1: Who can see Last Seen */}
        <div>
          <p className="text-sm text-gray-600">Who can see about</p>
          <div className="flex flex-col  gap-4 mt-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="Everyone"
                checked={aboutVisibility === "Everyone"}
                onChange={() => handleVisibilityChange("about", "Everyone")}
                className="mr-2"
              />
              Everyone
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="lastSeen"
                value="MyContacts"
                checked={aboutVisibility === "MyContacts"}
                onChange={() =>
                  handleVisibilityChange("about", "MyContacts")
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
                checked={aboutVisibility === "Nobody"}
                onChange={() => handleVisibilityChange("about", "Nobody")}
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

export default About;