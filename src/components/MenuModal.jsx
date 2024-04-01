import PropTypes from "prop-types";

const MenuModal = ({ vocabId, handleRemove }) => {
  return (
    <div className="absolute z-50 w-28 lg:w-44 top-9">
      <div className="border bg-white flex w-full flex-col">
        <button onClick={() => handleRemove(vocabId)}>Remove</button>
      </div>
    </div>
  );
};

MenuModal.propTypes = {
  vocabId: PropTypes.string.isRequired,
  handleRemove: PropTypes.func.isRequired,
};

export default MenuModal;
