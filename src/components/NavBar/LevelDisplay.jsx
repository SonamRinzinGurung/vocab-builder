import PropTypes from "prop-types";
import { getLevel } from "../../utils/getLevel";
import { Link } from "react-router-dom";

const LevelDisplay = ({ lifetimeXp }) => {
    const { level, progress } = getLevel(lifetimeXp);

    return (
        <Link to="/stats" className="hover:opacity-85">
            <div className="flex flex-col md:flex-row items-center gap-1">
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#2F3A5F] text-white">
                    Lv {level}
                </span>

                <div className="w-20 h-3.5 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#F2C94C]"
                        style={{ width: `${progress * 100}%` }}
                    />
                </div>
            </div>
        </Link>
    )
}

export default LevelDisplay

LevelDisplay.propTypes = {
    lifetimeXp: PropTypes.number.isRequired,
};