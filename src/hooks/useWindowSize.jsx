import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const updatePlaceholder = () => {
      if (window.innerWidth <= 1024) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    window.addEventListener("resize", updatePlaceholder);

    // Call the function once to set the initial placeholder text
    updatePlaceholder();

    // Clean up the event listener when the component is unmounted
    return () => {
      window.removeEventListener("resize", updatePlaceholder);
    };
  }, []);

  return { isMobile };
};

export default useWindowSize;
