import { useState } from "react";
import toast from "react-hot-toast";

const PhoneNumber = () => {
  const [isConfirm, setIsConfirm] = useState(false);
  const [currentNumber, setCurrentNumber] = useState("8529637410");
  const [newNumber, setNewNumber] = useState("");
  const [isNumberComplete, setIsNumberComplete] = useState(false);
  const countryCode = "+91";

  const handleNumberInput = (e)=>{
      const value = e.target.value.replace(/\D/g,"");
      if(value.length <=10){
        setNewNumber(value);
        setIsNumberComplete(value.length === 10);
      }
      
  }
  const handleConfirm = () => setIsConfirm(true);
  const handleCancel = () => setIsConfirm(false);

  const handleSave = () => {
    console.log("New phone number:", countryCode + newNumber);
    setIsConfirm(false);
    setNewNumber("");
    setIsNumberComplete(!isNumberComplete);
    toast.success("New Phone number: "+countryCode+newNumber);

  };

  return (
    <div className="flex flex-col h-full">
      

      {/* Content */}
      <div className="p-6 flex-1 overflow-y-auto">
        {!isConfirm ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-gray-600">
                Changing your phone number will migrate your account info, groups & settings.
              </p>
              <p className="text-gray-600">
                Before proceeding, please confirm that you are able to receive SMS.
              </p>
            </div>
            <button
              className="w-full bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              onClick={handleConfirm}
            >
              Next
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-gray-600 font-medium">Registered Phone Number</p>
                <div className="flex items-center gap-4">
                  <div className="border-b border-gray-200 py-2">
                    <span className="text-gray-500">{countryCode}</span>
                  </div>
                  <div className="flex-1 border-b border-gray-200 py-2">
                    <input
                      type="tel"
                      value={currentNumber}
                      onChange={(e) => setCurrentNumber(e.target.value.replace(/\D/g, ''))}
                      className="w-full outline-none"
                      placeholder="Enter current number"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-gray-600 font-medium">New Phone Number</p>
                <div className="flex items-center gap-4">
                  <div className="border-b border-gray-200 py-2">
                    <span className="text-gray-500">{countryCode}</span>
                  </div>
                  <div className="flex-1 border-b border-gray-200 py-2">
                    <input
                      type="tel"
                      value={newNumber}
                      onChange={(e)=> handleNumberInput(e)  }
                      className="w-full outline-none"
                      placeholder="Enter new number"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isNumberComplete}
                className={`flex-1 px-4 py-2 rounded-lg ${
                  isNumberComplete 
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PhoneNumber;