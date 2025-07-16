import PropTypes from "prop-types";
import MobileMenuModal from "./MobileMenuModal";
import useWindowSize from "../hooks/useWindowSize";
import WordSelectionModalContent from "./WordSelectionModalContent";

const WordSelectionModal = ({
    result,
    handleWordsSelection,
    selectedWords,
    handleConfirmWordsSelection,
    handleCancelSelection,
    setShowSelectWordsModal,
    showSelectWordsModal,
}) => {
    const { isMobile } = useWindowSize();
    return (
        <>
            {showSelectWordsModal && !isMobile && (
                <div className="modal overflow-auto h-full w-[600px] rounded-sm p-4 bg-white dark:bg-gray-800 shadow-lg">
                    <WordSelectionModalContent
                        result={result}
                        selectedWords={selectedWords}
                        handleConfirmWordsSelection={handleConfirmWordsSelection}
                        handleCancelSelection={handleCancelSelection}
                        handleWordsSelection={handleWordsSelection}
                        setShowSelectWordsModal={setShowSelectWordsModal}
                    />
                </div>
            )}
            {isMobile && (
                <MobileMenuModal
                    isOpen={showSelectWordsModal}
                    setIsOpen={setShowSelectWordsModal}
                    content={
                        <div className="modal">
                            <WordSelectionModalContent
                                result={result}
                                selectedWords={selectedWords}
                                handleConfirmWordsSelection={handleConfirmWordsSelection}
                                handleCancelSelection={handleCancelSelection}
                                handleWordsSelection={handleWordsSelection}
                                setShowSelectWordsModal={setShowSelectWordsModal}
                            />
                        </div>
                    }
                />
            )}
        </>
    );
};
WordSelectionModal.propTypes = {
    result: PropTypes.array.isRequired,
    handleWordsSelection: PropTypes.func.isRequired,
    selectedWords: PropTypes.array.isRequired,
    handleConfirmWordsSelection: PropTypes.func.isRequired,
    handleCancelSelection: PropTypes.func.isRequired,
    setShowSelectWordsModal: PropTypes.func.isRequired,
    showSelectWordsModal: PropTypes.bool.isRequired,
};

export default WordSelectionModal;
