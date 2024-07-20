import { useState, useRef, useEffect } from "react";
import WordMeaningGroup from "./WordMeaningGroup";
import PropTypes from "prop-types";
import MenuModal from "./MenuModal";
import { BsThreeDots } from "react-icons/bs";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import useAudio from "../hooks/useAudio";
import { CiPlay1, CiPause1 } from "react-icons/ci";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ToolTip from "./ToolTip";
import useWindowSize from "../hooks/useWindowSize";

const DefinitionGroup = ({ vocab, source }) => {
  const [open, setOpen] = useState(false);
  const [modal, setModal] = useState(false);
  const modalRef = useRef(null);
  const ref = useRef(null);
  const optionRef = useRef(null);
  const queryClient = useQueryClient();
  const { playing, playPause, url } = useAudio(vocab?.phonetics);
  const { isMobile } = useWindowSize();

  const { mutate: removeWord } = useMutation({
    mutationFn: async (id) => {
      await deleteDoc(doc(db, "vocab", id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries(source);
      toast.success("Word removed from vocab list.");
    },
    onError: () => {
      toast.error("Error occurred!");
    },
  });

  const { mutate: moveWord } = useMutation({
    mutationFn: async (id) => {
      const docRef = doc(db, "vocab", id);
      await updateDoc(docRef, { group: source === "vocab-mountain" ? "vocab-valley" : "vocab-mountain" })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(source);
      const message = source === "vocab-mountain" ? "vocab valley" : "vocab mountain";
      toast.success(`Word moved successfully to ${message}`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error occurred!");
    }
  })
  useEffect(() => { // listen for clicks on the word to open/close the definition group but not the option icon to open/close the modal
    const refInstance = ref.current;

    function listenExceptModal(event) {
      if (!modalRef?.current.contains(event.target)) {
        setOpen((prev) => !prev);
      }
    }
    refInstance.addEventListener("mousedown", listenExceptModal);

    return () => {
      refInstance.removeEventListener("mousedown", listenExceptModal);
    };
  }, []);

  return (
    <div className="w-full">
      <div
        ref={ref}
        className="flex justify-between items-center cursor-pointer p-2 rounded-lg bg-slate-200 dark:bg-slate-800 pl-4"
      >
        <div className="font-subHead text-xl tracking-wide">{vocab?.word}</div>
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
              className={`z-50 w-40 top-4 ${isMobile ? "right-1" : "left-1"}`}
              modalRef={modalRef}
              setModal={setModal}
            >
              <button onClick={() => moveWord(vocab?.id)} className="rounded-sm hover:text-blue-500 border-gray-200 dark:border-gray-700">
                {source === "vocab-mountain" && "Move to vocab valley"}
                {source === "vocab-valley" && "Move to vocab mountain"}
              </button>
              <hr className="w-10/12 mx-auto" />
              <button
                onClick={() => removeWord(vocab?.id)}
                className="rounded-sm hover:text-red-500 border-gray-200 dark:border-gray-700"
              >
                Delete word
              </button>
            </MenuModal>
          )}
        </div>
      </div>

      {open && (
        <div className="phonetics flex gap-2 items-center p-2">
          <div className="text-sm">{vocab?.phonetic}</div>
          {url && (
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
              <div key={index} className="definition p-2">
                <div className="italic opacity-85">{meaning.partOfSpeech}</div>

                <WordMeaningGroup meaning={meaning} />
              </div>
            );
          })}
        </>
      )}
    </div>
  );
};

DefinitionGroup.propTypes = {
  vocab: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
};

export default DefinitionGroup;
