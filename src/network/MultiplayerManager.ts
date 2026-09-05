import Peer, { DataConnection } from 'peerjs';
import { NetworkMessage, MultiplayerRole, GameActionPayload } from '../types/multiplayer';

export class MultiplayerManager {
  private peer: Peer | null = null;
  private conn: DataConnection | null = null;
  private ws: WebSocket | null = null;
  private broadcastChannel: BroadcastChannel | null = null;

  public role: MultiplayerRole = 'guest';
  public roomCode: string = '';
  public isConnected: boolean = false;

  private messageListeners: Set<(msg: NetworkMessage) => void> = new Set();
  private connectListeners: Set<() => void> = new Set();
  private disconnectListeners: Set<() => void> = new Set();
  private errorListeners: Set<(err: string) => void> = new Set();

  private processedMessageIds: Set<string> = new Set();
  private outgoingQueue: NetworkMessage[] = [];

  public onMessage(callback: (msg: NetworkMessage) => void) {
    this.messageListeners.add(callback);
    return () => {
      this.messageListeners.delete(callback);
    };
  }

  public onConnect(callback: () => void) {
    this.connectListeners.add(callback);
    return () => {
      this.connectListeners.delete(callback);
    };
  }

  public onDisconnect(callback: () => void) {
    this.disconnectListeners.add(callback);
    return () => {
      this.disconnectListeners.delete(callback);
    };
  }

  public onError(callback: (err: string) => void) {
    this.errorListeners.add(callback);
    return () => {
      this.errorListeners.delete(callback);
    };
  }

  private emitMessage(msg: NetworkMessage) {
    if (!msg || !msg.type) return;
    const msgId = msg.payload?._msgId || `${msg.timestamp}_${msg.type}_${msg.sender}`;
    if (this.processedMessageIds.has(msgId)) return;
    this.processedMessageIds.add(msgId);

    if (this.processedMessageIds.size > 300) {
      const idsToRemove = Array.from(this.processedMessageIds).slice(0, 100);
      idsToRemove.forEach(id => this.processedMessageIds.delete(id));
    }

    this.messageListeners.forEach(cb => {
      try {
        cb(msg);
      } catch (e) {
        console.error('Error in message listener:', e);
      }
    });
  }

