import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import PageLayout from '../../components/PageLayout';

describe('PageLayout', () => {
    it('renders children content inside main container', () => {
        render(
            <PageLayout>
                <section>Child content</section>
            </PageLayout>
        );

        expect(screen.getByText('Child content'), 'children should be rendered inside the layout').toBeInTheDocument();
        expect(screen.getByRole('main'), 'layout should produce a <main> landmark element').toBeInTheDocument();
    });

    it('renders heading and subheading when heading is provided', () => {
        render(
            <PageLayout heading="Dashboard" subHeading="Track progress">
                <div>Body</div>
            </PageLayout>
        );

        expect(screen.getByRole('heading', { name: 'Dashboard' }), 'heading prop should render as a heading element').toBeInTheDocument();
        expect(screen.getByText('Track progress'), 'subHeading prop should be rendered').toBeInTheDocument();
        expect(screen.getByText('Body'), 'children should still render alongside the heading').toBeInTheDocument();
    });

    it('does not render heading block when heading is omitted', () => {
        render(
            <PageLayout subHeading="Track progress">
                <div>Body</div>
            </PageLayout>
        );

        expect(screen.queryByText('Track progress'), 'subHeading should not appear without a heading prop').not.toBeInTheDocument();
        expect(screen.getByText('Body'), 'children should still render when heading is omitted').toBeInTheDocument();
    });
});
