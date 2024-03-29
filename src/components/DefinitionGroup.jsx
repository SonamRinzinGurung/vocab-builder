import { useState } from "react";

import PropTypes from "prop-types";

const DefinitionGroup = ({ meaning }) => {
  const [open, setOpen] = useState(false);

  return (
    <article className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="cursor-pointer" onClick={() => setOpen(!open)}>
          {open ? "v" : ">"}
        </div>

        <div className="flex flex-col">
          <div className="cursor-pointer" onClick={() => setOpen(!open)}>
            1. {meaning.definitions[0].definition}
          </div>

          {meaning?.definitions.slice(1).map((definition, i) => {
            return (
              <>
                {open && (
                  <div key={i}>
                    {i + 2}. {definition.definition}
                  </div>
                )}
              </>
            );
          })}
        </div>
      </div>
    </article>
  );
};

DefinitionGroup.propTypes = {
  meaning: PropTypes.shape({
    definitions: PropTypes.arrayOf(
      PropTypes.shape({
        definition: PropTypes.string,
      })
    ),
  }),
};

export default DefinitionGroup;
