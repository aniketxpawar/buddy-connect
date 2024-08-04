"use client";
import { useSocket } from "@/context/socket";
import Image from "next/image";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

export default function Home() {
  const socket: Socket | null = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("connect", () => {
        console.log("Socket Connected ID:", socket.id);
      });

      return () => {
        socket.off("connect");
      };
    }
  }, [socket]);
  return <p>Hello</p>;
}
