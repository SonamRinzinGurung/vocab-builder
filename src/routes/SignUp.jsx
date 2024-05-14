import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase-config";
import useAuth from "../hooks/useAuth";
import useSetTitle from "../hooks/useSetTitle";
import { toast } from "react-toastify";
import signUpImg from "../assets/bibliophile.svg";
import GoogleAuthBtn from "../components/GoogleAuthBtn";

const SignUp = () => {
  useSetTitle("SignUp");
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await sendEmailVerification(userCredential.user);
      navigate("/");
    } catch (error) {
      const errMsg = error.message;
      toast.error(errMsg);
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
          <img src={signUpImg} className="w-96" alt="sign up" />
        </div>
        <div className="flex flex-col gap-8 self-center">
          <h1 className="font-heading font-bold">Sign Up</h1>
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
                  required
                  placeholder="Email address"
                  name="email"
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
                  onClick={onSubmit}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </form>
          <hr className="border dark:border-gray-500" />
          <GoogleAuthBtn handleGoogleSignIn={handleGoogleSignIn} />
          <p className="text-base lg:text-lg">
            Already have an account?{" "}
            <Link className="text-primary font-medium" to="/login">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
