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
        // An error happened.
      });
  };
  return (
    <div>
      {" "}
      <nav>
        <p>Welcome Home</p>

        <div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
    </div>
  );
};

export default HomePage;
