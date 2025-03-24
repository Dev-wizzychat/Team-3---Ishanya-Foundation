import React from "react";

const NavBar = () => {
  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 bg-[#001f3f] shadow-md z-10 h-20 flex items-center">
        <div className="max-w-1xl mx-auto px-6 py-2 flex justify-between items-center w-full">
          {/* Left section with logo */}
          <div className="flex items-center space-x-2">
            <span
              className="text-3xl font-bold text-gray-800 shadow-lg"
              style={{
                fontFamily: "Arial",
                color: "white",
                textShadow: "2px 2px 5px rgba(219, 219, 219, 0.5)",
              }}
            >
              ISHANAYA INDIA FOUNDATION
            </span>
          </div>

          {/* Right section with About, Contact, and Employee button */}
          <div className="flex space-x-8 text-white font-semibold py-8 ml-auto mt-5">
            <a href="#" className="hover:text-yellow-400">
              ABOUT ▼
            </a>
            <a href="#" className="hover:text-yellow-400">
              CONTACT US
            </a>
            <a
              href="/login"
              className="px-4 py-2 text-sm bg-red-700 text-white rounded-md hover:bg-gray-800 transition duration-300 flex items-center"
              style={{ height: "auto" }} // Adjust the button height
            >
              <b>For Employees</b>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
