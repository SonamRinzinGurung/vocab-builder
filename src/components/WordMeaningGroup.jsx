import { useState } from "react";
import PropTypes from "prop-types";
import { MdKeyboardArrowDown, MdKeyboardArrowRight } from "react-icons/md";
import { convertToRoman } from "../utils/convertToRoman";

const WordMeaningGroup = ({ meaning }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="meaningGroup flex gap-2">
      {meaning.definitions[1] && (
        <div className="cursor-pointer mt-1" onClick={() => setOpen(!open)}>
          {open ? (
            <MdKeyboardArrowDown size={22} />
          ) : (
            <MdKeyboardArrowRight size={22} />
          )}
        </div>
      )}
      <div className="flex flex-col">
        <div className="cursor-pointer" onClick={() => setOpen(!open)}>
          <span className="text-sm opacity-85">i.</span>{" "}
          {meaning.definitions[0].definition}
        </div>

        {meaning?.definitions.slice(1).map((definition, i) => {
          return (
            <>
              {open && (
                <div key={i}>
                  <span className="text-sm opacity-85">
                    {convertToRoman(i + 2)}.
                  </span>{" "}
                  {definition.definition}
                </div>
              )}
            </>
          );
        })}
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
