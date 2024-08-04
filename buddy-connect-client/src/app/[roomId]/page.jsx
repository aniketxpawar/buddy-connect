"use client";
import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import dynamic from "next/dynamic";
import { useEffect } from "react";
const Player = dynamic(() => import("@/components/Player"), { ssr: false });
import usePlayer from "@/hooks/usePlayer";

const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const { players, setPlayers } = usePlayer();

  const handleUserConnected = (newUser) => {
    console.log("User Connected:", newUser);

    const call = peer.call(newUser, stream);

    call.on("stream", (incomingStream) => {
      console.log("Incoming Stream from", newUser, incomingStream);
      setPlayers((prev) => ({
        ...prev,
        [newUser]: { url: incomingStream, muted: false, playing: true },
      }));
    });

    call.on("error", (err) => {
      console.error("Call error: ", err);
    });
  };

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    socket.on("user-connected", handleUserConnected);

    return () => {
      socket.off("user-connected", handleUserConnected);
    };
  }, [peer, socket, stream]);

  useEffect(() => {
    if (!peer || !stream) return;
    peer.on("call", (call) => {
      const { peer: callerId } = call;
      call.answer(stream);

      call.on("stream", (incomingStream) => {
        console.log("Incoming Stream from", callerId, incomingStream);
        setPlayers((prev) => ({
          ...prev,
          [callerId]: { url: incomingStream, muted: false, playing: true },
        }));
      });

      call.on("error", (err) => {
        console.error("Call error: ", err);
      });
    });
  }, [peer, stream]);

  useEffect(() => {
    if (!stream || !myId) return;
    setPlayers((prev) => ({
      ...prev,
      [myId]: { url: stream, muted: false, playing: true },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <div>
      {Object.keys(players)?.map((playerId) => {
        const { url, muted, playing } = players[playerId];
        return (
          <Player
            playerId={playerId}
            url={url}
            muted={muted}
            playing={playing}
          />
        );
      })}
    </div>
  );
};

export default Room;
