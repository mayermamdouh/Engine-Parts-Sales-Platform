"use client";
import React, {  useEffect, useMemo, useState } from "react";
import InformationCar from "../components/FilterCar";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import engine from "../assets/engine.webp";
import brake from "../assets/brakes.webp";
import tires from "../assets/kwatsh.webp";
import filtersAndOils from "../assets/oils.webp";
import ElectricalSysteam from "../assets/eelectrical.webp";
import suspension from "../assets/suspension.webp";
import lighting from "../assets/lights.webp";
import batteries from "../assets/batry.webp";
import Sparkplugs from "../assets/Sparkplugss.webp";
import accessories from "../assets/Accessories.webp";
import tires_Ratio from "../assets/tires_ratio.webp";
import ProductCard from "../components/ProductCard";
import CustomDropdown from "../components/Dropdown";
import axios from "axios";
import { PiEmptyLight } from "react-icons/pi";
import Loading from "../components/Loading";
import Message from "../components/Message";

export default function Product() {
  const Sections = [
    { image: accessories, text: "الإكسسوارات" },
    { image: Sparkplugs, text: "بوجيهات" },
    { image: batteries, text: "البطاريات" },
    { image: lighting, text: "الإضاءة" },
    { image: ElectricalSysteam, text: "النظام الكهربائي" },
    { image: suspension, text: "التعليق" },
    { image: filtersAndOils, text: "الزيوت" },
    { image: tires, text: "الإطارات والعجلات" },
    { image: brake, text: "الفرامل" },
    { image: engine, text: "قطع المحرك" },
  ];

  const categoryDropdowns = {
    Tires: [
      {
        key: "tiresBrand",
        nameField: "اختر الماركة",
        options: [
          "الكل",
          "ستار ماكس",
          "دنلوب",
          "كومهو",
          "جي تي",
          "نكسن",
          "هانكوك",
          "فايرستون",
          "بيريلي",
          "ميشلان",
          "بريدجستون",
        ],
      },
      {
        key: "tiresRimSize",
        nameField: "اختر مقاس الجنط",
        options: [
          "All",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
        ],
      },
      {
        key: "tiresHight",
        nameField: "اختر ارتفاع العجلة",
        options: ["All", "30", "35", "40", "45", "50", "55"],
      },
      {
        key: "tiresWidth",
        nameField: "اختر عرض العجلة",
        options: [
          "All",
          "205",
          "215",
          "220",
          "230",
          "235",
          "240",
          "245",
          "250",
        ],
      },
    ],
    Batteries: [
      {
        key: "batteriesBrand",
        nameField: "اختر الماركة",
        options: ["الكل", "اسديلكو", "فارتا", "كلورايد", "سباتكيس"],
      },
      {
        key: "batteriesAH",
        nameField: "أمبير-ساعة (AH)",
        options: ["All", "12", "55", "60"],
      },
    ],
    Oils: [
      {
        key: "oilsBrand",
        nameField: "اختر الماركة",
        options: [
          "الكل",
          "موتيل",
          "شيل",
          "مانول",
          "كاسترول",
          "توتال",
          "موبيس",
          "موبيل",
        ],
      },
      {
        key: "oilsViscosity",
        nameField: "اختر اللزوجة",
        options: [
          "All",
          "0W-20",
          "0W-30",
          "0W-40",
          "5W-20",
          "5W-30",
          "5W-40",
          "5W-50",
          "10W-30",
          "10W-40",
          "10W-50",
          "15W-40",
          "15W-50",
          "20W-50",
        ],
      },
    ],
    Spark_Plugs: [
      {
        key: "sparkPlugsBrand",
        nameField: "اختر الماركة",
        options: ["الكل", "ان جي كيه", "موبيس", "دينسو", "بوش"],
      },
    ],
    Accessories: [
      {
        key: "accessoriesType",
        nameField: "اختر الصنف",
        options: ["دواسات", "غطاء عجلة قيادة", "غطاء سيارة", "شاشات"],
      },
    ],
    Engine_Parts: [
      {
        key: "carBrand",
        nameField: "اختر ماركة السيارة",
        options: ["All", "BMW", "MG"],
      },
      {
        key: "carModel",
        nameField: "اختر موديل السيارة",
        options: ["All", "X6-F16", "RX5", "X6-G06"],
      },
      {
        key: "carYear",
        nameField: "اختر سنة التصنيع",
        options: ["All", "2023", "2019", "2020"],
      },
    ],
  };

  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const carName = searchParams.get("car");
  const [message, setMessage] = useState("");

  const [selectedIndex, setSelectedIndex] = useState(Sections.length - 1);
  const [categoryData, setCategoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noProduct, setNoProduct] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  const [totalPages, setTotalPage] = useState();

  const handleSelectSection = (index) => {
    setSelectedIndex(index);
  };

  // useEffect should be called unconditionally
  useEffect(() => {
    if (!category) return;
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/products?category=${category.toUpperCase()}&page=${1}`
        );
        setCategoryData(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch data");
        setLoading(false);
      }
    };
    fetchData();
  }, [category]);

  const [filters, setFilters] = useState({});
  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  const filteredProducts = useMemo(() => {
    return (
      categoryData.data?.products?.filter((product) => {
        if (category === "Batteries") {
          const filterByBrand =
            !filters.batteriesBrand ||
            filters.batteriesBrand === "الكل" ||
            product.brand === filters.batteriesBrand;

          const filterByAH =
            !filters.batteriesAH ||
            filters.batteriesAH === "All" ||
            product.ah == filters.batteriesAH;
          return filterByBrand && filterByAH;
        } else if (category === "Oils") {
          const filterByBrandOils =
            !filters.oilsBrand ||
            filters.oilsBrand === "الكل" ||
            product.brand === filters.oilsBrand;

          const filterByViscosity =
            !filters.oilsViscosity ||
            filters.oilsViscosity === "All" ||
            product.viscosity === filters.oilsViscosity;
          return filterByBrandOils && filterByViscosity;
        } else if (category === "Spark_Plugs") {
          const filterByBrandSpark =
            !filters.sparkPlugsBrand ||
            filters.sparkPlugsBrand === "الكل" ||
            product.brand === filters.sparkPlugsBrand;
          return filterByBrandSpark;
        } else if (category === "Tires") {
          const filterByBrand =
            !filters.tiresBrand ||
            filters.tiresBrand === "الكل" ||
            product.brand === filters.tiresBrand;

          const filterByRimSize =
            !filters.tiresRimSize ||
            filters.tiresRimSize === "All" ||
            product.rimhightwidth.split("/")[0] === filters.tiresRimSize;

          const filterByHight =
            !filters.tiresHeight ||
            filters.tiresHeight === "All" ||
            product.rimhightwidth.split("/")[1] === filters.tiresHeight;

          const filterByWidth =
            !filters.tiresWidth ||
            filters.tiresWidth === "All" ||
            product.rimhightwidth.split("/")[2] === filters.tiresWidth;
          return (
            filterByBrand && filterByRimSize && filterByHight && filterByWidth
          );
        } else if (category === "Engine_Parts") {
          // Extract car details
          const carDetails = product.car.split("/"); // Split by '/'
          const carBrand = carDetails[0]; // e.g., "MG"
          const carModel = carDetails[1]; // e.g., "RX6"
          const carYearOrRange = carDetails[2]; // e.g., "2020-2025"

          // Check if filters are applied
          const filterBrandMatch =
            !filters.carBrand ||
            filters.carBrand === "All" ||
            carBrand === filters.carBrand;
          const filterModelMatch =
            !filters.carModel ||
            filters.carModel === "All" ||
            carModel === filters.carModel;

          const filterYearMatch = (() => {
            if (!filters.carYear || filters.carYear === "All") return true;
            const filterYear = Number(filters.carYear);

            if (carYearOrRange.includes("-")) {
              const cleanYearRange = carYearOrRange.replace(/[()]/g, "");
              const [startYear, endYear] = cleanYearRange.split("-");
              return filterYear >= startYear && filterYear <= endYear;
            } else {
              return Number(carYearOrRange) === filterYear;
            }
          })();

          const filterEnginePartsProducts =
            filterBrandMatch && filterModelMatch && filterYearMatch;

          return filterEnginePartsProducts;
        }
      }) || []
    );
  }, [categoryData, category, filters]);

  useEffect(() => {
    setNoProduct(filteredProducts.length === 0);
  }, [filteredProducts]);

  const renderDropdowns = (category) =>
    categoryDropdowns[category]?.map((dropdown) => {
      let isDisabled = false;
      if (category === "Tires") {
        if (dropdown.key === "tiresHight" || dropdown.key === "tiresWidth") {
          const selectedRimSize = filters["tiresRimSize"];
          isDisabled = !selectedRimSize || selectedRimSize === "All";
        }
      }
      if (category === "Engine_Parts") {
        if (dropdown.key === "carModel" || dropdown.key === "carYear") {
          const selectedCarBrand = filters["carBrand"];
          isDisabled = !selectedCarBrand || selectedCarBrand === "All";
        }
      }
      return (
        <CustomDropdown
          key={dropdown.key}
          options={dropdown.options}
          nameField={dropdown.nameField}
          onSelect={(value) => handleFilterChange(dropdown.key, value)}
          disabled={isDisabled}
        />
      );
    });

  if (category && loading) return <Loading />;

  return (
    <div>
      <Message message={message} setMessage={setMessage} />
      {category && (
        <div className="text-3xl text-center my-10">{`${
          category.includes("_") ? category.replace("_", " ") : category
        }`}</div>
      )}

      {carName ? (
        <>
          <div className="flex justify-center flex-col items-center">
            <div className="flex justify-center items-center mt-14 p-5 text-white bg-darkSlate text-xl mb-10 h-14 w-1/2 sm:w-1/3  rounded-lg">
              {carName}
            </div>
            <div className="w-full px-3 flex gap-2 flex-row overflow-x-auto whitespace-nowrap border border-gray-200 p-3">
              {Sections.map((section, index) => (
                <div
                  onClick={() => handleSelectSection(index)}
                  key={index}
                  className={`flex flex-row justify-end border cursor-pointer relative rounded-md min-w-36 max-w-44 ${
                    selectedIndex === index
                      ? "border-red-500 border-2"
                      : "border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2 px-2 py-1 ">
                    <div className="text-sm text-black select-none">
                      {section.text}
                    </div>
                    <Image
                      src={section.image}
                      alt="images"
                      loading="lazy"
                      className="h-5 w-5 object-cover rounded-md flex-shrink-0"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : category === "Engine_Parts" ? (
        <div className="flex flex-wrap flex-row-reverse items-center justify-center gap-3 border-y border-gray-200 p-5 w-full rounded-sm">
          {renderDropdowns(category)}
        </div>
      ) : category === "Tires" ? (
        <div>
          <div className="flex items-center justify-center mb-5">
            <Image
              src={tires_Ratio}
              alt="tires_Ratio"
              loading="lazy"
              className="object-fill h-80 w-96"
            />
          </div>
          <div className="flex flex-wrap flex-row-reverse items-center justify-center gap-3 border-y border-gray-200 p-5 w-full rounded-sm">
            {renderDropdowns(category)}
          </div>
        </div>
      ) : category === "Batteries" ? (
        <div className="flex items-center justify-center mb-5">
          <div className="flex flex-wrap  flex-row-reverse items-center justify-center gap-3 border-y border-gray-200 p-5 w-full rounded-sm">
            {renderDropdowns(category)}
          </div>
        </div>
      ) : category === "Accessories" ? (
        <div className="flex items-center justify-center mb-5">
          <div className="flex flex-wrap  flex-row-reverse items-center justify-center gap-3 border-y border-gray-200 p-5 w-full rounded-sm">
            {renderDropdowns(category)}
          </div>
        </div>
      ) : category === "Oils" ? (
        <div className="flex items-center justify-center mb-5">
          <div className="flex flex-wrap  flex-row-reverse items-center justify-center gap-3 border-y border-gray-200 p-5 w-full rounded-sm">
            {renderDropdowns(category)}
          </div>
        </div>
      ) : category === "Spark_Plugs" ? (
        <div className="flex items-center justify-center mb-5">
          <div className="flex flex-wrap  flex-row-reverse items-center justify-center gap-3 border-y border-gray-200 p-5 w-full rounded-sm">
            {renderDropdowns(category)}
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="flex flex-col  items-center justify-center">
        {noProduct && (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-5">
            <PiEmptyLight className="text-secondColor h-[80%] w-[80%]" />
            <div className="text-gray-500 font-bold">
              {" "}
              لا توجد منتجات مطابقة لخيارات التصفية
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 justify-items-center">
          {filteredProducts.map((product, index) => (
            <div key={index} className="w-full">
              <ProductCard
                image={`http://localhost:3001/uploads/${product.photo}`}
                price={`${product.price} EGY`}
                name={product.name}
                brand={product.brand}
                productId={product._id}
                setMessage={setMessage}
              />
            </div>
          ))}
        </div>
        <nav className="my-4">
          <ul className="inline-flex -space-x-px text-sm">
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 hover:text-gray-700 "
              >
                Previous
              </a>
            </li>
            {[1, 2, 3].map((page, index) => (
              <li key={index}>
                <a
                  href="#"
                  className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 "
                >
                  {page}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#"
                className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 hover:text-gray-700 "
              >
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
