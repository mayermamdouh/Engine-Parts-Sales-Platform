"use client";
import { useState } from "react";
import Link from "next/link";

const InformationCar = () => {
  // State for selected car brand, model, and year
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const carBrands = ["Toyota", "Ford", "BMW", "Mercedes", "MG"];
  const carModels = ["X6", "X6-G06", "X1", "X6-F16", "RX5"];
  const carYears = ["2018", "2025", "2024", "2019", "2021"];

  // Create the search path dynamically
  const searchPath = `/products?car=${selectedBrand}_${selectedModel}_${selectedYear}`;


  return (
    <div
      className={`flex flex-col 
        h-96 border-2 border-darkSlate
       rounded-lg`}
    >
      <div className="flex flex-col gap-5 p-5">
        <div className="text-center text-2xl">أدخل بيانات سيارتك</div>
        <form className="space-y-3">
          {/* Brand Selector */}
          <div className="relative select-none">
            <select
              id="carBrand"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="block w-full text-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 appearance-none"
            >
              <option value="" disabled>
                اختر ماركة السيارة
              </option>
              {carBrands.map((brand, index) => (
                <option key={index} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none px-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>
          <div className="relative select-none">
            <select
              id="carModel"
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="block w-full text-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 appearance-none"
            >
              <option value="" disabled>
                اختر موديل السيارة
              </option>
              {carModels.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none px-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Year Selector */}
          <div className="relative select-none">
            <select
              id="carYear"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="block w-full text-end px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-500 appearance-none"
            >
              <option value="" disabled>
                اختر سنة التصنيع
              </option>
              {carYears.map((year, index) => (
                <option key={index} value={year}>
                  {year}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none px-2">
              <svg
                className="w-4 h-4 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Search Button */}
          <div className="flex justify-center select-none">
            <Link href={searchPath}>
              <button
                type="button"
                className="py-2 cursor-pointer text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black w-40 transition ease-in duration-200 text-center text-base font-semibold shadow-md rounded-lg"
                disabled={!selectedBrand || !selectedModel || !selectedYear}
              >
                بحث
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InformationCar;
