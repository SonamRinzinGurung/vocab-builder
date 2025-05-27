import PropTypes from "prop-types";
import { useEffect } from "react";

const MenuModal = ({ children, className, modalRef, setModal }) => {

  useEffect(() => {
    function listenClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
      }
    }
    document.addEventListener("mousedown", listenClickOutside);

    return () => {
      document.removeEventListener("mousedown", listenClickOutside);
    };
  }, []);

  return (
    <div className={`absolute` + ` ` + className}>
      <div className="border bg-white flex w-full flex-col dark:bg-gray-800 dark:border-gray-500 rounded-md gap-2 p-3">
        {children}
      </div>
    </div>
  );
};

MenuModal.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  modalRef: PropTypes.object.isRequired,
  setModal: PropTypes.func.isRequired,
};

export default MenuModal;
