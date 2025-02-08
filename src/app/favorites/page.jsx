"use client";
import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import axios from "axios";
import Loading from "../components/Loading";
import Message from "../components/Message";
import { PiEmptyLight } from "react-icons/pi";
import { useSelector } from "react-redux";

export default function Favorite() {
  const { userId, token } = useSelector(state=> state.auth);
  const [favorite, setFavorite] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isUpdatingFavorites, setIsUpdatingFavorites] = useState(false);

  useEffect(() => {
    if (userId) {
      setLoading(true);
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3001/favorite/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setFavorite(response?.data?.data?.products);
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.error(
            "Error fetching favorite data:",
            error.response?.data || error.message
          );
        }
      };
      fetchData();
    }
  }, [userId, token, isUpdatingFavorites]);

  if (loading) return <Loading />;

  return (
    <div className="flex flex-col items-end ">
      <Message message={message} setMessage={setMessage} />
      <div className="p-5 w-full flex flex-col items-end">
        <div className="text-2xl mb-8 mt-5"> ❤️ قائمة المفضلة</div>
        <div className="h-[2px] w-full bg-gray-200 mb-8 rounded-sm"></div>
      </div>
      <div className="flex flex-col w-full">
        {favorite?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
            {favorite?.map((product, index) => (
              <div key={index} className="w-full">
                <ProductCard
                  image={`http://localhost:3001/uploads/${product.photo}`}
                  price={`${product.price} EGY`}
                  name={product.name}
                  brand={product.brand}
                  productId={product._id}
                  setMessage={setMessage}
                  favorite={favorite}
                  setIsUpdatingFavorites={setIsUpdatingFavorites}
                  isUpdatingFavorites={isUpdatingFavorites}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-gray-500 my-5 w-full">
            <PiEmptyLight className="text-secondColor h-60 w-60" />
            <div className="text-gray-500 font-bold">
              لا توجد منتجات في عربة التسوق
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
