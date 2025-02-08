"use client";
import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useContext,
} from "react";
import axios from "axios";
import { FaPlus } from "react-icons/fa6";
import Address from "@/app/components/address";
import { IoClose } from "react-icons/io5";
import SideMenu from "@/app/components/SideMenu";
import Loading from "@/app/components/Loading";
import Message from "@/app/components/Message";
import { useRouter, useSearchParams } from "next/navigation";
import { UserIdContext } from "@/app/utils/MyProvieder";
import { useSelector } from "react-redux";

export default function Order() {
  const routerr = useSearchParams();
  const router = useRouter();
  const { userId } = useSelector(state=> state.auth);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [addAddress, setAddAddress] = useState(false);
  const [addressNewData, setAddressNewData] = useState({});
  const [message, setMessage] = useState("");
  const [choiseAddress, setChoiseAddress] = useState("");
  const totalPrice = routerr.get("totalPrice");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errorMessage, setErrorMessage] = useState({});

  const validateData = useCallback(() => {
    const phonePattern = /^(010|011|012|015)\d{8}$/;

    if (phoneNumber.length < 11) {
      setErrorMessage((prev) => ({
        ...prev,
        phoneNumber: "يجب أن يحتوي رقم التيليفون على 11 رقمًا",
      }));
      return false;
    }

    if (!phonePattern.test(phoneNumber)) {
      setErrorMessage((prev) => ({
        ...prev,
        phoneNumber: "الرجاء إدخال رقم تليفون مصري صحيح",
      }));
      return false;
    }

    if (!choiseAddress) {
      setErrorMessage((prev) => ({
        ...prev,
        address: "الرجاء اختيار عنوان",
      }));
      return false;
    }

    // If all validations pass
    setErrorMessage({});
    return true;
  }, [phoneNumber, choiseAddress]);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchAddresses = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/address/${userId}`
          );
          if (response.data.status === "success") {
            setAddresses(response.data.data.addresses);
            setLoading(false);
          }
        } catch (error) {
          setLoading(false);
          console.log("Error fetching addresses:", error.toString());
        }
      };
      fetchAddresses();
    }
  }, [userId, addAddress]);

  const memoizedAddresses = useMemo(
    () =>
      addresses.map((address, index) => (
        <li key={index} className="text-right">
          <input
            type="radio"
            id={`address-${index}`}
            name="address"
            value={index}
            checked={choiseAddress === address._id}
            onChange={() => setChoiseAddress(address._id)}
            className="hidden"
          />
          <label
            htmlFor={`address-${index}`}
            className={`${
              choiseAddress === address._id &&
              "border-secondColor text-secondColor"
            } inline-flex items-center h-24 w-48 justify-between  text-gray-500 bg-white border-[2px] rounded-lg cursor-pointer  hover:bg-gray-100`}
          >
            <div className="block text-md p-4">
              <div className="w-full text-lg font-semibold">
                {address.address}
              </div>
              <div className="w-full">
                {address.governorate} / {address.city}
              </div>
              <div className="w-full">{address.name}</div>
            </div>
          </label>
        </li>
      )),
    [addresses, choiseAddress]
  );

  const isFormValid = useMemo(() => {
    return Object.values(addressNewData).every(
      (value) => value && value.trim() !== ""
    );
  }, [addressNewData]);

  const handleAddNewAddress = useCallback(async () => {
    addressNewData.user = userId;

    try {
      const response = await axios.post(
        `http://localhost:3001/address`,
        addressNewData
      );
      if (response.data.status === "success") {
        setMessage("Address added successfully.");
        setAddAddress(true);
        setIsOpen(false);
      }
    } catch (error) {
      console.log("Error adding new address:", error.toString());
    }
  }, [addressNewData, userId]);

  const handleAddAddress = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleAddressUpdateData = useCallback((updatedAddress) => {
    setAddressNewData(updatedAddress);
  }, []);

  const handleMakeOrder = useCallback(async () => {
    if (!validateData()) {
      return;
    }

    try {
      const response = await axios.post(`http://localhost:3001/orders/user`, {
        user: userId,
        address: choiseAddress,
        phoneNumber: phoneNumber,
      });

      if (response.data.status === "success") {
        setMessage("Order added successfully.");
        setErrorMessage({});
        setPhoneNumber("");
        setChoiseAddress("");
        router.push("/orders");
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Something went wrong!";
      setErrorMessage((prev) => ({
        ...prev,
        form: errorMessage,
      }));
    }
  }, [userId, choiseAddress, phoneNumber, validateData, router]);

  if (loading) return <Loading />;

  return (
    <>
      <Message message={message} setMessage={setMessage} />
      {errorMessage.form && (
        <p className="text-red-600 text-md">{errorMessage.form}</p>
      )}
      <div className="flex flex-col h-full items-end gap-5 p-5">
        <form>
          <div className="flex flex-col items-end">
            <label
              htmlFor="phone"
              className="block mb-2 text-md font-medium text-gray-900 text-right"
            >
              طريقة اتصال
            </label>
            <input
              type="tel"
              id="phonee"
              className="bg-gray-50 text-right border-2 max-w-72 min-w-48 text-gray-900 border-gray-300 focus:border-black outline-none text-md rounded-lg block w-full p-2.5"
              placeholder="ادخل رقم التيليفون"
              maxLength="11"
              minLength="11"
              pattern="^(010|011|012|015)\\d{8}$"
              title="Please enter a valid Egyptian phone number starting with 010, 011, 012, or 015."
              required
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            {errorMessage.phoneNumber && (
              <p className="text-red-600 text-md">{errorMessage.phoneNumber}</p>
            )}
          </div>

          <div className="text-2xl my-10 font-bold text-right">اختر عنوان</div>
          <div>
            <ul className="flex flex-row-reverse flex-wrap w-full gap-6">
              <div
                onClick={handleAddAddress}
                className="flex flex-col items-center justify-center p-5 border-2 border-gray-400 border-dashed rounded-md cursor-pointer h-24 w-48"
              >
                <FaPlus className="h-10 w-10 text-gray-400" />
                <div className="text-gray-400 text-xl font-bold">
                  اضافة عنوان
                </div>
              </div>
              {memoizedAddresses}
            </ul>
            {errorMessage.address && (
              <p className="text-red-600 text-md text-right mt-5">
                {errorMessage.address}
              </p>
            )}
          </div>
          <SideMenu isOpen={isOpen}>
            <IoClose
              onClick={() => setIsOpen(false)}
              className="text-black w-7 h-7 cursor-pointer"
            />
            <div className="text-2xl text-gray-700 text-right">اضافة عنوان</div>
            <Address onUpdate={handleAddressUpdateData} isOpen={isOpen} />
            <div className="flex items-center justify-center">
              <button
                disabled={!isFormValid}
                onClick={handleAddNewAddress}
                className={`bg-darkSlate text-textColor rounded-sm px-20 py-1 border border-gray-900 mt-5 ${
                  !isFormValid
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-transparent hover:text-darkSlate transition-all cursor-pointer"
                }`}
              >
                حفظ
              </button>
            </div>
          </SideMenu>
        </form>
        <div className="">
          <div className="text-2xl font-bold text-end mb-3">الدفع</div>
          <div className="border border-gray-200 py-3 px-4 rounded-md w-56 text-end">
            {" "}
            الدفع عند الاستلام{" "}
          </div>
        </div>
        <div className="border border-gray-100 w-full p-5">
          <div className="flex flex-row justify-between items-center mt-5 ">
            <div className="font-bold">
              {totalPrice}
              <span> EGY</span>
            </div>
            <div> الإجمالي قبل الشحن</div>
          </div>
          <div className="h-[2px] w-full bg-gray-100 mt-5"></div>
          <div className="flex flex-row justify-between items-center mt-5">
            <div className="font-bold">
              50<span> EGY</span>
            </div>
            <div>الشحن</div>
          </div>
          <div className="h-[2px] w-full bg-gray-100 mt-5"></div>
          <div className="flex flex-row justify-between items-center mt-5">
            <div className="font-bold">
              {Number(totalPrice) + 50}
              <span> EGY</span>
            </div>
            <div>الاجمالي</div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center mt-5 w-full">
          <button
            type="button"
            onClick={handleMakeOrder}
            className="py-2 px-4 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black w-40 transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg"
          >
            طلب
          </button>
        </div>
      </div>
    </>
  );
}
