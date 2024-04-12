import { useState, useRef } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";
import DefinitionGroup from "../components/DefinitionGroup";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useSetTitle from "../hooks/useSetTitle";
import Fuse from "fuse.js";
import useKeyPress from "../hooks/useKeyPress";
import useWindowSize from "../hooks/useWindowSize";

const VocabMountain = ({ user }) => {
  useSetTitle("Vocab Mountain");
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const [dateSort, setDateSort] = useState("desc");
  const [suggestedWords, setSuggestedWords] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const searchBoxRef = useRef(null);
  const { isMobile } = useWindowSize();
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
  });

  const handleSearch = (e) => {
    e.preventDefault();
    let searchResult = [];

    data?.find((definition) => {
      const word = definition.word;
      if (word.toLowerCase().startsWith(search.toLocaleLowerCase())) {
        searchResult.push(definition);
      }
    });
    setResult(searchResult);

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

    if (isSorted) {
      setResult(data);
      setSearch("");
      setIsSorted(false);
    } else {
      const sortedResult = [...result]?.sort((a, b) =>
        a.word > b.word ? 1 : b.word > a.word ? -1 : 0
      );
      setResult(sortedResult);
      setIsSorted(true);
    }
  };

  const handleDateSort = (e) => {
    e.preventDefault();

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
    });
    setResult(searchResult);
    setNotFound(false);
    setSuggestedWords(null);
  };

  if (error) return "An error has occurred: " + error.message;

  if (isPending || isQueryLoading) return null;

  return (
    <main>
      <div className="flex flex-col gap-4 mx-4 my-10">
        <div>
          <h1>Vocab Mountain</h1>
          <form>
            <div className="flex gap-2">
              <input
                ref={searchBoxRef}
                className="dark:bg-gray-800"
                type="text"
                name="search"
                placeholder={isMobile ? "Search" : "Search    press /"}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button onClick={handleSearch}>Search</button>
              <button onClick={handleSort}>
                {isSorted ? "UnSort" : "Sort"}
              </button>
              <button onClick={handleDateSort}>
                Date {dateSort === "desc" ? "desc" : "asc"}
              </button>
            </div>
          </form>
        </div>

        {notFound && (
          <div>
            <p>This word is not in your vocab mountain.</p>
          </div>
        )}
        {notFound && suggestedWords.length > 0 && (
          <div className="">
            <p>Did you mean? </p>
            <div className="flex gap-2 flex-wrap">
              {suggestedWords.map((word, index) => {
                return (
                  <div
                    className="cursor-pointer"
                    key={index}
                    onClick={() => handleSearchSuggestedWord(word)}
                  >
                    {word}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {result?.map((vocab, index) => {
          return (
            <section key={index} className="">
              <DefinitionGroup vocab={vocab} />
            </section>
          );
        })}
      </div>
    </main>
  );
};

VocabMountain.propTypes = {
  user: PropTypes.object.isRequired,
};
export default VocabMountain;
