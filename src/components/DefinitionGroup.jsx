import { useState, useRef } from "react";
import WordMeaningGroup from "./WordMeaningGroup";
import PropTypes from "prop-types";
import MenuModal from "./MenuModal";
import { BsThreeDots } from "react-icons/bs";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import useAudio from "../hooks/useAudio";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ToolTip from "./ToolTip";

const DefinitionGroup = ({ vocab }) => {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);
  const optionRef = useRef(null);
  const queryClient = useQueryClient();
  const { playing, playPause } = useAudio(vocab?.phonetics);

  const { mutate: removeWord } = useMutation({
    mutationFn: async (id) => {
      await deleteDoc(doc(db, "vocab", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries("vocab-mountain");
      toast.success("Word removed from vocab mountain.");
    },
    onError: () => {
      toast.error("Error occurred!");
    },
  });

  return (
    <>
      <div className="w-1/2 md:w-1/6 flex justify-between items-center">
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
          <div className="p-1 rounded-md cursor-pointer ml-1" ref={optionRef}>
            <BsThreeDots />
            <ToolTip position={"right"} text="options" contentRef={optionRef} />
          </div>
          {modal && (
            <MenuModal
              className={"z-50 w-24 lg:w-40 top-6"}
              modalRef={modalRef}
              setModal={setModal}
            >
              <button
                onClick={() => removeWord(vocab?.id)}
                className="rounded-sm hover:text-red-500"
              >
                Remove
              </button>
            </MenuModal>
          )}
        </div>
      </div>
      {open && (
        <div className="flex gap-2 items-center">
          <div className="text-sm">{vocab?.phonetic}</div>
          {vocab?.phonetics && (
            <button onClick={playPause}>
              {playing ? <CiPause1 /> : <CiPlay1 />}
            </button>
          )}
        </div>
      )}
      {open && (
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
      )}
    </>
  );
};

DefinitionGroup.propTypes = {
  vocab: PropTypes.object.isRequired,
};

export default DefinitionGroup;
