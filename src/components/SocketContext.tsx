import { createContext, useContext, useEffect, useState } from "react";
import SocketIOClient, { Socket } from "socket.io-client";

const SocketContext = createContext<Socket>({} as Socket);
const SocketUpdateContext = createContext<Socket>({} as Socket);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const useUpdateSocket = () => {
  return useContext(SocketUpdateContext);
};

interface SocketProviderProps {
  name: String;
  colour: String;
  children: React.ReactNode;
}

const SocketProvider: React.FC<SocketProviderProps> = ({
  name,
  colour,
  children,
}) => {
  const [socket, setSocket] = useState<Socket>({} as Socket);

  useEffect(() => {
    console.log("Context Mounted");
    fetch("/api/socket");
    const newSocket = SocketIOClient(window.location.origin, {
      query: { name, colour },
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
      console.log("Context Dismounted");
    };
  }, [name, colour]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
