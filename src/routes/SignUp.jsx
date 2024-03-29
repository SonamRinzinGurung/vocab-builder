import { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";

const SignUp = () => {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");

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
      const user = userCredential.user;
      const userObj = {
        email: user.email,
        displayName: user.displayName,
      };
      localStorage.setItem("user", JSON.stringify(userObj));
      // console.log(user);
      navigate("/");
    } catch (error) {
      const errCode = error.code;
      const errMsg = error.message;
      console.log(errCode, errMsg);
    }
  };
  if (user) {
    return <Navigate to={"/"} />;
  }
  return (
    <main>
      <section className="flex justify-center text-center">
        <div className=" flex flex-col gap-4">
          <h1> Vocab Builder </h1>
          <h3>Sign Up</h3>
          <form>
            <div className="flex flex-col gap-4">
              <div className="flex gap-4">
                <label htmlFor="email">Email address</label>
                <input
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

              <div className="flex gap-4">
                <label htmlFor="password">Password</label>
                <input
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
