import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useState } from "react";
import DefinitionGroup from "../components/DefinitionGroup";
import { db } from "../firebase-config";
import useSetTitle from "../hooks/useSetTitle";
import VocabSearchFilterComponent from "../components/VocabSearchFilterComponent";
import PageLayout from "../components/PageLayout";

const VocabMountain = ({ user }) => {
  useSetTitle("Vocab Mountain");

  const [result, setResult] = useState([]); // stores all the search results or the fetched data
  const [dateSort, setDateSort] = useState("desc"); // state to toggle date sort
  const [notFound, setNotFound] = useState(false); // state to toggle the not found message
  const [suggestedWords, setSuggestedWords] = useState(null); // state to store suggested words

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

  if (error) return "An error has occurred: " + error.message;

  if (isPending || isQueryLoading) return null;

  return (
    <PageLayout heading="Vocab Mountain" subHeading="these are the words you&apos;ve chosen to master">
        <VocabSearchFilterComponent data={data} setResult={setResult} result={result} refetch={refetch} dateSort={dateSort} setDateSort={setDateSort} notFound={notFound} setNotFound={setNotFound} suggestedWords={suggestedWords} setSuggestedWords={setSuggestedWords} />

      <article className="vocab flex flex-col gap-4 mt-8">
          {result?.map((vocab, index) => {
            return (
              <section
                key={index}
                className="word rounded-lg border border-slate-300 dark:border-slate-700 md:max-w-xl"
              >
                <DefinitionGroup vocab={vocab} source="vocab-mountain" />
              </section>
            );
          })}
          {!notFound && result?.length === 0 && (
          <div className="mx-auto md:mx-0">
              <span className="italic">Your Vocab Mountain is Empty</span>
            </div>
          )}
        </article>
    </PageLayout>
  );
};

VocabMountain.propTypes = {
  user: PropTypes.object.isRequired,
};
export default VocabMountain;
