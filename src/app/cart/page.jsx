"use client";
import Image from "next/image";
import Link from "next/link";
import React, {
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import { LuMinus, LuPlus } from "react-icons/lu";
import { MdOutlineDeleteOutline } from "react-icons/md";
import axios from "axios";
import Loading from "../components/Loading";
import Message from "../components/Message";
import { PiEmptyLight } from "react-icons/pi";
import { useSelector } from "react-redux";

export default function Cart() {
  const [carts, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId, token } = useSelector(state=> state.auth);
  const [message, setMessage] = useState("");
  const [removeProduct, setRemoveProduct] = useState(false);
  const [updateProduct, setUpdateProduct] = useState(false);

  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const fetchUserIdAndCart = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:3001/cart/${userId}`,
            {
              headers: {
                // "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const cartData = response.data.data.cart;
          setCart(cartData);

          const initialCheckedState = {};
          cartData?.products?.forEach((product) => {
            initialCheckedState[product.product._id] = product.checked || false;
          });
          setCheckedItems(initialCheckedState);
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserIdAndCart();
  }, [userId, updateProduct, removeProduct, token]);

  const handleRemoveProductCart = useCallback(
    async (id) => {
      const productData = {
        user: userId,
        product: id,
      };

      try {
        const response = await axios.post(
          `http://localhost:3001/cart/delete`,
          productData,
          {
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === "success") {
          setRemoveProduct((prev) => !prev);
          setMessage("Product removed from cart successfully");
        }
      } catch (error) {
        console.error("Error removing product from cart:", error);
      }
    },
    [userId, token]
  );

  const handleUpdateProductCart = useCallback(
    async (id, currentQuantity, operation) => {
      const newQuantity =
        operation === "increment" ? currentQuantity + 1 : currentQuantity - 1;

      if (newQuantity < 1) return;

      const productData = {
        user: userId,
        products: [{ productId: id, quantity: newQuantity }],
      };

      try {
        setLoading(true);
        const response = await axios.patch(
          `http://localhost:3001/cart/update`,
          productData,
          {
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === "success") {
          setMessage("Product updated in cart successfully");
          setUpdateProduct((prev) => !prev);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error updating product in cart:", error);
      }
    },
    [userId, token]
  );

  const handleUpdatecheckedProduct = useCallback(
    async (id) => {
      const updatedChecked = !checkedItems[id];
      const productData = {
        user: userId,
        products: [{ productId: id, checked: updatedChecked }],
      };

      try {
        setLoading(true);
        const response = await axios.patch(
          `http://localhost:3001/cart/update`,
          productData,
          {
            headers: {
              // "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.data.status === "success") {
          setLoading(false);
          setMessage("Checked status updated successfully");
          setCheckedItems((prev) => ({
            ...prev,
            [id]: updatedChecked,
          }));
        }
      } catch (error) {
        console.error("Error updating checked status:", error);
      }
    },
    [checkedItems, userId, token]
  );

  const totalProducts = useMemo(() => {
    if (!carts?.products) return 0;
    return carts.products.filter(
      (cartItem) => checkedItems[cartItem.product._id]
    ).length;
  }, [carts?.products, checkedItems]);

  const totalQuantity = useMemo(() => {
    if (!carts?.products) return 0;
    return carts.products.reduce((total, cartItem) => {
      if (checkedItems[cartItem.product._id]) {
        return total + cartItem.quantity;
      }
      return total;
    }, 0);
  }, [carts?.products, checkedItems]);

  const totalPrice = useMemo(() => {
    if (!carts?.products) return 0;
    return carts.products.reduce((total, cartItem) => {
      if (checkedItems[cartItem.product._id]) {
        return total + cartItem.product.price * cartItem.quantity;
      }
      return total;
    }, 0);
  }, [carts?.products, checkedItems]);

  if (loading) return <Loading />;

  return (
    <>
      <Message message={message} setMessage={setMessage} />
      <div className="flex flex-col mt-5 p-5">
        <div className="text-right text-xl ">
          عربة التسوق ({carts?.products?.length} المنتجات)
        </div>

        {carts?.products?.length > 0 ? (
          <>
            {carts.products.map((cart, index) => (
              <div key={index} className="flex flex-col my-3 ">
                <div className="flex flex-col items-center justify-center border border-gray-200 bg-gray-50 rounded-md w-full h-40">
                  <div className="flex flex-row gap-5 items-center p-5 w-[95%]">
                    <div className="flex flex-col gap-2 items-center text-sm">
                      <div className="font-bold text-center">
                        {cart.product.price + " EGY"}
                      </div>
                      <div className="flex flex-row gap-3 items-center border border-gray-900 p-1 rounded-md bg-white">
                        <LuPlus
                          className="h-4 w-4 cursor-pointer"
                          onClick={() =>
                            handleUpdateProductCart(
                              cart.product._id,
                              cart.quantity,
                              "increment"
                            )
                          }
                        />
                        <div>{cart.quantity}</div>
                        {cart.quantity > 1 && (
                          <LuMinus
                            className="h-4 w-4 cursor-pointer"
                            onClick={() =>
                              handleUpdateProductCart(
                                cart.product._id,
                                cart.quantity,
                                "decrement"
                              )
                            }
                          />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-auto text-end text-sm">
                      <div>{cart.product.name}</div>
                      <div>{cart.product.category.replace("_", " ")}</div>
                      <div>{cart.product.car}</div>
                    </div>
                    <Image
                      src={`http://localhost:3001/uploads/${cart.product.photo}`}
                      alt="image"
                      priority
                      width={500}
                      height={500}
                      className="h-24 w-24 rounded-md object-cover select-none"
                    />
                    <div className="flex flex-col items-center justify-between h-full gap-12">
                      <MdOutlineDeleteOutline
                        onClick={() =>
                          handleRemoveProductCart(cart.product._id)
                        }
                        className="h-6 w-6 text-black cursor-pointer transition-transform duration-200 hover:text-red-600 hover:scale-110"
                      />

                      <input
                        checked={checkedItems[cart.product._id] || false}
                        onChange={() =>
                          handleUpdatecheckedProduct(cart.product._id)
                        }
                        id={`checkbox-${cart.product._id}`}
                        type="checkbox"
                        className={`w-4 h-4 border-gray-300 rounded  ${
                          checkedItems[cart.product._id]
                            ? "accent-secondColor"
                            : "bg-gray-100"
                        }`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-5">
            <PiEmptyLight className="text-secondColor h-60 w-60" />
            <div className="text-gray-500 font-bold">
              لا توجد منتجات في عربة التسوق
            </div>
          </div>
        )}

        <div className="h-1 w-full bg-gray-800 rounded-md mt-6"></div>
        <div className="flex flex-col p-5 border border-gray-100 mt-5 ">
          {/* Total Products */}
          <div className="flex flex-row justify-between items-center">
            <div className="font-bold">{totalProducts}</div>
            <div>عدد السلع</div>
          </div>
          <div className="h-[2px] w-full bg-gray-100 my-5"></div>

          {/* Total Quantity */}
          <div className="flex flex-row justify-between items-center">
            <div className="font-bold">{totalQuantity}</div>
            <div>عدد القطع</div>
          </div>
          <div className="h-[2px] w-full bg-gray-100 my-5"></div>

          {/* Total Price */}
          <div className="flex flex-row justify-between items-center ">
            <div className="font-bold">
              {totalPrice} <span> EGY</span>
            </div>
            <div>الإجمالي</div>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center mt-10">
          <Link href={`/cart/payment?totalPrice=${totalPrice}`}>
            <button
              type="button"
              className="py-2 px-4 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black w-40 transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg"
            >
              الاستمرار الي الدفع
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
