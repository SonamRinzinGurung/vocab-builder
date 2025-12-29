import PropTypes from "prop-types";
import { HiOutlineFire } from "react-icons/hi";
import { FaTrophy } from "react-icons/fa";

const StreaksCard = ({ userStats }) => {
    const currentStreak = userStats?.streak || 0;
    const longestStreak = userStats?.longestStreak || 0;

    return (
        <div className="flex flex-col p-8 gap-4 md:max-w-xl rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg text-center mt-8">

            {/* Current Streak */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 rounded p-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-red-500 p-3 rounded-full">
                        <HiOutlineFire className="text-white text-2xl" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs uppercase tracking-wide">Current Streak</p>
                        <p className="text-3xl font-bold text-red-500">
                            {currentStreak} <span className="text-lg font-normal">day{currentStreak !== 1 ? "s" : ""}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Longest Streak */}
            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 rounded p-4 shadow-md">
                <div className="flex items-center gap-3">
                    <div className="bg-yellow-500 p-3 rounded-full">
                        <FaTrophy className="text-white text-2xl" />
                    </div>
                    <div className="text-left">
                        <p className="text-xs uppercase tracking-wide">Longest Streak</p>
                        <p className="text-3xl font-bold text-yellow-500">
                            {longestStreak} <span className="text-lg font-normal">day{longestStreak !== 1 ? "s" : ""}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default StreaksCard

StreaksCard.propTypes = {
    userStats: PropTypes.object.isRequired,
};