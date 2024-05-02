import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import useAuth from "../hooks/useAuth";
import { ToastContainer, Slide } from "react-toastify";
import { CiLight, CiDark } from "react-icons/ci";
import ToolTip from "./ToolTip";

const NavBar = () => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const darkModeBtnRef = useRef(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, isLoading } = useAuth();

  let darkModeLocal = localStorage.getItem("darkMode");
  darkModeLocal = darkModeLocal?.toLowerCase() === "true";

  const [darkMode, setDarkMode] = useState(darkModeLocal || false);
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
              <div className="modal-body relative flex flex-col h-3/4 items-center mt-5">
                <Link
                  onClick={toggleMenu}
                  to={"/"}
                  className="w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2"
                >
                  <span className="font-subHead text-xl">Home</span>
                </Link>
                <Link
                  onClick={toggleMenu}
                  to={"/vocab-mountain"}
                  className="w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2"
                >
                  <span className="font-subHead text-xl">Vocab Mountain</span>
                </Link>
                <Link
                  onClick={toggleMenu}
                  to={"/vocab-valley"}
                  className="w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2"
                >
                  <span className="font-subHead text-xl">Vocab Valley</span>
                </Link>
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
        <div className="flex flex-col md:flex-row font-mono text-lg tracking-wide">
          {user && user.emailVerified && (
            <>
              <Link
                to="/"
                className="p-4 hover:bg-primary hover:text-gray-100 hidden lg:block"
              >
                Home
              </Link>
              <Link
                to="/vocab-mountain"
                className="p-4 hover:bg-primary hover:text-gray-100 hidden lg:block"
              >
                Vocab
              </Link>
              <Link
                to="/vocab-valley"
                className="p-4 hover:bg-primary hover:text-gray-100 hidden lg:block"
              >
                Valley
              </Link>
              <button
                className="p-4 hover:bg-primary hover:text-gray-100 hidden lg:block"
                onClick={handleLogout}
              >
                Logout
              </button>
              <button onClick={toggleMenu}>
                <div className="p-4 hover:bg-primary hover:text-gray-100 lg:hidden">
                  Menu
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="relative ml-auto mt-1 pr-4">
        <button onClick={toggleDarkMode} ref={darkModeBtnRef}>
          {darkMode ? <CiLight size="30" /> : <CiDark size="30" />}
          <ToolTip
            text={darkMode ? "switch to light" : "switch to dark"}
            contentRef={darkModeBtnRef}
            position="left"
          />
        </button>
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
