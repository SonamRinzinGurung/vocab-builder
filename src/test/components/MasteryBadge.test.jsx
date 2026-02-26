import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MasteryBadge from '../../components/MasteryBadge';

describe('MasteryBadge', () => {
    it('renders "New" for mastery level 0', () => {
        render(<MasteryBadge mastery={0} />);
        expect(screen.getByText('New'), 'mastery=0 should display the label "New"').toBeInTheDocument();
    });

    it('renders "Learning" for mastery level 1', () => {
        render(<MasteryBadge mastery={1} />);
        expect(screen.getByText('Learning'), 'mastery=1 should display the label "Learning"').toBeInTheDocument();
    });

    it('renders "Familiar" for mastery level 2', () => {
        render(<MasteryBadge mastery={2} />);
        expect(screen.getByText('Familiar'), 'mastery=2 should display the label "Familiar"').toBeInTheDocument();
    });

    it('renders "Mastered" for mastery level 3', () => {
        render(<MasteryBadge mastery={3} />);
        expect(screen.getByText('Mastered'), 'mastery=3 should display the label "Mastered"').toBeInTheDocument();
    });

    it('applies the correct colour classes for each level', () => {
        const { rerender } = render(<MasteryBadge mastery={0} />);
        expect(screen.getByText('New'), 'New badge should use slate colours').toHaveClass('bg-slate-100', 'text-slate-600');

        rerender(<MasteryBadge mastery={1} />);
        expect(screen.getByText('Learning'), 'Learning badge should use green colours').toHaveClass('bg-green-100', 'text-green-700');

        rerender(<MasteryBadge mastery={2} />);
        expect(screen.getByText('Familiar'), 'Familiar badge should use blue colours').toHaveClass('bg-blue-100', 'text-blue-700');

        rerender(<MasteryBadge mastery={3} />);
        expect(screen.getByText('Mastered'), 'Mastered badge should use yellow colours').toHaveClass('bg-yellow-200', 'text-yellow-800');
    });

    it('renders as a span element', () => {
        render(<MasteryBadge mastery={0} />);
        expect(screen.getByText('New').tagName, 'badge should be an inline <span>, not a block element').toBe('SPAN');
    });
});
