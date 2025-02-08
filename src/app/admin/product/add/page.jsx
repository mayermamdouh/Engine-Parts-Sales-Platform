"use client";
import CustomDropdown from "@/app/components/Dropdown";
import Message from "@/app/components/Message";
import InputField from "@/app/components/InputField";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { CiImageOn } from "react-icons/ci";
import axios from "axios";
export default function AddProduct() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [message, setMessage] = useState("");

  // New state for input values and errors
  const [formData, setFormData] = useState({
    price: "",
    name: "",
    brand: "",
    car: "",
    photo: "",
    category: "",
    profitRate: "",
    ah: "",
    viscosity: "",
    rimhightwidth: '',
  });
  const [errors, setErrors] = useState({});

  // Handle file drop
  const handleFileChange = useCallback((file) => {
    setFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
      setFormData((prev) => ({
        ...prev,
        ["photo"]: URL.createObjectURL(file),
      }));
    }
  }, []);

  const handleDrop = useCallback(
    (event) => {
      event.preventDefault();
      const droppedFile = event.dataTransfer.files[0];
      if (droppedFile) {
        handleFileChange(droppedFile);
      }
    },
    [handleFileChange]
  );

  const handleFileSelect = useCallback(
    (event) => {
      const selectedFile = event.target.files[0];
      if (selectedFile) {
        handleFileChange(selectedFile);
      }
    },
    [handleFileChange]
  );

  const handleRemovePhoto = useCallback(() => {
    setFile(null);
    setPreview(null);
  }, []);

  const handleSelectOptions = useCallback((option) => {
    setSelectedOption(option);
  }, []);

  const handleInputvalue = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Validate form inputs
  const validateForm = () => {
    const newErrors = {};

    // Common validation
    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number.";
    }

    if (
      !formData.profitRate ||
      isNaN(formData.profitRate) ||
      Number(formData.profitRate) <= 0
    ) {
      newErrors.profitRate = "Profit Rate must be a positive number.";
    }
    if (preview === null) {
      newErrors.photo = "You should upload a photo.";
    }

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = "Name must be at least 3 characters.";
    }

    // Conditional validation based on selected option
    if (selectedOption === "ENGINE_PARTS" || selectedOption === "SPARK_PLUGS") {
      if (!formData.car || formData.car.length < 3) {
        newErrors.car = "Car must be at least 3 characters.";
      }
    }
    if (selectedOption === "BATTERIES") {
      if (!formData.ah || isNaN(formData.ah) || Number(formData.ah) <= 0) {
        newErrors.ah = "Ah must be a positive number.";
      }
    }
    if (selectedOption === "OILS") {
      if (!formData.viscosity || formData.viscosity.length < 3) {
        newErrors.viscosity = "Viscosity must be at least 3 letters";
      }
    }
    if (selectedOption === "TIRES") {
      if (!formData.rimhightwidth || formData.rimhightwidth.length < 3) {
        newErrors.rimhightwidth =
          "Rim , Hight and  Width must be a 3 cheracters.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // console.log("selectedOption: ", selectedOption);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.log("Errors: ", errors);
      // alert("Please fix the errors before submitting.");
      return;
    }
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("price", formData.price);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("car", formData.car);
      formDataToSend.append("category", selectedOption);
      formDataToSend.append("profitRate", formData.profitRate);
      formDataToSend.append("ah", formData.ah);
       formDataToSend.append("viscosity", formData.viscosity);
       formDataToSend.append("rimhightwidth", formData.rimhightwidth);
      if (file) formDataToSend.append("photo", file);

      await axios.post(`http://localhost:3001/products`, formDataToSend);

      setMessage("Product added successfully!");
      setFormData({
        price: "",
        name: "",
        brand: "",
        car: "",
        photo: "",
        category: "",
        profitRate: "",
        ah: "",
        viscosity: "",
        rimhightwidth:"",
      });
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Error updating product:", err);
      alert("Failed to update product. Please try again.");
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    const timeout = setTimeout(() => {
      setMessage("");
    }, 3000);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="">
        <Message message={message} setMessage={setMessage}/>
        <div
          className="h-60 w-3/4 border-2 mx-auto border-dashed bg-gray-100 border-gray-400 flex items-center justify-center my-5 rounded-md shadow-lg relative"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-contain w-full h-full p-3 rounded-lg"
            />
          ) : (
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center cursor-pointer w-full h-full m-5"
            >
              <CiImageOn className="h-20 w-20" />
              <p className="text-gray-500 select-none ">
                Drag and drop a photo, or click to select from your device
              </p>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
          )}
        </div>
        <div className="flex flex-col gap-4 items-center justify-center mb-10">
          {errors.photo && (
            <p className="text-red-600 text-sm">{errors.photo}</p>
          )}
          <button
            type="button"
            onClick={handleRemovePhoto}
            className="py-1 w-1/6 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg"
          >
            Remove photo
          </button>
        </div>
        <div className="flex flex-col border-2 rounded-md w-3/4 mx-auto border-gray-200 p-4">
          <div className="flex flex-row items-center justify-between">
            <div className="text-md font-bold text-center">New Product</div>
            <CustomDropdown
              options={[
                "ENGINE_PARTS",
                "TIRES",
                "OILS",
                "SPARK_PLUGS",
                "BATTERIES",
              ]}
              nameField="اختر الفئة"
              onSelect={handleSelectOptions}
              // initialValue={formData.category}
            />
          </div>
          <div className="flex flex-col">
            <div>{file?.type}</div>
            {file ? (
              <>
                <div>
                  {(file.size / 1024).toFixed(2)} KB /{" "}
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </div>
              </>
            ) : (
              <>
                <div>no photo selected</div>
              </>
            )}
            <div className="mt-7 flex gap-3 flex-col">
              {(selectedOption === "ENGINE_PARTS" ||
                selectedOption === "SPARK_PLUGS") && (
                <>
                  <InputField
                    labelName="Car"
                    value={formData.car}
                    onChange={(value) => handleInputvalue("car", value)}
                    type="text"
                    placeholder="Add all car can use this exp --> BMW X6-G06 (2020 - 2024) | BMW 550i-F10 (2020 - 2024) and so on..."
                  />
                  {errors.car && (
                    <p className="text-red-600 text-sm">{errors.car}</p>
                  )}
                </>
              )}
              {selectedOption === "BATTERIES" && (
                <>
                  <InputField
                    labelName="AH"
                    value={formData.ah}
                    onChange={(value) => handleInputvalue("ah", value)}
                    type="number"
                    placeholder="Enter product ah"
                  />
                  {errors.ah && (
                    <p className="text-red-600 text-sm">{errors.ah}</p>
                  )}
                </>
              )}
              {selectedOption === "OILS" && (
                <>
                  <InputField
                    labelName="Viscosity"
                    value={formData.viscosity}
                    onChange={(value) => handleInputvalue("viscosity", value)}
                    type="text"
                    placeholder="Enter product viscosity"
                  />
                  {errors.viscosity && (
                    <p className="text-red-600 text-sm">{errors.viscosity}</p>
                  )}
                </>
              )}
              {selectedOption === "TIRES" && (
                <>
                  <InputField
                    labelName="Rim and higth width"
                    value={formData.rimhightwidth}
                    onChange={(value) =>
                      handleInputvalue("rimhightwidth", value)
                    }
                    type="text"
                    placeholder="Rim/Hight/Width"
                  />
                  {errors.rimhightwidth && (
                    <p className="text-red-600 text-sm">
                      {errors.rimhightwidth}
                    </p>
                  )}
                </>
              )}
              <InputField
                labelName="Name"
                value={formData.name}
                onChange={(value) => handleInputvalue("name", value)}
                type="text"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm">{errors.name}</p>
              )}
              <InputField
                labelName="Price"
                value={formData.price}
                onChange={(value) => handleInputvalue("price", value)}
                type="number"
                placeholder="Enter price"
              />
              {errors.price && (
                <p className="text-red-600 text-sm">{errors.price}</p>
              )}
              <InputField
                labelName="Profit Rate"
                value={formData.profitRate}
                onChange={(value) => handleInputvalue("profitRate", value)}
                type="number"
                placeholder="Enter profit rate"
              />
              {errors.profitRate && (
                <p className="text-red-600 text-sm">{errors.profitRate}</p>
              )}
              <InputField
                value={formData.brand}
                labelName="Brand"
                onChange={(value) => handleInputvalue("brand", value)}
                type="text"
                placeholder="Enter product brand"
              />
              {errors.brand && (
                <p className="text-red-600 text-sm">{errors.brand}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center mb-10">
          <button
            type="submit"
            className="py-1 my-5 w-1/4 text-white bg-secondColor hover:bg-transparent border hover:border-black hover:text-black transition ease-in duration-100 text-center text-base font-semibold shadow-md rounded-lg"
          >
            Add Product
          </button>
        </div>
      </div>
    </form>
  );
}
