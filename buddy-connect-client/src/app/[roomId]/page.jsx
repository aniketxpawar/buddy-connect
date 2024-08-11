"use client";
import { useSocket } from "@/context/socket";
import usePeer from "@/hooks/usePeer";
import useMediaStream from "@/hooks/useMediaStream";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const Player = dynamic(() => import("@/components/Player"), { ssr: false });
import Controls from "@/components/Controls";
import usePlayer from "@/hooks/usePlayer";
import { cloneDeep } from "lodash";

const Room = () => {
  const socket = useSocket();
  const { peer, myId } = usePeer();
  const { stream } = useMediaStream();
  const {
    players,
    setPlayers,
    playerHighlighted,
    nonHighlightedPlayers,
    toggleAudio,
    toggleVideo,
    leaveRoom,
  } = usePlayer(myId);

  const [users, setUsers] = useState({});

  const handleUserConnected = (newUser) => {
    console.log("User Connected:", newUser);

    const call = peer.call(newUser, stream);

    call.on("stream", (incomingStream) => {
      console.log("Incoming Stream from", newUser, incomingStream);
      setPlayers((prev) => ({
        ...prev,
        [newUser]: { url: incomingStream, muted: true, playing: false },
      }));
      setUsers((prev) => ({
        ...prev,
        [newUser]: call,
      }));
    });

    call.on("error", (err) => {
      console.error("Call error: ", err);
    });
  };

  const handleToggleAudio = (peerId) => {
    console.log(peerId);
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[peerId].muted = !copy[peerId].muted;
      return { ...copy };
    });
  };

  const handleToggleVideo = (peerId) => {
    console.log(peerId);
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      copy[peerId].playing = !copy[peerId].playing;
      return { ...copy };
    });
  };

  const handleUserLeave = (peerId) => {
    users[peerId]?.close();
    setPlayers((prev) => {
      const copy = cloneDeep(prev);
      delete copy[peerId];
      return { ...copy };
    });
  };

  useEffect(() => {
    if (!socket || !peer || !stream) return;
    socket.on("user-connected", handleUserConnected);
    socket.on("user-toggle-audio", handleToggleAudio);
    socket.on("user-toggle-video", handleToggleVideo);
    socket.on("user-leave", handleUserLeave);

    return () => {
      socket.off("user-connected", handleUserConnected);
      socket.off("user-toggle-audio", handleToggleAudio);
      socket.off("user-toggle-video", handleToggleVideo);
      socket.off("user-leave", handleUserLeave);
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
          [callerId]: { url: incomingStream, muted: true, playing: false },
        }));
        setUsers((prev) => ({
          ...prev,
          [callerId]: call,
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
      [myId]: { url: stream, muted: true, playing: false },
    }));
  }, [myId, setPlayers, stream]);

  return (
    <>
      <div
        className="absolute w-9/12 left-0 right-0 mx-auto flex justify-center"
        style={{
          top: "40px",
          bottom: "50px",
          height: "calc(100vh - 20px - 100px)",
        }}
      >
        {playerHighlighted && (
          <Player
            url={playerHighlighted.url}
            muted={playerHighlighted.muted}
            playing={playerHighlighted.playing}
            isActive={true}
          />
        )}
      </div>
      <div
        className="absolute flex flex-col overflow-y-auto"
        style={{
          width: "200px",
          height: "calc(100vh - 20px)",
          right: "20px",
          top: "20px",
        }}
      >
        {Object.keys(nonHighlightedPlayers).map((playerId) => {
          const { url, muted, playing } = nonHighlightedPlayers[playerId];
          return (
            <Player
              key={playerId}
              url={url}
              muted={muted}
              playing={playing}
              isActive={false}
            />
          );
        })}
      </div>
      <Controls
        muted={playerHighlighted?.muted}
        playing={playerHighlighted?.playing}
        toggleAudio={toggleAudio}
        toggleVideo={toggleVideo}
        leaveRoom={leaveRoom}
      />
    </>
  );
};

export default Room;
