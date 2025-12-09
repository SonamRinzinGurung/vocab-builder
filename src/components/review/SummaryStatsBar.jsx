import PropTypes from "prop-types";
import { FaFire, FaStar } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { Link } from "react-router-dom";
import useDueWords from "../../hooks/useDueWords.jsx";
import useUserStats from "../../hooks/useUserStats.jsx";

const SummaryStatsBar = ({ uid }) => {
    const { dueWords } = useDueWords(uid);
    const { userStats } = useUserStats(uid);

    return (
        <Link to={"/dashboard"} className="flex justify-between items-center gap-2 px-6 py-4 rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow max-w-sm md:max-w-xl hover:scale-[1.02] transition-transform duration-200">

            {/* Streak */}
            <div className="flex flex-col items-center">
                <FaFire className="text-red-500" />
                <span className="text-sm font-medium text-center">{userStats?.streak || 0} day{userStats?.streak <= 1 ? "" : "s"}</span>
            </div>

            {/* XP */}
            <div className="flex flex-col items-center">
                <FaStar className="text-yellow-500" />
                <span className="text-sm font-medium text-center">{userStats?.xpToday || 0} XP</span>
            </div>

            {/* Words Due */}
            <div className="flex flex-col items-center">
                <MdPendingActions className="text-blue-500" />
                <span className="text-sm font-medium text-center">{dueWords.length} due</span>
            </div>

        </Link>


    )
}

export default SummaryStatsBar

SummaryStatsBar.propTypes = {
    uid: PropTypes.string.isRequired,
};