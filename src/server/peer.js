
const { PeerServer } = require('peer');
const peerServer = PeerServer({debug:true, port: 9000, path: '/chat-app' });
console.log(`peer server running on port: ${9000}`);