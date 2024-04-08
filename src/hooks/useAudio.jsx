import { useState, useEffect } from "react";

const useAudio = (urls) => {
  const url = urls?.find((p) => p.audio);
  const [audio] = useState(new Audio(url?.audio));
  const [playing, setPlaying] = useState(false);

  const playPause = () => {
    if (url) {
      if (playing) {
        // Pause the song if it is playing
        audio.pause();
      } else {
        // Play the song if it is paused

        audio.play();
      }
    }

    // Change the state of song
    setPlaying(!playing);
  };
  useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));
    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, [audio]);

  useEffect(() => {
    audio.src = url?.audio;
  }, [url]);

  return { playing, playPause };
};

export default useAudio;
