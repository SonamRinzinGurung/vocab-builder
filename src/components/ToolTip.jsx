import { useEffect } from "react";
import PropTypes from "prop-types";
import useWindowSize from "../hooks/useWindowSize";
import useTooltipPosition from "../hooks/useTooltipPosition";

const ToolTip = ({ text, contentRef, position }) => {
    const { positionObject, arrowPosition } = useTooltipPosition(position);

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

    const arrowStyle = {
        position: "absolute",
        borderWidth: "5px",
        borderStyle: "solid",
        ...arrowPosition,
    };

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
                marginLeft: "-60px",
                opacity: 0,
                transition: "opacity 0.3s",
                ...positionObject,
            }}
            className="tooltip"
        >
            {text}
            <div style={arrowStyle}></div>
        </span>
    );
};

export default ToolTip;

ToolTip.propTypes = {
    text: PropTypes.string.isRequired,
    position: PropTypes.string,
    contentRef: PropTypes.object.isRequired,
};
