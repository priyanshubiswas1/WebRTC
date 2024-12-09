import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { FaPhoneAlt } from "react-icons/fa";
import "./Sidebar.css";
import { useAuthStore } from "../../store/useAuthStore";

const Sidebar = () => {
  const { roomId } = useParams();
  const { socket, onlineUsers, disconnectSocket } = useAuthStore();

  return (
    <div className="sidebar">
      <div className="avatar-wrap">
        {onlineUsers &&
          onlineUsers.map((user) => (
            <div
              key={user.socketId}
              className={`avatar-container ${
                socket.id !== user.socketId ? "online" : "you"
              }`}
            >
              <Avatar
                name={user.socketId}
                size={50}
                round="14px"
                style={{
                  border: "2px solid #fff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              {socket.id !== user.socketId ? (
                <FaPhoneAlt className="phone-icon" />
              ) : (
                "You"
              )}
            </div>
          ))}
      </div>
      <h2 className="room-number">Room Id: {roomId}</h2>
      <Link to="/" className="back-button" onClick={() => disconnectSocket()}>
        Back to Home
      </Link>
    </div>
  );
};

export default Sidebar;
