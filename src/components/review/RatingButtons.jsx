import PropTypes from "prop-types";

export default function RatingButtons({ onRate }) {
    const rates = [
        { q: 0, label: "Forgot", color: "bg-red-500" },
        { q: 1, label: "Hard", color: "bg-orange-500" },
        { q: 2, label: "Good", color: "bg-blue-500" },
        { q: 3, label: "Easy", color: "bg-green-600" },
    ];

    return (
        <div className="flex flex-wrap gap-4 justify-center">
            {rates.map(r => (
                <button
                    key={r.q}
                    className={`${r.color} text-white px-4 py-2 text-sm rounded-lg`}
                    onClick={() => onRate(r.q)}
                >
                    {r.label}
                </button>
            ))}
        </div>
    );
}

RatingButtons.propTypes = {
    onRate: PropTypes.func.isRequired,
};
