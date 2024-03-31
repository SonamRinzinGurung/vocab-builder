import { useState } from "react";
import WordMeaningGroup from "./WordMeaningGroup";
import PropTypes from "prop-types";

const DefinitionGroup = ({ vocab }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="flex flex-col">
        <div
          className="font-bold cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {vocab?.word}
        </div>
        {open && <div className="text-sm">{vocab?.phonetic}</div>}
      </div>
      {open && (
        <>
          <div>
            {vocab?.phonetics[0]?.audio && (
              <audio controls src={vocab.phonetics[0].audio} />
            )}
          </div>
          <>
            {vocab?.meanings.map((meaning, index) => {
              return (
                <div key={index}>
                  <div>{meaning.partOfSpeech}</div>

                  <WordMeaningGroup meaning={meaning} />
                </div>
              );
            })}
          </>
        </>
      )}
    </>
  );
};

DefinitionGroup.propTypes = {
  vocab: PropTypes.object.isRequired,
};

export default DefinitionGroup;
