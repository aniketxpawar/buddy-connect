"use client";
import { useState, useContext, useEffect, createContext } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const connection = io("http://localhost:3001");
    console.log("Socket connection attempt:", connection);
    setSocket(connection);

    connection.on("connect_error", (err) => {
      console.error("Error establishing socket:", err);
    });

    connection.on("reconnect_attempt", () => {
      console.log("Reconnect attempt");
    });

    return () => {
      console.log("Disconnecting socket");
      connection.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
