import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase-config";
import axios from "axios";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import WordMeaningGroup from "../components/WordMeaningGroup";

const HomePage = () => {
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);
  const [definition, setDefinition] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [wordAddStatus, setWordAddStatus] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`
      );
      setNotFound(false);
      setDefinition(data[0]);
      setWordAddStatus(false);
    } catch (error) {
      setDefinition(null);
      setNotFound(true);
    }
  };
  const phonetic = definition?.phonetics.find((p) => p.audio);

  const handleAddDefinition = async (e) => {
    e.preventDefault();

    try {
      if (definition == null) {
        return;
      }

      await addDoc(collection(db, "vocab"), {
        ...definition,
        uid: user,
        timestamp: serverTimestamp(),
      });
      setWordAddStatus(true);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        setUser(uid);
      } else {
        setUser(null);
      }
    });
  }, [user]);

  return (
    <>
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
                {definition && (
                  <button className="border px-2" onClick={handleAddDefinition}>
                    Add
                  </button>
                )}
              </div>
            </div>
          </form>
          {wordAddStatus && <li>Word Added Successfully!</li>}
          <section className="">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <div>{definition?.word}</div>
                <div className="text-sm">{definition?.phonetic}</div>

                {phonetic && <audio controls src={phonetic.audio} />}
              </div>
              <>
                {definition?.meanings.map((meaning, index) => {
                  return (
                    <div key={index}>
                      <div>{meaning.partOfSpeech}</div>

                      <WordMeaningGroup meaning={meaning} />
                    </div>
                  );
                })}
              </>
              {notFound && (
                <div>
                  <p>No definition of the word found.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
};

export default HomePage;
