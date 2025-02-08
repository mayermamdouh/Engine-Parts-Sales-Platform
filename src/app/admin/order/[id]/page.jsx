"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Loading from "@/app/components/Loading";
import moment from "moment-timezone";

export default function OrderDetails({ params }) {
  const { id } = params;
  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchorder = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/orders/admin/${id}`
        );
        setOrderData(response.data);
        setLoading(false);
      } catch (e) {
        setError("Failed to fetch order");
        setLoading(false);
      }
    };
    fetchorder();
  }, [id]);

  if (loading) return <Loading />;
  if (error) return <div>{error}</div>;
  console.log("orderData: ", orderData);
  return (
    <div className="flex flex-col p-5 ">
      <div className="flex flex-col gap-2 p-3 ">
        <div className="font-bold text-center text-xl">Order Details</div>
        <div className="flex flex-row gap-2 border-[2px] border-gray-100 p-3 rounded-md ">
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left text-sm  sm:text-base   font-bold">
                Address ID:{" "}
              </div>
              <div className="text-left text-sm break-all sm:text-base text-gray-600 break-words max-w-full">
                {orderData.data.order.address}
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left text-sm sm:text-base   font-bold">
                Date:{" "}
              </div>
              <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                {moment(orderData.data.order.createdAt)
                  .tz("Africa/Cairo")
                  .format("YYYY-MM-DD HH:mm:ss")}
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left text-sm sm:text-base   font-bold">
                Phone Number:{" "}
              </div>
              <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                {orderData.data.order.phoneNumber}
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left text-sm sm:text-base   font-bold">
                Status:{" "}
              </div>
              <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                {orderData.data.order.status}
              </div>
            </div>
          </div>
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left  text-sm sm:text-base   font-bold">
                Order ID:{" "}
              </div>
              <div className="text-left text-sm break-all sm:text-base text-gray-600 break-words max-w-full">
                {orderData.data.order._id}
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left text-sm sm:text-base   font-bold">
                Total:{" "}
              </div>
              <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                {orderData.data.order.total + " EGP"}
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left text-sm sm:text-base   font-bold">
                Products:{" "}
              </div>
              <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                {orderData.data.order.products.length}
              </div>
            </div>
            <div className="flex flex-row gap-5 items-center">
              <div className="text-left text-sm sm:text-base   font-bold">
                Products Quantity:{" "}
              </div>
              <div className="text-left text-sm sm:text-base text-gray-600 break-words max-w-full">
                {orderData.data.order.products.reduce(
                  (total, productItem) => total + productItem.quantity,
                  0
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-200 h-[2px] w-full"></div>
        <div className="text-xl font-bold text-center">Products</div>
        <div className="overflow-x-auto rounded-md border-[2px]">
          <table className="min-w-full table-auto shadow-md ">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-semibold">Name</th>
                <th className="px-4 py-2 text-left font-semibold">Category</th>
                <th className="px-4 py-2 text-left font-semibold">Car</th>
                <th className="px-4 py-2 text-left font-semibold ">Brand</th>
                <th className="px-4 py-2 text-left font-semibold">Price</th>
                <th className="px-4 py-2 text-left font-semibold">Quantity</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Profit Rate
                </th>
              </tr>
            </thead>
            <tbody>
              {orderData.data.order.products.map((productItem, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{productItem.product.name}</td>
                  <td className="px-4 py-2">{productItem.product.category}</td>
                  <td className="px-4 py-2 ">
                    {productItem.product.car || "N/A"}
                  </td>
                  <td className="px-4 py-2 ">
                    {productItem.product.brand || "N/A"}
                  </td>
                  <td className="px-4 py-2">{productItem.product.price} EGP</td>
                  <td className="px-4 py-2 ">{productItem.quantity}</td>
                  <td className="px-4 py-2 ">
                    {productItem.product.profitRate + "%"}
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
