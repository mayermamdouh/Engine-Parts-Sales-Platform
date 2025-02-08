"use client";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment-timezone";
import Loading from "../components/Loading";
import CustomDropdown from "../components/Dropdown";
import { useSelector } from "react-redux";

export default function Orders() {
  const { userId, token } = useSelector(state=> state.auth);
  const [ordersData, setOrdersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orderErrors, setOrderErrors] = useState({});
  const [orderFilter, setFilter] = useState(true);
  const [selectedOption, setSelectedOption] = useState("");

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/orders/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setOrdersData(response.data.data.order);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error("Error fetching user data:", error);
        }
      };
      fetchData();
    }
  }, [userId, orderErrors, token]);

  const handleCancelOrder = useCallback(
    async (e, idd, newStatus) => {
      e.preventDefault();
      try {
        const response = await axios.patch(
          `http://localhost:3001/orders/user/${idd}`,
          { status: newStatus },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === "success") {
          console.log(response.data.data.order);
          setOrderErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[idd];
            return newErrors;
          });
        }
      } catch (err) {
        const errorMessage =
          err.response && err.response.data && err.response.data.message
            ? err.response.data.message
            : "Something went wrong!";
        setOrderErrors((prev) => ({ ...prev, [idd]: errorMessage }));
      }
    },
    [token]
  );

  const filterData = useMemo(() => {
    const now = moment().tz("Africa/Cairo");

    return ordersData.filter((order) => {
      const orderTime = moment(order.createdAt).tz("Africa/Cairo");

      const matchesStatus = orderFilter
        ? order.status !== "Canceled"
        : order.status === "Canceled";

      let matchesTimeRange = true;

      // Match time range based on the selectedOption
      if (selectedOption === "آخر شهر") {
        matchesTimeRange = now.diff(orderTime, "months") <= 1;
      } else if (selectedOption === "آخر 3 شهور") {
        matchesTimeRange = now.diff(orderTime, "months") <= 3;
      } else if (selectedOption === "آخر 6 شهور") {
        matchesTimeRange = now.diff(orderTime, "months") <= 6;
      } else if (selectedOption === "آخر 9 شهور") {
        matchesTimeRange = now.diff(orderTime, "months") <= 9;
      } else if (selectedOption === "آخر سنة") {
        matchesTimeRange = now.diff(orderTime, "months") <= 12; //
      } else if (selectedOption === "الكل") {
        matchesTimeRange = true;
      }

      // Return true only if BOTH conditions are satisfied
      return matchesStatus && matchesTimeRange;
    });
  }, [orderFilter, ordersData, selectedOption]);

  const handleSelectOptions = useCallback((option) => {
    setSelectedOption(option);
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex flex-col items-center justify-center">
        <div className="text-2xl mt-5 text-gray-600">الطلبات الخاصة بك</div>
        <div className="mt-10 flex flex-row gap-5 w-full">
          <div
            onClick={() => setFilter(false)}
            className="text-black cursor-pointer group w-full flex justify-center"
          >
            <span className="relative select-none user-select-none">
              <span>الطلبات الملغاة</span>
              <span
                className={`absolute left-0 right-0 -bottom-1 h-0.5 bg-darkSlate transition-all duration-300 transform scale-x-0 group-hover:scale-x-100
                        ${!orderFilter && "scale-x-100"}
                        `}
              />
            </span>
          </div>
          <div
            onClick={() => setFilter(true)}
            className="text-black cursor-pointer group w-full flex justify-center"
          >
            <span className="relative select-none user-select-none">
              <span> الطلبات</span>
              <span
                className={`absolute left-0 right-0 -bottom-1 h-0.5 bg-darkSlate transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 ${
                  orderFilter && "scale-x-100"
                } `}
              />
            </span>
          </div>
        </div>

        <div className="grid-cols-1 justify-items-center p-5 sm:w-full md:w-[50%] lg:w-[80%] space-y-5 ">
          <div className="h-[2px] mx-suto w-full  bg-gray-200 mt-7"></div>
          {orderFilter && (
            <div className="flex items-center justify-end w-full gap-2">
              <CustomDropdown
                options={[
                  "الكل",
                  "آخر شهر",
                  "آخر 3 شهور",
                  "آخر 6 شهور",
                  "آخر 9 شهور",
                  "آخر سنة",
                ]}
                nameField="الفترة"
                onSelect={handleSelectOptions}
              />

              <div className="text-gray-700">من الطلبات تم تقديمها في</div>
              <span className="text-black ">{filterData.length}</span>
            </div>
          )}
          {filterData?.map((order, index) => (
            <div
              key={index}
              className="flex flex-col border-[1px] border-gray-200 rounded-md px-2 py-3 gap-2 shadow-md w-full"
            >
              {orderErrors[order._id] && (
                <div>
                  <div className="text-red-600 text-sm text-right">
                    {orderErrors[order._id]}
                  </div>
                </div>
              )}
              <div className="flex flex-row-reverse gap-5 items-center ">
                <div className="text-left text-sm font-bold">تاريخ الطلب</div>
                <div className="text-left text-sm text-gray-600">
                  {moment(order.createdAt)
                    .tz("Africa/Cairo")
                    .format("YYYY-MM-DD HH:mm:ss")}
                </div>
              </div>
              <div className="flex flex-row-reverse gap-5 items-center ">
                <div className="text-left text-sm font-bold">رقم الطلب</div>
                <div className="text-left text-sm text-gray-600">
                  {order._id}
                </div>
              </div>
              <div className="flex flex-row-reverse gap-5 items-center ">
                <div className="text-left text-sm font-bold">اجمالي المبلغ</div>
                <div className="text-left text-sm text-gray-600">
                  {"EGP " + order.total}
                </div>
              </div>
              <div className="w-full">
                <div className="flex flex-row-reverse items-center justify-between gap-4 mb-2">
                  <h6
                    className={`block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal ${
                      order.status === "Canceled" && "text-red-500"
                    }`}
                  >
                    {order.status === "Ordered"
                      ? "تم الطلب"
                      : order.status === "Shipped"
                      ? "تم الشحن"
                      : order.status === "Delivery"
                      ? "تم التوصيل"
                      : order.status === "Delivered"
                      ? "تم التسليم"
                      : "تم الغاء الطلب"}
                  </h6>
                  {order.status !== "Canceled" && (
                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal ">
                      {order.status === "Ordered"
                        ? "25%"
                        : order.status === "Shipped"
                        ? "50%"
                        : order.status === "Delivery"
                        ? "75%"
                        : "100%"}
                    </h6>
                  )}
                </div>

                {/* Base progress bar */}
                {order.status !== "Canceled" && (
                  <div className="relative h-2.5 w-full rounded-full bg-gray-200">
                    <div
                      className={`absolute h-full rounded-full bg-secondColor ${
                        order.status === "Ordered"
                          ? "w-1/4"
                          : order.status === "Shipped"
                          ? "w-1/2"
                          : order.status === "Delivery"
                          ? "w-3/4"
                          : "w-full"
                      }`}
                    ></div>
                  </div>
                )}
              </div>
              <table className="w-full text-sm text-left text-gray-500 shadow-sm p-2 rounded-md table-auto">
                <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                  <tr>
                    <th scope="col" className="px-2 py-2">
                      المنتج
                    </th>
                    <th scope="col" className="px-2 py-2">
                      اسم المنتج
                    </th>
                    <th scope="col" className="px-2 py-2">
                      الكمية
                    </th>
                    <th scope="col" className="px-2 py-2">
                      السعر
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {order.products.map((product, productIndex) => (
                    <tr
                      key={productIndex}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="p-2">
                        <Image
                          src={`http://localhost:3001/uploads/${product.product.photo}`}
                          alt={product.product.name}
                          width={50}
                          height={50}
                          className="rounded-md"
                        />
                      </td>
                      <td className="px-2 py-2 font-semibold text-gray-900">
                        {product.product.name}
                      </td>
                      <td className="px-2 py-2">{product.quantity}</td>
                      <td className="px-2 py-2">
                        {"EGP " + product.product.price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                onClick={(e) =>
                  handleCancelOrder(
                    e,
                    order._id,
                    order.status === "Canceled" ? "Ordered" : "Canceled"
                  )
                }
                className={` ${
                  order.status === "Canceled"
                    ? "bg-darkSlate"
                    : "bg-secondColor"
                } text-textColor w-[40%] mx-auto rounded-md px-4 py-2 cursor-pointer border border-gray-200 hover:bg-transparent hover:text-darkSlate`}
              >
                {order.status === "Canceled" ? "اعادة الطلب" : "الغاء الطلب"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
