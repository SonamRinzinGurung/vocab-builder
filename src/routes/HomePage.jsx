import { useState } from "react";
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

const HomePage = ({ user }) => {
  useSetTitle("Vocab Builder");
  const [search, setSearch] = useState("");
  const [definition, setDefinition] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [wordAddStatus, setWordAddStatus] = useState(false);
  const [result, setResult] = useState(null);
  const queryClient = useQueryClient();

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
      return await axios(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`
      );
    },
    onSuccess: ({ data }) => {
      setNotFound(false);
      setDefinition(data[0]);
      setWordAddStatus(false);
    },
    onError: () => {
      setDefinition(null);
      setNotFound(true);
      setWordAddStatus(false);
    },
  });

  const { mutate: addDefinition } = useMutation({
    mutationFn: async () => {
      return await addDoc(collection(db, "vocab"), {
        ...definition,
        uid: user.uid,
        timestamp: serverTimestamp(),
      });
    },
    onSuccess: () => {
      setWordAddStatus(true);
      toast.success("Word and its definition successfully added.");
      queryClient.invalidateQueries("vocab-all");
    },
    onError: (data) => {
      toast.error("Error occurred!");
      console.log(console.log(data));
    },
  });

  const handleSearch = async (e) => {
    e.preventDefault();
    searchWord(search);
  };

  const handleAddDefinition = async (e) => {
    e.preventDefault();

    if (definition == null) {
      toast.error("There is no word to add.");
      return;
    }

    const duplicate = result?.find(
      (definition) => definition?.word.toLowerCase() === search.toLowerCase()
    );

    if (duplicate) {
      toast.error("Word already exists in the vocab mountain.");
      return;
    }

    addDefinition();
  };

  return (
    <main className="ml-4">
      <div className="flex flex-col gap-4 items-center lg:items-start">
        <div>
          <p>Search for the new word you learned</p>
        </div>
        <form>
          <div className="flex flex-col gap-4 items-center lg:flex-row">
            <input
              className="w-full dark:bg-gray-800"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="search"
              placeholder="search word"
            />
            <div className="flex gap-4">
              <button
                disabled={search ? false : true}
                className="border px-2"
                onClick={handleSearch}
                type="submit"
              >
                Search
              </button>
              {definition && !wordAddStatus ? (
                <button className="border px-2" onClick={handleAddDefinition}>
                  Add
                </button>
              ) : null}
            </div>
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
                <p>No definition of the word found.</p>
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
