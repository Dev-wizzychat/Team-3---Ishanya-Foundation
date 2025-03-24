import React from "react";
import { FaTwitter, FaLinkedin, FaFacebook, FaYoutube } from "react-icons/fa";

const SocialSidebar = () => {
  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 flex flex-col space-y-3 z-50">
      <a
        href="http://www.twitter.com/ishanyaindia"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center bg-blue-400 text-white rounded-lg shadow-lg hover:bg-blue-500 transition"
      >
        <FaTwitter size={24} />
      </a>
      <a
        href="https://www.linkedin.com/company/ishanyaforinclusion"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center bg-blue-700 text-white rounded-lg shadow-lg hover:bg-blue-800 transition"
      >
        <FaLinkedin size={24} />
      </a>

      <a
        href="https://www.facebook.com/ishanyaforinclusion"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        <FaFacebook size={24} />
      </a>
      <a
        href="https://youtube.com/channel/UC1bQFruy88Y8DrgXt4oq3og"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 flex items-center justify-center bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition"
      >
        <FaYoutube size={24} />
      </a>
    </div>
  );
};

export default SocialSidebar;
