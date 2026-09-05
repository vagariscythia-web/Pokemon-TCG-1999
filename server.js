const http = require('http');
const { WebSocketServer } = require('ws');

const PORT = process.env.PORT || 3001;

const server = http.createServer((req, res) => {
  res.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({ status: 'ok', server: 'Pokemon TCG 1999 Relay Server' }));
});

const wss = new WebSocketServer({ server });

// Map: roomCode -> { host: ws, guest: ws, hostDeckId: string, guestDeckId: string, prizeCount: number }
const rooms = new Map();

wss.on('connection', (ws) => {
  let currentRoom = null;
  let currentRole = null;

  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      const { type, roomCode, payload } = msg;

      if (type === 'CREATE_ROOM') {
        currentRoom = (roomCode || '').toUpperCase().trim();
        currentRole = 'host';
        rooms.set(currentRoom, { host: ws, guest: null });
        ws.send(JSON.stringify({ type: 'ROOM_CREATED', roomCode: currentRoom }));
        console.log(`[Lobby] Host created room: ${currentRoom}`);
      } else if (type === 'JOIN_ROOM') {
        currentRoom = (roomCode || '').toUpperCase().trim();
        currentRole = 'guest';
        const room = rooms.get(currentRoom);
        if (!room) {
          ws.send(JSON.stringify({ type: 'ERROR', message: `Room "${currentRoom}" not found. Ensure host is waiting in the room.` }));
          return;
        }
        room.guest = ws;
        console.log(`[Lobby] Guest joined room: ${currentRoom}`);

        // Notify both players immediately
        ws.send(JSON.stringify({ type: 'ROOM_JOINED', roomCode: currentRoom, payload }));
        if (room.host && room.host.readyState === 1) {
          room.host.send(JSON.stringify({ type: 'GUEST_CONNECTED', roomCode: currentRoom, payload }));
        }
      } else if (type === 'RELAY') {
        if (!currentRoom) return;
        const room = rooms.get(currentRoom);
        if (!room) return;

        const target = currentRole === 'host' ? room.guest : room.host;
        if (target && target.readyState === 1) {
          target.send(JSON.stringify(msg.networkMessage));
        }
      }
    } catch (e) {
      console.error('Error handling WebSocket message:', e);
    }
  });

  ws.on('close', () => {
    if (currentRoom) {
      const room = rooms.get(currentRoom);
      if (room) {
        if (currentRole === 'host') {
          if (room.guest && room.guest.readyState === 1) {
            room.guest.send(JSON.stringify({ type: 'HOST_DISCONNECTED' }));
          }
          rooms.delete(currentRoom);
        } else if (currentRole === 'guest') {
          room.guest = null;
          if (room.host && room.host.readyState === 1) {
            room.host.send(JSON.stringify({ type: 'GUEST_DISCONNECTED' }));
          }
        }
      }
    }
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`⚡ Pokemon TCG Relay Server running on port ${PORT}`);
});
