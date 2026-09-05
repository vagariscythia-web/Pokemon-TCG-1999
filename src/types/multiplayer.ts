import { Card, GameState, AttackEffectChoices } from './game';

export type MultiplayerRole = 'host' | 'guest';

export type NetworkMessageType =
  | 'HANDSHAKE'
  | 'HANDSHAKE_ACK'
  | 'JOIN_REQUEST'
  | 'JOIN_ACCEPT'
  | 'GAME_START'
  | 'GAME_ACTION'
  | 'CHAT'
  | 'EMOTE'
  | 'SURRENDER'
  | 'DISCONNECT';

export interface ChatMessage {
  id: string;
  sender: 'player1' | 'player2';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface GameActionPayload {
  type: 
    | 'SELECT_STARTING_ACTIVE'
    | 'BENCH_BASIC'
    | 'EVOLVE'
    | 'ATTACH_ENERGY'
    | 'PLAY_TRAINER'
    | 'RETREAT'
    | 'ATTACK'
    | 'PASS_TURN'
    | 'SELECT_BENCH_REPLACEMENT';
  card?: Card;
  handIndex?: number;
  targetIsActive?: boolean;
  benchIndex?: number;
  attackIndex?: number;
  trainerParams?: any;
  coinResults?: boolean[];
  effectChoices?: AttackEffectChoices;
}

export interface NetworkMessage {
  type: NetworkMessageType;
  sender: 'player1' | 'player2';
  timestamp: number;
  payload?: any;
}
