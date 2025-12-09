import { db } from "../firebase-config.jsx";
import { useQuery } from "@tanstack/react-query";
import { collection, query, where, getDocs } from "firebase/firestore";
import { useState } from "react";

const useDueWords = (userId) => {

    const [unReviewed, setUnReviewed] = useState([]);

    const getDueWords = async (userId) => {
        const now = new Date();
        const dueQuery = query(
            collection(db, "vocab"),
            where("uid", "==", userId),
            where("nextReview", "<=", now)
        );
        const dueSnapshot = await getDocs(dueQuery);
        let dueWords = dueSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        if (dueWords.length === 0) {
            // Fetch all words without reviewCount OR reviewCount === 0
            const newQuery = query(
                collection(db, "vocab"),
                where("uid", "==", userId)
            );
            const newSnapshot = await getDocs(newQuery);

            //include docs where reviewCount is 0 or missing
            let newWords = newSnapshot.docs
                .map(doc => ({ id: doc.id, ...doc.data() }))
                .filter(word => !("reviewCount" in word) || word.reviewCount === 0);

            // Shuffle array randomly
            newWords.sort(() => Math.random() - 0.5);

            newWords = newWords.slice(0, 10);
            setUnReviewed(newWords);
        }

        return dueWords;
    }

    const { data, refetch } = useQuery({
        queryKey: ["due-words", userId],
        queryFn: () => getDueWords(userId),
    })
    return { dueWords: data || [], unReviewed, refetchDueWords: refetch };
}

export default useDueWords;