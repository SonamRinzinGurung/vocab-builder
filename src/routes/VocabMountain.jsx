import { useState } from "react";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase-config";
import DefinitionGroup from "../components/DefinitionGroup";
import { useQuery } from "@tanstack/react-query";
import PropTypes from "prop-types";
import useSetTitle from "../hooks/useSetTitle";

const VocabMountain = ({ user }) => {
  useSetTitle("Vocab Mountain")
  const [search, setSearch] = useState("");
  const [result, setResult] = useState(null);
  const [isSorted, setIsSorted] = useState(false);
  const [dateSort, setDateSort] = useState("desc");

  let {
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

  if (error) return "An error has occurred: " + error.message;

  if (isPending || isQueryLoading) return <div>Loading...</div>;

  return (
    <main>
      <div className="flex flex-col gap-4 ml-4">
        <div>
          <h1>Vocab Mountain</h1>
          <form>
            <div className="flex gap-2">
              <input
                className="dark:bg-gray-800"
                type="text"
                name="search"
                placeholder="search"
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
