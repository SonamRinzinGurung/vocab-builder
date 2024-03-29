import { signOut } from "firebase/auth";
import { auth } from "../firebase-config";
import { useNavigate } from "react-router-dom";
const HomePage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        localStorage.removeItem("user");
        navigate("/login");
        console.log("Signed out successfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <nav className="flex justify-end p-2">
        <div className="">
          <button className="border" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>
      <main>
        <p>Welcome Home</p>
      </main>
    </div>
  );
};

export default HomePage;
