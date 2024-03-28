import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      let user = userCredentials.user;

      const userObj = {
        email: user.email,
        displayName: user.displayName,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      navigate("/");
      // console.log(user);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };

  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <main>
      <section>
        <div>
          <div>
            <h1> Vocab Builder </h1>
            <h3>Login</h3>
            <form>
              <div>
                <label htmlFor="email-address">Email address</label>
                <input
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Email address"
                />
              </div>

              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                />
              </div>

              <button type="submit" onClick={handleSubmit}>
                Sign In
              </button>
            </form>

            <p>
              Don&apos;t have an account? <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Login;
