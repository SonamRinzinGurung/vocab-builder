import { useState, useEffect, useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase-config";
import useAuth from "../../hooks/useAuth";
import { ToastContainer, Slide } from "react-toastify";
import { CiLight, CiDark, CiLogout } from "react-icons/ci";
import NavBarLinks from "./NavBarLinks";
import MobileNavBarLinks from "./MobileNavBarLinks";
import MenuModal from "../MenuModal";
import MenuItem from "../MenuItem";
import useWindowSize from "../../hooks/useWindowSize";
import MobileMenuModal from "../MobileMenuModal";
import { TfiStatsUp } from "react-icons/tfi";
import LevelDisplay from "./LevelDisplay";
import useUserStats from "../../hooks/useUserStats";

const NavBar = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth(); // custom hook to get the user and loading state
  const [menuOpen, setMenuOpen] = useState(false); // state to toggle the mobile menu
  const modalRef = useRef(null);
  const darkModeBtnRef = useRef(null);
  const profileBtnRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const { isMobile } = useWindowSize();
  const { userStats } = useUserStats(user?.uid);

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
                <MobileNavBarLinks toggleMenu={toggleMenu} />
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
              <NavBarLinks />
              <button onClick={toggleMenu}>
                <div className="p-4 bg-primary text-gray-100 lg:hidden">
                  Menu
                </div>
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex items-center mr-6 py-1 ml-auto gap-4">
        {user?.emailVerified ? (
          <>
            <LevelDisplay lifetimeXp={userStats?.lifetimeXp} />

          <button
            ref={profileBtnRef}
            className="relative cursor-pointer"
            onClick={() => setProfileOpen((prev) => !prev)}>
            <div>
              {user?.photoURL ? (
                <img src={user.photoURL} alt="profile" className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-semibold text-lg">
                  {user?.email?.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {profileOpen && !isMobile && (
              <MenuModal
                className={`z-50 top-12 right-1 w-52`}
                modalRef={profileBtnRef}
                setModal={setProfileOpen}
              >
                <MenuItem

                  content={
                    <Link to={"/stats"} className="flex items-center gap-2 w-full">
                      <TfiStatsUp size={30} /> View Stats
                    </Link>
                  }
                />

                <MenuItem

                  content={
                    <button onClick={toggleDarkMode} className="flex items-center gap-2 w-full" ref={darkModeBtnRef}>

                      {darkMode ? <>
                        <CiLight size="30" /> {"Light Mode"}
                      </> : <>
                        <CiDark size="30" /> {"Dark Mode"}
                      </>
                      }
                    </button>
                  }
                />
                <MenuItem

                  content={
                    <button className="flex items-center gap-2 w-full" onClick={handleLogout}>
                      <CiLogout size={30} />
                      Log out
                    </button>
                  }
                />
              </MenuModal>
            )}

            {isMobile && (
              <MobileMenuModal
                isOpen={profileOpen}
                setIsOpen={setProfileOpen}
                content={
                  <div className="flex flex-col gap-8">
                    <div className="flex w-full items-center justify-between">
                      <div className="text-xl font-medium">Menu Options</div>
                    </div>
                    <div className="flex flex-col gap-2">
                      <MenuItem

                        content={
                          <Link to={"/stats"} className="flex items-center gap-6 w-full">
                            <TfiStatsUp size={30} /> View Stats
                          </Link>
                        }
                      />

                      <MenuItem

                        content={
                          <button onClick={toggleDarkMode} className="flex items-center gap-6 w-full" ref={darkModeBtnRef}>

                            {darkMode ? <>
                              <CiLight size="30" /> {"Light Mode"}
                            </> : <>
                              <CiDark size="30" /> {"Dark Mode"}
                            </>
                            }
                          </button>
                        }
                      />
                      <MenuItem

                        content={
                          <button className="flex items-center gap-6 w-full" onClick={handleLogout}>
                            <CiLogout size={30} />
                            Log out
                          </button>
                        }
                      />
                    </div>
                  </div>
                }
              />
            )}

          </button>
          </>
        ) : (

          <div className="relative">
            <button onClick={toggleDarkMode} ref={darkModeBtnRef}>
              {darkMode ? <CiLight size="30" /> : <CiDark size="30" />}
            </button>
          </div>
        )}
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