  private markConnected() {
    if (this.isConnected) return;
    this.isConnected = true;
    console.log('[Multiplayer] Connected with peer!');
    this.connectListeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in connect listener:', e);
      }
    });
    this.flushOutgoingQueue();
  }

  private emitDisconnect() {
    if (!this.isConnected) return;
    this.isConnected = false;
    this.disconnectListeners.forEach(cb => {
      try {
        cb();
      } catch (e) {
        console.error('Error in disconnect listener:', e);
      }
    });
  }

  private emitError(err: string) {
    this.errorListeners.forEach(cb => {
      try {
        cb(err);
      } catch (e) {
        console.error('Error in error listener:', e);
      }
    });
  }

  private flushOutgoingQueue() {
    while (this.outgoingQueue.length > 0) {
      const msg = this.outgoingQueue.shift()!;
      this.deliverMessage(msg);
    }
  }

  private deliverMessage(msg: NetworkMessage) {
    let sent = false;

    // 1. PeerJS WebRTC Direct DataConnection
    if (this.conn && this.conn.open) {
      try {
        this.conn.send(msg);
        sent = true;
      } catch (e) {
        console.warn('Failed to send via PeerJS:', e);
      }
    }

    // 2. WebSocket Relay Server
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      try {
        this.ws.send(JSON.stringify({
          type: 'RELAY',
          networkMessage: msg
        }));
        sent = true;
      } catch (e) {
        console.warn('Failed to send via WS:', e);
      }
    }

    // 3. BroadcastChannel (Same Device Multi-Tab fallback)
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.postMessage(msg);
        sent = true;
      } catch (e) {}
    }

    if (!sent) {
      this.outgoingQueue.push(msg);
    }
  }

  private getWebSocketUrl(): string {
    const envWs = (import.meta as any).env?.VITE_WS_URL;
    if (envWs) return envWs;
    const host = window.location.hostname || 'localhost';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${host}:3001`;
  }

  private getPeerId(roomCode: string): string {
    return 'pkmn1999-' + roomCode.toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  /**
   * Create a room as Host
   */
  createRoom(customCode?: string): Promise<string> {
    return new Promise((resolve) => {
      this.disconnect();
      this.role = 'host';
      const code = (customCode || this.generateRoomCode()).toUpperCase().trim();
      this.roomCode = code;
      const peerId = this.getPeerId(code);

      // 1. Local BroadcastChannel
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          this.broadcastChannel = new BroadcastChannel('PKMN_ROOM_' + code);
          this.broadcastChannel.onmessage = (event) => {
            const msg = event.data as NetworkMessage;
            if (msg && msg.sender === 'player2') {
              this.markConnected();
              this.emitMessage(msg);
            }
          };
        }
      } catch (e) {}

      // 2. PeerJS WebRTC Serverless P2P Host
      try {
        this.peer = new Peer(peerId, {
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', (id) => {
          console.log('[PeerJS] Host registered with peer ID:', id);
        });

        this.peer.on('connection', (connection) => {
          console.log('[PeerJS] Guest connected to Host!');
          this.conn = connection;

          connection.on('open', () => {
            this.markConnected();
            this.sendMessage('HANDSHAKE', { ready: true });
          });

          connection.on('data', (data) => {
            this.markConnected();
            this.emitMessage(data as NetworkMessage);
          });

          connection.on('close', () => {
            console.log('[PeerJS] Guest connection closed');
            this.emitDisconnect();
          });
        });

        this.peer.on('error', (err) => {
          console.warn('[PeerJS] Host error:', err);
        });
      } catch (e) {
        console.warn('PeerJS init failed on host:', e);
      }

      // 3. WebSocket Relay Server Backup
      try {
        const wsUrl = this.getWebSocketUrl();
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[WS] Host registered room on relay server:', code);
          this.ws!.send(JSON.stringify({
            type: 'CREATE_ROOM',
            roomCode: code
          }));
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'GUEST_CONNECTED') {
              this.markConnected();
              this.emitMessage({
                type: 'JOIN_REQUEST',
                sender: 'player2',
                timestamp: Date.now(),
                payload: data.payload
              });
            } else if (data.type === 'GUEST_DISCONNECTED') {
              this.emitDisconnect();
            } else if (data.type && data.type !== 'ROOM_CREATED') {
              this.markConnected();
              this.emitMessage(data);
            }
          } catch (e) {}
        };
      } catch (e) {}

      resolve(code);
    });
  }

  /**
   * Join a room as Guest
   */
  joinRoom(roomCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.disconnect();
      this.role = 'guest';
      const code = roomCode.toUpperCase().trim();
      this.roomCode = code;
      const targetPeerId = this.getPeerId(code);

      let connectionEstablished = false;

      const confirmConnected = () => {
        if (!connectionEstablished) {
          connectionEstablished = true;
          this.markConnected();
          resolve();
        }
      };

      // 1. Local BroadcastChannel
      try {
        if (typeof BroadcastChannel !== 'undefined') {
          this.broadcastChannel = new BroadcastChannel('PKMN_ROOM_' + code);
          this.broadcastChannel.onmessage = (event) => {
            const msg = event.data as NetworkMessage;
            if (msg && msg.sender === 'player1') {
              confirmConnected();
              this.emitMessage(msg);
            }
          };
          this.broadcastChannel.postMessage({
            type: 'HANDSHAKE',
            sender: 'player2',
            timestamp: Date.now(),
            payload: { ready: true }
          });
        }
      } catch (e) {}

      // 2. PeerJS WebRTC Direct Connect to Host
      try {
        this.peer = new Peer({
          debug: 1,
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:global.stun.twilio.com:3478' }
            ]
          }
        });

        this.peer.on('open', () => {
          console.log('[PeerJS] Guest connecting to target host ID:', targetPeerId);
          this.conn = this.peer!.connect(targetPeerId, {
            reliable: true
          });

          this.conn.on('open', () => {
            console.log('[PeerJS] Guest DataConnection established!');
            confirmConnected();
            this.sendMessage('HANDSHAKE', { ready: true });
          });

          this.conn.on('data', (data) => {
            confirmConnected();
            this.emitMessage(data as NetworkMessage);
          });

          this.conn.on('close', () => {
            console.log('[PeerJS] Host disconnected');
            this.emitDisconnect();
          });
        });

        this.peer.on('error', (err) => {
          console.warn('[PeerJS] Guest error:', err);
        });
      } catch (e) {
        console.warn('PeerJS init failed on guest:', e);
      }

      // 3. WebSocket Relay Server Backup
      try {
        const wsUrl = this.getWebSocketUrl();
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('[WS] Guest connecting to room on relay server:', code);
          this.ws!.send(JSON.stringify({
            type: 'JOIN_ROOM',
            roomCode: code
          }));
        };

        this.ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'ROOM_JOINED') {
              confirmConnected();
            } else if (data.type === 'ERROR') {
              this.emitError(data.message || 'Room not found');
              if (!connectionEstablished) reject(new Error(data.message));
            } else if (data.type === 'HOST_DISCONNECTED') {
              this.emitDisconnect();
            } else if (data.type) {
              confirmConnected();
              this.emitMessage(data);
            }
          } catch (e) {}
        };
      } catch (e) {}

      // Connection timeout watchdog
      setTimeout(() => {
        if (connectionEstablished || this.isConnected) {
          resolve();
        } else {
          confirmConnected();
        }
      }, 3500);
    });
  }

  /**
   * Send network message across all active channels
   */
  sendMessage(type: NetworkMessage['type'], payload: any = {}) {
    const msgId = Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const fullPayload = { ...payload, _msgId: msgId };

    const msg: NetworkMessage = {
      type,
      sender: this.role === 'host' ? 'player1' : 'player2',
      timestamp: Date.now(),
      payload: fullPayload
    };

    this.deliverMessage(msg);
  }

  sendAction(action: GameActionPayload) {
    this.sendMessage('GAME_ACTION', action);
  }

  sendEmote(emote: string) {
    this.sendMessage('EMOTE', { emote });
  }

  sendChat(text: string, senderName: string) {
    this.sendMessage('CHAT', {
      id: Math.random().toString(36).substring(2, 9),
      senderName,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
  }

  disconnect() {
    this.outgoingQueue = [];
    if (this.conn) {
      try {
        this.conn.close();
      } catch (e) {}
      this.conn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
    if (this.broadcastChannel) {
      try {
        this.broadcastChannel.close();
      } catch (e) {}
      this.broadcastChannel = null;
    }
    if (this.ws) {
      try {
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    this.isConnected = false;
  }

  private generateRoomCode(): string {
    const prefixes = ['PIKA', 'CHAR', 'BLAST', 'MEW', 'RAI', 'NINE', 'GENG', 'SNOR', 'EEVEE', 'ZAP'];
    const p = prefixes[Math.floor(Math.random() * prefixes.length)];
    const n = Math.floor(10 + Math.random() * 90);
    return `${p}-${n}`;
  }
}

export const net = new MultiplayerManager();
