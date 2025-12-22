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
import MenuItem from "./MenuItem";
import MobileMenuModal from "./MobileMenuModal";
import { RiFileTransferLine } from "react-icons/ri";
import { MdDeleteOutline } from "react-icons/md";
import MasteryBadge from "./MasteryBadge";

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
      await updateDoc(docRef, {
        group: source === "vocab-mountain" ? "vocab-valley" : "vocab-mountain",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(source);
      const message =
        source === "vocab-mountain" ? "vocab valley" : "vocab mountain";
      toast.success(`Word moved successfully to ${message}`);
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error occurred!");
    },
  });
  useEffect(() => {
  // listen for clicks on the word to open/close the definition group but not the option icon to open/close the modal
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
        <div className="flex flex-col gap-1 font-subHead text-xl tracking-wide">{vocab?.word} <MasteryBadge mastery={vocab.mastery} /></div>
        <div
          ref={modalRef}
          className="relative"
          onClick={() => setModal((prev) => !prev)}
        >
          <div className="p-1 rounded-md cursor-pointer ml-1" ref={optionRef}>
            <BsThreeDots />
            <ToolTip position={"right"} text="options" contentRef={optionRef} />
          </div>
          {modal && !isMobile && (
            <MenuModal
              className={`z-50 top-4 ${isMobile ? "right-1" : "left-1"
                } w-52`}
              modalRef={modalRef}
              setModal={setModal}
            >
              <MenuItem
                handleClick={() => moveWord(vocab?.id)}
                content={
                  <div className="flex items-center gap-2">
                    <RiFileTransferLine />
                    {source === "vocab-mountain" && "Move to Valley"}
                    {source === "vocab-valley" && "Move to Mountain"}
                  </div>
                }
              />

              <MenuItem
                handleClick={() => removeWord(vocab?.id)}
                content={
                  <div className="flex items-center gap-2">
                    <MdDeleteOutline />
                    Delete word
                  </div>
                }
              />
            </MenuModal>
          )}
          {isMobile && (
            <MobileMenuModal
              isOpen={modal}
              setIsOpen={setModal}
              content={
                <div className="flex flex-col gap-8">
                  <div className="flex w-full items-center justify-between">
                    <div className="text-xl font-medium">Options</div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <MenuItem
                      handleClick={() => moveWord(vocab?.id)}
                      content={
                        <div className="flex items-center gap-2">
                          <RiFileTransferLine />
                          {source === "vocab-mountain" && "Move to Valley"}
                          {source === "vocab-valley" && "Move to Mountain"}
                        </div>
                      }
                    />

                    <MenuItem
                      handleClick={() => removeWord(vocab?.id)}
                      content={
                        <div className="flex items-center gap-2">
                          <MdDeleteOutline />
                          Delete word
                        </div>
                      }
                    />
                  </div>
                </div>
              }
            />
          )}
        </div>
      </div>

      {open && (
        <div className="definition px-2 py-4">
          {
            (vocab?.phonetic || url) && (
              <div className="phonetics flex gap-2 items-center">
          <div className="text-sm">{vocab?.phonetic}</div>
          {url && (
            <button onClick={playPause}>
              {playing ? <CiPause1 /> : <CiPlay1 />}
            </button>
          )}
              </div>
            )}
        <>
          {vocab?.meanings.map((meaning, index) => {
            return (
              <div key={index} className="meaning">
                <div className="italic font-bold opacity-95">{meaning.partOfSpeech}</div>
                <WordMeaningGroup meaning={meaning} />
              </div>
            );
          })}
        </>
        </div>
      )}
    </div>
  );
};

DefinitionGroup.propTypes = {
  vocab: PropTypes.object.isRequired,
  source: PropTypes.string.isRequired,
};

export default DefinitionGroup;
