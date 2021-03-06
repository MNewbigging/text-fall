import { LetterPlaybackGroupInit } from '../state/AudioState';
import { Letter } from '../utils/LetterObjectFactory';

export enum GameEventType {
  ANY = 'any',
  AUDIO_LOADED = 'audio-loaded',
  VALID_LETTER = 'valid-letter',
  COMPLETE_LETTER_OBJ = 'complete-letter-obj',
  LETTER_OBJ_EXIT = 'letter-obj-exit',
}

export type GameEvent =
  | { type: GameEventType.AUDIO_LOADED }
  | { type: GameEventType.COMPLETE_LETTER_OBJ; letterPlaybackGroupInit: LetterPlaybackGroupInit }
  | { type: GameEventType.VALID_LETTER; letter: Letter }
  | { type: GameEventType.LETTER_OBJ_EXIT; id: string };

type GameEventListener = (event: GameEvent) => void;

class GameObserver {
  private listenerMap = new Map<GameEventType, GameEventListener[]>();

  public addGameEventListener(listener: GameEventListener, eventType = GameEventType.ANY) {
    const existing = this.listenerMap.get(eventType) ?? [];
    existing.push(listener);
    this.listenerMap.set(eventType, existing);
  }

  public removeGameEventListener(listener: GameEventListener, eventType = GameEventType.ANY) {
    let existing = this.listenerMap.get(eventType) ?? [];
    if (existing.length) {
      existing = existing.filter((l) => l !== listener);
      this.listenerMap.set(eventType, existing);
    }
  }

  public fireEvent(event: GameEvent) {
    const listeners = this.listenerMap.get(event.type) ?? [];
    listeners.forEach((l) => l(event));
  }
}

export const gameObserver = new GameObserver();
