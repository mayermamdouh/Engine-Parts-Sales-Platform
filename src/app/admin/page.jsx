"use client";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import logo from "../assets/logo.png";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import CustomDropdown from "../components/Dropdown";
import Message from "../components/Message";

import {
  FaArrowCircleRight,
  FaUser,
  FaUserCheck,
  FaUserShield,
} from "react-icons/fa";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Loading from "../components/Loading";
import { useSelector } from "react-redux";
// import ProtectedRoute from "../utils/ProtectedRoute";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28EF7"];
export default function Dashboard() {
  const { token } = useSelector(state=> state.auth);
  const [UsersData, setUsersData] = useState([]);
  const [Products, setProducts] = useState([]);
  const [Orders, setOrders] = useState([]);
  const [analyticsProduct, setAnalyticsProduct] = useState([]);
  const [orderAnalysis, setOrderAnalysis] = useState({});
  const [userAnalysis, setUserAnalysis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sideBar, setSideBar] = useState(true);
  const features = ["Users", "Products", "Orders", "Analytics"];
  const [active, setActive] = useState(0);
  const activeWord = features[active];
  const [selectedOption, setSelectedOption] = useState("");

  const handleActive = (index) => {
    setActive(index);
  };

  //////////////////////////////////      "Users"
  const fetchUsers = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      // throw error;
    }
  }, [token]);

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:3001/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage("User deleted successfuly!");

      const updatedUsers = await fetchUsers();
      setUsersData(updatedUsers);
    } catch {
      console.error("Error deleting user:", error.message);
    }
  };

  ///////////////////////////////////////////////////     "Products"

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/products");
      return response.data;
    } catch (error) {
      console.error("Error fetching products:", error);
      // throw error;
    }
  }, []);

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Product deleted successfuly!");

      const updatedProduct = await fetchProducts();
      setProducts(updatedProduct);
      return response.data;
    } catch {
      console.error("Error deleting user:", error.message);
    }
  };

  /////////////////////////////////////////////////////  "Orders"
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/orders/admin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      // throw error;
    }
  }, [token]);
  const deleteOrder = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3001/orders/admin/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Order deleted successfuly!");

      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
    } catch {
      console.error("Error deleting user:", error.message);
    }
  };
  ///////////////////////////////////////////////////////////   Analysis
  const fetchAnalysis = useCallback(async () => {
    try {
      const response = await axios.get("http://localhost:3001/analysis", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching analysis:", error);
      // throw error;
    }
  }, [token]);
  /////////////////////////////////////////////////////////
  useEffect(() => {
    if (token) {
      const fetchAllData = async () => {
        try {
          setLoading(true);

          // Fetch all data in parallel
          const [dataUsers, dataProducts, dataOrders, dataAnalysis] =
            await Promise.all([
              fetchUsers(),
              fetchProducts(),
              fetchOrders(),
              fetchAnalysis(),
            ]);

          // Update state with fetched data
          setUsersData(dataUsers);
          setProducts(dataProducts);
          setOrders(dataOrders);
          // console.log("Data Analysis: ", dataAnalysis);

          const transformedData = dataAnalysis?.data?.productAnalysis?.map(
            (item) => ({
              category: item._id,
              productCount: item.totalProducts,
              totalProfitPotential: item.totalProfitPotential,
              brandCount: item.brands.length,
            })
          );
          setAnalyticsProduct(transformedData);
          setOrderAnalysis(dataAnalysis?.data?.orderAnalysis);
          setUserAnalysis(dataAnalysis?.data?.userAnalysis);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setError("Failed to fetch data");
          setLoading(false);
        }
      };
      fetchAllData();
    }
  }, [fetchAnalysis, fetchOrders, fetchProducts, fetchUsers, token]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [message]);

  const handleSelectOptions = useCallback((option) => {
    setSelectedOption(option);
  }, []);

  const handleSideBarActive = () => {
    setSideBar(!sideBar);
    console.log("side: ", sideBar);
  };

  return (
    // <ProtectedRoute>
    <div className="h-screen">
      <div className="flex flex-row h-full bg-gray-100">
        <div
          className={`relative top-0 left-0 h-full bg-darkSlate transition-all duration-300 ${
            sideBar ? "w-0 " : "w-1/4 lg:w-1/5 md:w-1/6 sm:w-1/4 "
          }`}
        >
          <div className="p-3">
            <div
              className={`flex items-center justify-center select-none transition-opacity duration-300 ${
                sideBar ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              <Image
                src={logo}
                className="w-28 h-28"
                alt="logo"
                priority={true}
              />
            </div>
            <div
              className={`flex flex-col mt-4 transition-opacity duration-300 ${
                sideBar ? "opacity-0 pointer-events-none" : "opacity-100"
              }`}
            >
              {features?.map((feature, index) => (
                <div key={index}>
                  <div
                    onClick={() => handleActive(index)}
                    className={`text-white text-xl text-center cursor-pointer p-2 rounded-md ${
                      active === index ? "bg-secondColor" : ""
                    }`}
                  >
                    {feature}
                  </div>
                  <div className="h-[2px] w-full bg-white my-3"></div>
                </div>
              ))}
            </div>
          </div>
          <div
            onClick={handleSideBarActive}
            className={`absolute top-2 right-[-27px] transform transition-transform duration-300 cursor-pointer ${
              sideBar ? "rotate-0" : "rotate-180"
            }`}
          >
            <FaArrowCircleRight className="h-7 w-7 text-secondColor" />
          </div>
        </div>

        <div className="flex-auto  p-5 overflow-y-auto transition-all duration-300 mt-5">
          <div className="flex flex-col ">
            <div className="flex flex-row items-center justify-center mb-5 ">
              <div className="text-3xl text-black mb-3  ">
                {activeWord === "Users"
                  ? "Users"
                  : activeWord === "Products"
                  ? "Products"
                  : activeWord === "Orders"
                  ? "Orders"
                  : "Analytics"}
              </div>
            </div>
            <Message message={message} setMessage={setMessage} />
            <div className="border-2 rounded-md border-gray-200  flex flex-col">
              <div className="flex my-3 px-4 gap-2 rounded-md items-center border-darkSlate mx-auto w-full">
                {activeWord === "Products" && (
                  <CustomDropdown
                    options={[
                      "All",
                      "ENGINE_PARTS",
                      "TIRES",
                      "OILS",
                      "SPARK_PLUGS",
                      "BATTERIES",
                    ]}
                    nameField="Category"
                    onSelect={handleSelectOptions}
                  />
                )}
                <IoSearch className="fill-gray-600 h-6 w-6 ml-3" />
                <input
                  type="text"
                  placeholder="Search Arabic or English..."
                  className="w-full outline-none bg-transparent text-gray-600 text-md text-left"
                />
                {activeWord === "Products" && (
                  <Link href="admin/product/add">
                    {" "}
                    <button
                      type="button"
                      className="py-1 px-4 text-white bg-green-600 hover:bg-transparent border hover:border-black hover:text-black w-20 transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg"
                    >
                      Add
                    </button>
                  </Link>
                )}
              </div>

              <div className="h-[2px] w-full bg-gray-200"></div>

              <div className="p-3 flex flex-col gap-3">
                {activeWord === "Users" ? (
                  <div>
                    {loading ? (
                      <Loading />
                    ) : (
                      UsersData?.data?.users?.map((user, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="w-full h-[1px] bg-gray-300 my-3"></div>
                          <div className="border border-gray-300 rounded-lg p-2 flex flex-row items-center ">
                            <div className="text-gray-800">
                              {user.firstName + " " + user.lastName}
                            </div>
                            <div className="ml-auto flex flex-row items-center gap-1">
                              <Link href={`/admin/user/${user._id}`}>
                                <button className="py-1 px-4 text-white bg-blue-600 hover:bg-transparent border hover:border-black hover:text-black w-20 transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg">
                                  Open
                                </button>
                              </Link>
                              <button
                                onClick={() => deleteUser(user._id)}
                                className="py-1 px-4 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black w-20 transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : activeWord === "Products" ? (
                  <div>
                    {loading ? (
                      <Loading />
                    ) : (
                      Products.data?.products
                        ?.filter(
                          (product) =>
                            !selectedOption ||
                            selectedOption === "All" ||
                            product.category === selectedOption
                        )
                        .map((product, index) => (
                          <div key={index} className="flex flex-col">
                            <div className="w-full h-[1px] bg-gray-300 my-3"></div>
                            <div className="border border-gray-300 rounded-lg p-2 flex flex-row items-center">
                              <div className="text-gray-800">
                                {product.name}
                              </div>
                              <div className="ml-auto flex flex-row items-center gap-1">
                                <Link
                                  href={`/admin/product/edit/${product._id}`}
                                >
                                  <button className="py-1 px-4 text-white bg-blue-600 hover:bg-transparent border hover:border-black hover:text-black w-20 transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg">
                                    Edit
                                  </button>
                                </Link>
                                <button
                                  onClick={() => {
                                    deleteProduct(product._id);
                                  }}
                                  className="py-1 px-4 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black w-20 transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                ) : activeWord === "Orders" ? (
                  <div>
                    {loading ? (
                      <Loading />
                    ) : (
                      Orders.data?.orders?.map((order, index) => (
                        <div key={index} className="flex flex-col">
                          <div className="w-full h-[1px] bg-gray-300 my-3"></div>
                          <div className="border border-gray-300 rounded-lg p-2 flex flex-row items-center">
                            <div className="text-gray-800">{order.status}</div>
                            <div className="ml-auto flex flex-row items-center gap-1">
                              <Link href={`/admin/order/${order._id}`}>
                                <button
                                  type="button"
                                  className="py-1 px-4 text-white bg-blue-600 hover:bg-transparent border hover:border-black hover:text-black w-20 transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg"
                                >
                                  Open
                                </button>
                              </Link>
                              <button
                                onClick={() => {
                                  deleteOrder(order._id);
                                }}
                                type="button"
                                className="py-1 px-4 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black w-20 transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="w-full h-auto flex flex-col items-center">
                    <div className="text-xl font-bold">Products Analysis</div>
                    {analyticsProduct.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analyticsProduct}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar
                            dataKey="productCount"
                            fill="#8884d8"
                            name="Product Count"
                          />
                          <Bar
                            dataKey="totalProfitPotential"
                            fill="#82ca9d"
                            name="Profit Potential "
                          />
                          <Bar
                            dataKey="brandCount"
                            fill="#ffc658"
                            name="Brand Count"
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div>No data available</div>
                    )}
                    <div className="w-full h-[2px] bg-gray-200"></div>
                    <div className="text-xl font-bold mt-2">
                      Orders Analysis
                    </div>
                    <div className="w-full h-96">
                      <div className="flex flex-row ">
                        <div className="flex flex-col">
                          <div className="flex flex-row gap-5 items-center">
                            <div className="text-left text-sm sm:text-base font-bold">
                              Total Orders:{" "}
                            </div>
                            <div className="text-left text-sm sm:text-base text-gray-600">
                              {orderAnalysis.totalOrders}
                            </div>
                          </div>
                          <div className="flex flex-row gap-5 items-center">
                            <div className="text-left text-sm sm:text-base font-bold">
                              Total Revenue:{" "}
                            </div>
                            <div className="text-left text-sm sm:text-base text-gray-600">
                              {orderAnalysis.totalRevenue}
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col"></div>
                      </div>
                      <ResponsiveContainer>
                        <PieChart>
                          <Pie
                            data={orderAnalysis.ordersByStatus}
                            dataKey="count"
                            nameKey="_id"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            label={({ _id, count }) => `${_id}: ${count}`}
                          >
                            {orderAnalysis?.ordersByStatus &&
                              orderAnalysis.ordersByStatus.map(
                                (entry, index) => (
                                  <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                  />
                                )
                              )}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full h-[2px] bg-gray-200"></div>
                    <div className="text-xl font-bold my-3">Users Analysis</div>
                    <div className="flex flex-col">
                      <div className="grid grid-cols-2 gap-4">
                        {/* Total Users */}
                        <div className="flex items-center bg-blue-100 p-4 rounded-lg shadow">
                          <FaUser className="text-blue-500 text-3xl mr-4" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-700">
                              Total Users
                            </h3>
                            <p className="text-xl font-bold text-gray-900">
                              {userAnalysis.totalUsers}
                            </p>
                          </div>
                        </div>

                        {/* Active Users */}
                        <div className="flex items-center bg-green-100 p-4 rounded-lg shadow">
                          <FaUserCheck className="text-green-500 text-3xl mr-4" />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-700">
                              Active Users
                            </h3>
                            <p className="text-xl font-bold text-gray-900">
                              {userAnalysis.activeUsers}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Role Distribution */}
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                          Role Distribution
                        </h3>
                        <div className="space-y-2">
                          {userAnalysis.roleDistribution.map((role) => (
                            <div
                              key={role._id}
                              className="flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow"
                            >
                              <div className="flex items-center">
                                <FaUserShield className="text-gray-500 text-2xl mr-3" />
                                <p className="text-gray-800 font-medium">
                                  {role._id}
                                </p>
                              </div>
                              <p className="text-gray-900 font-bold">
                                {role.count}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </ProtectedRoute>
  );
}
