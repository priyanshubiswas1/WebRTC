import { useState } from "react";
import "./JoinRoom.css";
import { useNavigate } from "react-router-dom";

const JoinRoom = () => {
  const [roomNo, setRoomNo] = useState("");
  const navigate = useNavigate();
  return (
    <div className="joinRoom">
      <label>Room</label>
      <input
        type="text"
        placeholder="Enter Room Number"
        value={roomNo}
        onChange={(e) => setRoomNo(e.target.value)}
      />
      <button onClick={() => navigate(`/chat/${roomNo}`)}>Connect</button>
    </div>
  );
};

export default JoinRoom;
