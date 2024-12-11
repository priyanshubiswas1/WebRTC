const PeerConnection = (myStream, setRemoteStream) => {
    let peerConnection;

    const createPeerConnection = () => {

        const config = {
            iceServers: [
                {
                    urls: [
                        "stun:stun.l.google.com:19302",
                        "stun:global.stun.twilio.com:3478"
                    ]
                }
            ]
        };
        peerConnection = new RTCPeerConnection(config);

        //add local streams to peer connection
        if (myStream) {
            for (const track of myStream.getTracks()) {
                peerConnection.addTrack(track, myStream);
            }
        }

        //listen to remote streams and add to peer connection
        peerConnection.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        }

        //listen for ice candidate
        peerConnection.onicecandidate = (event) => {
            if (event.candidate) {

            }
        }

        return peerConnection;
    }
    return {
        getInstance: () => {
            if (!peerConnection) {
                peerConnection = createPeerConnection();
            }
            return peerConnection;
        }
    }
};

export default PeerConnection;
