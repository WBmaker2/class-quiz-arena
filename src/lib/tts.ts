/** 저학년 읽어주기. Web Speech API, 한국어, 조금 천천히. */

export function ttsSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
}

/** 현재 읽기를 멈춘다 (라운드 변경·화면 이동 시 호출). */
export function stopSpeaking(): void {
  if (!ttsSupported()) return;
  window.speechSynthesis.cancel();
}

/** 문제를 읽어준다. 선택지는 4지선다일 때만 함께 읽는다. */
export function speakProblem(text: string, options: string[], kind?: string): void {
  if (!ttsSupported()) return;
  stopSpeaking();
  const lines = [text];
  if ((kind ?? 'choice') === 'choice') {
    options.forEach((opt, i) => {
      lines.push(`${i + 1}번, ${opt}`);
    });
  }
  const utter = new window.SpeechSynthesisUtterance(lines.join('. '));
  utter.lang = 'ko-KR';
  utter.rate = 0.9;
  window.speechSynthesis.speak(utter);
}
