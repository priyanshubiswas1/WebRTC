import { useState } from "react";
import "./JoinRoom.css";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

const JoinRoom = () => {
  const { socket, connectSocket, disconnectSocket } = useAuthStore();
  const [roomNo, setRoomNo] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleConnect = () => {
    connectSocket({ roomNo, name });
    navigate(`/chat/${roomNo}`);
  };

  return (
    <div className="joinRoom">
      <label>Name</label>
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>Room</label>
      <input
        type="text"
        placeholder="Enter Room Number"
        value={roomNo}
        onChange={(e) => setRoomNo(e.target.value)}
      />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
};

export default JoinRoom;
