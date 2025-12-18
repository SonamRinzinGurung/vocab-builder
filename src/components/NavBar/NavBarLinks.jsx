import { NavLink } from "react-router-dom";

const NavBarLinks = () => {
    return (
        <>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    `p-4 hover:bg-primary hover:text-gray-100 hidden lg:block ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                Home
            </NavLink>
            <NavLink
                to="/vocab-mountain"
                className={({ isActive }) =>
                    `p-4 hover:bg-primary hover:text-gray-100 hidden lg:block ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                Mountain
            </NavLink>
            <NavLink
                to="/vocab-valley"
                className={({ isActive }) =>
                    `p-4 hover:bg-primary hover:text-gray-100 hidden lg:block ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                Valley
            </NavLink>
            <NavLink
                to="/vocab-test"
                className={({ isActive }) =>
                    `p-4 hover:bg-primary hover:text-gray-100 hidden lg:block ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                Test
            </NavLink>
        </>
    )
}

export default NavBarLinks