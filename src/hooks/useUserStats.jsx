import { db } from "../firebase-config.jsx";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { formatDateLocal } from "../utils/formatDateLocal.jsx";

const useUserStats = (userId) => {

    const { data, refetch } = useQuery({
        queryKey: ["userStats", userId],
        queryFn: async () => {
            const ref = doc(db, "userStats", userId);
            const snap = await getDoc(ref);
            const data = snap.exists() ? snap.data() : null;

            const today = formatDateLocal(new Date());

            // Reset reviewsToday and xpToday if it's a new day
            if (data && data.date !== today) {
                data.reviewsToday = 0;
                data.xpToday = 0;
            }
            return data;

        },
    });
    return { userStats: data || null, refetchUserStats: refetch };
}

export default useUserStats;