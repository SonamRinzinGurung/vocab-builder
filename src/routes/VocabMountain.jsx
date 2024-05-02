import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import Fuse from "fuse.js";
import PropTypes from "prop-types";
import { useRef, useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { IoArrowDown, IoArrowUp } from "react-icons/io5";
import { TiSortAlphabetically } from "react-icons/ti";
import DefinitionGroup from "../components/DefinitionGroup";
import MenuModal from "../components/MenuModal";
import ToolTip from "../components/ToolTip";
import { db } from "../firebase-config";
import useKeyPress from "../hooks/useKeyPress";
import useSetTitle from "../hooks/useSetTitle";
import { FaSortAmountDown } from "react-icons/fa";

const VocabMountain = ({ user }) => {
  useSetTitle("Vocab Mountain");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const [dateSort, setDateSort] = useState("desc");
  const [suggestedWords, setSuggestedWords] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [modal, setModal] = useState(false);
  const searchBoxRef = useRef(null);
  const modalRef = useRef(null);
  const sortMenuRef = useRef(null);

  useKeyPress("/", (event) => {
    if (document.activeElement !== searchBoxRef.current) {
      event.preventDefault();
      searchBoxRef.current.focus();
    }
  });

  const {
    error,
    data,
    isPending,
    isLoading: isQueryLoading,
    refetch,
  } = useQuery({
    queryKey: ["vocab-mountain"],
    queryFn: async () => {
      const q = query(
        collection(db, "vocab"),
        where("uid", "==", user.uid),
        where("group", "==", "vocab-mountain"),
        orderBy("timestamp", dateSort)
      );

      const querySnapShot = await getDocs(q);
      const fetchData = [];
      querySnapShot.forEach((doc) => {
        fetchData.push({ id: doc.id, ...doc.data() });
      });
      setResult(fetchData);
      setSuggestedWords(null);
      setNotFound(false);
      return fetchData;
    },
    refetchOnWindowFocus: false,
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

    if (searchResult.length === 0) {
      const options = {
        keys: ["word"],
        threshold: 0.3,
      };
      const fuse = new Fuse(data, options);
      const result = fuse.search(search);
      const suggestedWords = result?.map((i) => i?.item?.word);
      setSuggestedWords(suggestedWords);
      setNotFound(true);
    }
  };

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
    setIsSorted(false); // rest alphabetic sort

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

  if (error) return "An error has occurred: " + error.message;

  if (isPending || isQueryLoading) return null;

  return (
    <main>
      <div className="flex flex-col gap-4 lg:ml-8 my-10">
        <header className="text-center lg:text-start">
          <h1>Vocab Mountain</h1>
          <p className="font-subHead opacity-50">
            these are the words you&apos;ve chosen to master
          </p>
        </header>
        <form className="mx-auto lg:mx-0">
          <div className="flex gap-2 flex-row items-center">
            <div className="flex bg-white dark:bg-gray-800 rounded-sm py-2 px-4 items-center gap-4">
              <input
                ref={searchBoxRef}
                className="bg:white dark:bg-gray-800 outline-none"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                name="search"
                placeholder="Search"
              />

              <p
                className={`px-2 text-gray-400 hidden lg:block ${search && "invisible"
                  }`}
              >
                Press /
              </p>
              <button
                className="cursor-pointer"
                onClick={handleSearch}
                type="submit"
              >
                <IoIosSearch size={25} />
              </button>
            </div>
            <div
              ref={modalRef}
              className="relative"
              onClick={() => setModal((prev) => !prev)}
            >
              <div className="cursor-pointer" ref={sortMenuRef}>
                <FaSortAmountDown size={28} />
                <ToolTip text="sort" contentRef={sortMenuRef} />
              </div>
              {modal && (
                <MenuModal
                  className="w-24 lg:w-40 z-50 right-2 top-8"
                  modalRef={modalRef}
                  setModal={setModal}
                >
                  <div className="">
                    <div
                      onClick={handleSort}
                      className="hover:bg-primary hover:text-gray-100 rounded-sm flex justify-center m-1 p-1 cursor-pointer"
                    >
                      <div className="flex items-center gap-1">
                        <div>{isSorted ? "UnSort" : "Sort"}</div>
                        {!isSorted && <TiSortAlphabetically />}
                      </div>
                    </div>
                    <div
                      onClick={handleDateSort}
                      className="hover:bg-primary hover:text-gray-100 rounded-sm flex justify-center m-1 p-1 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <div>Date</div>
                        <div>
                          {dateSort === "desc" ? (
                            <IoArrowUp />
                          ) : (
                            <IoArrowDown />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </MenuModal>
              )}
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
        <article className="vocab flex flex-col gap-4 items-center lg:items-start">
          {result?.map((vocab, index) => {
            return (
              <section
                key={index}
                className="word w-4/5 lg:w-1/2 rounded-lg border border-slate-300 dark:border-slate-700"
              >
                <DefinitionGroup vocab={vocab} source="vocab-mountain" />
              </section>
            );
          })}
        </article>
      </div>
    </main>
  );
};

VocabMountain.propTypes = {
  user: PropTypes.object.isRequired,
};
export default VocabMountain;
