import { IoMdHeart } from "react-icons/io";
import Image from "next/image";
import axios from "axios";
import { useState } from "react";
import { useSelector } from "react-redux";

const ProductCard = ({
  image,
  price,
  description,
  name,
  brand,
  productId,
  setMessage,
  favorite,
  setIsUpdatingFavorites,
  isUpdatingFavorites,
}) => {
  const { userId, token } = useSelector(state=> state.auth);
  const [isFavorite, setIsFavorite] = useState(
    favorite ? favorite.map((product) => product._id) : []
  );

  const handleAddToCart = async () => {
    const productData = {
      user: userId,
      products: [{ productId, quantity: 1 }],
    };

    try {
      const response = await axios.post(
        "http://localhost:3001/cart",
        productData,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("Product added to cart successfully");
      } else {
        console.error("Failed to add product to cart");
      }
    } catch (error) {
      setMessage("Failed to add product to cart. Please try again.");
      console.error("Error adding product to cart:", error);
    }
  };

  const handleAddToFavorite = async () => {
    const productData = { user: userId, products: [productId] };

    try {
      const response = await axios.post(
        "http://localhost:3001/favorite",
        productData,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.status === 200) {
        setMessage("Product added to favorite successfully");
        setIsFavorite((prev) => [...prev, productId]);
      } else {
        console.error("Failed to add favorite to cart");
      }
    } catch (error) {
      console.error("Error adding favorite to cart:", error);
    }
  };

  const handleRemovefromFavorite = async () => {
    const productData = { user: userId, products: [productId] };
    try {
      const response = await axios.post(
        `http://localhost:3001/favorite/delete`,
        productData,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setIsFavorite((prev) => prev.filter((id) => id !== productId));
        setMessage("Product removed from favorite successfully ");
        setIsUpdatingFavorites(!isUpdatingFavorites);
      }
    } catch (error) {
      console.error(
        "Error fetching favorite data:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow flex flex-col w-auto h-[450px] overflow-hidden m-2">
      <div className="relative flex justify-center items-center h-[60%]">
        <Image
          src={image || "/default-image.jpg"}
          alt="Product Image"
          priority
          width={500}
          height={500}
          className="object-fill w-full h-full rounded-t-lg"
        />
      </div>
      <form className="flex-auto p-6 flex flex-col justify-between h-[40%]">
        <div>
          <div className="flex items-center flex-row">
            <div className="text-xl font-semibold text-gray-500">{price}</div>
            <IoMdHeart
              onClick={
                isFavorite.includes(productId)
                  ? handleRemovefromFavorite
                  : handleAddToFavorite
              }
              className={`ml-auto h-6 w-6 cursor-pointer ${
                isFavorite.includes(productId)
                  ? "text-red-600"
                  : "text-gray-800"
              }`}
            />
          </div>
          <div className="text-end text-sm text-gray-600">{description}</div>
          <div className="mt-2 text-gray-700 font-medium">{name}</div>
          <div className="mt-1 text-gray-600 text-sm">{brand}</div>
        </div>
        <div className="flex text-sm mt-4 font-medium">
          <button
            type="button"
            onClick={handleAddToCart}
            className="py-2 px-4 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg"
          >
            اضافة الي عربة التسوق
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCard;
