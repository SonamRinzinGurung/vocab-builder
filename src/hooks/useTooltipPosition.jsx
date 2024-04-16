// Desc: Tooltip position hook
const useTooltipPosition = (position) => {
    let positionObject = {};
    let arrowPosition = {};

    switch (position) {
        case "top":
            positionObject = {
                bottom: "100%",
                left: "50%",
                transform: "translate(0%, -20%)"
            };
            arrowPosition = {
                top: "100%",
                left: "50%",
                marginLeft: "-5px",
                borderColor: "#555 transparent transparent transparent",
            };
            break;
        case "bottom":
            positionObject = {
                top: "100%",
                left: "50%",
                transform: "translate(0%, 20%)"
            };
            arrowPosition = {
                bottom: "100%",
                left: "50%",
                marginLeft: "-5px",
                borderColor: "transparent transparent #555 transparent",
            };
            break;
        case "left":
            positionObject = {
                right: "100%",
                top: "50%",
                transform: "translate(-7%, -50%)"
            };
            arrowPosition = {
                top: "50%",
                left: "100%",
                marginTop: "-5px",
                borderColor: "transparent transparent transparent #555",
            };
            break;
        case "right":
            positionObject = {
                left: "100%",
                top: "50%",
                transform: "translate(58%, -50%)"
            };
            arrowPosition = {
                top: "50%",
                right: "100%",
                marginTop: "-5px",
                borderColor: "transparent #555 transparent transparent",
            };
            break;
        default: // default is top
            positionObject = {
                bottom: "100%",
                left: "50%",
                transform: "translate(0%, -20%)"
            };
            arrowPosition = {
                top: "100%",
                left: "50%",
                marginLeft: "-5px",
                borderColor: "#555 transparent transparent transparent",
            };
            break;
    }
    return { positionObject, arrowPosition };
};

export default useTooltipPosition;
