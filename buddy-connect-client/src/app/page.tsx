"use client";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");

  const createAndJoin = () => {
    const roomId = uuidv4();
    router.push(`/${roomId}`);
  };

  const joinRoom = () => {
    if (roomId) router.push(`/${roomId}`);
    else alert("Enter a valid Room ID");
  };

  return (
    <div className="min-w-full bg-slate-900 flex flex-col items-center justify-center gap-8 my-20">
      <h1 className="text-red-500 font-bold text-4xl">Buddy Connect</h1>
      <div className="bg-white rounded-md flex flex-col items-center justify-center w-[30%] min-w-[460px] gap-4 py-4">
        <div className="flex flex-col items-center justify-center gap-4">
          <input
            type="text"
            className="border border-blue-600 rounded-sm min-w-[200px] py-1 px-2"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button
            className="text-white bg-blue-600 p-1 rounded-md"
            onClick={joinRoom}
          >
            Join Room
          </button>
        </div>
        <span className="font-bold text-xl">
          ------------------OR------------------
        </span>
        <button
          className="bg-pink-600 p-1 rounded-md text-white"
          onClick={createAndJoin}
        >
          Create new room
        </button>
      </div>
    </div>
  );
}
