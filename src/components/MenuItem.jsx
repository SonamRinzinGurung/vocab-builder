import PropTypes from 'prop-types'

const MenuItem = ({ handleClick, content }) => {
    return (
        <button
            onClick={handleClick}
            className="hover:bg-primary hover:text-gray-100 rounded-sm flex p-2 cursor-pointer"
        >
            {content}
        </button>
    )
}

MenuItem.propTypes = {
    handleClick: PropTypes.func.isRequired,
    content: PropTypes.node.isRequired
}

export default MenuItem