import React from "react";

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-4">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div>
            <a href="/about" className="hover:underline">About us</a>
          </div>
          <div>
            <a href="/contact" className="hover:underline">Contact</a>
          </div>
          <div>
            <a href="/privacy" className="hover:underline">Privacy Policy</a>
          </div>
        </div>
        <div className="text-center mt-4 text-sm">
          &copy; 2025 Project Tracker · Built for Moringa School
        </div>
      </div>
    </footer>
  );
}

export default Footer;
