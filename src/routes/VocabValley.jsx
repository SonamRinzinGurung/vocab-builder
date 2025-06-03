import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import PropTypes from "prop-types";
import { useState } from "react";
import DefinitionGroup from "../components/DefinitionGroup";
import { db } from "../firebase-config";
import useSetTitle from "../hooks/useSetTitle";
import VocabSearchFilterComponent from "../components/VocabSearchFilterComponent";

const VocabValley = ({ user }) => {
    useSetTitle("Vocab Valley");
    const [result, setResult] = useState(null); // stores all the search results or the fetched data
    const [dateSort, setDateSort] = useState("desc"); // state to toggle date sort
    const [suggestedWords, setSuggestedWords] = useState(null); // state to store suggested words
    const [notFound, setNotFound] = useState(false); // state to toggle the not found message

    const {
        error,
        data,
        isPending,
        isLoading: isQueryLoading,
        refetch,
    } = useQuery({
        queryKey: ["vocab-valley"],
        queryFn: async () => {
            const q = query(
                collection(db, "vocab"),
                where("uid", "==", user.uid),
                where("group", "==", "vocab-valley"),
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
        <main>
            <div className="flex flex-col gap-4 lg:ml-8 my-10">
                <header className="text-center lg:text-start">
                    <h1>Vocab Valley</h1>
                    <p className="font-subHead opacity-50">
                        these are the words you&apos;ve already mastered
                    </p>
                </header>

                <VocabSearchFilterComponent data={data} setResult={setResult} result={result} refetch={refetch} dateSort={dateSort} setDateSort={setDateSort} notFound={notFound} setNotFound={setNotFound} suggestedWords={suggestedWords} setSuggestedWords={setSuggestedWords} />
                <article className="vocab flex flex-col gap-4 items-center lg:items-start">
                    {result?.map((vocab, index) => {
                        return (
                            <section
                                key={index}
                                className="word w-4/5 lg:w-1/2 rounded-lg border border-slate-300 dark:border-slate-700"
                            >
                                <DefinitionGroup vocab={vocab} source="vocab-valley" />
                            </section>
                        );
                    })}
                    {!notFound && result?.length === 0 && (
                        <div className="mx-auto lg:mx-0">
                            <span className="italic">Your Vocab Valley is Empty</span>
                        </div>
                    )}
                </article>
            </div>
        </main>
    );
};

VocabValley.propTypes = {
    user: PropTypes.object.isRequired,
};
export default VocabValley;
