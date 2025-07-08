
import PropTypes from "prop-types";

const VocabTestSettings = ({ wordCount, setWordCount, maxLength, setShowSelectWordsModal, handleStartTest }) => {
    return (
        <div className="flex flex-col gap-2">
            <h4>Setup your desired test settings</h4>

            <label className="flex flex-col gap-1">
                <span>Enter the number of words for the test</span>
                <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    min={1}
                    max={maxLength || 10}
                    className="bg:white dark:bg-gray-800 outline-none py-2 px-3 rounded-sm"
                />
            </label>
            <p>
                Select specific words for the test (optional):
            </p>
            <button onClick={() => setShowSelectWordsModal(true)}>Select Words</button>
            <button onClick={handleStartTest}>Start Test</button>
        </div>
    )
}

VocabTestSettings.propTypes = {
    wordCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    setWordCount: PropTypes.func.isRequired,
    maxLength: PropTypes.number,
    setShowSelectWordsModal: PropTypes.func.isRequired,
    handleStartTest: PropTypes.func.isRequired,
};

export default VocabTestSettings