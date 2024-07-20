import { useState, useEffect, useCallback, useRef } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import useAuth from "../hooks/useAuth";
import { ToastContainer, Slide } from "react-toastify";
import { CiLight, CiDark, CiLogout } from "react-icons/ci";
import ToolTip from "./ToolTip";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth(); // custom hook to get the user and loading state
  const [menuOpen, setMenuOpen] = useState(false); // state to toggle the mobile menu
  const modalRef = useRef(null);
  const darkModeBtnRef = useRef(null);
  const logoutBtnRef = useRef(null);

  let darkModeLocal = localStorage.getItem("darkMode");
  darkModeLocal = darkModeLocal?.toLowerCase() === "true";

  const [darkMode, setDarkMode] = useState(darkModeLocal || false); // state to toggle dark mode

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        navigate("/login");
      })
      .catch((error) => {
        console.log(error);
      });
    setMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
    localStorage.setItem("darkMode", !darkMode);
  };

  // set the dark mode class on the html
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => !prev);
  }, [setMenuOpen]);

  // close the mobile menu when clicked outside the menu
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        toggleMenu();
      }
    }
    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [toggleMenu]);

  if (isLoading) {
    return null;
  }

  return (
    <nav className="flex justify-between items-center">
      {menuOpen && (
        <section className="fixed inset-0 outline-none z-10">
          <div className="relative h-full mt-14">
            <div
              ref={modalRef}
              className="relative w-full h-full bg-gray-700 text-gray-100 "
            >
              <div className="flex justify-between p-4">
                <div></div>
                <button
                  fontSize="large"
                  color="error"
                  onClick={toggleMenu}
                  className=" px-4 py-1 hover:bg-[#f0f4f8] rounded-sm hover:text-red-700"
                >
                  <div className="font-bold text-2xl">x</div>
                </button>
              </div>
              <div className="mobile-nav-links relative flex flex-col h-3/4 items-center mt-5">
                <NavLink
                  onClick={toggleMenu}
                  to={"/"}
                  className={({ isActive }) =>
                    `w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2 ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                  }
                >
                  <span className="font-subHead text-xl">Vocab Builder</span>
                </NavLink>
                <NavLink
                  onClick={toggleMenu}
                  to={"/vocab-mountain"}
                  className={({ isActive }) =>
                    `w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2 ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                  }
                >
                  <span className="font-subHead text-xl">Vocab Mountain</span>
                </NavLink>
                <NavLink
                  onClick={toggleMenu}
                  to={"/vocab-valley"}
                  className={({ isActive }) =>
                    `w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2 ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                  }
                >
                  <span className="font-subHead text-xl">Vocab Valley</span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="w-full pl-8 py-4  text-gray-100 hover:bg-[#f8f0f0] hover:text-red-700 border-b-2 text-left"
                >
                  <span className="font-subHead text-xl">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
      <div className="flex items-center">
        <div className="mx-2">
          <Link to="/">
            <div className="font-logo text-primary flex flex-col text-xl tracking-wider items-center">
              <div>vocab</div>
              <div className="-mt-3">builder</div>
            </div>
          </Link>
        </div>
        <div className="nav-links flex flex-col md:flex-row font-mono text-lg tracking-wide">
          {user?.emailVerified && (
            <>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `p-4 hover:bg-primary hover:text-gray-100 hidden lg:block ${isActive ? "text-gray-100 bg-primary" : ""
                  }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/vocab-mountain"
                className={({ isActive }) =>
                  `p-4 hover:bg-primary hover:text-gray-100 hidden lg:block ${isActive ? "text-gray-100 bg-primary" : ""
                  }`
                }
              >
                Mountain
              </NavLink>
              <NavLink
                to="/vocab-valley"
                className={({ isActive }) =>
                  `p-4 hover:bg-primary hover:text-gray-100 hidden lg:block ${isActive ? "text-gray-100 bg-primary" : ""
                  }`
                }
              >
                Valley
              </NavLink>

              <button onClick={toggleMenu}>
                <div className="p-4 hover:bg-primary hover:text-gray-100 lg:hidden">
                  Menu
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center mr-4 py-1 ml-auto">
        {user?.emailVerified && (
          <div className="relative ml-auto mr-6 hidden lg:block">
            <button ref={logoutBtnRef} onClick={handleLogout}>
              <CiLogout size={30} />
              <ToolTip
                text="logout"
                contentRef={logoutBtnRef}
                position="left"
              />
            </button>
          </div>
        )}
        <div className="relative">
          <button onClick={toggleDarkMode} ref={darkModeBtnRef}>
            {darkMode ? <CiLight size="30" /> : <CiDark size="30" />}
          </button>
        </div>
      </div>

      <ToastContainer
        theme={darkMode ? "dark" : "light"}
        position="bottom-right"
        autoClose={3500}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        transition={Slide}
      />
    </nav>
  );
};

export default NavBar;
