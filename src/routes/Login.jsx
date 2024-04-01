import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  };
  if (isLoading) return null;
  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <main>
      <section className="flex justify-center text-center">
        <div className="flex flex-col gap-4">
          <h3>Login</h3>
          <form>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <label htmlFor="email">Email address</label>
                <input
                  className="dark:bg-gray-800"
                  type="email"
                  label="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  name="email"
                  required
                  placeholder="Email address"
                  id="email"
                />
              </div>

              <div className="flex gap-4">
                <label htmlFor="password">Password</label>
                <input
                  className="dark:bg-gray-800"
                  type="password"
                  label="Create password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Password"
                  name="password"
                  id="password"
                />
              </div>

              <button className="border" type="submit" onClick={handleSubmit}>
                Sign In
              </button>
            </div>
          </form>

          <p>
            Don&apos;t have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
