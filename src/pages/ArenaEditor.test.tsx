import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import ArenaEditor from './ArenaEditor';

describe('ArenaEditor', () => {
  it('renders arena fields', () => {
    render(<ArenaEditor initial={{ title: '', desc: '', subject: '수학', aiCount: 0 }} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByLabelText('아레나 이름')).toBeTruthy();
    expect(screen.getByLabelText('설명')).toBeTruthy();
  });

  it('adds a problem', () => {
    const onSave = vi.fn();
    render(<ArenaEditor initial={{ title: '기초', desc: '', subject: '수학', aiCount: 0 }} problems={[]} onSave={onSave} onCancel={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: '새 문제 추가' }));
    fireEvent.change(screen.getByLabelText('문제 내용'), { target: { value: '1 + 1 = ?' } });
    fireEvent.click(screen.getByRole('button', { name: '저장하기' }));
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave.mock.calls[0][1]).toHaveLength(1);
  });

  it('shows empty problems hint', () => {
    render(<ArenaEditor initial={{ title: '기초', desc: '', subject: '수학', aiCount: 0 }} problems={[]} onSave={() => {}} onCancel={() => {}} />);
    expect(screen.getByText('아직 등록된 문제가 없어요')).toBeTruthy();
  });
});
