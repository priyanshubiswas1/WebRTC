import { useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import PeerConnection from "../../services/peerService.js";
import "./VideoLayout.css";

const VideoLayout = () => {
  const {
    calling,
    setCall,
    setMyStream,
    myStream,
    setRemoteStream,
    name,
    friendName,
    socket,
  } = useAuthStore();

  const startCall = async () => {
    try {
      console.log("CALLING");
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      setMyStream(stream);

      // Create peer connection
      const pc = PeerConnection.getInstance();
      stream.getTracks().forEach((track) => pc.addTrack(track, stream)); // Add local tracks to peer connection

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            candidate: event.candidate,
            to: friendName,
          });
        }
      };

      // Create and send offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      console.log("Emitting offer:", {
        from: socket.id,
        to: friendName,
        offer,
      });
      // socket.emit("offer", { from: socket.id, to: friendName, offer });
      socket.emit("offer", { from: name, to: friendName, offer });

      // Handle remote stream
      pc.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };
    } catch (error) {
      console.error("Error starting call:", error);
    }
  };

  useEffect(() => {
    if (calling && !myStream) {
      startCall();
    }
  }, [calling]);

  useEffect(() => {
    socket.on("offer", async ({ from, offer }) => {
      console.log("Received offer:", { from, offer });
      const pc = PeerConnection.getInstance();
      await pc.setRemoteDescription(offer);

      // Create and send answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      console.log("Emitting answer:", {
        from: name,
        to: from,
        answer: pc.localDescription,
      });

      socket.emit("answer", {
        from: name,
        to: from,
        answer: pc.localDescription,
      });

      // setCall({
      //   calling: true,
      //   incall: true,
      //   calldisconnected: false,
      //   friendName: from,
      // });

      // Handle ICE candidates for this connection
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("iceCandidate", {
            candidate: event.candidate,
            to: from,
          });
        }
      };
    });

    socket.on("answer", async ({ from, answer }) => {
      console.log("Received answer:", { from, answer });
      const pc = PeerConnection.getInstance();
      await pc.setRemoteDescription(answer);

      setCall({
        calling: true,
        incall: true,
        calldisconnected: false,
        friendName: from,
      });
    });

    socket.on("iceCandidate", async ({ from, candidate }) => {
      const pc = PeerConnection.getInstance();
      if (candidate) {
        await pc.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    // Clean up socket listeners when the component unmounts
    return () => {
      socket.off("offer");
      socket.off("answer");
      socket.off("iceCandidate");
    };
  }, [socket, setCall]);

  return (
    <div className="videolayout">
      {socket.id}
      <div className="streams">
        <div className="myStream">
          <h1>My Stream</h1>
          {myStream && (
            <video
              ref={(ref) => ref && (ref.srcObject = myStream)}
              height="200px"
              width="300px"
              autoPlay
              muted
            />
          )}
        </div>
        <div className="remoteStream">
          <h1>Remote Stream</h1>
          {myStream && (
            <video
              ref={(ref) => ref && (ref.srcObject = myStream)}
              height="200px"
              width="300px"
              autoPlay
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoLayout;
