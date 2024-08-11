"use client";
import { useState, useEffect, useRef } from "react";
import Peer from "peerjs";
import { useSocket } from "@/context/socket";
import { useParams } from "next/navigation";

const usePeer = () => {
  const socket = useSocket();
  const [peer, setPeer] = useState(null);
  const isPeerSet = useRef(false);

  const { roomId } = useParams();
  const [myId, setMyId] = useState("");

  useEffect(() => {
    if (isPeerSet.current || !roomId || !socket) return;
    const newPeer = new Peer(); // Initialize Peer instance
    setPeer(newPeer);

    newPeer.on("open", (id) => {
      setMyId(id);
      console.log("Peer ID: ", id);
      socket.emit("join-room", roomId, id);
    });
    isPeerSet.current = true;
    return () => {
      if (newPeer) {
        newPeer.destroy();
      }
    };
  }, [roomId, socket]);

  return { peer, myId };
};

export default usePeer;
