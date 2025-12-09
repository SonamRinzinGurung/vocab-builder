import PropTypes from "prop-types";

export default function RatingButtons({ onRate }) {
    const rates = [
        { q: 0, label: "Forgot", color: "bg-red-500 hover:bg-red-600" },
        { q: 1, label: "Hard", color: "bg-orange-500 hover:bg-orange-600" },
        { q: 2, label: "Good", color: "bg-blue-500 hover:bg-blue-600" },
        { q: 3, label: "Easy", color: "bg-green-600 hover:bg-green-700" },
    ];

    return (
        <div className="flex flex-wrap gap-3 justify-center px-4 pb-6">
            {rates.map(r => (
                <button
                    key={r.q}
                    className={`${r.color} text-white px-6 py-3 text-sm rounded-md transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg md:max-w-20 max-w-16 text-center flex justify-center`}
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