import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.min.css";
const SignUp = lazy(() => import("./routes/SignUp"));
const Login = lazy(() => import("./routes/Login"));
const VocabBuilder = lazy(() => import("./routes/VocabBuilder"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const VocabMountain = lazy(() => import("./routes/VocabMountain"));
const Root = lazy(() => import("./components/Root"));
const VocabValley = lazy(() => import("./routes/VocabValley"));
const VocabTest = lazy(() => import("./routes/VocabTest"))
const Dashboard = lazy(() => import("./routes/Dashboard"));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VerifyNotice from "./routes/VerifyNotice";
import ClipLoader from "react-spinners/ClipLoader";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "/",
        index: true,
        element: (
          <ProtectedRoute>
            <VocabBuilder />
          </ProtectedRoute>
        ),
      },
      {
        path: "/vocab-mountain",
        element: (
          <ProtectedRoute>
            <VocabMountain />
          </ProtectedRoute>
        ),
      },
      {
        path: "/vocab-valley",
        element: (
          <ProtectedRoute>
            <VocabValley />
          </ProtectedRoute>
        ),
      },
      {
        path: "/vocab-test",
        element: (
          <ProtectedRoute>
            <VocabTest />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/verify-email",
        element: <VerifyNotice />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense
      fallback={
        <ClipLoader
          size={150}
          color="#6187D1"
          cssOverride={{
            margin: "auto",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      }
    >
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);
