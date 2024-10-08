import { useState } from "react";
import { cloneDeep } from "lodash";
import { useSocket } from "@/context/socket";
import { useParams, useRouter } from "next/navigation";
import usePeer from "./usePeer";

const usePlayer = (myId) => {
  const socket = useSocket();
  const { roomId } = useParams();
  const router = useRouter();
  const { peer } = usePeer();
  const [players, setPlayers] = useState({});
  const playersCopy = cloneDeep(players);

  const playerHighlighted = playersCopy[myId];
  delete playersCopy[myId];

  const nonHighlightedPlayers = playersCopy;

  const leaveRoom = () => {
    socket.emit("user-leave", myId, roomId);
    peer?.disconnect();
    router.push("/");
  };

  const toggleAudio = () => {
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].muted = !copy[myId].muted;
      return { ...copy };
    });

    socket.emit("user-toggle-audio", myId, roomId);
  };

  const toggleVideo = () => {
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[myId].playing = !copy[myId].playing;
      return { ...copy };
    });

    socket.emit("user-toggle-video", myId, roomId);
  };

  return {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  };
};

export default usePlayer;
