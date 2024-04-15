import { useEffect } from "react";
import PropTypes from "prop-types";
import useWindowSize from "../hooks/useWindowSize";
const ToolTip = ({ text, contentRef }) => {
    const { isMobile } = useWindowSize();
    useEffect(() => {
        const contentRefInstance = contentRef.current;

        const tooltip = contentRefInstance.querySelector(".tooltip");

        const mouseOverHandler = () => {
            if (isMobile) return;
            tooltip.style.visibility = "visible";
            tooltip.style.opacity = 1;
        };

        const mouseOutHandler = () => {
            if (isMobile) return;
            tooltip.style.visibility = "hidden";
            tooltip.style.opacity = 0;
        };

        contentRefInstance.addEventListener("mouseover", mouseOverHandler);
        contentRefInstance.addEventListener("mouseout", mouseOutHandler);

        return () => {
            contentRefInstance.removeEventListener("mouseover", mouseOverHandler);
            contentRefInstance.removeEventListener("mouseout", mouseOutHandler);
        };
    }, [isMobile]);

    return (
        <span
            style={{
                visibility: "hidden",
                width: "120px",
                backgroundColor: "#555",
                color: "#f0f4f8",
                textAlign: "center",
                borderRadius: "6px",
                padding: "5px 0",
                position: "absolute",
                zIndex: 1,
                bottom: "125%",
                left: "50%",
                marginLeft: "-60px",
                opacity: 0,
                transition: "opacity 0.3s",
            }}
            className="tooltip"
        >
            {text}
        </span>
    );
};

export default ToolTip;

ToolTip.propTypes = {
    text: PropTypes.string.isRequired,
    contentRef: PropTypes.object.isRequired,
};
