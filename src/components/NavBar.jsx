import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import useAuth from "../hooks/useAuth";
const NavBar = () => {
  const navigate = useNavigate();
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

  if (isLoading) {
    return null;
  }

  return (
    <nav className="flex justify-between p-2 border dark:border-none">
      <div className="flex gap-4 flex-col md:flex-row">
        {user && (
          <>
            <div>
              <Link to={"/"}>Home</Link>
            </div>
            <div>
              <Link to={"/vocab-mountain"}>Vocab</Link>
            </div>
          </>
        )}
      </div>
      <div className="mx-auto">
        <Link to={"/"}>Vocab Builder</Link>
      </div>
      <div className="flex gap-4 flex-col md:flex-row">
        <div className="">
          <button onClick={toggleDarkMode}>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
        {user && (
          <div className="">
            <button className="" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
