// PeerConnection.js
class PeerConnection {
    constructor() {
        if (PeerConnection.instance) {
            return PeerConnection.instance;
        }

        this.peerConnection = null;
        PeerConnection.instance = this;
    }

    createPeerConnection() {
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

        this.peerConnection = new RTCPeerConnection(config);
        return this.peerConnection;
    }

    getInstance() {
        if (!this.peerConnection) {
            this.createPeerConnection();
        }
        return this.peerConnection;
    }
}

const peerConnectionInstance = new PeerConnection();
export default peerConnectionInstance;
