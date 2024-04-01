import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Root = () => {
  return (
    <div className="">
      <NavBar />
      <Outlet />
    </div>
  );
};

export default Root;
