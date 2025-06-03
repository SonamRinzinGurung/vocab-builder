import PropTypes from "prop-types";
import { IoIosSearch, IoIosClose } from "react-icons/io";


const SearchTextBox = ({ searchBoxRef, search, setSearch, setWordAddStatus, handleClearSearch, handleSearch }) => {
    return (
        <div className="flex bg-white dark:bg-gray-800 rounded-sm py-2 px-3 items-center gap-2 md:w-96 w-80 h-12">
            <input
                ref={searchBoxRef}
                className="bg:white dark:bg-gray-800 outline-none"
                type="text"
                value={search}
                onChange={(e) => {
                    setSearch(e.target.value);
                    setWordAddStatus !== null && setWordAddStatus(false)
                }}
                name="search"
                placeholder="Search"
            />
            <p
                className={`ml-auto text-gray-400 hidden lg:block ${search && "invisible"
                    }`}
            >
                Press /
            </p>
            <button type="button" onClick={handleClearSearch} className={`${!search && 'hidden'}`}><IoIosClose size={30} /></button>
            <button
                className="cursor-pointer ml-auto"
                onClick={handleSearch}
                type="submit"
            >
                <IoIosSearch size={25} />
            </button>
        </div>
    )
}

SearchTextBox.propTypes = {
    searchBoxRef: PropTypes.object.isRequired,
    search: PropTypes.string.isRequired,
    setSearch: PropTypes.func.isRequired,
    setWordAddStatus: PropTypes.func,
    handleClearSearch: PropTypes.func.isRequired,
    handleSearch: PropTypes.func.isRequired

}

export default SearchTextBox