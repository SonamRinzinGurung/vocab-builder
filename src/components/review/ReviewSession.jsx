import { useState } from "react";
import Flashcard from "./Flashcard.jsx";
import RatingButtons from "./RatingButtons.jsx";
import PropTypes from "prop-types";
import { updateSRS } from "../../utils/updateSRS";
import { updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config.jsx";
import { useQuery } from "@tanstack/react-query";

export default function ReviewSession({ words, uid }) {
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState("showWord"); // "showWord", "showMeaning", "finished"
    const [reviewStarted, setReviewStarted] = useState(false);
    const current = words[index];
    const [stats, setStats] = useState(null);

    const goNext = () => {
        if (index === words.length - 1) {
            setMode("finished");
        } else {
            setIndex(i => i + 1);
            setMode("showWord");
        }
    };

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

    const updateWordSRS = async (word, quality) => {
        const changes = updateSRS(word, quality); // get updated SRS values
        const docRef = doc(db, "vocab", word.id);
        console.log(`Updating word ${word.word} with`, changes);
        return await updateDoc(docRef, changes); // update Firestore
    }

    async function updateDailyStats(uid, deltaXp = 10) {
        const statsRef = doc(db, "userStats", uid);
        console.log(statsRef)
        const statsSnap = await getDoc(statsRef);

        const today = new Date().toISOString().slice(0, 10);

        // initialize if not exists
        if (!statsSnap.exists()) {
            await setDoc(statsRef, {
                date: today,
                reviewsToday: 1,
                xpToday: deltaXp,
                totalReviews: 1,
                lifetimeXp: deltaXp,
                streak: 1,
                longestStreak: 1,
                lastActive: today
            });
            return;
        }

        const data = statsSnap.data();

        let isNewDay = data.date !== today;

        if (isNewDay) {
            // Determine streak
            const yesterday = new Date(Date.now() - 86400000)
                .toISOString()
                .slice(0, 10);

            const newStreak = data.date === yesterday ? data.streak + 1 : 1;

            await updateDoc(statsRef, {
                date: today,
                reviewsToday: 1,
                xpToday: deltaXp,
                totalReviews: data.totalReviews + 1,
                lifetimeXp: data.lifetimeXp + deltaXp,
                streak: newStreak,
                longestStreak: Math.max(newStreak, data.longestStreak),
                lastActive: today
            });

        } else {
            // Same day → increment stats
            await updateDoc(statsRef, {
                reviewsToday: data.reviewsToday + 1,
                xpToday: data.xpToday + deltaXp,
                totalReviews: data.totalReviews + 1,
                lifetimeXp: data.lifetimeXp + deltaXp,
                lastActive: today
            });
        }
    }

    async function onRate(quality) {
        // update SRS in Firestore
        await updateWordSRS(current, quality);
        await updateDailyStats(current.uid, quality * 10); 
        goNext();
    }

    if (mode === "finished") {
        return (
            <div className="flex flex-col items-center p-6 text-center">
                <h2 className="text-2xl font-bold mb-4">Review Complete 🎉</h2>
                <p>You reviewed {words.length} words today.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-sm">
            {
                !reviewStarted ? (
                    <div className="flex flex-col items-center gap-2 px-6 py-4 rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg w-full">
                        <p className="text-center md:text-lg text-sm">
                            You have {words.length} words to review
                        </p>
                        <button className="font-mono px-6 bg-primary  hover:bg-darkPrimary text-gray-100 rounded-sm w-full" onClick={() => setReviewStarted(true)}>Start</button>
                    </div>
                ) : (
                    <>
                        <Flashcard
                            word={current?.word}
                            definition={current}
                            mode={mode}
                            onReveal={() => setMode("showMeaning")}
                        />

                            {mode === "showMeaning" && (
                                <RatingButtons onRate={onRate} />
                        )}</>
                )
            }
        </div>
    );
}

ReviewSession.propTypes = {
    words: PropTypes.arrayOf(PropTypes.object).isRequired,
    uid: PropTypes.string.isRequired,
};