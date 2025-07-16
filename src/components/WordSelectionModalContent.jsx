import PropTypes from "prop-types";
import { IoIosClose } from "react-icons/io";

const WordSelectionModalContent = ({ setShowSelectWordsModal, result, handleWordsSelection, selectedWords, handleConfirmWordsSelection, handleCancelSelection }) => {


    return (
        <div className="modal-content">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-2 mb-1">
                    <h3 className="text-xl font-semibold">Select Words for Test</h3>
                    <p>Select words from the list below:</p>
                </div>
                <div>
                    <button
                        className="p-2 text-red-500 rounded-full"
                        onClick={() => setShowSelectWordsModal(false)}
                    >
                        <IoIosClose size={"40"} />
                    </button>
                </div>
            </div>
            <div className="list-disc pl-5 grid gap-2 max-h-80 py-2 overflow-y-auto">
                {result.map((word) => (
                    <button
                        key={word.id}
                        className="w-full hover:bg-gray-300 p-1 rounded flex items-center gap-2"
                        onClick={() => handleWordsSelection(word)}
                    >
                        <input
                            type="checkbox"
                            checked={selectedWords.includes(word.id)}
                            className="cursor-pointer"
                        />
                        <span>{word.word}</span>
                    </button>
                ))}
            </div>
            <div className="flex gap-8 mt-4">
                <button
                    className="bg-darkPrimary text-gray-100 p-2 rounded-sm"
                    onClick={handleConfirmWordsSelection}
                >
                    Confirm Selection{" "}
                    {selectedWords.length > 0 ? `(${selectedWords.length})` : ""}
                </button>
                <button
                    className="bg-gray-300 text-gray-700 p-2 rounded-sm"
                    onClick={handleCancelSelection}
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

WordSelectionModalContent.propTypes = {
    setShowSelectWordsModal: PropTypes.func.isRequired,
    result: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            word: PropTypes.string.isRequired,
        })
    ).isRequired,
    handleWordsSelection: PropTypes.func.isRequired,
    selectedWords: PropTypes.arrayOf(
        PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    ).isRequired,
    handleConfirmWordsSelection: PropTypes.func.isRequired,
    handleCancelSelection: PropTypes.func.isRequired,
};

export default WordSelectionModalContent
