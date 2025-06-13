import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useSetTitle from "../hooks/useSetTitle";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase-config";
import { useQuery } from "@tanstack/react-query";
import { shuffleArray } from "../utils/shuffleArray";

const VocabTest = ({ user }) => {
    useSetTitle("Vocab Test");
    const [result, setResult] = useState(null); // stores all the search results or the fetched data

    const [testStep, setTestStep] = useState(0); // tracks the current step in the test

    const [wordCount, setWordCount] = useState(10); // tracks the number of words in the test

    const [testWords, setTestWords] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState([]);
    const [isTestComplete, setIsTestComplete] = useState(false);
    const [questionOptions, setQuestionOptions] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState({});

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
        setTestStep(1);

        const shuffledWords = shuffleArray(result);
        const limitedWords = shuffledWords?.slice(0, wordCount) || []
        setTestWords(limitedWords);

        // Generate options for each word and store them
        const optionsArr = limitedWords?.map(word => generateOptions(word, result));
        setQuestionOptions(optionsArr);
        console.log(optionsArr)

        setCurrentIndex(0);
        setUserAnswers([]);
        setIsTestComplete(false);
        setSelectedOptions({});

    };

    // const handleAnswer = (selectedMeaning)=>{
    //     const currentWord = testWords[currentIndex];
    //     const correct = currentWord.meaning === selectedMeaning;
    // }

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

                            <button onClick={() => setTestStep(0)}>Retake Test</button>
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
