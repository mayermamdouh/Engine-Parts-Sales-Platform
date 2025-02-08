import React from "react";

const SideMenu = ({ isOpen, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0  bg-darkSlate opacity-50 z-40 " />
      )}
      <div
        className={`fixed bg-white right-0 top-0 text-textColor z-50 h-full w-[70%] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col m-3 gap-7">{children}</div>
      </div>
    </>
  );
};

export default SideMenu;
