import PropTypes from 'prop-types';

const WordSelectionModal = ({ result, handleWordsSelection, selectedWords, handleConfirmWordsSelection, handleCancelSelection }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>Select Words for Test</h3>
                <p>Select words from the list below:</p>
                <div className="list-disc pl-5">
                    {result.map((word) => (
                        <button key={word.id} className="w-full hover:bg-gray-300 p-1 rounded flex items-center gap-2" onClick={() => handleWordsSelection(word)}>
                            <input
                                type="checkbox"
                                checked={selectedWords.includes(word.id)}
                                className="cursor-pointer"
                            />
                            <span>{word.word}</span>
                        </button>
                    ))}
                </div>
                <button
                    onClick={handleConfirmWordsSelection}
                >
                    Confirm Selection
                </button>
                <button onClick={handleCancelSelection}>Cancel</button>
            </div>
        </div>)
}
WordSelectionModal.propTypes = {
    result: PropTypes.array.isRequired,
    handleWordsSelection: PropTypes.func.isRequired,
    selectedWords: PropTypes.array.isRequired,
    handleConfirmWordsSelection: PropTypes.func.isRequired,
    handleCancelSelection: PropTypes.func.isRequired,
};

export default WordSelectionModal
