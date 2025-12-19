import PropTypes from "prop-types";
import { getLevel } from "../../utils/getLevel" // path from above

export default function LevelCard({ xpToday, lifetimeXp }) {
    const { level, currentLevelXP, nextLevelXP, progress } = getLevel(lifetimeXp);
    const DAILY_XP_GOAL = 100;
    const dailyProgress = Math.min(xpToday / DAILY_XP_GOAL, 1);

    return (
        <div className="flex flex-col p-8 gap-4 md:max-w-xl rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg text-center mt-8">

            {/* LEVEL HEADER */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-xl font-bold">Level {level}</h2>
                <span className="text-sm font-semibold">
                    {lifetimeXp} XP
                </span>
            </div>

            {/* LEVEL PROGRESS BAR */}
            <div>
                <div className="flex justify-between text-xs mb-1">
                    <span>{currentLevelXP} XP</span>
                    <span>Next: {nextLevelXP} XP</span>
                </div>
                <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-[#F2C94C] transition-all"
                        style={{ width: `${progress * 100}%` }}
                    ></div>
                </div>
            </div>

            {/* DIVIDER */}
            <div className="my-4 border-t border-slate-300 dark:border-slate-700"></div>

            {/* DAILY XP */}
            <div>
                <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Daily XP</span>
                    <span className="text-sm">{xpToday} / 100 XP</span>
                </div>
                <div className="w-full h-3 bg-slate-300 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full  bg-emerald-500 transition-all"
                        style={{ width: `${dailyProgress * 100}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
}

LevelCard.propTypes = {
    xpToday: PropTypes.number.isRequired,
    lifetimeXp: PropTypes.number.isRequired,
};
