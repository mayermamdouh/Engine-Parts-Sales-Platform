"use client";
import axios from "axios";
import { useState, useEffect, useCallback, useMemo } from "react";
import { FaPlus } from "react-icons/fa6";
import Loading from "../components/Loading";
import Address from "../components/address";
import SideMenu from "../components/SideMenu";
import { IoClose } from "react-icons/io5";
import Message from "../components/Message";
import { useSelector } from "react-redux";

export default function Addresses() {
  const {token ,userId} = useSelector(state=> state.auth);
  const [address, setAddress] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isOpen, setIsOpen] = useState(false);
  const [addressinitialData, setAddressinitialData] = useState({});
  const [addressUpdateData, setAddressUpdateData] = useState({});
  const [addAddress, setAddAddress] = useState(false);
  const [addressId, setAddressId] = useState("");

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});



  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/address/${userId}`,{
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setAddress(response.data.data.addresses);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching addresses:", error);
        }
      };
      fetchData();
    }
  }, [userId, message, token]);

  const handleAddressUpdate = (address) => {
    setAddAddress(false);
    setIsOpen(!isOpen);
    setAddressId(address._id);
    delete address._id;
    setAddressUpdateData(address);
    setAddressinitialData(address);
  };

 const handleAddressUpdateData = useCallback((updatedAddress) => {
  setAddressUpdateData(updatedAddress);
}, []);

const handleAddAddress = useCallback(() => {
  setIsOpen(!isOpen);
  setAddAddress(true);
  setAddressId("");
}, [isOpen]);

 const isDataChanged = useMemo(() => {
  return (
    JSON.stringify(addressUpdateData) !== JSON.stringify(addressinitialData)
  );
}, [addressUpdateData, addressinitialData]);

const isFormValid = useMemo(() => {
  return Object.values(addressUpdateData).every(
    (value) => value && value.trim() !== ""
  );
}, [addressUpdateData]);

  const isFormDisabled = useMemo(() => {
  return !isDataChanged || !isFormValid;
}, [isDataChanged, isFormValid]);

const handleUpdateAddress = useCallback(async () => {
  if (addAddress) {
    addressUpdateData.user = userId;
  }
  const url = addAddress
    ? "http://localhost:3001/address"
    : `http://localhost:3001/address/${addressId}`;

  const method = addAddress ? "post" : "patch";

  try {
    const response = await axios[method](url, addressUpdateData,{headers:{
      Authorization: `Bearer ${token}`,
    }});
    if (response.data.status === "success") {
      const successMessage = addAddress
        ? "Your address has been added successfully."
        : "Your address has been updated successfully.";
      setMessage(successMessage);
      setIsOpen(false);
    }
  } catch (err) {
    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Something went wrong!";
    setErrors({ form: errorMessage });
  }
}, [addAddress, addressId, addressUpdateData, userId, token]);

 const handleAddressDelete = useCallback(async (addressId) => {
  try {
    const response = await axios.delete(
      `http://localhost:3001/address/${addressId}`
    );
    if (response.data.status === "success") {
      setMessage("Your address has been deleted successfully.");
    }
  } catch (err) {
    const errorMessage =
      err.response && err.response.data && err.response.data.message
        ? err.response.data.message
        : "Something went wrong!";
    setErrors({ form: errorMessage });
  }
}, []);

  if (loading) return <Loading />;

  return (
    <div className="p-5 flex flex-col  items-end">
      <Message message={message} setMessage={setMessage} />
      {errors.form && (
        <div>
          <div className="text-red-600 text-md">{`${errors.form}`}</div>
        </div>
      )}
      <div className="text-2xl mt-5 text-gray-600">عناوينك</div>
      <div className="flex flex-row-reverse flex-wrap mt-5 gap-5 w-full items-end">
        <div
          onClick={handleAddAddress}
          className="flex flex-col items-center justify-center p-3 border-2 border-gray-400 border-dashed rounded-md cursor-pointer h-60 w-60"
        >
          <FaPlus className="h-10 w-10 text-gray-400" />
          <div className="text-gray-400 text-xl font-bold ">اضافة عنوان</div>
        </div>
        {address?.map((address, index) => (
          <div
            key={index}
            className="flex flex-col items-end p-3 border-gray-400 border-[2px] rounded-md h-60 w-60"
          >
            <div className="space-y-1 text-end">
              <div className="text-md ">{address.name}</div>
              <div className="text-md "> {address.governorate}</div>
              <div className="text-md "> {address.city}</div>
              <div className="text-md "> {address.address}</div>
              <div className="text-md "> {address.apartment}</div>
            </div>
            <div className="flex flex-row-reverse text-sm text-secondColor  mt-auto items-center">
              <div
                onClick={() => handleAddressUpdate(address)}
                className="cursor-pointer"
              >
                تعديل{" "}
              </div>
              <div className="h-[1px] bg-black  w-4 rotate-90"></div>
              <div
                onClick={() => handleAddressDelete(address._id)}
                className="cursor-pointer"
              >
                ازالة{" "}
              </div>
            </div>
          </div>
        ))}
      </div>
      <SideMenu isOpen={isOpen}>
        <IoClose
          onClick={() => setIsOpen(false)}
          className="text-black w-7 h-7 cursor-pointer"
        />
        <div className="text-2xl text-gray-700 text-right">
          {addAddress ? "اضافة عنوان" : "تعديل العنوان"}
        </div>
        {addAddress ? (
          <Address onUpdate={handleAddressUpdateData} isOpen={isOpen} />
        ) : (
          <Address
            addressData={addressUpdateData}
            onUpdate={handleAddressUpdateData}
            isOpen={isOpen}
          />
        )}
        <div className="flex items-center justify-center">
          <button
            disabled={isFormDisabled}
            className={`bg-darkSlate text-textColor rounded-sm px-20 py-1  border border-gray-900 mt-5   ${
              isFormDisabled
                ? "opacity-50 "
                : "hover:bg-transparent hover:text-darkSlate transition-all cursor-pointer"
            }`}
            onClick={handleUpdateAddress}
          >
            {addAddress ? "اضافة" : "حفظ"}
          </button>
        </div>
      </SideMenu>
    </div>
  );
}
