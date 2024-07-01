import { useState, useRef } from "react";
import { db } from "../firebase-config";
import axios from "axios";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import WordMeaningGroup from "../components/WordMeaningGroup";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useSetTitle from "../hooks/useSetTitle";
import useAudio from "../hooks/useAudio";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { toast } from "react-toastify";
import getWordSuggestion from "../utils/getWordSuggestion";
import useKeyPress from "../hooks/useKeyPress";
import ClipLoader from "react-spinners/ClipLoader";
import { IoIosSearch } from "react-icons/io";
import ToolTip from "../components/ToolTip";

const VocabBuilder = ({ user }) => {
  useSetTitle("Vocab Builder");

  const [search, setSearch] = useState(""); // search query
  const [definition, setDefinition] = useState(null); // word definition
  const [notFound, setNotFound] = useState(false); // word not found status
  const [wordAddStatus, setWordAddStatus] = useState(false); // status of the word add button
  const [result, setResult] = useState(null); // all words in the vocab list
  const [suggestedWords, setSuggestedWords] = useState(null); // suggested words for the misspelled word
  const [isLoading, setIsLoading] = useState(false); // loading status
  const queryClient = useQueryClient();
  const searchBoxRef = useRef(null);
  const addBtnRef = useRef(null);

  useKeyPress("/", (event) => {
    // focus on search box when / is pressed
    if (document.activeElement !== searchBoxRef.current) {
      event.preventDefault();
      searchBoxRef.current.focus();
    }
  });

  // play audio for the phonetics
  const { playing, playPause, url } = useAudio(definition?.phonetics);

  // fetch all the words in the vocab list
  useQuery({
    queryKey: ["vocab-all"],
    queryFn: async () => {
      const q = query(collection(db, "vocab"), where("uid", "==", user.uid));

      const querySnapShot = await getDocs(q);
      const fetchData = [];
      querySnapShot.forEach((doc) => {
        fetchData.push({ id: doc.id, ...doc.data() });
      });
      setResult(fetchData);
      return fetchData;
    },
  });

  // search for the word
  const { mutate: searchWord } = useMutation({
    mutationFn: async (search) => {
      setIsLoading(true);
      return await axios(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`
      );
    },
    onSuccess: ({ data }) => {
      setIsLoading(false);
      setNotFound(false);
      setDefinition(data[0]);
      setWordAddStatus(true);
      setSuggestedWords(null);
    },
    onError: () => {
      setIsLoading(false);
      getWordSuggestion(search, setSuggestedWords);
      setDefinition(null);
      setNotFound(true);
      setWordAddStatus(false);
    },
  });

  // mutation to add the word to the vocab list
  const { mutate: addDefinition } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      return await addDoc(collection(db, "vocab"), {
        ...definition,
        uid: user.uid,
        timestamp: serverTimestamp(),
        group: "vocab-mountain",
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      setWordAddStatus(false);
      toast.success("Word and its definition successfully added.");
      queryClient.invalidateQueries("vocab-all");
    },
    onError: (data) => {
      setIsLoading(false);
      toast.error("Error occurred!");
      console.log(console.log(data));
    },
  });

  const handleSearch = async (e) => {
    e.preventDefault();

    if (search.trim() === "") {
      setDefinition(null);
      setNotFound(false);
      setWordAddStatus(false);
      setSuggestedWords(null);
      return;
    }
    searchWord(search);
  };

  const searchSuggestedWord = (word) => {
    searchWord(word);
    setSearch(word);
  };

  // form submission to add the word to the vocab list
  const handleAddDefinition = async (e) => {
    e.preventDefault();

    if (definition == null) {
      toast.error("There is no word to add.");
      return;
    }

    const isDuplicate = result?.find(
      (definition) => definition?.word.toLowerCase() === search.toLowerCase()
    );

    if (isDuplicate) {
      toast.error("Word already exists in the vocab list.");
      return;
    }

    addDefinition();
  };

  return (
    <main className="ml-4 lg:ml-8 my-10">
      <div className="flex flex-col gap-4 ">
        <header className="text-center lg:text-start">
          <h1>Vocab Builder</h1>
          <p className="font-subHead opacity-50">
            search for the new word you&apos;ve learned
          </p>
        </header>
        <form>
          <div className="flex gap-4 flex-col lg:flex-row items-center">
            <div className="flex bg-white dark:bg-gray-800 rounded-sm py-2 px-4 items-center gap-4">
              <input
                ref={searchBoxRef}
                className="bg:white dark:bg-gray-800 outline-none"
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setWordAddStatus(false);
                }}
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

            {definition && wordAddStatus && !isLoading && (
              <button
                className="rounded-sm bg-primary text-gray-100 w-24 h-11 font-medium text-lg"
                onClick={handleAddDefinition}
                ref={addBtnRef}
              >
                Add
                <ToolTip text="add to vocab mountain" contentRef={addBtnRef} />
              </button>
            )}
            <ClipLoader size={25} color="#6187D1" loading={isLoading} />
          </div>
        </form>
        <article className="mt-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1 ">
              <div className="font-subHead text-3xl tracking-wide">
                {definition?.word}
              </div>

              <div className="flex gap-2">
                <div className="text-sm">{definition?.phonetic}</div>
                {url && (
                  <button onClick={playPause} className="w-fit h-fit self-end">
                    {playing ? <CiPause1 /> : <CiPlay1 />}
                  </button>
                )}
              </div>
            </div>

            {definition?.meanings.map((meaning, index) => {
              return (
                <div key={index}>
                  <div className="italic opacity-85">
                    {meaning.partOfSpeech}
                  </div>

                  <WordMeaningGroup meaning={meaning} />
                </div>
              );
            })}

            {notFound && (
              <div>
                <span className="italic">No definition for the word found</span>
              </div>
            )}

            {notFound && suggestedWords?.length > 0 && (
              <div className="">
                <div className="font-subHead tracking-wider">
                  Did you mean?{" "}
                </div>
                <div className="flex gap-4 flex-wrap">
                  {suggestedWords.map((word, i) => {
                    return (
                      <button
                        className="mt-1 border px-4 rounded-xl dark:hover:bg-gray-700 hover:bg-slate-300"
                        onClick={() => searchSuggestedWord(word)}
                        key={i}
                      >
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </main>
  );
};

VocabBuilder.propTypes = {
  user: PropTypes.object.isRequired,
};

export default VocabBuilder;
