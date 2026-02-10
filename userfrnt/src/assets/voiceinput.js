import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../store/searchSlice";
import { performSearch } from "../store/searchOperations";
import { useNavigate } from "react-router-dom";

export default function useVoiceInput() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef("");

  const [listening, setListening] = useState(false);

  const startListening = () => {
    if (listening) return;

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.lang = "en-IN";
      recognitionRef.current.interimResults = true;
      recognitionRef.current.continuous = true;
    }

    const recognition = recognitionRef.current;

    transcriptRef.current = "";
    setListening(true);
    recognition.start();

    const resetSilenceTimer = () => {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 2000);
    };

    recognition.onstart = () => {
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalText += text;
        } else {
          interim += text;
        }
      }

      const combined = (finalText || interim).trim();

      if (combined) {
        transcriptRef.current = combined;
        dispatch(setSearchQuery(combined));
        resetSilenceTimer();
      }
    };

    recognition.onerror = () => {
      clearTimeout(silenceTimerRef.current);
      setListening(false);
    };

    recognition.onend = () => {
      clearTimeout(silenceTimerRef.current);
      setListening(false);

      if (transcriptRef.current) {
        dispatch(
          performSearch(transcriptRef.current, navigate)
        );
      }
    };
  };

  return { startListening, listening };
}
