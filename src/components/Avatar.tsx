export type Animal =
  | 'cat'
  | 'dog'
  | 'tiger'
  | 'frog'
  | 'unicorn'
  | 'dragon'
  | 'turtle'
  | 'rabbit'
  | 'chick'
  | 'panda'
  | 'hamster'
  | 'fox'
  | 'penguin'
  | 'owl'
  | 'dino';

const EMOJI: Record<Animal, string> = {
  cat: '🐱',
  dog: '🐶',
  tiger: '🐯',
  frog: '🐸',
  unicorn: '🦄',
  dragon: '🐲',
  turtle: '🐢',
  rabbit: '🐰',
  chick: '🐤',
  panda: '🐼',
  hamster: '🐹',
  fox: '🦊',
  penguin: '🐧',
  owl: '🦉',
  dino: '🦕',
};

export default function Avatar({ animal, size = 56 }: { animal: Animal; size?: number }) {
  return (
    <span
      role="img"
      aria-label={animal}
      style={{
        display: 'inline-grid',
        placeItems: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        background: '#E4E9F7',
        border: '2px solid #26211A',
        fontSize: size * 0.55,
      }}
    >
      {EMOJI[animal]}
    </span>
  );
}
