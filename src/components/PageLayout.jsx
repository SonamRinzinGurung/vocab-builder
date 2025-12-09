import PropTypes from "prop-types";
import PageHeading from "./PageHeading";

const PageLayout = ({ heading, subHeading, children }) => {
    return (
        <main className="mx-4 lg:ml-8 mt-10 mb-16">
            {heading && <PageHeading heading={heading} subHeading={subHeading} />}
            {children}
        </main>
    )
}

export default PageLayout
PageLayout.propTypes = {
    heading: PropTypes.string,
    subHeading: PropTypes.string,
    children: PropTypes.node.isRequired,
};