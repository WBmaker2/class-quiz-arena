import { afterEach, expect } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});

declare module 'vitest' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveTextContent(expected: string | RegExp): void;
  }
}

// Minimal jest-dom compat (jest-dom is not a dependency; only this matcher is needed).
expect.extend({
  toHaveTextContent(received: unknown, expected: string | RegExp) {
    const text = (received as Element | null)?.textContent ?? '';
    const pass = typeof expected === 'string' ? text.includes(expected) : expected.test(text);
    return {
      pass,
      message: () =>
        `expected element text ${JSON.stringify(text)} ${pass ? 'not ' : ''}to contain ${String(expected)}`,
    };
  },
});
