"use client";
import { useState, useEffect } from "react";
import Peer from "peerjs";
import { useSocket } from "@/context/socket";
import { useParams } from "next/navigation";

const usePeer = () => {
  const socket = useSocket();
  const [peer, setPeer] = useState(null);

  const { roomId } = useParams();
  const [myId, setMyId] = useState("");

  useEffect(() => {
    if (!roomId || !socket) return;
    const newPeer = new Peer(); // Initialize Peer instance
    setPeer(newPeer);

    newPeer.on("open", (id) => {
      setMyId(id);
      console.log("Peer ID: ", id);
      socket.emit("join-room", roomId, id);
    });

    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, [roomId, socket]);

  return { peer, myId };
};

export default usePeer;
