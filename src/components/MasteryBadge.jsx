import PropTypes from "prop-types";

function MasteryBadge({ mastery }) {
    const styles = [
        "bg-slate-100 text-slate-600", // New
        "bg-green-100 text-green-700", // Learning
        "bg-blue-100 text-blue-700",   // Familiar
        "bg-yellow-200 text-yellow-800" // Mastered
    ];

    const labels = ["New", "Learning", "Familiar", "Mastered"];

    return (
        <span className={`w-fit px-2 py-0.5 rounded text-xs font-medium ${styles[mastery]}`}>
            {labels[mastery]}
        </span>
    );
}
MasteryBadge.propTypes = {
    mastery: PropTypes.number.isRequired,
};

export default MasteryBadge;