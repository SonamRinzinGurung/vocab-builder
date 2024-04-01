import { useState, useRef, useEffect } from "react";
import WordMeaningGroup from "./WordMeaningGroup";
import PropTypes from "prop-types";
import MenuModal from "./MenuModal";
import { BsThreeDots } from "react-icons/bs";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";

const DefinitionGroup = ({ vocab }) => {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);

  const removeWord = async (id) => {
    try {
      await deleteDoc(doc(db, "vocab", id));
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    function listenClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setModal(false);
      }
    }
    document.addEventListener("mousedown", listenClickOutside);

    return () => {
      document.removeEventListener("mousedown", listenClickOutside);
    };
  }, [setModal]);

  return (
    <>
      <div className="w-1/4 flex justify-between items-center">
        <div
          className="font-bold cursor-pointer"
          onClick={() => setOpen(!open)}
        >
          {vocab?.word}
        </div>
        <div
          ref={modalRef}
          className="relative"
          onClick={() => setModal((prev) => !prev)}
        >
          <div className="border p-2 rounded-md cursor-pointer ml-1">
            <BsThreeDots />
          </div>
          {modal && <MenuModal vocabId={vocab.id} handleRemove={removeWord} />}
        </div>
      </div>
      {open && <div className="text-sm">{vocab?.phonetic}</div>}
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
