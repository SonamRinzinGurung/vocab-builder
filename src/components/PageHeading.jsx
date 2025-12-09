import PropTypes from "prop-types";

const PageHeading = ({ heading, subHeading, className = "" }) => {
    return (
        <header className="mb-6">
            <h1 className={className + " " + "text-3xl md:text-4xl font-subHead"}>{heading}</h1>
            {
                subHeading &&
                <p className="font-subHead md:text-lg text-base opacity-70">
                    {subHeading}
                </p>
            }
        </header>
    )
}

export default PageHeading

PageHeading.propTypes = {
    heading: PropTypes.string.isRequired,
    subHeading: PropTypes.string,
    className: PropTypes.string,
};
