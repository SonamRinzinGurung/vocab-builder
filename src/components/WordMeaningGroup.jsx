import { useState } from "react";
import PropTypes from "prop-types";
// import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { convertToRoman } from "../utils/convertToRoman";

const WordMeaningGroup = ({ meaning }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="meaningGroup flex gap-2 ml-2">
      {/* {meaning.definitions[1] && (
        <div className="cursor-pointer mt-1" onClick={() => setOpen(!open)}>
          {open ? (
            <MdKeyboardArrowDown size={22} />
          ) : (
            <MdKeyboardArrowRight size={22} />
          )}
        </div>
      )} */}
      <div className="flex flex-col text-start">
        <div>
          <span className="text-sm font-bold">i.</span>{" "}
          {meaning.definitions[0].definition} {!open && meaning.definitions.length > 1 && <button onClick={() => setOpen(!open)} className="cursor-pointer text-sm bg-slate-300 dark:bg-slate-700 px-1 rounded-sm">see more</button>}
        </div>

        {meaning?.definitions.slice(1).map((definition, i) => {
          return (
            <>
              {open && (
                <div key={i}>
                  <span className="text-sm font-bold">
                    {convertToRoman(i + 2)}.
                  </span>{" "}
                  {definition.definition}
                </div>
              )}
            </>
          );
        })}
        {open && (
          <button className="w-fit cursor-pointer text-sm bg-slate-300 dark:bg-slate-700 px-1 rounded-sm" onClick={() => setOpen(false)}>see less</button>
        )}
      </div>
    </div>
  );
};

WordMeaningGroup.propTypes = {
  meaning: PropTypes.shape({
    definitions: PropTypes.arrayOf(
      PropTypes.shape({
        definition: PropTypes.string,
      })
    ),
  }),
};

export default WordMeaningGroup;
