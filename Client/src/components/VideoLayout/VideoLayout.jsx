import "./VideoLayout.css";
import ReactPlayer from "react-player";

const VideoLayout = () => {
  return (
    <div className="videolayout">
      <div className="streams">
        <div className="myStream">
          <h1>My Stream</h1>
          <ReactPlayer height="200px" width="300px" />
        </div>
        <div className="remoteStream">
          <h1>Remote Stream</h1>
          <ReactPlayer height="200px" width="300px" />
        </div>
      </div>
    </div>
  );
};

export default VideoLayout;
