import React from "react";

function Footer() {
  return (
    <footer className="bg-[#043873] text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Section 1: Brand */}
        <div>
          <h2 className="text-xl font-semibold text-[#FFE602] mb-2">
            Project Management System (Partnered with Moringa)
          </h2>
          <p className="text-sm text-gray-300">
            Student Showcase Hub<br />
            Showcasing the amazing projects and innovations from Moringa School students across all cohorts and tech stacks.
          </p>
        </div>

        {/* Section 2: Moringa School */}
        <div>
          <h3 className="text-lg text-[#FFE602] font-semibold mb-2">ProjectBank</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="/about" className="hover:underline">About Moringa</a></li>
            <li><a href="#" className="hover:underline">Courses</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/contact" className="hover:underline">Contact</a></li>
          </ul>
        </div>

        {/* Section 3: Projects */}
        <div>
          <h3 className="text-lg text-[#FFE602] font-semibold mb-2">Projects</h3>
          <ul className="space-y-1 text-sm text-gray-300">
            <li><a href="#" className="hover:underline">Submit Project</a></li>
            <li><a href="#" className="hover:underline">Browse Projects</a></li>
            <li><a href="#" className="hover:underline">Guidelines</a></li>
            <li><a href="#" className="hover:underline">Resources</a></li>
          </ul>
        </div>

        {/* Section 4: Connect */}
        <div>
          <h3 className="text-lg text-[#FFE602] font-semibold mb-2">Connect</h3>
          
          <p className="text-sm text-gray-300 mt-2">
            Built by <span className="text-[#FFE602] font-medium">Moringa Students</span>
          </p>
        </div>
      </div>
      <div><p className="text-sm text-gray-300">© 2025 ProjectBank. All rights reserved.</p></div>
    </footer>
  );
}

export default Footer;