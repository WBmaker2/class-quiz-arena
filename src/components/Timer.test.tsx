import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Timer from './Timer';

describe('Timer', () => {
  it('shows remaining seconds', () => {
    render(<Timer endsAt={30000} nowMs={10000} />);
    expect(screen.getByLabelText('남은 시간')).toHaveTextContent('20초');
  });

  it('resyncs when nowMs changes', () => {
    const { rerender } = render(<Timer endsAt={30000} nowMs={10000} />);
    rerender(<Timer endsAt={30000} nowMs={25000} />);
    expect(screen.getByLabelText('남은 시간')).toHaveTextContent('5초');
  });
});
