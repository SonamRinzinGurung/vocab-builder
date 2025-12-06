import { useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useQuery } from "@tanstack/react-query";
import { db } from "../../firebase-config.jsx";
import PropTypes from "prop-types";
import { FaFire, FaStar } from "react-icons/fa";
import { MdPendingActions } from "react-icons/md";
import { Link } from "react-router-dom";

const SummaryStatsBar = ({ uid }) => {

    const [stats, setStats] = useState(null);

    // fetch user stats
    useQuery({
        queryKey: ["userStats", uid],
        queryFn: async () => {
            const ref = doc(db, "userStats", uid);
            const snap = await getDoc(ref);
            setStats(snap.exists() ? snap.data() : null);
            return snap.exists() ? snap.data() : null;
        },
        staleTime: 1000 * 60 * 2, // 2 min
    });
    return (
        <Link to={""} className="flex justify-between items-center gap-2 px-6 py-4 rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg max-w-sm hover:scale-[1.02] transition-transform duration-200">

            {/* Streak */}
            <div className="flex flex-col items-center">
                <FaFire className="text-red-500" />
                <span className="text-sm font-medium text-center">{stats?.streak || 0} day</span>
            </div>

            {/* XP */}
            <div className="flex flex-col items-center">
                <FaStar className="text-yellow-500" />
                <span className="text-sm font-medium text-center">{stats?.xpToday || 0} XP</span>
            </div>

            {/* Words Due */}
            <div className="flex flex-col items-center">
                <MdPendingActions className="text-blue-500" />
                <span className="text-sm font-medium text-center">{stats?.wordsDue || 0} due</span>
            </div>

        </Link>


    )
}

export default SummaryStatsBar

SummaryStatsBar.propTypes = {
    uid: PropTypes.string.isRequired,
};