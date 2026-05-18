import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full border-b border-gray-800 bg-[#0B1120] sticky top-0 z-50 backdrop-blur-lg">

      <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">

        {/* Logo */}
        <div>
          <h1 className="text-3xl font-bold text-blue-400">
            FIR AI
          </h1>

          <p className="text-sm text-gray-400">
            AI Legal Intelligence Platform
          </p>
        </div>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8 text-gray-300">

          <a href="#features" className="hover:text-white transition">
            Features
          </a>

          <a href="#upload" className="hover:text-white transition">
            Upload
          </a>

          <a href="#results" className="hover:text-white transition">
            Results
          </a>

        </div>

        {/* Button */}
        <button className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-medium transition-all">
          Dashboard
        </button>

      </div>

    </nav>
  );
};

export default Navbar;