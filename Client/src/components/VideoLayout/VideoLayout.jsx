import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import "./VideoLayout.css";
import ReactPlayer from "react-player";

const VideoLayout = () => {
  const { calling } = useAuthStore();
  const [myStream, setMyStream] = useState(null);
  const StartCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    setMyStream(stream);
  };
  useEffect(() => {
    if (calling && !myStream) {
      StartCall();
    }
  }, [calling, myStream]);
  return (
    <div className="videolayout">
      <div className="streams">
        <div className="myStream">
          <h1>My Stream</h1>
          {calling && myStream && (
            <ReactPlayer
              url={myStream}
              height="200px"
              width="300px"
              playing
              muted
            />
          )}
        </div>
        <div className="remoteStream">
          <h1>Remote Stream</h1>
          <ReactPlayer
            // url={myStream}
            height="200px"
            width="300px"
            // playing
            // muted
          />
        </div>
      </div>
    </div>
  );
};

export default VideoLayout;
