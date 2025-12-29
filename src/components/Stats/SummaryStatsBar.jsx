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
        <Link to={"/stats"} className="flex justify-between items-center gap-4 px-6 md:px-20 py-4 rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-md md:max-w-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200">

            {/* Streak */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                    <FaFire className="text-orange-500 text-lg" />
                    <span className="text-base font-semibold">{userStats?.streak || 0}</span>
                </div>
                <span className="text-sm text-center">Streak</span>
            </div>

            {/* XP */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500 text-lg" />
                    <span className="text-base font-semibold">{userStats?.xpToday || 0}</span>
                </div>
                <span className="text-sm">XP</span>
            </div>

            {/* Words Due */}
            <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1">
                    <MdPendingActions className="text-cyan-500 text-lg" />
                    <span className="text-base font-semibold">{dueWords.length}</span>
                </div>
                <span className="text-sm">Due</span>
            </div>

        </Link>
    )
}

export default SummaryStatsBar

SummaryStatsBar.propTypes = {
    uid: PropTypes.string.isRequired,
};