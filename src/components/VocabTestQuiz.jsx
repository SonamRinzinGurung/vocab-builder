
import PropTypes from "prop-types";

const VocabTestQuiz = ({ testWords, questionOptions, setSelectedOptions, selectedOptions, setTestStep }) => {
    return (
        <div className="flex flex-col gap-2">
            <h4>Test your knowledge</h4>
            {testWords.map((word, index) => (
                <div key={index} className="border p-4 rounded">
                    <p>
                        <strong>Word:</strong> {word.word}
                    </p>
                    <p>
                        <strong>Options:</strong>
                        <div className="list-disc pl-5">
                            {questionOptions[index]?.map((option, idx) => (
                                <button
                                    key={idx}
                                    className="w-full hover:bg-gray-300 p-1 rounded flex items-center gap-2"
                                    onClick={() =>
                                        setSelectedOptions((prev) => ({
                                            ...prev,
                                            [index]: option,
                                        }))
                                    }
                                >
                                    <input
                                        type="radio"
                                        name={`question-${index}`}
                                        value={option}
                                        checked={selectedOptions[index] === option}
                                        className="cursor-pointer"
                                    />
                                    <span className="cursor-pointer">{option}</span>
                                </button>
                            ))}
                        </div>
                    </p>
                </div>
            ))}

            <button onClick={() => setTestStep(2)}>Finish Test</button>
        </div>
    )
}

VocabTestQuiz.propTypes = {
    testWords: PropTypes.arrayOf(
        PropTypes.shape({
            word: PropTypes.string.isRequired,
        })
    ).isRequired,
    questionOptions: PropTypes.arrayOf(PropTypes.array).isRequired,
    setSelectedOptions: PropTypes.func.isRequired,
    selectedOptions: PropTypes.object.isRequired,
    setTestStep: PropTypes.func.isRequired,
};

export default VocabTestQuiz