import { FaFacebook } from "react-icons/fa";
import { AiFillInstagram, AiFillTikTok } from "react-icons/ai";
const Footer = () => {
     return (
    <>
      <div className="bg-darkSlate flex flex-col h-auto items-center justify-center">
        <div className="text-white text-xl mt-5">
          ليصلك كل عروضنا الحصرية على رقمك
        </div>
        <div className="flex flex-row justify-center px-10 mt-7 gap-3 w-full ">
          <input
            type="tel"
            id="phone"
            className=" w-full max-w-[400px] bg-gray-50 border-2 text-gray-900 border-gray-300 outline-none text-sm rounded-lg p-2.5"
            placeholder="Enter your phone number"
            maxLength="11"
            minLength="11"
            pattern="^(010|011|012|015)\d{8}$"
            required
          />

          <button className="max-w-32 h-11 min-w-20 bg-transparent border border-white rounded-md text-white hover:bg-white hover:text-darkSlate transition duration-300">
            اشتراك
          </button>
        </div>
        <div className="h-[1px] w-[80%] bg-white mt-10"></div>
        <div className="flex flex-row-reverse flex-wrap  justify-between w-full items-start  p-5">
          <div className="flex flex-col text-center gap-2 basis-1/4">
            <div className="text-white mb-4">خدمة العملاء</div>
            <div className="text-gray-400 cursor-pointer">الشروط والأحكام</div>
            <div className="text-gray-400  cursor-pointer">عملية الدفع</div>
          </div>
          <div className="flex flex-col text-center gap-2 basis-1/4">
            <div className="text-white mb-4">إيتوم</div>
            <div className="text-gray-400 cursor-pointer">تعرف علينا</div>
            <div className="text-gray-400  cursor-pointer">
              الشراء عن طريق التطبيق
            </div>
          </div>
          <div className="flex flex-col text-center gap-2 basis-1/4">
            <div className="text-white mb-4">تواصل معنا</div>
            <div className="text-gray-400 cursor-pointer">
              {" "}
              WhatsApp +20 150 171 8113
            </div>
          </div>
          <div className="flex flex-col gap-2 text-center text-white basis-1/4">
            <div className="mb-4"> تابع</div>
            <div className="flex flex-row-reverse gap-3 justify-center">
              <FaFacebook className="h-7 w-7 text-white cursor-pointer hover:text-blue-600" />
              <AiFillInstagram className="h-7 w-7 text-white cursor-pointer hover:text-pink-500" />
              <AiFillTikTok className="h-7 w-7 text-white cursor-pointer hover:text-black" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;