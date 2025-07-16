import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSetTitle from "../hooks/useSetTitle";
import {
    collection,
    doc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shuffleArray } from "../utils/shuffleArray";
import { toast } from "react-toastify";
import VocabTestSettings from "../components/VocabTestSettings";
import VocabTestQuiz from "../components/VocabTestQuiz";
import VocabTestResults from "../components/VocabTestResults";

const VocabTest = ({ user }) => {
    useSetTitle("Vocab Test");
    const [result, setResult] = useState(null); // stores all the search results or the fetched data
    const [testStep, setTestStep] = useState(0); // tracks the current step in the test
    const [wordCount, setWordCount] = useState(""); // tracks the number of words in the test
    const [testWords, setTestWords] = useState([]); // stores the words selected for the test
    const [questionOptions, setQuestionOptions] = useState([]); // stores the options for each question in the test
    const [selectedOptions, setSelectedOptions] = useState({}); // stores the user's selected options for each question
    const [selectedWords, setSelectedWords] = useState([]); // stores the words selected by the user for the test
    const [showSelectWordsModal, setShowSelectWordsModal] = useState(false); // controls the visibility of the select words modal
    const queryClient = useQueryClient();

    // Function to reset the test states
    const resetTest = () => {
        setTestStep(0);
        setWordCount("");
        setTestWords([]);
        setQuestionOptions([]);
        setSelectedOptions({});
        setSelectedWords([]);
        setShowSelectWordsModal(false);
    };

    const {
        error,
        isPending,
        isLoading: isQueryLoading,
    } = useQuery({
        queryKey: ["vocab-mountain"],
        queryFn: async () => {
            const q = query(
                collection(db, "vocab"),
                where("uid", "==", user.uid),
                where("group", "==", "vocab-mountain")
            );

            const querySnapShot = await getDocs(q);
            const fetchData = [];
            querySnapShot.forEach((doc) => {
                fetchData.push({ id: doc.id, ...doc.data() });
            });
            setResult(fetchData);
            return fetchData;
        },
        refetchOnWindowFocus: false,
    });

    // ensure wordCount does not exceed the number of available words
    useEffect(() => {
        if (wordCount > result?.length) {
            setWordCount(result?.length || 10);
        }
    }, [wordCount, result]);

    const generateOptions = (currentWord, allWords) => {
        const options = allWords.filter((word) => word.id !== currentWord.id);

        const shuffledOptions = shuffleArray(options);

        const shuffledLimitedOptions = shuffledOptions
            .slice(0, 3)
            .map((word) => word.meanings[0].definitions[0].definition);

        shuffledLimitedOptions.push(
            currentWord.meanings[0].definitions[0].definition
        );
        return shuffleArray(shuffledLimitedOptions);
    };

    const handleStartTest = () => {
        if (selectedWords.length > 0) {
            // If specific words are selected, use them
            const optionsArr = testWords?.map((word) =>
                generateOptions(word, result)
            );
            setQuestionOptions(optionsArr);
            setTestStep(1);
            return;
        }

        const shuffledWords = shuffleArray(result);
        const limitedWords = shuffledWords?.slice(0, wordCount) || [];
        setTestWords(limitedWords);

        // Generate options for each word and store them
        const optionsArr = limitedWords?.map((word) =>
            generateOptions(word, result)
        );
        setQuestionOptions(optionsArr);
        // console.log(optionsArr)

        setTestStep(1);
    };

    // Mutation to move the word to Vocab Valley
    const { mutate: moveWord } = useMutation({
        mutationFn: async (id) => {
            const docRef = doc(db, "vocab", id);
            await updateDoc(docRef, {
                group: "vocab-valley",
            });
        },
        onSuccess: () => { },
        onError: (error) => {
            console.log(error);
            toast.error("Error occurred!");
        },
    });

    const handleMoveToVocabValley = () => {
        try {
            const correctAnswers = testWords.filter(
                (word, index) =>
                    selectedOptions[index] === word.meanings[0].definitions[0].definition
            );

            if (correctAnswers.length === 0) {
                toast.error("No correct answers to move to Vocab Valley.");
                return;
            }

            correctAnswers.forEach((word) => {
                moveWord(word.id);
            });

            queryClient.invalidateQueries("vocab-mountain");
            toast.success(`Word moved successfully to vocab valley`);
            resetTest();
        } catch (error) {
            console.error("Error moving words to Vocab Valley:", error);
            toast.error("Error moving words to Vocab Valley");
        }
    };

    const handleWordsSelection = (word) => {
        setSelectedWords((prev) => {
            if (prev.includes(word.id)) {
                return prev.filter((id) => id !== word.id);
            } else {
                return [...prev, word.id];
            }
        });
    };
    const handleConfirmWordsSelection = () => {
        if (selectedWords.length === 0) {
            toast.error("Please select at least one word.");
            return;
        }
        setTestWords(result.filter((word) => selectedWords.includes(word.id)));
        setWordCount(selectedWords.length);

        setShowSelectWordsModal(false);
    };

    const handleCancelSelection = () => {
        resetTest();
    };

    if (error) return <p>An error has occurred: + {error.message};</p>;

    if (isPending || isQueryLoading) return null;

    return (
        <main className="flex flex-col gap-6 lg:ml-8 ml-2 mr-2 my-10 relative">
            <header className="text-center lg:text-start">
                <h1>Vocab Test</h1>
                <p className="font-subHead opacity-50">
                    test your knowledge of the words you&apos;ve learned
                </p>
            </header>

            <article className="flex flex-col items-center lg:items-start">
                {testStep === 0 && (
                    <VocabTestSettings
                        wordCount={wordCount}
                        setWordCount={setWordCount}
                        maxLength={result?.length}
                        showSelectWordsModal={showSelectWordsModal}
                        setShowSelectWordsModal={setShowSelectWordsModal}
                        handleStartTest={handleStartTest}
                        result={result}
                        selectedWords={selectedWords}
                        handleWordsSelection={handleWordsSelection}
                        handleConfirmWordsSelection={handleConfirmWordsSelection}
                        handleCancelSelection={handleCancelSelection}
                    />
                )}

                {testStep === 1 && (
                    <VocabTestQuiz
                        testWords={testWords}
                        questionOptions={questionOptions}
                        setSelectedOptions={setSelectedOptions}
                        selectedOptions={selectedOptions}
                        setTestStep={setTestStep}
                    />
                )}

                {testStep === 2 && (
                    <VocabTestResults
                        testWords={testWords}
                        selectedOptions={selectedOptions}
                        resetTest={resetTest}
                        handleMoveToVocabValley={handleMoveToVocabValley}
                    />
                )}
            </article>
        </main>
    );
};

VocabTest.propTypes = {
    user: PropTypes.object.isRequired,
};
export default VocabTest;
