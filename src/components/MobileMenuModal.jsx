import { useEffect, useRef } from "react"
import { Sheet } from "react-modal-sheet"
import PropTypes from "prop-types"

const MobileMenuModal = ({ content, isOpen, setIsOpen }) => {

    const containerRef = useRef(null);

    // Close the bottom sheet when clicking outside the container
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [open, setIsOpen]);

    return (

        <Sheet
            isOpen={isOpen}
            detent="content-height"
            onClose={() => setIsOpen(false)}
            dragToDismiss={true}
        >
            <Sheet.Container
                className=""
                ref={containerRef}
                style={{
                    padding: "16px",
                    backgroundColor: "var(--bottom-sheet-bg-color)",
                    color: "var(--bottom-sheet-text-color)",
                }}

            >
                <Sheet.Content>{content}</Sheet.Content>
            </Sheet.Container>
            <Sheet.Backdrop />
        </Sheet>

    )
}

export default MobileMenuModal

MobileMenuModal.propTypes = {
    content: PropTypes.node.isRequired,
    isOpen: PropTypes.bool.isRequired,
    setIsOpen: PropTypes.func.isRequired,
};