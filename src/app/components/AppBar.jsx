"use client";
import { IoSearch, IoClose } from "react-icons/io5";
import { BsPerson } from "react-icons/bs";
import { FaRegHeart } from "react-icons/fa";
import { RiMenu3Line } from "react-icons/ri";
import { MdOutlineShoppingCart } from "react-icons/md";
import { useState } from "react";
import Logo from "../assets/logo.png";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/Register";
import Link from "next/link";
import Image from "next/image";
import SideMenu from "../components/SideMenu";
import { useSelector } from "react-redux";
import useLogout from "./Logout";


function Appbar() {
  const performLogout = useLogout();
  const { token } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [signIn, setSignIn] = useState(true);
  const [search, setSearch] = useState(false);

  const handleLogOutUser = () => {
    setIsOpen(!isOpen);
    performLogout();
  };

  return (
    <>
      <nav className="bg-darkSlate flex flex-row items-center w-full h-16 gap-1">
        <div className="flex flex-row basis-auto sm:basis-1/3 justify-start gap-7 ml-3">
          <Link href="/cart">
            <div className="relative select-none">
              <MdOutlineShoppingCart className="text-textColor text-2xl h-6 w-6 cursor-pointer transition-transform duration-300 hover:scale-125" />
              <div className="absolute bottom-3 left-3 bg-red-600 rounded-full h-5 w-5 flex items-center justify-center text-white text-xs">
                1
              </div>
            </div>
          </Link>

          <Link href="/favorites">
            <FaRegHeart className="text-textColor text-2xl h-6 w-6 cursor-pointer transition-transform duration-300 hover:scale-125" />
          </Link>
          <BsPerson
            className="text-textColor text-2xl h-6 w-6  cursor-pointer transition-transform duration-300 hover:scale-125 hidden sm:block"
            onClick={() => setIsOpen(!isOpen)}
          />
          <IoSearch
            onClick={() => setSearch(true)}
            className="text-textColor text-2xl h-6 w-6 cursor-pointer transition-transform duration-300 hover:scale-125 hidden sm:block"
          />
        </div>
        <div className="flex basis-auto ml-auto sm:basis-1/3 justify-end gap-8">
          <Link href="/offers">
            <div className="text-textColor cursor-pointer group hidden sm:block">
              <span className="relative">
                <span>العروض</span>
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-textColor transition-all duration-300 transform scale-x-0 group-hover:scale-x-100" />
              </span>
            </div>
          </Link>
          <Link href="/products">
            <div className="text-textColor cursor-pointer group hidden sm:block">
              <span className="relative">
                <span>المنتجات</span>
                <span className="absolute left-0 right-0 -bottom-1 h-0.5 bg-textColor transition-all duration-300 transform scale-x-0 group-hover:scale-x-100" />
              </span>
            </div>
          </Link>
        </div>
        <div className="flex basis-auto sm:basis-1/3 justify-end bg-transparent">
          <Link href="/">
            <Image
              src={Logo}
              alt="Logo"
              width={96}
              height={96}
              priority
              className="h-24 w-24 p-0 m-0 select-none user-select-none bg-transparent"
            />
          </Link>
        </div>
        <div className="ml-auto gap-7 sm:hidden flex flex-row">
          <IoSearch
            onClick={() => setSearch(true)}
            className="text-textColor text-2xl cursor-pointer transition-transform duration-300 hover:scale-125"
          />
          <RiMenu3Line
            onClick={() => setIsOpen(!isOpen)}
            className="text-textColor text-2xl cursor-pointer transition-transform duration-300 hover:scale-125"
          />
        </div>
      </nav>

      <>
        <SideMenu isOpen={isOpen}>
          <IoClose
            onClick={() => setIsOpen(false)}
            className="text-black w-7 h-7 cursor-pointer"
          />
          {token ? (
            <>
              <div className={`w-auto text-right`}>
                <ul className="py-2 text-sm text-gray-700 ">
                  <li>
                    <Link
                      href={"/profile"}
                      className="block px-4 py-2 hover:bg-gray-100 text-xl"
                    >
                      حسابك
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/orders"}
                      className="block px-4 py-2 hover:bg-gray-100 text-xl "
                    >
                      طلباتك
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/addresses"}
                      className="block px-4 py-2 hover:bg-gray-100 text-xl"
                    >
                      عناوينك
                    </Link>
                  </li>
                </ul>
                <div className="h-[2px] bg-gray-200 w-full my-2"></div>

                <div
                  onClick={handleLogOutUser}
                  className="block px-4 py-2  text-gray-700 hover:bg-gray-100 text-xl cursor-pointer"
                >
                  تسجيل الخروج
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mt-10 flex flex-row gap-5 w-full">
                <div
                  onClick={() => setSignIn(false)}
                  className="text-black cursor-pointer group w-full flex justify-center"
                >
                  <span className="relative select-none user-select-none">
                    <span>انشاء حساب</span>
                    <span
                      className={`absolute left-0 right-0 -bottom-1 h-0.5 bg-darkSlate transition-all duration-300 transform scale-x-0 group-hover:scale-x-100
                        ${!signIn && "scale-x-100"}
                        `}
                    />
                  </span>
                </div>
                <div
                  onClick={() => setSignIn(true)}
                  className="text-black cursor-pointer group w-full flex justify-center"
                >
                  <span className="relative select-none user-select-none">
                    <span>تسجيل الدخول</span>
                    <span
                      className={`absolute left-0 right-0 -bottom-1 h-0.5 bg-darkSlate transition-all duration-300 transform scale-x-0 group-hover:scale-x-100 ${
                        signIn && "scale-x-100"
                      } `}
                    />
                  </span>
                </div>
              </div>
              {signIn ? <SignIn /> : <SignUp />}
            </>
          )}
        </SideMenu>
      </>
      <div
        className={`fixed bg-white top-0 text-textColor z-50 h-full w-[100%]  transition-transform duration-300 ${
          search ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex flex-col m-3 gap-7">
          <IoClose
            onClick={() => setSearch(false)}
            className="text-black w-7 h-7 cursor-pointer"
          />
          <div className="mt-10 flex flex-row gap-5 w-full">
            <div className="flex px-4 rounded-md items-center   border-darkSlate overflow-hidden mx-auto w-full">
              <input
                type="text"
                placeholder="البحث عن الاصناف..."
                dir="rtl"
                className="w-full outline-none bg-transparent border-t-0 border-x-0 border border-gray-300 text-gray-600 text-md text-right"
              />
              <IoSearch className="fill-gray-600 h-5 w-5 ml-3"></IoSearch>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Appbar;
