import { describe, expect, it } from 'vitest';
import { buildArenaCopy } from './useArenaAdmin';

describe('buildArenaCopy', () => {
  it('builds a locked-copy input preserving content', () => {
    const { input, problems } = buildArenaCopy(
      {
        id: 'src1',
        title: '덧셈',
        desc: '설명',
        subject: '수학',
        grade: 3,
        topic: '받아올림',
        standards: ['3수01-01'],
      },
      [
        { text: 'Q1', kind: 'ox', options: ['O', 'X', '', ''], answerIndex: 0, answerText: '', standardCode: '3수01-01' },
        { text: 'Q2', kind: 'short', options: ['', '', '', ''], answerIndex: 0, answerText: '답', standardCode: '' },
      ],
    );
    expect(input.title).toBe('덧셈 (복사)');
    expect(input.grade).toBe(3);
    expect(input.standards).toEqual(['3수01-01']);
    expect(input.status).toBe('published');
    expect(input.questionCount).toBe(2);
    expect(problems).toHaveLength(2);
    expect(problems[0].kind).toBe('ox');
    expect(problems[1].answerText).toBe('답');
  });
});
