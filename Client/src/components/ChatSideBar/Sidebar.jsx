import { Link, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { FaPhoneAlt } from "react-icons/fa";
import "./Sidebar.css";
import { useAuthStore } from "../../store/useAuthStore";

const Sidebar = () => {
  const { roomId } = useParams();
  const { setCall, setMyStream, socket, onlineUsers, disconnectSocket } =
    useAuthStore();

  const handleCallUser = async (name) => {
    setCall({
      calling: true,
      incall: false,
      calldisconnected: false,
      friendName: name,
    });
  };

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
                name={user.userName}
                size={50}
                round="14px"
                style={{
                  border: "2px solid #fff",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              />
              {socket.id !== user.socketId ? (
                <FaPhoneAlt
                  className="phone-icon"
                  onClick={() => handleCallUser(user.userName)}
                  // onClick={() => startCall}
                />
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
