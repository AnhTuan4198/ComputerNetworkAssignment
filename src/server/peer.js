
const { PeerServer } = require('peer');

const peerServer = PeerServer({debug:true, port: 9000, path: '/chat-app' });