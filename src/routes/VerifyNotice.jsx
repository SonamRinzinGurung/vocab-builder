import { Navigate, useNavigate } from "react-router-dom";
import { sendEmailVerification, signOut } from "firebase/auth";
import useAuth from "../hooks/useAuth";
import { auth } from "../firebase-config";
import useSetTitle from "../hooks/useSetTitle";
import { toast } from "react-toastify";

const VerifyNotice = () => {
  useSetTitle("Verify Email");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const handleResendEmail = async () => {
    try {
      await sendEmailVerification(user);
      toast.success("Verification link sent to user's email");
    } catch (error) {
      console.log(error);
    }
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
    <main className="flex flex-col items-center mt-24 p-4 dark:text-gray-100 gap-2 text-center">
      <h1 className="font-heading font-bold text-2xl">Verify Your Email</h1>
      <p className="font-subHead text-lg">
        Please check your email for verification link to activate your account.
      </p>
      <div className="flex flex-col my-4 gap-2">
        <p>Didn&apos;t receive an email?</p>

        <button
          className={
            "w-full text-lg font-medium py-1 text-primary border border-primary"
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
          <button className="font-medium text-primary" onClick={handleLogout}>
            Login
          </button>
        </p>
      </div>
    </main>
  );
};

export default VerifyNotice;
