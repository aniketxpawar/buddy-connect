"use client";
import { useState, useEffect, useRef } from "react";
const useMediaStream = () => {
  const [state, setState] = useState(null);
  const isSetStream = useRef(false);

  useEffect(() => {
    if (isSetStream.current) return;
    (async function initStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        console.log("setting your stream", stream);
        setState(stream);
      } catch (err) {
        console.log("Error in media navigator:", err);
      }
    })();
    isSetStream.current = true;
  }, []);

  return { stream: state };
};

export default useMediaStream;
