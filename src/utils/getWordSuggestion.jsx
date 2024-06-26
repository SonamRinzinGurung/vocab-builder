import Typo from "typo-js";

const getWordSuggestion = (word, setSuggestedWords) => {
  const dictionary = new Typo("en_US", false, false, {
    dictionaryPath: "/dictionaries",
  });
  const isMistake = !dictionary.check(word);
  if (isMistake) {
    const suggestedWords = dictionary.suggest(word);
    setSuggestedWords(suggestedWords);
  }
};

export default getWordSuggestion;
