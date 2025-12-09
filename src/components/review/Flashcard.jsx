import WordMeaningGroup from "../WordMeaningGroup";
import PropTypes from "prop-types";

export default function Flashcard({ word, definition, mode, onReveal }) {
    return (
        <div className="flex flex-col gap-2 w-full px-8 pb-4 text-center">

            {mode === "showWord" && (
                <>
                    <h1 className="text-2xl font-bold">{word}</h1>

                    <button
                        className="mt-6 px-4 py-2 font-mono bg-primary  hover:bg-darkPrimary text-gray-100 rounded-sm"
                        onClick={onReveal}
                    >
                        Show Meaning
                    </button>
                </>
            )}

            {mode === "showMeaning" && (
                <>
                    <h1 className="text-2xl font-semibold mb-4">{word}</h1>

                    {
                        definition.meanings.map((meaning, index) => {
                            return (<div key={index} className="">
                                <div className="italic font-bold opacity-95 text-start">
                                    {meaning.partOfSpeech}
                                </div>
                                <WordMeaningGroup meaning={meaning} />
                            </div>)
                        })
                    }
                </>
            )}
        </div>
    );
}

Flashcard.propTypes = {
    word: PropTypes.string.isRequired,
    definition: PropTypes.object.isRequired,
    mode: PropTypes.oneOf(["showWord", "showMeaning"]).isRequired,
    onReveal: PropTypes.func.isRequired,
};