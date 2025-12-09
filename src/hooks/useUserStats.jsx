import { db } from "../firebase-config.jsx";
import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";

const useUserStats = (userId) => {

    const { data } = useQuery({
        queryKey: ["userStats", userId],
        queryFn: async () => {
            const ref = doc(db, "userStats", userId);
            const snap = await getDoc(ref);
            return snap.exists() ? snap.data() : null;
        },
    });
    return { userStats: data || null };
}

export default useUserStats;