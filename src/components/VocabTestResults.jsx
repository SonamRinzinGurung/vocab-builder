
import PropTypes from "prop-types";

const VocabTestResults = ({ testWords, selectedOptions, resetTest, handleMoveToVocabValley }) => {
    return (
        <div className="flex flex-col gap-2">
            <h4>Test Results</h4>
            {testWords.map((word, index) => (
                <div key={index} className="border p-4 rounded">
                    <p>
                        <strong>Word:</strong> {word.word}
                    </p>
                    <p>
                        <strong>Your Answer:</strong>{" "}
                        {selectedOptions[index] || "Not answered"}
                    </p>
                    <p>
                        <strong>Correct Answer:</strong>{" "}
                        {word.meanings[0].definitions[0].definition}
                    </p>
                </div>
            ))}
            <p>
                <strong>Total Questions:</strong> {testWords.length}
            </p>
            <p>
                <strong>Correct Answers:</strong>{" "}
                {
                    testWords.filter(
                        (word, index) =>
                            selectedOptions[index] ===
                            word.meanings[0].definitions[0].definition
                    ).length
                }
            </p>
            <p>
                <strong>Score:</strong>{" "}
                {Math.round(
                    (testWords.filter(
                        (word, index) =>
                            selectedOptions[index] ===
                            word.meanings[0].definitions[0].definition
                    ).length /
                        testWords.length) *
                    100
                )}
                %
            </p>

            <button onClick={resetTest}>Retake Test</button>
            <button onClick={handleMoveToVocabValley}>
                Move correct answer to Vocab Valley
            </button>
        </div>
    )
}

VocabTestResults.propTypes = {
    testWords: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    resetTest: PropTypes.func.isRequired,
    handleMoveToVocabValley: PropTypes.func.isRequired,
};

export default VocabTestResults