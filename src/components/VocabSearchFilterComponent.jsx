import { useRef, useState } from "react";
import SearchTextBox from "../components/SearchTextBox";
import { FaSortAmountDown } from "react-icons/fa";
import ToolTip from "./ToolTip";
import MenuModal from "./MenuModal";
import MenuItem from "./MenuItem";
import { TiSortAlphabetically } from "react-icons/ti";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import MobileMenuModal from "./MobileMenuModal";
import useKeyPress from "../hooks/useKeyPress";
import useWindowSize from "../hooks/useWindowSize";
import Fuse from "fuse.js";
import PropTypes from "prop-types";

const VocabSearchFilterComponent = ({ data, setResult, result, refetch, dateSort, setDateSort, notFound, setNotFound, suggestedWords, setSuggestedWords }) => {
    const searchBoxRef = useRef(null);
    const modalRef = useRef(null);
    const sortMenuRef = useRef(null);
    const [modal, setModal] = useState(false); // state to control the visibility of the sort menu modal
    const [search, setSearch] = useState(""); // search state for the search input
    const [isSorted, setIsSorted] = useState(false); // state to toggle alphabetic sort

    const { isMobile } = useWindowSize();

    // listen for the "/" key press to focus on the search input
    useKeyPress("/", (event) => {
        if (document.activeElement !== searchBoxRef?.current) {
            event.preventDefault();
            searchBoxRef?.current.focus();
        }
    });


    const handleSearch = (e) => {
        e.preventDefault();
        let searchResult = [];

        data?.find((definition) => {
            const word = definition.word;
            if (word.toLowerCase().startsWith(search.toLocaleLowerCase())) {
                searchResult.push(definition);
            }
            return null;
        });
        setResult(searchResult);
        setNotFound(false);

        // if no search result, suggest words using Fuse.js
        if (searchResult.length === 0) {
            const options = {
                keys: ["word"],
                threshold: 0.3,
            };
            const fuse = new Fuse(data, options);
            const result = fuse.search(search);
            const suggestedWords = result?.map((i) => i?.item?.word);
            setSuggestedWords(suggestedWords); // set suggested words
            setNotFound(true);
        }
    };

    const handleClearSearch = () => {
        setSearch("")
    }

    const handleSort = (e) => {
        e.preventDefault();
        setDateSort("desc"); // reset date sort

        if (isSorted) {
            setResult(data);
            setSearch("");
            setIsSorted(false);
        } else {
            const sortedResult = [...result]?.sort((a, b) => {
                if (a.word > b.word) {
                    return 1;
                } else if (b.word > a.word) {
                    return -1;
                } else {
                    return 0;
                }
            });
            setResult(sortedResult);
            setIsSorted(true);
        }
    };

    const handleDateSort = (e) => {
        e.preventDefault();
        setIsSorted(false); // reset alphabetic sort

        if (dateSort === "desc") {
            setDateSort("asc");
            setTimeout(() => refetch(), 100);
        } else if (dateSort === "asc") {
            setDateSort("desc");
            setTimeout(() => refetch(), 100);
        } else {
            return;
        }
    };

    const handleSearchSuggestedWord = (suggestedWord) => {
        let searchResult = [];

        data?.find((definition) => {
            const word = definition.word;
            if (word.toLocaleLowerCase() === suggestedWord.toLocaleLowerCase()) {
                searchResult.push(definition);
            }
            return null;
        });

        setResult(searchResult);
        setSearch(suggestedWord);
        setNotFound(false);
        setSuggestedWords(null);
    };

    return (
        <>
            <form className="mx-auto lg:mx-0">
                <div className="flex gap-2 flex-row items-center">
                    <SearchTextBox searchBoxRef={searchBoxRef} search={search} setSearch={setSearch} handleClearSearch={handleClearSearch} handleSearch={handleSearch} setWordAddStatus={null} />
                    <div
                        ref={modalRef}
                        className="relative"
                        onClick={() => setModal((prev) => !prev)}
                    >
                        <div className="cursor-pointer" ref={sortMenuRef}>
                            <FaSortAmountDown size={28} />
                            <ToolTip text="sort" contentRef={sortMenuRef} />
                        </div>
                        {modal && !isMobile && (
                            <MenuModal
                                className="w-32 lg:w-48 z-50 right-2 top-8"
                                modalRef={modalRef}
                                setModal={setModal}
                            >
                                <div className="flex flex-col">

                                    <MenuItem handleClick={handleSort} content={
                                        <div className="flex items-center gap-2">
                                            <TiSortAlphabetically />
                                            <div>{isSorted ? "UnSort" : "Sort"}</div>
                                        </div>
                                    } />
                                    <MenuItem handleClick={handleDateSort} content={
                                        <div className="flex items-center gap-2">
                                            <div>
                                                {dateSort === "desc" ? (
                                                    <IoArrowUp />
                                                ) : (
                                                    <IoArrowDown />
                                                )}
                                            </div>
                                            <div>Date</div>
                                        </div>
                                    } />
                                </div>
                            </MenuModal>
                        )}

                        {
                            isMobile &&
                            <MobileMenuModal isOpen={modal} setIsOpen={setModal} content={
                                <div className="flex flex-col gap-8">
                                    <div className="flex w-full items-center justify-between">
                                        <div className="text-xl font-medium">Sort Options</div>
                                    </div>
                                    <div className="flex flex-col gap-2">

                                        <MenuItem handleClick={handleSort} content={
                                            <div className="flex items-center gap-2">
                                                <TiSortAlphabetically />
                                                <div>{isSorted ? "UnSort" : "Sort"}</div>
                                            </div>
                                        } />
                                        <MenuItem handleClick={handleDateSort} content={
                                            <div className="flex items-center gap-2">
                                                <div>
                                                    {dateSort === "desc" ? (
                                                        <IoArrowUp />
                                                    ) : (
                                                        <IoArrowDown />
                                                    )}
                                                </div>
                                                <div>Date</div>
                                            </div>
                                        } />
                                    </div>
                                </div>
                            } />
                        }

                    </div>
                </div>
            </form>

            {notFound && (
                <div className="mx-auto lg:mx-0">
                    <span className="italic">
                        {" "}
                        This word is not in your vocab mountain
                    </span>
                </div>
            )}
            {notFound && suggestedWords?.length > 0 && (
                <div className="mx-auto lg:mx-0">
                    <div className="font-subHead tracking-wider">Did you mean? </div>
                    <div className="flex gap-2 flex-wrap justify-center lg:justify-start">
                        {suggestedWords.map((word, index) => {
                            return (
                                <button
                                    className="mt-1 border px-4 rounded-xl dark:hover:bg-gray-700 hover:bg-slate-300"
                                    key={index}
                                    onClick={() => handleSearchSuggestedWord(word)}
                                >
                                    {word}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </>
    )
}

export default VocabSearchFilterComponent

VocabSearchFilterComponent.propTypes = {
    data: PropTypes.array.isRequired,
    setResult: PropTypes.func.isRequired,
    result: PropTypes.array.isRequired,
    refetch: PropTypes.func.isRequired,
    dateSort: PropTypes.string.isRequired,
    setDateSort: PropTypes.func.isRequired,
    notFound: PropTypes.bool.isRequired,
    setNotFound: PropTypes.func.isRequired,
    suggestedWords: PropTypes.string,
    setSuggestedWords: PropTypes.func.isRequired
};