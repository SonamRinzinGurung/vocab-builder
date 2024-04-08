import { Navigate, useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import { auth } from "../firebase-config";
import useSetTitle from "../hooks/useSetTitle";

const VerifyNotice = () => {
  useSetTitle("Verify Email")
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const handleResendEmail = async () => {
    await sendEmailVerification(user);
  };

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

  if (isLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to={"/login"} />;
  }

  if (user?.emailVerified) {
    return <Navigate to={"/"} />;
  }

  return (
    <main className="flex flex-col items-center mt-24 p-4 dark:text-white gap-2 text-center">
      <h1 className="font-heading font-bold text-2xl">Verify Your Email</h1>
      <p className="font-subHead text-lg">
        Please check your email for verification link to activate your account.
      </p>
      <div className="flex flex-col my-4 gap-2">
        <p>Didn&apos;t receive an email?</p>
        <button
          className={
            "mx-auto border text-lime-600 dark:text-lime-300 dark:hover:text-lime-400"
          }
          onClick={handleResendEmail}
        >
          Resend Link
        </button>
      </div>
      <div className="mt-6 mb-4 text-center w-1/2">
        <hr />
      </div>
      <div className="mt-8">
        <p className="">
          Go back to{" "}
          <button className="font-medium text-blue-500" onClick={handleLogout}>
            Login
          </button>
        </p>
      </div>
    </main>
  );
};

export default VerifyNotice;
