import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const MobileNavBarLinks = ({ toggleMenu }) => {
    return (
        <>
            <NavLink
                onClick={toggleMenu}
                to={"/"}
                className={({ isActive }) =>
                    `w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2 ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                <span className="font-subHead text-xl">Vocab Builder</span>
            </NavLink>
            <NavLink
                onClick={toggleMenu}
                to={"/vocab-mountain"}
                className={({ isActive }) =>
                    `w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2 ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                <span className="font-subHead text-xl">Vocab Mountain</span>
            </NavLink>
            <NavLink
                onClick={toggleMenu}
                to={"/vocab-valley"}
                className={({ isActive }) =>
                    `w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2 ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                <span className="font-subHead text-xl">Vocab Valley</span>
            </NavLink>
            <NavLink
                onClick={toggleMenu}
                to={"/vocab-test"}
                className={({ isActive }) =>
                    `w-full pl-8 py-4 text-gray-100 hover:bg-[#f0f4f8]  hover:text-gray-700 border-b-2 ${isActive ? "text-gray-100 bg-primary" : ""
                    }`
                }
            >
                <span className="font-subHead text-xl">Vocab Test</span>
            </NavLink>
        </>
    )
}

export default MobileNavBarLinks
MobileNavBarLinks.propTypes = {
    toggleMenu: PropTypes.func.isRequired,
};