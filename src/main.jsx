import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const SignUp = lazy(() => import("./routes/SignUp"));
const Login = lazy(() => import("./routes/Login"));
const HomePage = lazy(() => import("./routes/HomePage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const VocabMountain = lazy(() => import("./routes/VocabMountain"));
const Root = lazy(() => import("./components/Root"));
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import VerifyNotice from "./routes/VerifyNotice";

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
            <HomePage />
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
    <Suspense fallback={<div>Loading...</div>}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Suspense>
  </React.StrictMode>
);
