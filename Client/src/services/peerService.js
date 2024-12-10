const PeerConnection = (function () {
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
        //listen to remote streams and add to peer connection
        //listen for ice candidate
    }
    return {
        getInstance: () => {
            if (!peerConnection) {
                peerConnection = createPeerConnection();
            }
            return peerConnection;
        }
    }
})
