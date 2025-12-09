import { useState } from "react";
import Flashcard from "./Flashcard.jsx";
import RatingButtons from "./RatingButtons.jsx";
import PropTypes from "prop-types";
import { updateSRS } from "../../utils/updateSRS";
import { updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config.jsx";
import { LuPartyPopper } from "react-icons/lu";
import { MdPendingActions } from "react-icons/md";

export default function ReviewSession({ dueWords, userStats, unReviewed, refetchDueWords }) {
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState("showWord"); // "showWord", "showMeaning", "finished"
    const [reviewStarted, setReviewStarted] = useState(false);
    const current = dueWords.length > 0 ? dueWords[index] : unReviewed[index];
    const [reviewedCount, setReviewedCount] = useState(0);

    const dailyGoal = 10;
    const goNext = () => {
        if (index === dueWords.length - 1) {
            setMode("finished");
        } else {
            setIndex(i => i + 1);
            setMode("showWord");
        }
    };

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
        setReviewedCount(count => count + 1);
        goNext();
    }

    if (mode === "finished") {
        return (
            <div className="flex flex-col gap-6 p-8 max-w-sm md:max-w-xl rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2 justify-center">Review Complete <LuPartyPopper /></h2>
                <p className="md:text-sm text-xs">You have reviewed {userStats?.reviewsToday + reviewedCount || 0} word{(userStats?.reviewsToday || 0) <= 1 ? "" : "s"} today</p>
                <button className="font-mono px-6 py-2 bg-primary  hover:bg-darkPrimary text-gray-100 rounded-sm w-full mt-6"
                    onClick={() => {
                        setIndex(0);
                        setMode("showWord");
                        setReviewStarted(false);
                        setReviewedCount(0);
                        refetchDueWords?.();
                    }}
                >Restart</button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-sm md:max-w-xl rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg">

            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-sm h-2 overflow-hidden">
                <div
                    className="bg-primary dark:bg-blue-500 h-full rounded-sm transition-all duration-300"
                    style={{
                        width: `${Math.min((((userStats?.reviewsToday || 0) + reviewedCount) / dailyGoal) * 100, 100)}%`
                    }}
                ></div>
            </div>
            {
                !reviewStarted ? (
                    <>

                        <div className="p-8">

                            {dueWords.length > 0 ? (
                                <>
                                    <p className="md:text-lg text-sm font-semibold flex items-center gap-2"> <MdPendingActions className="text-blue-500" />
                                        {dueWords.length} words due today</p>
                                    <p className="md:text-sm text-xs text-slate-500">Start your review</p>
                                </>
                            ) : (
                                <>
                                    <p className="md:text-lg text-sm font-semibold flex items-center gap-2"><LuPartyPopper color="" /> You&apos;re all caught up!</p>
                                    <p className="md:text-sm text-xs text-slate-500">Study new words instead</p>
                                </>
                            )}

                            <button className="font-mono px-6 py-2 bg-primary  hover:bg-darkPrimary text-gray-100 rounded-sm w-full mt-6" onClick={() => setReviewStarted(true)}>Start</button>
                        </div>
                    </>
                ) : (
                    <>
                            <div className="px-4 pt-2">
                                <span className="text-sm text-slate-500">Review {index + 1} of {dueWords.concat(unReviewed).length}</span>
                            </div>
                        <Flashcard
                            word={current?.word}
                            definition={current}
                            mode={mode}
                            onReveal={() => setMode("showMeaning")}
                                words={dueWords.concat(unReviewed)}
                                index={index}
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
    dueWords: PropTypes.arrayOf(PropTypes.object).isRequired,
    userStats: PropTypes.object.isRequired,
    unReviewed: PropTypes.arrayOf(PropTypes.object).isRequired,
    refetchDueWords: PropTypes.func,
};