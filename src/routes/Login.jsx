import { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase-config";
import { Link, Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useSetTitle from "../hooks/useSetTitle";
import { toast } from "react-toastify";
import loginImg from "../assets/bibliophile.svg";
import GoogleAuthBtn from "../components/GoogleAuthBtn";

const Login = () => {
  useSetTitle("Login");
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
      const errorMessage = error.message;
      toast.error(errorMessage);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (isLoading) return null;
  if (user) {
    return <Navigate to={"/"} />;
  }

  return (
    <main className="my-10">
      <section className="flex justify-around text-center">
        <div className="hidden lg:block">
          <img src={loginImg} alt="login" className="w-96" />
        </div>
        <div className="flex flex-col gap-8 self-center">
          <h1 className="font-heading font-bold">Login</h1>
          <form>
            <div className="flex flex-col gap-6 justify-between">
              <div className="flex gap-4">
                <label
                  htmlFor="email"
                  className="font-subHead font-semibold text-lg"
                >
                  Email address
                </label>
                <input
                  className="dark:bg-gray-800 rounded-sm px-1 lg:text-lg"
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

              <div className="flex gap-4 justify-between">
                <label
                  htmlFor="password"
                  className="font-subHead font-semibold text-lg"
                >
                  Password
                </label>
                <input
                  className="dark:bg-gray-800 rounded-sm px-1 lg:text-lg"
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
              <div className="flex justify-center rounded-sm shadow-md bg-primary hover:shadow-lg h-8">
                <button
                  className="text-lg font-medium text-gray-100"
                  type="submit"
                  onClick={handleSubmit}
                >
                  Sign In
                </button>
              </div>
            </div>
          </form>

          <hr className="border dark:border-gray-500" />
          <GoogleAuthBtn handleGoogleSignIn={handleGoogleSignIn} />
          <p className="text-base lg:text-lg">
            Don&apos;t have an account?{" "}
            <Link className="text-primary font-medium" to="/signup">
              Sign up
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Login;
