import { Outlet } from "react-router-dom";
import NavBar from "./NavBar/NavBar.jsx";

const Root = () => {
  return (
    <div className="">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Root;
