import PropTypes from "prop-types";
import WordSelectionModal from "./WordSelectionModal";

const VocabTestSettings = ({
    wordCount,
    setWordCount,
    maxLength,
    showSelectWordsModal,
    setShowSelectWordsModal,
    handleStartTest,
    result,
    handleWordsSelection,
    selectedWords,
    handleConfirmWordsSelection,
    handleCancelSelection,
}) => {
    return (
        <div className="flex gap-4 w-full">
            <div className="flex flex-col gap-6 w-[400px]">
                <h4 className="">Setup your desired test settings</h4>

            <label className="flex flex-col gap-1">
                <span>Enter the number of words for the test</span>
                <input
                    type="number"
                    value={wordCount}
                    onChange={(e) => setWordCount(e.target.value)}
                    min={1}
                    max={maxLength || 10}
                        className="bg:white dark:bg-gray-800 outline-none py-2 px-3 rounded-sm w-40 lg:w-52"
                />
            </label>
                <div>
                    <p>Select specific words for the test (optional):</p>
                    <button className="p-2 rounded-sm bg-primary text-gray-100" onClick={() => setShowSelectWordsModal(true)}>
                        Select Words
                    </button>
                </div>
                <button
                    className={`p-2 ${wordCount == 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-darkPrimary'} text-gray-100 rounded-sm w-32 lg:w-40`}
                    onClick={handleStartTest}
                    disabled={wordCount == 0}
                >
                    Start Test
                </button>
            </div>
            <WordSelectionModal
                result={result}
                handleWordsSelection={handleWordsSelection}
                selectedWords={selectedWords}
                handleConfirmWordsSelection={handleConfirmWordsSelection}
                handleCancelSelection={handleCancelSelection}
                setShowSelectWordsModal={setShowSelectWordsModal}
                showSelectWordsModal={showSelectWordsModal}
            />
        </div>
    );
};

VocabTestSettings.propTypes = {
    wordCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
        .isRequired,
    setWordCount: PropTypes.func.isRequired,
    maxLength: PropTypes.number,
    setShowSelectWordsModal: PropTypes.func.isRequired,
    handleStartTest: PropTypes.func.isRequired,
    result: PropTypes.array.isRequired,
    handleWordsSelection: PropTypes.func.isRequired,
    selectedWords: PropTypes.array.isRequired,
    handleConfirmWordsSelection: PropTypes.func.isRequired,
    handleCancelSelection: PropTypes.func.isRequired,
    showSelectWordsModal: PropTypes.bool.isRequired,
};

export default VocabTestSettings;
