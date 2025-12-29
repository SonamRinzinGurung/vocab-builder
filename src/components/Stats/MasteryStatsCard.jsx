import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";
import { getWordMastery } from "../../utils/getWordMastery";
import MasteryBadge from "../MasteryBadge";

export default function MasteryStatsCard({ user }) {
    const {
        data,
        isLoading,
        isFetching,
        isPending
    } = useQuery({
        queryKey: ["vocab-mountain"],
        queryFn: async () => {
            const q = query(
                collection(db, "vocab"),
                where("uid", "==", user.uid),
                where("group", "==", "vocab-mountain"),
            );

            const querySnapShot = await getDocs(q);
            const fetchData = [];
            querySnapShot.forEach((doc) => {
                fetchData.push({ id: doc.id, ...doc.data() });
            });
            const masteryStatsCount = [0, 0, 0, 0]
            fetchData.forEach((word) => {
                const masteryLevel = getWordMastery(word)
                masteryStatsCount[masteryLevel]++
            })

            return { masteryStatsCount, wordCount: fetchData.length }
        },
        refetchOnWindowFocus: false,
    });

    if (isLoading || isFetching || isPending) return null
    return (
        <div className="flex flex-col p-8 gap-4 md:max-w-xl rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg text-center mt-8">
            <h3 className="text-lg font-semibold">Word Mastery</h3>

            <div className="grid grid-cols-4 text-center gap-2">
                {
                    data?.masteryStatsCount?.map((mastery, index) => {
                        return <div key={index}>
                            <MasteryBadge mastery={index} />
                            <p className="text-lg mt-1 font-bold">{mastery}</p>
                        </div>
                    })
                }
            </div>

            {/* progress bar toward mastered */}
            <div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1 text-right">{`${data?.masteryStatsCount?.[3] ?? 0} / ${data?.wordCount ?? 0} words mastered`}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(Math.min(data?.masteryStatsCount?.[3] / data?.wordCount, 1) * 100)}%` }}></div>
                </div>
            </div>
        </div>

    );
}

MasteryStatsCard.propTypes = {
    user: PropTypes.object.isRequired,
};
