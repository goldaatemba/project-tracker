import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

function Navbar({ isLoggedIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);

  const toggleMenu = () => setIsOpen(!isOpen);

  const studentLinks = [
    { name: "Projects", path: "/projects" },
    { name: "Cohorts", path: "/cohorts" },
    { name: "Profile", path: "/profile" },
  ];

  const linkClass =
    "text-white hover:text-yellow-400 px-4 py-2 font-medium";

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`bg-[#043873] shadow-md sticky top-0 z-50 transition-transform duration-300 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          ProjectBank
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          {studentLinks.map((link) => (
            <NavLink key={link.name} to={link.path} className={linkClass}>
              {link.name}
            </NavLink>
          ))}
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              className="bg-yellow-400 text-[#043873] px-4 py-2 rounded-lg hover:bg-yellow-300 font-semibold"
            >
              Login
            </NavLink>
          ) : (
            <NavLink to="/profile" className="text-white">
              <User size={24} />
            </NavLink>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-[#043873]">
          {studentLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-yellow-400 py-2 border-b border-white"
            >
              {link.name}
            </NavLink>
          ))}
          {!isLoggedIn ? (
            <NavLink
              to="/login"
              onClick={() => setIsOpen(false)}
              className="block text-[#043873] bg-yellow-400 rounded-lg px-4 py-2 text-center font-semibold"
            >
              Login
            </NavLink>
          ) : (
            <NavLink
              to="/profile"
              onClick={() => setIsOpen(false)}
              className="block text-white text-center"
            >
              <User size={24} className="mx-auto" />
              Profile
            </NavLink>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
