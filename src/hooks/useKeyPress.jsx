import { useCallback, useEffect, useRef, useLayoutEffect } from "react";

const useKeyPress = (key, callback) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const handleKeyPress = useCallback(
    (event) => {
      if (event.key === key) {
        callbackRef.current(event);
      }
    },
    [key]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);
};

export default useKeyPress;
