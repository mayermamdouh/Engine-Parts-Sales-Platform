"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import { MdKeyboardArrowDown } from "react-icons/md";
import Loading from "@/app/components/Loading";
export default function User({ params }) {
  const { id } = params;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openDown, setOpenDown] = useState([]);
  
  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/admin/${id}`);
        setUserData(response.data);
        setLoading(false);
      } catch (e) {
        setError("Failed to fetch user");
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;

  const handleClickArrow = (index) => {
    setOpenDown((prev)=> prev.includes(index) ? prev.filter((item)=>item !== index) : [...prev, index]);
  };

  return (
    <div className="flex flex-col p-5">
      <div className="flex flex-col">
        <div className="text-center font-bold text-2xl mb-2">User Data</div>
        <div className="border-[2px] border-gray-200 rounded-md">
          <div className="flex flex-row p-3 gap-2">
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  First Name:{" "}
                </div>
                <div className="text-left text-sm sm:text-base text-gray-600">
                  {userData.data.user.firstName}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  Last Name:{" "}
                </div>
                <div className="text-left text-sm sm:text-base text-gray-600">
                  {userData.data.user.lastName}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  Register Data:{" "}
                </div>
                <div className="text-left text-sm sm:text-base text-gray-600">
                  {moment(userData.data.user.registerData)
                    .tz("Africa/Cairo")
                    .format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  Login:{" "}
                </div>
                <div className="text-left text-sm sm:text-base text-gray-600">
                  {userData.data.user.isLogin ? "true" : "false"}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  Email:{" "}
                </div>
                <div className="text-left break-all  text-sm sm:text-base text-gray-600 break-words max-w-full">
                  {userData.data.user.email}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  Last Login:{" "}
                </div>
                <div className="text-left text-sm sm:text-base text-gray-600">
                  {moment(userData.data.user.lastLogin)
                    .tz("Africa/Cairo")
                    .format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  Verified Email:{" "}
                </div>
                <div className="text-left text-sm sm:text-base text-gray-600">
                  {userData.data.user.verified ? "true" : "false"}
                </div>
              </div>
              <div className="flex flex-row gap-5 items-center">
                <div className="text-left text-sm sm:text-base font-bold">
                  User ID:{" "}
                </div>
                <div className="text-left break-all  text-sm sm:text-base text-gray-600">
                  {userData.data.user._id}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center font-bold text-2xl mt-7">Orders</div>
        {userData.data.orders.map((order, index) => (
          <div key={index}>
            <div
              onClick={() => handleClickArrow(index)}
              className="cursor-pointer p-3 flex flex-row items-center  border-[1px] border-gray-300 rounded-md  bg-white shadow-sm mt-3"
            >
              <div className="select-none"> Order {index + 1}</div>
              <MdKeyboardArrowDown
                className={`h-6 w-6 ml-auto transition-transform ${
                  openDown.includes(index) ? "rotate-180" : ""
                }`}
              />
            </div>

            <div
              className={`transition-all flex flex-col duration-200 overflow-x-auto ease-in-out  ${
                openDown.includes(index) ? "max-h-screen " : "max-h-0 "
              } shadow-md rounded-b-md`}
            >
              <div className="flex flex-col gap-2 p-3 ">
                <div className="font-bold text-center text-xl">
                  Order Details
                </div>
                <div className="flex flex-row gap-2 ">
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left text-sm  sm:text-base   font-bold">
                        Address ID:{" "}
                      </div>
                      <div className="text-left text-sm break-all sm:text-base text-gray-600 break-words max-w-full">
                        {order.address}
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left text-sm sm:text-base   font-bold">
                        Date:{" "}
                      </div>
                      <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                        {order.formattedCreatedAt}
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left text-sm sm:text-base   font-bold">
                        Phone Number:{" "}
                      </div>
                      <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                        {order.phoneNumber}
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left text-sm sm:text-base   font-bold">
                        Status:{" "}
                      </div>
                      <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                        {order.status}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col flex-1 gap-2">
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left  text-sm sm:text-base   font-bold">
                        Order ID:{" "}
                      </div>
                      <div className="text-left text-sm break-all sm:text-base text-gray-600 break-words max-w-full">
                        {order._id}
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left text-sm sm:text-base   font-bold">
                        Total:{" "}
                      </div>
                      <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                        {order.total + " EGP"}
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left text-sm sm:text-base   font-bold">
                        Products:{" "}
                      </div>
                      <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                        {order.products.length}
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 items-center">
                      <div className="text-left text-sm sm:text-base   font-bold">
                        Products Quantity:{" "}
                      </div>
                      <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                        {order.products.reduce(
                          (total, productItem) => total + productItem.quantity,
                          0
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-200 h-[2px] w-full"></div>
                <div className="text-xl font-bold text-center">Products</div>
                <div className="rounded-md border-[2px]">
                  <table className="min-w-full table-auto ">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-2 text-left font-semibold">
                          Name
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Category
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Car
                        </th>
                        <th className="px-4 py-2 text-left font-semibold ">
                          Brand
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Price
                        </th>
                        <th className="px-4 py-2 text-left font-semibold">
                          Quantity
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.products.map((productItem, index) => (
                        <tr key={index} className="border-t">
                          <td className="px-4 py-2">
                            {productItem.product.name}
                          </td>
                          <td className="px-4 py-2">
                            {productItem.product.category}
                          </td>
                          <td className="px-4 py-2 ">
                            {productItem.product.car || "N/A"}
                          </td>
                          <td className="px-4 py-2 ">
                            {productItem.product.brand || "N/A"}
                          </td>
                          <td className="px-4 py-2">
                            {productItem.product.price} EGP
                          </td>
                          <td className="px-4 py-2 ">{productItem.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-2xl font-bold text-center mt-7 mb-2">Addresses</div>
        <div className="overflow-x-auto shadow-md rounded-md border-[2px]">
          <table className="min-w-full table-auto  ">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">
                  Governorate
                </th>
                <th className="px-4 py-2 text-left font-semibold">City</th>
                <th className="px-4 py-2 text-left font-semibold">Address</th>
                <th className="px-4 py-2 text-left font-semibold ">
                  Apartment
                </th>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
              </tr>
            </thead>
            <tbody>
              {userData.data.addresses.map((address, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{address.governorate}</td>
                  <td className="px-4 py-2">{address.city}</td>
                  <td className="px-4 py-2 ">{address.address || "N/A"}</td>
                  <td className="px-4 py-2 ">{address.apartment || "N/A"}</td>
                  <td className="px-4 py-2">
                    {address.firstName + "" + address.lastName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
