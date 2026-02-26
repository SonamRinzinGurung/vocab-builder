import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageHeading from '../../components/PageHeading';

describe('PageHeading', () => {
    it('renders heading and subheading text', () => {
        render(<PageHeading heading="Vocabulary" subHeading="Build your streak" />);

        expect(screen.getByRole('heading', { name: 'Vocabulary' }), 'heading text should appear in a heading element').toBeInTheDocument();
        expect(screen.getByText('Build your streak'), 'subheading text should be rendered').toBeInTheDocument();
    });

    it('does not render subheading when missing', () => {
        render(<PageHeading heading="Vocabulary" />);

        expect(screen.getByRole('heading', { name: 'Vocabulary' }), 'heading should still render without a subheading').toBeInTheDocument();
        expect(screen.queryByText('Build your streak'), 'subheading should not appear when the prop is omitted').not.toBeInTheDocument();
    });

    it('applies provided className to heading element', () => {
        render(<PageHeading heading="Vocabulary" className="text-red-500" />);

        expect(screen.getByRole('heading', { name: 'Vocabulary' }), 'custom className should be forwarded to the heading element').toHaveClass('text-red-500');
    });
});
