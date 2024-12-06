import { Link, useParams } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const { roomId } = useParams();
  return (
    <div className="sidebar">
      <h2 className="room-number">Room Id: {roomId}</h2>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
    </div>
  );
};

export default Sidebar;
