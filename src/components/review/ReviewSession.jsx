import { useState } from "react";
import Flashcard from "./Flashcard.jsx";
import RatingButtons from "./RatingButtons.jsx";
import PropTypes from "prop-types";
import { updateSRS } from "../../utils/updateSRS";
import { updateDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase-config.jsx";
import { LuPartyPopper } from "react-icons/lu";
import { MdPendingActions } from "react-icons/md";
import { formatDateLocal } from "../../utils/formatDateLocal.jsx";

export default function ReviewSession({ dueWords, userStats, unReviewed, refetchDueWords, refetchUserStats }) {
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
        const statsSnap = await getDoc(statsRef);

        // Get today's date in local time
        const today = formatDateLocal(new Date(Date.now()));

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
            const yesterday = formatDateLocal(new Date(Date.now() - 86400000));

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
        refetchUserStats?.();
    }

    async function onRate(quality) {
        // update SRS in Firestore
        await updateWordSRS(current, quality);
        await updateDailyStats(current.uid, quality * 10);
        setReviewedCount(count => count + 1);
        goNext();
    }

    {/* Finished Review Session */ }
    if (mode === "finished") {
        return (
            <div className="flex flex-col p-8 md:max-w-xl rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg text-center">
                <p className="text-xl md:text-2xl font-bold flex items-center gap-2 justify-center">Review Complete <LuPartyPopper /></p>
                <p className="md:text-sm text-xs">You have reviewed {userStats?.reviewsToday + reviewedCount || 0} word{(userStats?.reviewsToday || 0) <= 1 ? "" : "s"} today</p>
                <button className="font-mono px-6 py-2 bg-primary text-gray-100 rounded-sm w-full mt-6"
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
        <div className="flex flex-col gap-6 md:max-w-xl rounded border bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 shadow-lg">

            {
                !reviewStarted ? (
                    <>
                        {/* Progress Bar */}
                        <div className="px-8 pt-8 flex flex-col items-center text-center gap-2">
                            <div className="flex justify-between items-center">
                                <span className="text-sm">{(userStats?.reviewsToday || 0) + reviewedCount} / {dailyGoal} words reviewed today</span>
                            </div>


                            <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-primary h-full transition-all duration-300"
                                    style={{
                                        width: `${Math.min((((userStats?.reviewsToday || 0) + reviewedCount) / dailyGoal) * 100, 100)}%`
                                    }}
                                ></div>
                            </div>


                        </div>

                        {/* DIVIDER */}
                        <div className="mt-6 border-t border-slate-300 dark:border-slate-700 mx-2"></div>

                        <div className="p-8 flex flex-col items-center text-center">

                            {dueWords.length > 0 ? (
                                <>
                                    <p className="md:text-2xl text-xl font-bold flex items-center gap-2 justify-center"> <MdPendingActions className="text-blue-500" />
                                        {dueWords.length} word{dueWords.length !== 1 ? "s" : ""} due today</p>
                                    <p className="md:text-sm text-xs text-slate-500 dark:text-slate-300">Start your review</p>
                                </>
                            ) : (
                                <>
                                        <p className="md:text-2xl text-xl font-bold flex items-center gap-2 justify-center"> You&apos;re all caught up <LuPartyPopper color="" /></p>
                                    <p className="md:text-sm text-xs text-slate-500">Study new words instead</p>
                                </>
                            )}

                            <button className="font-mono px-6 py-2 bg-primary text-gray-100 rounded-sm w-full mt-6" onClick={() => setReviewStarted(true)}>Start</button>
                        </div>
                    </>
                ) : (
                    <>
                            <div className="px-4 pt-2">
                                <span className="text-sm text-slate-500 dark:text-slate-300">Current review: {index + 1} of {dueWords.concat(unReviewed).length}</span>
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
    refetchUserStats: PropTypes.func,
};