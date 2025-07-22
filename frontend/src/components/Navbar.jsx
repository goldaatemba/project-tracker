import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
  const [visible, setVisible] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      console.warn("No token found.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/logout", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        navigate("/login");
      } else {
        const data = await res.json();
        console.error("Logout failed:", data);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const linkClass = "text-white hover:text-yellow-400 px-4 py-2 font-medium";

  const studentLinks = [
    { name: "Projects", path: "/projects" },
    { name: "Cohorts", path: "/cohorts" },
  ];

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
        <img src="/logo.png" alt="Logo" className="h-10 w-auto" />
        <Link to="/" className="text-2xl font-bold text-white tracking-tight">
          ProjectBank
        </Link>

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
            <>
              <NavLink to="/profile" className="text-white">
                <User size={24} />
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-400 font-semibold"
              >
                Logout
              </button>
            </>
          )}
        </div>

        <button
          className="md:hidden text-white focus:outline-none"
          onClick={toggleMenu}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-[#043873]">
          {studentLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-white hover:text-yellow-400 py-2 text-center border-b border-white w-full"
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
            <>
              <NavLink
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="block text-white text-center"
              >
                <User size={24} className="mx-auto" />
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-white text-center bg-red-500 rounded-lg px-4 py-2 font-semibold hover:bg-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
