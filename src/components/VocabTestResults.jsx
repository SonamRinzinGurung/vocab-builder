import PropTypes from "prop-types";

const VocabTestResults = ({
    testWords,
    selectedOptions,
    resetTest,
    handleMoveToVocabValley,
}) => {
    const correctAnswers = testWords.filter(
        (word, index) =>
            selectedOptions[index] === word.meanings[0].definitions[0].definition
    );

    return (
        <div className="flex flex-col gap-4">
            <h4>Test Results</h4>
            <div className="results flex flex-col gap-2">
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
            </div>
            <div>
                <p>
                    <strong>Total Questions:</strong> {testWords.length}
                </p>
                <p>
                    <strong>Correct Answers:</strong> {correctAnswers?.length}
                </p>
                <p>
                    <strong>Score:</strong>{" "}
                    {Math.round((correctAnswers?.length / testWords.length) * 100)}%
                </p>
            </div>

            <div className="flex flex-col gap-2 items-center">
                <button
                    onClick={resetTest}
                    className="p-2 bg-darkPrimary text-gray-100 rounded-sm w-32 lg:w-40"
                >
                    Retake Test
                </button>
                {correctAnswers?.length > 0 && (
                    <button
                        onClick={handleMoveToVocabValley}
                        className="p-2 bg-primary text-gray-100 rounded-sm"
                    >
                        Move correct answer{correctAnswers?.length > 1 ? 's' : ''} to Vocab Valley
                    </button>
                )}
            </div>
        </div>
    );
};

VocabTestResults.propTypes = {
    testWords: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array.isRequired,
    resetTest: PropTypes.func.isRequired,
    handleMoveToVocabValley: PropTypes.func.isRequired,
};

export default VocabTestResults;
