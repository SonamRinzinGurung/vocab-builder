import { useState } from "react";
import Flashcard from "./Flashcard.jsx";
import RatingButtons from "./RatingButtons.jsx";
import PropTypes from "prop-types";
import { updateSRS } from "../../utils/updateSRS";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase-config.jsx";

export default function ReviewSession({ words }) {
    const [index, setIndex] = useState(0);
    const [mode, setMode] = useState("showWord"); // "showWord", "showMeaning", "finished"

    const current = words[index];

    const goNext = () => {
        if (index === words.length - 1) {
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

    async function onRate(quality) {
        // update SRS in Firestore
        await updateWordSRS(current, quality);
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
        <div className="flex flex-col items-center gap-6 p-6">
            <Flashcard
                word={current?.word}
                definition={current}
                mode={mode}
                onReveal={() => setMode("showMeaning")}
            />

            {mode === "showMeaning" && (
                <RatingButtons onRate={onRate} />
            )}
        </div>
    );
}

ReviewSession.propTypes = {
    words: PropTypes.arrayOf(PropTypes.object).isRequired,
};