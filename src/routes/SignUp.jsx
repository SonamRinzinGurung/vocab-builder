import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword,sendEmailVerification } from "firebase/auth";
import { auth } from "../firebase-config";
import useAuth from "../hooks/useAuth";
import useSetTitle from "../hooks/useSetTitle";

const SignUp = () => {
  useSetTitle("SignUp")
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user)
      navigate("/");
    } catch (error) {
      const errCode = error.code;
      const errMsg = error.message;
      console.log(errCode, errMsg);
    }
  };

  if (isLoading) return null;
  if (user) {
    return <Navigate to={"/"} />;
  }
  return (
    <main>
      <section className="flex justify-center text-center">
        <div className=" flex flex-col gap-4">
          <h3>Sign Up</h3>
          <form>
            <div className="flex flex-col gap-4 justify-between">
              <div className="flex gap-4">
                <label htmlFor="email">Email address</label>
                <input
                  className="dark:bg-gray-800"
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

              <button className="border" type="submit" onClick={onSubmit}>
                Sign up
              </button>
            </div>
          </form>

          <p>
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default SignUp;
