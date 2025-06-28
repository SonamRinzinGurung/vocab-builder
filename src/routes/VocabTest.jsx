import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSetTitle from "../hooks/useSetTitle";
import { collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { shuffleArray } from "../utils/shuffleArray";
import { toast } from "react-toastify";

const VocabTest = ({ user }) => {
    useSetTitle("Vocab Test");
    const [result, setResult] = useState(null); // stores all the search results or the fetched data
    const [testStep, setTestStep] = useState(0); // tracks the current step in the test
    const [wordCount, setWordCount] = useState(10); // tracks the number of words in the test
    const [testWords, setTestWords] = useState([]); // stores the words selected for the test
    const [questionOptions, setQuestionOptions] = useState([]); // stores the options for each question in the test
    const [selectedOptions, setSelectedOptions] = useState({}); // stores the user's selected options for each question

    const queryClient = useQueryClient();

    // Function to reset the test states
    const resetTest = () => {
        setTestStep(0);
        setWordCount(10);
        setTestWords([]);
        setQuestionOptions([]);
        setSelectedOptions({});
    }

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
        const options = allWords.filter(word => word.id !== currentWord.id)

        const shuffledOptions = shuffleArray(options)

        const shuffledLimitedOptions = shuffledOptions.slice(0, 3).map(word => word.meanings[0].definitions[0].definition);

        shuffledLimitedOptions.push(currentWord.meanings[0].definitions[0].definition);
        return shuffleArray(shuffledLimitedOptions);
    }

    const handleStartTest = () => {

        resetTest();

        setTestStep(1);

        const shuffledWords = shuffleArray(result);
        const limitedWords = shuffledWords?.slice(0, wordCount) || []
        setTestWords(limitedWords);

        // Generate options for each word and store them
        const optionsArr = limitedWords?.map(word => generateOptions(word, result));
        setQuestionOptions(optionsArr);
        // console.log(optionsArr)

    };

    // Mutation to move the word to Vocab Valley
    const { mutate: moveWord } = useMutation({
        mutationFn: async (id) => {
            const docRef = doc(db, "vocab", id);
            await updateDoc(docRef, {
                group: "vocab-valley",
            });
        },
        onSuccess: () => {
        },
        onError: (error) => {
            console.log(error);
            toast.error("Error occurred!");
        },
    });

    const handleMoveToVocabValley = () => {
        try {
            const correctAnswers = testWords.filter((word, index) => selectedOptions[index] === word.meanings[0].definitions[0].definition);

            console.log(correctAnswers);

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
    }

    if (error) return "An error has occurred: " + error.message;
    if (isPending || isQueryLoading) return null;

    return (
        <main className="flex flex-col gap-6 lg:ml-8 my-10">
            <header className="text-center lg:text-start">
                <h1>Vocab Test</h1>
                <p className="font-subHead opacity-50">
                    test your knowledge of the words you&apos;ve learned
                </p>
            </header>
            <article className="flex flex-col gap-4 items-center lg:items-start">
                {testStep === 0 && (
                    <div className="flex flex-col gap-2">
                        <h4>Setup your desired test settings</h4>

                        <label className="flex flex-col gap-1">
                            <span>Number of questions</span>
                            <input
                                type="number"
                                value={wordCount}
                                onChange={(e) => setWordCount(e.target.value)}
                                min={1}
                                max={result?.length || 10}
                                className="border border-gray-300 rounded p-2"
                            />
                        </label>
                        <button onClick={handleStartTest}>take test</button>
                    </div>
                )}
                {testStep === 1 && (
                    <div className="flex flex-col gap-2">
                        <h4>Test your knowledge</h4>
                        {testWords.map((word, index) => (
                            <div key={index} className="border p-4 rounded">
                                <p>
                                    <strong>Word:</strong> {word.word}
                                </p>
                                <p>
                                    <strong>Options:</strong>
                                    <ul className="list-disc pl-5">
                                        {questionOptions[index]?.map((option, idx) => (
                                            <li key={idx} className="cursor-pointer hover:bg-gray-300 p-1 rounded flex items-center gap-2">
                                                <input
                                                    type="radio"
                                                    name={`question-${index}`}
                                                    value={option}
                                                    checked={selectedOptions[index] === option}
                                                    onChange={() =>
                                                        setSelectedOptions((prev) => ({
                                                            ...prev,
                                                            [index]: option,
                                                        }))
                                                    }
                                                />
                                                <span>{option}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </p>
                            </div>
                        ))}

                        <button onClick={() => setTestStep(2)}>Finish Test</button>
                    </div>
                )}

                {
                    testStep === 2 && (
                        <div className="flex flex-col gap-2">
                            <h4>Test Results</h4>
                            {testWords.map((word, index) => (
                                <div key={index} className="border p-4 rounded">
                                    <p>
                                        <strong>Word:</strong> {word.word}
                                    </p>
                                    <p>
                                        <strong>Your Answer:</strong> {selectedOptions[index] || "Not answered"}
                                    </p>
                                    <p>
                                        <strong>Correct Answer:</strong> {word.meanings[0].definitions[0].definition}
                                    </p>
                                </div>
                            ))}
                            <p>
                                <strong>Total Questions:</strong> {testWords.length}
                            </p>
                            <p>
                                <strong>Correct Answers:</strong> {testWords.filter((word, index) => selectedOptions[index] === word.meanings[0].definitions[0].definition).length}
                            </p>
                            <p>
                                <strong>Score:</strong> {Math.round((testWords.filter((word, index) => selectedOptions[index] === word.meanings[0].definitions[0].definition).length / testWords.length) * 100)}%
                            </p>

                            <button onClick={resetTest}>Retake Test</button>
                            <button onClick={handleMoveToVocabValley}>Move correct answer to Vocab Valley</button>
                        </div>
                    )
                }
            </article>
        </main>
    );
};

VocabTest.propTypes = {
    user: PropTypes.object.isRequired,
};
export default VocabTest;
