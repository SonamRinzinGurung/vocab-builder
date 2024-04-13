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

const HomePage = ({ user }) => {
  useSetTitle("Vocab Builder");

  const [search, setSearch] = useState("");
  const [definition, setDefinition] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [wordAddStatus, setWordAddStatus] = useState(false);
  const [result, setResult] = useState(null);
  const [suggestedWords, setSuggestedWords] = useState(null);
  const queryClient = useQueryClient();
  const searchBoxRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  useKeyPress("/", (event) => {
    if (document.activeElement !== searchBoxRef.current) {
      event.preventDefault();
      searchBoxRef.current.focus();
    }
  });

  const { playing, playPause } = useAudio(definition?.phonetics);
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
      setWordAddStatus(false);
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

  const { mutate: addDefinition } = useMutation({
    mutationFn: async () => {
      setIsLoading(true);
      return await addDoc(collection(db, "vocab"), {
        ...definition,
        uid: user.uid,
        timestamp: serverTimestamp(),
      });
    },
    onSuccess: () => {
      setIsLoading(false);
      setWordAddStatus(true);
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
    searchWord(search);
  };

  const searchSuggestedWord = (word) => {
    searchWord(word);
    setSearch(word);
  };

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
      toast.error("Word already exists in the vocab mountain.");
      return;
    }

    addDefinition();
  };

  return (
    <main className="mx-4 my-10">
      <div className="flex flex-col gap-4 ">
        <div className="text-center lg:text-start">
          <p className="font-subHead opacity-50">search for the new word you&apos;ve learned</p>
        </div>
        <form>
          <div className="flex gap-4 flex-col lg:flex-row items-center">
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
              <p className="px-2 text-gray-400 hidden lg:block">Press /</p>
              <button
                disabled={!search}
                className="cursor-pointer"
                onClick={handleSearch}
                type="submit"
              >
                <IoIosSearch size={25} />
              </button>
            </div>

            {definition && !wordAddStatus && !isLoading && (
              <button className="px-4 lg:self-stretch  rounded-sm bg-primary text-gray-100 w-fit" onClick={handleAddDefinition}>
                Add
              </button>
            )}
            <ClipLoader size={25} color="#6187D1" loading={isLoading} />
          </div>
        </form>
        <section className="">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <div>{definition?.word}</div>
              <div className="text-sm">{definition?.phonetic}</div>

              {definition?.phonetics && (
                <button onClick={playPause}>
                  {playing ? <CiPause1 /> : <CiPlay1 />}
                </button>
              )}
            </div>

            {definition?.meanings.map((meaning, index) => {
              return (
                <div key={index}>
                  <div>{meaning.partOfSpeech}</div>

                  <WordMeaningGroup meaning={meaning} />
                </div>
              );
            })}

            {notFound && (
              <div>
                <p>No definition for the word found.</p>
              </div>
            )}

            {notFound && suggestedWords.length > 0 && (
              <div className="">
                <p>Did you mean? </p>
                <div className="flex gap-2 flex-wrap">
                  {suggestedWords.map((word, i) => {
                    return (
                      <button
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
        </section>
      </div>
    </main>
  );
};

HomePage.propTypes = {
  user: PropTypes.object.isRequired,
};

export default HomePage;
