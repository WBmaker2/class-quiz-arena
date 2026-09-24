import { afterEach, describe, expect, it, vi } from 'vitest';
import { speakProblem, stopSpeaking, ttsSupported } from './tts';

describe('tts', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('reports unsupported without speechSynthesis', () => {
    vi.stubGlobal('window', {});
    expect(ttsSupported()).toBe(false);
    expect(() => stopSpeaking()).not.toThrow();
    expect(() => speakProblem('Q', [])).not.toThrow();
  });

  it('reads problem text with numbered options in Korean', () => {
    const speak = vi.fn();
    const cancel = vi.fn();
    vi.stubGlobal(
      'window',
      (() => {
        function Utterance(this: { text?: string }, text: string) {
          this.text = text;
        }
        return {
          speechSynthesis: { speak, cancel },
          SpeechSynthesisUtterance: Utterance,
        };
      })(),
    );
    expect(ttsSupported()).toBe(true);
    speakProblem('23 더하기 45는?', ['67', '68'], 'choice');
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(speak).toHaveBeenCalledTimes(1);
    const utter = speak.mock.calls[0][0] as { text: string; lang: string; rate: number };
    expect(utter.lang).toBe('ko-KR');
    expect(utter.rate).toBe(0.9);
    expect(utter.text).toContain('23 더하기 45는?');
    expect(utter.text).toContain('1번, 67');
  });

  it('skips options for short answers', () => {
    const speak = vi.fn();
    vi.stubGlobal(
      'window',
      (() => {
        function Utterance(this: { text?: string }, text: string) {
          this.text = text;
        }
        return { speechSynthesis: { speak, cancel: vi.fn() }, SpeechSynthesisUtterance: Utterance };
      })(),
    );
    speakProblem('왕 이름은?', [], 'short');
    const utter = speak.mock.calls[0][0] as { text: string };
    expect(utter.text).not.toContain('1번');
  });
});
