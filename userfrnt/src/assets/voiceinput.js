import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../store/searchSlice";
import { performSearch } from "../store/searchOperations";
import { useNavigate } from "react-router";

export default function useVoiceInput() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const recognitionRef = useRef(null);
  const silenceTimerRef = useRef(null);
  const transcriptRef = useRef("");

  const [listening, setListening] = useState(false);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true; // ✅ important
    recognition.continuous = true;

    transcriptRef.current = "";
    recognitionRef.current = recognition;
    setListening(true);
    recognition.start();

    const resetSilenceTimer = () => {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        recognition.stop();
      }, 2000);
    };

    recognition.onstart = () => {
      // start timer ONLY after mic actually listens
      resetSilenceTimer();
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const combined = (finalTranscript || interimTranscript).trim();

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
