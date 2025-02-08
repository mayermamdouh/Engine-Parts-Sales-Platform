import { useState, useEffect } from "react";

const Address = ({ addressData, onUpdate, isOpen }) => {
  const [formState, setFormState] = useState({
    governorate: "",
    city: "",
    address: "",
    apartment: "",
    name: "",
  });

  useEffect(() => {
    if (isOpen && addressData) {
      setFormState({
        governorate: addressData.governorate || "",
        city: addressData.city || "",
        address: addressData.address || "",
        apartment: addressData.apartment || "",
        name: addressData.name || "",
      });
    } else if (!isOpen) {
      resetForm();
    }
  }, [isOpen, addressData]);

  const resetForm = () => {
    setFormState({
      governorate: "",
      city: "",
      address: "",
      apartment: "",
      name: "",
    });
  };

  const handleChange = (field, value) => {
    let updatedForm = { ...formState, [field]: value };

    if (field === "governorate") {
      updatedForm = { ...updatedForm, city: "", address: "", apartment: "" };
    } else if (field === "city") {
      updatedForm = { ...updatedForm, address: "", apartment: "" };
    }

    setFormState(updatedForm);
    onUpdate(updatedForm);
  };

  const cities = {
    سوهاج: ["البلينا", "جرجا", "طما", "ساقلته", "ديروط", "سوهاج ثاني"],
    قنا: ["دندرة", "قوص", "نجع حمادي", "الوقف"],
    اسيوط: ["البداري", "ديروط", "الغنايم", "القوصية"],
    المنيا: ["المنيا", "سمالوط", "مغاغة", "بني مزار"],
    بنيسويف: ["بني سويف", "الواسطى", "الفشن", "إهناسيا"],
    القاهرة: ["مصر الجديدة", "الزمالك", "العباسية", "المعادي"],
    الجيزة: ["الجيزة", "6 أكتوبر", "البدرشين", "أطفيح"],
    اسكندرية: ["سيدي بشر", "المندرة", "الكرملي", "جليم"],
    الغردقة: ["القصير", "سفاجا", "رأس غارب", "الغردقة"],
  };

  return (
    <div>
      <div className="flex flex-row-reverse gap-6 items-center flex-wrap mt-6">
        <div>
          <label
            htmlFor="governorate"
            className="block mb-2 text-md font-medium text-gray-900 text-right"
          >
            المحافظة
          </label>
          <div className="relative">
            <select
              id="governorate"
              value={formState.governorate}
              onChange={(e) => handleChange("governorate", e.target.value)}
              className="bg-gray-50 border-2 text-right max-w-80 min-w-48 text-gray-900 border-gray-300 focus:border-black outline-none text-sm rounded-lg block p-2.5 appearance-none"
            >
              <option value="">اختر المحافظة</option>
              {Object.keys(cities).map((gov, index) => (
                <option key={index} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2">
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
                />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="city"
            className="block mb-2 text-md font-medium text-gray-900 text-right"
          >
            المدينة
          </label>
          <div className="relative">
            <select
              id="city"
              value={formState.city}
              onChange={(e) => handleChange("city", e.target.value)}
              className="bg-gray-50 border-2 appearance-none text-right max-w-80 min-w-48 text-gray-900 border-gray-300 focus:border-black outline-none text-sm rounded-lg block p-2.5"
              disabled={!formState.governorate}
            >
              <option value="">المركز</option>
              {(cities[formState.governorate] || []).map(
                (cityOption, index) => (
                  <option key={index} value={cityOption}>
                    {cityOption}
                  </option>
                )
              )}
            </select>
            <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-2">
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
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Address Field */}
        <div>
          <label
            htmlFor="address"
            className="block mb-2 text-md font-medium text-gray-900 text-right"
          >
            العنوان
          </label>
          <input
            type="text"
            id="address"
            value={formState.address}
            onChange={(e) => handleChange("address", e.target.value)}
            className="bg-gray-50 border-2 text-right max-w-80 min-w-48 text-gray-900 border-gray-300 focus:border-black outline-none text-sm rounded-lg block p-2.5"
            placeholder="اضافة العنوان بالتفصيل"
          />
        </div>

        {/* Apartment Field */}
        <div>
          <label
            htmlFor="apartment"
            className="block mb-2 text-md font-medium text-gray-900 text-right"
          >
            الشقة
          </label>
          <input
            type="text"
            id="apartment"
            value={formState.apartment}
            onChange={(e) => handleChange("apartment", e.target.value)}
            className="bg-gray-50 border-2 text-right max-w-80 min-w-48 text-gray-900 border-gray-300 focus:border-black outline-none text-sm rounded-lg block p-2.5"
          />
        </div>

        {/* Full Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-md font-medium text-gray-900 text-right"
          >
            الاسم كامل
          </label>
          <input
            type="text"
            id="name"
            value={formState.name}
            onChange={(e) => handleChange("name", e.target.value)}
            className="bg-gray-50 border-2 text-right max-w-80 min-w-48 text-gray-900 border-gray-300 focus:border-black outline-none text-sm rounded-lg block p-2.5"
          />
        </div>
      </div>
    </div>
  );
};

export default Address;
