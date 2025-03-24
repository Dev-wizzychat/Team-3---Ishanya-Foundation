import React from "react";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
const Footer = () => {
  return (
    <div>
      <footer id="foot" className="bg-gray-800 text-white py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-500 text-center">
                Are You A Student?
              </h3>
              <ul>
                <li>
                  <a href="#" className="hover:text-yellow-400">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-yellow-400">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="/login" className="hover:text-yellow-400">
                    For Employees
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-orange-500 text-center">
                ISHANAYA INDIA FOUNDATION
              </h3>
              <p className="text-gray-400">
                Ishanya India Foundation (IIF) is a registered trust under the
                Karnataka Trust Registration Act
              </p>
            </div>
            <div className="mt-6 md:mt-0">
              <h3 className="text-lg font-semibold mb-4 text-orange-500 text-center">
                Contact Us
              </h3>
              <address className="not-italic text-gray-400">
                <div className="flex items-center mb-2">
                  <MdLocationOn className="text-orange-500 mr-2" />
                  <span>
                    769, 7th Main Rd, KSRTC Layout, 2nd Phase, JP Nagar,
                    Bengaluru, Karnataka 560078
                  </span>
                </div>
                <div className="flex items-center mb-2">
                  <MdEmail className="text-orange-500 mr-2" />
                  <span>info@ishanyaindia.org</span>
                </div>
                <div className="flex items-center">
                  <MdPhone className="text-orange-500 mr-2" />
                  <span>+91 73496 76668</span>
                </div>
              </address>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            &copy; {new Date().getFullYear()} Ishanya. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
