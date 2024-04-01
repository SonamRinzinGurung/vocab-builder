import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
const SignUp = lazy(() => import("./routes/SignUp"));
const Login = lazy(() => import("./routes/Login"));
const HomePage = lazy(() => import("./routes/HomePage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const VocabMountain = lazy(() => import("./routes/VocabMountain"));

const router = createBrowserRouter([
  {
    path: "/",
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
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Suspense fallback={<div>Loading...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </React.StrictMode>
);
