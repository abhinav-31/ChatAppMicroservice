
import axios from "axios";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { IoIosArrowDropdown } from "react-icons/io";
import CountryCodes from "../../../assets/countrycodes/CountryCodes.json";
import Modal from "./Modal"; // Reusable Modal component

const DeleteAccount = () => {
  const [countries] = useState(CountryCodes);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");


  const dropdownRef = useRef(null);

  const handleWrapperClick = (e) => {
    // Check if click occurred outside the dropdown container
    if (!dropdownRef.current?.contains(e.target)) {
      setIsDropdownOpen(false);
    }
  };

  // Filter countries based on search term
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );

 

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const confirmDeletion = async () => {
    if (!selectedCountry?.dial_code || phoneNumber.length !== 10) return;

    setIsLoading(true);
    try {
      await axios.delete("/api/account", {
        data: {
          countryCode: selectedCountry.dial_code,
          phoneNumber: phoneNumber,
        },
      });
      toast.success(
        "Account deletion initiated. Check your phone for confirmation."
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Account deletion failed");
    } finally {
      setIsLoading(false);
      setShowConfirmation(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4" onClick={handleWrapperClick}>
      {/* Header Section */}
      <div className="pb-4 border-b border-gray-200">
        <p className="text-gray-600 mt-2">
          To delete your account, confirm your country code and enter your phone number.
        </p>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        {/* Country Selection */}
        <div className="space-y-4" ref={dropdownRef}> 
          <label className="block text-lg font-medium text-gray-700" onClick={()=> setIsDropdownOpen(false)}>
            Country
          </label>
          <div className="relative">
            {/* Search & Dropdown Toggle */}
            <input
              type="text"
              placeholder="Search country..."
              value={searchTerm}
              onChange={(e) => {setSearchTerm(e.target.value); setIsDropdownOpen(true)}}
              onFocus={() => setIsDropdownOpen(true)}
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(true);
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 cursor-pointer bg-white outline-none"
            />

            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            >
              <IoIosArrowDropdown className="text-cyan-400 text-xl" />
            </div>

            {/* Dropdown List */}
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto z-10">
                {filteredCountries.length > 0 ? (
                  filteredCountries.map((country) => (
                    <li
                      key={country.code}
                      onClick={() => {
                        setSelectedCountry(country);
                        setSearchTerm(country.name);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {country.name} ({country.dial_code})
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">No matches found</li>
                )}
              </ul>
            )}
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            Phone Number
          </label>
          <div className="flex relative items-center gap-4 py-2">
            <div className="gap-2 border-b border-gray-200">
              <span className="text-gray-500 whitespace-nowrap">
                {selectedCountry?.dial_code || "+XX"}
              </span>
            </div>
            <div className="gap-2 relative border-b border-gray-200">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) =>
                  setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="Enter 10-digit number"
                className="flex-1 outline-none bg-transparent min-w-0"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!selectedCountry || phoneNumber.length !== 10}
          className={`w-full py-3 rounded-lg font-medium transition-colors cursor-pointer ${
            !selectedCountry || phoneNumber.length !== 10
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-red-500 text-white hover:bg-red-600"
          }`}
        >
          {isLoading ? "Processing..." : "Confirm Account Deletion"}
        </button>
      </form>

      {/* Warning Message */}
      <div className="p-4 mt-4 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 text-sm">
          ⚠️ Warning: This action is permanent. All your data will be permanently deleted.
        </p>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        title="Confirm Deletion"
      >
        <div className="space-y-4">
          <p>Are you sure you want to permanently delete your account?</p>
          <div className="flex justify-end gap-4 ">
            <button
              type="button"
              onClick={() => setShowConfirmation(false)}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmDeletion}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Confirm"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteAccount;
