import { useLeopard } from "@picovoice/leopard-react";
import { useEffect, useState } from "react";

const useSpeechToText = () => {
  const {
    result,
    isLoaded,
    error,
    init,
    startRecording,
    stopRecording,
    isRecording,
  } = useLeopard();

  const [transcript, setTranscript] = useState("");
  const [isBusy, setIsBusy] = useState(false)

  const initEngine = async () => {
    setIsBusy(true)
    await init(
      `${import.meta.env.VITE_API_LEOPARD_ACCESS_KEY}`,
      { publicPath: `${import.meta.env.VITE_API_LEOPARD_PUBLIC_PATH}` },
      { enableAutomaticPunctuation: false }
    );
    setIsBusy(false)
  };

  const toggleRecord = async () => {
    if (isRecording) {
      await stopRecording();
    } else {
      await startRecording();
    }
  };

  useEffect(() => {
    setTranscript(result?.transcript);
  }, [result]);

  return {
    initEngine,
    isLoaded,
    toggleRecord,
    isRecording,
    result,
    error,
    transcript,
    isBusy
  };
};

export default useSpeechToText;
